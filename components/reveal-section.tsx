"use client";

import type { ComponentPropsWithoutRef } from "react";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

/**
 * Wraps children in a div that fades and slides into view the first time it
 * scrolls into the viewport. Honors `prefers-reduced-motion`.
 *
 * Use one per section — keeps the page-load animation orchestrated rather
 * than firing on every element.
 */
export function RevealSection({
  children,
  delay = 0,
  ...rest
}: ComponentPropsWithoutRef<"div"> & { delay?: number }) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{
        ...(rest.style ?? {}),
        animationDelay: `${delay}ms`,
      }}
      className={[
        "transition-all duration-700 ease-out",
        revealed
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2",
        rest.className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}