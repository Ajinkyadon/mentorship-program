# 01 — JavaScript Foundations (Deep Concepts)

> **Yeh document tumhare liye hai agar tum already basic JS jaante ho**
> lekin closures, prototypes, `this` keyword sun ke darr jaate ho.
> Sab kuch simple language mein explain kiya hai — code ke saath.

---

## Variables — `var`, `let`, `const`

### Simple samajhte hain pehle:

```
var   → Purana tarika. Mat use karo. Bahut problems deta hai.
let   → Naya tarika. Use karo jab value change karni ho.
const → Use karo jab value KABHI change nahi karni.
```

### Code Example:

```javascript
// VAR ka problem — function scope hota hai, block scope nahi
function varExample() {
  if (true) {
    var name = "Rahul"; // var ko if block ke bahar bhi access kar sakte ho
  }
  console.log(name); // "Rahul" — yeh kaam karta hai, lekin yeh GALAT behavior hai
}

// LET ka sahi behavior — block scope
function letExample() {
  if (true) {
    let name = "Rahul"; // let sirf is { } block ke andar hai
  }
  console.log(name); // ERROR — ReferenceError: name is not defined
  // Yeh SAHI behavior hai — bahar nahi jaana chahiye
}

// CONST — value dobara assign nahi kar sakte
const PI = 3.14;
PI = 5; // ERROR — TypeError: Assignment to constant variable

// LEKIN — const object/array ko mutate kar sakte ho
const user = { name: "Rahul" };
user.name = "Priya"; // Yeh CHALTA hai — object ka reference same hai
user = {}; // ERROR — yeh nahi chalta, naya object assign nahi kar sakte
```

### Interview mein kya bolein:
> "`var` function-scoped hota hai aur hoist hota hai, isliye unexpected bugs aate hain.
> `let` aur `const` block-scoped hain. `const` ka matlab yeh nahi ki value immutable hai —
> sirf reassignment nahi hoti. Objects ke properties change ho sakti hain."

---

## Scope — Variable kahan se dikhta hai?

### Samajhne ka tarika:

```
Socho ghar jaisa:
- Global scope = colony (sabko dikhta hai)
- Function scope = ghar ke andar (sirf ghar walon ko dikhta hai)
- Block scope = ek kamra (sirf us kamre mein)
```

```javascript
// Global scope
const city = "Mumbai"; // Sabko dikhta hai

function showCity() {
  // Function scope
  const street = "MG Road"; // Sirf is function ke andar dikhta hai

  if (true) {
    // Block scope
    const building = "Tower A"; // Sirf is if block mein dikhta hai
    console.log(city);    // ✅ Mumbai — global dekh sakta hai
    console.log(street);  // ✅ MG Road — parent function dekh sakta hai
    console.log(building); // ✅ Tower A — same block mein hai
  }

  console.log(city);    // ✅ Mumbai
  console.log(street);  // ✅ MG Road
  console.log(building); // ❌ ERROR — block ke bahar nahi dikhta
}

console.log(city);   // ✅ Mumbai
console.log(street); // ❌ ERROR — function ke bahar nahi dikhta
```

---

## Hoisting — JavaScript ek baar pehle scan karta hai

### Concept:

```
JavaScript code run karne se pehle ek baar upar se neeche scan karta hai
aur saari variable/function declarations ko "upar le jaata hai" (hoist karta hai).

var declarations → hoist hoti hain (undefined value ke saath)
let/const       → hoist hoti hain lekin access nahi kar sakte (Temporal Dead Zone)
function declarations → poori function hoist hoti hai
```

```javascript
// Yeh kaam KARTA hai — function declaration hoist hoti hai
console.log(greet("Rahul")); // "Hello Rahul" — error nahi aayega

function greet(name) {
  return "Hello " + name;
}

// Yeh KAAM NAHI karta — function expression hoist nahi hoti
console.log(sayBye("Rahul")); // ERROR — sayBye is not a function

const sayBye = function(name) {
  return "Bye " + name;
};

// var hoisting — confusing behavior
console.log(age); // undefined — error nahi, lekin value bhi nahi
var age = 25;
console.log(age); // 25

// let hoisting — Temporal Dead Zone
console.log(salary); // ERROR — Cannot access before initialization
let salary = 50000;
```

