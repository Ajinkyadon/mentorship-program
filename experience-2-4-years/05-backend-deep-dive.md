# Module 05: Backend Development Deep Dive
### "Surface level nahi — internals samajhna"

---

## Node.js Internals

### Event Loop — Production Understanding

```
The 6 phases of the Node.js event loop:

Phase 1: Timers
  → setTimeout, setInterval callbacks whose delay has passed

Phase 2: Pending Callbacks
  → I/O callbacks deferred from previous iteration

Phase 3: Idle, Prepare
  → Internal use only

Phase 4: Poll
  → Retrieve new I/O events
  → Execute their callbacks
  → If no timers pending → wait here

Phase 5: Check
  → setImmediate callbacks

Phase 6: Close Callbacks
  → socket.on('close') etc.

Special queues (before each phase):
  → process.nextTick queue (highest priority)
  → Promise microtask queue

Order: nextTick → Microtasks → Phase callbacks
```

```js
// Execution order demonstration
console.log('1: sync');

process.nextTick(() => console.log('2: nextTick'));

Promise.resolve().then(() => console.log('3: promise'));

setImmediate(() => console.log('4: setImmediate'));

setTimeout(() => console.log('5: setTimeout 0'), 0);

console.log('6: sync end');

// Output: 1 → 6 → 2 → 3 → 5 → 4
// (nextTick before promises, both before macrotasks)
```

### When Node.js Blocks

```js
// CPU-intensive tasks BLOCK the event loop
// All other requests wait!

// BAD — blocks event loop
app.get('/hash', (req, res) => {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  res.json({ hash });
  // During this: NO other requests processed
});

// GOOD — use worker threads for CPU work
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

app.get('/hash', (req, res) => {
  const worker = new Worker('./hashWorker.js', {
    workerData: { password: req.body.password, salt }
  });
  worker.on('message', (hash) => res.json({ hash }));
  worker.on('error', (err) => next(err));
  // Event loop free to handle other requests
});
```

### Streams — Memory-Efficient Processing

```js
// BAD: Load entire file into memory
app.get('/download', async (req, res) => {
  const file = await fs.readFile('/large-file.csv'); // 2GB → crash
  res.send(file);
});

// GOOD: Stream it
app.get('/download', (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  const readStream = fs.createReadStream('/large-file.csv');
  readStream.pipe(res); // Pipe stream to response — memory efficient
});

// Transform stream — process while streaming
const { Transform } = require('stream');

const csvToJson = new Transform({
  transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\n');
    const jsonLines = lines.map(line => {
      const [id, name, email] = line.split(',');
      return JSON.stringify({ id, name, email });
    }).join('\n');
    callback(null, jsonLines);
  }
});

readStream.pipe(csvToJson).pipe(res);

// Stream pipeline (handles errors properly)
const { pipeline } = require('stream/promises');
await pipeline(readStream, csvToJson, writeStream);
```

---

## Advanced Express Architecture

### Complete Middleware Stack

```js
// app.js — Production-grade setup
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// Trust proxy (for correct IP behind load balancer)
app.set('trust proxy', 1);

// Security
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    }
  },
  crossOriginEmbedderPolicy: true
}));

// CORS
app.use(cors({
  origin: (origin, callback) => {
    const allowed = process.env.ALLOWED_ORIGINS.split(',');
    if (!origin || allowed.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'Idempotency-Key']
}));

// Compression
app.use(compression({ threshold: 1024 }));

// Request logging
app.use(morgan('combined', {
  stream: { write: (msg) => logger.info(msg.trim()) },
  skip: (req) => req.url === '/health'
}));

// Rate limiting
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  keyGenerator: (req) => req.user?.id || req.ip
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request ID (for tracing)
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
});
```

### NestJS Architecture Concepts

