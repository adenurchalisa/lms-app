# 🚀 LMS Deployment Guide

Panduan lengkap untuk deployment Learning Management System (LMS) ke berbagai environment.

## 📋 Daftar Isi

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Production Deployment](#production-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Cloud Deployment](#cloud-deployment)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

---

## 🛠️ Prerequisites

### System Requirements:
- **Node.js**: v18 atau lebih baru
- **MongoDB**: v6 atau lebih baru
- **Git**: Latest version
- **PM2**: Untuk production process management
- **Nginx**: Untuk reverse proxy (optional)

### Hardware Requirements:

#### Minimum (Development):
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 10GB free space
- **Network**: Broadband internet

#### Recommended (Production):
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 50GB+ SSD
- **Network**: High-speed internet dengan static IP

---

## ⚙️ Environment Setup

### 1. Server Preparation

#### Ubuntu/Debian:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install PM2
sudo npm install -g pm2

# Install Nginx (optional)
sudo apt install nginx -y
```

#### CentOS/RHEL:
```bash
# Update system
sudo yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install MongoDB
sudo tee /etc/yum.repos.d/mongodb-org-6.0.repo <<EOF
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
EOF

sudo yum install -y mongodb-org

# Install PM2
sudo npm install -g pm2
```

### 2. Security Setup

#### Create Application User:
```bash
# Create dedicated user for application
sudo adduser lmsapp
sudo usermod -aG sudo lmsapp

# Switch to application user
sudo su - lmsapp
```

#### Setup SSH Key (if deploying remotely):
```bash
# Generate SSH key
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Add public key to authorized_keys
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

#### Firewall Configuration:
```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 5000  # Backend port
sudo ufw enable
```

---

## 💻 Local Development

### 1. Clone Repository:
```bash
git clone https://github.com/adenurchalisa/lms-app.git
cd lms-app
```

### 2. Backend Setup:
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit environment variables
nano .env
```

#### Backend Environment (.env):
```env
# Server Configuration
NODE_ENV=development
PORT=5000
APP_URL=http://localhost:5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/lms_development

# JWT Configuration
JWT_SECRET=your_development_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/pdf

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup:
```bash
# Navigate to frontend
cd ../fe_final_BDNR

# Install dependencies
npm install

# Create environment file (if needed)
touch .env.local
```

#### Frontend Environment (.env.local):
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_URL=http://localhost:5000
```

### 4. Database Setup:
```bash
# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
mongo --eval "db.adminCommand('ismaster')"
```

### 5. Run Development Servers:

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend:
```bash
cd fe_final_BDNR
npm run dev
```

### 6. Verify Installation:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **MongoDB**: Connect via MongoDB Compass or CLI

---

## 🏭 Production Deployment

### 1. Server Preparation

#### Clone Repository:
```bash
cd /opt
sudo git clone https://github.com/adenurchalisa/lms-app.git
sudo chown -R lmsapp:lmsapp lms-app
cd lms-app
```

#### Setup Environment:
```bash
# Backend environment
cd backend
cp .env.example .env
nano .env
```

#### Production Environment (.env):
```env
# Server Configuration
NODE_ENV=production
PORT=5000
APP_URL=https://your-domain.com

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/lms_production

# JWT Configuration
JWT_SECRET=your_super_secure_production_jwt_secret_256_bit_key
JWT_EXPIRES_IN=7d

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/pdf

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.com

# Security
SECURE_COOKIES=true
RATE_LIMIT_ENABLED=true
```

### 2. Build Applications

#### Backend:
```bash
cd backend
npm ci --production
```

#### Frontend:
```bash
cd ../fe_final_BDNR
npm ci
npm run build
```

### 3. PM2 Setup

#### Create PM2 Ecosystem File:
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'lms-backend',
      script: './backend/app.js',
      cwd: '/opt/lms-app',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '/var/log/lms/backend-error.log',
      out_file: '/var/log/lms/backend-out.log',
      log_file: '/var/log/lms/backend-combined.log',
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
```

#### Start with PM2:
```bash
# Create log directory
sudo mkdir -p /var/log/lms
sudo chown lmsapp:lmsapp /var/log/lms

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u lmsapp --hp /home/lmsapp
```

### 4. Nginx Configuration

#### Create Nginx Config:
```nginx
# /etc/nginx/sites-available/lms
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Frontend
    location / {
        root /opt/lms-app/fe_final_BDNR/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # File uploads
    location /uploads {
        alias /opt/lms-app/backend/public/uploads;
        expires 1y;
        add_header Cache-Control "public";
        
        # Security for uploaded files
        location ~* \.(php|jsp|asp|sh|cgi)$ {
            deny all;
        }
    }
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    location /api/auth {
        limit_req zone=api burst=5 nodelay;
        proxy_pass http://localhost:5000;
        # ... same proxy settings as above
    }
}
```

#### Enable Site:
```bash
# Test configuration
sudo nginx -t

# Enable site
sudo ln -s /etc/nginx/sites-available/lms /etc/nginx/sites-enabled/

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 5. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Setup automatic renewal
sudo crontab -e
# Add line: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 6. Database Security

#### MongoDB Configuration:
```javascript
// /etc/mongod.conf
security:
  authorization: enabled

net:
  port: 27017
  bindIp: 127.0.0.1

storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
```

#### Create Database Users:
```bash
# Connect to MongoDB
mongo

# Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "secure_admin_password",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})

# Create application user
use lms_production
db.createUser({
  user: "lmsuser",
  pwd: "secure_app_password",
  roles: [ { role: "readWrite", db: "lms_production" } ]
})
```

#### Update Connection String:
```env
MONGODB_URI=mongodb://lmsuser:secure_app_password@localhost:27017/lms_production
```

---

## 🐳 Docker Deployment

### 1. Create Dockerfiles

#### Backend Dockerfile:
```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app .

# Create uploads directory
RUN mkdir -p public/uploads/materials && chown -R nodejs:nodejs public/uploads

USER nodejs

EXPOSE 5000

CMD ["npm", "start"]
```

#### Frontend Dockerfile:
```dockerfile
# fe_final_BDNR/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS runner

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Frontend Nginx Config:
```nginx
# fe_final_BDNR/nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    sendfile on;
    keepalive_timeout 65;
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### 2. Docker Compose

#### Production Docker Compose:
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGODB_URI=mongodb://mongo:27017/lms_production
      - JWT_SECRET=${JWT_SECRET}
      - APP_URL=${APP_URL}
      - FRONTEND_URL=${FRONTEND_URL}
    depends_on:
      - mongo
    volumes:
      - uploads:/app/public/uploads
    restart: unless-stopped
    networks:
      - lms-network

  frontend:
    build:
      context: ./fe_final_BDNR
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - lms-network

  mongo:
    image: mongo:6-jammy
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_ROOT_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
      - MONGO_INITDB_DATABASE=lms_production
    volumes:
      - mongo_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    restart: unless-stopped
    networks:
      - lms-network

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - uploads:/var/www/uploads
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
    networks:
      - lms-network

volumes:
  mongo_data:
  uploads:

networks:
  lms-network:
    driver: bridge
```

#### Environment File (.env.prod):
```env
# JWT Configuration
JWT_SECRET=your_super_secure_production_jwt_secret_256_bit_key

# App URLs
APP_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com

# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=secure_mongo_password
```

#### MongoDB Initialization Script:
```javascript
// mongo-init.js
db = db.getSiblingDB('lms_production');

db.createUser({
  user: 'lmsuser',
  pwd: 'secure_app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'lms_production'
    }
  ]
});
```

### 3. Deploy with Docker Compose:
```bash
# Build and start services
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Scale backend service
docker-compose -f docker-compose.prod.yml up -d --scale backend=3

# Update services
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

---

## ☁️ Cloud Deployment

### 1. AWS Deployment

#### EC2 Setup:
```bash
# Launch EC2 instance (t3.medium recommended)
# Security Groups: SSH (22), HTTP (80), HTTPS (443), Custom (5000)

# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Docker
sudo apt update
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker ubuntu

# Clone repository
git clone https://github.com/adenurchalisa/lms-app.git
cd lms-app

# Setup environment
cp .env.example .env.prod
nano .env.prod

# Deploy
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

#### RDS MongoDB Setup:
```bash
# Use MongoDB Atlas or AWS DocumentDB
# Update connection string in .env.prod
MONGODB_URI=mongodb://username:password@your-cluster.mongodb.net/lms_production
```

#### CloudFront CDN:
```yaml
# cloudfront-distribution.yml
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Enabled: true
        Origins:
          - Id: LMSOrigin
            DomainName: !GetAtt LoadBalancer.DNSName
            CustomOriginConfig:
              HTTPPort: 80
              OriginProtocolPolicy: http-only
        DefaultCacheBehavior:
          TargetOriginId: LMSOrigin
          ViewerProtocolPolicy: redirect-to-https
          Compress: true
          CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad
```

### 2. Google Cloud Platform

#### App Engine Deployment:
```yaml
# app.yaml
runtime: nodejs18
service: lms-backend

env_variables:
  NODE_ENV: production
  MONGODB_URI: mongodb://username:password@your-mongodb-ip:27017/lms_production
  JWT_SECRET: your_jwt_secret

automatic_scaling:
  min_instances: 1
  max_instances: 10
  target_cpu_utilization: 0.6
```

#### Deploy Commands:
```bash
# Install Google Cloud SDK
# Authenticate
gcloud auth login

# Set project
gcloud config set project your-project-id

# Deploy backend
cd backend
gcloud app deploy

# Deploy frontend (Firebase Hosting)
cd ../fe_final_BDNR
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### 3. Digital Ocean

#### Droplet Setup:
```bash
# Create Droplet (4GB RAM recommended)
# Add SSH key during creation

# Connect and setup
ssh root@your-droplet-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Deploy application
git clone https://github.com/adenurchalisa/lms-app.git
cd lms-app
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔄 CI/CD Pipeline

### 1. GitHub Actions

#### Backend CI/CD:
```yaml
# .github/workflows/backend-deploy.yml
name: Backend CI/CD

on:
  push:
    branches: [ main ]
    paths: [ 'backend/**' ]
  pull_request:
    branches: [ main ]
    paths: [ 'backend/**' ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: backend/package-lock.json
    
    - name: Install dependencies
      run: |
        cd backend
        npm ci
    
    - name: Run tests
      run: |
        cd backend
        npm test
      env:
        MONGODB_URI: mongodb://localhost:27017/lms_test
        JWT_SECRET: test_secret
    
    - name: Run linting
      run: |
        cd backend
        npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to production
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /opt/lms-app
          git pull origin main
          cd backend
          npm ci --production
          pm2 restart lms-backend
```

#### Frontend CI/CD:
```yaml
# .github/workflows/frontend-deploy.yml
name: Frontend CI/CD

on:
  push:
    branches: [ main ]
    paths: [ 'fe_final_BDNR/**' ]
  pull_request:
    branches: [ main ]
    paths: [ 'fe_final_BDNR/**' ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: fe_final_BDNR/package-lock.json
    
    - name: Install dependencies
      run: |
        cd fe_final_BDNR
        npm ci
    
    - name: Run tests
      run: |
        cd fe_final_BDNR
        npm run test:ci
    
    - name: Build application
      run: |
        cd fe_final_BDNR
        npm run build
    
    - name: Run linting
      run: |
        cd fe_final_BDNR
        npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: fe_final_BDNR/package-lock.json
    
    - name: Install and build
      run: |
        cd fe_final_BDNR
        npm ci
        npm run build
    
    - name: Deploy to server
      uses: appleboy/scp-action@v0.1.4
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        source: "fe_final_BDNR/dist/*"
        target: "/var/www/lms"
        strip_components: 2
```

### 2. GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

# Backend Pipeline
backend-test:
  stage: test
  image: node:$NODE_VERSION
  services:
    - mongo:6
  variables:
    MONGODB_URI: mongodb://mongo:27017/lms_test
  script:
    - cd backend
    - npm ci
    - npm test
  only:
    changes:
      - backend/**/*

backend-build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - cd backend
    - docker build -t $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA
  only:
    changes:
      - backend/**/*

backend-deploy:
  stage: deploy
  script:
    - ssh $DEPLOY_USER@$DEPLOY_HOST "docker pull $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA"
    - ssh $DEPLOY_USER@$DEPLOY_HOST "docker stop lms-backend || true"
    - ssh $DEPLOY_USER@$DEPLOY_HOST "docker run -d --name lms-backend -p 5000:5000 $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA"
  only:
    refs:
      - main
    changes:
      - backend/**/*

# Frontend Pipeline
frontend-test:
  stage: test
  image: node:$NODE_VERSION
  script:
    - cd fe_final_BDNR
    - npm ci
    - npm run test:ci
    - npm run build
  only:
    changes:
      - fe_final_BDNR/**/*

frontend-deploy:
  stage: deploy
  image: node:$NODE_VERSION
  script:
    - cd fe_final_BDNR
    - npm ci
    - npm run build
    - rsync -av --delete dist/ $DEPLOY_USER@$DEPLOY_HOST:/var/www/lms/
  only:
    refs:
      - main
    changes:
      - fe_final_BDNR/**/*
```

---

## 📊 Monitoring & Maintenance

### 1. Application Monitoring

#### PM2 Monitoring:
```bash
# Install PM2 monitoring
npm install -g pm2

# Monitor processes
pm2 monit

# View logs
pm2 logs lms-backend

# Restart application
pm2 restart lms-backend

# Check status
pm2 status
```

#### Health Check Endpoint:
```javascript
// backend/routes/health.js
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  });
});
```

### 2. Database Monitoring

#### MongoDB Monitoring Script:
```javascript
// scripts/db-monitor.js
const mongoose = require('mongoose');

