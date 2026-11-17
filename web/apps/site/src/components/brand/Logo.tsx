/**
 * InflexHub wordmark (V1-2 refinement): "Infle" navy, a drawn letter "x" —
 * navy stroke top-left → bottom-right, orange stroke bottom-left → top-right
 * rising out of the letter into a large amber arrowhead above the cap height
 * — then "Hub" orange, with no gap (design-system §2). The stroke weight
 * matches the letter stems (both scale with the font size); the x sits on the
 * text baseline. The tagline from the supplied logo file is not used (OV-6).
 */

import styles from "./Logo.module.css";

export type LogoProps = {
  /** Use the light-on-dark variant: "Infle" and the navy stroke turn white. */
  readonly onDark?: boolean;
};

export function Logo({ onDark = false }: LogoProps) {
  return (
    <span
      className={onDark ? `${styles.wordmark} ${styles.onDark}` : styles.wordmark}
      role="img"
      aria-label="InflexHub"
    >
      <span className={styles.infle}>Infle</span>
      <svg
        aria-hidden="true"
        className={styles.x}
        viewBox="0 0 101 100"
        fill="none"
      >
        {/* Navy stroke: top-left → bottom-right (round cap reaches the baseline). */}
        <line
          className={styles.xNavy}
          x1="14"
          y1="42"
          x2="66"
          y2="91.5"
          strokeWidth="17"
          strokeLinecap="round"
        />
        {/* Orange stroke: bottom-left → top-right, rising past the x-height. */}
        <line
          className={styles.xOrange}
          x1="14"
          y1="91.5"
          x2="78"
          y2="26"
          strokeWidth="17"
          strokeLinecap="round"
        />
        {/* Large amber arrowhead, tip above the cap height of "Hub". */}
        <polygon className={styles.arrowHead} points="100,2 89,30 73,13" />
      </svg>
      <span className={styles.hub}>Hub</span>
    </span>
  );
}
