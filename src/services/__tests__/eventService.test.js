/**
 * Event Service Tests
 */
import { getAllEvents, getEventByName } from "../eventService";

// Mock fetch
global.fetch = jest.fn();

describe("Event Service", () => {
  const mockEvents = [
    {
      id: 1,
      titulo: "Gaming Tournament",
      descripcion: "Annual gaming event",
      fecha: "2025-03-15",
      lugar: "Convention Center",
    },
    {
      id: 2,
      titulo: "Tech Conference",
      descripcion: "Latest tech trends",
      fecha: "2025-04-20",
      lugar: "Tech Hub",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllEvents", () => {
    test("should fetch all events successfully", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      });

      const events = await getAllEvents();

      expect(events).toHaveLength(2);
    });

    test("should handle fetch errors", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(getAllEvents()).rejects.toThrow();
    });
  });

  describe("getEventByName", () => {
    test("should return event when found", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      });

      const event = await getEventByName("Gaming Tournament");

      expect(event).toBeDefined();
      expect(event.titulo).toBe("Gaming Tournament");
    });

    test("should return null when event not found", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      });

      const event = await getEventByName("Non-existent Event");

      expect(event).toBeNull();
    });
  });
});
