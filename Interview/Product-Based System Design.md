# Product-Based System Design Master Roadmap (Beginner to Advanced)

# 🚀 Product-Based System Design Master Roadmap

> [!info]
> 

> Designed for product-based company interviews: Amazon, Google, Microsoft, Meta, Uber, Walmart, Atlassian, PayPal, Adobe, Salesforce, Stripe, and similar high-scale engineering teams.
> 

> 
> 

> Target level: **5+ years Full Stack Engineer**
> 

> 
> 

> Goal: Build complete command of **system design, distributed systems, cloud architecture, scalability, reliability, and interview communication**.
> 

---

## 🧭 How to use this page

- Study modules in order: **Beginner → Intermediate → Advanced → Expert**
- For each topic, cover: theory, patterns, trade-offs, real systems, and interview answers
- Mark completion with checkboxes and keep notes in the Notes section
- Revisit the revision checklist every week

---

## ✅ Master progress dashboard

| Section | Status | Notes |
| --- | --- | --- |
| --- | ---: | --- |
| Beginner Foundation | ⬜ |  |
| Networking & Protocols | ⬜ |  |
| Load Balancing & Caching | ⬜ |  |
| Databases & Storage | ⬜ |  |
| Messaging & Eventing | ⬜ |  |
| Microservices & Security | ⬜ |  |
| Cloud & DevOps | ⬜ |  |
| Distributed Systems | ⬜ |  |
| Case Studies | ⬜ |  |
| Interview Prep | ⬜ |  |
| 90-Day Study Plan | ⬜ |  |

---

# Module 1 — Computer Science Fundamentals

## 1) Scalability

- **Why important:** Determines whether a system can grow without breaking.
- **Learning Objectives:** Understand scale-up vs scale-out, bottlenecks, capacity growth.
- **Interview Questions:** How would you scale a URL shortener? What breaks first under load?
- **Real-world Use Cases:** Feeds, chat systems, payment platforms, analytics pipelines.
- **Common Mistakes:** Confusing scalability with performance; ignoring cost.
- **Prerequisites:** Basic architecture, request/response flow.
- **Hands-on Practice Ideas:** Estimate how to scale a todo app from 1K to 10M users.
- **Recommended Reading:** System Design Primer; cloud design pattern docs.
- **Best FREE YouTube video:** System Design One Shot Full Course
- **YouTube Link:** https://www.youtube.com/watch?v=Vnm-ycSfJx4
- **Channel Name:** Unknown from search result
- **Video Duration:** About 5 hours
- **Difficulty:** Beginner
- **Estimated Study Time:** 2–4 hours
- **Completion Checkbox:** ⬜
- **Notes Section:**

## 2) Availability

- **Why important:** Measures uptime and whether users can reach the system.
- **Learning Objectives:** Learn uptime, redundancy, failover, SLA/SLO concepts.
- **Interview Questions:** How do you design for 99.99% availability?
- **Real-world Use Cases:** Banking, ride booking, notifications, checkout.
- **Common Mistakes:** Thinking availability means zero downtime forever.
- **Prerequisites:** Scaling, basic networking.
- **Hands-on Practice Ideas:** Draw active-active vs active-passive architectures.
- **Recommended Reading:** Google SRE monitoring principles.
- **Best FREE YouTube video:** How to Prepare for System Design Interviews w/ Meta Staff Engineer
- **YouTube Link:** https://www.youtube.com/watch?v=Ru54dxzCyD0
- **Channel Name:** Unknown from search result
- **Video Duration:** Not specified in search result
- **Difficulty:** Beginner
- **Estimated Study Time:** 1–2 hours
- **Completion Checkbox:** ⬜
- **Notes Section:**

## 3) Reliability

- **Why important:** System must continue working correctly under faults.
- **Learning Objectives:** Fault tolerance, retries, redundancy, graceful degradation.
- **Interview Questions:** How do you keep a service reliable during dependency failures?
- **Real-world Use Cases:** Payments, storage, order processing.
- **Common Mistakes:** Blind retries, no idempotency.
- **Prerequisites:** Availability, failure modes.
- **Hands-on Practice Ideas:** Design retry logic with backoff and jitter.
- **Recommended Reading:** Google SRE book.
- **Best FREE YouTube video:** System Design Explained: APIs, Databases, Caching, CDNs ...
- **YouTube Link:** https://www.youtube.com/watch?v=adOkTjIIDnk
- **Channel Name:** Unknown from search result
- **Video Duration:** Not specified in search result
- **Difficulty:** Beginner
- **Estimated Study Time:** 1–2 hours
- **Completion Checkbox:** ⬜
- **Notes Section:**

