/**
 * Products page (V1-4, PRD P-2): every product as a card; filter by category,
 * industry, and availability; text search; filters kept in the URL; empty
 * state. Static shell + client filter bar (pages-and-flows "/products").
 */

import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ProductBrowser } from "@/components/products/ProductBrowser";
import { getCatalog } from "@/lib/catalog";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/products" },
  title: "Products",
  description:
    "Browse every InflexHub product — ERP, POS, school, hospital, and more — with availability up front: ready to use, built on request, or coming soon.",
};

export default function ProductsPage() {
  const { categories, industries, products } = getCatalog();
  const categoryNameBySlug = new Map(
    categories.map((category) => [category.slug, category.name]),
  );

  const browserProducts = products.map((product) => ({
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    availability: product.availability,
    industries: product.industries,
    category: product.category,
    categoryName: categoryNameBySlug.get(product.category) ?? product.category,
  }));

  return (
    <>
      <PageHero
        breadcrumbs={{ items: [], current: "Products" }}
        eyebrow="Catalog"
        title="Every product, availability up front"
        intro="Filter by category, industry, or availability — or search by name. Each card tells you what you can use today and what is on the roadmap."
      />

      <Container className={styles.browse}>
        <Suspense
          fallback={<p className={styles.loading}>Loading products…</p>}
        >
          <ProductBrowser
            products={browserProducts}
            categories={categories}
            industries={industries}
          />
        </Suspense>
      </Container>

      <CtaBand
        eyebrow="Nothing that fits?"
        title="InflexHub builds what your organisation needs"
        intro="If the catalog does not cover your process, describe your requirement and receive a proposal — no obligation."
        cta={{ href: "/custom-software", label: "Describe custom software" }}
      />
    </>
  );
}
