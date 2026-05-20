# Step 05: APIs — Application Programming Interfaces
### "Frontend aur Backend ki baat kaise hoti hai"

---

## What is an API?

**API = Contract between two systems to communicate.**

```
Real world example:
Swiggy app (client) ↔ Swiggy API ↔ Swiggy server

Tum order karte ho:
1. App ne API call ki: POST /api/orders
2. Server ne order save kiya
3. Server ne response bheja: { orderId: 123, status: "confirmed" }
4. App ne "Order placed!" dikhaya
```

APIs allow karte hain:
- Frontend ↔ Backend communication
- App ↔ App communication (third-party APIs)
- Mobile app + Web app — same backend
- Microservices communication

---

## Types of APIs

| Type | Description | Use |
|------|-------------|-----|
| REST | Resource-based, HTTP methods | Most common — 90% web apps |
| GraphQL | Query language, single endpoint | Facebook, flexible data needs |
| gRPC | Protocol buffers, fast | Microservices |
| WebSocket | Real-time, bidirectional | Chat, live data |
| SOAP | XML-based, enterprise | Legacy banking/enterprise |

**Freshers ke liye: REST first, GraphQL later.**

---

## REST API — Complete Guide

### REST Principles
```
1. Stateless
   → Server client ka koi state nahi rakhta
   → Har request mein sab info honi chahiye (auth token, etc.)

2. Client-Server
   → UI aur backend separate hain
   → Independent evolve ho sakte hain

3. Uniform Interface
   → Consistent URLs aur methods
   → Resource-based (nouns, not verbs)

4. Resource-Based URLs
   → /users not /getUsers
   → /users/123 not /getUserById?id=123

5. Cacheable
   → Responses indicate karein ki cached ho sakte hain

6. Layered System
   → Load balancers, CDNs transparent hote hain
```

### URL Design Rules

**Nouns, not verbs:**
```
✅ GET /users           → getUsers nahi
✅ POST /users          → createUser nahi
✅ DELETE /users/123    → deleteUser?id=123 nahi
```

**Plural nouns:**
```
✅ /users     → /user nahi
✅ /products  → /product nahi
✅ /posts     → /post nahi
```

**Nested resources:**
```
✅ GET  /users/123/posts          → User 123 ke sare posts
✅ GET  /users/123/posts/456      → User 123 ka post 456
✅ POST /users/123/posts          → User 123 ke liye post create karo

❌ /getUserPosts?userId=123        → Verb + query param
❌ /posts/getByUser/123           → Verb in URL
```

**Versioning:**
```
/api/v1/users    → Version 1
/api/v2/users    → Version 2 (breaking changes)
```

**Filtering, sorting, pagination via query params:**
```
GET /api/products?category=electronics&minPrice=1000&maxPrice=50000
GET /api/users?city=Mumbai&sort=name&order=asc&page=2&limit=10
GET /api/posts?search=nodejs&tag=backend&status=published
```

---

## HTTP Methods in REST Context

```
Collection endpoint (/users):
GET    /users          → Sare users fetch karo
POST   /users          → Naya user create karo

Resource endpoint (/users/:id):
GET    /users/123      → User 123 fetch karo
PUT    /users/123      → User 123 ko puri replace karo
PATCH  /users/123      → User 123 ko partially update karo
DELETE /users/123      → User 123 delete karo
```

### PUT vs PATCH — Example
```json
// Existing user
{
  "id": 123,
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "city": "Mumbai",
  "phone": "9999999999"
}

// PUT request (full replacement)
PUT /users/123
{ "name": "Rahul K", "email": "rahul@example.com" }
→ Result: { "id": 123, "name": "Rahul K", "email": "rahul@example.com" }
→ city aur phone gone! (not provided = deleted)

// PATCH request (partial update)
PATCH /users/123
{ "name": "Rahul K" }
→ Result: { "id": 123, "name": "Rahul K", "email": "rahul@example.com", "city": "Mumbai", "phone": "9999999999" }
→ Sirf name changed, rest same
```

---

## Request & Response Design

### Consistent Response Format
```js
// Success — single resource
res.status(200).json({
  success: true,
  data: {
    id: "123",
    name: "Rahul Kumar",
    email: "rahul@example.com"
  }
});

// Success — list with pagination
res.status(200).json({
  success: true,
  data: [...users],
  pagination: {
    page: 1,
    limit: 10,
    total: 150,
    totalPages: 15,
    hasNextPage: true,
    hasPrevPage: false
  }
});

// Created
res.status(201).json({
  success: true,
  message: "User created successfully",
  data: { id: "123", name: "Rahul Kumar" }
});

// No content (e.g., delete)
res.status(204).end();

// Error
res.status(400).json({
  success: false,
  error: "Validation failed",
  details: [
    { field: "email", message: "Invalid email format" },
    { field: "password", message: "Password must be 8+ characters" }
  ]
});

// Not found
res.status(404).json({
  success: false,
  error: "User with id 123 not found"
});

// Unauthorized
res.status(401).json({
  success: false,
  error: "Authentication required"
});

// Server error
res.status(500).json({
  success: false,
  error: "Internal server error"  // Never expose stack trace to client!
});
```

---

## Complete REST API Example