---

## Arrow Functions vs Regular Functions

```javascript
// Regular function
function add(a, b) {
  return a + b;
}

// Arrow function — shorter syntax
const add = (a, b) => a + b; // Single line return mein curly braces aur return keyword nahi chahiye

// Single parameter — parentheses optional
const double = n => n * 2;

// No parameters
const sayHello = () => "Hello!";

// Multi-line arrow function
const calculateBonus = (salary, percentage) => {
  const bonus = (salary * percentage) / 100;
  return bonus;
};
```

### Sabse important difference — `this` keyword:

```javascript
// Regular function mein 'this' caller pe depend karta hai
const person = {
  name: "Rahul",
  greetRegular: function() {
    console.log("Hello, I am " + this.name); // ✅ "Hello, I am Rahul"
  },
  greetArrow: () => {
    console.log("Hello, I am " + this.name); // ❌ undefined
    // Arrow function apna 'this' nahi banata — parent scope ka 'this' leta hai
    // Yahan parent scope window/global hai, jahan 'name' nahi hai
  }
};

person.greetRegular(); // Hello, I am Rahul
person.greetArrow();   // Hello, I am undefined
```

---

## Closures — Sabse Important Concept

### Pehle analogy:

```
Socho ek dukaan ke andar ek tijori hai.
Dukaan band ho gayi (function execute ho gaya),
lekin tijori ki chabi abhi bhi ek vyakti ke paas hai (inner function).
Woh vyakti tijori access kar sakta hai — dukaan band hone ke baad bhi.

Yahi closure hai.
```

### Simple example:

```javascript
function outerFunction() {
  let count = 0; // Yeh variable outer function mein hai

  function innerFunction() {
    count++; // Inner function outer ka variable access kar sakta hai
    console.log(count);
  }

  return innerFunction; // Function return kar rahe hain, call nahi kar rahe
}

const counter = outerFunction(); // outerFunction execute hua, count = 0
// Ab outerFunction khatam hua — lekin count memory mein abhi bhi hai!

counter(); // 1
counter(); // 2
counter(); // 3
// Har baar count same variable hai — yahi closure hai
```

### Real-world use case — Private variables:

```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private — bahar se directly access nahi kar sakte

  return {
    deposit: function(amount) {
      balance += amount;
      console.log(`Deposited ${amount}. New balance: ${balance}`);
    },
    withdraw: function(amount) {
      if (amount > balance) {
        console.log("Insufficient funds!");
        return;
      }
      balance -= amount;
      console.log(`Withdrawn ${amount}. New balance: ${balance}`);
    },
    getBalance: function() {
      return balance;
    }
  };
}

const myAccount = createBankAccount(1000);
myAccount.deposit(500);   // Deposited 500. New balance: 1500
myAccount.withdraw(200);  // Withdrawn 200. New balance: 1300
console.log(myAccount.balance); // undefined — directly access nahi ho sakta!
console.log(myAccount.getBalance()); // 1300 — sirf getter se
```

### Interview mein yeh bolein:
> "Closure tab banta hai jab ek inner function apne outer function ke variables ko
> remember karta hai — even after the outer function has finished executing.
> Yeh useful hai data privacy ke liye, factory functions mein, aur memoization mein."

---

## `this` Keyword — 4 Rules

### Yeh sabse confusing concept hai. 4 rules yaad karo:

```
Rule 1: Default Binding   → this = global object (window browser mein, global Node mein)
Rule 2: Implicit Binding  → this = object jisne function call kiya
Rule 3: Explicit Binding  → this = jo tum call/apply/bind mein dete ho
Rule 4: new Binding       → this = naya object jo bana
```

