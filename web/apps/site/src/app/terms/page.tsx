/**
 * Terms of use (V1-11, PRD P-11). Generic draft pending legal review (OV-7).
 * Content in src/content/legal.ts.
 */

import type { Metadata } from "next";
import { LegalBody } from "@/components/sections/LegalBody";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { terms } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "The rules for using the InflexHub website. Quotations and projects are governed by their own written agreements.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={{ items: [], current: "Terms of use" }}
        eyebrow={terms.eyebrow}
        title={terms.title}
        intro={terms.intro}
      />
      <Section id="terms" title="The terms in full">
        <LegalBody document={terms} />
      </Section>
    </>
  );
}
