# Testing Basics — Full-Stack Mentorship Program
### Module 12 — Testing Jo Production Mein Rota Nahi

---

## 1. Testing Kyun? — Ek Real Story

### Woh Din Jab Testing Ki Importance Samjhi

Imagine karo: Ek e-commerce company. Black Friday aa raha hai. Team ne coupon code feature add kiya. Testing nahi ki — "time nahi tha". Deploy kar diya.

**Black Friday pe**: 50,000 users. Coupon code apply hota — price negative ho jaata hai. Users ₹0 pe items le rahe hain. Company ko ₹40 lakh ka loss ho jaata hai ek raat mein.

Woh bug 10-line unit test se pakda ja sakta tha:
```javascript
test("discount should never make price negative", () => {
  expect(applyDiscount(100, 150)).toBeGreaterThanOrEqual(0);
});
```

### Testing ke Real Benefits:

- **Confidence** — Code change karo, tests chalao, agar green hai toh production pe safe hai
- **Documentation** — Tests bataate hain code kaise kaam karta hai
- **Refactoring** — Bina darr ke code improve karo
- **Bug prevention** — Naya code purana code nahi todega
- **Career** — Senior developer hona = testing janna

### Real-Life Analogy
Testing ek **rehearsal** hai performance se pehle. Actor final show se pehle rehearsal nahi kare toh stage pe kuch bhi ho sakta hai. Code ki rehearsal = automated tests. Ek baar likhne ka kaam, baar baar chalte hain.

---

## 2. Types of Testing — Pyramid

```
         /\
        /  \  ← E2E Tests (Cypress, Playwright)
       /    \    Slow, expensive, brittle
      /------\   Few tests (critical user flows)
     /        \
    /  Integra- \ ← Integration Tests (Supertest)
   /   tion      \   Medium speed
  /    Tests      \  APIs, DB interactions
 /------------------\
/                    \
/    Unit Tests        \ ← Unit Tests (Jest)
/  (Fast, Cheap, Many)  \  Individual functions
/________________________\
```

### Pyramid ka matlab:
- **Unit Tests** — Bahut zyada (70%), bahut fast (milliseconds), individual functions/components test
- **Integration Tests** — Medium (20%), API endpoints test, DB ke saath interaction
- **E2E Tests** — Kam (10%), user flow test (login → add to cart → checkout)

---

## 3. Jest Setup

```bash
# ===== Node.js ke saath =====
npm install --save-dev jest
npm install --save-dev @types/jest  # TypeScript ke liye

# TypeScript ke liye:
npm install --save-dev ts-jest

# package.json:
```

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "testMatch": ["**/__tests__/**/*.ts", "**/*.test.ts", "**/*.spec.ts"],
    "collectCoverageFrom": ["src/**/*.ts", "!src/**/*.d.ts"]
  }
}
```

```bash
# ===== React ke saath (Create React App ya Vite) =====
# CRA mein already configured hota hai

# Vite ke saath:
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev @testing-library/user-event jest-environment-jsdom
npm install --save-dev ts-jest @types/jest identity-obj-proxy
```

```javascript
// jest.config.js — Vite ke liye
export default {
  testEnvironment: "jsdom",
  setupFilesAfterFramework: ["@testing-library/jest-dom"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",  // CSS imports mock
    "\\.(jpg|png|svg)$": "<rootDir>/src/__mocks__/fileMock.js"
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }]
  }
};
```

```javascript
// src/__mocks__/fileMock.js
module.exports = "test-file-stub";  // Images ke liye dummy

// src/setupTests.ts — global setup
import "@testing-library/jest-dom";  // custom matchers add karo
```

---

## 4. Unit Tests Likhna

### Test File Structure

```typescript
// src/utils/calculator.ts — jo test karna hai
export function add(a: number, b: number): number {
  return a + b;
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
}

