"use client";

import { Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

type Mode = "light" | "dark" | "colorful";

const ORDER: Mode[] = ["light", "dark", "colorful"];

/**
 * SSR-safe mounted flag. Server snapshot is `false`, client snapshot `true`.
 * Avoids the `set-state-in-effect` lint rule while preserving the
 * hydration-mismatch guard.
 */
function subscribe() {
  return () => {};
}
function getClientSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  // resolvedTheme is "light" or "dark"; "colorful" is detected via the raw
  // theme value because it doesn't resolve to either.
  const current = (
    mounted
      ? theme === "colorful"
        ? "colorful"
        : resolvedTheme
      : "light"
  ) as Mode;

  function cycle() {
    const idx = ORDER.indexOf(current);
    const next = ORDER[(idx + 1) % ORDER.length];
    setTheme(next);
  }

  const label =
    current === "dark"
      ? "Cambiar a modo colorido"
      : current === "colorful"
        ? "Cambiar a modo claro"
        : "Cambiar a modo oscuro";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={cycle}
      title={label}
    >
      {/* Render all three icons; opacity flips based on the active mode. */}
      <Sun
        className={`h-4 w-4 transition-all ${
          current === "light"
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all ${
          current === "dark"
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0"
        }`}
      />
      <Palette
        className={`absolute h-4 w-4 transition-all ${
          current === "colorful"
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0"
        }`}
      />
      <span className="sr-only">{label}</span>
    </Button>
  );
}