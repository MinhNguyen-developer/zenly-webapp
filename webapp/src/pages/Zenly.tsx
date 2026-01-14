import { useState, useEffect, useRef } from "react";
import { Map, MapMarker, MarkerContent, MarkerPopup, MapRoute } from "@/components/ui/map";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation, MapPin, Users, Loader2, X, LogOut, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";
import { useFriendRequests } from "@/hooks/useFriends";
import { FriendsManagement } from "@/pages/FriendsManagement.tsx";
import type { Map as MapLibreMap } from "maplibre-gl";

interface FriendWithLocation {
  id: string;
  name: string;
  username: string;
  latitude: number;
  longitude: number;
  status?: string;
}

type UserLocation = { latitude: number; longitude: number } | null;

export function BasicMapExample() {
    const { user, logout } = useAuth();
    const { friendsLocations, updateLocation, isSocketConnected } = useLocation();
    const { pendingRequests } = useFriendRequests();

    const mapRef = useRef<MapLibreMap | null>(null);
    const [userLocation, setUserLocation] = useState<UserLocation>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);
    const [selectedFriend, setSelectedFriend] = useState<FriendWithLocation | null>(null);
    const [showNavigation, setShowNavigation] = useState(false);
    const [showFriendsManagement, setShowFriendsManagement] = useState(false);

    // Convert API data to display format
    const displayFriends: FriendWithLocation[] = friendsLocations
        .filter((loc) => loc.latitude && loc.longitude)
        .map((loc) => ({
            id: loc.userId,
            name: loc.user?.name || loc.user?.username || 'Unknown',
            username: loc.user?.username || '',
            latitude: loc.latitude,
            longitude: loc.longitude,
            status: loc.status,
        }));

    // Request user location on mount and update to server
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    setUserLocation(coords);
                    setIsLoadingLocation(false);

                    // Update location to server
                    try {
                        await updateLocation(coords.latitude, coords.longitude, "Available");
                    } catch (error) {
                        console.error("Failed to update location to server:", error);
                    }
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocationError(error.message);
                    setIsLoadingLocation(false);
                    // Set default location (New York City) if permission denied
                    setUserLocation({ latitude: 40.7128, longitude: -74.006 });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );

            // Update location periodically (every 30 seconds)
            const locationInterval = setInterval(() => {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const coords = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        };
                        setUserLocation(coords);

                        try {
                            await updateLocation(coords.latitude, coords.longitude, "Available");
                        } catch (error) {
                            console.error("Failed to update location:", error);
                        }
                    },
                    (error) => {
                        console.error("Error updating location:", error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0,
                    }
                );
            }, 30000); // 30 seconds

            return () => clearInterval(locationInterval);
        } else {
            setLocationError("Geolocation is not supported by your browser");
            setIsLoadingLocation(false);
            setUserLocation({ latitude: 40.7128, longitude: -74.006 });
        }
    }, [updateLocation]);

    const handleFriendClick = (friend: FriendWithLocation) => {
        setSelectedFriend(friend);
        setShowNavigation(false);

        // Fly to friend's location with zoom
        if (mapRef.current) {
            mapRef.current.flyTo({
                center: [friend.longitude, friend.latitude],
                zoom: 15, // Zoom in closer to the friend
                duration: 1500, // Animation duration in milliseconds
                essential: true // This animation is considered essential with respect to prefers-reduced-motion
            });
        }
    };

    const handleNavigate = () => {
        if (selectedFriend) {
            setShowNavigation(true);
        }
    };

    const handleCloseNavigation = () => {
        setShowNavigation(false);
        setSelectedFriend(null);
    };

    const handleLogout = () => {
        logout();
    };

    // Calculate map center based on user location or default
    const mapCenter: [number, number] = userLocation
        ? [userLocation.longitude, userLocation.latitude]
        : [-73.9680, 40.7580];

    return (
        <div className="h-screen w-full flex flex-col bg-background">
            {/* Header */}
            <header className="border-b bg-card shadow-sm z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                                <MapPin className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Friend Tracker</h1>
                                <p className="text-sm text-muted-foreground">
                                    Track your friends in real-time
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {isSocketConnected && (
                                <div className="flex items-center gap-2 text-xs text-green-600">
                                    <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
                                    Live
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm font-medium">{displayFriends.length} Friends</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFriendsManagement(true)}
                                className="h-8 relative"
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add Friends
                                {pendingRequests.length > 0 && (
                                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold animate-pulse">
                                        {pendingRequests.length}
                                    </span>
                                )}
                            </Button>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{user?.username}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="h-8"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 relative">
                {isLoadingLocation ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
                        <Card className="w-80">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Getting your location...
                                </CardTitle>
                                <CardDescription>
                                    Please allow location access to see your position on the map
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                ) : null}

                {locationError && !isLoadingLocation ? (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
                        <Card className="w-96 border-destructive">
                            <CardHeader>
                                <CardTitle className="text-destructive">Location Access Required</CardTitle>
                                <CardDescription>
                                    {locationError}. Using default location (NYC). Please enable location services to see your actual position.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                ) : null}

                {/* Only show map when user location is available */}
                {userLocation && (
                    <Map ref={mapRef} center={mapCenter} zoom={13}>
                    {/* User Location Marker */}
                    {userLocation && (
                        <MapMarker
                            longitude={userLocation.longitude}
                            latitude={userLocation.latitude}
                        >
                            <MarkerContent>
                                <div className="relative">
                                    <div className="absolute -inset-2 bg-blue-500/30 rounded-full animate-ping" />
                                    <div className="relative h-6 w-6 rounded-full border-4 border-white bg-blue-500 shadow-lg">
                                        <div className="absolute inset-0 rounded-full bg-linear-to-br from-blue-400 to-blue-600" />
                                    </div>
                                </div>
                            </MarkerContent>
                            <MarkerPopup closeButton>
                                <Card className="border-0 shadow-none">
                                    <CardHeader className="p-3">
                                        <CardTitle className="text-sm">Your Location</CardTitle>
                                        <CardDescription className="text-xs">
                                            Lat: {userLocation.latitude.toFixed(4)}, Lng: {userLocation.longitude.toFixed(4)}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </MarkerPopup>
                        </MapMarker>
                    )}

                    {/* Friend Markers */}
                    {displayFriends.map((friend, index) => (
                        <MapMarker
                            key={friend.id}
                            longitude={friend.longitude}
                            latitude={friend.latitude}
                            onClick={() => handleFriendClick(friend)}
                        >
                            <MarkerContent>
                                <div className={`relative cursor-pointer transition-transform hover:scale-110 ${
                                    selectedFriend?.id === friend.id ? 'scale-125' : ''
                                }`}>
                                    <div className="h-8 w-8 rounded-full border-3 border-white shadow-lg overflow-hidden"
                                         style={{ backgroundColor: `hsl(${index * 90}, 70%, 50%)` }}>
                                        <div className="h-full w-full flex items-center justify-center text-white font-bold text-sm">
                                            {friend.name.charAt(0)}
                                        </div>
                                    </div>
                                    {selectedFriend?.id === friend.id && (
                                        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                                    )}
                                </div>
                            </MarkerContent>
                            <MarkerPopup closeButton>
                                <Card className="border-0 shadow-none">
                                    <CardHeader className="p-3">
                                        <CardTitle className="text-sm">{friend.name}</CardTitle>
                                        <CardDescription className="text-xs">
                                            {friend.status || `@${friend.username}`}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-3 pt-0">
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setSelectedFriend(friend);
                                                handleNavigate();
                                            }}
                                            className="w-full"
                                        >
                                            <Navigation className="h-3 w-3" />
                                            Navigate
                                        </Button>
                                    </CardContent>
                                </Card>
                            </MarkerPopup>
                        </MapMarker>
                    ))}

                    {/* Navigation Route */}
                    {showNavigation && selectedFriend && userLocation && (
                        <MapRoute
                            coordinates={[
                                [userLocation.longitude, userLocation.latitude],
                                [selectedFriend.longitude, selectedFriend.latitude],
                            ]}
                            color="#3B82F6"
                            width={4}
                        />
                    )}
                    </Map>
                )}

                {/* Friend List Sidebar - only show when location is available */}
                {userLocation && (
                    <div className="absolute top-4 right-4 w-80 max-h-[calc(100vh-8rem)] overflow-y-auto z-40">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Friends Nearby</CardTitle>
                            <CardDescription>
                                {displayFriends.length === 0
                                    ? 'No friends online'
                                    : 'Click on a friend to see details'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {displayFriends.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    <p>No friends online yet.</p>
                                    <p className="mt-2">Add friends to start tracking!</p>
                                </div>
                            ) : (
                                displayFriends.map((friend, index) => (
                                <div
                                    key={friend.id}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                                        selectedFriend?.id === friend.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border bg-card hover:border-primary/50'
                                    }`}
                                    onClick={() => handleFriendClick(friend)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                                            style={{ backgroundColor: `hsl(${index * 90}, 70%, 50%)` }}
                                        >
                                            {friend.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm truncate">{friend.name}</h3>
                                            <p className="text-xs text-muted-foreground">
                                                {friend.status || `@${friend.username}`}
                                            </p>
                                        </div>
                                        {selectedFriend?.id === friend.id && (
                                            <Button
                                                size="sm"
                                                variant="default"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleNavigate();
                                                }}
                                            >
                                                <Navigation className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                            )}
                        </CardContent>
                    </Card>
                    </div>
                )}

                {/* Navigation Panel */}
                {showNavigation && selectedFriend && userLocation && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-96 z-40">
                        <Card className="border-primary">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Navigation className="h-5 w-5 text-primary" />
                                            Navigation to {selectedFriend.name}
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            Route shown on map
                                        </CardDescription>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={handleCloseNavigation}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            Your Location
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">to</div>
                                    <div className="flex-1 text-right">
                                        <div className="flex items-center justify-end gap-2 text-muted-foreground">
                                            {selectedFriend.name}
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => {
                                            // Open in external navigation app
                                            const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${selectedFriend.latitude},${selectedFriend.longitude}`;
                                            window.open(url, '_blank');
                                        }}
                                    >
                                        Open in Google Maps
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Friends Management Modal */}
                {showFriendsManagement && (
                    <div className="absolute inset-0 bg-background z-50 overflow-y-auto">
                        <div className="sticky top-0 bg-background border-b z-10 p-4">
                            <div className="container mx-auto flex items-center justify-between">
                                <h2 className="text-xl font-bold">Friends Management</h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowFriendsManagement(false)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <FriendsManagement />
                    </div>
                )}
            </div>
        </div>
    );
}

