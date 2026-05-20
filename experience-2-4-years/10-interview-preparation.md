# Module 10: Interview Preparation
### "15–40 LPA roles crack karne ka structured plan"

---

## Interview Process for Product Companies

```
Typical rounds:
1. Resume screening / recruiter call (15 min)
2. Online assessment — DSA (90 min)
3. Technical round 1 — DSA + problem solving (60 min)
4. Technical round 2 — System design (60 min)
5. Technical round 3 — JS/Node.js deep dive (45 min)
6. Technical round 4 — Backend architecture / machine coding (60 min)
7. Bar raiser / culture fit (45 min)
8. HR / offer discussion (30 min)
```

---

## DSA Roadmap for Working Professionals

**Total time: 8–10 weeks, 1.5–2 hours/day**

### Week 1–2: Arrays & Strings
```
Core patterns:
- Two pointers
- Sliding window
- Prefix sum
- Kadane's algorithm

Must-solve:
LeetCode: Two Sum, Best Time to Buy Stock, Maximum Subarray,
          Minimum Size Subarray Sum, Longest Substring Without Repeating
          Characters, 3Sum, Trapping Rain Water, Rotate Array
```

### Week 3: HashMap & Sets
```
Core patterns:
- Frequency counting
- Two-pass approach
- Grouping

Must-solve:
LeetCode: Group Anagrams, Top K Frequent Elements, Product of Array
          Except Self, Longest Consecutive Sequence
```

### Week 4: Stack & Queue
```
Core patterns:
- Monotonic stack
- Sliding window maximum

Must-solve:
LeetCode: Valid Parentheses, Daily Temperatures, Largest Rectangle in
          Histogram, Sliding Window Maximum, Design LRU Cache
```

### Week 5: Binary Search
```
Core patterns:
- Classic binary search
- Search on answer (not array)

Must-solve:
LeetCode: Search in Rotated Sorted Array, Find Minimum in Rotated Array,
          Koko Eating Bananas, Find Peak Element, Capacity to Ship Packages
```

### Week 6: Trees
```
Core patterns:
- DFS (pre/in/post order)
- BFS (level order)
- Path problems

Must-solve:
LeetCode: Max Depth, Level Order, Validate BST, LCA, Diameter,
          Binary Tree Maximum Path Sum, Serialize/Deserialize
```

### Week 7: Graphs
```
Core patterns:
- BFS (shortest path)
- DFS (connected components, cycle detection)
- Topological sort

Must-solve:
LeetCode: Number of Islands, Clone Graph, Course Schedule,
          Rotting Oranges, Pacific Atlantic Water Flow
```

### Week 8: Dynamic Programming
```
Core patterns:
- 1D DP (linear states)
- 2D DP (matrix/string problems)
- Intervals

Must-solve:
LeetCode: Climbing Stairs, House Robber, Coin Change, Longest Common
          Subsequence, Edit Distance, Word Break, Partition Equal Subset Sum
```

---

## JavaScript Deep Interview Questions

### Closures & Scope

**Q: Ye code kya output karega?**
```js
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), i * 1000);
}
// Output: 5, 5, 5, 5, 5 — NOT 0,1,2,3,4

// Why: var is function-scoped, closure captures reference
// By the time setTimeout fires, loop is done, i = 5

// Fix 1: let (block-scoped)
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), i * 1000);
}

// Fix 2: IIFE (immediately invoked function expression)
for (var i = 0; i < 5; i++) {
  ((j) => setTimeout(() => console.log(j), j * 1000))(i);
}

// Fix 3: bind
for (var i = 0; i < 5; i++) {
  setTimeout(console.log.bind(null, i), i * 1000);
}
```

### Prototype & Inheritance
```js
// Q: What's the output?
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return `${this.name} speaks`; };

function Dog(name, breed) {
  Animal.call(this, name);  // Call parent constructor
  this.breed = breed;
}
Dog.prototype = Object.create(Animal.prototype); // Set up prototype chain
Dog.prototype.constructor = Dog;
Dog.prototype.bark = function() { return `${this.name} barks!`; };

const dog = new Dog('Bruno', 'Lab');
console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true
console.log(dog.speak());           // "Bruno speaks" (inherited)
console.log(dog.bark());            // "Bruno barks!"
```

### Event Loop Deep Questions
```js
// Q: Order of execution?
async function main() {
  console.log('A');

  await Promise.resolve();
  console.log('B');

  setTimeout(() => console.log('C'), 0);

  await new Promise(resolve => setTimeout(resolve, 0));
  console.log('D');

  console.log('E');
}

main();
console.log('F');

// Answer: A, F, B, C, D, E
// Explanation:
// A — sync, before await
// F — sync, outside main(), continues while main awaits
// B — microtask (Promise.resolve resolves immediately)
// C — macrotask (setTimeout fires before next await)
// D — after setTimeout-based Promise resolves
// E — sync after await
```

---

## Node.js Interview Questions

**Q: Node.js mein CPU-intensive task handle kaise karte ho?**
```
Options:
1. Worker threads (worker_threads module) — true parallelism
2. Child processes — separate process with IPC
3. Cluster module — multiple Node.js processes
4. Offload to external service (Python, separate microservice)
5. Queue it (BullMQ) — process asynchronously

Best answer: Worker threads for CPU tasks in same process.
Child processes for isolation. Never block the event loop.
```

**Q: Node.js memory leak kaise find karte ho?**
```
Tools: clinic.js, heapdump, --inspect flag + Chrome DevTools

Process:
1. clinic doctor -- node app.js (high-level diagnosis)
2. Take heap snapshot before issue
3. Reproduce issue
4. Take heap snapshot after
5. Compare snapshots — find objects that grew
6. clinic flame for CPU profiling

Common causes:
- Global variables accumulating
- Event listeners not removed
- Closure capturing large objects
- Stream/buffer not released
- Setinterval accumulating callbacks
```

