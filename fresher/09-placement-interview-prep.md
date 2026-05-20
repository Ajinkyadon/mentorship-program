# Module 9: Placement & Interview Preparation
### "Preparation se darr khatam hota hai"

---

## Types of Companies

| Type | Examples | Focus |
|------|----------|-------|
| Service | TCS, Infosys, Wipro, Cognizant | Aptitude, communication, basics |
| Product | Flipkart, Swiggy, Razorpay | DSA, system design, projects |
| Startup | Early-stage companies | Projects, attitude, learning speed |
| MNC Product | Google, Microsoft, Amazon | DSA (heavy), system design |

**As a fresher:** Target service companies + startups first. Product companies after 6–12 months of solid preparation.

---

## Part 1: DSA Roadmap for Placements

### Sequence to Follow (3 months)

**Month 1 — Foundations**
```
Week 1–2: Arrays + Strings
  □ Two pointers
  □ Sliding window
  □ Prefix sum
  □ Frequency counting (HashMap)

Week 3–4: Sorting + Searching
  □ Bubble, Selection, Insertion sort (understand, not memorize)
  □ Merge sort + Quick sort
  □ Binary search (and variations)
```

**Month 2 — Core Data Structures**
```
Week 5–6: Linked List + Stack + Queue
  □ Reverse linked list
  □ Detect cycle
  □ Stack using array
  □ Valid parentheses
  □ Queue using stack

Week 7–8: Hashing + Recursion
  □ Two sum, Group anagrams
  □ Subarray with given sum
  □ Fibonacci, factorial (recursion basics)
  □ Backtracking intro
```

**Month 3 — Trees + Graphs + DP**
```
Week 9–10: Trees
  □ BFS, DFS traversal
  □ Height, diameter, level order
  □ Binary Search Tree operations

Week 11–12: Graphs + DP
  □ BFS/DFS on graphs
  □ Shortest path (Dijkstra basics)
  □ Basic DP: climbing stairs, coin change, knapsack
```

---

### LeetCode Problem List (Start Here)

