# 03 — React.js Fundamentals

> React ko "framework" mat samjho — yeh ek library hai jo sirf UI banane mein help karta hai.
> Ek baar samajh gaye toh baaki sab easy lagega.

---

## React Kyun? Problem Kya Thi?

### Bina React ke (vanilla JS):

```javascript
// Ek simple counter — vanilla JS mein
let count = 0;

document.getElementById("increment").addEventListener("click", () => {
  count++;
  document.getElementById("display").textContent = count; // Manually update karo
});

document.getElementById("decrement").addEventListener("click", () => {
  count--;
  document.getElementById("display").textContent = count; // Phir se manually
});

// Socho agar 20 jagah count dikhana ho...
// Har jagah manually update karna hoga
// Yeh SCALABLE nahi hai
```

### React ke saath:

```jsx
// React mein — state change karo, UI automatically update hota hai
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // State declare karo

  return (
    <div>
      <p>Count: {count}</p> {/* Yeh automatically update hoga */}
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}
// React khud handle karta hai DOM ko update karna
```

---

## Virtual DOM — React ka Jadoo

```
Real DOM manipulate karna slow hai.
React ne ek smart solution nikala:

1. JavaScript mein ek "Virtual DOM" banao (lightweight copy)
2. Jab state change ho → naya Virtual DOM banao
3. Purane aur naye Virtual DOM ko compare karo (diffing)
4. Sirf jo parts ACTUALLY change hue hain unhe Real DOM mein update karo

Yeh bahut fast hai kyunki Real DOM operations costly hain.
```

---

## JSX — JavaScript + HTML = JSX

```jsx
// JSX = JavaScript XML
// Yeh valid JavaScript hai — browser directly nahi samajhta
// Babel ise regular JS mein convert karta hai

// JSX
const element = <h1 className="title">Hello World</h1>;

// Yeh actually yeh ban jaata hai:
const element = React.createElement("h1", { className: "title" }, "Hello World");

// JSX Rules:
// 1. className use karo, class nahi (class JS keyword hai)
// 2. htmlFor use karo, for nahi
// 3. Single root element hona chahiye (ya Fragment use karo)
// 4. {} mein JavaScript expressions likh sakte ho
// 5. Self-closing tags: <img />, <input />, <br />

// Example:
const name = "Rahul";
const isLoggedIn = true;
const items = ["React", "Node", "MongoDB"];

const MyComponent = () => (
  <div>
    {/* Yeh comment hai JSX mein */}
    <h1>Hello, {name}!</h1>
    
    {/* Conditional rendering */}
    {isLoggedIn ? <p>Welcome back!</p> : <p>Please login</p>}
    
    {/* List rendering */}
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li> // key prop important hai!
      ))}
    </ul>
    
    {/* JavaScript expression */}
    <p>2 + 2 = {2 + 2}</p>
  </div>
);
```

---

## Components — Building Blocks

### Analogy:

```
React app = LEGO se bana ghar
- Har LEGO piece = ek Component
- Pieces ko combine karke bada structure banate ho
- Ek piece kahin bhi reuse ho sakta hai
```

```jsx
// Functional Component (modern way)
// Yeh sirf ek JavaScript function hai jo JSX return karta hai

// Simple component
function WelcomeMessage() {
  return <h1>Welcome to our platform!</h1>;
}

// Component with props (properties — data pass karna)
function UserCard({ name, role, avatar }) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  );
}

// Parent component mein use karo
function App() {
  return (
    <div>
      <WelcomeMessage />
      
      <UserCard
        name="Rahul Sharma"
        role="Frontend Developer"
        avatar="https://example.com/rahul.jpg"
      />
      
      <UserCard
        name="Priya Patel"
        role="Backend Developer"
        avatar="https://example.com/priya.jpg"
      />
      {/* Same component, alag data — yahi reusability hai */}
    </div>
  );
}
```

### Props — Data Parent se Child ko:

```jsx
// Props = Properties = Data jo parent se child ko jaata hai
// Props READ-ONLY hain — child unhe change NAHI kar sakta

function ProductCard({ title, price, inStock, onAddToCart }) {
  return (
    <div className={`card ${inStock ? "available" : "out-of-stock"}`}>
      <h3>{title}</h3>
      <p>₹{price.toLocaleString()}</p>
      <p>{inStock ? "Available" : "Out of Stock"}</p>
      <button
        onClick={() => onAddToCart(title)}
        disabled={!inStock}
      >
        Add to Cart
      </button>
    </div>
  );
}

// Parent mein:
function ProductList() {
  const handleAddToCart = (productName) => {
    alert(`${productName} cart mein add hua!`);
  };

  return (
    <div>
      <ProductCard
        title="Laptop"
        price={55000}
        inStock={true}
        onAddToCart={handleAddToCart} // Function bhi prop ke roop mein pass kar sakte ho
      />
      <ProductCard
        title="Phone"
        price={25000}
        inStock={false}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
```

