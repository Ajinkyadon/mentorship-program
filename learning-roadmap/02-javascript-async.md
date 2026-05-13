# 02 — Asynchronous JavaScript

> **Yeh document sabse important hai.** Async JavaScript ko samjhe bina
> Node.js, React, ya koi bhi real app banana impossible hai.
> Slowly padho. Code type karo. Samjho.

---

## Pehle Samjho — Synchronous vs Asynchronous

### Real life analogy:

```
SYNCHRONOUS (ek kaam ek baar mein):
  Tum ek chai ki dukaan pe gaye.
  Order diya → waiter ne chai banaayi → tumhe di → phir agle customer ka order liya.
  Ek kaam khatam, phir doosra. Sab wait karte hain.

ASYNCHRONOUS (kaam chal raha hai, tum wait nahi kar rahe):
  Tum restaurant gaye.
  Order diya → waiter ne kitchen ko bola → tum baithke baat karne lage →
  kitchen ne khana banaya → waiter ne aaya aur dish di.
  Tum wait nahi kar rahe the kitchen ke liye — kaam chal raha tha background mein.
```

```javascript
// SYNCHRONOUS — ek ke baad ek
console.log("1. Chai order diya");
console.log("2. Chai ban rahi hai..."); // yeh tab tak nahi chalega jab tak upar wala nahi chala
console.log("3. Chai mili!");
// Output: 1 → 2 → 3 (sequence mein)

// ASYNCHRONOUS — kaam background mein hota hai
console.log("1. Pizza order diya");

setTimeout(() => {
  console.log("3. Pizza aa gaya!"); // 2 seconds baad chalega
}, 2000);

console.log("2. Kuch aur kaam karte hain..."); // Yeh pehle chalega!
// Output: 1 → 2 → 3 (2 seconds baad)
// Notice: "2. Kuch aur kaam" pehle print hua, pizza baad mein aaya
```

---

## JavaScript Ek Thread Mein Kaam Karta Hai

### Yeh bahut important concept hai:

```
JavaScript SINGLE-THREADED hai — matlab ek waqt mein sirf ek kaam kar sakta hai.
Toh phir async kaise kaam karta hai?

Answer: Event Loop
```

### Event Loop — Picture mein samjho:

```
┌─────────────────────────────────────────────────┐
│                  JavaScript Engine               │
│                                                  │
│   ┌──────────────┐        ┌──────────────────┐  │
│   │  CALL STACK  │        │   WEB APIs /     │  │
│   │              │        │   NODE APIs      │  │
│   │  console.log │ ──────►│                  │  │
│   │  setTimeout  │        │  setTimeout      │  │
│   │  fetch()     │        │  fetch           │  │
│   │              │        │  fs.readFile     │  │
│   └──────────────┘        └────────┬─────────┘  │
│          ▲                         │             │
│          │                         ▼             │
│   ┌──────┴──────────────────────────────────┐   │
│   │              EVENT LOOP                  │   │
│   │   "Call Stack khali hai? Task Queue mein │   │
│   │    kuch hai? Toh woh call stack mein     │   │
│   │    daalo."                               │   │
│   └──────────────────┬───────────────────────┘   │
│                      │                            │
│   ┌──────────────────▼───────────────────────┐   │
│   │  MICROTASK QUEUE  │  TASK (MACRO) QUEUE  │   │
│   │  (Promises)       │  (setTimeout, etc)   │   │
│   │  HIGH PRIORITY    │  LOW PRIORITY        │   │
│   └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

```javascript
// Yeh code dekho aur predict karo output kya hoga:
console.log("1");

setTimeout(() => {
  console.log("2"); // Task Queue (setTimeout = 0ms bhi)
}, 0);

Promise.resolve().then(() => {
  console.log("3"); // Microtask Queue (Promise)
});

console.log("4");

// OUTPUT: 1, 4, 3, 2
// Kyun?
// 1 → Call stack mein, turant chalega
// 4 → Call stack mein, turant chalega
// 3 → Microtask queue (Promise) → call stack khali hone pe pehle chalta hai
// 2 → Task queue (setTimeout) → microtask ke baad chalta hai
```

---

## Callbacks

### Kya hota hai callback?

```
Callback = ek function jo tum kisi doosre function ko dete ho,
taaki woh function use "baad mein" call kare.

Jaise: Pizza order karte waqt phone number do.
       Pizza ready hone pe woh tumhe call karenge.
       Woh phone number = callback.
