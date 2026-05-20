# Step 07: Version Control — Git & GitHub
### "Code ka time machine — aur team ka backbone"

---

## Why Git?

```
Bina Git ke:
main_v1.js
main_v2.js
main_final.js
main_FINAL_v2.js
main_FINAL_v2_REAL.js  ← 😭

Team mein:
→ Rahul ne file bheja email pe
→ Priya ne changes kiye
→ Amit ne doosra version bheja
→ Sabka kaam alag jagah — merge kaise karein?

Git ke saath:
→ Sab changes tracked hain
→ Kisi bhi purane version pe wapas ja sakte hain
→ Team ek saath kaam kar sakti hai — conflicts resolve hote hain
→ Koi bhi change kaun ne kiya, kab kiya — sab visible
```

---

## Git Concepts

```
Repository (Repo): Project ka Git database — saari history yahan
Working Directory: Actual files jo tum edit karte ho
Staging Area (Index): Commit ke liye marked changes
Commit: Saved snapshot of staged changes
Branch: Parallel development line
Remote: Server pe hosted repo (GitHub)
Clone: Remote repo ko local download karna
Fork: Doosre ki repo ki apni copy banana
```

### Three States of a File
```
Untracked   → Git jaanta hi nahi hai ye file
Modified    → Git jaanta hai, change hua hai, staged nahi
Staged      → Next commit mein jaayega
Committed   → Safely saved in Git database
```

---

## Initial Setup

```bash
# Git install check
git --version

# Identity setup (ek baar karo)
git config --global user.name "Rahul Kumar"
git config --global user.email "rahul@example.com"

# Default branch name set karo
git config --global init.defaultBranch main

# Default editor (VS Code)
git config --global core.editor "code --wait"

# Config dekho
git config --list
```

---

## Daily Git Commands

### Starting a Project

```bash
# New project shuru karo
mkdir my-project && cd my-project
git init                  # .git folder create hota hai

# Existing GitHub repo clone karo
git clone https://github.com/username/repo-name.git
git clone https://github.com/username/repo.git my-folder  # Custom folder name
```

### Basic Workflow
```bash
# Status check karo (most used command)
git status

# Files stage karo
git add index.js                  # Specific file
git add src/                      # Folder ke sab files
git add .                         # Sab changes stage karo (careful!)
git add -p                        # Interactive — chunk by chunk

# Commit karo
git commit -m "feat: add user registration endpoint"

# Staged + unstaged changes dekho
git diff                          # Unstaged changes
git diff --staged                 # Staged changes (before commit)

# History dekho
git log                           # Full log
git log --oneline                 # Compact one-liner per commit
git log --oneline --graph         # Branch graph
git log -5                        # Last 5 commits
git log --author="Rahul"          # Specific author
git log src/controllers/          # Specific folder
```

### Working with Remote
```bash
# Remote add karo
git remote add origin https://github.com/username/repo.git

# Remote dekho
git remote -v

# Push karo
git push origin main              # main branch push
git push -u origin main           # -u = set upstream (aage sirf git push)
git push                          # After -u is set

# Pull karo (fetch + merge)
git pull origin main
git pull                          # After upstream set

# Fetch (merge nahi karta, sirf download)
git fetch origin
git fetch --all                   # All remotes
```

---

## Branching — Most Important Concept

```bash
# Branches dekho
git branch                        # Local branches
git branch -r                     # Remote branches
git branch -a                     # All branches

# Branch create karo
git branch feature/user-auth

# Branch switch karo
git checkout feature/user-auth    # Old way
git switch feature/user-auth      # New way (recommended)

# Create + switch (one command)
git checkout -b feature/payment-integration
git switch -c feature/payment-integration  # New way

# Branch delete karo
git branch -d feature/old-feature    # Safe delete (merged only)
git branch -D feature/force-delete   # Force delete

# Remote branch delete
git push origin --delete feature/old-feature
```

### Branch Naming Convention
```
feature/user-authentication         → New features
feature/add-product-search
bugfix/login-null-pointer-error     → Bug fixes
bugfix/cart-total-calculation
hotfix/production-crash-on-logout   → Critical production fixes
refactor/extract-auth-middleware    → Code restructuring
docs/update-api-documentation       → Documentation
test/add-auth-unit-tests            → Test additions
chore/upgrade-dependencies          → Maintenance
```