---

## useState — State Management

### State kya hai?

```
State = Component ka "memory"
State change hoti hai → Component re-render hota hai → UI update hota hai

Props = Bahar se aata hai (parent se)
State = Andar se manage hota hai (component khud)
```

```jsx
import { useState } from 'react';

// Simple counter
function Counter() {
  // useState(initialValue) → [currentValue, setterFunction]
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Object state
function UserForm() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: ""
  });

  const handleChange = (e) => {
    setUser({
      ...user, // Baaki fields preserve karo
      [e.target.name]: e.target.value // Sirf yeh field update karo
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Page reload mat karo
    console.log("Form submitted:", user);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={user.name}
        onChange={handleChange}
        placeholder="Naam daalo"
      />
      <input
        type="email"
        name="email"
        value={user.email}
        onChange={handleChange}
        placeholder="Email daalo"
      />
      <button type="submit">Submit</button>
      
      {/* Live preview */}
      <div>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
      </div>
    </form>
  );
}

// Array state — Todo list
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "React seekhna", done: false },
    { id: 2, text: "Project banana", done: false },
  ]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: newTodo, done: false }
    ]);
    setNewTodo(""); // Input clear karo
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        placeholder="Naya todo daalo"
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            {todo.text}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      
      <p>{todos.filter(t => !t.done).length} kaam baaki hain</p>
    </div>
  );
}
```

---

## useEffect — Side Effects Handle Karna

### Side effect kya hota hai?

```
Side effect = Kuch aisa kaam jo React ke rendering se bahar ho:
  - API call karna
  - DOM directly change karna
  - Timer set karna
  - Event listener add karna
  - Local storage mein save karna
```

```jsx
import { useState, useEffect } from 'react';

// Example 1: Data fetch karna
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Yeh function tab chalega jab userId change ho
    async function fetchUser() {
      try {
        setLoading(true);
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError("User load nahi ho saka");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]); // [userId] = dependency array — jab userId change ho toh dobara chalao

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return null;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

// Example 2: Document title change karna
function PageTitle({ title }) {
  useEffect(() => {
    document.title = title; // Side effect — DOM change

    // Cleanup — jab component unmount ho toh reset karo
    return () => {
      document.title = "My App";
    };
  }, [title]);

  return <h1>{title}</h1>;
}

// Example 3: Dependency array ke 3 cases
function EffectExamples() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Rahul");

  // Case 1: Har render ke baad chalega (dependency array nahi hai)
  useEffect(() => {
    console.log("Har render ke baad");
  });

  // Case 2: Sirf ek baar chalega (mount pe) — empty array
  useEffect(() => {
    console.log("Sirf ek baar — component mount hone pe");
    // API call, event listeners, etc.
  }, []);

  // Case 3: Jab count ya name change ho
  useEffect(() => {
    console.log("Count ya name change hua:", count, name);
  }, [count, name]);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <button onClick={() => setName("Priya")}>Name Change</button>
    </div>
  );
}
```

---

## Conditional Rendering

```jsx
function Dashboard({ user, isLoading, hasError }) {
  // Method 1: if/else
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (hasError) {
    return <div>Kuch gadbad ho gayi!</div>;
  }

  // Method 2: Ternary operator (inline)
  return (
    <div>
      {user ? (
        <h1>Welcome, {user.name}!</h1>
      ) : (
        <h1>Please login</h1>
      )}

      {/* Method 3: && operator (short circuit) */}
      {user && user.isAdmin && <AdminPanel />}
      {/* Agar user hai AUR admin hai, tabhi AdminPanel dikhao */}

      {/* Method 4: Nullish coalescing */}
      <p>{user?.bio ?? "No bio available"}</p>
      {/* user?.bio = user hai toh bio, warna undefined */}
      {/* ?? = left side null/undefined ho toh right side use karo */}
    </div>
  );
}
```

---

## Lists aur Keys

```jsx
// ❌ GALAT — key nahi diya
function BadList() {
  const fruits = ["Apple", "Mango", "Banana"];
  return (
    <ul>
      {fruits.map(fruit => <li>{fruit}</li>)} {/* Warning aayegi */}
    </ul>
  );
}

// ✅ SAHI — unique key dena zaroori hai
function GoodList() {
  const products = [
    { id: 1, name: "Laptop", price: 55000 },
    { id: 2, name: "Phone", price: 25000 },
    { id: 3, name: "Tablet", price: 35000 },
  ];

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}> {/* key = unique identifier */}
          {product.name} — ₹{product.price}
        </li>
      ))}
    </ul>
  );
}

// Key kyun zaroori hai?
// React ko batana hota hai ki kaunsa item change/delete/add hua
// Unique key se React efficiently update kar sakta hai
// Index use karna avoid karo (re-ordering pe problems aate hain)
```

