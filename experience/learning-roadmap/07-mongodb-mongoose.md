# Module 07: MongoDB & Mongoose — Database Ki Duniya

**Target Audience:** Working professionals — jo Express.js seekh chuke hain, ab database connect karna chahte hain  
**Estimated Time:** 10-12 hours  
**Prerequisites:** Module 06 complete hona chahiye (Express.js, REST API)

---

## 1. NoSQL vs SQL — Pehle Samjho Fark

### Real-Life Analogy

**SQL Database = Excel Spreadsheet**  
Socho tumhare paas ek Excel sheet hai jisme columns fixed hain — `Name`, `Age`, `Email`. Har row ka same structure hona chahiye. Ek column add karo toh saari rows affect hoti hain. Strict, structured, predictable.

**NoSQL (MongoDB) = WhatsApp Chat Folders**  
Har chat folder mein alag alag cheezein hain — kuch chats mein sirf text, kuch mein photos, kuch mein videos, kuch mein location. Koi fixed structure nahi. Flexible, chaotic but powerful.

---

### Kab Kya Use Karein

```
SQL (PostgreSQL, MySQL) use karo jab:
✅ Data highly structured hai (e-commerce orders, banking transactions)
✅ Relationships complex hain (foreign keys, joins)
✅ ACID transactions zaruri hain (financial data)
✅ Data rarely changes structure

MongoDB use karo jab:
✅ Data flexible/dynamic hai (user profiles, product catalogs)
✅ Rapid development chahiye (schema-less start)
✅ Horizontal scaling chahiye (sharding)
✅ Nested/hierarchical data hai (blog post with comments embedded)
✅ Real-time data (IoT, logs, analytics)
```

---

## 2. MongoDB Core Concepts

### Documents, Collections, Databases

```
MongoDB World:                SQL World:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Database     ←→  Database
Collection   ←→  Table
Document     ←→  Row/Record
Field        ←→  Column
_id          ←→  Primary Key
```

```js
// Ek MongoDB Document ka example — JSON jaisa dikhta hai, actually BSON hai
{
  _id: ObjectId("64a7b3c2e1f2a3b4c5d6e7f8"), // auto-generated unique ID
  name: "Rahul Sharma",
  age: 28,
  email: "rahul@example.com",
  address: {              // Nested object — SQL mein alag table hoti
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  },
  skills: ["JavaScript", "React", "Node.js"], // Array directly store hota hai
  isActive: true,
  createdAt: new Date("2024-01-15"),
  salary: 75000.50,       // Float
  profileViews: NumberLong("1500000"), // 64-bit integer
}

// BSON (Binary JSON) kya hai?
// MongoDB internally BSON store karta hai — zyada data types support karta hai
// Date, ObjectId, Binary, Int32, Int64, Decimal128 — yeh sab JSON mein nahi hote
```

---

## 3. MongoDB Atlas Setup — Free Mein Cloud Database

### Step by Step Setup

```
Step 1: atlas.mongodb.com pe jaao
Step 2: "Try Free" pe click karo, account banao
Step 3: New Project banao — "mentorship-project"
Step 4: "Build a Database" click karo
Step 5: FREE tier choose karo (M0 — 512MB, bilkul free)
Step 6: Cloud provider choose karo (AWS/GCP/Azure — koi bhi)
Step 7: Region choose karo — Mumbai (ap-south-1) for India
Step 8: Cluster naam do — "Cluster0"

Security Setup:
Step 9: Username/Password banao — yeh yaad rakho!
Step 10: "Add My Current IP Address" click karo
Step 11: "Finish and Close"

Connection String:
Step 12: "Connect" button click karo
Step 13: "Connect your application" choose karo
Step 14: Connection string copy karo:
         mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname
```

---

## 4. Mongoose Connection — Sahi Tarike Se Connect Karo

```bash
npm install mongoose dotenv
```

```
# .env file mein daalo — GitHub pe mat daalna!
MONGODB_URI=mongodb+srv://rahul:password123@cluster0.xxxxx.mongodb.net/mentorship-db
PORT=5000
NODE_ENV=development
```