**Q: Express middleware order matters kyun?**
```js
// Order is crucial — each middleware calls next()
app.use(cors());         // Must be before routes
app.use(helmet());       // Security headers first
app.use(express.json()); // Parse body before using req.body
app.use(rateLimit());    // Before expensive operations
app.use(authenticate);   // Auth before protected routes
app.use('/api', routes); // Routes after setup
app.use(errorHandler);   // Error handler LAST
// Wrong order = undefined behavior or security issues
```

---

## Backend Architecture Round Questions

**Q: Tumhara current system 10x traffic handle nahi kar sakta — kya karte ho?**
```
Good answer structure:
1. First: Identify bottleneck (don't assume — measure)
   → Load test → Find where it breaks first
   → CPU? Memory? Database? Network?

2. Then: Address specific bottleneck
   → DB bottleneck: Add indexes, read replicas, caching, query optimization
   → App bottleneck: Scale horizontally, optimize hot code paths
   → I/O bottleneck: Connection pooling, async operations, queues

3. Architecture changes:
   → Add caching layer (Redis) for frequent reads
   → Implement queue for async processing
   → Database sharding if single DB is limit
   → CDN for static assets

4. Monitoring:
   → Add metrics to verify improvement
   → Set up alerts for regression

Avoid: "Just use microservices" without bottleneck analysis
```

**Q: Design an API that handles payment processing reliably.**
```
Key concerns:
1. Idempotency: Client retries must not create duplicate charges
   → Idempotency key in header
   → Check before processing
   → Return cached response if duplicate

2. Atomicity: Payment deducted but order not created = problem
   → Database transaction
   → Saga pattern for distributed
   → Outbox pattern for event publishing

3. At-least-once delivery: Payment webhook might fail
   → Webhook retry with exponential backoff
   → Idempotency in webhook handler too

4. Audit trail: Every payment action logged immutably
   → Append-only events table
   → Never update payment records

5. Reconciliation: Catch any discrepancies
   → Scheduled job comparing our DB with payment provider
```

---

## Behavioral Interview Preparation

### STAR Framework
```
Situation: Context set karo
Task: Tumhari responsibility kya thi
Action: Exactly kya kiya tumne
Result: Kya outcome hua (numbers prefer)
```

### Common Questions & Model Answers

**"Tell me about a time you solved a production issue under pressure."**
```
S: "Our e-commerce API response time suddenly went from 200ms to 4 seconds
    at 11 PM, Black Friday eve. 50,000 concurrent users."

T: "I was the on-call engineer. Primary responsibility to restore service."

A: "First, I checked CloudWatch — found specific endpoint /api/cart was slow.
    EXPLAIN ANALYZE showed full table scan on cart_items table. Recent deployment
    had added a new filter condition that bypassed existing index.
    I added a compound index via migration script (online, no downtime).
    Also added Redis caching for cart summary as temporary mitigation."

R: "Response time back to 190ms within 8 minutes.
    Zero revenue impact. Next morning: post-mortem written,
    automated slow query detection added to CI pipeline."
```

**"Describe a technical decision you disagreed with and how you handled it."**
```
S: "Team decided to build a new feature with synchronous API calls to 3 external services."

T: "I was the developer implementing it. I saw reliability issues."

A: "I documented concerns: if any external service fails, our API fails.
    Created a comparison doc: synchronous vs queue-based approach.
    Presented in tech discussion — proposed async queue with fallback.
    Team decided to proceed with sync but add circuit breakers (my suggestion accepted).
    I implemented with proper circuit breakers, retry logic, and timeout handling."

R: "Service handled external failures gracefully. 6 months later — one external
    service had 2-hour downtime. Our service degraded gracefully (cached responses)
    instead of failing completely. Team appreciated the foresight."
```

---

## Resume for Product Companies

```
WRONG approach:
• Worked on backend services using Node.js and Express
• Implemented API endpoints
• Fixed bugs

RIGHT approach:
• Designed and implemented a real-time notification service handling
  500K+ notifications/day, reducing delivery latency by 78% using
  Redis queuing and worker pools
• Optimized PostgreSQL queries via compound indexes and query restructuring,
  reducing p99 API latency from 1.2s to 180ms for payment endpoints
• Architected authentication service with JWT refresh token rotation
  serving 2M+ monthly active users with 99.9% uptime
```

**Rule:** Every bullet = Action + Technical detail + Measurable impact

---

## Salary Negotiation

```
Research market rates:
- Levels.fyi (product companies)
- LinkedIn Salary
- Glassdoor
- AmbitionBox

Negotiation principles:
1. Never give number first — "What's your budget for this role?"
2. Give range (lower = your acceptable, upper = target)
3. "I have competing offers" — always helps leverage
4. Negotiate components: Base + Bonus + ESOPs + joining bonus
5. Get offer in writing before resigning

Example:
Offer: 18 LPA
Counter: "Based on my research and competing interest, I was expecting 22-25 LPA.
         Can you work toward that range?"

ESOPs: Ask vesting schedule (4 years, 1 year cliff is standard)
       Calculate actual value conservatively
```

---

## Assignment — Module 10

1. LeetCode: 5 problems from each weekly plan (total 35 over 8 weeks)
2. Mock DSA interview: 45 min, 2 medium problems — record yourself
3. STAR answers write karo for 5 behavioral questions
4. Resume rewrite karo — every bullet has impact metric
5. System design mock: URL shortener (45 min, no notes)
