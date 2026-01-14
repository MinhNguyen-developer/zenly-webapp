# Quick Start Guide

Get your Zenly backend server up and running in minutes!

## Prerequisites

Before you begin, ensure you have:
- **Node.js** 18 or higher installed
- **PostgreSQL** 14 or higher installed and running
- **npm** or **yarn** package manager

## Step 1: Install Dependencies

```bash
cd server
npm install
```

## Step 2: Setup Database

### Option A: Using Local PostgreSQL

1. Create a new database:
```bash
createdb zenly
```

2. Update the `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/zenly?schema=public"
```

### Option B: Using Docker

```bash
docker run --name zenly-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=zenly \
  -p 5432:5432 \
  -d postgres:14
```

Then use:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/zenly?schema=public"
```

## Step 3: Configure Environment

The `.env` file should look like this:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/zenly?schema=public"

# JWT Secret (change this in production!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION="7d"

# Server
PORT=3001
NODE_ENV=development

# CORS (your frontend URL)
CORS_ORIGIN="http://localhost:5173"
```

## Step 4: Generate Prisma Client & Run Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed database with test data
npm run prisma:seed
```

## Step 5: Start the Server

```bash
# Development mode (with hot-reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

You should see:
```
🚀 Server is running on: http://localhost:3001
📍 API available at: http://localhost:3001/api
✅ Database connected
```

## Step 6: Test the API

### Test Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "name": "Test User"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "testuser",
    "password": "password123"
  }'
```

Save the token from the response!

### Test Protected Endpoint
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Step 7: Test WebSocket Connection

Create a simple test file `test-socket.js`:

```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:3001/location', {
  auth: {
    token: 'YOUR_JWT_TOKEN_HERE'
  }
});

socket.on('connect', () => {
  console.log('✅ Connected to WebSocket');
  
  // Update location
  socket.emit('updateLocation', {
    latitude: 40.7128,
    longitude: -74.0060,
    status: 'Testing'
  });
});

socket.on('friendLocationUpdate', (data) => {
  console.log('📍 Friend location update:', data);
});

socket.on('friendOnline', (data) => {
  console.log('🟢 Friend came online:', data);
});

socket.on('friendOffline', (data) => {
  console.log('🔴 Friend went offline:', data);
});
```

Run it:
```bash
npm install socket.io-client
node test-socket.js
```

## Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:** Make sure PostgreSQL is running and credentials in `.env` are correct.
```bash
# Check if PostgreSQL is running
pg_isready

# Or restart PostgreSQL
brew services restart postgresql  # macOS
sudo systemctl restart postgresql # Linux
```

### Issue: "Prisma generate fails"
**Solution:** Make sure all dependencies are installed.
```bash
npm install
npm install --save-dev dotenv
```

### Issue: "Port 3001 already in use"
**Solution:** Change the port in `.env` or kill the process using that port.
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Issue: "CORS errors from frontend"
**Solution:** Update `CORS_ORIGIN` in `.env` to match your frontend URL.
```env
CORS_ORIGIN="http://localhost:5173"
```

## Next Steps

1. **Integrate with Frontend**: Connect your React app to the API
2. **Add More Features**: Extend the API with additional functionality
3. **Deploy**: Deploy to your preferred hosting platform
4. **Security**: Review and update JWT secret and other security settings
5. **Monitoring**: Add logging and monitoring tools

## Test Users (if you ran the seed)

After running `npm run prisma:seed`, you'll have these test users:

| Email | Username | Password | Location |
|-------|----------|----------|----------|
| alice@example.com | alice | password123 | Central Park |
| bob@example.com | bob | password123 | Times Square |
| charlie@example.com | charlie | password123 | Columbus Circle |
| diana@example.com | diana | password123 | Chelsea Market |

Alice and Bob are friends, Alice and Charlie are friends, Bob and Diana are friends.

## Useful Commands

```bash
# View database in browser
npm run prisma:studio

# Create a new migration
npm run prisma:migrate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Format code
npm run format

# Run tests
npm run test

# Build for production
npm run build
```

## Getting Help

- 📖 Check the [API Documentation](./API_DOCS.md)
- 📖 Read the [README](./README.md)
- 🐛 Report issues on GitHub
- 💬 Ask questions in discussions

---

**Happy coding! 🚀**

