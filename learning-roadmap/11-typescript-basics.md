# TypeScript Basics — Full-Stack Mentorship Program
### Module 11 — JavaScript Developers ke liye TypeScript

---

## 1. TypeScript Kyun? (What Problems Does It Solve?)

### Real-Life Analogy
JavaScript ek aise restaurant jaisi hai jahan koi menu nahi — kuch bhi order karo, chef koshish karega. TypeScript menu ke saath restaurant hai — pehle se pata hai kya milega, kya nahi. Galat order hi nahi hoga.

### Real bugs jo TypeScript prevent karta hai:

```javascript
// ❌ JavaScript mein — ye bugs production mein aate hain
function calculateDiscount(price, percent) {
  return price * (percent / 100); // percent string aa gayi toh?
}

calculateDiscount(1000, "10");     // "10" string hai! Result: "100" (string!)
calculateDiscount(1000, undefined); // NaN — silent failure!
calculateDiscount("thousand", 10);  // NaN again

// User object se property access
const user = getUser(); // returns null kabhi kabhi
console.log(user.name); // 💥 Cannot read property 'name' of null
```

```typescript
// ✅ TypeScript mein — compile time pe hi pakad leta hai
function calculateDiscount(price: number, percent: number): number {
  return price * (percent / 100);
}

calculateDiscount(1000, "10");   // ❌ Error: string is not assignable to number
calculateDiscount(1000, undefined); // ❌ Error: undefined not assignable to number

// Null safety
const user = getUser(); // return type: User | null
console.log(user.name); // ❌ Error: Object is possibly null
console.log(user?.name); // ✅ Optional chaining — safe hai
```

### Why TypeScript matters professionally:
- **Self-documenting code** — Function signature se pata chalta hai kya input/output chahiye
- **Refactoring safe** — File rename, function signature change → TypeScript batayega kahan kahan update karna hai
- **Team collaboration** — Tumhara code doosra developer confidently use kar sakta hai
- **Industry standard** — Most companies TypeScript use karti hain ab

---

## 2. Setup

### Installation & Configuration

```bash
# TypeScript install karo
npm install -g typescript          # globally
npm install --save-dev typescript  # project mein (recommended)

# ts-node — TypeScript directly run karo (compile kiye bina)
npm install -g ts-node
npm install --save-dev ts-node

# TypeScript version check
tsc --version

# Node.js project ke liye setup
mkdir my-ts-project && cd my-ts-project
npm init -y
npm install --save-dev typescript ts-node @types/node nodemon

# tsconfig.json banao
npx tsc --init
```

```json
// tsconfig.json — TypeScript configuration
{
  "compilerOptions": {
    "target": "ES2020",          // kaunsa JavaScript version output chahiye
    "module": "commonjs",        // Node.js ke liye commonjs
    "lib": ["ES2020"],           // available APIs
    "outDir": "./dist",          // compiled JS files yahan jayenge
    "rootDir": "./src",          // TypeScript files yahan hain
    "strict": true,              // sab strict checks on (recommended!)
    "esModuleInterop": true,     // import karne ka modern way
    "skipLibCheck": true,        // d.ts files skip karo (faster builds)
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,   // JSON files import kar sakte ho
    "declaration": true,         // .d.ts files generate karo (libraries ke liye)
    "sourceMap": true            // debugging ke liye source maps
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

```json
// package.json scripts
{
  "scripts": {
    "build": "tsc",
    "dev": "nodemon --exec ts-node src/index.ts",
    "start": "node dist/index.js"
  }
}
```

```bash
# React + TypeScript (Vite)
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
npm run dev
```

---

## 3. Basic Types

```typescript
// ===== PRIMITIVE TYPES =====

// String
let name: string = "Ajinkya";
let greeting: string = `Hello, ${name}!`;  // template literals bhi

// Number — int aur float alag nahi hote TypeScript mein
let age: number = 25;
let price: number = 99.99;
let hex: number = 0xff;

