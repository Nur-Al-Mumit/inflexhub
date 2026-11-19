/**
 * Upcoming products (V1-10, PRD P-8, US-9): every `upcoming` product with
 * its register-interest form in an accessible dialog; ?product=<slug> opens
 * that product's dialog (the "Register interest" action on upcoming product
 * pages). Hero · explanation · cards (pages-and-flows "/upcoming").
 */

import { Suspense } from "react";
import type { Metadata } from "next";
import { UpcomingGrid } from "@/components/products/UpcomingGrid";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { explainIntro, explainSteps, hero } from "@/content/upcoming";
import { getCatalog, getCatalogStats, getProductsByAvailability } from "@/lib/catalog";
import { stagger } from "@/lib/motion";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Coming soon",
  description:
    "InflexHub products on the roadmap. Register your interest — demand decides what gets built next.",
};

export default function UpcomingPage() {
  const upcoming = getProductsByAvailability("upcoming").map((product) => ({
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    availability: product.availability,
    brochure: product.brochure,
  }));
  const { industries } = getCatalog();
  const stats = getCatalogStats();

  return (
    <>
      <PageHero
        breadcrumbs={{ items: [], current: "Coming soon" }}
        eyebrow={hero.eyebrow}
        title={hero.title}
        intro={hero.intro}
        meta={
          <p className={styles.count}>
            {stats.upcoming} {stats.upcoming === 1 ? "product" : "products"} on the roadmap
          </p>
        }
      />

      <Section
        id="how-it-works"
        eyebrow={explainIntro.eyebrow}
        title={explainIntro.title}
      >
        <ol className={styles.steps}>
          {explainSteps.map((step, index) => (
            <li key={step.title} className={`${styles.step} revealItem`} style={stagger(index)}>
              <span className={styles.marker} aria-hidden="true">
                {index + 1}
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
        id="products"
        tone="alt"
        eyebrow="The roadmap"
        title="Register interest in what you need"
        intro="Each card is one upcoming product. Registering takes name and email — nothing more."
      >
        <Suspense fallback={<p className={styles.loading}>Loading products…</p>}>
          <UpcomingGrid products={upcoming} industries={industries} />
        </Suspense>
      </Section>
    </>
  );
}
