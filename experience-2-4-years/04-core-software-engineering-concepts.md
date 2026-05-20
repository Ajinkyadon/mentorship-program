# Module 04: Core Software Engineering Concepts
### "Ye woh concepts hain jo senior engineers ko junior se alag karte hain"

---

## 1. Clean Architecture

**Goal: Code jo change hone pe break nahi karta.**

```
Dependency Rule:
Inner layers know nothing about outer layers.

         [Entities / Domain]
               ↑
      [Use Cases / Application]
               ↑
    [Interface Adapters / Controllers]
               ↑
  [Frameworks & Drivers / Infrastructure]

Dependencies point INWARD only.
Database, Express, external APIs — all at the outer ring.
Business logic at the center — framework-independent.
```

### Practical Implementation

```
src/
├── domain/              ← Pure business entities
│   ├── User.js
│   └── Order.js
├── application/         ← Use cases (business logic)
│   ├── CreateUser.js
│   └── ProcessOrder.js
├── infrastructure/      ← DB, email, external APIs
│   ├── UserRepository.js
│   └── EmailService.js
└── interfaces/          ← HTTP, CLI, GraphQL adapters
    └── http/
        ├── routes/
        └── controllers/
```

```js
// domain/User.js — Pure business entity, no framework dependency
class User {
  constructor({ id, name, email, role }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }

  canAccessAdmin() {
    return this.role === 'admin';
  }

  isActive() {
    return this.status === 'active';
  }
}

// application/CreateUser.js — Use case, depends on abstraction not implementation
class CreateUserUseCase {
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;  // Interface, not concrete class
    this.emailService = emailService;
  }

  async execute({ name, email, password }) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new Error('Email already registered');

    const hashedPassword = await hashPassword(password);
    const user = await this.userRepository.create({ name, email, hashedPassword });

    await this.emailService.sendWelcome(user);
    return user;
  }
}

// infrastructure/MongoUserRepository.js — Concrete implementation
class MongoUserRepository {
  async findByEmail(email) { return User.findOne({ email }); }
  async create(data) { return User.create(data); }
}

// Composition root (index.js)
const userRepo = new MongoUserRepository();
const emailSvc = new NodemailerEmailService();
const createUser = new CreateUserUseCase(userRepo, emailSvc);
```

---

## 2. SOLID Principles — Production Examples

### Single Responsibility (S)
```js
// Bad: Controller doing too much
class UserController {
  async register(req, res) {
    const { name, email, password } = req.body;
    // Validation logic
    if (!email.includes('@')) return res.status(400).json({ error: 'Invalid email' });
    // Business logic
    const hashedPw = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPw });
    // Email logic
    await sendEmail(email, 'Welcome!', `Hi ${name}`);
    // Response
    res.status(201).json(user);
  }
}

// Good: Separated responsibilities
class UserController {
  constructor(userService) { this.userService = userService; }

  async register(req, res, next) {
    try {
      const user = await this.userService.register(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (err) { next(err); }
  }
}

class UserService {
  constructor(userRepo, emailService, passwordService) { ... }

  async register(data) {
    this.validateRegistration(data);
    const hashedPassword = await this.passwordService.hash(data.password);
    const user = await this.userRepo.create({ ...data, password: hashedPassword });
    await this.emailService.sendWelcome(user);
    return user;
  }
}
```

### Open/Closed (O)
```js
// Bad: Adding new payment method = modify existing class
class PaymentProcessor {
  process(method, amount) {
    if (method === 'stripe') { /* stripe logic */ }
    else if (method === 'razorpay') { /* razorpay logic */ }
    // Every new method = modify this file — risky!
  }
}

// Good: Extend without modifying
class StripeProcessor {
  async process(amount, currency) { /* stripe */ }
}

class RazorpayProcessor {
  async process(amount, currency) { /* razorpay */ }
}

class PaymentService {
  constructor(processors) { this.processors = processors; }

  async process(provider, amount, currency) {
    const processor = this.processors[provider];
    if (!processor) throw new Error(`Unknown provider: ${provider}`);
    return processor.process(amount, currency);
  }
}

// New payment method = new class, no existing code change
```

### Dependency Inversion (D)
```js
// Bad: High-level depends on low-level implementation
class OrderService {
  async getOrders(userId) {
    return mongoose.model('Order').find({ userId }); // Tight coupling to MongoDB
  }
}

// Good: Depend on abstraction
class OrderService {
  constructor(orderRepository) {
    this.orderRepository = orderRepository; // Interface
  }

  async getOrders(userId) {
    return this.orderRepository.findByUser(userId);
  }
}

// Can swap MongoDB → PostgreSQL without changing OrderService
```

---

## 3. Design Patterns (Most Used in Backend)

