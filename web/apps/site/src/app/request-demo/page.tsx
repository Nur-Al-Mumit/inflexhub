/**
 * Request a demo (V1-8, PRD P-6, US-5): demo form with the product
 * preselected from ?product=<slug> when it is available (BR-2). Two-column
 * layout: what to expect / form (pages-and-flows "/request-demo").
 */

import { Suspense } from "react";
import type { Metadata } from "next";
import { DemoForm } from "@/components/forms/DemoForm";
import { WhatNext } from "@/components/forms/WhatNext";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { formCopy } from "@/content/forms";
import { getCatalog } from "@/lib/catalog";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Request a demo",
  description:
    "Book a walkthrough of any ready-to-use InflexHub product — pick a date and time window that suit you.",
};

export default function RequestDemoPage() {
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
        breadcrumbs={{ items: [], current: "Request a demo" }}
        eyebrow="Demo"
        title="See a product in action"
        intro="A walkthrough of the product you pick, scheduled around your time window — bring your questions, there is no obligation."
      />
      <Section
        id="demo-form"
        layout="split"
        eyebrow="Request a demo"
        title="Tell InflexHub what to show you"
        intro="Products marked “Ready to use” can be demonstrated today; the form opens with your product when you come from its page."
        aside={<WhatNext copy={formCopy.demo} />}
      >
        <Suspense fallback={<p className={styles.loading}>Loading the form…</p>}>
          <DemoForm products={formProducts} industries={industries} />
        </Suspense>
      </Section>
    </>
  );
}
