# Zenly Backend Server

A scalable NestJS backend application for real-time friend location tracking, built with TypeScript, Prisma, PostgreSQL, and WebSockets.

## Features

### 🔐 Authentication
- **User Registration** - Create new accounts with email, username, and password
- **User Login** - JWT-based authentication
- **Protected Routes** - Secure endpoints with JWT guards
- **Profile Management** - Get current user profile

### 👥 Friend Management
- **Send Friend Requests** - Add friends by user ID
- **Accept/Reject Requests** - Manage incoming friend requests
- **View Pending Requests** - See all incoming and outgoing requests
- **Friends List** - Get all friends with their locations
- **Remove Friends** - Unfriend users

### 📍 Real-time Location Tracking
- **WebSocket Connection** - Real-time bidirectional communication
- **Location Updates** - Broadcast location to friends automatically
- **Friends Locations** - Get real-time locations of all friends
- **Online/Offline Status** - Track friend availability
- **Location Privacy** - Only friends can see your location

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **Prisma** - Modern ORM for PostgreSQL
- **PostgreSQL** - Relational database
- **Socket.IO** - WebSocket implementation
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **class-validator** - DTO validation

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run start:dev
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/zenly?schema=public"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION="7d"

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:5173"
```

## Database Schema

### User
- id (UUID)
- email (unique)
- username (unique)
- password (hashed)
- name
- avatar
- createdAt, updatedAt

### Location
- id (UUID)
- userId (foreign key)
- latitude, longitude
- status
- updatedAt

### Friendship
- id (UUID)
- userId, friendId (foreign keys)
- Bidirectional relationship

### FriendRequest
- id (UUID)
- senderId, receiverId (foreign keys)
- status (PENDING, ACCEPTED, REJECTED)

## API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/me           - Get current user (protected)
```

### Users
```
GET    /api/users             - Search users (protected)
GET    /api/users/:id         - Get user by ID (protected)
GET    /api/users/username/:username - Get user by username (protected)
```

### Friends
```
POST   /api/friends/request   - Send friend request (protected)
POST   /api/friends/request/:id/accept - Accept request (protected)
POST   /api/friends/request/:id/reject - Reject request (protected)
GET    /api/friends/requests/pending - Get pending requests (protected)
GET    /api/friends/requests/sent - Get sent requests (protected)
GET    /api/friends           - Get all friends (protected)
DELETE /api/friends/:id       - Remove friend (protected)
```

### Location
```
POST   /api/location          - Update location (protected)
GET    /api/location/me       - Get my location (protected)
GET    /api/location/friends  - Get friends' locations (protected)
GET    /api/location/:userId  - Get user location (protected)
DELETE /api/location          - Delete location (protected)
```

## WebSocket Events

Connect to `ws://localhost:3001/location`

### Client -> Server

**Connect**
```javascript
const socket = io('http://localhost:3001/location', {
  auth: { token: 'your-jwt-token' }
});
```

**Update Location**
```javascript
socket.emit('updateLocation', {
  latitude: 40.7128,
  longitude: -74.0060,
  status: 'At home'
});
```

**Request Friends Locations**
```javascript
socket.emit('requestFriendsLocations');
```

### Server -> Client

**Friend Location Update**
```javascript
socket.on('friendLocationUpdate', (data) => {
  // { userId, username, name, latitude, longitude, status, updatedAt }
});
```

**Friend Online**
```javascript
socket.on('friendOnline', (data) => {
  // { userId, username, name, location }
});
```

**Friend Offline**
```javascript
socket.on('friendOffline', (data) => {
  // { userId }
});
```

## Scripts

```bash
# Development
npm run start:dev          # Start with hot-reload
npm run start:debug        # Start in debug mode

# Production
npm run build              # Build the project
npm run start:prod         # Run production build

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Open Prisma Studio (DB GUI)

# Testing
npm run test               # Run tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
```

## Project Structure

```
server/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── auth/                  # Authentication module
│   │   ├── dto/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/                 # Users module
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── friends/               # Friends module
│   │   ├── dto/
│   │   ├── friends.controller.ts
│   │   ├── friends.service.ts
│   │   └── friends.module.ts
│   ├── location/              # Location module
│   │   ├── dto/
│   │   ├── location.controller.ts
│   │   ├── location.service.ts
│   │   ├── location.gateway.ts
│   │   └── location.module.ts
│   ├── common/
│   │   ├── guards/
│   │   └── decorators/
│   ├── app.module.ts
│   ├── main.ts
│   └── prisma.service.ts
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Usage Example

### 1. Register a User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "password123",
    "name": "John Doe"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "johndoe",
    "password": "password123"
  }'
```

### 3. Update Location
```bash
curl -X POST http://localhost:3001/api/location \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "latitude": 40.7128,
    "longitude": -74.0060,
    "status": "Available"
  }'
```

### 4. Send Friend Request
```bash
curl -X POST http://localhost:3001/api/friends/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "receiverId": "user-uuid-here"
  }'
```

## Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth
- **Request Validation** - class-validator DTOs
- **CORS Protection** - Configurable origins
- **SQL Injection Prevention** - Prisma parameterized queries
- **WebSocket Authentication** - JWT token verification

## Performance & Scalability

- **Connection Pooling** - Prisma connection management
- **Efficient Queries** - Optimized database queries
- **WebSocket Namespaces** - Organized real-time events
- **Stateless Auth** - JWT tokens for horizontal scaling
- **Database Indexes** - Optimized for fast lookups

## License

MIT

