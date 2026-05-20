# Module 11: Real-World Industry Projects
### "Portfolio projects jo product companies notice karein"

---

## Project Selection Philosophy

```
Don't build:
❌ Todo apps
❌ Weather apps
❌ Clone tutorials (Twitter clone from YouTube)
❌ Projects you can't explain architecturally

Build:
✅ Projects solving real problems
✅ Projects demonstrating specific skills
✅ Projects you can defend architecture decisions of
✅ Projects with production deployment + monitoring
```

---

## Project 1: Authentication Microservice

**Level:** Intermediate | **Timeline:** 2–3 weeks

### Features
- Multi-tenant support
- JWT + refresh token rotation
- OAuth2 (Google, GitHub)
- Email/phone OTP
- RBAC with dynamic permissions
- Audit logging (all auth events)
- Account lockout + brute force protection
- Session management
- Password policy enforcement

### Architecture
```
[Client] → [API Gateway] → [Auth Service]
                                 ↓
                    [PostgreSQL (users, sessions, audit)]
                                 ↓
                    [Redis (tokens, rate limits, OTP)]
                                 ↓
                    [Email Queue (BullMQ)] → [SendGrid]
```

### Scalability Concepts Demonstrated
- Stateless JWT (horizontally scalable)
- Redis for distributed session/token management
- Rate limiting per IP + per user
- Database replication-ready schema

### Deployment
- Docker + docker-compose
- GitHub Actions CI/CD → AWS ECS
- CloudWatch monitoring + Sentry error tracking
- API documentation via Swagger

### Industry Relevance
Every application needs auth. Being able to build a production-grade auth service from scratch demonstrates:
- Security understanding
- Performance consciousness
- Real-world complexity handling

---

## Project 2: Scalable E-Commerce Backend

**Level:** Advanced | **Timeline:** 4–6 weeks

### Features
- Product catalog with search (Elasticsearch)
- Inventory management (race condition safe)
- Shopping cart (Redis-based, no DB writes)
- Order processing (state machine)
- Payment integration (Razorpay)
- Multi-currency pricing
- Coupons + discounts engine
- Order tracking + webhooks
- Admin dashboard API
- Seller portal API

### Architecture
```
[API Gateway + Rate Limiting]
          ↓
[Product Service] [Cart Service] [Order Service] [Payment Service]
     ↓                ↓               ↓                ↓
[PostgreSQL]     [Redis]         [PostgreSQL]     [PostgreSQL]
[Elasticsearch]                  [Kafka → Order events]
                                 [BullMQ → Email/SMS]
```

### Key Technical Challenges
```
1. Inventory race conditions:
   Solution: Pessimistic locking or Redis atomic operations

2. Payment failure after order creation:
   Solution: Saga pattern + compensating transactions

3. Search at scale:
   Solution: Elasticsearch with custom analyzers for Indian languages

4. Cart performance:
   Solution: Redis HASH for cart items, sync to DB only on checkout
```

### Deployment
- Microservices (or well-separated monolith)
- Docker Compose locally
- AWS ECS or EC2 with ALB
- RDS PostgreSQL + ElastiCache Redis
- CloudWatch + custom metrics dashboard

---

## Project 3: Real-Time Chat Application

**Level:** Advanced | **Timeline:** 3–4 weeks

### Features
- Direct messages + group chats
- Real-time typing indicators
- Read receipts
- Online/offline presence
- Message reactions + threads
- File sharing (S3)
- Push notifications (FCM)
- Message search (Elasticsearch)
- End-to-end encryption (concept implementation)

### Architecture
```
[WebSocket Gateway (Socket.io)]
         ↓
[Redis Pub/Sub ← → All WS Gateways]
         ↓
[Message Service]
         ↓
[MongoDB (messages, rooms)] [PostgreSQL (users, memberships)]
[Redis (presence, typing)]  [S3 (files)]
[Kafka → Notification queue → FCM/APNs]
```

### Key Technical Implementations
```js
// Scalable presence with Redis TTL
async function setUserOnline(userId, socketId) {
  await redis.hSet(`presence:${userId}`, {
    status: 'online',
    socketId,
    lastSeen: Date.now()
  });
  await redis.expire(`presence:${userId}`, 300); // 5 min TTL
}

// WebSocket heartbeat keeps presence alive
setInterval(() => {
  if (socket.connected) {
    redis.expire(`presence:${userId}`, 300);
  }
}, 60000); // Every minute
```

---

## Project 4: Notification Service

**Level:** Advanced | **Timeline:** 3 weeks

### Features
- Multi-channel: Email, SMS, Push, In-app, Webhook
- Template engine with personalization
- Scheduled notifications
- Notification preferences per user
- Delivery tracking + analytics
- Rate limiting per user per channel
- Bulk notifications (1M+ recipients)
- A/B testing for notification copy
- Unsubscribe management

### Architecture
```
[Events API] → [Kafka: notifications topic]
                        ↓
               [Routing Service]
               (user prefs + rate limits)
                    ↙  ↓  ↘
          [Email Worker] [SMS Worker] [Push Worker]
              ↓               ↓            ↓
         [SendGrid]       [Twilio]    [Firebase FCM]
              ↓               ↓            ↓
         [Delivery DB ← ← ← ← ← ← ← ← ←]
              ↓
         [Analytics Dashboard]
```

