import type { CalendarProvider } from "@/lib/config/calendar";
import { NotImplementedProvider } from "./types";

/**
 * Provider factory.
 *
 * Today: returns a not-implemented stub.
 * Phase 2 will branch on env (or DB feature flag) to return a
 * `GoogleCalendarProvider`. The rest of the app talks only to the
 * `CalendarProvider` interface and stays untouched.
 */
let cached: CalendarProvider | null = null;

export function getCalendarProvider(): CalendarProvider {
  if (!cached) {
    cached = new NotImplementedProvider();
  }
  return cached;
}

export type { CalendarProvider } from "@/lib/config/calendar";