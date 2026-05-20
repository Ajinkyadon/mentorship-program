# Step 02: Frontend Basics
### "Jo user dekhta hai — web ka chehra"

---

## What is Frontend?

Frontend = **Browser mein jo dikhta hai aur jisse user interact karta hai.**

```
Three technologies milke frontend bante hain:

HTML  → Structure    (skeleton)
CSS   → Styling      (looks, design)
JS    → Behaviour    (interactive, dynamic)

Example:
HTML: "Yahan ek button hai"
CSS:  "Button blue hai, rounded corners hain"
JS:   "Button click hone pe form submit ho"
```

---

## HTML — HyperText Markup Language

### Document Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="My portfolio website">
  <title>Rahul Kumar — Developer</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <nav>...</nav>
  </header>
  <main>
    <section id="about">...</section>
    <section id="projects">...</section>
  </main>
  <footer>...</footer>
  <script src="app.js"></script>
</body>
</html>
```

### Semantic HTML

**Non-semantic:** `<div>`, `<span>` — tells nothing about content.  
**Semantic:** `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>` — meaning clear hai.

```html
<!-- Bad — all divs, no meaning -->
<div class="header">
  <div class="nav">
    <div class="nav-item">Home</div>
  </div>
</div>
<div class="content">
  <div class="post">
    <div class="post-title">Hello World</div>
    <div class="post-body">...</div>
  </div>
</div>

<!-- Good — semantic elements -->
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
<main>
  <article>
    <h1>Hello World</h1>
    <p>...</p>
  </article>
</main>
```

### All Semantic Elements
```html
<header>    → Page ya section ka top part
<nav>       → Navigation links
<main>      → Page ka main content (ek hi hona chahiye)
<section>   → Thematically grouped content
<article>   → Self-contained content (blog post, news article)
<aside>     → Sidebar, related content
<footer>    → Page ya section ka bottom
<figure>    → Image with caption
<figcaption>→ Image caption
<time>      → Date/time
<mark>      → Highlighted text
<details>   → Collapsible content
<summary>   → Details ka heading
```

### HTML Elements Deep Dive

**Headings (hierarchy important hai):**
```html
<h1>Page Title — sirf ek per page</h1>
<h2>Section Heading</h2>
<h3>Subsection</h3>
<!-- h1 → h2 → h3 → skip mat karo -->
```

**Text:**
```html
<p>Paragraph</p>
<strong>Bold (important)</strong>
<em>Italic (emphasis)</em>
<small>Small text</small>
<del>Deleted text</del>
<ins>Inserted text</ins>
<code>inline code</code>
<pre><code>block of code</code></pre>
<blockquote>Quote from someone</blockquote>
```

**Links:**
```html
<a href="https://google.com">External link</a>
<a href="/about">Internal link</a>
<a href="#section-id">Same page jump</a>
<a href="mailto:me@example.com">Email link</a>
<a href="tel:+919999999999">Phone link</a>
<a href="..." target="_blank" rel="noopener noreferrer">Open in new tab</a>
```

**Images:**
```html
<img src="photo.jpg" alt="Rahul Kumar smiling" width="400" height="300">
<!-- alt MUST be descriptive — accessibility + SEO -->
<!-- width/height — prevent layout shift -->

<!-- Responsive image -->
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px, 800px"
  alt="Photo"
  loading="lazy"
>
```

**Lists:**
```html
<ul>  <!-- Unordered — bullets -->
  <li>Mango</li>
  <li>Banana</li>
</ul>

<ol>  <!-- Ordered — numbers -->
  <li>Step 1</li>
  <li>Step 2</li>
</ol>

<dl>  <!-- Definition list -->
  <dt>API</dt>
  <dd>Application Programming Interface</dd>
