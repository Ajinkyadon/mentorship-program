# Module 04: React Advanced Hooks & State Management

**Target Audience:** Working professionals — jo React basics jaante hain, ab advanced concepts seekhna chahte hain  
**Estimated Time:** 12-15 hours  
**Prerequisites:** Module 03 complete hona chahiye (useState, useEffect, props, components)

---

## 1. useRef — Do Kaam, Ek Hook

### Real-Life Analogy

Socho tumhare paas ek **sticky note** hai jo table pe chipki hai. Jab bhi tum kuch likhte ho us sticky note pe, **page reload nahi hota, screen blink nahi karti** — note wahan hi rehta hai aur value update hoti rehti hai. Yahi kaam karta hai `useRef`.

`useRef` ke **do main kaam** hain:
1. **DOM element ko pakadna** (jaise input field pe directly focus karna)
2. **Mutable value store karna** jo re-render trigger na kare

---

### Use Case 1: DOM Access — Input pe Auto-Focus

```jsx
import { useRef, useEffect } from 'react';

function LoginForm() {
  // useRef se ek "reference box" banate hain
  // yeh box initially null hota hai
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    // Component mount hone ke baad, email input pe focus kar do
    // document.getElementById jaisi baat hai, lekin React ka tarika
    emailInputRef.current.focus();
  }, []); // empty dependency — sirf ek baar chalega

  const handleEmailKeyDown = (e) => {
    // User ne Tab ya Enter press kiya toh password field pe jump karo
    if (e.key === 'Enter') {
      passwordInputRef.current.focus();
    }
  };

  return (
    <div className="login-form">
      <h2>Login Karo Bhai</h2>
      
      {/* ref prop se element ko "pakad" lete hain */}
      <input
        ref={emailInputRef}
        type="email"
        placeholder="Email daalo"
        onKeyDown={handleEmailKeyDown}
      />
      
      <input
        ref={passwordInputRef}
        type="password"
        placeholder="Password daalo"
      />
      
      <button type="submit">Login</button>
    </div>
  );
}

export default LoginForm;
```

---

### Use Case 2: Persistent Mutable Value — Timer without Re-render

```jsx
import { useRef, useState, useEffect } from 'react';

function StopWatch() {
  const [displayTime, setDisplayTime] = useState(0); // sirf display ke liye state
  const [isRunning, setIsRunning] = useState(false);

  // intervalId ko useRef mein rakhte hain, useState mein nahi
  // kyunki agar useState use karein toh har update pe re-render hoga
  // aur useEffect cleanup bhi complicated ho jaata hai
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null); // start time store karna

  const startTimer = () => {
    if (isRunning) return; // already chal raha hai

    setIsRunning(true);
    // Performance.now() use karte hain accurate timing ke liye
    startTimeRef.current = Date.now() - displayTime * 1000;

    // setInterval ka id store karo ref mein
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setDisplayTime(elapsed); // sirf yahan state update hogi
    }, 100); // 100ms pe update for smooth display
  };

  const stopTimer = () => {
    setIsRunning(false);
    // ref se interval id nikaalo aur clear karo
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const resetTimer = () => {
    stopTimer();
    setDisplayTime(0);
    startTimeRef.current = null;
  };

  // Component unmount pe cleanup — memory leak avoid karne ke liye
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div>
      <h1>{formatTime(displayTime)}</h1>
      <button onClick={startTimer} disabled={isRunning}>Start</button>
      <button onClick={stopTimer} disabled={!isRunning}>Stop</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

export default StopWatch;
```

### useRef — Key Rules

| Baat | useState | useRef |
|------|----------|--------|
| Re-render trigger karta hai? | Haan | Nahi |
| Value `.current` se access? | Nahi | Haan |
| DOM element pakad sakta hai? | Nahi | Haan |
| Value persist karta hai across renders? | Haan | Haan |

---

## 2. useMemo — Mehenga Calculation Cache Karo

### Real-Life Analogy

Socho tum ek **CA (Chartered Accountant)** ho. Har baar jab client income tax calculate karne bolta hai, tum ghante bhar kaam karte ho. Lekin agar client ki income change nahi hui, toh baar baar calculate kyon karo? Pehli baar ka result ek **diary mein likh do** — jab tak income change na ho, wahi answer do. Yahi kaam karta hai `useMemo`.