// Boolean
let isLoggedIn: boolean = false;
let hasPermission: boolean = true;

// ===== SPECIAL TYPES =====

// null aur undefined — strict mode mein explicitly handle karna padta hai
let data: null = null;
let notAssigned: undefined = undefined;

// Agar dono allow karne hain:
let value: string | null = null;
value = "hello"; // ✅ allowed
value = 42;      // ❌ Error

// any — TypeScript ko disabled karna (AVOID KARO!)
let anything: any = "string";
anything = 42;          // ✅ no error
anything = {};          // ✅ no error
anything.nonExistent(); // ✅ no error — TYPE SAFETY GONE!

// Kab use karo: Legacy code migrate karte waqt, third-party libraries jinka types nahi hain
// Kab nahi use karo: Apna naya code — unknown use karo

// unknown — any se safe alternative
let userInput: unknown = "hello";
// Pehle type check karo, phir use karo
if (typeof userInput === "string") {
  console.log(userInput.toUpperCase()); // ✅ TypeScript ko pata hai ye string hai
}
// userInput.toUpperCase(); // ❌ Error: Object is of type 'unknown'

// never — function jo kabhi return nahi karta
function throwError(message: string): never {
  throw new Error(message);
  // Yahan pahunchna impossible hai, isliye return type 'never'
}

function infiniteLoop(): never {
  while (true) {}
}

// void — function jo value return nahi karta (undefined return karta hai actually)
function logMessage(msg: string): void {
  console.log(msg);
  // return statement allowed nahi
}
```

---

## 4. Type Annotations

```typescript
// ===== VARIABLES =====
const username: string = "ajinkya";
let count: number = 0;
let isActive: boolean = true;

// Type inference — TypeScript khud samajh jaata hai (annotation optional)
const inferred = "hello";  // TypeScript janta hai ye string hai
// inferred = 42;           // ❌ Error: Type 'number' not assignable to 'string'

// Kab annotation likho, kab nahi:
const obvious = "hello";       // annotation mat likho — clear hai
const result = fetchData();    // annotation likho — return type clear nahi
let count2: number = 0;        // annotation likho — future mein type change ho sakta hai

// ===== FUNCTIONS =====

// Parameter types + return type
function add(a: number, b: number): number {
  return a + b;
}

// Optional parameters (? lagao)
function greet(name: string, title?: string): string {
  return title ? `Hello, ${title} ${name}!` : `Hello, ${name}!`;
}
greet("Ajinkya");           // ✅
greet("Ajinkya", "Dr.");    // ✅

// Default parameters
function createUser(name: string, role: string = "user"): void {
  console.log(`Creating ${role}: ${name}`);
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4, 5); // ✅

// Arrow functions
const multiply = (a: number, b: number): number => a * b;

// Function type annotation
type MathOperation = (a: number, b: number) => number;
const divide: MathOperation = (a, b) => a / b;

// Async functions
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

---

## 5. Interfaces vs Types

```typescript
// ===== INTERFACE =====
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;  // optional property
  readonly createdAt: Date;  // sirf read kar sakte ho, change nahi
}

// Interface use karna
const user: User = {
  id: 1,
  name: "Ajinkya",
  email: "ajinkya@example.com",
  createdAt: new Date()
};

// user.createdAt = new Date(); // ❌ Error: readonly property

// Interface extend karna
interface AdminUser extends User {
  role: "admin" | "superadmin";
  permissions: string[];
}

const admin: AdminUser = {
  id: 1,
  name: "Ajinkya",
  email: "ajinkya@example.com",
  createdAt: new Date(),
  role: "admin",
  permissions: ["read", "write", "delete"]
};

// ===== TYPE ALIAS =====
type Point = {
  x: number;
  y: number;
};

type StringOrNumber = string | number;  // Union type — sirf type se possible
type ID = string | number;

// Type intersection (combining)
type Employee = User & {
  department: string;
  salary: number;
};

// ===== INTERFACE VS TYPE — KAB KYA USE KAREIN? =====
// Interface use karo:
//   - Objects/classes ke liye
//   - Extend karna ho (inheritance-like)
//   - Public API define karna ho (libraries)
//   - Ek hi naam se multiple declarations merge karni ho (declaration merging)

// Type use karo:
//   - Union types ke liye: type Result = Success | Error
//   - Primitive aliases ke liye: type ID = string
//   - Tuple types ke liye: type Pair = [string, number]
//   - Computed types ke liye: type Keys = keyof SomeInterface

// Interface mein declaration merging hoti hai (type mein nahi):
interface Window {
  myCustomProperty: string;  // existing Window interface mein add ho jaata hai
}

// Practical rule: Object shapes ke liye interface prefer karo,
// complex type expressions ke liye type use karo
```

