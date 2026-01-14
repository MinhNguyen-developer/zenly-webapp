# Development Guide

## Daily Development Workflow

### Starting Development

```bash
# 1. Start PostgreSQL (if not running)
brew services start postgresql  # macOS
# or
sudo systemctl start postgresql # Linux

# 2. Start the development server
cd server
npm run start:dev

# Server runs on http://localhost:3001
```

### Making Database Changes

```bash
# 1. Edit prisma/schema.prisma
# Add your model changes

# 2. Create and apply migration
npm run prisma:migrate

# 3. Regenerate Prisma client
npm run prisma:generate
```

### Viewing Database

```bash
# Open Prisma Studio (GUI for database)
npm run prisma:studio

# Opens at http://localhost:5555
```

---

## Adding New Features

### Adding a New API Endpoint

1. **Create DTO** (if needed):
```typescript
// src/module-name/dto/action.dto.ts
import { IsString } from 'class-validator';

export class ActionDto {
  @IsString()
  field: string;
}
```

2. **Add Service Method**:
```typescript
// src/module-name/module-name.service.ts
async performAction(dto: ActionDto) {
  // Business logic here
  return await this.prisma.model.create({ data: dto });
}
```

3. **Add Controller Route**:
```typescript
// src/module-name/module-name.controller.ts
@Post('action')
@UseGuards(JwtAuthGuard)
async performAction(
  @CurrentUser() user: any,
  @Body() dto: ActionDto
) {
  return this.service.performAction(dto);
}
```

### Adding a WebSocket Event

```typescript
// In location.gateway.ts or create new gateway

@SubscribeMessage('newEvent')
async handleNewEvent(
  @ConnectedSocket() client: Socket,
  @MessageBody() data: any,
) {
  const userId = client.data.userId;
  
  // Process event
  
  // Emit to specific user
  this.server.to(socketId).emit('response', data);
  
  // Or broadcast to all
  this.server.emit('broadcast', data);
  
  return { success: true };
}
```

---

## Testing

### Manual API Testing with cURL

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"test","password":"test123"}'

# Login
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"test","password":"test123"}' \
  | jq -r '.token')

# Use token
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Testing with Postman

1. Import this collection:
```json
{
  "info": { "name": "Zenly API" },
  "item": [
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:3001/api/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\"emailOrUsername\":\"alice\",\"password\":\"password123\"}"
        }
      }
    }
  ]
}
```

2. Save token in environment variable
3. Use `{{token}}` in Authorization header

### WebSocket Testing

Create `test-ws.js`:
```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:3001/location', {
  auth: { token: 'YOUR_TOKEN' }
});

socket.on('connect', () => {
  console.log('Connected!');
  
  socket.emit('updateLocation', {
    latitude: 40.7128,
    longitude: -74.0060,
    status: 'Testing'
  });
});

socket.on('friendLocationUpdate', console.log);
socket.on('friendOnline', console.log);
socket.on('friendOffline', console.log);
```

Run: `node test-ws.js`

---

## Database Management

### Reset Database
```bash
# WARNING: Deletes all data!
npx prisma migrate reset
```

### Create New Migration
```bash
# After editing schema.prisma
npx prisma migrate dev --name description_of_changes
```

### View Database Schema
```bash
npx prisma studio
```

### Seed Database
```bash
npm run prisma:seed
```

### Backup Database
```bash
pg_dump zenly > backup.sql
```

### Restore Database
```bash
psql zenly < backup.sql
```

---

## Debugging

### Enable Debug Logging

In `.env`:
```env
NODE_ENV=development
LOG_LEVEL=debug
```

In code:
```typescript
console.log('Debug:', data);
// or
this.logger.debug('Message', context);
```

### Debug WebSocket Issues

```typescript
// In gateway
async handleConnection(client: Socket) {
  console.log('Client connecting:', client.id);
  console.log('Auth token:', client.handshake.auth.token);
  console.log('Headers:', client.handshake.headers);
  // ...
}
```

