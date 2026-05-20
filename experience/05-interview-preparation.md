# 05 — Interview Preparation Plan

> Designed for working professionals targeting 10–15 LPA developer roles.

---

## Interview Landscape for 10–15 LPA Roles

```
┌──────────────────────────────────────────────────────────────┐
│                    INTERVIEW FUNNEL                          │
│                                                              │
│  APPLICATION → SCREENING → TECHNICAL ROUND 1 → ROUND 2 →   │
│                                                              │
│  Round 1: Online assessment (DSA / MCQ)                      │
│  Round 2: Live coding / take-home project                    │
│  Round 3: System design + project discussion                 │
│  Round 4: HR + compensation discussion                       │
└──────────────────────────────────────────────────────────────┘

Product Companies (Freshworks, Razorpay, CRED, Swiggy):
  - Strong DSA round (LeetCode Easy–Medium)
  - System design discussion
  - Deep dive on your projects
  - Culture fit

Startups (Series A/B):
  - Take-home project or live coding
  - Project discussion and extension questions
  - Less DSA, more "can you build things fast?"
  - Practical problem solving

Service Companies (Cognizant, Infosys, Wipro, TCS Digital):
  - Moderate DSA
  - Conceptual JavaScript, React, Node.js questions
  - HR round is significant
  - Background in support is an advantage
```

---

## DSA Basics for Working Professionals

**The good news:** At 10–15 LPA level, you don't need to solve hard LeetCode problems. You need to be solid at Easy and selected Mediums.

### Minimum DSA Requirement

```
MUST KNOW (for every interview):
  ├── Arrays — traversal, two-pointer, sliding window
  ├── Strings — manipulation, reversal, anagrams
  ├── Objects/HashMaps — frequency counting, lookup
  ├── Sorting — understand bubble, selection (concept)
  │             know when to use Array.sort()
  └── Recursion — factorial, fibonacci, tree traversal (basic)

GOOD TO KNOW (for product companies):
  ├── Linked Lists — reverse, detect cycle
  ├── Stacks & Queues — using arrays as stacks
  ├── Binary Search — basic implementation
  └── Basic tree traversal (BFS, DFS)

NOT REQUIRED FOR YOUR LEVEL:
  ├── Dynamic Programming (complex DP)
  ├── Graph algorithms (Dijkstra, Bellman-Ford)
  └── Segment trees, Tries
```

### DSA Study Plan (45 mins/day for 6 weeks)

```
Week 1: Arrays & Strings
  - Reverse an array/string
  - Find duplicates in array
  - Two Sum problem
  - Valid parentheses
  - Palindrome check

Week 2: Objects & Frequency Patterns
  - Character frequency counter
  - Anagram check
  - Group anagrams
  - Top K elements

Week 3: Sorting & Searching
  - Sort by custom criteria
  - Binary search
  - Search in sorted array
  - Meeting rooms problem

Week 4: Recursion & Backtracking
  - Factorial and Fibonacci
  - Flatten nested array
  - Generate all subsets
  - Tree traversal (if time permits)

Week 5–6: Mixed Practice + Review
  - Revisit missed problems
  - Timed practice (30 min per problem max)
  - Mock coding interview

Resources:
  - LeetCode (filter: Easy, then Medium): https://leetcode.com/
  - NeetCode 150 (curated list): https://neetcode.io/practice
  - JS DS&A Masterclass (Udemy): https://www.udemy.com/course/js-algorithms-and-data-structures-masterclass/
```

---

## JavaScript Interview Questions

### Conceptual Questions (Must Know)