```js
// config/database.js
import mongoose from 'mongoose';

// Connection options — best practices
const connectionOptions = {
  // Reconnection settings
  serverSelectionTimeoutMS: 5000,  // 5 seconds mein connect nahi hua toh error
  socketTimeoutMS: 45000,          // 45 seconds idle connection timeout
  family: 4,                       // IPv4 force karo (IPv6 issues avoid)
};

// Connection state track karo
let isConnected = false;

export async function connectDatabase() {
  // Pehle se connected hai toh dobara connect mat karo
  if (isConnected) {
    console.log('MongoDB pehle se connected hai');
    return;
  }

  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI,
      connectionOptions
    );
    
    isConnected = connection.connections[0].readyState === 1;
    console.log(`✅ MongoDB connected: ${connection.connection.host}`);
    
    // Connection events listen karo
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnect ho gaya');
      isConnected = false;
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnect ho gaya');
      isConnected = true;
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB error:', err);
      isConnected = false;
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection fail:', error.message);
    
    // Production mein retry logic
    if (process.env.NODE_ENV === 'production') {
      console.log('10 seconds mein retry karenge...');
      setTimeout(connectDatabase, 10000);
    } else {
      // Development mein seedha exit karo
      process.exit(1);
    }
  }
}

// Graceful shutdown — server band hone pe connection close karo
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection gracefully close hua');
  process.exit(0);
});
```

```js
// server.js
import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';

dotenv.config();

const app = express();
app.use(express.json());

// Server start karne se pehle database connect karo
async function startServer() {
  try {
    await connectDatabase();
    
    app.listen(process.env.PORT, () => {
      console.log(`Server chal raha hai port ${process.env.PORT} pe`);
    });
  } catch (error) {
    console.error('Server start nahi hua:', error);
    process.exit(1);
  }
}

startServer();
```

---

## 5. Schema Definition — Data Ka Blueprint Banao

```js
// models/User.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  // String type — common validators ke saath
  name: {
    type: String,
    required: [true, 'Naam zaroori hai'],        // custom error message
    trim: true,                                    // whitespace hatao
    minlength: [2, 'Naam minimum 2 characters ka hona chahiye'],
    maxlength: [50, 'Naam 50 characters se zyada nahi ho sakta'],
  },
  
  email: {
    type: String,
    required: [true, 'Email zaroori hai'],
    unique: true,                                  // duplicate nahi chalega
    lowercase: true,                               // automatically lowercase karo
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Valid email daalo'],  // regex validator
  },
  
  password: {
    type: String,
    required: [true, 'Password zaroori hai'],
    minlength: [8, 'Password minimum 8 characters ka hona chahiye'],
    select: false,  // Query mein by default mat include karo — security ke liye!
  },
  
  // Number type
  age: {
    type: Number,
    min: [18, '18 saal se kam ke users allowed nahi'],
    max: [100, 'Age 100 se zyada nahi ho sakti'],
  },
  
  // Enum — sirf yeh values allow karo
  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'moderator'],
      message: '{VALUE} valid role nahi hai',  // {VALUE} actual value insert hoga
    },
    default: 'user',
  },
  
  // Boolean
  isActive: {
    type: Boolean,
    default: true,
  },
  
  // Date
  dateOfBirth: {
    type: Date,
  },
  
  // Array of strings
  skills: {
    type: [String],
    validate: {
      validator: function(arr) {
        return arr.length <= 20; // Maximum 20 skills
      },
      message: 'Maximum 20 skills ho sakti hain',
    },
  },
  
  // Nested Object
  address: {
    street: String,
    city: String,
    state: String,
    pincode: {
      type: String,
      match: [/^\d{6}$/, '6 digit pincode daalo'],  // Indian pincode
    },
  },
  
  // Custom Validator — advanced
  phoneNumber: {
    type: String,
    validate: {
      validator: function(v) {
        // Indian phone number — 10 digits
        return /^[6-9]\d{9}$/.test(v);
      },
      message: (props) => `${props.value} valid Indian phone number nahi hai!`,
    },
  },
  
  // Reference to another model (like foreign key)
  profilePicture: {
    type: String, // URL store karenge
    default: 'https://example.com/default-avatar.png',
  },
  
  lastLoginAt: Date,
  
}, {
  // Schema options
  timestamps: true,  // createdAt aur updatedAt automatically add hoga
  versionKey: false, // __v field remove karo (hum chahein toh rakh sakte hain)
  
  // toJSON — response mein kya dikhana hai
  toJSON: {
    virtuals: true,  // Virtual fields include karo
    transform: function(doc, ret) {
      delete ret.password; // Password kabhi bhi response mein mat bhejo!
      return ret;
    },
  },
});

// Virtual Property — calculate hota hai, store nahi hota
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Age calculate karo dateOfBirth se
userSchema.virtual('calculatedAge').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  return today.getFullYear() - birthDate.getFullYear();
});

// Index — performance ke liye
userSchema.index({ email: 1 });           // email pe ascending index
userSchema.index({ role: 1, isActive: 1 }); // compound index
userSchema.index({ name: 'text', email: 'text' }); // text search ke liye

const User = mongoose.model('User', userSchema);
export default User;
```

