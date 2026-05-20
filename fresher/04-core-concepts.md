# Module 4: Core Concepts Every Developer Should Know
### "Language change hoti hai, concepts nahi"

---

Ye concepts language-agnostic hain. JavaScript mein examples hain but same ideas Python, Java, Go, aur kisi bhi language mein apply hoti hain.

---

## 1. Variables & Data Types

**Variable = Data ka naam.**

```js
let name = "Rahul";          // String
let age = 22;                // Number
let isStudent = true;        // Boolean
let score = null;            // Null — intentionally empty
let address;                 // Undefined — not assigned yet
let user = { name: "Rahul" };// Object
let marks = [85, 90, 78];    // Array
```

**Key rules:**
- `const` — kabhi change nahi hoga (prefer karo)
- `let` — change ho sakta hai
- `var` — avoid (scope issues)

---

## 2. Functions

**Function = Ek kaam karne wali machine.**

```js
// Ek kaam karo (single responsibility)
function calculateTax(salary) {
  return salary * 0.3;
}

// Pure function — same input → same output, no side effects
function add(a, b) {
  return a + b;
}

// Arrow function
const multiply = (a, b) => a * b;
```

**Good function habits:**
- Ek function, ek kaam
- Meaningful name — `getUserById` nahi `getData`
- Chhota rakho — 20 lines se zyada → split karo

---

## 3. Loops

**Loop = Ek kaam baar baar karna.**

```js
const students = ["Rahul", "Priya", "Amit"];

// for loop
for (let i = 0; i < students.length; i++) {
  console.log(students[i]);
}

// for...of (preferred for arrays)
for (const student of students) {
  console.log(student);
}

// forEach
students.forEach(student => console.log(student));

// while — condition true ho tab tak
let count = 0;
while (count < 3) {
  console.log(count);
  count++;
}
```

---

## 4. Arrays

**Array = Ordered list of items.**

```js
const fruits = ["mango", "banana", "apple"];

// Add/Remove
fruits.push("guava");          // end mein add
fruits.pop();                  // end se remove
fruits.unshift("kiwi");        // start mein add
fruits.shift();                // start se remove

// Transform (original nahi badalta)
const upper = fruits.map(f => f.toUpperCase());
const long = fruits.filter(f => f.length > 5);
const total = [1,2,3].reduce((sum, n) => sum + n, 0);

// Find
const found = fruits.find(f => f === "mango");
const idx = fruits.indexOf("banana");
const exists = fruits.includes("apple");

// Sort
fruits.sort();                           // alphabetical
[3,1,2].sort((a, b) => a - b);          // numeric ascending
```

---

## 5. Objects

**Object = Key-value pairs. Real world ko represent karta hai.**

```js
const user = {
  id: 1,
  name: "Priya Sharma",
  age: 22,
  city: "Pune",
  isActive: true
};

// Access
user.name;          // "Priya Sharma"
user["city"];       // "Pune"

// Add/Update/Delete
user.email = "priya@example.com";
user.age = 23;
delete user.isActive;

// Iterate
Object.keys(user);          // ["id", "name", "age", ...]
Object.values(user);        // [1, "Priya", 23, ...]
Object.entries(user);       // [["id",1], ["name","Priya"], ...]

// Destructuring
const { name, city } = user;

// Spread
const updated = { ...user, age: 24 };
```

---

## 6. OOP Concepts (Object-Oriented Programming)

**Real world cheezein code mein model karna.**

### 4 Pillars of OOP

**Encapsulation** — Data aur methods ek saath band karna
```js
class BankAccount {
  #balance = 0;                     // private field

  deposit(amount) { this.#balance += amount; }
  withdraw(amount) {
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
  }
  getBalance() { return this.#balance; }
}
```

**Inheritance** — Ek class doosri se properties lete hai
```js
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a sound`; }
}

class Dog extends Animal {
  speak() { return `${this.name} barks`; }  // override
}

const dog = new Dog("Bruno");
dog.speak(); // "Bruno barks"
```

**Polymorphism** — Same method, alag behavior
```js
class Shape {
  area() { return 0; }
}

class Circle extends Shape {
  constructor(r) { super(); this.r = r; }
  area() { return Math.PI * this.r ** 2; }
}

class Rectangle extends Shape {
  constructor(w, h) { super(); this.w = w; this.h = h; }
  area() { return this.w * this.h; }
}

// Same method call, different result
[new Circle(5), new Rectangle(4, 6)].forEach(s => console.log(s.area()));
```

**Abstraction** — Complexity hide karna, simple interface dikhana
```js
class EmailService {
  send(to, subject, body) {
    // Complex SMTP logic andar hai
    // User sirf send() call karta hai
  }
}
```

---

## 7. Async Programming

**JavaScript single-threaded hai — ek time pe ek kaam.**

Async programming allow karta hai waiting time mein doosra kaam karna.

```js
// Synchronous — blocking
const data = readFileSynchronously('file.txt');  // wait karo
console.log(data);
doOtherWork();  // yahan tab tak nahi pahunche

