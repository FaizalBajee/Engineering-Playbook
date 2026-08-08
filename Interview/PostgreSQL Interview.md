# PostgreSQL Interview Prep (3 Years Experience)

## 1. Core SQL (Must be flawless)

### Key Areas

- SELECT, WHERE, ORDER BY, LIMIT
- JOINs (INNER, LEFT, RIGHT, FULL)
- GROUP BY + HAVING
- Subqueries vs CTE (`WITH`)
- Window functions

### Example (Window Function)

SELECT name, salary,
RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank
FROM employees;

## 2. Joins (Very Important)

### Types

- INNER JOIN → matching rows
- LEFT JOIN → all left + matched right
- RIGHT JOIN → opposite
- FULL JOIN → everything

### Interview twist

👉 Difference between:

`WHERE condition vs ON condition`

## 3. Indexing (🔥 Highly Asked)

### Types in PostgreSQL

- B-Tree (default)
- Hash
- GIN (for JSONB, full-text)
- GiST (geospatial)

### Example

```sql
CREATE INDEX idx_user_emailON users(email);
```

### Key Concepts

- Index improves **read**, slows **write**
- Avoid over-indexing
- Composite index order matters

## 4. Query Optimization

### Explain Plan

```sql
EXPLAIN ANALYZESELECT*FROM usersWHERE email='test@gmail.com';
```

### Look for

- Seq Scan ❌ (slow)
- Index Scan ✅
- Cost, rows, time

### Common Fixes

- Add index
- Avoid `SELECT *`
- Use proper joins
- Filter early

## 5. Transactions & ACID

### ACID

- Atomicity
- Consistency
- Isolation
- Durability

### Example

```sql
BEGIN;

UPDATE accountsSET balance= balance-100WHERE id=1;
UPDATE accountsSET balance= balance+100WHERE id=2;

COMMIT;
```

### Isolation Levels

- Read Uncommitted
- Read Committed (default)
- Repeatable Read
- Serializable

👉 Interview Q: Phantom reads, dirty reads

## 6. Locks & Concurrency

### Types

- Row-level lock
- Table-level lock

### Example

```sql
SELECT*FROM usersWHERE id=1FORUPDATE;
```

👉 Prevent race conditions (important in payments)

## 7. Normalization vs Denormalization

### Normalization

- Reduce redundancy
- Improve consistency

### Denormalization

- Improve performance (joins reduce)

👉 Interview: When to denormalize?

→ Analytics, heavy reads

## 8. JSON & JSONB (🔥 Very Important in PostgreSQL)

### Example

```sql
SELECTdata->>'name'FROM users;
```

### Why JSONB?

- Faster
- Indexable

```sql
CREATE INDEX idx_jsonON usersUSING GIN (data);
```

👉 Real-world: flexible schema (like MongoDB inside SQL)

## 9. CTE vs Subquery

### CTE

```sql
WITH high_salaryAS (
SELECT*FROM employeesWHERE salary>50000
)
SELECT*FROM high_salary;
```

👉 Cleaner + reusable

## 10. Pagination

### Offset-based

```sql
SELECT*FROM usersLIMIT10 OFFSET20;
```

### Cursor-based (Better)

```sql
SELECT*FROM usersWHERE id>20LIMIT10;
```

👉 Interview: Why cursor-based is better?

→ avoids performance issues on large data

## 11. Constraints

- PRIMARY KEY
- FOREIGN KEY
- UNIQUE
- NOT NULL
- CHECK

```sql
ALTERTABLE usersADDCONSTRAINT unique_emailUNIQUE(email);
```

## 12. Views & Materialized Views

### View

```sql
CREATEVIEW active_usersAS
SELECT*FROM usersWHERE active=true;
```

### Materialized View

```sql
CREATE MATERIALIZEDVIEW sales_summaryAS
SELECT product_id, SUM(amount)FROM salesGROUPBY product_id;
```

👉 Faster but needs refresh

## 13. Stored Procedures & Functions

```sql
CREATEFUNCTION get_user_count()
RETURNSINTAS $$
BEGIN
RETURN (SELECTCOUNT(*)FROM users);
END;
$$LANGUAGE plpgsql;
```

## 14. Partitioning (🔥 Advanced but important)

```sql
CREATETABLE orders (
  id SERIAL,
  created_atDATE
) PARTITIONBY RANGE (created_at);
```

👉 Used in large-scale systems

## 15. Real-World Scenarios (Must Prepare)

### 🔥 Scenario 1: Slow Query

- Check EXPLAIN
- Add index
- Optimize joins

### 🔥 Scenario 2: Duplicate Data

- Add UNIQUE constraint

### 🔥 Scenario 3: High Traffic API

- Use caching + indexing
- Connection pooling

### 🔥 Scenario 4: Payment System

- Transactions + row locks

---

# 💡 Must-Know PostgreSQL-Specific Features

- `RETURNING` clause

```sql
INSERTINTO users(name)VALUES('Vignesh') RETURNING id;
```

- `UPSERT`

```sql
INSERTINTO users(id, name)
VALUES (1,'Vignesh')
ON CONFLICT (id)DOUPDATESET name= EXCLUDED.name;
```

What’s Missing (Critical for 3-Year Level)

PostgreSQL Interview Prep

60 SQL PROBLEMS (INTERVIEW-READY SET)