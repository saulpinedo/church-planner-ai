import { google, type calendar_v3 } from "googleapis";

import type { CalendarProvider } from "@/lib/config/calendar";
import { env } from "@/lib/config/env";
import type { ChurchEvent, ChurchEventDraft } from "@/lib/types/event";
import { MINISTRY_IDS, type MinistryId } from "@/lib/types/ministry";

/**
 * Google Calendar implementation of the CalendarProvider.
 *
 * Uses the service account flow so the app can read/write the shared
 * "Eventos Iglesia" calendar without a user OAuth dance. The service
 * account must be granted "Make changes to events" on the target calendar
 * in Google Calendar's UI.
 *
 * Ministry is stored in the event's `extendedProperties.private` slot so it
 * survives round-trips to Google's API (events.colorId is reserved for the
 * Google color palette and not reliable for our custom palette).
 */
export class GoogleCalendarProvider implements CalendarProvider {
  private calendar: calendar_v3.Calendar;
  private calendarId: string;

  constructor() {
    if (!env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      throw new Error(
        "GoogleCalendarProvider: GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_KEY must be set.",
      );
    }

    const auth = new google.auth.JWT({
      email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: env.GOOGLE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    this.calendar = google.calendar({ version: "v3", auth });
    this.calendarId = env.GOOGLE_CALENDAR_ID;
  }

  async listEvents(params: { from: string; to: string }): Promise<ChurchEvent[]> {
    const res = await this.calendar.events.list({
      calendarId: this.calendarId,
      timeMin: params.from,
      timeMax: params.to,
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 250,
    });

    const items = res.data.items ?? [];
    return items.map((g) => googleToChurchEvent(g)).filter(isValidMinistry);
  }

  async getEvent(id: string): Promise<ChurchEvent | null> {
    try {
      const res = await this.calendar.events.get({
        calendarId: this.calendarId,
        eventId: id,
      });
      return googleToChurchEvent(res.data);
    } catch {
      return null;
    }
  }

  async createEvent(draft: ChurchEventDraft): Promise<ChurchEvent> {
    const res = await this.calendar.events.insert({
      calendarId: this.calendarId,
      requestBody: churchEventToGoogle(draft),
    });
    return googleToChurchEvent(res.data);
  }

  async updateEvent(
    id: string,
    patch: Partial<ChurchEventDraft>,
  ): Promise<ChurchEvent> {
    const res = await this.calendar.events.patch({
      calendarId: this.calendarId,
      eventId: id,
      requestBody: churchEventToGoogle(patch),
    });
    return googleToChurchEvent(res.data);
  }

  async deleteEvent(id: string): Promise<void> {
    await this.calendar.events.delete({
      calendarId: this.calendarId,
      eventId: id,
    });
  }

  async findConflicts(params: {
    from: string;
    to: string;
    excludeId?: string;
  }): Promise<ChurchEvent[]> {
    // Cheap implementation: list all events in the window and return the
    // ones that overlap with [from, to]. The page-level admin UI does the
    // actual overlap check against a candidate draft.
    const events = await this.listEvents({ from: params.from, to: params.to });
    return events.filter((e) => e.id !== params.excludeId);
  }
}

// ─── Mappers ──────────────────────────────────────────────────────

function googleToChurchEvent(g: calendar_v3.Schema$Event): ChurchEvent {
  const start = g.start?.dateTime ?? g.start?.date ?? "";
  const end = g.end?.dateTime ?? g.end?.date ?? "";
  const date = start.slice(0, 10);
  const startTime = start.includes("T") ? start.slice(11, 16) : "00:00";
  const endTime = end.includes("T") ? end.slice(11, 16) : "00:00";

  const ministry = (g.extendedProperties?.private?.ministry ??
    "cultos") as MinistryId;

  return {
    id: g.id ?? "",
    title: g.summary ?? "(sin título)",
    description: g.description ?? undefined,
    ministry,
    date,
    startTime,
    endTime,
    location: g.location ?? undefined,
    responsible: undefined,
    createdAt: g.created ?? new Date().toISOString(),
    updatedAt: g.updated ?? new Date().toISOString(),
  };
}

function churchEventToGoogle(
  draft: Partial<ChurchEventDraft>,
): calendar_v3.Schema$Event {
  const event: calendar_v3.Schema$Event = {
    summary: draft.title,
    description: draft.description,
    location: draft.location,
  };

  if (draft.ministry) {
    event.extendedProperties = {
      private: {
        ministry: draft.ministry,
      },
    };
  }

  if (draft.date && draft.startTime) {
    event.start = {
      dateTime: `${draft.date}T${draft.startTime}:00`,
      timeZone: "America/Guayaquil",
    };
  }
  if (draft.date && draft.endTime) {
    event.end = {
      dateTime: `${draft.date}T${draft.endTime}:00`,
      timeZone: "America/Guayaquil",
    };
  }

  return event;
}

function isValidMinistry(e: ChurchEvent): boolean {
  return MINISTRY_IDS.includes(e.ministry as never);
}