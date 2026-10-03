import { siteConfig } from "@/lib/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-border py-8">
      <div className="container flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          {year} · {siteConfig.name} · scaffold inicial · el calendario público llega pronto
        </p>
        <p className="font-mono">v{siteConfig.version}</p>
      </div>
    </footer>
  );
}