---

### Kab Use Karein useMemo

```jsx
import { useState, useMemo } from 'react';

// Ek expensive function — bade numbers ke saath kaam karta hai
function findPrimeNumbers(limit) {
  console.log(`Prime numbers dhundh raha hoon 0 se ${limit} tak...`);
  const primes = [];
  
  for (let i = 2; i <= limit; i++) {
    let isPrime = true;
    for (let j = 2; j <= Math.sqrt(i); j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(i);
  }
  
  return primes;
}

function PrimeCalculator() {
  const [limit, setLimit] = useState(1000);
  const [theme, setTheme] = useState('light'); // unrelated state

  // GALAT TARIKA — useMemo ke bina
  // Har re-render pe (chahe theme change ho) yeh calculation chalegi
  // const primes = findPrimeNumbers(limit); // SLOW!

  // SAHI TARIKA — useMemo ke saath
  // Sirf tab recalculate karo jab `limit` change ho
  const primes = useMemo(() => {
    return findPrimeNumbers(limit);
  }, [limit]); // dependency: limit

  return (
    <div style={{ background: theme === 'light' ? '#fff' : '#333' }}>
      <h2>Prime Numbers Calculator</h2>
      
      <label>
        Limit daalo:
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        />
      </label>
      
      {/* Yeh button se sirf theme change hogi, calculation nahi chalegi */}
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Theme Toggle ({theme})
      </button>
      
      <p>
        {limit} tak ke prime numbers: <strong>{primes.length}</strong> mile
      </p>
      <p>Pehle 10: {primes.slice(0, 10).join(', ')}</p>
    </div>
  );
}

export default PrimeCalculator;
```

### Kab useMemo MAT Use Karo

```jsx
// ZAROORAT NAHI — simple calculation pe useMemo overkill hai
// overhead zyada, fayda kam
const BAD_EXAMPLE = () => {
  const [name, setName] = useState('');
  
  // Yeh simple hai, useMemo ki zaroorat NAHI
  const greeting = useMemo(() => `Hello, ${name}!`, [name]); // ❌ overkill
  
  // Yeh theek hai
  const greeting2 = `Hello, ${name}!`; // ✅ simple enough
  
  return <div>{greeting2}</div>;
};
```

---

## 3. useCallback — Stable Function References

### Real-Life Analogy

Socho tumhara ek **delivery boy** hai jo products deliver karta hai. Har baar tum usse call karo, ek **naya phone number** se call aata hai — delivery boy confuse ho jaata hai ki yeh kaun hai. Lekin agar tum hamesha **same phone number** use karo, delivery boy pehchaan jaata hai.

`useCallback` tumhari function ko same "phone number" deta hai — har render pe naya function nahi banta.

---

### Why It Matters for Child Re-renders

```jsx
import { useState, useCallback, memo } from 'react';

// React.memo se wrap kiya — sirf jab props change ho tab render ho
const TodoItem = memo(({ todo, onDelete, onToggle }) => {
  console.log(`TodoItem render ho raha hai: ${todo.text}`);
  
  return (
    <div style={{ 
      textDecoration: todo.completed ? 'line-through' : 'none',
      padding: '8px',
      border: '1px solid #ccc',
      margin: '4px'
    }}>
      <span>{todo.text}</span>
      <button onClick={() => onToggle(todo.id)}>
        {todo.completed ? 'Incomplete' : 'Complete'}
      </button>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
});

function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'React seekho', completed: false },
    { id: 2, text: 'Node.js seekho', completed: false },
    { id: 3, text: 'Job lo', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [count, setCount] = useState(0); // unrelated state

  // useCallback ke BINA — har render pe naya function banta hai
  // React.memo bekaar ho jaata hai kyunki props (function) change ho jaata hai
  // const handleDelete = (id) => { ... }; // ❌

  // useCallback ke SAATH — same function reference milti hai
  const handleDelete = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []); // koi dependency nahi, function kabhi nahi badlega

  const handleToggle = useCallback((id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []); // setTodos stable hai, toh dependency nahi chahiye

  const handleAdd = () => {
    if (!newTodo.trim()) return;
    setTodos(prev => [
      ...prev,
      { id: Date.now(), text: newTodo, completed: false }
    ]);
    setNewTodo('');
  };

  return (
    <div>
      <h2>Todo App</h2>
      
      {/* Yeh button count badhata hai — todos re-render NAHI honge */}
      <button onClick={() => setCount(c => c + 1)}>
        Click count: {count}
      </button>
      
      <div>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Naya todo daalo"
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}

export default TodoApp;
```

