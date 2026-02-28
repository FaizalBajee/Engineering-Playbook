Below is a **production-grade, senior DevOps documentation** strictly focused on:

**Build & Serve React Frontend on EC2**
=======================================

_(Best Practice Deployment Guide)_

**1\. Objective**
=================

To deploy a React application in a **production-ready, scalable, and secure manner** on an EC2 instance by:

*   Creating an optimized production build
    
*   Serving static assets using a high-performance web server
    
*   Configuring proper routing support
    
*   Ensuring maintainability and operational stability
    

**2\. Deployment Architecture (Best Practice)**
===============================================

Client Browser

      |

      | HTTP / HTTPS

      v

Nginx (Static File Server)

      |

      v

React Production Build (Optimized Static Files)

React is a static frontend after build. It does NOT require Node.js runtime in production.

**3\. Core Principle**
======================

### **❌ Do NOT use:**

npm start

Reason:

*   Development server only
    
*   Not optimized
    
*   No compression
    
*   No security hardening
    
*   Not suitable for public traffic
    

### **✅ Correct Approach:**

1.  Build static production files
    
2.  Serve using **Nginx**
    

**4\. Step 1 – Build React Application**
========================================

**4.1 Navigate to Project Directory**
-------------------------------------

cd /home/ubuntu/react-frontend

**4.2 Install Dependencies**
----------------------------

npm install

**4.3 Create Production Build**
-------------------------------

npm run build

**This generates:**

Create React App → build/

Vite (or similar modern bundlers) → dist/

### **What the Build Contains:**

*   Minified JavaScript
    
*   Optimized CSS
    
*   Static assets
    
*   index.html
    
*   Hashed filenames (cache optimization)
    

This is the only folder required for deployment.

**5\. Step 2 – Install Nginx**
==============================

**5.1 Install**
---------------

sudo apt update

sudo apt install nginx -y

**5.2 Start & Enable Service**
------------------------------

sudo systemctl start nginx

sudo systemctl enable nginx

**5.3 Verify Status**
---------------------

sudo systemctl status nginx

Status must show:

Active: active (running)

**6\. Step 3 – Deploy React Build to Web Directory**
====================================================

**6.1 Remove Default Web Root Content**
---------------------------------------

Clean the existing web directory before deployment to avoid serving stale or conflicting assets.

sudo rm -rf /var/www/html/\*

⚠️ Always verify you are targeting the correct directory before running destructive commands in production environments.

**6.2 Copy Production Build Artifacts**
---------------------------------------

Copy only the generated production bundle:

*   If using **Create React App** → build/
    
*   If using **Vite** (or similar bundlers) → dist/
    

### **For Create React App:**

sudo cp -r build/\* /var/www/html/

### **For Vite / Modern Bundlers:**

sudo cp -r dist/\* /var/www/html/

Only the compiled output directory should be deployed. Do NOT copy source code, configuration files, or node\_modules.

**6.3 Apply Proper Ownership and Permissions**
----------------------------------------------

Ensure the web server user (www-data) owns the deployed files and that permissions are restrictive but functional.

sudo chown -R www-data:www-data /var/www/html

sudo chmod -R 755 /var/www/html

### **Why This Matters**

*   Prevents permission-related 403 errors
    
*   Ensures Nginx can read static assets
    
*   Avoids insecure world-writable configurations
    
*   Maintains predictable operational behavior
    

**7\. Step 4 – Configure Nginx for React Routing**
==================================================

React uses **client-side routing**.

Without configuration, refreshing any route (e.g. /dashboard) will cause 404 errors.

**7.1 Edit Nginx Configuration**
--------------------------------

sudo nano /etc/nginx/sites-available/default

s

**✅ What you need to change (exact steps)**
===========================================

**Step 1 — Find THIS block**
----------------------------

Inside the server {} block locate:

location / {

    try\_files $uri $uri/ =404;

}

**Step 2 — Replace it (IMPORTANT)**
-----------------------------------

### **🔥 Replace WITH:**

location / {

    try\_files $uri /index.html;

}

**✅ Your final minimal production server block should look like**
-----------------------------------------------------------------

server {

    listen 80 default\_server;

    listen \[::\]:80 default\_server;

    root /var/www/html;

    index index.html;

    server\_name \_;

    location / {

        try\_files $uri /index.html;

    }

}

—-------------------------------------------------------------

**Save and Exit (Nano)**
------------------------

Save file:

Ctrl + O

Enter

Exit:

Ctrl + X

**🚨 Why this change is mandatory**
===================================

**Before (your current behavior)**
----------------------------------

Request:

/dashboard

Nginx tries:

/var/www/html/dashboard

Result:

❌ File not found ❌ 404 returned ❌ React never loads

**After fix (correct SPA behavior)**
------------------------------------

Request:

/dashboard

Nginx flow:

1.  Try file
    
2.  Not found
    
3.  Serve /index.html
    
4.  React Router handles route ✅
    

This is the industry standard SPA pattern.

**7.2 Test Configuration**
--------------------------

sudo nginx -t

You must see:

syntax is ok

test is successful

**7.3 Reload Nginx**
--------------------

sudo systemctl reload nginx

**8\. Validation**
==================

Open browser:

http://EC2\_PUBLIC\_IP

Expected:

*   React application loads
    
*   Routing works on refresh
    
*   Static assets load correctly
    

**9\. Deployment Update Procedure (Professional Workflow)**
===========================================================

When updating frontend:

git pull

npm install

npm run build

sudo rm -rf /var/www/html/\*

sudo cp -r build/\* /var/www/html/

sudo systemctl reload nginx

No downtime occurs during reload.

**10\. Production Best Practices**
==================================

### **10.1 Security**

*   Do not expose development server
    
*   Disable directory listing
    
*   Use HTTPS in production
    
*   Restrict server access via Security Groups
    

### **10.2 Performance**

*   Enable gzip in Nginx
    
*   Use hashed filenames (default in React build)
    
*   Configure browser caching headers
    

### **10.3 Operational Stability**

*   Monitor Nginx logs:
    

sudo tail -f /var/log/nginx/access.log

sudo tail -f /var/log/nginx/error.log

**11\. Common Mistakes to Avoid**
=================================

❌ Running npm start in production❌ Serving directly with serve -s build❌ Forgetting React routing configuration❌ Not setting correct permissions❌ Not reloading Nginx after changes

**12\. Final Production Checklist**
===================================

**Task**                            **Completed**

Dependencies installed                      ✔

Production build created                    ✔

Nginx installed                             ✔

Build deployed to /var/www/html             ✔

Routing configured                          ✔

Nginx reloaded                              ✔

**Final Summary**
=================

A React frontend in production:

*   Is a static optimized build
    
*   Is served by **Nginx**
    
*   Does NOT require Node.js runtime
    
*   Requires proper routing configuration
    
*   Should follow secure deployment practices
    

**Why use Nginx?**
------------------

Nginx serves the React production build in a:

*   Fast
    
*   Secure
    
*   Scalable
    

manner suitable for production workloads.

—------------------------------------------------------------------------------------------------------------------------

**Why copy build files to /var/www/html?**
------------------------------------------

Because Nginx serves files from its **web root**, and on Ubuntu the default web root is:

/var/www/html