---

## React Router — Multiple Pages

```jsx
// Install: npm install react-router-dom

import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

// Pages
function Home() {
  return <h1>Home Page</h1>;
}

function About() {
  return <h1>About Page</h1>;
}

function UserProfile() {
  const { userId } = useParams(); // URL se parameter nikalo
  return <h1>User Profile: {userId}</h1>;
}

// Navigation
function Navbar() {
  const navigate = useNavigate(); // Programmatically navigate karo

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <button onClick={() => navigate("/profile/1")}>My Profile</button>
    </nav>
  );
}

// Protected Route — login ke bina access nahi
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("token"); // Check karo

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />; // Login page pe bhejo
  }

  return children; // Logged in hai — page dikhao
}

// App setup
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        
        {/* Protected route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Mini Project — Student Dashboard

```jsx
// Yeh sab kuch use karke ek chhota project banao

import { useState, useEffect } from 'react';

// Student Card Component
function StudentCard({ student, onDelete }) {
  return (
    <div className="card">
      <h3>{student.name}</h3>
      <p>Marks: {student.marks}/100</p>
      <p>Grade: {student.marks >= 90 ? "A" : student.marks >= 75 ? "B" : student.marks >= 60 ? "C" : "F"}</p>
      <button onClick={() => onDelete(student.id)}>Remove</button>
    </div>
  );
}

// Add Student Form
function AddStudentForm({ onAdd }) {
  const [formData, setFormData] = useState({ name: "", marks: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.marks) return;

    onAdd({
      id: Date.now(),
      name: formData.name,
      marks: Number(formData.marks)
    });

    setFormData({ name: "", marks: "" }); // Reset
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Student ka naam"
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Marks (0-100)"
        min="0"
        max="100"
        value={formData.marks}
        onChange={e => setFormData({ ...formData, marks: e.target.value })}
      />
      <button type="submit">Add Student</button>
    </form>
  );
}

// Main App
function StudentDashboard() {
  const [students, setStudents] = useState([
    { id: 1, name: "Rahul", marks: 85 },
    { id: 2, name: "Priya", marks: 92 },
    { id: 3, name: "Amit", marks: 67 },
  ]);
  const [filter, setFilter] = useState("all");

  // Stats calculate karo
  const average = students.length > 0
    ? (students.reduce((sum, s) => sum + s.marks, 0) / students.length).toFixed(1)
    : 0;
  const topScorer = students.reduce((top, s) => s.marks > (top?.marks || 0) ? s : top, null);

  // Filter karo
  const filteredStudents = students.filter(s => {
    if (filter === "pass") return s.marks >= 35;
    if (filter === "fail") return s.marks < 35;
    return true;
  });

  const addStudent = (student) => setStudents([...students, student]);
  const deleteStudent = (id) => setStudents(students.filter(s => s.id !== id));

  // Title update karo
  useEffect(() => {
    document.title = `Dashboard — ${students.length} Students`;
  }, [students.length]);

  return (
    <div>
      <h1>Student Dashboard</h1>

      {/* Stats */}
      <div className="stats">
        <div>Total Students: {students.length}</div>
        <div>Class Average: {average}</div>
        <div>Top Scorer: {topScorer?.name} ({topScorer?.marks})</div>
      </div>

      {/* Filter buttons */}
      <div>
        {["all", "pass", "fail"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ fontWeight: filter === f ? "bold" : "normal" }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Add form */}
      <AddStudentForm onAdd={addStudent} />

      {/* Student list */}
      {filteredStudents.length === 0 ? (
        <p>Koi student nahi mila</p>
      ) : (
        <div className="grid">
          {filteredStudents.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              onDelete={deleteStudent}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
```

---

## Assignment

```
1. Upar wala Student Dashboard complete karo:
   - Add karo styling (CSS ya Tailwind)
   - Edit functionality add karo (student ka naam/marks change)
   - LocalStorage mein save karo (page reload pe data na jaye)
   - Sort by marks functionality add karo

2. Ek Weather App banao:
   - OpenWeatherMap free API use karo
   - City naam search karo
   - Loading state dikhao
   - Error state handle karo (city nahi mila)
   - Aaj ka aur kal ka weather dikhao

3. GitHub pe push karo aur Vercel pe deploy karo.
   README mein live link add karo.
```

---

> *Next: React Advanced — Hooks, Context, Redux → [04-react-advanced.md](./04-react-advanced.md)*
