/**
 * Tests for Event Loader
 */

import { eventsLoader, eventDetailLoader } from "../eventLoader";
import { getAllEvents, getEventByName } from "../../services/eventService";

// Mock the event service
jest.mock("../../services/eventService");

describe("eventLoader", () => {
  const mockEvents = [
    {
      id: 1,
      nombre: "CyberWeek 2025",
      descripcion: "Gran oferta semanal",
      descuento: 25,
      fechaInicio: "2025-11-20",
      fechaFin: "2025-11-27",
    },
    {
      id: 2,
      nombre: "Black Friday",
      descripcion: "El evento del año",
      descuento: 40,
      fechaInicio: "2025-11-24",
      fechaFin: "2025-11-24",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("eventsLoader", () => {
    it("should return all events successfully", async () => {
      getAllEvents.mockResolvedValue(mockEvents);

      const result = await eventsLoader();

      expect(getAllEvents).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockEvents);
    });

    it("should return empty array on error", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getAllEvents.mockRejectedValue(new Error("Network error"));

      const result = await eventsLoader();

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error in eventsLoader:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("eventDetailLoader", () => {
    const mockEvent = {
      id: 1,
      nombre: "CyberWeek 2025",
      descripcion: "Gran oferta semanal",
      descuento: 25,
      fechaInicio: "2025-11-20",
      fechaFin: "2025-11-27",
    };

    it("should return event when name is valid", async () => {
      getEventByName.mockResolvedValue(mockEvent);

      const params = { eventName: "CyberWeek%202025" };
      const result = await eventDetailLoader({ params });

      expect(getEventByName).toHaveBeenCalledWith("CyberWeek 2025");
      expect(result).toEqual(mockEvent);
    });

    it("should decode URI encoded event names", async () => {
      getEventByName.mockResolvedValue(mockEvent);

      const params = { eventName: "CyberWeek%202025" };
      await eventDetailLoader({ params });

      expect(getEventByName).toHaveBeenCalledWith("CyberWeek 2025");
    });

    it("should throw error when event name is missing", async () => {
      const params = {};

      await expect(eventDetailLoader({ params })).rejects.toThrow(
        "Event name is required"
      );
      expect(getEventByName).not.toHaveBeenCalled();
    });

    it("should throw error when event is not found", async () => {
      getEventByName.mockResolvedValue(null);

      const params = { eventName: "NonExistent" };

      await expect(eventDetailLoader({ params })).rejects.toThrow(
        'Event "NonExistent" not found'
      );
    });

    it("should throw error when service fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      getEventByName.mockRejectedValue(new Error("Service error"));

      const params = { eventName: "CyberWeek 2025" };

      await expect(eventDetailLoader({ params })).rejects.toThrow(
        "Service error"
      );
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should handle special characters in event names", async () => {
      const specialEvent = {
        id: 3,
        nombre: "Event & Sale",
        descripcion: "Special offer",
        descuento: 15,
      };
      getEventByName.mockResolvedValue(specialEvent);

      const params = { eventName: "Event%20%26%20Sale" };
      const result = await eventDetailLoader({ params });

      expect(getEventByName).toHaveBeenCalledWith("Event & Sale");
      expect(result).toEqual(specialEvent);
    });
  });
});
