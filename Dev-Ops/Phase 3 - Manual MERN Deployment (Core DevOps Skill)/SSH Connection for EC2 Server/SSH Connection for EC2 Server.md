# Connecting to an AWS EC2 Instance Using SSH

## Table of Contents
- [Prerequisites](#prerequisites)
- [Step-by-Step Guide](#step-by-step-guide)
- [Common Mistakes to Avoid](#common-mistakes-to-avoid)
- [Key Takeaway](#key-takeaway)

## Prerequisites

Before proceeding, ensure you have the following:

- ✅ EC2 instance is running
- ✅ Private key file used during instance launch (e.g., `faizKey.pem`)
- ✅ Port 22 (SSH) is allowed in the EC2 Security Group
- ✅ Public IP address or Public DNS of your instance
- ✅ Correct username for your AMI (e.g., `ubuntu` for Ubuntu AMI)

## Step-by-Step Guide

### Step 1: Locate the Private Key

Ensure the `.pem` file exists on your local machine.

**Example (Windows):**
```
C:\Users\FAIZAL\Downloads\faizKey.pem
```

### Step 2: Fix Key Permissions (Mandatory)

SSH will reject insecure keys. You must set proper permissions on your private key file.

**On Linux / WSL / Git Bash:**
```bash
chmod 400 faizKey.pem
```

**Why this is important:**
- `400` = read-only for owner
- Prevents others from accessing your private key
- SSH refuses keys that are publicly accessible

### Step 3: First SSH Attempt (Without Key – Expected to Fail)

```bash
ssh ubuntu@3.104.104.24
```

**What happens:**
- You receive a host authenticity prompt (expected on first connection)
- After typing `yes`, the host is added to `known_hosts`
- Connection fails with: `Permission denied (publickey)`

**Reason:**
- You didn't provide the private key using the `-i` option

### Step 4: Correct SSH Command (Success)

```bash
ssh -i "C:\Users\FAIZAL\Downloads\faizKey.pem" ubuntu@3.104.104.24
```

**Result:**
- ✅ SSH client authenticates using your private key
- ✅ Server accepts the key
- ✅ Login successful

### Step 5: First-Time Connection Message Explanation

```
Are you sure you want to continue connecting (yes/no)?
```

This prompt appears only when:
- You connect to a host for the first time
- The server is not already in your `known_hosts` file

After typing `yes`, SSH remembers the server fingerprint. You won't see this prompt again unless:
- The server's IP address changes
- The server is rebuilt
- The `known_hosts` entry is manually removed

## Common Mistakes to Avoid

| Mistake | Issue |
|---------|-------|
| ❌ Using `ssh ubuntu@IP` without `-i key.pem` | No key provided for authentication |
| ❌ Wrong username (e.g., `ec2-user` vs `ubuntu`) | Authentication fails |
| ❌ Incorrect file path to `.pem` file | Key file not found |
| ❌ Incorrect permissions on key file | SSH refuses to use the key |
| ❌ Port 22 blocked in Security Group | Cannot establish connection |

## Key Takeaway

**If you get "Permission denied (publickey)" — you either:**
1. Forgot to include the key (`-i` option)
2. Used the wrong key file
3. Used the wrong username