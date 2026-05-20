# Module 08: SQL & PostgreSQL — Ek Dukaan Ka Hisaab Kitaab

> **Target Audience:** Working professionals jo full-stack development seekh rahe hain  
> **Style:** Hinglish explanations, production-ready code  
> **Time Required:** ~12-15 hours

---

## 1. SQL vs NoSQL — Kab Kya Use Karein?

### Real-Life Analogy

Socho tumhari **bank passbook** hai — har transaction fixed format mein hoti hai: date, amount, balance. Isme koi bhi field randomly add nahi kar sakte. Yahi hai **SQL (Relational Database)**.

Ab socho **WhatsApp messages** — koi bhi message mein photo ho sakti hai, video ho sakti hai, location ho sakti hai, ya sirf text ho sakta hai. Har message alag structure ka ho sakta hai. Yahi hai **NoSQL**.

```
SQL (Relational)          NoSQL (Document/Key-Value)
─────────────────         ──────────────────────────
Bank accounts             WhatsApp messages
Hospital records          Social media posts
E-commerce orders         User activity logs
School results            Product catalog (variable attrs)
```

### Kab SQL Use Karein?
- Data relationships zyada hain (users → orders → products)
- ACID transactions chahiye (bank transfer)
- Data structure fixed hai
- Complex queries + reporting

### Kab NoSQL Use Karein?
- Schema flexible hai (social media posts)
- Horizontal scaling chahiye (millions of users)
- Speed > consistency (caching, sessions)
- Unstructured data (logs, IoT)

---

## 2. Relational Model — Tables, Rows, Columns

### Analogy: Excel Sheet ki tarah, lekin smart

Ek **Table** = Excel ka ek sheet  
Ek **Row** = ek record (ek customer ki jaankari)  
Ek **Column** = ek field (naam, email, phone)  
**Primary Key** = har row ka unique ID (jaise Aadhar number)  
**Foreign Key** = dusri table se reference (jaise order mein customer_id)

```
USERS table                    ORDERS table
┌────┬──────────┬───────────┐  ┌────┬─────────────┬────────┐
│ id │ name     │ email     │  │ id │ customer_id │ total  │
├────┼──────────┼───────────┤  ├────┼─────────────┼────────┤
│  1 │ Rahul    │ r@g.com   │  │101 │      1      │ 500.00 │
│  2 │ Priya    │ p@g.com   │  │102 │      1      │ 250.00 │
│  3 │ Amit     │ a@g.com   │  │103 │      2      │ 750.00 │
└────┴──────────┴───────────┘  └────┴─────────────┴────────┘
                                        ↑
                               FK references users.id
```

---

## 3. PostgreSQL Setup

### Local Install (Mac)
```bash
# Homebrew se install karo
brew install postgresql@16
brew services start postgresql@16

# psql se connect karo
psql postgres

# Naya database banao
CREATE DATABASE mentorship_db;
\c mentorship_db  -- connect karo
\l               -- list databases
\dt              -- list tables
```

### pgAdmin (GUI Tool)
1. Download: https://www.pgadmin.org/download/
2. Open pgAdmin → Add Server → localhost:5432
3. Username: postgres, password jo setup mein diya

### Free Cloud: Neon.tech
```
1. neon.tech pe jaao → Sign up (free)
2. New Project banao → Database milega
3. Connection string milega:
   postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
4. Yahi string .env mein dalo
```

---

## 4. Basic SQL Queries

### Schema Setup
```sql
-- Users table banao
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,        -- auto-increment ID
    name        VARCHAR(100) NOT NULL,     -- required field
    email       VARCHAR(255) UNIQUE NOT NULL,
    age         INTEGER CHECK (age >= 18), -- constraint
    city        VARCHAR(100) DEFAULT 'Mumbai',
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    price       DECIMAL(10, 2) NOT NULL,  -- 10 digits total, 2 after decimal
    category    VARCHAR(100),
    stock       INTEGER DEFAULT 0
);
```

