# Basic Linux Commands – What is What

## File and Directory Commands

### ls

Lists files and folders in the current directory.

### cd

Changes the current directory (moves into another folder).

### cp

Copies files or folders.

### mv

Moves files or folders, or renames them.

### rm

Deletes files or folders permanently.

---

# Process Commands – What is What

### ps

Shows currently running processes.

### top

Displays running processes in real time along with CPU and memory usage.

### kill

Stops (terminates) a running process using its Process ID (PID).

---

# File Permissions – What is What

### chmod

Changes file or directory permissions (read, write, execute).

### chown

Changes the owner and group of a file or directory.

---

# Real-Time Example: File Permissions

A developer deploys an application on a Linux server, but the application fails because it cannot read or execute a required file.

### Common Problems and Fixes

* The script does not have execute permission → fixed using **chmod**
* The file is owned by the wrong user → fixed using **chown**

### Example Commands Used

```
chmod +x start.sh
```

Allows the script to run by adding execute permission.

```
chown appuser:appgroup start.sh
```

Assigns correct user and group ownership to the file.

**Note:**
File permission issues are very common during deployments and initial server setup.

---

# One-Line DevOps Notes (File Permissions)

* **chmod** → Used when an application fails due to missing read, write, or execute permissions.
* **chown** → Used when a file is owned by the wrong user or group during deployment.
* **chmod +x script.sh** → Fixes “permission denied” errors while running scripts.
* **chown user:group file** → Fixes access issues caused by incorrect ownership.
* **Permission issues** → A very common cause of deployment and runtime failures on Linux servers.
