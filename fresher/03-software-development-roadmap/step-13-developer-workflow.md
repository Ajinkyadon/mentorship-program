# Step 13: Developer Workflow
### "Industry mein ek developer ka typical day kaisa hota hai"

---

## A Day in the Life of a Junior Developer

```
9:00 AM — Arrive + check Slack/Teams messages
            → Any production issues? Any unblocking needed?

9:15 AM — Daily Standup (15 minutes)
            → Yesterday kya kiya?
            → Today kya karunga?
            → Koi blocker hai?

9:30 AM — Pick up task from Jira/Linear
            → Sprint backlog se assigned task lo
            → Requirements/acceptance criteria padhо
            → If unclear → Ask PM or Tech Lead ASAP

9:45 AM — Development begins
            → git pull origin main
            → New branch create karo
            → Code likhо

12:00 PM — Lunch

1:00 PM — Continue development
            → Code complete karo
            → Local mein test karo
            → Write/update tests

3:00 PM — Code review
            → Push karo
            → PR open karo with description
            → Someone else ka PR review karo

5:00 PM — PR feedback address karo
            → Changes karo, update push karo

6:00 PM — EOD wrap up
            → Work in progress commit karo (WIP branch)
            → Tomorrow ke liye note karo
```

---

## Tools Every Developer Uses Daily

### Code Editor — VS Code
```
Essential Extensions:
- ESLint — Code linting (errors highlight)
- Prettier — Auto formatting
- GitLens — Git history inline
- Thunder Client — API testing (built-in Postman)
- MongoDB for VS Code — DB explorer
- Error Lens — Errors inline
- Auto Rename Tag — HTML tag rename
- Path Intellisense — File path autocomplete

Keyboard Shortcuts (Must Know):
Ctrl+P / Cmd+P     → Quick file open
Ctrl+Shift+P       → Command palette
Ctrl+` / Cmd+`     → Toggle terminal
Alt+Click          → Multiple cursors
Ctrl+D             → Select next occurrence
Ctrl+/ Cmd+/       → Toggle comment
F12                → Go to definition
Alt+F12            → Peek definition
Ctrl+Shift+F       → Global search
Ctrl+B             → Toggle sidebar
F5                 → Debug start
```

### Terminal — Basic Commands
```bash
# Navigation
pwd                          # Print working directory
ls / ls -la                  # List files (with details)
cd src/controllers           # Change directory
cd ..                        # Parent directory
cd ~                         # Home directory

# Files & Folders
mkdir new-folder             # Create folder
touch file.js                # Create empty file
cp source.js dest.js         # Copy
mv old.js new.js             # Rename / move
rm file.js                   # Delete file
rm -rf folder/               # Delete folder (careful!)

# View content
cat package.json             # View file content
head -20 file.js             # First 20 lines
tail -20 file.js             # Last 20 lines
tail -f logs/app.log         # Follow log file (live)

# Search
grep -r "TODO" src/          # Recursive text search
grep -n "findById" *.js      # With line numbers
find . -name "*.test.js"     # Find files by pattern

# Process management
ps aux | grep node           # Running node processes
kill -9 PID                  # Kill process
lsof -i :3000                # What's using port 3000

# NPM shortcuts
npm i                        # npm install
npm i -D jest                # npm install --save-dev
npx jest --watch             # Run without installing
```

### Postman / Thunder Client
```
API Testing Tool — Every backend developer uses this.

Collections:
→ Organized API requests
→ Environment variables (dev, staging, prod)
→ Pre-request scripts (auto set auth tokens)
→ Test scripts (verify response)

Example collection structure:
CodeBharat API
├── Auth
│   ├── Register
│   ├── Login
│   └── Get Current User
├── Users
│   ├── Get All Users (Admin)
│   ├── Get User by ID
│   └── Update User
└── Posts
    ├── Get All Posts
    ├── Create Post
    └── Delete Post
```

---

## Development Workflow

### Feature Development — Step by Step

```bash
# 1. Latest code lo
git checkout main
git pull origin main

# 2. New branch create karo
git checkout -b feature/add-product-search

# 3. Development karo
# ... code likhо ...

# 4. Test locally
npm run dev           # Server start karo
# Postman se test karo
npm test              # Automated tests run karo

# 5. Commit karo (small, meaningful commits)
git add src/controllers/productController.js
git add src/routes/products.js
git commit -m "feat(products): add search by name and category"

git add tests/products.test.js
git commit -m "test(products): add integration tests for search endpoint"

# 6. Push karo
git push -u origin feature/add-product-search

# 7. PR create karo on GitHub
# Title: feat(products): add search by name and category
# Description: [use template from module 11]

# 8. Code review lo
# → Address feedback
# → Push updates

# 9. PR merge hone ke baad
git checkout main
git pull origin main
git branch -d feature/add-product-search  # Local branch delete karo
```

---

## Task Management — Jira/Linear

