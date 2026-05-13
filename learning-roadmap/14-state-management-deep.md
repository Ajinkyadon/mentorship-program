# State Management Deep Dive — React

## Mentor Note
State management ek aise topic hai jahan beginners se leke seniors tak confuse rehte hain. Is document mein hum step by step dekhenge — kab kya use karna chahiye.

---

## 1. State Management ka Problem — Bina Structure ke Kya Hota Hai

### Real-Life Analogy (Hinglish)
Socho ek joint family hai. Mummy ne Raju ko bataya ki "Papa ka lunch ready hai". Raju ne Priya ko bataya. Priya ne Rahul ko... aur jab tak message Papa tak pahuncha, sab detail change ho gayi. Yahi hota hai prop drilling mein — data ek component se doosre component ke through pass hoti rehti hai, aur ek jagah change karna ho toh kaafi jagahon pe change karna padta hai.

```
State management problems without structure:
1. Prop Drilling      — Data 5-6 levels neeche pass karna
2. Sync Issues        — Same data do jagah rakhna aur sync maintain karna
3. Debug Mushkil      — Koi state kahan se aaya, kaunse component ne change kiya?
4. Performance        — Unnecessary re-renders
5. Scalability        — Team mein kaam karna mushkil
```

### Prop Drilling Example (Bura Code)
```jsx
// Yeh problem ko demonstrate karta hai — aise mat likho!
function App() {
  const [user, setUser] = useState({ name: 'Rahul', role: 'admin' });

  // user ko Grandparent -> Parent -> Child tak pass karna padta hai
  return <Dashboard user={user} setUser={setUser} />;
}

function Dashboard({ user, setUser }) {
  // Dashboard ko user chahiye nahi! Sirf pass karna hai
  return <Sidebar user={user} setUser={setUser} />;
}

function Sidebar({ user, setUser }) {
  // Sidebar ko bhi sirf pass karna hai
  return <UserProfile user={user} setUser={setUser} />;
}

function UserProfile({ user, setUser }) {
  // Asli kaam yahaan hota hai — but 3 levels ka drilling!
  return <div>Hello, {user.name}!</div>;
}
```

---

## 2. Local State (useState) — Kab Kaafi Hai

### Analogy
Apni pocket mein paise rakhna — sirf tumhare kaam ka, kisi aur ko share nahi karna.

```jsx
// useState kab use karo:
// - Sirf ek component ko state ki zaroorat hai
// - UI state (modal open/close, form input, tab selection)
// - Data kisi aur component ke saath share nahi karni

import React, { useState } from 'react';

// Acha example — local UI state
function SearchBox() {
  const [query, setQuery] = useState(''); // Sirf yahi component use karta hai
  const [isOpen, setIsOpen] = useState(false); // Dropdown state

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0); // 3+ chars pe dropdown open karo
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search karo..."
      />
      {isOpen && (
        <div className="dropdown">
          {/* Search results */}
        </div>
      )}
    </div>
  );
}

// Form state — local useState bilkul theek hai
function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Field change pe error clear karo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginUser(formData);
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
      />
      {errors.email && <span className="error">{errors.email}</span>}
      <button disabled={isLoading}>
        {isLoading ? 'Login ho raha hai...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## 3. Lifting State Up — Siblings Mein Sharing

### Analogy
Do bhai (components) ek hi cheez share karna chahte hain. Solution — cheez Mummy (parent) ke paas rakh do, dono bhaion ko access milega.

```jsx
import React, { useState } from 'react';

// Parent — shared state yahan rakho
function ProductPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prev => [...prev, product]);
  };

  return (
    <div>
      {/* Dono siblings ko same state pass ho rahi hai */}
      <CategoryFilter
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <ProductList
        category={selectedCategory}
        onAddToCart={addToCart}
      />
      <CartSummary items={cartItems} />
    </div>
  );
}

