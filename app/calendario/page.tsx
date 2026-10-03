import { addDays, startOfMonth, endOfMonth } from "date-fns";

import { CalendarPageClient } from "@/components/calendar/calendar-page-client";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getCalendarProvider } from "@/lib/providers/calendar";

export const metadata = {
  title: "Calendario",
  description:
    "Calendario público de todas las actividades de la iglesia: cultos, Escuela Sabática, Conquistadores, jóvenes, música y más.",
};

export default async function CalendarioPage() {
  // Load a generous window so month navigation has data already on hand.
  const today = new Date();
  const from = startOfMonth(addDays(today, -14));
  const to = endOfMonth(addDays(today, 60));

  const provider = getCalendarProvider();
  const events = await provider.listEvents({
    from: from.toISOString(),
    to: to.toISOString(),
  });

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 md:py-16">
          <div className="flex flex-col gap-2 pb-8">
            <p className="text-sm text-muted-foreground">Calendario público</p>
            <h1 className="text-balance text-3xl font-medium leading-tight tracking-[-0.02em] sm:text-4xl md:text-5xl">
              Lo que pasa en la iglesia.
            </h1>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              Todas las actividades de los ministerios en un solo lugar.
              Filtra por ministerio y haz click en cualquier evento para ver los
              detalles.
            </p>
          </div>

          <CalendarPageClient events={events} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}