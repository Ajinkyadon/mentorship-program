# Module 11: Industry Preparation
### "College aur company mein bahut fark hai — pehle se jaano"

---

## How Software Teams Work

Ek real software company mein team kuch aisi hoti hai:

```
Product Manager (PM)
  → Decides what to build and why
  → Works with business + users

Designer (UI/UX)
  → How it should look and feel
  → Wireframes, prototypes

Frontend Developer
  → UI implement karta hai

Backend Developer
  → APIs, database, business logic

Full Stack Developer
  → Frontend + Backend dono

DevOps / SRE
  → Servers, deployment, monitoring

QA Engineer
  → Testing — manual + automated

Tech Lead / Senior Developer
  → Architecture decisions, code review
  → Mentors juniors
```

As a fresher, tumse expect hoga:
- Assigned tasks complete karna
- Clean code likhna
- Tests likhna
- Code review participate karna
- Blockers proactively communicate karna

---

## Git Workflow in Industry

**Personal project:** Main branch pe direct push — okay.  
**Industry:** Never. Branches + PRs mandatory.

### Feature Branch Workflow

```bash
# Daily start
git pull origin main              # latest changes lo

# Naya feature start
git checkout -b feature/user-auth

# Work karo
git add src/controllers/auth.js
git commit -m "feat: add JWT login endpoint"
git commit -m "feat: add register endpoint with bcrypt"

# Push karo
git push origin feature/user-auth

# GitHub pe PR open karo → Code review → Merge
```

### Branch Naming Conventions
```
feature/user-authentication
bugfix/login-null-pointer
hotfix/prod-crash-on-logout
refactor/auth-middleware
docs/update-api-documentation
test/auth-unit-tests
```

### Commit Message Standard (Conventional Commits)
```
feat:     New feature
fix:      Bug fix
docs:     Documentation only
style:    Formatting (no logic change)
refactor: Code restructure (no logic change)
test:     Add or update tests
chore:    Tooling, configs, dependencies

feat(auth): add Google OAuth login
fix(api): handle null user in profile endpoint
test(auth): add unit tests for JWT verification
```

---

## Pull Requests (PRs)

**PR = Formal request to merge your branch into main.**

### Good PR Description
```markdown
## What does this PR do?
Adds JWT-based authentication — register and login endpoints.

## Changes
- POST /auth/register — validates input, hashes password, returns token
- POST /auth/login — verifies credentials, returns token
- auth middleware — verifies token on protected routes

## Testing
- [ ] Register with valid data
- [ ] Register with duplicate email (should return 409)
- [ ] Login with correct credentials
- [ ] Login with wrong password (should return 401)
- [ ] Accessing protected route without token (should return 401)

## Screenshots (if UI change)
[Add screenshots]
```

---

## Code Review

**As the author (your code being reviewed):**
```
✅ Don't take it personally — it's about the code, not you
✅ Respond to all comments (even if just "Fixed!")
✅ Ask if you don't understand a suggestion
✅ Learn from each review
```

