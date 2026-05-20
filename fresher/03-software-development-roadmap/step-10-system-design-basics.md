# Step 10: System Design Basics
### "Bade systems kaise kaam karte hain — ek overview"

---

## Why Freshers Need System Design

Ye module deep nahi jaayega — but **concepts samajhna zaroori hai** kyunki:
- Interviews mein design questions poocha jaata hai (even for freshers)
- Industry mein ye terminology use hoti hai
- Better code likhte ho jab big picture samajhte ho

**Deep system design:** 1-2 saal experience ke baad seekho. Abhi sirf concepts.

---

## The Problem System Design Solves

```
10 users ka app: 1 server + 1 DB → Fine

10 million users ka app:
→ 1 server → Crash
→ 1 DB → Overload, slow queries
→ Ek datacenter → What if it goes down?

System design = "How do we handle scale, reliability, and performance?"
```

---

## Scalability

**Scalability = Zyada users/load ke saath bhi well perform karna.**

### Vertical Scaling (Scale Up)
```
Current server: 2 CPU, 4GB RAM → Slow
Upgrade to: 16 CPU, 64GB RAM → Faster

Pros: Simple, no code changes
Cons: Expensive, limit hai (max machine size), single point of failure

Example: Database server ko upgrade karna
```

### Horizontal Scaling (Scale Out)
```
1 server (overloaded) → 10 servers (load shared)

Pros: No theoretical limit, fault tolerant
Cons: Distributed system complexity, sticky sessions issue

Example: Multiple Node.js instances behind load balancer
```

### Load Balancer
```
Users → Load Balancer → Server 1
                     → Server 2
                     → Server 3

Load Balancer distributes traffic:
- Round Robin: 1 → 2 → 3 → 1 → 2 → 3 (simple rotation)
- Least Connections: Sabse kam busy server ko bhejo
- IP Hash: Same user → Same server (session affinity)

Popular: Nginx, AWS ALB, Cloudflare
```

---

## Caching

**Problem:** Database query slow hai → Baar baar same data fetch karna = slow.

**Solution:** Frequently accessed data temporary store karo — fast retrieval.

```
Without cache:
User Request → Server → Database Query (50ms) → Response

With cache:
User Request → Server → Cache Check
                         → Cache HIT → Return (2ms) ✅
                         → Cache MISS → DB Query (50ms) → Store in Cache → Return
```

### Where to Cache

```
1. Client Cache (Browser)
   → Images, CSS, JS files
   → Cache-Control headers
   → Saves network requests

2. CDN Cache
   → Static assets close to user
   → Images, videos, fonts
   → Geographic distribution

3. Server Cache (In-Memory)
   → Application-level caching
   → Redis, Memcached
   → API responses, computed results

4. Database Cache
   → Query result cache
   → DB-level (MySQL query cache, etc.)
   → Index-based fast lookups
```

### Redis — Most Popular Cache
```js
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });

// Set cache (with expiry)
await client.setEx('users:all', 300, JSON.stringify(users));  // 5 min cache

// Get from cache
const cached = await client.get('users:all');
if (cached) return JSON.parse(cached);

// Delete cache (when data changes)
await client.del('users:all');
await client.del(`user:${userId}`);
```

### Cache Invalidation — The Hard Problem
```
"There are only two hard things in Computer Science:
cache invalidation and naming things." — Phil Karlton

Problem: Data DB mein update hua but cache mein purana data hai.

Strategies:
1. TTL (Time-To-Live): Cache automatically expire ho jaata hai
   → Simple but stale data possible between updates

2. Write-Through: DB update ke saath cache bhi update karo
   → Consistent but every write = 2 operations

3. Cache Invalidation: DB update hone pe cache delete karo
   → Cache miss hoga, phir fresh data cache hoga
   → Simple pattern for freshers
```

---

## Databases at Scale

### Read Replicas
```
Primary DB (writes)
    ↓
Replica 1 (reads)
Replica 2 (reads)
Replica 3 (reads)

Write → Primary
Read  → Any replica

90% traffic = reads → Replicas handle karte hain
10% traffic = writes → Primary handle karta hai
```

