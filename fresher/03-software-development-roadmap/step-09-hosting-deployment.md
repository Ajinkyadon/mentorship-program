# Step 09: Hosting & Deployment
### "Code banana enough nahi — duniya ko dikhana bhi zaruri hai"

---

## What is Deployment?

```
Local: Code sirf tumhare machine pe chal raha hai
Deployed: Code internet pe available hai — koi bhi access kar sakta hai

localhost:3000 → Only you
https://myapp.render.com → Everyone
```

**Why deploy early:**
- Real environment mein test hota hai
- Portfolio ke liye live URL chahiye
- Sharing easy hoti hai
- Resume pe "deployed on Render" > "works on my machine"

---

## Development → Staging → Production

```
Development (Local)
  → tumhara laptop
  → .env.development
  → Debug logs on
  → Mock data okay
  → Crash okay (learning)

Staging
  → Production jaisi environment
  → Same config as production
  → QA testing yahan
  → Client/manager preview yahan

Production
  → Live — real users
  → .env.production
  → Debug logs off
  → Real data
  → Zero tolerance for downtime
  → Monitor karo
```

---

## Free Hosting Options for Freshers

| Platform | Best For | Free Tier | Notes |
|----------|----------|-----------|-------|
| **Render** | Node.js backends | Yes | Cold start (spins down after 15 min idle) |
| **Vercel** | Frontend + Next.js | Yes | Excellent DX |
| **Netlify** | Frontend + static | Yes | Easy drag-drop deploy |
| **Railway** | Backend + DB | $5 credit/month | Better than Render for always-on |
| **Fly.io** | Containers | Limited free | More control |
| **MongoDB Atlas** | MongoDB cloud DB | 512MB free | Paired with Render |
| **Supabase** | PostgreSQL + Auth | Yes | Firebase alternative |
| **GitHub Pages** | Static sites | Yes | Only static HTML/CSS/JS |

---

## Deployment: Node.js Backend on Render

### Step 1: Prepare Your App

```json
// package.json — start script must exist
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```

```js
// src/index.js — PORT must come from env
const port = process.env.PORT || 3000;  // Render sets PORT automatically
app.listen(port, () => console.log(`Server on port ${port}`));
```

**Pre-deployment checklist:**
```
✅ .gitignore has node_modules/ and .env
✅ package.json has "start" script
✅ PORT from process.env.PORT
✅ All env vars documented in .env.example
✅ No hardcoded localhost URLs
✅ MongoDB Atlas (not local MongoDB)
✅ Code pushed to GitHub
```

### Step 2: MongoDB Atlas Setup

```
1. atlas.mongodb.com → Sign up free
2. Create cluster (M0 = free)
3. Database Access → Add user (username + password)
4. Network Access → Add IP → "Allow from everywhere" (0.0.0.0/0)
5. Connect → Connect your application → Copy connection string

mongodb+srv://username:password@cluster.mongodb.net/mydb?retryWrites=true&w=majority
```

### Step 3: Deploy on Render

```
1. render.com → Sign up → New → Web Service
2. Connect GitHub → Select repo
3. Configure:
   - Name: my-app-api
   - Runtime: Node
   - Build Command: npm install
   - Start Command: npm start
   - Instance Type: Free

4. Environment Variables:
   Key: MONGODB_URI     Value: mongodb+srv://...
   Key: JWT_SECRET      Value: [random 256-bit string]
   Key: NODE_ENV        Value: production
   Key: ALLOWED_ORIGIN  Value: https://myapp.netlify.app

5. Deploy → Wait 2-3 minutes → Live!
```

**Your backend URL:** `https://my-app-api.onrender.com`

---

## Deployment: Frontend on Netlify/Vercel

### Netlify
```
1. netlify.com → Sign up
2. New Site → Import from GitHub → Select repo
3. Build settings:
   - Build command: npm run build (or leave empty for static)
   - Publish directory: dist/ or build/ or . (for static HTML)
4. Environment variables add karo if needed
5. Deploy site

Custom domain: Site settings → Domain management → Add custom domain
```

### Vercel (Especially Good for React/Next.js)
```
1. vercel.com → Sign up with GitHub
2. New Project → Import repo
3. Framework preset auto-detect karta hai
4. Environment variables add karo
5. Deploy!

CLI se:
npm install -g vercel
vercel login
vercel        # Deploy
vercel --prod # Production deploy
```

---

## Environment Variables in Production

**Never put secrets in code — always use platform env vars.**

```bash
# Render mein: Settings → Environment tab
# Vercel mein: Project Settings → Environment Variables
# Netlify mein: Site Settings → Build & Deploy → Environment

Required for production:
MONGODB_URI        = mongodb+srv://...
JWT_SECRET         = [256-bit random string generator se]
JWT_EXPIRES_IN     = 7d
NODE_ENV           = production
ALLOWED_ORIGIN     = https://myapp.netlify.app
EMAIL_HOST         = smtp.gmail.com
EMAIL_USER         = myapp@gmail.com
EMAIL_PASS         = [Gmail App Password]
```

**Generating a strong JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Docker Basics

**Docker = Apni application ko ek portable container mein pack karo.**

```
Problem:
"Works on my machine" → Production pe crash

Docker Solution:
Application + OS + Dependencies + Config → Container
Same container har jagah same behave karta hai
```

