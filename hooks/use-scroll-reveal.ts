"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal an element the first time it scrolls into the viewport.
 *
 * SSR-safe default: `revealed` starts as `true` so server-rendered content is
 * always visible. On mount, if the user has motion enabled AND the element is
 * below the fold, we flip to hidden and let the IntersectionObserver reveal it.
 *
 * Honors `prefers-reduced-motion` (skip animation entirely).
 */
export function useScrollReveal<T extends HTMLElement>(options?: {
  rootMargin?: string;
  threshold?: number;
}) {
  const ref = useRef<T>(null);
  // Start as revealed so SSR shows content immediately. The effect may flip
  // this to false on the client if we want to animate.
  const [revealed, setRevealed] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    // If already in view on mount, no need to hide-then-reveal.
    const rect = node.getBoundingClientRect();
    const inView =
      rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) return;

    setRevealed(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: options?.rootMargin ?? "0px 0px -10% 0px",
        threshold: options?.threshold ?? 0.05,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options?.rootMargin, options?.threshold]);

  return { ref, revealed };
}