export function applyDiscount(price: number, discountPercent: number): number {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error("Discount must be between 0 and 100");
  }
  const discounted = price - (price * discountPercent) / 100;
  return Math.max(0, discounted);  // negative price allowed nahi
}
```

```typescript
// src/utils/__tests__/calculator.test.ts
import { add, divide, applyDiscount } from "../calculator";

// describe — related tests group karo
describe("Calculator", () => {

  // ===== BASIC MATCHERS =====
  describe("add()", () => {
    // it/test dono same hain — jo readable lage use karo
    it("should add two positive numbers", () => {
      // expect(actual).matcher(expected)
      expect(add(2, 3)).toBe(5);         // strict equality (===)
    });

    it("should handle negative numbers", () => {
      expect(add(-1, -1)).toBe(-2);
      expect(add(-5, 5)).toBe(0);
    });

    it("should handle decimal numbers", () => {
      // toBe: floating point ke saath use mat karo
      expect(add(0.1, 0.2)).toBeCloseTo(0.3);  // ✅ floating point safe
      // expect(0.1 + 0.2).toBe(0.3);  // ❌ Ye fail hoga! (0.30000000000000004)
    });
  });

  describe("divide()", () => {
    it("should divide two numbers", () => {
      expect(divide(10, 2)).toBe(5);
    });

    it("should throw error when dividing by zero", () => {
      // Error throw hone ko test karna:
      expect(() => divide(10, 0)).toThrow("Cannot divide by zero");
      expect(() => divide(10, 0)).toThrow(Error);  // class bhi check kar sakte
    });
  });

  describe("applyDiscount()", () => {
    it("should apply discount correctly", () => {
      expect(applyDiscount(1000, 10)).toBe(900);
      expect(applyDiscount(500, 50)).toBe(250);
    });

    it("should never return negative price", () => {
      // Ye woh test hai jo Black Friday disaster se bachata!
      expect(applyDiscount(100, 150)).toBeGreaterThanOrEqual(0);
      expect(applyDiscount(100, 150)).toBe(0);
    });

    it("should throw on invalid discount", () => {
      expect(() => applyDiscount(100, -10)).toThrow();
      expect(() => applyDiscount(100, 101)).toThrow();
    });
  });
});

// ===== COMMON MATCHERS =====
describe("Matchers Reference", () => {
  test("toBe — strict equality", () => {
    expect(1 + 1).toBe(2);
    expect("hello").toBe("hello");
  });

  test("toEqual — deep equality (objects)", () => {
    expect({ a: 1, b: 2 }).toEqual({ a: 1, b: 2 });  // toBe yahan fail hoga!
    expect([1, 2, 3]).toEqual([1, 2, 3]);
  });

  test("toContain — array/string mein hai?", () => {
    expect([1, 2, 3]).toContain(2);
    expect("hello world").toContain("world");
  });

  test("toHaveLength — length check", () => {
    expect([1, 2, 3]).toHaveLength(3);
    expect("hello").toHaveLength(5);
  });

  test("truthy/falsy checks", () => {
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
    expect("hello").toBeDefined();
  });

  test("number comparisons", () => {
    expect(5).toBeGreaterThan(3);
    expect(3).toBeLessThan(5);
    expect(5).toBeGreaterThanOrEqual(5);
  });

  test(".not — opposite check", () => {
    expect(1).not.toBe(2);
    expect([1, 2, 3]).not.toContain(5);
  });
});
```

---

## 5. Mocking — Fake Karo Dependencies Ko

### Real-Life Analogy
Actor stage pe real accident nahi karta — props use karta hai. Testing mein bhi real database, real API calls nahi chahiye — **mocks** (fake versions) use karte hain. Fast, predictable, no side effects.

```typescript
// ===== jest.fn() — Manual mock function =====
describe("jest.fn() basics", () => {
  test("track calls to a function", () => {
    const mockFn = jest.fn();

    mockFn("hello");
    mockFn("world", 42);

    expect(mockFn).toHaveBeenCalled();           // call hua?
    expect(mockFn).toHaveBeenCalledTimes(2);     // kitni baar?
    expect(mockFn).toHaveBeenCalledWith("hello"); // kya argument?
    expect(mockFn).toHaveBeenLastCalledWith("world", 42);
  });

  test("mock return values", () => {
    const mockGetUser = jest.fn().mockReturnValue({ id: 1, name: "Ajinkya" });
    
    const user = mockGetUser(1);
    expect(user.name).toBe("Ajinkya");

    // Different return values different calls pe
    const mockFn2 = jest.fn()
      .mockReturnValueOnce("first call")
      .mockReturnValueOnce("second call")
      .mockReturnValue("default");

    expect(mockFn2()).toBe("first call");
    expect(mockFn2()).toBe("second call");
    expect(mockFn2()).toBe("default");
  });
});

