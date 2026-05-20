# Step 12: Real-World Software Lifecycle
### "Industry mein feature kaise banta hai — complete journey"

---

## Why This Matters

College mein: "Assignment do, submit karo, marks milenge."

Industry mein: Feature ka idea → Planning → Design → Development → Testing → Deploy → Monitor → Maintain

**Ye poora cycle samajhna = better developer banana.**

---

## Software Development Lifecycle (SDLC)

```
1. Requirements Gathering
        ↓
2. System Design / Architecture
        ↓
3. Development
        ↓
4. Code Review
        ↓
5. Testing (QA)
        ↓
6. Staging Deployment
        ↓
7. Production Deployment
        ↓
8. Monitoring & Observability
        ↓
9. Bug Fixes & Maintenance
        ↓
10. Feature Evolution
```

---

## Stage 1: Requirements Gathering

**"Kya banana hai?"**

```
Stakeholders:
- Product Manager (PM) → Business requirements
- Designer (UX) → User experience requirements
- Tech Lead → Technical constraints
- Customer/User → Actual needs

Documents:
- PRD (Product Requirements Document) → PM likhta hai
- User Stories → "As a [user], I want [feature] so that [benefit]"
- Acceptance Criteria → Feature "done" kab maana jaayega?

Example User Story:
"As a registered user,
I want to be able to reset my password via email,
So that I can regain access to my account if I forget my password."

Acceptance Criteria:
- User email enter kare → Reset link receive ho within 2 minutes
- Reset link 10 minutes valid ho
- Naya password 8+ characters ka ho
- Reset ke baad old token invalidate ho
- Success page dikhaye
```

---

## Stage 2: System Design

**"Kaise banana hai?"**

```
High-Level Design (HLD):
- System ke components (frontend, backend, DB, cache, queue)
- How they communicate
- Technology choices

Low-Level Design (LLD):
- Database schema
- API endpoints + request/response format
- Class/function structure
- Algorithms + data structures

For password reset:
HLD:
User → Browser → Backend API → Email Service
                            ↓
                         Database (store reset token)

LLD:
Endpoint: POST /auth/forgot-password
Request: { email: "user@example.com" }
Response: { message: "Reset link sent" }

DB: Add fields to users table:
  passwordResetToken: String (hashed)
  passwordResetExpiry: Date

Token generation: crypto.randomBytes(32).toString('hex')
Email: Nodemailer → Gmail SMTP
```

---

## Stage 3: Development

**"Actually banana"**

### Task Breakdown
```
Feature: Password Reset

Tasks (break into small chunks):
1. Database: Add resetToken + resetExpiry fields to User model
2. Route: POST /auth/forgot-password
3. Route: POST /auth/reset-password
4. Util: generateResetToken function
5. Email: sendPasswordResetEmail function
6. Frontend: Forgot password form
7. Frontend: Reset password form
8. Tests: Unit tests for token generation
9. Tests: Integration tests for both routes
```

### Git Workflow in Development
```bash
# Main se branch create karo
git checkout main && git pull
git checkout -b feature/password-reset

# Chhote meaningful commits karo
git commit -m "feat(auth): add passwordResetToken fields to User model"
git commit -m "feat(auth): implement forgot-password endpoint"
git commit -m "feat(auth): implement reset-password endpoint"
git commit -m "feat(email): add password reset email template"
git commit -m "test(auth): add integration tests for password reset"

# Push karo
git push -u origin feature/password-reset
```

---

## Stage 4: Code Review

**"Doosron ne dekha?"**

### What Code Review Checks
```
Correctness:
✅ Does it work as per requirements?
✅ Edge cases handled?
✅ Error handling proper?

Quality:
✅ Is it readable?
✅ Proper naming?
✅ No unnecessary complexity?
✅ DRY principle?

Security:
✅ No SQL/NoSQL injection?
✅ No sensitive data in logs?
✅ Proper auth checks?

Performance:
✅ No N+1 queries?
✅ Appropriate indexes?
✅ No unnecessary loops?

Testing:
✅ Tests written?
✅ Tests meaningful?
✅ Edge cases covered?
```

### How to Respond to Code Review