---

## 6. Arrays and Objects

```typescript
// ===== TYPED ARRAYS =====
const names: string[] = ["Ajinkya", "Rahul", "Priya"];
const scores: number[] = [95, 87, 92];
const flags: boolean[] = [true, false, true];

// Alternative syntax (same thing)
const names2: Array<string> = ["Ajinkya", "Rahul", "Priya"];

// Array of objects
interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "Laptop", price: 50000 },
  { id: 2, name: "Mouse", price: 500 }
];

// Readonly arrays — mutate nahi kar sakte
const immutableList: readonly string[] = ["a", "b", "c"];
// immutableList.push("d"); // ❌ Error
// immutableList[0] = "z";  // ❌ Error

// ===== TUPLES — fixed length, fixed type arrays =====
type Coordinate = [number, number];
const location: Coordinate = [18.5204, 73.8567];  // Pune coordinates

type UserTuple = [string, number, boolean];
const userInfo: UserTuple = ["Ajinkya", 25, true];
const [userName, userAge, isVerified] = userInfo;  // destructuring

// ===== TYPED OBJECTS =====
interface Config {
  host: string;
  port: number;
  ssl: boolean;
  options?: {         // nested optional object
    timeout: number;
    retries: number;
  };
}

const dbConfig: Config = {
  host: "localhost",
  port: 5432,
  ssl: false,
  options: {
    timeout: 5000,
    retries: 3
  }
};

// Index signatures — dynamic keys ke liye
interface StringMap {
  [key: string]: string;  // koi bhi string key, string value
}

const translations: StringMap = {
  hello: "namaste",
  bye: "alvida",
  thanks: "shukriya"
};

// Record type — cleaner way for same thing
const errors: Record<string, string> = {
  "404": "Not Found",
  "500": "Server Error"
};
```

---

## 7. Union and Intersection Types

```typescript
// ===== UNION TYPES — A ya B ya C =====
type Status = "pending" | "active" | "inactive" | "banned";
type ID = string | number;
type StringOrNumber = string | number;

// Function with union type
function formatId(id: ID): string {
  if (typeof id === "string") {
    return id.toUpperCase();
  }
  return id.toString();
}

formatId("abc-123");  // ✅
formatId(42);         // ✅
formatId(true);       // ❌ Error

// Real example: API response jo success ya error dono ho sakti hai
type ApiResponse = 
  | { success: true; data: User[] }
  | { success: false; error: string };

function handleResponse(response: ApiResponse) {
  if (response.success) {
    console.log(response.data);    // TypeScript janta hai data hai
  } else {
    console.log(response.error);   // TypeScript janta hai error hai
  }
}

// ===== INTERSECTION TYPES — A aur B dono =====
interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

interface SoftDelete {
  deletedAt: Date | null;
  isDeleted: boolean;
}

// Dono mila do
type DatabaseRecord = User & Timestamps & SoftDelete;

const record: DatabaseRecord = {
  id: 1,
  name: "Ajinkya",
  email: "ajinkya@example.com",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  isDeleted: false
};
```

---

