"use client";

import { useState } from "react";

import { CalendarView } from "@/components/calendar/calendar-view";
import { MinistryFilter } from "@/components/calendar/ministry-filter";
import type { ChurchEvent } from "@/lib/types/event";
import { MINISTRIES, type MinistryId } from "@/lib/types/ministry";

interface CalendarPageClientProps {
  events: ChurchEvent[];
}

export function CalendarPageClient({ events }: CalendarPageClientProps) {
  const [visible, setVisible] = useState<Set<MinistryId>>(
    () => new Set(MINISTRIES.map((m) => m.id)),
  );

  function toggle(id: MinistryId) {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setVisible((prev) =>
      prev.size === MINISTRIES.length
        ? new Set<MinistryId>()
        : new Set(MINISTRIES.map((m) => m.id)),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <MinistryFilter visible={visible} onToggle={toggle} onToggleAll={toggleAll} />
      <CalendarView events={events} visibleMinistries={visible} />
    </div>
  );
}