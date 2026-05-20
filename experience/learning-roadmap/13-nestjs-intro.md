# NestJS Introduction — Structured Backend Development

## Mentor Note
Yeh document working professionals ke liye hai jo Express se NestJS ki taraf move kar rahe hain. Har concept ko real-life analogy ke saath samjhaya gaya hai.

---

## 1. Why NestJS? — Express ki Problems at Scale

### Real-Life Analogy (Hinglish)
Socho Express ek freelancer ki tarah hai — akele kaam ke liye perfect, but jab company badi ho jaaye aur 10 log saath kaam karein, toh chaos ho jaata hai. NestJS ek proper company structure ki tarah hai — har department ka role defined hai, koi bhi kisi ke kaam mein interfere nahi karta.

### Express ki Problems
```
Plain Express mein:
- Koi fixed structure nahi hota — ek developer files ek jagah rakhta hai, doosra kahin aur
- Business logic, route handling, DB calls — sab ek hi file mein milte hain
- Jaise project bada hota hai, "spaghetti code" ban jaata hai
- Testing mushkil ho jaati hai kyunki sab kuch tightly coupled hota hai
- New developer ko samajhna mushkil hota hai ki code kahan se start karein
```

### NestJS kya add karta hai?
```
1. Structure     — Modules, Controllers, Services ka clear separation
2. DI            — Dependency Injection (objects ko manually create nahi karna)
3. Decorators    — @Controller, @Get, @Injectable — Angular jaisa feel
4. TypeScript    — First-class support
5. Testing       — Unit testing easy because of DI
6. Scalability   — Large teams mein kaam karna easy
```

---

## 2. NestJS Architecture — Company Departments Analogy

### Analogy
```
Ek company ki tarah socho:

Module    = Department (HR, Sales, Engineering)
           — Har department apni responsibility handle karta hai

Controller = Receptionist
           — Bahar se aane wali requests receive karta hai
           — Kisi aur ko kaam delegate karta hai, khud process nahi karta

Service   = Expert Employee / Specialist
           — Actual kaam karta hai (business logic)
           — Controller ne kaha "yeh karo", Service ne kiya

Provider  = Koi bhi jo inject ho sake (Services, Repositories, Factories)
           — Company ka koi bhi resource jo kisi ko bhi diya ja sake
```

---

## 3. Setup — NestJS CLI aur Project Structure

```bash
# NestJS CLI globally install karo
npm install -g @nestjs/cli

# Naya project banao
nest new notes-api

# Project structure:
notes-api/
├── src/
│   ├── app.controller.ts    # Root controller
│   ├── app.module.ts        # Root module — poori app ka entry point
│   ├── app.service.ts       # Root service
│   └── main.ts              # Bootstrap file — app start hoti hai yahaan se
├── test/
├── package.json
└── tsconfig.json
```

```typescript
// main.ts — App Bootstrap
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // NestJS app create karo
  const app = await NestFactory.create(AppModule);

  // Global validation pipe — har request pe validation lagao
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // Extra fields automatically remove ho jaayenge
    forbidNonWhitelisted: true, // Extra fields pe error throw karega
    transform: true,        // String se number/boolean automatically convert karega
  }));

  // CORS enable karo (frontend se requests aane ke liye)
  app.enableCors();

  await app.listen(3000);
  console.log('NestJS app chal rahi hai port 3000 pe!');
}
bootstrap();
```

---

## 4. Controllers — Route Handling

### CLI se controller banao
```bash
nest generate controller notes
# shorthand: nest g co notes
```

