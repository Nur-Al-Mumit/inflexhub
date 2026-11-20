/**
 * About (V1-11, PRD P-9, US-10): story, mission/vision, values, what we do
 * (catalog facts only, OV-4), CTA. Copy in src/content/about.ts (OV-2);
 * legal details are OV-18 placeholders from content/company.ts.
 */

import type { Metadata } from "next";
import { Compass, Eye, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { CardGrid } from "@/components/ui/CardGrid";
import { CtaBand } from "@/components/ui/CtaBand";
import { company } from "@/content/company";
import {
  ctaBand,
  hero,
  mission,
  story,
  values,
  valuesIntro,
  whatWeDoIntro,
} from "@/content/about";
import { getCatalogStats } from "@/lib/catalog";
import { stagger } from "@/lib/motion";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description:
    "InflexHub designs and delivers business software from Bangladesh to international standards — honest availability, plain prices, one team end to end.",
};

export default function AboutPage() {
  const stats = getCatalogStats();

  return (
    <>
      <PageHero
        breadcrumbs={{ items: [], current: "About" }}
        eyebrow={hero.eyebrow}
        title={hero.title}
        intro={hero.intro}
      />

      <Section
        id="story"
        layout="split"
        eyebrow={story.eyebrow}
        title={story.title}
        aside={
          <div className={styles.factsCard}>
            <p className={styles.factsTitle}>{company.legalName}</p>
            <dl className={styles.factsList}>
              <div>
                <dt>Head office</dt>
                <dd>{company.location} (OV-18)</dd>
              </div>
              <div>
                <dt>Working hours</dt>
                <dd>{company.officeHours}</dd>
              </div>
              <div>
                <dt>Trade licence</dt>
                <dd>{company.tradeLicence}</dd>
              </div>
            </dl>
          </div>
        }
      >
        <div className={styles.story}>
          {story.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className={styles.storyParagraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section
        id="mission"
        tone="alt"
        eyebrow={mission.eyebrow}
        title="Two sentences InflexHub works by"
      >
        <CardGrid count={2}>
          <li className={`${styles.missionCard} revealItem`} style={stagger(0)}>
            <span className={styles.missionIcon} aria-hidden="true">
              <Compass size={24} />
            </span>
            <h3 className={styles.missionTitle}>{mission.missionTitle}</h3>
            <p className={styles.missionText}>{mission.mission}</p>
          </li>
          <li className={`${styles.missionCard} revealItem`} style={stagger(1)}>
            <span className={styles.missionIcon} aria-hidden="true">
              <Eye size={24} />
            </span>
            <h3 className={styles.missionTitle}>{mission.visionTitle}</h3>
            <p className={styles.missionText}>{mission.vision}</p>
          </li>
        </CardGrid>
      </Section>

      <Section
        id="values"
        eyebrow={valuesIntro.eyebrow}
        title={valuesIntro.title}
      >
        <CardGrid count={values.length}>
          {values.map((value, index) => (
            <li key={value.title} className={`${styles.valueCard} revealItem`} style={stagger(index)}>
              <span className={styles.valueIcon} aria-hidden="true">
                <ShieldCheck size={22} />
              </span>
              <h3 className={styles.valueTitle}>{value.title}</h3>
              <p className={styles.valueText}>{value.description}</p>
            </li>
          ))}
        </CardGrid>
      </Section>

      <Section
        id="what-we-do"
        tone="alt"
        eyebrow={whatWeDoIntro.eyebrow}
        title={whatWeDoIntro.title}
        intro={whatWeDoIntro.intro}
      >
        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt>Products</dt>
            <dd>{stats.products}</dd>
          </div>
          <div className={styles.stat}>
            <dt>Categories</dt>
            <dd>{stats.categories}</dd>
          </div>
          <div className={styles.stat}>
            <dt>Industries served</dt>
            <dd>{stats.industries}</dd>
          </div>
          <div className={styles.stat}>
            <dt>Ready to use</dt>
            <dd>{stats.available}</dd>
          </div>
          <div className={styles.stat}>
            <dt>Built on request</dt>
            <dd>{stats.custom}</dd>
          </div>
          <div className={styles.stat}>
            <dt>Coming soon</dt>
            <dd>{stats.upcoming}</dd>
          </div>
        </dl>
      </Section>

      <CtaBand
        eyebrow={ctaBand.eyebrow}
        title={ctaBand.title}
        intro={ctaBand.intro}
        cta={ctaBand.cta}
      />
    </>
  );
}