### Dockerfile
```dockerfile
# Base image
FROM node:18-alpine

# Working directory
WORKDIR /app

# Dependencies pehle copy karo (caching optimization)
COPY package*.json ./
RUN npm ci --only=production

# Source code copy karo
COPY src/ ./src/

# Port expose karo
EXPOSE 3000

# Environment
ENV NODE_ENV=production

# Run karo
CMD ["node", "src/index.js"]
```

### docker-compose.yml (Local Development)
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongo:27017/myapp
      - JWT_SECRET=dev_secret_key
    volumes:
      - ./src:/app/src         # Hot reload ke liye
    depends_on:
      - mongo
    command: npm run dev

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db    # Data persist karo

volumes:
  mongo_data:
```

```bash
# Start karo
docker-compose up

# Background mein start
docker-compose up -d

# Logs dekho
docker-compose logs -f app

# Stop karo
docker-compose down

# Stop + data delete
docker-compose down -v
```

---

## CI/CD — Continuous Integration / Continuous Deployment

**CI/CD = Automatically test + deploy on every code push.**

```
Code push → GitHub
    ↓
GitHub Actions trigger hota hai
    ↓
1. Install dependencies (npm ci)
2. Run linter (npm run lint)
3. Run tests (npm test)
4. Build check (npm run build)
    ↓
All pass? → Deploy to staging/production
    ↓
Fail? → Notify developer (email/Slack)
```

### Complete CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js 18
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test -- --coverage
        env:
          NODE_ENV: test
          MONGODB_URI: mongodb://localhost:27017/test
          JWT_SECRET: test_jwt_secret

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  deploy:
    name: Deploy
    needs: test          # Test pass hone ke baad hi deploy
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'  # Only on main branch

    steps:
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## Custom Domain Setup

```
1. Domain kharido: Namecheap, GoDaddy, Google Domains (~₹700-1500/year for .in)

2. DNS settings:
   Netlify/Vercel dono ke liye CNAME record add karo:
   Type: CNAME
   Name: www
   Value: your-site.netlify.app (ya vercel.app)

   Root domain ke liye:
   Type: A
   Name: @
   Value: [Platform ka IP — unke docs se milega]

3. Platform pe:
   Add custom domain → Enter your domain
   SSL certificate automatically generate ho jaata hai (Let's Encrypt)

4. Wait 24-48 hours for DNS propagation
```

---

## Production Monitoring

### Sentry (Error Tracking)
```bash
npm install @sentry/node @sentry/profiling-node
```

```js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,  // 10% requests trace karo
});

// Express ke liye
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
// ... routes ...
app.use(Sentry.Handlers.errorHandler());  // Error handler se pehle
```

### Health Check Endpoint
```js
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    database: 'unknown'
  };

  try {
    await mongoose.connection.db.admin().ping();
    health.database = 'connected';
  } catch {
    health.database = 'disconnected';
    health.status = 'degraded';
  }

  res.status(health.status === 'ok' ? 200 : 503).json(health);
});
```

---

## Common Deployment Issues

**"Application Error" on Render:**
```
1. Render dashboard mein logs dekho (free tier mein available)
2. Common causes:
   - Missing env variable
   - PORT hard-coded (use process.env.PORT)
   - MongoDB Atlas IP not whitelisted
   - npm start script missing
   - Syntax error in code
```

**"Build Failed":**
```
Render mein: npm install run hota hai
Common issues:
- package.json missing
- Wrong node version specify kiya
- Private dependency (npm audit)
```

**"Cannot connect to database":**
```
MongoDB Atlas pe:
1. Network Access → 0.0.0.0/0 allow hai?
2. Connection string mein username/password correct hai?
3. Cluster paused toh nahi? (free tier 30 days inactive pe pause hota hai)
```

---

## Deployment Checklist

```
Before deployment:
□ .env mein koi secret GitHub pe push toh nahi hua?
□ .gitignore properly set hai?
□ Environment variables platform pe set hain?
□ MongoDB Atlas configured hai?
□ PORT = process.env.PORT?
□ npm start works locally?
□ No hardcoded localhost URLs in frontend?

After deployment:
□ Health check endpoint hit karo
□ Register + Login test karo manually
□ Sentry ya logs monitor karo pehle 15 min
□ Frontend se backend connect hota hai?
□ CORS configured correctly?
```

---

## Interview Questions — Step 09

**Q: Docker kya hai aur kyun use karte hain?**
> Docker application ko containers mein pack karta hai — code + dependencies + OS. "Works on my machine" problem solve hoti hai. Har environment (dev, staging, prod) same container run karta hai — consistent behavior. Deployment faster aur predictable hoti hai.

**Q: CI/CD kya hai?**
> Continuous Integration: Code push hone pe automatically tests + lint run hote hain. Continuous Deployment: Tests pass hone pe automatically deploy hota hai. Isse human error reduce hoti hai aur code quality ensure hoti hai.

**Q: Staging environment kyun zaruri hai?**
> Production pe directly deploy karna risky hai. Staging production ka mirror hai jahan QA testing hoti hai. Real data jaisi test data use hoti hai. Issues yahan catch hote hain, not in production where real users are affected.

---

## Assignment — Step 09

1. Apni Todo/Auth API ko Render pe deploy karo
2. Frontend ko Netlify pe deploy karo
3. `.env.example` banao with all required variables
4. Health check endpoint add karo
5. GitHub Actions CI pipeline setup karo jo PRs pe tests run kare