### SELECT — Data Nikalna
```sql
-- Sabhi users nikalo
SELECT * FROM users;

-- Specific columns
SELECT name, email, city FROM users;

-- WHERE — condition lagao
SELECT * FROM users WHERE city = 'Mumbai';
SELECT * FROM users WHERE age > 25 AND city = 'Delhi';
SELECT * FROM users WHERE city IN ('Mumbai', 'Pune', 'Nashik');
SELECT * FROM users WHERE name LIKE 'R%';  -- R se shuru hone wale

-- ORDER BY — sorting
SELECT * FROM users ORDER BY age DESC;     -- umar ke hisaab se, bade pehle
SELECT * FROM users ORDER BY name ASC;    -- naam ke hisaab se A-Z

-- LIMIT & OFFSET — pagination ke liye
SELECT * FROM products ORDER BY price ASC LIMIT 10 OFFSET 20;
-- page 3 ka data (page size 10): OFFSET = (page-1) * limit = 20
```

### INSERT — Data Dalna
```sql
-- Single row insert
INSERT INTO users (name, email, age, city)
VALUES ('Rahul Sharma', 'rahul@gmail.com', 28, 'Mumbai');

-- Multiple rows ek saath
INSERT INTO users (name, email, age, city) VALUES
    ('Priya Patel', 'priya@gmail.com', 25, 'Ahmedabad'),
    ('Amit Kumar', 'amit@gmail.com', 30, 'Delhi'),
    ('Sneha Joshi', 'sneha@gmail.com', 27, 'Pune');

-- RETURNING — insert ke baad data wapas lo
INSERT INTO users (name, email, age)
VALUES ('Ravi Singh', 'ravi@gmail.com', 22)
RETURNING id, name;  -- naya id milega
```

### UPDATE — Data Badalna
```sql
-- Ek user ki city update karo
UPDATE users
SET city = 'Bangalore'
WHERE id = 1;

-- Multiple fields update
UPDATE users
SET city = 'Chennai', age = 29
WHERE email = 'rahul@gmail.com';

-- DHYAN RAKHO: WHERE clause bhool gaye toh SARE records update ho jaenge!
-- UPDATE users SET city = 'Delhi';  -- GALAT! Sab ki city change ho jayegi
```

### DELETE — Data Hatana
```sql
-- Specific record delete
DELETE FROM users WHERE id = 5;

-- Condition se delete
DELETE FROM users WHERE age < 18;

-- Sab delete karo (DANGER!)
-- DELETE FROM users;  -- WHERE nahi hai, sab chala jayega
-- TRUNCATE users;     -- aur bhi fast, sab delete
```

---

## 5. JOINs — Tables Ko Milana

### ASCII Diagram
```
INNER JOIN: Dono mein jo common hai
    [Users] ∩ [Orders]
    
LEFT JOIN: Sare users + unke orders (agar hain toh)
    [Users ←←← Orders]
    
RIGHT JOIN: Sare orders + unke users (agar hain toh)
    [Users >>>→ Orders]
    
FULL OUTER JOIN: Sab kuch — Users + Orders, chahe match ho ya na ho
    [Users ←→ Orders]
```

### Sample Data
```sql
-- Orders table
CREATE TABLE orders (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id),  -- FK
    total       DECIMAL(10, 2),
    status      VARCHAR(50) DEFAULT 'pending',
    created_at  TIMESTAMP DEFAULT NOW()
);

INSERT INTO orders (user_id, total, status) VALUES
    (1, 599.00, 'delivered'),
    (1, 299.00, 'pending'),
    (2, 1499.00, 'delivered'),
    (4, 799.00, 'cancelled');  -- user_id 4 exists
-- Note: user_id 3 (Amit) ka koi order nahi hai
```

### INNER JOIN — Sirf Jo Match Karta Hai
```sql
-- Vo users jinke orders hain, unke saath order details
SELECT
    u.name       AS customer_name,
    u.email,
    o.id         AS order_id,
    o.total,
    o.status
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- Result: Amit (user_id=3) nazar nahi aayega kyunki uska koi order nahi
```

### LEFT JOIN — Sare Users, Orders Chahe Ho Ya Na Ho
```sql
-- Sare users dikho, chahe order kiya ho ya nahi
SELECT
    u.name,
    o.id    AS order_id,
    o.total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- Result: Amit bhi aayega, order_id aur total NULL hoga uske liye
```

### RIGHT JOIN — Sare Orders
```sql
-- Sare orders, chahe user exist kare ya na kare
SELECT
    u.name,
    o.id    AS order_id,
    o.total
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;
```

### FULL OUTER JOIN
```sql
-- Sab kuch — matched + unmatched dono taraf se
SELECT
    u.name,
    o.id    AS order_id,
    o.total
FROM users u
FULL OUTER JOIN orders o ON u.id = o.user_id;
```

