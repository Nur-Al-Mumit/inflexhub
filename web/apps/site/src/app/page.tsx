/**
 * Home page (V1-3) per docs/04-frontend/pages-and-flows.md "/":
 * Hero · catalog stats · products by category (tabs) · availability explainer
 * · industries · why InflexHub · process (4 steps) · engagement models · FAQ
 * · CTA band. Every block uses the shared Section wrapper, so alignment and
 * spacing are identical. All copy in src/content/home.ts (OV-2); every number
 * is computed from the catalog (OV-4).
 */

import type { Metadata } from "next";
import { AvailabilityExplainer } from "@/components/sections/AvailabilityExplainer";
import { EngagementModels } from "@/components/sections/EngagementModels";
import { HelpCard } from "@/components/sections/HelpCard";
import { Hero } from "@/components/sections/Hero";
import { IndustryGrid } from "@/components/sections/IndustryGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ProductTabs } from "@/components/sections/ProductTabs";
import { Section } from "@/components/sections/Section";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { WhyInflexHub } from "@/components/sections/WhyInflexHub";
import { Accordion } from "@/components/ui/Accordion";
import { CtaBand } from "@/components/ui/CtaBand";
import {
  availabilityIntro,
  ctaBand,
  engagementIntro,
  faqIntro,
  faqItems,
  industriesIntro,
  processIntro,
  productsByCategory,
  productsByCategoryAction,
  whyIntro,
} from "@/content/home";
import { getCatalogStats, getCategoryGroups, getIndustrySummaries } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Business software for companies, schools, and hospitals",
  description:
    "Explore the InflexHub catalog: ERP, POS, school and hospital systems, and more — ready to use, built on request, or coming soon.",
};

export default function HomePage() {
  const stats = getCatalogStats();
  const industries = getIndustrySummaries();
  const categories = getCategoryGroups().map((group) => ({
    slug: group.slug,
    name: group.name,
    products: group.products.map((product) => ({
      slug: product.slug,
      name: product.name,
      tagline: product.tagline,
      availability: product.availability,
    })),
  }));

  return (
    <>
      <Hero />
      <StatsStrip stats={stats} />

      <Section
        id="products"
        eyebrow={productsByCategory.eyebrow}
        title={productsByCategory.title}
        intro={productsByCategory.intro}
        action={productsByCategoryAction}
      >
        <ProductTabs categories={categories} />
      </Section>

      <Section
        id="availability"
        tone="alt"
        eyebrow={availabilityIntro.eyebrow}
        title={availabilityIntro.title}
        intro={availabilityIntro.intro}
      >
        <AvailabilityExplainer
          counts={{
            available: stats.available,
            custom: stats.custom,
            upcoming: stats.upcoming,
          }}
        />
      </Section>

      <Section
        id="industries"
        eyebrow={industriesIntro.eyebrow}
        title={industriesIntro.title}
        intro={industriesIntro.intro}
        action={industriesIntro.action}
      >
        <IndustryGrid industries={industries} />
      </Section>

      <Section
        id="why"
        tone="alt"
        layout="split"
        eyebrow={whyIntro.eyebrow}
        title={whyIntro.title}
        intro={whyIntro.intro}
        action={whyIntro.action}
      >
        <WhyInflexHub />
      </Section>

      <Section
        id="process"
        tone="dark"
        eyebrow={processIntro.eyebrow}
        title={processIntro.title}
        intro={processIntro.intro}
      >
        <ProcessSteps />
      </Section>

      <Section
        id="engagement"
        eyebrow={engagementIntro.eyebrow}
        title={engagementIntro.title}
        intro={engagementIntro.intro}
      >
        <EngagementModels />
      </Section>

      <Section
        id="faq"
        tone="alt"
        layout="split"
        eyebrow={faqIntro.eyebrow}
        title={faqIntro.title}
        intro={faqIntro.intro}
        aside={<HelpCard {...faqIntro.aside} />}
      >
        <Accordion items={faqItems} />
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