async function checkDatabaseHealth() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const admin = mongoose.connection.db.admin();
    const status = await admin.serverStatus();
    
    console.log('Database Status:', {
      uptime: status.uptime,
      connections: status.connections,
      memory: status.mem,
      version: status.version
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Database check failed:', error);
  }
}

checkDatabaseHealth();
```

### 3. Log Management

#### Centralized Logging with Winston:
```javascript
// backend/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'lms-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

#### Log Rotation:
```bash
# Install logrotate
sudo apt install logrotate

# Create logrotate config
sudo nano /etc/logrotate.d/lms

# Content:
/var/log/lms/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 lmsapp lmsapp
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 4. Performance Monitoring

#### Application Performance Monitoring:
```javascript
// backend/middleware/performance.js
const prometheus = require('prom-client');

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

const httpRequestsTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

// Middleware
const performanceMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
    
    httpRequestsTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });
  
  next();
};

module.exports = { performanceMiddleware };
```

### 5. Backup Strategy

#### Database Backup Script:
```bash
#!/bin/bash
# backup-db.sh

# Configuration
DB_NAME="lms_production"
BACKUP_DIR="/opt/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/lms_backup_$DATE.gz"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
mongodump --db $DB_NAME --gzip --archive=$BACKUP_FILE

# Remove backups older than 30 days
find $BACKUP_DIR -type f -name "*.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE"
```

#### File Backup Script:
```bash
#!/bin/bash
# backup-files.sh