**Arrays:**
- Two Sum (#1)
- Best Time to Buy Stock (#121)
- Maximum Subarray (#53) — Kadane's
- Contains Duplicate (#217)
- Product of Array Except Self (#238)

**Strings:**
- Valid Palindrome (#125)
- Reverse String (#344)
- Anagram (#242)
- Longest Common Prefix (#14)
- Roman to Integer (#13)

**Linked List:**
- Reverse Linked List (#206)
- Merge Two Sorted Lists (#21)
- Linked List Cycle (#141)
- Middle of Linked List (#876)

**Trees:**
- Maximum Depth of Binary Tree (#104)
- Invert Binary Tree (#226)
- Level Order Traversal (#102)
- Validate BST (#98)

**Dynamic Programming:**
- Climbing Stairs (#70)
- Coin Change (#322)
- Longest Common Subsequence (#1143)

---

## Part 2: CS Fundamentals

### Operating Systems (OS)

**Must-know topics:**

**Processes & Threads:**
```
Process = Running program (own memory space)
Thread = Lightweight unit within a process (shared memory)

Process → Heavy, isolated
Thread → Light, shared memory, faster communication

Concurrency vs Parallelism:
Concurrency = Multiple tasks in progress (not necessarily simultaneously)
Parallelism = Multiple tasks literally at same time (multi-core)
```

**Deadlock:**
```
4 conditions for deadlock (all 4 must be true):
1. Mutual Exclusion — resource ek time pe ek hi use kar sakta hai
2. Hold and Wait — resource hold karte hue doosra wait karo
3. No Preemption — resource forcibly nahi liya ja sakta
4. Circular Wait — circular chain of waiting

Prevention: Any ek condition todо
```

**Memory Management:**
```
Stack: Function calls + local variables (LIFO, fast, limited)
Heap: Dynamic allocation (malloc/new), slower, large
Virtual Memory: RAM + Disk space combined (paging/swapping)
```

**CPU Scheduling:**
```
FCFS — First Come First Serve (simple, convoy effect)
SJF — Shortest Job First (optimal but needs future knowledge)
Round Robin — Time slices (fair, good for time-sharing)
Priority — Higher priority first (can cause starvation)
```

---

### Database Management System (DBMS)

**Normalization:**
```
1NF: Atomic values, no repeating groups
2NF: 1NF + no partial dependency on composite PK
3NF: 2NF + no transitive dependency

Example:
Bad: Student(RollNo, Name, CourseId, CourseName)
     CourseName depends on CourseId, not RollNo → not 3NF

Good: Student(RollNo, Name, CourseId)
      Course(CourseId, CourseName)
```

**Transactions & ACID:**
```
A — Atomicity: All operations succeed or all rollback
C — Consistency: DB stays in valid state before and after
I — Isolation: Concurrent transactions don't interfere
D — Durability: Committed transaction survives crashes
```

**SQL Joins:**
```
INNER JOIN — Only matching rows from both tables
LEFT JOIN  — All rows from left + matching from right
RIGHT JOIN — All rows from right + matching from left
FULL JOIN  — All rows from both, NULL where no match
```

**Indexes:**
```
B-Tree index — Most common, good for range queries
Hash index — O(1) lookup, only equality queries
Composite index — Multiple columns, order matters
```

---

### Computer Networks (CN)

**OSI Model (7 Layers):**
```
7. Application  — HTTP, FTP, SMTP (what users see)
6. Presentation — Encryption, compression
5. Session      — Connection management
4. Transport    — TCP/UDP (reliable/unreliable delivery)
3. Network      — IP, routing (find path)
2. Data Link    — MAC address, frames
1. Physical     — Actual wire, signals

Trick: "All People Seem To Need Data Processing" (top to bottom)
```

**TCP vs UDP:**
```
TCP:
✅ Reliable (acknowledgments)
✅ Ordered delivery
✅ Error checking
❌ Slower
Use: HTTP, email, file transfer

UDP:
✅ Fast
✅ Low overhead
❌ No delivery guarantee
❌ No ordering
Use: Video streaming, gaming, DNS
```

**HTTP Methods & Status Codes** — Already covered in Module 4.

**Important Protocols:**
```
DNS — Domain to IP
DHCP — Automatic IP assignment
HTTP/HTTPS — Web communication
FTP — File transfer
SMTP/POP3/IMAP — Email
SSH — Secure remote access
```

---

### OOPs Concepts

**4 Pillars** — already covered in Module 4. Interview short answers:

```
Encapsulation: Data + methods ek saath. Private fields.
Inheritance: Child class parent se inherit karta hai. "is-a" relationship.
Polymorphism: Same interface, different behavior. Method overriding/overloading.
Abstraction: Implementation hide, interface dikhao. Abstract classes/interfaces.
```

**Additional OOP Terms:**

```
Constructor: Object create hone par automatically call hota hai
Destructor: Object destroy hone par call hota hai
Overloading: Same name, different parameters
Overriding: Child class parent method ko replace karta hai
Interface: Pure abstraction — sirf method signatures, no implementation
Abstract Class: Partial implementation — some concrete + some abstract methods
```

---

## Part 3: JavaScript Interview Questions

### Closures
```js
// Q: What will this print?
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// Output: 3, 3, 3 (var is function-scoped, same i)

// Fix with let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// Output: 0, 1, 2
```

### Event Loop
```js
// Q: Output order?
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Answer: 1, 4, 3, 2
// Promise (microtask) runs before setTimeout (macrotask)
```

### This Keyword
```js
const obj = {
  name: 'Alice',
  regular: function() { console.log(this.name); },
  arrow: () => console.log(this.name)  // this = outer context
};
obj.regular(); // "Alice"
obj.arrow();   // undefined (or global)
```

### Prototype
```js
function Person(name) { this.name = name; }
Person.prototype.greet = function() { return `Hi, I'm ${this.name}`; };
const p = new Person('Rahul');
p.greet(); // "Hi, I'm Rahul"

// p.__proto__ === Person.prototype → true
// Person.prototype.__proto__ === Object.prototype → true
```

### Common Tricky Questions
```js
// typeof null
typeof null   // "object" — JS quirk, not a bug fix

// == vs ===
0 == ''   // true
0 === ''  // false

// NaN
NaN === NaN  // false
isNaN(NaN)   // true

// Spread vs Rest
function sum(...args) {}   // Rest — collect remaining
const arr = [...arr1, ...arr2]; // Spread — expand
```

---

## Part 4: Aptitude Basics (Service Companies)

### Topics Covered in Service Company Tests

**Quantitative:**
- Percentages, Profit & Loss
- Time & Work, Time & Distance
- Simple & Compound Interest
- Permutations & Combinations
- Probability

**Logical Reasoning:**
- Number series
- Syllogisms
- Logical deduction
- Data interpretation

**Verbal:**
- Reading comprehension
- Grammar corrections
- Vocabulary

**Platforms to practice:** IndiaBIX, PrepInsta, HackerEarth, AMCAT mock tests

---

## Part 5: HR Interview Questions

**"Tell me about yourself"**
```
Structure (2 minutes max):
1. Education + branch
2. Key technical skills
3. Best project (1 line)
4. Why software development
5. What you want from this role

Example:
"I'm Priya, final year CSE student from [college]. I specialize in backend 
development with Node.js and have built 3 full-stack projects including a 
blog platform and authentication system. I chose software because I enjoy 
solving real problems through code. I'm looking for a role where I can 
contribute to real products and grow as a developer."
```

**"Why should we hire you?"**
```
"I bring [specific skills], have [specific experience/projects], and I'm 
someone who [growth mindset, quick learner, consistent]. I can contribute 
to [specific thing relevant to company] from day one."
```

**"What's your weakness?"**
```
Real answer + improvement:
"I used to get stuck on problems too long without asking for help. 
I've been working on this — now I set a 30-minute rule: if I'm stuck, 
I document what I've tried and ask."
```

**"Where do you see yourself in 5 years?"**
```
"I want to become a strong backend/full-stack engineer, take ownership 
of features, and eventually mentor junior developers. I see myself growing 
within a company that values learning and impact."
```

---

## Part 6: Resume Preparation

### Resume Template Structure

```
[Full Name]
[Phone] | [Email] | [LinkedIn URL] | [GitHub URL] | [Portfolio URL]

SUMMARY (2-3 lines)
Results-oriented CSE graduate with hands-on experience in Node.js, Express, 
MongoDB. Built 3 full-stack applications deployed on cloud. Strong problem-solving 
skills with 200+ LeetCode problems solved.

SKILLS
Languages: JavaScript, SQL
Frontend: HTML, CSS, React (basics)
Backend: Node.js, Express.js
Database: MongoDB, PostgreSQL
Tools: Git, GitHub, Postman, VS Code, Linux
Concepts: REST APIs, JWT Auth, CRUD, MVC, OOP

PROJECTS (most important section!)
1. [Project Name] | [Tech Stack Used] | [GitHub Link] | [Live Demo Link]
   • Implemented [feature] that [impact/result]
   • Built [specific technical thing] using [technology]
   • [Number] users OR handled [specific scale]

EDUCATION
B.Tech, Computer Science — [College Name], [City]
[Graduation Year] | CGPA: [X.X] / 10

ACHIEVEMENTS (optional but good)
• Solved 200+ LeetCode problems
• Open source contribution to [repo]
• Won [hackathon/competition]
```

### Resume DOs and DON'Ts

```
✅ DO:
- Action verbs: Built, Implemented, Designed, Reduced, Improved
- Numbers: "reduced load time by 40%", "handles 100+ concurrent users"
- Live project links
- 1 page max (fresher)
- ATS-friendly format (no tables, no columns for ATS)

❌ DON'T:
- "Exposure to" — either you know it or you don't
- Fake projects (interviewers ask deep questions)
- Objectives ("I want to join a company that...")
- Personal info (DOB, religion, photo — not needed in tech)
- Spell mistakes — career killer
```

---

## Part 7: LinkedIn Optimization

**Profile photo:** Professional, clear background, smiling.

**Headline (most important):**
```
Bad: "Student at XYZ College"
Good: "Backend Developer | Node.js • Express • MongoDB | Seeking SDE Role"
```

**About section:**
```
Opening hook: "I build web applications that solve real problems."

Body: Skills + what you've built + what you're looking for

CTA: "Open to fresher SDE opportunities. Let's connect!"
```

**Experience section:**
- Even internships, freelance, college projects count
- Each with bullet points of what you actually did

**Projects section:** Add all 3+ projects with descriptions and links.

**Skills:** Add 15–20 relevant skills and get endorsements.

**Posting consistently:**
- Learning updates: "Today I learned [X] — here's how it works..."
- Project updates: "Just deployed [project] — here's what I built..."
- Insights: "Confused about JWT vs Sessions? Here's the difference..."

---

## Part 8: GitHub Optimization

**Profile README:** Create `username/username` repo with a README.

```markdown
# Hi, I'm Rahul 👋

Backend Developer learning Node.js, Express, MongoDB.

## Current Focus
- Building full-stack projects
- Solving LeetCode problems daily
- Preparing for SDE roles

## Projects
| Project | Stack | Link |
|---------|-------|------|
| Blog API | Node.js, Express, MongoDB | [GitHub] |
| Auth System | JWT, bcrypt | [GitHub] |
| Portfolio | HTML, CSS, JS | [Live] |

## Stats
![GitHub Stats](https://github-readme-stats.vercel.app/api?username=USERNAME)
```

**Repository quality:**
- Proper README with setup instructions
- `.env.example` with required variables
- Clean commit messages
- No credentials in code

---

## Part 9: Mock Interview Strategy

**Self mock interview:**
```
1. Timer start karo — 45 min
2. LeetCode problem lo (medium)
3. Think out loud — literally bolo
4. Code likho
5. Review: kya better kar sakte the?
```

**With a friend:**
```
Rotate: ek interviewer, ek interviewee
HR + Technical dono practice karo
Record karo (phone pe) — playback brutal but effective
```

**Online:**
- Pramp.com — free peer mock interviews
- InterviewBit — structured practice
- Interviewing.io — with real engineers

---

## Interview Day Preparation

### Week Before
- [ ] Resume print + digital ready
- [ ] Company research: what do they build, tech stack, recent news
- [ ] Glassdoor interview experiences padho
- [ ] Practice 5–10 problems (warm-up, not cramming)
- [ ] Sleep 7+ hours

### Day Before
- [ ] Outfit ready
- [ ] Interview location/link confirm
- [ ] 3 questions for interviewer ready
- [ ] No new topics — only revision

### During Interview
```
Technical round:
→ Problem read karo carefully
→ "Can I ask a few questions?" — always clarify
→ Think out loud — interviewer wants to see your process
→ Brute force pehle acknowledge karo, phir optimize
→ Edge cases explain karo
→ If stuck: "I know I need to [X], let me think about approach..."

HR round:
→ Confident, conversational tone
→ Specific answers — not generic
→ Ask genuine questions at the end
```

---

## Assignment — Module 9

1. Resume draft banao — Module 9 template follow karo
2. LinkedIn profile update karo — headline, about, skills
3. GitHub README banao
4. 5 LeetCode Easy problems solve karo (from the list above)
5. 1 HR question ka written answer banao: "Tell me about yourself"
6. Company list banao — 20 companies (service + product + startups) jahan apply karna chahte ho
