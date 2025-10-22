# Event Data Loader Implementation

This implementation simulates fetching event data using a loader pattern with services architecture.

## Architecture Overview

```
src/
├── services/
│   ├── api.js              # Centralized API fetch logic
│   └── eventService.js     # Event-specific service methods
├── loaders/
│   └── eventLoader.js      # React Router loaders for events
└── components/
    └── landing/
        └── Events.jsx      # Events component using the service
```

## Files Created/Modified

### 1. `src/services/api.js`

Centralized API fetch logic with:

- Generic `fetchAPI()` wrapper with error handling
- Simulated network delay (500ms)
- HTTP methods: `get()`, `post()`, `put()`, `del()`
- Consistent error handling

### 2. `src/services/eventService.js`

Event-specific service with methods:

- `getAllEvents()` - Fetch all events (simulates API call to local JSON)
- `getEventByName(name)` - Fetch a single event by name
- `getEventsByRegion(region)` - Filter events by region
- `getEventRegions()` - Get unique regions from all events

### 3. `src/loaders/eventLoader.js`

React Router loaders:

- `eventsLoader()` - Loads all events for list pages
- `eventDetailLoader({ params })` - Loads a single event by name from URL params

### 4. `src/components/landing/Events.jsx`

Updated to use the service layer:

- ✅ Fetches data using `getAllEvents()` from `eventService`
- ✅ Loading state while fetching
- ✅ Error handling with user-friendly message
- ✅ Maintains existing fade/shuffle animation
- ✅ No longer imports JSON directly

## Usage Examples

### Basic Usage (Current Implementation)

```jsx
import { getAllEvents } from "../../services/eventService";

useEffect(() => {
  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error("Error loading events:", err);
    }
  };

  fetchEvents();
}, []);
```

### Using with React Router Loaders

```jsx
// In router.jsx
import { eventsLoader } from "./loaders/eventLoader";

const router = createBrowserRouter([
  {
    path: "/events",
    element: <EventsPage />,
    loader: eventsLoader, // Pre-loads data before rendering
  },
]);

// In component
import { useLoaderData } from "react-router-dom";

function EventsPage() {
  const events = useLoaderData(); // No need for useState/useEffect!

  return (
    <div>
      {events.map((event) => (
        <EventCard key={event.name} event={event} />
      ))}
    </div>
  );
}
```

## Benefits

1. **Separation of Concerns**: Business logic (services) separated from UI (components)
2. **Reusability**: Services can be used across multiple components
3. **Testability**: Easy to mock services for testing
4. **Maintainability**: Centralized API logic makes changes easier
5. **Error Handling**: Consistent error handling across the app
6. **Loading States**: Built-in loading and error states
7. **Future-Proof**: Easy to switch from local JSON to real API endpoints

## Migration from JSON Import

**Before:**

```jsx
import eventData from "/src/assets/data/eventData.json";
const mockEvents = eventData.techAndGamingEvents.map((event) => ({ ...event }));
```

**After:**

```jsx
import { getAllEvents } from "../../services/eventService";
const events = await getAllEvents();
```

## Switching to Real API

When you're ready to use a real API, simply update `eventService.js`:

```jsx
// Change from:
const response = await fetch("/src/assets/data/eventData.json");

// To:
const response = await fetch("https://api.example.com/events");
// Or use the centralized api.js:
import { get } from "./api";
const events = await get("/api/events");
```

## Network Simulation

The service includes a 500ms delay to simulate network latency. This helps:

- Test loading states
- Simulate real-world conditions
- Improve UX by preventing flash of loading state

To adjust the delay, modify `SIMULATE_DELAY` in `api.js`.

## Error Handling

All methods include try-catch blocks and user-friendly error messages:

- Console errors for debugging
- User-friendly messages in Spanish for the UI
- Graceful fallbacks (empty arrays) to prevent app crashes

## Next Steps

1. ✅ Services layer created
2. ✅ Loaders created
3. ✅ Events component updated
4. 🔄 (Optional) Integrate loaders into React Router
5. 🔄 (Optional) Create EventDetailPage for individual events
6. 🔄 (Optional) Add caching layer for better performance
7. 🔄 (Optional) Connect to real API when available