**As the reviewer (reviewing someone's code):**
```
✅ Be respectful — suggest, don't demand
✅ Ask questions: "What's the reason for this approach?"
✅ Explain your suggestions: "This could be simplified using..."
✅ Acknowledge good code too
```

### Common Code Review Feedback
```
"Nit: " → Minor suggestion, not required
"Consider: " → Alternative approach
"Fix: " → This needs to change
"Question: " → Asking for clarification
```

---

## Agile / Scrum Process

Most companies follow Agile with 2-week sprints.

### Sprint Cycle
```
Sprint Planning (Monday, start of sprint)
  → Team decides what to build this sprint
  → Tasks estimated in story points
  → Each developer picks up tasks

Daily Standup (15 min, every morning)
  → What did I do yesterday?
  → What will I do today?
  → Any blockers?

Sprint Review / Demo (last day of sprint)
  → Show what was built to stakeholders

Sprint Retrospective (after review)
  → What went well?
  → What could be better?
  → Action items
```

### Common Tools
| Purpose | Tools |
|---------|-------|
| Project management | Jira, Linear, Trello, GitHub Issues |
| Communication | Slack, Microsoft Teams |
| Code hosting | GitHub, GitLab, Bitbucket |
| CI/CD | GitHub Actions, Jenkins, CircleCI |
| Monitoring | Datadog, New Relic, Sentry |
| Documentation | Confluence, Notion, GitHub Wiki |

---

## Production Deployment

**Development → Staging → Production**

```
Development (local):
  → Developer ka machine
  → Mock data, debug logs on

Staging:
  → Production jaisi environment
  → Real testing, QA here
  → Same config as production

Production:
  → Live — real users use it
  → Zero tolerance for downtime
  → Debug logs off
  → Monitor everything
```

### What Happens When You Push to Main
```
1. Git push → GitHub
2. GitHub Actions (CI) triggers:
   → npm install
   → Run tests
   → Build check
   → Lint check
3. If all pass → Deploy to staging
4. QA tests on staging
5. Manual approval
6. Deploy to production
7. Monitor for errors (Sentry, Datadog)
```

---

## Bug Fixing in Production

**Production bug = serious. Calm rehna + systematic approach.**

```
Step 1: Reproduce karo
  → Log mein error dhundho
  → Stack trace padhо

Step 2: Impact assess karo
  → Kitne users affected?
  → Kitna critical?

Step 3: Hotfix branch banao
  → git checkout -b hotfix/user-login-crash

Step 4: Fix karo
  → Targeted fix — only the bug
  → No refactoring in hotfix

Step 5: Test karo
  → Specifically the bug scenario
  → Regression test (kuch aur toot toh nahi gaya?)

Step 6: Deploy
  → Production pe directly ja sakta hai (critical hotfix)
  → Or staging first → production

Step 7: Monitor karo
  → Next 30 min monitor karo ki fix kaam kar raha hai
  → Postmortem likho agar major incident tha
```

---

## Environment Variables & Secrets

**Production mein NEVER hardcode credentials.**

```
# Local: .env file
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=local_dev_secret
NODE_ENV=development

# Production: Platform environment variables
MONGODB_URI=mongodb+srv://prod-cluster...
JWT_SECRET=[256-char random string]
NODE_ENV=production
```

**Rule:** `git log --all --full-history -- .env` should return nothing. .env should never have been committed even once.

---

## Monitoring & Observability

**Production mein kya ho raha hai jaanna padta hai.**

### Sentry (Error Tracking)
```bash
npm install @sentry/node
```

```js
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });

// Express error handler
app.use(Sentry.Handlers.errorHandler());
```

### What to Monitor
```
Errors: Unhandled exceptions, API errors
Performance: Response time, slow queries
Availability: Is the server up?
Business metrics: Signups, purchases, engagement
```

---

## Documentation Culture

**Good teams document — it saves everyone's time.**

```
API Documentation: Swagger/Postman Collection
  → Every endpoint documented
  → Request/response examples
  → Error responses

README:
  → How to run the project
  → Environment variables
  → Architecture overview
  → How to contribute

Code Comments (minimal but meaningful):
  → Why, not what
  → Non-obvious business rules
  → Known workarounds
```

---

## Things Freshers Often Don't Know (But Should)

```
1. Never force push to main
   → Destroys team's history

2. Always create a new branch for features
   → Even tiny changes

3. Don't commit node_modules
   → npm install is enough

4. .env should be in .gitignore from day 1
   → Can't undo a leaked secret easily

5. Test before PR
   → "It works on my machine" is not enough

6. Ask for help after 30 min of being stuck
   → Senior devs want to help, not see you suffer

7. Communicate blockers early
   → "Main kal tak khatam kar lunga" → can't → team blocked

8. Read the PR description before reviewing
   → Context important hai

9. Your first week: observe, ask questions, don't assume
   → Every company has different conventions

10. Standup = what you're doing, not a status report on every detail
    → 15 min max, blockers highlight karo
```

---

## Assignment — Module 11

1. Apne kisi project pe git branching workflow practice karo:
   - `main` branch create karo
   - `feature/user-auth` branch mein auth implement karo
   - PR description likho (pretend) using the template above

2. GitHub Actions basic workflow create karo (lint + test on every push)

3. Ek "incident report" style write-up karo for a bug you've faced:
   - What happened
   - How you found it
   - How you fixed it
   - How to prevent it
