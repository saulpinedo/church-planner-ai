import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/**
 * Custom hand-drawn SVGs for each ministry.
 *
 * Style: 1.75 stroke width, rounded line caps, minimalist line art.
 * Designed to feel related (consistent visual language) but each one
 * distinctly represents the ministry's domain.
 *
 * All icons inherit `currentColor` so they take the ministry's color from
 * the parent. No hardcoded fills — single-color line art.
 */

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 48 48",
  width: 24,
  height: 24,
};

/** Cultos — altar/mesa con cruz mínima */
export function CultosIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 6 L24 26" />
      <path d="M18 14 L30 14" />
      <path d="M10 36 L38 36" />
      <path d="M14 30 L14 36" />
      <path d="M34 30 L34 36" />
      <path d="M10 30 L38 30" />
    </svg>
  );
}

/** Jóvenes — antorcha estilizada */
export function JovenesIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 8 C26 12 28 14 28 17 C28 19 26 21 24 21 C22 21 20 19 20 17 C20 14 22 12 24 8 Z" />
      <path d="M24 21 L24 40" />
      <path d="M19 30 L29 30" />
      <path d="M20 40 L28 40" />
    </svg>
  );
}

/** Música — nota con onda */
export function MusicaIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18 32 A4 4 0 1 1 18 24 A4 4 0 0 1 18 32 Z" />
      <path d="M32 28 A4 4 0 1 1 32 20 A4 4 0 0 1 32 28 Z" />
      <path d="M22 28 L22 14 L36 10 L36 20" />
      <path d="M22 14 L36 10" />
    </svg>
  );
}

/** Conquistadores — brújula con estrella */
export function ConquistadoresIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="24" r="16" />
      <circle cx="24" cy="24" r="11" />
      <path d="M24 16 L26 22 L32 24 L26 26 L24 32 L22 26 L16 24 L22 22 Z" />
    </svg>
  );
}

/** Aventureros — mochila con montañita */
export function AventurerosIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 18 C14 14 18 12 24 12 C30 12 34 14 34 18 L34 38 L14 38 Z" />
      <path d="M20 18 L20 14 C20 12 22 10 24 10 C26 10 28 12 28 14 L28 18" />
      <path d="M18 26 L30 26" />
      <circle cx="24" cy="32" r="2" />
    </svg>
  );
}

/** Dorcas — corazón con manos */
export function DorcasIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 38 C20 34 10 28 10 20 C10 15 14 12 18 12 C21 12 23 14 24 16 C25 14 27 12 30 12 C34 12 38 15 38 20 C38 28 28 34 24 38 Z" />
      <path d="M18 22 L22 26 L30 18" />
    </svg>
  );
}

/** Evangelismo — megáfono con ondas */
export function EvangelismoIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 20 L8 28 L16 28 L30 36 L30 12 L16 20 Z" />
      <path d="M34 18 C36 20 36 28 34 30" />
      <path d="M38 14 C42 18 42 30 38 34" />
    </svg>
  );
}

/** Escuela Sabática — libro abierto con marcador */
export function EscuelaSabaticaIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 14 L24 18 L40 14 L40 36 L24 40 L8 36 Z" />
      <path d="M24 18 L24 40" />
      <path d="M14 22 L20 24" />
      <path d="M14 26 L20 28" />
      <path d="M28 24 L34 22" />
      <path d="M28 28 L34 26" />
    </svg>
  );
}