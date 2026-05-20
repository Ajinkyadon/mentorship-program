# 06 — Real-World Projects

> Every project is chosen because it appears in real interview discussions, uses industry patterns, and builds a story you can tell.

---

## Project Philosophy

```
❌ DON'T BUILD:           ✅ BUILD INSTEAD:
─────────────────         ──────────────────────────────
Todo App                  Task Management with team assignments
Weather App               Full-stack weather dashboard with user prefs
Calculator                Financial calculator with history & auth
Random Quote API app      Content platform with categories & user saves
```

A project is portfolio-worthy when it has:
- **Authentication** (users log in, have roles)
- **Real data** (a database, not a hardcoded array)
- **Deployed and accessible** via a public URL
- **A README** that explains what it does, how to run it, and the tech stack

---

## Project 1: Full-Stack Authentication System

**Difficulty:** Beginner-Intermediate | **Timeline:** Week 9 (2–3 days)

### What It Is
A complete user authentication system — the backbone of virtually every web application. This is the first project because everything else builds on top of it.

### Features
```
User-facing:
  ├── Register with email + password
  ├── Email verification (optional advanced feature)
  ├── Login → receives JWT access token
  ├── Token auto-refresh using refresh tokens
  ├── Protected dashboard page
  ├── Logout (invalidates refresh token)
  └── Forgot password flow (email link)

Admin-facing:
  ├── View all users
  ├── Ban/unban users
  └── Role assignment
```

### Tech Stack
```
Frontend:   Next.js + Tailwind CSS
Backend:    Node.js + Express
Database:   MongoDB + Mongoose
Auth:       JWT (access + refresh tokens), bcrypt
Deploy:     Frontend → Vercel, Backend → Railway
```

### Key Learning Outcomes
- Refresh token rotation (security best practice)
- httpOnly cookie vs localStorage for token storage
- RBAC (role-based access control)
- Protecting both frontend routes and backend endpoints

### Architecture Diagram
```
Browser
  │
  ├──POST /auth/register──────────────► Express API
  │                                         │
  ├──POST /auth/login ────────────────►     │
  │◄──JWT access token (15 min TTL)──       │
  │◄──Refresh token (httpOnly cookie)       │
  │                                         │
  ├──GET /dashboard (with Bearer token)──►  │
  │    Middleware verifies JWT              │
  │    Attaches user to request             │
  │◄── Dashboard data ──────────────────    │
  │                                         │
  ├──POST /auth/refresh ──────────────►     │
  │    Refresh token in cookie              │
  │◄── New access token ────────────────    │
  │                                     MongoDB
  └──────────────────────────────────  Users Collection
```

### GitHub Repository Structure
```
auth-system/
├── client/               (Next.js app)
│   ├── app/
│   │   ├── page.tsx      (Landing)
│   │   ├── login/
│   │   ├── register/
│   │   └── dashboard/
│   └── lib/
│       └── api.ts        (API call helpers)
├── server/               (Express app)
│   ├── src/
│   │   ├── routes/
│   │   │   └── auth.routes.js
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   └── User.model.js
│   │   └── index.js
│   └── .env.example
└── README.md
```

---

## Project 2: Job Portal

**Difficulty:** Intermediate | **Timeline:** Week 10 (full week)

### What It Is
A real-world job listing platform with three distinct user types. This project demonstrates multi-role architecture, complex queries, and file handling.

### Features
```
Job Seeker:
  ├── Browse job listings (with search, filter, pagination)
  ├── View job details
  ├── Apply to jobs (upload resume as PDF)
  ├── Track application status (Applied → Reviewed → Shortlisted → Rejected)
  └── Save jobs to watchlist

Employer:
  ├── Post job listings
  ├── Edit/close job listings
  ├── View all applications for their jobs
  ├── Change application status
  └── View applicant resumes

Admin:
  ├── Approve/reject job postings
  ├── Manage users
  └── View platform analytics
```

### Tech Stack
```
Frontend:   React.js + React Router + Tailwind CSS
Backend:    Node.js + Express.js
Database:   MongoDB (jobs, users, applications)
File Upload: Multer + Cloudinary (resume PDFs)
Email:      Nodemailer (application notifications)
Deploy:     Frontend → Vercel, Backend → Railway
```