function CategoryFilter({ selected, onSelect }) {
  const categories = ['all', 'electronics', 'books', 'clothing'];
  return (
    <div className="filters">
      {categories.map(cat => (
        <button
          key={cat}
          className={selected === cat ? 'active' : ''}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

function ProductList({ category, onAddToCart }) {
  // Category filter ke hisaab se products dikhao
  const products = useProducts(category); // custom hook
  return (
    <div className="products">
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <button onClick={() => onAddToCart(product)}>Cart mein daalo</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 4. Context API — Global State Bina Library Ke

### Performance Gotcha — Important!
```
Context ka sabse bada problem: Jab context value change hoti hai,
SARE consumers re-render ho jaate hain — chahe unhe woh value chahiye ya nahi!

Solution: Context ko split karo — frequently changing state alag, rarely changing alag.
```

```jsx
import React, { createContext, useContext, useState, useMemo } from 'react';

// Context banao — do alag contexts (performance optimization)
const UserContext = createContext(null);        // User info — rarely changes
const UserActionsContext = createContext(null); // Actions — kabhi re-render nahi karenge

// Provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // useMemo — actions object har render pe naya nahi banega
  const actions = useMemo(() => ({
    login: async (credentials) => {
      setIsLoading(true);
      try {
        const loggedInUser = await authService.login(credentials);
        setUser(loggedInUser);
      } finally {
        setIsLoading(false);
      }
    },
    logout: () => {
      setUser(null);
      localStorage.removeItem('token');
    },
    updateProfile: async (data) => {
      const updated = await userService.update(data);
      setUser(updated);
    },
  }), []); // Empty dependency — yeh kabhi re-create nahi hoga

  // User context alag, actions alag — performance better
  return (
    <UserContext.Provider value={{ user, isLoading }}>
      <UserActionsContext.Provider value={actions}>
        {children}
      </UserActionsContext.Provider>
    </UserContext.Provider>
  );
}

// Custom hooks — direct context use karne se better
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser ko UserProvider ke andar use karo!');
  }
  return context;
}

export function useUserActions() {
  const context = useContext(UserActionsContext);
  if (!context) {
    throw new Error('useUserActions ko UserProvider ke andar use karo!');
  }
  return context;
}

// Usage
function Navbar() {
  const { user } = useUser();           // Sirf user ke change pe re-render
  const { logout } = useUserActions();  // Kabhi re-render nahi karega

  return (
    <nav>
      <span>Hello, {user?.name}!</span>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
```

---

## 5. Context + useReducer — Redux Jaisa Pattern

```jsx
import React, { createContext, useContext, useReducer, useMemo } from 'react';

// State shape define karo
const initialState = {
  todos: [],
  filter: 'all', // 'all' | 'active' | 'completed'
};

// Actions
const TODO_ACTIONS = {
  ADD: 'ADD_TODO',
  TOGGLE: 'TOGGLE_TODO',
  DELETE: 'DELETE_TODO',
  SET_FILTER: 'SET_FILTER',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED',
};

// Reducer — pure function, koi side effects nahi
function todoReducer(state, action) {
  switch (action.type) {
    case TODO_ACTIONS.ADD:
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false,
          },
        ],
      };

    case TODO_ACTIONS.TOGGLE:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo,
        ),
      };

    case TODO_ACTIONS.DELETE:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };

    case TODO_ACTIONS.SET_FILTER:
      return { ...state, filter: action.payload };

    case TODO_ACTIONS.CLEAR_COMPLETED:
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };

    default:
      return state;
  }
}

// Context
const TodoContext = createContext(null);

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Action creators — dispatch directly nahi karna padega
  const actions = useMemo(() => ({
    addTodo: (text) => dispatch({ type: TODO_ACTIONS.ADD, payload: text }),
    toggleTodo: (id) => dispatch({ type: TODO_ACTIONS.TOGGLE, payload: id }),
    deleteTodo: (id) => dispatch({ type: TODO_ACTIONS.DELETE, payload: id }),
    setFilter: (filter) => dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: filter }),
    clearCompleted: () => dispatch({ type: TODO_ACTIONS.CLEAR_COMPLETED }),
  }), []);

  // Filtered todos compute karo
  const filteredTodos = useMemo(() => {
    switch (state.filter) {
      case 'active':    return state.todos.filter(t => !t.completed);
      case 'completed': return state.todos.filter(t => t.completed);
      default:          return state.todos;
    }
  }, [state.todos, state.filter]);

  const value = useMemo(() => ({
    todos: filteredTodos,
    filter: state.filter,
    totalCount: state.todos.length,
    completedCount: state.todos.filter(t => t.completed).length,
    ...actions,
  }), [filteredTodos, state.filter, state.todos, actions]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}

export const useTodos = () => {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodos ko TodoProvider ke andar use karo!');
  return ctx;
};

// Components
function TodoApp() {
  return (
    <TodoProvider>
      <h1>Meri Todo List</h1>
      <AddTodo />
      <TodoFilters />
      <TodoList />
      <TodoStats />
    </TodoProvider>
  );
}

function AddTodo() {
  const [input, setInput] = React.useState('');
  const { addTodo } = useTodos();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      addTodo(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Kya karna hai aaj?"
      />
      <button type="submit">Add Karo</button>
    </form>
  );
}

function TodoList() {
  const { todos, toggleTodo, deleteTodo } = useTodos();

  if (todos.length === 0) return <p>Koi todo nahi hai!</p>;

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.text}
          </span>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## 6. Redux Toolkit — Industry Standard

```bash
npm install @reduxjs/toolkit react-redux
```

```typescript
// store/slices/notesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Async thunk — API calls ke liye
export const fetchNotes = createAsyncThunk(
  'notes/fetchAll',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/notes?userId=${userId}`);
      if (!response.ok) throw new Error('Notes nahi mile!');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNote = createAsyncThunk(
  'notes/create',
  async (noteData: { title: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

interface Note {
  id: number;
  title: string;
  content: string;
}

interface NotesState {
  items: Note[];
  loading: boolean;
  error: string | null;
  selectedId: number | null;
}

const initialState: NotesState = {
  items: [],
  loading: false,
  error: null,
  selectedId: null,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    // Synchronous actions
    selectNote: (state, action: PayloadAction<number>) => {
      state.selectedId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Immer use karta hai — directly mutate kar sakte ho!
    deleteNoteLocal: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(note => note.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // fetchNotes cases
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createNote cases
      .addCase(createNote.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export const { selectNote, clearError, deleteNoteLocal } = notesSlice.actions;
export default notesSlice.reducer;
```

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './slices/notesSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    auth: authReducer,
  },
});

// TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// hooks/redux.ts — Typed hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// In hooks throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

```tsx
// Components mein use karo
function NotesList() {
  const dispatch = useAppDispatch();
  const { items: notes, loading, error } = useAppSelector(state => state.notes);
  const userId = useAppSelector(state => state.auth.user?.id);

  React.useEffect(() => {
    if (userId) dispatch(fetchNotes(userId));
  }, [dispatch, userId]);

  if (loading) return <div>Notes load ho rahe hain...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {notes.map(note => (
        <li key={note.id}>{note.title}</li>
      ))}
    </ul>
  );
}
```

---

## 7. Zustand — Minimal Boilerplate

```bash
npm install zustand
```

```typescript
// stores/useNotesStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface Note {
  id: number;
  title: string;
  content: string;
}

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  // Actions — state ke saath define hoti hain
  fetchNotes: () => Promise<void>;
  addNote: (note: Omit<Note, 'id'>) => Promise<void>;
  deleteNote: (id: number) => void;
  clearError: () => void;
}

export const useNotesStore = create<NotesState>()(
  devtools(  // Redux DevTools mein dikhega
    persist(  // LocalStorage mein persist karega
      (set, get) => ({
        notes: [],
        isLoading: false,
        error: null,

        fetchNotes: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch('/api/notes');
            const notes = await response.json();
            set({ notes, isLoading: false });
          } catch (err) {
            set({ error: err.message, isLoading: false });
          }
        },

        addNote: async (noteData) => {
          try {
            const response = await fetch('/api/notes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(noteData),
            });
            const newNote = await response.json();
            // Immer nahi chahiye — spread use karo
            set(state => ({ notes: [...state.notes, newNote] }));
          } catch (err) {
            set({ error: err.message });
          }
        },

        deleteNote: (id) => {
          set(state => ({
            notes: state.notes.filter(note => note.id !== id),
          }));
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: 'notes-storage', // LocalStorage key
        partialize: (state) => ({ notes: state.notes }), // Sirf notes persist karo
      }
    )
  )
);

// Usage — itna simple!
function NotesList() {
  const { notes, isLoading, fetchNotes, deleteNote } = useNotesStore();

  React.useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <ul>
      {notes.map(note => (
        <li key={note.id}>
          {note.title}
          <button onClick={() => deleteNote(note.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

### Redux vs Zustand Comparison
```
Redux Toolkit:
+ Large team standard — sab jaante hain
+ DevTools excellent hain
+ Time-travel debugging
+ Strict patterns — team consistency
- Boilerplate zyada hai
- Seekhna time lagta hai

Zustand:
+ Minimal boilerplate — ek file mein sab
+ TypeScript support excellent
+ React ke bahar bhi use ho sakta hai
+ Bundle size chhota
- Patterns less opinionated — discipline chahiye
- Smaller community

Rule of thumb: Solo/small teams → Zustand, Large teams → RTK
```

---

## 8. React Query — Server State Management

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes tak data "fresh" consider hoga
      retry: 2,                    // Fail hone pe 2 baar retry karo
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

```tsx
// hooks/useNotes.ts — React Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const notesApi = {
  getAll: async (): Promise<Note[]> => {
    const res = await fetch('/api/notes', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!res.ok) throw new Error('Notes fetch failed!');
    return res.json();
  },

  create: async (data: CreateNoteInput): Promise<Note> => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Note create failed!');
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!res.ok) throw new Error('Delete failed!');
  },
};

// Query hook
export function useNotes() {
  return useQuery({
    queryKey: ['notes'],        // Cache key — unique identifier
    queryFn: notesApi.getAll,
    staleTime: 2 * 60 * 1000,  // 2 minutes
  });
}

// Create mutation with optimistic update
export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.create,

    // Optimistic Update — API complete hone se pehle UI update karo
    onMutate: async (newNote) => {
      // Ongoing refetch cancel karo (race condition avoid)
      await queryClient.cancelQueries({ queryKey: ['notes'] });

      // Current cache save karo (rollback ke liye)
      const previousNotes = queryClient.getQueryData<Note[]>(['notes']);

      // Optimistically update — API response ka wait mat karo
      queryClient.setQueryData<Note[]>(['notes'], (old = []) => [
        ...old,
        { id: Date.now(), ...newNote }, // Temporary id
      ]);

      return { previousNotes }; // Context mein pass hoga onError ke liye
    },

    // API fail hua toh rollback karo
    onError: (err, newNote, context) => {
      queryClient.setQueryData(['notes'], context?.previousNotes);
    },

    // Success ya error — dono mein refetch karo (actual data sync)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

// Delete mutation
export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.delete,
    onSuccess: (_, deletedId) => {
      // Cache se directly remove karo — refetch ki zaroorat nahi
      queryClient.setQueryData<Note[]>(['notes'], (old = []) =>
        old.filter(note => note.id !== deletedId)
      );
    },
  });
}

