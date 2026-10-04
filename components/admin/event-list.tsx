"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EventForm } from "@/components/admin/event-form";
import { deleteEventAction } from "@/app/admin/actions";
import type { ChurchEvent } from "@/lib/types/event";
import { MINISTRIES } from "@/lib/types/ministry";

interface EventListProps {
  events: ChurchEvent[];
}

export function EventList({ events }: EventListProps) {
  const [editing, setEditing] = useState<ChurchEvent | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleDelete(id: string, title: string) {
    if (!window.confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    startTransition(async () => {
      await deleteEventAction(id);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium tracking-tight">
          Eventos ({events.length})
        </h2>
        <Button onClick={() => setCreating(true)} size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Nueva actividad
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No hay eventos en este rango. Empezá creando una actividad.
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
          {events.map((e) => {
            const ministry = MINISTRIES.find((m) => m.id === e.ministry);
            return (
              <li
                key={e.id}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/30"
              >
                <span
                  aria-hidden
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: ministry?.color }}
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">
                    {e.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {ministry?.name ?? e.ministry} ·{" "}
                    {formatDate(e.date)} · {e.startTime} – {e.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditing(e)}
                    disabled={pending}
                    aria-label={`Editar ${e.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(e.id, e.title)}
                    disabled={pending}
                    aria-label={`Eliminar ${e.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <EventForm
        open={creating}
        onOpenChange={setCreating}
      />
      <EventForm
        open={editing !== null}
        onOpenChange={(o) => !o && setEditing(null)}
        event={editing ?? undefined}
      />
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("es", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}