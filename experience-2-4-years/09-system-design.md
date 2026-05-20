# Module 09: System Design
### "Senior level interviews ka sabse important round"

---

## System Design Interview Framework

```
STEP 1: Clarify Requirements (5 min)
  → Functional: What does it do?
  → Non-functional: Scale, latency, availability requirements
  → Constraints: Budget, team size, timeline

STEP 2: Estimate Scale (3 min)
  → DAU (Daily Active Users)
  → Requests per second
  → Storage requirements
  → Bandwidth

STEP 3: High-Level Design (10 min)
  → Major components
  → Data flow
  → API design

STEP 4: Deep Dive (15 min)
  → Interviewer will pick 1-2 areas
  → Database design
  → Bottlenecks
  → Edge cases

STEP 5: Identify Bottlenecks (5 min)
  → Where will it break?
  → How do you scale?
  → Failure scenarios
```

---

## Design 1: URL Shortener

### Requirements
```
Functional:
- Long URL → Short URL (bit.ly/abc123)
- Redirect short → long
- Custom alias optional
- Analytics (click count, geo)

Non-functional:
- 100M URLs created/day
- 1B redirects/day
- Low latency redirects (< 10ms p99)
- 99.99% availability
- URLs don't expire (or configurable TTL)
```

### Scale Estimation
```
Writes: 100M/day = ~1200/sec
Reads: 1B/day = ~12000/sec (read-heavy, 10:1 ratio)
Storage: 100M * 500 bytes = 50GB/day = 1.5TB/month
```

### High-Level Design
```
[Client] → [CDN] → [Load Balancer]
                         ↓
              [URL Service (stateless)]
                    ↙         ↘
          [Cache (Redis)]  [DB (PostgreSQL)]
                               ↓
                    [Analytics Service]
                         ↓
                  [Kafka] → [Analytics DB]
```

### Database Design
```sql
CREATE TABLE urls (
  id          BIGSERIAL PRIMARY KEY,
  short_code  CHAR(8)      UNIQUE NOT NULL,
  long_url    TEXT         NOT NULL,
  user_id     BIGINT,
  created_at  TIMESTAMPTZ  DEFAULT NOW(),
  expires_at  TIMESTAMPTZ,
  click_count BIGINT       DEFAULT 0
);

CREATE INDEX idx_urls_short_code ON urls(short_code);
CREATE INDEX idx_urls_user_id ON urls(user_id);
```

### Short Code Generation
```js
// Option 1: Base62 encoding of auto-increment ID
function encodeBase62(id) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  while (id > 0) {
    result = chars[id % 62] + result;
    id = Math.floor(id / 62);
  }
  return result.padStart(6, '0'); // 6 chars = 62^6 = 56B URLs
}

// Option 2: MD5 hash truncated (collision possible, need to handle)
function generateCode(longUrl) {
  const hash = crypto.createHash('md5').update(longUrl).digest('hex');
  return hash.substring(0, 8); // First 8 chars
}

// Option 3: Distributed ID (better for scale)
// Use Snowflake IDs or UUID v7 → encode as base62
```

### Caching Strategy
```js
// Cache redirects aggressively (most reads are redirects)
async function redirect(shortCode, res) {
  // Check cache first
  let longUrl = await redis.get(`url:${shortCode}`);

  if (!longUrl) {
    const url = await db.query('SELECT long_url FROM urls WHERE short_code = $1', [shortCode]);
    if (!url.rows[0]) return res.status(404).send('Not found');

    longUrl = url.rows[0].long_url;
    await redis.setEx(`url:${shortCode}`, 86400, longUrl); // Cache 24h
  }

  // Async analytics (don't block redirect)
  analytics.track(shortCode, req.ip, req.headers['user-agent'])
    .catch(err => logger.error('Analytics failed', err));

  res.redirect(301, longUrl); // 301 = cacheable by browser too
}
```

### Bottlenecks & Solutions
```
Bottleneck 1: Write throughput (1200/sec)
Solution: Database write sharding by user_id, async writes for analytics

Bottleneck 2: Read throughput (12000/sec)
Solution: CDN for popular URLs, Redis cache (90%+ hit rate), read replicas

Bottleneck 3: ID generation (unique short codes at scale)
Solution: Pre-generate pools of codes, Snowflake IDs, separate ID service

Bottleneck 4: Analytics at scale
Solution: Kafka queue → batch processing → ClickHouse or BigQuery
```

