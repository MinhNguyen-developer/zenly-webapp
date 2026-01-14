# Quick Start Guide - API Integration

This guide will help you get the integrated Friend Tracker app running.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- Git (optional)

## Backend Setup

### 1. Navigate to server directory
```bash
cd server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the `server` directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/zenly"

# JWT Secret (change this to a random string)
JWT_SECRET="your-super-secret-jwt-key-change-this"

# Server Port
PORT=3001

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"
```

### 4. Run database migrations
```bash
npx prisma migrate dev
```

### 5. (Optional) Seed the database
```bash
npm run prisma:seed
```

### 6. Start the backend server
```bash
npm run start:dev
```

The backend API should now be running at `http://localhost:3001`

## Frontend Setup

### 1. Open a new terminal and navigate to webapp directory
```bash
cd webapp
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the `webapp` directory:

```bash
VITE_API_URL=http://localhost:3001/api
```

### 4. Start the frontend development server
```bash
npm run dev
```

The frontend should now be running at `http://localhost:5173`

## Testing the Integration

### 1. Create User Accounts

1. Open `http://localhost:5173` in your browser
2. Click "Sign up" to create a new account
3. Fill in the registration form:
   - Email: user1@example.com
   - Username: user1
   - Name: User One
   - Password: password123
4. You should be automatically logged in and see the map

### 2. Create a Second User

1. Open an incognito/private browsing window
2. Go to `http://localhost:5173`
3. Create another account:
   - Email: user2@example.com
   - Username: user2
   - Name: User Two
   - Password: password123

### 3. Send Friend Request

Currently, friend requests need to be sent via API. You can use:

#### Option A: Using curl
```bash
# Get user2's ID first (login as user2)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"user2","password":"password123"}'

# Copy the token and user ID from the response

# Login as user1 and send friend request to user2
curl -X POST http://localhost:3001/api/friends/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_USER1_TOKEN" \
  -d '{"receiverId":"USER2_ID"}'
```

#### Option B: Using browser console
In user1's browser, open DevTools console and run:
```javascript
// Get user2's ID
const token = localStorage.getItem('authToken');
const searchResponse = await fetch('http://localhost:3001/api/users?search=user2', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const users = await searchResponse.json();
const user2 = users[0];

// Send friend request
const requestResponse = await fetch('http://localhost:3001/api/friends/request', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ receiverId: user2.id })
});
const result = await requestResponse.json();
console.log('Friend request sent:', result);
```

### 4. Accept Friend Request

In user2's browser console:
```javascript
// Get pending requests
const token = localStorage.getItem('authToken');
const response = await fetch('http://localhost:3001/api/friends/requests/pending', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const requests = await response.json();
const request = requests[0];

// Accept the request
const acceptResponse = await fetch(`http://localhost:3001/api/friends/request/${request.id}/accept`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
const result = await acceptResponse.json();
console.log('Friend request accepted:', result);
```

### 5. See Real-Time Location Updates

After accepting the friend request:
1. Refresh both browser windows
2. Grant location permissions when prompted
3. You should now see each other on the map!
4. Move your device or change location (can simulate in browser DevTools)
5. Watch the friend's marker update in real-time

## Features to Test

✅ **Authentication**
- Sign up
- Login
- Logout
- Auto-login on page refresh

✅ **Location Tracking**
- Browser geolocation permission
- Your location marker on map
- Location updates every 30 seconds
- WebSocket connection status (green "Live" indicator)

✅ **Friends Display**
- Friends list in sidebar
- Friend markers on map
- Click friend to select
- Navigation to friend
- Status display

✅ **Real-Time Updates**
- Friend location updates instantly
- Friend comes online/offline
- WebSocket connection indicator

✅ **Navigation**
- Click friend marker or sidebar item
- Show route on map
- Open in Google Maps

## Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify DATABASE_URL in .env
- Run `npx prisma generate` to generate Prisma client

### Frontend can't connect to backend
- Check if backend is running on port 3001
- Verify VITE_API_URL in frontend .env
- Check browser console for CORS errors

### Location not working
- Grant location permissions in browser
- Check browser console for errors
- Default location (NYC) is used if permissions denied

### Friends not showing up
- Verify friend request was accepted
- Check if both users have shared their location
- Refresh the page
- Check WebSocket connection (green "Live" indicator)

### WebSocket not connecting
- Check if backend is running
- Verify JWT token is valid
- Check browser console for errors
- Try logging out and back in

## API Endpoints Quick Reference

### Authentication
- POST `/api/auth/register` - Create account
- POST `/api/auth/login` - Sign in
- GET `/api/auth/me` - Get current user

### Friends
- POST `/api/friends/request` - Send friend request
- POST `/api/friends/request/:id/accept` - Accept request
- GET `/api/friends/requests/pending` - Get pending requests
- GET `/api/friends` - Get friends list

### Location
- POST `/api/location` - Update location
- GET `/api/location/friends` - Get friends' locations

## Next Steps

The integration is complete! You can now:

1. **Add friend management UI** - Create pages to:
   - Search for users
   - Send friend requests
   - View and manage pending requests
   - Remove friends

2. **Add user profile** - Allow users to:
   - Update their profile
   - Change avatar
   - Update settings

3. **Improve UX** - Add:
   - Toast notifications
   - Better error messages
   - Loading skeletons
   - Animations

4. **Add features** - Consider:
   - Group locations
   - Location history
   - Custom status messages
   - Privacy settings

Happy coding! 🚀

