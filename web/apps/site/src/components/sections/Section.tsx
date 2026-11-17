/**
 * Section (design-system §7): the one wrapper every page section uses, so
 * spacing, alignment and heading style are identical everywhere.
 * Header row: eyebrow + h2 + intro on the left, optional action on the right.
 * `split` puts the header in a left column and the content on the right.
 */

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import styles from "./Section.module.css";

export type SectionProps = {
  /** Unique id; the h2 gets `${id}-title` and labels the section. */
  readonly id: string;
  readonly eyebrow?: string;
  readonly title: string;
  readonly intro?: string;
  readonly action?: { readonly href: string; readonly label: string };
  readonly tone?: "default" | "alt" | "dark";
  readonly layout?: "stacked" | "split";
  /** Extra content under the header in the split layout's left column. */
  readonly aside?: ReactNode;
  readonly children: ReactNode;
};

export function Section({
  id,
  eyebrow,
  title,
  intro,
  action,
  tone = "default",
  layout = "stacked",
  aside,
  children,
}: SectionProps) {
  const titleId = `${id}-title`;
  const header = (
    <div className={styles.headerCopy}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      {intro ? <p className={styles.intro}>{intro}</p> : null}
    </div>
  );
  const actionLink = action ? (
    <Link href={action.href} className={styles.action}>
      {action.label}
      <ArrowRight aria-hidden="true" size={18} />
    </Link>
  ) : null;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={[styles.section, styles[tone]].join(" ")}
    >
      <Container>
        {layout === "split" ? (
          <div className={styles.split}>
            <div className={`${styles.splitHeader} reveal`}>
              {header}
              {actionLink}
              {aside}
            </div>
            <div>{children}</div>
          </div>
        ) : (
          <>
            <div className={`${styles.headerRow} reveal`}>
              {header}
              {actionLink}
            </div>
            {children}
          </>
        )}
      </Container>
    </section>
  );
}
