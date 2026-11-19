/**
 * Product detail (V1-5, PRD P-3): PageHero with availability, actions for its
 * availability (PRD §1.3, prefilled ?product=<slug>), brochure when the
 * catalog lists one (V1-23), and an "at a glance" card; then overview + key
 * features, modules, who it is for + benefits, delivery, FAQ, related products
 * and CTA — all on the shared Section wrapper (ui-guidelines Part B).
 * Statically generated per slug; unknown slugs get a 404 from src/proxy.ts.
 */

import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CheckCircle2, Layers, Sparkles } from "lucide-react";
import { BrochureButton } from "@/components/products/BrochureButton";
import { CustomSoftwareTile } from "@/components/products/CustomSoftwareTile";
import { ProductCard } from "@/components/products/ProductCard";
import { productIcon } from "@/components/products/productIcons";
import { HelpCard } from "@/components/sections/HelpCard";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { Accordion } from "@/components/ui/Accordion";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CardGrid } from "@/components/ui/CardGrid";
import { CtaBand } from "@/components/ui/CtaBand";
import { getProductContent } from "@/content/products";
import { getCatalog, type CatalogProduct } from "@/lib/catalog";
import { stagger } from "@/lib/motion";
import styles from "./page.module.css";

type Action = { readonly href: string; readonly label: string };

/** Actions follow availability (PRD §1.3, US-3); forms get the product. */
function actionsFor(product: CatalogProduct): { primary: Action; secondary: Action | null } {
  const q = `?product=${product.slug}`;
  if (product.availability === "available") {
    return {
      primary: { href: `/request-demo${q}`, label: "Request a demo" },
      secondary: { href: `/request-quote${q}`, label: "Request a quotation" },
    };
  }
  if (product.availability === "custom") {
    return {
      primary: { href: `/custom-software${q}`, label: "Request custom development" },
      secondary: { href: `/request-quote${q}`, label: "Request a quotation" },
    };
  }
  return {
    primary: { href: `/upcoming${q}`, label: "Register interest" },
    secondary: null,
  };
}

/** Module columns that always fill complete rows (ui-guidelines UI-9). */
function moduleColumns(count: number): number {
  if (count % 5 === 0) return 5;
  if (count % 3 === 0) return 3;
  if (count % 4 === 0) return 4;
  return Math.min(count, 4);
}