```

```javascript
// Simple callback example
function fetchUserData(userId, callback) {
  // Simulate database call (1 second ka wait)
  setTimeout(() => {
    const user = { id: userId, name: "Rahul", email: "rahul@example.com" };
    callback(null, user); // pehla argument = error, doosra = data
  }, 1000);
}

// Use karo
fetchUserData(1, function(error, user) {
  if (error) {
    console.log("Error:", error);
    return;
  }
  console.log("User mila:", user.name); // "User mila: Rahul"
});

console.log("Yeh pehle print hoga"); // Callbacks ke pehle
```

### Callback Hell — Problem:

```javascript
// Real problem — nested callbacks (pyramid of doom)
// "User fetch karo → uski orders fetch karo → har order ki details fetch karo"

fetchUser(userId, function(err, user) {
  if (err) { handleError(err); return; }

  fetchOrders(user.id, function(err, orders) {
    if (err) { handleError(err); return; }

    fetchOrderDetails(orders[0].id, function(err, details) {
      if (err) { handleError(err); return; }

      fetchProductInfo(details.productId, function(err, product) {
        if (err) { handleError(err); return; }

        // Ab kuch karo product ke saath
        console.log(product); // 4 levels andar hain!
        // Yahi Callback Hell hai — padhna mushkil, debug karna aur mushkil
      });
    });
  });
});
```

> **Yahi problem solve karne ke liye Promises aaye.**

---

## Promises

### Analogy:

```
Promise = Ek receipt jo tumhe milti hai order dene ke baad.

Teri chai ka order le liya — yeh PENDING hai.
Chai ban gayi — yeh FULFILLED hai. (callback → .then())
Chai nahi ban saki (gas khatam) — yeh REJECTED hai. (callback → .catch())
```

```javascript
// Promise banana
const myPromise = new Promise((resolve, reject) => {
  // Yahan async kaam karo
  const success = true; // simulate karo

  if (success) {
    resolve("Kaam ho gaya!"); // .then() mein jaayega
  } else {
    reject("Kuch gadbad ho gayi"); // .catch() mein jaayega
  }
});

// Promise use karo
myPromise
  .then(result => {
    console.log("Success:", result); // "Success: Kaam ho gaya!"
  })
  .catch(error => {
    console.log("Error:", error);
  })
  .finally(() => {
    console.log("Ye hamesha chalega — success ya failure dono mein");
  });
```

### Real example — Callback Hell ko Promise se theek karo:

```javascript
// Pehle functions ko Promise return karne wale banao
function fetchUser(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = { id: userId, name: "Rahul" };
      resolve(user);
    }, 500);
  });
}

function fetchOrders(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const orders = [{ id: 101, userId, product: "Laptop" }];
      resolve(orders);
    }, 500);
  });
}

// Ab Promise chaining use karo — callback hell khatam!
fetchUser(1)
  .then(user => {
    console.log("User:", user.name);
    return fetchOrders(user.id); // Next promise return karo
  })
  .then(orders => {
    console.log("Orders:", orders);
    // Aur chain badha sakte ho...
  })
  .catch(error => {
    // Koi bhi error yahin pakda jaayega
    console.log("Kuch gadbad:", error);
  });
```

### Promise.all — Saath mein multiple promises chalao:

```javascript
// Ek saath multiple API calls
const p1 = fetchUser(1);
const p2 = fetchOrders(1);
const p3 = fetchProductList();

// SAATH mein chalao — ek ke baad ek nahi
Promise.all([p1, p2, p3])
  .then(([user, orders, products]) => {
    // Teeno complete hone ke baad yahan pahunchenge
    console.log(user, orders, products);
  })
  .catch(error => {
    // Koi bhi ek fail ho toh yahan aayega
    console.log("Kuch fail hua:", error);
  });

// Promise.allSettled — sabka result chahiye, fail hone pe bhi
Promise.allSettled([p1, p2, p3])
  .then(results => {
    results.forEach(result => {
      if (result.status === "fulfilled") {
        console.log("Success:", result.value);
      } else {
        console.log("Failed:", result.reason);
      }
    });
  });
```

---

## Async/Await — Promises ka Sundar Roop

### Yeh kya hai?

```
Async/Await = Promises ka hi kaam hai, lekin code aise likhte hain
jaise synchronous ho — padhna bahut aasaan hai.

async keyword → "Yeh function Promise return karega"
await keyword → "Ruko yahan tak jab tak Promise resolve na ho"
```

```javascript
// Promise version (theek hai lekin thoda complex)
function getUserInfo(userId) {
  return fetchUser(userId)
    .then(user => fetchOrders(user.id))
    .then(orders => orders[0])
    .catch(err => console.log(err));
}

