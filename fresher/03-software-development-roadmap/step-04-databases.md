# Step 04: Databases
### "Data permanently rakhna hai? Database chahiye."

---

## Why Databases?

```
Variable/Array mein store karo:
→ Server restart = sab data gone ❌

File mein store karo:
→ Concurrent access issues, slow search ❌

Database mein store karo:
→ Persistent, fast, concurrent, relationships ✅
```

Database = **Organized data store with structured access.**

---

## SQL vs NoSQL — Deep Comparison

| Feature | SQL (Relational) | NoSQL (Non-Relational) |
|---------|-----------------|----------------------|
| Data Model | Tables (rows + columns) | Documents, Key-Value, Graph, Column |
| Schema | Fixed — pehle define karo | Flexible — evolve karo |
| Relations | Foreign keys + JOINs | Embedding ya referencing |
| Query Language | SQL (standard) | Varies (MongoDB Query, etc.) |
| ACID | Strong | Varies (MongoDB = ACID in newer versions) |
| Scaling | Vertical (mostly) | Horizontal (easy) |
| Examples | PostgreSQL, MySQL, SQLite | MongoDB, Redis, Cassandra |
| Best For | Complex queries, strict data integrity | Fast iteration, flexible schema, scale |

**Fresher advice:** Dono seekho. MongoDB easy hai start ke liye. PostgreSQL industry mein bahut common hai.

---

## SQL — Structured Query Language

### Database, Table, Row, Column
```sql
-- Database create karo
CREATE DATABASE college;
USE college;

-- Table create karo (schema define karo pehle)
CREATE TABLE students (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(255)  UNIQUE NOT NULL,
  phone      VARCHAR(15),
  age        INT           CHECK (age >= 18 AND age <= 100),
  city       VARCHAR(100)  DEFAULT 'Unknown',
  cgpa       DECIMAL(3,2)  CHECK (cgpa >= 0 AND cgpa <= 10),
  is_active  BOOLEAN       DEFAULT TRUE,
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Data Types
```sql
-- Numeric
INT, BIGINT, SMALLINT
DECIMAL(8,2)    -- 8 digits total, 2 after decimal (99999.99)
FLOAT, DOUBLE

-- Text
VARCHAR(255)    -- Variable length (up to 255 chars)
CHAR(10)        -- Fixed length
TEXT            -- Long text (no limit)
ENUM('admin','user','moderator')  -- Predefined values

-- Date/Time
DATE            -- '2024-01-15'
TIME            -- '14:30:00'
DATETIME        -- '2024-01-15 14:30:00'
TIMESTAMP       -- Like DATETIME, auto-updates possible

-- Boolean
BOOLEAN / TINYINT(1)  -- 0 or 1

-- JSON (newer versions)
JSON
```

### CRUD Operations
```sql
-- CREATE (INSERT)
INSERT INTO students (name, email, age, city, cgpa)
VALUES ('Rahul Kumar', 'rahul@example.com', 22, 'Mumbai', 8.5);

-- Multiple rows
INSERT INTO students (name, email, age) VALUES
  ('Priya Sharma', 'priya@x.com', 21),
  ('Amit Patel',   'amit@x.com',  23),
  ('Neha Singh',   'neha@x.com',  22);

-- READ (SELECT)
SELECT * FROM students;                              -- All columns
SELECT name, email, cgpa FROM students;              -- Specific columns
SELECT * FROM students WHERE city = 'Mumbai';        -- Filter
SELECT * FROM students WHERE cgpa > 8.0 AND age < 23; -- Multiple conditions
SELECT * FROM students ORDER BY cgpa DESC;           -- Sort descending
SELECT * FROM students ORDER BY name ASC;            -- Sort ascending
SELECT * FROM students LIMIT 10;                     -- First 10 rows
SELECT * FROM students LIMIT 10 OFFSET 20;          -- Skip 20, next 10 (pagination)

-- UPDATE
UPDATE students SET city = 'Pune' WHERE id = 5;
UPDATE students SET cgpa = 9.0, city = 'Delhi' WHERE name = 'Rahul Kumar';
-- WARNING: UPDATE bina WHERE ke → SARE rows update ho jaate hain!

