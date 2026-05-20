# Module 06: Database Engineering
### "SELECT * is not engineering — database design is"

---

## 1. Query Optimization — PostgreSQL

### EXPLAIN ANALYZE — Read This First

```sql
-- Always analyze slow queries
EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) as order_count, SUM(o.total) as revenue
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
  AND o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY u.id, u.name
ORDER BY revenue DESC
LIMIT 20;

-- Output to understand:
-- Seq Scan = full table scan = BAD for large tables
-- Index Scan = using index = GOOD
-- Index Only Scan = covering index = BEST
-- Hash Join vs Nested Loop — understand when each is used
-- rows= actual vs estimated — large difference = bad statistics
-- actual time= — the slow part
```

### Index Design Strategy

```sql
-- Single column index
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Compound index — column order matters!
-- Rule: equality conditions first, range conditions last
CREATE INDEX idx_orders_status_created ON orders(status, created_at DESC);
-- Works for: WHERE status = 'completed' AND created_at > x
-- Also works for: WHERE status = 'completed'
-- Does NOT help: WHERE created_at > x (without status)

-- Partial index — index only the rows you query
CREATE INDEX idx_orders_pending ON orders(created_at)
WHERE status = 'pending';
-- Smaller index, faster queries on pending orders

-- Expression index
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
-- Allows: WHERE LOWER(email) = 'rahul@x.com' to use index

-- Covering index — include all needed columns
CREATE INDEX idx_orders_covering ON orders(user_id, status)
INCLUDE (total, created_at);
-- Index-only scan — no heap access needed

-- GIN index for JSONB
CREATE INDEX idx_products_metadata ON products USING GIN(metadata);
-- Allows: WHERE metadata @> '{"category": "electronics"}'
```

### Query Optimization Patterns

```sql
-- N+1 problem in SQL
-- BAD: N queries for N users
SELECT * FROM orders WHERE user_id = 1;
SELECT * FROM orders WHERE user_id = 2;
...

-- GOOD: 1 query
SELECT u.name, o.* FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.id = ANY(ARRAY[1,2,3,...]);

-- Pagination: OFFSET gets slow at scale
-- BAD: OFFSET 100000 LIMIT 10 — reads 100010 rows
SELECT * FROM posts ORDER BY created_at DESC OFFSET 100000 LIMIT 10;

-- GOOD: Cursor-based pagination
SELECT * FROM posts
WHERE created_at < '2024-01-15 10:30:00'  -- cursor from last item
ORDER BY created_at DESC
LIMIT 10;

-- EXISTS vs IN vs JOIN — performance varies
-- EXISTS: stops at first match — fast for large subqueries
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id AND o.total > 1000);

-- Avoid function calls in WHERE (prevents index use)
-- BAD
WHERE DATE(created_at) = '2024-01-15'

-- GOOD
WHERE created_at >= '2024-01-15 00:00:00'
  AND created_at < '2024-01-16 00:00:00'
```

### Window Functions (Advanced Analytics)

```sql
-- Running total
SELECT
  user_id,
  order_date,
  total,
  SUM(total) OVER (PARTITION BY user_id ORDER BY order_date) as running_total
FROM orders;

-- Rank within groups
SELECT
  user_id,
  product_id,
  revenue,
  RANK() OVER (PARTITION BY user_id ORDER BY revenue DESC) as rank
FROM sales;

-- Moving average (last 7 days)
SELECT
  date,
  revenue,
  AVG(revenue) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg
FROM daily_revenue;

-- Lag/Lead — compare with previous/next row
SELECT
  date,
  revenue,
  LAG(revenue, 1) OVER (ORDER BY date) as prev_day_revenue,
  revenue - LAG(revenue, 1) OVER (ORDER BY date) as day_over_day_change
FROM daily_revenue;

-- First/Last value
SELECT
  user_id,
  order_date,
  FIRST_VALUE(order_date) OVER (PARTITION BY user_id ORDER BY order_date) as first_order,
  LAST_VALUE(order_date) OVER (PARTITION BY user_id ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as last_order
FROM orders;
```

---

## 2. Transaction Isolation Levels