### Multiple Table JOIN
```sql
-- Users + Orders + Products (order_items ke zariye)
CREATE TABLE order_items (
    id          SERIAL PRIMARY KEY,
    order_id    INTEGER REFERENCES orders(id),
    product_id  INTEGER REFERENCES products(id),
    quantity    INTEGER NOT NULL,
    unit_price  DECIMAL(10, 2) NOT NULL
);

SELECT
    u.name          AS customer,
    o.id            AS order_id,
    p.name          AS product,
    oi.quantity,
    oi.unit_price,
    (oi.quantity * oi.unit_price) AS line_total
FROM users u
JOIN orders o       ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p     ON oi.product_id = p.id
WHERE o.status = 'delivered'
ORDER BY o.id, p.name;
```

---

## 6. Aggregates — Counting aur Calculation

```sql
-- COUNT: kitne records hain
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS mumbai_users FROM users WHERE city = 'Mumbai';

-- SUM: total amount
SELECT SUM(total) AS revenue FROM orders WHERE status = 'delivered';

-- AVG: average
SELECT AVG(total) AS avg_order_value FROM orders;

-- MIN, MAX
SELECT MIN(total) AS smallest_order, MAX(total) AS biggest_order FROM orders;

-- GROUP BY — city ke hisaab se group karo
SELECT
    city,
    COUNT(*) AS user_count,
    AVG(age)::INTEGER AS avg_age
FROM users
GROUP BY city
ORDER BY user_count DESC;

-- HAVING — GROUP BY ke baad filter (WHERE GROUP BY se pehle hota hai)
-- Vo cities jo 2 se zyada users hain
SELECT
    city,
    COUNT(*) AS user_count
FROM users
GROUP BY city
HAVING COUNT(*) > 2;  -- HAVING GROUP BY ke baad filter karta hai

-- Complex aggregate: har user ka total spending
SELECT
    u.name,
    COUNT(o.id)     AS total_orders,
    SUM(o.total)    AS total_spent,
    AVG(o.total)    AS avg_order
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
ORDER BY total_spent DESC NULLS LAST;
```

---

## 7. Subqueries aur CTEs

### Subquery — Query ke andar Query
```sql
-- Average se zyada total wale orders
SELECT * FROM orders
WHERE total > (SELECT AVG(total) FROM orders);

-- Jinke orders hain unhi users ko dikhaao
SELECT name, email FROM users
WHERE id IN (SELECT DISTINCT user_id FROM orders WHERE status = 'delivered');

-- Correlated subquery: har user ke liye unka latest order
SELECT
    u.name,
    (SELECT MAX(o.created_at) FROM orders o WHERE o.user_id = u.id) AS last_order_date
FROM users u;
```

### CTE (Common Table Expression) — WITH clause
```sql
-- CTEs readable hote hain, complex queries ko todna asan hota hai

-- Example: Top spenders jo Mumbai mein hain
WITH user_spending AS (
    -- Pehle har user ka total spending calculate karo
    SELECT
        u.id,
        u.name,
        u.city,
        COALESCE(SUM(o.total), 0) AS total_spent
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id AND o.status = 'delivered'
    GROUP BY u.id, u.name, u.city
),
mumbai_users AS (
    -- Phir Mumbai wale nikalo
    SELECT * FROM user_spending WHERE city = 'Mumbai'
)
-- Final result
SELECT name, total_spent
FROM mumbai_users
WHERE total_spent > 500
ORDER BY total_spent DESC;
```

---

## 8. Indexes — Search Speed Badhana

### Analogy: Dictionary mein directly word dhundho vs Index se dhundho
Bina index ke: PostgreSQL har row check karta hai (Full Table Scan)  
Index ke saath: Direct jump karta hai jaise dictionary ka index

```sql
-- Index dekho — by default primary key pe automatically banta hai
\d users  -- table structure + indexes dikho

-- B-tree index banana (most common)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_city ON users(city);

-- Composite index (multiple columns)
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- EXPLAIN ANALYZE — query plan dekho
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'rahul@gmail.com';
-- Index pe: "Index Scan" → fast
-- Bina index: "Seq Scan" → slow (full table scan)

-- Partial index (sirf specific rows ke liye)
CREATE INDEX idx_orders_pending ON orders(user_id)
WHERE status = 'pending';

-- Index drop karna
DROP INDEX idx_users_city;
```

