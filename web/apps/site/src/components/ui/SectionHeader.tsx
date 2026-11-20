/**
 * SectionHeader (V1-1): eyebrow, title, intro; left or centered; the heading
 * level is passed in (design-system §7).
 */

import styles from "./SectionHeader.module.css";

export type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  /** Heading level, e.g. 2 for section titles. */
  level?: 1 | 2 | 3 | 4;
};

export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = "left",
  level = 2,
}: SectionHeaderProps) {
  const Tag = (`h${level}` as const);
  return (
    <div
      className={[styles.sectionHeader, align === "center" ? styles.center : ""]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <Tag
        className={[styles.title, level === 1 ? styles.titleH1 : ""]
          .filter(Boolean)
          .join(" ")}
      >
        {title}
      </Tag>
      {intro ? <p className={styles.intro}>{intro}</p> : null}
    </div>
  );
}
