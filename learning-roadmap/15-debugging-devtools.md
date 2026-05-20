# Debugging & DevTools — Har Bug Ka Ilaaj

## Mentor Note
Debugging ek skill hai jo experience ke saath aata hai. Lekin kuch fundamentals hain jo aaj se hi apply kar sakte ho. Yeh document tumhe systematic thinker banana chahta hai, random kode mein `console.log` daalne wala nahi.

---

## 1. Debugging Mindset — Pehli Baat

### Real-Life Analogy (Hinglish)
Doctor ki tarah socho. Jab patient aata hai, doctor panic nahi karta. Systematically puchta hai: "Kab se hai? Kahan dard hai? Kya khaya? Pehle kya hua?" Woh diagnose karta hai, guess nahi karta.

Bug aaya? Same approach:
```
Step 1: Reproduce karo — kya consistently hota hai?
Step 2: Isolate karo — kahan ka code hai issue?
Step 3: Understand karo — kyun ho raha hai?
Step 4: Fix karo — minimal, targeted change
Step 5: Verify karo — fix ne kuch aur toh nahi toda?
```

### Golden Rules
```
RULE 1: "Har bug ka ek logical reason hota hai"
        Computer galat nahi karta — code galat hai (ya galat samjha)

RULE 2: "Assumptions mat karo — verify karo"
        "Shayad yeh value aati hogi..." — NAHI! Check karo pehle

RULE 3: "Binary search approach use karo"
        Ek hi jagah mat dekho — problem ko aadha-aadha karo
        "Kya issue pehle wale function mein hai?" YES/NO
        "Toh is specific line tak?" YES/NO...

RULE 4: "Sabse simple explanation pehle socho"
        Complex conspiracy theory mat banao
        Typo? Variable undefined? Wrong API endpoint?
        Simple cheez pehle check karo

RULE 5: "Ek ek change karo"
        Ek saath 5 cheez mat badlo — nahi pata chalega kaun si fix ne kaam kiya
```

---

## 2. Browser DevTools — Tumhara Sabse Bada Weapon

### DevTools kaise kholo
```
Windows/Linux: F12 ya Ctrl+Shift+I
Mac:           Cmd+Option+I
Right-click pe: "Inspect" ya "Inspect Element"
```

### Elements Tab — DOM Inspector
```
Kab use karo:
- CSS debugging (layout issues, spacing, colors)
- HTML structure verify karna
- Live CSS changes test karna

Tips:
- Element pe right-click → "Inspect" — directly woh element pe jump karega
- "Force State" — :hover, :focus states manually trigger karo testing ke liye
- Computed tab — final applied CSS values dekhne ke liye
- Box model visual — margin, padding, border clearly dikhta hai
```

### Console Tab — Messages aur Interaction
```javascript
// Console mein directly JavaScript likh sakte ho
// DOM interact karo
document.querySelector('.header').style.backgroundColor = 'red';

// Current page ka data check karo
localStorage.getItem('authToken');

// Network requests manually test karo
fetch('/api/notes').then(r => r.json()).then(console.log);

// Koi bhi variable ya object inspect karo
$0 // Last selected element DevTools mein
```

---

## 3. Console Methods — Sahi Tool Sahi Kaam ke liye

```javascript
// ===== console.log — General purpose =====
console.log('Simple message');
console.log('User:', user, 'Token:', token); // Multiple values
console.log({ userId, productId, quantity }); // Object shorthand — labels automatic

// ===== console.error — Errors ke liye (red mein dikhta hai) =====
try {
  await fetchUserData(userId);
} catch (error) {
  console.error('User data fetch fail hua:', error);
  // Stack trace automatically dikhega
}

// ===== console.warn — Warnings (yellow mein) =====
if (process.env.NODE_ENV === 'development') {
  console.warn('Yeh function deprecated hai — nayi wali use karo');
}

// ===== console.table — Arrays/Objects ko table format mein =====
const users = [
  { id: 1, name: 'Rahul', role: 'admin' },
  { id: 2, name: 'Priya', role: 'user' },
  { id: 3, name: 'Amit', role: 'user' },
];
console.table(users); // Bahut readable format!

// Specific columns chahiye toh:
console.table(users, ['name', 'role']); // Sirf yeh columns dikhao

// ===== console.group — Related logs group karo =====
function processOrder(order) {
  console.group(`Order #${order.id} Processing`); // Group start
  console.log('Items:', order.items);
  console.log('Total:', order.total);
  console.log('User:', order.userId);
  if (order.discount) {
    console.group('Discount Details'); // Nested group
    console.log('Code:', order.discount.code);
    console.log('Amount:', order.discount.amount);
    console.groupEnd();
  }
  console.groupEnd(); // Group end
}

