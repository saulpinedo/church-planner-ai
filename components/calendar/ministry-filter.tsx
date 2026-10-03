"use client";

import { MINISTRIES, type MinistryId } from "@/lib/types/ministry";

interface MinistryFilterProps {
  visible: Set<MinistryId>;
  onToggle: (id: MinistryId) => void;
  onToggleAll: () => void;
}

export function MinistryFilter({
  visible,
  onToggle,
  onToggleAll,
}: MinistryFilterProps) {
  const allOn = visible.size === MINISTRIES.length;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onToggleAll}
        className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {allOn ? "Ocultar todos" : "Mostrar todos"}
      </button>
      <span aria-hidden className="text-muted-foreground/30">·</span>
      {MINISTRIES.map((m) => {
        const isOn = visible.has(m.id);
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onToggle(m.id)}
            aria-pressed={isOn}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all ${
              isOn
                ? "border-border bg-card text-foreground"
                : "border-border/40 bg-transparent text-muted-foreground/50"
            }`}
          >
            <span
              aria-hidden
              className={`h-2 w-2 rounded-full transition-opacity ${
                isOn ? "opacity-100" : "opacity-30"
              }`}
              style={{ backgroundColor: m.color }}
            />
            {m.name}
          </button>
        );
      })}
    </div>
  );
}