// ===== jest.mock() — Module mock karo =====

// email.service.ts — real implementation
import nodemailer from "nodemailer";

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const transporter = nodemailer.createTransporter({ /* ... */ });
  await transporter.sendMail({
    to: email,
    subject: "Welcome!",
    text: `Hello ${name}!`
  });
}

// email.service.test.ts — test mein real email nahi bhejna!
jest.mock("nodemailer");  // puri module mock ho gayi

import nodemailer from "nodemailer";
import { sendWelcomeEmail } from "../email.service";

describe("sendWelcomeEmail", () => {
  it("should send email with correct details", async () => {
    // Mock setup
    const mockSendMail = jest.fn().mockResolvedValue({ messageId: "123" });
    (nodemailer.createTransporter as jest.Mock).mockReturnValue({
      sendMail: mockSendMail
    });

    // Function call
    await sendWelcomeEmail("test@example.com", "Ajinkya");

    // Verify
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "test@example.com",
        subject: "Welcome!"
      })
    );
  });
});

// ===== fetch/axios mock karna =====

// Global fetch mock (Node.js 18+ mein fetch built-in hai)
global.fetch = jest.fn();

describe("API calls", () => {
  beforeEach(() => {
    jest.clearAllMocks();  // har test se pehle mocks reset karo
  });

  it("should fetch users successfully", async () => {
    const mockUsers = [{ id: 1, name: "Ajinkya" }];
    
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockUsers
    });

    const users = await getUsers();
    expect(users).toEqual(mockUsers);
    expect(fetch).toHaveBeenCalledWith("/api/users");
  });

  it("should handle fetch failure", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500
    });

    await expect(getUsers()).rejects.toThrow("Error: 500");
  });
});

// ===== Setup aur Teardown =====
describe("Database tests", () => {
  beforeAll(async () => {
    // Sab tests se pehle ek baar — DB connect karo
    await db.connect();
  });

  afterAll(async () => {
    // Sab tests ke baad ek baar — DB disconnect karo
    await db.disconnect();
  });

  beforeEach(async () => {
    // Har test se pehle — clean state
    await db.users.deleteMany({});
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Har test ke baad — cleanup
  });
});
```

---

## 6. Async Code Test Karna

```typescript
// Async functions test karna — multiple ways

// 1. async/await — Recommended!
test("fetch user by id", async () => {
  const user = await getUserById(1);
  expect(user.name).toBe("Ajinkya");
});

// 2. Promise return karo
test("promise resolves correctly", () => {
  return getUserById(1).then(user => {
    expect(user.name).toBe("Ajinkya");
  });
});

// 3. Error testing — async errors
test("should throw when user not found", async () => {
  await expect(getUserById(9999)).rejects.toThrow("User not found");
  await expect(getUserById(9999)).rejects.toThrow(Error);
});

// ===== REAL EXAMPLE: Testing a complete service =====

// user.service.ts
export class UserService {
  constructor(private db: Database) {}

  async createUser(data: CreateUserDTO): Promise<User> {
    const existingUser = await this.db.users.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.db.users.create({
      ...data,
      password: hashedPassword
    });
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.db.users.findById(id);
    if (!user) throw new Error("User not found");
    return user;
  }
}