```
Q: What is the difference between let, const, and var?
A: var is function-scoped and hoisted. let/const are block-scoped.
   const prevents reassignment but not mutation. 
   Use const by default, let when reassignment needed, avoid var.

Q: What is a closure?
A: A closure is a function that retains access to its outer scope's 
   variables even after the outer function has returned.
   Common uses: data privacy, factory functions, memoization.

Q: What is the event loop?
A: JS is single-threaded. The event loop coordinates:
   - Call stack (synchronous code runs here)
   - Microtask queue (Promises resolve here — higher priority)
   - Task queue (setTimeout, setInterval run here)
   The event loop moves tasks from queues to the call stack 
   when the stack is empty.

Q: What is the difference between == and ===?
A: == does type coercion (0 == "0" is true).
   === checks value AND type (0 === "0" is false).
   Always use ===.

Q: What is Promise.all vs Promise.allSettled?
A: Promise.all rejects as soon as ANY promise rejects.
   Promise.allSettled waits for ALL promises and returns 
   their statuses (fulfilled or rejected).

Q: What are higher-order functions?
A: Functions that take other functions as arguments or return functions.
   Examples: map, filter, reduce, forEach.

Q: What is the difference between null and undefined?
A: undefined means a variable was declared but not assigned a value.
   null is an explicit assignment meaning "no value."
   typeof null === "object" (a historical JavaScript bug).

Q: What is event bubbling and event capturing?
A: Bubbling: event travels from the target element UP to the root.
   Capturing: event travels from root DOWN to target.
   stopPropagation() prevents bubbling.

Q: What is debouncing vs throttling?
A: Debounce: Wait X ms after the LAST call before executing.
   Throttle: Execute at most once every X ms regardless of calls.
   Use debounce for search inputs. Use throttle for scroll events.

Q: What is the prototype chain?
A: Every JS object has a hidden __proto__ link to its prototype.
   When you access a property, JS walks up this chain until it 
   finds the property or reaches null (end of chain).
```

### Coding Questions (Must Practice)

```javascript
// 1. Implement debounce
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 2. Deep clone an object (without JSON.parse hack)
// Explain why JSON.parse/stringify fails for functions, Dates, undefined

// 3. Flatten a nested array
function flatten(arr) {
  return arr.reduce((acc, val) => 
    Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
}

// 4. Implement Promise.all from scratch
// Shows deep understanding of Promises

// 5. Curry a function
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return function(...nextArgs) { return curried(...args, ...nextArgs); };
  };
}

// 6. Memoize a function
function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache[key]) return cache[key];
    cache[key] = fn.apply(this, args);
    return cache[key];
  };
}
```

---

## React Interview Questions

### Conceptual Questions

```
Q: What is the Virtual DOM and how does it work?
A: The Virtual DOM is a lightweight JavaScript representation of the 
   real DOM. When state changes, React creates a new Virtual DOM tree, 
   diffs it against the previous one (reconciliation), and only updates 
   the changed parts in the real DOM. This is more efficient than 
   re-rendering the entire DOM.

Q: What is the difference between state and props?
A: Props are passed from parent to child (read-only in child).
   State is managed within a component and can be updated.
   When either changes, React re-renders the component.

Q: When does useEffect run?
A: - No dependency array: runs after every render
   - Empty array []: runs once after initial render (componentDidMount)
   - With values [x, y]: runs when x or y changes
   Return value from useEffect is the cleanup function.

Q: What is the difference between useMemo and useCallback?
A: useMemo memoizes the RESULT of a computation.
   useCallback memoizes the FUNCTION itself.
   Both prevent unnecessary recalculation when dependencies haven't changed.

Q: What causes unnecessary re-renders and how do you prevent them?
A: Causes: new object/array references in props, parent re-renders.
   Solutions: React.memo (component), useMemo (values), useCallback (fns).

Q: What is the Context API and when should you use it?
A: Context provides global state without prop drilling.
   Use for: theme, auth state, language preferences.
   Don't use for: frequently changing state (causes too many re-renders).
   For complex state, prefer Redux Toolkit or Zustand.

Q: What is reconciliation?
A: The process React uses to decide which parts of the DOM to update.
   React uses a "diffing" algorithm — it compares the new Virtual DOM 
   with the previous one, starting from the root, and finds minimal 
   changes. This is why 'key' props are critical in lists — they help 
   React identify which items changed.

Q: What is code splitting and lazy loading?
A: Code splitting divides your bundle into smaller chunks that load 
   on demand. React.lazy() + Suspense enables this:
   const About = React.lazy(() => import('./About'));
```

### Coding Scenarios

