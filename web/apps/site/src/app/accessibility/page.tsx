/**
 * Accessibility statement (V1-31, PRD P-11, US-17): target (WCAG 2.2 AA),
 * how the site is built, known limitations, how to report a problem, and
 * the date of last review. Content in src/content/legal.ts (OV-2).
 */

import type { Metadata } from "next";
import { LegalBody } from "@/components/sections/LegalBody";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { accessibility } from "@/content/legal";

export const metadata: Metadata = {
  title: "Accessibility statement",
  description:
    "InflexHub's accessibility target (WCAG 2.2 AA), how this website is built, known limitations, and how to report a problem.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        breadcrumbs={{ items: [], current: "Accessibility" }}
        eyebrow={accessibility.eyebrow}
        title={accessibility.title}
        intro={accessibility.intro}
      />
      <Section id="statement" title="The statement in full">
        <LegalBody document={accessibility} />
      </Section>
    </>
  );
}
