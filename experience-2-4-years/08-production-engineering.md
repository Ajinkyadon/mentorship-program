# Module 08: Production Engineering
### "Code likhna practice hai — production engineering profession hai"

---

## The Production Engineering Mindset

```
Development: "Does it work?"
Production engineering: "Does it work at scale, reliably, with visibility?"

Questions production engineers ask:
→ How do we know when it's broken?
→ How quickly can we detect issues?
→ How quickly can we recover?
→ What's the blast radius of a failure?
→ Can we deploy without downtime?
→ Are we meeting our SLAs?
```

---

## 1. Structured Logging

```js
// Winston — production-grade logging
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()  // Machine-readable in production
  ),
  defaultMeta: {
    service: process.env.SERVICE_NAME,
    version: process.env.APP_VERSION,
    environment: process.env.NODE_ENV
  },
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'development'
        ? winston.format.combine(winston.format.colorize(), winston.format.simple())
        : winston.format.json()
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Request logging middleware with correlation
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || crypto.randomUUID();
  req.logger = logger.child({ requestId: req.id, userId: req.user?.id });

  const start = Date.now();
  res.on('finish', () => {
    req.logger.info('HTTP Request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: Date.now() - start,
      userAgent: req.get('user-agent'),
      ip: req.ip
    });
  });
  next();
});

// Business events logging
logger.info('Payment processed', {
  userId: user.id,
  orderId: order.id,
  amount: order.total,
  currency: 'INR',
  paymentMethod: 'upi'
});

// Never log sensitive data
// ❌ logger.info('Login', { password: req.body.password });
// ✅ logger.info('Login attempt', { email: req.body.email, success: true });
```

---

## 2. Metrics with Prometheus

```js
const promClient = require('prom-client');

// Default Node.js metrics (CPU, memory, GC)
promClient.collectDefaultMetrics({ prefix: 'myapp_' });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
});

const activeConnections = new promClient.Gauge({
  name: 'websocket_connections_active',
  help: 'Active WebSocket connections'
});

const businessCounter = new promClient.Counter({
  name: 'orders_total',
  help: 'Total orders processed',
  labelNames: ['status', 'payment_method']
});

// Middleware to track HTTP metrics
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({
      method: req.method,
      route: req.route?.path || 'unknown',
      status_code: res.statusCode
    });
  });
  next();
});

// Track business events
async function processOrder(order) {
  const result = await paymentService.charge(order);
  businessCounter.inc({ status: result.status, payment_method: order.paymentMethod });
  return result;
}

// Metrics endpoint for Prometheus scraping
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

---

## 3. Distributed Tracing

```js
// OpenTelemetry — vendor-neutral tracing
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': { enabled: true },
      '@opentelemetry/instrumentation-express': { enabled: true },
      '@opentelemetry/instrumentation-mongoose': { enabled: true }
    })
  ]
});

sdk.start();

// Custom spans
const { trace } = require('@opentelemetry/api');
const tracer = trace.getTracer('myapp');

