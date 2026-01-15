# 🚀 Quick Docker Start Guide

Get the Zenly Friend Tracker running with Docker in 3 minutes!

---

## ⚡ Super Quick Start (Copy & Paste)

```bash
# 1. Go to infra directory
cd infra

# 2. Create .env file
cat > .env << 'EOF'
POSTGRES_USER=postgres
POSTGRES_PASSWORD=change-me-in-production
POSTGRES_DB=zenly
JWT_SECRET=your-super-secret-jwt-key-change-this-min-32-chars
VITE_API_URL=http://localhost:3001/api
EOF

# 3. Start everything
docker-compose up -d --build

# 4. Check status
docker-compose ps

# 5. View logs
docker-compose logs -f
```

**Open browser:** http://localhost

---

## 🎯 What Gets Built

### Backend (NestJS)
- ✅ Node.js 20 Alpine
- ✅ Multi-stage build
- ✅ Prisma migrations auto-run
- ✅ Production optimized
- ✅ Health checks enabled

### Frontend (React + Vite)
- ✅ Node.js 20 Alpine build
- ✅ Nginx Alpine serving
- ✅ Gzip compression
- ✅ Static asset caching
- ✅ SPA routing support

### Database (PostgreSQL)
- ✅ PostgreSQL 16 Alpine
- ✅ Persistent volume
- ✅ Auto initialization
- ✅ Health monitoring

---

## 📊 Service Endpoints

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost | React web app |
| Backend API | http://localhost:3001 | REST API |
| WebSocket | ws://localhost:3001/location | Real-time updates |
| Health (Frontend) | http://localhost/health | Frontend health |
| Health (Backend) | http://localhost:3001/health | Backend health |
| Database | localhost:5432 | PostgreSQL |

---

## 🛠️ Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild everything
docker-compose up -d --build

# Check status
docker-compose ps

# Execute command in backend
docker-compose exec backend sh

# Database shell
docker-compose exec postgres psql -U postgres -d zenly

# Restart a service
docker-compose restart backend
```

---

## 🔍 Quick Health Check

```bash
# Check all services
docker-compose ps

# Test frontend
curl http://localhost/health

# Test backend
curl http://localhost:3001/health

# Test database
docker-compose exec postgres pg_isready
```

---

## 🐛 Quick Fixes

### Services won't start?
```bash
# Check logs
docker-compose logs

# Restart
docker-compose restart
```

### Port already in use?
```bash
# Edit .env file, change ports:
BACKEND_PORT=3002
FRONTEND_PORT=8080
```

### Database issues?
```bash
# Reset database (⚠️ deletes data!)
docker-compose down -v
docker-compose up -d
```

### Build errors?
```bash
# Clean rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 📦 What's Inside the Dockerfiles

### Backend Dockerfile Highlights:
- Multi-stage build (deps → builder → runner)
- Prisma client generation
- Non-root user (security)
- Auto-runs migrations on start
- Production optimized

### Frontend Dockerfile Highlights:
- Multi-stage build (deps → builder → nginx)
- Vite production build
- Nginx with optimized config
- Gzip compression
- Static asset caching

---

## 🎉 You're Done!

Visit **http://localhost** and start using the app!

**Next:**
1. Register a new user
2. Add friends
3. Start tracking locations

---

## 📚 More Info

- Full deployment guide: `DOCKER_DEPLOYMENT.md`
- Docker Compose config: `infra/docker-compose.yml`
- Backend Dockerfile: `server/Dockerfile`
- Frontend Dockerfile: `webapp/Dockerfile`

---

**Happy tracking! 🗺️✨**

