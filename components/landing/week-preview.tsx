/**
 * Visual calendar mock for the hero.
 *
 * Static, hand-crafted week preview — no real events, no data fetched,
 * no per-cell animations. It exists to show what the product is (one shared
 * calendar) in the first viewport, without explanation.
 *
 * Dates are computed from "this week" so the visual stays current.
 */
import {
  Backpack,
  BookOpen,
  Church,
  Compass,
  Flame,
  Heart,
  Music,
  type LucideIcon,
} from "lucide-react";
import { addDays, format, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

import { MINISTRIES, type MinistryId } from "@/lib/types/ministry";

interface MockEvent {
  ministry: MinistryId;
  title: string;
  Icon: LucideIcon;
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

  // Hand-curated schedule — Saturday is the heavy day because that's how
  // a real Adventist-style church actually fills the calendar.
  const sampleByWeekday: Record<number, MockEvent[]> = {
    1: [{ ministry: "musica", title: "Ensayo", Icon: Music }],
    2: [{ ministry: "jovenes", title: "Estudio bíblico", Icon: Flame }],
    3: [{ ministry: "dorcas", title: "Reunión", Icon: Heart }],
    4: [{ ministry: "conquistadores", title: "Clase", Icon: Compass }],
    5: [{ ministry: "jovenes", title: "Ensayo", Icon: Flame }],
    6: [
      { ministry: "escuela-sabatica", title: "Escuela Sabática", Icon: BookOpen },
      { ministry: "cultos", title: "Culto divino", Icon: Church },
    ],
    0: [{ ministry: "aventureros", title: "Aventureros", Icon: Backpack }],
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

  return (
    <div
      aria-hidden
      className="relative overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]"
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
        {week.map((day, i) => (
          <div
            key={day.date.toISOString()}
            className="flex min-h-[140px] flex-col gap-2 p-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {weekdayLabels[i]}
              </span>
              <span
                className={
                  day.isToday
                    ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-semibold text-brand-foreground"
                    : "text-xs font-medium text-foreground/70"
                }
              >
                {format(day.date, "d")}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-1">
              {day.events.map((event, idx) => (
                <div
                  key={`${day.date.toISOString()}-${idx}`}
                  className="flex items-start gap-1 rounded-md bg-muted/60 px-1.5 py-1"
                  title={event.title}
                >
                  <event.Icon
                    className="mt-0.5 h-3 w-3 shrink-0"
                    style={{ color: ministryColor(event.ministry) }}
                  />
                  <span className="truncate text-[10px] leading-tight text-foreground/80">
                    {event.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}