# Configuration
APP_DIR="/opt/lms-app"
BACKUP_DIR="/opt/backups/files"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
tar -czf "$BACKUP_DIR/uploads_backup_$DATE.tar.gz" -C "$APP_DIR/backend/public" uploads

# Remove old backups
find $BACKUP_DIR -type f -name "*.tar.gz" -mtime +7 -delete

echo "File backup completed"
```

#### Automated Backup with Cron:
```bash
# Edit crontab
crontab -e

# Add backup jobs
# Database backup every day at 2 AM
0 2 * * * /opt/scripts/backup-db.sh

# File backup every day at 3 AM
0 3 * * * /opt/scripts/backup-files.sh

# Health check every 5 minutes
*/5 * * * * curl -f http://localhost:5000/api/health || echo "Health check failed" | mail -s "LMS Health Alert" admin@example.com
```

---

## 🚨 Troubleshooting

### 1. Common Issues

#### Application Won't Start:
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs lms-backend

# Check port usage
sudo netstat -tlnp | grep 5000

# Check environment variables
pm2 env lms-backend

# Restart application
pm2 restart lms-backend
```

#### Database Connection Issues:
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Test connection
mongo --eval "db.adminCommand('ismaster')"

# Check network connectivity
telnet localhost 27017
```

#### File Upload Issues:
```bash
# Check directory permissions
ls -la backend/public/uploads/

