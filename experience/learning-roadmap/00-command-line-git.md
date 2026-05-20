# Command Line & Git — Full-Stack Mentorship Program
### Module 00 — Working Professionals ke liye

---

## 1. Terminal Kyon Use Karte Hain? (Why Developers Use Terminal)

### Real-Life Analogy
Socho ek restaurant kitchen hai. **GUI** (Graphical UI) ek waiter jaisi hai — slow hai, limited options deta hai, aur sirf jo menu mein hai wahi order kar sakti hai. **Terminal** seedha chef se baat karna hai — kuch bhi bol sakte ho, instantly hoga, aur full control tumhare haath mein hai.

### Practical Reasons:
- **Speed** — Mouse se folders navigate karna vs terminal mein `cd project/src/components` — ek second
- **Automation** — 1000 files rename karna? Terminal mein ek command, GUI mein ek ghanta
- **Remote Servers** — AWS/GCP pe koi GUI nahi hota — sirf terminal
- **Developer Tools** — npm, git, docker — sab terminal-based hain
- **Repeatability** — Scripts likhke koi bhi kaam automate kar sakte ho

> **Pro Tip:** Pehle 2 hafte uncomfortable lagega. 2 mahine baad GUI slow lagega.

---

## 2. Essential Commands — Ek Ek Karke Samjho

### Navigation Commands

```bash
# pwd — Print Working Directory (main kahan hoon?)
pwd
# Output: /Users/ajinkya/projects

# ls — List files (yahan kya kya hai?)
ls
ls -l          # detailed view — permissions, size, date
ls -la         # hidden files bhi dikhao (.env, .git)
ls -lh         # human-readable sizes (KB, MB instead of bytes)

# cd — Change Directory (folder mein jaao)
cd projects              # projects folder mein jao
cd ..                    # ek folder upar jao
cd ../..                 # do folders upar jao
cd ~                     # home directory pe jao
cd -                     # pichle directory pe wapas jao (bahut useful!)
cd "/Users/ajinkya/My Projects"  # spaces wale path mein quotes lagao
```

### File & Folder Operations

```bash
# mkdir — Make Directory (naya folder banao)
mkdir my-project
mkdir -p projects/backend/src/controllers  # nested folders ek saath banao

# touch — File banao (ya last modified time update karo)
touch index.js
touch .env README.md package.json   # multiple files ek saath

# cp — Copy (copy karo)
cp file.txt file-backup.txt          # file copy
cp -r src/ src-backup/               # folder copy (-r = recursive)
cp *.js backup/                      # sab .js files copy karo

# mv — Move ya Rename (move ya rename karo)
mv old-name.js new-name.js           # rename
mv file.txt /another/folder/         # move
mv *.log logs/                       # sab log files move karo

# rm — Remove (delete karo — CAREFUL! Recycle bin nahi hoti)
rm file.txt                          # file delete
rm -r folder/                        # folder delete (-r = recursive)
rm -rf node_modules/                 # force delete (no confirmation)
rm -i *.txt                          # interactive — har file pe confirm karega

# cat — File ka content dikhao
cat package.json
cat .env                             # environment variables dekho
cat file1.txt file2.txt              # multiple files ek saath

# nano — Terminal text editor (beginner-friendly)
nano server.js                       # file open karo
# Ctrl+O = Save, Ctrl+X = Exit, Ctrl+W = Search

# Powerful editors (seekhne mein time lagta hai, worth it hai)
vim server.js       # vim — ubiquitous, fast
code server.js      # VS Code mein kholo (agar 'code' command setup ho)
```

### Searching & Finding

```bash
# grep — Text search karo files mein
grep "TODO" server.js               # ek file mein search
grep -r "console.log" src/          # folder mein recursively search
grep -rn "api/users" .              # -n = line number bhi dikhao
grep -ri "error" logs/              # -i = case insensitive
grep -v "node_modules" .gitignore   # -v = invert (jo match na kare)

# Real-world use: "kahan use hua ye function?"
grep -rn "getUserById" src/

# find — Files dhundo
find . -name "*.js"                         # current dir mein sab .js files
find . -name "*.env" -type f                # sirf files (directories nahi)
find . -type d -name "node_modules"         # node_modules directories dhundo
find . -mtime -1                            # last 24 hours mein modified files
find . -size +1M                            # 1MB se bade files

# chmod — File permissions change karo
chmod +x deploy.sh          # execute permission do (script run karne ke liye)
chmod 755 deploy.sh         # rwxr-xr-x (owner: all, others: read+execute)
chmod 600 ~/.ssh/id_rsa     # private key ke liye (sirf owner read/write)
```

