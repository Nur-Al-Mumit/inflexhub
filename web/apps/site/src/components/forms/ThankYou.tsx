"use client";

/**
 * ThankYou (design-system §7 "Thank-you panel", P-13): replaces the form
 * after a successful submission. Shows the reference number and the next
 * steps; focus moves to its heading on mount.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import styles from "./ThankYou.module.css";

export type ThankYouProps = {
  readonly heading: string;
  readonly intro: string;
  readonly reference: string;
  readonly nextSteps: readonly string[];
  /** Extra content (the brochure form adds its download link here). */
  readonly children?: ReactNode;
};

export function ThankYou({ heading, intro, reference, nextSteps, children }: ThankYouProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className={styles.panel}>
      <span className={styles.icon} aria-hidden="true">
        <CheckCircle2 size={24} />
      </span>
      <h3 ref={headingRef} tabIndex={-1} className={styles.heading}>
        {heading}
      </h3>
      <p className={styles.intro}>{intro}</p>
      <p className={styles.referenceLabel}>Your reference</p>
      <p className={styles.reference}>{reference}</p>
      <h4 className={styles.stepsTitle}>What happens next</h4>
      <ol className={styles.steps}>
        {nextSteps.map((step) => (
          <li key={step} className={styles.step}>
            {step}
          </li>
        ))}
      </ol>
      {children}
    </div>
  );
}
