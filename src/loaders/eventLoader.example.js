/**
 * Example: How to integrate eventLoader with React Router
 *
 * This file demonstrates how to use the eventLoader in your router configuration.
 * Add this to your router.jsx file where you define your routes.
 */

import { createBrowserRouter } from "react-router-dom";
import { eventsLoader, eventDetailLoader } from "./loaders/eventLoader";

// Example route configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "events",
        element: <EventsPage />,
        loader: eventsLoader, // This will pre-load all events before rendering
      },
      {
        path: "events/:eventName",
        element: <EventDetailPage />,
        loader: eventDetailLoader, // This will pre-load a specific event before rendering
      },
    ],
  },
]);

// Example EventsPage component using the loader data
function EventsPage() {
  const events = eventsLoader(); // Gets data from eventsLoader

  return (
    <div>
      <h1>All Events</h1>
      {events.map((event) => (
        <div key={event.name}>
          <h2>{event.name}</h2>
          <p>{event.description}</p>
          <Link to={`/events/${encodeURIComponent(event.name)}`}>
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}

// Example EventDetailPage component using the loader data
function EventDetailPage() {
  const event = eventDetailLoader(); // Gets data from eventDetailLoader

  return (
    <div>
      <h1>{event.name}</h1>
      <p>{event.description}</p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Region:</strong> {event.region}
      </p>
      <p>
        <strong>Dates:</strong> {event.dates}
      </p>
      <p>
        <strong>Hours:</strong> {event.hours}
      </p>
      {event.image && <img src={event.image} alt={event.name} />}
    </div>
  );
}

export default router;
