# JavaScript Fundamentals (Must Be Crystal Clear)

## ✅ Execution Context

- Global Execution Context
- Function Execution Context
- Memory Creation Phase
- Call Stack behavior
- Execution Phase

👉 Common Question:

> What happens internally when JS runs a function?
> 

You must explain:

- Variable environment
- Lexical environment
- Scope chain

---

## ✅ Scope & Scope Chain

- Global scope
- Function scope
- Block scope
- Lexical scoping
- Shadowing

Edge case:

```jsx
leta=10;
{
leta=20;
}
```

---

## ✅ Hoisting

- var vs let vs const
- Temporal Dead Zone (TDZ)
- Function declaration vs function expression

Interview trap:

```jsx
console.log(a);
var a=10;
```

---

# 2️⃣ Closures (Very Important)

Definition:

> A function bundled with its lexical scope.
> 

Common Interview Areas:

- Data hiding
- Private variables
- Memoization
- setTimeout loop problem

Example trap:

```jsx
for(vari=0;i<3;i++){
setTimeout(()=>console.log(i),1000)
}
```

---

# 3️⃣ `this` Keyword (High Probability Question)

Understand in:

- Global scope
- Function
- Object method
- Arrow function
- Event handler
- call()
- apply()
- bind()

Difference:

```jsx
functionnormal() {}
constarrow= () => {}
```

---

# 4️⃣ Prototypes & Inheritance (Mid/Senior Level)

- Prototype chain
- `__proto__`
- `Object.create`
- Constructor functions
- ES6 classes
- Method overriding

Key concept:

> JS is prototype-based, not class-based.
> 

Explain:

```jsx
functionPerson(name) {
this.name=name;
}
Person.prototype.sayHi=function() {}
```

---

# 5️⃣ Event Loop (Very Very Important)

You must deeply understand:

- Call stack
- Web APIs
- Callback queue
- Microtask queue
- Macrotask queue

Difference:

- Promise → Microtask
- setTimeout → Macrotask

Common Interview Question:

```jsx
console.log("A");
setTimeout(()=>console.log("B"),0);
Promise.resolve().then(()=>console.log("C"));
console.log("D");
```

Expected output:

A

D

C

B

---

# 6️⃣ Asynchronous JavaScript

## Callbacks

- Callback hell problem

## Promises

- States (pending, fulfilled, rejected)
- Chaining
- Catch propagation

## async/await

- How it works internally (Promise-based)
- Error handling with try/catch

## Promise Methods

- Promise.all
- Promise.race
- Promise.allSettled
- Promise.any

Interview Question:

> Difference between Promise.all and Promise.allSettled?
> 

---

# 7️⃣ Deep vs Shallow Copy

Shallow:

```jsx
letobj2= {...obj1}
```

Deep:

```jsx
JSON.parse(JSON.stringify(obj))
```

Problems:

- Loses Date
- Loses functions
- Fails on circular references

Advanced:

- structuredClone()

---

# 8️⃣ ES6+ (Frequently Asked)

- let & const
- Destructuring
- Spread vs Rest
- Default parameters
- Template literals
- Optional chaining
- Nullish coalescing
- Modules (CommonJS vs ES Modules)

Important:

```jsx
importvsrequire
```

---

# 9️⃣ Functional Programming Concepts

- Pure functions
- Immutability
- Higher Order Functions
- map / filter / reduce
- Currying
- Composition

Example:

```jsx
constadd=a =>b =>a+b;
```

---

# 1️⃣0️⃣ Debouncing & Throttling (Frontend Must Know)

Debounce → Wait until user stops typing

Throttle → Limit execution per time interval

Common in:

- Search input
- Scroll events

---

# 1️⃣1️⃣ Memory & Garbage Collection

- Mark and Sweep algorithm
- Memory leaks
- Common causes:
    - Global variables
    - Unremoved event listeners
    - Closures holding references
    
    ---
    

# 1️⃣2️⃣ Error Handling

- try/catch
- throw custom errors
- Error object
- Async error handling
- Unhandled promise rejection

---

# 1️⃣3️⃣ Object & Array Advanced Methods

Must know deeply:

### Array

- map
- filter
- reduce
- some
- every
- find
- flat
- flatMap

### Object

- Object.keys
- Object.values
- Object.entries
- Object.assign
- Object.freeze
- Object.seal

---

# 1️⃣4️⃣ Data Structures in JavaScript

For interview coding rounds:

## Arrays

