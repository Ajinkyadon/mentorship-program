# 07 — Deployment & Production Knowledge

> Knowing how to build is 60% of the job. Knowing how to ship it is the other 40%.

---

## Why Deployment Knowledge Matters for Interviews

When an interviewer asks "Have you deployed your projects?", the expected answer isn't "Yes, I used Vercel." It's:

> "Yes, the frontend is on Vercel connected to my GitHub repo with automatic deployments on merge to main. The backend runs on Railway with a MongoDB Atlas cluster. I set up environment variables for production and use GitHub Actions for CI — it runs linting and tests before allowing a merge."

That answer signals you've worked like a professional, not a student.

---

## The Production Stack

```
┌─────────────────────────────────────────────────────────────┐
│                   PRODUCTION DEPLOYMENT                      │
│                                                              │
│  Developer Machine                                           │
│    └── git push → GitHub                                    │
│                       │                                      │
│                       ▼                                      │
│              GitHub Actions (CI/CD)                          │
│               ├── Run tests                                  │
│               ├── Build Docker image                         │
│               └── Deploy on success                          │
│                       │                                      │
│         ┌─────────────┴──────────────┐                      │
│         ▼                            ▼                       │
│    Vercel (frontend)           AWS EC2 / Railway             │
│    Next.js / React             Node.js + Express             │
│         │                            │                       │
│         │                            ▼                       │
│         │                       Nginx (port 80/443)          │
│         │                       PM2 (process manager)        │
│         │                            │                       │
│         │                            ▼                       │
│         └──────────────► MongoDB Atlas / PostgreSQL          │
│                                                              │
│    Monitoring: UptimeRobot + Winston Logs                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Section 1: Linux Basics

Every backend developer must be comfortable in a Linux terminal. You'll use these commands when SSH-ing into a production server.

### Essential Commands

```bash
# Navigation
pwd                    # Print working directory
ls -la                 # List all files with permissions
cd /var/www/app        # Change directory
mkdir -p /opt/myapp    # Create directory (and parents)

# File operations
cat file.txt           # View file content
nano file.txt          # Simple text editor
cp source dest         # Copy file
mv source dest         # Move/rename file
rm -rf directory/      # Remove directory recursively (careful!)
find . -name "*.log"   # Find files by name

# Permissions
chmod 755 script.sh    # Set file permissions (owner: rwx, others: r-x)
chown ubuntu:ubuntu    # Change file owner
sudo command           # Run as superuser

# Process management
ps aux                 # List all processes
kill -9 <PID>          # Force kill a process
top                    # Real-time process monitor
htop                   # Better version of top (install separately)

# Networking
curl https://api.example.com  # Make HTTP request from terminal
wget https://file.com/file    # Download a file
netstat -tulpn                # Show listening ports
ss -tulpn                     # Modern version of netstat
ufw allow 3000                # Allow traffic on port 3000 (Ubuntu firewall)

# System info
df -h                  # Disk usage
free -h                # Memory usage
uname -a               # OS information
```

### SSH Into a Server

```bash
# Connect to a remote server
ssh ubuntu@your-server-ip
ssh -i ~/.ssh/key.pem ubuntu@your-server-ip  # With a key file

# First time setup on a new server:
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm git nginx
```

---

## Section 2: Environment Variables

**The Golden Rule:** Never hardcode secrets. Never commit .env files to Git.

### .env File Structure

```bash
# .env.example (commit this — it shows what variables are needed)
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
EMAIL_USER=
EMAIL_PASS=
```

### .gitignore

```
# Always add this to your .gitignore
.env
.env.local
.env.production
node_modules/
```

### Loading in Node.js

```javascript
// At the top of your entry file (index.js / app.js)
require('dotenv').config();

// Then use anywhere:
process.env.MONGODB_URI
process.env.JWT_SECRET
```

### Setting Variables in Production

```bash
# On Railway/Render: set via dashboard UI
# On Vercel: Project Settings → Environment Variables

# On Linux server (temporary):
export NODE_ENV=production