### Debug Database Queries

Enable query logging in `prisma.service.ts`:
```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

---

## Code Quality

### Linting
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

### Type Checking
```bash
npx tsc --noEmit
```

---

## Performance Tips

### Database Optimization

1. **Use Select to limit fields**:
```typescript
await this.prisma.user.findMany({
  select: {
    id: true,
    username: true,
    // Only needed fields
  }
});
```

2. **Use Pagination**:
```typescript
await this.prisma.user.findMany({
  skip: page * pageSize,
  take: pageSize,
});
```

3. **Add Indexes** in schema:
```prisma
model User {
  email String @unique
  
  @@index([username])
}
```

### WebSocket Optimization

1. **Throttle location updates**:
```typescript
// Client side - only send every 5 seconds
const throttledUpdate = throttle(updateLocation, 5000);
```

2. **Batch notifications**:
```typescript
// Send multiple updates at once
const updates = friends.map(f => ({ userId: f.id, ... }));
socket.emit('batchUpdate', updates);
```

---

## Environment Variables Reference

```env
# Required
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="your-secret-key"

# Optional
PORT=3001
NODE_ENV=development
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

---

## Common Prisma Commands

```bash
# Generate client
npx prisma generate

# Create migration
npx prisma migrate dev

# Deploy migrations (production)
npx prisma migrate deploy

# Pull schema from existing database
npx prisma db pull

# Push schema without migration
npx prisma db push

# Open Prisma Studio
npx prisma studio

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# Reset database
npx prisma migrate reset
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ...

# Commit
git add .
git commit -m "Add: new feature description"

# Push
git push origin feature/new-feature

# Create PR
```

### Commit Message Convention

```
Add: New feature
Fix: Bug fix
Update: Changes to existing feature
Remove: Deleted feature
Refactor: Code restructuring
Docs: Documentation updates
Test: Test additions
```

---

## Deployment

### Build for Production

```bash
# Build
npm run build

# The dist/ folder contains compiled code
```

### Environment Setup

1. Set production environment variables
2. Update DATABASE_URL to production database
3. Change JWT_SECRET to secure random string
4. Set NODE_ENV=production

### Deploy to Cloud

**Heroku:**
```bash
heroku create zenly-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

**Railway:**
```bash
railway login
railway init
railway up
```

**AWS/DigitalOcean:**
- Use PM2 for process management
- Setup Nginx as reverse proxy
- Configure SSL with Let's Encrypt

---

## Monitoring

### Add Logging

Install Winston:
```bash
npm install winston
```

Create logger:
```typescript
import * as winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

### Health Check Endpoint

```typescript
@Get('health')
async health() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
}
```

---

## Troubleshooting Guide

### Issue: "Cannot find module '@prisma/client'"
**Solution:**
```bash
npm run prisma:generate
```

### Issue: "Port already in use"
**Solution:**
```bash
lsof -ti:3001 | xargs kill -9
# or change PORT in .env
```

### Issue: "Database connection failed"
**Solution:**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Test connection: `psql $DATABASE_URL`

### Issue: "JWT token expired"
**Solution:**
- User needs to login again
- Or increase JWT_EXPIRATION in .env

### Issue: "WebSocket connection rejected"
**Solution:**
- Check JWT token is valid
- Verify token is sent in auth parameter
- Check CORS_ORIGIN matches client

---

## Best Practices

1. **Always validate input** with DTOs
2. **Use transactions** for multiple database operations
3. **Handle errors gracefully** with try-catch
4. **Log important events** for debugging
5. **Use environment variables** for configuration
6. **Test with seed data** before production
7. **Keep secrets secure** (never commit .env)
8. **Document new endpoints** in API_DOCS.md
9. **Use TypeScript types** everywhere
10. **Review code before committing**

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Socket.IO Documentation](https://socket.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [JWT.io](https://jwt.io)

---

**Happy developing! 🚀**

