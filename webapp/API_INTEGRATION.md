# API Integration Documentation

This document describes how the frontend is integrated with the backend API.

## Architecture

The frontend is built with React + TypeScript and integrates with the NestJS backend through:

1. **REST API** - For data operations (CRUD)
2. **WebSocket** - For real-time location updates

## Setup

### Environment Variables

Create a `.env` file in the webapp directory:

```bash
VITE_API_URL=http://localhost:3001/api
```

### Dependencies

The following packages are used for API integration:

- `socket.io-client` - WebSocket client for real-time updates

Install dependencies:

```bash
cd webapp
npm install
```

## Project Structure

```
webapp/src/
├── lib/
│   ├── api.ts          # Base API client with auth
│   ├── auth.ts         # Authentication service
│   ├── friends.ts      # Friends management service
│   ├── location.ts     # Location service
│   ├── users.ts        # User search service
│   └── socket.ts       # WebSocket connection
├── hooks/
│   ├── useAuth.tsx     # Authentication hook & context
│   ├── useFriends.ts   # Friends management hook
│   └── useLocation.ts  # Location & real-time updates hook
└── pages/
    ├── Login.tsx       # Login/Register page
    └── Zenly.tsx       # Main map view
```

## Services Layer

### API Client (`lib/api.ts`)

Base client that handles:
- Token storage and retrieval
- Authorization headers
- Error handling
- Base URL configuration

### Authentication Service (`lib/auth.ts`)

Provides:
- `register()` - Create new account
- `login()` - Authenticate user
- `getCurrentUser()` - Get current user data
- `logout()` - Clear session
- `isAuthenticated()` - Check auth status

### Friends Service (`lib/friends.ts`)

Provides:
- `sendRequest()` - Send friend request
- `acceptRequest()` - Accept friend request
- `rejectRequest()` - Reject friend request
- `getPendingRequests()` - Get incoming requests
- `getSentRequests()` - Get outgoing requests
- `getFriends()` - Get friends list
- `removeFriend()` - Remove a friend

### Location Service (`lib/location.ts`)

Provides:
- `updateLocation()` - Update current location
- `getMyLocation()` - Get own location
- `getFriendsLocations()` - Get all friends' locations
- `getUserLocation()` - Get specific user location
- `deleteLocation()` - Clear location data

### Users Service (`lib/users.ts`)

Provides:
- `searchUsers()` - Search for users
- `getUserById()` - Get user by ID
- `getUserByUsername()` - Get user by username

### WebSocket Client (`lib/socket.ts`)

Manages real-time location updates:
- Auto-connects with JWT token
- Emits `updateLocation` events
- Listens for `friendLocationUpdate`, `friendOnline`, `friendOffline`
- Handles reconnection

## Hooks Layer

### useAuth Hook

Provides authentication state and actions:

```typescript
const {
  user,              // Current user object
  isLoading,         // Loading state
  isAuthenticated,   // Auth status
  login,             // Login function
  register,          // Register function
  logout,            // Logout function
  refetchUser        // Refresh user data
} = useAuth();
```

### useFriends Hook

Manages friends list:

```typescript
const {
  friends,          // Friends array
  isLoading,        // Loading state
  error,            // Error message
  refetch,          // Refresh friends
  removeFriend      // Remove friend function
} = useFriends();
```

### useFriendRequests Hook

Manages friend requests:

```typescript
const {
  pendingRequests,  // Incoming requests
  sentRequests,     // Outgoing requests
  isLoading,
  error,
  refetch,
  sendRequest,      // Send new request
  acceptRequest,    // Accept request
  rejectRequest     // Reject request
} = useFriendRequests();
```

### useLocation Hook

Manages location and real-time updates:

```typescript
const {
  friendsLocations,    // Array of friends' locations
  isLoading,
  error,
  isSocketConnected,   // WebSocket status
  updateLocation,      // Update own location
  refetch              // Refresh locations
} = useLocation();
```

## Component Integration

### App.tsx

- Wraps app with `AuthProvider`
- Shows `LoginPage` if not authenticated
- Shows `BasicMapExample` (main map) if authenticated

### Login.tsx

- Login/Register forms
- Handles authentication
- Redirects to map on success

### Zenly.tsx (Main Map)

Integrates all hooks:

1. **Authentication**: Uses `useAuth()` to get user data and logout
2. **Friends**: Uses `useFriends()` to display friends (not yet shown on map, but ready)
3. **Location**: Uses `useLocation()` to:
   - Get friends' locations in real-time
   - Update own location every 30 seconds
   - Show connection status
4. **Map Display**: 
   - Shows user location
   - Shows friends as markers
   - Enables navigation between locations

## Real-time Updates

The app uses WebSocket for real-time updates:

1. **On Connect**: Automatically requests friends' locations
2. **On friendLocationUpdate**: Updates friend marker position
3. **On friendOnline**: Adds friend to map
4. **On friendOffline**: Removes friend from map

Location is updated:
- On page load
- Every 30 seconds automatically
- Via WebSocket (instant updates to friends)

## Authentication Flow

1. User opens app → Shows login page
2. User registers/logs in → Token stored in localStorage
3. Token included in all API requests via `Authorization: Bearer <token>`
4. Token included in WebSocket connection for real-time features
5. On logout → Token removed, redirected to login

## Error Handling

- **API Errors**: Caught and displayed to user
- **Network Errors**: Gracefully handled with fallback messages
- **Auth Errors**: Auto-logout on 401, redirect to login
- **Location Errors**: Falls back to default location (NYC)

## Testing the Integration

1. Start the backend server:
   ```bash
   cd server
   npm run start:dev
   ```

2. Start the frontend:
   ```bash
   cd webapp
   npm run dev
   ```

3. Create accounts and test:
   - Register 2+ users
   - Log in as user 1
   - Send friend request to user 2
   - Log in as user 2 (different browser/incognito)
   - Accept friend request
   - Both users should see each other on the map in real-time

## API Endpoints Used

### Authentication
- POST `/auth/register` - Create account
- POST `/auth/login` - Sign in
- GET `/auth/me` - Get current user

### Friends
- POST `/friends/request` - Send friend request
- POST `/friends/request/:id/accept` - Accept request
- POST `/friends/request/:id/reject` - Reject request
- GET `/friends/requests/pending` - Get pending requests
- GET `/friends/requests/sent` - Get sent requests
- GET `/friends` - Get friends list
- DELETE `/friends/:id` - Remove friend

### Location
- POST `/location` - Update location
- GET `/location/me` - Get own location
- GET `/location/friends` - Get friends' locations
- GET `/location/:userId` - Get user location
- DELETE `/location` - Delete location

### Users
- GET `/users?search=query` - Search users
- GET `/users/:id` - Get user by ID
- GET `/users/username/:username` - Get user by username

### WebSocket Events
- `updateLocation` - Send location update
- `requestFriendsLocations` - Request friends locations
- `friendLocationUpdate` - Receive friend location update
- `friendOnline` - Friend comes online
- `friendOffline` - Friend goes offline

## Future Enhancements

Potential improvements:

1. **Friend Management UI**: Add UI for sending/managing friend requests
2. **User Search**: Add search interface to find and add friends
3. **Location History**: Track and display location history
4. **Notifications**: Show notifications for friend requests and location updates
5. **Settings**: Add user preferences (privacy, notification settings)
6. **Profile**: User profile editing
7. **Offline Mode**: Handle offline scenarios better
8. **Error Boundaries**: Add React error boundaries
9. **Loading States**: Improve loading indicators
10. **Optimistic Updates**: Update UI before API confirmation