// user.service.test.ts
describe("UserService", () => {
  let userService: UserService;
  let mockDb: jest.Mocked<Database>;  // sab methods mocked

  beforeEach(() => {
    // Mock DB banao
    mockDb = {
      users: {
        findByEmail: jest.fn(),
        findById: jest.fn(),
        create: jest.fn()
      }
    } as jest.Mocked<Database>;

    userService = new UserService(mockDb);
  });

  describe("createUser()", () => {
    const validUserData = {
      name: "Ajinkya",
      email: "ajinkya@example.com",
      password: "password123"
    };

    it("should create user successfully", async () => {
      // Arrange — setup mocks
      mockDb.users.findByEmail.mockResolvedValue(null);  // email available hai
      mockDb.users.create.mockResolvedValue({
        id: 1,
        ...validUserData,
        password: "hashed"
      });

      // Act — function call
      const user = await userService.createUser(validUserData);

      // Assert — verify
      expect(user.id).toBe(1);
      expect(user.name).toBe("Ajinkya");
      expect(mockDb.users.create).toHaveBeenCalledTimes(1);
    });

    it("should throw error if email already exists", async () => {
      mockDb.users.findByEmail.mockResolvedValue({ id: 1, email: "ajinkya@example.com" });

      await expect(userService.createUser(validUserData))
        .rejects.toThrow("Email already registered");
      
      expect(mockDb.users.create).not.toHaveBeenCalled();
    });
  });
});
```

---

## 7. Express API Testing — Supertest

```bash
npm install --save-dev supertest @types/supertest
```

```typescript
// app.ts — Express app (server se alag!)
import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);

export default app;  // export karo — test mein import hoga

// server.ts — sirf listen karo (alag file)
import app from "./app";
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

```typescript
// __tests__/userRoutes.test.ts
import request from "supertest";
import app from "../app";
import { db } from "../database";

// Test database use karo (ya mock karo)
beforeAll(async () => {
  await db.connect(process.env.TEST_DATABASE_URL!);
});

afterAll(async () => {
  await db.disconnect();
});

beforeEach(async () => {
  await db.users.deleteMany({});  // clean state
});

describe("User API Endpoints", () => {

  describe("GET /api/users", () => {
    it("should return empty array when no users", async () => {
      const response = await request(app)
        .get("/api/users")
        .expect(200);                           // HTTP status check

      expect(response.body).toEqual([]);
    });

    it("should return all users", async () => {
      // Seed data
      await db.users.create({ name: "Ajinkya", email: "a@a.com" });
      await db.users.create({ name: "Rahul", email: "r@r.com" });

      const response = await request(app)
        .get("/api/users")
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty("name");
    });

    it("should require authentication", async () => {
      await request(app)
        .get("/api/users/protected")
        .expect(401);
    });
  });

  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const newUser = {
        name: "Ajinkya Dondalkar",
        email: "ajinkya@example.com",
        password: "securepassword123"
      };

      const response = await request(app)
        .post("/api/users")
        .send(newUser)           // request body
        .set("Content-Type", "application/json")
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe("Ajinkya Dondalkar");
      expect(response.body.email).toBe("ajinkya@example.com");
      expect(response.body.password).toBeUndefined();  // password nahi hona chahiye!
    });

    it("should return 400 for invalid email", async () => {
      const response = await request(app)
        .post("/api/users")
        .send({ name: "Ajinkya", email: "not-an-email", password: "123456" })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it("should return 409 for duplicate email", async () => {
      const userData = { name: "A", email: "a@a.com", password: "123456" };
      
      await request(app).post("/api/users").send(userData).expect(201);
      await request(app).post("/api/users").send(userData).expect(409);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return user by id", async () => {
      const created = await db.users.create({ name: "Ajinkya", email: "a@a.com" });

      const response = await request(app)
        .get(`/api/users/${created.id}`)
        .expect(200);

      expect(response.body.id).toBe(created.id);
    });

    it("should return 404 for non-existent user", async () => {
      await request(app)
        .get("/api/users/99999")
        .expect(404);
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should delete user with valid auth token", async () => {
      const user = await db.users.create({ name: "A", email: "a@a.com" });
      const token = generateTestToken(user.id);

      await request(app)
        .delete(`/api/users/${user.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const deleted = await db.users.findById(user.id);
      expect(deleted).toBeNull();
    });

    it("should return 401 without auth", async () => {
      await request(app)
        .delete("/api/users/1")
        .expect(401);
    });
  });
});
```

---

## 8. React Testing Library

### Real-Life Analogy
React Testing Library ka philosophy hai: **"User ki tarah test karo, implementation ki tarah nahi"**. User button ka ID nahi dekha — sirf text dekha aur click kiya. Tests bhi wahi karo.

```bash
npm install --save-dev @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