</dl>
```

### HTML Forms (Very Important)
```html
<form action="/register" method="POST" novalidate>

  <!-- Text inputs -->
  <input type="text"     name="name"     placeholder="Full Name"  required minlength="2">
  <input type="email"    name="email"    placeholder="Email"      required>
  <input type="password" name="password" placeholder="Password"   required minlength="8">
  <input type="number"   name="age"      min="18" max="100">
  <input type="tel"      name="phone"    pattern="[0-9]{10}">
  <input type="url"      name="website">
  <input type="date"     name="dob">
  <input type="file"     name="avatar"   accept="image/*">
  <input type="hidden"   name="csrf"     value="token123">

  <!-- Checkbox and radio -->
  <input type="checkbox" name="agree" id="agree" required>
  <label for="agree">I agree to terms</label>

  <input type="radio" name="gender" value="male"   id="male">   <label for="male">Male</label>
  <input type="radio" name="gender" value="female" id="female"> <label for="female">Female</label>

  <!-- Dropdown -->
  <select name="city">
    <option value="">-- Select City --</option>
    <option value="mumbai">Mumbai</option>
    <option value="pune">Pune</option>
  </select>

  <!-- Multi-select -->
  <select name="skills" multiple>
    <option value="js">JavaScript</option>
    <option value="node">Node.js</option>
  </select>

  <!-- Textarea -->
  <textarea name="bio" rows="4" maxlength="500" placeholder="About you"></textarea>

  <!-- Buttons -->
  <button type="submit">Register</button>
  <button type="reset">Clear</button>
  <button type="button" onclick="doSomething()">Action</button>

</form>
```

### HTML Tables
```html
<table>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Age</th>
      <th scope="col">City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Rahul</td>
      <td>22</td>
      <td>Mumbai</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3">Total: 1 student</td>
    </tr>
  </tfoot>
</table>
```

### Meta Tags (SEO + Social)
```html
<head>
  <!-- Basic SEO -->
  <meta name="description" content="Portfolio of Rahul Kumar, Backend Developer">
  <meta name="keywords" content="developer, node.js, portfolio">
  <meta name="author" content="Rahul Kumar">

  <!-- Open Graph (Facebook/LinkedIn preview) -->
  <meta property="og:title" content="Rahul Kumar — Developer">
  <meta property="og:description" content="Backend developer specializing in Node.js">
  <meta property="og:image" content="https://example.com/og-image.png">
  <meta property="og:url" content="https://rahulkumar.dev">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Rahul Kumar — Developer">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/favicon.png">
</head>
```

---

## CSS — Cascading Style Sheets

### How CSS Works
```
Cascading = Jab multiple rules same element pe apply hoti hain,
            specificity decide karta hai kaunsi win karegi.

Inheritance = Kuch properties automatically parent se child mein jaati hain
              (color, font-family, etc.)
```

### CSS Selectors
```css
/* Element */
p { color: red; }

/* Class */
.card { background: white; }

/* ID */
#header { position: sticky; }

/* Attribute */
input[type="email"] { border: 2px solid blue; }
a[href^="https"] { color: green; } /* href starts with */
a[href$=".pdf"] { color: red; }    /* href ends with */

