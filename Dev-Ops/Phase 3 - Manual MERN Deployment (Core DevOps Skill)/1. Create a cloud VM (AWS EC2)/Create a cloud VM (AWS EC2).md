# Creating an AWS EC2 Instance (Senior DevOps Engineer Guide)

This document explains **each and every section** involved in creating an EC2 instance, with **real-world reasoning**, not just clicks.

---

## 1. What is EC2?

**EC2 (Elastic Compute Cloud)** is a virtual server in AWS that lets you run applications on the cloud.

Think of it as:

> A remote Linux/Windows machine that you fully control.

Used for:

* Hosting backend APIs
* Running applications
* CI/CD runners
* Databases (small setups)
* Dev/Test environments

---

## 2. Before Creating an EC2 Instance

You need:

* AWS Account
* Basic Linux knowledge
* SSH client (Terminal / Git Bash / MobaXterm)

---

## 3. Start EC2 Creation

AWS Console → **EC2** → **Launch Instance**

You will see multiple sections. Each one matters.

---

## 4. Name and Tags

### Instance Name

Example:

```
mern-backend-dev
```

**Why it matters**

* Helps identify servers
* Very important in companies with 100+ instances

### Tags

Common tag keys:

* `Name`
* `Environment` (dev / staging / prod)
* `Owner`

> Senior tip: Tags help with **billing, monitoring, and automation**.

---

## 5. Application and OS Image (AMI)

### AMI (Amazon Machine Image)

This defines:

* Operating system
* Pre-installed software

### Common Choices

* **Amazon Linux 2** (most common, AWS-optimized)
* Ubuntu 20.04 / 22.04 (developer-friendly)

**Recommendation**

* DevOps & backend → Ubuntu
* AWS-native workloads → Amazon Linux

---

## 6. Instance Type (CPU & RAM)

This defines server power.

### Common Types

* `t2.micro` / `t3.micro` → Free tier (1 vCPU, 1 GB RAM)
* `t3.small` → Light production
* `m5` → General purpose
* `c5` → CPU intensive

**Senior advice**

> Start small → monitor → scale later.

---

## 7. Key Pair (Login Security)

### What is a Key Pair?

* Used to SSH into the server
* Replaces password login

### Options

* Create new key pair
* Use existing key pair

**Download once** ⚠️

* If lost, AWS cannot recover it

File:

```
mykey.pem
```

---

## 8. Network Settings (Very Important)

Network settings decide **who can access your EC2 and how**. Most production issues and security breaches come from wrong network configuration.

---

### 8.1 VPC (Virtual Private Cloud)

A **VPC** is your private network inside AWS.

Think of it as:

> Your own data center network in the cloud.

Options:

* **Default VPC** → Best for beginners
* Custom VPC → Used in companies (separate public/private networks)

**Senior advice**

* Use Default VPC while learning
* In real projects, teams use custom VPCs for isolation

---

### 8.2 Subnet

A **subnet** is a smaller network inside a VPC.

Types:

* **Public Subnet** → Has internet access
* **Private Subnet** → No direct internet access

For EC2 with public access:

* Choose a **public subnet**

**Why this matters**

* Public subnet → Bastion, web servers
* Private subnet → Databases, internal services

---

### 8.3 Auto-Assign Public IP

This gives your EC2 a **public IP address**.

Settings:

* Enable → Internet accessible
* Disable → Private network only

**Recommendation**

* Enable for dev/testing
* Disable for production + use Load Balancer

---

### 8.4 Security Group (Firewall Rules)

A **Security Group** is a virtual firewall for EC2.

It controls:

* Inbound traffic (who can enter)
* Outbound traffic (who can leave)

#### Common Inbound Rules

| Rule  | Port | Source      | Purpose       |
| ----- | ---- | ----------- | ------------- |
| SSH   | 22   | Your IP     | Secure login  |
| HTTP  | 80   | 0.0.0.0/0   | Web traffic   |
| HTTPS | 443  | 0.0.0.0/0   | Secure web    |
| App   | 3000 | Specific IP | Node/MERN app |

**Critical Security Rules**

* ❌ Never expose SSH to `0.0.0.0/0` in production
* ✅ Restrict SSH to your office or VPN IP
* ✅ Open only required ports

---

### 8.5 Inbound vs Outbound (Important Concept)

* **Inbound rules** → Incoming traffic to EC2
* **Outbound rules** → EC2 accessing outside world

By default:

* All outbound traffic is allowed
* This is usually fine

---

### 8.6 Real Company Network Setup (High Level)

Typical production architecture:

* Internet → Load Balancer
* Load Balancer → EC2 (private subnet)
* EC2 → Database (private subnet)

This ensures:

* EC2 is not directly exposed
* Better security
* Easier scaling

---

### 8.7 Common Beginner Mistakes

* Opening all ports (0–65535)
* Allowing SSH from anywhere
* Not understanding public vs private subnet
* Forgetting to add app port

----|----|----|
| SSH | 22 | Login |
| HTTP | 80 | Web traffic |
| HTTPS | 443 | Secure web |
| Custom | 3000 | Node.js app |

**Best Practice**

* Never open SSH to `0.0.0.0/0` in production

---

## 9. Configure Storage

### Root Volume

* Default: 8 GB
* Can increase anytime

### Storage Type

* gp3 (recommended)

**Tip**

* Logs and builds consume space faster than expected

---

## 10. Advanced Details (Often Ignored)

### User Data (Bootstrap Script)

Runs at first boot.

Example:

```
#!/bin/bash
apt update -y
apt install docker.io -y
```

Used for:

* Installing Docker
* Setting up app automatically

### IAM Role

* Allows EC2 to access AWS services securely
* Example: S3 access without keys

---

## 11. Review and Launch

Before clicking **Launch Instance**, review:

* AMI
* Instance type
* Security group rules
* Key pair selected

Then launch 🎉

---

## 12. Connect to EC2 (Linux)

```bash
chmod 400 mykey.pem
ssh -i mykey.pem ubuntu@<public-ip>
```

If Amazon Linux:

```
ssh -i mykey.pem ec2-user@<public-ip>
```

---

## 13. Common Beginner Mistakes

* Forgetting to allow port in security group
* Losing PEM file
* Using root user for everything
* Running production workloads on free-tier

---

## 14. Senior DevOps Best Practices

* Use IAM roles instead of access keys
* Separate dev / staging / prod instances
* Automate using Terraform or CloudFormation
* Monitor with CloudWatch
* Shut down unused instances (cost control)

---

## 15. One-line DevOps Summary

> **An EC2 instance is a configurable cloud server where correct sizing, networking, and security decisions matter more than just launching it.**

---
