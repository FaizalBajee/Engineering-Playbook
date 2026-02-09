# How to Use .gitignore Properly

## 1. What is .gitignore?

`.gitignore` is a file that tells Git **which files or folders NOT to track**.

It helps you avoid committing:

* Build files
* Dependency folders
* Environment secrets
* OS or editor-generated files

---

## 2. Why .gitignore is Important (Real-World)

Without `.gitignore`:

* Your repo becomes messy
* Secrets may leak (API keys, env files)
* CI/CD builds become slower

With `.gitignore`:

* Clean repository
* Secure codebase
* Professional workflow

---

## 3. Where to Create .gitignore

* Create `.gitignore` in the **root of your project**
* File name must be exactly `.gitignore`

Example:

```
my-project/
├── .gitignore
├── src/
├── package.json
└── node_modules/
```

---

## 4. Basic .gitignore Rules

### Ignore a file

```
.env
```

### Ignore a folder

```
node_modules/
dist/
build/
```

### Ignore file type

```
*.log
*.tmp
```

### Ignore files in any folder

```
**/.env
```

---

## 5. Common .gitignore for Node / MERN Projects

```
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment variables
.env
.env.local

# Logs
npm-debug.log*
yarn-debug.log*

# OS files
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/
```

---

## 6. Very Important Rule ⚠️

> `.gitignore` does NOT work on files already tracked by Git.

If you already committed a file:

```
git rm --cached <file>
```

Then commit again:

```
git commit -m "Remove tracked file and apply gitignore"
```

---

## 7. Check What Git is Ignoring

```
git status
```

To test ignore rules:

```
git check-ignore -v <file>
```

---

## 8. Best Practices (Company Level)

* Always add `.gitignore` **before first commit**
* Never commit `.env` or secrets
* Use standard templates (GitHub gitignore repo)
* Keep `.gitignore` updated as project grows

---

## 9. One-line DevOps Note

> **.gitignore keeps repositories clean and secure by preventing unnecessary or sensitive files from being tracked by Git.**
