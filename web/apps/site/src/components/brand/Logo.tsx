/**
 * InflexHub wordmark (M0-6): "Infle" navy, a drawn letter "x" — navy stroke
 * top-left → bottom-right, orange stroke bottom-left → top-right that rises
 * out of the letter into an amber arrowhead — then "Hub" orange
 * (design-system §2). The x sits on the text baseline and scales with the
 * font size. The tagline from the supplied logo file is not used (OV-6).
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
        viewBox="0 0 104 96"
        fill="none"
      >
        {/* Navy stroke: top-left → bottom-right. */}
        <line
          className={styles.xNavy}
          x1="10"
          y1="38"
          x2="70"
          y2="90"
          strokeWidth="11"
          strokeLinecap="round"
        />
        {/* Orange stroke: bottom-left → top-right, continuing past the x-height. */}
        <line
          className={styles.xOrange}
          x1="10"
          y1="90"
          x2="84"
          y2="26"
          strokeWidth="11"
          strokeLinecap="round"
        />
        {/* Amber arrowhead pointing up-right, at the end of the orange stroke. */}
        <polygon className={styles.arrowHead} points="96,16 85,40 71,23" />
      </svg>
      <span className={styles.hub}>Hub</span>
    </span>
  );
}