### Database Sharding
```
Sab users ek DB pe nahi → Too big

Users A-M → Shard 1
Users N-Z → Shard 2

Sharding strategies:
- Range: ID 1-1M → Shard 1, 1M-2M → Shard 2
- Hash: hash(userId) % N → Shard number
- Geographic: India users → India shard, US users → US shard
```

### Connection Pooling
```js
// Without pooling: Har request pe new DB connection
// → Slow (connection setup time)
// → Expensive (DB resources)

// With pooling: Pre-created connections pool
const mongoose = require('mongoose');

mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,    // Max 10 connections maintained
  minPoolSize: 2,     // Min 2 always ready
  maxIdleTimeMS: 30000  // Idle connections close after 30s
});

// Har request ek available connection use karta hai
// Done hone pe pool mein wapas jaata hai
```

---

## CDN — Content Delivery Network

```
Problem: Server Mumbai mein, User New York mein
         → High latency (200ms+)

Solution: CDN edge servers globally
         → User nearest edge se content paata hai (10ms)

What CDN serves:
✅ Images, videos
✅ CSS, JavaScript files
✅ Fonts
✅ Static HTML

What CDN doesn't serve (dynamic):
❌ API responses (personalized)
❌ User-specific data
❌ Database queries

Popular CDNs: Cloudflare, AWS CloudFront, Fastly
```

---

## Message Queues

**Problem:** Some tasks time-consuming hain (email bhejno, PDF banao, image resize karo).

```
Without queue:
User → Upload Image → Server resize karta hai (5 sec) → Response
       User 5 seconds wait karta hai ❌

With queue:
User → Upload Image → Add to queue → Response (immediate) ✅
               ↓
         Background Worker
               ↓
         Image resize hota hai
               ↓
         User ko notification
```

```js
// BullMQ (Redis-based queue)
const { Queue, Worker } = require('bullmq');

// Add job to queue
const emailQueue = new Queue('emails', { connection: redisConfig });

await emailQueue.add('welcome-email', {
  to: user.email,
  name: user.name
});

// Worker (separate process/server)
const worker = new Worker('emails', async (job) => {
  await sendEmail(job.data.to, job.data.name);
}, { connection: redisConfig });
```

**Use cases:**
- Email sending
- Image/video processing
- Report generation
- Notifications
- Third-party API calls (payment, SMS)

---

## Microservices vs Monolith

### Monolith
```
One big application:
- User service
- Product service
- Order service
- Payment service
→ All in ONE codebase, ONE deployment

Pros:
✅ Simple to develop (start here!)
✅ Easy debugging
✅ No network calls between services
✅ One deployment

Cons:
❌ Scale entire app even if only one part is busy
❌ One bug can crash everything
❌ Big team = merge conflicts
```

### Microservices
```
Separate applications:
user-service      (port 3001)
product-service   (port 3002)
order-service     (port 3003)
payment-service   (port 3004)
→ Each independent deployment

API Gateway (entry point for all)
    ↓
Routes to correct microservice

Pros:
✅ Scale individual services
✅ Independent deployments
✅ Different teams own different services
✅ Technology flexibility

Cons:
❌ Complex infrastructure
❌ Network latency between services
❌ Distributed system problems
❌ NOT for freshers — learn monolith first
```

**Fresher advice:** Monolith se start karo. Microservices experienced teams ke liye hain.

---

## API Gateway

```
Without Gateway:
Client → user.api.com:3001
Client → product.api.com:3002
Client → order.api.com:3003
→ Client sab URLs janta hai — complex, insecure

With Gateway:
Client → api.myapp.com (API Gateway)
               ↓
    /users → user-service
    /products → product-service
    /orders → order-service

Gateway handles:
- Authentication (one place)
- Rate limiting
- Logging
- SSL termination
- Request routing
```

---

## High Availability (HA)

**Goal: System 24/7 available rahega.**

