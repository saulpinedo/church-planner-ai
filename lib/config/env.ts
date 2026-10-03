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

  // ─── Phase 2 · Google OAuth & Calendar ────────────────────────────
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALENDAR_ID: z.string().default("primary"),
  GOOGLE_REDIRECT_URI: z.string().optional(),

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