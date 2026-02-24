**Running a Node.js Backend Using PM2**
=======================================

_(Production Deployment Guide – Senior DevOps Standard)_

**1\. High-Level Overview**
===========================

**1.1 What is PM2?**
--------------------

**PM2** is a **production-grade process manager for Node.js applications**.

It ensures:

*   Your backend stays alive
    
*   Automatic restart on crash
    
*   Restart after server reboot
    
*   Log management
    
*   Zero-downtime reloads
    

**1.2 Why Do We Use PM2?**
--------------------------

### **Problem Without PM2**

If you run your backend like this:

node app.js

Issues:

*   If SSH session closes → app stops
    
*   If app crashes → it stays down
    
*   If server reboots → app does not start
    
*   No structured logging
    
*   No process monitoring
    

This is **not production ready**.

### **Solution With PM2**

PM2 acts as a **process supervisor** between:

*   Operating System
    
*   Your Node.js Application
    

It continuously monitors your backend and guarantees uptime.

**2\. Real-World Analogy**
==========================

Think of:

*   Node.js → Employee
    
*   Linux OS → Office
    
*   PM2 → Manager
    

If the employee falls asleep (crashes),the manager (PM2) wakes him up immediately.

If the office reopens (server reboot),the manager ensures employees resume work.

**3\. Installation of PM2**
===========================

(If not installed already)

sudo npm install -g pm2

Verify:

pm2 -v

**4\. Running Backend Using PM2**
=================================

Assume your backend file is:

app.js

Located inside:

/home/ubuntu/my-backend

**Step 1: Navigate to Project Directory**
-----------------------------------------

cd /home/ubuntu/my-backend

**Step 2: Start Application with PM2**
--------------------------------------

pm2 start app.js --name backend-api

Explanation:

*   app.js → entry file
    
*   \--name → custom process name (important for management)
    

**Step 3: Verify Running Process**
----------------------------------

pm2 list

You should see:

backend-api  online

**5\. Enable Auto-Start on Server Reboot (VERY IMPORTANT)**
===========================================================

Without this step, app will not start after EC2 restart.

Run:

pm2 startup

It will output a command like:

sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

Copy and run that command.

Then save current process list:

pm2 save

Check Detailed Status

pm2 show auth-server

Now your backend will automatically start when EC2 reboots.

**6\. Essential PM2 Commands (Operations)**
===========================================

### **Check Running Apps**

pm2 list

### **View Logs**

pm2 logs

### **Restart App**

pm2 restart backend-api

### **Stop App**

pm2 stop backend-api

### **Delete App from PM2**

pm2 delete backend-api

**7\. Running in Cluster Mode (Production Scaling)**
====================================================

If your EC2 has multiple CPU cores:

pm2 start app.js -i max --name backend-api

What this does:

*   Creates one instance per CPU core
    
*   Improves performance
    
*   Enables load balancing internally
    

Best for production APIs.

**8\. Monitoring with PM2**
===========================

Run:

pm2 monit

You can monitor:

*   CPU usage
    
*   Memory usage
    
*   Restart count
    
*   Uptime
    

**9\. Log Management**
======================

PM2 automatically stores logs in:

~/.pm2/logs/

Separate logs:

*   stdout
    
*   stderr
    

To clear logs:

pm2 flush

**10\. Best Practices (Senior DevOps Recommendations)**
=======================================================

### **1️⃣ Never run app as root**

Use ubuntu user.

### **2️⃣ Use Environment Variables**

Instead of hardcoding:

PORT=3000 NODE\_ENV=production pm2 start app.js

Or use .env file.

### **3️⃣ Use Ecosystem File (Advanced Setup)**

Create:

ecosystem.config.js

Example:

module.exports = {

  apps: \[{

    name: "backend-api",

    script: "app.js",

    instances: "max",

    exec\_mode: "cluster",

    env: {

      NODE\_ENV: "production",

      PORT: 3000

    }

  }\]

}

Start using:

pm2 start ecosystem.config.js

This is the **recommended production approach**.

**11\. Production Deployment Flow (Ideal Practice)**
====================================================

When updating code:

git pull

npm install

pm2 restart backend-api

For zero-downtime reload:

pm2 reload backend-api

**12\. Common Mistakes to Avoid**
=================================

❌ Running node app.js directly❌ Forgetting pm2 save❌ Not enabling pm2 startup❌ Ignoring logs❌ Not monitoring memory leaks

**13\. Final Production Checklist**
===================================

**Item**                    **Status**

App started with PM2            ✔

Custom name given               ✔

Auto-start enabled              ✔

Process saved                   ✔

Logs monitored                  ✔

Cluster mode (if needed)        ✔



**Final Summary**
=================

PM2 is:

*   A production process manager
    
*   A crash recovery system
    
*   A startup automation tool
    
*   A monitoring utility
    
*   A scaling helper
    

For any serious backend deployment on **Amazon EC2**, running Node.js without PM2 is considered **non-production-grade**.