```javascript
// Rule 1: Default Binding
function showThis() {
  console.log(this); // window (browser mein) ya global (Node mein)
}
showThis();

// Rule 2: Implicit Binding — object ke through call
const student = {
  name: "Priya",
  introduce: function() {
    console.log("My name is " + this.name); // this = student object
  }
};
student.introduce(); // "My name is Priya"

// Gotcha — function ko variable mein store karoge toh this kho jaata hai
const introFn = student.introduce;
introFn(); // "My name is undefined" — this ab window hai, student nahi!

// Rule 3: Explicit Binding — call, apply, bind
function greet(city, country) {
  console.log(`${this.name} from ${city}, ${country}`);
}

const person = { name: "Amit" };

greet.call(person, "Mumbai", "India");    // Amit from Mumbai, India
greet.apply(person, ["Mumbai", "India"]); // Same result — array mein arguments
const boundGreet = greet.bind(person);    // Naya function banata hai permanently bound
boundGreet("Delhi", "India");             // Amit from Delhi, India

// Rule 4: new Binding
function Person(name) {
  this.name = name; // this = naya object jo ban raha hai
  this.sayHi = function() {
    console.log("Hi, I am " + this.name);
  };
}

const rahul = new Person("Rahul");
rahul.sayHi(); // "Hi, I am Rahul"
```

---

## Prototype Chain

### Analogy:

```
Socho ek family tree:
- Bachcha (Child Object) ko pehle khud mein property dhundha jaata hai
- Nahi mila toh Papa (Prototype) mein dhundha jaata hai
- Papa mein bhi nahi toh Dada (Prototype ka Prototype) mein
- Dada mein bhi nahi toh null — "property nahi mili"

Yahi prototype chain hai.
```

```javascript
// Har object ka ek hidden __proto__ hota hai
const animal = {
  breathes: true,
  eat: function() {
    console.log(this.name + " is eating");
  }
};

const dog = {
  name: "Bruno",
  bark: function() {
    console.log("Woof!");
  }
};

// dog ko animal ka prototype banao
Object.setPrototypeOf(dog, animal);

dog.bark();           // "Woof!" — dog mein hai
dog.eat();            // "Bruno is eating" — animal mein hai, par this.name = dog.name
console.log(dog.breathes); // true — animal se inherit kiya

// Modern way: class syntax (same kaam, cleaner syntax)
class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {
    console.log(this.name + " is eating");
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Animal ka constructor call karo
    this.breed = breed;
  }
  bark() {
    console.log(this.name + " says: Woof!");
  }
}

const myDog = new Dog("Bruno", "Labrador");
myDog.bark(); // "Bruno says: Woof!"
myDog.eat();  // "Bruno is eating" — Animal se inherit kiya
```

---

## Higher-Order Functions — map, filter, reduce

### Yeh teen functions tumhari zindagi badal denge:

```javascript
const students = [
  { name: "Rahul", marks: 85 },
  { name: "Priya", marks: 92 },
  { name: "Amit", marks: 67 },
  { name: "Sneha", marks: 78 },
];

// MAP — har element ko transform karo, naya array banao
// "Har student ka naam chahiye"
const names = students.map(student => student.name);
console.log(names); // ["Rahul", "Priya", "Amit", "Sneha"]

// "Har student ko grade do"
const withGrades = students.map(student => ({
  ...student,
  grade: student.marks >= 90 ? "A" : student.marks >= 75 ? "B" : "C"
}));
console.log(withGrades);
// [{ name: "Rahul", marks: 85, grade: "B" }, ...]

// FILTER — condition ke basis pe elements nikalo
// "Sirf passing students (marks >= 75)"
const passing = students.filter(student => student.marks >= 75);
console.log(passing); // Rahul, Priya, Sneha

// REDUCE — array ko ek single value mein reduce karo
// "Saare students ke marks ka total"
const totalMarks = students.reduce((acc, student) => acc + student.marks, 0);
console.log(totalMarks); // 322

// "Average marks"
const average = totalMarks / students.length;
console.log(average); // 80.5

// CHAINING — combine karo
// "Passing students ke sirf names chahiye, sorted"
const passingNames = students
  .filter(s => s.marks >= 75)
  .map(s => s.name)
  .sort();
console.log(passingNames); // ["Priya", "Rahul", "Sneha"]
```

---

## Destructuring & Spread/Rest