---

## 6. CRUD Operations — Create, Read, Update, Delete

```js
// controllers/userController.js
import User from '../models/User.js';

// =================== CREATE ===================

export async function createUser(req, res) {
  try {
    // Method 1: new + save()
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password, // Pehle hash karo! (bcrypt)
      age: req.body.age,
    });
    
    const savedUser = await user.save(); // Yahan validators chalenge
    
    // Method 2: create() — shorthand
    // const savedUser = await User.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'User ban gaya!',
      data: savedUser,
    });
  } catch (error) {
    // Mongoose validation error handle karo
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation fail hua',
        errors: messages,
      });
    }
    // Duplicate key error (unique constraint)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered hai',
      });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// =================== READ ===================

export async function getAllUsers(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt', // Minus = descending
      search,
      role,
      isActive,
    } = req.query;

    // Query object banao
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },    // case insensitive
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    // Pagination calculate karo
    const skip = (Number(page) - 1) * Number(limit);

    // Query chain karo
    const [users, total] = await Promise.all([
      User.find(query)
          .select('-password')         // password exclude karo
          .sort(sort)
          .skip(skip)
          .limit(Number(limit))
          .lean(),                     // Plain JS object — faster than Mongoose Document
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getUserById(req, res) {
  try {
    // findById — _id se dhundhta hai
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User nahi mila',
      });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    // Invalid MongoDB ObjectId handle karo
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
}

// =================== UPDATE ===================

export async function updateUser(req, res) {
  try {
    // findByIdAndUpdate — find karo aur update karo ek step mein
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },   // $set — sirf yeh fields update karo
      {
        new: true,           // Updated document return karo (nahi toh purana milega)
        runValidators: true, // Validators dubara chalao
        select: '-password', // Password exclude karo response se
      }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User nahi mila' });
    }
    
    res.json({ success: true, message: 'User update ho gaya', data: user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
}

// =================== DELETE ===================

export async function deleteUser(req, res) {
  try {
    // Hard delete — permanently hatao
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User nahi mila' });
    }
    
    // Soft delete — prefer karo production mein
    // await User.findByIdAndUpdate(req.params.id, { isActive: false, deletedAt: new Date() });
    
    res.json({ success: true, message: 'User delete ho gaya' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function bulkDeleteUsers(req, res) {
  try {
    const { ids } = req.body; // Array of IDs
    
    const result = await User.deleteMany({
      _id: { $in: ids },
      role: { $ne: 'admin' }, // Admins ko delete mat karo!
    });
    
    res.json({
      success: true,
      message: `${result.deletedCount} users delete ho gaye`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
```

---

## 7. Advanced Queries — Powerful Filtering

