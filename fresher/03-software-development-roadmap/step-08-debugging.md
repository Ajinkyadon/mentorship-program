# Step 08: Debugging
### "Error aana developer ki failure nahi, debugging developer ki skill hai"

---

## The Debugging Mindset

```
Wrong approach:
"Ye kaam kyun nahi kar raha?!" → Random changes → Maybe fix

Right approach:
"Ye exactly kahan fail ho raha hai?" → Systematic isolation → Root cause → Fix
```

**The biggest debugging mistake:** Random changes karte rehna bina samjhe. Ek cheez ek baar badlo.

---

## Systematic Debugging Process

```
Step 1: ERROR MESSAGE PADHO — carefully
        → Error type, message, file, line number
        → 80% cases answer yahan hota hai

Step 2: REPRODUCE KARO
        → Consistently reproduce kar sako problem ko
        → Minimum test case dhundho (fewest lines to trigger)

Step 3: ISOLATE KARO
        → Kaun si function/component fail ho rahi hai?
        → Comment out parts to narrow down

Step 4: VERIFY ASSUMPTIONS
        → Console.log — "Ye variable yahan kya value hai?"
        → Assume mat karo, verify karo

Step 5: FIX KARO
        → Root cause samajhke fix karo
        → Symptom fix mat karo

Step 6: TEST KARO
        → Original bug scenario
        → Edge cases
        → Related functionality (regression)

Step 7: UNDERSTAND KARO
        → Kyon hua? Next baar kaise bacho?
```

---

## Reading Error Messages

### Node.js Error Anatomy
```
TypeError: Cannot read properties of undefined (reading 'email')
    at getUserEmail (/src/utils/user.js:15:18)
    at processUser (/src/controllers/userController.js:42:22)
    at Layer.handle [as handle_request] (/node_modules/express/lib/router/layer.js:95:5)
    at next (/node_modules/express/lib/router/route.js:137:13)
    ...

Parse this:
Error Type: TypeError
Message:    Cannot read properties of undefined (reading 'email')
            → Koi undefined object hai jis pe .email access kiya
File:       /src/utils/user.js
Line:       15, Column 18

Action:
→ user.js line 15 pe jao
→ Dekho kya undefined hai aur kyon
```

### Common Error Types

**TypeError:**
```js
// Kisi undefined/null pe property access ya method call
const user = null;
user.email;        // TypeError: Cannot read properties of null
user.getName();    // TypeError: Cannot read properties of null (reading 'getName')

// Wrong type pe method call
const age = "22";
age.toFixed(2);    // TypeError: age.toFixed is not a function

// Fix: null/undefined check karo
const email = user?.email;        // Optional chaining
if (user) { console.log(user.email); }
```

**ReferenceError:**
```js
// Variable declare nahi hua ya scope se bahar access
console.log(myVar);   // ReferenceError: myVar is not defined

// Typo
const userId = 123;
console.log(userID);  // ReferenceError: userID is not defined (capital ID)

// Fix: Spelling check karo, scope check karo
```

**SyntaxError:**
```js
// Code parse nahi ho raha
const obj = {
  name: "Rahul"
  email: "rahul@x.com"   // Missing comma!
};
// SyntaxError: Unexpected identifier 'email'

// Fix: Editor linting enable karo — ye pehle hi catch kar leta hai
```

**RangeError:**
```js
// Infinite recursion, stack overflow
function infinite() { return infinite(); }
infinite(); // RangeError: Maximum call stack size exceeded

// Array out of bounds nahi hota JS mein, but...
new Array(-1);  // RangeError: Invalid array length
```

**Async Errors:**
```js
// Promise rejection unhandled
async function getData() {
  const data = await fetch('/invalid-url');  // Network error
  // Yahan error throw hoga if not caught
}

// Fix: Always try/catch in async functions
async function getData() {
  try {
    const data = await fetch('/api/data');
    return await data.json();
  } catch (err) {
    console.error('Fetch failed:', err.message);
    throw err;
  }
}
```

---

## Console Debugging (Most Used)

