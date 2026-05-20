# 09 — Authentication & JWT

> Yeh topic har interview mein aata hai. "Login system kaise banate ho?"
> Ek baar samajh gaye toh koi bhi app secure kar sakte ho.

---

## Authentication vs Authorization

```
AUTHENTICATION = "Tum kaun ho?" (Identity verify karna)
  - Login karna
  - Password check karna
  - "Haan, tum Rahul ho"

AUTHORIZATION = "Tumhe kya karne ki permission hai?" (Access control)
  - "Rahul admin hai, toh user delete kar sakta hai"
  - "Priya regular user hai, toh sirf apna profile dekh sakti hai"

Pehle Authentication hoti hai, phir Authorization.
```

---

## Password Hashing — Plain Password KABHI Save Mat Karo

### Kyun?

```
❌ GALAT: Database mein "password123" save karo
   → Database hack ho gayi → sabke passwords leak

✅ SAHI: Password ko hash karo, hash save karo
   → Database hack ho gayi → sirf hash mila → reverse nahi kar sakte
   
bcrypt = Password hashing ke liye sabse popular library
```

```javascript
const bcrypt = require('bcrypt');

// Password hash karna
async function hashPassword(plainPassword) {
  const saltRounds = 10; // Jitna zyada, utna secure (lekin slow bhi)
  // saltRounds = 10 → ~100ms per hash → interview mein yeh value batao
  
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

// Password verify karna
async function verifyPassword(plainPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch; // true ya false
}

// Example use:
async function example() {
  const password = "mySecurePassword123";
  
  // Register ke time
  const hash = await hashPassword(password);
  console.log("Hash:", hash);
  // $2b$10$... (har baar alag hash!)
  
  // Login ke time
  const isValid = await verifyPassword("mySecurePassword123", hash);
  console.log("Valid:", isValid); // true
  
  const isInvalid = await verifyPassword("wrongPassword", hash);
  console.log("Invalid:", isInvalid); // false
}
```

---

## JWT — JSON Web Token

### Kya hota hai JWT?

```
JWT = Ek digital "stamp" jo server deta hai login ke baad.
Har request mein yeh stamp dikhao → server trust karta hai.

Structure (3 parts, dot se alag):
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.abc123xyz

HEADER.PAYLOAD.SIGNATURE

1. HEADER: Algorithm aur type
   { "alg": "HS256", "typ": "JWT" }

2. PAYLOAD: Actual data (claims)
   { "userId": 1, "email": "rahul@example.com", "role": "user", "exp": 1234567890 }
   ⚠️ Yeh ENCODED hai, ENCRYPTED nahi! Koi bhi decode kar sakta hai.
      Sensitive data (password, card number) yahan MAT daalo.

3. SIGNATURE: Verify karne ke liye
   HMACSHA256(base64(header) + "." + base64(payload), SECRET_KEY)
   Yeh sirf server verify kar sakta hai (SECRET_KEY server ke paas hai)
```

```javascript
const jwt = require('jsonwebtoken');

// Token banana
function generateTokens(userId, email, role) {
  // Access token — short-lived (15 minutes)
  const accessToken = jwt.sign(
    { userId, email, role }, // Payload
    process.env.JWT_SECRET,  // Secret key
    { expiresIn: '15m' }     // Expiry
  );
  
  // Refresh token — long-lived (7 days)
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
}

// Token verify karna
function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { valid: false, error: 'Token expire ho gaya' };
    }
    return { valid: false, error: 'Token invalid hai' };
  }
}

// Example:
const { accessToken } = generateTokens(1, 'rahul@example.com', 'user');
console.log(accessToken);
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjF9...

const result = verifyAccessToken(accessToken);
console.log(result.decoded); // { userId: 1, email: 'rahul@example.com', ... }
```

---

## Complete Auth System

```javascript
// models/User.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Naam zaroori hai'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email zaroori hai'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password zaroori hai'],
    minlength: [6, 'Password kam se kam 6 characters ka hona chahiye'],
    select: false // Default mein password return mat karo
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  refreshTokens: [String], // Multiple devices support
  createdAt: { type: Date, default: Date.now }
});

// Save karne se pehle password hash karo
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Sirf tabhi hash karo jab password change ho
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password verify karne ka method
userSchema.methods.comparePassword = async function(plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

```javascript
// controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');