## 8. Generics — TypeScript ki Superpower

### Real-Life Analogy
Generic ek container box jaisi hai — box same hai, andar kya hai wo choose karte ho. Ek box toys ke liye, ek clothes ke liye. Box ka design ek hi hai.

```typescript
// ===== BASIC GENERICS =====

// Without generics — har type ke liye alag function
function getFirstString(arr: string[]): string { return arr[0]; }
function getFirstNumber(arr: number[]): number { return arr[0]; }
// Ye bakwaas hai — duplicate code!

// With generics — ek function, sab types ke liye
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

getFirst<string>(["a", "b", "c"]);  // string
getFirst<number>([1, 2, 3]);         // number
getFirst(["a", "b"]);                // TypeScript khud samajh jaata hai — string!

// ===== GENERIC FUNCTIONS — PRACTICAL EXAMPLES =====

// Typed fetch — API calls ke liye
async function typedFetch<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json() as T;  // T type ki response expect kar rahe hain
}

// Use karna:
interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
}

// Ab TypeScript janta hai kya milega!
const user = await typedFetch<User>("/api/users/1");
console.log(user.name);  // ✅ TypeScript janta hai .name hai

const posts = await typedFetch<Post[]>("/api/posts");
console.log(posts[0].title);  // ✅

// Generic with constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user2 = { id: 1, name: "Ajinkya", email: "a@b.com" };
getProperty(user2, "name");   // ✅ string return karega
getProperty(user2, "id");     // ✅ number return karega
getProperty(user2, "xyz");    // ❌ Error: "xyz" is not a key of user

// ===== GENERICS WITH REACT =====

// Generic useState (TypeScript automatically infer karta hai mostly)
import { useState } from "react";

// Explicit typing
const [user, setUser] = useState<User | null>(null);
const [users, setUsers] = useState<User[]>([]);
const [count, setCount] = useState<number>(0);

// Jab initial value se infer nahi ho sakta, tab explicit lagao
const [data, setData] = useState<User | null>(null);  // null se pata nahi chalta

// Generic custom hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

// Use karo:
const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
const [savedUser, setSavedUser] = useLocalStorage<User | null>("user", null);
```

---

## 9. Enums

```typescript
// ===== REGULAR ENUM =====
enum Direction {
  Up,     // 0
  Down,   // 1
  Left,   // 2
  Right   // 3
}

const move = (dir: Direction) => {
  console.log(`Moving ${Direction[dir]}`);
};

move(Direction.Up);    // "Moving Up"
move(0);              // ✅ bhi kaam karta hai (number enum)

// ===== STRING ENUM — Recommended! =====
// String enums debug karna aasaan hai
enum UserRole {
  Admin = "ADMIN",
  User = "USER",
  Moderator = "MODERATOR",
  Guest = "GUEST"
}

function checkAccess(role: UserRole): boolean {
  return role === UserRole.Admin || role === UserRole.Moderator;
}

checkAccess(UserRole.Admin);  // true
checkAccess("ADMIN");         // ❌ Error — type safety!

// ===== CONST ENUM — Best performance =====
// Compiled output mein enum reference nahi hoga — direct value use hogi
const enum HttpStatus {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500
}

function handleStatus(status: HttpStatus) {
  switch (status) {
    case HttpStatus.Ok:
      return "Success";
    case HttpStatus.NotFound:
      return "Not found";
    default:
      return "Unknown";
  }
}

// Enum vs Union Type — Modern TypeScript mein union prefer karo
// Enum:
enum Color { Red = "RED", Green = "GREEN", Blue = "BLUE" }

// Union (simpler, no runtime overhead):
type ColorType = "RED" | "GREEN" | "BLUE";

// Dono kaam karte hain, union aajkal zyada use hoti hai
```

---

## 10. Type Narrowing