---

## 4. React.memo — Component Memoization

### Real-Life Analogy

Socho ek **teacher** hai jis ko puchho "2+2 kitna hota hai?" — woh same question pe same answer dega. Lekin agar teacher **smart** hai, toh woh pehle check karta hai: "kya yeh question pehle bhi puchha tha? Agar haan, toh same answer do, recalculate mat karo." Yahi kaam karta hai `React.memo`.

```jsx
import { memo, useState } from 'react';

// Ek "expensive" component jo render karne mein time leta hai
const UserCard = memo(({ user, onFollow }) => {
  console.log(`UserCard render: ${user.name}`);
  
  // Simulate karo expensive rendering
  let sum = 0;
  for (let i = 0; i < 100000; i++) sum += i;
  
  return (
    <div style={{ border: '1px solid blue', padding: '16px', margin: '8px' }}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <p>Followers: {user.followers}</p>
      <button onClick={() => onFollow(user.id)}>Follow</button>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function (optional)
  // true return karo agar re-render NAHI karna
  // false return karo agar re-render karna hai
  return prevProps.user.id === nextProps.user.id &&
         prevProps.user.followers === nextProps.user.followers;
});

function UserList() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', followers: 150 },
    { id: 2, name: 'Priya Patel', email: 'priya@example.com', followers: 320 },
    { id: 3, name: 'Amit Kumar', email: 'amit@example.com', followers: 89 },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFollow = useCallback((id) => {
    setUsers(prev =>
      prev.map(u => u.id === id ? { ...u, followers: u.followers + 1 } : u)
    );
  }, []);

  // Filtered users — search change hone pe recalculate
  const filteredUsers = useMemo(
    () => users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [users, searchTerm]
  );

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="User dhundo..."
      />
      {filteredUsers.map(user => (
        <UserCard key={user.id} user={user} onFollow={handleFollow} />
      ))}
    </div>
  );
}
```

### React.memo Kab Use Karein vs Kab Nahi

```
USE KARO jab:
✅ Component ka render expensive ho
✅ Component frequently parent ke saath re-render ho
✅ Props mostly same rehte hain

MAT USE KARO jab:
❌ Component simple hai (div, span, basic text)
❌ Props har render pe change hote hain anyway
❌ Component rarely render hota hai
```

---

## 5. Context API — Global State Without Prop Drilling

### Real-Life Analogy

Socho ek **company ka CEO** hai. Agar CEO ko har employee tak koi message pahunchana ho, toh woh directly email nahi karega har ek ko. Woh **company-wide announcement** karega. Har employee (component) yeh announcement seedha receive kar sakta hai — middle management (intermediate components) ko involve kiye bina. Yahi Context API hai.

---

### AuthContext — Full Example

```jsx
// contexts/AuthContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';

// Step 1: Context banao
const AuthContext = createContext(null);

// Step 2: Provider component banao
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Real app mein yahan API call hogi
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const userData = await response.json();
      setUser(userData.user);
      
      // Token localStorage mein save karo
      localStorage.setItem('token', userData.token);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      if (!response.ok) throw new Error('Registration failed');
      
      const userData = await response.json();
      setUser(userData.user);
      localStorage.setItem('token', userData.token);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Context value — yeh sab accessible hoga consuming components mein
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user, // boolean convenience property
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Step 3: Custom hook banao — convenient access ke liye
export function useAuth() {
  const context = useContext(AuthContext);
  
  // Agar AuthProvider ke bahar use karein toh error do
  if (!context) {
    throw new Error('useAuth ko AuthProvider ke andar use karo!');
  }
  
  return context;
}
```

