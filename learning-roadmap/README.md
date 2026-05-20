# Learning Roadmap — Detailed Guide

> Yeh folder hai tumhara **complete learning guide** — har topic ko detail mein explain kiya gaya hai,
> real code examples ke saath, aur Hinglish mein samjhaya gaya hai taaki confusion na ho.

---

## Kaise Use Karein Yeh Documents?

```
Step 1: Pehle concept explanation padho (theory — 10 min)
Step 2: Code example dekho aur samjho (15 min)
Step 3: Khud se usi code ko type karo — copy-paste mat karo (20 min)
Step 4: Code mein thoda change karo aur dekho kya hota hai (15 min)
Step 5: Assignment try karo (30-60 min)
```

> **Golden Rule:** Agar code samajh nahi aaya, toh ek aur baar padho.
> Agar phir bhi nahi aaya, toh mentor ko pucho — **sharmao mat.**

---

## Complete Documents Index

### Common (Sabke Liye Zaroori)

| # | Document | Topics |
|---|---|---|
| 00 | [Command Line & Git](./00-command-line-git.md) | Terminal, SSH, Git workflow, PRs, merge conflicts, GitHub profile |
| 01 | [JavaScript Foundations](./01-javascript-foundations.md) | Variables, Scope, Hoisting, Closures, `this`, Prototypes, HOFs, Destructuring |
| 02 | [JavaScript Async](./02-javascript-async.md) | Event Loop, Callbacks, Promises, Async/Await, Promise.all |
| 11 | [TypeScript Basics](./11-typescript-basics.md) | Types, Interfaces, Generics, Utility Types, TS with React & Express |
| 12 | [Testing Basics](./12-testing-basics.md) | Jest, React Testing Library, Supertest, TDD, Code Coverage |
| 15 | [Debugging & DevTools](./15-debugging-devtools.md) | Browser DevTools, VS Code Debugger, React DevTools, Production Debugging |

### Frontend

| # | Document | Topics |
|---|---|---|
| 03 | [React Fundamentals](./03-react-fundamentals.md) | Components, Props, State, JSX, useState, useEffect, React Router |
| 04 | [React Advanced](./04-react-advanced.md) | useRef, useMemo, useCallback, Context API, Redux Toolkit, Zustand, Custom Hooks |
| 10 | [Next.js](./10-nextjs.md) | App Router, SSR/SSG/ISR, Server Components, API Routes, NextAuth, Vercel |
| 14 | [State Management Deep Dive](./14-state-management-deep.md) | Context+Reducer, Redux Toolkit, Zustand, React Query, Decision Tree |

### Backend

| # | Document | Topics |
|---|---|---|
| 05 | [Node.js Fundamentals](./05-nodejs-fundamentals.md) | Runtime, fs, path, http, EventEmitter, npm, dotenv |
| 06 | [Express.js & REST API](./06-expressjs-rest-api.md) | Routing, Middleware, CRUD, Pagination, MVC Pattern, Error Handling |
| 07 | [MongoDB & Mongoose](./07-mongodb-mongoose.md) | NoSQL, Schema, CRUD, Populate, Aggregation, Transactions, Indexes |
| 08 | [SQL & PostgreSQL](./08-sql-postgresql.md) | Relational Model, Joins, Aggregates, Transactions, pg library, Prisma ORM |
| 09 | [Authentication & JWT](./09-authentication-jwt.md) | bcrypt, JWT, Access+Refresh Tokens, Complete Auth System, Security |
| 13 | [NestJS Intro](./13-nestjs-intro.md) | Architecture, Controllers, Services, Guards, DTOs, TypeORM, Complete API |

---

## Learning Path by Goal

### "Mujhe Frontend Developer banna hai"
```
00 → 01 → 02 → 03 → 04 → 10 → 14 → 11 → 12 → 15
```

### "Mujhe Backend Developer banna hai"
```
00 → 01 → 02 → 05 → 06 → 07 → 08 → 09 → 13 → 11 → 12 → 15
```

### "Mujhe Full Stack Developer banna hai"
```
00 → 01 → 02 → 03 → 04 → 05 → 06 → 07 → 09 → 10 → 08 → 13 → 14 → 11 → 12 → 15
```

---

## Topic Coverage Map

```
COMMON SKILLS
  ├── Terminal & Git .................. 00-command-line-git.md
  ├── JavaScript Deep Concepts ........ 01-javascript-foundations.md
  ├── Async JavaScript ................ 02-javascript-async.md
  ├── TypeScript ...................... 11-typescript-basics.md
  ├── Testing ......................... 12-testing-basics.md
  └── Debugging ....................... 15-debugging-devtools.md

FRONTEND
  ├── React Fundamentals .............. 03-react-fundamentals.md
  ├── React Advanced + Hooks .......... 04-react-advanced.md
  ├── State Management ................ 14-state-management-deep.md
  └── Next.js ......................... 10-nextjs.md

BACKEND
  ├── Node.js ......................... 05-nodejs-fundamentals.md
  ├── Express.js + REST APIs .......... 06-expressjs-rest-api.md
  ├── MongoDB + Mongoose .............. 07-mongodb-mongoose.md
  ├── SQL + PostgreSQL + Prisma ....... 08-sql-postgresql.md
  ├── Authentication + JWT ............ 09-authentication-jwt.md
  └── NestJS .......................... 13-nestjs-intro.md
```

---

## What Every Document Contains

Every document follows the same structure:

```
1. Analogy in Hinglish        — Real life se concept samjho
2. Concept Explanation        — Theory, clear aur short
3. Code Examples              — Hinglish comments ke saath
4. Common Mistakes            — Kya nahi karna
5. Interview Q&A              — Exactly kya bolna hai
6. Assignment                 — Practice tasks for GitHub
```
