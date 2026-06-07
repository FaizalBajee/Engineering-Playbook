# SSH Private Key Permission Error — Root Cause & Resolution Guide

## 1. Executive Summary

While attempting to connect to an EC2 instance using an SSH private key (`.pem`) on Windows, the connection failed due to insecure file permissions. OpenSSH rejected the key because it was accessible to users other than the owner. After partial remediation, the key became unreadable by the current user, resulting in a secondary permission error.

This document outlines the root cause, technical analysis, and production-grade resolution.

---

## 2. Error Observed

**Initial Error**

```
WARNING: UNPROTECTED PRIVATE KEY FILE!
Permissions for 'C:\EC2\IntechKey.pem' are too open.
This private key will be ignored.
Permission denied (publickey).
```

**After partial fix**

```
Load key "C:\\EC2\\IntechKey.pem": Permission denied
Permission denied (publickey).
```

---

## 3. Root Cause Analysis

### 3.1 Primary Cause

OpenSSH enforces strict security requirements:

* Private key must be readable **only by the owner**
* Must NOT be accessible by:

  * BUILTIN\Users
  * Everyone
  * Groups
  * Other users

Windows assigns broader ACL permissions by default, which caused:

> **UNPROTECTED PRIVATE KEY FILE**

---

### 3.2 Secondary Cause

During remediation, the following command was used in PowerShell:

```
icacls ... /grant:r "%USERNAME%:R"
```

**Issue:**

* `%USERNAME%` works in **CMD**
* PowerShell requires `$env:USERNAME`
* Result: no valid user permission was applied

This led to:

> **Load key: Permission denied**

Because the file became unreadable even by the owner.

---

## 4. Technical Deep Dive

### Expected Secure State

The `.pem` file must have:

* Inheritance: Disabled
* Owner: Current user
* Permissions: Read for owner only

Equivalent Linux permission model:

```
chmod 400 key.pem
```

Windows must emulate this via ACL.

---

## 5. Production-Grade Resolution

### Step 1 — Reset existing ACL

```powershell
icacls "C:\EC2\IntechKey.pem" /reset
```

---

### Step 2 — Disable inheritance

```powershell
icacls "C:\EC2\IntechKey.pem" /inheritance:r
```

---

### Step 3 — Grant read permission to current user

```powershell
icacls "C:\EC2\IntechKey.pem" /grant:r "$($env:USERNAME):(R)"
```

---

### Step 4 — Remove unsafe principals

```powershell
icacls "C:\EC2\IntechKey.pem" /remove "BUILTIN\Users"
icacls "C:\EC2\IntechKey.pem" /remove "Everyone"
```

---

### Step 5 — Verify permissions (mandatory)

```powershell
icacls "C:\EC2\IntechKey.pem"
```

**Expected output pattern**

```
<YourUsername>:(R)
```

No other users should appear.

---

### Step 6 — Retry SSH

```powershell
ssh -i "C:\EC2\IntechKey.pem" ubuntu@3.107.253.64
```

---

## 6. Validation Checklist

Before declaring success:

* [ ] Inheritance disabled
* [ ] Only current user has access
* [ ] Permission level is Read
* [ ] SSH connects successfully
* [ ] No OpenSSH warnings

---

## 7. Common Pitfalls (Seen in Production)

### ❌ Using CMD syntax in PowerShell

Wrong:

```
%USERNAME%
```

Correct:

```
$env:USERNAME
```

---

### ❌ Using wildcard CORS mindset with SSH

Many developers assume Windows behaves like Linux chmod. It does not — Windows ACL must be explicitly corrected.

---

### ❌ Forgetting to remove BUILTIN groups

Even if your user has permission, presence of:

* BUILTIN\Users
* Everyone

will cause OpenSSH rejection.

---

## 8. Security Considerations

This OpenSSH behavior is intentional and critical because:

* Prevents private key leakage
* Blocks lateral privilege movement
* Enforces least-privilege principle
* Aligns with CIS hardening standards

Never bypass this check in production.

---

## 9. Recommended Best Practices

### Development

* Store keys outside project repo
* Never commit `.pem` files
* Use dedicated `C:\EC2\` or `~/.ssh/` folder

### Production

* Rotate keys periodically
* Use IAM + SSM Session Manager when possible
* Restrict file ACL immediately after download
* Prefer WSL/OpenSSH standard location for teams

---

## 10. Conclusion

The SSH failure was caused by improper Windows ACL handling of the private key file. After correcting inheritance and granting exclusive read access to the current user using proper PowerShell syntax, the issue is resolved in a production-compliant manner.

---

**Document Version:** 1.0

