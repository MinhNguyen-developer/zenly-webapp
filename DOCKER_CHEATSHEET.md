# 🐳 Docker - Quick Reference Card

## ⚡ Super Quick Start
```bash
cd infra
cp .env.example .env
docker-compose up -d --build
```
**Open:** http://localhost

---

## 📋 Essential Commands

### Start/Stop
```bash
docker-compose up -d          # Start all
docker-compose down           # Stop all
docker-compose restart        # Restart all
```

### Logs
```bash
docker-compose logs -f               # All logs
docker-compose logs -f backend       # Backend only
docker-compose logs --tail=100       # Last 100 lines
```

### Status
```bash
docker-compose ps                    # Service status
docker stats                         # Resource usage
curl http://localhost/health         # Frontend health
curl http://localhost:3001/health    # Backend health
```

### Rebuild
```bash
docker-compose up -d --build         # Rebuild all
docker-compose up -d --build backend # Rebuild backend only
docker-compose build --no-cache      # Clean rebuild
```

---

## 🔧 Management

### Database
```bash
# Connect to DB
docker-compose exec postgres psql -U postgres -d zenly

# Backup
docker-compose exec postgres pg_dump -U postgres zenly > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres zenly < backup.sql
```

### Execute Commands
```bash
# Backend shell
docker-compose exec backend sh

# Run migration
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npm run prisma:seed
```

---

## 🐛 Troubleshooting

### Common Issues
```bash
# Port in use → Edit .env, change ports
# Build fails → docker-compose build --no-cache
# DB error → docker-compose logs postgres
# Reset DB → docker-compose down -v && docker-compose up -d
```

### Clean Up
```bash
docker system prune -a        # Remove unused
docker volume prune           # Remove volumes
```

---

## 📊 Endpoints

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend | http://localhost:3001/api |
| WebSocket | ws://localhost:3001/location |
| Health (FE) | http://localhost/health |
| Health (BE) | http://localhost:3001/health |

---

## 🔐 Security

**Before production:**
1. Change `POSTGRES_PASSWORD`
2. Change `JWT_SECRET` (32+ chars)
3. Update `CORS_ORIGIN`
4. Use HTTPS

---

## 📚 Docs

- Quick Start: `DOCKER_QUICKSTART.md`
- Full Guide: `DOCKER_DEPLOYMENT.md`
- Summary: `DOCKER_SETUP_COMPLETE.md`

---

## 🎉 That's It!

Your Zenly app is containerized and ready to deploy anywhere Docker runs!

**Happy Deploying! 🚀**