### Pipe & Redirection — Terminal ki Superpower

```bash
# | (pipe) — ek command ka output doosre ko input do
ls -la | grep ".js"              # sirf .js files dikhao
cat server.js | grep "require"   # require statements dhundo
ps aux | grep "node"             # node processes dhundo

# > (redirect) — output file mein save karo
echo "Hello World" > output.txt      # file create/overwrite
ls -la > file-list.txt               # directory listing save karo
node server.js > server.log 2>&1     # stdout aur stderr dono log mein

# >> (append) — existing file mein add karo
echo "new line" >> output.txt        # overwrite nahi karega

# Practical example: logs analyse karo
grep "ERROR" app.log | sort | uniq -c | sort -rn
# ERROR kitni baar aaya, count karo, sort karo
```

---

## 3. Environment Variables

### Real-Life Analogy
Socho ek restaurant ke alag alag branches hain — Mumbai, Delhi, Pune. Recipe same hai, lekin ingredients supplier alag hai har city mein. **Environment variables** woh "city-specific settings" hain jo code ko batati hain kis environment mein chal raha hai.

```bash
# export — Variable set karo current session mein
export PORT=3000
export NODE_ENV=development
export DATABASE_URL="mongodb://localhost:27017/mydb"

# Variable use karo
echo $PORT          # 3000
echo $NODE_ENV      # development

# $PATH — Yahan dhundega OS ki commands
echo $PATH
# /usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
# Jab tum 'node' likhte ho terminal mein, OS in folders mein dhundhta hai

# PATH mein apni directory add karo (custom scripts ke liye)
export PATH="$PATH:/Users/ajinkya/scripts"

# .bashrc ya .zshrc mein daalo taki permanent rahe
echo 'export PATH="$PATH:/Users/ajinkya/scripts"' >> ~/.zshrc
source ~/.zshrc    # changes reload karo

# .env file — Project ke environment variables
# .env file banao:
cat > .env << 'EOF'
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/myapp
JWT_SECRET=meri-bahut-secret-key-jo-kisi-ko-nahi-batani
STRIPE_KEY=sk_test_xxxxx
EOF

# Node.js mein .env use karo (dotenv package)
# npm install dotenv
```

```javascript
// server.js mein sabse upar
require('dotenv').config();

const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;

// Ab process.env.VARIABLE_NAME se access karo
console.log(`Server port: ${port}`);
```

```bash
# .env KABHI bhi git mein commit mat karo!
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore

# .env.example zaroor commit karo — dusron ko batao kya chahiye
cp .env .env.example
# .env.example mein actual values hata do, sirf keys rakho
```

---

## 4. Process Management

```bash
# ps — Running processes dekho
ps aux                        # sab processes
ps aux | grep "node"          # sirf node processes

# top / htop — Live process monitor
top                           # real-time CPU/memory usage
htop                          # better version (install karna padega)
# q press karo exit ke liye

# kill — Process band karo
kill 1234                     # process ID 1234 ko signal bhejo (graceful)
kill -9 1234                  # force kill (rude tarika, last resort)
killall node                  # naam se kill karo

# Port pe kaun chal raha hai?
lsof -i :3000                 # port 3000 use kar raha process
lsof -i :3000 | grep LISTEN   # sirf listening process

# "Port already in use" error ka solution:
lsof -i :3000
# PID note karo
kill -9 <PID>

# Background Processes
node server.js &              # background mein run karo (& lagao)
# Output: [1] 12345 — job number aur PID

jobs                          # background jobs dekho
fg                            # foreground mein wapas lao
fg %1                         # specific job number wapas lao
bg                            # stopped job ko background mein resume karo

# nohup — Terminal band hone ke baad bhi chalta rahe
nohup node server.js > output.log 2>&1 &
# Production mein PM2 use karo, nohup nahi
```

---

## 5. SSH — Servers Se Connect Karo

### Real-Life Analogy
SSH ek secret handshake hai. Public key tumhara "visitor badge" hai jo server pe registered hai. Private key tumhari identity proof hai jo sirf tumhare paas hai. Dono match kare toh andar.

