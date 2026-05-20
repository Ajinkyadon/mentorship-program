# 02 — Complete Learning Roadmap

---

## Technology Stack Overview

This program teaches the **MERN+ Stack** — the most in-demand full-stack combination for 10–15 LPA roles in 2024–2025.

```
┌─────────────────────────────────────────────────────────────┐
│                    FULL STACK ARCHITECTURE                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    FRONTEND                          │   │
│  │   React.js  │  Next.js  │  HTML/CSS  │  JavaScript   │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↕ REST API / HTTP                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    BACKEND                           │   │
│  │   Node.js  │  Express.js  │  NestJS  │  REST APIs    │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↕                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    DATABASE                          │   │
│  │        MongoDB (NoSQL)  │  PostgreSQL / MySQL (SQL)  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↕                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  INFRASTRUCTURE                      │   │
│  │   Docker  │  Nginx  │  PM2  │  Vercel  │  AWS (EC2)  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Visual Roadmap

> **Reference:** [roadmap.sh/full-stack](https://roadmap.sh/full-stack) — A community-maintained visual roadmap for full-stack developers. Use this alongside this document.

---

## Layer 1: Developer Foundations (Weeks 1–2)

These are skills every developer uses every single day. Non-negotiable.

### Command Line Basics
```
Why: Every deployment, every Git command, every server runs on a terminal.

Topics:
  ├── Navigating file system (ls, cd, pwd, mkdir, rm)
  ├── File operations (cp, mv, cat, nano/vim basics)
  ├── Process management (ps, kill, top)
  ├── Environment variables (export, .env files)
  └── SSH basics (connecting to remote servers)

Resources:
  - The Missing Semester of CS Education: https://missing.csail.mit.edu/
  - Linux Command Line Cheatsheet: https://cheatography.com/davechild/cheat-sheets/linux-command-line/
```

### Git & GitHub
```
Why: Git is how professional developers collaborate. 
     An empty GitHub is a red flag in interviews.

Topics:
  ├── git init, clone, add, commit, push, pull
  ├── Branching strategy (feature branches, main/dev)
  ├── Pull Requests and Code Reviews
  ├── .gitignore, README.md
  ├── Merge conflicts and how to resolve them
  └── GitHub profile optimization

Resources:
  - Git official docs: https://git-scm.com/doc
  - Oh My Git (visual game): https://ohmygit.org/
  - GitHub Skills: https://skills.github.com/
```

### Debugging Skills
```
Why: 70% of developer time is debugging. This is your biggest advantage 
     coming from a support background.

Topics:
  ├── Browser DevTools (Network, Console, Sources tabs)
  ├── console.log strategically vs debugger statement
  ├── Reading stack traces and error messages
  ├── Node.js debugging with VS Code
  └── Reading documentation effectively
```

---

## Layer 2: JavaScript — Deep Concepts (Weeks 1–4)

JavaScript is the language of the web. You can't skip the deep parts.

```
JavaScript Depth Map
─────────────────────────────────────────
LEVEL 1 — You probably know this:
  Variables, functions, loops, conditionals
  DOM manipulation, event listeners
  Basic arrays and objects

LEVEL 2 — This program starts here:
  ├── ES6+ syntax (arrow functions, destructuring, spread/rest)
  ├── Scope: var vs let vs const
  ├── Closures — what they are and why they matter
  ├── Hoisting
  ├── The 'this' keyword (4 binding rules)
  ├── Prototype chain and inheritance
  ├── Higher-order functions (map, filter, reduce)
  └── Error handling (try/catch/finally, custom errors)

LEVEL 3 — This is what separates junior from mid-level:
  ├── Asynchronous JavaScript
  │     ├── Callbacks (and callback hell)
  │     ├── Promises (.then, .catch, .finally, Promise.all)
  │     └── Async/Await (the modern way)
  ├── Event loop — how JavaScript actually works
  ├── Modules (CommonJS vs ES Modules)
  ├── Memory management basics
  └── JavaScript design patterns (Module, Observer, Singleton)

Resources:
  - JavaScript.info (best free resource): https://javascript.info/
  - You Don't Know JS (free book series): https://github.com/getify/You-Dont-Know-JS
  - JS Visualizer (event loop visualization): https://www.jsv9000.app/
