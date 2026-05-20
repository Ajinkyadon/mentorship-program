# Module 7: Databases
### "Data permanently rakhna hai? Database chahiye."

---

## Why Databases?

```
Without DB: Server restart = sab data gone
With DB: Data persists permanently

Memory (RAM) → Fast but temporary
Database → Slower but permanent
```

---

## SQL vs NoSQL

| | SQL | NoSQL |
|--|-----|-------|
| Structure | Tables (rows + columns) | Documents (JSON) |
| Schema | Fixed (define pehle) | Flexible (kuch bhi) |
| Relations | JOINs se | Embed ya reference |
| Examples | PostgreSQL, MySQL, SQLite | MongoDB, Redis, Cassandra |
| Best for | Complex queries, strong relations | Fast iteration, flexible data |
| Scaling | Vertical (bigger machine) | Horizontal (more machines) |
| ACID | Strong guarantees | Varies |

**Freshers ke liye:** Dono seekho — MongoDB (NoSQL) + PostgreSQL/MySQL (SQL). Most companies koi ek use karti hain.

---

## SQL Basics

### Core SQL Commands
```sql
-- Create table
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  age        INT CHECK (age >= 18),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert
INSERT INTO users (name, email, age) VALUES ('Rahul', 'rahul@example.com', 22);

-- Select
SELECT * FROM users;
SELECT name, email FROM users WHERE age > 20;
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;

-- Update
UPDATE users SET age = 23 WHERE id = 1;

-- Delete
DELETE FROM users WHERE id = 5;

-- Count, sum, avg
SELECT COUNT(*) FROM users;
SELECT AVG(age) FROM users;
SELECT MAX(created_at) FROM users;
```

### WHERE Conditions
```sql
WHERE age > 18
WHERE name = 'Rahul'
WHERE email LIKE '%@gmail.com'
WHERE age BETWEEN 20 AND 30
WHERE city IN ('Mumbai', 'Pune', 'Delhi')
WHERE age IS NOT NULL
WHERE age > 18 AND city = 'Mumbai'
WHERE age < 18 OR age > 60
```

### JOINs (Important!)
```sql
-- INNER JOIN: dono tables mein match ho
SELECT users.name, orders.amount
FROM users
INNER JOIN orders ON users.id = orders.user_id;

-- LEFT JOIN: sab users, chahe order ho ya na ho
SELECT users.name, orders.amount
FROM users
LEFT JOIN orders ON users.id = orders.user_id;

-- Multiple JOINs
SELECT u.name, p.title, c.text
FROM users u
INNER JOIN posts p ON u.id = p.user_id
INNER JOIN comments c ON p.id = c.post_id
WHERE u.id = 1;
```

### GROUP BY
```sql
-- Har user ke kitne orders hain?
SELECT user_id, COUNT(*) as order_count
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 5;

-- Har city mein kitne users?
SELECT city, COUNT(*) as count
FROM users
GROUP BY city
ORDER BY count DESC;
```

---

## MongoDB Basics

### Core Concepts
```
SQL          ↔  MongoDB
Database     ↔  Database
Table        ↔  Collection
Row          ↔  Document
Column       ↔  Field
JOIN         ↔  $lookup or populate()
Primary key  ↔  _id (auto-generated ObjectId)
```

### CRUD Operations
```js
// Create
await User.create({ name: 'Priya', email: 'priya@example.com', age: 22 });
await User.insertMany([{ name: 'A' }, { name: 'B' }]);

// Read
await User.find();                              // all
await User.find({ city: 'Mumbai' });           // filter
await User.findById('64abc123');               // by id
await User.findOne({ email: 'priya@x.com' }); // first match

// With options
await User.find({ age: { $gte: 18 } })
  .select('name email')    // only these fields
  .sort({ createdAt: -1 }) // newest first
  .skip(0)                 // pagination
  .limit(10);

// Update
await User.findByIdAndUpdate(id, { age: 23 }, { new: true }); // new: return updated doc
await User.updateMany({ city: 'Bombay' }, { city: 'Mumbai' });

// Delete
await User.findByIdAndDelete(id);
await User.deleteMany({ isActive: false });

// Count
await User.countDocuments({ city: 'Mumbai' });
```

