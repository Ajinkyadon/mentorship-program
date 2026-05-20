# Step 06: Authentication & Authorization
### "Tu kaun hai? Tu ye kar sakta hai?"

---

## Authentication vs Authorization

```
Authentication = Identity verify karna
  → "Tu kaun hai?"
  → Login, register, OAuth

Authorization = Permissions check karna
  → "Tu ye kaam kar sakta hai?"
  → Role-based access, ownership check
```

**Sequence:**
```
Request aaya
    ↓
Authentication: Token valid hai? User exist karta hai?
    ↓ (fail → 401 Unauthorized)
Authorization: Is user ko ye action karne ki permission hai?
    ↓ (fail → 403 Forbidden)
Route handler: Business logic run karo
```

---

## Why Not Store Plain Passwords?

```
Database breach hua → Attacker ko plaintext passwords mila → All users compromised

Solution: Password hashing — one-way transformation
Plaintext: "mypassword123"
Hashed:    "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"

Hashing properties:
✅ Same input → Same output (deterministic)
✅ One-way (original recover nahi ho sakta)
✅ Even 1 char change → Completely different hash
✅ bcrypt adds "salt" → Same password different users = different hash
```

---

## bcrypt — Password Hashing

```bash
npm install bcrypt
```

```js
const bcrypt = require('bcrypt');

// Registration ke waqt
async function hashPassword(plainPassword) {
  const saltRounds = 10;  // Cost factor: 2^10 = 1024 iterations
  // Jitna zyada → Slower (brute force hard) but also slower for users
  // 10-12 reasonable hai
  return await bcrypt.hash(plainPassword, saltRounds);
}

// Login ke waqt
async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
  // true or false
}

// Usage
const hash = await bcrypt.hash('mypassword123', 10);
// "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p..."

const isMatch = await bcrypt.compare('mypassword123', hash); // true
const isMatch2 = await bcrypt.compare('wrongpassword', hash); // false
```

**bcrypt auto-generates and embeds salt in the hash — manually salt mat karo.**

---

## JWT — JSON Web Tokens

### Structure
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InJhaHVsQHguY29tIiwiaWF0IjoxNzA1MzE0NjAwLCJleHAiOjE3MDU5MTk0MDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

     ↑                                    ↑                                                                          ↑
  HEADER                               PAYLOAD                                                                  SIGNATURE
  base64url                           base64url                                                                  base64url
{                              {                                                              HMACSHA256(
  "alg": "HS256",                "userId": "123",                                              base64url(header) + "." +
  "typ": "JWT"                   "email": "rahul@x.com",                                       base64url(payload),
}                                "role": "user",                                               SECRET_KEY
                                 "iat": 1705314600,    ← issued at                           )
                                 "exp": 1705919400     ← expires at
                               }
```

### JWT Workflow
```
1. LOGIN:
   User sends email + password
       ↓
   Server verifies credentials
       ↓
   Server creates JWT: jwt.sign({ userId, email, role }, SECRET, { expiresIn: '7d' })
       ↓
   JWT send to client

2. SUBSEQUENT REQUESTS:
   Client sends: Authorization: Bearer <token>
       ↓
   Server: jwt.verify(token, SECRET) → decoded payload
       ↓
   userId/email available as req.user
       ↓
   Route handler proceeds

3. TOKEN EXPIRED:
   jwt.verify throws TokenExpiredError
       ↓
   Server returns 401
       ↓
   Client must login again (or use refresh token)
```

```bash
npm install jsonwebtoken
```

```js
const jwt = require('jsonwebtoken');

// Create token
function generateToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,      // Strong secret — 256+ bits
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      issuer: 'codebharat-api',
      audience: 'codebharat-client'
    }
  );
}

// Verify token
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
  // Returns decoded payload or throws
}

// Decode without verify (for debugging only — never use for auth)
const decoded = jwt.decode(token);
```

---

## Complete Authentication System

```js
// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// REGISTER
exports.register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Check if email already registered
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword
  });

  // 4. Generate token
  const token = generateToken(user);

  // 5. Send response (never send password back)
  res.status(201).json({
    success: true,
    message: 'Registration successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// LOGIN
exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user (include password — usually excluded)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  // 2. Check user exists + password correct (same error message — security!)
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid email or password', 401);
    // Note: "Email not found" vs "Wrong password" alag alag batao toh attacker ko advantage milta hai
  }

  // 3. Check if account is active
  if (!user.isActive) {
    throw new AppError('Account has been deactivated. Contact support.', 403);
  }

  // 4. Update last login
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  // 5. Generate token
  const token = generateToken(user);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// GET CURRENT USER
exports.getMe = catchAsync(async (req, res) => {
  // req.user is set by authenticate middleware
  const user = await User.findById(req.user.userId).select('-password');
  res.json({ success: true, data: user });
});

// CHANGE PASSWORD
exports.changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.userId).select('+password');

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    throw new AppError('Current password is incorrect', 401);
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ success: true, message: 'Password changed successfully' });
});
```

---

## Authentication Middleware

```js
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.authenticate = catchAsync(async (req, res, next) => {
  // 1. Token extract karo
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new AppError('Please log in to access this resource', 401);
  }

  // 2. Token verify karo
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Your session has expired. Please log in again.', 401);
    }
    throw new AppError('Invalid authentication token', 401);
  }

  // 3. User still exists check karo
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new AppError('User no longer exists', 401);
  }

  // 4. Account active hai check karo
  if (!user.isActive) {
    throw new AppError('Your account has been deactivated', 403);
  }

  // 5. Attach user to request
  req.user = { userId: user._id, email: user.email, role: user.role };
  next();
});

