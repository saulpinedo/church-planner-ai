import { addDays, addWeeks, setHours, setMinutes, startOfWeek } from "date-fns";

import type { ChurchEvent, ChurchEventDraft } from "@/lib/types/event";
import type { MinistryId } from "@/lib/types/ministry";

import type { CalendarProvider } from "@/lib/config/calendar";

/**
 * Mock implementation of the CalendarProvider that returns synthetic events
 * distributed across the current month. Used by the public `/calendario`
 * page until Phase 2 wires up the real Google Calendar provider.
 *
 * Deterministic — uses a fixed seed per call so the UI is stable across
 * server renders and client navigations.
 */

interface Template {
  ministry: MinistryId;
  title: string;
  description: string;
  location?: string;
  responsible?: string;
  /** Hour in 24h format */
  hour: number;
  minute?: number;
  /** Duration in minutes */
  duration: number;
  /** Weekday offset: 0 = this Monday, 1 = next Monday, etc. */
  weekOffset: number;
  /** Day of week (0=Sun, 1=Mon, ... 6=Sat) */
  weekday: number;
}

const TEMPLATES: Template[] = [
  // ─── Lunes (weekday=1) ─────────────────────────────────────────
  { ministry: "musica", title: "Ensayo coro", description: "Ensayo general del coro de la iglesia.", location: "Templo principal", responsible: "Hno. García", hour: 19, minute: 30, duration: 90, weekOffset: 0, weekday: 1 },
  { ministry: "musica", title: "Ensayo orquesta", description: "Práctica de la orquesta.", hour: 20, duration: 60, weekOffset: 1, weekday: 1 },
  { ministry: "musica", title: "Ensayo coro", description: "Ensayo general.", hour: 19, minute: 30, duration: 90, weekOffset: 2, weekday: 1 },
  { ministry: "musica", title: "Ensayo coro", description: "Ensayo general.", hour: 19, minute: 30, duration: 90, weekOffset: 3, weekday: 1 },

  // ─── Martes (weekday=2) ──────────────────────────────────────
  { ministry: "jovenes", title: "Estudio bíblico juvenil", description: "Estudio del libro de Romanos.", location: "Salón juvenil", responsible: "Hna. Martínez", hour: 19, duration: 90, weekOffset: 0, weekday: 2 },
  { ministry: "jovenes", title: "Estudio bíblico", description: "Estudio de Hebreos.", hour: 19, duration: 90, weekOffset: 1, weekday: 2 },
  { ministry: "jovenes", title: "Estudio bíblico", description: "Continuación.", hour: 19, duration: 90, weekOffset: 2, weekday: 2 },
  { ministry: "jovenes", title: "Noche de oración", description: "Vigilia mensual.", hour: 21, duration: 120, weekOffset: 3, weekday: 2 },

  // ─── Miércoles (weekday=3) ───────────────────────────────────
  { ministry: "cultos", title: "Culto de oración", description: "Servicio de oración de miércoles.", location: "Templo principal", responsible: "Pastor principal", hour: 19, minute: 30, duration: 90, weekOffset: 0, weekday: 3 },
  { ministry: "cultos", title: "Culto de oración", description: "Servicio de oración.", hour: 19, minute: 30, duration: 90, weekOffset: 1, weekday: 3 },
  { ministry: "cultos", title: "Culto de oración", description: "Servicio de oración.", hour: 19, minute: 30, duration: 90, weekOffset: 2, weekday: 3 },
  { ministry: "cultos", title: "Culto de oración", description: "Servicio de oración.", hour: 19, minute: 30, duration: 90, weekOffset: 3, weekday: 3 },
  { ministry: "dorcas", title: "Reunión Dorcas", description: "Planificación de proyectos sociales.", location: "Salón Dorcas", responsible: "Dir. Dorcas", hour: 15, duration: 120, weekOffset: 1, weekday: 3 },

  // ─── Jueves (weekday=4) ──────────────────────────────────────
  { ministry: "conquistadores", title: "Clase de Conquistadores", description: "Clase regular. Traer uniforme completo.", location: "Salón Conquistadores", hour: 17, duration: 90, weekOffset: 0, weekday: 4 },
  { ministry: "conquistadores", title: "Clase de Conquistadores", description: "Clase regular.", hour: 17, duration: 90, weekOffset: 1, weekday: 4 },
  { ministry: "conquistadores", title: "Clase de Conquistadores", description: "Clase regular.", hour: 17, duration: 90, weekOffset: 2, weekday: 4 },
  { ministry: "conquistadores", title: "Clase de Conquistadores", description: "Clase regular.", hour: 17, duration: 90, weekOffset: 3, weekday: 4 },
  { ministry: "evangelismo", title: "Estudio de Profecías", description: "Continúa la serie de estudios públicos.", location: "Salón de conferencias", hour: 19, duration: 90, weekOffset: 1, weekday: 4 },
  { ministry: "evangelismo", title: "Estudio de Profecías", description: "Continúa la serie.", hour: 19, duration: 90, weekOffset: 2, weekday: 4 },

  // ─── Viernes (weekday=5) ──────────────────────────────────────
  { ministry: "jovenes", title: "Ensayo grupo musical", description: "Ensayo del grupo musical juvenil.", location: "Salón juvenil", hour: 19, duration: 90, weekOffset: 0, weekday: 5 },
  { ministry: "jovenes", title: "Ensayo grupo musical", description: "Ensayo.", hour: 19, duration: 90, weekOffset: 1, weekday: 5 },
  { ministry: "jovenes", title: "Ensayo grupo musical", description: "Ensayo.", hour: 19, duration: 90, weekOffset: 2, weekday: 5 },
  { ministry: "jovenes", title: "Noche de integración", description: "Velada juvenil mensual.", location: "Templo principal", hour: 20, duration: 180, weekOffset: 3, weekday: 5 },
  { ministry: "aventureros", title: "Reunión de padres", description: "Reunión informativa para padres de Aventureros.", hour: 18, duration: 60, weekOffset: 1, weekday: 5 },

  // ─── Sábado (weekday=6) — día fuerte ─────────────────────────
  { ministry: "escuela-sabatica", title: "Escuela Sabática", description: "Estudio de la lección trimestral en clases por edad.", location: "Salones de Escuela Sabática", responsible: "Maestros ES", hour: 9, minute: 30, duration: 90, weekOffset: 0, weekday: 6 },
  { ministry: "cultos", title: "Culto divino", description: "Servicio de adoración principal. Sermón: Pastor invitado.", location: "Templo principal", responsible: "Pastor principal", hour: 11, duration: 90, weekOffset: 0, weekday: 6 },
  { ministry: "escuela-sabatica", title: "Escuela Sabática", description: "Estudio de la lección.", location: "Salones ES", hour: 9, minute: 30, duration: 90, weekOffset: 1, weekday: 6 },
  { ministry: "cultos", title: "Culto divino", description: "Culto principal.", location: "Templo principal", hour: 11, duration: 90, weekOffset: 1, weekday: 6 },
  { ministry: "escuela-sabatica", title: "Escuela Sabática", description: "Estudio de la lección.", location: "Salones ES", hour: 9, minute: 30, duration: 90, weekOffset: 2, weekday: 6 },
  { ministry: "cultos", title: "Culto divino", description: "Culto principal.", location: "Templo principal", hour: 11, duration: 90, weekOffset: 2, weekday: 6 },
  { ministry: "escuela-sabatica", title: "Escuela Sabática", description: "Estudio de la lección.", location: "Salones ES", hour: 9, minute: 30, duration: 90, weekOffset: 3, weekday: 6 },
  { ministry: "cultos", title: "Culto divino", description: "Culto principal.", location: "Templo principal", hour: 11, duration: 90, weekOffset: 3, weekday: 6 },
  { ministry: "aventureros", title: "Aventureros", description: "Programa regular del club. Traer cuadernillo.", location: "Salón Aventureros", hour: 14, duration: 120, weekOffset: 0, weekday: 6 },
  { ministry: "aventureros", title: "Aventureros", description: "Programa regular.", hour: 14, duration: 120, weekOffset: 1, weekday: 6 },
  { ministry: "aventureros", title: "Aventureros", description: "Programa regular.", hour: 14, duration: 120, weekOffset: 2, weekday: 6 },
  { ministry: "aventureros", title: "Aventureros", description: "Programa regular.", hour: 14, duration: 120, weekOffset: 3, weekday: 6 },
  { ministry: "dorcas", title: "Visita a enfermos", description: "Visitas programadas a miembros enfermos.", hour: 15, duration: 120, weekOffset: 2, weekday: 6 },

  // ─── Domingo (weekday=0) ──────────────────────────────────────
  { ministry: "musica", title: "Práctica instrumentos", description: "Práctica individual.", hour: 16, duration: 90, weekOffset: 0, weekday: 0 },
  { ministry: "evangelismo", title: "Visita domiciliaria", description: "Equipo de visitación.", location: "Barrios asignados", hour: 14, duration: 180, weekOffset: 1, weekday: 0 },
  { ministry: "jovenes", title: "Encuentro deportivo", description: "Fútbol y recreación.", location: "Cancha", hour: 16, duration: 120, weekOffset: 2, weekday: 0 },
];