async function processPayment(orderId) {
  const span = tracer.startSpan('process_payment');
  span.setAttributes({ orderId, service: 'payment' });

  try {
    const order = await fetchOrder(orderId);
    span.addEvent('order_fetched');

    const payment = await chargeCard(order);
    span.addEvent('payment_charged', { amount: payment.amount });

    span.setStatus({ code: SpanStatusCode.OK });
    return payment;
  } catch (err) {
    span.recordException(err);
    span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    throw err;
  } finally {
    span.end();
  }
}
```

---

## 4. Alerting Strategy

```yaml
# Grafana alerting rules (conceptual)
rules:
  - name: High Error Rate
    condition: error_rate_5m > 1%
    severity: critical
    notify: [pagerduty, slack-#incidents]
    runbook: https://wiki/runbooks/high-error-rate

  - name: API Latency
    condition: p99_latency_5m > 2000ms
    severity: warning
    notify: [slack-#backend-alerts]

  - name: DB Connections
    condition: db_pool_waiting > 5
    severity: warning
    notify: [slack-#backend-alerts]

  - name: Memory
    condition: process_memory_usage > 85%
    severity: warning
    notify: [slack-#backend-alerts]

  - name: Disk Space
    condition: disk_usage > 80%
    severity: warning
    notify: [slack-#infra-alerts]
```

---

## 5. Performance Profiling

### Memory Leaks

```js
// Detect memory leaks in production
const { heapdump } = require('heapdump');

// Schedule heap snapshot if memory growing
setInterval(() => {
  const used = process.memoryUsage();
  if (used.heapUsed > 500 * 1024 * 1024) { // > 500MB
    const filename = `/tmp/heap-${Date.now()}.heapsnapshot`;
    heapdump.writeSnapshot(filename);
    logger.warn('Heap snapshot taken due to high memory', {
      heapUsed: Math.round(used.heapUsed / 1024 / 1024) + 'MB',
      filename
    });
  }
}, 60000);

// Common memory leak patterns:
// 1. Global variable accumulation
const cache = {}; // Grows forever without eviction

// Fix: Use bounded cache
const LRU = require('lru-cache');
const cache = new LRU({ max: 1000, ttl: 1000 * 60 * 10 }); // Max 1000 items, 10min TTL

// 2. Event listener leak
// Bad:
setInterval(() => {
  emitter.on('data', processData); // New listener every second!
}, 1000);

// Fix: One listener, or remove before adding
emitter.removeAllListeners('data');
emitter.on('data', processData);

// 3. Unclosed streams/connections
const stream = fs.createReadStream(file);
// ... forgot to close or pipe
// Fix: Always handle close/error events
stream.on('error', (err) => stream.destroy());
stream.on('close', () => logger.debug('Stream closed'));
```

### CPU Profiling

```bash
# Clinic.js — production profiling tools
npm install -g clinic

# CPU flame graph
clinic flame -- node src/index.js

# Event loop delay
clinic bubbleprof -- node src/index.js

# I/O analysis
clinic doctor -- node src/index.js

# Load test while profiling
ab -n 10000 -c 100 http://localhost:3000/api/users
# OR
k6 run load-test.js
```

```js
// k6 load test script
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const apiLatency = new Trend('api_latency');
const errorRate = new Rate('error_rate');

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up to 100 users
    { duration: '5m', target: 100 },   // Stay at 100
    { duration: '2m', target: 500 },   // Ramp to 500
    { duration: '5m', target: 500 },   // Stay at 500
    { duration: '2m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95% under 500ms
    error_rate: ['rate<0.01']           // Error rate under 1%
  }
};

export default function() {
  const res = http.get('http://localhost:3000/api/products');

  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'latency < 500ms': (r) => r.timings.duration < 500
  });

  apiLatency.add(res.timings.duration);
  errorRate.add(!success);

  sleep(1);
}
```

---

## 6. Incident Response

### Incident Classification

```
P0 — Critical (all hands, immediate response)
  → System completely down
  → Data loss or corruption
  → Security breach
  → Revenue-impacting for all users

P1 — High (on-call response within 30 min)
  → Major feature down for >10% users
  → Performance degraded >300%
  → Payment processing failing

P2 — Medium (response within 4 hours)
  → Non-critical feature broken
  → Performance degraded <50%

P3 — Low (response next business day)
  → Minor issue, edge case
  → Cosmetic bug
```

### Incident Runbook Template

```markdown
# Runbook: High API Latency

## Symptoms
- p99 API latency > 2000ms
- CloudWatch alarm triggered

## Investigation Steps

### Step 1: Identify scope
- Which endpoints? (CloudWatch dashboard → API metrics by route)
- Which users affected? (Check error logs → filter by userId)
- When did it start? (Correlate with recent deployments)

### Step 2: Check infrastructure
- EC2 CPU: < 80%? (CloudWatch → EC2 metrics)
- RDS CPU: < 80%? (CloudWatch → RDS metrics)
- Redis memory: > 80%? (ElastiCache metrics)
- Network latency: (VPC flow logs)

### Step 3: Check application
- Slow queries: (RDS Performance Insights → Top SQL)
- N+1 queries: (Application logs → query count per request)
- Cache hit rate: (Redis INFO stats)
- Blocked event loop: (Node.js metrics → event loop lag)

### Step 4: Resolution options
A. Slow DB query → Add index → Apply immediately (no deploy)
B. Traffic spike → Scale EC2 ASG → Auto or manual
C. Memory pressure → Restart pods/instances → Check for leak
D. Bad deployment → Rollback → ECS rollback or Git revert + deploy

## Post-Resolution
- Verify metrics returned to normal (wait 5 min)
- Document in #incidents Slack channel
- Create post-mortem within 48 hours
```

---

## 7. Zero-Downtime Deployments

```bash
# Blue-Green with AWS ECS
# Blue: Current production (v1)
# Green: New version (v2)

# Step 1: Deploy v2 to Green
aws ecs update-service --cluster prod --service myapp-green \
  --task-definition myapp:v2

# Step 2: Wait for Green to be healthy
aws ecs wait services-stable --cluster prod --services myapp-green

# Step 3: Health check Green
curl https://green.myapp.internal/health

# Step 4: Switch ALB target group
aws elbv2 modify-rule --rule-arn $RULE_ARN \
  --actions Type=forward,TargetGroupArn=$GREEN_TG_ARN

# Step 5: Monitor for 5 minutes
watch -n 5 'aws cloudwatch get-metric-statistics ...'

# Step 6: If good — Blue becomes standby
# Step 7: If bad — switch back to Blue in seconds
aws elbv2 modify-rule --rule-arn $RULE_ARN \
  --actions Type=forward,TargetGroupArn=$BLUE_TG_ARN
```

---

## Assignment — Module 08

1. Add structured logging (Winston) with request ID propagation
2. Prometheus metrics: Add HTTP duration histogram + business counter
3. Write a runbook for "Database connection exhausted" incident
4. Load test your API with k6 — identify bottleneck
5. Find and fix one memory leak in your existing code (heapdump analysis)
