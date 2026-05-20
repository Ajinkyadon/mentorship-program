# Module 3: Complete Software Development Roadmap
### "Puri picture pehle dekho, phir ek ek piece complete karo"

---

Ye roadmap tumhe batata hai **kya kya seekhna hai aur kyun** — bina kisi cheez ko miss kiye, bina overwhelmed hue.

Ye language-specific nahi hai. Concept pehle — implementation baad mein.

---

## The Big Picture

```
Internet
    ↓
Browser / Client
    ↓
Frontend (HTML, CSS, JS)
    ↓
HTTP Request
    ↓
Backend Server (Node/Django/Spring)
    ↓
Database (MongoDB/PostgreSQL)
    ↓
Response back to Browser
```

Ye poora cycle samajhna hi software development hai.

---

## Step 1: How the Internet Works

Pehle ye samjho — ye fundamentals kabhi kabhi interviews mein directly pooche jaate hain.

### DNS (Domain Name System)
```
User types: google.com
    ↓
DNS server: "google.com ka IP kya hai? → 142.250.x.x"
    ↓
Browser: Is IP address pe request bhejo
    ↓
Google ka server: Response bhejta hai
```

DNS ek phone book ki tarah hai — naam se number dhundh deta hai.

### HTTP vs HTTPS
- **HTTP** — HyperText Transfer Protocol — data openly bhejta hai
- **HTTPS** — Secure version — data encrypted hota hai (SSL/TLS)
- Production mein hamesha HTTPS use karo

### How a Web Request Works (Full Cycle)
```
1. User browser mein URL type karta hai
2. DNS se IP milta hai
3. Browser TCP connection karta hai server se (3-way handshake)
4. Browser HTTP request bhejta hai
5. Server request process karta hai
6. Server HTTP response bhejta hai (HTML/JSON/etc)
7. Browser response render karta hai
8. Connection close hoti hai
```

### Important Terms
| Term | Kya hai |
|------|---------|
| IP Address | Server ki unique address |
| Port | Ek IP pe specific service ka address (80=HTTP, 443=HTTPS, 3000=dev) |
| Protocol | Rules of communication (HTTP, FTP, WebSocket) |
| Client | Jo request karta hai (browser, mobile app) |
| Server | Jo request handle karta hai |
| API | Client aur server ke beech communication ka interface |

---

## Step 2: Frontend Basics

Frontend = Jo user browser mein dekhta hai aur interact karta hai.

### HTML — Structure
```
HTML ek skeleton hai web page ka.
<html>
  <head> → Meta info, title, CSS links
  <body> → Jo user dekhta hai
    <header> → Top navigation
    <main> → Main content
    <footer> → Bottom
```

Kya seekhna hai:
- Semantic HTML (`<article>`, `<section>`, `<nav>` — `<div>` nahi har jagah)
- Forms aur form elements
- Accessibility basics (`alt`, `aria-label`)
- HTML structure for SEO

### CSS — Styling
```
CSS web page ko design karta hai.
color, font, spacing, layout, animation — sab CSS.
```

Kya seekhna hai:
- Box model (margin, padding, border)
- Flexbox — layout ke liye (MUST)
- CSS Grid — complex layouts
- Responsive design — mobile friendly banana
- Media queries
- CSS variables

### JavaScript — Behavior
```
JavaScript web page ko interactive banata hai.
Button click hota hai → JS kuch karta hai.
Form submit hoti hai → JS validate karta hai.
API call hoti hai → JS data fetch karta hai.
```

---

## Step 3: Backend Basics

Backend = Jo user nahi dekhta — server side logic.

```
Frontend se request aati hai
    ↓
Backend request receive karta hai
    ↓
Business logic run hoti hai
    ↓
Database se data lena/dena
    ↓
Response return karna
```

Kya seekhna hai:
- HTTP server banana (Express/Django/Spring)
- Routing — kaunsi request kaunsa function handle kare
- Middleware — request ke beech mein processing
- Error handling — kuch gadbad ho toh graceful response
- Request validation — user ka input verify karna
- Environment variables — secrets safely rakhna

---

## Step 4: Databases

Data permanently store karne ke liye databases chahiye.

### SQL (Structured Query Language)
```
Tables hoti hain — rows aur columns
Ek table mein ek type ka data (users, products, orders)
Tables ke beech relationships hoti hain

Example: Users table + Orders table
→ Ek user ke multiple orders ho sakte hain
```

### NoSQL
```
Documents hote hain (JSON jaisi structure)
Collections hoti hain (tables ki tarah)
Flexible structure — har document alag fields rakh sakta hai

Example: MongoDB
{
  _id: "123",
  name: "Rahul",
  address: { city: "Mumbai", pin: "400001" }
}
```

---

## Step 5: APIs (Application Programming Interfaces)

**API = Ek interface jisse frontend backend se baat karta hai.**

### REST API
```
GET    /users          → Sab users lao
GET    /users/123      → User 123 lao
POST   /users          → Naya user banao
PUT    /users/123      → User 123 update karo
DELETE /users/123      → User 123 delete karo
```

### API Response Format (JSON)
```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "Rahul Kumar",
    "email": "rahul@example.com"
  }
}
```

---

## Step 6: Authentication & Authorization

**Authentication** = "Tu kaun hai?" (login/register)
**Authorization** = "Tu ye kar sakta hai?" (permissions)