-- DELETE
DELETE FROM students WHERE id = 5;
DELETE FROM students WHERE is_active = FALSE;
-- WARNING: DELETE bina WHERE ke → SARI rows delete ho jaati hain!
```

### WHERE Conditions
```sql
WHERE age = 22                          -- Equal
WHERE age != 22                         -- Not equal
WHERE age > 18                          -- Greater than
WHERE age >= 18                         -- Greater than or equal
WHERE age BETWEEN 18 AND 25            -- Range (inclusive)
WHERE city IN ('Mumbai', 'Pune', 'Delhi') -- Multiple values
WHERE city NOT IN ('Jaipur', 'Lucknow') -- Exclude values
WHERE name LIKE 'Rah%'                  -- Starts with Rah
WHERE name LIKE '%Kumar'                -- Ends with Kumar
WHERE name LIKE '%Kum%'                 -- Contains Kum
WHERE email IS NULL                     -- NULL check
WHERE email IS NOT NULL                 -- Not null check

-- Combine
WHERE cgpa > 8.0 AND city = 'Mumbai'
WHERE city = 'Mumbai' OR city = 'Pune'
WHERE NOT (city = 'Delhi')
WHERE (cgpa > 8.0 OR age < 22) AND is_active = TRUE
```

### Aggregate Functions
```sql
SELECT COUNT(*) FROM students;                     -- Total rows
SELECT COUNT(phone) FROM students;                 -- Non-null phone count
SELECT AVG(cgpa) FROM students;                    -- Average CGPA
SELECT MAX(cgpa) FROM students;                    -- Highest CGPA
SELECT MIN(age) FROM students;                     -- Youngest
SELECT SUM(cgpa) FROM students;                    -- Sum of CGPAs

-- GROUP BY
SELECT city, COUNT(*) AS student_count, AVG(cgpa) AS avg_cgpa
FROM students
GROUP BY city
ORDER BY student_count DESC;

-- HAVING (GROUP BY ke baad filter)
SELECT city, COUNT(*) AS cnt
FROM students
GROUP BY city
HAVING COUNT(*) > 5;    -- Sirf wo cities jo 5 se zyada students hain
```

### JOINs — Tables Connect Karna
```sql
-- Sample tables
CREATE TABLE courses (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  title   VARCHAR(200) NOT NULL,
  credits INT DEFAULT 3
);

CREATE TABLE enrollments (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id  INT NOT NULL,
  grade      CHAR(2),
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE
);

-- INNER JOIN: Dono tables mein match hone chahiye
SELECT s.name, s.email, c.title, e.grade
FROM students s
INNER JOIN enrollments e ON s.id = e.student_id
INNER JOIN courses c ON e.course_id = c.id;

-- LEFT JOIN: Sab students — enrolled hain ya nahi
SELECT s.name, c.title
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id
LEFT JOIN courses c ON e.course_id = c.id;
-- Students jo kisi course mein enrolled nahi → c.title = NULL

-- RIGHT JOIN: Sab courses — enrolled students hain ya nahi
SELECT s.name, c.title
FROM enrollments e
RIGHT JOIN courses c ON e.course_id = c.id
LEFT JOIN students s ON e.student_id = s.id;

-- Self JOIN (same table se join)
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

### Subqueries
```sql
-- Scalar subquery
SELECT name FROM students
WHERE cgpa > (SELECT AVG(cgpa) FROM students);

-- IN subquery
SELECT name FROM students
WHERE id IN (
  SELECT student_id FROM enrollments WHERE course_id = 5
);

-- EXISTS subquery
SELECT name FROM students s
WHERE EXISTS (
  SELECT 1 FROM enrollments e WHERE e.student_id = s.id
);
```

### Indexes
```sql
-- Create index
CREATE INDEX idx_students_city ON students(city);
CREATE INDEX idx_students_cgpa ON students(cgpa);
CREATE UNIQUE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_city_cgpa ON students(city, cgpa); -- Compound

-- View indexes
SHOW INDEX FROM students;

-- Drop index
DROP INDEX idx_students_city ON students;
```

---

## MongoDB — Document Database

### Core Concepts
```
Database    → Database
Collection  → Table ke jaisa (students, courses)
Document    → Row ke jaisa (JSON object)
Field       → Column ke jaisa
_id         → Auto-generated unique ID (ObjectId)
```

### BSON Document
```json
{
  "_id": "ObjectId('64abc123def456')",
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "age": 22,
  "city": "Mumbai",
  "skills": ["JavaScript", "Node.js", "MongoDB"],
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "pin": "400001"
  },
  "isActive": true,
  "createdAt": "ISODate('2024-01-15T10:30:00Z')"
}
```

