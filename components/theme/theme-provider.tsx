"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Wrapper around `next-themes`' ThemeProvider.
 *
 * Three modes cycle in the toggle:
 *   - `light`    → paper + ink + moss accent (default)
 *   - `dark`     → near-black + ink + moss accent
 *   - `colorful` → boosted ministry colors, used as the global accent.
 *                  Ministry chips and calendar events stay vivid in this
 *                  mode so the calendar reads as a colourful map.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      themes={["light", "dark", "colorful"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}