---

## Design 2: Real-Time Chat Application

### Requirements
```
Functional:
- 1-on-1 messaging
- Group chats (up to 1000 members)
- Message history
- Online/offline status
- Read receipts
- File sharing

Non-functional:
- 10M DAU, 50M messages/day
- Message delivery < 100ms
- 99.9% availability
- Messages stored for 5 years
```

### High-Level Design
```
[Client WebSocket] → [WebSocket Gateway (stateful)]
                              ↓
                    [Message Service]
                       ↙         ↘
             [Redis Pub/Sub]   [Message DB]
                  ↓               ↓
         [Other WS Gateways]  [Cassandra/PostgreSQL]
                                   ↓
                           [Media Service → S3]
```

### WebSocket Gateway
```js
// Stateful — knows which users are connected HERE
const connectedUsers = new Map(); // userId → socket

io.on('connection', (socket) => {
  const userId = socket.user.userId;
  connectedUsers.set(userId, socket);

  // Tell others we're online
  await redis.set(`online:${userId}`, '1', { EX: 300 }); // 5 min TTL
  await redis.publish('presence', JSON.stringify({ userId, status: 'online' }));

  socket.on('message', async (data) => {
    const { roomId, content, type } = data;

    // Save to DB
    const message = await saveMessage({ senderId: userId, roomId, content, type });

    // Publish to Redis (other gateways will forward to their connected users)
    await redis.publish(`room:${roomId}`, JSON.stringify(message));
  });

  socket.on('disconnect', () => {
    connectedUsers.delete(userId);
    redis.del(`online:${userId}`);
    redis.publish('presence', JSON.stringify({ userId, status: 'offline' }));
  });
});

// Subscribe to Redis for messages from other gateways
redisSubscriber.subscribe(`room:*`, (message, channel) => {
  const roomId = channel.replace('room:', '');
  const roomMembers = await getRoomMembers(roomId);

  for (const memberId of roomMembers) {
    const socket = connectedUsers.get(memberId);
    if (socket) socket.emit('message', JSON.parse(message));
  }
});
```

### Message Storage
```
For chat messages: Apache Cassandra (or DynamoDB)
- High write throughput
- Time-series data (messages ordered by time)
- Horizontal scaling built-in
- Partition key: room_id
- Clustering key: message_id (time-ordered)

For user data, rooms: PostgreSQL

For online presence: Redis (TTL-based)
For recent messages: Redis (last 50 messages per room)
```

---

## Design 3: Notification System

### Requirements
```
Functional:
- Push, email, SMS notifications
- User preferences (which channels)
- Template-based notifications
- Scheduled notifications
- Delivery tracking

Non-functional:
- 100M notifications/day
- Delivery < 30s for real-time, < 5 min for batch
- At-least-once delivery
- Deduplication
```

### Architecture
```
[Event Sources (API, scheduled)] → [Notification Service]
                                           ↓
                              [Kafka Topic: notifications]
                                    ↙    ↓    ↘
                            [Email  SMS  Push Workers]
                               ↓     ↓     ↓
                         [SendGrid Twilio FCM/APNs]
                               ↓     ↓     ↓
                          [Delivery Status Tracking]
```

### Implementation
```js
// Notification event publisher
class NotificationService {
  async notify(userId, event, data) {
    const user = await this.userRepo.findWithPreferences(userId);

    const notification = {
      id: uuid(),
      userId,
      event,
      data,
      createdAt: new Date()
    };

    // Route based on user preferences and event type
    const channels = this.getChannels(user.preferences, event);

    for (const channel of channels) {
      await this.kafka.produce('notifications', {
        ...notification,
        channel,
        priority: this.getPriority(event)
      });
    }
  }
}

// Channel workers
class EmailWorker {
  async process(notification) {
    // Idempotency check
    const sent = await redis.get(`notification:sent:${notification.id}:email`);
    if (sent) return; // Already processed

    const template = await this.getTemplate(notification.event);
    const html = this.renderTemplate(template, notification.data);

    await sendgrid.send({
      to: notification.user.email,
      subject: template.subject,
      html
    });

    // Mark as sent (idempotency key)
    await redis.setEx(`notification:sent:${notification.id}:email`, 86400, '1');

    // Update delivery status
    await this.updateStatus(notification.id, 'email', 'delivered');
  }
}
```

