import { MINISTRIES } from "@/lib/types/ministry";

export function MinistryStrip() {
  return (
    <section id="ministerios" className="border-t border-border py-12 md:py-16">
      <div className="flex flex-col gap-6">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Ocho ministerios comparten un único calendario. El color los
          distingue; el conflicto de horarios se detecta antes de guardar.
        </p>

        <ul className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
          {MINISTRIES.map((m) => (
            <li key={m.id} className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: m.color }}
              />
              {m.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}