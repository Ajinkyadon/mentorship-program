# Module 5: Frontend Development
### "Jo user dekhta hai — wo tumne banaya"

---

## HTML — Web ka Skeleton

### Semantic HTML
```html
<!-- Bad — non-semantic -->
<div class="header">...</div>
<div class="nav">...</div>
<div class="main">...</div>

<!-- Good — semantic -->
<header>...</header>
<nav>...</nav>
<main>
  <article>...</article>
  <aside>...</aside>
</main>
<footer>...</footer>
```

**Semantic elements:** `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<figure>`, `<time>`

**Why semantic matters:**
- SEO — search engines better samajhte hain
- Accessibility — screen readers properly navigate kar sake
- Readability — code maintenance easy

### Forms
```html
<form action="/submit" method="POST">
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required placeholder="you@example.com">

  <label for="password">Password:</label>
  <input type="password" id="password" name="password" minlength="8" required>

  <select name="role">
    <option value="">Select role</option>
    <option value="student">Student</option>
    <option value="mentor">Mentor</option>
  </select>

  <textarea name="bio" rows="4" maxlength="500"></textarea>

  <button type="submit">Register</button>
</form>
```

### Accessibility Basics
```html
<!-- Alt text for images -->
<img src="profile.jpg" alt="Rahul Kumar's profile photo">

<!-- ARIA labels -->
<button aria-label="Close dialog">✕</button>

<!-- Form labels -->
<label for="username">Username</label>
<input id="username" type="text">
```

---

## CSS — Web ka Design

### Box Model
```
Every element is a box:

  ┌─────────────────────────────┐
  │         MARGIN              │
  │  ┌───────────────────────┐  │
  │  │       BORDER          │  │
  │  │  ┌─────────────────┐  │  │
  │  │  │    PADDING      │  │  │
  │  │  │  ┌───────────┐  │  │  │
  │  │  │  │  CONTENT  │  │  │  │
  │  │  │  └───────────┘  │  │  │
  │  │  └─────────────────┘  │  │
  │  └───────────────────────┘  │
  └─────────────────────────────┘
```

```css
.card {
  width: 300px;
  padding: 20px;       /* andar space */
  border: 1px solid #ddd;
  margin: 16px;        /* bahar space */
  box-sizing: border-box; /* always add this */
}
```

### Flexbox (Must Master)
```css
.container {
  display: flex;
  flex-direction: row;          /* row | column */
  justify-content: space-between; /* main axis alignment */
  align-items: center;          /* cross axis alignment */
  gap: 16px;                    /* space between items */
  flex-wrap: wrap;              /* items wrap to next line */
}

.item {
  flex: 1;                      /* grow/shrink equally */
  flex-shrink: 0;               /* don't shrink */
}
```

**Use flexbox for:**
- Navigation bars
- Card rows
- Centering elements
- Evenly spaced items

### CSS Grid
```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  grid-template-rows: auto;
  gap: 20px;
}

/* Responsive grid */
.grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
```

### Responsive Design
```css
/* Mobile first approach (recommended) */
.container { width: 100%; padding: 16px; }

/* Tablet */
@media (min-width: 768px) {
  .container { max-width: 768px; margin: 0 auto; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { max-width: 1200px; }
}
```

### CSS Variables
```css
:root {
  --primary: #3b82f6;
  --secondary: #64748b;
  --danger: #ef4444;
  --font-base: 16px;
  --radius: 8px;
  --shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.button {
  background: var(--primary);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
```

### Specificity (Interview Topic)
```
Inline style    → 1000
ID (#id)        → 100
Class (.class)  → 10
Element (div)   → 1

.nav a         → 11  (10 + 1)
#header .nav a → 111 (100 + 10 + 1)
```

---

## JavaScript for Frontend