### MongoDB CRUD (Shell)
```js
// Switch database
use college

// INSERT
db.students.insertOne({
  name: "Rahul Kumar",
  email: "rahul@example.com",
  age: 22,
  skills: ["JS", "Node"]
});

db.students.insertMany([
  { name: "Priya", email: "priya@x.com" },
  { name: "Amit",  email: "amit@x.com"  }
]);

// READ
db.students.find();                              // All
db.students.find({ city: "Mumbai" });           // Filter
db.students.findOne({ email: "rahul@x.com" });  // First match
db.students.find({ age: { $gt: 20 } });        // age > 20

// READ with options
db.students.find({ city: "Mumbai" })
  .sort({ cgpa: -1 })       // Descending
  .limit(10)
  .skip(0)
  .projection({ name: 1, email: 1, _id: 0 }); // Only name + email

// UPDATE
db.students.updateOne(
  { _id: ObjectId("64abc123") },
  { $set: { city: "Pune", age: 23 } }
);

db.students.updateMany(
  { city: "Bombay" },
  { $set: { city: "Mumbai" } }
);

// Delete
db.students.deleteOne({ _id: ObjectId("64abc123") });
db.students.deleteMany({ isActive: false });

// Count
db.students.countDocuments({ city: "Mumbai" });
```

### Mongoose — Node.js ODM for MongoDB
```js
const mongoose = require('mongoose');

// Schema define karo
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: props => `${props.value} is not a valid email`
    }
  },
  age: {
    type: Number,
    min: [18, 'Age must be at least 18'],
    max: [100, 'Age cannot exceed 100']
  },
  skills: [String],
  address: {
    city: String,
    pin: String
  },
  role: {
    type: String,
    enum: ['student', 'mentor', 'admin'],
    default: 'student'
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true   // Auto adds createdAt + updatedAt
});

// Indexes
studentSchema.index({ email: 1 }, { unique: true });
studentSchema.index({ city: 1, cgpa: -1 });

// Virtual (not stored, computed)
studentSchema.virtual('profileUrl').get(function() {
  return `/students/${this._id}`;
});

// Pre-save hook
studentSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Instance method
studentSchema.methods.isEnrolledIn = async function(courseId) {
  const enrollment = await Enrollment.findOne({
    student: this._id,
    course: courseId
  });
  return !!enrollment;
};

// Static method
studentSchema.statics.findByCity = function(city) {
  return this.find({ city });
};

const Student = mongoose.model('Student', studentSchema);
```

### Mongoose CRUD (In Code)
```js
// Create
const student = await Student.create({
  name: 'Priya Sharma',
  email: 'priya@example.com',
  age: 21
});

// Read
const all = await Student.find();
const mumbaiStudents = await Student.find({ 'address.city': 'Mumbai' });
const one = await Student.findById('64abc123');
const byEmail = await Student.findOne({ email: 'priya@x.com' });

// With options
const paged = await Student
  .find({ isActive: true })
  .select('name email age')       // Only these fields
  .sort({ createdAt: -1 })        // Newest first
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();                         // Plain JS object (faster, no Mongoose overhead)

// Update
const updated = await Student.findByIdAndUpdate(
  id,
  { $set: { age: 22, 'address.city': 'Pune' } },
  { new: true, runValidators: true }  // Return updated doc + run validators
);

// Delete
await Student.findByIdAndDelete(id);
await Student.deleteMany({ isActive: false });

// Count
const total = await Student.countDocuments({ isActive: true });
```

### Relationships in MongoDB

**Reference (like SQL Foreign Key):**
```js
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',   // Reference to User model
    required: true
  },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]
});

// Populate — reference ko actual data se replace karo
const posts = await Post.find()
  .populate('author', 'name email avatar')  // Sirf ye fields
  .populate('tags', 'name');

// Deep populate
const post = await Post.findById(id)
  .populate({
    path: 'comments',
    populate: {
      path: 'author',
      select: 'name avatar'
    }
  });
```

**Embed (document ke andar):**
```js
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{        // Embedded array of objects
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,  // Snapshot at time of order
    price: Number,
    quantity: Number
  }],
  totalAmount: Number,
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered'] }
});
```

