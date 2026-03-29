# devops-assignment-IPS

A hands-on DevOps assessment project demonstrating end-to-end infrastructure setup, containerization, CI/CD pipelines, and Git workflow.

## Project Structure

```
devops-assignment-IPS/
├── app/
│   ├── server.js       # Node.js web application
│   └── package.json
├── Dockerfile          # Container image definition
├── Jenkinsfile         # CI/CD pipeline (dev + prod)
└── README.md
```

## Application

Simple Node.js HTTP server that displays the current environment and port. Runs on port **3000** by default.

## Docker

**Build:**
```bash
docker build -t devops-assignment:dev .
```

**Run (development):**
```bash
docker run -d -p 3000:3000 -e NODE_ENV=development --name app-dev devops-assignment:dev
```

**Run (production):**
```bash
docker run -d -p 3000:3000 -e NODE_ENV=production --name app-prod devops-assignment:prod
```

## Infrastructure

| Environment | Domain              | Server        |
|-------------|---------------------|---------------|
| Development | dev.yourdomain.com  | EC2 t2.micro  |
| Production  | prod.yourdomain.com | EC2 t2.micro  |

**Security Groups allow:** SSH (22), HTTP (80), HTTPS (443), App port (3000)

## CI/CD Pipeline (Jenkins)

- **`dev` branch** → Build → Push → Auto-deploy to Dev server
- **`main` branch** → Build → Push → Manual approval → Deploy to Prod server

## Branch Structure

| Branch               | Purpose                          |
|----------------------|----------------------------------|
| `main`               | Production-ready code            |
| `dev`                | Integration / staging            |
| `feature/*`          | Feature development              |

## Git Workflow

```
feature/test-deployment → (PR) → dev → (PR after testing) → main
```

## Security Practices

- SSH restricted to whitelisted IPs via Security Group
- Docker containers run as non-root (Alpine base)
- Secrets managed via Jenkins credentials store
- SSL via Let's Encrypt + Nginx reverse proxy (bonus)