```jsx
// contexts/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // localStorage se initial theme lo
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [fontSize, setFontSize] = useState('medium');

  // Theme change hone pe localStorage update karo aur body class lagao
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme; // CSS classes ke liye
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const themes = {
    light: {
      background: '#ffffff',
      text: '#000000',
      primary: '#007bff',
      secondary: '#6c757d',
    },
    dark: {
      background: '#1a1a1a',
      text: '#ffffff',
      primary: '#4da6ff',
      secondary: '#adb5bd',
    },
  };

  const value = {
    theme,
    toggleTheme,
    colors: themes[theme],
    fontSize,
    setFontSize,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme ko ThemeProvider ke andar use karo!');
  }
  return context;
}
```

```jsx
// App.jsx — Providers wrap karo
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/Navbar';
import { MainContent } from './components/MainContent';

function App() {
  return (
    // Providers ko nest karo — order matters nahi agar independent hain
    <ThemeProvider>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <MainContent />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Navbar.jsx — Context use karo
function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <nav style={{ background: colors.primary, padding: '16px' }}>
      <span style={{ color: colors.text }}>MyApp</span>
      
      <button onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      
      {isAuthenticated ? (
        <>
          <span>Namaste, {user.name}!</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <a href="/login">Login Karo</a>
      )}
    </nav>
  );
}
```

---

## 6. Redux Toolkit — Production-Grade State Management

### Real-Life Analogy

Socho ek **bank** hai. Customers directly vault mein nahi ja sakte. Ek defined process hai:
- Customer **action** lete hain (deposit, withdraw, transfer)
- Bank **reducer** process karta hai
- **State** (account balance) update hota hai
- Sab transactions ka **log** rehta hai (Redux DevTools!)

Yahi Redux ka model hai.

---

### Full Counter + Todo Example

```bash
# Install karo pehle
npm install @reduxjs/toolkit react-redux
```

```js
// store/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

// createSlice — actions aur reducer ek saath banao
const counterSlice = createSlice({
  name: 'counter', // action type prefix ke liye
  initialState: {
    value: 0,
    step: 1,
    history: [],
  },
  reducers: {
    // Redux Toolkit andar se Immer use karta hai
    // toh tum "mutate" kar sakte ho state ko directly
    // (actually yeh copy ban raha hai purdah ke peeche)
    increment: (state) => {
      state.history.push(state.value);
      state.value += state.step;
    },
    decrement: (state) => {
      state.history.push(state.value);
      state.value -= state.step;
    },
    incrementByAmount: (state, action) => {
      // action.payload mein value aati hai
      state.history.push(state.value);
      state.value += action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    reset: (state) => {
      state.history = [];
      state.value = 0;
    },
  },
});

// Actions export karo
export const { increment, decrement, incrementByAmount, setStep, reset } = counterSlice.actions;

// Reducer export karo
export default counterSlice.reducer;
```

```js
// store/todoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async action — API se todos fetch karna
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos', // action type name
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
      if (!response.ok) throw new Error('Todos nahi mile');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    loading: false,
    error: null,
    filter: 'all', // 'all', 'active', 'completed'
  },
  reducers: {
    addTodo: (state, action) => {
      state.items.push({
        id: Date.now(),
        title: action.payload,
        completed: false,
      });
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(item => item.id === action.payload);
      if (todo) todo.completed = !todo.completed; // Immer ki wajah se yeh kaam karta hai
    },
    deleteTodo: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  // Async actions ke liye extraReducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addTodo, toggleTodo, deleteTodo, setFilter } = todoSlice.actions;
export default todoSlice.reducer;
```

```js
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import todoReducer from './todoSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todoReducer,
  },
  // Redux DevTools automatically enable hota hai development mein
});

// TypeScript users ke liye type exports (JS mein optional)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
```

```jsx
// main.jsx — Provider wrap karo
import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

```jsx
// components/Counter.jsx
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount, setStep, reset } from '../store/counterSlice';