```js
// Sab MongoDB operators ek jagah
import User from '../models/User.js';
import Post from '../models/Post.js';

async function advancedQueryExamples() {
  
  // Comparison Operators
  
  // $gt (greater than), $lt (less than), $gte, $lte
  const adults = await User.find({ age: { $gte: 18, $lte: 30 } });
  
  // $in — array mein se koi bhi
  const specificRoles = await User.find({ role: { $in: ['admin', 'moderator'] } });
  
  // $nin — array mein se koi bhi NAHI
  const regularUsers = await User.find({ role: { $nin: ['admin', 'moderator'] } });
  
  // $ne — not equal
  const nonAdmins = await User.find({ role: { $ne: 'admin' } });
  
  // Logical Operators
  
  // $or — ek bhi match ho
  const searchResults = await User.find({
    $or: [
      { name: { $regex: 'rahul', $options: 'i' } },
      { email: { $regex: 'rahul', $options: 'i' } },
    ],
  });
  
  // $and — sab match hone chahiye (explicit — usually dot notation better)
  const activeAdmins = await User.find({
    $and: [
      { role: 'admin' },
      { isActive: true },
      { age: { $gte: 25 } },
    ],
  });
  // Shorter version — same result
  const activeAdmins2 = await User.find({ role: 'admin', isActive: true, age: { $gte: 25 } });
  
  // $regex — pattern matching
  const mumbaiUsers = await User.find({
    'address.city': { $regex: /^mumbai$/i }, // Case insensitive exact match
  });
  
  // Text search — text index chahiye pehle
  // userSchema.index({ name: 'text', email: 'text' })
  const textSearchResults = await User.find({
    $text: { $search: 'rahul sharma' }
  }).sort({ score: { $meta: 'textScore' } }); // Relevance ke hisaab se sort
  
  // Nested field query — dot notation use karo
  const delhiUsers = await User.find({ 'address.city': 'Delhi' });
  
  // Array queries
  const jsDevs = await User.find({ skills: 'JavaScript' }); // Array mein value dhundho
  const jsReactDevs = await User.find({ skills: { $all: ['JavaScript', 'React'] } }); // Dono chahiye
  const fewSkills = await User.find({ skills: { $size: 3 } }); // Exactly 3 skills
  
  // $exists — field exist karta hai ya nahi
  const usersWithPhone = await User.find({ phoneNumber: { $exists: true, $ne: null } });
  
  // Projection — sirf needed fields lo
  const names = await User.find({}, { name: 1, email: 1, _id: 0 }); // sirf name aur email
  
  console.log('Advanced queries complete!');
}
```

---

## 8. Populate — Documents Ko Reference Karo

```js
// models/Post.js — User ke posts
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  
  // User ka reference — like a foreign key
  author: {
    type: mongoose.Schema.Types.ObjectId, // ObjectId type
    ref: 'User',                          // 'User' model se reference
    required: true,
  },
  
  // Array of references — ek post ke kai tags
  tags: [{
    type: String,
    lowercase: true,
  }],
  
  // Comments embedded — separate collection nahi, same document mein
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: String,
    createdAt: { type: Date, default: Date.now },
  }],
  
  likes: {
    type: Number,
    default: 0,
  },
  
  isPublished: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;
```

```js
// controllers/postController.js
import Post from '../models/Post.js';
import User from '../models/User.js';

export async function getPostsWithAuthors(req, res) {
  try {
    // populate() — author ObjectId ko actual User document se replace karo
    const posts = await Post.find({ isPublished: true })
      .populate('author', 'name email profilePicture') // sirf yeh fields chahiye
      .populate('comments.user', 'name')               // nested populate
      .sort('-createdAt')
      .limit(10);
    
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Virtual Populate — User model mein posts list (without storing in User doc)
// User.js mein add karo:
userSchema.virtual('posts', {
  ref: 'Post',           // Post model se
  localField: '_id',     // User._id
  foreignField: 'author', // Post.author
});

// Phir aise use karo
export async function getUserWithPosts(req, res) {
  const user = await User.findById(req.params.id)
    .populate({
      path: 'posts',
      match: { isPublished: true }, // Sirf published posts
      select: 'title createdAt',
      options: { sort: '-createdAt', limit: 5 },
    });
  
  res.json({ success: true, data: user });
}
```

---

## 9. Middleware (Hooks) — Schema ke Lifecycle Events