```bash
# Basic SSH connect
ssh username@server-ip
ssh ajinkya@192.168.1.100
ssh ubuntu@ec2-xx-xx-xx.compute.amazonaws.com

# SSH keys generate karo (ek baar karo, life mein kaafi aage tak chalti hai)
ssh-keygen -t ed25519 -C "ajinkya@example.com"
# Enter file location: ~/.ssh/id_ed25519 (default)
# Passphrase: optional but recommended

# Keys kahan hain?
ls -la ~/.ssh/
# id_ed25519      — private key (KABHI SHARE MAT KARO)
# id_ed25519.pub  — public key (server pe daalo)

# Public key server pe copy karo
ssh-copy-id username@server-ip
# ya manually:
cat ~/.ssh/id_ed25519.pub   # copy this
# Server pe: nano ~/.ssh/authorized_keys  # paste karo

# SSH config file — shortcuts banao
nano ~/.ssh/config
```

```
# ~/.ssh/config
Host myserver
    HostName ec2-xx-xx-xx.compute.amazonaws.com
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519

Host staging
    HostName staging.myapp.com
    User deploy
    IdentityFile ~/.ssh/deploy_key
```

```bash
# Ab sirf itna likhna hai:
ssh myserver
ssh staging

# SSH tunneling — local port ko remote se connect karo
ssh -L 8080:localhost:3000 myserver
# tumhara localhost:8080 server ka localhost:3000 se connect hoga
# Database GUIs ke liye useful (remote DB ko local tool se access)

# SCP — SSH se files copy karo
scp file.txt myserver:/home/ubuntu/
scp -r ./dist myserver:/var/www/html/
```

---

## 6. Git Fundamentals

### Real-Life Analogy
Git ek **time machine + parallel universe machine** hai tumhare code ke liye. Commit = ek checkpoint save karna. Branch = parallel universe mein kaam karna. Merge = do universes ko ek karna.

```bash
# Setup (pehli baar)
git config --global user.name "Ajinkya Dondalkar"
git config --global user.email "ajinkya@example.com"
git config --global core.editor "code --wait"  # VS Code as editor

# Naya repo banao
git init my-project
cd my-project

# Ya existing repo clone karo
git clone https://github.com/username/repo.git
git clone https://github.com/username/repo.git my-local-name  # alag naam se

# Status check — daily use
git status                    # kya changed hai?
git status -s                 # short format

# Files stage karo (commit ke liye ready karo)
git add file.js               # specific file
git add src/                  # specific folder
git add .                     # sab changes (careful!)
git add -p                    # interactive — hunk by hunk choose karo (pro move!)

# Commit karo
git commit -m "feat: add user authentication endpoint"
git commit -m "fix: resolve null pointer in login flow"
# Good commit message = present tense, descriptive, ~50 chars

# Remote ke saath sync
git push origin main          # local changes remote pe upload karo
git pull origin main          # remote changes local pe download karo
git fetch origin              # download karo but merge mat karo (safe)

# History dekho
git log                       # full log
git log --oneline             # ek line per commit
git log --oneline --graph     # branches bhi dikhao
git log --author="Ajinkya"    # specific person ke commits
git log -p                    # diff bhi dikhao

# Differences dekho
git diff                      # unstaged changes
git diff --staged             # staged changes (jo commit hoga)
git diff main feature/login   # do branches compare karo
git diff HEAD~1               # last commit se compare karo
```

---

## 7. Branching Strategy

### Professional Git Flow

```
main (production-ready code)
  └── develop (integration branch)
        ├── feature/user-auth
        ├── feature/payment-gateway
        └── bugfix/login-error
```

```bash
# Branch operations
git branch                        # sab branches dekho
git branch -a                     # remote branches bhi
git branch feature/user-login     # naya branch banao
git checkout feature/user-login   # us branch pe jao
git checkout -b feature/user-login  # banao aur jao — ek saath (shortcut)
git switch -c feature/user-login  # modern way (Git 2.23+)

# Branch merge karo
git checkout main
git merge feature/user-login      # feature ko main mein merge karo
git merge --no-ff feature/user-login  # merge commit force karo (history better)

# Branch delete karo
git branch -d feature/user-login        # merged branch delete
git branch -D feature/user-login        # force delete (unmerged bhi)
git push origin --delete feature/user-login  # remote branch delete

# Naming conventions:
# feature/short-description    — naya feature
# bugfix/issue-number-desc     — bug fix
# hotfix/critical-fix          — production pe urgent fix
# chore/update-dependencies    — maintenance
# docs/update-readme           — documentation
```

