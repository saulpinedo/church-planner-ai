"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { getUserCalendarProvider } from "@/lib/providers/calendar";
import type { ChurchEventDraft } from "@/lib/types/event";
import { MINISTRY_IDS, type MinistryId } from "@/lib/types/ministry";

/**
 * Server actions for /admin. All of them:
 * 1. Verify the user has a session and an access token.
 * 2. Build a user-scoped GoogleCalendarProvider.
 * 3. Call the matching CalendarProvider method.
 * 4. Revalidate /admin and /calendario so both pages reflect the change.
 */

interface ActionResult<T> {
  ok: boolean;
  error?: string;
  data?: T;
}

export async function createEventAction(
  input: ChurchEventDraft,
): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.accessToken) {
    return { ok: false, error: "No estás autenticado." };
  }
  if (!MINISTRY_IDS.includes(input.ministry as never)) {
    return { ok: false, error: "Ministerio inválido." };
  }

  const provider = getUserCalendarProvider(session.accessToken);
  try {
    const created = await provider.createEvent(input);
    revalidatePath("/admin");
    revalidatePath("/calendario");
    return { ok: true, data: { id: created.id } };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Error desconocido.",
    };
  }
}

export async function updateEventAction(
  id: string,
  patch: Partial<ChurchEventDraft>,
): Promise<ActionResult<null>> {
  const session = await auth();
  if (!session?.accessToken) {
    return { ok: false, error: "No estás autenticado." };
  }

  const provider = getUserCalendarProvider(session.accessToken);
  try {
    await provider.updateEvent(id, patch);
    revalidatePath("/admin");
    revalidatePath("/calendario");
    return { ok: true, data: null };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Error desconocido.",
    };
  }
}

export async function deleteEventAction(
  id: string,
): Promise<ActionResult<null>> {
  const session = await auth();
  if (!session?.accessToken) {
    return { ok: false, error: "No estás autenticado." };
  }

  const provider = getUserCalendarProvider(session.accessToken);
  try {
    await provider.deleteEvent(id);
    revalidatePath("/admin");
    revalidatePath("/calendario");
    return { ok: true, data: null };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Error desconocido.",
    };
  }
}

/**
 * Detect conflicts for a candidate event. Returns the overlapping events
 * (if any). The page-level UI uses this to warn — never blocks, per PRD.
 */
export async function findConflictsAction(
  draft: ChurchEventDraft,
  excludeId?: string,
): Promise<ActionResult<{ conflicts: ChurchEventDraft[] }>> {
  const session = await auth();
  if (!session?.accessToken) {
    return { ok: false, error: "No estás autenticado." };
  }

  const provider = getUserCalendarProvider(session.accessToken);
  try {
    const endDate = draft.endDate ?? draft.date;
    const fromIso = `${draft.date}T00:00:00.000Z`;
    // Cover the full range of the candidate event (start day through end day).
    const toIso = `${endDate}T23:59:59.999Z`;
    const events = await provider.findConflicts({
      from: fromIso,
      to: toIso,
      excludeId,
    });
    // Filter to true time overlaps using the candidate's full date range.
    const candidateStart = new Date(`${draft.date}T${draft.startTime}:00`);
    const candidateEnd = new Date(`${endDate}T${draft.endTime}:00`);
    const conflicts = events
      .filter((e) => {
        const eEndDate = e.endDate ?? e.date;
        const eStart = new Date(`${e.date}T${e.startTime}:00`);
        const eEnd = new Date(`${eEndDate}T${e.endTime}:00`);
        return eStart < candidateEnd && eEnd > candidateStart;
      })
      .map((e) => ({
        title: e.title,
        description: e.description,
        ministry: e.ministry as MinistryId,
        date: e.date,
        endDate: e.endDate,
        startTime: e.startTime,
        endTime: e.endTime,
        location: e.location,
        responsible: e.responsible,
      }));
    return { ok: true, data: { conflicts } };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Error desconocido.",
    };
  }
}

// Types live in @/lib/types/event — re-exporting from "use server" files
// breaks Next.js's server actions loader.