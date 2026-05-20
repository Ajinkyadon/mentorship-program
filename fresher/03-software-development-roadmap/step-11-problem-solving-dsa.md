# Step 11: Problem Solving & DSA
### "Interview crack karna hai? Ye without nahi hoga"

---

## Why DSA?

```
Without DSA:
Code likhna aata hai → But "Reverse a linked list" → Blank 😶

With DSA:
Patterns recognize karna aata hai →
Problems systematically solve karna aata hai →
Interviews confidently dena aata hai
```

**DSA = Foundation of problem solving.** Language change hoti hai, DSA nahi.

---

## Problem Solving Framework

```
Step 1: UNDERSTAND (2-3 min)
  → Problem clearly padhо — twice
  → Input/Output examples clearly samajhо
  → Edge cases identify karo:
    - Empty input?
    - Single element?
    - Negative numbers?
    - Very large input?
    - Duplicates?

Step 2: THINK (3-5 min)
  → Brute force approach socho pehle
  → Example manually solve karo (paper pe)
  → Pattern recognize karo

Step 3: CODE (15-20 min)
  → Pseudo-code pehle
  → Clean implementation
  → Think while coding — say it aloud

Step 4: TEST (5 min)
  → Given examples verify karo
  → Edge cases verify karo
  → Dry run karo mentally

Step 5: OPTIMIZE (if time)
  → Time complexity improve kar sakte ho?
  → Space complexity?
```

---

## Big O Notation — Complexity Analysis

**"Jaise input badhta hai, code kitna slow hota hai?"**

```
O(1)       → Constant — Always same time (array index access)
O(log n)   → Logarithmic — Binary search (halve each time)
O(n)       → Linear — Loop through array once
O(n log n) → Merge sort, efficient sorts
O(n²)      → Nested loops — Bubble sort
O(2ⁿ)      → Exponential — Recursive Fibonacci (naive)
O(n!)      → Factorial — Travelling salesman brute force

Performance: O(1) > O(log n) > O(n) > O(n log n) > O(n²) > O(2ⁿ)
```

```js
// O(1) — constant
function getFirst(arr) { return arr[0]; }

// O(n) — linear
function findMax(arr) {
  let max = arr[0];
  for (const n of arr) { if (n > max) max = n; }  // n iterations
  return max;
}

// O(n²) — quadratic
function hasDuplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {  // nested loop
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// O(n) — optimized with HashMap
function hasDuplicateFast(arr) {
  const seen = new Set();
  for (const n of arr) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}
```

---

## Data Structures

### 1. Array

```js
// JavaScript arrays = dynamic arrays

const arr = [1, 2, 3, 4, 5];

// Access: O(1)
arr[2]          // 3

// Search: O(n)
arr.indexOf(3)  // 2

// Insert end: O(1)
arr.push(6)

// Insert beginning: O(n) — shifts everything
arr.unshift(0)

// Delete end: O(1)
arr.pop()

// Delete beginning: O(n) — shifts everything
arr.shift()

// Slice: O(k)
arr.slice(1, 3)  // [2, 3]

// Most common operations: map, filter, reduce → O(n)
```

**When to use:** Ordered data, index-based access, most general purpose.

### 2. HashMap / Object

```js
// O(1) average for all operations

const map = new Map();
map.set('key', 'value');
map.get('key');        // 'value'
map.has('key');        // true
map.delete('key');
map.size;              // 0

// Object as HashMap
const obj = {};
obj['email'] = 'rahul@x.com';
'email' in obj;        // true
delete obj['email'];

// Use cases:
// - Fast lookup by key
// - Frequency counting
// - Caching / memoization
// - Two sum problem
```

**When to use:** Fast lookup, frequency counting, grouping, caching.

### 3. Set

```js
const set = new Set([1, 2, 3, 3, 2]);  // {1, 2, 3} — duplicates removed

set.has(2);     // true — O(1)
set.add(4);
set.delete(1);
set.size;       // 3

// Remove duplicates from array
const unique = [...new Set([1, 2, 2, 3, 3, 3])];  // [1, 2, 3]

// Fast lookup
const allowed = new Set(['admin', 'moderator']);
allowed.has(userRole);  // O(1) vs array O(n)
```