### Kab Index Add Karein?
```
Add karo jab:                    Mat add karo jab:
✓ WHERE mein frequently use ho  ✗ Chota table hai (< 1000 rows)
✓ JOIN conditions mein           ✗ Column ki value bahut zyada change hoti hai
✓ ORDER BY mein                  ✗ INSERT/UPDATE/DELETE zyada hote hain
✓ Foreign keys pe               ✗ Low cardinality (boolean, gender)
```

---

## 9. Transactions — Sab Ek Saath Ya Kuch Nahi

### Analogy: Bank Transfer
Rahul se Priya ko Rs 500 transfer karo:
1. Rahul ka balance -500 (Step 1)
2. Priya ka balance +500 (Step 2)

Agar Step 1 hua aur Step 2 fail ho gaya → Rahul ke paise gaye, Priya ko mile nahi!  
Transaction mein: ya dono steps hote hain, ya koi nahi.

### ACID Properties
```
A - Atomicity:   Ya sab kuch, ya kuch nahi (all or nothing)
C - Consistency: Data hamesha valid state mein rahega
I - Isolation:   Ek transaction doosre ko affect nahi karta
D - Durability:  Committed data permanently save hota hai (crash ke baad bhi)
```

```sql
-- Basic transaction
BEGIN;

    -- Rahul ka balance check karo
    SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;  -- row lock

    -- Rahul se paise katao
    UPDATE accounts SET balance = balance - 500 WHERE id = 1;

    -- Check karo ki balance negative toh nahi hua
    -- (Application layer pe check karo ya constraint)

    -- Priya ko paise do
    UPDATE accounts SET balance = balance + 500 WHERE id = 2;

COMMIT;  -- Sab kuch save karo

-- Agar kuch galat hua
BEGIN;
    UPDATE accounts SET balance = balance - 500 WHERE id = 1;
    -- ... kuch error aaya ...
ROLLBACK;  -- Sab undo karo, pehle jaise ho jaayega

-- SAVEPOINT — transaction ke andar checkpoint
BEGIN;
    UPDATE products SET stock = stock - 1 WHERE id = 101;
    SAVEPOINT after_stock_update;

    INSERT INTO orders (user_id, total) VALUES (1, 599.00);
    -- Agar order insert fail ho
    ROLLBACK TO SAVEPOINT after_stock_update;
    -- Stock update rahega, order nahi

COMMIT;
```

---

## 10. Node.js with PostgreSQL — `pg` Library

### Setup
```bash
npm init -y
npm install pg dotenv
```

### .env file
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/mentorship_db
# Ya Neon.tech ke liye:
# DATABASE_URL=postgresql://user:pass@ep-xxx.aws.neon.tech/dbname?sslmode=require
```

### db.js — Connection Pool
```javascript
// db.js — Database connection pool
const { Pool } = require('pg');
require('dotenv').config();

// Pool banao — multiple connections manage karta hai
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Neon.tech ke liye SSL required hai
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    max: 10,              // maximum 10 connections
    idleTimeoutMillis: 30000,   // 30 second idle ke baad close
    connectionTimeoutMillis: 2000,  // 2 second mein connect nahi hua toh error
});

// Pool se query karne ka helper function
async function query(text, params) {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log(`Query: ${text.substring(0, 50)}... | Time: ${duration}ms | Rows: ${result.rowCount}`);
        return result;
    } catch (error) {
        console.error('Database query error:', error.message);
        throw error;
    }
}

// Transaction ke liye dedicated client
async function getClient() {
    const client = await pool.connect();
    const originalQuery = client.query.bind(client);
    const release = client.release.bind(client);

    // Timeout set karo — 5 second mein release nahi kiya toh error
    const timeout = setTimeout(() => {
        console.error('Client checkout timeout! Connection leak ho sakta hai.');
    }, 5000);

    client.release = () => {
        clearTimeout(timeout);
        release();
    };

    return client;
}

module.exports = { query, getClient, pool };
```

### userService.js — CRUD Operations
```javascript
// userService.js — User operations
const db = require('./db');

// ============ PARAMETERIZED QUERIES — SQL Injection se bachao ============
// GALAT (SQL Injection vulnerable):
// const result = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
// Hacker email = "' OR '1'='1" dega → sare users leak!

// SAHI (Parameterized query):
// const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

// =========================================================================