```typescript
// src/setupTests.ts
import "@testing-library/jest-dom";

// Custom matchers available hote hain:
// .toBeInTheDocument()
// .toHaveTextContent()
// .toBeVisible()
// .toBeDisabled()
// .toHaveValue()
// .toHaveClass()
```

```typescript
// ===== QUERYING ELEMENTS =====
// Priority order (a11y best practices):
// 1. getByRole          — best! ARIA roles use karo
// 2. getByLabelText     — form inputs ke liye
// 3. getByPlaceholderText
// 4. getByText          — non-interactive elements
// 5. getByDisplayValue  — form values
// 6. getByAltText       — images
// 7. getByTitle
// 8. getByTestId        — last resort (implementation detail)

// Query variants:
// getBy*    — throws error if not found (ya multiple found)
// queryBy*  — returns null if not found (no error)
// findBy*   — async, returns promise (wait karta hai element ke liye)
// getAllBy*, queryAllBy*, findAllBy* — multiple elements
```

---

## 9. React Components Test Karna

```typescript
// components/LoginForm.tsx
import { useState } from "react";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading = false }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("All fields required");
      return;
    }
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Login form">
      <h1>Login</h1>
      {error && <p role="alert">{error}</p>}
      
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter email"
      />
      
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};
```

```typescript
// components/__tests__/LoginForm.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../LoginForm";

describe("LoginForm", () => {
  // User event setup — real browser events simulate karta hai
  const user = userEvent.setup();
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
  });

  // ===== RENDERING TESTS =====
  describe("Rendering", () => {
    it("should render the login form", () => {
      render(<LoginForm onLogin={mockOnLogin} />);

      expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    });

    it("should show loading state", () => {
      render(<LoginForm onLogin={mockOnLogin} isLoading={true} />);

      const button = screen.getByRole("button", { name: "Logging in..." });
      expect(button).toBeDisabled();
    });

    it("should not show error initially", () => {
      render(<LoginForm onLogin={mockOnLogin} />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  // ===== USER INTERACTION TESTS =====
  describe("User Interactions", () => {
    it("should update email field on input", async () => {
      render(<LoginForm onLogin={mockOnLogin} />);

      const emailInput = screen.getByLabelText("Email");
      await user.type(emailInput, "ajinkya@example.com");

      expect(emailInput).toHaveValue("ajinkya@example.com");
    });

    it("should show validation error when fields empty", async () => {
      render(<LoginForm onLogin={mockOnLogin} />);

      await user.click(screen.getByRole("button", { name: "Login" }));

      expect(screen.getByRole("alert")).toHaveTextContent("All fields required");
      expect(mockOnLogin).not.toHaveBeenCalled();
    });

    it("should call onLogin with correct credentials", async () => {
      mockOnLogin.mockResolvedValue(undefined);  // successful login
      render(<LoginForm onLogin={mockOnLogin} />);

      await user.type(screen.getByLabelText("Email"), "ajinkya@example.com");
      await user.type(screen.getByLabelText("Password"), "password123");
      await user.click(screen.getByRole("button", { name: "Login" }));

      expect(mockOnLogin).toHaveBeenCalledWith("ajinkya@example.com", "password123");
    });

    it("should show error when login fails", async () => {
      mockOnLogin.mockRejectedValue(new Error("Invalid credentials"));
      render(<LoginForm onLogin={mockOnLogin} />);

      await user.type(screen.getByLabelText("Email"), "ajinkya@example.com");
      await user.type(screen.getByLabelText("Password"), "wrongpassword");
      await user.click(screen.getByRole("button", { name: "Login" }));

      // Async state update ka wait karo
      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials");
      });
    });
  });

  // ===== ASYNC COMPONENT TESTS =====
  describe("Async behavior", () => {
    it("should show loading during login", async () => {
      // Slow login simulate karo
      let resolveLogin: () => void;
      const loginPromise = new Promise<void>(resolve => {
        resolveLogin = resolve;
      });
      mockOnLogin.mockReturnValue(loginPromise);

      render(<LoginForm onLogin={mockOnLogin} />);

      await user.type(screen.getByLabelText("Email"), "a@a.com");
      await user.type(screen.getByLabelText("Password"), "pass123");
      await user.click(screen.getByRole("button", { name: "Login" }));

      // Login ke dauran — button disabled hona chahiye
      // Note: isLoading prop parent handle karta hai, ye parent-level test hai
    });
  });
});

// ===== TESTING COMPONENT WITH CONTEXT/PROVIDER =====
import { renderWithProviders } from "../test-utils";  // custom render

// test-utils.tsx — providers wrap karne ka helper
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>
  );
}
```