## 4) Maintainability

- **Why important:** Determines how fast teams can safely change the system.
- **Learning Objectives:** Modularity, observability, operability, deployment safety.
- **Interview Questions:** How do you design for long-term maintainability?
- **Real-world Use Cases:** Large microservice ecosystems.
- **Common Mistakes:** Overengineering; ignoring developer experience.
- **Prerequisites:** Basic software design.
- **Hands-on Practice Ideas:** Split a monolith into clean bounded modules.
- **Recommended Reading:** Atlassian SDLC article.
- **Best FREE YouTube video:** How I Study System Design Without Forgetting Everything
- **YouTube Link:** https://www.youtube.com/watch?v=0y74ixH2E8Y
- **Channel Name:** Unknown from search result
- **Video Duration:** Not specified in search result
- **Difficulty:** Beginner
- **Estimated Study Time:** 1–2 hours
- **Completion Checkbox:** ⬜
- **Notes Section:**

## 5) CAP Theorem

- **Why important:** Core trade-off in distributed storage and replication.
- **Learning Objectives:** Understand consistency, availability, partition tolerance.
- **Interview Questions:** What does CAP mean in a real production system?
- **Real-world Use Cases:** Distributed databases, replicated caches.
- **Common Mistakes:** Saying all systems “choose only two” without nuance.
- **Prerequisites:** Consistency, failures, networking.
- **Hands-on Practice Ideas:** Classify common DBs on CAP trade-offs.
- **Recommended Reading:** System Design Primer CAP section.
- **Best FREE YouTube video:** System Design One Shot Full Course
- **YouTube Link:** https://www.youtube.com/watch?v=Vnm-ycSfJx4
- **Channel Name:** Unknown from search result
- **Video Duration:** About 5 hours
- **Difficulty:** Intermediate
- **Estimated Study Time:** 1–2 hours
- **Completion Checkbox:** ⬜
- **Notes Section:**

## 6) PACELC

- **Why important:** Extends CAP with latency trade-offs when no partition exists.
- **Learning Objectives:** Understand P/A trade-offs under partition and E/L trade-offs otherwise.
- **Interview Questions:** How does PACELC affect DB choice?
- **Real-world Use Cases:** Geo-replicated databases.
- **Common Mistakes:** Ignoring latency trade-offs.
- **Prerequisites:** CAP theorem.
- **Hands-on Practice Ideas:** Compare region-local vs global consistency.
- **Recommended Reading:** System design distributed database articles.
- **Best FREE YouTube video:** Complete System Design Roadmap for 90 Days | FAANG ...
- **YouTube Link:** https://www.youtube.com/watch?v=64L0xcPbguA
- **Channel Name:** Unknown from search result
- **Video Duration:** Not specified in search result
- **Difficulty:** Intermediate
- **Estimated Study Time:** 1 hour
- **Completion Checkbox:** ⬜
- **Notes Section:**

## 7) Latency vs Throughput

- **Why important:** Two of the most asked performance trade-offs.
- **Learning Objectives:** Understand response time vs request rate.
- **Interview Questions:** Can a system have high throughput but high latency?
- **Real-world Use Cases:** APIs, stream processing, queues.
- **Common Mistakes:** Treating them as the same metric.
- **Prerequisites:** Performance metrics.
- **Hands-on Practice Ideas:** Measure latency percentiles and throughput in a toy service.
- **Recommended Reading:** System Design Primer.
- **Best FREE YouTube video:** System Design Explained: APIs, Databases, Caching, CDNs ...
- **YouTube Link:** https://www.youtube.com/watch?v=adOkTjIIDnk
- **Channel Name:** Unknown from search result
- **Video Duration:** Not specified in search result
- **Difficulty:** Beginner
- **Estimated Study Time:** 45–60 min
- **Completion Checkbox:** ⬜
- **Notes Section:**

## 8) Consistency Models