// Helper functions
const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

const authController = {

  // ─── REGISTER ───
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      // Validation
      if (!name || !email || !password) {
        throw new ApiError(400, 'Saari fields zaroori hain');
      }

      if (password.length < 6) {
        throw new ApiError(400, 'Password 6 characters se zyada hona chahiye');
      }

      // Email already registered?
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ApiError(409, 'Yeh email already registered hai');
      }

      // User banao (password model mein automatic hash hoga)
      const user = await User.create({ name, email, password });

      // Tokens generate karo
      const { accessToken, refreshToken } = generateTokens(user._id, user.role);

      // Refresh token save karo
      user.refreshTokens.push(refreshToken);
      await user.save();

      // Refresh token ko httpOnly cookie mein bhejo
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,      // JavaScript se access nahi ho sakta (XSS protection)
        secure: process.env.NODE_ENV === 'production', // HTTPS pe hi
        sameSite: 'strict',  // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
      });

      res.status(201).json({
        success: true,
        message: 'Account ban gaya!',
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // ─── LOGIN ───
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApiError(400, 'Email aur password zaroori hain');
      }

      // User dhundho (password bhi chahiye verify karne ke liye)
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        throw new ApiError(401, 'Email ya password galat hai');
        // Generic message — attacker ko pata nahi chalega ki email exist karta hai ya nahi
      }

      // Password verify karo
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new ApiError(401, 'Email ya password galat hai');
      }

      // Tokens generate karo
      const { accessToken, refreshToken } = generateTokens(user._id, user.role);

      // Refresh token save karo
      user.refreshTokens.push(refreshToken);
      await user.save();

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        message: 'Login successful!',
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // ─── REFRESH TOKEN ───
  async refreshToken(req, res, next) {
    try {
      const token = req.cookies.refreshToken;
      
      if (!token) {
        throw new ApiError(401, 'Refresh token nahi mila');
      }

      // Token verify karo
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      // User ke saved tokens mein check karo
      const user = await User.findById(decoded.userId);
      if (!user || !user.refreshTokens.includes(token)) {
        throw new ApiError(401, 'Invalid refresh token');
      }

      // Purana token hatao, naya do (rotation)
      user.refreshTokens = user.refreshTokens.filter(t => t !== token);
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id, user.role);
      user.refreshTokens.push(newRefreshToken);
      await user.save();

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({ success: true, accessToken });
    } catch (error) {
      next(error);
    }
  },

  // ─── LOGOUT ───
  async logout(req, res, next) {
    try {
      const token = req.cookies.refreshToken;

      if (token) {
        // Database se token hatao
        await User.findByIdAndUpdate(req.user.userId, {
          $pull: { refreshTokens: token }
        });
      }

      res.clearCookie('refreshToken');
      res.json({ success: true, message: 'Logout successful' });
    } catch (error) {
      next(error);
    }
  },

  // ─── GET CURRENT USER ───
  async getMe(req, res, next) {
    try {
      const user = await User.findById(req.user.userId);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
```

```javascript
// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

// Login check karo
function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authorization header chahiye (Bearer token)');
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded; // Agle middleware/controller mein available hoga
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expire ho gaya — refresh karo'));
    }
    next(new ApiError(401, 'Invalid token'));
  }
}

// Role check karo
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Pehle login karo'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Yeh kaam sirf ${roles.join(' ya ')} kar sakta hai`));
    }
    
    next();
  };
}

module.exports = { requireAuth, requireRole };
```

```javascript
// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.getMe);

module.exports = router;

// Admin-only routes example:
const { requireRole } = require('../middleware/auth.middleware');

router.get('/admin/users', requireAuth, requireRole('admin'), async (req, res) => {
  const users = await User.find();
  res.json({ data: users });
});
```

---

## Frontend mein Token Use Karna

```javascript
// React mein — API calls ke saath JWT bhejo

const API_URL = 'http://localhost:3000/api';

// Token localStorage mein store karo (ya memory mein — more secure)
function saveToken(token) {
  localStorage.setItem('accessToken', token);
}