### MongoDB Query Operators
```js
// Comparison
{ age: { $gt: 18 } }     // greater than
{ age: { $gte: 18 } }    // greater than or equal
{ age: { $lt: 30 } }     // less than
{ age: { $ne: 0 } }      // not equal
{ city: { $in: ['Mumbai', 'Pune'] } }  // in list

// Logical
{ $and: [{ age: { $gte: 18 } }, { city: 'Mumbai' }] }
{ $or: [{ age: { $lt: 18 } }, { age: { $gt: 60 } }] }
{ age: { $not: { $gte: 18 } } }

// Text search
{ name: /^Rah/i }         // regex — starts with "Rah" (case insensitive)
{ $text: { $search: 'Mumbai' } }  // full-text search (needs text index)
```

---

## Schema Design with Mongoose

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Invalid email'
    }
  },
  password: {
    type: String,
    required: true,
    select: false  // never return in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'mentor'],
    default: 'user'
  },
  profile: {
    avatar: String,
    bio: { type: String, maxlength: 500 },
    skills: [String]
  },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, {
  timestamps: true  // auto adds createdAt and updatedAt
});

// Virtual (not stored in DB)
userSchema.virtual('fullInfo').get(function() {
  return `${this.name} (${this.email})`;
});

// Pre-save hook (hash password automatically)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
```

---

## Database Relationships

### One-to-Many (Reference)
```js
// One User → Many Posts
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Populate (like JOIN)
const posts = await Post.find()
  .populate('author', 'name email avatar');
```

### Many-to-Many
```js
// Students ↔ Courses
const studentSchema = new mongoose.Schema({
  name: String,
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const courseSchema = new mongoose.Schema({
  title: String,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});
```

### Embed vs Reference

**Embed karo (document ke andar):**
- Data hamesha saath use hota hai
- Independent existence nahi hai
- Small aur limited data

```js
// Embedded
const orderSchema = new mongoose.Schema({
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }]
});
```

**Reference karo (separate collection):**
- Data independent bhi use hota hai
- Many-to-many relationships
- Large data sets

---

## Indexing

**Index = Database ki search speed badhata hai.**

```js
// Without index: full collection scan (slow on large data)
// With index: direct lookup (fast)

// Single field index
userSchema.index({ email: 1 });         // ascending
userSchema.index({ createdAt: -1 });    // descending (newest first)

// Compound index
userSchema.index({ city: 1, age: 1 });  // queries filtering by city + age

// Unique index
userSchema.index({ email: 1 }, { unique: true });

// Text index for search
postSchema.index({ title: 'text', content: 'text' });
```

**When to add index:**
- Fields you frequently query/filter on
- Fields you sort on
- Foreign key references

**Downside:** More indexes = slower writes. Don't add index on every field.

---

## Pagination

```js
// Offset pagination (simple, common)
const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 10;
const skip = (page - 1) * limit;

const [data, total] = await Promise.all([
  Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
  Post.countDocuments()
]);

res.json({
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1
  }
});
```

---

## Aggregation Pipeline (MongoDB)

```js
// Monthly revenue
const revenue = await Order.aggregate([
  {
    $match: {
      status: 'completed',
      createdAt: { $gte: new Date('2024-01-01') }
    }
  },
  {
    $group: {
      _id: { $month: '$createdAt' },
      total: { $sum: '$amount' },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);
```

---

## Database Connection (Mongoose)

```js
// config/database.js
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10  // connection pool
    });
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Reconnect on disconnect
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected — attempting reconnect');
  setTimeout(connectDB, 5000);
});

module.exports = connectDB;
```

---

## SQL with Prisma (Bonus)

```js
// schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  content  String
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}
```

```js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create with nested relation
const user = await prisma.user.create({
  data: {
    name: 'Rahul',
    email: 'rahul@x.com',
    posts: {
      create: { title: 'First post', content: 'Hello world' }
    }
  },
  include: { posts: true }
});

// Complex query
const users = await prisma.user.findMany({
  where: { posts: { some: { title: { contains: 'Node' } } } },
  include: { posts: { orderBy: { createdAt: 'desc' } } },
  skip: 0,
  take: 10
});
```

---

## Assignment — Module 7

1. Blog API schema design karo:
   - Users, Posts, Comments, Categories, Tags
   - Relations diagram banao (pen-paper bhi chalega)

2. Mongoose mein implement karo:
   - User model (with password hashing hook)
   - Post model (with author reference)
   - Posts with pagination API

3. Aggregation: "Most popular posts" (by comment count) query likho

4. Index add karo appropriate fields pe aur explain karo kyun
