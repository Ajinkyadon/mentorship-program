# 05 — Node.js Fundamentals

> Node.js = JavaScript ko browser se bahar nikaal ke server pe chalana.
> Ek language — frontend aur backend dono. Yahi Node.js ka jadoo hai.

---

## Node.js Kya Hai?

```
Browser mein JavaScript → Web pages interactive banata hai
Node.js mein JavaScript → Server pe chalata hai

Node.js = V8 Engine (Chrome ka) + libuv (async I/O) + Core Modules

V8 = JavaScript ko machine code mein convert karta hai (Google ne banaya)
libuv = File system, networking, timers ko async handle karta hai
```

### Node.js vs Browser JavaScript:

```
BROWSER JAVASCRIPT:         NODE.JS JAVASCRIPT:
─────────────────────       ──────────────────────────
window object               global object
document (DOM)              file system (fs module)
fetch API                   http module
localStorage                no storage (databases use karo)
alert, confirm              nahi hai
<script> se load            require() / import se load
```

---

## Node.js Install aur Setup

```bash
# Node.js install karo (LTS version lo)
# Download: https://nodejs.org/

# Version check karo
node --version   # v20.x.x
npm --version    # 10.x.x

# Pehla program chalao
node hello.js

# REPL (interactive mode)
node
> console.log("Hello World")
> 2 + 2
> .exit
```

### hello.js:

```javascript
// Yeh simple file chalao: node hello.js
console.log("Hello from Node.js!");
console.log("Node version:", process.version);
console.log("Operating System:", process.platform);
```

---

## Global Objects

```javascript
// Node.js mein kuch global objects hote hain (window nahi hota)

// process — current Node.js process ke baare mein
console.log(process.version);      // Node.js version
console.log(process.platform);     // 'linux', 'darwin', 'win32'
console.log(process.cwd());        // Current working directory
console.log(process.env.PATH);     // Environment variables
console.log(process.argv);         // Command line arguments
process.exit(0);                    // Process band karo (0 = success)

// __dirname — current file ka directory path
console.log(__dirname);  // /Users/rahul/projects/my-app

// __filename — current file ka full path
console.log(__filename); // /Users/rahul/projects/my-app/index.js

// Command line arguments
// node app.js hello world
console.log(process.argv);
// ['node', '/path/to/app.js', 'hello', 'world']
// process.argv[2] = 'hello'
// process.argv[3] = 'world'
```

---

## npm — Node Package Manager

```bash
# Project initialize karo
npm init          # Interactive — sawaal poochega
npm init -y       # Sab default — quick setup

# Packages install karo
npm install express          # Production dependency
npm install --save-dev nodemon  # Dev-only dependency

# Global install
npm install -g nodemon

# Package remove karo
npm uninstall express

# All packages install karo (node_modules se)
npm install

# Scripts chalao
npm run dev
npm start
npm test
```

### package.json samjho:

```json
{
  "name": "my-backend-app",
  "version": "1.0.0",
  "description": "Mera pehla Node.js app",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

## Core Modules

### 1. `fs` — File System

```javascript
const fs = require('fs');
const path = require('path');

// ─── SYNCHRONOUS (blocking) ───
// Chhote scripts mein theek hai, server mein use mat karo

// File padhna
const content = fs.readFileSync('file.txt', 'utf8');
console.log(content);

// File likhna
fs.writeFileSync('output.txt', 'Yeh content save ho gaya');

// ─── ASYNCHRONOUS (non-blocking) — Server mein yeh use karo ───

// File padhna (async)
fs.readFile('file.txt', 'utf8', (error, data) => {
  if (error) {
    console.error("File nahi mili:", error.message);
    return;
  }
  console.log("File content:", data);
});

// File likhna (async)
fs.writeFile('output.txt', 'Hello World!', (error) => {
  if (error) {
    console.error("File save nahi hui:", error);
    return;
  }
  console.log("File save ho gayi!");
});

// File append karna
fs.appendFile('log.txt', `\n${new Date().toISOString()}: Log entry`, (err) => {
  if (err) console.error(err);
});

// Directory banana
fs.mkdir('./uploads', { recursive: true }, (err) => {
  if (err && err.code !== 'EEXIST') console.error(err);
});

// Files list karna
fs.readdir('./uploads', (err, files) => {
  if (err) return console.error(err);
  console.log("Files:", files);
});

// File exist karta hai?
fs.access('file.txt', fs.constants.F_OK, (err) => {
  console.log(err ? "File nahi hai" : "File hai");
});

// ─── Promises version (modern) ───
const { promises: fsPromises } = require('fs');

async function readAndWriteFile() {
  try {
    const data = await fsPromises.readFile('input.txt', 'utf8');
    const processed = data.toUpperCase();
    await fsPromises.writeFile('output.txt', processed);
    console.log("Done!");
  } catch (error) {
    console.error("Error:", error.message);
  }
}
```

### 2. `path` — File Paths

```javascript
const path = require('path');

// OS-independent paths banao (Windows mein \ hota hai, Unix mein /)
const filePath = path.join(__dirname, 'uploads', 'image.jpg');
// /Users/rahul/project/uploads/image.jpg

