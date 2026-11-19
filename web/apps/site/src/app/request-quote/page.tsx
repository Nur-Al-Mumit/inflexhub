/**
 * Request a quotation (V1-9, PRD P-7, US-6): one to ten products from the
 * ready and built-on-request catalog (BR-2), with ?product=<slug>
 * preselecting one. Two-column layout: how quotes work / form
 * (pages-and-flows "/request-quote").
 */

import { Suspense } from "react";
import type { Metadata } from "next";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { WhatNext } from "@/components/forms/WhatNext";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { formCopy } from "@/content/forms";
import { getCatalog } from "@/lib/catalog";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Request a quotation",
  description:
    "Get a transparent quotation for one or more InflexHub products — ready to use or built on request.",
};

export default function RequestQuotePage() {
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
        breadcrumbs={{ items: [], current: "Request a quotation" }}
        eyebrow="Quotation"
        title="A transparent price, item by item"
        intro="Pick the products, tell InflexHub the scale — you receive a quotation that states what is included and what costs extra."
      />
      <Section
        id="quote-form"
        layout="split"
        eyebrow="Request a quotation"
        title="What should the quotation cover?"
        intro="Products marked “Ready to use” and “Built on request” can be quoted; the form opens with your product when you come from its page."
        aside={<WhatNext copy={formCopy.quote} />}
      >
        <Suspense fallback={<p className={styles.loading}>Loading the form…</p>}>
          <QuoteForm products={formProducts} industries={industries} />
        </Suspense>
      </Section>
    </>
  );
}
