import type { Ministry } from "@/lib/types/ministry";
import { MINISTRIES } from "@/lib/types/ministry";

export function MinistryStrip() {
  return (
    <section id="ministerios" className="border-t border-border py-16 md:py-24">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">Los ministerios</p>
          <h2 className="text-balance text-3xl font-medium leading-tight tracking-[-0.02em] sm:text-4xl md:text-5xl">
            Ocho ministerios.
            <br />
            <span className="text-muted-foreground">Un mismo calendario.</span>
          </h2>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
            Cada ministerio conserva su color y su identidad. El sistema detecta
            cuándo dos actividades quieren el mismo horario — y te avisa antes
            de guardar, no después.
          </p>
        </div>

        <ul className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {MINISTRIES.map((m) => (
            <MinistryCard key={m.id} ministry={m} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function MinistryCard({ ministry }: { ministry: Ministry }) {
  const { Icon } = ministry;
  return (
    <li className="group relative flex flex-col gap-5 bg-card p-6 transition-colors duration-300 hover:bg-muted/40">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px scale-x-0 bg-foreground/30 transition-transform duration-500 ease-out group-hover:scale-x-100"
      />

      <div className="flex items-center justify-between">
        <span
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-105"
          style={{
            backgroundColor: `color-mix(in oklch, ${ministry.color}, transparent 82%)`,
          }}
        >
          <Icon
            className="h-5 w-5 transition-transform duration-500 ease-out group-hover:rotate-[-4deg]"
            style={{ color: ministry.color }}
          />
        </span>
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full opacity-50 transition-all duration-500 ease-out group-hover:scale-150 group-hover:opacity-100"
          style={{ backgroundColor: ministry.color }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-medium tracking-tight">{ministry.name}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {ministry.description}
        </p>
      </div>
    </li>
  );
}