- **Why important:** Critical for correctness in distributed storage.
- **Learning Objectives:** Strong, eventual, causal, monotonic reads/writes.
- **Interview Questions:** When is eventual consistency acceptable?
- **Real-world Use Cases:** Social feeds, shopping carts, counters.
- **Common Mistakes:** Designing with strong consistency everywhere.
- **Prerequisites:** Replication, CAP.
- **Hands-on Practice Ideas:** Design a follower count system.
- **Recommended Reading:** Database vendor docs and SRE material.
- **Best FREE YouTube video:** System Design Primer / consistency topics
- **YouTube Link:** https://www.youtube.com/watch?v=Vnm-ycSfJx4
- **Channel Name:** Unknown from search result
- **Video Duration:** About 5 hours
- **Difficulty:** Intermediate
- **Estimated Study Time:** 1–2 hours
- **Completion Checkbox:** ⬜
- **Notes Section:**

## 9) Horizontal vs Vertical Scaling

- **Why important:** Fundamental capacity planning decision.
- **Learning Objectives:** Scale-out vs scale-up trade-offs.
- **Interview Questions:** Which would you prefer for a stateless API? Why?
- **Real-world Use Cases:** Web servers, databases, caches.
- **Common Mistakes:** Scaling DBs vertically forever.
- **Prerequisites:** Scalability.
- **Hands-on Practice Ideas:** Refactor a monolith toward horizontal scaling.
- **Recommended Reading:** System Design Primer.
- **Best FREE YouTube video:** System Design for Beginners Course
- **YouTube Link:** https://www.youtube.com/watch?v=m8Icp_Cid5o
- **Channel Name:** Unknown from search result
- **Video Duration:** Not specified in search result
- **Difficulty:** Beginner
- **Estimated Study Time:** 45–60 min
- **Completion Checkbox:** ⬜
- **Notes Section:**

## 10) SPOF

- **Why important:** Single points of failure are interview red flags.
- **Learning Objectives:** Identify and eliminate SPOFs.
- **Interview Questions:** What are the SPOFs in this design?
- **Real-world Use Cases:** Load balancers, DB primaries, queues, auth.
- **Common Mistakes:** Missing DNS, cache, and third-party SPOFs.
- **Prerequisites:** Availability, failover.
- **Hands-on Practice Ideas:** Audit a simple architecture diagram for SPOFs.
- **Recommended Reading:** Google SRE and cloud pattern docs.
- **Best FREE YouTube video:** How to Prepare for System Design Interviews w/ Meta Staff Engineer
- **YouTube Link:** https://www.youtube.com/watch?v=Ru54dxzCyD0
- **Channel Name:** Unknown from search result
- **Video Duration:** Not specified in search result
- **Difficulty:** Beginner
- **Estimated Study Time:** 30–45 min
- **Completion Checkbox:** ⬜
- **Notes Section:**

## 11) Performance Metrics

- **Why important:** Lets you measure, compare, and optimize systems.
- **Learning Objectives:** CPU, memory, I/O, p95/p99 latency, error rate, saturation.
- **Interview Questions:** Which metrics matter for this service?
- **Real-world Use Cases:** Monitoring dashboards, alerting, capacity planning.
- **Common Mistakes:** Watching only average latency.
- **Prerequisites:** Basic performance concepts.
- **Hands-on Practice Ideas:** Build a simple metrics dashboard.
- **Recommended Reading:** Google SRE monitoring chapter.
- **Best FREE YouTube video:** Chapter 6 - Monitoring Distributed Systems
- **YouTube Link:** https://landing.google.com/sre/sre-book/chapters/monitoring-distributed-systems/
- **Channel Name:** Google SRE / Google
- **Video Duration:** N/A (article)
- **Difficulty:** Beginner
- **Estimated Study Time:** 1 hour
- **Completion Checkbox:** ⬜
- **Notes Section:**

---

# Module 2 — Networking

## 1) OSI Model

- Why important: Foundation for understanding network layers and debugging.
- Learning Objectives: Learn all 7 layers and their responsibilities.
- Interview Questions: Which OSI layer does TLS belong to?
- Real-world Use Cases: Packet analysis, troubleshooting.
- Common Mistakes: Memorizing layers without function.
- Prerequisites: Basic internet concepts.
- Hands-on Practice Ideas: Map common protocols to OSI layers.
- Recommended Reading: MDN networking docs.
- Best FREE YouTube video: System Design for Beginners Course
- YouTube Link: https://www.youtube.com/watch?v=m8Icp_Cid5o
- Channel Name: Unknown from search result
- Video Duration: Not specified in search result
- Difficulty: Beginner
- Estimated Study Time: 1 hour
- Completion Checkbox: ⬜
- Notes Section:

## 2) TCP/IP

- Why important: Real-world internet protocol stack.
- Learning Objectives: TCP handshake, connection state, retransmission.
- Interview Questions: Why is TCP reliable?
- Real-world Use Cases: Web traffic, gRPC, databases.
- Common Mistakes: Confusing TCP with IP.
- Prerequisites: OSI.
- Hands-on Practice Ideas: Trace a TCP handshake with packet capture.
- Recommended Reading: RFCs and MDN.
- Best FREE YouTube video: System Design Explained: APIs, Databases, Caching, CDNs ...
- YouTube Link: https://www.youtube.com/watch?v=adOkTjIIDnk
- Channel Name: Unknown from search result
- Video Duration: Not specified in search result
- Difficulty: Beginner
- Estimated Study Time: 1–2 hours
- Completion Checkbox: ⬜
- Notes Section:

## 3) HTTP/HTTPS

- Why important: Core web protocol in nearly every interview design.
- Learning Objectives: Methods, status codes, headers, HTTPS security.
- Interview Questions: Why HTTPS is necessary?
- Real-world Use Cases: APIs, browser requests, web apps.
- Common Mistakes: Ignoring idempotency and caching headers.
- Prerequisites: TCP/IP, TLS.
- Hands-on Practice Ideas: Build a REST service and inspect headers.
- Recommended Reading: MDN HTTP docs.
- Best FREE YouTube video: System Design for Beginners Course
- YouTube Link: https://www.youtube.com/watch?v=m8Icp_Cid5o
- Channel Name: Unknown from search result
- Video Duration: Not specified in search result
- Difficulty: Beginner
- Estimated Study Time: 1–2 hours
- Completion Checkbox: ⬜
- Notes Section:

## 4) HTTP2

- Why important: Multiplexing and performance improvement over HTTP/1.1.
- Learning Objectives: Streams, multiplexing, headers compression.
- Interview Questions: Why use HTTP/2?
- Real-world Use Cases: Modern web apps, CDNs.
- Common Mistakes: Assuming HTTP/2 solves all latency.
- Prerequisites: HTTP/HTTPS.
- Hands-on Practice Ideas: Compare request waterfalls.
- Recommended Reading: MDN HTTP/2 docs.
- Best FREE YouTube video: System Design Explained: APIs, Databases, Caching, CDNs ...
- YouTube Link: https://www.youtube.com/watch?v=adOkTjIIDnk
- Channel Name: Unknown from search result
- Video Duration: Not specified in search result
- Difficulty: Intermediate
- Estimated Study Time: 45 min
- Completion Checkbox: ⬜
- Notes Section:

## 5) HTTP3

- Why important: Uses QUIC to reduce handshake and head-of-line blocking issues.
- Learning Objectives: QUIC basics, UDP transport, connection migration.
- Interview Questions: What problem does HTTP/3 solve?
- Real-world Use Cases: Media, mobile, latency-sensitive apps.
- Common Mistakes: Treating it as just a version bump.
- Prerequisites: HTTP2, TLS.
- Hands-on Practice Ideas: Compare HTTP/2 vs HTTP/3 behavior conceptually.
- Recommended Reading: MDN HTTP/3 and QUIC docs.
- Best FREE YouTube video: System Design Roadmap videos and recent protocol explainers
- YouTube Link: https://www.youtube.com/watch?v=64L0xcPbguA
- Channel Name: Unknown from search result
- Video Duration: Not specified in search result
- Difficulty: Advanced
- Estimated Study Time: 1 hour
- Completion Checkbox: ⬜
- Notes Section:

## 6) DNS

- Why important: Critical bottleneck and SPOF area in many architectures.
- Learning Objectives: Resolution flow, TTL, recursion, caching.
- Interview Questions: How does DNS affect latency and availability?
- Real-world Use Cases: Service discovery, domain routing.
- Common Mistakes: Ignoring TTL effects and caching layers.
- Prerequisites: Networking basics.
- Hands-on Practice Ideas: Trace DNS lookup with dig/nslookup.
- Recommended Reading: Cloudflare DNS resources.
- Best FREE YouTube video: System Design One Shot Full Course
- YouTube Link: https://www.youtube.com/watch?v=Vnm-ycSfJx4
- Channel Name: Unknown from search result
- Video Duration: About 5 hours
- Difficulty: Beginner
- Estimated Study Time: 1 hour
- Completion Checkbox: ⬜
- Notes Section:

## 7) CDN

- Why important: Offloads origin servers and lowers latency globally.
- Learning Objectives: Edge caching, invalidation, origin fetch, cache keys.
- Interview Questions: When would you place content on a CDN?
- Real-world Use Cases: Images, videos, static assets, APIs.
- Common Mistakes: Caching private or dynamic content blindly.
- Prerequisites: HTTP, caching.
- Hands-on Practice Ideas: Design a static asset delivery flow.
- Recommended Reading: CDN provider docs.
- Best FREE YouTube video: System Design Explained: APIs, Databases, Caching, CDNs ...
- YouTube Link: https://www.youtube.com/watch?v=adOkTjIIDnk
- Channel Name: Unknown from search result
- Video Duration: Not specified in search result
- Difficulty: Intermediate
- Estimated Study Time: 1 hour
- Completion Checkbox: ⬜
- Notes Section:

## 8) WebSockets

- Why important: Real-time bidirectional communication.
- Learning Objectives: Connection lifecycle, reconnect, message ordering.
- Interview Questions: When choose WebSocket over polling?
- Real-world Use Cases: Chat, collaboration, trading dashboards.
- Common Mistakes: Not handling reconnect and backpressure.
- Prerequisites: HTTP, TCP.
- Hands-on Practice Ideas: Build a small live chat.
- Recommended Reading: MDN WebSocket docs.
- Best FREE YouTube video: Design Youtube - System Design Interview
- YouTube Link: https://www.youtube.com/watch?v=jPKTo1iGQiE
- Channel Name: Unknown from search result
- Video Duration: Not specified in search result
- Difficulty: Intermediate
- Estimated Study Time: 1 hour
- Completion Checkbox: ⬜
- Notes Section:

## 9) gRPC

- Why important: Efficient service-to-service RPC in microservices.
- Learning Objectives: Protobuf, streaming, unary calls, deadlines.
- Interview Questions: Why gRPC instead of REST?
- Real-world Use Cases: Internal service communication.
- Common Mistakes: Using gRPC for public APIs without need.
- Prerequisites: HTTP2, serialization.
- Hands-on Practice Ideas: Create a service with unary and streaming RPCs.
- Recommended Reading: gRPC official docs.
- Best FREE YouTube video: System Design Roadmap / gRPC explainers
- YouTube Link: https://www.youtube.com/watch?v=64L0xcPbguA
- Channel Name: Unknown from search result
- Video Duration: Not specified in search result
- Difficulty: Advanced
- Estimated Study Time: 1 hour
- Completion Checkbox: ⬜
- Notes Section:

## 10) REST

- Why important: Default API style for most interview designs.
- Learning Objectives: Resources, verbs, idempotency, statelessness.
- Interview Questions: Design REST endpoints for a booking system.
- Real-world Use Cases: CRUD apps, public APIs.
- Common Mistakes: Poor resource naming, no versioning.
- Prerequisites: HTTP.
- Hands-on Practice Ideas: Design endpoints for an e-commerce cart.
- Recommended Reading: REST API design guides.
- Best FREE YouTube video: System Design for Beginners Course
- YouTube Link: https://www.youtube.com/watch?v=m8Icp_Cid5o
- Channel Name: Unknown from search result
- Video Duration: Not specified in search result
- Difficulty: Beginner
- Estimated Study Time: 1 hour
- Completion Checkbox: ⬜
- Notes Section:

## 11) GraphQL

- Why important: Flexible client-driven data fetching.
- Learning Objectives: Schema, resolvers, N+1 problem, batching.
- Interview Questions: When does GraphQL hurt more than it helps?
- Real-world Use Cases: Complex frontends, mobile clients.
- Common Mistakes: Over-fetching resolver complexity.
- Prerequisites: API design.
- Hands-on Practice Ideas: Convert a REST response design into GraphQL.
- Recommended Reading: GraphQL official docs.
- Best FREE YouTube video: System Design Roadmap videos
- YouTube Link: https://www.youtube.com/watch?v=64L0xcPbguA
- Channel Name: Unknown from search result
- Video Duration: Not specified in search result
- Difficulty: Intermediate
- Estimated Study Time: 1–2 hours
- Completion Checkbox: ⬜
- Notes Section:

## 12) SSL/TLS

- Why important: Encryption, identity, trust, and secure transport.
- Learning Objectives: Certificates, handshake, termination, trust chain.
- Interview Questions: Where should TLS terminate?
- Real-world Use Cases: HTTPS, internal service encryption.
- Common Mistakes: Terminating at the wrong layer without considering trust.
- Prerequisites: HTTP/HTTPS.
- Hands-on Practice Ideas: Inspect a certificate chain in a browser.
- Recommended Reading: MDN TLS resources.
- Best FREE YouTube video: System Design for Beginners Course
- YouTube Link: https://www.youtube.com/watch?v=m8Icp_Cid5o
- Channel Name: Unknown from search result
- Video Duration: Not specified in search result
- Difficulty: Beginner
- Estimated Study Time: 1 hour
- Completion Checkbox: ⬜
- Notes Section:

## 13) VPN

- Why important: Secure private connectivity for internal infrastructure.
- Learning Objectives: Tunneling, remote access, site-to-site VPN.
- Interview Questions: When is VPN appropriate in cloud design?
- Real-world Use Cases: Enterprise access, hybrid cloud.
- Common Mistakes: Using VPN as a default security solution.
- Prerequisites: Networking basics.
- Hands-on Practice Ideas: Compare VPN vs private link conceptually.
- Recommended Reading: Cloud provider networking docs.
- Best FREE YouTube video: Cloud/networking fundamentals videos
- YouTube Link: https://cloud.google.com/learn/training
- Channel Name: Google Cloud
- Video Duration: N/A
- Difficulty: Intermediate
- Estimated Study Time: 45 min
- Completion Checkbox: ⬜
- Notes Section:

## 14) Load Testing Basics

- Why important: Proves design assumptions before production.
- Learning Objectives: RPS, concurrency, soak, spike, bottleneck discovery.
- Interview Questions: How would you validate this design under load?
- Real-world Use Cases: Pre-launch testing, capacity planning.
- Common Mistakes: Ignoring realistic traffic mix.
- Prerequisites: Metrics, scaling.
- Hands-on Practice Ideas: Use a tool like k6 or JMeter on a demo API.
- Recommended Reading: SRE and observability docs.
- Best FREE YouTube video: System Design interview prep resources
- YouTube Link: https://www.youtube.com/watch?v=ONLO1dakJio
- Channel Name: Unknown from search result
- Video Duration: Not specified in search result
- Difficulty: Beginner
- Estimated Study Time: 1 hour
- Completion Checkbox: ⬜
- Notes Section:

---

# Module 3 — Load Balancing

## Reverse Proxy

## Nginx

## HAProxy

## L4/L7 Load Balancers

## Health Checks

## Sticky Sessions

## Failover

Each topic should be studied with the same template above: why important, learning objectives, interview questions, use cases, mistakes, prerequisites, hands-on, reading, best free YouTube video, link, duration, channel, difficulty, estimated study time, checkbox, notes.

---

# Module 4 — Caching

## Redis

## Memcached

## Cache Patterns

## Cache Invalidation

## Write Through

## Write Back

## Write Around

## Cache Aside

## Distributed Cache

---

# Module 5 — Databases

## SQL / NoSQL

## PostgreSQL / MySQL / MongoDB / Cassandra / DynamoDB

## Replication / Sharding / Indexing / Partitioning

## Transactions / ACID / BASE / Isolation Levels

## Optimistic Locking / Pessimistic Locking

---

# Module 6 — Message Queues

## Kafka

## RabbitMQ

## ActiveMQ

## SQS

## Pub/Sub

## Event Driven Architecture

## Kafka Streams

## Kafka Connect

## Schema Registry

## DLQ

## Retry Patterns

---

# Module 7 — Storage

## Object Storage

## Blob Storage

## File Systems

## S3

## MinIO

## NAS

## SAN

---

# Module 8 — Microservices

## API Gateway

## Service Discovery

## Circuit Breaker

## Saga Pattern

## Outbox Pattern

## CQRS

## Event Sourcing

## Sidecar Pattern

## Strangler Pattern

## Service Mesh

---

# Module 9 — Security

## OAuth2

## OpenID Connect

## JWT

## Authentication

## Authorization

## RBAC

## ABAC