function templateToEvent(t: Template, monday: Date): ChurchEvent {
  // Build the target date: monday + weekOffset weeks + weekday days.
  const target = addDays(addWeeks(monday, t.weekOffset), t.weekday);
  let start = setHours(target, t.hour);
  if (t.minute !== undefined) start = setMinutes(start, t.minute);
  const end = new Date(start.getTime() + t.duration * 60_000);

  const draft: ChurchEventDraft = {
    title: t.title,
    description: t.description,
    ministry: t.ministry,
    date: target.toISOString().slice(0, 10),
    startTime: start.toTimeString().slice(0, 5),
    endTime: end.toTimeString().slice(0, 5),
    location: t.location,
    responsible: t.responsible,
  };

  return {
    ...draft,
    id: `mock-${t.ministry}-${t.weekOffset}-${t.weekday}-${t.hour}${t.minute ?? 0}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export class MockCalendarProvider implements CalendarProvider {
  async listEvents(params: { from: string; to: string }): Promise<ChurchEvent[]> {
    const fromDate = new Date(params.from);
    const monday = startOfWeek(fromDate, { weekStartsOn: 1 });

    const events = TEMPLATES.map((t) => templateToEvent(t, monday));

    // Filter to range so the calendar only renders relevant events.
    const toDate = new Date(params.to);
    return events.filter((e) => {
      const d = new Date(e.date);
      return d >= fromDate && d <= toDate;
    });
  }

  async getEvent(id: string): Promise<ChurchEvent | null> {
    const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
    const events = TEMPLATES.map((t) => templateToEvent(t, monday));
    return events.find((e) => e.id === id) ?? null;
  }

  async createEvent(): Promise<ChurchEvent> {
    throw new Error("Mock provider: createEvent is not supported.");
  }
  async updateEvent(): Promise<ChurchEvent> {
    throw new Error("Mock provider: updateEvent is not supported.");
  }
  async deleteEvent(): Promise<void> {
    throw new Error("Mock provider: deleteEvent is not supported.");
  }

  async findConflicts(): Promise<ChurchEvent[]> {
    return [];
  }
}