```js
// models/User.js mein add karo
import bcrypt from 'bcryptjs';

// PRE SAVE — save hone se PEHLE chalta hai
userSchema.pre('save', async function(next) {
  // this = document jo save ho raha hai
  
  // Sirf tab hash karo jab password change hua ho
  if (!this.isModified('password')) {
    return next(); // Skip karo, next middleware pe jaao
  }
  
  try {
    // Bcrypt se password hash karo
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error); // Error next middleware ko pass karo
  }
});

// PRE SAVE — lastModifiedAt update karo
userSchema.pre('save', function(next) {
  if (!this.isNew) { // Naya document nahi hai
    this.lastModifiedAt = new Date();
  }
  next();
});

// POST SAVE — save hone ke BAAD chalta hai
userSchema.post('save', function(doc, next) {
  // doc = saved document
  console.log(`User save hua: ${doc.email} at ${new Date().toISOString()}`);
  // Yahan email bhej sakte ho, audit log likh sakte ho
  next();
});

// PRE FIND — queries modify karo automatically
userSchema.pre(/^find/, function(next) {
  // Deleted users ko automatically exclude karo
  // 'this' yahan query object hai, document nahi
  this.find({ isActive: { $ne: false } });
  next();
});

// POST FIND — response transform karo
userSchema.post('findOne', function(doc) {
  if (doc) {
    console.log(`User fetch hua: ${doc._id}`);
  }
});

// Instance Method — document pe call kar sako
userSchema.methods.comparePassword = async function(candidatePassword) {
  // this = document instance
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

// Static Method — Model pe call karo
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveAdmins = function() {
  return this.find({ role: 'admin', isActive: true }).select('-password');
};

// Usage
const user = await User.findByEmail('rahul@example.com'); // Static method
await user.comparePassword('mypassword123'); // Instance method
```

---

## 10. Indexes — Query Ko Fast Banao

### Real-Life Analogy

Socho ek **dictionary** hai bina index ke. "MongoDB" word dhundna hai — pehle page se shuru karoge, page by page padho. Index ke saath — M pe seedha jump karo. MongoDB mein bhi same concept hai — index ke bina MongoDB saari documents scan karta hai (Collection Scan), index ke saath seedha jump karta hai (Index Scan).

```js
// Schema mein index define karo
const productSchema = new Schema({
  name: { type: String, required: true },
  price: Number,
  category: String,
  brand: String,
  inStock: Boolean,
  rating: Number,
  createdAt: Date,
});

// Single field index
productSchema.index({ name: 1 });     // 1 = ascending
productSchema.index({ price: -1 });   // -1 = descending

// Compound index — multiple fields pe search ke liye
productSchema.index({ category: 1, price: 1 }); // Category + price filter

// Unique index
productSchema.index({ sku: 1 }, { unique: true });

// Sparse index — sirf woh documents jahan field exist kare
productSchema.index({ brand: 1 }, { sparse: true });

// TTL Index — automatically documents delete karo time ke baad
// Session documents, OTP codes ke liye useful
const sessionSchema = new Schema({
  userId: mongoose.ObjectId,
  token: String,
  createdAt: { type: Date, default: Date.now, index: { expires: '24h' } }, // 24 ghante baad delete
});

// Mongoose ke bahar — MongoDB shell se index banao
// db.products.createIndex({ name: "text", description: "text" })
```

### explain() — Query Analysis

```js
// Query performance analyze karo
async function analyzeQuery() {
  const explanation = await User.find({ email: 'rahul@example.com' })
    .explain('executionStats');
  
  console.log('Query Plan:', explanation.queryPlanner.winningPlan);
  console.log('Docs Examined:', explanation.executionStats.totalDocsExamined);
  console.log('Docs Returned:', explanation.executionStats.totalDocsReturned);
  console.log('Time (ms):', explanation.executionStats.executionTimeMillis);
  
  // COLLSCAN = koi index nahi mila — slow!
  // IXSCAN = index use ho raha hai — fast!
}
```

---

## 11. Aggregation Pipeline — Data Analytics Power

### Real-Life Analogy