// ===== console.time — Performance measure karo =====
console.time('Data Processing'); // Timer shuru
const processed = massiveArray.map(heavyTransformation);
console.timeEnd('Data Processing'); // Timer end — "Data Processing: 234ms" dikhega

// Multiple timers ek saath
console.time('DB Query');
const users = await db.findAll();
console.timeEnd('DB Query');

console.time('Data Transform');
const transformed = users.map(formatUser);
console.timeEnd('Data Transform');

// ===== console.trace — Call stack dikhao =====
function level3() {
  console.trace('Yahaan se call hua:'); // Poora call stack dikhega
}
function level2() { level3(); }
function level1() { level2(); }
level1();
// Output: level3 -> level2 -> level1 -> ... se call hone ki puri chain

// ===== console.assert — Condition check karo =====
const user = { id: 5, name: 'Test' };
console.assert(user.id > 0, 'User ID positive hona chahiye!', user);
// Agar condition false hai tabhi error dikhega
```

---

## 4. Network Tab — API Calls ka X-Ray

### Network Tab kaise use karein
```
Filter options:
- All       — Sab requests
- XHR/Fetch — Sirf API calls (yeh sabse zyada useful)
- JS        — JavaScript files
- CSS       — Stylesheet files
- Img       — Images

Important columns:
- Name      — Request ka URL
- Status    — HTTP status code (200, 404, 500...)
- Type      — fetch, xhr, document...
- Size      — Response kitna bada
- Time      — Kitna time laga
```

### Har Request mein kya dekho
```
Request pe click karo → Tabs:
┌─────────────────────────────────────────────────────┐
│ Headers Tab:                                        │
│   Request Headers — Tumne kya bheja (Auth token?)  │
│   Response Headers — Server ne kya bheja            │
│   Status Code     — 200/404/401/500                 │
├─────────────────────────────────────────────────────┤
│ Payload Tab:                                        │
│   Request Body    — POST/PUT mein kya data bheja    │
├─────────────────────────────────────────────────────┤
│ Response Tab:                                       │
│   Server ne kya response diya — JSON dekh sakte ho │
├─────────────────────────────────────────────────────┤
│ Timing Tab:                                         │
│   Request kahan time le rahi hai (DNS, Connect...) │
└─────────────────────────────────────────────────────┘
```

### CORS Error kaise identify karein
```
CORS Error console mein aisa dikhta hai:
"Access to fetch at 'https://api.example.com' from origin
'http://localhost:3000' has been blocked by CORS policy"

Network tab mein:
- Request dikhegi lekin red mein hogi
- Response tab empty hoga
- Status "CORS error" dikhega

Solutions:
1. Backend pe CORS headers add karo:
   Access-Control-Allow-Origin: http://localhost:3000
2. Proxy setup karo (development mein)
3. Same origin pe request karo
```

---

## 5. Sources Tab — Breakpoints aur Step-through Debugging

```
Breakpoint lagane ke 3 tarike:
1. Sources tab → file dhundho → line number pe click karo
2. Code mein `debugger;` statement likho — automatically break karega
3. Event Listener Breakpoints — kisi bhi click pe break karo

Breakpoint pe ruke ho toh:
- Step Over (F10)       — Current line execute karo, next pe jao
- Step Into (F11)       — Function ke andar jao
- Step Out  (Shift+F11) — Current function se bahar niklo
- Resume    (F8)        — Agle breakpoint tak jao

Watch Expressions — variables track karo:
- Watch panel mein "+" click karo
- Variable name ya expression likho
- Har step pe value update hogi

