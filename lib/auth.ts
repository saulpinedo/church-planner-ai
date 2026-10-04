import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { env, getAdminEmails } from "@/lib/config/env";

/**
 * NextAuth v5 (Auth.js) configuration.
 *
 * One Google provider with calendar.readonly + calendar.events scopes so the
 * admin can both browse and edit events on their own Google Calendar.
 *
 * The `authorized` callback enforces the admin whitelist. Whitelisted emails
 * are configured via ADMIN_EMAILS (comma-separated) in `.env.local`. This is
 * what the PRD calls out: "Lista blanca administradores".
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: env.AUTH_SECRET ?? "dev-secret-change-me-in-production",
  trustHost: true,
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;
      return getAdminEmails().includes(email);
    },
    async jwt({ token, account }) {
      // Persist the Google access/refresh tokens so server actions can call
      // Calendar API on behalf of the user.
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.refreshToken = token.refreshToken as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});