**When to embed vs reference:**
```
Embed karo:
✅ Data hamesha saath use hota hai (order items)
✅ Data zyada nahi change hoga
✅ Small amount of data (1:few relationship)

Reference karo:
✅ Data independent use hota hai
✅ Many-to-many relationships
✅ Data frequently changes
✅ Large amount of data (1:many — ek user ke 1000 posts)
```

### Aggregation Pipeline
```js
// Average CGPA by city
const stats = await Student.aggregate([
  { $match: { isActive: true } },                    // Filter
  { $group: {
    _id: '$address.city',                             // Group by city
    avgCgpa: { $avg: '$cgpa' },
    count: { $sum: 1 },
    maxCgpa: { $max: '$cgpa' }
  }},
  { $sort: { avgCgpa: -1 } },                        // Sort by avgCgpa
  { $project: {                                       // Reshape output
    city: '$_id',
    avgCgpa: { $round: ['$avgCgpa', 2] },
    count: 1,
    _id: 0
  }}
]);

// Monthly registrations
const monthly = await Student.aggregate([
  {
    $group: {
      _id: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      },
      count: { $sum: 1 }
    }
  },
  { $sort: { '_id.year': 1, '_id.month': 1 } }
]);
```

---

## Database Indexing (Deep Dive)

```
Without index: Full collection scan = O(n)
With index: B-Tree lookup = O(log n)

Example:
1 million users, find by email:
Without index: Check all 1M documents → slow
With index: B-Tree lookup → milliseconds
```

```js
// When to add index:
// 1. Fields you frequently query/filter on
// 2. Fields you sort on often
// 3. Fields used in JOIN/populate

// Mongoose
userSchema.index({ email: 1 });              // Single field
userSchema.index({ city: 1, age: -1 });      // Compound
userSchema.index({ name: 'text', bio: 'text' }); // Text search
userSchema.index({ location: '2dsphere' });  // Geospatial

// MongoDB Shell
db.users.createIndex({ email: 1 }, { unique: true });
db.posts.createIndex({ createdAt: -1 });     // Newest first queries
db.posts.createIndex({ title: 'text' });     // Full text search
```

**Index downsides:**
- Write operations slow ho jaati hain (index maintain karna padta hai)
- Extra disk space
- **Don't index everything** — only query-heavy fields

---

## Transactions

```js
// Multiple operations atomically
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Transfer money: deduct from sender, add to receiver
  await Account.findByIdAndUpdate(
    senderId,
    { $inc: { balance: -amount } },
    { session, new: true }
  );

  // Verify balance
  const sender = await Account.findById(senderId).session(session);
  if (sender.balance < 0) throw new Error('Insufficient funds');

  await Account.findByIdAndUpdate(
    receiverId,
    { $inc: { balance: amount } },
    { session }
  );

  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();  // Rollback everything
  throw err;
} finally {
  session.endSession();
}
```

---

## Interview Questions — Step 04

**Q: SQL aur NoSQL mein kab kya use karein?**
> SQL use karo jab data structured ho, strong relationships hoon, ACID transactions chahiye (banking, e-commerce). NoSQL use karo jab schema flexible ho, horizontal scaling chahiye, data JSON-like ho (social media, real-time apps). Most modern apps dono use karte hain.

**Q: Index kya hai? Kab use karein?**
> Index ek data structure hai jo queries speed up karta hai. Bina index: full scan (slow). Index ke saath: B-Tree lookup (fast). Add karo frequently queried fields pe, sort fields pe. Downside: writes slow ho jaate hain aur extra space lagta hai — sab fields pe mat lagao.

**Q: Normalization kya hai?**
> Data organize karna to reduce redundancy. 1NF: atomic values. 2NF: partial dependencies remove karo. 3NF: transitive dependencies remove karo. Practical mein: related data alag tables mein rakh do.

**Q: Transaction kya hai? ACID explain karo.**
> Transaction = multiple operations jo ek unit ki tarah succeed ya fail hoti hain. ACID: Atomicity (ya sab hoga ya kuch nahi), Consistency (DB valid state mein rahega), Isolation (concurrent transactions interfere nahi karengi), Durability (committed transaction survive karega crashes).

---

## Assignment — Step 04

1. SQL: Students + Courses + Enrollments tables banao, JOIN queries likhо
2. MongoDB: Mongoose schema banao for a Blog (User, Post, Comment models with relationships)
3. Pagination implement karo: `/api/posts?page=2&limit=5`
4. Index add karo aur explain karo: "Ye index kyun zaruri hai is use case ke liye?"
