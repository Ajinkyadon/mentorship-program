# Step 03: Backend Basics
### "Jo user nahi dekhta — wahan sab kuch hota hai"

---

## What is a Backend?

```
Frontend (Browser)    ←→    Backend (Server)    ←→    Database
                      HTTP                      Query
```

Backend = **Server + Business Logic + Data Layer**

Kya karta hai:
- HTTP requests receive karta hai
- Input validate karta hai
- Business logic run karta hai
- Database se data read/write karta hai
- Formatted response return karta hai
- Authentication/authorization handle karta hai
- Emails, notifications, payments — sab backend pe hota hai

---

## How a Server Works

```
Server = Ek program jo continuously sun raha hai incoming connections ke liye.

Port 3000 pe listen kar raha hai...
    ↓
Request aayi: GET /api/users
    ↓
Correct handler dhundho (routing)
    ↓
Handler run karo (controller)
    ↓
Database query karo (model)
    ↓
Response prepare karo
    ↓
Client ko bhejo
    ↓
Wapas listen karo...
```

### Node.js HTTP Server (Raw)
```js
const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Manual routing
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome!');
    return;
  }

  if (req.method === 'GET' && req.url === '/api/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([{ id: 1, name: 'Rahul' }]));
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

Ye raw approach manually sab karna padta hai — isliye frameworks aate hain.

---

## Express.js — The Most Popular Node.js Framework

```bash
npm init -y
npm install express dotenv
npm install --save-dev nodemon
```

```js
const express = require('express');
const app = express();

// Built-in middleware
app.use(express.json());   // JSON body parse karo

// Route
app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'Rahul' }]);
});

app.listen(3000, () => console.log('Server on :3000'));
```

Express automatically karti hai:
- Content-Type headers set karna
- JSON body parsing
- Query string parsing
- Multiple routes handle karna
- Error handling framework

---

## Routing — Request ko Sahi Handler tak Pahunchana

```js
// Route = HTTP Method + URL path

// Basic routes
app.get('/users', getUsers);              // GET all users
app.get('/users/:id', getUserById);       // GET specific user
app.post('/users', createUser);           // POST create user
app.put('/users/:id', updateUser);        // PUT full update
app.patch('/users/:id', patchUser);       // PATCH partial update
app.delete('/users/:id', deleteUser);     // DELETE user

// Route parameters
app.get('/users/:id/posts/:postId', (req, res) => {
  const { id, postId } = req.params;
  // id = "123", postId = "456" from /users/123/posts/456
});

// Query strings: GET /search?q=node&page=2&limit=10
app.get('/search', (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;
  // q = "node", page = "2", limit = "10"
});

// Request body (POST)
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  // body from JSON payload
});
```

### Router — Routes Group Karna
```js
// routes/users.js
const router = require('express').Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

// app.js
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/auth',  require('./routes/auth'));
```

---

## Middleware — Request Pipeline

**Middleware = Code jo request aur response ke beech mein run hota hai.**

```
Request
    ↓
Middleware 1 (logging)
    ↓
Middleware 2 (auth check)
    ↓
Middleware 3 (validation)
    ↓
Route Handler (actual logic)
    ↓
Response
```

```js
// Middleware signature: (req, res, next) => {}
// next() call karo → aage jaao
// next(error) call karo → error handler pe jaao
// res.send() call karo → pipeline rok do

// Application-level (sab routes pe)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Path-specific
app.use('/api', (req, res, next) => {
  // Sirf /api routes ke liye
  next();
});

// Route-specific (ek ya zyada middleware ek route pe)
app.get('/protected', authenticate, authorize('admin'), getAdminData);

// Error-handling middleware (4 parameters — must!)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ error: err.message });
});
```

### Built-in Express Middleware
```js
app.use(express.json());                         // JSON body parse
app.use(express.urlencoded({ extended: true })); // Form data parse
app.use(express.static('public'));               // Static files serve
```

### Popular Third-Party Middleware
```js
const cors    = require('cors');       // Cross-origin requests allow
const helmet  = require('helmet');     // Security headers
const morgan  = require('morgan');     // HTTP request logging
const rateLimit = require('express-rate-limit'); // Rate limiting

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 15*60*1000, max: 100 }));
```

---

## Request Object (req)

```js
app.post('/api/users', (req, res) => {
  // Body (POST/PUT data)
  req.body         // { name: 'Rahul', email: 'rahul@x.com' }

  // URL parameters
  req.params       // { id: '123' } from /users/:id
  req.params.id    // '123'

  // Query string
  req.query        // { page: '1', limit: '10' } from ?page=1&limit=10
  req.query.page   // '1'

  // Headers
  req.headers                       // all headers
  req.headers.authorization         // 'Bearer token123'
  req.get('Content-Type')           // 'application/json'

  // Request info
  req.method    // 'POST'
  req.url       // '/api/users?page=1'
  req.path      // '/api/users'
  req.hostname  // 'localhost'
  req.ip        // '127.0.0.1'
  req.protocol  // 'http'

  // Cookies
  req.cookies          // requires cookie-parser middleware

  // Files (multer ke baad)
  req.file       // single file
  req.files      // multiple files

  // Custom data add karte hain middleware mein
  req.user = { id: '123' };  // auth middleware sets this
});
```

---

## Response Object (res)

```js
// JSON response (most common for APIs)
res.json({ success: true, data: users });

// Status + JSON
res.status(201).json({ message: 'Created', id: newUser._id });
res.status(404).json({ error: 'User not found' });