```

---

## Layer 3: Frontend Development (Weeks 3–6)

### React.js
```
Why: React powers most product-based company frontends. 
     It's the #1 required skill in frontend job descriptions.

Topics:
  ├── JSX and virtual DOM concept
  ├── Functional components
  ├── Props and state
  ├── useState, useEffect hooks
  ├── Component lifecycle understanding
  ├── useContext, useRef, useMemo, useCallback
  ├── Custom hooks
  ├── React Router (client-side routing)
  ├── Forms and controlled components
  └── Performance optimization (lazy loading, memo)

Resources:
  - Official React docs: https://react.dev/
  - React roadmap: https://roadmap.sh/react
```

### State Management
```
Topics:
  ├── Local state (useState)
  ├── Global state with Context API
  ├── Redux Toolkit (for complex apps)
  └── Zustand (lightweight alternative)
```

### Next.js
```
Why: Next.js is what companies use in production. 
     React alone is rarely used for full products.

Topics:
  ├── Pages vs App Router
  ├── Server-side rendering (SSR) vs Static generation (SSG)
  ├── API routes
  ├── Image optimization
  ├── Middleware
  └── Deployment to Vercel

Resources:
  - Official Next.js docs: https://nextjs.org/docs
  - Next.js tutorial: https://nextjs.org/learn
```

---

## Layer 4: Backend Development (Weeks 7–10)

### Node.js
```
Why: Node.js lets you write JavaScript on the server. 
     One language, full stack.

Topics:
  ├── How Node.js works (V8 engine, event loop)
  ├── File system module (fs)
  ├── HTTP module (raw server)
  ├── npm and package.json
  ├── Environment variables with dotenv
  ├── Streams and buffers (basics)
  └── Node.js best practices

Resources:
  - Node.js official docs: https://nodejs.org/en/docs/
  - Node.js roadmap: https://roadmap.sh/nodejs
```

### Express.js
```
Why: Express is the most widely used Node.js framework. 
     Simple, fast, and what most companies still use.

Topics:
  ├── Setting up an Express server
  ├── Routing (GET, POST, PUT, DELETE)
  ├── Middleware concept (next(), order matters)
  ├── Request/Response objects
  ├── Error handling middleware
  ├── CORS configuration
  ├── File uploads with Multer
  └── Rate limiting

Resources:
  - Express.js docs: https://expressjs.com/
```

### NestJS
```
Why: NestJS is what larger product companies use. 
     It brings structure (like Spring Boot for Java) to Node.js.
     Understanding it signals senior-level thinking.

Topics:
  ├── Modules, controllers, services architecture
  ├── Dependency injection
  ├── DTOs and validation with class-validator
  ├── Guards and interceptors
  └── NestJS with TypeORM or Prisma

Resources:
  - NestJS docs: https://docs.nestjs.com/
```

---

## Layer 5: Databases (Weeks 9–11)

### MongoDB (NoSQL)
```
Topics:
  ├── Document model vs relational model
  ├── CRUD operations (insertOne, find, updateOne, deleteOne)
  ├── Mongoose ODM
  ├── Schema design and validation
  ├── Indexing for performance
  ├── Aggregation pipeline
  └── Atlas cloud setup

Resources:
  - MongoDB University (free): https://university.mongodb.com/
  - Mongoose docs: https://mongoosejs.com/docs/
```

### SQL Databases (PostgreSQL / MySQL)
```
Why: Many companies use SQL. Knowing both SQL and NoSQL 
     makes you versatile.

Topics:
  ├── Relational model concepts (tables, rows, columns)
  ├── SQL queries (SELECT, INSERT, UPDATE, DELETE)
  ├── Joins (INNER, LEFT, RIGHT, FULL)
  ├── Indexes and query optimization basics
  ├── Transactions and ACID properties
  ├── Node.js with PostgreSQL using pg or Prisma ORM
  └── Schema design for real applications

Resources:
  - PostgreSQL tutorial: https://www.postgresqltutorial.com/
  - SQLZoo (interactive): https://sqlzoo.net/
  - Prisma ORM docs: https://www.prisma.io/docs
