"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme/theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="font-medium tracking-tight text-foreground"
        >
          church planner
          <span className="ml-2 text-muted-foreground/70">/ ai</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/calendario"
            className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground sm:inline-flex"
          >
            Calendario
          </Link>
          {isHome && (
            <Link
              href="#ministerios"
              className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground sm:inline-flex"
            >
              Ministerios
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}