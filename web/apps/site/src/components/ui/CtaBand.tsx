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
  return (
    <section className={styles.band}>
      <Container className={styles.inner}>
        <div className={styles.copy}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h2 className={styles.title}>{title}</h2>
          {intro ? <p className={styles.intro}>{intro}</p> : null}
        </div>
        <ButtonLink href={cta.href} size="lg" arrow className={styles.cta}>
          {cta.label}
        </ButtonLink>
      </Container>
    </section>
  );
}
