// 🔄 How React Uses Virtual DOM - The Process:
// Step 1: Initial Render ------------------
function App() {
  return <h1>Hello React!</h1>;
}

// React creates Virtual DOM representation:
const vdom = {
  type: 'h1',
  props: {},
  children: 'Hello React!'
};

// Step 2: State Changes ------------------
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

// Click → State update → New Virtual DOM created

// Step 3: The Magic - Diffing & Reconciliation ------------------

// OLD Virtual DOM (before click)
// {
//   type: 'p',
//   props: {},
//   children: 'Count: 0'
// }

// // NEW Virtual DOM (after click)
// {
//   type: 'p',
//   props: {},
//   children: 'Count: 1'
// }

// React compares (diffs) old vs new
// Finds only text changed: "0" → "1"
// Updates ONLY that text node in real DOM