function getToken() {
  return localStorage.getItem('accessToken');
}

function removeToken() {
  localStorage.removeItem('accessToken');
}

// API call helper
async function apiCall(endpoint, options = {}) {
  const token = getToken();
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    },
    credentials: 'include' // Cookies bhi bhejo (refresh token ke liye)
  });

  // Token expire hua?
  if (response.status === 401) {
    // Refresh karo
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      // Logout karo
      removeToken();
      window.location.href = '/login';
      return;
    }
    
    // Dobara try karo new token ke saath
    return apiCall(endpoint, options);
  }

  return response.json();
}

// Token refresh karo
async function refreshAccessToken() {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include' // Cookie mein refresh token hai
    });
    
    if (!response.ok) return false;
    
    const data = await response.json();
    saveToken(data.accessToken);
    return true;
  } catch {
    return false;
  }
}

// Login
async function login(email, password) {
  const data = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  if (data.success) {
    saveToken(data.accessToken);
    return data.user;
  }
  
  throw new Error(data.message);
}
```

---

## Security Checklist

```
✅ Password hashing: bcrypt use karo (never plain text)
✅ JWT secret: Strong random string (min 32 chars)
✅ Token expiry: Access token short (15m), Refresh token longer (7d)
✅ httpOnly cookies: Refresh token ko JS se access na ho
✅ HTTPS: Production mein sirf HTTPS
✅ Rate limiting: Login endpoint pe especially
✅ Input validation: Email format, password strength
✅ Generic error messages: "Email ya password galat" (not "Email not found")
✅ Refresh token rotation: Har use ke baad naya token
✅ Logout: Server se token remove karo (not just client-side)

❌ Never: .env file ko Git mein push karo
❌ Never: Console mein password print karo
❌ Never: Sensitive data JWT payload mein daalo
❌ Never: Short passwords allow karo
```

---

## Interview Questions

```
Q: JWT aur Session-based auth mein kya fark hai?

Session-based:
- Server session store karta hai (database ya memory)
- Client ko sirf session ID milta hai (cookie mein)
- Stateful — server ko yaad rakhna padta hai
- Multiple servers mein problems (shared session store chahiye)

JWT:
- Server kuch store nahi karta
- Token mein sab info hai (signed)
- Stateless — koi bhi server verify kar sakta hai
- Scaling easy hai (no shared state)
- Drawback: Logout karna mushkil (token expire hone tak valid hai)

─────────────────────────────────────────

Q: Access token aur Refresh token mein kya fark hai?

Access token:
- Short-lived (15 minutes)
- Har API request ke saath bhejo (Authorization header)
- Agar leak ho → thodi der mein expire ho jaayega

Refresh token:
- Long-lived (7 days)
- Sirf naya access token lene ke liye
- httpOnly cookie mein store karo
- Database mein store karo (revoke kar sako)

─────────────────────────────────────────

Q: XSS aur CSRF attacks kya hain aur kaise bachein?

XSS (Cross-Site Scripting):
- Attacker malicious script page mein inject karta hai
- localStorage se token steal kar sakta hai
- Bachao: Token httpOnly cookie mein rakho, input sanitize karo

CSRF (Cross-Site Request Forgery):
- Doosri site tumhare naam pe request bhejti hai
- Bachao: SameSite=strict cookie, CSRF tokens
```

---

## Assignment

```
1. Complete Auth System banao:
   - Register (name, email, password)
   - Login → JWT access + refresh token
   - Protected route: GET /api/profile
   - Logout
   - Refresh token endpoint
   
2. Role-based access add karo:
   - Admin route: GET /api/admin/users (sirf admin)
   - User route: GET /api/profile (logged in users)
   
3. Frontend se connect karo (React):
   - Login form
   - Protected page (sirf logged in users dekh sakein)
   - Logout button
   - Token auto-refresh
   
4. GitHub pe push karo — .env file push mat karna!
   .env.example zaroor push karo.
```

---

> *Yeh sab seekh liya? Ab full-stack project banana shuru karo!*
> *Projects guide: [../06-real-world-projects.md](../06-real-world-projects.md)*
