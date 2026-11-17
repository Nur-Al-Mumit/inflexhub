/**
 * Hero (V1-3): full-bleed navy band, headline and both actions above the fold,
 * and a brand visual built from HTML/CSS + SVG: an abstract product window
 * with a rising chart and the logo's rising-arrow motif (design-system §9:
 * no stock photos, no photos of people). The visual is decorative only.
 */

import { CheckCircle2, Inbox } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { hero } from "@/content/home";
import { stagger } from "@/lib/motion";
import styles from "./Hero.module.css";

const chartBars = [34, 46, 40, 58, 52, 70, 88];

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />
      <Container className={styles.inner}>
        <div className={styles.copy}>
          <p className={`${styles.eyebrow} enter`} style={stagger(0)}>
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className={`${styles.headline} enter`} style={stagger(1)}>
            {hero.headline}
          </h1>
          <p className={`${styles.intro} enter`} style={stagger(2)}>
            {hero.intro}
          </p>
          <div className={`${styles.actions} enter`} style={stagger(3)}>
            <ButtonLink href={hero.primaryAction.href} size="lg" arrow>
              {hero.primaryAction.label}
            </ButtonLink>
            <ButtonLink
              href={hero.secondaryAction.href}
              size="lg"
              variant="onDarkOutline"
            >
              {hero.secondaryAction.label}
            </ButtonLink>
          </div>
          <ul className={`${styles.points} enter`} style={stagger(4)}>
            {hero.points.map((point) => (
              <li key={point}>
                <CheckCircle2 aria-hidden="true" size={18} />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className={`${styles.visual} enter`} style={stagger(2)} aria-hidden="true">
          <div className={styles.window}>
            <div className={styles.chrome}>
              <span />
              <span />
              <span />
              <i />
            </div>
            <div className={styles.app}>
              <div className={styles.side}>
                <b />
                <i className={styles.sideActive} />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className={styles.main}>
                <div className={styles.kpis}>
                  <div>
                    <i />
                    <b />
                  </div>
                  <div>
                    <i />
                    <b />
                  </div>
                  <div className={styles.kpiAccent}>
                    <i />
                    <b />
                  </div>
                </div>
                <div className={styles.chart}>
                  {chartBars.map((height, index) => (
                    <span
                      key={index}
                      style={{ height: `${height}%` }}
                      className={
                        index === chartBars.length - 1 ? styles.barAccent : undefined
                      }
                    />
                  ))}
                  <svg
                    className={styles.trend}
                    viewBox="0 0 100 60"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 50 C 22 44, 34 46, 48 34 S 74 22, 90 8"
                      fill="none"
                      stroke="var(--amber-400)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
                <div className={styles.rows}>
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.float} ${styles.floatTop}`}>
            <span className={styles.floatIconSuccess}>
              <CheckCircle2 size={18} />
            </span>
            <span className={styles.floatText}>
              <strong>Ready to use</strong>
              <small>Demo on request</small>
            </span>
          </div>
          <div className={`${styles.float} ${styles.floatBottom}`}>
            <span className={styles.floatIconAccent}>
              <Inbox size={18} />
            </span>
            <span className={styles.floatText}>
              <strong>New inquiry</strong>
              <small>Reference sent instantly</small>
            </span>
          </div>

          <svg className={styles.arrow} viewBox="0 0 120 120" fill="none">
            <path
              d="M14 106 L86 34"
              stroke="var(--amber-400)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path d="M58 22 L104 16 L98 62 Z" fill="var(--amber-400)" />
          </svg>
        </div>
      </Container>
    </section>
  );
}