---

## Design 4: Rate Limiter

### Algorithms Comparison
```
Fixed Window:
→ Simple, but boundary burst attack
→ [9:00:59] 100 requests + [9:01:01] 100 requests = 200 in 2 seconds

Sliding Window Log:
→ Accurate, but memory intensive (store all request timestamps)
→ Good for low-traffic, strict rate limiting

Sliding Window Counter:
→ Approximate sliding window
→ current = curr_window_count + prev_window_count * (1 - elapsed_ratio)
→ Good balance of accuracy and efficiency

Token Bucket:
→ Allows bursts, steady refill
→ [1 token/10ms, bucket size 100] → burst of 100 then 100/sec

Leaky Bucket:
→ Smooth output regardless of input burst
→ Queue + fixed drain rate
```

### Distributed Rate Limiter (Redis)
```js
// Sliding window counter — Redis
async function rateLimit(identifier, limit, windowMs) {
  const now = Date.now();
  const windowStart = now - windowMs;
  const key = `ratelimit:${identifier}`;

  const pipeline = redis.multi();
  // Remove old entries
  pipeline.zRemRangeByScore(key, '-inf', windowStart);
  // Add current request
  pipeline.zAdd(key, { score: now, value: `${now}-${Math.random()}` });
  // Count in window
  pipeline.zCard(key);
  // Set expiry
  pipeline.expire(key, Math.ceil(windowMs / 1000));

  const results = await pipeline.exec();
  const count = results[2];

  return {
    allowed: count <= limit,
    count,
    remaining: Math.max(0, limit - count),
    resetAt: now + windowMs
  };
}
```

---

## Design 5: E-Commerce Backend

### Core Services
```
API Gateway
    ↓
[User Service] [Product Service] [Order Service] [Payment Service]
    ↓               ↓                 ↓                 ↓
[User DB]      [Product DB]      [Order DB]       [Payment DB]
                [Search Engine]
```

### Inventory Management (Race Condition Problem)
```js
// Problem: Two users buy last item simultaneously
// Both read stock: 1, both decrement: stock becomes -1!

// Solution 1: Pessimistic locking (PostgreSQL)
BEGIN;
SELECT stock FROM products WHERE id = $1 FOR UPDATE; -- Row lock
-- Only one transaction proceeds at a time
UPDATE products SET stock = stock - 1 WHERE id = $1 AND stock > 0;
COMMIT;

// Solution 2: Optimistic locking (version field)
const product = await Product.findById(id);
const updated = await Product.findOneAndUpdate(
  { _id: id, version: product.version },  // Version check
  { $inc: { stock: -1 }, $inc: { version: 1 } },
  { new: true }
);
if (!updated) throw new Error('Concurrent modification detected');

// Solution 3: Redis atomic operations
const result = await redis.eval(`
  local stock = redis.call('GET', KEYS[1])
  if tonumber(stock) <= 0 then return -1 end
  return redis.call('DECR', KEYS[1])
`, 1, `stock:${productId}`);

if (result === -1) throw new Error('Out of stock');
```

---

## System Design Interview Tips

```
Do:
✅ Clarify requirements before designing
✅ State assumptions explicitly
✅ Discuss tradeoffs — not just one solution
✅ Think out loud — interviewer wants your process
✅ Start simple, then add complexity
✅ Prioritize bottlenecks based on scale
✅ Use numbers (estimation is important)

Don't:
❌ Jump to solution without clarifying
❌ Over-engineer for stated scale
❌ Say "just use Kafka" without explaining why
❌ Focus only on happy path
❌ Ignore failure scenarios
❌ Use buzzwords without understanding
```

---

## Assignment — Module 09

1. Design a file storage system (like Google Drive):
   - Upload, download, share, version control
   - 10M users, 1TB avg storage per user
   - Estimate scale, design architecture

2. Design a search autocomplete system:
   - Type-ahead suggestions
   - 10k QPS, < 50ms latency
   - Trending searches

3. Mock interview: Time yourself — 45 min for complete design
   - URL shortener (without notes)
   - Record yourself — review communication
