import type { MinistryId } from "./ministry";

/**
 * Canonical church event shape.
 *
 * Source of truth lives in the calendar provider (Google Calendar in production).
 * The application never writes events to its own DB.
 */
export interface ChurchEvent {
  id: string;
  title: string;
  description?: string;
  ministry: MinistryId;
  /** ISO date (YYYY-MM-DD) — calendar-friendly, no timezone. First day of
   *  the event (or the only day for single-day events). */
  date: string;
  /** ISO date (YYYY-MM-DD) — last day of the event. Same as `date` for
   *  single-day events. Optional in the type so legacy single-day data
   *  still loads. */
  endDate?: string;
  /** Local time (HH:mm) at the church's timezone. */
  startTime: string;
  /** Local time (HH:mm). */
  endTime: string;
  location?: string;
  responsible?: string;
  /** ISO datetime — set by the provider on creation. */
  createdAt: string;
  /** ISO datetime — set by the provider on update. */
  updatedAt: string;
}

/** What the application submits to a provider when creating an event. */
export type ChurchEventDraft = Omit<ChurchEvent, "id" | "createdAt" | "updatedAt">;