# DevOps Assessment - Commands Reference

## EC2 / SSH

```bash
# Connect to Dev server
ssh -i "your-key.pem" ubuntu@44.203.14.7

# Connect to Prod server
ssh -i "your-key.pem" ubuntu@100.54.71.253

# Fix key permissions (run once on your machine)
chmod 400 your-key.pem
```

---

## Docker

```bash
# Install Docker on Ubuntu
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu        # Allow ubuntu user to run docker without sudo

# Build Docker image
docker build -t devops-assignment:dev .

# Run container (development)
docker run -d --name app-dev -p 3000:3000 -e NODE_ENV=development devops-assignment:dev

# Run container (production)
docker run -d --name app-prod -p 3000:3000 -e NODE_ENV=production devops-assignment:prod

# Check running containers
docker ps

# Stop and remove a container
docker stop app-dev && docker rm app-dev

# Test app locally on server
curl http://localhost:3000
```

---

## Jenkins

```bash
# Install Java (required for Jenkins)
sudo apt install -y fontconfig openjdk-17-jre

# Download and install Jenkins .deb package
wget https://get.jenkins.io/debian-stable/jenkins_2.492.1_all.deb
sudo apt install -y ./jenkins_2.492.1_all.deb

# Start and enable Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Check Jenkins status
sudo systemctl status jenkins

# Get initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

# Allow Jenkins user to run Docker
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

---

## Nginx

```bash
# Install Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Test Nginx config for errors
sudo nginx -t

# Reload Nginx after config changes
sudo systemctl reload nginx

# Create site config
sudo nano /etc/nginx/sites-available/dev.nikhiltamse.me

# Enable the site
sudo ln -s /etc/nginx/sites-available/dev.nikhiltamse.me /etc/nginx/sites-enabled/
```

### Nginx reverse proxy config (dev)
```nginx
server {
    listen 80;
    server_name dev.nikhiltamse.me;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## SSL - Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate for dev
sudo certbot --nginx -d dev.nikhiltamse.me

# Get SSL certificate for prod
sudo certbot --nginx -d prod.nikhiltamse.me

# Certbot auto-renews certificates — no manual renewal needed
```

---

## Git

```bash
# Clone the repository
git clone https://github.com/nikhiltamse/devops-assignment-IPS.git

# Check current branch
git branch

# Switch to a branch
git checkout dev

# Create and switch to a new branch
git checkout -b feature/test-deployment

# Stage and commit changes
git add .
git commit -m "your commit message"

# Push branch to GitHub
git push origin dev
git push origin feature/test-deployment

# Merge one branch into another
git checkout dev
git merge feature/test-deployment

# Push after merge
git push origin dev
```

---

## URLs & Access

| Resource         | URL                                      |
|------------------|------------------------------------------|
| Dev App          | https://dev.nikhiltamse.me               |
| Prod App         | https://prod.nikhiltamse.me              |
| Jenkins          | http://44.203.14.7:8080                  |
| GitHub Repo      | https://github.com/nikhiltamse/devops-assignment-IPS |

---

## AWS Security Group - Ports to Open

| Port | Purpose         |
|------|-----------------|
| 22   | SSH             |
| 80   | HTTP            |
| 443  | HTTPS           |
| 3000 | Node.js App     |
| 8080 | Jenkins         |