```
Reviewer: "This function is too complex. Consider splitting."
Bad response: "It works fine."
Good response: "Makes sense. I'll split it into validateToken() and resetPassword()."

Reviewer: "Why are you using setTimeout here instead of a queue?"
Bad response: Ignore
Good response: "Good point. For production this should use BullMQ. I'll refactor or create a ticket."

Reviewer: "Nit: unused variable `temp`."
Good response: "Fixed!"
```

---

## Stage 5: Testing

**"Kaam karta hai? Edge cases bhi?"**

### Types of Testing

```
Unit Tests → Individual functions test karo
Integration Tests → Multiple parts together (API + DB)
E2E Tests → Full user flow (Cypress/Playwright)
Manual Testing → QA engineer manually test karta hai
Load Testing → High traffic pe behaviour (k6, JMeter)
```

### Test Coverage
```
Statement coverage: Kitne statements execute hue?
Branch coverage: Kitne if/else branches cover hue?
Function coverage: Kitni functions call hue?

Aim: 70-80% coverage for core business logic
Don't aim for 100% — diminishing returns
```

```js
// Integration test example
describe('POST /auth/forgot-password', () => {
  test('sends reset email for valid registered email', async () => {
    const res = await request(app)
      .post('/auth/forgot-password')
      .send({ email: testUser.email });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Reset link sent to your email');

    // DB mein token saved hai check karo
    const user = await User.findOne({ email: testUser.email });
    expect(user.passwordResetToken).toBeDefined();
    expect(user.passwordResetExpiry).toBeGreaterThan(Date.now());
  });

  test('returns same message for unregistered email (no info leak)', async () => {
    const res = await request(app)
      .post('/auth/forgot-password')
      .send({ email: 'notregistered@example.com' });

    expect(res.status).toBe(200);  // Not 404!
    expect(res.body.message).toBe('Reset link sent to your email');
  });

  test('validates email format', async () => {
    const res = await request(app)
      .post('/auth/forgot-password')
      .send({ email: 'notanemail' });

    expect(res.status).toBe(422);
  });
});
```

---

## Stage 6 & 7: Deployment

**"Staging first, then production."**

```
Staging Deployment:
- GitHub Actions triggers on PR merge to develop/staging
- Deploy to staging environment
- QA does manual testing
- PM/Stakeholders preview
- Performance test if significant change

Production Deployment:
- PR to main (after staging approved)
- GitHub Actions:
  1. Tests run
  2. Build
  3. Deploy to production
  4. Health check
  5. Rollback if health check fails

Deploy timing:
- Never Friday afternoon (weekend incident risk)
- Off-peak hours preferred (low traffic = lower blast radius)
- Monitoring window: Stay on for 30 min after deploy
```

---

## Stage 8: Monitoring & Observability

**"Production pe kya ho raha hai?"**

### The Three Pillars of Observability

```
1. LOGS — What happened?
   → Request logs, error logs, business events
   → "User 123 attempted login at 14:32"
   → "Payment processing failed for order 456"
   → Tools: Winston, Pino, CloudWatch, Datadog

2. METRICS — How is the system performing?
   → Response time, error rate, throughput, CPU, memory
   → "Average API response time: 145ms"
   → "Error rate: 0.2%"
   → Tools: Prometheus, Grafana, Datadog, New Relic

3. TRACES — Why did something happen?
   → Request path through multiple services
   → "This request was slow because DB query took 800ms"
   → Tools: Jaeger, Zipkin, Datadog APM
```

### Key Metrics to Monitor

```
Availability:   Is service up? (uptime %)
Latency:        Response time (p50, p95, p99)
Error Rate:     % of requests returning 5xx errors
Throughput:     Requests per second
CPU/Memory:     Server resources
DB Query Time:  Slow queries
Cache Hit Rate: How often cache is serving requests
Queue Depth:    Background jobs pending
```

### Alerting

```
Set alerts for:
- Error rate > 1% for 5 minutes → Page on-call
- Response time p99 > 2s for 5 minutes → Notify
- Database connections > 90% → Alert
- Server memory > 85% → Warn

Oncall rotation:
- Developers take turns being "on-call"
- PagerDuty/OpsGenie → Phone notification for alerts
- Incident response → Investigate → Fix → Post-mortem
```

---

## Stage 9: Bug Fixes