---

## 8. Professional Git Workflow

```bash
# 1. Latest code lo
git checkout main
git pull origin main

# 2. Feature branch banao
git checkout -b feature/user-authentication

# 3. Kaam karo, commits karo
git add src/auth/
git commit -m "feat: add JWT token generation"

git add src/middleware/
git commit -m "feat: add auth middleware for protected routes"

git add tests/
git commit -m "test: add unit tests for auth flow"

# 4. Main latest rakhna (rebase — cleaner history)
git fetch origin
git rebase origin/main
# Conflicts resolve karo agar hain

# 5. Push karo
git push origin feature/user-authentication

# 6. GitHub pe Pull Request banao

# 7. Code review ke baad merge hoga
# 8. Branch delete karo
git branch -d feature/user-authentication
```

---

## 9. Pull Requests — Kaise Likho Acha PR

### Good PR Template

```markdown
## What does this PR do?
Adds JWT-based user authentication with login, logout, and token refresh endpoints.

## Why is this change needed?
Currently the API has no authentication — any user can access any data.
This implements industry-standard JWT auth as per the security requirements.

## Changes Made
- `src/auth/authController.js` — Login/logout/refresh endpoints
- `src/middleware/authMiddleware.js` — Token validation middleware
- `src/models/User.js` — Added passwordHash field
- `tests/auth.test.js` — Unit tests for all auth functions

## How to test?
1. `npm install` (added bcrypt, jsonwebtoken)
2. Set `JWT_SECRET` in .env
3. POST /api/auth/login with `{ email, password }`
4. Use returned token in `Authorization: Bearer <token>` header

## Screenshots (if UI change)
[screenshot here]

## Checklist
- [x] Tests pass (`npm test`)
- [x] No console.logs left
- [x] .env.example updated
- [x] Documentation updated
```

### Reviewers kya dekhte hain:
- Code logic sahi hai?
- Edge cases handle hain? (null, empty, invalid input)
- Security issues? (SQL injection, XSS, exposed secrets)
- Tests hain?
- Code readable hai? (good variable names, comments jahan zaruri ho)
- Performance issues?

---

## 10. Merge Conflicts — Step by Step

```bash
# Conflict kab hota hai?
# Jab do branches ne same line change ki ho

# Example scenario:
# main mein: const port = 3000;
# feature mein: const port = 8080;
# Dono merge karo → CONFLICT!

git merge feature/settings
# Auto-merging server.js
# CONFLICT (content): Merge conflict in server.js

# Conflict file kuch aisi dikhti hai:
```

```javascript
// server.js — conflict markers
<<<<<<< HEAD (main branch ki line)
const port = 3000;
=======
const port = process.env.PORT || 8080;
>>>>>>> feature/settings (feature branch ki line)
```

```bash
# Resolution steps:
# 1. git status — conflict files dekho
git status
# both modified: server.js

# 2. File kholo, conflict markers dhundo (<<<<, ====, >>>>)
code server.js

# 3. Decide karo kya rakhna hai — ek ya dono ya naya
# Final code (conflict markers hata do):
# const port = process.env.PORT || 3000;

# 4. Stage karo
git add server.js

# 5. Merge complete karo
git commit -m "merge: resolve port conflict, use env var with fallback"

# VS Code mein conflicts bohot aasaan hote hain resolve karna —
# "Accept Current", "Accept Incoming", "Accept Both" buttons aate hain
```

---

## 11. Daily-Use Git Commands