/* Pseudo-class */
a:hover { text-decoration: underline; }
li:first-child { font-weight: bold; }
li:last-child { margin-bottom: 0; }
li:nth-child(2) { color: blue; }
li:nth-child(odd) { background: #f0f0f0; }
input:focus { outline: 2px solid blue; }
input:invalid { border-color: red; }
button:disabled { opacity: 0.5; }

/* Pseudo-element */
p::first-line { font-weight: bold; }
p::before { content: "→ "; }
p::after  { content: " ←"; }
::selection { background: yellow; }
::placeholder { color: #aaa; }

/* Combinators */
div p { ... }        /* All p inside div (descendant) */
div > p { ... }      /* Direct child p of div */
h1 + p { ... }       /* p immediately after h1 (adjacent sibling) */
h1 ~ p { ... }       /* All p after h1 (general sibling) */
```

### CSS Specificity
```
Inline style        → 1000
ID (#id)            → 100
Class (.class)      → 10
Attribute ([attr])  → 10
Pseudo-class (:hover)→ 10
Element (div, p)    → 1
Pseudo-element (::before) → 1

Examples:
#nav .item a        → 100 + 10 + 1 = 111
.header nav ul li   → 10 + 1 + 1 + 1 = 13

!important          → Sab override karta hai — avoid karo
```

### Box Model
```css
.element {
  /* Content */
  width: 300px;
  height: 200px;

  /* Padding — andar space (background color mein aata hai) */
  padding: 20px;                    /* all sides */
  padding: 10px 20px;              /* top/bottom, left/right */
  padding: 10px 20px 15px 25px;   /* top right bottom left (clockwise) */

  /* Border */
  border: 2px solid #333;
  border-radius: 8px;              /* rounded corners */
  border-top: none;                /* specific side */

  /* Margin — bahar space (transparent) */
  margin: 16px;
  margin: 0 auto;                  /* center karo (left/right: auto) */

  /* IMPORTANT: box-sizing */
  box-sizing: border-box; /* width includes padding + border — use this always */
  /* default (content-box): width = content only, padding adds to total */
}

/* Global reset — always add this */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

### CSS Flexbox
```css
.container {
  display: flex;

  /* Main axis direction */
  flex-direction: row;            /* default: left to right */
  flex-direction: column;         /* top to bottom */
  flex-direction: row-reverse;    /* right to left */
  flex-direction: column-reverse; /* bottom to top */

  /* Main axis alignment (justify) */
  justify-content: flex-start;    /* default — start pe */
  justify-content: flex-end;      /* end pe */
  justify-content: center;        /* center mein */
  justify-content: space-between; /* items ke beech space */
  justify-content: space-around;  /* items ke around space */
  justify-content: space-evenly;  /* equal space everywhere */

  /* Cross axis alignment (align) */
  align-items: stretch;           /* default — full height */
  align-items: flex-start;        /* top pe */
  align-items: flex-end;          /* bottom pe */
  align-items: center;            /* middle mein */
  align-items: baseline;          /* text baseline align */

  /* Wrapping */
  flex-wrap: nowrap;              /* default — ek line mein */
  flex-wrap: wrap;                /* next line pe jaao */
  flex-wrap: wrap-reverse;        /* reverse wrap */

  /* Gap between items */
  gap: 16px;
  row-gap: 8px;
  column-gap: 16px;
}

.item {
  flex: 1;                  /* grow + shrink equally */
  flex-grow: 1;             /* extra space lo */
  flex-shrink: 0;           /* mat shrink karo */
  flex-basis: 200px;        /* starting size */

  align-self: center;       /* sirf is item ke liye override */
  order: 2;                 /* visual order change (DOM order nahi)*/
}
```

**Common Flexbox Patterns:**
```css
/* Perfect center */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

/* Card row that wraps */
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.card {
  flex: 1 1 300px; /* grow, shrink, min-width 300px */
}
```

### CSS Grid
```css
.grid {
  display: grid;

  /* Define columns */
  grid-template-columns: 200px 1fr 1fr;          /* fixed + flexible */
  grid-template-columns: repeat(3, 1fr);          /* 3 equal columns */
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* responsive */

  /* Define rows */
  grid-template-rows: auto;
  grid-template-rows: 80px 1fr auto; /* header, main, footer */

  /* Gap */
  gap: 20px;
  row-gap: 10px;
  column-gap: 20px;

  /* Template areas */
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

/* Place items */
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }

/* Span multiple cells */
.wide-item {
  grid-column: 1 / 3;   /* column 1 to 3 */
  grid-row: 1 / 2;      /* row 1 to 2 */
  /* OR: */
  grid-column: span 2;  /* 2 columns occupy karo */
}
```

### Responsive Design
```css
/* Mobile First (recommended) */
/* Base styles = mobile */
.container {
  width: 100%;
  padding: 16px;
}

.card {
  width: 100%;
  margin-bottom: 16px;
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    margin: 0 auto;
    padding: 24px;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    padding: 32px;
  }

  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large: 1440px+ */
@media (min-width: 1440px) {
  .container {
    max-width: 1440px;
  }
}

/* Print */
@media print {
  .navbar, .sidebar { display: none; }
  body { font-size: 12pt; }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  body { background: #1a1a1a; color: #f0f0f0; }
}
```

### CSS Variables
```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-secondary: #64748b;
  --color-success: #22c55e;
  --color-danger: #ef4444;
  --color-warning: #f59e0b;

  /* Typography */
  --font-family: 'Inter', system-ui, sans-serif;
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Border */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}

/* Dark mode override */
[data-theme="dark"] {
  --color-primary: #60a5fa;
  --bg: #0f172a;
  --text: #f8fafc;
}
```

### CSS Animations
```css
/* Transition (state change pe) */
.button {
  background: var(--color-primary);
  transition: background 0.2s ease, transform 0.1s ease;
}
.button:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

/* Keyframe animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.card {
  animation: fadeIn 0.3s ease forwards;
}

.loader {
  animation: spin 1s linear infinite;
}
```

---

## JavaScript — Frontend Behaviour

(Full JS detail Module 4 aur 05-frontend-development.md mein hai)

**Frontend mein JS ke roles:**
```
1. DOM Manipulation    → Content dynamically change karo
2. Event Handling      → User actions pe react karo
3. API Calls           → Backend se data fetch karo
4. Form Validation     → Input verify karo before submit
5. State Management    → App ka current data track karo
6. Animations          → CSS ke saath ya directly
7. Local Storage       → Browser mein data store karo
```

---

## Accessibility (a11y)

```html
<!-- Alt text on all images -->
<img src="team.jpg" alt="Our 5-person engineering team at CodeBharat office">

<!-- Keyboard navigation — tabindex -->
<button tabindex="0">Clickable</button>
<div role="button" tabindex="0" onkeydown="handleKey(event)">Also clickable</div>

<!-- ARIA roles and labels -->
<nav aria-label="Main navigation">
<button aria-label="Close dialog" aria-expanded="false">✕</button>
<div role="alert" aria-live="polite">Form submitted!</div>
<input aria-describedby="email-help">
<span id="email-help">Enter your work email</span>

<!-- Skip navigation (screen readers) -->
<a href="#main-content" class="skip-link">Skip to main content</a>
```

---

## Browser Developer Tools

**Every frontend developer ka daily tool:**

```
F12 → Developer Tools

Tabs:
Elements  → HTML structure inspect karo, CSS live edit karo
Console   → JS errors, console.log output
Network   → HTTP requests dekho (status, headers, timing)
Sources   → JS files, breakpoints set karo
Application → Local storage, cookies, cache
Performance → Page load analyze karo
```

---

## Interview Questions — Step 02

**Q: `<div>` aur `<section>` mein kya fark hai?**
> `<div>` generic container hai — koi semantic meaning nahi. `<section>` thematically grouped content represent karta hai. Screen readers aur SEO tools `<section>` ko better samajhte hain.

**Q: CSS specificity kya hai?**
> Jab multiple CSS rules same element pe apply hoti hain, specificity determine karta hai kaun win karega. Inline > ID > Class > Element. `!important` sab override karta hai but avoid karna chahiye.

**Q: Flexbox aur Grid mein kab kya use karein?**
> Flexbox ek dimension ke liye — row ya column (navigation bar, card row). Grid do dimensions ke liye — row aur column dono (page layout, dashboard). Usually dono saath use hote hain.

**Q: `position: relative`, `absolute`, `fixed`, `sticky` mein kya fark hai?**
```
relative: Normal position se offset, space occupy karta hai
absolute: Nearest positioned ancestor ke relative, space nahi occupy karta
fixed:    Viewport ke relative, scroll ke saath nahi halta
sticky:   Scroll karte waqt ek position pe "stick" ho jaata hai
```

---

## Assignment — Step 02

1. Apni college ka ek page clone karo using **only HTML + CSS** — no JS
2. Navigation bar banao using Flexbox — logo left, links right, responsive
3. CSS Grid se 3-column card layout banao jo mobile pe 1 column ho jaaye
4. Dark mode toggle: CSS variables use karo colors ke liye, JS se class toggle karo