```js
// routes/products.js
const router = require('express').Router();
const Product = require('../models/Product');
const { authenticate, requireRole } = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// GET /api/products
// Query params: ?category=x&minPrice=y&maxPrice=z&page=1&limit=10&sort=price&order=asc
router.get('/', catchAsync(async (req, res) => {
  const {
    category, minPrice, maxPrice, search,
    page = 1, limit = 10,
    sort = 'createdAt', order = 'desc'
  } = req.query;

  // Build filter
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) filter.$text = { $search: search };

  // Build sort
  const sortObj = { [sort]: order === 'desc' ? -1 : 1 };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-__v'),
    Product.countDocuments(filter)
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}));

// GET /api/products/:id
router.get('/:id', catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found', 404);
  res.json({ success: true, data: product });
}));

// POST /api/products (admin only)
router.post('/', authenticate, requireRole('admin'), catchAsync(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Product created',
    data: product
  });
}));

// PATCH /api/products/:id (admin only)
router.patch('/:id', authenticate, requireRole('admin'), catchAsync(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!product) throw new AppError('Product not found', 404);
  res.json({ success: true, data: product });
}));

// DELETE /api/products/:id (admin only)
router.delete('/:id', authenticate, requireRole('admin'), catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found', 404);
  await product.deleteOne();
  res.status(204).end();
}));

module.exports = router;
```

---

## API Headers

### Request Headers (Important)
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...  → Auth token
Content-Type: application/json                  → Body format
Accept: application/json                        → Accepted response format
Accept-Language: en-IN                          → Preferred language
X-Request-ID: uuid-here                        → Request tracing
```

### Response Headers (Important)
```
Content-Type: application/json; charset=utf-8
Cache-Control: no-cache, no-store               → Don't cache
Cache-Control: public, max-age=3600            → Cache 1 hour
ETag: "abc123"                                  → Resource version
Last-Modified: Thu, 15 Jan 2024 10:30:00 GMT
X-RateLimit-Limit: 100                         → Max requests
X-RateLimit-Remaining: 95                      → Remaining
X-RateLimit-Reset: 1705314600                  → Reset time (unix)
```

---

## API Security

### Authentication Headers
```js
// Bearer token (most common)
headers: {
  'Authorization': `Bearer ${token}`
}

// API Key (for server-to-server)
headers: {
  'X-API-Key': process.env.API_KEY
}

// Basic auth (old, avoid for modern apps)
headers: {
  'Authorization': `Basic ${btoa('username:password')}`
}
```

### CORS (Cross-Origin Resource Sharing)
```js
const cors = require('cors');

// Development — allow all
app.use(cors());

// Production — specific origin only
app.use(cors({
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,         // Cookies allow karo
  maxAge: 86400              // Preflight cache 24h
}));
```

---

## Consuming External APIs

```js
const axios = require('axios'); // npm install axios

// GET
const { data } = await axios.get('https://api.example.com/users', {
  headers: { Authorization: `Bearer ${token}` },
  params: { page: 1, limit: 10 }  // Query params
});

// POST
const { data: newUser } = await axios.post('https://api.example.com/users', {
  name: 'Rahul',
  email: 'rahul@x.com'
}, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Error handling
try {
  const response = await axios.get(url);
  return response.data;
} catch (err) {
  if (err.response) {
    // Server responded with error status
    console.error('API Error:', err.response.status, err.response.data);
    throw new AppError(err.response.data.message, err.response.status);
  } else if (err.request) {
    // Request sent but no response (network issue)
    throw new AppError('Service unavailable', 503);
  }
  throw err;
}

// With fetch (native)
const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify(data)
});
if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
const result = await response.json();
```

---

## API Documentation with Swagger

```bash
npm install swagger-jsdoc swagger-ui-express
```

```js
// app.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CodeBharat API',
      version: '1.0.0',
      description: 'REST API for CodeBharat mentorship platform'
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    }
  },
  apis: ['./src/routes/*.js']
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// In route files — JSDoc annotations
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: List of users
 */
```

---

## Rate Limiting

```js
const rateLimit = require('express-rate-limit');

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 100,                    // 100 requests per window
  standardHeaders: true,       // Return RateLimit headers
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests, please try again in 15 minutes'
  }
});

// Stricter for auth routes (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,  // Don't count successful logins
  message: {
    success: false,
    error: 'Too many login attempts, please try again in 15 minutes'
  }
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

---

## API Versioning Strategies

```js
// URL versioning (most common, clear)
app.use('/api/v1/users', v1UserRoutes);
app.use('/api/v2/users', v2UserRoutes);

// Header versioning
app.use((req, res, next) => {
  const version = req.get('API-Version') || 'v1';
  req.apiVersion = version;
  next();
});

// Query param versioning
// GET /api/users?version=2
```

---

## Interview Questions — Step 05

**Q: REST kya hai? Principles explain karo.**
> REST (Representational State Transfer) ek architectural style hai. Principles: stateless (har request self-contained), resource-based URLs (nouns not verbs), HTTP methods properly use karna, uniform interface. REST allows frontend aur backend ko independently develop karne ki.

**Q: GET aur POST mein kya fark hai?**
> GET: Data fetch karo, no body, cacheable, idempotent, URL mein visible. POST: Naya resource create karo, body hoti hai, not cached, not idempotent (baar baar bhejo → multiple creates).

**Q: API versioning kyun karein?**
> Jab API mein breaking changes aate hain (response format change, field remove), existing clients break na hon. Versioning se `/v1` existing clients ke liye work karta rehta hai aur naye clients `/v2` use kar sakte hain.

**Q: CORS kya hai?**
> Browser ka security feature jo different origin (domain/port/protocol) se requests block karta hai by default. `api.example.com` pe `example.com` frontend se request aaye toh CORS headers server se chahiye. Node.js mein `cors` package use karte hain.

---

## Assignment — Step 05

1. Ek Products REST API complete karo (CRUD + pagination + filtering)
2. Postman collection banao with all endpoints, params, auth headers
3. Koi public API use karo (OpenWeatherMap, GitHub, etc.) aur apne backend mein integrate karo
4. Rate limiting + proper error responses add karo