function Counter() {
  // useSelector — store se state nikalo
  const { value, step, history } = useSelector((state) => state.counter);
  
  // useDispatch — actions bhejo store ko
  const dispatch = useDispatch();

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Counter: {value}</h2>
      
      <div>
        <button onClick={() => dispatch(decrement())}>-</button>
        <span style={{ margin: '0 20px', fontSize: '24px' }}>{value}</span>
        <button onClick={() => dispatch(increment())}>+</button>
      </div>
      
      <div style={{ marginTop: '16px' }}>
        <label>Step Size: </label>
        <input
          type="number"
          value={step}
          onChange={(e) => dispatch(setStep(Number(e.target.value)))}
          style={{ width: '60px' }}
        />
      </div>
      
      <button onClick={() => dispatch(incrementByAmount(10))}>+10</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
      
      <div>
        <h4>History: {history.join(' → ')} → {value}</h4>
      </div>
    </div>
  );
}
```

```jsx
// components/TodoList.jsx
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { addTodo, toggleTodo, deleteTodo, setFilter, fetchTodos } from '../store/todoSlice';

function TodoList() {
  const { items, loading, error, filter } = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    // Component mount pe API se todos fetch karo
    dispatch(fetchTodos());
  }, [dispatch]);

  // Filter ke basis pe items nikalo
  const filteredTodos = items.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  const handleAdd = () => {
    if (!inputText.trim()) return;
    dispatch(addTodo(inputText));
    setInputText('');
  };

  if (loading) return <div>Loading todos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Todo List ({filteredTodos.length} items)</h2>
      
      <div>
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Naya todo..."
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      
      <div>
        {['all', 'active', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => dispatch(setFilter(f))}
            style={{ fontWeight: filter === f ? 'bold' : 'normal' }}
          >
            {f}
          </button>
        ))}
      </div>
      
      {filteredTodos.map(todo => (
        <div key={todo.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch(toggleTodo(todo.id))}
          />
          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.title}
          </span>
          <button onClick={() => dispatch(deleteTodo(todo.id))}>🗑️</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 7. Zustand — Lightweight State Management

### Redux vs Zustand Comparison

```
Redux Toolkit:
✅ Mature, large ecosystem
✅ DevTools excellent hain
✅ Large teams ke liye predictable
❌ Boilerplate zyada hai
❌ Setup complex hai

Zustand:
✅ Minimal setup — 5 lines mein start
✅ React ke bahar bhi use ho sakta hai
✅ Flexible
❌ Structure enforce nahi karta
❌ Choti teams ke liye better
```

```bash
npm install zustand
```

```js
// store/useCounterStore.js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// create se store banao — simple function!
const useCounterStore = create(
  devtools(  // Redux DevTools support
    persist(  // localStorage mein save karo
      (set, get) => ({
        // Initial state
        count: 0,
        step: 1,
        history: [],

        // Actions — directly functions hain, no separate action creators
        increment: () => set((state) => ({
          history: [...state.history, state.count],
          count: state.count + state.step,
        })),

        decrement: () => set((state) => ({
          history: [...state.history, state.count],
          count: state.count - state.step,
        })),

        setStep: (newStep) => set({ step: newStep }),

        reset: () => set({ count: 0, history: [] }),

        // get() se current state access karo
        doubleCount: () => get().count * 2,
      }),
      {
        name: 'counter-storage', // localStorage key
        // Sirf count aur step persist karo, history nahi
        partialize: (state) => ({ count: state.count, step: state.step }),
      }
    )
  )
);

export default useCounterStore;
```

```jsx
// Zustand use karna — Redux se zyada simple!
function ZustandCounter() {
  // Sirf jo chahiye woh lo — automatic re-render optimization
  const count = useCounterStore((state) => state.count);
  const step = useCounterStore((state) => state.step);
  const { increment, decrement, setStep, reset } = useCounterStore();

  return (
    <div>
      <h2>Zustand Counter: {count}</h2>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      
      <input
        type="number"
        value={step}
        onChange={(e) => setStep(Number(e.target.value))}
      />
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

---

## 8. Custom Hooks — Apna Hook Banao

### useFetch — Data Fetching Hook

```js
// hooks/useFetch.js
import { useState, useEffect, useCallback } from 'react';

function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      // AbortError ko ignore karo (component unmount pe hota hai)
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [url]); // url change hone pe refetch

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error, refetch } = useFetch(
    `https://api.example.com/users/${userId}`
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error} <button onClick={refetch}>Retry</button></div>;

  return <div>{user.name}</div>;
}
```

### useLocalStorage — Persistent State

```js
// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Lazy initializer — sirf pehli baar chalega
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Agar item hai toh parse karo, nahi toh initialValue use karo
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`useLocalStorage error for key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      // Function bhi accept karo (useState jaise)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`useLocalStorage setValue error:`, error);
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`useLocalStorage removeValue error:`, error);
    }
  };

  return [storedValue, setValue, removeValue];
}

// Usage
function Settings() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'hi');

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <button onClick={removeTheme}>Reset Theme</button>
    </div>
  );
}
```