// Naya user banana
async function createUser(name, email, age, city) {
    // $1, $2, $3, $4 — placeholders, pg library automatically escape karta hai
    const result = await db.query(
        `INSERT INTO users (name, email, age, city)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, city, created_at`,
        [name, email, age, city]
    );
    return result.rows[0]; // naya user return karo
}

// User dhundho email se
async function getUserByEmail(email) {
    const result = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0]; // ek user ya undefined
}

// Sare users — pagination ke saath
async function getUsers({ page = 1, limit = 10, city = null }) {
    const offset = (page - 1) * limit;

    // Dynamic query — city filter optional hai
    let queryText = 'SELECT * FROM users';
    const params = [];

    if (city) {
        queryText += ' WHERE city = $1';
        params.push(city);
        queryText += ` ORDER BY name LIMIT $2 OFFSET $3`;
        params.push(limit, offset);
    } else {
        queryText += ` ORDER BY name LIMIT $1 OFFSET $2`;
        params.push(limit, offset);
    }

    const result = await db.query(queryText, params);
    return result.rows;
}

// User update karo
async function updateUser(id, updates) {
    // Dynamic update — sirf wahi fields update karo jo diye gaye hain
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.name) {
        fields.push(`name = $${paramCount++}`);
        values.push(updates.name);
    }
    if (updates.city) {
        fields.push(`city = $${paramCount++}`);
        values.push(updates.city);
    }
    if (updates.age) {
        fields.push(`age = $${paramCount++}`);
        values.push(updates.age);
    }

    if (fields.length === 0) throw new Error('Kuch update karne ke liye nahi diya');

    values.push(id); // WHERE ke liye id
    const result = await db.query(
        `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
    );
    return result.rows[0];
}

// Transaction example: Order place karna
async function placeOrder(userId, items) {
    const client = await db.getClient();

    try {
        await client.query('BEGIN');

        // 1. Sare items ka total calculate karo aur stock check karo
        let total = 0;
        for (const item of items) {
            const productResult = await client.query(
                'SELECT id, price, stock FROM products WHERE id = $1 FOR UPDATE',
                [item.productId]
            );

            const product = productResult.rows[0];
            if (!product) throw new Error(`Product ${item.productId} nahi mila`);
            if (product.stock < item.quantity) {
                throw new Error(`Product ${item.productId} ka stock kam hai`);
            }

            total += product.price * item.quantity;

            // Stock kam karo
            await client.query(
                'UPDATE products SET stock = stock - $1 WHERE id = $2',
                [item.quantity, item.productId]
            );
        }

        // 2. Order create karo
        const orderResult = await client.query(
            'INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING id',
            [userId, total, 'pending']
        );
        const orderId = orderResult.rows[0].id;

        // 3. Order items insert karo
        for (const item of items) {
            const productResult = await client.query(
                'SELECT price FROM products WHERE id = $1',
                [item.productId]
            );
            await client.query(
                'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
                [orderId, item.productId, item.quantity, productResult.rows[0].price]
            );
        }

        await client.query('COMMIT');
        console.log(`Order ${orderId} successfully placed!`);
        return orderId;

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Order place karne mein error, rollback kar diya:', error.message);
        throw error;
    } finally {
        client.release(); // Connection pool mein wapas do
    }
}

module.exports = { createUser, getUserByEmail, getUsers, updateUser, placeOrder };
```

---

## 11. Prisma ORM — Schema-First Approach

### Setup
```bash
npm install prisma @prisma/client
npx prisma init  # prisma/ folder aur .env file banata hai
```

### prisma/schema.prisma
```prisma
// Prisma Schema — database ka blueprint

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User model
model User {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)
  email     String   @unique @db.VarChar(255)
  age       Int?
  city      String?  @default("Mumbai")
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  orders    Order[]  // ek user ke multiple orders

  @@map("users") // actual table name
}

// Product model
model Product {
  id          Int          @id @default(autoincrement())
  name        String       @db.VarChar(200)
  price       Decimal      @db.Decimal(10, 2)
  category    String?
  stock       Int          @default(0)
  orderItems  OrderItem[]

  @@map("products")
}

// Order model
model Order {
  id         Int         @id @default(autoincrement())
  userId     Int         @map("user_id")
  total      Decimal     @db.Decimal(10, 2)
  status     String      @default("pending")
  createdAt  DateTime    @default(now()) @map("created_at")

  // Relations
  user       User        @relation(fields: [userId], references: [id])
  orderItems OrderItem[]

  @@map("orders")
}

// OrderItem — Many-to-many bridge table
model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   Int     @map("order_id")
  productId Int     @map("product_id")
  quantity  Int
  unitPrice Decimal @db.Decimal(10, 2) @map("unit_price")

  order   Order   @relation(fields: [orderId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@map("order_items")
}
```

### Migrations aur CRUD
```bash
# Migration file banao aur database update karo
npx prisma migrate dev --name init

# Prisma Studio — visual database browser
npx prisma studio

# Client generate karo (schema change hone pe)
npx prisma generate
```

```javascript
// prismaService.js — Prisma se CRUD
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['query', 'error'],  // queries console pe dikho (development mein)
});

// User banana
async function createUser(data) {
    return await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            age: data.age,
            city: data.city,
        },
    });
}

// User dhundho with orders
async function getUserWithOrders(userId) {
    return await prisma.user.findUnique({
        where: { id: userId },
        include: {
            orders: {
                include: {
                    orderItems: {
                        include: {
                            product: true,  // product details bhi
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            },
        },
    });
}

// Filtering, pagination
async function getProducts({ page = 1, pageSize = 10, category, minPrice, maxPrice }) {
    const where = {};
    if (category) where.category = category;
    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = minPrice;
        if (maxPrice) where.price.lte = maxPrice;
    }

    const [products, total] = await prisma.$transaction([
        prisma.product.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { price: 'asc' },
        }),
        prisma.product.count({ where }),
    ]);

    return {
        data: products,
        total,
        page,
        totalPages: Math.ceil(total / pageSize),
    };
}

// Raw SQL bhi chala sakte ho (complex queries ke liye)
async function getTopCustomers() {
    return await prisma.$queryRaw`
        SELECT u.name, SUM(o.total) as total_spent
        FROM users u
        JOIN orders o ON u.id = o.user_id
        WHERE o.status = 'delivered'
        GROUP BY u.id, u.name
        ORDER BY total_spent DESC
        LIMIT 10
    `;
}

module.exports = { createUser, getUserWithOrders, getProducts, getTopCustomers };
```

---

## 12. E-Commerce DB Schema Design

```sql
-- Complete e-commerce schema
-- Sequence: users → categories → products → orders → order_items

CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL,
    parent_id   INTEGER REFERENCES categories(id)  -- sub-categories ke liye
);

CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,  -- kabhi plain text nahi!
    phone           VARCHAR(15),
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE addresses (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(20) DEFAULT 'home',  -- home, work, other
    address_line1 VARCHAR(255) NOT NULL,
    city        VARCHAR(100) NOT NULL,
    state       VARCHAR(100),
    pincode     VARCHAR(10),
    is_default  BOOLEAN DEFAULT false
);

CREATE TABLE products (
    id              SERIAL PRIMARY KEY,
    category_id     INTEGER REFERENCES categories(id),
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    price           DECIMAL(10, 2) NOT NULL,
    mrp             DECIMAL(10, 2),  -- maximum retail price
    stock           INTEGER DEFAULT 0,
    sku             VARCHAR(100) UNIQUE,  -- stock keeping unit
    images          TEXT[],  -- array of image URLs
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id),
    address_id      INTEGER REFERENCES addresses(id),
    status          VARCHAR(50) DEFAULT 'pending',
    -- pending → confirmed → shipped → delivered / cancelled
    subtotal        DECIMAL(10, 2) NOT NULL,
    discount        DECIMAL(10, 2) DEFAULT 0,
    delivery_charge DECIMAL(10, 2) DEFAULT 0,
    total           DECIMAL(10, 2) NOT NULL,
    payment_method  VARCHAR(50),  -- upi, card, cod
    payment_status  VARCHAR(50) DEFAULT 'pending',
    created_at      TIMESTAMP DEFAULT NOW(),
    delivered_at    TIMESTAMP
);

CREATE TABLE order_items (
    id          SERIAL PRIMARY KEY,
    order_id    INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id  INTEGER REFERENCES products(id),
    quantity    INTEGER NOT NULL CHECK (quantity > 0),
    unit_price  DECIMAL(10, 2) NOT NULL,  -- price at time of order
    -- Note: product price baad mein change ho sakta hai, isliye yahan store karte hain
    UNIQUE(order_id, product_id)  -- ek order mein ek product ek baar
);

-- Useful indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
```

---

## 13. Common Mistakes

### N+1 Query Problem
```javascript
// GALAT: N+1 Problem
// 1 query users ke liye + N queries har user ke orders ke liye = N+1 queries!
const users = await db.query('SELECT * FROM users');
for (const user of users.rows) {
    // Har user ke liye alag query — 100 users = 101 queries!
    const orders = await db.query('SELECT * FROM orders WHERE user_id = $1', [user.id]);
    user.orders = orders.rows;
}

// SAHI: Ek JOIN query se sab kuch
const result = await db.query(`
    SELECT
        u.id, u.name, u.email,
        json_agg(json_build_object('id', o.id, 'total', o.total, 'status', o.status)) AS orders
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id, u.name, u.email
`);
// Ya Prisma use karo with include — woh automatically optimize karta hai
```

### SQL Injection
```javascript
// GALAT — Kabhi mat karo!
const email = req.body.email; // hacker dega: ' OR '1'='1
const query = `SELECT * FROM users WHERE email = '${email}'`; // DANGER!

// SAHI — Parameterized query
const result = await db.query('SELECT * FROM users WHERE email = $1', [req.body.email]);
```

### Missing Transaction
```javascript
// GALAT — Agar doosra step fail ho toh inconsistency
await db.query('UPDATE accounts SET balance = balance - 500 WHERE id = 1');
await db.query('UPDATE accounts SET balance = balance + 500 WHERE id = 2'); // fail ho sakta hai

// SAHI — Transaction mein dono steps
const client = await db.getClient();
try {
    await client.query('BEGIN');
    await client.query('UPDATE accounts SET balance = balance - 500 WHERE id = 1');
    await client.query('UPDATE accounts SET balance = balance + 500 WHERE id = 2');
    await client.query('COMMIT');
} catch (e) {
    await client.query('ROLLBACK');
    throw e;
} finally {
    client.release();
}
```

---

## Interview Q&A

**Q1: SQL aur NoSQL mein kya difference hai?**  
A: SQL mein fixed schema hota hai, ACID transactions hote hain, complex queries support karta hai — banking, ERP ke liye best. NoSQL mein flexible schema, horizontal scaling asan — social media, real-time analytics ke liye better.

**Q2: Primary Key aur Foreign Key mein kya fark hai?**  
A: Primary Key ek table mein har row ko uniquely identify karta hai — duplicate ya NULL nahi ho sakta. Foreign Key doosri table ke Primary Key ko reference karta hai — tables ke beech relationship establish karta hai.

**Q3: INNER JOIN aur LEFT JOIN mein kya fark hai?**  
A: INNER JOIN sirf matching rows deta hai dono tables se. LEFT JOIN left table ki sari rows deta hai — right table mein match nahi mila toh NULL aata hai.

**Q4: Index kab add karein?**  
A: Jab column frequently WHERE, JOIN, ya ORDER BY mein use ho. Small tables pe, high-write columns pe, ya low cardinality (true/false) columns pe index avoid karein.

**Q5: N+1 problem kya hota hai?**  
A: Jab loop mein har item ke liye alag DB query jaati hai — 100 users ke liye 101 queries. Solution: JOIN use karo ya ORM ka include/eager loading.

**Q6: HAVING aur WHERE mein kya fark hai?**  
A: WHERE individual rows ko GROUP BY se pehle filter karta hai. HAVING groups ko GROUP BY ke baad filter karta hai.

---

## Assignment

### Task 1: Schema Create Karo
Library management system banao:
- `books` (id, title, author, isbn, copies_total, copies_available)
- `members` (id, name, email, membership_date, membership_expiry)
- `borrowings` (id, member_id, book_id, borrowed_date, due_date, returned_date)

### Task 2: Queries Likho
1. Sare books jo currently available hain (copies_available > 0)
2. Har member ne kitni books borrow ki hain (even jo kabhi nahi ki)
3. Overdue books (due_date past ho gaya, returned_date NULL hai)
4. Most popular books (sabse zyada baar borrow hui)
5. Members jinki membership expire ho gayi hai

### Task 3: Node.js Service
`borrowBook(memberId, bookId)` function likho jo:
- Check kare book available hai
- Check kare member ki membership valid hai
- Transaction mein: borrowing record create karo aur copies_available -1 karo

### Task 4: Prisma
Upar ka schema Prisma mein likhho, migration chalao, aur basic CRUD functions banao.

---

*Next Module: 09-mongodb.md — Document Database with Mongoose*
