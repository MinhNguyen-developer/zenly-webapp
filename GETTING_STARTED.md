# 🚀 Getting Started with Zenly Friend Tracker

Welcome! This guide will get you up and running in 5 minutes.

---

## ⚡ Quick Start (Docker - Easiest)

```bash
# 1. Navigate to project
cd zenly-webapp/infra

# 2. Setup environment
cp .env.example .env

# 3. Edit .env and change passwords (IMPORTANT!)
nano .env  # or use your favorite editor

# 4. Start everything
docker-compose up -d --build

# 5. Wait 30 seconds for services to initialize...

# 6. Open your browser
open http://localhost
```

**That's it!** 🎉

---

## 📋 What You Need

- **Docker Desktop** installed
- **4GB RAM** available
- **10GB disk** space
- **Internet connection** for Docker images

---

## 🎮 First Steps

### 1. Register Your First User
- Go to http://localhost
- Click "Register"
- Fill in:
  - Username: `alice`
  - Email: `alice@example.com`
  - Name: `Alice Smith`
  - Password: `password123`
- Click "Register"

### 2. Add a Second User (For Testing)
- Open **Incognito/Private** browser window
- Go to http://localhost
- Register another user:
  - Username: `bob`
  - Email: `bob@example.com`
  - Name: `Bob Johnson`
  - Password: `password123`

### 3. Add Friends
**In Alice's browser:**
- Click "Add Friends" button (top right)
- Search: `bob`
- Click "Add Friend"

**In Bob's browser:**
- Click "Add Friends" button
- See Alice's request in "Pending Requests"
- Click "Accept"

### 4. See Real-Time Magic! ✨
- Both users now see each other on the map!
- Locations update automatically every 30 seconds
- Click on a friend to zoom to their location
- Click "Navigate" to see the route

---

## 🐛 Troubleshooting

### "Cannot connect to backend"
```bash
# Check if backend is running
docker-compose ps

# View backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### "Database connection failed"
```bash
# Check if database is healthy
docker-compose ps postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

### "Port already in use"
```bash
# Edit infra/.env and change ports:
BACKEND_PORT=3002
FRONTEND_PORT=8080

# Restart services
docker-compose up -d
```

### Services won't start
```bash
# Clean rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check logs
docker-compose logs -f
```

---

## 📊 Verify Everything Works

### Check Services
```bash
cd infra

# All services running?
docker-compose ps

# Should see:
# - zenly-frontend (healthy)
# - zenly-backend (healthy)
# - zenly-postgres (healthy)
```

### Test Health Endpoints
```bash
# Frontend
curl http://localhost/health
# Expected: "healthy"

# Backend
curl http://localhost:3001/health
# Expected: {"status":"ok",...}
```

### View Logs
```bash
# All logs
docker-compose logs -f

# Just backend
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100
```

---

## 🎯 Common Tasks

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### View Logs
```bash
docker-compose logs -f backend
```

### Update Code
```bash
git pull
docker-compose up -d --build
```

---

## 🔐 Security (Important!)

Before sharing or deploying:

1. **Change Database Password**
   ```bash
   # In infra/.env
   POSTGRES_PASSWORD=your-super-secure-password-here
   ```

2. **Change JWT Secret**
   ```bash
   # In infra/.env
   JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
   ```

3. **Use Strong Passwords**
   ```bash
   # Generate secure passwords
   openssl rand -base64 32
   ```

---

## 📱 Access Points

Once running:

| Service | URL | Description |
|---------|-----|-------------|
| **Web App** | http://localhost | Main application |
| **API** | http://localhost:3001/api | REST endpoints |
| **WebSocket** | ws://localhost:3001/location | Real-time updates |
| **Database** | localhost:5432 | PostgreSQL (internal) |

---

## 💡 Pro Tips

### Tip 1: Use Two Browsers
Open regular + incognito windows to test with 2 users simultaneously.

### Tip 2: Check Connection Status
Green "Live" indicator = WebSocket connected = Real-time updates working

### Tip 3: Grant Location Permissions
Browser will ask for location access - click "Allow" for best experience.

### Tip 4: Keep Logs Open
```bash
docker-compose logs -f
```
Helps debug issues quickly.

### Tip 5: Bookmark Health Checks
- http://localhost/health
- http://localhost:3001/health

---

## 🎓 Next Steps

Now that you're running:

1. **Explore Features**
   - Add multiple friends
   - Test real-time location updates
   - Try the navigation feature
   - Send/accept friend requests

2. **Read Documentation**
   - [README.md](./README.md) - Full documentation
   - [API_DOCS.md](./server/API_DOCS.md) - API reference
   - [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) - Deployment guide

3. **Customize**
   - Change colors in Tailwind config
   - Modify map styles
   - Add your own features

4. **Deploy**
   - Deploy to your own server
   - Share with friends
   - Use in production

---

## 📚 Help & Support

### Documentation
- [Full README](./README.md)
- [Docker Guide](./DOCKER_DEPLOYMENT.md)
- [API Docs](./server/API_DOCS.md)

### Common Commands
```bash
# Status
docker-compose ps

# Logs
docker-compose logs -f

# Restart
docker-compose restart

# Rebuild
docker-compose up -d --build

# Stop
docker-compose down

# Clean restart
docker-compose down -v && docker-compose up -d
```

### Still Stuck?
- Check logs: `docker-compose logs -f`
- Check health: `curl http://localhost/health`
- Rebuild: `docker-compose up -d --build`

---

## 🎉 Success!

You should now have:
- ✅ All services running
- ✅ Web app accessible at http://localhost
- ✅ Users registered and friends added
- ✅ Real-time location tracking working
- ✅ Map displaying friend locations

**Enjoy tracking your friends! 🗺️✨**

---

**Questions?** Check the [README.md](./README.md) for more details.

**Ready to deploy?** See [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)

