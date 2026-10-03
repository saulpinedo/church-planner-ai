import type { CalendarProvider } from "@/lib/config/calendar";
import { env } from "@/lib/config/env";

import { GoogleCalendarProvider } from "./google";
import { MockCalendarProvider } from "./mock";

/**
 * Provider factory.
 *
 * Returns the real Google Calendar provider if all required env vars are
 * present; otherwise returns the mock so the app boots without secrets
 * during development.
 *
 * Single-tenant today. To become multi-tenant (one calendar per admin user),
 * swap this factory to look up a per-user credential store keyed by session
 * ID. The rest of the app talks only to the `CalendarProvider` interface
 * and stays untouched.
 */
let cached: CalendarProvider | null = null;

export function getCalendarProvider(): CalendarProvider {
  if (cached) return cached;

  const hasCreds = Boolean(
    env.GOOGLE_SERVICE_ACCOUNT_EMAIL && env.GOOGLE_SERVICE_ACCOUNT_KEY,
  );

  cached = hasCreds
    ? new GoogleCalendarProvider()
    : new MockCalendarProvider();

  return cached;
}

/** Reset the cached provider (used after credential changes during dev). */
export function resetCalendarProvider() {
  cached = null;
}

export type { CalendarProvider } from "@/lib/config/calendar";