```typescript
// TypeScript kaise samajhta hai kya type hai runtime pe

// ===== typeof NARROWING =====
function processInput(input: string | number): string {
  if (typeof input === "string") {
    // Yahan TypeScript JANTA hai input = string
    return input.toUpperCase();
  }
  // Yahan TypeScript JANTA hai input = number
  return input.toFixed(2);
}

// ===== instanceof NARROWING =====
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

function handleError(error: Error | ApiError) {
  if (error instanceof ApiError) {
    // Yahan TypeScript janta hai ye ApiError hai
    console.log(`HTTP ${error.statusCode}: ${error.message}`);
  } else {
    console.log(`Error: ${error.message}`);
  }
}

// ===== in OPERATOR NARROWING =====
interface Dog {
  type: "dog";
  bark(): void;
}

interface Cat {
  type: "cat";
  meow(): void;
}

type Pet = Dog | Cat;

function makePetSound(pet: Pet) {
  if ("bark" in pet) {
    pet.bark();  // TypeScript janta hai ye Dog hai
  } else {
    pet.meow();  // TypeScript janta hai ye Cat hai
  }
}

// ===== DISCRIMINATED UNIONS — Best practice =====
// Common "type" field se narrow karo
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;  // TypeScript janta hai .radius hai
    case "rectangle":
      return shape.width * shape.height;   // TypeScript janta hai .width, .height
    case "triangle":
      return 0.5 * shape.base * shape.height;
    // default nahi chahiye — TypeScript sab cases cover check karta hai
  }
}

// ===== TYPE GUARDS — Custom narrowing functions =====
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    "email" in obj
  );
}

const unknownData: unknown = await fetchSomething();
if (isUser(unknownData)) {
  console.log(unknownData.name);  // ✅ TypeScript janta hai ye User hai
}
```

---

## 11. Utility Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  createdAt: Date;
}

// ===== Partial<T> — sab properties optional bana do =====
// Use case: Update operations mein sirf kuch fields update karne hain
type UserUpdate = Partial<User>;
// { id?: number; name?: string; email?: string; ... }

async function updateUser(id: number, updates: Partial<User>): Promise<User> {
  // Sirf wahi fields update honge jo updates mein hain
  return await db.users.update({ where: { id }, data: updates });
}

updateUser(1, { name: "Ajinkya Updated" });  // ✅ sirf naam update

// ===== Required<T> — sab properties required bana do =====
interface DraftPost {
  title?: string;
  content?: string;
  tags?: string[];
}

type PublishedPost = Required<DraftPost>;
// { title: string; content: string; tags: string[] } — sab required!

// ===== Pick<T, Keys> — sirf kuch properties lo =====
// Use case: API response se sirf kuch fields return karo (password nahi!)
type PublicUser = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string }

function getPublicProfile(user: User): PublicUser {
  return { id: user.id, name: user.name, email: user.email };
  // password, role, createdAt nahi jayenge
}

// ===== Omit<T, Keys> — kuch properties hata do =====
type UserWithoutPassword = Omit<User, "password">;
// User ke sab fields minus password

type CreateUserDTO = Omit<User, "id" | "createdAt">;
// id aur createdAt DB banayegi, user nahi bhejega

// ===== Record<Keys, Values> — object type create karo =====
type UserRolePermissions = Record<"admin" | "user" | "guest", string[]>;

const permissions: UserRolePermissions = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"]
};

// Status codes map
type StatusMessages = Record<number, string>;
const httpMessages: StatusMessages = {
  200: "OK",
  404: "Not Found",
  500: "Internal Server Error"
};

// ===== ReturnType<T> — function ka return type lo =====
function createSession(userId: number) {
  return {
    token: "jwt-token-here",
    expiresAt: new Date(),
    userId
  };
}

type Session = ReturnType<typeof createSession>;
// { token: string; expiresAt: Date; userId: number }
// Baar baar type likhne ki zarurat nahi!

// ===== Readonly<T> — sab properties readonly bana do =====
type ImmutableUser = Readonly<User>;
// const immutableUser: ImmutableUser = { ... };
// immutableUser.name = "changed"; // ❌ Error!