---

## 10. Code Coverage

```bash
# Coverage report generate karo
npm test -- --coverage

# Output:
# ----------|---------|----------|---------|---------|
# File      | % Stmts | % Branch | % Funcs | % Lines |
# ----------|---------|----------|---------|---------|
# All files |   85.45 |    72.30 |   88.00 |   85.45 |
#  utils/   |   95.00 |    85.00 |  100.00 |   95.00 |
#   calc.ts |   95.00 |    85.00 |  100.00 |   95.00 |
# ----------|---------|----------|---------|---------|
```

### Coverage Types:
- **Statements** — Har statement run hua?
- **Branches** — Har if/else path traverse hua?
- **Functions** — Har function call hua?
- **Lines** — Har line execute hua?

```json
// jest.config.js mein coverage thresholds set karo
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

### Coverage ke baare mein sach:
- **100% coverage ≠ bug-free code** — Wrong expectations wale tests 100% coverage de sakte hain
- **Industry standard**: 70-80% reasonable hai
- **Critical code** (auth, payments): 90%+ aim karo
- **Utility functions**: 95%+ achieve karna easy hai
- **Coverage se zyada important**: Test quality — kya sahi cheez test ho rahi hai?

```bash
# HTML report — browser mein dekho
open coverage/lcov-report/index.html
# Har file click karo — exactly kaunsi lines miss hain dikhega
```

---

## 11. TDD — Test Driven Development

### Real-Life Analogy
TDD ek recipe likhne jaisi hai pehle, phir dish banana. Pehle decide karo result kya chahiye, phir banao. **Red → Green → Refactor** cycle.

```typescript
// ===== TDD Example: Password Validator =====

// STEP 1: RED — Test likhho (code nahi hai abhi)
describe("validatePassword", () => {
  it("should require minimum 8 characters", () => {
    expect(validatePassword("short")).toBe(false);
    expect(validatePassword("longenough")).toBe(true);
  });

  it("should require at least one uppercase letter", () => {
    expect(validatePassword("alllowercase1")).toBe(false);
    expect(validatePassword("HasUppercase1")).toBe(true);
  });

  it("should require at least one number", () => {
    expect(validatePassword("NoNumber!")).toBe(false);
    expect(validatePassword("HasNumber1")).toBe(true);
  });

  it("should require at least one special character", () => {
    expect(validatePassword("NoSpecial1")).toBe(false);
    expect(validatePassword("HasSpecial1!")).toBe(true);
  });
});
// Tests run karo: sab FAIL honge (RED) — function exist nahi karta

