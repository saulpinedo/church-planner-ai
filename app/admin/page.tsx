import { addDays, endOfMonth, startOfMonth } from "date-fns";
import { redirect } from "next/navigation";

import { EventList } from "@/components/admin/event-list";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { auth } from "@/lib/auth";
import { getUserCalendarProvider } from "@/lib/providers/calendar";

export const metadata = {
  title: "Administración",
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || !session.accessToken) {
    redirect("/login?callbackUrl=/admin");
  }

  // Load a 60-day window so the list has near-future context.
  const today = new Date();
  const from = startOfMonth(addDays(today, -7));
  const to = endOfMonth(addDays(today, 60));

  const provider = getUserCalendarProvider(session.accessToken);
  const events = await provider.listEvents({
    from: from.toISOString(),
    to: to.toISOString(),
  });

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 md:py-16">
          <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">Administración</p>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-balance text-3xl font-medium leading-tight tracking-[-0.02em] sm:text-4xl">
                    Hola, {session.user.name?.split(" ")[0] ?? "admin"}.
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<a href="/calendario" />}
                  >
                    Ver calendario
                  </Button>
                  <SignOutButton />
                </div>
              </div>
            </header>

            <EventList events={events} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}