Scope panel:
- Local — current function ki variables
- Closure — outer function ki variables
- Global — global variables
```

```javascript
// Practical example — complex bug dhundho
async function processPayment(orderId) {
  const order = await fetchOrder(orderId);
  debugger; // Yahaan rukega — order ki value check karo

  const total = calculateTotal(order.items);
  debugger; // Total sahi calculate hua? Check karo

  const result = await chargeCard(order.userId, total);
  return result;
}

// Isse better: Targeted breakpoints
async function processPayment(orderId) {
  const order = await fetchOrder(orderId);

  // Sirf specific condition pe break karo
  if (order.total > 10000) {
    debugger; // Large orders pe hi rukna hai
  }

  const total = calculateTotal(order.items);
  return await chargeCard(order.userId, total);
}
```

---

## 6. Node.js Debugging — VS Code Setup

### launch.json configure karo
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Node.js App Debug",
      "program": "${workspaceFolder}/src/main.ts",
      "preLaunchTask": "tsc: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "sourceMaps": true,
      "env": {
        "NODE_ENV": "development",
        "PORT": "3000"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "NestJS Debug",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start:debug"],
      "port": 9229,
      "restart": true
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Test Debug",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "test", "--", "--runInBand", "--watchAll=false"],
      "port": 9229,
      "console": "integratedTerminal"
    }
  ]
}
```

```json
// package.json — debug scripts
{
  "scripts": {
    "start:debug": "nest start --debug --watch",
    "start:debug-plain": "node --inspect src/index.js"
  }
}
```

### Node.js mein debugging tips
```javascript
// util.inspect — complex objects print karo (circular reference bhi)
const util = require('util');

const complexObject = {
  user: { profile: { address: { /* deep nesting */ } } },
};

// console.log se better — depth limit nahi hota
console.log(util.inspect(complexObject, {
  depth: null,     // Poori depth dikhao
  colors: true,    // Terminal mein colors
  maxArrayLength: null, // Poora array dikhao
}));

// Error aur stack trace capture karo
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  console.error('Stack:', error.stack);
  // Logs file mein bhi likho production ke liye
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
```

---

## 7. React DevTools — Component aur Performance Debugging

```
Install: Chrome/Firefox extension "React Developer Tools"

Components Tab:
- Component tree dekh sakte ho
- Props aur State real-time mein inspect karo
- Component select karo → right panel mein state/props dikhega
- State directly edit kar sakte ho testing ke liye!

Profiler Tab:
- "Record" click karo → Actions perform karo → "Stop"
- Har render dikhega — kaunsa component, kitna time
- "Flamegraph" — ek render mein sab components
- "Ranked" — sabse slow component pehle

Unnecessary re-renders dhundhna:
- Settings gear icon → "Highlight updates when components render"
- Blue flash — re-render hua
- Baar baar flash ho raha hai — problem hai!
```

```jsx
// React DevTools mein helpful — component name dikhega
// Anonymous arrow functions DevTools mein confusing lagte hain
// BURA:
export default () => <div>...</div>;       // DevTools mein: "Anonymous"
const List = memo(() => <ul>...</ul>);      // DevTools mein: "Anonymous"

// ACHA:
export default function HomePage() { ... } // DevTools mein: "HomePage"
const NotesList = memo(function NotesList() { ... }); // Clear naam

// useDebugValue — custom hooks mein DevTools mein extra info show karo
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useDebugValue(isOnline ? 'Online' : 'Offline');
  // DevTools mein useOnlineStatus: "Online" dikhega

  return isOnline;
}

// Performance issue dhundho
const ExpensiveComponent = memo(function ExpensiveComponent({ items, onSelect }) {
  // Agar yeh baar baar re-render ho raha hai, toh check karo:
  // 1. Kya parent re-render ho raha hai? (Props change?)
  // 2. Kya onSelect function new reference hai har render pe?
  //    Fix: useCallback use karo parent mein

  console.log('ExpensiveComponent rendered'); // Debugging ke liye
  return (/* ... */);
});
```

---

## 8. Common Error Types — Kaise Padhein

