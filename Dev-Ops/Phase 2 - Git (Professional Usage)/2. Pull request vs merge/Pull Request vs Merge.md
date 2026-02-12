# Git: Pull Request vs Merge

## 1. Merge (Git Command)

**Definition**
A Git operation used to combine branches locally.

**Key Points**

* Used locally to combine branches
* No review or approval by default

**Example**

```
git checkout main
git merge feature/login
```

**Used When**

* Personal projects
* Small teams
* You have direct access to the `main` branch

---

## 2. Pull Request (PR) / Merge Request (MR)

**Definition**
A team workflow provided by platforms like GitHub or GitLab. It is **not** a Git command.

**Key Points**

* Used in companies
* Code is reviewed before merging

**Process**

1. Developer pushes feature branch
2. Creates Pull Request
3. Code review + CI checks
4. Approved → merged into `main`

**Used When**

* Team projects
* Production code
* Controlled and safe releases

---

## 3. Key Differences

| Merge        | Pull Request                     |
| ------------ | -------------------------------- |
| Git command  | Platform feature (GitHub/GitLab) |
| Local action | Server-side process              |
| No review    | Mandatory review                 |
| Fast         | Safe and controlled              |

---

## 4. Important Note

* Pull Request still uses `git merge` internally
* PR controls **when** and **how** the merge happens

---

## 5. One-line Note

> **Merge is a Git action; Pull Request is a review process that manages that merge in teams.**
