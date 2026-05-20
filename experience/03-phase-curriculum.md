# 03 — Phase-wise Curriculum (3 Months / 12 Weeks)

---

## Program Calendar Overview

```
┌─────────────────────────────────────────────────────────────────┐
│               3-MONTH PROGRAM CALENDAR                          │
├────────────┬────────────────────────────────────────────────────┤
│  MONTH 1   │  Foundation + Frontend Development                 │
│  Week 1    │  JavaScript Deep Dive Part 1                       │
│  Week 2    │  JavaScript Deep Dive Part 2 + Git                 │
│  Week 3    │  React.js Fundamentals                             │
│  Week 4    │  React Advanced (Hooks, State, Router)             │
├────────────┼────────────────────────────────────────────────────┤
│  MONTH 2   │  Backend Development + Full Stack Integration      │
│  Week 5    │  Node.js + Command Line                            │
│  Week 6    │  Express.js + REST APIs                            │
│  Week 7    │  MongoDB + Mongoose                                │
│  Week 8    │  SQL + Authentication + JWT                        │
├────────────┼────────────────────────────────────────────────────┤
│  MONTH 3   │  Production + Projects + Interview Prep            │
│  Week 9    │  Full Stack Project 1 (Auth System)                │
│  Week 10   │  Full Stack Project 2 (Job Portal / E-commerce)    │
│  Week 11   │  Deployment (Docker, Vercel, AWS basics)           │
│  Week 12   │  Mock Interviews + Resume + Job Applications       │
└────────────┴────────────────────────────────────────────────────┘
```

---

# PHASE 1: FOUNDATION (Month 1, Weeks 1–2)

## Week 1 — JavaScript Deep Dive Part 1

**Goal:** Understand JavaScript the way an interviewer tests it.

### Daily Breakdown
```
Day 1 — ES6+ Syntax Refresh
  ✦ let/const vs var (scope differences)
  ✦ Arrow functions and when NOT to use them
  ✦ Template literals, default parameters
  ✦ Destructuring (arrays and objects)
  ✦ Spread and Rest operators
  Assignment: Rewrite 5 old-style JS functions using ES6+

Day 2 — Functions & Closures
  ✦ First-class functions
  ✦ Higher-order functions (passing functions as arguments)
  ✦ Closures — definition, use case, memory implications
  ✦ The module pattern using closures
  Assignment: Build a counter using closures without using classes

Day 3 — 'this' Keyword & Binding
  ✦ 4 rules: Default, Implicit, Explicit, new binding
  ✦ Arrow functions and 'this' (lexical binding)
  ✦ call(), apply(), bind()
  Assignment: Predict 'this' in 10 code snippets (provided)

Day 4 — Prototype & Inheritance
  ✦ Prototype chain explained visually
  ✦ Object.create()
  ✦ Class syntax (syntactic sugar over prototypes)
  ✦ Inheritance with extends, super
  Assignment: Build a simple Animal/Dog class hierarchy

Day 5 — Error Handling + Practice
  ✦ try/catch/finally
  ✦ Custom Error classes
  ✦ Common JS errors (TypeError, ReferenceError, SyntaxError)
  ✦ Weekly assignment review and code walkthrough
  Weekly Assignment: Build a "User Validator" utility that:
    - Validates email format (regex)
    - Validates password strength
    - Uses custom error classes
    - Returns structured error messages
```

---

## Week 2 — JavaScript Deep Dive Part 2 + Git

**Goal:** Master async JavaScript and set up professional developer workflow.

### Daily Breakdown
```
Day 1 — Asynchronous JavaScript: The Problem
  ✦ Synchronous vs asynchronous execution
  ✦ Callbacks — how they work
  ✦ Callback hell — why it's a problem
  ✦ Assignment: Implement a callback-based task queue

Day 2 — Promises
  ✦ Creating and consuming Promises
  ✦ .then(), .catch(), .finally() chaining
  ✦ Promise.all(), Promise.race(), Promise.allSettled()
  ✦ Converting callback code to Promises
  Assignment: Refactor callback-based code to Promises

Day 3 — Async/Await + Event Loop
  ✦ async/await syntax
  ✦ Error handling with try/catch in async functions
  ✦ The event loop — call stack, task queue, microtask queue
  ✦ Visualization: https://www.jsv9000.app/
  Assignment: Build an async function that fetches user data 
              with proper error handling

Day 4 — Git & GitHub Professional Setup
  ✦ git init, clone, add, commit, push
  ✦ Branching: main/dev/feature branches
  ✦ Pull requests — creating and reviewing
  ✦ .gitignore, README.md best practices
  ✦ GitHub profile setup (photo, bio, pinned repos)
  Assignment: Push all previous week's code to GitHub with 
              proper commit messages

Day 5 — JavaScript Modules + Practice
  ✦ CommonJS (require/module.exports)
  ✦ ES Modules (import/export)
  ✦ When to use which
  Weekly Assignment: Build a "Weather Fetcher" CLI tool:
    - Fetches weather from a public API
    - Uses async/await
    - Handles errors gracefully
    - Pushed to GitHub with README
```

