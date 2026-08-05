# AWS EC2 Docker-Based Deployment Guide - Kitchen Hearth Backend

This guide details the step-by-step instructions to deploy and automate the **Kitchen Hearth** Node.js backend using **Docker**, **Docker Compose**, and **GitHub Actions** on an **AWS EC2** instance.

---

## 📋 Table of Contents
1. [Prerequisites & AWS Setup](#1-prerequisites--aws-setup)
2. [One-Time EC2 Server Configuration](#2-one-time-ec2-server-configuration)
3. [EC2 Environment Configuration](#3-ec2-environment-configuration)
4. [GitHub CI/CD Automation Setup](#4-github-cicd-automation-setup)
5. [Nginx Reverse Proxy Configuration](#5-nginx-reverse-proxy-configuration)
6. [SSL (HTTPS) Setup with Certbot](#6-ssl-https-setup-with-certbot)
7. [Maintenance & Useful Commands](#7-maintenance--useful-commands)

---

## 1. Prerequisites & AWS Setup

### Launch an EC2 Instance
- **OS:** Ubuntu 22.04 LTS or 24.04 LTS.
- **Instance Type:** `t2.micro` or `t3.micro` (Free Tier eligible).
- **Key Pair:** Create and download a `.pem` key pair (e.g. `kitchen-hearth-key.pem`).

### Configure Security Groups
In the AWS Console under EC2 -> Security Groups -> Edit Inbound Rules:

| Type | Protocol | Port Range | Source | Purpose |
|---|---|---|---|---|
| **SSH** | TCP | 22 | My IP / Anywhere | Secure Terminal Access |
| **HTTP** | TCP | 80 | `0.0.0.0/0` | Public Web Traffic |
| **HTTPS** | TCP | 443 | `0.0.0.0/0` | Secure SSL Web Traffic |

---

## 2. One-Time EC2 Server Configuration

Connect to your EC2 instance via SSH:
```bash
chmod 400 kitchen-hearth-key.pem
ssh -i "kitchen-hearth-key.pem" ubuntu@<YOUR-EC2-PUBLIC-IP>
```

Once connected, run the following commands to install **Docker**, **Docker Compose**, and **Nginx**:

```bash
# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
sudo apt install -y docker.io
sudo systemctl enable --now docker

# 3. Add ubuntu user to docker group (removes need to type sudo for docker commands)
sudo usermod -aG docker ubuntu
newgrp docker

# 4. Install Nginx
sudo apt install -y nginx
```

---

## 3. EC2 Environment Configuration

Create the deployment directory and configure your production environment variables:

```bash
# 1. Create target app directory
mkdir -p ~/kitchen-hearth
cd ~/kitchen-hearth

# 2. Create the production environment file
nano .env
```

Paste your production secrets:
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/kitchen_hearth
JWT_SECRET=your_super_secret_jwt_key
OPENROUTER_API_KEY=your_openrouter_api_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```
*Press `CTRL+O`, `Enter`, and then `CTRL+X` to save and exit.*

---

## 4. GitHub CI/CD Automation Setup

The repository contains a GitHub Actions workflow that:
1. Builds a secure, lightweight Docker image on push to `main`.
2. Publishes it privately to **GitHub Container Registry (GHCR)**.
3. SSHes into your EC2 instance to pull and deploy the container.

### Step 1: Configure Repository Secrets
On GitHub, go to your repository -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**:

1. **`EC2_HOST`**: The Public IP address of your EC2 instance.
2. **`EC2_SSH_KEY`**: The complete contents of your `kitchen-hearth-key.pem` private key file.

### Step 2: Trigger Deployment
Commit and push the new configurations to your `main` branch:
```bash
git add .
git commit -m "chore: setup Dockerization and GitHub Actions deploy"
git push origin main
```
Track progress in the **Actions** tab of your GitHub repository.

---

## 5. Nginx Reverse Proxy Configuration

Nginx will accept incoming traffic on port 80/443 and proxy it to the Docker container running locally on port 5000.

Create an Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/kitchen-hearth
```

Paste the configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com; # Replace with your domain name or EC2 IP

    # Proxy backend API requests
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

Enable the configuration and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/kitchen-hearth /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

## 6. SSL (HTTPS) Setup with Certbot

To secure your backend with Let's Encrypt SSL certificates (highly recommended for production):

```bash
# 1. Install snapd and certbot
sudo apt install snapd -y
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# 2. Run certbot (Replace yourdomain.com with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Certbot will automatically verify ownership and configure SSL on your Nginx server block.

---

## 7. Maintenance & Useful Commands

SSH into your server and run these commands to manage your running Docker containers:

- **Check logs:**
  ```bash
  docker logs -f kitchen-hearth-backend
  ```
- **Check running containers:**
  ```bash
  docker ps
  ```
- **Stop backend:**
  ```bash
  docker compose -f ~/kitchen-hearth/docker-compose.yml down
  ```
- **Start/Restart backend:**
  ```bash
  docker compose -f ~/kitchen-hearth/docker-compose.yml up -d
  ```
- **Prune unused docker images (free disk space):**
  ```bash
  docker image prune -af
  ```
