"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createEventAction,
  findConflictsAction,
  updateEventAction,
} from "@/app/admin/actions";
import { MINISTRIES, type MinistryId } from "@/lib/types/ministry";
import type { ChurchEvent } from "@/lib/types/event";

interface EventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided, the form is in edit mode. */
  event?: ChurchEvent;
}

const DEFAULT_FORM = {
  title: "",
  description: "",
  ministry: "cultos" as MinistryId,
  date: "",
  endDate: "",
  startTime: "",
  endTime: "",
  location: "",
};

function buildInitialForm(event: ChurchEvent | undefined) {
  if (!event) return DEFAULT_FORM;
  return {
    title: event.title,
    description: event.description ?? "",
    ministry: event.ministry,
    date: event.date,
    endDate: event.endDate ?? event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location ?? "",
  };
}

export function EventForm({ open, onOpenChange, event }: EventFormProps) {
  const isEdit = Boolean(event);
  const initialForm = buildInitialForm(event);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<
    { title: string; startTime: string; endTime: string }[]
  >([]);
  const [pending, startTransition] = useTransition();

  // Reset state when the event prop changes (switching between editing
  // different events, or moving from create to edit). We reset inline rather
  // than in useEffect to satisfy React 19's set-state-in-effect rule.
  const [lastSyncedId, setLastSyncedId] = useState<string | null>(
    event?.id ?? null,
  );
  if (event && lastSyncedId !== event.id) {
    setForm(buildInitialForm(event));
    setError(null);
    setConflicts([]);
    setLastSyncedId(event.id);
  } else if (!event && lastSyncedId !== null) {
    setForm(DEFAULT_FORM);
    setError(null);
    setConflicts([]);
    setLastSyncedId(null);
  }

  function reset() {
    setForm(buildInitialForm(event));
    setError(null);
    setConflicts([]);
  }

  function close(open: boolean) {
    if (!open) reset();
    onOpenChange(open);
  }

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submit(force = false) {
    setError(null);
    if (!form.title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    if (!form.date || !form.endDate || !form.startTime || !form.endTime) {
      setError("Fechas y horas son obligatorias.");
      return;
    }
    if (form.endDate < form.date) {
      setError("La fecha de fin no puede ser anterior a la fecha de inicio.");
      return;
    }
    // Same day → times must be in order. Multi-day → any order is fine.
    if (form.date === form.endDate && form.startTime >= form.endTime) {
      setError("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }

    startTransition(async () => {
      const draft = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        ministry: form.ministry,
        date: form.date,
        endDate: form.endDate || form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location.trim() || undefined,
      };

      // Conflict detection — runs every time, but only blocks the submit
      // if the user hasn't acknowledged it.
      const conflictRes = await findConflictsAction(
        draft,
        event?.id,
      );
      const found =
        conflictRes.ok && conflictRes.data ? conflictRes.data.conflicts : [];
      if (found.length > 0 && !force) {
        setConflicts(
          found.map((c) => ({
            title: c.title,
            startTime: c.startTime,
            endTime: c.endTime,
          })),
        );
        return;
      }

      const action = isEdit
        ? updateEventAction(event!.id, draft)
        : createEventAction(draft);
      const res = await action;
      if (res.ok) {
        close(false);
      } else {
        setError(res.error ?? "Error desconocido.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar actividad" : "Nueva actividad"}
          </DialogTitle>
          <DialogDescription>
            Se guardará en tu Google Calendar. Si choca con otra actividad,
            te avisamos antes de guardar.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <Field label="Título">
            <Input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Culto divino"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Ministerio">
              <Select
                value={form.ministry}
                onValueChange={(v) => update("ministry", v as MinistryId)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MINISTRIES.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Fecha inicio">
              <Input
                type="date"
                value={form.date}
                onChange={(e) => {
                  update("date", e.target.value);
                  // Auto-set end date to start date if blank or earlier.
                  if (!form.endDate || form.endDate < e.target.value) {
                    update("endDate", e.target.value);
                  }
                }}
              />
            </Field>

            <Field label="Fecha fin">
              <Input
                type="date"
                value={form.endDate}
                min={form.date}
                onChange={(e) => update("endDate", e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Hora inicio">
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) => update("startTime", e.target.value)}
              />
            </Field>
            <Field label="Hora fin">
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) => update("endTime", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Lugar">
            <Input
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Templo principal"
            />
          </Field>

          <Field label="Descripción">
            <Textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              placeholder="Detalles de la actividad…"
            />
          </Field>

          {conflicts.length > 0 && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
              <p className="font-medium text-amber-700 dark:text-amber-300">
                ⚠ Hay {conflicts.length} actividad
                {conflicts.length > 1 ? "es" : ""} que se cruza
                {conflicts.length > 1 ? "n" : ""} con este horario:
              </p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                {conflicts.map((c, i) => (
                  <li key={i} className="text-xs">
                    {c.title} ({c.startTime} – {endLabel(c)})
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Podés cancelar, ajustar el horario, o guardar de todas formas.
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {conflicts.length > 0 ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => close(false)}
                disabled={pending}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => submit(true)}
                disabled={pending}
              >
                {pending ? "Guardando…" : "Guardar de todas formas"}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => close(false)}
                disabled={pending}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={() => submit(false)} disabled={pending}>
                {pending
                  ? "Guardando…"
                  : isEdit
                    ? "Guardar cambios"
                    : "Crear actividad"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function endLabel(c: { endTime: string }) {
  return c.endTime;
}