# Fix permissions
sudo chown -R lmsapp:lmsapp backend/public/uploads/
sudo chmod -R 755 backend/public/uploads/

# Check disk space
df -h

# Check file size limits
grep client_max_body_size /etc/nginx/nginx.conf
```

### 2. Performance Issues

#### High Memory Usage:
```bash
# Check memory usage
free -h
pm2 monit

# Restart application
pm2 restart lms-backend

# Check for memory leaks
pm2 logs lms-backend | grep -i memory
```

#### Slow Database Queries:
```javascript
// Enable MongoDB profiling
db.setProfilingLevel(2, { slowms: 100 })

// Check slow queries
db.system.profile.find().limit(5).sort({ ts: -1 }).pretty()

// Create indexes
db.courses.createIndex({ teacher: 1 })
db.enrollments.createIndex({ user: 1, course: 1 })
```

#### High CPU Usage:
```bash
# Check processes
top
htop

# Check PM2 cluster mode
pm2 scale lms-backend 4

# Monitor system load
uptime
```

### 3. Security Issues

#### Suspicious Activity:
```bash
# Check access logs
sudo tail -f /var/log/nginx/access.log

# Check failed authentication attempts
grep "Invalid" /var/log/lms/backend-combined.log

# Check system logs
sudo journalctl -f

