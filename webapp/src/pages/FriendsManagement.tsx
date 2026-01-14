import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Search, Check, X, Loader2, Users, Bell } from 'lucide-react';
import { usersService } from '@/lib/users';
import { useFriendRequests } from '@/hooks/useFriends';
import { User } from '@/lib/auth';
import { locationSocket } from '@/lib/socket';

export function FriendsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const {
    pendingRequests,
    sentRequests,
    isLoading,
    sendRequest,
    acceptRequest,
    rejectRequest,
    refetch,
  } = useFriendRequests();

  // Listen for real-time friend request notifications
  useEffect(() => {
    const socket = locationSocket.getSocket();
    if (!socket) return;

    // When someone sends you a friend request
    const handleFriendRequestReceived = (data: any) => {
      console.log('📬 Received friend request:', data);
      setNotification(`${data.sender.name || data.sender.username} sent you a friend request!`);
      refetch(); // Refresh the pending requests list

      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    };

    // When someone accepts your friend request
    const handleFriendRequestAccepted = (data: any) => {
      console.log('✅ Friend request accepted:', data);
      setNotification(`${data.acceptedBy.name || data.acceptedBy.username} accepted your friend request!`);
      refetch(); // Refresh lists

      setTimeout(() => setNotification(null), 5000);
    };

    // When someone rejects your friend request
    const handleFriendRequestRejected = (data: any) => {
      console.log('❌ Friend request rejected:', data);
      setNotification(`${data.rejectedBy.name || data.rejectedBy.username} rejected your friend request`);
      refetch(); // Refresh lists

      setTimeout(() => setNotification(null), 5000);
    };

    locationSocket.onFriendRequestReceived(handleFriendRequestReceived);
    locationSocket.onFriendRequestAccepted(handleFriendRequestAccepted);
    locationSocket.onFriendRequestRejected(handleFriendRequestRejected);

    return () => {
      locationSocket.offFriendRequestReceived(handleFriendRequestReceived);
      locationSocket.offFriendRequestAccepted(handleFriendRequestAccepted);
      locationSocket.offFriendRequestRejected(handleFriendRequestRejected);
    };
  }, [refetch]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);
    try {
      const results = await usersService.searchUsers(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        setError('No users found');
      }
    } catch (err: unknown) {
      setError('Failed to search users');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    try {
      await sendRequest(userId);
      setSearchResults([]);
      setSearchQuery('');
      alert('Friend request sent!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send friend request';
      alert(errorMessage);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptRequest(requestId);
      alert('Friend request accepted!');
      refetch();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept request';
      alert(errorMessage);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectRequest(requestId);
      alert('Friend request rejected');
      refetch();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject request';
      alert(errorMessage);
    }
  };

  const isRequestSent = (userId: string) => {
    return sentRequests.some((req) => req.receiverId === userId);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      {/* Real-time Notification Banner */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right">
          <Card className="border-primary bg-primary/5">
            <CardContent className="p-4 flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary animate-pulse" />
              <p className="font-medium text-sm">{notification}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNotification(null)}
                className="ml-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
          <Users className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Friends Management</h1>
          <p className="text-muted-foreground">Search for users and manage friend requests</p>
        </div>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Users
          </CardTitle>
          <CardDescription>Find friends by username, name, or email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by username, name, or email..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2 mt-4">
                <h3 className="font-semibold text-sm text-muted-foreground">Search Results</h3>
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white font-bold">
                          {user.name?.charAt(0) || user.username.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{user.name || user.username}</p>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSendRequest(user.id)}
                      disabled={isRequestSent(user.id)}
                    >
                      {isRequestSent(user.id) ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Request Sent
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add Friend
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Pending Friend Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Pending Requests
            {pendingRequests.length > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
                {pendingRequests.length}
              </span>
            )}
          </CardTitle>
          <CardDescription>Friend requests you've received</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No pending friend requests</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white font-bold">
                        {request.sender?.name?.charAt(0) || request.sender?.username.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">
                        {request.sender?.name || request.sender?.username}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @{request.sender?.username}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sent Friend Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Sent Requests
            {sentRequests.length > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                {sentRequests.length}
              </span>
            )}
          </CardTitle>
          <CardDescription>Friend requests you've sent</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : sentRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No sent requests</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sentRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {request.receiver?.name?.charAt(0) || request.receiver?.username.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">
                        {request.receiver?.name || request.receiver?.username}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @{request.receiver?.username}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Pending...</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