export function generateStaticParams() {
  return getCatalog().products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getCatalog().products.find((item) => item.slug === slug);
  return product ? { title: product.name, description: product.tagline } : {};
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { products, categories, industries } = getCatalog();
  const product = products.find((item) => item.slug === slug);
  if (!product) {
    notFound();
  }

  const content = getProductContent(product.slug);
  const category = categories.find((item) => item.slug === product.category);
  const productIndustries = industries.filter((industry) =>
    product.industries.includes(industry.slug),
  );
  const related = products
    .filter((item) => item.category === product.category && item.slug !== product.slug)
    .slice(0, 3);
  const actions = actionsFor(product);
  const Icon = productIcon(product.slug);
  const names = productIndustries.map((industry) => industry.name);
  const industryNames =
    names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : (names[0] ?? "");

  const actionButtons = (onDark: boolean) => (
    <>
      <ButtonLink href={actions.primary.href} size="lg" arrow>
        {actions.primary.label}
      </ButtonLink>
      {actions.secondary ? (
        <ButtonLink
          href={actions.secondary.href}
          size="lg"
          variant={onDark ? "onDarkOutline" : "outline"}
        >
          {actions.secondary.label}
        </ButtonLink>
      ) : null}
    </>
  );

  return (
    <>
      <PageHero
        breadcrumbs={{
          items: [{ href: "/products", label: "Products" }],
          current: product.name,
        }}
        meta={
          <>
            <span className={styles.categoryPill}>{category?.name ?? product.category}</span>
            <AvailabilityBadge availability={product.availability} />
          </>
        }
        title={product.name}
        intro={product.tagline}
        actions={
          <>
            {actionButtons(true)}
            {product.brochure ? (
              <BrochureButton
                product={{
                  slug: product.slug,
                  name: product.name,
                  availability: product.availability,
                  brochure: product.brochure,
                }}
                brochure={product.brochure}
              />
            ) : null}
          </>
        }
        aside={
          <div className={styles.glance}>
            <div className={styles.glanceHead}>
              <span className={styles.glanceIcon} aria-hidden="true">
                <Icon size={24} />
              </span>
              <p className={styles.glanceTitle}>At a glance</p>
            </div>
            <dl className={styles.glanceList}>
              <div>
                <dt>Category</dt>
                <dd>{category?.name ?? product.category}</dd>
              </div>
              <div>
                <dt>Availability</dt>
                <dd>
                  <AvailabilityBadge availability={product.availability} />
                </dd>
              </div>
              <div>
                <dt>Built for</dt>
                <dd>{productIndustries.map((industry) => industry.name).join(", ")}</dd>
              </div>
              <div>
                <dt>Modules</dt>
                <dd>{content.modules.length}</dd>
              </div>
            </dl>
          </div>
        }
      />

      <Section
        id="overview"
        layout="split"
        eyebrow="Overview"
        title={`What ${product.name} does`}
        intro={content.overview.join(" ")}
      >
        <div className={styles.featureCard}>
          <p className={styles.featureCardTitle}>Key features</p>
          <ul className={styles.featureList}>
            {content.keyFeatures.map((feature, index) => (
              <li key={feature} className="revealItem" style={stagger(index)}>
                <CheckCircle2 aria-hidden="true" size={20} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section
        id="modules"
        tone="alt"
        eyebrow="Modules"
        title={`How ${product.name} is organised`}
        intro="Each module covers one part of the work, and they share the same data."
      >
        <ol
          className={styles.moduleGrid}
          style={{ "--cols": moduleColumns(content.modules.length) } as CSSProperties}
        >
          {content.modules.map((module_, index) => (
            <li key={module_} className={`${styles.module} revealItem`} style={stagger(index)}>
              <span className={styles.moduleHead}>
                <span className={styles.moduleIcon} aria-hidden="true">
                  <Layers size={18} />
                </span>
                <span className={styles.moduleNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </span>
              <span className={styles.moduleName}>{module_}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="fit"
        eyebrow="Who it is for"
        title="What your organisation gains"
        intro={`${product.name} serves ${industryNames}.`}
      >
        <div className={styles.fit}>
          <ul className={styles.industryLinks} aria-label="Industries">
            {productIndustries.map((industry) => (
              <li key={industry.slug}>
                <Link href={`/industries/${industry.slug}`} className={styles.industryLink}>
                  {industry.name}
                  <ArrowUpRight aria-hidden="true" size={16} />
                </Link>
              </li>
            ))}
          </ul>
          <CardGrid count={content.benefits.length}>
            {content.benefits.map((benefit, index) => (
              <li key={benefit} className={`${styles.benefit} revealItem`} style={stagger(index)}>
                <span className={styles.benefitIcon} aria-hidden="true">
                  <Sparkles size={20} />
                </span>
                <p className={styles.benefitText}>{benefit}</p>
              </li>
            ))}
          </CardGrid>
        </div>
      </Section>

      <Section
        id="delivery"
        tone="dark"
        eyebrow="Delivery"
        title="How working with InflexHub looks"
        intro={content.howItWorks}
      >
        <div className={styles.deliveryActions}>{actionButtons(true)}</div>
      </Section>

      <Section
        id="faq"
        tone="alt"
        layout="split"
        eyebrow="Questions"
        title={`${product.name} FAQ`}
        aside={
          <HelpCard
            title="Another question?"
            text={`Ask about ${product.name} and a person from InflexHub replies.`}
            action={{ href: "/contact", label: "Contact InflexHub" }}
          />
        }
      >
        <Accordion items={content.faq} />
      </Section>

      {related.length > 0 ? (
        <Section
          id="related"
          eyebrow="Related"
          title={`More in ${category?.name ?? "this category"}`}
          action={{ href: `/products?category=${product.category}`, label: "All in this category" }}
        >
          <CardGrid count={related.length + 1}>
            {related.map((item, index) => (
              <li key={item.slug} className="revealItem" style={stagger(index)}>
                <ProductCard
                  slug={item.slug}
                  name={item.name}
                  tagline={item.tagline}
                  availability={item.availability}
                />
              </li>
            ))}
            <li className="revealItem" style={stagger(related.length)}>
              <CustomSoftwareTile />
            </li>
          </CardGrid>
        </Section>
      ) : null}

      <CtaBand
        eyebrow="Next step"
        title={actions.primary.label}
        intro={`See how ${product.name} fits your organisation — the next step takes a minute.`}
        cta={actions.primary}
      />
    </>
  );
}