```typescript
// NestJS brings structured architecture to Node.js
// Key concepts:

// 1. Modules — Feature grouping
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService]
})
export class UserModule {}

// 2. Dependency Injection — Built-in IoC container
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private emailService: EmailService,
    private cacheService: CacheService
  ) {}
}

// 3. Guards — Authorization
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const user = context.switchToHttp().getRequest().user;
    return roles.some(role => user.roles.includes(role));
  }
}

// 4. Interceptors — Transform responses, logging
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({ success: true, data, timestamp: new Date().toISOString() }))
    );
  }
}

// 5. Pipes — Validation
@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) return value;
    const errors = await validate(plainToClass(metatype, value));
    if (errors.length > 0) throw new BadRequestException(errors);
    return value;
  }
}
```

---

## Advanced Authentication Systems

### JWT with Refresh Token Rotation

```js
// Complete production JWT system
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '30d';

class AuthService {
  generateTokenPair(userId, role) {
    const accessToken = jwt.sign(
      { userId, role, type: 'access' },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY, issuer: 'myapp', audience: 'myapp-client' }
    );

    const refreshToken = jwt.sign(
      { userId, type: 'refresh', tokenFamily: crypto.randomUUID() },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    return { accessToken, refreshToken };
  }

  async refresh(oldRefreshToken) {
    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);

    // Check if token was already used (rotation theft detection)
    const isRevoked = await redis.get(`revoked_token:${decoded.tokenFamily}`);
    if (isRevoked) {
      // Token reuse detected — revoke entire family
      await this.revokeTokenFamily(decoded.userId);
      throw new Error('Token reuse detected — please login again');
    }

    // Revoke old token family
    await redis.setEx(
      `revoked_token:${decoded.tokenFamily}`,
      30 * 24 * 60 * 60, // 30 days
      '1'
    );

    const user = await User.findById(decoded.userId);
    return this.generateTokenPair(user._id, user.role);
  }
}
```

### Role-Based Access Control (RBAC)

```js
// Permission-based RBAC
const permissions = {
  'post:read':   ['viewer', 'editor', 'admin'],
  'post:write':  ['editor', 'admin'],
  'post:delete': ['admin'],
  'user:read':   ['admin'],
  'user:write':  ['admin'],
  'analytics:read': ['analyst', 'admin']
};

function requirePermission(permission) {
  return (req, res, next) => {
    const userRole = req.user.role;
    const allowed = permissions[permission];

    if (!allowed?.includes(userRole)) {
      return res.status(403).json({
        error: `Permission denied: ${permission} requires one of: ${allowed?.join(', ')}`
      });
    }
    next();
  };
}

// Routes
router.get('/posts', authenticate, requirePermission('post:read'), getPosts);
router.post('/posts', authenticate, requirePermission('post:write'), createPost);
router.delete('/posts/:id', authenticate, requirePermission('post:delete'), deletePost);
```

---

## WebSockets & Real-Time Architecture

```js
// Socket.io production setup
const { createServer } = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.ALLOWED_ORIGIN },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Redis adapter for horizontal scaling (multiple Node.js instances)
const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();
await Promise.all([pubClient.connect(), subClient.connect()]);
io.adapter(createAdapter(pubClient, subClient));

// Auth middleware for WebSockets
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    socket.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    next();
  } catch (err) {
    next(new Error('Authentication failed'));
  }
});

// Connection handler
io.on('connection', (socket) => {
  const userId = socket.user.userId;

  // Join user's personal room
  socket.join(`user:${userId}`);

  socket.on('join:room', (roomId) => {
    socket.join(`room:${roomId}`);
    socket.to(`room:${roomId}`).emit('user:joined', { userId, roomId });
  });

  socket.on('message', async (data) => {
    // Save to DB
    const message = await Message.create({
      sender: userId,
      room: data.roomId,
      content: data.content
    });

    // Broadcast to room
    io.to(`room:${data.roomId}`).emit('new:message', message);
  });

  socket.on('disconnect', () => {
    io.to(`room:${socket.rooms}`).emit('user:left', { userId });
  });
});

// Send to specific user from anywhere (including HTTP routes)
io.to(`user:${targetUserId}`).emit('notification', { message });
```

---

## Queue Systems

