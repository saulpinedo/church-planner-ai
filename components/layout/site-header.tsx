import { auth } from "@/lib/auth";

import { AuthAwareHeader } from "./auth-aware-header";

/**
 * Server component wrapper that reads the session and passes a boolean
 * to the client AuthAwareHeader. Keeps the header client-side for the
 * theme toggle + pathname detection while avoiding per-page session reads.
 */
export async function SiteHeader() {
  const session = await auth();
  return <AuthAwareHeader isLoggedIn={Boolean(session?.user)} />;
}