Socho ek **factory production line** hai. Raw material ek side se daalo, alag alag stations se process hota hai, output dusri side se nikalta hai. Har station ek kaam karta hai — sort karo, filter karo, count karo. Yahi aggregation pipeline hai.

```js
import Order from '../models/Order.js';

// Order model — example ke liye
const orderSchema = new Schema({
  customer: { type: mongoose.ObjectId, ref: 'User' },
  products: [{
    product: { type: mongoose.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number,
  }],
  totalAmount: Number,
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
  city: String,
  createdAt: Date,
});

// Sales Analytics Dashboard ka data
async function getSalesAnalytics() {
  const analytics = await Order.aggregate([
    // Stage 1: $match — filter karo (WHERE clause jaisa)
    {
      $match: {
        status: { $ne: 'cancelled' },
        createdAt: {
          $gte: new Date('2024-01-01'),
          $lte: new Date('2024-12-31'),
        },
      },
    },
    
    // Stage 2: $group — aggregate karo (GROUP BY jaisa)
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },     // Month extract karo
          year: { $year: '$createdAt' },
        },
        totalRevenue: { $sum: '$totalAmount' },  // Sum
        avgOrderValue: { $avg: '$totalAmount' }, // Average
        orderCount: { $sum: 1 },                 // Count
        maxOrder: { $max: '$totalAmount' },       // Max
        minOrder: { $min: '$totalAmount' },       // Min
      },
    },
    
    // Stage 3: $sort — sort karo
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    
    // Stage 4: $project — shape karo output (SELECT jaisa)
    {
      $project: {
        _id: 0, // _id hide karo
        period: {
          $concat: [
            { $toString: '$_id.year' },
            '-',
            { $toString: '$_id.month' },
          ],
        },
        totalRevenue: { $round: ['$totalRevenue', 2] }, // 2 decimal places
        avgOrderValue: { $round: ['$avgOrderValue', 2] },
        orderCount: 1,
        maxOrder: 1,
        minOrder: 1,
      },
    },
  ]);
  
  return analytics;
}

// City-wise sales report
async function getCitySalesReport() {
  return await Order.aggregate([
    { $match: { status: 'delivered' } },
    
    { $group: {
      _id: '$city',
      totalOrders: { $sum: 1 },
      totalRevenue: { $sum: '$totalAmount' },
      customers: { $addToSet: '$customer' }, // Unique customers
    }},
    
    { $addFields: {
      uniqueCustomers: { $size: '$customers' }, // Array size
    }},
    
    { $sort: { totalRevenue: -1 } },  // Revenue ke hisaab se sort
    { $limit: 10 },                    // Top 10 cities
    
    // $project mein customers array remove karo (bada hoga)
    { $project: { customers: 0 } },
  ]);
}

// $lookup — JOIN jaisa, dono collections join karo
async function getOrdersWithCustomerDetails() {
  return await Order.aggregate([
    { $match: { status: 'pending' } },
    
    // $lookup — Left join with User collection
    {
      $lookup: {
        from: 'users',          // Collection name (lowercase, plural)
        localField: 'customer', // Order mein field
        foreignField: '_id',    // User mein field
        as: 'customerDetails',  // Result array ka naam
      },
    },
    
    // $unwind — array ko single document mein convert karo
    { $unwind: '$customerDetails' },
    
    {
      $project: {
        totalAmount: 1,
        status: 1,
        createdAt: 1,
        'customerDetails.name': 1,
        'customerDetails.email': 1,
        'customerDetails.phone': 1,
      },
    },
  ]);
}
```

---

## 12. Transactions — ACID Guarantee

### Real-Life Analogy

Socho tum bank transfer kar rahe ho — Account A se Rs 1000 Account B mein. Agar Account A se paisa kat gaya aur B mein add hone se pehle system crash ho gaya? Disaster! **Transaction** ensure karta hai ki dono operations ek saath complete hon — ya dono fail ho jaayein.