---

# PHASE 2: FRONTEND DEVELOPMENT (Month 1, Weeks 3–4)

## Week 3 — React.js Fundamentals

**Goal:** Build your first interactive React application.

```
Day 1 — Why React? Setting Up
  ✦ Problems React solves (manual DOM manipulation is painful)
  ✦ Virtual DOM concept
  ✦ Setting up with Vite (NOT Create React App)
  ✦ JSX rules and gotchas
  ✦ Your first component

Day 2 — Components, Props, State
  ✦ Functional components
  ✦ Props — passing data down
  ✦ useState hook
  ✦ Conditional rendering
  ✦ Lists and keys
  Assignment: Build a Contact Card component with props

Day 3 — useEffect & Side Effects
  ✦ useEffect — what it does and when it runs
  ✦ Dependency array (empty, value, none)
  ✦ Cleanup functions
  ✦ Fetching data with useEffect + async
  Assignment: Build a "User List" that fetches from JSONPlaceholder API

Day 4 — Event Handling & Forms
  ✦ onClick, onChange, onSubmit
  ✦ Controlled vs uncontrolled components
  ✦ Form validation
  Assignment: Build a contact form with validation

Day 5 — React Router
  ✦ Client-side routing concept
  ✦ BrowserRouter, Routes, Route
  ✦ useNavigate, useParams
  ✦ Protected routes concept
  Weekly Assignment: Build a multi-page portfolio with:
    - Home, About, Projects, Contact pages
    - Navigation header
    - Pushed to GitHub
```

---

## Week 4 — React Advanced

**Goal:** Write React code the way senior developers do.

```
Day 1 — Advanced Hooks
  ✦ useRef (DOM access + persistent values)
  ✦ useMemo (expensive calculations)
  ✦ useCallback (stable function references)
  ✦ When to optimize vs over-engineering

Day 2 — Context API & Global State
  ✦ Prop drilling problem
  ✦ createContext, useContext
  ✦ Building a theme switcher
  ✦ Building an auth context

Day 3 — Custom Hooks
  ✦ What makes a custom hook
  ✦ useFetch() — reusable data fetching
  ✦ useLocalStorage()
  ✦ useForm()

Day 4 — State Management with Redux Toolkit
  ✦ When Context isn't enough
  ✦ Redux Toolkit setup
  ✦ createSlice, configureStore
  ✦ useDispatch, useSelector

Day 5 — Project Day
  Weekly Assignment: Build a "Task Manager" app:
    - Add, edit, delete tasks
    - Filter by status (pending, completed)
    - Global state with Context or Redux
    - Persist to localStorage
    - Deployed on Vercel
```

---

# PHASE 3: BACKEND DEVELOPMENT (Month 2, Weeks 5–8)

## Week 5 — Node.js + Command Line

**Goal:** Write your first backend code. Understand how servers work.

```
Day 1 — Terminal & Linux Basics
  ✦ File system navigation
  ✦ Creating, reading, moving files from terminal
  ✦ Process management
  ✦ Environment variables

Day 2 — Node.js Fundamentals
  ✦ What is Node.js (not a framework, a runtime)
  ✦ How the event loop works in Node
  ✦ Global objects: process, __dirname, __filename
  ✦ Running JS files from terminal

Day 3 — Node.js Core Modules
  ✦ fs — read, write, append files
  ✦ path — cross-platform file paths
  ✦ http — building a raw HTTP server
  ✦ events — EventEmitter pattern

Day 4 — npm Ecosystem
  ✦ npm init, package.json
  ✦ Installing, updating, removing packages
  ✦ npm scripts
  ✦ nodemon for development
  ✦ dotenv for environment variables

Day 5 — Project Setup
  Weekly Assignment: Build a "File Logger" Node.js app:
    - Reads a directory
    - Lists all files with metadata
    - Writes the output to a log file
    - Runs on a cron-style interval using setInterval
```

---

## Week 6 — Express.js + REST APIs

**Goal:** Build production-quality REST APIs.