// Asynchronous — non-blocking
readFileAsync('file.txt', (data) => {
  console.log(data);
});
doOtherWork();  // ye immediately run hoga
```

### Promise Chain
```js
fetchUser(userId)
  .then(user => fetchOrders(user.id))
  .then(orders => processOrders(orders))
  .catch(err => handleError(err));
```

### Async/Await (Cleaner)
```js
async function getUserOrders(userId) {
  try {
    const user = await fetchUser(userId);
    const orders = await fetchOrders(user.id);
    return processOrders(orders);
  } catch (err) {
    handleError(err);
  }
}
```

---

## 8. APIs & HTTP Methods

**API = Contract between frontend and backend.**

```
GET    → Data lao (Read)
POST   → Naya data banao (Create)
PUT    → Poora record update karo
PATCH  → Kuch fields update karo
DELETE → Record hatao
```

### HTTP Status Codes (Must Know)
```
200 OK              → Success
201 Created         → Naya resource bana
400 Bad Request     → Client ne galat data bheja
401 Unauthorized    → Login nahi hai
403 Forbidden       → Login hai but permission nahi
404 Not Found       → Resource exist nahi karta
409 Conflict        → Duplicate (email already exists)
422 Unprocessable   → Validation failed
500 Server Error    → Backend mein kuch toot gaya
```

---

## 9. Authentication vs Authorization

```
Authentication: "Tu kaun hai?"
→ Login/Register
→ Verify identity (password, OTP, biometric)

Authorization: "Tu ye kar sakta hai?"
→ Role-based access
→ Admin sab kar sakta hai, User sirf apna data
```

```js
// Authentication middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Login required' });
  req.user = jwt.verify(token, process.env.JWT_SECRET);
  next();
}

// Authorization middleware
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}
```

---

## 10. CRUD Operations

**Har data-driven app mein ye 4 operations hote hain:**

```
C → Create  → POST /users
R → Read    → GET /users or GET /users/:id
U → Update  → PUT /users/:id or PATCH /users/:id
D → Delete  → DELETE /users/:id
```

---

## 11. MVC Architecture

**Code ko organize karne ka tarika.**

```
M → Model      → Data + Database logic
V → View       → UI (frontend ya templates)
C → Controller → Request handle karna, M aur V ko connect karna
```

```
Request aaya
    ↓
Router → correct Controller ko bheja
    ↓
Controller → Model se data maanga
    ↓
Model → Database se data laya
    ↓
Controller → Response ready kiya
    ↓
Response client ko gaya
```

---

## 12. Client-Server Architecture

```
Client (Browser/Mobile App)
    ↕ HTTP Request / Response
Server (Backend Application)
    ↕ Query / Result
Database
```

**Thin client:** Processing server pe hoti hai (traditional web apps)
**Thick client:** Processing client pe hoti hai (React, React Native apps)

---

## 13. State Management

**State = Application ka current data/condition.**

```
Simple cases: Local state (ek component mein)
Medium apps: Context API / simple store
Complex apps: Redux / Zustand / Pinia

Backend mein state:
- Database mein persist hoti hai
- Cache mein temporarily store hoti hai
- JWT mein client-side state hoti hai
```

---

## 14. Caching

**Baar baar same computation/query avoid karna.**

```
Without cache:
User request → Database query (100ms) → Response

With cache:
User request → Cache check → Hit? Return cached (2ms)
                           → Miss? DB query → Store in cache → Return
```

Types:
- **Browser cache** — Static assets (images, CSS)
- **Server cache** — API responses
- **Database cache** — Query results
- **CDN** — Geographic distribution

---

## 15. Error Handling

**Error aana normal hai — unhe gracefully handle karna skill hai.**

```js
// Try-Catch
try {
  const data = JSON.parse(invalidJson);
} catch (err) {
  console.error('Parse failed:', err.message);
  // Graceful fallback
}

// Custom Error Classes
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.statusCode = 400;
  }
}

// Never swallow errors silently
try {
  doSomething();
} catch (err) {
  // Bad — silent
}

try {
  doSomething();
} catch (err) {
  logger.error(err);       // Good — log it
  throw err;               // Or re-throw
}
```

---

## 16. Logging

**Production mein kya ho raha hai — dekhne ke liye logs hote hain.**

```js
// Levels
logger.debug('Variable value:', x);    // Development only
logger.info('User logged in:', userId);// Normal events
logger.warn('High memory usage');      // Potential problems
logger.error('DB connection failed', err); // Errors