```
Scenario: How would you implement infinite scroll in React?
Answer: Use IntersectionObserver to detect when a sentinel element 
        (at the bottom of the list) becomes visible, then fetch 
        the next page.

Scenario: How would you prevent a form from submitting when a user 
          presses Enter in a text field?
Answer: Add onKeyDown handler and call e.preventDefault() when 
        e.key === 'Enter'.

Scenario: How would you handle a race condition in useEffect 
          when fetching data?
Answer: Use a cleanup function with an isMounted flag or AbortController:

useEffect(() => {
  const controller = new AbortController();
  fetchData({ signal: controller.signal });
  return () => controller.abort();
}, [id]);
```

---

## Node.js Interview Questions

```
Q: What is the event loop in Node.js?
A: Node.js is single-threaded but handles concurrency via the event loop.
   I/O operations are offloaded to the OS via libuv. When they complete,
   their callbacks are queued. The event loop continuously picks callbacks 
   from the queue and executes them.

Q: What is the difference between process.nextTick() and setImmediate()?
A: process.nextTick() runs before the event loop continues to the next phase.
   setImmediate() runs in the check phase of the event loop.
   nextTick has higher priority.

Q: What is middleware in Express?
A: Middleware functions have access to req, res, and next.
   They can execute code, modify req/res, end the cycle, or call next().
   They execute in the order they are defined.

Q: How do you handle errors in Express?
A: Error-handling middleware has 4 parameters: (err, req, res, next).
   It must be defined AFTER all other routes and middleware.
   Non-async errors pass to it via next(err).
   For async errors, you must catch and pass: next(err).

Q: What is the difference between authentication and authorization?
A: Authentication: Verifying WHO you are (login).
   Authorization: Verifying WHAT you can do (permissions).

Q: How does JWT authentication work?
A: 1. User logs in with credentials
   2. Server verifies credentials, creates a JWT signed with a secret
   3. Server sends JWT to client
   4. Client stores it (localStorage or httpOnly cookie)
   5. Client sends JWT in Authorization header on each request
   6. Server verifies the signature and extracts user info

Q: What is the difference between SQL and NoSQL databases?
A: SQL: Structured, tabular, ACID compliant, fixed schema, 
        great for relational data (user → orders → products)
   NoSQL: Flexible schema, document/key-value/graph, 
          scales horizontally, great for hierarchical or 
          rapidly changing data structures

Q: How would you optimize a slow API endpoint?
A: 1. Add database indexes on frequently queried fields
   2. Implement caching (Redis) for expensive queries
   3. Paginate results instead of returning all data
   4. Use select/projection to return only needed fields
   5. Check for N+1 query problems
   6. Profile with logging to find the bottleneck
```

---

## System Design Basics

At 10–15 LPA level, you won't be expected to design distributed systems. But you should be able to design a feature or a small system.

### What to Expect

```
Common System Design Questions:
  - "Design the data model for a job portal"
  - "How would you design a URL shortener?"
  - "How would you build a notification system?"
  - "Design the authentication flow for a multi-tenant app"
```

### System Design Framework (for beginners)

```
Step 1: CLARIFY requirements (2 minutes)
  - How many users? Real-time or batch?
  - What are the main features?
  - Any constraints?

Step 2: HIGH-LEVEL design (diagram on whiteboard/paper)
  - Browser → Load Balancer → API Server → Database
  - Draw the components, then explain each

Step 3: DATA MODEL
  - What are the main entities? (User, Job, Application)
  - What are the relationships?
  - SQL or NoSQL? Why?

Step 4: API DESIGN
  - What are the main endpoints?
  - GET /jobs, POST /jobs, PUT /jobs/:id

Step 5: IDENTIFY BOTTLENECKS
  - What could break at scale?
  - What could you cache?
  - What needs to be async?
```

### Sample: Design a Job Portal

```
Users: Employer, Job Seeker, Admin

Data Model:
  User { id, name, email, password, role }
  Job { id, title, description, company, location, salary, postedBy }
  Application { id, jobId, applicantId, status, appliedAt }

API:
  POST /auth/register
  POST /auth/login
  GET  /jobs?location=&salary_min=&page=
  POST /jobs (employer only)
  POST /jobs/:id/apply (job seeker only)
  GET  /applications (employer: their job's applications)

Scaling considerations:
  - Cache job listings (they change infrequently)
  - Queue email notifications (don't block the API)
  - Index jobs by location, salary, postedAt
```

