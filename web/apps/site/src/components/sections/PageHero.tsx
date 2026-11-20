/**
 * PageHero (ui-guidelines Part B): the navy top band for every inner page —
 * breadcrumbs, eyebrow, h1, intro, optional meta row (badges), actions, and
 * an optional aside (e.g. an "at a glance" card). Shorter than the home hero,
 * same visual language, staggered entrance.
 */

import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { stagger } from "@/lib/motion";
import styles from "./PageHero.module.css";

export type PageHeroProps = {
  readonly breadcrumbs?: {
    readonly items: readonly { readonly href: string; readonly label: string }[];
    readonly current: string;
  };
  readonly eyebrow?: string;
  readonly title: string;
  readonly intro?: string;
  /** Small row above the title, e.g. category + availability badge. */
  readonly meta?: ReactNode;
  readonly actions?: ReactNode;
  readonly aside?: ReactNode;
};

export function PageHero({
  breadcrumbs,
  eyebrow,
  title,
  intro,
  meta,
  actions,
  aside,
}: PageHeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="page-title">
      <div className={styles.backdrop} aria-hidden="true" />
      <Container className={styles.inner}>
        {breadcrumbs ? (
          <div className={`${styles.crumbs} enter`} style={stagger(0)}>
            <Breadcrumbs
              items={[...breadcrumbs.items]}
              current={breadcrumbs.current}
              tone="onDark"
            />
          </div>
        ) : null}
        <div className={aside ? styles.withAside : styles.single}>
          <div className={styles.copy}>
            {meta ? (
              <div className={`${styles.meta} enter`} style={stagger(1)}>
                {meta}
              </div>
            ) : null}
            {eyebrow ? (
              <p className={`${styles.eyebrow} enter`} style={stagger(1)}>
                {eyebrow}
              </p>
            ) : null}
            <h1 id="page-title" className={`${styles.title} enter`} style={stagger(2)}>
              {title}
            </h1>
            {intro ? (
              <p className={`${styles.intro} enter`} style={stagger(3)}>
                {intro}
              </p>
            ) : null}
            {actions ? (
              <div className={`${styles.actions} enter`} style={stagger(4)}>
                {actions}
              </div>
            ) : null}
          </div>
          {aside ? (
            <div className={`${styles.aside} enter`} style={stagger(3)}>
              {aside}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