### Repository Pattern
```js
// Abstract the data layer
class UserRepository {
  async findById(id) { throw new Error('Not implemented'); }
  async findByEmail(email) { throw new Error('Not implemented'); }
  async create(data) { throw new Error('Not implemented'); }
  async update(id, data) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
}

class MongoUserRepository extends UserRepository {
  async findById(id) {
    return UserModel.findById(id).lean();
  }
  async findByEmail(email) {
    return UserModel.findOne({ email: email.toLowerCase() }).lean();
  }
  async create(data) {
    return UserModel.create(data);
  }
  async update(id, data) {
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  }
  async delete(id) {
    return UserModel.findByIdAndDelete(id);
  }
}
```

### Factory Pattern
```js
// Create objects without specifying exact class
class NotificationFactory {
  static create(type, config) {
    switch (type) {
      case 'email':   return new EmailNotification(config);
      case 'sms':     return new SmsNotification(config);
      case 'push':    return new PushNotification(config);
      case 'webhook': return new WebhookNotification(config);
      default: throw new Error(`Unknown notification type: ${type}`);
    }
  }
}

// Usage
const notification = NotificationFactory.create(user.preferredChannel, config);
await notification.send(message);
```

### Observer Pattern (Event-Driven)
```js
const EventEmitter = require('events');

class UserEventEmitter extends EventEmitter {}
const userEvents = new UserEventEmitter();

// Listeners (decoupled)
userEvents.on('user.registered', async (user) => {
  await emailService.sendWelcome(user);
});

userEvents.on('user.registered', async (user) => {
  await analyticsService.track('registration', { userId: user.id });
});

userEvents.on('user.registered', async (user) => {
  await notificationService.createDefaultPreferences(user.id);
});

// Emitter (decoupled from side effects)
class UserService {
  async register(data) {
    const user = await this.userRepo.create(data);
    userEvents.emit('user.registered', user);  // Doesn't know who listens
    return user;
  }
}
```

### Strategy Pattern
```js
// Interchangeable algorithms
class DataExporter {
  constructor(strategy) { this.strategy = strategy; }

  export(data) { return this.strategy.export(data); }
}

class JsonExportStrategy {
  export(data) { return JSON.stringify(data, null, 2); }
}

class CsvExportStrategy {
  export(data) {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  }
}

// Usage — strategy swappable at runtime
const exporter = new DataExporter(
  req.query.format === 'csv' ? new CsvExportStrategy() : new JsonExportStrategy()
);
res.send(exporter.export(data));
```

### Middleware/Chain of Responsibility
```js
// Request processing pipeline
class RequestPipeline {
  constructor() { this.middlewares = []; }

  use(fn) {
    this.middlewares.push(fn);
    return this;
  }

  async execute(context) {
    let index = 0;
    const next = async () => {
      if (index < this.middlewares.length) {
        await this.middlewares[index++](context, next);
      }
    };
    await next();
  }
}

const pipeline = new RequestPipeline()
  .use(authenticate)
  .use(authorize('admin'))
  .use(validateInput)
  .use(rateLimit)
  .use(processRequest);
```

---

## 4. Scalability Patterns

### Horizontal Scaling + Statelessness

```
Stateful (bad for scaling):
Session stored on server A
→ User request hits server B
→ Session not found → 401!

Stateless (good for scaling):
JWT token in each request
→ Any server can verify independently
→ Add 10 servers → All work equally

Rule: Keep application servers stateless.
State goes in: Database, Redis, S3 — not in memory.
```

### Caching Strategies

```
Cache-Aside (Lazy Loading):
Application checks cache → Miss? Load from DB → Store in cache
Pros: Only cache what's needed
Cons: Initial cache miss, race conditions possible

Write-Through:
Write to cache AND DB simultaneously
Pros: Cache always fresh
Cons: Write latency, unused data cached

Write-Behind (Write-Back):
Write to cache → async write to DB
Pros: Fast writes
Cons: Data loss risk if cache fails before DB write

Read-Through:
Cache itself loads from DB on miss
Pros: Application logic simpler
Cons: Cache library complexity

TTL + Event-Based Invalidation (Recommended hybrid):
→ Short TTL for eventual consistency
→ Explicit invalidation on write
→ Best of both worlds
```

### Rate Limiting Algorithms

```
Token Bucket:
- N tokens added per time unit
- Each request consumes a token
- Empty = 429
- Allows bursts up to bucket size
- Good for: APIs with burst tolerance

Sliding Window:
- Track requests in rolling time window
- More accurate than fixed window
- No boundary burst attack
- Good for: Strict rate limiting

Fixed Window:
- Simple counter per time window
- Boundary vulnerability (2x burst at window edge)
- Easiest to implement
- Good for: Simple use cases

Leaky Bucket:
- Queue requests, process at fixed rate
- Smooths out traffic spikes
- Good for: Rate-limited downstream APIs
```

### Circuit Breaker Pattern

