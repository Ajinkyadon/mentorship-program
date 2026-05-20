# Module 07: AWS & Cloud Engineering
### "Code deploy karna ek skill hai — production manage karna dusri"

---

## Why Cloud for Backend Engineers?

```
2019: "DevOps team handle karta hai"
2024: Every backend engineer expected to:
  → Deploy their own services
  → Configure infrastructure
  → Debug production issues
  → Optimize costs
  → Set up monitoring

Senior backend roles require cloud proficiency — not expertise, but comfort.
```

---

## AWS Core Services

### IAM — Identity & Access Management

```
Principle of Least Privilege: Give only the permissions needed.

IAM Users: Human access (developers, admins)
IAM Roles: Service access (EC2, Lambda, ECS)
IAM Policies: JSON permissions attached to users/roles

# NEVER use root account
# NEVER hardcode AWS credentials in code

Bad: AccessKey in .env committed to GitHub → Security breach
Good: IAM Role attached to EC2/ECS → Automatic credential rotation
```

```json
// Minimal S3 policy for app (only what it needs)
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::my-app-bucket/*"
    }
  ]
}
```

### VPC — Virtual Private Cloud

```
Your private network in AWS:

Internet Gateway
      ↓
Public Subnet (10.0.1.0/24) — Load Balancer, Bastion host
      ↓
Private Subnet (10.0.2.0/24) — Application servers, Databases
      ↓
      ↓ (No direct internet access — more secure)
Database Subnet (10.0.3.0/24) — RDS, ElastiCache

Security Groups = Firewall rules
  - ALB Security Group: Allow 80/443 from internet
  - App Security Group: Allow 3000 from ALB security group only
  - DB Security Group: Allow 5432 from App security group only
```

### EC2 — Elastic Compute Cloud

```bash
# Launch EC2 instance
# User data script (runs on first boot)
#!/bin/bash
yum update -y
yum install -y nodejs npm git

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
yum install -y nodejs

# Install PM2
npm install -g pm2

# Clone app
git clone https://github.com/org/app.git /app
cd /app
npm ci --only=production

# Set environment
echo "NODE_ENV=production" >> /etc/environment
echo "PORT=3000" >> /etc/environment

# Start with PM2
pm2 start ecosystem.config.js
pm2 startup systemd
pm2 save
```

```js
// ecosystem.config.js — PM2 configuration
module.exports = {
  apps: [{
    name: 'api-server',
    script: 'src/index.js',
    instances: 'max',          // Use all CPU cores
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/app/error.log',
    out_file: '/var/log/app/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

### S3 — Object Storage

```js
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({ region: process.env.AWS_REGION });

// Upload
await s3.send(new PutObjectCommand({
  Bucket: process.env.S3_BUCKET,
  Key: `uploads/${userId}/${filename}`,
  Body: fileBuffer,
  ContentType: mimeType,
  // S3 managed encryption
  ServerSideEncryption: 'AES256',
  // Cache control for static assets
  CacheControl: 'max-age=31536000, immutable'
}));

// Presigned URL for private file access
const url = await getSignedUrl(s3, new GetObjectCommand({
  Bucket: process.env.S3_BUCKET,
  Key: objectKey
}), { expiresIn: 3600 }); // 1 hour access

// S3 Lifecycle — auto-cleanup
// Via AWS Console or CloudFormation:
// - Delete incomplete multipart uploads after 7 days
// - Move to Glacier after 90 days
// - Delete after 1 year
```

### RDS — Managed PostgreSQL

```
Production RDS Setup:
- Multi-AZ deployment (automatic failover)
- Automated backups (7 day retention)
- Point-in-time recovery
- Read replicas for read scaling
- Performance Insights enabled
- Enhanced monitoring

Connection string from Secrets Manager (not hardcoded):
```

```js
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const secretsClient = new SecretsManagerClient({ region: process.env.AWS_REGION });

async function getDatabaseCredentials() {
  const response = await secretsClient.send(new GetSecretValueCommand({
    SecretId: process.env.DB_SECRET_ARN
  }));

  return JSON.parse(response.SecretString);
}

// On startup
const dbCreds = await getDatabaseCredentials();
const pool = new Pool({
  host: dbCreds.host,
  port: dbCreds.port,
  database: dbCreds.dbname,
  user: dbCreds.username,
  password: dbCreds.password,
  ssl: { rejectUnauthorized: true, ca: fs.readFileSync('rds-ca.pem') }
});
```

### Lambda — Serverless Functions

```js
// Lambda function — event-driven compute
exports.handler = async (event, context) => {
  // S3 trigger — process uploaded file
  if (event.Records?.[0]?.eventSource === 'aws:s3') {
    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;

    // Process uploaded image
    const imageBuffer = await downloadFromS3(bucket, key);
    const resized = await sharp(imageBuffer).resize(800, 600).toBuffer();
    await uploadToS3(bucket, `thumbnails/${key}`, resized);
    return { processed: key };
  }

  // SQS trigger — process queue messages
  if (event.Records?.[0]?.eventSource === 'aws:sqs') {
    for (const record of event.Records) {
      const message = JSON.parse(record.body);
      await processMessage(message);
    }
    return { processed: event.Records.length };
  }

  // API Gateway trigger — HTTP handler
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Hello!' })
  };
};