### Database Schema
```javascript
// User Schema
{
  _id, name, email, password (hashed),
  role: 'jobseeker' | 'employer' | 'admin',
  profile: { bio, skills, experience, resumeUrl },
  createdAt
}

// Job Schema
{
  _id, title, description, company,
  location, salary: { min, max },
  skills: [String],
  type: 'full-time' | 'part-time' | 'contract',
  status: 'open' | 'closed' | 'draft',
  postedBy: userId,
  createdAt
}

// Application Schema
{
  _id, jobId, applicantId,
  status: 'applied' | 'reviewed' | 'shortlisted' | 'rejected',
  coverLetter, resumeUrl,
  appliedAt, updatedAt
}
```

### Interview Story for This Project
> "I built a job portal with three user roles: employers, job seekers, and admins. The biggest challenge was the authorization layer — making sure an employer could only see applications for their own jobs, not for others. I solved this by adding an ownership check in the application controller that cross-references the job's postedBy field with the authenticated user's ID."

---

## Project 3: E-commerce Platform

**Difficulty:** Intermediate-Advanced | **Timeline:** Week 10 alternative (full week)

### Features
```
Customer:
  ├── Product catalog with categories and search
  ├── Product detail with images
  ├── Shopping cart (persisted to MongoDB)
  ├── Checkout flow
  ├── Stripe payment integration (test mode)
  ├── Order history and tracking
  └── Product reviews

Admin:
  ├── Dashboard with revenue/order analytics
  ├── Manage products (CRUD + image upload)
  ├── Manage orders (update fulfillment status)
  └── Manage users
```

### Tech Stack
```
Frontend:   Next.js + Tailwind CSS
State:      Zustand (cart state)
Backend:    Node.js + Express
Payment:    Stripe API
Database:   MongoDB
Images:     Cloudinary
Deploy:     Vercel (frontend) + Railway (backend)
```

---

## Project 4: Real-Time Chat Application

**Difficulty:** Intermediate-Advanced | **Best for:** After program (bonus project)

### What It Is
A WhatsApp/Slack-like chat application with real-time messaging using WebSockets.

### Features
```
├── One-to-one and group chats
├── Real-time message delivery (Socket.IO)
├── Online/offline status
├── Message read receipts
├── File sharing
└── Notification system
```

### Key New Technology
```
Socket.IO — WebSockets library that enables:
  - Real-time bidirectional communication
  - Rooms (group chats)
  - Events (join, message, typing, disconnect)
  
Resources:
  - Socket.IO docs: https://socket.io/docs/v4/
```

---

## Project 5: Admin Dashboard

**Difficulty:** Intermediate | **Best for:** Demonstrating frontend skills

### What It Is
A data analytics dashboard — the kind of internal tool companies build to monitor their products. Great for showing charting, data visualization, and complex UI.

### Features
```
├── KPI summary cards (users, revenue, orders)
├── Line/bar charts (recharts or chart.js)
├── Data tables with sorting, filtering, pagination
├── User management (CRUD)
├── Dark/light theme
└── Responsive design
```

### Why This Is Interview Gold
- Shows you can build the internal tools companies actually use
- Demonstrates data handling (sorting, filtering, pagination)
- No-nonsense UI work that product companies value

---

## Project 6: API Gateway / Microservices Intro

**Difficulty:** Advanced | **Best for:** Senior role targeting (post-program)

### What It Is
A simplified microservices architecture where multiple Node.js services communicate with each other through an API gateway.

### Architecture
```
Client
  │
  ▼
API Gateway (Express)
  │
  ├──►  Auth Service (port 3001)
  ├──►  User Service (port 3002)
  └──►  Product Service (port 3003)
        │
        ▼
   Each service has its own database
```

### Why Learn This
- NestJS is built for this architecture
- Product companies use microservices at scale
- Understanding this makes you stand out in interviews
- Shows you can think about system boundaries

---

## Project Showcase Template

For every project on your GitHub and LinkedIn:

```markdown
## [Project Name]

**Live Demo:** [link] | **GitHub:** [link]

### What it does
[1-2 sentence plain English description]

### Tech Stack
Frontend: [list] | Backend: [list] | Database: [list]

### Key Features
- [Feature 1]
- [Feature 2]
- [Feature 3]

### Challenges Solved
[1 paragraph about the hardest technical problem you solved]

### What I'd improve
[1-2 things you'd do differently — shows maturity]
```

---

## Projects by Skill Demonstrated

| Project | Authentication | RBAC | File Upload | Real-time | Payments | Deployment |
|---|---|---|---|---|---|---|
| Auth System | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Job Portal | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| E-commerce | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Chat App | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ |
| Admin Dashboard | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |

**Recommendation:** Build Project 1 (Auth) + Project 2 or 3 (Portal/E-commerce) during the program. Add more after you start job hunting.

---

> *Next: Deployment & Production → [07-deployment-production.md](./07-deployment-production.md)*
