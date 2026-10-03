"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

/**
 * Subscribe to a "did the component mount on the client yet" signal via
 * `useSyncExternalStore`, avoiding the deprecated `useEffect(() => setMounted(true))`
 * pattern (which trips the `react-hooks/set-state-in-effect` rule).
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
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative"
    >
      <Sun
        className={`h-4 w-4 transition-all ${
          isDark ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all ${
          isDark ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      />
      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}