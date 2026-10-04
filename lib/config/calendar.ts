import type { ChurchEvent, ChurchEventDraft } from "@/lib/types/event";

/**
 * Calendar provider abstraction.
 *
 * Single source of truth = the underlying calendar service
 * (Google Calendar in production). This interface is the boundary
 * the rest of the application talks to so the provider can be swapped
 * (Microsoft Graph, CalDAV, etc.) without touching business logic.
 *
 * See `lib/providers/calendar/README.md` for the implementation strategy.
 */
export interface CalendarProvider {
  listEvents(params: { from: string; to: string }): Promise<ChurchEvent[]>;
  getEvent(id: string): Promise<ChurchEvent | null>;
  createEvent(draft: ChurchEventDraft): Promise<ChurchEvent>;
  updateEvent(id: string, patch: Partial<ChurchEventDraft>): Promise<ChurchEvent>;
  deleteEvent(id: string): Promise<void>;

  /**
   * Detect overlapping events in a time range.
   * The admin UI uses this to warn before saving — never blocks per PRD.
   */
  findConflicts(params: {
    from: string;
    to: string;
    excludeId?: string;
  }): Promise<ChurchEvent[]>;
}