```sql
-- The 4 isolation levels (ANSI SQL)
-- READ UNCOMMITTED: See uncommitted changes (dirty read) — avoid
-- READ COMMITTED: Only committed data (default in PostgreSQL) — most common
-- REPEATABLE READ: Same query same results within transaction — good for reports
-- SERIALIZABLE: Transactions run as if serial — strongest, slowest

-- Choose based on consistency needs:
BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- ... queries ...
COMMIT;

-- Dirty Read: Read uncommitted data from another transaction
-- Non-repeatable Read: Same query different results in same transaction
-- Phantom Read: New rows appear in repeated range queries

-- Locking for competitive operations
BEGIN;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE; -- Row lock
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;

-- Advisory locks (application-level locks)
BEGIN;
SELECT pg_advisory_xact_lock(12345); -- Lock on application-defined key
-- Only one process can hold this lock — distributed mutex
COMMIT; -- Lock automatically released
```

---

## 3. MongoDB Advanced Patterns

### Schema Design for Scale

```js
// Pattern 1: Bucket Pattern (for time-series data)
// Instead of one document per event (millions of docs):
const eventBucketSchema = new mongoose.Schema({
  sensorId: String,
  date: Date,                    // Day bucket
  measurements: [{               // Array of measurements
    time: Date,
    value: Number
  }],
  count: Number,                 // How many in this bucket
  avgValue: Number,              // Pre-computed
  minValue: Number,
  maxValue: Number
});

// Pattern 2: Computed Pattern (pre-calculate aggregates)
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  // Pre-computed stats — update on write
  stats: {
    totalReviews: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 }
  }
});

// Update stats on new review
async function addReview(productId, review) {
  await Product.findByIdAndUpdate(productId, {
    $push: { reviews: review },
    $inc: { 'stats.totalReviews': 1 },
    $set: { 'stats.avgRating': newAvgRating }
  });
}

// Pattern 3: Polymorphic Pattern
const notificationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: { type: String, enum: ['email', 'sms', 'push'] },
  // Type-specific fields
  to: String,           // email address or phone
  deviceToken: String,  // push token
  status: String,
  createdAt: Date
});
```

### Aggregation Pipeline Mastery

```js
// Complex analytics pipeline
const salesReport = await Order.aggregate([
  // Stage 1: Filter
  {
    $match: {
      status: 'completed',
      createdAt: { $gte: startDate, $lte: endDate }
    }
  },

  // Stage 2: Lookup (JOIN with products)
  {
    $lookup: {
      from: 'products',
      localField: 'items.productId',
      foreignField: '_id',
      as: 'productDetails'
    }
  },

  // Stage 3: Unwind items array
  { $unwind: '$items' },

  // Stage 4: Add computed fields
  {
    $addFields: {
      revenue: { $multiply: ['$items.price', '$items.quantity'] },
      month: { $month: '$createdAt' },
      year: { $year: '$createdAt' }
    }
  },

  // Stage 5: Group by month
  {
    $group: {
      _id: { year: '$year', month: '$month' },
      totalRevenue: { $sum: '$revenue' },
      orderCount: { $sum: 1 },
      avgOrderValue: { $avg: '$total' },
      uniqueCustomers: { $addToSet: '$userId' }
    }
  },

  // Stage 6: Add computed fields
  {
    $addFields: {
      uniqueCustomerCount: { $size: '$uniqueCustomers' }
    }
  },

  // Stage 7: Sort
  { $sort: { '_id.year': 1, '_id.month': 1 } },

  // Stage 8: Project final shape
  {
    $project: {
      period: {
        $concat: [
          { $toString: '$_id.year' }, '-',
          { $toString: '$_id.month' }
        ]
      },
      totalRevenue: { $round: ['$totalRevenue', 2] },
      orderCount: 1,
      avgOrderValue: { $round: ['$avgOrderValue', 2] },
      uniqueCustomers: '$uniqueCustomerCount'
    }
  }
]);
```

---

## 4. Redis Engineering

### Data Structures in Practice

