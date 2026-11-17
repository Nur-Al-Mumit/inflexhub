"use client";

/**
 * CountUp (design-system §6 motion catalogue): counts from 0 to `value` over
 * 1.2 s (ease-out) the first time the number scrolls into view. The server
 * renders the real value, screen readers always read the real value, and
 * visitors who prefer reduced motion never see the animation.
 */

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 1200;

export function CountUp({ value }: { readonly value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let frame = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / DURATION_MS);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(value * eased));
        if (progress < 1) {
          frame = requestAnimationFrame(tick);
        }
      };
      setDisplay(0);
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <>
      <span className="visually-hidden">{value}</span>
      <span ref={ref} aria-hidden="true">
        {display}
      </span>
    </>
  );
}