### 4. Stack

```js
// Last In, First Out (LIFO)
// Array as stack

const stack = [];
stack.push(1);     // [1]
stack.push(2);     // [1, 2]
stack.push(3);     // [1, 2, 3]
stack.pop();       // Returns 3, stack = [1, 2]
stack[stack.length - 1]; // Peek: 2

// Use cases:
// - Undo/redo functionality
// - Valid parentheses
// - Function call stack
// - DFS traversal (iterative)
// - Expression evaluation
```

### 5. Queue

```js
// First In, First Out (FIFO)

const queue = [];
queue.push(1);     // Enqueue: [1]
queue.push(2);     // [1, 2]
queue.push(3);     // [1, 2, 3]
queue.shift();     // Dequeue: Returns 1, queue = [2, 3]

// Better: Use proper queue for performance
class Queue {
  constructor() { this.items = {}; this.front = 0; this.rear = 0; }
  enqueue(item) { this.items[this.rear++] = item; }
  dequeue() {
    if (this.isEmpty()) return null;
    const item = this.items[this.front];
    delete this.items[this.front++];
    return item;
  }
  isEmpty() { return this.front === this.rear; }
}

// Use cases:
// - BFS traversal
// - Task scheduling
// - Print queue simulation
// - Level-order tree traversal
```

### 6. Linked List

```js
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

// Build: 1 → 2 → 3 → null
const head = new ListNode(1, new ListNode(2, new ListNode(3)));

// Traverse: O(n)
let curr = head;
while (curr) {
  console.log(curr.val);
  curr = curr.next;
}

// Use cases:
// - Dynamic size insertion/deletion
// - LRU Cache
// - Undo history
// - Implementing queue/stack
```

**Common Linked List Problems:**
```js
// Reverse Linked List
function reverse(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;  // New head
}

// Detect Cycle (Floyd's algorithm)
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// Middle of Linked List
function findMiddle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;  // Slow is at middle
}
```

### 7. Binary Tree

```js
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

//        1
//       / \
//      2   3
//     / \   \
//    4   5   6

// DFS Traversals
function inOrder(root) {   // Left → Root → Right (sorted for BST)
  if (!root) return [];
  return [...inOrder(root.left), root.val, ...inOrder(root.right)];
}

function preOrder(root) {  // Root → Left → Right
  if (!root) return [];
  return [root.val, ...preOrder(root.left), ...preOrder(root.right)];
}

function postOrder(root) { // Left → Right → Root
  if (!root) return [];
  return [...postOrder(root.left), ...postOrder(root.right), root.val];
}

// BFS — Level Order
function levelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const level = [];
    const len = queue.length;
    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left)  queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}

// Max Depth
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

---

## Algorithms

### Binary Search

```js
// O(log n) — sorted array mein search

function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

// Find first occurrence
function firstOccurrence(arr, target) {
  let left = 0, right = arr.length - 1, result = -1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      result = mid;
      right = mid - 1;  // Left side mein aur dhundho
    } else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return result;
}
```

### Two Pointers

```js
// Sorted array mein pair dhundho jinka sum = target
function twoSum(arr, target) {
  let left = 0, right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}

// Valid palindrome
function isPalindrome(s) {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++; r--;
  }
  return true;
}
```

### Sliding Window

```js
// Maximum sum subarray of size k — O(n)
function maxSumSubarray(arr, k) {
  let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;

  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];  // Add new, remove old
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}