### useDebounce — Search Optimization

```js
// hooks/useDebounce.js
import { useState, useEffect } from 'react';

// Debounce — user typing roka tab value update karo
// Socho: typing band karne ke 500ms baad search karo
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // delay ke baad value update karo
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup — agar value phir change hui delay ke andar, timer reset karo
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage — search bar mein
function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data: results, loading } = useFetch(
    debouncedSearch ? `/api/search?q=${debouncedSearch}` : null
  );

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Dhundo..."
      />
      {loading && <span>Searching...</span>}
      {/* results show karo */}
    </div>
  );
}
```

### useForm — Form Management

```js
// hooks/useForm.js
import { useState, useCallback } from 'react';

function useForm(initialValues, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    if (rules.required && !value) return `${name} required hai`;
    if (rules.minLength && value.length < rules.minLength) {
      return `Minimum ${rules.minLength} characters chahiye`;
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.patternMessage || 'Invalid format';
    }
    if (rules.custom) return rules.custom(value, values);
    
    return '';
  }, [validationRules, values]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({ ...prev, [name]: fieldValue }));
    
    // Real-time validation (sirf touched fields pe)
    if (touched[name]) {
      const error = validate(name, fieldValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validate]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validate]);

  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e.preventDefault();
    
    // Saare fields validate karo
    const newErrors = {};
    let hasErrors = false;
    
    Object.keys(values).forEach(name => {
      const error = validate(name, values[name]);
      if (error) {
        newErrors[name] = error;
        hasErrors = true;
      }
    });
    
    setErrors(newErrors);
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    if (hasErrors) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
}

// Usage
function RegistrationForm() {
  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
    { name: '', email: '', password: '' },
    {
      name: { required: true, minLength: 2 },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: 'Valid email daalo'
      },
      password: { required: true, minLength: 8 },
    }
  );

  const onSubmit = async (formData) => {
    console.log('Form submit ho gaya:', formData);
    // API call karo
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} placeholder="Naam" />
        {touched.name && errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
      </div>
      
      <div>
        <input name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} placeholder="Email" />
        {touched.email && errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </div>
      
      <div>
        <input type="password" name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} placeholder="Password" />
        {touched.password && errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register Karo'}
      </button>
    </form>
  );
}
```

---

## 9. React Performance Tips

### Lazy Loading aur Code Splitting

```jsx
import { lazy, Suspense } from 'react';

// Normally import karo toh saara code ek bundle mein jaata hai
// Lazy import karo toh alag chunk banta hai — sirf tab load hoga jab chahiye
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Router>
      {/* Suspense batata hai ki loading mein kya dikhana hai */}
      <Suspense fallback={<div>Page load ho raha hai...</div>}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

### React DevTools Profiler

```
DevTools Profiler use karo:
1. Browser mein React DevTools extension install karo
2. "Profiler" tab pe jaao
3. "Record" button dabao
4. App mein kuch karo
5. "Stop" karo
6. Dekho konsa component kitna time le raha hai

Orange/Red = Slow components — optimize karo
Green = Fast components — theek hai
```

---

## 10. Error Boundaries

### Class Component Approach

```jsx
import { Component } from 'react';

