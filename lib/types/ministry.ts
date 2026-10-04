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

// Ministry hues are spread across the colour wheel so each one is
// immediately distinguishable. They use low chroma (~0.05–0.13) so they
// read as elegant rather than saturated-SaaS, and lightness in the 0.4–0.65
// band so they work in both light and dark mode.
export const MINISTRIES: readonly Ministry[] = [
  {
    id: "cultos",
    name: "Cultos",
    color: "oklch(0.4 0.05 145)",
    Icon: CultosIcon,
    description:
      "Servicios de adoración principales: sábado divino, oración de miércoles, vigilias y cultos especiales.",
  },
  {
    id: "jovenes",
    name: "Jóvenes",
    color: "oklch(0.55 0.13 60)",
    Icon: JovenesIcon,
    description:
      "Encuentros juveniles, estudios bíblicos, retiros y actividades de integración para adolescentes y jóvenes adultos.",
  },
  {
    id: "musica",
    name: "Música",
    color: "oklch(0.45 0.12 285)",
    Icon: MusicaIcon,
    description:
      "Ensayos del coro, orquesta y conjuntos. Presentaciones en cultos y eventos especiales de la iglesia.",
  },
  {
    id: "conquistadores",
    name: "Conquistadores",
    color: "oklch(0.55 0.1 35)",
    Icon: ConquistadoresIcon,
    description:
      "Club de aventureros mayores (10-15 años): clases, especialidades, campamentos y eventos de la división.",
  },
  {
    id: "aventureros",
    name: "Aventureros",
    color: "oklch(0.65 0.13 110)",
    Icon: AventurerosIcon,
    description:
      "Club para niños de 4 a 9 años: manualidades, naturaleza, actividades familiares y eventos del club.",
  },
  {
    id: "dorcas",
    name: "Dorcas",
    color: "oklch(0.6 0.09 5)",
    Icon: DorcasIcon,
    description:
      "Ministerio de acción social y servicio: visitas, ayuda a necesitados, ropería y proyectos comunitarios.",
  },
  {
    id: "evangelismo",
    name: "Evangelismo",
    color: "oklch(0.5 0.08 235)",
    Icon: EvangelismoIcon,
    description:
      "Actividades de alcance público: campañas, seminarios, visitas domiciliarias y eventos de testimonio.",
  },
  {
    id: "escuela-sabatica",
    name: "Escuela Sabática",
    color: "oklch(0.6 0.1 90)",
    Icon: EscuelaSabaticaIcon,
    description:
      "Estudio de la lección trimestral en clases por edad, antes del culto divino del sábado.",
  },
] as const;

export function getMinistry(id: MinistryId): Ministry | undefined {
  return MINISTRIES.find((m) => m.id === id);
}