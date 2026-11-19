/**
 * Privacy policy (V1-11, PRD P-11). Generic draft pending legal review
 * (OV-7); retention is the OV-14 proposal; the applicable Bangladesh law is
 * OV-19. Content in src/content/legal.ts.
 */

import type { Metadata } from "next";
import { LegalBody } from "@/components/sections/LegalBody";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { privacy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What InflexHub collects through this website, why, for how long, and the rights you have over your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        breadcrumbs={{ items: [], current: "Privacy policy" }}
        eyebrow={privacy.eyebrow}
        title={privacy.title}
        intro={privacy.intro}
      />
      <Section id="policy" title="The policy in full">
        <LegalBody document={privacy} />
      </Section>
    </>
  );
}