// Never log sensitive data
logger.info('Login attempt for:', email);  // OK
logger.info('Password:', password);        // NEVER
```

---

## 17. Security Basics

| Threat | Kya hai | Prevention |
|--------|---------|------------|
| SQL Injection | Malicious SQL via user input | Parameterized queries |
| XSS | Malicious JS in user input | Sanitize + escape output |
| CSRF | Fake requests from other sites | CSRF tokens |
| Brute Force | Try many passwords | Rate limiting |
| Exposed Secrets | API keys in code | `.env` files, never commit |
| Insecure Passwords | Plain text storage | bcrypt hashing |

---

## 18. Clean Code Principles

**SOLID** (simplified for freshers):

- **S** — Single Responsibility: Ek class/function ek kaam
- **O** — Open/Closed: Extend karo, modify mat karo
- **D** — Dependency Inversion: Implementation pe depend mat karo, abstraction pe karo

**DRY** — Don't Repeat Yourself: Same code teen baar likha? Function banao.

**KISS** — Keep It Simple, Stupid: Simple solution pehle. Complex baad mein agar zaruri ho.

**YAGNI** — You Aren't Gonna Need It: Future ke liye code mat likho. Abhi ki zarurat solve karo.

---

## 19. Data Structures & Algorithms (DSA) Basics

**Interview crack karne ke liye ye must hain.**

### Must-Know Data Structures

| Structure | Use Case | Example |
|-----------|----------|---------|
| Array | Ordered list | Todo items |
| HashMap/Object | Fast lookup | User by ID |
| Stack | Undo/redo, call stack | Browser history |
| Queue | Task processing | Print queue |
| Linked List | Dynamic size list | Music playlist |
| Tree | Hierarchical data | File system |
| Graph | Connections | Social network |

### Must-Know Algorithms

| Algorithm | Concept |
|-----------|---------|
| Binary Search | Sorted array mein fast search — O(log n) |
| Two Pointers | Array problems efficiently solve karna |
| Sliding Window | Subarray problems |
| BFS/DFS | Tree/Graph traversal |
| Recursion | Problem ko smaller version pe solve karna |
| Dynamic Programming | Overlapping subproblems + memoization |

---

## 20. Git & GitHub

```bash
# Daily workflow
git status                        # kya changed?
git add src/feature.js            # specific file stage karo
git commit -m "feat: add login"   # commit
git push origin feature/login     # push

# Branching
git checkout -b feature/payment   # naya branch
git merge feature/payment         # merge into main
git pull origin main              # latest changes lao
```

**Commit message format:**
```
feat: add user registration
fix: resolve null pointer in login
docs: update API documentation
refactor: extract validation logic
test: add unit tests for auth service
```

---

## 21. Terminal/CMD Basics

**Ye dev tools ka home hai.**

```bash
# Navigation
pwd                    # current location
ls                     # files list karo
cd projects            # folder mein jao
cd ..                  # parent folder mein jao

# Files
touch index.js         # naya file
mkdir my-project       # naya folder
rm file.js             # file delete (irreversible!)
cp src.js dest.js      # copy
mv old.js new.js       # rename/move

# Useful
cat package.json       # file content dekho
grep "TODO" src/*.js   # text search
| (pipe)               # ek command ka output doosre ko do
```

---

## 22. Testing Basics

**Code test likhna = confidence ki guarantee.**

```js
// Unit test (Jest)
describe('calculateTax', () => {
  test('30% tax on salary', () => {
    expect(calculateTax(100000)).toBe(30000);
  });

  test('zero salary gives zero tax', () => {
    expect(calculateTax(0)).toBe(0);
  });

  test('negative salary throws error', () => {
    expect(() => calculateTax(-1000)).toThrow();
  });
});
```

Types:
- **Unit** — Ek function test karo
- **Integration** — Multiple parts together test karo
- **E2E** — Full flow test karo (like Cypress)

---

## 23. Agile Basics

**Modern software teams Agile follow karti hain.**

```
Waterfall (old):
Plan → Design → Build → Test → Deploy (months/years)

Agile (modern):
Sprint 1 (2 weeks) → Build small → Demo → Feedback
Sprint 2 (2 weeks) → Build more → Demo → Feedback
Sprint 3 → ...
```

**Key terms:**
- **Sprint** — 2-week work cycle
- **Backlog** — To-do list for features
- **Standup** — Daily 15-min meeting (what did you do, what will you do, blockers)
- **Retrospective** — Sprint ke baad what went well/bad

---

## Assignment — Module 4

1. Ek `Student` class banao with `name`, `marks`, methods: `getGrade()`, `isPass()`
2. Ek array of objects (students) pe `map`, `filter`, `reduce` use karke exercises karo
3. Ek simple promise chain banao using `setTimeout`
4. Kisi bhi public API ko fetch karo aur data display karo (async/await)
5. Apne kisi bhi purane code ko clean code principles se refactor karo
