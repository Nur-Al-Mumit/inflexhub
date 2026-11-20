/**
 * Industries list (V1-6, PRD P-4): every catalog industry with its factual
 * product count, linking to its detail page. Reuses the home page's
 * IndustryGrid so both look identical (ui-guidelines Part B).
 */

import type { Metadata } from "next";
import { IndustryGrid } from "@/components/sections/IndustryGrid";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { CtaBand } from "@/components/ui/CtaBand";
import { getIndustrySummaries } from "@/lib/catalog";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/industries" },
  title: "Industries",
  description:
    "Industries InflexHub builds for — retail, manufacturing, education, healthcare, and more — with the products that serve each.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        breadcrumbs={{ items: [], current: "Industries" }}
        eyebrow="Industries"
        title="Built for the way your industry works"
        intro="Each InflexHub product targets the industries it serves. Pick yours and see the systems that fit — availability stated up front."
      />
      <section className={styles.list} aria-label="All industries">
        <Container>
          <IndustryGrid industries={getIndustrySummaries()} />
        </Container>
      </section>
      <CtaBand
        eyebrow="Not listed?"
        title="InflexHub builds for other industries too"
        intro="Describe how your organisation works and get a proposal for software built around it."
        cta={{ href: "/custom-software", label: "Describe your project" }}
      />
    </>
  );
}
