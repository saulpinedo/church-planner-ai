import Link from "next/link";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { siteConfig } from "@/lib/config/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link
          href="/"
          className="font-medium tracking-tight text-foreground"
        >
          {siteConfig.shortName.toLowerCase()}
          <span className="ml-2 text-muted-foreground">·</span>
          <span className="ml-2 text-muted-foreground">ai</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="#ministerios"
            className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground sm:inline-flex"
          >
            Ministerios
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}