import { Bell, CalendarCheck2, ListChecks } from "lucide-react";

import { siteConfig } from "@/lib/config/site";

const STEPS = [
  {
    n: "01",
    Icon: ListChecks,
    title: "Registra una actividad",
    body:
      "Elige ministerio, fecha, hora y responsable. El sistema revisa el calendario y te avisa si choca con otra actividad — pero nunca bloquea.",
  },
  {
    n: "02",
    Icon: CalendarCheck2,
    title: "Aparece en el calendario",
    body:
      "Todo se guarda en un único Google Calendar compartido. Los visitantes ven el calendario público sin iniciar sesión, filtran por ministerio y activan notificaciones.",
  },
  {
    n: "03",
    Icon: Bell,
    title: "Avisamos a quienes les interesa",
    body:
      `Los feligreses reciben notificaciones push del navegador según sus preferencias: ${siteConfig.shortName} les avisa antes de cada actividad, sin registro ni contraseñas.`,
  },
] as const;

export function HowItWorks() {
  return (
    <section id="como-funciona" className="border-t border-border py-16 md:py-24">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">Cómo funciona</p>
          <h2 className="text-balance text-3xl font-medium leading-tight tracking-[-0.02em] sm:text-4xl md:text-5xl">
            Tres pasos.
            <br />
            <span className="text-muted-foreground">Una sola fuente de verdad.</span>
          </h2>
        </div>

        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground/70">
                  {step.n}
                </span>
                <step.Icon
                  className="h-5 w-5 text-brand"
                  strokeWidth={1.75}
                />
              </div>

              <h3 className="text-base font-medium tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}