```js
// BullMQ — Production queue patterns
const { Queue, Worker, QueueEvents } = require('bullmq');

const connection = { host: process.env.REDIS_HOST, port: 6379 };

// Define queues
const emailQueue = new Queue('emails', { connection });
const imageQueue = new Queue('image-processing', { connection });
const notificationQueue = new Queue('notifications', { connection });

// Email worker
const emailWorker = new Worker('emails', async (job) => {
  const { to, subject, template, data } = job.data;

  await job.updateProgress(10);
  const html = await renderTemplate(template, data);

  await job.updateProgress(50);
  await mailer.send({ to, subject, html });

  await job.updateProgress(100);
  return { sent: true, timestamp: new Date() };
}, {
  connection,
  concurrency: 5,           // 5 emails in parallel
  limiter: { max: 100, duration: 60000 }  // 100/minute rate limit
});

// Event handlers
emailWorker.on('completed', (job, result) => {
  logger.info({ jobId: job.id, result }, 'Email sent');
});

emailWorker.on('failed', async (job, err) => {
  logger.error({ jobId: job.id, error: err.message }, 'Email failed');
  // Alert if too many failures
  if (job.attemptsMade >= job.opts.attempts) {
    await alerting.notify(`Email job ${job.id} exhausted retries`);
  }
});

// Add jobs with options
await emailQueue.add('welcome', {
  to: user.email,
  subject: 'Welcome!',
  template: 'welcome',
  data: { name: user.name }
}, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 },
  removeOnComplete: { count: 1000 },
  removeOnFail: { count: 5000 }
});

// Scheduled job (cron-like)
await emailQueue.add('weekly-digest', {}, {
  repeat: { cron: '0 9 * * MON' },  // Every Monday 9 AM
  jobId: 'weekly-digest'             // Prevent duplicates
});
```

---

## File Upload System

```js
// Production file upload — S3 + validation + virus scan
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const sharp = require('sharp');

const s3 = new S3Client({ region: process.env.AWS_REGION });

// Memory storage (process before S3 upload)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`File type ${file.mimetype} not allowed`));
  }
});

// Upload endpoint
router.post('/upload', authenticate, upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file;
    let buffer = file.buffer;

    // Resize images
    if (file.mimetype.startsWith('image/')) {
      buffer = await sharp(file.buffer)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();
    }

    // Upload to S3
    const key = `uploads/${req.user.userId}/${Date.now()}-${file.originalname}`;
    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.mimetype.startsWith('image/') ? 'image/webp' : file.mimetype,
      Metadata: { uploadedBy: req.user.userId, originalName: file.originalname }
    }));

    const url = `https://${process.env.CLOUDFRONT_DOMAIN}/${key}`;
    res.json({ success: true, url, key });
  } catch (err) { next(err); }
});

// Presigned URL for direct client upload (large files)
router.post('/upload/presigned', authenticate, async (req, res) => {
  const { fileName, fileType } = req.body;
  const key = `uploads/${req.user.userId}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: fileType
  });

  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min

  res.json({ presignedUrl, key, fileUrl: `https://${process.env.CLOUDFRONT_DOMAIN}/${key}` });
});
```

---

## API Documentation with Swagger/OpenAPI

```js
// swagger.config.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EngineerUp API',
      version: '2.0.0',
      description: 'Production-grade REST API',
      contact: { name: 'API Support', email: 'api@engineerup.in' }
    },
    servers: [
      { url: 'https://api.engineerup.in', description: 'Production' },
      { url: 'http://localhost:3000', description: 'Development' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '64abc123' },
            name: { type: 'string', example: 'Rahul Kumar' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'admin'] }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Validation failed' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);
```

---

## Assignment — Module 05

1. Node.js event loop: Write code that demonstrates execution order — verify with logs
2. Implement a streaming CSV export endpoint (don't load full data into memory)
3. Build WebSocket-based live notification system (user connects, receives real-time notifications)
4. Implement BullMQ queue with retry, dead letter queue, monitoring
5. Build file upload service with S3 integration + image optimization
