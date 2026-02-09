# Learn Basic Git Rebase

## 1. What is Git Rebase?

**Rebase** is a Git operation that moves your commits on top of another branch.

Instead of creating a merge commit, it **rewrites commit history** to make it look linear.

---

## 2. Simple Explanation

* **Merge** → joins branches and keeps history as-is
* **Rebase** → replays your commits on top of the latest base branch

Think of rebase as:

> “Put my work on top of the latest `main` branch.”

---

## 3. Why Rebase is Used

* Clean and linear commit history
* Easier to read project history
* Common in company PR workflows

---

## 4. Basic Rebase Example

### Scenario

You created a feature branch, but `main` has new commits.

### Step 1: Switch to feature branch

```
git checkout feature/login
```

### Step 2: Rebase onto main

```
git rebase main
```

👉 Your commits are replayed on top of the latest `main`.

---

## 5. Rebase vs Merge (Quick Comparison)

| Merge                  | Rebase                 |
| ---------------------- | ---------------------- |
| Keeps full history     | Rewrites history       |
| Creates merge commit   | No extra commit        |
| History looks branched | History looks straight |

---

## 6. Rebase Conflict Handling

If a conflict occurs:

1. Fix the conflict in the file
2. Mark as resolved

```
git add <file>
```

3. Continue rebase

```
git rebase --continue
```

To cancel rebase:

```
git rebase --abort
```

---

## 7. Important Rules (Very Important ⚠️)

* ❌ Do NOT rebase shared branches (like `main`)
* ✅ Rebase only your own feature branches
* ✅ Safe before creating a Pull Request

---

## 8. One-line DevOps Note

> **Git rebase rewrites commit history to keep it clean and linear by replaying commits on top of another branch.**
