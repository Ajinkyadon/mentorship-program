# Module 6: Backend Development
### "Jo user nahi dekhta — lekin sab kuch wahi hota hai"

---

## What is a Backend?

```
User action (click, form submit)
    ↓
Frontend sends HTTP request
    ↓
Backend receives request
    ↓
Business logic run karo (validate, process)
    ↓
Database se data lao ya save karo
    ↓
Response return karo
    ↓
Frontend display kare
```

Backend = server + business logic + database layer.

---

## Server Basics

### HTTP Server (Node.js)
```js
const http = require('http');

const server = http.createServer((req, res) => {
  // req = request (client ne kya bheja)
  // res = response (hum kya bhejenge)

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Server running!' }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

Express.js isko zyada simple banata hai.

---

## Express.js Setup

```bash
npm init -y
npm install express dotenv
npm install --save-dev nodemon
```

```js
// src/index.js
require('dotenv').config();
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler (always 4 params)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
```

---

## REST API Design

### URL Structure (Resource-based)
```
# Good — nouns, not verbs
GET    /api/users             # all users
GET    /api/users/:id         # specific user
POST   /api/users             # create user
PUT    /api/users/:id         # full update
PATCH  /api/users/:id         # partial update
DELETE /api/users/:id         # delete

# Bad — verbs in URL
GET    /api/getUsers
POST   /api/createUser
GET    /api/deleteUser?id=123

# Nested resources
GET    /api/users/:id/posts          # user ke posts
GET    /api/users/:id/posts/:postId  # specific post
```

### Response Format (Consistent)
```js
// Success
res.status(200).json({
  success: true,
  data: { id: 1, name: 'Rahul' },
  message: 'User fetched successfully'
});

// Error
res.status(400).json({
  success: false,
  error: 'Invalid email format',
  field: 'email'    // optional — helpful for frontend
});

// List with pagination
res.json({
  success: true,
  data: users,
  pagination: {
    page: 1,
    limit: 10,
    total: 150,
    totalPages: 15
  }
});
```

---

## Routing

```js
// routes/users.js
const router = require('express').Router();
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getUsers);
router.get('/:id', authenticate, getUserById);
router.post('/', createUser);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

module.exports = router;
```

```js
// controllers/userController.js
const User = require('../models/User');

exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments();

    res.json({
      success: true,
      data: users,
      pagination: { page: Number(page), limit: Number(limit), total }
    });
  } catch (err) {
    next(err);
  }
};
```

---

## Middleware

**Middleware = Request aur Response ke beech ka code.**

```js
// Logging middleware
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();  // IMPORTANT: next() call karo, warna request ruk jaayegi
};

// Request timing
const timing = (req, res, next) => {
  req.startTime = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.url} — ${Date.now() - req.startTime}ms`);
  });
  next();
};

// Input validation middleware
const validateCreateUser = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be 8+ characters' });
  }

  next();
};

app.use(logger);
app.use(timing);
app.post('/users', validateCreateUser, createUser);
```

---

## Authentication System

### Complete Auth Flow

```js
// routes/auth.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) { next(err); }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user);

    res.json({ success: true, token, user: { id: user._id, name: user.name } });
  } catch (err) { next(err); }
});

// Logout (JWT is stateless — client-side delete)
router.post('/logout', authenticate, (req, res) => {
  // Optional: blacklist token in Redis
  res.json({ success: true, message: 'Logged out' });
});

function generateToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}
```

### Auth Middleware
```js
// middleware/auth.js
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

exports.requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};
```

---

## File Upload

```bash
npm install multer
```

```js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, WEBP allowed'));
  }
});

router.post('/avatar', authenticate, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  await User.findByIdAndUpdate(req.user.userId, {
    avatar: `/uploads/${req.file.filename}`
  });

  res.json({ success: true, path: `/uploads/${req.file.filename}` });
});
```

---

## Error Handling (Production Grade)

```js
// utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;  // expected errors vs crashes
    Error.captureStackTrace(this, this.constructor);
  }
}

// Async handler wrapper (avoid try/catch in every route)
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Use it:
router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
}));

// Global error handler
app.use((err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Unexpected error — don't expose details
  console.error('UNEXPECTED ERROR:', err);
  res.status(500).json({ error: 'Something went wrong' });
});
```

---

## Logging

```bash
npm install winston
```

```js
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

module.exports = logger;

// Use:
logger.info('User registered', { userId: user._id, email: user.email });
logger.error('DB connection failed', { error: err.message });
```

---

## Sending Emails

```bash
npm install nodemailer
```

```js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  // Gmail App Password
  }
});

async function sendWelcomeEmail(to, name) {
  await transporter.sendMail({
    from: `"CodeBharat" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Welcome to CodeBharat!',
    html: `<h1>Welcome, ${name}!</h1><p>Your journey starts now.</p>`
  });
}
```

---

## Caching Basics (Redis)

```bash
npm install redis
```

```js
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });
await client.connect();

// Cache middleware
const cache = (duration) => async (req, res, next) => {
  const key = `cache:${req.originalUrl}`;
  const cached = await client.get(key);

  if (cached) {
    return res.json(JSON.parse(cached));
  }

  res.sendResponse = res.json.bind(res);
  res.json = async (data) => {
    await client.setEx(key, duration, JSON.stringify(data));
    res.sendResponse(data);
  };

  next();
};

// Use
router.get('/products', cache(300), getProducts); // cache 5 minutes
```

---

## Security Checklist

```bash
npm install helmet cors express-rate-limit express-mongo-sanitize
```

```js
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100
}));

// Stricter for auth routes
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many attempts. Try again in 15 minutes.'
}));

// Prevent NoSQL injection
app.use(mongoSanitize());
```

---

## Project Structure (Industry Standard)

```
src/
├── config/
│   ├── database.js      (DB connection)
│   └── env.js           (environment validation)
├── controllers/
│   ├── authController.js
│   └── userController.js
├── middleware/
│   ├── auth.js          (JWT verify)
│   ├── validate.js      (input validation)
│   └── rateLimiter.js
├── models/
│   └── User.js
├── routes/
│   ├── auth.js
│   └── users.js
├── utils/
│   ├── AppError.js
│   ├── asyncHandler.js
│   └── logger.js
├── app.js               (express setup, no listen)
└── index.js             (listen + DB connect)
```

---

## Deployment Basics

```bash
# package.json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```

```
# .env.example (commit this, not .env)
PORT=3000
MONGODB_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
NODE_ENV=development
```

**Render deployment:**
1. GitHub pe push karo
2. render.com → New Web Service → GitHub repo connect
3. Environment variables set karo
4. Deploy!

---

## Assignment — Module 6

1. **Project:** Complete REST API with Express + MongoDB:
   - User register/login (JWT)
   - CRUD for a resource (posts, todos, products — choose one)
   - Auth middleware on protected routes
   - Input validation
   - Error handling middleware
   - Pagination on list endpoint

2. **Add:** File upload (profile picture)
3. **Add:** Email on registration
4. **Deploy:** Render pe deploy karo
5. **Test:** Postman collection banao with all endpoints
