import { siteConfig } from "@/lib/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-border py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>{year} · {siteConfig.name} · Próximamente</p>
        <p className="text-muted-foreground/60">v{siteConfig.version}</p>
      </div>
    </footer>
  );
}