**"Production bug aaya — kya karte hain?"**

```
Production Bug Severity:

P0 (Critical): System down, data loss, security breach
  → Immediate response, wake up on-call
  → All hands

P1 (High): Core feature broken for many users
  → Fix within hours
  → Hotfix branch → Deploy directly to production

P2 (Medium): Non-critical feature broken
  → Fix in next sprint or within 1-2 days

P3 (Low): Minor issue, edge case
  → Add to backlog, fix when time allows
```

### Incident Response Process

```
1. Acknowledge: "I'm looking into this"
2. Assess Impact: How many users affected?
3. Communicate: Update stakeholders
4. Diagnose: Logs → Traces → Root cause
5. Fix: Hotfix branch → Test → Deploy
6. Verify: Monitor for 30 min post-fix
7. Post-mortem: Document what happened and prevention
```

### Post-Mortem Template

```markdown
## Incident: [Brief Description]

**Date:** 2024-01-15
**Duration:** 2h 15min (14:30 - 16:45 IST)
**Severity:** P1
**Impact:** Login endpoint returning 500 for all users

## Timeline
14:30 - Alert triggered: error rate > 5%
14:35 - On-call engineer starts investigation
14:50 - Root cause identified: JWT_SECRET env var missing after deploy
15:00 - Hotfix deployed with correct env var
15:05 - Error rate returns to normal
16:45 - Monitoring period complete, incident closed

## Root Cause
New env var JWT_REFRESH_SECRET was added but not configured in production.
The auth middleware threw unhandled error on every request.

## Resolution
Added JWT_REFRESH_SECRET to production environment variables.

## Prevention
1. Add env var validation at startup (process.exit if missing)
2. Add env vars to deployment checklist
3. Add integration test that verifies auth middleware startup
```

---

## Stage 10: Feature Evolution

**"Cycle repeat hota hai — but better informed."**

```
User Feedback → New Requirements → Back to Stage 1

V1: Basic password reset
V2: Add SMS OTP option (user feedback: "no email access")
V3: Add security questions (enterprise request)
V4: Add biometric support (mobile app)

Each cycle: Same SDLC but informed by real usage data
```

---

## The Developer's Role in Each Stage

```
Stage 1 (Requirements): Ask clarifying questions.
  → "What if token is used twice?"
  → "Should old token be invalidated on new request?"

Stage 2 (Design): Participate.
  → Suggest technical approaches
  → Point out complexity, risks

Stage 3 (Development): Own your code.
  → Clean, tested, documented

Stage 4 (Code Review): Engage actively.
  → Respond to all comments
  → Learn from feedback

Stage 5 (Testing): Write meaningful tests.
  → Not just happy path

Stage 7 (Deploy): Be available post-deploy.
  → Watch metrics for 30 min

Stage 8 (Monitor): Take ownership.
  → Alerts are your responsibility

Stage 9 (Bugs): Own them.
  → Don't blame others
  → Fix, document, prevent
```

---

## Interview Questions — Step 12

**Q: Agile kya hai? Sprint kya hota hai?**
> Agile ek iterative development methodology hai. Sprint 2-week work cycle hai jisme small, working increments deliver hote hain. Daily standup (15 min) blockers share karne ke liye. Sprint review completed work demo karta hai. Retro process improve karne ke liye.

**Q: Ek production bug kaise handle karoge?**
> Severity assess karo, stakeholders ko communicate karo, logs + traces se root cause dhundho, hotfix branch pe targeted fix karo, staging pe verify karo, production deploy karo, 30 min monitor karo. Baad mein post-mortem likho.

**Q: Code review kyun important hai?**
> Code quality ensure karta hai, bugs early catch hote hain (cheaper to fix), knowledge sharing hoti hai team mein, security issues surface hote hain, consistency maintain hoti hai codebase mein.

---

## Assignment — Step 12

1. Kisi bhi project ka user story likho:
   - "As a [user], I want [feature] so that [benefit]"
   - 5 acceptance criteria likho

2. Code review practice:
   - Kisi open source project ka ek PR padhо (GitHub)
   - Comments identify karo — kya suggest kiya gaya?

3. Mock post-mortem likho:
   - Koi bug jo tumne face kiya
   - Timeline, root cause, fix, prevention
