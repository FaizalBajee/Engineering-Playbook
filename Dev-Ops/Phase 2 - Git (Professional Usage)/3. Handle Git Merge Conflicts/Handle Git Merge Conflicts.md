# Handle Git Merge Conflicts

## 1. What is a Merge Conflict?

A **merge conflict** happens when Git cannot automatically combine changes from two branches.

This usually occurs when:

* The same file is edited in both branches
* The same lines are modified differently

---

## 2. When Conflicts Commonly Occur (Real-World)

* Two developers edit the same file
* Feature branch is old and `main` has new changes
* Rebase or merge after long development

---

## 3. Example Scenario (Using git pull)

### Situation

You have **already committed your changes** in a feature branch.

Meanwhile, other developers have pushed new commits to the `main` branch.

Before raising a Pull Request, you **pull the latest `main` code** to sync your branch.

Two branches modify the same file (`app.txt`) differently.

In company workflows, conflicts usually appear when you **pull latest changes from `main` after your commit**.

When you run:

```
git pull origin main
```

Git internally does a **fetch + merge**.

If changes clash, Git shows:

```
CONFLICT (content): Merge conflict in app.txt
```

---

## 4. Understanding Conflict Markers

Inside the conflicted file:

```
<<<<<<< HEAD
Code from current branch
=======
Code from incoming branch
>>>>>>> feature-branch
```

* `HEAD` → your current branch
* Bottom part → branch being merged

---

## 5. How to Resolve a Merge Conflict (Step-by-Step)

### Step 1: Open the conflicted file

Decide which code to keep:

* Current branch
* Incoming branch
* Or both

### Step 2: Edit the file

Remove the conflict markers and keep correct code.

### Step 3: Mark as resolved

```
git add <file>
```

### Step 4: Complete the merge

```
git commit -m "Resolve merge conflict"
```

---

## 6. Git Cherry-Pick (Important Concept)

**Cherry-pick** is used to apply a **specific commit** from one branch into another branch.

Instead of merging the whole branch, you pick only the required commit.

### When Cherry-Pick is Used

* Hotfix needs to go into `main` quickly
* One specific commit is needed from another branch
* Avoid merging unnecessary changes

### Basic Cherry-Pick Example

```
git checkout main
git cherry-pick <commit-hash>
```

### Cherry-Pick and Conflicts

If a conflict occurs during cherry-pick:

1. Fix the conflict manually
2. Mark as resolved

```
git add <file>
```

3. Continue cherry-pick

```
git cherry-pick --continue
```

To cancel cherry-pick:

```
git cherry-pick --abort
```

---

## 7. Useful Commands During Conflicts

```
git status
```

Shows conflicted files

```
git diff
```

Shows conflict differences

---

## 8. Best Practices to Avoid Conflicts

* Pull latest `main` frequently
* Keep feature branches short-lived
* Rebase before creating PR
* Communicate with teammates

---

## 9. One-line DevOps Note

> **Merge conflicts occur when Git cannot auto-merge changes and require manual resolution by the developer.**