// Authorization — Role check
exports.requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new AppError(
      `This action requires ${roles.join(' or ')} role. You have: ${req.user.role}`,
      403
    );
  }
  next();
};

// Authorization — Ownership check
exports.requireOwnership = (getResourceUserId) => catchAsync(async (req, res, next) => {
  const resourceUserId = await getResourceUserId(req);
  const isOwner = resourceUserId.toString() === req.user.userId.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new AppError('You can only modify your own resources', 403);
  }
  next();
});
```

---

## Refresh Tokens

```
Problem with short JWT expiry:
  → 15 min expiry → user har 15 min login kare? Bad UX

Solution: Two tokens:
  1. Access token  → Short lived (15 min), used for API calls
  2. Refresh token → Long lived (30 days), stored securely, used ONLY to get new access token
```

```js
// Generate both tokens
function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
}

// Refresh endpoint
router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Rotate refresh token
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true, secure: true, sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true, accessToken });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});
```

---

## Session-Based Auth vs JWT

| | Sessions | JWT |
|--|---------|-----|
| Storage | Server-side (DB/Redis) | Client-side (localStorage/cookie) |
| Scalability | Tricky (sticky sessions) | Easy (stateless) |
| Revocation | Easy (delete session) | Hard (token valid till expiry) |
| Size | Small cookie (session ID) | Larger token |
| Use case | Traditional web apps | APIs, SPAs, mobile apps |

---

## OAuth 2.0 (Google/GitHub Login)

```
User clicks "Login with Google"
    ↓
Redirect to Google: accounts.google.com/o/oauth2/auth?...
    ↓
User logs in on Google
    ↓
Google redirects back: /auth/google/callback?code=AUTH_CODE
    ↓
Backend exchanges code for access token (server-to-server)
    ↓
Backend fetches user info from Google
    ↓
Find or create user in own DB
    ↓
Issue own JWT token
    ↓
Redirect user to frontend with token
```

```bash
npm install passport passport-google-oauth20
```

```js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ googleId: profile.id });

  if (!user) {
    user = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      avatar: profile.photos[0].value
    });
  }

  done(null, user);
}));

// Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);
```

---

## Password Reset Flow

```
1. User: "Forgot password" → enters email
2. Server: Find user by email → generate reset token (random, hashed) → store in DB with expiry
3. Server: Send email with reset link → /reset-password?token=abc123
4. User: Click link → enter new password
5. Server: Verify token (not expired, matches hash) → update password → invalidate token
```

```js
const crypto = require('crypto');

// Forgot password
router.post('/forgot-password', catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    // Don't reveal if email exists
    return res.json({ message: 'If that email is registered, you will receive a reset link.' });
  }

  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  // Send email
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendEmail({ to: user.email, subject: 'Password Reset', resetUrl });

  res.json({ message: 'Reset link sent to your email' });
}));

// Reset password
router.post('/reset-password', catchAsync(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiry: { $gt: Date.now() }
  });

  if (!user) throw new AppError('Invalid or expired reset token', 400);

  user.password = await bcrypt.hash(req.body.newPassword, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;
  await user.save();

  res.json({ message: 'Password reset successful. Please login.' });
}));
```

---

## Security Checklist

```
Passwords:
✅ bcrypt with cost factor 10+
✅ Never store or log plaintext passwords
✅ Minimum 8 characters validation

JWT:
✅ Strong secret (256+ bits, random)
✅ Short expiry for access tokens (15m-24h)
✅ Refresh token rotation
✅ Store in httpOnly cookie (not localStorage for sensitive apps)

Auth Flow:
✅ Rate limit login/register endpoints (5-10 per 15 min)
✅ Same error message for invalid email/password
✅ Log failed attempts
✅ Account lockout after N failed attempts (optional)

General:
✅ HTTPS only in production
✅ Validate all input
✅ Never expose internal errors to client
```

---

## Interview Questions — Step 06

**Q: JWT kya hai? Kaise kaam karta hai?**
> JWT ek compact, self-contained token hai jisme payload encoded hota hai. Login pe server signs karta hai secret key se. Client token store karta hai. Har request mein Authorization header mein bhejta hai. Server verify karta hai signature se — database lookup ki zarurat nahi.

**Q: Authentication aur Authorization mein kya fark hai?**
> Authentication = identity verify karna (who are you) — login, token verify. Authorization = permissions check karna (what can you do) — role check, ownership check. Authentication pehle hoti hai, authorization baad mein.

**Q: Cookies vs localStorage for token storage?**
> httpOnly cookies: JavaScript access nahi kar sakta — XSS se safe. Secure + SameSite flags add karo. localStorage: JavaScript accessible — XSS vulnerability. Sensitive apps ke liye httpOnly cookie prefer karo.

**Q: Refresh token kyun chahiye?**
> Short access token (15 min) aur long refresh token (30 days). Access token expire hone pe, refresh token se naya access token lo bina re-login ke. Refresh token compromise hone pe revoke kar sakte hain (server-side invalidation).

---

## Assignment — Step 06

1. Complete auth system:
   - Register (name, email, password with validation)
   - Login (return JWT)
   - Get current user (protected route)
   - Change password
   - Logout (client-side token remove)

2. Role-based access:
   - Regular user: apna profile dekhna + update
   - Admin: sab users dekhna, user delete karna

3. Forgot password flow implement karo (email + reset token)
4. Auth middleware unit test likho
