"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import "@/components/calendar/calendar.css";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ChurchEvent } from "@/lib/types/event";
import { MINISTRIES, type Ministry, type MinistryId } from "@/lib/types/ministry";

type DetailMode = "modal" | "drawer" | "popover";

interface CalendarViewProps {
  events: ChurchEvent[];
  visibleMinistries: Set<MinistryId>;
}

export function CalendarView({ events, visibleMinistries }: CalendarViewProps) {
  const [selected, setSelected] = useState<ChurchEvent | null>(null);
  const [mode, setMode] = useState<DetailMode>("modal");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const visibleEvents = useMemo(
    () => events.filter((e) => visibleMinistries.has(e.ministry)),
    [events, visibleMinistries],
  );

  const fcEvents = useMemo(
    () =>
      visibleEvents.map((e) => {
        const ministry = MINISTRIES.find((m) => m.id === e.ministry);
        return {
          id: e.id,
          title: e.title,
          start: `${e.date}T${e.startTime}:00`,
          end: `${e.date}T${e.endTime}:00`,
          backgroundColor: ministry?.color,
          borderColor: ministry?.color,
          textColor: "white",
          extendedProps: { event: e, ministry },
        };
      }),
    [visibleEvents],
  );

  function handleEventClick(info: {
    event: { extendedProps: Record<string, unknown> };
    el: HTMLElement;
  }) {
    const ev = info.event.extendedProps.event as ChurchEvent;
    setSelected(ev);
    // FullCalendar reuses / recreates DOM nodes on rerender, so clone the
    // bounding rect into a stable virtual anchor instead of holding the ref.
    const rect = info.el.getBoundingClientRect();
    const virtualAnchor: HTMLElement = {
      getBoundingClientRect: () => rect,
    } as HTMLElement;
    setAnchorEl(virtualAnchor);
  }

  function close() {
    setSelected(null);
    setAnchorEl(null);
  }

  const ministry = selected
    ? MINISTRIES.find((m) => m.id === selected.ministry)
    : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">Modo de detalle</p>
        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as DetailMode)}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="modal">Modal</TabsTrigger>
            <TabsTrigger value="drawer">Drawer</TabsTrigger>
            <TabsTrigger value="popover">Popover</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="fc-themed overflow-hidden rounded-xl border border-border bg-card">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          buttonText={{
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            list: "Agenda",
          }}
          locale="es"
          firstDay={1}
          height="auto"
          events={fcEvents}
          eventClick={handleEventClick}
          dayMaxEventRows={3}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
          }}
        />
      </div>

      <Dialog
        open={mode === "modal" && !!selected}
        onOpenChange={(o) => !o && close()}
      >
        <DialogContent>
          {selected && <ModalDetail event={selected} ministry={ministry} />}
        </DialogContent>
      </Dialog>

      <Sheet
        open={mode === "drawer" && !!selected}
        onOpenChange={(o) => !o && close()}
      >
        <SheetContent side="right">
          {selected && <DrawerDetail event={selected} ministry={ministry} />}
        </SheetContent>
      </Sheet>

      <Popover
        open={mode === "popover" && !!selected}
        onOpenChange={(o) => !o && close()}
      >
        <PopoverContent
          className="w-80"
          side="top"
          align="start"
          sideOffset={8}
          anchor={anchorEl}
        >
          {selected && <PopoverDetail event={selected} ministry={ministry} />}
        </PopoverContent>
      </Popover>
    </div>
  );
}

function dateLabel(event: ChurchEvent) {
  return format(new Date(event.date), "EEEE d 'de' MMMM", { locale: es });
}

function MinistryBadge({ ministry }: { ministry: Ministry | undefined }) {
  if (!ministry) return null;
  return (
    <p
      className="text-xs font-medium uppercase tracking-wider"
      style={{ color: ministry.color }}
    >
      {ministry.name}
    </p>
  );
}

function MetaRows({ event }: { event: ChurchEvent }) {
  return (
    <div className="flex flex-col gap-4 pt-2 text-sm">
      {event.description && (
        <p className="text-muted-foreground">{event.description}</p>
      )}
      {event.location && <Row label="Lugar" value={event.location} />}
      {event.responsible && (
        <Row label="Responsable" value={event.responsible} />
      )}
    </div>
  );
}

function ModalDetail({
  event,
  ministry,
}: {
  event: ChurchEvent;
  ministry: Ministry | undefined;
}) {
  return (
    <>
      <DialogHeader>
        <MinistryBadge ministry={ministry} />
        <DialogTitle>{event.title}</DialogTitle>
        <DialogDescription>
          {dateLabel(event)} · {event.startTime} – {event.endTime}
        </DialogDescription>
      </DialogHeader>
      <MetaRows event={event} />
    </>
  );
}

function DrawerDetail({
  event,
  ministry,
}: {
  event: ChurchEvent;
  ministry: Ministry | undefined;
}) {
  return (
    <>
      <SheetHeader>
        <MinistryBadge ministry={ministry} />
        <SheetTitle>{event.title}</SheetTitle>
        <SheetDescription>
          {dateLabel(event)} · {event.startTime} – {event.endTime}
        </SheetDescription>
      </SheetHeader>
      <div className="px-4 pb-6">
        <MetaRows event={event} />
      </div>
    </>
  );
}

function PopoverDetail({
  event,
  ministry,
}: {
  event: ChurchEvent;
  ministry: Ministry | undefined;
}) {
  return (
    <div>
      <MinistryBadge ministry={ministry} />
      <h3 className="mt-1 text-base font-medium tracking-tight">
        {event.title}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        {dateLabel(event)} · {event.startTime} – {event.endTime}
      </p>
      {event.description && (
        <p className="mt-3 text-sm text-muted-foreground">
          {event.description}
        </p>
      )}
      {event.location && <Row label="Lugar" value={event.location} />}
      {event.responsible && (
        <Row label="Responsable" value={event.responsible} />
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wider text-muted-foreground/70">
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}