```javascript
// ===== TypeError — Kisi cheez ka type galat hai =====
const user = null;
console.log(user.name); // TypeError: Cannot read properties of null
// Fix: Optional chaining use karo
console.log(user?.name); // undefined — no error

const nums = [1, 2, 3];
nums(); // TypeError: nums is not a function
// Read karo: "nums" is not a function — matlab tum ise function ki tarah call kar rahe ho

// ===== ReferenceError — Variable exist nahi karta =====
console.log(myVariable); // ReferenceError: myVariable is not defined
// Fix: Variable declare karo pehle, ya spelling check karo

// Common ReferenceError causes:
// - Typo: setUser vs setuser
// - Variable block scope se bahar access
// - import bhool gaye

// ===== SyntaxError — Code parse nahi ho sakta =====
// const obj = { name: 'Rahul' // Missing closing brace
// SyntaxError: Unexpected end of input

// JSON.parse error:
JSON.parse('invalid json'); // SyntaxError: Unexpected token 'i'
// Fix: try-catch use karo
try {
  const data = JSON.parse(responseText);
} catch (e) {
  console.error('JSON parse fail hua:', e.message, '\nText tha:', responseText);
}

// ===== NetworkError — HTTP request fail =====
// Console mein: "Failed to fetch" ya "net::ERR_CONNECTION_REFUSED"
// Check karo:
// 1. Server chal raha hai? (localhost:3000 pe?)
// 2. URL sahi hai? Typo toh nahi?
// 3. Network tab mein request dekho

// ===== Error stack trace kaise padhein =====
/*
Error: Cannot read properties of undefined (reading 'id')
    at processUser (app.js:45:22)    ← Yahaan error tha
    at handleRequest (app.js:23:5)   ← Isko call kiya tha
    at Layer.handle (router.js:95:5) ← Express ka code
    at next (router.js:137:13)

Reading approach:
1. Error message padhо: "Cannot read properties of undefined (reading 'id')"
   → Koi undefined object ka .id property access kiya
2. First line of YOUR code: processUser (app.js:45:22)
   → app.js ki line 45, character 22 pe dekho
3. Woh line kya hai? → probably: return user.id; jahan user undefined hai
*/
```

---

## 9. Async Code Debugging

```javascript
// Problem: Promise chain mein error kahan se aaya?
fetchUser(id)
  .then(user => fetchUserPosts(user.id))
  .then(posts => processAllPosts(posts))
  .then(processed => saveToDb(processed))
  .catch(err => console.error('Kuch toh gadbad hai:', err)); // Kahan se?

// Better approach: Named functions aur specific error handling
async function loadUserDashboard(userId) {
  // Har step pe try-catch se exact jagah pata chalegi
  let user;
  try {
    user = await fetchUser(userId);
  } catch (err) {
    console.error(`fetchUser fail hua userId: ${userId}`, err);
    throw err;
  }

  let posts;
  try {
    posts = await fetchUserPosts(user.id);
  } catch (err) {
    console.error(`fetchUserPosts fail hua userId: ${user.id}`, err);
    throw err;
  }

  return { user, posts };
}

// Promise.all mein error handling
async function fetchMultipleThings() {
  try {
    // Dono parallel mein chalenge
    const [users, products] = await Promise.all([
      fetchUsers(),
      fetchProducts(),
    ]);
    return { users, products };
  } catch (err) {
    // Problem: Nahi pata kaun sa fail hua
    console.error('Kuch fail hua:', err);
  }
}

// Better: Promise.allSettled use karo
async function fetchMultipleSafely() {
  const results = await Promise.allSettled([
    fetchUsers(),
    fetchProducts(),
  ]);

  results.forEach((result, index) => {
    const name = ['fetchUsers', 'fetchProducts'][index];
    if (result.status === 'rejected') {
      console.error(`${name} fail hua:`, result.reason);
    } else {
      console.log(`${name} success:`, result.value);
    }
  });
}

// Async stack traces — Chrome mein enable karo
// DevTools → Settings → Enable async stack traces
// Ab Promise chain ka poora history dikhega
```

---

## 10. API Issues Debugging — Network Tab + Postman

