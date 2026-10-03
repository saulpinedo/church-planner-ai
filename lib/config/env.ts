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

  // ─── Phase 2 · Google Calendar (service account) ───────────────────
  // Single-tenant mode: one Google Calendar shared across the whole app.
  // For multi-tenant (one calendar per admin) we'll add OAuth user flows
  // on top of this without changing the CalendarProvider interface.
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().email().optional(),
  GOOGLE_SERVICE_ACCOUNT_KEY: z.string().optional(),
  GOOGLE_CALENDAR_ID: z.string().default("primary"),

  // ─── Phase 5 · n8n + Telegram ────────────────────────────────────
  N8N_WEBHOOK_URL: z.string().url().optional(),
  TELEGRAM_BOT_TOKEN: z.string().optional(),

  // ─── Phase 6 · Web Push ─────────────────────────────────────────
  VAPID_PUBLIC_KEY: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
  VAPID_SUBJECT: z.string().optional(),

  // ─── General ────────────────────────────────────────────────────
  APP_URL: z.string().url().optional(),
});

export const env = schema.parse(process.env);