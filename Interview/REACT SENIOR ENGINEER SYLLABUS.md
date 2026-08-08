# **REACT SENIOR ENGINEER SYLLABUS**

# 🧠 MODULE 1: React Fundamentals (Mastery Level)

### 1.1 React Rendering Model

- Virtual DOM concept
- Render phase vs Commit phase
- Reconciliation algorithm
- Diffing strategy (same type vs different type elements)
- Key prop mechanics
- React Fiber basics

**Depth Required:**

You must be able to explain how React updates a tree internally.

**Outcome:**

You can answer:

> How does React optimize DOM updates?
> 

---

### 1.2 Component Model

- Functional vs Class components
- Lifecycle methods vs useEffect mapping
- Why hooks replaced classes
- StrictMode behavior
- Controlled vs Uncontrolled components

**Depth Required:**

Explain architectural evolution from classes → hooks.

---

# 🧩 MODULE 2: Hooks Deep Mastery

### 2.1 Core Hooks (Internal Behavior Focus)

- useState (batching, functional updates)
- useEffect (execution timing, cleanup)
- useRef (mutability without re-render)
- useMemo (memoization semantics)
- useCallback (function identity stability)
- useContext (prop drilling solution + re-render cost)

!image.png

!image.png

### 2.2 Advanced Hooks

- Custom hooks architecture
- Dependency array deep logic
- Infinite loop patterns
- Stale closure problems
- Cleanup patterns
- useLayoutEffect vs useEffect
- useImperativeHandle
- useReducer

### 2.3 Concurrent Hooks

- useTransition
- useDeferredValue
- Suspense integration

**Depth Required:**

Understand when hooks cause unnecessary re-renders.

---

# ⚡ MODULE 3: Rendering & Performance Engineering

### 3.1 Re-render Behavior

- What triggers re-render?
- Parent-child propagation
- React.memo vs PureComponent
- Memoization cost analysis
- When NOT to memoize

### 3.2 Performance Optimization

- Code splitting
- React.lazy
- Suspense boundaries
- Dynamic imports
- Bundle analysis
- Tree shaking
- Virtualization (react-window)
- Profiler & flame charts

**Practical Exercise:**

Optimize a 10k row table.

---

# 🗂 MODULE 4: State Management Architecture

### 4.1 State Strategy

- Local vs Global state
- Server state vs UI state
- Derived state pitfalls

### 4.2 Context API

- When to use

### 4.3 Redux (Advanced)

- Re-render optimization
- Splitting contexts
- Redux flow
- Redux Toolkit
- Normalized state
- Middleware pipeline
- Thunk vs Saga
- RTK Query
- Memoized selectors (Reselect)

### 4.4 Modern Alternatives

- Zustand
- Jotai
- React Query
- Server state caching

**Depth Required:**

Know when NOT to use Redux.

---

# 🏗 MODULE 5: Architecture & Scalability

### 5.1 Project Structure

- Feature-based architecture
- Domain-driven frontend
- Separation of concerns

### 5.2 Monorepo

- Nx
- Turborepo
- Shared packages
- Build pipelines

### 5.3 Microfrontend

- Module Federation
- Independent deployment
- Communication between apps

### 5.4 Design Systems

- Component library creation
- Storybook
- Theming
- Accessibility (ARIA)

Design scalable frontend architecture.

**Outcome:**

---

# 🌐 MODULE 6: Routing & Large App Navigation

- React Router deep understanding
- Nested routes
- Protected routes
- Lazy route loading
- Route-based code splitting
- Role-based access control

---

# 🔐 MODULE 7: Authentication & Security

- JWT flow
- Refresh tokens
- Token storage strategy
- HTTP-only cookies vs localStorage
- XSS
- CSRF
- CORS handling
- Content Security Policy

**Depth Required:**

Design secure frontend auth flow.

---

# 🖥 MODULE 8: SSR / SSG / Advanced Rendering

- CSR vs SSR vs SSG
- Hydration
- Streaming SSR
- React Server Components
- Suspense in SSR
- Edge rendering basics
- SEO optimization

---

# 🧪 MODULE 9: Testing Strategy

### 9.1 Unit Testing

- Jest
- React Testing Library
- Mocking APIs

### 9.2 Integration Testing

- Async testing
- MSW

### 9.3 E2E Testing

- Cypress / Playwright

### 9.4 Testing Strategy Design

- Test pyramid
- Coverage strategy
- What to test vs not test

---

# 🚀 MODULE 10: DevOps & Production Engineering

- CI/CD pipelines
- Dockerizing React app
- Environment configuration
- Build optimization
- Bundle analysis
- Performance budgets
- Monitoring (Sentry)

Since you’re already using Docker + Node, this module will be easier for you.

---

# 🧠 MODULE 11: React Internals (Senior Level)

- Fiber architecture deep dive
- Scheduler priority
- Concurrent rendering
- Batching behavior
- StrictMode double render
- Tearing
- React source code overview

**Depth Required:**

Explain how React schedules updates internally.

---

# 🏛 MODULE 12: Frontend System Design

Design systems like:

- E-commerce platform
- Real-time dashboard
- Multi-tenant SaaS
- Role-based admin system

Focus on:

- Caching
- API abstraction layer
- Error boundaries strategy
- Logging & monitoring
- Lazy loading strategy

---

# 📘 MODULE 13: TypeScript with React

- Props typing
- Generics
- Custom hook typing
- Utility types
- React.FC vs standard function
- Advanced patterns (Discriminated unions)

React-Virtual-Dom-Notes