```bash
# git stash — Kaam adha chhodo, branch switch karo
git stash                        # current changes temporarily save karo
git stash push -m "WIP: login form"  # message ke saath
git stash list                   # saved stashes dekho
git stash pop                    # wapas lao (stash se hata bhi dega)
git stash apply stash@{1}        # specific stash apply karo (delete nahi hoga)
git stash drop                   # stash delete karo

# git reset — Commits wapas lo
git reset HEAD~1                 # last commit undo, changes staged rahenge
git reset --soft HEAD~1          # same — soft = changes rakho staged
git reset --mixed HEAD~1         # changes unstaged ho jayenge (default)
git reset --hard HEAD~1          # DANGER: changes delete ho jayenge
git reset HEAD file.js           # specific file unstage karo

# git revert — Safe undo (public branches ke liye)
git revert abc1234               # ek commit revert karo (naya commit banta hai)
git revert HEAD                  # last commit revert karo
# Reset aur Revert ka fark: reset history change karta hai, revert nahi
# Public branches pe KABHI reset --hard mat karo

# git cherry-pick — Specific commit dusre branch pe lao
git cherry-pick abc1234          # ek commit
git cherry-pick abc1234..def5678 # range of commits

# When to use: Hotfix main pe hai, develop pe bhi chahiye
git checkout develop
git cherry-pick abc1234          # hotfix commit develop pe bhi apply karo

# git reflog — Galti ho gayi? Reflog se sab mil sakta hai
git reflog                       # sab git operations ka history
git checkout HEAD@{5}            # 5 operations pehle ki state pe jao
# "Mujhe laga sab delete ho gaya" — reflog dekho pehle
```

---

## 12. GitHub Profile Optimization

### Profile README banao:
1. `username/username` naam ka repo banao (e.g., `ajinkya/ajinkya`)
2. Isme `README.md` banao — yahi GitHub profile pe dikhega

```markdown
<!-- GitHub Profile README Template -->
# Hi, I'm Ajinkya! 👋

## 🚀 About Me
Full-Stack Developer | Node.js + React | Open to opportunities

Currently building: [Project Name](link)

## 🛠 Tech Stack
**Backend:** Node.js, Express, PostgreSQL, MongoDB, Redis
**Frontend:** React, TypeScript, Tailwind CSS
**DevOps:** Docker, AWS, GitHub Actions

## 📊 GitHub Stats
![Ajinkya's GitHub Stats](https://github-readme-stats.vercel.app/api?username=YOUR_USERNAME&show_icons=true&theme=dark)

## 🌱 Currently Learning
- System Design
- Kubernetes

## 📫 Connect with Me
[LinkedIn](https://linkedin.com/in/yourprofile) | [Portfolio](https://yoursite.com)
```

### Profile ke important points:
- **Pinned repos** — 6 best projects pin karo, har ek mein README ho
- **Contribution graph** — daily commits karo, green rakhna
- **Good README in every project** — setup, features, screenshots, live demo link
- **Profile picture** — professional honi chahiye

---

## 13. .gitignore — Kya Ignore Karna Hai

```gitignore
# .gitignore — ye files git track nahi karega

# Dependencies — ye sab npm install se aate hain
node_modules/
.pnp
.pnp.js

# Environment variables — KABHI commit mat karo
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
/build
/dist
/.next
/out

# Logs
logs/
*.log
npm-debug.log*

# OS files (Mac/Windows automatically banate hain)
.DS_Store
Thumbs.db
Desktop.ini

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/

# Misc
.cache/
*.tmp
```

```bash
# Global gitignore — sab projects ke liye (OS files etc.)
git config --global core.excludesfile ~/.gitignore_global

# ~/.gitignore_global
echo ".DS_Store" >> ~/.gitignore_global
echo "Thumbs.db" >> ~/.gitignore_global
echo ".idea/" >> ~/.gitignore_global

# gitignore template dhundo:
# https://gitignore.io — OS, language, IDE choose karo

# Pehle se tracked file ko ignore karo
git rm --cached .env           # git se hato (file disk pe rahegi)
git rm --cached -r node_modules/
git commit -m "chore: remove accidentally tracked files"
```

---

## 14. Common Git Mistakes — Aur Unke Solutions

