// Ministry types — single source of truth for the 8 ministries defined in the PRD.
// Colors use the moss family (oklch) so chips visually match the brand system.

import type { ComponentType, SVGProps } from "react";

export const MINISTRY_IDS = [
  "cultos",
  "jovenes",
  "musica",
  "conquistadores",
  "aventureros",
  "dorcas",
  "evangelismo",
  "escuela-sabatica",
] as const;

export type MinistryId = (typeof MINISTRY_IDS)[number];

export type MinistryIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface Ministry {
  id: MinistryId;
  name: string;
  /** OKLCH color for dots, icons, accents. */
  color: string;
  /** Custom SVG component — see components/ministry-icons.tsx */
  Icon: MinistryIconComponent;
  /** Short one-line description of what this ministry does. */
  description: string;
}

// Icon imports live in ministry-icons.tsx to keep this file framework-pure
// (no React component imports) — but TS imports of components are erased at
// build time so this stays safe.
import {
  AventurerosIcon,
  ConquistadoresIcon,
  CultosIcon,
  DorcasIcon,
  EscuelaSabaticaIcon,
  EvangelismoIcon,
  JovenesIcon,
  MusicaIcon,
} from "@/components/ministry-icons";

// Ministry hues live in the 25–165 range so they all harmonize with the
// moss accent. Saturation/lightness vary to keep each ministry distinguishable
// without breaking the palette.
export const MINISTRIES: readonly Ministry[] = [
  {
    id: "cultos",
    name: "Cultos",
    color: "oklch(0.5 0.12 145)",
    Icon: CultosIcon,
    description:
      "Servicios de adoración principales: sábado divino, oración de miércoles, vigilias y cultos especiales.",
  },
  {
    id: "jovenes",
    name: "Jóvenes",
    color: "oklch(0.55 0.14 60)",
    Icon: JovenesIcon,
    description:
      "Encuentros juveniles, estudios bíblicos, retiros y actividades de integración para adolescentes y jóvenes adultos.",
  },
  {
    id: "musica",
    name: "Música",
    color: "oklch(0.52 0.1 30)",
    Icon: MusicaIcon,
    description:
      "Ensayos del coro, orquesta y conjuntos. Presentaciones en cultos y eventos especiales de la iglesia.",
  },
  {
    id: "conquistadores",
    name: "Conquistadores",
    color: "oklch(0.58 0.13 85)",
    Icon: ConquistadoresIcon,
    description:
      "Club de aventureros mayores (10-15 años): clases, especialidades, campamentos y eventos de la división.",
  },
  {
    id: "aventureros",
    name: "Aventureros",
    color: "oklch(0.6 0.13 105)",
    Icon: AventurerosIcon,
    description:
      "Club para niños de 4 a 9 años: manualidades, naturaleza, actividades familiares y eventos del club.",
  },
  {
    id: "dorcas",
    name: "Dorcas",
    color: "oklch(0.55 0.13 25)",
    Icon: DorcasIcon,
    description:
      "Ministerio de acción social y servicio: visitas, ayuda a necesitados, ropería y proyectos comunitarios.",
  },
  {
    id: "evangelismo",
    name: "Evangelismo",
    color: "oklch(0.5 0.14 20)",
    Icon: EvangelismoIcon,
    description:
      "Actividades de alcance público: campañas, seminarios, visitas domiciliarias y eventos de testimonio.",
  },
  {
    id: "escuela-sabatica",
    name: "Escuela Sabática",
    color: "oklch(0.5 0.1 160)",
    Icon: EscuelaSabaticaIcon,
    description:
      "Estudio de la lección trimestral en clases por edad, antes del culto divino del sábado.",
  },
] as const;

export function getMinistry(id: MinistryId): Ministry | undefined {
  return MINISTRIES.find((m) => m.id === id);
}