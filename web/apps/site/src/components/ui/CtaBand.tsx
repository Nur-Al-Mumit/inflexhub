/**
 * CtaBand (V1-1): dark navy section with an orange accent for the final call
 * to action (design-system §7, §9 dark sections).
 */

import { Container } from "./Container";
import { ButtonLink } from "./ButtonLink";
import styles from "./CtaBand.module.css";

export type CtaBandProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  cta: {
    href: string;
    label: string;
  };
};

export function CtaBand({ eyebrow, title, intro, cta }: CtaBandProps) {
  const titleId = `cta-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
  return (
    <section className={styles.band} aria-labelledby={titleId}>
      <Container className={styles.inner}>
        <div className={styles.copy}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {intro ? <p className={styles.intro}>{intro}</p> : null}
        </div>
        <ButtonLink href={cta.href} size="lg" arrow className={styles.cta}>
          {cta.label}
        </ButtonLink>
      </Container>
    </section>
  );
}