```javascript
// OBJECT DESTRUCTURING — property nikaalna easy tarike se
const user = {
  name: "Rahul",
  age: 28,
  city: "Mumbai",
  job: "Developer"
};

// Purana tarika
const name = user.name;
const age = user.age;

// Naya tarika — destructuring
const { name, age } = user;
console.log(name, age); // "Rahul" 28

// Rename karo nikalte waqt
const { name: userName, city: userCity } = user;
console.log(userName, userCity); // "Rahul" "Mumbai"

// Default value
const { salary = 50000 } = user; // user mein salary nahi hai
console.log(salary); // 50000

// ARRAY DESTRUCTURING
const colors = ["red", "green", "blue"];
const [first, second, third] = colors;
console.log(first); // "red"

// Skip elements
const [, , last] = colors;
console.log(last); // "blue"

// SPREAD OPERATOR — array/object ko spread karo
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Object spread — merge karo
const defaults = { theme: "light", lang: "en", notifications: true };
const userPrefs = { theme: "dark", fontSize: 14 };
const finalSettings = { ...defaults, ...userPrefs };
// { theme: "dark", lang: "en", notifications: true, fontSize: 14 }
// userPrefs ki values ne defaults ko override kiya

// REST OPERATOR — bache hue elements pakdo
function sum(...numbers) { // ...numbers = array of all arguments
  return numbers.reduce((acc, n) => acc + n, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15

const { name: n, ...rest } = user;
console.log(n);    // "Rahul"
console.log(rest); // { age: 28, city: "Mumbai", job: "Developer" }
```

---

## Error Handling

```javascript
// TRY/CATCH — errors ko handle karo, program crash mat hone do
function divideNumbers(a, b) {
  try {
    if (b === 0) {
      throw new Error("Zero se divide nahi kar sakte!"); // Error throw karo
    }
    const result = a / b;
    return result;
  } catch (error) {
    console.log("Error aaya:", error.message);
    return null;
  } finally {
    console.log("Division attempt complete"); // Hamesha run hota hai
  }
}

console.log(divideNumbers(10, 2));  // 5
console.log(divideNumbers(10, 0));  // Error aaya: Zero se divide nahi kar sakte!
                                    // Division attempt complete
                                    // null

// CUSTOM ERROR CLASSES — specific errors banao
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = "DatabaseError";
  }
}

function validateAge(age) {
  if (typeof age !== "number") {
    throw new ValidationError("Age must be a number", "age");
  }
  if (age < 0 || age > 120) {
    throw new ValidationError("Age must be between 0 and 120", "age");
  }
  return true;
}

try {
  validateAge("twenty"); // string diya
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Validation failed on field '${error.field}': ${error.message}`);
  } else {
    console.log("Unknown error:", error.message);
  }
}
// Output: Validation failed on field 'age': Age must be a number
```

---

## Modules — Code ko organize karo

```javascript
// math.js — yahan functions define karo
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export const PI = 3.14159;

// Default export — ek file mein sirf ek default export hoti hai
export default function multiply(a, b) {
  return a * b;
}

// ─────────────────────────────────────────

// main.js — yahan use karo
import multiply, { add, subtract, PI } from './math.js';
// multiply = default import (naam kuch bhi rakh sakte ho)
// { add, subtract, PI } = named imports (exact naam chahiye)

console.log(add(5, 3));       // 8
console.log(subtract(10, 4)); // 6
console.log(PI);              // 3.14159
console.log(multiply(3, 4));  // 12

// Node.js (CommonJS) — purana tarika
// math.js
module.exports = { add, subtract };

// main.js
const { add, subtract } = require('./math');
```

---

## Assignment — Practice Karo

```
1. Ek createCounter() function banao jo closure use kare:
   - increment() — count badhao
   - decrement() — count ghataao
   - reset() — count 0 kar do
   - getCount() — current count return karo

2. Ek Student array banao (name, marks, subject ke saath),
   phir map/filter/reduce use karke:
   - Sirf pass students nikalo (marks >= 35)
   - Saare students ka average marks nikalo
   - Top scorer kaun hai?

3. Ek simple banking system banao closures se:
   - deposit(amount)
   - withdraw(amount) — balance check karo
   - getStatement() — transactions ki list

Saara code GitHub pe push karo with meaningful commit messages.
```

---

> *Next: Asynchronous JavaScript → [02-javascript-async.md](./02-javascript-async.md)*
