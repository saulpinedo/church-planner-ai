import { z } from "zod";

/**
 * Typed environment reader.
 *
 * Every variable a future phase will need is declared here as optional so the
 * dev server boots without any `.env.local`. Zod catches typos early once those
 * phases start consuming these values.
 *
 * NEVER read `process.env` directly outside this file.
 */
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // ─── Phase 2 · Google Calendar ────────────────────────────────────
  // Service account is used by the public /calendario route so visitors
  // can read events without any auth.
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().email().optional(),
  GOOGLE_SERVICE_ACCOUNT_KEY: z.string().optional(),
  GOOGLE_CALENDAR_ID: z.string().default("primary"),

  // IANA timezone used when sending dateTime values to Google Calendar.
  // Required by the API when no UTC offset is included in the value.
  DEFAULT_TIMEZONE: z.string().default("America/La_Paz"),

  // ─── Hito 1 · Google OAuth (admin login) ──────────────────────────
  // Each admin logs in with their own Google account. Whitelist (below)
  // restricts who is allowed to manage events.
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // ─── Hito 1 · Auth ────────────────────────────────────────────────
  AUTH_SECRET: z.string().optional(),

  // ─── Hito 1 · Whitelist ───────────────────────────────────────────
  // Comma-separated list of emails that are allowed to log in as admin.
  ADMIN_EMAILS: z.string().optional(),

  // ─── Phase 5 · n8n + Telegram ────────────────────────────────────
  N8N_WEBHOOK_URL: z.string().url().optional(),
  TELELEGRAM_BOT_TOKEN: z.string().optional(),

  // ─── Phase 6 · Web Push ─────────────────────────────────────────
  VAPID_PUBLIC_KEY: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
  VAPID_SUBJECT: z.string().optional(),

  // ─── General ────────────────────────────────────────────────────
  APP_URL: z.string().url().optional(),
});

export const env = schema.parse(process.env);

export function getAdminEmails(): string[] {
  if (!env.ADMIN_EMAILS) return [];
  return env.ADMIN_EMAILS.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}