```js
import mongoose from 'mongoose';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Inventory from '../models/Inventory.js';

// Session-based transaction
async function placeOrder(customerId, productId, quantity) {
  // Session start karo
  const session = await mongoose.startSession();
  
  try {
    // Transaction shuru karo
    session.startTransaction();
    
    // 1. Inventory check karo aur reduce karo
    const inventory = await Inventory.findOneAndUpdate(
      {
        product: productId,
        availableQuantity: { $gte: quantity }, // Stock available hai?
      },
      {
        $inc: { availableQuantity: -quantity }, // Reduce karo
        $push: { reservations: { customerId, quantity, reservedAt: new Date() } },
      },
      {
        new: true,
        session, // IMPORTANT: session pass karo!
      }
    );
    
    if (!inventory) {
      // Stock nahi hai — abort karo
      await session.abortTransaction();
      return { success: false, message: 'Stock available nahi hai' };
    }
    
    // 2. Order create karo
    const [order] = await Order.create(
      [{
        customer: customerId,
        products: [{ product: productId, quantity }],
        status: 'pending',
        totalAmount: inventory.price * quantity,
      }],
      { session } // Session pass karo
    );
    
    // 3. Customer ka order history update karo
    await User.findByIdAndUpdate(
      customerId,
      { $push: { orderHistory: order._id } },
      { session }
    );
    
    // Sab kuch theek raha — commit karo
    await session.commitTransaction();
    
    return { success: true, orderId: order._id };
    
  } catch (error) {
    // Kuch bhi galat hua — rollback karo
    await session.abortTransaction();
    console.error('Transaction fail:', error);
    return { success: false, message: 'Order place nahi ho saka' };
    
  } finally {
    // Session hamesha end karo
    session.endSession();
  }
}
```

---

## 13. Common Mistakes — Galtiyan Mat Karo

### N+1 Query Problem

```js
// ❌ GALAT — N+1 Problem!
// Ek query posts ke liye, phir har post ke liye ek query author ke liye
// 100 posts = 101 database queries!
async function badGetPosts() {
  const posts = await Post.find({});
  
  const postsWithAuthors = await Promise.all(
    posts.map(async (post) => {
      const author = await User.findById(post.author); // N extra queries!
      return { ...post.toObject(), author };
    })
  );
  
  return postsWithAuthors;
}

// ✅ SAHI — populate use karo, sirf 2 queries!
async function goodGetPosts() {
  const posts = await Post.find({})
    .populate('author', 'name email'); // Single query with $in
  return posts;
}
```

### Missing Indexes — Performance Killer

```js
// ❌ GALAT — Index nahi hai email pe, full collection scan hoga
const user = await User.find({ email: 'rahul@example.com' });

// ✅ SAHI — Index banao schema mein
userSchema.index({ email: 1 }, { unique: true });
// Ab yeh query milliseconds mein chalegi, seconds mein nahi

// Always check karo: explain() se dekho COLLSCAN toh nahi aa raha
const plan = await User.find({ email: 'x@y.com' }).explain('executionStats');
if (plan.queryPlanner.winningPlan.stage === 'COLLSCAN') {
  console.warn('Index missing! Add index on this field.');
}
```

### Arrays Without Limits

```js
// ❌ GALAT — Array unbounded hai, document 16MB limit exceed kar sakta hai
const badUserSchema = new Schema({
  notifications: [String], // Unlimited notifications!
  activityLog: [Object],   // Unlimited activity!
});

// ✅ SAHI — Limit lagao ya separate collection use karo
const goodUserSchema = new Schema({
  // Sirf last 50 notifications
  recentNotifications: {
    type: [Object],
    validate: {
      validator: (arr) => arr.length <= 50,
      message: 'Maximum 50 notifications allowed',
    },
  },
});

// Better: Notifications ke liye alag collection
const notificationSchema = new Schema({
  userId: { type: mongoose.ObjectId, ref: 'User', index: true },
  message: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, index: { expires: '30d' } }, // 30 din baad delete
});
```

### Other Common Mistakes