```
Ticket lifecycle:
Backlog → To Do → In Progress → In Review → Done

Ticket anatomy:
- Title: Short description
- Description: What needs to be done, why
- Acceptance Criteria: When is it "done"?
- Story Points: Estimation (1, 2, 3, 5, 8, 13)
- Assignee: Who's working on it
- Priority: P0, P1, P2, P3
- Labels: frontend, backend, bug, feature

Story Points:
1 → Very small (typo fix, minor config change)
2 → Small (simple new field, minor feature)
3 → Medium (new API endpoint with testing)
5 → Large (complex feature, multiple components)
8 → Very large (consider splitting)
13+ → Too large, definitely split
```

---

## Communication in Teams

### Slack/Teams Etiquette

```
✅ DO:
- Specific channels use karo (#backend, #bugs, #general)
- Thread mein reply karo (keep channels clean)
- @mention specifically when needed
- Code share karo in code blocks (` ` ` karo)
- Status update daily ("Working on #123, PR by EOD")

❌ DON'T:
- @channel ya @here zyada mat karo
- Important decisions DM mein karo (use channels, transparency)
- Urgent issues ko "ping" mat karo without context
- Grammar perfect nahi honi chahiye but clear hona chahiye
```

### Asking for Help (Correctly)

```
Bad: "It's not working, help?"

Good:
"Hey [name], stuck on something for 30 min.

I'm trying to [what you're trying to do].

I've tried:
1. [Approach 1] → [Result]
2. [Approach 2] → [Result]

Error: [Paste exact error]

Relevant code: [Code snippet]

Any ideas?"
```

### Status Updates

```
Daily Standup format:
Yesterday: Completed auth middleware, all tests passing. PR #45 opened.
Today: Working on password reset endpoint. Should have PR by EOD.
Blockers: None.

Slack update (end of day):
"EOD update:
✅ Auth middleware - Done, PR merged
🔄 Password reset - 70% done, continuing tomorrow
🚫 None"
```

---

## Code Conventions (Industry Standard)

### ESLint + Prettier Setup

```bash
npm install --save-dev eslint prettier eslint-config-prettier
npx eslint --init
```

```json
// .eslintrc.json
{
  "env": { "node": true, "es2022": true },
  "extends": ["eslint:recommended", "prettier"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "no-var": "error",
    "prefer-const": "error",
    "eqeqeq": "error"
  }
}
```

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

```json
// package.json scripts
{
  "scripts": {
    "lint": "eslint src/ --ext .js",
    "lint:fix": "eslint src/ --ext .js --fix",
    "format": "prettier --write src/"
  }
}
```

### Husky — Pre-commit Hooks

```bash
npm install --save-dev husky lint-staged
npx husky install
```

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.js": ["eslint --fix", "prettier --write"]
  }
}
```

**Effect:** Commit karne se pehle automatically lint + format run hota hai. Bad code commit nahi ho sakta.

---

## Testing Workflow

```bash
# Run tests
npm test                     # All tests
npm test -- --watch          # Watch mode (re-run on change)
npm test -- --coverage       # With coverage report
npm test -- auth.test.js     # Specific file

# Before PR:
npm test                     # All tests passing
npm run lint                 # No lint errors
```

```js
// Test file structure
describe('Auth Controller', () => {
  beforeAll(async () => {
    // Setup: DB connect, test data create
    await mongoose.connect(process.env.TEST_MONGODB_URI);
  });

  afterAll(async () => {
    // Teardown: DB disconnect, test data cleanup
    await User.deleteMany({ email: /test/ });
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Reset state before each test
  });

  describe('POST /auth/register', () => {
    test('registers user with valid data', async () => { ... });
    test('returns 409 for duplicate email', async () => { ... });
    test('validates required fields', async () => { ... });
  });

  describe('POST /auth/login', () => {
    test('returns JWT for valid credentials', async () => { ... });
    test('returns 401 for wrong password', async () => { ... });
  });
});
```

---

## Documentation Habits

### README.md (Minimum Standard)

```markdown
# Project Name

Brief description — what does this app do?

## Features
- User authentication (register/login/JWT)
- CRUD operations for [resource]
- File upload
- Email notifications

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt
- **Deployment:** Render

## Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

## Setup

1. Clone the repository
   git clone https://github.com/username/project

2. Install dependencies
   npm install

3. Set up environment variables
   cp .env.example .env
   # Fill in your values

4. Start development server
   npm run dev

## API Documentation
See [Postman Collection](link) or run locally and visit http://localhost:3000/api-docs

## Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | No (default: 3000) |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | JWT signing secret | Yes |

## Contributing
1. Fork the repo
2. Create feature branch
3. Commit changes
4. Open PR

## License
MIT
```