// Error Boundaries sirf class components mein likhte hain
// (React 19 mein function component support aa raha hai)
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // Error catch karo — render phase errors ke liye
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Error log karo
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Production mein Sentry ya LogRocket ko bhejo
    console.error('Error Boundary ne error pakda:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', border: '2px solid red', borderRadius: '8px' }}>
          <h2>Kuch galat ho gaya! 😅</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Dobara Try Karo
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Library use karo — react-error-boundary
// npm install react-error-boundary
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <h2>Oops! Error aa gaya</h2>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Reset Karo</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => console.error(error, info)}
      onReset={() => window.location.reload()}
    >
      <MyComponent />
    </ErrorBoundary>
  );
}
```

---

## Common Mistakes (Galtiyan Jo Sabse Zyada Hoti Hain)

```jsx
// ❌ GALAT: useRef value change pe re-render expect karna
const countRef = useRef(0);
countRef.current++; // Yeh screen update NAHI karega!

// ✅ SAHI: Agar screen update chahiye toh useState use karo
const [count, setCount] = useState(0);
setCount(c => c + 1);

// ❌ GALAT: useMemo har jagah use karna
const name = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]); // overkill!

// ✅ SAHI: Simple operations pe directly compute karo
const name = `${firstName} ${lastName}`;

// ❌ GALAT: Context mein saari app state dalna
// Ek hi context mein auth + theme + cart + settings — performance hit hoga!

// ✅ SAHI: Alag alag context banao related state ke liye
<AuthContext> <ThemeContext> <CartContext>

// ❌ GALAT: useCallback bina dependency ke infinite loop
const fetchUser = useCallback(async () => {
  const data = await fetch(`/api/user/${userId}`); // userId dependency mein nahi!
}, []); // Stale closure — purana userId use karega!

// ✅ SAHI
const fetchUser = useCallback(async () => {
  const data = await fetch(`/api/user/${userId}`);
}, [userId]);
```

---

## Interview Questions & Answers

**Q1: useRef aur useState mein kya fark hai?**  
A: `useState` re-render trigger karta hai jab value change hoti hai. `useRef` sirf ek mutable box hai — value change karne se re-render nahi hota. useRef DOM elements pakadne ke liye aur render ke beech values persist karne ke liye use hota hai (jaise interval IDs, previous values).

**Q2: useMemo aur useCallback mein kya fark hai?**  
A: `useMemo` ek **value** cache karta hai (calculation ka result). `useCallback` ek **function** cache karta hai (function reference ko stable rakhta hai). Internally `useCallback(fn, deps)` = `useMemo(() => fn, deps)`.

**Q3: Redux aur Context API mein kya choose karein?**  
A: Simple global state (theme, auth) ke liye Context API enough hai. Complex state with many updates, time-travel debugging, aur large teams ke liye Redux Toolkit better hai. Zustand inka middle ground hai.

**Q4: React.memo kab use karna chahiye?**  
A: Jab ek component frequently unnecessary re-render ho raha ho — matlab uske props change nahi hue but parent re-render hua. Simple, cheap components pe mat use karo — memoization ka bhi overhead hota hai.

**Q5: Custom hook kab banana chahiye?**  
A: Jab same stateful logic (useState + useEffect combination) multiple components mein repeat ho raha ho. Custom hooks code reuse aur separation of concerns ke liye hote hain.

---

## Assignments

### Assignment 1 (useRef + useMemo)
Ek **Word Counter** app banao jisme:
- Textarea mein text type karo
- Word count, character count, sentence count dikho
- useMemo use karo in calculations ke liye
- useRef use karo textarea ko focus karne ke liye (page load pe)

### Assignment 2 (Context API)
**Shopping Cart** app banao jisme:
- CartContext banao with `addItem`, `removeItem`, `clearCart`, `totalPrice`
- ProductList component — products dikhao with "Add to Cart" button
- CartSidebar component — cart items dikhao with total

### Assignment 3 (Redux Toolkit)
**Blog Post Manager** banao jisme:
- Posts fetch karo JSONPlaceholder se (`createAsyncThunk`)
- Posts list dikhao with search/filter
- New post add karo
- Post delete karo
- Redux DevTools mein sab kuch dekho

### Assignment 4 (Custom Hooks)
Teen custom hooks banao aur use karo:
1. `useWindowSize` — window resize pe width/height return kare
2. `useOnClickOutside` — element ke bahar click detect kare (modal close ke liye)
3. `useGeolocation` — user ki location lo (permission ke saath)

---

*Next Module: 05-nodejs-fundamentals.md — Server side seekhne ka time aa gaya!*
