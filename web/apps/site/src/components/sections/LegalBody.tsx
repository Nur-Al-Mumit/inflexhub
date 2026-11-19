/**
 * LegalBody (V1-11): long-form legal text (privacy policy, terms) rendered
 * from the LegalDocument shape in content/legal.ts. Prose column with
 * section headings; "last updated" shown up front.
 */

import type { LegalDocument } from "@/content/legal";
import styles from "./LegalBody.module.css";

export type LegalBodyProps = {
  readonly document: LegalDocument;
};

export function LegalBody({ document: doc }: LegalBodyProps) {
  const updated = doc.updatedLabel
    ? `${doc.updatedLabel} ${doc.lastUpdated}`
    : `Last updated ${doc.lastUpdated} (draft — pending legal review, OV-7)`;
  return (
    <div className={styles.body}>
      <p className={styles.updated}>{updated}</p>
      {doc.sections.map((section) => (
        <section key={section.heading} className={styles.section}>
          <h2 className={styles.heading}>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
          {section.bullets ? (
            <ul className={styles.list}>
              {section.bullets.map((bullet) => (
                <li key={bullet.slice(0, 24)}>{bullet}</li>
              ))}
            </ul>
          ) : null}
          {section.link ? (
            <a className={styles.link} href={section.link.href}>
              {section.link.label}
            </a>
          ) : null}
        </section>
      ))}
    </div>
  );
}
