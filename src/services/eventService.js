/**
 * Event Service
 * Handles all event-related API calls
 */

/**
 * Fetch all events
 * Simulates an API call by fetching the local JSON file
 * @returns {Promise<Array>} - Array of event objects
 */
export const getAllEvents = async () => {
  try {
    // In a real scenario, this would be an API endpoint like '/api/events'
    // For now, we're simulating by fetching the local JSON file
    const response = await fetch("/src/assets/data/eventData.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

/**
 * Fetch a single event by name
 * @param {string} name - The event name
 * @returns {Promise<object|null>} - The event object or null if not found
 */
export const getEventByName = async (name) => {
  try {
    const events = await getAllEvents();
    return events.find((event) => event.name === name) || null;
  } catch (error) {
    console.error(`Error fetching event ${name}:`, error);
    throw error;
  }
};

/**
 * Fetch events by region
 * @param {string} region - The region to filter by
 * @returns {Promise<Array>} - Array of event objects in that region
 */
export const getEventsByRegion = async (region) => {
  try {
    const events = await getAllEvents();
    return events.filter((event) => event.region === region);
  } catch (error) {
    console.error(`Error fetching events for region ${region}:`, error);
    throw error;
  }
};

/**
 * Get unique regions from all events
 * @returns {Promise<Array>} - Array of unique region strings
 */
export const getEventRegions = async () => {
  try {
    const events = await getAllEvents();
    const regions = [...new Set(events.map((event) => event.region))];
    return regions.sort();
  } catch (error) {
    console.error("Error fetching event regions:", error);
    throw error;
  }
};

export default {
  getAllEvents,
  getEventByName,
  getEventsByRegion,
  getEventRegions,
};