// Plain text
res.send('Hello World');

// HTML
res.send('<h1>Hello</h1>');

// Status only (no body)
res.status(204).end();

// Redirect
res.redirect('/login');               // 302 by default
res.redirect(301, '/new-url');        // 301 permanent

// File send
res.sendFile(path.join(__dirname, 'index.html'));

// Download
res.download('/path/to/file.pdf', 'document.pdf');

// Headers set karna
res.set('X-Custom-Header', 'value');
res.set({ 'X-A': '1', 'X-B': '2' });

// Cookie
res.cookie('token', tokenValue, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
});
res.clearCookie('token');
```

---

## Input Validation

**Never trust user input.**

```js
// Manual validation
function validateUser(data) {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Valid email required';
  }
  if (!data.password || data.password.length < 8) {
    errors.password = 'Password must be 8+ characters';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// Using express-validator library
const { body, validationResult } = require('express-validator');

const validateUserRules = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name min 2 chars'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
  body('age').optional().isInt({ min: 18 }).withMessage('Must be 18+')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

router.post('/users', validateUserRules, validate, createUser);
```

---

## Error Handling

```js
// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Async wrapper (avoid try/catch in every route)
const catchAsync = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Routes with async
router.get('/users/:id', catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, data: user });
}));

// Global error handler (last middleware)
app.use((err, req, res, next) => {
  // Operational errors — expected, send to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  // Programming errors — unexpected, don't expose details
  console.error('UNEXPECTED ERROR:', err);
  res.status(500).json({
    success: false,
    error: 'Something went wrong. Please try again.'
  });
});

// Mongoose/DB errors handle karna
app.use((err, req, res, next) => {
  // Duplicate key error (MongoDB)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ error: `${field} already exists` });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ errors });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired, please login again' });
  }

  next(err);
});
```

---

## Environment Variables

**Secrets aur config code mein hardcode mat karo.**

```
# .env (NEVER commit this)
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your@gmail.com
EMAIL_PASS=app-specific-password
ALLOWED_ORIGIN=http://localhost:5173

# .env.example (commit this — template)
PORT=3000
NODE_ENV=development
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
```

```js
require('dotenv').config();  // App ke start pe — index.js mein

const port = process.env.PORT || 3000;
const dbUri = process.env.MONGODB_URI;

// Validate required env vars at startup
const required = ['MONGODB_URI', 'JWT_SECRET'];
const missing = required.filter(key => !process.env[key]);
if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}
```

---

## Project Structure (Production Grade)

```
src/
├── config/
│   ├── database.js        DB connection
│   └── env.js             Environment validation
│
├── controllers/           Route handlers (business logic)
│   ├── authController.js
│   ├── userController.js
│   └── postController.js
│
├── middleware/             Reusable middleware
│   ├── auth.js            JWT verify + attach user
│   ├── validate.js        Input validation runner
│   ├── rateLimiter.js
│   └── upload.js          Multer configuration
│
├── models/                Database schemas
│   ├── User.js
│   └── Post.js
│
├── routes/                URL routing
│   ├── auth.js
│   ├── users.js
│   └── posts.js
│
├── utils/                 Helper functions
│   ├── AppError.js        Custom error class
│   ├── catchAsync.js      Async wrapper
│   ├── logger.js          Winston logger
│   └── email.js           Email sender
│
├── app.js                 Express setup (no server.listen)
└── index.js               Start server + DB connect
```

---

## Complete app.js Example

```js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const globalErrorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true }));
app.use(mongoSanitize());                     // NoSQL injection prevent

// Rate limiting
app.use('/api', rateLimit({ windowMs: 15*60*1000, max: 100 }));
app.use('/api/auth', rateLimit({ windowMs: 15*60*1000, max: 10 }));

// Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth',  authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 404 handler
app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
```

---

## Interview Questions — Step 03

**Q: Middleware kya hai? Examples do.**
> Middleware ek function hai jo request aur response ke beech run hota hai. Examples: logging (har request log karo), authentication (token verify karo), validation (input check karo), rate limiting (requests count karo). Express mein `(req, res, next)` signature hota hai — `next()` call karo aage jaane ke liye.

**Q: REST API aur GraphQL mein kya fark hai?**
> REST mein fixed endpoints hote hain, har endpoint ek resource represent karta hai. GraphQL mein ek endpoint hota hai, client exactly specify karta hai kya chahiye. REST simpler hai — freshers ke liye REST se start karo.

**Q: `PUT` aur `PATCH` mein kya fark hai?**
> PUT poore resource ko replace karta hai (sab fields bhejne padte hain). PATCH partial update karta hai (sirf changed fields bhejते hain).

**Q: Express mein error handling kaise karte hain?**
> Error-handling middleware 4 parameters leta hai `(err, req, res, next)`. Async functions mein `try/catch` use karo aur `next(err)` call karo, ya `catchAsync` wrapper use karo jo automatically `next(err)` call karta hai.

---

## Assignment — Step 03

1. Ek Node.js + Express server banao with:
   - GET /api/products → all products (in-memory array)
   - GET /api/products/:id → single product
   - POST /api/products → naya product add karo (with validation)
   - PUT /api/products/:id → product update karo
   - DELETE /api/products/:id → product delete karo
   - 404 handler
   - Global error handler

2. Request logging middleware add karo
3. Rate limiting add karo (10 requests per minute per IP)
4. Postman collection banao with all endpoints