---

## HR Interview Preparation

### Career Transition Story (the most important question)

**The question:** "Tell me about yourself. Why are you switching from support to development?"

**Bad answer:** "I was bored in my support job and wanted something better."

**Good answer:**
> "I've spent [X] years in tech support at [company], where I worked closely with software systems, diagnosed complex issues, and developed a deep understanding of how applications behave in production. During that time, I realized I was spending a lot of energy working around software limitations that I could fix myself if I knew how to code. That realization led me to dedicate the last 3 months to learning full-stack development under a structured mentorship program. I've built [mention 2–3 projects], deployed them, and I'm now ready to bring both my development skills and my unique perspective from supporting real users into a development role."

### Common HR Questions

```
Q: What is your biggest weakness?
A: Never say "I'm a perfectionist." 
   Say something real that you're actively working on:
   "I used to spend too much time trying to understand every edge 
    case before writing code. I've learned to write a working 
    solution first and refactor — it's actually faster."

Q: Where do you see yourself in 5 years?
A: "I want to grow into a senior full-stack developer, taking 
    ownership of architectural decisions. I'm particularly 
    interested in [mention the company's domain]. I see this role 
    as a strong foundation for that growth."

Q: Why this company?
A: Research before interviewing. Mention:
   - A product feature you found interesting
   - A tech blog post they published
   - A problem they solve that you care about

Q: What is your expected salary?
A: Research market rate for the role in your city.
   State a range: "Based on my research and the skills I bring, 
   I'm expecting between X and Y LPA. I'm open to discussion 
   based on the overall package."
```

---

## Mock Interview Strategy

### 3 Types of Mock Interviews You Need

```
1. SELF-MOCK (weekly, starting Week 6)
   - Set a 30-minute timer
   - Pick 3 random questions from the question bank
   - Answer out loud, as if talking to an interviewer
   - Record yourself (phone camera is fine)
   - Watch it back and identify where you trailed off

2. PEER MOCK (bi-weekly, starting Week 8)
   - Pair with another student in the cohort
   - One interviews, one answers, then switch
   - Give honest feedback: "You said 'um' 12 times" is helpful

3. MENTOR MOCK (Week 12)
   - Full 90-minute technical interview simulation
   - Includes coding, conceptual, and HR questions
   - Written feedback provided afterward
```

### Interview Day Checklist

```
Before the interview:
  ☐ Test your laptop camera and microphone
  ☐ Prepare your STAR stories for 3 projects
  ☐ Review JavaScript closures, event loop, async/await
  ☐ Review your most complex project top-to-bottom
  ☐ Get 8 hours of sleep

During the interview:
  ☐ Take 30 seconds to understand a question before answering
  ☐ Think out loud — interviewers want to see your process
  ☐ If you don't know, say "I haven't used that directly, but 
     here's how I'd approach learning it..."
  ☐ Ask clarifying questions for DSA problems before coding

After the interview:
  ☐ Send a follow-up email within 24 hours
  ☐ Write down every question you were asked
  ☐ Research the ones you couldn't answer
```

---

## Company-Specific Preparation

### Product-Based Companies (10–15 LPA)

```
Examples: Freshworks, Razorpay, CRED, Meesho, Groww, PhonePe

Focus on:
  - LeetCode Easy–Medium (2 weeks minimum)
  - JavaScript internals (event loop, closures, this)
  - React rendering behavior
  - System design basics
  - Strong project discussion

Resources:
  - Glassdoor interview experiences
  - LeetCode company tags
  - Company engineering blogs
```

### Startup Interviews

```
Focus on:
  - "Build this feature" take-home project
  - Speed and pragmatism over perfection
  - Understanding their product and suggesting improvements
  - Show you can work independently
```

### Service-Based (Digital/Premium tracks)

```
Examples: TCS Digital, Infosys Topaz, Wipro Elite

Focus on:
  - JavaScript MCQ-based rounds
  - HTML/CSS/React fundamentals
  - Communication skills (HR round is significant here)
  - Explain your career switch clearly
```

---

> *Next: Real-world Projects → [06-real-world-projects.md](./06-real-world-projects.md)*
