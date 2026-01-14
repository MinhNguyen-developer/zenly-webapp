# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123",
  "name": "John Doe" // optional
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe",
    "avatar": null,
    "createdAt": "2026-01-14T..."
  },
  "token": "jwt-token-here"
}
```

---

### Login
**POST** `/auth/login`

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "emailOrUsername": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe",
    "avatar": null,
    "createdAt": "2026-01-14T..."
  },
  "token": "jwt-token-here"
}
```

---

### Get Current User
**GET** `/auth/me` 🔒

Get the authenticated user's profile.

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "name": "John Doe",
  "avatar": null,
  "createdAt": "2026-01-14T..."
}
```

---

## User Endpoints

### Search Users
**GET** `/users?search=john` 🔒

Search for users by username, name, or email.

**Query Parameters:**
- `search` (optional): Search query

**Response:**
```json
[
  {
    "id": "uuid",
    "username": "johndoe",
    "name": "John Doe",
    "avatar": null,
    "email": "user@example.com"
  }
]
```

---

### Get User by ID
**GET** `/users/:id` 🔒

Get a user's profile by their ID.

**Response:**
```json
{
  "id": "uuid",
  "username": "johndoe",
  "name": "John Doe",
  "avatar": null,
  "email": "user@example.com",
  "createdAt": "2026-01-14T...",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "status": "Available",
    "updatedAt": "2026-01-14T..."
  }
}
```

---

### Get User by Username
**GET** `/users/username/:username` 🔒

Get a user's profile by their username.

**Response:** Same as Get User by ID

---

## Friend Endpoints

### Send Friend Request
**POST** `/friends/request` 🔒

Send a friend request to another user.

**Request Body:**
```json
{
  "receiverId": "user-uuid"
}
```

**Response:**
```json
{
  "id": "request-uuid",
  "senderId": "your-uuid",
  "receiverId": "user-uuid",
  "status": "PENDING",
  "createdAt": "2026-01-14T...",
  "sender": {
    "id": "your-uuid",
    "username": "johndoe",
    "name": "John Doe",
    "avatar": null
  },
  "receiver": {
    "id": "user-uuid",
    "username": "janedoe",
    "name": "Jane Doe",
    "avatar": null
  }
}
```

---

### Accept Friend Request
**POST** `/friends/request/:requestId/accept` 🔒

Accept a pending friend request.

**Response:**
```json
{
  "message": "Friend request accepted"
}
```

---

### Reject Friend Request
**POST** `/friends/request/:requestId/reject` 🔒

Reject a pending friend request.

**Response:**
```json
{
  "message": "Friend request rejected"
}
```

---

### Get Pending Requests
**GET** `/friends/requests/pending` 🔒

Get all pending friend requests you've received.

**Response:**
```json
[
  {
    "id": "request-uuid",
    "senderId": "user-uuid",
    "receiverId": "your-uuid",
    "status": "PENDING",
    "createdAt": "2026-01-14T...",
    "sender": {
      "id": "user-uuid",
      "username": "janedoe",
      "name": "Jane Doe",
      "avatar": null
    }
  }
]
```

---

### Get Sent Requests
**GET** `/friends/requests/sent` 🔒

Get all pending friend requests you've sent.

**Response:**
```json
[
  {
    "id": "request-uuid",
    "senderId": "your-uuid",
    "receiverId": "user-uuid",
    "status": "PENDING",
    "createdAt": "2026-01-14T...",
    "receiver": {
      "id": "user-uuid",
      "username": "janedoe",
      "name": "Jane Doe",
      "avatar": null
    }
  }
]
```

---

### Get Friends List
**GET** `/friends` 🔒

Get all your friends with their current locations.

**Response:**
```json
[
  {
    "id": "friend-uuid",
    "username": "janedoe",
    "name": "Jane Doe",
    "avatar": null,
    "location": {
      "latitude": 40.7614,
      "longitude": -73.9776,
      "status": "At work",
      "updatedAt": "2026-01-14T..."
    }
  }
]
```

---

### Remove Friend
**DELETE** `/friends/:friendId` 🔒

Remove a friend from your friends list.

**Response:**
```json
{
  "message": "Friend removed"
}
```

---

## Location Endpoints

### Update Location
**POST** `/location` 🔒

Update your current location.

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "status": "At home" // optional
}
```

