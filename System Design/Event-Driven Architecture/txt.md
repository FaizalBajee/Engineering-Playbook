# Event-Driven Architecture (EDA)

## 1. What is Event-Driven Architecture?

Event-Driven Architecture (EDA) is a software architecture pattern where systems communicate through events.

An event represents something that has already happened in the system, such as:

* User Registered
* Order Created
* Payment Completed
* Employee Added
* Quotation Approved

Instead of directly calling multiple services, a component publishes an event and other components react to that event independently.

---

## 2. Traditional Architecture

### Flow

User Action
     ↓
Controller
     ↓
Service
     ↓
Database
     ↓
Response

### Example

When a user places an order:


Place Order
     ↓
Save Order
     ↓
Send Email
     ↓
Create Audit Log
     ↓
Update Analytics
     ↓
Return Response
```

### Problems

* Tight coupling between components
* Difficult to add new functionality
* Slow response when many operations are executed
* Changes in one service can affect others
* Poor scalability

---

## 3. Event-Driven Architecture

### Flow


User Action
     ↓
Save Order
     ↓
Publish Event
(OrderCreated)
     ↓
Event Bus
     ↓
Multiple Listeners

├── Send Email
├── Create Audit Log
├── Push Notification
└── Update Analytics
```

### Example

When an order is created:


Order Service
     ↓
Publish OrderCreated Event
```

The Order Service's job is finished.

Other services listen to the event:


Email Service
     ↓
Send Confirmation Email

Audit Service
     ↓
Create Audit Record

Notification Service
     ↓
Send Push Notification

Analytics Service
     ↓
Update Reports
```

Each service works independently.

---

## 4. Core Components

### Event

Something that happened in the system.

Examples:


UserRegistered
OrderCreated
PaymentCompleted
EmployeeCreated
QuotationApproved
```

### Event Publisher

The component that creates and publishes events.

Example:


Order Service
```

Publishes:


OrderCreated
```

### Event Bus / Message Broker

Responsible for delivering events to subscribers.

Examples:

* Kafka
* RabbitMQ
* Redis Pub/Sub
* Amazon EventBridge

### Event Listener (Subscriber)

A component that listens for specific events.

Example:


Email Service listens to OrderCreated
```

### Function Repository / Business Logic

Contains reusable functions that execute actions.

Example:


sendEmail()
createAuditLog()
updateAnalytics()
```

---

## 5. Problems Solved by Event-Driven Architecture

### Problem 1: Tight Coupling

Without Events:


Order Service
   ├── Email Service
   ├── Audit Service
   ├── Analytics Service
   └── Notification Service
```

The Order Service knows about every other service.

With Events:


Order Service
      ↓
OrderCreated Event
      ↓
Subscribers
```

The Order Service does not know who is listening.

---

### Problem 2: Slow Processing

Without Events:


Create Order
Send Email
Create Audit Log
Update Analytics
```

Everything happens before the response is returned.

With Events:


Create Order
Publish Event
Return Response
```

Other operations happen asynchronously.

Result:

* Faster response times
* Better user experience

---

### Problem 3: Difficult Feature Expansion

Suppose the system initially sends only emails.


OrderCreated
    ↓
Send Email
```

Later requirements:


OrderCreated
    ↓
Send Email
Send SMS
Create Invoice
Update Dashboard
```

New listeners can be added without modifying the Order Service.

---

### Problem 4: Scalability

If email processing becomes heavy:


OrderCreated
      ↓
Email Queue
      ↓
Multiple Email Workers
```

The email service can scale independently from the order service.

---

## 6. Real-World Example

### Employee Creation Process


HR Creates Employee
        ↓
Employee Saved
        ↓
EmployeeCreated Event
        ↓
```

Listeners:


Account Service
    ↓
Create Login Account

Email Service
    ↓
Send Welcome Email

Audit Service
    ↓
Record Activity

Notification Service
    ↓
Notify Manager
```

Each service reacts to the same event independently.

---

## 7. Advantages

* Loose coupling
* Better scalability
* Easier maintenance
* Faster response times
* Easier feature expansion
* Improved system flexibility

---

## 8. Disadvantages

* More complex architecture
* Harder debugging
* Event tracking can be difficult
* Requires message brokers and monitoring
* Event ordering can become challenging

---

## 9. When to Use Event-Driven Architecture

Recommended for:

* Large enterprise applications
* E-commerce platforms
* Banking systems
* ERP systems
* Microservices architectures
* Real-time notification systems
* Analytics and reporting systems

Not usually necessary for:

* Small CRUD applications
* Simple websites
* Small internal tools

---

## 10. Summary

Event-Driven Architecture is a design pattern where components communicate through events instead of direct calls.

The publisher only announces that something happened. It does not know who will react to it.

This reduces coupling, improves scalability, and makes it easier to add new features without changing existing business logic.