```bash
# ❌ MISTAKE 1: Main pe commit kar diya galti se
git log --oneline
# abc1234 (HEAD -> main) feat: add half-baked feature  ← ye problem hai
# def5678 fix: previous fix

# ✅ FIX: Branch banao aur commit wahaan le jao
git checkout -b feature/half-baked-feature   # branch banao (commit wahan bhi hai)
git checkout main
git reset --hard HEAD~1                       # main se commit hato
# Ab feature branch pe wo commit hai, main pe nahi

# ❌ MISTAKE 2: .env commit ho gaya
git log --oneline
# abc1234 add environment variables   ← .env andar aa gaya!

# ✅ FIX: .env git history se hataao
# Step 1: .env gitignore mein daalo
echo ".env" >> .gitignore

# Step 2: git history se hataao
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all

# Step 3: Force push (aur sab teammates ko batao!)
git push origin --force --all

# IMPORTANT: .env mein jo bhi secrets the, unhe ROTATE karo
# (passwords change karo, API keys regenerate karo)

# Simple case — agar abhi abhi commit hua aur push nahi hua:
git reset HEAD~1                   # commit undo
echo ".env" >> .gitignore
git add .gitignore
git commit -m "chore: add .env to gitignore"

# ❌ MISTAKE 3: Last commit undo karna hai (push se pehle)
git reset HEAD~1         # changes staged rahenge
git reset --soft HEAD~1  # same result

# ❌ MISTAKE 4: Last commit undo karna hai (push ke baad — public repo)
git revert HEAD          # naya commit banata hai jo pichla undo karta hai
git push origin main

# ❌ MISTAKE 5: Wrong branch pe merge kar diya
git reflog               # sab operations dekho, merge se pehle ka HEAD dhundo
git reset --hard HEAD@{2}  # us state pe jao (number adjust karo)

# ❌ MISTAKE 6: Commit message galat likh diya (push se pehle)
git commit --amend -m "correct message"
# WARNING: Push ke baad amend mat karo agar public repo hai

# ❌ MISTAKE 7: Kuch file stage ho gayi jo nahi chahiye thi
git restore --staged file.js    # unstage karo
git reset HEAD file.js          # older way
```

---

## Common Mistakes — Beginner Traps

1. **`git add .` har baar** — Instead `git add -p` use karo, ek ek change review karo
2. **Commit messages: "fix", "update", "changes"** — Descriptive likho: "fix: resolve null error when user not found"
3. **Direct main pe kaam karna** — HAMESHA feature branch banao
4. **.env commit karna** — Pehla kaam: `.gitignore` setup karo
5. **`sudo rm -rf`** — Bina soch ke mat chalao, ek typo se system delete ho sakta hai
6. **SSH keys share karna** — Private key = password. Kabhi share mat karo.

---

## Interview Questions & Answers

**Q1: Git merge aur rebase mein kya fark hai?**
> Merge ek merge commit banata hai — history preserve hoti hai. Rebase commits ko upar le jaata hai — linear history milti hai lekin shared branches pe avoid karo. Feature branches pe rebase theek hai, main pe nahi.

**Q2: `git pull` aur `git fetch` mein kya fark hai?**
> Fetch sirf remote se changes download karta hai merge nahi karta. Pull = fetch + merge. Safe practice: fetch karo, diff dekho, phir merge karo.

**Q3: Merge conflict kaise resolve karte ho?**
> `git status` se conflict files dhundho, file kholo, `<<<<`, `====`, `>>>>` markers ko manually remove karo, sahi code rakho, `git add` karo, `git commit` karo.

**Q4: SSH key-based auth password se better kyun hai?**
> Mathematically stronger (4096-bit RSA vs 8-char password), brute-force practically impossible, private key sirf tumhare machine pe hai, server pe sirf public key hai.

**Q5: .gitignore mein file add karne ke baad bhi track ho rahi hai kyun?**
> File pehle se tracked hai. `git rm --cached filename` se tracking hatao, phir gitignore kaam karega.

---

## Assignment

### Task 1 — Terminal Practice
1. Ek folder structure banao: `my-project/src/components/`, `my-project/src/utils/`, `my-project/tests/`
2. Har folder mein ek file banao `touch` se
3. `grep` se sab `.js` files dhundho
4. `find` se sab empty files dhundho

### Task 2 — Git Workflow
1. GitHub pe naya repo banao `full-stack-practice`
2. Local mein clone karo
3. `.gitignore` aur `.env.example` add karo
4. `develop` branch banao
5. `feature/hello-world` branch banao
6. `src/index.js` mein hello world code likho
7. Commit karo, push karo
8. GitHub pe Pull Request banao (develop mein merge karne ke liye)
9. PR description template use karo jo upar diya hai

### Task 3 — Conflict Resolution
1. Do branches banao: `branch-a` aur `branch-b`
2. Dono mein same file ki same line change karo
3. Pehle `branch-a` merge karo main mein
4. Phir `branch-b` merge karo — conflict aayega
5. Conflict resolve karo step by step

### Task 4 — Fix Mistakes
1. Main pe ek commit karo
2. Usse feature branch pe le jao (main pe undo karo)
3. `.env` file commit karo (accident simulate karo)
4. Usse history se hataao

> **Next Module:** Node.js Fundamentals → Module 01