## Rate Limiting

## WAF

## Encryption

## Secrets Management

---

# Module 10 — Cloud

## AWS

## Azure

## GCP

## EC2

## Lambda

## API Gateway

## CloudFront

## RDS

## S3

## ECS

## EKS

## Kubernetes Basics

---

# Module 11 — DevOps

## Docker

## Kubernetes

## Helm

## Jenkins

## GitHub Actions

## CI/CD

## Monitoring

## Prometheus

## Grafana

## ELK Stack

## OpenTelemetry

---

# Module 12 — Distributed Systems

## Consistent Hashing

## Distributed Locking

## Leader Election

## Gossip Protocol

## Raft

## Paxos

## Vector Clocks

## Snowflake IDs

## CRDTs

## Bloom Filters

## HyperLogLog

---

# Module 13 — System Design Case Studies

> [!tip]
> 

> Practice these in increasing complexity: URL Shortener → Chat → Feed → Ride Sharing → E-commerce → Payment → Search → Media.
> 

## Case Studies to master

URL Shortener, TinyURL, WhatsApp, Instagram, Facebook Feed, Twitter/X, Uber, Netflix, YouTube, Google Drive, Dropbox, Amazon, BookMyShow, Swiggy, Zomato, Paytm, UPI, Banking System, Chat Application, Notification System, Ride Sharing, Hotel Booking, Food Delivery, E-commerce, Inventory Management, Payment Gateway, Search Engine, News Feed

For each case study, prepare:

- Requirements
- APIs
- Data model
- Capacity estimation
- HLD
- LLD
- Scaling plan
- Bottlenecks
- Trade-offs
- Failure handling
- Monitoring
- Security

---

# Module 14 — Interview Preparation

## Framework for answering System Design interviews

1. Clarify requirements
2. Define scope
3. Estimate scale
4. Design APIs
5. Design data model
6. Draw HLD
7. Identify bottlenecks
8. Apply scaling strategies
9. Discuss trade-offs
10. Add observability, security, and failure handling

## Requirement Gathering

## Capacity Estimation

## API Design

## Database Design

## High-Level Design

## Low-Level Design

## Scaling

## Bottleneck Analysis

## Trade-offs

## Follow-up Questions

## Mock Interview Checklist

---

# 📅 90-Day Study Plan

## Weeks 1–2: Foundations

- Scalability, availability, reliability, maintainability
- CAP, PACELC, latency vs throughput, consistency
- Metrics, SPOF, scaling types

## Weeks 3–4: Networking

- OSI, TCP/IP, HTTP, HTTPS, HTTP/2, HTTP/3
- DNS, CDN, WebSockets, gRPC, REST, GraphQL, TLS

## Weeks 5–6: Load Balancing + Caching

- Reverse proxy, Nginx, HAProxy, L4/L7
- Redis, Memcached, invalidation, cache policies

## Weeks 7–8: Databases + Storage + Queues

- SQL/NoSQL, replication, sharding, indexing
- Kafka, RabbitMQ, SQS, retry, DLQ
- S3/object storage, file systems

## Weeks 9–10: Microservices + Security + Cloud + DevOps

- Gateway, discovery, circuit breaker, saga, CQRS
- AuthN/AuthZ, OAuth2, OIDC, JWT, RBAC, ABAC
- Docker, Kubernetes, Helm, CI/CD, observability

## Weeks 11–12: Distributed Systems + Case Studies

- Consistent hashing, locks, leader election, Raft, Paxos
- Design 8–10 case studies

## Week 13: Interview Simulation

- Full mock interviews
- Timed design answers
- Feedback and revision

---

# ✅ Weekly Milestones

- Week 1: Fundamentals complete
- Week 2: Networking complete
- Week 3: Load balancing + caching
- Week 4: Databases
- Week 5: Messaging + storage
- Week 6: Microservices
- Week 7: Security + cloud
- Week 8: DevOps + observability
- Week 9: Distributed systems
- Week 10: Case studies 1–5
- Week 11: Case studies 6–10
- Week 12: Interview framework + revision
- Week 13: Mock interviews

---

# 📌 Daily Checklist

- [ ]  Read one concept
- [ ]  Write 5 interview questions
- [ ]  Draw one architecture diagram
- [ ]  Review one case study
- [ ]  Revise one prior topic
- [ ]  Add notes to Notion

---

