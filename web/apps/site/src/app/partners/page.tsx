/**
 * Partners (V1-24, PRD P-14, US-14): who can partner, the four partner
 * types, what partners get (no numbers, OV-17), how it works, the
 * application form, and FAQ (pages-and-flows "/partners"). Copy in
 * src/content/partners.ts.
 */

import type { Metadata } from "next";
import { PartnerForm } from "@/components/forms/PartnerForm";
import { WhatNext } from "@/components/forms/WhatNext";
import { HelpCard } from "@/components/sections/HelpCard";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { Accordion } from "@/components/ui/Accordion";
import { CardGrid } from "@/components/ui/CardGrid";
import { CtaBand } from "@/components/ui/CtaBand";
import {
  benefits,
  benefitsIntro,
  faqIntro,
  faqItems,
  formIntro,
  hero,
  steps,
  stepsIntro,
  whoIntro,
  whoItems,
} from "@/content/partners";
import { formCopy } from "@/content/forms";
import { getCatalog } from "@/lib/catalog";
import { stagger } from "@/lib/motion";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Resell, implement, or refer InflexHub products in your market — apply to the partner program and work with one team across the catalog.",
};

export default function PartnersPage() {
  const { products } = getCatalog();
  const formProducts = products.map((product) => ({
    slug: product.slug,
    name: product.name,
    availability: product.availability,
    brochure: product.brochure,
  }));

  return (
    <>
      <PageHero
        breadcrumbs={{ items: [], current: "Partners" }}
        eyebrow={hero.eyebrow}
        title={hero.title}
        intro={hero.intro}
      />

      <Section
        id="who"
        eyebrow={whoIntro.eyebrow}
        title={whoIntro.title}
        intro={whoIntro.intro}
      >
        <CardGrid count={whoItems.length}>
          {whoItems.map((item, index) => (
            <li key={item.title} className={`${styles.card} revealItem`} style={stagger(index)}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.description}</p>
            </li>
          ))}
        </CardGrid>
      </Section>

      <Section
        id="benefits"
        tone="alt"
        eyebrow={benefitsIntro.eyebrow}
        title={benefitsIntro.title}
        intro={benefitsIntro.intro}
      >
        <CardGrid count={benefits.length}>
          {benefits.map((benefit, index) => (
            <li key={benefit.title} className={`${styles.card} revealItem`} style={stagger(index)}>
              <h3 className={styles.cardTitle}>{benefit.title}</h3>
              <p className={styles.cardText}>{benefit.description}</p>
            </li>
          ))}
        </CardGrid>
      </Section>

      <Section
        id="how-it-works"
        eyebrow={stepsIntro.eyebrow}
        title={stepsIntro.title}
      >
        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <li key={step.title} className={`${styles.step} revealItem`} style={stagger(index)}>
              <span className={styles.marker} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="application"
        tone="alt"
        layout="split"
        eyebrow={formIntro.eyebrow}
        title={formIntro.title}
        intro={formIntro.intro}
        aside={<WhatNext copy={formCopy.partner} />}
      >
        <PartnerForm products={formProducts} />
      </Section>

      <Section
        id="faq"
        layout="split"
        eyebrow={faqIntro.eyebrow}
        title={faqIntro.title}
        aside={
          <HelpCard
            title="Question about partnering?"
            text="Send it through the contact form — write “Partner program” in the subject."
            action={{ href: "/contact", label: "Contact InflexHub" }}
          />
        }
      >
        <Accordion items={faqItems} />
      </Section>

      <CtaBand
        eyebrow="Next step"
        title="Bring InflexHub products to your market"
        intro="The application takes a few minutes and starts with a reference number — like every inquiry."
        cta={{ href: "#application", label: "Apply to partner" }}
      />
    </>
  );
}