# Monitor network connections
sudo netstat -tulnp
```

#### SSL Certificate Issues:
```bash
# Check certificate expiry
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL configuration
openssl s_client -connect your-domain.com:443
```

### 4. Recovery Procedures

#### Application Recovery:
```bash
# Stop application
pm2 stop lms-backend

# Restore from backup
cd /opt/lms-app
git checkout HEAD~1  # Rollback to previous version

# Restart application
pm2 start ecosystem.config.js
```

#### Database Recovery:
```bash
# Stop application
pm2 stop lms-backend

# Restore database
mongorestore --gzip --archive=/opt/backups/mongodb/lms_backup_20250703_020000.gz

# Start application
pm2 start lms-backend
```

#### Complete System Recovery:
```bash
# 1. Stop all services
pm2 stop all
sudo systemctl stop nginx

# 2. Restore application files
cd /opt
sudo rm -rf lms-app
git clone https://github.com/adenurchalisa/lms-app.git
sudo chown -R lmsapp:lmsapp lms-app

# 3. Restore database
mongorestore --drop --gzip --archive=/opt/backups/mongodb/latest_backup.gz

# 4. Restore uploaded files
cd /opt/lms-app/backend/public
sudo tar -xzf /opt/backups/files/latest_uploads.tar.gz

# 5. Start services
sudo systemctl start nginx
pm2 start ecosystem.config.js
```

---

## 📞 Support & Maintenance

### Emergency Contacts:
- **Primary Admin**: admin@your-domain.com
- **Technical Lead**: tech@your-domain.com
- **On-call**: +1-XXX-XXX-XXXX

### Maintenance Schedule:
- **Daily**: Automated backups, health checks
- **Weekly**: Security updates, log rotation
- **Monthly**: Performance optimization, capacity planning
- **Quarterly**: Security audit, disaster recovery testing

### Documentation Updates:
This deployment guide should be updated whenever:
- Infrastructure changes are made
- New deployment procedures are added
- Security configurations are modified
- Monitoring tools are updated

---

**Last Updated**: July 3, 2025  
**Version**: 1.0.0
