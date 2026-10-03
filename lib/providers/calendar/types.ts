import type { CalendarProvider } from "@/lib/config/calendar";
import type { ChurchEvent, ChurchEventDraft } from "@/lib/types/event";

/**
 * Placeholder provider used until a real one is wired up.
 *
 * Throwing a clear error here is intentional — it surfaces accidental
 * production use of an unconfigured provider rather than silently
 * returning empty data.
 */
export class NotImplementedProvider implements CalendarProvider {
  private fail(method: string): never {
    throw new Error(
      `[calendar] ${method} called but no provider is configured. ` +
        `See lib/providers/calendar/README.md to wire up Google Calendar (Phase 2).`,
    );
  }

  async listEvents(): Promise<ChurchEvent[]> {
    this.fail("listEvents");
  }
  async getEvent(): Promise<ChurchEvent | null> {
    this.fail("getEvent");
  }
  async createEvent(_draft: ChurchEventDraft): Promise<ChurchEvent> {
    void _draft;
    this.fail("createEvent");
  }
  async updateEvent(): Promise<ChurchEvent> {
    this.fail("updateEvent");
  }
  async deleteEvent(): Promise<void> {
    this.fail("deleteEvent");
  }
}