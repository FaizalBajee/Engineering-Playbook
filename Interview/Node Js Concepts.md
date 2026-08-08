# Node Js Concepts

# 1️⃣ Node.js Architecture

## 🔹 Single Threaded but Not Single-Process

- Uses **Event Loop**
- Built on **V8 Engine**
- Uses **libuv** for async I/O
- Non-blocking, event-driven architecture

### Components:

- Call Stack
- Callback Queue
- Microtask Queue
- Event Loop
- Thread Pool (libuv – 4 threads default)

---

# 2️⃣ Event Loop (Deep Understanding)

## 🔹 Event Loop Phases

1. Timers
2. Pending Callbacks
3. Idle/Prepare
4. Poll (I/O)
5. Check (setImmediate)
6. Close Callbacks

After each phase:

→ Microtasks run

---

## 🔹 Microtasks Priority

Order:

1. `process.nextTick()`
2. Promise callbacks
3. Then Event Loop phases

⚠ `process.nextTick()` can cause starvation.

---

# 3️⃣ Asynchronous Patterns

## 🔹 Callback → Promise → Async/Await

### Problems with Callbacks

- Callback Hell
- Error handling complexity

### Async/Await Internals

- Syntactic sugar over Promises
- Returns a Promise automatically
- Uses microtask queue

---

## 🔹 Async Hooks

Used to track async resource lifecycle.

Used in:

- APM tools
- Debugging memory leaks
- Context tracking

---

# 4️⃣ Streams (High Performance I/O)

## 🔹 Types

- Readable
- Writable
- Duplex
- Transform

## 🔹 Backpressure

Occurs when:

A writable stream is slower than a readable one.

Solution:

- `stream.pipeline()`
- Proper `highWaterMark` tuning

---

# 5️⃣ Buffers

Used for:

- Binary data
- TCP streams
- File systems

Important:

- Node handles raw memory outside V8 heap

---

# 6️⃣ Worker Threads

Used for CPU-bound tasks.

### When to Use:

- Image processing
- Heavy JSON parsing
- Cryptography

Difference:

- Worker Thread → Same process
- Cluster → Multiple processes

---

# 7️⃣ Cluster Module

Purpose:

Use multi-core CPUs.

Each worker:

- Separate process
- Separate memory

Used for:

- Production scaling
- Load balancing
- **`Advanced Concepts`**
- EventEmitter
- Node.js internal modules
- Child Process
- Worker Threads
- Streams backpressure
- Memory leaks
- Garbage collection
- Node.js debugging

---

# 8️⃣ Memory Management

## 🔹 Stack vs Heap

- Stack → Function calls
- Heap → Objects

## 🔹 V8 Garbage Collection

- Mark and Sweep
- Generational GC

## 🔹 Memory Leak Causes

- Global variables
- Event listeners not removed
- Closures holding references
- Large in-memory caches

Tools:

- `-inspect`
- Heap snapshot
- clinic.js

---

# 9️⃣ Performance Optimization

## 🔹 CPU Bound vs I/O Bound

Node is optimized for I/O bound.

## 🔹 Techniques

- Avoid blocking code
- Use streams for large data
- Caching (Redis)
- DB indexing
- Compression
- HTTP Keep-Alive

---

# 🔟 Error Handling (Advanced)

## 🔹 Types

- Operational Errors
- Programmer Errors

Best Practice:

- Centralized error handler
- Never crash on operational error
- Crash on programmer error

Use:

```
process.on("uncaughtException")
process.on("unhandledRejection")
```

---

# 1️⃣1️⃣ Security Best Practices

## 🔹 Common Attacks

- XSS
- CSRF
- SQL Injection
- NoSQL Injection
- SSRF

## 🔹 Prevention

- Helmet
- Rate limiting
- Input validation (Zod/Joi)
- bcrypt/argon2
- Secure cookies
- HTTPS only

---

# 1️⃣2️⃣ Advanced Express Architecture

Avoid simple MVC.

Use:

- C**lean Architecture**
- **DDD**
- **Service Layer**
- **Repository Pattern**
- **Dependency Injection**

Structure:

```
src/
 ├── domain/
 ├── application/
 ├── infrastructure/
 ├── interfaces/
```

---

# 1️⃣3️⃣ Advanced MongoDB Concepts

- Aggregation Pipeline
- Compound Index
- Covered Index
- Transactions
- Sharding
- Replication
- Query optimization
- Explain plans

---

# 1️⃣4️⃣ Caching Strategy

## 🔹 Types

- In-memory cache
- Redis cache
- CDN cache

Patterns:

- Cache Aside
- Write Through
- Write Behind

---

# 1️⃣5️⃣ Message Queues

Used for:

- Async processing
- Background jobs
- Email queues
- Order processing

Tools:

- BullMQ
- RabbitMQ
- Kafka

---

# 1️⃣6️⃣ System Design (Backend Level)

Understand:

- API Gateway
- Load Balancer
- Horizontal scaling
- Rate limiting
- Circuit breaker
- Service discovery

---

# 1️⃣7️⃣ Docker + DevOps

- Dockerizing Node app
- Multi-stage builds
- Environment configs
- Kubernetes basics
- CI/CD pipeline
- Zero downtime deployment

---

# 1️⃣8️⃣ Observability

## 🔹 Logging

- Winston
- Pino
- Structured logs

## 🔹 Monitoring

- Prometheus
- Grafana

## 🔹 Tracing

- OpenTelemetry

---

# 1️⃣9️⃣ Advanced HTTP Concepts

- HTTP/1 vs HTTP/2
- REST vs GraphQL
- Idempotency
- CORS
- WebSockets
- SSE

---

# 2️⃣0️⃣ Production Best Practices

✔ Graceful shutdown

✔ Health check endpoints

✔ Rate limiting

✔ Input sanitization

✔ Timeout handling

✔ Retries with backoff

✔ Circuit breaker