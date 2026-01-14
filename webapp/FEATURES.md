# Friend Tracker - Position Tracker Web App

A modern, responsive web application for tracking friends' locations in real-time, built with React, TypeScript, MapLibre GL, and shadcn/ui.

## Features

### 🎯 Core Functionality

- **Browser Geolocation**: Automatically requests and displays user's current location
- **Friend Markers**: Shows friends on the map with distinct color-coded markers
- **User Marker**: Displays your current position with a pulsing blue marker
- **Navigation**: Click on any friend to navigate from your current position to their location
- **Route Display**: Visual route line shown on the map when navigating to a friend
- **Real-time Updates**: Markers update dynamically based on location data

### 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Clean Interface**: Modern, professional design using shadcn/ui components
- **Interactive Map**: Built with MapLibre GL for smooth interactions
- **Friend List Sidebar**: Quick access to all friends with status information
- **Popup Details**: Click markers to see detailed friend information
- **Dark/Light Theme**: Automatic theme switching support
- **Loading States**: Elegant loading indicators during location fetch
- **Error Handling**: Graceful fallback when location permissions are denied

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **MapLibre GL** - Map rendering
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI components
- **next-themes** - Theme management
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Browser Permissions

The app requires browser geolocation permissions to display your current location. When prompted:

1. Click "Allow" to enable location tracking
2. If denied, the app will use a default location (New York City)
3. You can change permissions in your browser settings at any time

## Usage

### Viewing Your Location

- Your position is shown as a pulsing blue marker on the map
- Click on your marker to see exact coordinates

### Viewing Friends

- Friends appear as colored circle markers with their initials
- Each friend has a unique color for easy identification
- Click the friend list sidebar to quickly locate specific friends

### Navigation

1. Click on any friend marker or select from the sidebar
2. Click the "Navigate" button in the popup
3. A blue route line will appear showing the path
4. Click "Open in Google Maps" to use external navigation

### Map Controls

- **Zoom**: Use mouse wheel or pinch gesture
- **Pan**: Click and drag the map
- **Markers**: Click to interact with user/friend markers

## Project Structure

```
src/
├── components/
│   └── ui/
│       ├── map.tsx          # Map components (MapLibre wrapper)
│       ├── button.tsx       # Button component
│       └── card.tsx         # Card components
├── pages/
│   └── Zenly.tsx           # Main position tracker page
├── lib/
│   └── utils.ts            # Utility functions
├── App.tsx                 # Root component
├── main.tsx               # App entry point
└── index.css              # Global styles
```

## Customization

### Adding Real Friends Data

Replace the `mockFriends` array in `src/pages/Zenly.tsx` with your API:

```typescript
// Fetch from your API
const [friends, setFriends] = useState([]);

useEffect(() => {
  fetch('/api/friends')
    .then(res => res.json())
    .then(data => setFriends(data));
}, []);
```

### Changing Map Style

Edit the map styles in `src/components/ui/map.tsx` or pass custom styles:

```typescript
<Map
  center={mapCenter}
  zoom={13}
  styles={{
    light: "your-light-style-url",
    dark: "your-dark-style-url"
  }}
/>
```

### Customizing Colors

Update marker colors in the `mockFriends.map()` section:

```typescript
style={{ backgroundColor: `hsl(${index * 90}, 70%, 50%)` }}
```

## Features in Detail

### Location Request
- Uses browser Geolocation API
- High accuracy mode enabled
- 10-second timeout
- Automatic fallback on error

### Marker System
- **User Marker**: Blue with pulsing animation
- **Friend Markers**: Color-coded with initials
- **Selected State**: Visual indication when friend is selected
- **Hover Effects**: Scale animation on hover

### Navigation System
- Route calculation between two points
- Visual route display on map
- Integration with Google Maps
- Distance and direction information

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with geolocation support

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

