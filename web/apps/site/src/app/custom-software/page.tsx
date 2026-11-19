/**
 * Custom software (V1-7, PRD P-5, US-7): what InflexHub builds, the process,
 * the stack approach, engagement models, the requirements form, and FAQ
 * (pages-and-flows "/custom-software"). ?product=<slug> context is optional
 * in the form's product chips; copy in src/content/custom-software.ts (OV-2).
 */

import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { CustomSoftwareForm } from "@/components/forms/CustomSoftwareForm";
import { WhatNext } from "@/components/forms/WhatNext";
import { EngagementModels } from "@/components/sections/EngagementModels";
import { HelpCard } from "@/components/sections/HelpCard";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Section } from "@/components/sections/Section";
import { Accordion } from "@/components/ui/Accordion";
import { CardGrid } from "@/components/ui/CardGrid";
import { CtaBand } from "@/components/ui/CtaBand";
import {
  buildIntro,
  buildItems,
  faqIntro,
  faqItems,
  hero,
  techIntro,
  techItems,
} from "@/content/custom-software";
import { engagementIntro, processIntro } from "@/content/home";
import { formCopy } from "@/content/forms";
import { getCatalog } from "@/lib/catalog";
import { stagger } from "@/lib/motion";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Custom software",
  description:
    "When no catalog product fits: InflexHub designs, builds, and supports software around how your organisation works — from requirements to go-live.",
};

export default function CustomSoftwarePage() {
  const { products, industries } = getCatalog();
  const formProducts = products.map((product) => ({
    slug: product.slug,
    name: product.name,
    availability: product.availability,
    brochure: product.brochure,
  }));

  return (
    <>
      <PageHero
        breadcrumbs={{ items: [], current: "Custom software" }}
        eyebrow={hero.eyebrow}
        title={hero.title}
        intro={hero.intro}
      />

      <Section
        id="what-we-build"
        eyebrow={buildIntro.eyebrow}
        title={buildIntro.title}
        intro={buildIntro.intro}
      >
        <CardGrid count={buildItems.length}>
          {buildItems.map((item, index) => (
            <li key={item.title} className={`${styles.buildCard} revealItem`} style={stagger(index)}>
              <h3 className={styles.buildTitle}>{item.title}</h3>
              <p className={styles.buildText}>{item.description}</p>
            </li>
          ))}
        </CardGrid>
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
        id="stack"
        tone="alt"
        layout="split"
        eyebrow={techIntro.eyebrow}
        title={techIntro.title}
        intro={techIntro.intro}
        aside={
          <div className={styles.stackAside}>
            <p className={styles.stackNote}>
              The exact stack for your project is part of the proposal — chosen
              for maintainability first.
            </p>
          </div>
        }
      >
        <ul className={styles.techList}>
          {techItems.map((item, index) => (
            <li key={item} className="revealItem" style={stagger(index)}>
              <CheckCircle2 aria-hidden="true" size={20} />
              {item}
            </li>
          ))}
        </ul>
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
        id="requirements-form"
        tone="alt"
        layout="split"
        eyebrow="Requirements"
        title="Describe your project"
        intro="The summary is what matters most: what the software should do, for whom, and the problem it solves today. Everything else helps sharpen the proposal."
        aside={<WhatNext copy={formCopy.custom_software} />}
      >
        <CustomSoftwareForm products={formProducts} industries={industries} />
      </Section>

      <Section
        id="faq"
        layout="split"
        eyebrow={faqIntro.eyebrow}
        title={faqIntro.title}
        aside={
          <HelpCard
            title="Not ready to describe a project?"
            text="Browse the catalog first — several products are built on request and may already cover most of what you need."
            action={{ href: "/products", label: "Browse products" }}
          />
        }
      >
        <Accordion items={faqItems} />
      </Section>

      <CtaBand
        eyebrow="Next step"
        title="Start with a conversation, not a contract"
        intro="Describe what your organisation needs — the first reply is a set of questions, not a bill."
        cta={{ href: "#requirements-form", label: "Describe your project" }}
      />
    </>
  );
}