### Merging
```bash
# feature branch ko main mein merge karo
git switch main
git pull origin main           # Latest main lo pehle
git merge feature/user-auth    # Merge karo

# Fast-forward merge (clean history)
git merge --ff-only feature/branch

# No-fast-forward (merge commit create hoga)
git merge --no-ff feature/branch

# Delete merged branch
git branch -d feature/user-auth
```

### Rebase (Clean History)
```bash
# Feature branch ko main ke latest pe rebase karo
git switch feature/my-feature
git rebase main

# Interactive rebase (commits organize karo)
git rebase -i HEAD~3    # Last 3 commits interactive
# Options: pick, squash, reword, edit, drop
```

**Merge vs Rebase:**
```
Merge: Saari history preserve hoti hai — non-destructive
Rebase: Linear history — cleaner log, history rewrites

Rule: Public branches (main) pe rebase mat karo — sirf local branches pe
```

---

## Commit Messages (Conventional Commits)

```
Format:
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
```
feat:     New feature
fix:      Bug fix
docs:     Documentation only
style:    Formatting (whitespace, semicolons — no logic change)
refactor: Code restructure (no bug fix, no feature)
test:     Add or update tests
chore:    Tooling, dependencies, build changes
perf:     Performance improvement
ci:       CI/CD changes
revert:   Revert a commit
```

**Good commit messages:**
```bash
# Good
git commit -m "feat(auth): add JWT refresh token rotation"
git commit -m "fix(cart): resolve incorrect total on item removal"
git commit -m "docs: update README with deployment instructions"
git commit -m "test(user): add unit tests for password validation"

# Bad
git commit -m "fix"
git commit -m "changes"
git commit -m "working now"
git commit -m "update code"
git commit -m "asdf"
```

**Multi-line commit:**
```bash
git commit -m "feat(auth): implement Google OAuth login

Added Google OAuth2 strategy using passport-google-oauth20.
Users can now sign in with their Google account.
If email already exists, accounts are merged.

Closes #123"
```

---

## .gitignore

**Jo files track nahi karni unhe yahan list karo.**

```gitignore
# Dependencies
node_modules/
.npm

# Environment
.env
.env.local
.env.production

# Build output
dist/
build/
.next/

# Logs
logs/
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp

# Uploads (user-generated content — don't commit)
uploads/*
!uploads/.gitkeep   # Keep empty folder

# Testing
coverage/
.nyc_output/
```

---

## Undoing Things

```bash
# Staged changes unstage karo (index se hato, file nahi change hogi)
git restore --staged index.js
git reset HEAD index.js   # Old way

# Working directory changes discard karo (CAREFUL — permanent!)
git restore index.js
git checkout -- index.js  # Old way

# Last commit undo karo (changes reh jaate hain)
git reset --soft HEAD~1   # Staged rehta hai
git reset HEAD~1           # Unstaged rehta hai (mixed — default)
git reset --hard HEAD~1   # Changes bhi gone (DANGEROUS — permanent!)

# Specific commit undo karo (public history ke liye)
git revert abc123          # New commit banata hai jo changes undo karta hai

# Wrong file committed?
git rm --cached .env       # Untrack karo (file reh jaayegi)
git commit -m "chore: remove accidentally committed .env"

# Commit message change karo (only if not pushed!)
git commit --amend -m "feat: correct commit message"

# Last commit mein file add karo (not pushed)
git add forgotten-file.js
git commit --amend --no-edit
```

---

## Merge Conflicts

**Conflict = Same file same area pe dono branches ne alag changes kiye.**

```
<<<<<<< HEAD (current branch)
const port = 3000;
=======
const port = process.env.PORT || 8080;
>>>>>>> feature/config-ports

Tumhe decide karna hai kaunsa rakhen:
→ Current (HEAD)
→ Incoming (feature branch)
→ Ya dono combine karein

After resolving:
git add .
git commit -m "resolve merge conflict in config"
```

**VS Code mein:** Accept Current / Accept Incoming / Accept Both buttons dikhte hain.

```bash
# Conflict tools
git mergetool          # External merge tool open karo

# Conflict abort karo (fresh start)
git merge --abort
git rebase --abort
```

---

## GitHub — Remote Repository

### Pull Requests (PRs)

**PR = Formal request to merge your branch into main.**

```
1. Feature branch pe kaam karo
2. Push karo GitHub pe
3. GitHub pe "Compare & Pull Request" click karo
4. Title + description likho
5. Reviewers assign karo
6. Code review → changes karo if needed
7. Approved → Merge!
```

**Good PR Description:**
```markdown
## What does this PR do?
Adds complete user authentication — register, login, logout, password change.

## Changes Made
- POST /auth/register — validates input, hashes password, returns JWT
- POST /auth/login — verifies credentials, returns JWT
- POST /auth/logout — clears auth cookie
- POST /auth/change-password — verifies old password, sets new
- authenticate middleware — protects routes

## Testing
- [ ] Register with valid data
- [ ] Register with existing email → 409
- [ ] Login with wrong password → 401
- [ ] Access protected route without token → 401
- [ ] All unit tests passing

## Related Issue
Closes #15
```

### GitHub Actions (Basic CI)
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test
        env:
          NODE_ENV: test
          MONGODB_URI: ${{ secrets.TEST_MONGODB_URI }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

---

## Git Flow (Team Workflow)

```
main         → Production code. Direct push allowed sirf admins ko.
develop      → Integration branch. Features merge yahan.
feature/*    → New features. develop se branch out.
bugfix/*     → Bug fixes for develop.
hotfix/*     → Critical production bugs. main se branch out, main + develop dono mein merge.
release/*    → Release preparation. develop se branch out.
```

**Simple GitHub Flow (smaller teams):**
```
main         → Always deployable
feature/*    → Branch from main, PR back to main
hotfix/*     → Same as feature but urgent
```

---

## Useful Git Commands (Advanced)

```bash
# Stash (changes temporarily save karo)
git stash                         # Changes stash karo
git stash push -m "WIP: payment"  # With message
git stash list                    # Stashed items dekho
git stash pop                     # Latest stash apply + delete
git stash apply stash@{1}         # Specific stash apply (keep)

# Cherry-pick (specific commits kisi branch se lao)
git cherry-pick abc123

# Bisect (bug dhundho binary search se)
git bisect start
git bisect bad                    # Current commit = bad
git bisect good abc123            # Last known good commit
# Git tumhe commits dikhata rahe ga — good ya bad batao
# Git automatically bug commit dhundh deta hai

# Blame (kaun si line kisne likhi?)
git blame src/auth.js
git blame -L 50,75 src/auth.js    # Lines 50-75 only

# Reflog (lost commits recover karo)
git reflog                        # All HEAD movements
git reset --hard HEAD@{3}         # 3 steps pehle wali state

# Search
git log -S "password"             # Commits jisme "password" add/remove hua
git log --grep="bug"              # Commits whose message has "bug"
```

---

## Interview Questions — Step 07

**Q: Git aur GitHub mein kya fark hai?**
> Git ek distributed version control system hai — local tool. GitHub ek remote hosting service hai Git repositories ke liye. Git bina internet ke kaam karta hai, GitHub internet pe stored remote repository hai jisse teams collaborate karti hain.

**Q: `git merge` aur `git rebase` mein kya fark hai?**
> Merge: Non-destructive — history preserve hoti hai, merge commit ban sakta hai. Rebase: History rewrite hoti hai — linear, cleaner log. Rule: Public pushed branches pe rebase mat karo — sirf local/personal branches pe safe hai.

**Q: `git pull` aur `git fetch` mein kya fark hai?**
> Fetch: Remote se changes download karta hai but merge nahi karta. Pull: Fetch + merge — ek hi step mein. Safe workflow: `git fetch` phir differences dekho phir `git merge`.

**Q: Merge conflict kaise resolve karte hain?**
> Conflict markers `<<<<<<<`, `=======`, `>>>>>>>` dhundho. Decide karo kaunsa code rakhen. Markers remove karo. `git add` se mark karo resolved. `git commit` se complete karo.

---

## Assignment — Step 07

1. GitHub pe ek repo banao:
   - `main` branch mein README
   - `feature/user-auth` branch mein auth code
   - PR create karo (description ke saath)

2. Deliberately merge conflict create karo:
   - Dono branches mein same file different jagah edit karo
   - Merge karo → conflict resolve karo

3. `.gitignore` properly setup karo apne Node project mein

4. GitHub Actions CI add karo jo har PR pe `npm test` run kare
