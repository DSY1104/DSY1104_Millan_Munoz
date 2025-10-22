/**
 * Event Service Usage Examples
 *
 * This file demonstrates various ways to use the eventService methods
 */

import React from "react";
import {
  getAllEvents,
  getEventByName,
  getEventsByRegion,
  getEventRegions,
} from "../services/eventService";

// ============================================
// Example 1: Get all events
// ============================================
export const fetchAllEvents = async () => {
  try {
    const events = await getAllEvents();
    console.log("All events:", events);
    return events;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// ============================================
// Example 2: Get a specific event by name
// ============================================
export const fetchEventDetails = async () => {
  try {
    const eventName = "ChileGameFest 2025";
    const event = await getEventByName(eventName);

    if (event) {
      console.log("Event found:", event);
      // Display event details
      console.log(`Name: ${event.name}`);
      console.log(`Location: ${event.location}`);
      console.log(`Region: ${event.region}`);
      console.log(`Dates: ${event.dates}`);
      console.log(`Hours: ${event.hours}`);
    } else {
      console.log("Event not found");
    }

    return event;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

// ============================================
// Example 3: Filter events by region
// ============================================
export const fetchEventsByRegion = async () => {
  try {
    const region = "Región Metropolitana";
    const events = await getEventsByRegion(region);

    console.log(`Events in ${region}:`, events);
    console.log(`Total: ${events.length} events`);

    return events;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// ============================================
// Example 4: Get all unique regions
// ============================================
export const fetchAllRegions = async () => {
  try {
    const regions = await getEventRegions();

    console.log("Available regions:", regions);
    // Can be used to populate a dropdown filter
    return regions;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// ============================================
// Example 5: Create a region filter component
// ============================================
export const RegionFilterExample = () => {
  const [regions, setRegions] = React.useState([]);
  const [selectedRegion, setSelectedRegion] = React.useState("");
  const [filteredEvents, setFilteredEvents] = React.useState([]);

  React.useEffect(() => {
    const loadRegions = async () => {
      const data = await getEventRegions();
      setRegions(data);
    };
    loadRegions();
  }, []);

  const handleRegionChange = async (region) => {
    setSelectedRegion(region);

    if (region === "") {
      // Show all events
      const allEvents = await getAllEvents();
      setFilteredEvents(allEvents);
    } else {
      // Filter by region
      const events = await getEventsByRegion(region);
      setFilteredEvents(events);
    }
  };

  return (
    <div>
      <select
        value={selectedRegion}
        onChange={(e) => handleRegionChange(e.target.value)}
      >
        <option value="">Todas las regiones</option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>

      <div>
        {filteredEvents.map((event) => (
          <div key={event.name}>
            <h3>{event.name}</h3>
            <p>{event.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// Example 6: Search events by keyword
// ============================================
export const searchEvents = async (keyword) => {
  try {
    const allEvents = await getAllEvents();
    const lowerKeyword = keyword.toLowerCase();

    const results = allEvents.filter(
      (event) =>
        event.name.toLowerCase().includes(lowerKeyword) ||
        event.description.toLowerCase().includes(lowerKeyword) ||
        event.location.toLowerCase().includes(lowerKeyword)
    );

    console.log(`Found ${results.length} events matching "${keyword}"`);
    return results;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// ============================================
// Example 7: Get upcoming events (in date range)
// ============================================
export const getUpcomingEvents = async (daysAhead = 30) => {
  try {
    const allEvents = await getAllEvents();
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);

    // Note: This is a simplified example
    // In a real app, you'd parse the date strings properly
    console.log(`Events in the next ${daysAhead} days:`, allEvents);

    return allEvents;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// ============================================
// Example 8: Count events by region
// ============================================
export const getEventStatsByRegion = async () => {
  try {
    const allEvents = await getAllEvents();
    const stats = {};

    allEvents.forEach((event) => {
      if (stats[event.region]) {
        stats[event.region]++;
      } else {
        stats[event.region] = 1;
      }
    });

    console.log("Events per region:", stats);
    return stats;
  } catch (error) {
    console.error("Error:", error);
    return {};
  }
};

export default {
  fetchAllEvents,
  fetchEventDetails,
  fetchEventsByRegion,
  fetchAllRegions,
  searchEvents,
  getUpcomingEvents,
  getEventStatsByRegion,
};