```js
// Basic logging
console.log('Variable:', variable);
console.log('Object:', JSON.stringify(obj, null, 2));  // Pretty print

// Specific console methods
console.error('Error occurred:', err.message);  // Red in console
console.warn('Warning:', message);              // Yellow
console.info('Server started on port:', port);
console.debug('Debug info:', data);             // Only in debug mode

// Grouping
console.group('User Processing');
console.log('User ID:', userId);
console.log('User Data:', userData);
console.groupEnd();

// Table (for arrays of objects)
console.table([{ name: 'Rahul', age: 22 }, { name: 'Priya', age: 21 }]);

// Timing
console.time('DB Query');
const users = await User.find();
console.timeEnd('DB Query');  // Outputs: "DB Query: 45.123ms"

// Count
for (let i = 0; i < 3; i++) {
  console.count('iteration');
  // iteration: 1, iteration: 2, iteration: 3
}

// Conditional
console.assert(user !== null, 'User should not be null!');
// Agar assertion fail → Error print hota hai

// Stack trace
console.trace('How did we get here?');
```

---

## VS Code Debugger

**Console.log se better — breakpoints se actual execution step karo.**

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Node App",
      "program": "${workspaceFolder}/src/index.js",
      "envFile": "${workspaceFolder}/.env",
      "console": "integratedTerminal",
      "restart": true,
      "runtimeExecutable": "nodemon"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Jest Tests",
      "program": "${workspaceFolder}/node_modules/jest/bin/jest",
      "args": ["--runInBand", "--watchAll=false"],
      "console": "integratedTerminal"
    }
  ]
}
```

**Debugger features:**
```
Breakpoint      → Line pe click karo (red dot) → Execution wahan rukti hai
Step Over (F10) → Current line execute karo, next pe jao
Step Into (F11) → Function ke andar jao
Step Out (Shift+F11) → Current function se bahar niklo
Continue (F5)   → Next breakpoint tak
Variables panel → Sab local variables ki values
Watch           → Specific expressions monitor karo
Call Stack      → Kaise pahunche yahan
```

```js
// Code mein debugger statement
async function processOrder(orderId) {
  const order = await Order.findById(orderId);
  debugger;  // VS Code yahan rukta hai automatically
  const total = calculateTotal(order.items);
  return total;
}
```

---

## Binary Search Debugging

**Bade codebase mein bug dhundne ka fastest method.**

```
Code bada hai aur kahin bug hai:

Step 1: Middle mein console.log daalo
        "Yahan tak data theek hai?"

Step 2: Agar haan → Bug second half mein hai
        Agar nahi → Bug first half mein hai

Step 3: Wo half lo, phir middle mein log daalo
        Repeat karо

Result: O(log n) steps mein bug milega
```

```js
// Example: Data processing pipeline
async function processBatch(items) {
  const validated = validateItems(items);
  console.log('After validate:', validated.length);  // Check point 1

  const processed = processItems(validated);
  console.log('After process:', processed.length);   // Check point 2

  const stored = await storeItems(processed);
  console.log('After store:', stored.length);        // Check point 3

  return stored;
}
// Kaun se step pe data galat ho jaata hai? Answer mil gaya.
```

---

## Network Debugging

### Browser Network Tab
```
F12 → Network tab

Check:
1. Request URL correct hai?
2. HTTP method correct hai?
3. Request headers mein Auth token hai?
4. Request body correct JSON hai?
5. Status code kya hai?
6. Response body kya hai?

Filter:
- XHR/Fetch: Sirf API calls dekho
- Status: Failed requests filter karo
```

### cURL for API Testing
```bash
# Basic GET
curl https://api.example.com/users

# With headers
curl -H "Authorization: Bearer token123" \
     -H "Content-Type: application/json" \
     https://api.example.com/users/me

# POST with body
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"name":"Rahul","email":"rahul@x.com"}' \
     https://api.example.com/users

# Verbose mode (headers + timing)
curl -v https://api.example.com/users

# Save response
curl -o response.json https://api.example.com/users
```

---

## Debugging Async Code

```js
// Common async mistake
function getUser(id) {
  User.findById(id).then(user => {
    return user;  // ❌ Ye return caller ko nahi jaata
  });
  // Function returns undefined
}

// Fix
async function getUser(id) {
  return await User.findById(id);  // ✅
}

// Debugging async: trace the promise chain
async function processOrder(userId, productId) {
  console.log('1. Starting process');

  const user = await User.findById(userId);
  console.log('2. User found:', user?.email);

  const product = await Product.findById(productId);
  console.log('3. Product found:', product?.name, 'Stock:', product?.stock);

  if (product.stock < 1) {
    console.log('4. Out of stock!');
    throw new Error('Out of stock');
  }

  const order = await Order.create({ user: userId, product: productId });
  console.log('5. Order created:', order._id);

  return order;
}
// Each step print hoga — exactly kahan fail hua clearly dikhega
```

---

## Common Backend Bugs & Solutions

**1. Cannot read property of undefined**
```js
// Bug: user undefined hai
const email = user.email;  // Crash

