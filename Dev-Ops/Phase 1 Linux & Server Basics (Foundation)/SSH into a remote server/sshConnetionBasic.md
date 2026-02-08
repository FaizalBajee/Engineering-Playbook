# Basics of Connecting to a Remote Server Using SSH

## 1. What is SSH?

SSH (Secure Shell) is a method used to **securely connect to a remote computer or server** over the internet. Once connected, you can run commands on the remote server as if you were using it directly.

---

## 2. What You Need Before Connecting

To connect to a remote server using SSH, you need the following three things:

1. **Server Address (IP or Domain)**

   * Example: `192.168.1.10`
   * Example: `example.com`

2. **Username**

   * Provided by the server or cloud service
   * Common examples: `ubuntu`, `ec2-user`, `root`

3. **Authentication Method**

   * **Password** (less common)
   * **SSH Key file (.pem or .key)** (most common)

---

## 3. Basic SSH Command (Password-based Login)

Open **Terminal** (Linux/macOS/WSL) or **PowerShell** (Windows) and run:

```
ssh username@server_ip
```

### Example:

```
ssh ubuntu@192.168.1.10
```

* Press **Enter**
* Enter the password (characters will not be visible)
* Press **Enter** again

You are now connected to the remote server.

---

## 4. Basic SSH Command (Key-based Login)

This is the most commonly used method, especially for cloud servers.

### Step 1: Set permission for the key file

```
chmod 400 mykey.pem
```

### Step 2: Connect using the key

```
ssh -i mykey.pem username@server_ip
```

### Example:

```
ssh -i mykey.pem ubuntu@192.168.1.10
```

---

## 5. First-Time Connection Message

When connecting for the first time, you may see:

```
Are you sure you want to continue connecting (yes/no)?
```

Type:

```
yes
```

This is normal and safe.

---

## 6. Verify the Connection

Once connected, you can verify by running:

```
whoami
pwd
```

If commands execute successfully, you are inside the remote server.

---

## 7. Exit from the SSH Session

To disconnect from the server:

```
exit
```

Or press:

```
Ctrl + D
```

---

## 8. Quick Reference

* Password login:

```
ssh username@server_ip
```

* Key-based login:

```
ssh -i key.pem username@server_ip
```

---

This document covers the basic and essential steps required to connect to a remote server using SSH.
