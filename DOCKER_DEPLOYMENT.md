# 🐳 Docker Deployment Guide
**Need help?** Check the logs: `docker-compose logs -f`

---

- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [NestJS Docker](https://docs.nestjs.com/recipes/docker)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Docker Documentation](https://docs.docker.com/)

## 📚 Additional Resources

---

5. Keep Docker images updated
4. Backup regularly
3. Monitor logs: `docker-compose logs -f`
2. Add friends and start tracking
1. Register users at http://localhost
**Next Steps:**

Your Zenly Friend Tracker is now running in Docker!

## 🎉 Success!

---

```
echo "✅ All services healthy!"

docker-compose exec postgres pg_isready -U postgres || exit 1
echo "✓ Testing database..."
# Test database

curl -f http://localhost:3001/health || exit 1
echo "✓ Testing backend..."
# Test backend

curl -f http://localhost/health || exit 1
echo "✓ Testing frontend..."
# Test frontend

echo "Testing Zenly Deployment..."

#!/bin/bash
```bash
### Automated Test Script

## ✅ Testing Deployment

---

| `FRONTEND_URL` | http://localhost:80 | Frontend URL for backend |
| `CORS_ORIGIN` | http://localhost:80 | Allowed CORS origin |
| `VITE_API_URL` | http://localhost:3001/api | API URL for frontend |
| `JWT_EXPIRATION` | 7d | Token expiration time |
| `JWT_SECRET` | - | JWT signing key (required) |
| `FRONTEND_PORT` | 80 | Frontend web port |
| `BACKEND_PORT` | 3001 | Backend API port |
| `POSTGRES_PORT` | 5432 | Database port |
| `POSTGRES_DB` | zenly | Database name |
| `POSTGRES_PASSWORD` | - | Database password (required) |
| `POSTGRES_USER` | postgres | Database user |
|----------|---------|-------------|
| Variable | Default | Description |

### Complete List

## 📝 Environment Variables

---

```
# Configure proxy to port 80

apt install nginx
# Install nginx on host
```bash
5. **Setup reverse proxy (optional)**

```
docker-compose up -d
```bash
4. **Start services**

```
nano .env  # Edit with your values
cp .env.example .env
cd infra
```bash
3. **Configure environment**

```
cd zenly-webapp
git clone <your-repo>
```bash
2. **Clone repository**

```
sh get-docker.sh
curl -fsSL https://get.docker.com -o get-docker.sh
```bash
1. **Install Docker on server**

### Using Docker on VPS

## 🌐 Production Deployment

---

```
docker system prune -a --volumes
# Complete cleanup

docker volume prune
# Remove unused volumes (⚠️ careful!)

docker image prune -a
# Remove unused images

docker container prune
# Remove unused containers
```bash
### Clean Up

```
docker volume inspect infra_postgres_data
docker volume ls
# Volume sizes

docker system df
# Docker disk usage
```bash
### Disk Usage

```
docker stats zenly-backend
# Specific container

docker stats
# Container stats
```bash
### Resource Usage

## 📊 Monitoring

---

```
docker-compose exec backend npm run prisma:seed
# Seed database

docker-compose exec backend npx prisma generate
# Generate Prisma client

docker-compose exec backend npx prisma migrate deploy
# Run new migrations
```bash
### Database Migrations

```
docker-compose up -d --build
# Rebuild services

docker-compose pull
# Pull latest base images
```bash
### Update Docker Images

```
docker-compose up -d --build
# Rebuild and restart

git pull origin main
# Pull latest code
```bash
### Update Application Code

## 🔄 Updates & Maintenance

---

```
docker run --rm -v infra_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /data
# From volume backup

docker-compose exec -T postgres psql -U postgres zenly < backup.sql
# From SQL dump
```bash
### Restore Database

```
docker run --rm -v infra_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
# Or with docker volume

docker-compose exec postgres pg_dump -U postgres zenly > backup_$(date +%Y%m%d_%H%M%S).sql
# Create backup
```bash
### Backup Database

## 💾 Backup & Restore

---

```
JWT_SECRET=$(openssl rand -base64 48)
POSTGRES_DB=zenly
POSTGRES_PASSWORD=$(openssl rand -base64 32)
POSTGRES_USER=postgres
```bash
### Secure .env Template

- [ ] Update Docker images regularly
- [ ] Regular backups
- [ ] Enable firewall rules
- [ ] Set strong database password
- [ ] Use HTTPS in production
- [ ] Update `CORS_ORIGIN` to your domain
- [ ] Change `JWT_SECRET` (min 32 characters)
- [ ] Change `POSTGRES_PASSWORD` in .env

### Production Checklist

## 🔐 Security

---

```
docker-compose up -d
docker volume rm infra_postgres_data
docker-compose down
```bash
**Reset database:**

```
docker-compose exec backend sh -c "echo 'SELECT 1' | psql $DATABASE_URL"
```bash
**Check connection:**

```
docker-compose ps postgres
```bash
**Verify database is running:**

### Database Connection Failed

- Node modules error → Clear cache and rebuild
- Out of memory → Increase Docker memory limit
- VITE_API_URL incorrect → Check .env
**Common issues:**

```
docker-compose up --build frontend
```bash
**Check build logs:**

### Frontend Build Fails

- Port already in use → Change BACKEND_PORT in .env
- Migration failed → Check DATABASE_URL
- Database not ready → Wait for postgres healthcheck
**Common issues:**

```
docker-compose logs backend
```bash
**Check logs:**

### Backend Won't Start

## 🐛 Troubleshooting

---

```
docker-compose exec postgres psql -U postgres -d zenly -c "SELECT * FROM \"User\";"
# View users

docker-compose exec postgres psql -U postgres -d zenly -c "\dt"
# Check tables

docker-compose exec postgres psql -U postgres -d zenly
# Connect to PostgreSQL
```bash
### Database Connection

```
docker-compose ps
# All services status

curl http://localhost/health
# Frontend health

curl http://localhost:3001/health
# Backend health
```bash
### Check Service Health

## 🔍 Health Checks

---

```
docker-compose exec postgres psql -U postgres -d zenly
docker-compose exec backend sh
# Execute command in container

docker-compose ps
# Check service status

docker-compose up -d --build backend
# Rebuild a service

docker-compose restart backend
# Restart a service
```bash
### Service Management

```
docker-compose logs --tail=100 backend
# Last 100 lines

docker-compose logs -f postgres
docker-compose logs -f frontend
docker-compose logs -f backend
# Specific service

docker-compose logs -f
# All services
```bash
### View Logs

```
docker-compose down -v
# Stop and remove volumes (⚠️ deletes data!)

docker-compose down
# Stop all services
```bash
### Stop Services

```
docker-compose up -d backend
# Start specific service

docker-compose up -d --build
# Start with build

docker-compose up -d
# Start all services in detached mode
```bash
### Start Services

## 🔧 Docker Commands

---

  - Health endpoint
  - Cache headers
  - Gzip compression
  - Static file serving
- **Features**:
- **Port**: 80
- **Build**: Multi-stage Dockerfile with Nginx
### 3. **Frontend (React + Vite)**

  - Health checks
  - WebSocket support
  - JWT authentication
  - Prisma ORM with auto-migrations
- **Features**:
- **Port**: 3001
- **Build**: Multi-stage Dockerfile
### 2. **Backend (NestJS)**

- **Health Check**: Every 10s
- **Volume**: postgres_data
- **Port**: 5432
- **Image**: postgres:16-alpine
### 1. **PostgreSQL Database**

## 📦 Services

---

```
└─────────────────────────────────────────────────┘
│  Port: 5432                                      │
│  PostgreSQL Database                             │
┌─────────────────────────────────────────────────┐
                  ↓
                  │
└─────────────────┬───────────────────────────────┘
│  Port: 3001                                      │
│  Backend (NestJS)                                │
┌─────────────────────────────────────────────────┐
                  ↓
                  │
└─────────────────┬───────────────────────────────┘
│  Port: 80                                        │
│  Frontend (Nginx + React)                       │
┌─────────────────────────────────────────────────┐
```

## 🏗️ Architecture

---

- **API Docs**: http://localhost:3001/api
- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost

### 3. Access the Application

```
docker-compose up -d
cd infra
```bash

### 2. Build and Start All Services

```
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-here
POSTGRES_PASSWORD=your-secure-password-here
# IMPORTANT: Change these values!
```bash
Edit `.env` file and change the passwords:

```
cp .env.example .env
cd infra
```bash

### 1. Setup Environment Variables

## 🚀 Quick Start

---

- 10GB+ available disk space
- 2GB+ available RAM
- Docker Compose 2.0+
- Docker Engine 20.10+

## 📋 Prerequisites

---

Complete guide for deploying the Zenly Friend Tracker app using Docker.