### Code Comments (Minimal but Meaningful)
```js
// Good comments — explain WHY, not WHAT
const SALT_ROUNDS = 10;  // Min recommended — balance security vs speed

// Complex regex — explain what it validates
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Simple email validation

// Non-obvious business rule
if (order.amount < 100) {
  // Orders under ₹100 exempt from platform fee per merchant agreement v2
  return 0;
}

// Workaround — explain why
// Mongoose returns lean objects — createdAt comparison fails with === 
// Using .toISOString() for reliable comparison
const isToday = doc.createdAt.toISOString().startsWith(today);
```

---

## Agile / Scrum Deep Dive

### Sprint Planning
```
Who: Whole team
When: Sprint start (Monday)
Duration: 2-4 hours

Agenda:
1. Sprint goal: "By end of sprint, users can reset passwords"
2. Backlog refinement: Tickets clear hain?
3. Estimation: Story points assign karo
4. Commitment: Team commits to sprint backlog

Outcome:
Sprint backlog (Jira board pe):
To Do:
  - [3pts] Implement forgot-password endpoint
  - [3pts] Implement reset-password endpoint
  - [2pts] Add password reset email template
  - [2pts] Frontend forgot-password form
  - [2pts] Integration tests
```

### Daily Standup
```
Who: Development team (15 min MAX)
When: Every morning (same time, same place)
Format: Each person answers 3 questions:
  1. Yesterday kya kiya?
  2. Today kya karunga?
  3. Koi blocker hai?

Rules:
✅ Stand up (keeps it short)
✅ 15 minutes max — pura team
✅ Discussions "take offline" — standup ke baad
✅ Report to team, not manager
✅ Honest blockers share karo
```

### Sprint Review
```
Who: Team + Stakeholders
When: Sprint end
Duration: 30-60 min

Agenda:
1. Sprint goal achieved?
2. Demo: "Ye feature maine banaya — ye live hai"
3. Stakeholder feedback
4. What didn't complete? Why?

Outcome: Feedback → Next sprint backlog
```

### Retrospective
```
Who: Development team only
When: After sprint review
Duration: 45-60 min

Format (Start/Stop/Continue):
Start: "Testing pe zyada time spend karein"
Stop: "Friday afternoon mein deploy karna band karein"
Continue: "Daily standups effective hain — continue"

OR (What Went Well / What Didn't / Action Items):
Well: "PR turnaround fast tha"
Didn't: "3 bugs found in production that tests missed"
Action: "Agree on coverage requirements before merge"
```

---

## Professional Development

### Learning on the Job
```
Company tech stack pe focus karo first (2-3 months)
Weekly: 1-2 hours learning new things
Monthly: Ek blog post ya internal tech talk

Where to stay updated:
- Dev.to, Medium engineering blogs
- Company engineering blogs (Netflix, Airbnb, Uber tech)
- Twitter/X — tech community
- YouTube channels (Fireship, Traversy, etc.)
- Newsletters (JavaScript Weekly, Node Weekly)
```

### Career Progression
```
Junior Developer (0-2 years):
→ Assigned tasks complete karo
→ Ask questions
→ Learn from reviews
→ Build solid fundamentals

Mid-Level (2-4 years):
→ Features own karo
→ Junior developers mentor karo
→ Architecture discussions participate karo
→ Cross-team collaboration

Senior Developer (4+ years):
→ System design lead karo
→ Team technical direction set karo
→ Complex problems solve karo
→ Engineering culture build karo
```

---

## Interview Questions — Step 13

**Q: Agile mein sprint kya hota hai?**
> Sprint ek fixed-duration iteration hai (usually 2 weeks) jisme team chhota, deliverable increment banati hai. Sprint planning se tasks decide hote hain, daily standup se progress aur blockers share hote hain, sprint review mein demo hota hai, retrospective mein process improve hota hai.

**Q: PR (Pull Request) kya hai? Kyun use karte hain?**
> PR = Formal request apni branch ko main mein merge karne ki. Code review ke liye: Team dekh sakti hai kya changes aaye, suggest kar sakti hai, approve ya reject kar sakti hai. Ensures code quality before it reaches main codebase. Required in most professional teams.

**Q: Junior developer se kya expectations hoti hain?**
> Assigned tasks time pe complete karna, clean code likhna, tests likhna, code reviews engage karna, blockers proactively communicate karna, questions poochna, company codebase jaldi samajhna. Koi expect nahi karta ki pehle din se senior jaisi kaam karo — learning attitude aur consistency important hai.

---

## Assignment — Step 13

1. VS Code setup properly karo:
   - ESLint + Prettier install aur configure karo
   - Husky pre-commit hook add karo
   - Recommend extensions install karo

2. Apne kisi project ka proper README banao — template use karo

3. Jira ya Trello board banao apne next project ke liye:
   - User stories add karo
   - Story points estimate karo
   - Sprint banao

4. Ek standup "dry run" karo:
   "Yesterday: [kya kiya]. Today: [kya karunga]. Blockers: [koi hai?]"
   30 seconds mein bolte ho?