```typescript
// notes/notes.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

// @Controller('notes') — yeh class /notes route handle karegi
@Controller('notes')
export class NotesController {
  // Constructor injection — NestJS automatically NotesService inject karega
  constructor(private readonly notesService: NotesService) {}

  // GET /notes — saari notes laao
  @Get()
  findAll() {
    return this.notesService.findAll();
  }

  // GET /notes?search=react — search ke saath notes laao
  @Get('search')
  searchNotes(@Query('q') searchTerm: string) {
    // @Query('q') URL se ?q=react parameter read karta hai
    return this.notesService.search(searchTerm);
  }

  // GET /notes/:id — ek specific note laao
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    // ParseIntPipe — string "5" ko number 5 mein convert karta hai
    return this.notesService.findOne(id);
  }

  // POST /notes — nayi note banao
  @Post()
  @HttpCode(HttpStatus.CREATED) // 201 status code return karega
  create(@Body() createNoteDto: CreateNoteDto) {
    // @Body() — request body read karta hai
    return this.notesService.create(createNoteDto);
  }

  // PUT /notes/:id — note update karo
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(id, updateNoteDto);
  }

  // DELETE /notes/:id — note delete karo
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 — deletion pe content nahi hota
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.remove(id);
  }
}
```

---

## 5. Services — Business Logic

```typescript
// notes/notes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

// @Injectable() — yeh class inject ho sakti hai (DI container mein register hoti hai)
@Injectable()
export class NotesService {
  constructor(
    // TypeORM repository inject karo
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  // Saari notes laao
  async findAll(): Promise<Note[]> {
    return this.notesRepository.find({
      order: { createdAt: 'DESC' }, // Latest pehle
    });
  }

  // ID se ek note laao
  async findOne(id: number): Promise<Note> {
    const note = await this.notesRepository.findOne({ where: { id } });

    // Agar note nahi mila toh 404 throw karo
    if (!note) {
      throw new NotFoundException(`Note #${id} nahi mila!`);
    }

    return note;
  }

  // Search karo
  async search(searchTerm: string): Promise<Note[]> {
    if (!searchTerm) return this.findAll();

    // TypeORM QueryBuilder se search karo
    return this.notesRepository
      .createQueryBuilder('note')
      .where('note.title ILIKE :search OR note.content ILIKE :search', {
        search: `%${searchTerm}%`,
      })
      .getMany();
  }

  // Nayi note banao
  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    // DTO se entity banao
    const note = this.notesRepository.create(createNoteDto);
    // Database mein save karo
    return this.notesRepository.save(note);
  }

  // Note update karo
  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    // Pehle check karo ki note exist karta hai
    const note = await this.findOne(id);

    // Fields update karo
    Object.assign(note, updateNoteDto);

    return this.notesRepository.save(note);
  }

  // Note delete karo
  async remove(id: number): Promise<void> {
    const note = await this.findOne(id);
    await this.notesRepository.remove(note);
  }
}
```

---

## 6. Modules — App Organization

```typescript
// notes/notes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';

@Module({
  imports: [
    // TypeORM ko batao ki Note entity is module mein use hogi
    TypeOrmModule.forFeature([Note]),
  ],
  controllers: [NotesController], // Kaun kaun se controllers hain is module mein
  providers: [NotesService],      // Kaun kaun se services hain
  exports: [NotesService],        // Doosre modules ko bhi NotesService chahiye ho sakti hai
})
export class NotesModule {}
```

```typescript
// app.module.ts — Root Module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotesModule } from './notes/notes.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Environment variables ke liye
    ConfigModule.forRoot({ isGlobal: true }),

    // Database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Production mein false karo!
      }),
      inject: [ConfigService],
    }),

    // Feature modules import karo
    NotesModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
```

---

## 7. Dependency Injection — NestJS ka Magic

### Analogy
```
DI ek "delivery service" ki tarah hai:
- Tumhara ghar (class) keh deta hai: "Mujhe pizza chahiye"
- Tum khud pizza banane nahi jaate
- Delivery service (NestJS DI container) khud pizza banake tumhare ghar deliver kar deta hai

Bina DI ke:
  const service = new NotesService(new NoteRepository(new DbConnection()));
  // Har jagah yeh likhna padta — tightly coupled!