// Component mein use karo
function NotesList() {
  const { data: notes, isLoading, error, isFetching } = useNotes();
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div>
      {/* Background mein refetch ho raha hai toh subtle indicator */}
      {isFetching && <span>Sync ho raha hai...</span>}

      <button
        onClick={() => createNote.mutate({ title: 'Nayi Note', content: '...' })}
        disabled={createNote.isPending}
      >
        {createNote.isPending ? 'Create ho raha hai...' : 'Note Banao'}
      </button>

      {notes?.map(note => (
        <div key={note.id}>
          <h3>{note.title}</h3>
          <button
            onClick={() => deleteNote.mutate(note.id)}
            disabled={deleteNote.isPending}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 9. Decision Tree — Kab Kya Use Karein

```
State Management Decision Tree:

Q1: Kya state sirf ek component use karta hai?
  YES → useState use karo. Done.
  NO  → Q2 pe jao

Q2: Kya 2-3 closely related components share karte hain?
  YES → Lift state up (parent mein rakh do). Done.
  NO  → Q3 pe jao

Q3: Kya yeh server se aane wali data hai (API calls)?
  YES → React Query / TanStack Query use karo. Done.
  NO  → Q4 pe jao

Q4: Kya app chhoti hai aur team chhoti hai?
  YES → Context + useReducer ya Zustand. Done.
  NO  → Q5 pe jao

Q5: Large team, enterprise app?
  → Redux Toolkit use karo (industry standard, sab jaante hain)

Summary Table:
┌──────────────────┬─────────────────────────────────┐
│ Situation        │ Solution                        │
├──────────────────┼─────────────────────────────────┤
│ Simple UI state  │ useState                        │
│ Siblings share   │ Lift state up                   │
│ Theme/Auth       │ Context API                     │
│ Complex UI state │ Context + useReducer / Zustand  │
│ API/Server data  │ React Query (TanStack)           │
│ Large enterprise │ Redux Toolkit + React Query      │
└──────────────────┴─────────────────────────────────┘
```

---

## 10. Common Mistakes

```jsx
// GALAT: Har cheez global state mein daalna
const globalStore = {
  // Yeh sab local state hona chahiye!
  inputValue: '',          // Form input — local useState
  isModalOpen: false,      // UI state — local useState
  activeTab: 'home',       // Local component state
  tooltipVisible: false,   // Local useState

  // Yeh sahi hai global mein:
  currentUser: null,
  authToken: null,
  theme: 'dark',
};

// GALAT: Server state aur UI state mix karna
const badStore = {
  users: [],           // Server state — React Query use karo!
  isLoading: false,    // React Query handle karta hai
  error: null,         // React Query handle karta hai
  searchQuery: '',     // Yeh local state hai
};

// SAHI: Server state React Query mein
function UsersList() {
  // React Query server state handle karta hai
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // UI state local mein
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const filteredUsers = users?.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (/* ... */);
}

// GALAT: Context mein frequently changing data rakhna
// Har update pe saare consumers re-render honge!
const AppContext = createContext({
  mousePosition: { x: 0, y: 0 }, // Bahut frequently change hota hai!
  scrollPosition: 0,               // Har scroll pe context update!
});

// SAHI: Frequently changing data ke liye context mat use karo
// Local state ya ref use karo
function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // Sirf yahi component use karta hai — local state perfect hai
}
```

---

## Interview Questions & Answers

**Q1: Redux aur Context API mein kya fark hai?**
A: Context API React ka built-in feature hai, Redux external library. Context mein performance issue ho sakta hai — har context change pe saare consumers re-render hote hain. Redux mein selective subscription hota hai (`useSelector`) — sirf woh components re-render hote hain jinhe specific state chahiye. Redux DevTools better hain. Small apps ke liye Context kaafi hai, large apps ke liye Redux better.

**Q2: Server state aur client state mein kya fark hai?**
A: Client state (UI state) — sirf browser mein exist karta hai: modal open/close, selected tab, form input. Server state — server pe exist karta hai, hum sirf copy cache karte hain: user list, products, orders. Server state stale ho sakti hai, sync karna padta hai. React Query specifically server state ke liye banaya gaya hai — caching, background refetching, stale time sab handle karta hai.

**Q3: Optimistic updates kya hote hain?**
A: API ka response aane se pehle hi UI update kar do. User ne "Like" button dabaya — pehle UI mein like show karo, background mein API call karo. Agar API fail ho toh rollback karo. React Query mein `onMutate`, `onError`, `onSettled` ka use karke implement hota hai. User experience bahut better ho jaata hai.

**Q4: Redux Toolkit vs vanilla Redux?**
A: Vanilla Redux mein bahut boilerplate hota hai — actions, action creators, reducers sab alag likhne padte hain. RTK mein `createSlice` se sab ek jagah. RTK mein Immer built-in hai — directly mutate kar sakte ho. RTK Query mein data fetching bhi built-in. RTK recommended approach hai, vanilla Redux ko naya project mein use nahi karna chahiye.

---

## Assignment

**Task: E-commerce Cart System banao**

Requirements:
1. Product listing — React Query se products fetch karo
2. Search aur filter — local useState
3. Cart state — Zustand ya Redux Toolkit
4. User authentication state — Context API
5. Order history — React Query se fetch karo

Specific items:
- Optimistic add-to-cart implement karo
- Cart local storage mein persist karo (Zustand persist middleware)
- Loading aur error states handle karo
- CartContext banao ya Zustand store use karo

**Bonus:**
- Infinite scroll implement karo (React Query `useInfiniteQuery`)
- Debounced search implement karo
- Cart summary sidebar mein real-time update ho
