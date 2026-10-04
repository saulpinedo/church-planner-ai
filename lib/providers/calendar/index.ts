import type { CalendarProvider } from "@/lib/config/calendar";
import { env } from "@/lib/config/env";

import {
  createServiceAccountProvider,
  createUserProvider,
} from "./google";
import { MockCalendarProvider } from "./mock";

/**
 * Provider factory.
 *
 * Two entry points:
 *   - `getPublicCalendarProvider()` → service account or Mock. Used by
 *     unauthenticated routes (the public /calendario view). No tokens
 *     needed at request time.
 *   - `getUserCalendarProvider(accessToken)` → Google with the logged-in
 *     admin's OAuth token. Used by /admin server actions to read/write
 *     the admin's own calendar.
 *
 * If GOOGLE_SERVICE_ACCOUNT_* is missing AND there is no user session,
 * the public route falls back to Mock so the app still boots in dev.
 */

let cachedPublic: CalendarProvider | null = null;

export function getPublicCalendarProvider(): CalendarProvider {
  if (cachedPublic) return cachedPublic;

  const hasServiceAccount = Boolean(
    env.GOOGLE_SERVICE_ACCOUNT_EMAIL && env.GOOGLE_SERVICE_ACCOUNT_KEY,
  );

  cachedPublic = hasServiceAccount
    ? createServiceAccountProvider()
    : new MockCalendarProvider();

  return cachedPublic;
}

/** Build a provider scoped to the given user access token. No caching. */
export function getUserCalendarProvider(
  accessToken: string,
): CalendarProvider {
  return createUserProvider(accessToken);
}

/** Reset the cached public provider (used after credential rotation in dev). */
export function resetCalendarProvider() {
  cachedPublic = null;
}

export type { CalendarProvider } from "@/lib/config/calendar";