### DOM Manipulation
```js
// Select elements
const btn = document.getElementById('submit-btn');
const cards = document.querySelectorAll('.card');
const form = document.querySelector('form');

// Modify content
btn.textContent = 'Loading...';
btn.innerHTML = '<span>Loading...</span>';

// Modify style
btn.style.backgroundColor = '#3b82f6';
btn.classList.add('active');
btn.classList.remove('disabled');
btn.classList.toggle('dark');

// Modify attributes
input.setAttribute('disabled', true);
img.src = 'new-image.jpg';

// Create and append elements
const li = document.createElement('li');
li.textContent = 'New item';
list.appendChild(li);
list.prepend(li);           // start mein
list.removeChild(li);       // remove

// Event listeners
btn.addEventListener('click', handleClick);
form.addEventListener('submit', handleSubmit);
input.addEventListener('input', handleInput);
window.addEventListener('scroll', handleScroll);
```

### Event Handling
```js
function handleSubmit(event) {
  event.preventDefault();      // default form submission rok do

  const formData = new FormData(event.target);
  const name = formData.get('name');

  // Or directly
  const name = document.getElementById('name').value;
}

// Event delegation (better for dynamic elements)
document.getElementById('todo-list').addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    e.target.closest('li').remove();
  }
});
```

### API Integration (Fetch)
```js
// GET request
async function getUsers() {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    renderUsers(data);
  } catch (err) {
    showError(err.message);
  }
}

// POST request
async function createUser(userData) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(userData)
  });
  return response.json();
}
```

---

## Frontend Architecture

### Component Thinking

Ek page ko **independent pieces** mein toro:

```
Page
├── Navbar
│   ├── Logo
│   ├── NavLinks
│   └── AuthButtons
├── HeroSection
├── ProductGrid
│   └── ProductCard (repeated)
├── Footer
└── Modal (conditional)
```

Har component:
- Apna kaam kare
- Props (data) receive kare
- Reusable ho

### Folder Structure
```
src/
├── components/
│   ├── Navbar.js
│   ├── ProductCard.js
│   └── Modal.js
├── pages/
│   ├── Home.js
│   ├── Login.js
│   └── Dashboard.js
├── utils/
│   ├── api.js          (fetch functions)
│   ├── validators.js   (form validation)
│   └── helpers.js
├── styles/
│   └── global.css
└── index.js
```

---

## Form Validation

```js
function validateRegistrationForm(data) {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!data.password || data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
```

---

## State Handling (Vanilla JS)

```js
// Simple state object
const state = {
  user: null,
  todos: [],
  loading: false,
  error: null
};

// Update state and re-render
function setState(updates) {
  Object.assign(state, updates);
  render();
}

function render() {
  document.getElementById('todo-count').textContent = state.todos.length;
  document.getElementById('loading').style.display =
    state.loading ? 'block' : 'none';
}
```

---

## Local Storage

```js
// Store data
localStorage.setItem('token', 'jwt_token_here');
localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Rahul' }));

// Retrieve
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// Remove
localStorage.removeItem('token');
localStorage.clear();  // sab kuch clear

// Session storage (tab close = data gone)
sessionStorage.setItem('tempData', value);
```

---

## Performance Basics

```
1. Images optimize karo — WebP format, lazy loading
2. CSS/JS files minify karo
3. CDN use karo static files ke liye
4. Debounce search inputs
5. Avoid DOM manipulation in loops
6. Use CSS animations instead of JS where possible
7. Lazy load components (load when needed)
```

```js
// Debounce example
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const handleSearch = debounce(async (query) => {
  const results = await searchAPI(query);
  renderResults(results);
}, 300); // wait 300ms after user stops typing
```

---

## Assignment — Module 5

1. **Project:** Responsive portfolio website — HTML + CSS only (mobile aur desktop dono)
2. **Exercise:** Ek form banao with validation — name, email, password, confirm password
3. **Exercise:** Ek todo list banao — Add, Delete, Mark Complete — vanilla JS, no framework
4. **Exercise:** Public API se data fetch karo aur cards mein render karo
5. **Review:** Apni portfolio site mobile pe check karo — responsive hai?
