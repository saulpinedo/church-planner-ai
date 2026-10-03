// Ministry types — single source of truth for the 8 ministries defined in the PRD.
// Colors use the accent palette (oklch) so chips visually match the brand system.

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

export interface Ministry {
  id: MinistryId;
  name: string;
  /** HSL string suitable for `style={{ backgroundColor }}` or inline CSS. */
  color: string;
  /** Lucide icon name — resolved by the icon registry to keep this file framework-agnostic. */
  icon: string;
}

export const MINISTRIES: readonly Ministry[] = [
  { id: "cultos", name: "Cultos", color: "hsl(217 91% 60%)", icon: "Church" },
  { id: "jovenes", name: "Jóvenes", color: "hsl(142 71% 45%)", icon: "Flame" },
  { id: "musica", name: "Música", color: "hsl(262 83% 58%)", icon: "Music" },
  { id: "conquistadores", name: "Conquistadores", color: "hsl(24 95% 53%)", icon: "Compass" },
  { id: "aventureros", name: "Aventureros", color: "hsl(48 96% 53%)", icon: "Backpack" },
  { id: "dorcas", name: "Dorcas", color: "hsl(330 81% 60%)", icon: "HeartHandshake" },
  { id: "evangelismo", name: "Evangelismo", color: "hsl(0 84% 60%)", icon: "Megaphone" },
  { id: "escuela-sabatica", name: "Escuela Sabática", color: "hsl(199 89% 48%)", icon: "BookOpen" },
] as const;

export function getMinistry(id: MinistryId): Ministry | undefined {
  return MINISTRIES.find((m) => m.id === id);
}