// STEP 2: GREEN — Minimum code likhho jo tests pass kare
export function validatePassword(password: string): boolean {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*]/.test(password)) return false;
  return true;
}
// Tests run karo: sab PASS honge (GREEN)

// STEP 3: REFACTOR — Code improve karo, tests still green hone chahiye
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < 8) errors.push("At least 8 characters required");
  if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter required");
  if (!/[0-9]/.test(password)) errors.push("At least one number required");
  if (!/[!@#$%^&*]/.test(password)) errors.push("At least one special character required");

  return { isValid: errors.length === 0, errors };
}
// Tests update karo aur phir se run karo — GREEN!

// TDD benefits:
// 1. Design better hoti hai — testable code likhne pe force hota hai
// 2. Requirements clear hoti hain — pehle sochna padta hai
// 3. Confidence — refactor freely
// 4. Documentation — tests exactly batate hain kaise kaam karta hai
```

---

## 12. Common Testing Mistakes

```typescript
// ❌ MISTAKE 1: Implementation test karna, behavior nahi

// BAD — implementation detail test kar raha hai
test("should call setState with user data", () => {
  const setStateSpy = jest.spyOn(component, "setState");
  component.loadUser();
  expect(setStateSpy).toHaveBeenCalledWith({ user: mockUser });
  // Agar setState ki jagah useReducer use karo toh ye test break ho jayega
});

// GOOD — user ko kya dikhega woh test karo
test("should display user name after loading", async () => {
  render(<UserProfile userId={1} />);
  await screen.findByText("Ajinkya Dondalkar");  // User ko yahi dikhega
  // Andar kaise load hua, state kaise change hua — irrelevant
});

// ❌ MISTAKE 2: Over-mocking — sab kuch mock karo
// Agar sab mock hai, actually kya test ho raha hai?
test("should process payment", async () => {
  jest.mock("../paymentService");
  jest.mock("../emailService");
  jest.mock("../orderService");
  jest.mock("../inventoryService");
  // Sab mock hai — actual logic test nahi ho rahi!
});

// BETTER: Sirf external dependencies mock karo (DB, APIs)
// Internal logic ko actually run karne do

// ❌ MISTAKE 3: Test naam descriptive nahi
test("test 1", () => { /* ... */ });
test("works", () => { /* ... */ });
test("user", () => { /* ... */ });

// GOOD: Clearly bolo kya test ho raha hai
test("should return 404 when user does not exist", async () => { /* ... */ });
test("should hash password before saving to database", async () => { /* ... */ });
test("should not expose password field in user response", async () => { /* ... */ });

// ❌ MISTAKE 4: Single test mein bahut kuch test karna
test("user creation", async () => {
  // Creates user
  // Checks email validation
  // Checks duplicate email
  // Checks password hashing
  // Checks response format
  // Too much! Ek test fail hua toh kya fail hua?
});

// GOOD: Har test ek cheez karo
describe("POST /api/users", () => {
  it("should create user with valid data");
  it("should hash the password");
  it("should return 409 for duplicate email");
  it("should validate email format");
  it("should not return password in response");
});

// ❌ MISTAKE 5: Async tests mein await bhoolna
test("should fetch user", () => {  // async keyword nahi!
  const user = getUserById(1);     // Promise return hoga, wait nahi karega
  expect(user.name).toBe("Ajinkya");  // Promise ka .name = undefined!
});

// GOOD:
test("should fetch user", async () => {
  const user = await getUserById(1);
  expect(user.name).toBe("Ajinkya");
});

// ❌ MISTAKE 6: Tests ek doosre pe depend karna
test("should create user", async () => {
  createdUserId = await createUser({ name: "Ajinkya" });  // global variable!
});

test("should delete user", async () => {
  await deleteUser(createdUserId);  // Pehla test fail hua toh ye bhi fail
  // Tests independent hone chahiye — order matter nahi karna chahiye
});

// GOOD: Har test apna data khud banaye
test("should delete user", async () => {
  const user = await createUser({ name: "Test User" });  // fresh data
  await deleteUser(user.id);
  expect(await getUser(user.id)).toBeNull();
});
```

---

## Interview Questions & Answers

**Q1: Unit test aur integration test mein kya fark hai?**
> Unit test ek function/component ko isolation mein test karta hai — dependencies mock hoti hain. Integration test multiple units ko saath test karta hai — actual DB ya API calls hoti hain. Unit tests fast hain, integration tests realistic hain. Dono chahiye.

**Q2: jest.mock() aur jest.spyOn() mein kya fark hai?**
> `jest.mock()` puri module ko replace karta hai. `jest.spyOn()` existing method ko wrap karta hai — original call hoti hai (mockImplementation call karo tabhi replace hoti hai), aur tracking milti hai. `spyOn` component ke methods monitor karne ke liye use karo.

**Q3: Testing Library ka `getBy` vs `queryBy` vs `findBy` kab use karein?**
> `getBy` — element hona chahiye, nahi hua toh test fail. `queryBy` — element nahi bhi ho sakta (`.not.toBeInTheDocument()` ke liye). `findBy` — async, element eventually appear karega (loading states ke liye). Default `getBy` use karo.

**Q4: TDD kab practical nahi hota?**
> Agar requirement unclear ho aur bohot badal rahi ho — upfront tests likhna mushkil hai. UI/UX experiments ke liye — design pehle, tests baad mein. Lekin business logic, API endpoints, utilities ke liye TDD bahut effective hai.

**Q5: 100% code coverage ka matlab hai bug-free code?**
> Bilkul nahi. Coverage measure karta hai code lines run huin, not that correct behavior test hua. `expect(add(1,1)).toBe(2)` 100% coverage de sakta hai lekin `add("1","2")` test nahi kiya. Good test quality > high coverage percentage.

---

## Assignment

### Task 1 — Unit Tests
`src/utils/validation.ts` banao with:
- `validateEmail(email: string): boolean`
- `validatePhone(phone: string): boolean` (Indian format: +91XXXXXXXXXX)
- `sanitizeInput(input: string): string` (XSS prevention — HTML tags remove)

TDD approach use karo — pehle tests likhho, phir implementation.

### Task 2 — API Testing with Supertest
Ek simple Express API ke sab endpoints test karo:
- `GET /api/products` — sab products
- `GET /api/products/:id` — ek product (404 bhi test karo)
- `POST /api/products` — naya product (validation bhi)
- `PUT /api/products/:id` — update
- `DELETE /api/products/:id` — delete (auth required)

### Task 3 — React Component Testing
`<SearchBar>` component banao aur test karo:
- Typing pe `onChange` callback call hona
- Debounce — 300ms baad hi search trigger ho
- Clear button — input clear ho
- Loading state — spinner dikhao
- No results state

### Task 4 — Coverage Report
Apne kisi existing project pe `jest --coverage` run karo. Coverage report dekho, 3 functions identify karo jo under-tested hain, unke tests likho aur coverage 80% tak le jao.

### Task 5 — Mock Challenge
Ek `NotificationService` banao jo:
1. Email bhejta hai (nodemailer)
2. SMS bhejta hai (Twilio)
3. Push notification bhejta hai (Firebase)

Sab dependencies mock karke service test karo — real emails/SMS nahi bhejne chahiye tests mein.

> **Congratulations!** Testing module complete hua. Ab tum production-ready developer ho.
> **Next Module:** Deployment & DevOps → Module 13
