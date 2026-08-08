# Kafka End-to-End Syllabus + Study Plan

# Kafka End-to-End Syllabus

## Goal

Build strong practical knowledge of Apache Kafka from fundamentals to production usage, so you can explain the architecture, implement producer/consumer flows, and discuss operational concerns in interviews.

## 1) Kafka Foundations

- What Kafka is and why it is used
- Messaging systems vs event streaming
- Core Kafka use cases
- Kafka ecosystem overview
- Kafka terminology: broker, topic, partition, offset, producer, consumer, consumer group, leader, follower, ISR

## 2) Kafka Architecture

- Kafka cluster architecture
- How data flows through Kafka
- Partitions and ordering guarantees
- Replication and fault tolerance
- Leader election and ISR
- Kafka storage model and log segments
- Retention, cleanup policy, and compaction

## 3) Producers

- Producer API basics
- Sync vs async send
- Acks and durability
- Batch size, linger.ms, compression
- Idempotent producer
- Retries and delivery semantics
- Keys and partitioning strategy
- Custom partitioner concept

## 4) Consumers

- Consumer API basics
- Poll loop
- Consumer groups
- Rebalancing
- Offset management
- Auto commit vs manual commit
- At-least-once, at-most-once, exactly-once concepts
- Handling duplicates and retry patterns

## 5) Topics, Partitions, and Replication

- Topic design
- Choosing partition count
- Partition key strategy
- Replication factor
- Under-replicated partitions
- Impact of partition count on throughput and parallelism
- Repartitioning tradeoffs

## 6) Kafka Internals

- Broker responsibilities
- Replica synchronization
- Controller role
- Metadata management
- Offset storage and __consumer_offsets
- Log compaction internals
- Message format basics

## 7) Delivery Semantics and Reliability

- At-most-once
- At-least-once
- Exactly-once semantics
- Idempotent writes
- Transactions in Kafka
- Duplicate handling strategies
- Poison message handling
- Dead-letter queue pattern

## 8) Kafka Streams and Event Processing

- Stream processing basics
- Kafka Streams vs consumer logic
- Stream processing concepts
- KStream, KTable, GlobalKTable
- Windowing
- Joins
- Stateful processing
- Use cases for stream processing

## 9) Kafka Connect and Integrations

- Kafka Connect overview
- Source and sink connectors
- Connector workers
- ETL and CDC use cases
- Debezium basics
- Integrating Kafka with databases and external systems

## 10) Schema and Data Contracts

- Why schemas matter
- Avro, JSON Schema, Protobuf overview
- Schema Registry concept
- Schema evolution rules
- Backward, forward, full compatibility
- Producer/consumer contract management

## 11) Security

- Authentication concepts
- Authorization concepts
- SASL overview
- TLS/SSL encryption
- ACLs and access control
- Secure deployment practices

## 12) Operations and Monitoring

- Kafka cluster sizing basics
- Disk, memory, and network considerations
- Monitoring lag and throughput
- Broker metrics
- Consumer lag monitoring
- Alerting and incident basics
- Backup and disaster recovery concepts
- Rolling restarts and maintenance

## 13) Kafka in Microservices

- Event-driven architecture
- Command vs event
- Choreography vs orchestration
- Outbox pattern
- Saga pattern basics
- Using Kafka with API Gateway, Redis, PostgreSQL, and Node/Nest services
- Eventual consistency

## 14) Interview Topics

- Why Kafka over RabbitMQ or other queues
- What happens when a broker fails
- How rebalancing works
- How to guarantee ordering
- How to avoid duplicate processing
- What affects consumer lag
- Partition strategy for high traffic systems
- How to design a notification/order/inventory flow with Kafka

## 15) Hands-on Practice

- Install Kafka locally using Docker
- Create a topic
- Produce messages from a script
- Consume messages with a consumer group
- Test partitioning with keys
- Test manual commit
- Build a retry and DLQ flow
- Add schema validation
- Connect Kafka to a Node.js or NestJS app
- Observe lag and rebalancing behavior

## 16) Revision Checklist

- Can I explain Kafka in 2 minutes?
- Can I draw Kafka architecture from memory?
- Can I explain partitioning and consumer groups?
- Can I explain offset commit and rebalancing?
- Can I compare Kafka with RabbitMQ?
- Can I describe exactly-once and transactions?
- Can I design a real-time event system end to end?

# Study Plan

## Week 1: Kafka Basics + Architecture

Day 1: Kafka overview, messaging vs streaming, terminology

Day 2: Topics, partitions, brokers, offsets

Day 3: Replication, ISR, leader/follower, retention

Day 4: Producer basics, acks, batching, keys

Day 5: Consumer basics, polling, groups, commits

Day 6: Rebalancing, lag, ordering

Day 7: Revision + notes

## Week 2: Reliability + Advanced Concepts

Day 8: Delivery semantics

Day 9: Idempotent producer and retries

Day 10: Transactions and exactly-once semantics

Day 11: Schema Registry and schema evolution

Day 12: Kafka Connect and CDC

Day 13: Kafka Streams basics

Day 14: Revision + one mock interview

## Week 3: Production + System Design

Day 15: Security basics

Day 16: Monitoring and operations

Day 17: High-throughput topic design

Day 18: Event-driven microservices patterns

Day 19: Outbox and saga patterns

Day 20: End-to-end project design

Day 21: Revision + interview questions

## Week 4: Implementation Practice

Day 22: Docker-based local Kafka setup

Day 23: Producer implementation

Day 24: Consumer implementation

Day 25: Retry and DLQ flow

Day 26: Partition and key strategy testing

Day 27: Schema validation and versioning

Day 28: Final revision and interview answers

# Daily Study Routine

- 30 minutes: theory
- 45 minutes: hands-on practice
- 15 minutes: revision and interview Q&A
- 10 minutes: write short notes in your own words

# Final Outcome

By the end of this plan, you should be able to:

- explain Kafka architecture clearly
- build basic producer and consumer services
- handle offsets, retries, and duplicates
- discuss production concerns confidently
- answer Kafka interview questions with practical examples