```
Single Point of Failure (SPOF) = Ye fail hua → Everything down

Eliminate SPOFs:
- Multiple servers (load balanced)
- Multiple database replicas
- Multiple data centers (regions)
- Automatic failover

Availability metrics:
99%    uptime = 3.65 days downtime/year    (bad)
99.9%  uptime = 8.77 hours downtime/year  (okay)
99.99% uptime = 52.6 min downtime/year   (good - "four nines")
99.999%uptime = 5.26 min downtime/year   (excellent - "five nines")
```

---

## Design URL Shortener (Interview Question)

```
Requirements:
- Long URL → Short URL (e.g., bit.ly/abc123)
- Short URL → Redirect to long URL
- Track clicks

High Level Design:
Client → Shorten API → Generate code → Store in DB → Return short URL
Client → Visit short URL → Lookup code → Redirect

Data Model:
{
  code: "abc123",        // 6-8 char unique code
  originalUrl: "https://very-long-url.com/...",
  clicks: 142,
  userId: "...",         // Who created it
  expiresAt: Date,       // Optional expiry
  createdAt: Date
}

URL: https://short.ly/abc123
     ↓
GET /abc123
     ↓
DB: Find { code: "abc123" }
     ↓
Increment clicks
     ↓
301/302 Redirect to originalUrl

Code generation:
- UUID ke pehle 8 chars
- Base62 encoding of auto-increment ID
- Random alphanumeric with collision check
```

---

## Design Todo API (Know This Cold)

```
Entities:
User: { id, name, email, password, createdAt }
Todo: { id, title, description, completed, userId, createdAt, updatedAt }

Endpoints:
POST   /auth/register
POST   /auth/login
GET    /auth/me

GET    /todos?page=1&limit=10&completed=false
POST   /todos
GET    /todos/:id
PUT    /todos/:id
PATCH  /todos/:id  (just toggle completed)
DELETE /todos/:id

Considerations:
- Auth: JWT token
- Todos user-specific: query always includes userId
- Pagination: skip/limit
- Indexes: userId (frequent filter), createdAt (sort)
```

---

## Key System Design Terms (Interview Vocabulary)

| Term | Simple Explanation |
|------|-------------------|
| Scalability | More users = system still works well |
| Availability | System kitne time live rehta hai |
| Reliability | System correctly kaam karta hai |
| Consistency | Sab nodes same data dikhate hain |
| Partition Tolerance | Network failure pe bhi kaam karta hai |
| Latency | Request aur response ke beech time |
| Throughput | Ek second mein kitni requests handle |
| Bottleneck | Slowest component = performance limit |
| SLA | Service Level Agreement — promised uptime |
| RPO | Recovery Point Objective — kitna data loss acceptable |
| RTO | Recovery Time Objective — kitna downtime acceptable |

---

## Interview Questions — Step 10

**Q: Caching kya hai? Redis kab use karein?**
> Caching = Frequently accessed data temporarily store karna for fast retrieval. Redis in-memory store hai — DB se 100x faster. Use karo: API responses, session data, rate limiting counters, leaderboards. Avoid karo: Data jo har user ke liye alag hai, frequently changing data.

**Q: Vertical vs horizontal scaling?**
> Vertical: Bigger machine lo (limit hai, SPOF). Horizontal: Zyada machines add karo (no limit, fault tolerant, but complex). Modern systems horizontal prefer karte hain.

**Q: Monolith vs Microservices?**
> Monolith: Sab ek codebase mein — simple, good for start. Microservices: Separate services — scalable, but complex infrastructure. Freshers aur small teams: Monolith. Large teams, different scaling needs: Microservices.

---

## Assignment — Step 10

1. URL shortener design karo (paper pe):
   - Data model
   - API endpoints
   - Flow diagram

2. Apni existing Todo API mein add karo:
   - Redis caching for GET /todos (5 min cache)
   - Cache invalidate karo jab todo create/update/delete ho

3. Simple rate limiter implement karo Redis ke saath (zyada accurate than in-memory)
