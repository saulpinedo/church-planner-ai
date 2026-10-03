import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";

import { WeekPreview } from "./week-preview";

export function Hero() {
  return (
    <section className="grid gap-14 pt-20 pb-14 sm:pt-28 md:gap-16 md:pt-32 md:pb-20 lg:grid-cols-2 lg:gap-12">
      <div className="flex flex-col items-start gap-7 animate-[reveal_0.7s_cubic-bezier(0.22,1,0.36,1)_both]">
        <p className="text-sm text-muted-foreground">
          Plataforma de planificación
        </p>

        <h1 className="text-balance text-[clamp(2.75rem,6vw,5rem)] font-medium leading-[1.02] tracking-[-0.035em]">
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
          <Button
            size="lg"
            nativeButton={false}
            render={<a href="#ministerios" />}
          >
            Ver ministerios
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<a href="#como-funciona" />}
          >
            Cómo funciona
          </Button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[560px] animate-[reveal_0.9s_cubic-bezier(0.22,1,0.36,1)_both] [animation-delay:120ms] lg:mx-0 lg:ml-auto">
        <WeekPreview />
      </div>
    </section>
  );
}