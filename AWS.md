# AWS EC2 Deployment Guide - Kitchen Hearth

This guide outlines step-by-step instructions to deploy the **Kitchen Hearth** application (React Frontend + Node.js/Express Backend) to an **AWS EC2** instance using **Nginx** and **PM2**.

---

## 📋 Table of Contents
1. [Prerequisites & AWS Setup](#1-prerequisites--aws-setup)
2. [Codebase Modifications Required](#2-codebase-modifications-required)
3. [EC2 Server Configuration](#3-ec2-server-configuration)
4. [Backend Deployment](#4-backend-deployment)
5. [Frontend Deployment](#5-frontend-deployment)
6. [Nginx Reverse Proxy Setup](#6-nginx-reverse-proxy-setup)
7. [SSL Certificate (HTTPS) Setup](#7-ssl-certificate-https-setup)
8. [Maintenance & PM2 Commands](#8-maintenance--pm2-commands)

---

## 1. Prerequisites & AWS Setup

### Step 1: Launch an AWS EC2 Instance
- **OS:** Ubuntu 22.04 LTS or 24.04 LTS.
- **Instance Type:** `t2.micro` or `t3.micro` (Free Tier eligible).
- **Key Pair:** Create and download a `.pem` key pair (e.g. `kitchen-hearth-key.pem`).

### Step 2: Configure Security Group Rules
In AWS Console -> EC2 -> Security Groups, edit **Inbound Rules**:

| Type | Protocol | Port Range | Source | Purpose |
|---|---|---|---|---|
| **SSH** | TCP | 22 | My IP | Secure SSH Terminal Access |
| **HTTP** | TCP | 80 | `0.0.0.0/0` | Public Web Traffic |
| **HTTPS** | TCP | 443 | `0.0.0.0/0` | Secure SSL Web Traffic |
| **Custom TCP** | TCP | 5000 | My IP | (Optional) Direct backend API testing |

---

## 2. Codebase Modifications Required

Before deploying, make sure the project handles environment-based API URLs:

1. **Frontend API URL Dynamic Endpoint:**
   - In `Frontend/src/` (Axios / API configuration), ensure backend calls use `import.meta.env.VITE_API_URL` instead of hardcoded `http://localhost:5000`.
2. **Backend CORS Setup:**
   - In `backend/src/app.js`, ensure `cors()` allows your EC2 Domain / IP or origins defined in process env (`process.env.CLIENT_ORIGIN`).

---

## 3. EC2 Server Configuration

Connect to your EC2 instance via SSH:
```bash
chmod 400 kitchen-hearth-key.pem
ssh -i "kitchen-hearth-key.pem" ubuntu@<YOUR-EC2-PUBLIC-IP>
```

Update system dependencies and install Node.js, Git, Nginx, and PM2:
```bash
# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js (v22 LTS)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# 3. Verify Node and npm
node -v
npm -v

# 4. Install PM2 globally
sudo npm install -g pm2
```

---

## 4. Backend Deployment

### Step 1: Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/YourUsername/AI-Recipe-Generater.git kitchen-hearth
sudo chown -R ubuntu:ubuntu /var/www/kitchen-hearth
cd /var/www/kitchen-hearth/backend
```

### Step 2: Install Dependencies & Environment Variables
```bash
npm install --production
nano .env
```
Paste your production variables into `.env`:
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/kitchen_hearth
JWT_SECRET=your_super_secret_jwt_key
OPENAI_API_KEY=your_openai_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Step 3: Start Backend with PM2
```bash
pm2 start server.js --name "kitchen-hearth-backend"
pm2 save
sudo pm2 startup
```

---

## 5. Frontend Deployment

### Step 1: Build Frontend for Production
```bash
cd /var/www/kitchen-hearth/Frontend

# Create production env
nano .env.production
```
Inside `.env.production`:
```env
VITE_API_URL=https://yourdomain.com/api/v1
```

Install and build:
```bash
npm install
npm run build
```
*The build output will be generated at `/var/www/kitchen-hearth/Frontend/dist`.*

---

## 6. Nginx Reverse Proxy Setup

Nginx will serve the built static React frontend and route API requests directly to Node.js backend running on port 5000.

### Step 1: Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/kitchen-hearth
```

Paste the following configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com; # Or your EC2 Public IP

    # Serve Frontend Static Files
    location / {
        root /var/www/kitchen-hearth/Frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy Backend API Requests
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Step 2: Enable Site and Restart Nginx
```bash
sudo ln -s /etc/nginx/sites-available/kitchen-hearth /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

## 7. SSL Certificate (HTTPS) Setup

Using **Certbot** for free SSL certificates from Let's Encrypt:
```bash
sudo apt install snapd
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Request certificate (Domain required)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 8. Maintenance & PM2 Commands

- **Check backend status:** `pm2 status`
- **View backend logs:** `pm2 logs kitchen-hearth-backend`
- **Restart backend:** `pm2 restart kitchen-hearth-backend`
- **Restart Nginx:** `sudo systemctl restart nginx`
