# 🧪 Testing Real-Time Friend Request Notifications

## Quick Test (2 Minutes)

### Prerequisites
```bash
# Terminal 1 - Start Backend
cd server
npm run start:dev

# Terminal 2 - Start Frontend  
cd webapp
npm run dev
```

---

## Test Scenario: Alice & Bob

### Step 1: Create Two Users

**Browser 1 - Alice:**
1. Open http://localhost:5173
2. Register:
   - Email: alice@test.com
   - Username: alice
   - Name: Alice Smith
   - Password: password123
3. Click "Add Friends" button
4. **Keep this page open and visible!**

**Browser 2 (Incognito) - Bob:**
1. Open incognito window
2. Go to http://localhost:5173
3. Register:
   - Email: bob@test.com
   - Username: bob
   - Name: Bob Johnson
   - Password: password123

---

### Step 2: Send Friend Request (As Bob)

**In Bob's browser:**
1. Click "Add Friends" button
2. Search: `alice`
3. Click "Add Friend" next to Alice Smith

**Watch Alice's browser:**
✨ **INSTANT notification appears!**
```
┌────────────────────────────────────────┐
│ 🔔 Bob Johnson sent you a friend      │
│    request!                        [X] │
└────────────────────────────────────────┘
```

**Also see:**
- 🔴 Red badge "1" appears on Alice's "Add Friends" button
- Bob appears in Alice's "Pending Requests" section

---

### Step 3: Accept Request (As Alice)

**In Alice's browser:**
1. In "Pending Requests" section
2. Click "Accept" next to Bob Johnson

**Watch Bob's browser:**
✨ **INSTANT notification appears!**
```
┌────────────────────────────────────────┐
│ 🔔 Alice Smith accepted your friend   │
│    request!                        [X] │
└────────────────────────────────────────┘
```

**Also see:**
- Bob removed from "Sent Requests"
- Alice appears on Bob's map with real-time location!
- Bob appears on Alice's map with real-time location!

---

## Test Scenario: Rejection

### Step 4: Test Rejection

**Create third user - Charlie:**
1. Open another incognito window
2. Register as charlie@test.com

**As Charlie:**
1. Click "Add Friends"
2. Search and send request to Alice

**As Alice:**
- ✨ Get instant notification from Charlie
- 🔴 Badge shows "1" again
- See Charlie in pending requests

**Alice rejects:**
1. Click "Reject" next to Charlie

**Watch Charlie's browser:**
✨ **INSTANT notification appears!**
```
┌────────────────────────────────────────┐
│ 🔔 Alice Smith rejected your friend   │
│    request                         [X] │
└────────────────────────────────────────┘
```

---

## Visual Test Checklist

### ✅ What to Verify

**Notifications:**
- [ ] Notification appears at top-right corner
- [ ] Shows correct sender/acceptor name
- [ ] Bell icon animates (pulse)
- [ ] Auto-dismisses after 5 seconds
- [ ] Can manually dismiss with X button
- [ ] Smooth slide-in animation

**Badge:**
- [ ] Red badge appears on "Add Friends" button
- [ ] Shows correct number
- [ ] Pulses/animates
- [ ] Updates in real-time
- [ ] Disappears when no pending requests

**Lists:**
- [ ] Pending requests list updates automatically
- [ ] Sent requests list updates automatically
- [ ] No manual refresh needed
- [ ] Items appear/disappear correctly

**Map Integration:**
- [ ] Friend appears on map after acceptance
- [ ] Location updates in real-time
- [ ] Navigation works
- [ ] Green "Live" indicator shows connection

---

## Timing Test

### Test Notification Speed

**Setup:**
1. Alice and Bob both have Friends Management open
2. Bob sends request to Alice
3. **Count the seconds** until Alice sees notification

**Expected:**
- ⚡ Notification appears in **under 1 second**
- 🔴 Badge updates **instantly**
- 📝 List updates **immediately**

**If delayed:**
- Check WebSocket connection (green "Live" indicator)
- Check browser console for errors
- Verify both users are logged in

---

## Network Test

### Test with Network Issues

**Disconnect Test:**
1. Alice has Friends Management open
2. Bob sends request
3. Alice gets notification ✅