// Debug: Kyon undefined hai?
console.log('User:', user);  // → null or undefined

// Fix
const user = await User.findById(id);
if (!user) return res.status(404).json({ error: 'User not found' });
const email = user.email;
// OR
const email = user?.email;  // Optional chaining
```

**2. MongoDB CastError (invalid ObjectId)**
```js
// Bug: /users/notanid → CastError: Cast to ObjectId failed
const user = await User.findById(req.params.id);

// Fix: Validate ObjectId first
const mongoose = require('mongoose');
if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({ error: 'Invalid user ID' });
}
```

**3. CORS Error**
```
Access to XMLHttpRequest at 'http://localhost:3000/api' from origin
'http://localhost:5173' has been blocked by CORS policy

Fix: Backend pe cors middleware add karo
app.use(cors({ origin: 'http://localhost:5173' }));
```

**4. JWT Errors**
```js
// JsonWebTokenError: invalid signature
// → Wrong secret used ya token tampered

// TokenExpiredError: jwt expired
// → Token expired hai — re-login karo

// Handle these in auth middleware:
try {
  decoded = jwt.verify(token, process.env.JWT_SECRET);
} catch (err) {
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Session expired, please login' });
  }
  return res.status(401).json({ error: 'Invalid token' });
}
```

**5. Async/Await without try/catch**
```js
// Bug: Unhandled promise rejection
app.get('/users', async (req, res) => {
  const users = await User.find();  // Throws → Express nahi pakdega
  res.json(users);
});

// Fix Option 1: try/catch
app.get('/users', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);  // Error handler ko bhejo
  }
});

// Fix Option 2: catchAsync wrapper
app.get('/users', catchAsync(async (req, res) => {
  const users = await User.find();
  res.json(users);
}));
```

**6. Port Already in Use**
```bash
Error: listen EADDRINUSE: address already in use :::3000

# Find what's using port 3000
lsof -i :3000           # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 node src/index.js
```

---

## Rubber Duck Debugging

**Kisi ko (ya kisi cheez ko) apna problem explain karo.**

```
Process:
1. Rubber duck (ya cup, ya stuffed toy) saamne rakho
2. Problem explain karo: "Main yahan ek API bana raha hoon..."
3. Code explain karo: "Ye function user find karta hai..."
4. Problem describe karo: "But ye crash ho raha hai kyunki..."

Usually: Explain karte waqt khud solution dikh jaata hai.

Kyon kaam karta hai:
→ Apne logic ko words mein convert karna = logic review
→ Hidden assumptions surface hote hain
→ "Main expect kar raha tha ki..." = assumption error reveal hota hai
```

---

## Debugging Checklist

```
Before writing code:
□ Exactly kya banana hai? Input/Output clear hai?
□ Edge cases kya hain?

When there's a bug:
□ Error message poora padha?
□ Stack trace mein meri file kaunsi line hai?
□ Variables ki values verify ki? (console.log / debugger)
□ Async hai? await missing toh nahi?
□ Null/undefined check hai?
□ Input data expected format mein hai?

If still stuck:
□ Problem ko simple karo — minimal reproduction
□ Rubber duck explain karo
□ 10 min break lo
□ Google: exact error message + context
□ Stack Overflow answer apply karne se pehle samjho
□ 30 min baad help maango — describe kya try kiya
```

---

## Interview Questions — Step 08

**Q: Debugging approach kya hai?**
> Systematic hoon: error message padho carefully (line number, error type), reproduce minimum case mein karo, console.log se variables verify karo, binary search approach se isolate karo kahan fail ho raha hai. Random changes avoid karta hoon — ek change ek baar.

**Q: Async bugs kaise debug karte ho?**
> Async chain mein har step pe log daalo, await missing toh nahi check karo, try/catch properly hai kya verify karo. VS Code debugger se async functions mein step-through karo.

---

## Assignment — Step 08

1. Intentionally buggy code likho — ek friend ko do solve karne ke liye (ya khud 2-3 bugs daalo, 1 din baad solve karo)
2. VS Code debugger setup karo apne Node project mein — breakpoint daalo, variables inspect karo
3. Network tab mein apni API calls observe karo — request/response headers dekho
4. Binary search debugging practice: ek 50-line function mein deliberate bug daalo, systematic approach se dhundho
