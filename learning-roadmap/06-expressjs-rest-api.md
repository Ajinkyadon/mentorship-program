# 06 — Express.js & REST APIs

> Express = Node.js ke upar ek layer jo API banana bahut easy karta hai.
> Yahan se tumhara "backend developer" wala safar actually shuru hota hai.

---

## Express Kya Karta Hai?

```
Raw Node.js http module se:
  - Routing manually likhna padta tha (if/else)
  - Headers manually set karne padte the
  - JSON parse manually karna padta tha
  - Error handling manual thi

Express yeh sab simplify karta hai:
  - Clean routing (app.get, app.post, etc.)
  - Middleware system
  - Request/Response helpers
  - Ecosystem of plugins
```

---

## Basic Setup

```bash
mkdir my-api
cd my-api
npm init -y
npm install express dotenv
npm install --save-dev nodemon

# package.json mein add karo:
# "dev": "nodemon index.js"
```

```javascript
// index.js — minimal Express app
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware — JSON body parse karo
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'API chal rahi hai!' });
});

// Server start karo
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} pe chal raha hai`);
});
```

```bash
npm run dev
# Browser mein ya Postman mein: http://localhost:3000/
```

---

## Request & Response Objects

```javascript
app.get('/demo', (req, res) => {
  // ─── REQUEST (req) ───
  console.log(req.method);        // GET, POST, PUT, DELETE
  console.log(req.url);           // /demo?name=rahul
  console.log(req.path);          // /demo
  console.log(req.query);         // { name: 'rahul' } — URL ke ? ke baad
  console.log(req.params);        // { id: '1' } — /users/:id ke liye
  console.log(req.body);          // POST body ka data (JSON)
  console.log(req.headers);       // Request headers
  console.log(req.headers['authorization']); // JWT token yahan hota hai

  // ─── RESPONSE (res) ───
  res.status(200).json({ data: "kuch" });  // JSON bhejo
  res.status(404).json({ message: "Nahi mila" });
  res.status(201).json({ created: true }); // Created
  res.sendStatus(204);                     // No content (delete ke baad)
  res.redirect('/new-url');                // Redirect karo
});
```

---

## Routing — CRUD Operations

```javascript
// routes/users.js — organized routing

const express = require('express');
const router = express.Router();

// In-memory "database" (baad mein MongoDB se replace karenge)
let users = [
  { id: 1, name: "Rahul Sharma", email: "rahul@example.com", age: 28 },
  { id: 2, name: "Priya Patel", email: "priya@example.com", age: 25 },
];
let nextId = 3;