DI ke saath:
  constructor(private notesService: NotesService) {}
  // NestJS khud inject karta hai — loosely coupled!
```

---

## 8. DTOs and Validation

```bash
npm install class-validator class-transformer
```

```typescript
// notes/dto/create-note.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';

// Enum for note categories
export enum NoteCategory {
  WORK = 'work',
  PERSONAL = 'personal',
  LEARNING = 'learning',
}

export class CreateNoteDto {
  @IsString({ message: 'Title string hona chahiye' })
  @IsNotEmpty({ message: 'Title empty nahi ho sakta' })
  @MinLength(3, { message: 'Title kam se kam 3 characters ka hona chahiye' })
  @MaxLength(100, { message: 'Title 100 characters se zyada nahi ho sakta' })
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional() // Optional field — nahi diya toh bhi chalega
  @IsEnum(NoteCategory, { message: 'Category galat hai' })
  category?: NoteCategory;
}
```

```typescript
// notes/dto/update-note.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';

// PartialType — CreateNoteDto ke saare fields optional ban jaate hain
// Update mein sirf woh fields bhejo jo change karne hain
export class UpdateNoteDto extends PartialType(CreateNoteDto) {}
```

---

## 9. Guards — Authentication & Authorization

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

```typescript
// auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      // JWT token Bearer header se extract karo
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  // JWT valid hai toh yeh function call hoga
  async validate(payload: { sub: number; email: string }) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Token invalid hai!');
    }
    return user; // Yeh request.user mein available ho jaayega
  }
}
```

```typescript
// auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Yeh guard route ko protect karta hai — JWT token valid hona chahiye
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