// Async/Await version (bahut clean!)
async function getUserInfo(userId) {
  try {
    const user = await fetchUser(userId);     // Wait karo user ke liye
    const orders = await fetchOrders(user.id); // Wait karo orders ke liye
    return orders[0];
  } catch (error) {
    console.log("Error:", error.message);
  }
}

// Use karo
getUserInfo(1).then(order => console.log(order));
// Ya aur async function mein:
async function main() {
  const order = await getUserInfo(1);
  console.log(order);
}
main();
```

### Common Mistake — Sequential vs Parallel:

```javascript
// ❌ GALAT — yeh SEQUENTIAL hai (slow)
// Pehle user fetch hoga, phir orders, phir products — ek ke baad ek
async function slowVersion() {
  const user = await fetchUser(1);       // 500ms wait
  const orders = await fetchOrders(1);   // 500ms wait (user ke baad)
  const products = await fetchProducts(); // 500ms wait (orders ke baad)
  // Total: ~1500ms
}

// ✅ SAHI — yeh PARALLEL hai (fast)
// Teeno ek saath shuru hote hain
async function fastVersion() {
  const [user, orders, products] = await Promise.all([
    fetchUser(1),
    fetchOrders(1),
    fetchProducts()
  ]);
  // Total: ~500ms (longest one ke barabar)
}
```

### Real-world example — API call with async/await:

```javascript
// Browser mein fetch API use karna
async function getWeather(city) {
  try {
    // API call karo
    const response = await fetch(`https://api.weather.com/v1/${city}`);

    // Response successful hai?
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // JSON parse karo
    const data = await response.json();

    return data;
  } catch (error) {
    if (error.name === "TypeError") {
      console.log("Network error — internet connected hai?");
    } else {
      console.log("Error:", error.message);
    }
    return null;
  }
}

// Use karo
async function displayWeather() {
  console.log("Weather fetch kar rahe hain...");
  const weather = await getWeather("Mumbai");

  if (weather) {
    console.log(`Mumbai mein aaj ${weather.temperature}°C hai`);
  }
}

displayWeather();
```

---

## Practical Example — Sab kuch combine karke

```javascript
// Ek complete example jo tumhare interview mein kaam aayega

class UserService {
  // Simulate database delay
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get user by ID
  static async getUser(id) {
    await this.delay(300); // Simulate DB query

    const users = {
      1: { id: 1, name: "Rahul Sharma", email: "rahul@example.com" },
      2: { id: 2, name: "Priya Patel", email: "priya@example.com" },
    };

    const user = users[id];
    if (!user) throw new Error(`User ${id} nahi mila`);
    return user;
  }

  // Get user's posts
  static async getUserPosts(userId) {
    await this.delay(200);
    return [
      { id: 1, title: "Meri pehli post", userId },
      { id: 2, title: "JavaScript seekhna", userId },
    ];
  }

  // Get complete profile (user + posts ek saath)
  static async getFullProfile(userId) {
    try {
      // Dono parallel mein fetch karo
      const [user, posts] = await Promise.all([
        this.getUser(userId),
        this.getUserPosts(userId)
      ]);

      return { ...user, posts, postCount: posts.length };
    } catch (error) {
      throw new Error(`Profile load nahi ho saka: ${error.message}`);
    }
  }
}

// Main function
async function main() {
  console.log("Profile load ho raha hai...");

  try {
    const profile = await UserService.getFullProfile(1);
    console.log(`\nName: ${profile.name}`);
    console.log(`Email: ${profile.email}`);
    console.log(`Posts: ${profile.postCount}`);
    profile.posts.forEach(post => {
      console.log(` - ${post.title}`);
    });
  } catch (error) {
    console.error("Kuch gadbad:", error.message);
  }
}

main();
```

---

## Assignment

```
1. Ek fetchWithRetry(url, maxRetries) function banao jo:
   - URL se data fetch kare
   - Fail hone pe automatically retry kare (max 3 baar)
   - Har retry ke beech 1 second wait kare
   - Saari retries fail ho jaayein toh error throw kare

2. Ek task queue banao jo:
   - Tasks add kar sake (async functions)
   - Ek saath maximum 2 tasks run kare (parallel limit)
   - Remaining tasks wait karein

3. Event loop ke sequence ko predict karo — 5 examples likho
   (setTimeout, Promise, console.log mix karke) aur fir code run
   karke verify karo.
```

---

> *Next: React.js Fundamentals → [03-react-fundamentals.md](./03-react-fundamentals.md)*