// ===== Parameters<T> — function parameters ka tuple type =====
function createOrder(
  userId: number,
  items: string[],
  discount: number
): void {}

type CreateOrderParams = Parameters<typeof createOrder>;
// [userId: number, items: string[], discount: number]
```

---

## 12. TypeScript with Express

```typescript
// types/express.d.ts — Global type augmentation
import { User } from "./models/user";

declare global {
  namespace Express {
    interface Request {
      user?: User;      // auth middleware ke baad available hoga
      requestId?: string;
    }
  }
}

// controllers/userController.ts
import { Request, Response, NextFunction } from "express";

// Typed request body
interface CreateUserBody {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}

// Typed query parameters
interface GetUsersQuery {
  page?: string;
  limit?: string;
  search?: string;
}

// Typed URL params
interface UserParams {
  id: string;
}

// Har ek typed
export const createUser = async (
  req: Request<{}, {}, CreateUserBody>,  // params, query, body
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role = "user" } = req.body;
    // TypeScript janta hai req.body mein kya hai!

    // Validate
    if (!name || !email || !password) {
      res.status(400).json({ error: "All fields required" });
      return;
    }

    const user = await UserService.create({ name, email, password, role });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request<{}, {}, {}, GetUsersQuery>,
  res: Response
): Promise<void> => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");

  const users = await UserService.findAll({ page, limit });
  res.json({ data: users });
};

// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];  // "Bearer TOKEN"

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      email: string;
    };

    const user = await UserService.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    req.user = user;  // TypeScript janta hai ye User type hai (augmentation ki wajah se)
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
```

---

## 13. TypeScript with React

```typescript
// ===== TYPING PROPS =====
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  children?: React.ReactNode;  // koi bhi React content
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  disabled = false
}) => (
  <button
    className={`btn btn-${variant}`}
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
);

// ===== TYPING EVENTS =====
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // form data process karo
};

const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log("clicked");
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    // submit
  }
};

// ===== TYPING useState =====
interface FormData {
  name: string;
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value  // computed property
    }));
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input name="email" value={formData.email} onChange={handleChange} />
      {error && <p className="error">{error}</p>}
    </form>
  );
};

// ===== TYPING useRef =====
const inputRef = useRef<HTMLInputElement>(null);
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

// inputRef.current?.focus();  // optional chaining kyunki null ho sakta hai

// ===== TYPED CUSTOM HOOKS =====
interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useApi<T>(url: string): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const json: T = await response.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [url]);

  return { data, loading, error, refetch: fetchData };
}

// Use karo:
const { data: users, loading, error } = useApi<User[]>("/api/users");
// TypeScript janta hai users ka type User[] | null hai
```

---

## 14. Common Mistakes

```typescript
// ❌ MISTAKE 1: any overuse karna
const handleData = (data: any) => {
  data.forEach((item: any) => {  // har jagah any
    console.log(item.name);  // no type safety
  });
};

// ✅ FIX: proper types use karo
interface DataItem {
  name: string;
  value: number;
}

const handleData2 = (data: DataItem[]) => {
  data.forEach((item) => {
    console.log(item.name);  // TypeScript checks karta hai
  });
};

// ❌ MISTAKE 2: API responses type nahi karna
const fetchUser2 = async (id: number) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();  // return type: any! Danger!
};

// ✅ FIX:
const fetchUser3 = async (id: number): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error("User not found");
  return response.json() as User;  // explicit cast
};

// ❌ MISTAKE 3: ! operator abuse (non-null assertion)
const name = user!.name;  // "I guarantee user is not null" — but kya really?
const port = process.env.PORT!;  // PORT undefined ho sakti hai!

// ✅ FIX: actually check karo
if (!user) throw new Error("User required");
const name2 = user.name;  // ab safe hai