```
Day 1 — Express Fundamentals
  ✦ What Express adds over raw http module
  ✦ Setting up an Express app
  ✦ Basic routing (GET, POST, PUT, DELETE)
  ✦ Request and Response objects

Day 2 — Middleware
  ✦ What middleware is (functions in a pipeline)
  ✦ Built-in: express.json(), express.static()
  ✦ Third-party: morgan (logging), cors, helmet
  ✦ Writing custom middleware
  ✦ Error handling middleware (4-parameter signature)

Day 3 — REST API Design
  ✦ REST principles
  ✦ Resource naming conventions
  ✦ HTTP status codes (200, 201, 400, 401, 403, 404, 500)
  ✦ Request validation
  ✦ Pagination and filtering

Day 4 — API Structure & Organization
  ✦ MVC pattern for APIs
  ✦ Router organization
  ✦ Controller separation
  ✦ Service layer pattern

Day 5 — Project
  Weekly Assignment: Build a "Notes API" with full CRUD:
    - GET /notes — list all
    - GET /notes/:id — get one
    - POST /notes — create
    - PUT /notes/:id — update
    - DELETE /notes/:id — delete
    - Store in memory (no DB yet)
    - Test with Thunder Client/Postman
```

---

## Week 7 — MongoDB + Mongoose

**Goal:** Add a real database to your backend.

```
Day 1 — Database Concepts
  ✦ Why do we need databases?
  ✦ SQL vs NoSQL — when to use which
  ✦ MongoDB: documents, collections, databases
  ✦ BSON vs JSON
  ✦ Setting up MongoDB Atlas (cloud)

Day 2 — Mongoose ODM
  ✦ Connecting Node.js to MongoDB via Mongoose
  ✦ Schema definition
  ✦ Model creation
  ✦ Basic CRUD with Mongoose

Day 3 — Advanced Mongoose
  ✦ Schema validation (required, min, max, enum)
  ✦ Middleware (pre/post hooks)
  ✦ Virtual fields
  ✦ Populate (referencing other documents)
  ✦ Indexes

Day 4 — Aggregation Pipeline
  ✦ $match, $group, $sort, $project
  ✦ Building analytics queries
  ✦ When to aggregate vs application-level processing

Day 5 — Project
  Weekly Assignment: Add MongoDB to your Notes API:
    - Replace in-memory storage with MongoDB
    - Add timestamps (createdAt, updatedAt)
    - Add search by title
    - Add pagination
```

---

## Week 8 — SQL + Authentication + JWT

**Goal:** Complete your backend skillset with SQL and authentication.

```
Day 1 — SQL Fundamentals
  ✦ Tables, rows, columns, relationships
  ✦ SELECT, INSERT, UPDATE, DELETE
  ✦ WHERE, ORDER BY, LIMIT
  ✦ INNER JOIN, LEFT JOIN
  ✦ PostgreSQL setup with Node.js (pg library)

Day 2 — Authentication Fundamentals
  ✦ Sessions vs Token-based auth
  ✦ JWT structure (header.payload.signature)
  ✦ Why JWT is stateless
  ✦ Access tokens vs Refresh tokens
  ✦ Password hashing with bcrypt

Day 3 — Building Auth System
  ✦ POST /auth/register — hash password, save user
  ✦ POST /auth/login — verify password, return JWT
  ✦ Auth middleware — verify JWT on protected routes
  ✦ GET /auth/me — get current user

Day 4 — Authorization & RBAC
  ✦ Role-based access (admin, user, moderator)
  ✦ Route-level permission guards
  ✦ Resource ownership checks

Day 5 — Security Hardening
  ✦ Rate limiting with express-rate-limit
  ✦ Helmet.js for security headers
  ✦ Input sanitization
  ✦ CORS configuration
  Weekly Assignment: Build a full Auth system:
    - Register, login, logout
    - JWT access + refresh tokens
    - Protected routes
    - Tested with Postman
    - Push to GitHub
```

---

# PHASE 4: FULL STACK INTEGRATION (Month 3, Weeks 9–10)

## Week 9 — Full Stack Project 1: Authentication System

**Goal:** Connect React frontend to Node.js backend end-to-end.

```
This week you build a complete, deployable Authentication System:

Frontend (React/Next.js):
  ├── Register page with validation
  ├── Login page
  ├── Dashboard (protected route)
  ├── Logout functionality
  └── JWT stored in httpOnly cookies

Backend (Node.js + Express):
  ├── Auth API routes
  ├── User model (MongoDB)
  ├── JWT middleware
  └── Refresh token rotation

Key learnings:
  ✦ Connecting React to Express API
  ✦ Handling auth state globally
  ✦ CORS configuration for local development
  ✦ Environment variables across frontend and backend
  ✦ Error handling end-to-end
```

