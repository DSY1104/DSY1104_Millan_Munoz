/**
 * Event Loader
 * Loads event data for React Router
 */

import { getAllEvents, getEventByName } from "../services/eventService";

/**
 * Loader for all events
 * Used in routes that need to display a list of events
 * @returns {Promise<Array>} - Array of event objects
 */
export const eventsLoader = async () => {
  try {
    const events = await getAllEvents();
    return events;
  } catch (error) {
    console.error("Error in eventsLoader:", error);
    // Return empty array instead of throwing to prevent route breaking
    return [];
  }
};

/**
 * Loader for a single event by name
 * Used in routes that need to display event details
 * @param {object} params - Route parameters
 * @param {string} params.eventName - The event name from URL params
 * @returns {Promise<object|null>} - The event object or null
 */
export const eventDetailLoader = async ({ params }) => {
  try {
    const { eventName } = params;
    if (!eventName) {
      throw new Error("Event name is required");
    }

    const event = await getEventByName(decodeURIComponent(eventName));

    if (!event) {
      throw new Error(`Event "${eventName}" not found`);
    }

    return event;
  } catch (error) {
    console.error("Error in eventDetailLoader:", error);
    throw error;
  }
};

export default {
  eventsLoader,
  eventDetailLoader,
};