// Lambda best practices:
// 1. Keep cold start time low — minimize imports
// 2. Reuse connections outside handler
// 3. Use /tmp for temporary files (512MB)
// 4. Set appropriate timeout (default 3s is often too short)
// 5. Use environment variables for config
```

### CloudWatch — Monitoring & Logging

```js
const { CloudWatchClient, PutMetricDataCommand } = require('@aws-sdk/client-cloudwatch');
const { CloudWatchLogsClient } = require('@aws-sdk/client-cloudwatch-logs');

const cw = new CloudWatchClient({ region: process.env.AWS_REGION });

// Custom metrics
async function trackAPILatency(endpoint, latency) {
  await cw.send(new PutMetricDataCommand({
    Namespace: 'MyApp/API',
    MetricData: [{
      MetricName: 'RequestLatency',
      Dimensions: [{ Name: 'Endpoint', Value: endpoint }],
      Value: latency,
      Unit: 'Milliseconds'
    }]
  }));
}

// Structured logging for CloudWatch Logs Insights
const logger = {
  info: (msg, data = {}) => console.log(JSON.stringify({
    level: 'INFO',
    message: msg,
    timestamp: new Date().toISOString(),
    service: process.env.SERVICE_NAME,
    ...data
  })),
  error: (msg, data = {}) => console.error(JSON.stringify({
    level: 'ERROR',
    message: msg,
    timestamp: new Date().toISOString(),
    ...data
  }))
};

// CloudWatch Logs Insights query
// fields @timestamp, @message, requestId, latency
// | filter level = "ERROR"
// | sort @timestamp desc
// | limit 50
```

---

## Docker — Production Containers

### Multi-Stage Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage — minimal image
FROM node:18-alpine AS production
WORKDIR /app

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

# Own files
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "src/index.js"]
```

### docker-compose for Development

```yaml
# docker-compose.yml
version: '3.9'

services:
  app:
    build:
      context: .
      target: builder    # Development stage
    command: npm run dev
    ports: ["3000:3000"]
    environment:
      NODE_ENV: development
      MONGODB_URI: mongodb://mongo:27017/myapp
      REDIS_URL: redis://redis:6379
      JWT_SECRET: dev_secret_key_not_for_production
    volumes:
      - ./src:/app/src    # Hot reload
    depends_on:
      mongo: { condition: service_healthy }
      redis: { condition: service_healthy }

  mongo:
    image: mongo:6
    ports: ["27017:27017"]
    volumes: [mongo_data:/data/db]
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    command: redis-server --appendonly yes
    volumes: [redis_data:/data]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s

  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on: [app]

volumes:
  mongo_data:
  redis_data:
```

---

## Kubernetes Basics

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
  labels:
    app: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0   # Zero downtime deploy
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: my-registry/api:v1.2.3
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: mongodb-uri
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## CI/CD Pipeline — GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Build, Test, Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  AWS_REGION: ap-south-1
  ECR_REPOSITORY: my-app
  ECS_SERVICE: my-app-service
  ECS_CLUSTER: my-cluster

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s

    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm run lint
    - run: npm test -- --coverage
      env:
        DATABASE_URL: postgresql://test:test@localhost:5432/testdb
        REDIS_URL: redis://localhost:6379
        JWT_SECRET: test_secret

    - name: Upload coverage
      uses: codecov/codecov-action@v3

  build-and-push:
    name: Build & Push Docker Image
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    outputs:
      image: ${{ steps.build.outputs.image }}

    steps:
    - uses: actions/checkout@v3

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}

    - name: Login to ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1

    - name: Build, tag, push image
      id: build
      run: |
        IMAGE_TAG="${{ github.sha }}"
        IMAGE="${{ steps.login-ecr.outputs.registry }}/${{ env.ECR_REPOSITORY }}:${IMAGE_TAG}"
        docker build -t $IMAGE .
        docker push $IMAGE
        echo "image=$IMAGE" >> $GITHUB_OUTPUT

  deploy:
    name: Deploy to ECS
    needs: build-and-push
    runs-on: ubuntu-latest

    steps:
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}

    - name: Deploy to ECS
      run: |
        aws ecs update-service \
          --cluster ${{ env.ECS_CLUSTER }} \
          --service ${{ env.ECS_SERVICE }} \
          --force-new-deployment

    - name: Wait for deployment
      run: |
        aws ecs wait services-stable \
          --cluster ${{ env.ECS_CLUSTER }} \
          --services ${{ env.ECS_SERVICE }}
```

---

## Nginx — Reverse Proxy

```nginx
# nginx.conf
upstream api_backend {
    least_conn;
    server app1:3000;
    server app2:3000;
    server app3:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name api.myapp.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.myapp.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    # Gzip compression
    gzip on;
    gzip_types text/plain application/json;
    gzip_min_length 1024;

    location /api/ {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Buffering
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
    }

    # Static files (S3/CloudFront better for production)
    location /static/ {
        root /var/www;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Assignment — Module 07

1. AWS setup:
   - IAM user + role with minimal permissions
   - S3 bucket with lifecycle rules + presigned URLs
   - RDS PostgreSQL instance (free tier)
   - ElastiCache Redis (free tier)

2. Dockerize apna Node.js project — multi-stage build

3. GitHub Actions pipeline:
   - Tests run on PR
   - Docker image builds on merge to main
   - Deploys to EC2/ECS

4. Nginx setup: Load balance between 2 Node.js instances locally