```javascript
// Step 1: Browser Network Tab mein request check karo
// Request pe click karo:
// - Headers tab: Authorization header hai? Sahi format mein?
//   Authorization: Bearer eyJhbGc... ✓
//   Authorization: eyJhbGc...       ✗ (Bearer missing)
// - Payload tab: Body sahi format mein? JSON valid?
// - Response tab: Server ne kya return kiya?

// Step 2: Status codes ki language samjho
/*
200 OK              — Sab theek, data mila
201 Created         — Resource ban gaya (POST success)
204 No Content      — Success, koi data nahi (DELETE success)
400 Bad Request     — Tumhara request galat hai (validation fail)
401 Unauthorized    — Login nahi kiya ya token expired
403 Forbidden       — Login kiya hai but permission nahi
404 Not Found       — Resource nahi mila
409 Conflict        — Duplicate data (email already exists)
422 Unprocessable   — Data format sahi hai but validation fail
429 Too Many Req    — Rate limit exceeded
500 Internal Error  — Server ka bug hai
503 Service Unavail — Server down hai
*/

// Step 3: Request manually banao debugging ke liye
// Browser Console mein:
const response = await fetch('http://localhost:3000/api/notes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
  body: JSON.stringify({
    title: 'Test Note',
    content: 'Debugging ke liye',
  }),
});
const data = await response.json();
console.log('Status:', response.status);
console.log('Response:', data);

// Postman tips:
// - Environments use karo (dev/staging/prod URLs)
// - Pre-request scripts se automatically token inject karo
// - Tests tab mein status code verify karo
// - Response body validate karo
```

---

## 11. Production Debugging — Logs Padhna

```javascript
// Strategic logging — production mein console.log nahi, logger use karo
// npm install winston

const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }), // Error stack trace include karo
    winston.format.json(), // Machine-readable format
  ),
  transports: [
    // Error logs alag file mein
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Sab logs ek file mein
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Development mein console pe bhi dikhao
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Sahi logging kaise karo
async function createOrder(userId, items) {
  // Request start log karo
  logger.info('Order create start', { userId, itemCount: items.length });

  try {
    const order = await orderService.create({ userId, items });

    // Success log — important IDs aur details
    logger.info('Order created successfully', {
      orderId: order.id,
      userId,
      total: order.total,
      itemCount: items.length,
    });

    return order;
  } catch (error) {
    // Error log — enough context ki production mein debug ho sake
    logger.error('Order creation failed', {
      error: error.message,
      stack: error.stack,
      userId,
      items: items.map(i => i.id), // Sensitive data mat log karo
    });

    throw error;
  }
}

// Production logs mein patterns dhundho:
/*
Common patterns:
- "ECONNREFUSED" → Database ya service down hai
- "TimeoutError"  → Slow query ya network timeout
- "ENOMEM"        → Memory full
- 401 spike       → Token expiry issue ya auth bug
- 500 spike       → Code bug, deployment issue
*/
```

---

## 12. Rubber Duck Debugging

### Real-Life Analogy (Hinglish)
Kabhi notice kiya — jab tum kisi ko apni problem samjhane lagte ho toh khud hi solution dikh jaata hai? Isse "Rubber Duck Debugging" kehte hain. Tumhare desk pe ek rubber duck rakh lo aur usse explain karo.

```
Why it works:
- Explain karte waqt tum assume karna band kar dete ho
- "Yeh toh obvious hai" soch ke skip kiya hua logic ab check karta hai
- Doosre ki perspective lene se naya angle milta hai
- Verbalize karne se brain alag tarike se process karta hai

Practical steps:
1. Bug kya hai — clearly bol apne aap ko
2. Expected behavior kya hai — "Yeh hona chahiye tha..."
3. Actual behavior kya hai — "Lekin ho kya raha hai..."
4. Code line by line explain karo — "Yahaan main yeh kar raha hoon..."
5. Kahin inconsistency aayegi — bug mil jaayega

Team mein bhi apply karo:
- Kisi ko sirf explain karna shuru karo
- "Ek minute — mujhe samajh aa gaya!" — common experience
- Junior developer se poochho — unhe explain karte waqt bug milta hai

Online resources bhi rubber duck ki tarah:
- StackOverflow pe question likhna
- GitHub issue banana
- Sirf likhne ki process mein bug samajh aata hai
```

