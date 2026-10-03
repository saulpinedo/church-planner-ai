import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";

import { WeekPreview } from "./week-preview";

export function Hero() {
  return (
    <section className="grid gap-12 pt-20 pb-16 sm:pt-28 md:gap-16 md:pt-36 md:pb-24 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
      <div className="flex flex-col items-start gap-7 animate-[reveal_0.7s_cubic-bezier(0.22,1,0.36,1)_both]">
        <p className="text-sm text-muted-foreground">
          Plataforma de planificación
        </p>

        <h1 className="text-balance text-[clamp(2.75rem,6vw,5rem)] font-normal leading-[1.02] tracking-[-0.04em]">
          Un calendario.
          <br />
          <span className="text-muted-foreground">Toda la iglesia.</span>
        </h1>

        <p className="max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
          {siteConfig.description} Una sola fuente de verdad para que cada
          ministerio sepa qué hace el resto — sin cruces de horarios, sin doble
          reserva.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button size="lg" render={<a href="#ministerios" />}>
            Ver ministerios
          </Button>
        </div>
      </div>

      <div className="animate-[reveal_0.9s_cubic-bezier(0.22,1,0.36,1)_both] [animation-delay:120ms]">
        <WeekPreview />
      </div>
    </section>
  );
}