```typescript
// auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Route pe kaun se roles allowed hain yeh check karo
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Agar roles define nahi hain, toh sab ko access hai
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

```typescript
// Controller mein guard use karo
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard) // Poore controller pe guard lagao
export class NotesController {
  // Yeh sab routes ab protected hain — JWT token chahiye
}
```

---

## 10. Interceptors — Request/Response Transformation

```typescript
// common/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const startTime = Date.now();

    this.logger.log(`Incoming Request: ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        // Response aane ke baad time log karo
        const responseTime = Date.now() - startTime;
        this.logger.log(`Response: ${method} ${url} — ${responseTime}ms`);
      }),
    );
  }
}
```

```typescript
// common/interceptors/transform.interceptor.ts — Consistent API response format
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

---

## 11. Exception Filters — Error Handling

```typescript
// common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

// @Catch(HttpException) — sirf HttpException handle karo
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message,
    };

    this.logger.error(`${request.method} ${request.url} — ${status}`);

    response.status(status).json(errorResponse);
  }
}
```

---

## 12. NestJS with TypeORM — Entity aur Repository

```typescript
// notes/entities/note.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notes') // Database table ka naam
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  category: string;

  // Many notes belong to one user (Many-to-One relation)
  @ManyToOne(() => User, (user) => user.notes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

```typescript
// users/entities/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Note } from '../../notes/entities/note.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string; // Hashed password store hoga

  @Column({ default: 'user' })
  role: string;

  // One user ke many notes ho sakte hain (One-to-Many)
  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Insert hone se pehle password hash karo
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
```

---

## 13. Complete Notes API — Auth ke Saath

```typescript
// auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Register karo
  async register(registerDto: RegisterDto) {
    // Pehle check karo ki email already exist toh nahi karta
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Yeh email already registered hai!');
    }

    const user = await this.usersService.create(registerDto);

    // Password return mat karo
    const { password, ...result } = user;
    return result;
  }

  // Login karo
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    // User nahi mila ya password galat hai
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Email ya password galat hai!');
    }

    // JWT token banao
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
```

```typescript
// auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

```typescript
// auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail({}, { message: 'Valid email address daalein' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password kam se kam 8 characters ka hona chahiye' })
  password: string;
}
```

```typescript
// notes/notes.controller.ts — Updated with Auth
import {
  Controller, Get, Post, Put, Delete,
  Param, Query, Body, UseGuards, Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
@UseGuards(JwtAuthGuard) // Saare routes protected hain
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(@Request() req) {
    // Sirf logged-in user ki notes return karo
    return this.notesService.findAllByUser(req.user.id);
  }

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    return this.notesService.create(createNoteDto, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req,
  ) {
    return this.notesService.update(id, updateNoteDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.notesService.remove(id, req.user.id);
  }
}
```

---

## Common Mistakes (Galtiyan Jo Har Koi Karta Hai)

```
1. synchronize: true Production mein use karna
   — Database schema automatically change ho jaata hai — DATA LOSS!
   — Fix: Migrations use karo

2. DTO validation use nahi karna
   — Raw input directly database mein jaata hai — SQL injection risk!
   — Fix: class-validator ke saath ValidationPipe use karo

3. Circular dependency
   — Module A, Module B ko import karta hai aur Module B, Module A ko
   — Fix: forwardRef() use karo ya shared module banao

4. Service mein doosri Service directly import karna (new keyword se)
   — DI ka faayda nahi milta, testing mushkil
   — Fix: Constructor injection use karo

5. @Module mein providers aur exports confuse karna
   — providers = is module ke andar available
   — exports = doosre modules ko bhi dena hai
```

---

## Interview Questions & Answers

**Q1: NestJS aur Express mein kya fark hai?**
A: Express minimal aur unopinionated hai — koi structure enforce nahi karta. NestJS opinionated hai — Modules/Controllers/Services pattern enforce karta hai. NestJS mein built-in DI, decorators, aur TypeScript-first approach hai. Large teams aur enterprise apps ke liye NestJS better hai.

**Q2: Dependency Injection kya hai?**
A: DI ek pattern hai jahan objects apni dependencies khud create nahi karte — bahar se inject ki jaati hain. NestJS mein `@Injectable()` decorator lagaao, constructor mein declare karo, aur NestJS automatically instance create karke inject kar deta hai. Isse testing easy hoti hai (mock inject kar sakte ho) aur loose coupling milta hai.

**Q3: Guards, Interceptors, aur Middleware mein kya fark hai?**
A: 
- Middleware: Request/Response ko modify kare, authentication ke liye. DI support nahi.
- Guards: Route access allow/deny kare. DI support hai. `canActivate()` return karta hai.
- Interceptors: Request aane se pehle aur response jaane se pehle dono mein kuch karo (logging, transformation).

**Q4: `@Module` ke `imports` aur `providers` mein kya fark hai?**
A: `providers` mein woh services/classes hain jo is module ne banaye hain. `imports` mein woh doosre modules hain jinki exports hum use karna chahte hain.

**Q5: Circular Dependency kaise resolve karein?**
A: `forwardRef(() => OtherModule)` use karo imports mein, aur `@Inject(forwardRef(() => OtherService))` use karo constructor mein.

---

## Assignment

**Task: Blog API banao NestJS mein**

Requirements:
1. User registration aur login (JWT auth)
2. Posts CRUD — sirf logged-in users kar sakein
3. Comments — ek post pe multiple comments
4. Only comment author apna comment delete kar sakein
5. Admin role wala koi bhi kuch bhi delete kar sake (RolesGuard)
6. ValidationPipe aur proper DTOs use karo
7. Custom exception filter lagao jo consistent error format de
8. LoggingInterceptor lagao jo har request ka time log kare

**Bonus:**
- Pagination implement karo (page, limit query params)
- Search by title implement karo
- Swagger documentation add karo (`@nestjs/swagger`)

**Test karne ke liye:**
```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'

# Login aur token lo
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Notes create karo (token replace karo)
curl -X POST http://localhost:3000/notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Meri Pehli Note","content":"NestJS seekh raha hoon!"}'
```
