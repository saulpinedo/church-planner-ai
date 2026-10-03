/**
 * Visual calendar mock for the hero.
 *
 * Static, hand-crafted week preview — no real events, no data fetched.
 * Dates are computed from "this week" so the visual stays current.
 *
 * Events stagger in on load to give the impression the calendar is being
 * synced from Google Calendar.
 */
import { addDays, format, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

import {
  AventurerosIcon,
  ConquistadoresIcon,
  CultosIcon,
  DorcasIcon,
  EscuelaSabaticaIcon,
  JovenesIcon,
  MusicaIcon,
} from "@/components/ministry-icons";
import {
  MINISTRIES,
  type MinistryIconComponent,
  type MinistryId,
} from "@/lib/types/ministry";

interface MockEvent {
  ministry: MinistryId;
  title: string;
  Icon: MinistryIconComponent;
}

interface DayColumn {
  date: Date;
  isToday: boolean;
  events: MockEvent[];
}

function buildWeek(): DayColumn[] {
  const today = new Date();
  const monday = startOfWeek(today, { weekStartsOn: 1 });
  const todayKey = format(today, "yyyy-MM-dd");

  const sampleByWeekday: Record<number, MockEvent[]> = {
    1: [{ ministry: "musica", title: "Ensayo", Icon: MusicaIcon }],
    2: [{ ministry: "jovenes", title: "Estudio", Icon: JovenesIcon }],
    3: [{ ministry: "dorcas", title: "Reunión", Icon: DorcasIcon }],
    4: [
      { ministry: "conquistadores", title: "Clase", Icon: ConquistadoresIcon },
    ],
    5: [{ ministry: "jovenes", title: "Ensayo", Icon: JovenesIcon }],
    6: [
      {
        ministry: "escuela-sabatica",
        title: "Escuela Sab.",
        Icon: EscuelaSabaticaIcon,
      },
      { ministry: "cultos", title: "Culto", Icon: CultosIcon },
    ],
    0: [
      { ministry: "aventureros", title: "Aventureros", Icon: AventurerosIcon },
    ],
  };

  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i);
    return {
      date,
      isToday: format(date, "yyyy-MM-dd") === todayKey,
      events: sampleByWeekday[i] ?? [],
    };
  });
}

function ministryColor(id: MinistryId): string {
  return MINISTRIES.find((m) => m.id === id)?.color ?? "currentColor";
}

export function WeekPreview() {
  const week = buildWeek();
  const weekdayLabels = ["L", "M", "X", "J", "V", "S", "D"];

  // Flatten events across the week to compute stagger delays.
  let eventIndex = 0;

  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <span className="text-xs font-medium text-muted-foreground capitalize">
          {format(week[0].date, "MMMM yyyy", { locale: es })}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
          sincronizado
        </span>
      </div>

      <div className="grid grid-cols-7 divide-x divide-border/60">
        {week.map((day, i) => {
          const isHeavy = day.events.length > 1;
          return (
            <div
              key={day.date.toISOString()}
              className={`flex flex-col gap-2 p-2 ${isHeavy ? "min-h-[150px]" : "min-h-[110px]"}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {weekdayLabels[i]}
                </span>
                <span
                  className={
                    day.isToday
                      ? "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-semibold text-brand-foreground"
                      : "text-xs font-medium text-foreground/70"
                  }
                >
                  {format(day.date, "d")}
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                {day.events.map((event) => {
                  const delay = `${eventIndex * 60}ms`;
                  eventIndex++;
                  return (
                    <div
                      key={`${day.date.toISOString()}-${event.title}`}
                      className="animate-[event-in_0.5s_cubic-bezier(0.22,1,0.36,1)_both] flex min-w-0 items-center gap-1.5 rounded-md bg-muted/60 px-1.5 py-1"
                      style={{ animationDelay: delay }}
                      title={event.title}
                    >
                      <event.Icon
                        className="h-3 w-3 shrink-0"
                        style={{ color: ministryColor(event.ministry) }}
                      />
                      <span className="min-w-0 flex-1 truncate text-[11px] leading-tight text-foreground/85">
                        {event.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}