```js
class CircuitBreaker {
  constructor(fn, options = {}) {
    this.fn = fn;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.successCount = 0;
    this.threshold = options.threshold || 5;
    this.resetTimeout = options.resetTimeout || 60000;
    this.lastFailureTime = null;
  }

  async execute(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await this.fn(...args);
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
    }
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}

// Usage
const breaker = new CircuitBreaker(callExternalPaymentAPI, {
  threshold: 5,
  resetTimeout: 30000
});

try {
  const result = await breaker.execute(paymentData);
} catch (err) {
  if (err.message.includes('Circuit breaker')) {
    return res.status(503).json({ error: 'Payment service temporarily unavailable' });
  }
  throw err;
}
```

---

## 5. Idempotency

**Idempotent operation = Same request N times → Same result as 1 time.**

```
Why it matters:
- Network retries can cause duplicate payments
- Queue reprocessing can cause duplicate emails
- Client retries can cause duplicate records

Idempotency Key Pattern:
Client sends unique key with each request
Server: "Have I processed this key before?"
  → Yes: Return cached response
  → No: Process + cache response
```

```js
// Idempotency middleware for payments
async function idempotencyMiddleware(req, res, next) {
  const key = req.headers['idempotency-key'];
  if (!key) return next(); // Optional for GET requests

  const cached = await redis.get(`idempotency:${key}`);
  if (cached) {
    const { statusCode, body } = JSON.parse(cached);
    return res.status(statusCode).json(body);
  }

  // Capture response
  const originalJson = res.json.bind(res);
  res.json = async (body) => {
    await redis.setEx(
      `idempotency:${key}`,
      24 * 60 * 60, // 24 hours
      JSON.stringify({ statusCode: res.statusCode, body })
    );
    originalJson(body);
  };

  next();
}
```

---

## 6. Retry Mechanisms

```js
async function retryWithBackoff(fn, options = {}) {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    factor = 2,
    jitter = true,
    retryOn = (err) => err.status >= 500 || err.code === 'ECONNRESET'
  } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts || !retryOn(err)) throw err;

      let delay = Math.min(initialDelay * Math.pow(factor, attempt - 1), maxDelay);
      if (jitter) delay = delay * (0.5 + Math.random() * 0.5); // Prevent thundering herd

      console.warn(`Attempt ${attempt} failed, retrying in ${Math.round(delay)}ms`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// Usage
const result = await retryWithBackoff(
  () => externalAPI.call(data),
  { maxAttempts: 3, initialDelay: 500 }
);
```

---

## 7. Data Consistency Patterns

### Eventual Consistency
```
Strong consistency: All reads see latest write immediately
Eventual consistency: All reads will EVENTUALLY see latest write

Use eventual consistency when:
- High availability needed over perfect consistency
- Geographic distribution (multi-region)
- Performance critical

Example: User profile update → Shows old data to some users for 100ms → Acceptable
Example: Bank balance → Must be strongly consistent → Not acceptable for eventual
```

### Outbox Pattern (Reliable Event Publishing)
```
Problem:
Save to DB + Publish event → What if event publish fails after DB save?

Solution: Outbox table
1. Save data + save event to outbox table (same transaction)
2. Background worker reads outbox → publishes events
3. On success: mark outbox record processed

-- In same transaction:
BEGIN;
INSERT INTO orders VALUES (...);
INSERT INTO outbox VALUES ('order.created', {...});
COMMIT;

-- Background worker:
SELECT * FROM outbox WHERE processed = false;
-- For each: publish event → mark processed
```

---

## 8. High Availability Patterns

```
Zero-downtime deployment:
Blue-Green:
  → Run two identical production environments
  → Route traffic to Blue, deploy to Green
  → Switch traffic to Green
  → Blue becomes standby

Rolling deployment:
  → Update instances one by one
  → Old + new version run simultaneously briefly
  → Faster than blue-green, slight overlap risk

Canary deployment:
  → New version to 5% of traffic
  → Monitor metrics
  → Gradually increase to 100%
  → Best for high-risk changes

Feature flags:
  → Deploy code without enabling feature
  → Enable for % of users
  → Instant rollback = disable flag
```

---

## Interview Questions — Module 04

**Q: SOLID principles explain karo with a real example.**
> S: One responsibility per class — UserService handles user logic, not emails. O: Add new payment methods by creating new classes, not modifying existing. L: Subclasses should work wherever parent class works. I: Small focused interfaces instead of one large interface. D: Depend on abstractions — inject UserRepository interface, not MongoDB directly.

**Q: Circuit breaker kya hai aur kab use karein?**
> Circuit breaker external service calls protect karta hai. CLOSED = normal, OPEN = fast fail (service down), HALF_OPEN = test recovery. Use karo jab external API unreliable ho — prevents cascading failures, gives failing service time to recover.

**Q: Idempotency kyun important hai payments mein?**
> Network failures pe client retry karta hai. Bina idempotency: duplicate payment ho sakta hai. Idempotency key se server same request ignore karta hai — same response return karta hai without re-processing.

---

## Assignment — Module 04

1. Apne current project ka ek controller lo — SOLID violations identify karo, refactor karo
2. Repository pattern implement karo apne existing code pe
3. Circuit breaker implement karo kisi external API call ke liye
4. Retry with exponential backoff + jitter implement karo