// Path ke parts nikalo
console.log(path.dirname('/home/user/file.txt'));   // /home/user
console.log(path.basename('/home/user/file.txt'));  // file.txt
console.log(path.extname('/home/user/file.txt'));   // .txt

// Absolute path banao
const absolutePath = path.resolve('uploads', 'image.jpg');
// Current directory se absolute path

// Example — express mein static files serve karna
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

### 3. `http` — Raw HTTP Server

```javascript
const http = require('http');

// Basic server banao (Express iske upar build hai)
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`); // GET /about

  // Route handling
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Home Page</h1>');
  }
  else if (req.url === '/api/users' && req.method === 'GET') {
    const users = [{ id: 1, name: "Rahul" }];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page not found');
  }
});

server.listen(3000, () => {
  console.log('Server chal raha hai http://localhost:3000 pe');
});

// Yahi dekhke samjho kyun Express use karte hain!
// Yeh bahut tedious hai — Express is sab ko simplify karta hai
```

### 4. `events` — EventEmitter

```javascript
const EventEmitter = require('events');

class OrderSystem extends EventEmitter {
  placeOrder(order) {
    console.log(`Order placed: ${order.item}`);
    this.emit('orderPlaced', order); // Event trigger karo
  }

  cancelOrder(orderId) {
    console.log(`Order cancelled: ${orderId}`);
    this.emit('orderCancelled', { orderId });
  }
}

const orderSystem = new OrderSystem();

// Event listeners register karo
orderSystem.on('orderPlaced', (order) => {
  console.log(`Email bhejo: Order ${order.item} confirm hua!`);
});

orderSystem.on('orderPlaced', (order) => {
  console.log(`Inventory update karo: ${order.item} ka stock ghata`);
});

orderSystem.on('orderCancelled', ({ orderId }) => {
  console.log(`Refund process karo order ${orderId} ke liye`);
});

// Trigger karo
orderSystem.placeOrder({ id: 1, item: "Laptop", price: 55000 });
// Output:
// Order placed: Laptop
// Email bhejo: Order Laptop confirm hua!
// Inventory update karo: Laptop ka stock ghata
```

---

## Environment Variables — Secrets Safely Store Karo

```bash
# .env file banao (KABHI Git mein push mat karo!)
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=mera_secret_key_12345
API_KEY=abc123xyz
```

```javascript
// dotenv package se load karo
require('dotenv').config(); // Sabse pehle yeh line likhna!

// Ab process.env se access karo
const PORT = process.env.PORT || 3000; // Default value bhi rakh sakte ho
const DB_URI = process.env.MONGODB_URI;
const SECRET = process.env.JWT_SECRET;

console.log(`Server port: ${PORT}`);

// .gitignore mein add karo:
// .env
// .env.local
// .env.production
```

---

## Nodemon — Development Tool

```bash
# Install karo
npm install --save-dev nodemon

# package.json mein script add karo
{
  "scripts": {
    "dev": "nodemon index.js"
  }
}

# Chalao
npm run dev

# Ab jab bhi code save karo, server automatically restart hoga
```

---

## Practical Project — File-based Logger

```javascript
// logger.js — ek complete logging system

const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, 'logs');

// Logs directory create karo
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function getLogFileName() {
  const date = new Date().toISOString().split('T')[0]; // 2024-01-15
  return path.join(LOG_DIR, `${date}.log`);
}

function formatMessage(level, message) {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
}

const logger = {
  info(message) {
    const formatted = formatMessage('info', message);
    process.stdout.write(formatted); // Console pe dikhao
    fs.appendFile(getLogFileName(), formatted, (err) => {
      if (err) console.error('Log save nahi hua:', err);
    });
  },

  error(message) {
    const formatted = formatMessage('error', message);
    process.stderr.write(formatted);
    fs.appendFile(getLogFileName(), formatted, (err) => {
      if (err) console.error('Log save nahi hua:', err);
    });
  },

  warn(message) {
    const formatted = formatMessage('warn', message);
    process.stdout.write(formatted);
    fs.appendFile(getLogFileName(), formatted, (err) => {
      if (err) console.error('Log save nahi hua:', err);
    });
  }
};

module.exports = logger;

// ─────────────────────────────────────────────
// index.js — use karo

const logger = require('./logger');

logger.info('Application start ho gayi');
logger.info('Database se connect kar rahe hain...');
logger.warn('Memory usage high ho rahi hai');
logger.error('Database connection fail ho gayi!');
```

---

## Assignment

```
1. Ek "File Explorer" CLI tool banao:
   - Command line argument se directory path lo
   - Saari files aur folders list karo (tree format mein)
   - Har file ka size dikhao
   - Total size calculate karo

   Usage: node explorer.js ./my-project

2. Ek simple "Key-Value Store" banao:
   - Data JSON file mein store ho
   - Operations: set, get, delete, list, clear
   
   Usage:
   node store.js set name "Rahul"
   node store.js get name
   node store.js delete name
   node store.js list

3. Ek "System Monitor" banao jo har 5 seconds pe:
   - CPU usage % dikhao
   - Memory usage dikhao
   - Uptime dikhao
   - Ek log file mein save kare
   - Ctrl+C pe gracefully band ho
```

---

> *Next: Express.js & REST APIs → [06-expressjs-rest-api.md](./06-expressjs-rest-api.md)*