```js
// ❌ Password plaintext store mat karo
const user = new User({ password: 'mypassword' }); // NEVER!

// ✅ Hamesha hash karo (pre-save hook mein karo)
// bcrypt.hash(password, 12)

// ❌ .lean() bhool jaana — zyada memory use hoti hai
const users = await User.find({}); // Full Mongoose documents — heavy

// ✅ Read-only operations mein lean() use karo
const users = await User.find({}).lean(); // Plain JS objects — fast & light

// ❌ Saari fields fetch karna jab zaroorat nahi
const user = await User.findById(id); // Saari fields — including password hash!

// ✅ Sirf zaruri fields lo
const user = await User.findById(id).select('name email role'); // Light

// ❌ Error handling nahi karna
const result = await User.findById(req.params.id); // CastError agar invalid ID!

// ✅ Validate karo pehle
if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({ message: 'Invalid ID' });
}
const result = await User.findById(req.params.id);
```

---

## Interview Questions & Answers

**Q1: MongoDB mein `find()` aur `findOne()` mein kya fark hai?**  
A: `find()` matching documents ka cursor return karta hai (array like). `findOne()` sirf pehla matching document return karta hai, ya null agar koi nahi mila. Performance mein `findOne()` thoda faster hai single record ke liye kyunki yeh pehle match pe ruk jaata hai.

**Q2: Embedded documents vs References — kab kya use karein?**  
A: **Embed karo** jab data hamesha saath access hoga, relationship 1:few hai, aur nested data frequently change nahi hota (jaise user address). **Reference karo** jab data independently access hoga, relationship 1:many ya many:many hai, ya data frequently update hota hai (jaise posts by a user).

**Q3: Index kaise performance improve karta hai?**  
A: Bina index ke MongoDB poori collection scan karta hai (O(n) complexity). Index se B-tree structure mein data sorted hota hai, toh MongoDB binary search use kar sakta hai (O(log n)). Ek simple email lookup 1M documents pe index ke bina 200ms le sakta hai, index ke saath 1ms.

**Q4: Aggregation pipeline aur regular queries mein kab kya prefer karein?**  
A: Simple CRUD ke liye `find()`, `findById()` prefer karo — simple aur readable. Complex analytics (grouping, joining, transforming, calculating) ke liye aggregation pipeline use karo. Pipeline zyada powerful hai lekin complex bhi.

**Q5: Transaction kab zaruri hai?**  
A: Jab multiple documents/collections mein related changes ek saath hone chahiye — ek fail ho toh sab fail ho. E-commerce order placement (inventory + order + payment), bank transfers, user registration (user + profile + wallet create karo) — yahan transactions use karo.

**Q6: `updateOne` aur `findByIdAndUpdate` mein kya fark hai?**  
A: `updateOne` sirf update karta hai — updated document return nahi karta, sirf result metadata deta hai (`{ matchedCount: 1, modifiedCount: 1 }`). `findByIdAndUpdate` update karta hai AND document return karta hai (`new: true` option ke saath updated version).

---

## Assignments

### Assignment 1 (Basic CRUD)
**Library Management System** banao jisme:
- Book model: title, author, isbn (unique), genre, publishedYear, availableCopies, totalCopies
- CRUD routes: GET /books, GET /books/:id, POST /books, PUT /books/:id, DELETE /books/:id
- Search: title ya author se books dhundho
- Filter: genre ke hisaab se filter karo

### Assignment 2 (Relationships + Populate)
**Blog Platform** banao jisme:
- User model (name, email, password, bio)
- Post model (title, content, author ref, tags array, published)
- Comment model (post ref, user ref, text)
- GET /posts/:id — post ke saath author aur comments (with commenter info) populate karo

### Assignment 3 (Aggregation)
Existing Blog Platform pe analytics add karo:
- GET /analytics/top-authors — Most posts wale top 5 authors (name, postCount, totalLikes)
- GET /analytics/tags — Sabse popular tags (tag, usageCount)
- GET /analytics/monthly — Monthly posts ka count (last 6 months)

### Assignment 4 (Full Project)
**E-commerce Backend** banao:
- Product, User, Order, Review models
- Order placement with transaction (inventory reduce + order create)
- Product search with filters (price range, category, rating)
- Sales report aggregation (monthly revenue, top products, city-wise)
- Proper indexes explain karo

---

*Next Module: 08-advanced-backend.md — Authentication, Authorization, File Upload aur aur zyada!*