**Response:**
```json
{
  "id": "location-uuid",
  "userId": "your-uuid",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "status": "At home",
  "updatedAt": "2026-01-14T...",
  "user": {
    "id": "your-uuid",
    "username": "johndoe",
    "name": "John Doe",
    "avatar": null
  }
}
```

---

### Get My Location
**GET** `/location/me` 🔒

Get your current location.

**Response:**
```json
{
  "id": "location-uuid",
  "userId": "your-uuid",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "status": "At home",
  "updatedAt": "2026-01-14T...",
  "user": {
    "id": "your-uuid",
    "username": "johndoe",
    "name": "John Doe",
    "avatar": null
  }
}
```

---

### Get Friends Locations
**GET** `/location/friends` 🔒

Get the current locations of all your friends.

**Response:**
```json
[
  {
    "id": "location-uuid",
    "userId": "friend-uuid",
    "latitude": 40.7614,
    "longitude": -73.9776,
    "status": "At work",
    "updatedAt": "2026-01-14T...",
    "user": {
      "id": "friend-uuid",
      "username": "janedoe",
      "name": "Jane Doe",
      "avatar": null
    }
  }
]
```

---

### Get User Location
**GET** `/location/:userId` 🔒

Get a specific user's location.

**Response:** Same as Get My Location

---

### Delete Location
**DELETE** `/location` 🔒

Delete your location data.

**Response:**
```json
{
  "message": "Location deleted"
}
```

---

## WebSocket Events

### Connection

Connect to the location namespace:
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001/location', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

---

### Client → Server Events

#### updateLocation
Update your location and broadcast to friends.

```javascript
socket.emit('updateLocation', {
  latitude: 40.7128,
  longitude: -74.0060,
  status: 'At home'
});
```

**Response:**
```javascript
{
  success: true,
  location: {
    latitude: 40.7128,
    longitude: -74.0060,
    status: 'At home'
  }
}
```

---

#### requestFriendsLocations
Request current locations of all friends.

```javascript
socket.emit('requestFriendsLocations');
```

**Response:**
```javascript
{
  success: true,
  locations: [
    {
      userId: 'friend-uuid',
      username: 'janedoe',
      name: 'Jane Doe',
      avatar: null,
      latitude: 40.7614,
      longitude: -73.9776,
      status: 'At work',
      updatedAt: '2026-01-14T...'
    }
  ]
}
```

---

### Server → Client Events

#### friendLocationUpdate
Receive updates when a friend's location changes.

```javascript
socket.on('friendLocationUpdate', (data) => {
  console.log(data);
  // {
  //   userId: 'friend-uuid',
  //   username: 'janedoe',
  //   name: 'Jane Doe',
  //   avatar: null,
  //   latitude: 40.7614,
  //   longitude: -73.9776,
  //   status: 'At work',
  //   updatedAt: '2026-01-14T...'
  // }
});
```

---

#### friendOnline
Receive notification when a friend comes online.

```javascript
socket.on('friendOnline', (data) => {
  console.log(data);
  // {
  //   userId: 'friend-uuid',
  //   username: 'janedoe',
  //   name: 'Jane Doe',
  //   avatar: null,
  //   location: {
  //     latitude: 40.7614,
  //     longitude: -73.9776,
  //     status: 'Available'
  //   }
  // }
});
```

---

#### friendOffline
Receive notification when a friend goes offline.

```javascript
socket.on('friendOffline', (data) => {
  console.log(data);
  // {
  //   userId: 'friend-uuid'
  // }
});
```

---

## Error Responses

All endpoints may return the following error formats:

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting in production.

## CORS

CORS is configured to accept requests from the frontend origin specified in the `.env` file.