---

## Week 10 — Full Stack Project 2: Job Portal (or E-commerce)

**Goal:** Build a feature-rich application with multiple user roles.

```
Choose one project (both are provided as templates):

Option A: Job Portal
  ├── Employer: Post jobs, view applications
  ├── Job Seeker: Browse jobs, apply, track status
  ├── Admin: Manage users and listings
  └── Search and filter functionality

Option B: E-commerce Platform
  ├── Product catalog with categories
  ├── Shopping cart (state management)
  ├── Order management
  ├── Admin dashboard
  └── Stripe payment (test mode)

Key learnings:
  ✦ Multi-role authentication
  ✦ Complex data relationships
  ✦ File upload (product images / resume)
  ✦ Email notifications (Nodemailer)
  ✦ Pagination and search
```

---

# PHASE 5: PRODUCTION & DEPLOYMENT (Month 3, Week 11)

## Week 11 — Deployment & DevOps Basics

```
Day 1 — Docker Fundamentals
  ✦ Containers vs Virtual Machines
  ✦ Writing a Dockerfile
  ✦ docker build, docker run, docker-compose
  ✦ Docker for local development parity

Day 2 — Frontend Deployment (Vercel)
  ✦ Connecting GitHub to Vercel
  ✦ Environment variables in Vercel
  ✦ Custom domains
  ✦ Vercel preview deployments

Day 3 — Backend Deployment (Railway/Render)
  ✦ Deploying Node.js to Railway
  ✦ Connecting to cloud MongoDB Atlas
  ✦ Environment variable management
  ✦ Monitoring logs in production

Day 4 — AWS & Nginx Basics
  ✦ EC2 instance setup
  ✦ SSH into a server
  ✦ PM2 process manager
  ✦ Nginx as reverse proxy

Day 5 — CI/CD with GitHub Actions
  ✦ What CI/CD is and why it matters
  ✦ Writing a basic GitHub Actions workflow
  ✦ Auto-deploy on push to main
  Assignment: Set up CI/CD for your Job Portal/E-commerce project
```

---

# PHASE 6: INTERVIEW PREPARATION (Month 3, Week 12)

## Week 12 — Mock Interviews + Resume + Launch

```
Day 1 — Resume & GitHub Polish
  ✦ Resume review session (1:1 with mentor)
  ✦ GitHub README optimization
  ✦ Project documentation
  ✦ LinkedIn profile update

Day 2 — Technical Interview Simulation
  ✦ JavaScript conceptual questions (30 mins)
  ✦ React scenario questions (30 mins)
  ✦ Live coding exercise (60 mins)
  ✦ Feedback and improvement areas

Day 3 — System Design + Backend Questions
  ✦ Backend scenario questions
  ✦ Database design question
  ✦ Simple system design walkthrough
  ✦ Feedback

Day 4 — HR & Communication Round
  ✦ "Tell me about yourself" — structured answer
  ✦ Explaining career transition story
  ✦ Salary negotiation basics
  ✦ Questions to ask the interviewer

Day 5 — Job Application Strategy
  ✦ Job search platforms (LinkedIn, Naukri, AngelList)
  ✦ How to apply strategically (not spray-and-pray)
  ✦ Following up after applications
  ✦ Program graduation and next steps
```

---

## Weekly Rhythm (Every Week)

```
Monday    — New topic introduction + concepts
Tuesday   — Deep dive + examples
Wednesday — Hands-on coding practice
Thursday  — Mini project or feature build
Friday    — Assignment review + Q&A session
Weekend   — Assignment completion + self-study
```

---

## Deliverables by End of Program

| # | Deliverable | Status |
|---|---|---|
| 1 | Weather Fetcher CLI (JS async) | Week 2 |
| 2 | Multi-page React Portfolio | Week 3 |
| 3 | Task Manager App (deployed) | Week 4 |
| 4 | Notes REST API (Express + MongoDB) | Week 7 |
| 5 | Authentication System (Full Stack) | Week 9 |
| 6 | Job Portal or E-commerce App (Full Stack) | Week 10 |
| 7 | Deployed apps on Vercel + Railway | Week 11 |
| 8 | Polished GitHub Profile (6+ repos) | Week 12 |
| 9 | Updated Resume + LinkedIn | Week 12 |
| 10 | 2 Mock Interviews completed | Week 12 |

---

> *Next: See the Confidence Booster Plan → [04-confidence-booster.md](./04-confidence-booster.md)*