---

## Common Debugging Mistakes

```
1. Random console.log daal ke guess karna
   Fix: Systematic approach — pehle reproduce, phir isolate

2. "Code sahi hai, kuch aur problem hoga"
   Fix: Code hi wrong hai — assumptions hatao, verify karo

3. Ek saath kai cheez badalna
   Fix: Ek change, test, confirm, phir agla change

4. Error message na padhna — sirf red color dekh ke panic
   Fix: Error message mein exact information hoti hai — padhо

5. Cache clear nahi karna
   Fix: Hard refresh (Ctrl+Shift+R), DevTools Network tab mein
        "Disable cache" checkbox tick karo

6. Wrong environment check karna
   Fix: "Kya main production API hit kar raha hoon localhost pe?"
        Har request ki URL Network tab mein check karo

7. JWT token ka expiry nahi check karna
   Fix: jwt.io pe token paste karo — payload aur expiry check karo

8. Async/await ke saath missing await
   Fix: [object Promise] dikh raha hai? Missing await!
   const user = fetchUser(); // Promise
   const user = await fetchUser(); // Actual data
```

---

## Interview Questions & Answers

**Q1: Production mein bug report aaya hai jo local pe reproduce nahi ho raha — kya karoge?**
A: Pehle logs check karunge — error message, stack trace, timestamp. Phir user ka specific scenario samjhunga — kaun sa browser, kya data. Environment differences check karunga — production mein different env vars, different data. Console errors screenshot maangunga. Sirf production mein aane wale bugs often environment-specific hote hain — check karoo: env vars sahi hain? Database connection? Third-party service?

**Q2: React component unnecessarily re-render ho raha hai — kaise fix karoge?**
A: React DevTools Profiler chalaunga — "Highlight updates" enable karke kaunsa component re-render ho raha hai dekhuga. Phir parent se aane wale props check karunga — kya object/array har render pe naya create ho raha hai? Fix: useMemo for objects/arrays, useCallback for functions, React.memo for component. Context use ho raha hai toh context split karunga.

**Q3: API 200 return kar raha hai but data wrong hai — debugging approach?**
A: Network tab mein request aur response dono check karunga. Request headers mein auth token sahi? Request body exactly woh data hai jo chahiye? Response body mein kya data aa raha hai — expected format mein? Phir backend logs check karunga — server side pe kya receive hua? Database mein actual data kya hai? Systematic elimination karo.

**Q4: `console.log(obj)` mein sab sahi dikhta hai but later access karne pe undefined hai — kyun?**
A: Yeh async issue ya object mutation issue hai. `console.log` object ka live reference dikhata hai — baad mein change hone pe updated value dikhega. Fix: `console.log(JSON.parse(JSON.stringify(obj)))` — snapshot lo. Ya `console.log({...obj})` — spread karo. Async case mein await check karo.

---

## Assignment

**Task: Systematically ek buggy app debug karo**

Yeh bugs fix karo ek sample app mein:

```javascript
// Bug 1: TypeError
async function getUserProfile(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const data = response.json(); // Bug here
  return data.profile.avatar;  // Bug here
}

// Bug 2: Race condition
function SearchResults() {
  const [results, setResults] = useState([]);

  const search = async (query) => {
    const data = await searchApi(query); // Fast aur slow dono possible
    setResults(data); // Purana result naye result ke baad aa sakta hai!
  };
}

// Bug 3: Stale closure
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1); // Bug: count always 0 rahega!
    }, 1000);
    return () => clearInterval(timer);
  }, []); // Bug: missing dependency

  return <div>{count}</div>;
}
```

**Required deliverables:**
1. Har bug identify karo aur explain karo kya galat hai
2. Fix likho aur explain karo kyun yeh fix kaam karega
3. Ek `launch.json` banao apne project ke liye VS Code debugging ke liye
4. Production ke liye winston logger setup karo apni NestJS app mein
5. React DevTools se apni app mein ek unnecessary re-render dhundho aur fix karo

**Bonus:**
- Custom error boundary component banao React mein
- StackOverflow question format mein ek bug report likho (reproducible example ke saath)
- Error monitoring ke liye Sentry integrate karo (free tier available)