// Longest substring without repeating characters
function lengthOfLongestSubstring(s) {
  const map = new Map();
  let maxLen = 0, left = 0;

  for (let right = 0; right < s.length; right++) {
    if (map.has(s[right])) {
      left = Math.max(left, map.get(s[right]) + 1);
    }
    map.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

### Recursion

```js
// Fibonacci
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);  // O(2^n) — slow!
}

// Memoized Fibonacci — O(n)
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

// Factorial
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Power
function power(base, exp) {
  if (exp === 0) return 1;
  if (exp % 2 === 0) {
    const half = power(base, exp / 2);
    return half * half;  // O(log n)
  }
  return base * power(base, exp - 1);
}
```

### Sorting

```js
// Merge Sort — O(n log n), stable
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}

// Quick Sort — O(n log n) avg, O(n²) worst
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) [arr[++i], arr[j]] = [arr[j], arr[i]];
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
```

---

## Dynamic Programming (DP)

**DP = Recursion + Memoization (or Bottom-up tabulation)**

**When to use:** Overlapping subproblems, optimal substructure.

```js
// Climbing Stairs (#70 LeetCode)
// n stairs, 1 or 2 steps at a time — how many ways?
function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1, prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}

// Coin Change (#322 LeetCode)
// Minimum coins to make amount
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// 0/1 Knapsack
function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i-1] <= w) {
        dp[i][w] = Math.max(
          dp[i-1][w],
          dp[i-1][w - weights[i-1]] + values[i-1]
        );
      } else {
        dp[i][w] = dp[i-1][w];
      }
    }
  }
  return dp[n][capacity];
}
```

---

## Graph Algorithms

```js
// BFS — Shortest path (unweighted), level-order
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const result = [];

  while (queue.length) {
    const node = queue.shift();
    result.push(node);

    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}

// DFS — Paths, cycles, components
function dfs(graph, node, visited = new Set()) {
  visited.add(node);
  const result = [node];

  for (const neighbor of graph[node] || []) {
    if (!visited.has(neighbor)) {
      result.push(...dfs(graph, neighbor, visited));
    }
  }
  return result;
}

// Has Path
function hasPath(graph, src, dst, visited = new Set()) {
  if (src === dst) return true;
  visited.add(src);

  for (const neighbor of graph[src] || []) {
    if (!visited.has(neighbor) && hasPath(graph, neighbor, dst, visited)) {
      return true;
    }
  }
  return false;
}
```

---

## Placement-Level Problem Set

### Must Solve (Easy)
```
Arrays: Two Sum, Best Time to Buy Stock, Maximum Subarray
Strings: Valid Palindrome, Reverse String, Valid Anagram
Hashing: Contains Duplicate, Two Sum (HashMap version)
Math: FizzBuzz, Palindrome Number, Reverse Integer
```

### Should Solve (Medium — Product Companies)
```
Arrays: 3Sum, Container With Most Water, Product Except Self
Strings: Longest Substring Without Repeating, Longest Palindromic Substring
DP: Climbing Stairs, Coin Change, House Robber
Trees: Binary Tree Level Order, Validate BST, Lowest Common Ancestor
Linked List: Reverse Linked List, Merge Sorted Lists, LRU Cache
```

---

## Interview Questions — Step 11

**Q: Array aur Linked List mein kya fark hai?**
> Array: Contiguous memory, O(1) index access, O(n) insertion/deletion (middle). Linked List: Non-contiguous, O(n) access, O(1) insertion/deletion at known node. Array fast access ke liye, Linked List frequent insertion/deletion ke liye.

**Q: Stack aur Queue mein kya fark hai?**
> Stack: LIFO (Last In First Out) — push/pop same end se. Queue: FIFO (First In First Out) — enqueue back, dequeue front. Stack: undo, function calls, DFS. Queue: BFS, task scheduling, print queue.

**Q: HashMap ka time complexity kya hai?**
> Average O(1) for get, put, delete. Worst case O(n) — hash collisions pe. Good hash function collisions minimize karta hai.

---

## Assignment — Step 11

1. In 1 week solve 20 LeetCode problems:
   - Days 1-3: Array problems (Two Sum, Best Time to Buy Stock, Maximum Subarray, Contains Duplicate, Move Zeroes)
   - Days 4-5: String problems (Valid Palindrome, Reverse String, Valid Anagram)
   - Days 6-7: HashMap problems (First Unique Character, Group Anagrams)

2. Implement from scratch (no cheating):
   - Stack class with push/pop/peek/isEmpty
   - Queue class with enqueue/dequeue/isEmpty
   - Binary search function

3. Linked list: Reverse + Detect cycle + Find middle implement karo