- Two pointer
- Sliding window
- Prefix sum
- Binary search

## Hashing

- Frequency counter
- Anagram problems

## Stack

- Valid parentheses
- Next greater element

## Queue

- BFS logic

## Linked List

- Reverse linked list
- Detect cycle

## Trees

- BFS
- DFS
- Height
- Traversals

---

# 1️⃣5️⃣ Time & Space Complexity

You must calculate:

- O(1)
- O(n)
- O(log n)
- O(n²)

Interviewers expect you to say:

> Current solution is O(n²), we can optimize to O(n) using hashmap.
> 

---

# 1️⃣6️⃣ Polyfills (Senior Level)

Implement manually:

- Array.map
- Array.reduce
- Promise
- call/apply/bind

Example:

```jsx
Array.prototype.myMap=function(cb) {
letresult= [];
for(leti=0;i<this.length;i++){
result.push(cb(this[i],i,this));
  }
returnresult;
}
```

---

# 1️⃣7️⃣ Browser vs Node Differences

- window vs global
- setImmediate
- process.nextTick
- Module system differences

---

# 1️⃣8️⃣ Tricky Interview Questions

- Why is JS single-threaded?
- How does concurrency work?
- Difference between == and ===
- typeof null?
- NaN comparison?
- Object comparison?
- Why [] == false is true?

---

## 🔹 Closures

- Function + its lexical scope bundled together
- Inner function can access outer function variables even after execution
- Used for **data privacy (encapsulation)**
- Helps create **function factories**
- Common in **React hooks, callbacks**

---

# Must Master

## 🔹 Event Loop

- Handles **async execution in JS (single-threaded)**
- Moves tasks from **Callback Queue → Call Stack**
- Executes when call stack is empty
- Works with **Web APIs (setTimeout, DOM, fetch)**
- Core for **non-blocking behavior**

---

## 🔹 Promises

- Represents **future value (pending → fulfilled/rejected)**
- Avoids **callback hell**
- Methods:
    - `.then()` → success
    - `.catch()` → error
    - `.finally()` → cleanup
- Used with `async/await`
- Helps manage **async flows cleanly**

---

## 🔹 Prototypes

- Every JS object has a hidden `[[Prototype]]`
- Enables **inheritance**
- Shared methods via `prototype` → memory efficient
- Used in **constructor functions & classes**
- Example: `Array.prototype.map`

---

## 🔹 this keyword

- Refers to **execution context**
- Value depends on **how function is called**
- Cases:
    - Global → `window`
    - Object method → object
    - Arrow function → inherits parent `this`
    - `call/apply/bind` → explicitly set
- Important in **React & event handlers**

---

## 🔹 Debounce

- Delays execution until **user stops triggering**
- Clears previous timer
- Used in:
    - Search input
    - API calls
- Prevents **unnecessary executions**

---

## 🔹 Throttle

- Executes function at **fixed intervals**
- Ignores extra calls within time window
- Used in:
    - Scroll events
    - Resize events
- Controls **rate of execution**

---

## 🔹 Currying

- Converts function with multiple args → **nested single-arg functions**
- Example: `f(a)(b)(c)`
- Enables **partial application**
- Improves **reusability**
- Used in functional programming

---

## 🔹 Memoization

- Caches function results
- Avoids **re-computation**
- Improves performance
- Common in:
    - Expensive calculations
    - React (`useMemo`)
- Uses **object/map for storage**

---

## 🔹 Event Delegation

- Attach event listener to **parent instead of children**
- Uses **event bubbling**
- Improves performance (less listeners)
- Useful for **dynamic elements**
- Example: handling list item clicks

---

## 🔹 Map / WeakMap

### Map

- Key-value pairs (any type as key)
- Maintains insertion order
- Iterable
- Has `.size`

### WeakMap

- Keys must be **objects only**
- Weak references → garbage collected
- Not iterable
- Used for **private data storage**

---

## 🔹 call / apply / bind

- Used to **control `this`**

### call

- Invokes immediately
- Args passed individually

### apply

- Invokes immediately
- Args passed as array

### bind

- Returns new function
- Does NOT execute immediately

---

## 🔹 Microtask vs Macrotask

### Microtask Queue

- Higher priority
- Executes **before macrotasks**
- Examples:
    - `Promise.then`
    - `queueMicrotask`

### Macrotask Queue

- Lower priority
- Runs after microtasks
- Examples:
    - `setTimeout`
    - `setInterval`
    - DOM events