# On Linux server (permanent in systemd):
Environment="NODE_ENV=production"
Environment="PORT=3000"
```

---

## Section 3: PM2 — Process Manager

PM2 keeps your Node.js app running even after server restarts or crashes.

### Setup

```bash
# Install globally
npm install -g pm2

# Start your app
pm2 start index.js --name "my-api"

# Start with ecosystem file (recommended)
pm2 start ecosystem.config.js
```

### ecosystem.config.js

```javascript
module.exports = {
  apps: [{
    name: 'my-api',
    script: './src/index.js',
    instances: 'max',          // Use all CPU cores
    exec_mode: 'cluster',      // Cluster mode for load balancing
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### PM2 Commands

```bash
pm2 start ecosystem.config.js --env production
pm2 list                    # Show all apps
pm2 logs my-api             # View logs
pm2 restart my-api          # Restart app
pm2 stop my-api             # Stop app
pm2 delete my-api           # Remove from PM2
pm2 save                    # Save config to run on startup
pm2 startup                 # Generate startup script
```

---

## Section 4: Nginx Basics

Nginx sits in front of your Node.js app as a reverse proxy. It handles:
- Routing traffic to the right service
- SSL/HTTPS termination
- Serving static files
- Load balancing

### Install & Basic Setup

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx   # Start on boot
```

### Basic Reverse Proxy Config

```nginx
# /etc/nginx/sites-available/myapp
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Proxy API requests to Node.js
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve static files directly (faster than Node.js)
    location / {
        root /var/www/myapp/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Enable the config
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t                  # Test config for errors
sudo systemctl reload nginx    # Apply changes
```

### SSL with Let's Encrypt (Free HTTPS)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
# Auto-renews every 90 days
```

---

## Section 5: Docker Basics

Docker packages your app and its dependencies into a container that runs identically everywhere.

### Why Docker

```
"It works on my machine" problem:
  - Different Node.js versions
  - Different OS dependencies
  - Different environment variables

Docker solution:
  - Same container runs in dev, staging, and production
  - No "works on my machine" surprises
```

### Dockerfile for a Node.js App

```dockerfile
# Use official Node.js 20 LTS image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Don't run as root
USER node

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "src/index.js"]
```

### .dockerignore

```
node_modules
.env
.git
*.log
dist
```

### Docker Commands

```bash
# Build image
docker build -t my-api:latest .

# Run container
docker run -p 3000:3000 --env-file .env my-api:latest

# View running containers
docker ps

# Stop container
docker stop <container_id>

# View logs
docker logs <container_id> -f
```

### docker-compose.yml (Local Development)

```yaml
version: '3.8'

services:
  api:
    build: ./server
    ports:
      - "3000:3000"
    env_file: ./server/.env
    depends_on:
      - mongodb
    volumes:
      - ./server:/app
      - /app/node_modules

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  client:
    build: ./client
    ports:
      - "3001:3000"
    volumes:
      - ./client:/app
      - /app/node_modules

volumes:
  mongo-data:
```

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down
```

---

## Section 6: Vercel Deployment (Frontend)

Vercel is the easiest way to deploy Next.js and React apps.

### Steps

```
1. Push your code to GitHub

2. Go to vercel.com → New Project

3. Import your GitHub repository

4. Configure:
   - Framework: Next.js (auto-detected)
   - Build command: npm run build
   - Output directory: .next (auto for Next.js)

5. Add Environment Variables:
   - NEXT_PUBLIC_API_URL = https://your-backend.railway.app

6. Click Deploy
   → Automatic deploys on every push to main branch
   → Preview URLs for pull requests
```

### Vercel CLI for Manual Deploys

```bash
npm install -g vercel
vercel login
vercel           # Deploy to preview
vercel --prod    # Deploy to production
```

---

## Section 7: CI/CD with GitHub Actions

Automate your testing and deployment pipeline.

### Basic CI Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run tests
        run: npm test
```

### CD Workflow (Auto Deploy to Railway)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    needs: test   # Only deploy if tests pass

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: my-api
```

---

## Section 8: AWS Basics

You don't need to be an AWS expert at the 10–15 LPA level. You need to understand the concepts and be able to deploy a basic app.

### Key AWS Services to Know

```
EC2 (Elastic Compute Cloud):
  - A virtual machine in the cloud
  - You SSH into it and run your Node.js app
  - Like renting a Linux server

S3 (Simple Storage Service):
  - Object storage (files, images, videos, backups)
  - Static website hosting
  - Store user-uploaded files instead of server disk

IAM (Identity and Access Management):
  - Users, roles, and permissions in AWS
  - Never use root credentials in your app
  - Create IAM users with specific permissions

RDS (Relational Database Service):
  - Managed PostgreSQL/MySQL
  - Automatic backups, patching, scaling
  - More expensive than MongoDB Atlas but simpler to manage

CloudFront:
  - CDN (Content Delivery Network)
  - Serve static files from edge locations worldwide
  - Reduces latency for global users
```

### Deploying to EC2 (Step by Step)

```bash
# 1. Launch EC2 instance on AWS Console
#    - AMI: Ubuntu 22.04 LTS
#    - Instance type: t2.micro (free tier)
#    - Security group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 3000

# 2. SSH into the instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# 3. Setup server
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# 4. Clone and run your app
git clone https://github.com/yourname/your-api.git
cd your-api
npm install
npm install -g pm2

# 5. Configure environment
nano .env    # Add your environment variables

# 6. Start app with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# 7. Configure Nginx as reverse proxy (see Section 4)

# 8. Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

### AWS Free Tier

AWS offers free tier for 12 months:
- EC2: t2.micro (1 vCPU, 1GB RAM) — 750 hours/month
- S3: 5GB storage
- RDS: db.t2.micro — 750 hours/month

Resources:
- AWS Free Tier: https://aws.amazon.com/free/
- AWS Skill Builder (free courses): https://skillbuilder.aws/

---

## Section 9: Logging & Monitoring

### Application Logging with Winston

```javascript
// logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

```javascript
// Usage in routes
const logger = require('./logger');

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    logger.info('Users fetched', { count: users.length, userId: req.user.id });
    res.json(users);
  } catch (error) {
    logger.error('Failed to fetch users', { error, userId: req.user.id });
    res.status(500).json({ message: 'Server error' });
  }
});
```

### Uptime Monitoring

```
UptimeRobot (free tier):
  - Monitors your app every 5 minutes
  - Sends email/SMS when your app goes down
  - Free for up to 50 monitors
  - URL: https://uptimerobot.com/
```

### Production Debugging Checklist

```
When something breaks in production:

1. Check application logs:
   pm2 logs my-api
   cat logs/error.log | tail -100

2. Check system resources:
   top (CPU usage)
   free -h (memory)
   df -h (disk space)

3. Check if the process is running:
   pm2 list
   pm2 status

4. Check Nginx logs:
   sudo tail -f /var/log/nginx/error.log

5. Check if the port is in use:
   ss -tulpn | grep 3000

6. Reproduce locally with production environment:
   NODE_ENV=production node src/index.js
```

---

## Deployment Checklist Before Going Live

```
Security:
  ☐ All secrets in environment variables (no hardcoded values)
  ☐ .env never committed to Git
  ☐ HTTPS enabled (SSL certificate)
  ☐ CORS configured to allow only your frontend domain
  ☐ Rate limiting enabled on API
  ☐ Helmet.js security headers

Performance:
  ☐ Database indexes on frequently queried fields
  ☐ Images compressed and served via CDN
  ☐ Static assets cached

Reliability:
  ☐ PM2 running with cluster mode
  ☐ PM2 startup script configured
  ☐ Uptime monitoring set up
  ☐ Error logging configured
  ☐ Database backups enabled (MongoDB Atlas does this automatically)

Documentation:
  ☐ README with setup instructions updated
  ☐ Live URL in README and GitHub
  ☐ Environment variable template (.env.example)
```

---

> *Next: Mentorship Approach & Outcomes → [08-mentorship-approach.md](./08-mentorship-approach.md)*