// GET /api/users — saare users
router.get('/', (req, res) => {
  // Query parameters se filtering
  const { name, minAge } = req.query;

  let result = users;

  if (name) {
    result = result.filter(u => 
      u.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (minAge) {
    result = result.filter(u => u.age >= parseInt(minAge));
  }

  res.json({
    success: true,
    count: result.length,
    data: result
  });
});

// GET /api/users/:id — ek user
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User ${id} nahi mila`
    });
  }

  res.json({ success: true, data: user });
});

// POST /api/users — naya user banao
router.post('/', (req, res) => {
  const { name, email, age } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name aur email zaroori hain"
    });
  }

  // Email already exists?
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "Yeh email already registered hai"
    });
  }

  const newUser = { id: nextId++, name, email, age: age || null };
  users.push(newUser);

  res.status(201).json({
    success: true,
    message: "User ban gaya",
    data: newUser
  });
});

// PUT /api/users/:id — user update karo
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `User ${id} nahi mila`
    });
  }

  const { name, email, age } = req.body;
  users[userIndex] = { ...users[userIndex], name, email, age };

  res.json({
    success: true,
    message: "User update ho gaya",
    data: users[userIndex]
  });
});

// DELETE /api/users/:id — user delete karo
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `User ${id} nahi mila`
    });
  }

  users.splice(userIndex, 1);

  res.status(200).json({
    success: true,
    message: "User delete ho gaya"
  });
});

module.exports = router;
```

```javascript
// index.js mein router use karo
const userRouter = require('./routes/users');
app.use('/api/users', userRouter);

// Ab yeh routes available hain:
// GET    /api/users
// GET    /api/users/:id
// POST   /api/users
// PUT    /api/users/:id
// DELETE /api/users/:id
```

---

## Middleware — Pipeline Concept

### Analogy:

```
Middleware = Airport security layers

Request aata hai →
  Layer 1: Logging (ticket check karo)
  Layer 2: Authentication (passport check)
  Layer 3: Authorization (seat class check)
  Layer 4: Validation (luggage check)
  Layer 5: Controller (plane mein baith jao)
  → Response jaata hai

Har layer mein:
  - next() call karo → agle layer mein jao
  - res.send() karo → pipeline rok do
  - Error throw karo → error handler mein jao
```

```javascript
// Middleware ka structure
function myMiddleware(req, res, next) {
  // Kuch karo
  console.log("Middleware chal raha hai");
  
  // Agle middleware/route pe jao
  next();
  
  // Ya response bhejo (pipeline rok do)
  // res.json({ message: "Yahan rok diya" });
}

// ─── 1. Application-level middleware ───
app.use(express.json()); // Sab routes ke liye
app.use(express.urlencoded({ extended: true })); // Form data
app.use(cors()); // CORS headers

// ─── 2. Custom Logging Middleware ───
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// ─── 3. Auth Middleware ───
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: "Token chahiye" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // User info request mein add karo
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid hai" });
  }
}

// Specific routes pe use karo
app.get('/api/profile', requireAuth, (req, res) => {
  res.json({ user: req.user }); // Middleware ne req.user set kiya tha
});

// ─── 4. Rate Limiting ───
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Bahut zyada requests! 15 minute baad try karo.'
});

app.use('/api/', limiter);

// ─── 5. Error Handling Middleware ───
// 4 parameters hone chahiye — yahi express ko batata hai ki yeh error handler hai
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server pe kuch gadbad ho gayi';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

---

## REST API Design — Best Practices

```
REST = Representational State Transfer
Kuch rules hain jo REST API ko "RESTful" banate hain:

1. Resources nouns hone chahiye (verbs nahi):
   ✅ /api/users
   ❌ /api/getUsers
   ❌ /api/createUser

2. HTTP methods se actions batao:
   GET    → Read (padhna)
   POST   → Create (banana)
   PUT    → Update (poora replace karna)
   PATCH  → Partial Update (sirf kuch fields change karna)
   DELETE → Delete (mitana)

3. Nested resources:
   /api/users/:userId/orders        → User ke orders
   /api/users/:userId/orders/:orderId → User ka specific order

4. HTTP Status Codes (yeh yaad rakhna zaroori hai):
   200 OK              → Success (GET, PUT)
   201 Created         → Naya resource bana (POST)
   204 No Content      → Success, koi response nahi (DELETE)
   400 Bad Request     → Galat data bheja
   401 Unauthorized    → Login karo pehle
   403 Forbidden       → Permission nahi hai
   404 Not Found       → Resource nahi mila
   409 Conflict        → Already exist karta hai
   422 Unprocessable   → Validation failed
   500 Internal Error  → Server ka problem

5. Consistent response format:
   {
     "success": true/false,
     "data": {...},
     "message": "Human readable message",
     "pagination": { "page": 1, "total": 50 }
   }
```

---

## Pagination, Filtering, Sorting

```javascript
// GET /api/products?page=2&limit=10&sort=price&order=asc&category=laptop

router.get('/products', async (req, res) => {
  const {
    page = 1,        // Default: page 1
    limit = 10,      // Default: 10 per page
    sort = 'name',   // Default: name se sort
    order = 'asc',   // Default: ascending
    category,        // Optional filter
    search           // Optional search
  } = req.query;

  // Validation
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // Max 50
  const skip = (pageNum - 1) * limitNum;

  // Filter build karo
  let query = {};
  if (category) query.category = category;
  if (search) {
    query.name = { $regex: search, $options: 'i' }; // MongoDB regex
  }

  // Database se laao (MongoDB example)
  const [products, totalCount] = await Promise.all([
    Product.find(query)
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limitNum),
    Product.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      totalItems: totalCount,
      itemsPerPage: limitNum,
      hasNext: pageNum < Math.ceil(totalCount / limitNum),
      hasPrev: pageNum > 1
    }
  });
});
```

---

## Complete API Structure (MVC Pattern)

```
my-api/
├── index.js              ← Entry point
├── .env                  ← Secrets (never commit!)
├── .env.example          ← Template (commit this)
├── config/
│   └── database.js       ← DB connection
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── product.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   └── product.controller.js
├── middleware/
│   ├── auth.middleware.js
│   ├── validate.middleware.js
│   └── error.middleware.js
├── models/
│   ├── User.model.js
│   └── Product.model.js
└── utils/
    └── ApiError.js
```

```javascript
// utils/ApiError.js — custom error class
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

module.exports = ApiError;

// ──────────────────────────────────────

// controllers/user.controller.js
const ApiError = require('../utils/ApiError');
const User = require('../models/User.model');

const userController = {
  async getAllUsers(req, res, next) {
    try {
      const users = await User.find().select('-password'); // Password hide karo
      res.json({ success: true, count: users.length, data: users });
    } catch (error) {
      next(error); // Error middleware ko bhejo
    }
  },

  async getUserById(req, res, next) {
    try {
      const user = await User.findById(req.params.id).select('-password');
      
      if (!user) {
        throw new ApiError(404, `User ${req.params.id} nahi mila`);
      }
      
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!user) throw new ApiError(404, 'User nahi mila');
      
      res.json({ success: true, message: 'User update ho gaya', data: user });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
```

---

## API Testing with Thunder Client / Postman

```
Postman ya VS Code Thunder Client extension se test karo:

1. GET http://localhost:3000/api/users
   Headers: Authorization: Bearer <token>

2. POST http://localhost:3000/api/users
   Headers: Content-Type: application/json
   Body (raw JSON):
   {
     "name": "Rahul Sharma",
     "email": "rahul@example.com",
     "age": 28
   }

3. PUT http://localhost:3000/api/users/1
   Body: { "name": "Rahul Kumar" }

4. DELETE http://localhost:3000/api/users/1
```

---

## Assignment

```
1. Ek "Notes API" banao with full CRUD:
   - GET    /api/notes          → Saari notes (pagination ke saath)
   - GET    /api/notes/:id      → Ek note
   - POST   /api/notes          → Naya note (title, content, tags)
   - PUT    /api/notes/:id      → Note update karo
   - DELETE /api/notes/:id      → Note delete karo
   - GET    /api/notes/search?q=keyword → Search karo
   
   Data abhi in-memory store karo.

2. Middleware add karo:
   - Request logging (method, path, time, status code)
   - Rate limiting (10 requests per minute per IP)
   - Input validation (title aur content required hain)
   
3. Postman collection banao aur saare endpoints test karo.
   Collection ko GitHub pe export karke push karo.

4. Proper error handling add karo — har edge case cover karo.
```

---

> *Next: MongoDB & Mongoose → [07-mongodb-mongoose.md](./07-mongodb-mongoose.md)*