```js
// Sorted Set — Leaderboard
await redis.zAdd('leaderboard', [
  { score: 9850, value: 'user:123' },
  { score: 9200, value: 'user:456' },
  { score: 8100, value: 'user:789' }
]);

// Top 10
const top10 = await redis.zRange('leaderboard', 0, 9, { REV: true, WITHSCORES: true });

// User rank
const rank = await redis.zRevRank('leaderboard', 'user:123');

// Increment score
await redis.zIncrBy('leaderboard', 150, 'user:123');

// Streams — Event sourcing / activity feeds
await redis.xAdd('activity:user:123', '*', {
  type: 'post_liked',
  postId: '456',
  likedBy: '789',
  timestamp: Date.now()
});

// Read stream
const events = await redis.xRead([
  { key: 'activity:user:123', id: '0' }  // From beginning
], { COUNT: 50 });

// HyperLogLog — Approximate unique count (memory efficient)
await redis.pfAdd('unique_visitors:2024-01-15', userId);
const approxCount = await redis.pfCount('unique_visitors:2024-01-15');
// Approximation within 0.81% error — perfect for analytics

// Bloom Filter (RedisBloom) — Probabilistic membership
await redis.bf.add('seen_emails', email);
const seen = await redis.bf.exists('seen_emails', email);
// False positives possible, false negatives impossible — good for spam prevention
```

### Redis Lua Scripts (Atomic Operations)

```js
// Rate limiting with Lua — atomic, no race conditions
const rateLimitScript = `
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])

local current = redis.call('GET', key)
if current == false then
  redis.call('SET', key, 1)
  redis.call('EXPIRE', key, window)
  return {1, limit}
end

current = tonumber(current)
if current >= limit then
  local ttl = redis.call('TTL', key)
  return {0, ttl}
end

redis.call('INCR', key)
return {current + 1, redis.call('TTL', key)}
`;

async function checkRateLimit(userId, limit = 100, windowSeconds = 60) {
  const key = `ratelimit:${userId}`;
  const [current, info] = await redis.eval(rateLimitScript, 1, key, limit, windowSeconds);

  return {
    allowed: current !== 0,
    current: current || limit,
    remaining: current ? limit - current : 0,
    resetIn: info
  };
}
```

---

## 5. Database Scaling Patterns

### Read Replicas Setup

```js
// Separate read and write connections
const writePool = new Pool({ connectionString: process.env.PRIMARY_DB_URL });
const readPool = new Pool({ connectionString: process.env.REPLICA_DB_URL });

class UserRepository {
  async findById(id) {
    return readPool.query('SELECT * FROM users WHERE id = $1', [id]);
  }

  async findAll(filters) {
    return readPool.query(buildQuery(filters)); // Reads → replica
  }

  async create(data) {
    return writePool.query(                      // Writes → primary
      'INSERT INTO users (...) VALUES (...) RETURNING *',
      [data.name, data.email]
    );
  }

  async update(id, data) {
    return writePool.query(...);                  // Writes → primary
  }
}
```

### Connection Pooling Best Practices

```js
// pg-pool configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // Max connections in pool
  min: 5,                     // Keep 5 always open
  idleTimeoutMillis: 30000,   // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Fail if can't connect in 2s
  maxUses: 7500,              // Rotate connections (prevent leaks)
});

// Monitor pool health
pool.on('connect', (client) => {
  logger.debug('New DB client connected');
});

pool.on('error', (err, client) => {
  logger.error('Unexpected DB client error', err);
});

// Health check
setInterval(async () => {
  const metrics = {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  };

  if (metrics.waitingCount > 5) {
    logger.warn('DB pool pressure detected', metrics);
    await alerting.notify('DB pool under pressure');
  }
}, 30000);
```

---

## Interview Questions — Module 06

**Q: B-tree index kya hai? Kab use karein?**
> B-tree balanced tree structure hai jahan data sorted rehta hai. Equality, range queries, sort operations sab ke liye best. Default PostgreSQL/MySQL index type. Avoid karo: high cardinality write-heavy columns, unordered data frequent updates.

**Q: N+1 query problem kya hai?**
> 1 query se N records fetch karo, phir N more queries individually. Solution: JOIN, populate with projection, DataLoader (GraphQL), eager loading. Most common performance bug in ORM-based apps.

**Q: Read replica kab use karein?**
> Read-heavy workloads jahan eventual consistency acceptable ho. Analytics queries, reporting, search — sab replicas pe. Write-then-read patterns mein careful rehna — replication lag se stale data mil sakta hai. Solution: Write ke baad primary se read karo.

---

## Assignment — Module 06

1. PostgreSQL: EXPLAIN ANALYZE run karo apne existing queries pe — slow ones identify karo, indexes add karo
2. Implement cursor-based pagination (replace offset-based)
3. MongoDB aggregation: Monthly revenue report likhо
4. Redis: Leaderboard implement karo sorted sets se
5. Rate limiter implement karo Redis Lua script se (atomic, distributed)