const port2 = process.env.PORT;
if (!port2) throw new Error("PORT env var required");
const portNum = parseInt(port2);

// ❌ MISTAKE 4: Errors ignore karna
try {
  await doSomething();
} catch (error) {
  console.log(error.message);  // ❌ TypeScript: error is 'unknown'
}

// ✅ FIX:
try {
  await doSomething();
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);  // ✅ safe
  } else {
    console.log(String(error));
  }
}

// ❌ MISTAKE 5: tsconfig mein strict: false
// "strict: false karo toh errors kam aate hain" — ye galat soch hai
// strict: true rakho, errors fix karo — wahi TypeScript ka benefit hai

// ❌ MISTAKE 6: Type assertion overuse
const data6 = fetchData() as User;  // TypeScript ko "trust me" bata rahe ho
// Sirf jab SURE ho ki ye type hai tab use karo

// ✅ Use type guards instead:
function isUser2(data: unknown): data is User {
  return typeof data === "object" && data !== null && "id" in data;
}
```

---

## Interview Questions & Answers

**Q1: TypeScript aur JavaScript mein kya fark hai?**
> TypeScript JavaScript ka superset hai — sab valid JS valid TS hai. TypeScript static typing add karta hai jo compile time pe errors pakadta hai. Browser TypeScript nahi samajhta — pehle JS mein compile hota hai.

**Q2: Interface aur Type mein kya prefer karte ho aur kyun?**
> Objects ke liye interface prefer karta hun — extend ho sakta hai, declaration merging hoti hai, aur intent clear hota hai. Complex types ke liye (unions, intersections, mapped types) type alias use karta hun.

**Q3: `any` aur `unknown` mein kya fark hai?**
> `any` type checking disable karta hai — kisi bhi property access, kisi bhi method call allowed. `unknown` safe alternative hai — use karne se pehle type check karna padta hai. `unknown` prefer karo jab type pata nahi.

**Q4: Generic kyun use karte hain?**
> Code reuse ke liye bina type safety compromise kiye. Ek `typedFetch<T>` function kisi bhi type ke liye kaam karta hai aur return type TypeScript janta hai. Without generics ya duplicate functions likhne padte ya `any` use karna padta.

**Q5: `as const` kya karta hai?**
> Object/array ko immutable banata hai aur TypeScript literal types infer karta hai. `const colors = ["red", "blue"] as const` — type `string[]` nahi, `readonly ["red", "blue"]` hota hai — sirf ye do values allowed.

---

## Assignment

### Task 1 — Basic Types
TypeScript file mein ek `UserProfile` interface banao jo ye fields cover kare: id, name, email, age (optional), role (enum), createdAt. Phir ek function likho jo User accept kare aur `PublicProfile` (password/sensitive fields remove) return kare — `Omit` use karo.

### Task 2 — Generic API Client
```typescript
// Ye template complete karo:
class ApiClient {
  constructor(private baseUrl: string) {}
  
  async get<T>(endpoint: string): Promise<T> {
    // implement karo
  }
  
  async post<TBody, TResponse>(endpoint: string, body: TBody): Promise<TResponse> {
    // implement karo
  }
}

// Use karo:
const client = new ApiClient("https://jsonplaceholder.typicode.com");
const users = await client.get<User[]>("/users");
const newPost = await client.post<CreatePostBody, Post>("/posts", { title: "...", body: "..." });
```

### Task 3 — TypeScript Express API
Ek typed Express API banao with:
- `GET /users` — returns `User[]`
- `POST /users` — accepts `CreateUserDTO`, returns `User`
- Auth middleware jo `req.user` set kare
- Sab errors properly typed hon (custom `AppError` class)

### Task 4 — React TypeScript
Ek `DataTable<T>` generic component banao jo:
- Koi bhi array of objects accept kare
- Columns definition accept kare (key + label)
- Search, sort kare
- `onRowClick` callback accept kare — row ka type automatically infer ho

> **Next Module:** Testing Basics → Module 12
