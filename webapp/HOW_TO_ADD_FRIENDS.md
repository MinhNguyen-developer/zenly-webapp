# How to Add Friends - User Guide

## Quick Steps

1. **Open the app** at http://localhost:5173
2. **Click the "Add Friends" button** in the top header (next to the friend count)
3. **Search for users** by username, name, or email
4. **Click "Add Friend"** on the user you want to add
5. **Wait for them to accept** your friend request

That's it! Once accepted, you'll see each other on the map in real-time! 🎉

---

## Detailed Guide

### Step 1: Access Friends Management

Once logged in, look at the top header of the map page. You'll see:
- Your friend count (e.g., "0 Friends")
- An **"Add Friends"** button with a UserPlus icon
- Click this button to open the Friends Management page

### Step 2: Search for Users

In the Friends Management page, you'll see:

**Search Users Section:**
- Enter a search query (username, name, or email)
- Click "Search" button
- Results will appear below

**Example searches:**
- Search: `user2` - finds users with "user2" in their username
- Search: `John` - finds users named John
- Search: `test@example.com` - finds user by email

### Step 3: Send Friend Request

When you find someone:
1. Review their profile (name and username)
2. Click the **"Add Friend"** button next to their name
3. You'll see a confirmation: "Friend request sent!"
4. The button changes to "Request Sent" ✓

### Step 4: Manage Requests

**Received Requests (Pending Requests):**
- See friend requests others sent to you
- Click **"Accept"** to add them as a friend
- Click **"Reject"** to decline the request
- A notification badge shows the count

**Sent Requests:**
- View friend requests you've sent
- Shows "Pending..." status
- Wait for the other user to accept

### Step 5: See Friends on Map

Once a friend request is accepted:
1. **Close** the Friends Management page (X button)
2. **Return to the map**
3. Your new friend appears as a marker on the map!
4. Their location updates in real-time

---

## Features

### 🔍 User Search
- Search by username, name, or email
- Instant results
- Shows user profile before sending request

### 📨 Friend Requests
- **Send requests** to any user
- **Accept/Reject** incoming requests
- **Track sent requests** - see who you're waiting for
- **Notification badges** - see pending request count

### 👥 Friends List
- View all accepted friends
- See friend count in header
- Real-time location updates on map

### ✨ Smart Features
- Can't send duplicate requests
- "Request Sent" indicator
- Empty states when no requests
- Loading indicators
- Error handling with alerts

---

## Testing With Multiple Users

### Create Two Users

**User 1:**
1. Register at http://localhost:5173
   - Email: alice@test.com
   - Username: alice
   - Password: password123

**User 2 (Incognito/Private Window):**
1. Open incognito window
2. Go to http://localhost:5173
3. Register:
   - Email: bob@test.com
   - Username: bob
   - Password: password123

### Add Each Other

**As Alice:**
1. Click "Add Friends"
2. Search: `bob`
3. Click "Add Friend" on Bob's profile
4. Close Friends Management

**As Bob:**
1. Click "Add Friends"
2. See Alice's request in "Pending Requests"
3. Click "Accept"
4. Close Friends Management

**Result:**
- Both users now see each other on the map! 🎉
- Location updates in real-time
- Green "Live" indicator shows WebSocket connection

---

## Troubleshooting

### "No users found"
- Check your search query spelling
- Try searching by username instead of name
- Make sure other users exist in the database

### Request not showing up
- Refresh the Friends Management page
- Make sure you're logged in
- Check if request was already sent

### Friend not appearing on map
- Make sure friend request was accepted (not just sent)
- Check if friend has shared their location
- Refresh the page
- Look for the green "Live" indicator (WebSocket connected)

### Can't see friend's location
- Friend must be logged in
- Friend must have granted location permissions
- Check WebSocket connection (green "Live" badge)
- Try refreshing both browsers

---

## Tips

💡 **Quick Add**: Use the search to find friends quickly by username

💡 **Batch Requests**: Send multiple friend requests before closing the page

💡 **Check Regularly**: Open Friends Management to check for new pending requests

💡 **Real-Time**: Once friends, locations update automatically - no refresh needed!

💡 **Privacy**: Only accepted friends can see your location

---

## UI Overview

```
┌─────────────────────────────────────────────────┐
│  Friends Management                          [X] │
├─────────────────────────────────────────────────┤
│                                                  │
│  🔍 Search Users                                │
│  ┌────────────────────────────────────┐         │
│  │ Search by username, name, email... │ Search  │
│  └────────────────────────────────────┘         │
│                                                  │
│  Search Results:                                │
│  ┌──────────────────────────────────────┐       │
│  │ 👤 John Doe (@johndoe)   [Add Friend]│       │
│  └──────────────────────────────────────┘       │
│                                                  │
│  📨 Pending Requests (2)                        │
│  ┌──────────────────────────────────────┐       │
│  │ 👤 Alice (@alice)  [Accept] [Reject] │       │
│  │ 👤 Bob (@bob)      [Accept] [Reject] │       │
│  └──────────────────────────────────────┘       │
│                                                  │
│  📤 Sent Requests (1)                           │
│  ┌──────────────────────────────────────┐       │
│  │ 👤 Charlie (@charlie)     Pending... │       │
│  └──────────────────────────────────────┘       │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## Next Steps

After adding friends:
1. ✅ See them on the map
2. ✅ Track their real-time location
3. ✅ Navigate to their location
4. ✅ See when they go online/offline

Enjoy tracking your friends! 🗺️👥