### Flow
```
Register → password hash karke database mein save
Login → email/password verify karo → JWT token bhejo
Protected Route → Token check karo → Agar valid toh access do
```

### JWT (JSON Web Token)
```
Token = header.payload.signature
Server token banata hai login pe
Client token save karta hai
Har request mein token bhejta hai
Server verify karta hai
```

---

## Step 7: Version Control (Git)

**Git = Apne code ka time machine.**

```
Bina Git ke:
- "main_v1.js", "main_v2.js", "main_final.js", "main_final_FINAL.js"
- Team mein kaam karein toh chaos

Git ke saath:
- Saari history saved hoti hai
- Kisi bhi purani state mein wapas ja sakte ho
- Team ek saath kaam kar sakti hai conflicts ke bina
```

**GitHub** = Git ka online home — remote repository.

---

## Step 8: Debugging

Har developer ka 40–60% time debugging mein jaata hai — ye normal hai.

```
Error aaya → Pado carefully → Line number note karo
→ Console.log lagao → Isolate karo → Fix karo → Test karo
```

---

## Step 9: Hosting & Deployment

Apna application duniya ke liye live karna.

### Simple Deployment Options for Freshers
| Platform | Use Case | Free? |
|----------|----------|-------|
| Render | Backend APIs | Yes |
| Vercel | Frontend | Yes |
| Railway | Backend + DB | Limited |
| Netlify | Frontend | Yes |
| MongoDB Atlas | MongoDB cloud | Yes |

### Deployment Process (Basic)
```
1. Code GitHub pe push karo
2. Platform se GitHub connect karo
3. Build command dо
4. Environment variables set karo
5. Deploy!
```

---

## Step 10: System Design Basics (For Interviews)

Freshers ke liye deep system design zaruri nahi — but concepts samajhna help karta hai.

### Basic Concepts

**Scalability:** Jaise zyada users aate hain, system handle kar sake.
```
Vertical Scaling → Badi machine lao (limit hai)
Horizontal Scaling → Zyada machines lao (better)
```

**Caching:** Baar baar same data fetch karne ki jagah, ek baar fetch karo aur store karo.
```
Database query → slow
Cache hit → fast

Redis ek popular caching solution hai
```

**Load Balancer:** Traffic multiple servers mein distribute karna.

**CDN (Content Delivery Network):** Images/videos user ke paas wale server se serve karna = fast.

---

## Step 11: Problem Solving & DSA

**Data Structures:** Data organize karne ke tarike
```
Array   → List of items
Object  → Key-value pairs
Stack   → Last in, first out (undo button)
Queue   → First in, first out (print queue)
Tree    → Hierarchical data (file system)
Graph   → Connected nodes (social network)
```

**Algorithms:** Problems solve karne ke tarike
```
Searching  → Linear search, Binary search
Sorting    → Bubble, Merge, Quick sort
Recursion  → Function khud ko call karta hai
Dynamic Programming → Complex problems ko subproblems mein torna
```

**Placement mein:** Mostly arrays, strings, hashmaps, trees, recursion poocha jaata hai.

---

## Step 12: Real-World Software Lifecycle

Industry mein ek feature kaise banta hai:

```
1. Requirement  → "Kya banana hai?" — Product Manager se aata hai
2. Design       → Architecture decide hoti hai
3. Development  → Developers code likhte hain
4. Code Review  → Team review karti hai
5. Testing      → QA test karta hai
6. Staging      → Test environment mein deploy
7. Production   → Live karna — real users use karte hain
8. Monitoring   → Errors, performance watch karna
9. Bug fixes    → Production issues fix karna
10. Repeat      → Next feature start
```

---

## Step 13: Developer Workflow

Ek industry developer ka typical daily workflow:

```
Morning standup (15 min) → Team ko batao kya kar rahe ho
Pick up task from Jira/Linear/GitHub Issues
Create new branch for feature
Code likho
Local mein test karo
Commit + Push
Pull Request open karo
Code review lo
Feedback address karo
PR merge hoti hai
Feature deployed hoti hai
```

---

## The Complete Roadmap Visual

```
FOUNDATION
├── Internet, HTTP, DNS basics
├── Terminal/Command line basics
├── Git & GitHub
└── Problem solving mindset

FRONTEND
├── HTML (semantic)
├── CSS (Flexbox, Grid, Responsive)
├── JavaScript (core + ES6+)
├── DOM manipulation
└── API integration

BACKEND
├── Server concepts
├── REST API design
├── Framework (Express/Django/Spring)
├── Middleware & Error handling
├── Authentication (JWT)
└── File uploads, Email, etc.

DATABASE
├── SQL basics (PostgreSQL/MySQL)
├── NoSQL basics (MongoDB)
├── Schema design
├── Queries & indexes
└── ORM/ODM (Prisma/Mongoose)

DEVOPS BASICS
├── Environment variables
├── Deployment (Render/Vercel)
├── Basics of Docker
└── CI/CD concept

INTERVIEW PREP
├── DSA (Arrays, Strings, Hashmaps, Trees)
├── CS Fundamentals (OS, DBMS, CN, OOPs)
├── System Design basics
└── HR + Communication
```

---

## Assignment — Module 3

1. Ek web request ka full cycle apni bhasha mein explain karo — "User ne google.com type kiya toh kya hua?"
2. Apna 3-month learning plan banao — module 0 ke template se
3. Ek public API (like `jsonplaceholder.typicode.com`) Postman se hit karo aur response dekho