### Scale Implementation
```js
// Bulk notification — batching strategy
async function sendBulkNotification(userIds, template, data) {
  const BATCH_SIZE = 1000;

  for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
    const batch = userIds.slice(i, i + BATCH_SIZE);

    // Produce batch to Kafka
    await kafka.produce('notifications', batch.map(userId => ({
      userId,
      template,
      data,
      batchId: uuid(),
      createdAt: new Date()
    })));
  }

  // Workers process in parallel with rate limiting
  // Track progress via batchId
}
```

---

## Project 5: File Storage System (S3-like)

**Level:** Very Advanced | **Timeline:** 4–5 weeks

### Features
- File upload (small + large with multipart)
- File versioning
- Folder organization
- Sharing with expiry
- Access control (public/private/shared)
- Image transformations on-the-fly (Sharp)
- Storage quotas per user
- Virus scanning integration
- Metadata search
- Download with resume support (Range requests)

### Architecture
```
[Upload API] → [Chunked Upload Handler] → [S3/MinIO]
     ↓                                         ↓
[Metadata DB (PostgreSQL)]          [CDN (CloudFront)]
     ↓                                         ↓
[Job Queue] → [Virus Scan Worker]   [Image Transform Worker]
           → [Thumbnail Generator]
           → [Metadata Extractor]
```

### Key Implementation
```js
// Multipart upload with progress tracking
async function initiateMultipartUpload(fileMetadata) {
  const uploadId = uuid();

  await redis.hSet(`upload:${uploadId}`, {
    userId: fileMetadata.userId,
    filename: fileMetadata.name,
    fileSize: fileMetadata.size,
    totalParts: Math.ceil(fileMetadata.size / CHUNK_SIZE),
    uploadedParts: 0,
    status: 'in_progress'
  });

  return { uploadId, chunkSize: CHUNK_SIZE };
}

// Range request support for resume downloads
app.get('/files/:id/download', authenticate, async (req, res) => {
  const file = await getFileMetadata(req.params.id);
  const range = req.headers.range;

  if (range) {
    const [start, end] = range.replace('bytes=', '').split('-').map(Number);
    const chunkEnd = end || Math.min(start + CHUNK_SIZE, file.size - 1);

    res.status(206);
    res.setHeader('Content-Range', `bytes ${start}-${chunkEnd}/${file.size}`);
    res.setHeader('Accept-Ranges', 'bytes');

    const stream = s3.getObjectStream({ Key: file.s3Key, Range: `bytes=${start}-${chunkEnd}` });
    stream.pipe(res);
  } else {
    const stream = s3.getObjectStream({ Key: file.s3Key });
    stream.pipe(res);
  }
});
```

---

## Project 6: SaaS Platform (Capstone)

**Level:** Expert | **Timeline:** 6–8 weeks

### Concept: Multi-Tenant Project Management Tool

### Features
- Multi-tenancy (data isolation per organization)
- Workspace + team management
- Project + task management
- Real-time collaboration (WebSockets)
- File attachments
- Activity feed
- Analytics dashboard
- Subscription management (Razorpay)
- API for third-party integrations
- Webhook system

### Multi-Tenancy Implementation
```js
// Row-level security (RLS) in PostgreSQL
CREATE POLICY tenant_isolation ON tasks
USING (organization_id = current_setting('app.current_org_id')::uuid);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

// Middleware to set org context
app.use(authenticate);
app.use(async (req, res, next) => {
  if (req.user) {
    // Set PostgreSQL session variable for RLS
    await db.query(`SET app.current_org_id = '${req.user.organizationId}'`);
    req.org = await Organization.findById(req.user.organizationId);
  }
  next();
});
```

---

## Portfolio Presentation Guidelines

### GitHub Repository Standards
```
├── README.md (comprehensive)
├── docs/
│   ├── architecture.md    (with diagrams)
│   ├── api.md             (endpoint docs)
│   └── deployment.md      (how to deploy)
├── src/
├── tests/
├── docker-compose.yml
├── .env.example
└── k8s/ (if Kubernetes)
```

### README Must Include
```markdown
## Architecture
[System diagram — use draw.io or Excalidraw]

## Tech Stack & Decisions
| Technology | Why chosen | Alternatives considered |
|------------|------------|------------------------|
| PostgreSQL | ACID for payments | MongoDB (rejected — need transactions) |
| Redis | Caching + queues | Memcached (rejected — need data structures) |

## Performance
- Load tested to 1000 concurrent users
- p99 latency: 180ms
- Throughput: 850 req/sec

## Deployment
[Link to live deployment]
[Link to monitoring dashboard if accessible]
```

---

## Assignment — Module 11

1. Choose 2 projects — start with Auth Service + one more
2. Architecture document first — before writing code
3. Deploy at least 1 project to AWS with monitoring
4. Write a technical blog post about one interesting challenge you solved
5. Prepare 5-minute project walkthrough for interviews