**Reconnect Test:**
1. Turn off Alice's WiFi
2. Bob sends another request
3. Turn Alice's WiFi back on
4. Alice should get notification when reconnected ✅

**Multiple Requests:**
1. Bob, Charlie, and Dave all send requests to Alice
2. Alice should get 3 separate notifications
3. Badge should show "3"
4. All 3 appear in pending requests

---

## Browser Console Test

### Check WebSocket Events

**Open Browser Console (F12) in Alice's browser:**

When Bob sends request, you should see:
```
📬 Received friend request: {sender: {...}, id: "..."}
```

When Alice accepts:
Bob's console should show:
```
✅ Friend request accepted: {acceptedBy: {...}}
```

### Check Socket Connection

In console, type:
```javascript
// Should return true if connected
locationSocket.isConnected()
```

---

## Performance Test

### Load Testing

**Test with Multiple Users:**
1. Create 5 users
2. All send requests to User 1
3. User 1 should receive all 5 notifications
4. Badge shows "5"
5. All appear in list

**Stress Test:**
1. Send 10 requests rapidly
2. All should arrive
3. No duplicates
4. No lost notifications

---

## Edge Cases to Test

### Already Friends
- Send request to someone already a friend
- Should get error: "Already friends"

### Duplicate Request
- Send request twice
- Second attempt should fail
- Shows: "Friend request already exists"

### Request to Self
- Try to add yourself
- Should get error: "Cannot send friend request to yourself"

### Offline User
- User B is logged out
- User A sends request
- User B logs back in
- Request appears in pending list (from database)
- No live notification (user was offline)

---

## Debug Checklist

### If Notifications Don't Work

**Check Backend:**
```bash
cd server
npm run start:dev

# Should see:
# ✅ User xxx connected to location tracking
# 📬 Sent friend request notification to user xxx
```

**Check Frontend:**
1. Open browser console
2. Look for WebSocket errors
3. Check green "Live" indicator

**Common Issues:**

| Issue | Solution |
|-------|----------|
| No notification | Check WebSocket connection |
| Badge not updating | Refresh page |
| Notification not dismissing | Click X button |
| Can't send request | Check if already friends |
| Request not in list | Click "Add Friends" to refresh |

---

## Success Criteria

### ✅ Test Passed If:

1. **Speed**: Notifications appear in < 1 second
2. **Accuracy**: All events trigger correct notifications
3. **Reliability**: No lost notifications
4. **UX**: Smooth animations and transitions
5. **Badge**: Updates in real-time
6. **Lists**: Auto-refresh without manual action
7. **Map**: Friends appear after acceptance

---

## Video Test Sequence

### Record This Demo:

**Minute 0:00-0:30** - Setup
- Show both browser windows side-by-side
- Alice and Bob logged in

**Minute 0:30-1:00** - Send Request
- Bob clicks "Add Friends"
- Bob searches "alice"
- Bob clicks "Add Friend"
- **Show Alice's instant notification**

**Minute 1:00-1:30** - Accept Request
- Alice clicks "Accept"
- **Show Bob's instant notification**
- Show both users now see each other on map

**Minute 1:30-2:00** - Real-Time Location
- Move one user's location
- Show other user sees update instantly
- Demonstrate navigation feature

---

## Automated Test (Optional)

### Using Browser Console

**In Alice's browser:**
```javascript
// Listen for friend request
locationSocket.onFriendRequestReceived((data) => {
  console.log('✅ TEST PASSED: Received notification in', 
    performance.now(), 'ms');
});
```

**In Bob's browser:**
```javascript
// Send request
const startTime = performance.now();
// Click "Add Friend" in UI
```

**Expected Output:**
```
✅ TEST PASSED: Received notification in 234.5 ms
```

---

## 🎉 Test Complete!

If all checks pass, your real-time notifications are working perfectly!

**Key Indicators:**
- ✨ Instant notifications (< 1 second)
- 🔴 Badge updates automatically
- 📝 Lists refresh without manual action
- 🗺️ Friends appear on map after acceptance
- 🟢 "Live" indicator shows connection

**Ready for production!** 🚀

---

**Need help?** Check:
- `REALTIME_NOTIFICATIONS.md` - Feature documentation
- `HOW_TO_ADD_FRIENDS.md` - User guide
- Browser console for error messages

