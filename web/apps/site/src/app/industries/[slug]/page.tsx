/**
 * Industry detail (V1-6, PRD P-4, US-4): the industry's challenges, every
 * matching catalog product, why InflexHub fits, and a CTA — PageHero + the
 * shared Section wrapper (ui-guidelines Part B). Statically generated per
 * industry; unknown slugs get a 404 from src/proxy.ts.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { CustomSoftwareTile } from "@/components/products/CustomSoftwareTile";
import { ProductCard } from "@/components/products/ProductCard";
import { industryIcon } from "@/components/products/productIcons";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CardGrid } from "@/components/ui/CardGrid";
import { CtaBand } from "@/components/ui/CtaBand";
import { getIndustryContent } from "@/content/industries";
import { getCatalog } from "@/lib/catalog";
import { stagger } from "@/lib/motion";
import styles from "./page.module.css";

export function generateStaticParams() {
  return getCatalog().industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getCatalog().industries.find((item) => item.slug === slug);
  if (!industry) {
    return {};
  }
  return {
    title: `${industry.name} software`,
    description: `Business software for ${industry.name.toLowerCase()}: the InflexHub products built for this industry, with availability up front.`,
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { industries, products } = getCatalog();
  const industry = industries.find((item) => item.slug === slug);
  if (!industry) {
    notFound();
  }
  const content = getIndustryContent(industry.slug);
  const matching = products.filter((product) => product.industries.includes(industry.slug));
  const name = industry.name.toLowerCase();
  const Icon = industryIcon(industry.slug);

  return (
    <>
      <PageHero
        breadcrumbs={{
          items: [{ href: "/industries", label: "Industries" }],
          current: industry.name,
        }}
        meta={
          <span className={styles.metaPill}>
            <Icon aria-hidden="true" size={16} />
            {matching.length} {matching.length === 1 ? "product" : "products"}
          </span>
        }
        title={`Software for ${name}`}
        intro={content.intro}
        actions={
          <>
            <ButtonLink href="/request-demo" size="lg" arrow>
              Request a demo
            </ButtonLink>
            <ButtonLink href={`/products?industry=${industry.slug}`} size="lg" variant="onDarkOutline">
              See all {matching.length} products
            </ButtonLink>
          </>
        }
      />

      <Section
        id="challenges"
        eyebrow="Challenges"
        title={`What ${name} teams run into`}
      >
        <CardGrid count={content.challenges.length}>
          {content.challenges.map((challenge, index) => (
            <li key={challenge} className={`${styles.challenge} revealItem`} style={stagger(index)}>
              <span className={styles.challengeIcon} aria-hidden="true">
                <TriangleAlert size={20} />
              </span>
              <p className={styles.challengeText}>{challenge}</p>
            </li>
          ))}
        </CardGrid>
      </Section>

      <Section
        id="solutions"
        tone="alt"
        eyebrow="Solutions"
        title={`Products built for ${name}`}
        intro="Every InflexHub product that serves this industry, availability stated up front."
        action={{ href: `/products?industry=${industry.slug}`, label: "Filter in the catalog" }}
      >
        <CardGrid count={matching.length + 1}>
          {matching.map((product, index) => (
            <li key={product.slug} className="revealItem" style={stagger(index)}>
              <ProductCard
                slug={product.slug}
                name={product.name}
                tagline={product.tagline}
                availability={product.availability}
              />
            </li>
          ))}
          <li className="revealItem" style={stagger(matching.length)}>
            <CustomSoftwareTile />
          </li>
        </CardGrid>
      </Section>

      <Section
        id="why"
        layout="split"
        eyebrow="Why InflexHub"
        title={`A partner for ${name}`}
        action={{ href: "/products", label: "Browse all products" }}
      >
        <ul className={styles.whyList}>
          {content.why.map((reason, index) => (
            <li key={reason.title} className={`${styles.whyCard} revealItem`} style={stagger(index)}>
              <span className={styles.whyIcon} aria-hidden="true">
                <CheckCircle2 size={20} />
              </span>
              <div>
                <h3 className={styles.whyTitle}>{reason.title}</h3>
                <p className={styles.whyText}>{reason.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        eyebrow="Next step"
        title={`See what fits your ${name} organisation`}
        intro="Request a demo of a ready product, or describe what your process needs — either way, a person replies."
        cta={{ href: "/request-demo", label: "Request a demo" }}
      />
    </>
  );
}