```

---

## Layer 6: APIs & Authentication (Weeks 10–12)

### REST APIs
```
Topics:
  ├── REST principles (stateless, uniform interface)
  ├── HTTP methods and status codes
  ├── Request/Response structure
  ├── API versioning
  ├── Pagination, filtering, sorting
  └── API documentation with Swagger/OpenAPI

Resources:
  - REST API design guide: https://restfulapi.net/
```

### Authentication & Authorization
```
Topics:
  ├── Session-based authentication
  ├── JWT (JSON Web Tokens) — how they work
  ├── OAuth 2.0 (Google login, GitHub login)
  ├── Refresh tokens and access tokens
  ├── Role-based access control (RBAC)
  ├── Password hashing with bcrypt
  └── Security: XSS, CSRF, SQL Injection prevention

Resources:
  - JWT.io (decode and understand JWTs): https://jwt.io/
  - OWASP Security Guide: https://owasp.org/www-project-top-ten/
```

---

## Layer 7: Production & Deployment (Weeks 13–14)

```
Deployment Stack:

  Local Dev
      ↓
  Git push to GitHub
      ↓
  CI/CD Pipeline (GitHub Actions)
      ↓
  Docker Image Build
      ↓
  Deploy to:
  ├── Vercel (frontend / Next.js)
  ├── Railway / Render (backend)
  └── AWS EC2 (production servers)
      ↓
  Nginx (reverse proxy)
      ↓
  PM2 (process manager)
      ↓
  Monitoring & Logging
```

### Topics Covered:
- **Linux basics** — file permissions, processes, cron jobs
- **Environment management** — .env files, secrets management
- **Docker** — Dockerfile, docker-compose, containers vs VMs
- **Nginx** — reverse proxy, SSL termination
- **PM2** — process management, restart policies
- **Vercel** — zero-config frontend deployment
- **AWS basics** — EC2, S3, IAM roles
- **CI/CD** — GitHub Actions workflow for automated testing and deployment
- **Logging** — Morgan, Winston, centralized logging concepts
- **Monitoring** — uptime monitoring, error alerting basics

---

## Skills Progression Map

```
MONTH 1                    MONTH 2                    MONTH 3
───────────────────────    ──────────────────────     ──────────────────────
JavaScript Deep Dive   →   Node.js + Express.js   →   Docker + CI/CD
React.js Fundamentals  →   MongoDB + PostgreSQL   →   AWS + Deployment
React Hooks + Patterns →   REST API Design        →   Real Projects
Next.js Intro          →   JWT Auth               →   Mock Interviews
Git & Command Line     →   Full Stack Integration →   Resume + LinkedIn
                           NestJS Intro               Job Applications
```

---

## Technology Reference Links

| Technology | Official Docs | Learning Resource |
|---|---|---|
| JavaScript | [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | [javascript.info](https://javascript.info/) |
| React.js | [react.dev](https://react.dev/) | [roadmap.sh/react](https://roadmap.sh/react) |
| Next.js | [nextjs.org/docs](https://nextjs.org/docs) | [nextjs.org/learn](https://nextjs.org/learn) |
| Node.js | [nodejs.org/docs](https://nodejs.org/en/docs/) | [roadmap.sh/nodejs](https://roadmap.sh/nodejs) |
| Express.js | [expressjs.com](https://expressjs.com/) | [MDN Express Tutorial](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs) |
| NestJS | [docs.nestjs.com](https://docs.nestjs.com/) | [NestJS Fundamentals Course](https://courses.nestjs.com/) |
| MongoDB | [mongodb.com/docs](https://www.mongodb.com/docs/) | [MongoDB University](https://university.mongodb.com/) |
| PostgreSQL | [postgresql.org/docs](https://www.postgresql.org/docs/) | [postgresqltutorial.com](https://www.postgresqltutorial.com/) |
| Docker | [docs.docker.com](https://docs.docker.com/) | [Play with Docker](https://labs.play-with-docker.com/) |
| Git | [git-scm.com](https://git-scm.com/doc) | [learngitbranching.js.org](https://learngitbranching.js.org/) |
| AWS | [aws.amazon.com/docs](https://aws.amazon.com/documentation/) | [AWS Free Tier](https://aws.amazon.com/free/) |

---

> *Next: See the detailed week-by-week curriculum → [03-phase-curriculum.md](./03-phase-curriculum.md)*