# 🔁 Revision Schedule

- **Daily:** 15–20 min flash review
- **Weekly:** 1 full revision session
- **Monthly:** Rebuild 2 case studies from memory
- **Before interviews:** Review checklist and trade-offs only

---

# 📝 Notes Templates

## Topic Notes Template

- Topic:
- Core idea:
- Trade-offs:
- Interview answer:
- Diagram idea:
- Mistakes to avoid:
- Example systems:

## Case Study Notes Template

- Problem statement:
- Requirements:
- Scale:
- APIs:
- Data model:
- HLD:
- LLD:
- Bottlenecks:
- Trade-offs:
- Final answer summary:

---

# 📊 Progress Tracker

| Topic | Status | Revision Count | Confidence | Notes |
| --- | --- | --- | --- | --- |
| --- | ---: | ---: | ---: | --- |
| Fundamentals | ⬜ | 0 | Low |  |
| Networking | ⬜ | 0 | Low |  |
| Databases | ⬜ | 0 | Low |  |
| Microservices | ⬜ | 0 | Low |  |
| Distributed Systems | ⬜ | 0 | Low |  |
| Case Studies | ⬜ | 0 | Low |  |

---

# 🧑‍💼 Interview Tracker

| Company | Role | Round | Status | Notes |
| --- | --- | --- | --- | --- |
| Amazon | SDE / Backend | System Design | ⬜ |  |
| Google | SWE | System Design | ⬜ |  |
| Microsoft | SDE | System Design | ⬜ |  |
| Meta | E4/E5 | System Design | ⬜ |  |
| Uber | Backend | System Design | ⬜ |  |
| Walmart | Full Stack | System Design | ⬜ |  |
| Atlassian | Backend | System Design | ⬜ |  |
| PayPal | Full Stack | System Design | ⬜ |  |
| Adobe | Backend | System Design | ⬜ |  |
| Salesforce | Backend | System Design | ⬜ |  |
| Stripe | Backend | System Design | ⬜ |  |

---

# 📚 Resource Section

## Books

- Designing Data-Intensive Applications
- System Design Interview — An Insider’s Guide
- Site Reliability Engineering
- Release It!

## Blogs

- System Design Primer
- Google SRE blog / book
- Microsoft Azure Cloud Design Patterns
- Atlassian engineering and product blogs

## GitHub Repositories

- donnemartin/system-design-primer
- karanpratapsingh/system-design
- ashishps1/awesome-system-design-resources

## Official Documentation

- Google SRE book: Monitoring Distributed Systems
- Microsoft Cloud Design Patterns
- Google Cloud training resources
- AWS architecture and services docs
- MDN web docs for HTTP, TLS, WebSockets, GraphQL

## Best FREE YouTube playlists / videos by module

- Module 1: System Design One Shot Full Course
- Module 2: System Design for Beginners Course
- Module 3: System Design Explained: APIs, Databases, Caching, CDNs ...
- Module 4: System Design interview prep videos / caching explainers
- Module 5: Database-focused system design lectures
- Module 6: Kafka / message queue explainers
- Module 7: Storage architecture explainers
- Module 8: Microservices architecture explainers
- Module 9: Security and auth explainers
- Module 10: Cloud fundamentals from official providers
- Module 11: DevOps and observability explainers
- Module 12: Distributed systems explainers
- Module 13: Case study walkthroughs
- Module 14: Interview strategy videos

## Best Paid Courses (optional)

- Educative system design course
- Grokking the System Design Interview
- Interview-ready distributed systems courses

---

# 🏁 Final Revision Checklist

- [ ]  I can explain scalability clearly
- [ ]  I can compare CAP vs PACELC
- [ ]  I can design REST and messaging flows
- [ ]  I can choose DBs and justify the choice
- [ ]  I can explain caching patterns
- [ ]  I can explain Kafka vs RabbitMQ vs SQS
- [ ]  I can design auth and rate limiting
- [ ]  I can sketch cloud and DevOps architecture
- [ ]  I can explain consistency and locking
- [ ]  I can solve 10 common case studies
- [ ]  I can answer trade-off questions confidently
- [ ]  I can handle follow-up questions smoothly
- [ ]  I can present HLD and LLD cleanly

---

> [!note]
> 

> This roadmap is intentionally broad. Use it as a living interview notebook: keep adding diagrams, examples, and post-mortems from every mock interview.
>