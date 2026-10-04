import { google, Auth, type calendar_v3 } from "googleapis";

import type { CalendarProvider } from "@/lib/config/calendar";
import { env } from "@/lib/config/env";
import type { ChurchEvent, ChurchEventDraft } from "@/lib/types/event";
import { MINISTRY_IDS, type MinistryId } from "@/lib/types/ministry";

/**
 * Google Calendar implementation of the CalendarProvider.
 *
 * Works in two modes via factory helpers:
 *   - Service account mode (public /calendario route): reads events from
 *     a shared calendar without any user auth.
 *   - User OAuth mode (/admin actions): uses the admin's access token to
 *     read/write events on their own Google Calendar.
 *
 * Ministry is stored in the event's `extendedProperties.private` slot so it
 * survives round-trips to Google's API (events.colorId is reserved for the
 * Google color palette and not reliable for our custom palette).
 */
export class GoogleCalendarProvider implements CalendarProvider {
  private calendar: calendar_v3.Calendar;
  private calendarId: string;
  private timeZone: string;

  constructor(auth: Auth.OAuth2Client, timeZone?: string) {
    this.calendar = google.calendar({ version: "v3", auth });
    this.calendarId = env.GOOGLE_CALENDAR_ID;
    // Default to the configured timezone (env.DEFAULT_TIMEZONE).
    this.timeZone = timeZone ?? env.DEFAULT_TIMEZONE;
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
      requestBody: churchEventToGoogle(draft, this.timeZone),
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
      requestBody: churchEventToGoogle(patch, this.timeZone),
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
    const events = await this.listEvents({ from: params.from, to: params.to });
    return events.filter((e) => e.id !== params.excludeId);
  }
}

// ─── Factory helpers ──────────────────────────────────────────────

/** Service-account provider. Requires GOOGLE_SERVICE_ACCOUNT_* env vars. */
export function createServiceAccountProvider(): GoogleCalendarProvider {
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
  return new GoogleCalendarProvider(auth);
}

/** User-OAuth provider. Authenticates as the logged-in admin. */
export function createUserProvider(
  accessToken: string,
  timeZone?: string,
): GoogleCalendarProvider {
  const oauth2 = new google.auth.OAuth2({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.APP_URL
      ? `${env.APP_URL}/api/auth/callback/google`
      : undefined,
  });
  oauth2.setCredentials({ access_token: accessToken });
  return new GoogleCalendarProvider(oauth2, timeZone ?? env.DEFAULT_TIMEZONE);
}

// ─── Mappers ──────────────────────────────────────────────────────

function googleToChurchEvent(g: calendar_v3.Schema$Event): ChurchEvent {
  const start = g.start?.dateTime ?? g.start?.date ?? "";
  const end = g.end?.dateTime ?? g.end?.date ?? "";
  const date = start.slice(0, 10);
  const startTime = start.includes("T") ? start.slice(11, 16) : "00:00";
  const endTime = end.includes("T") ? end.slice(11, 16) : "00:00";

  const knownIds = new Set<string>(MINISTRY_IDS as readonly string[]);
  const stored = g.extendedProperties?.private?.ministry;
  const ministry: MinistryId =
    stored && knownIds.has(stored) ? (stored as MinistryId) : "cultos";

  return {
    id: g.id ?? "",
    title: g.summary ?? "(sin título)",
    description: g.description ?? undefined,
    ministry,
    date,
    endDate: date !== end.slice(0, 10) ? end.slice(0, 10) : undefined,
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
  timeZone: string,
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

  const endDate = draft.endDate ?? draft.date;
if (draft.date && draft.startTime) {
    event.start = {
      dateTime: `${draft.date}T${draft.startTime}:00`,
      timeZone,
    };
  }
if (endDate && draft.endTime) {
    event.end = {
      dateTime: `${endDate}T${draft.endTime}:00`,
      timeZone,
    };
  }

  return event;
}

function isValidMinistry(e: ChurchEvent): boolean {
  const knownIds = new Set<string>(MINISTRY_IDS as readonly string[]);
  return knownIds.has(e.ministry);
}