/**
 * Catalog module tests (V1-1/V1-2): the mega menu and footer are built from
 * getCategoryGroups, so grouping and uniqueness must hold.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getCatalog,
  getCatalogStats,
  getCategoryGroups,
  getIndustrySummaries,
  getProductsByAvailability,
} from "../src/lib/catalog.ts";
import { productContent } from "../src/content/products/index.ts";
import { industryContent } from "../src/content/industries.ts";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

test("getCategoryGroups_groups_every_product_under_its_category", () => {
  const groups = getCategoryGroups();
  const catalog = getCatalog();

  assert.equal(groups.length, catalog.categories.length);
  const grouped = groups.flatMap((group) => group.products.map((p) => p.slug));
  // Every product appears in exactly one group, and no product is lost.
  assert.deepEqual(
    [...grouped].sort(),
    [...catalog.products.map((p) => p.slug)].sort(),
  );
  for (const group of groups) {
    assert.ok(group.products.length > 0, `category ${group.slug} is empty`);
    for (const product of group.products) {
      assert.equal(product.category, group.slug);
    }
  }
});

test("catalog_slugs_are_unique_within_products_categories_and_industries", () => {
  const { products, categories, industries } = getCatalog();

  const productSlugs = products.map((p) => p.slug);
  assert.equal(new Set(productSlugs).size, productSlugs.length);

  const categorySlugs = categories.map((c) => c.slug);
  assert.equal(new Set(categorySlugs).size, categorySlugs.length);

  const industrySlugs = industries.map((i) => i.slug);
  assert.equal(new Set(industrySlugs).size, industrySlugs.length);
});

test("catalog_references_are_valid", () => {
  const { products, categories, industries } = getCatalog();
  const categorySlugs = new Set(categories.map((c) => c.slug));
  const industrySlugs = new Set(industries.map((i) => i.slug));

  for (const product of products) {
    assert.ok(
      categorySlugs.has(product.category),
      `product ${product.slug} has unknown category ${product.category}`,
    );
    for (const industry of product.industries) {
      assert.ok(
        industrySlugs.has(industry),
        `product ${product.slug} has unknown industry ${industry}`,
      );
    }
    assert.ok(
      ["available", "custom", "upcoming"].includes(product.availability),
      `product ${product.slug} has invalid availability ${product.availability}`,
    );
  }
});

test("getProductsByAvailability_filters_and_getCatalog_is_cached", () => {
  const upcoming = getProductsByAvailability("upcoming");
  assert.ok(upcoming.length > 0);
  assert.ok(upcoming.every((p) => p.availability === "upcoming"));

  // Same object identity: the file is read once.
  assert.equal(getCatalog(), getCatalog());
});

test("getCatalogStats_counts_match_the_catalog", () => {
  const catalog = getCatalog();
  const stats = getCatalogStats();

  assert.equal(stats.products, catalog.products.length);
  assert.equal(stats.categories, catalog.categories.length);
  assert.equal(stats.industries, catalog.industries.length);
  assert.equal(
    stats.available + stats.custom + stats.upcoming,
    catalog.products.length,
    "availability counts must add up to every product",
  );
  for (const availability of ["available", "custom", "upcoming"] as const) {
    const expected = catalog.products.filter(
      (p) => p.availability === availability,
    ).length;
    assert.equal(stats[availability], expected, availability);
  }
});

test("getIndustrySummaries_counts_products_per_industry", () => {
  const catalog = getCatalog();
  const summaries = getIndustrySummaries();

  assert.equal(summaries.length, catalog.industries.length);
  for (const summary of summaries) {
    const expected = catalog.products.filter((p) =>
      p.industries.includes(summary.slug),
    ).length;
    assert.equal(summary.productCount, expected, summary.slug);
    assert.ok(
      summary.productCount > 0,
      `industry ${summary.slug} has no products in the catalog`,
    );
  }
});

// --- V1-5: catalog ↔ content consistency (ADR 0002) ---

test("every_catalog_slug_has_content_and_vice_versa", () => {
  const catalogSlugs = getCatalog().products.map((p) => p.slug).sort();
  const contentSlugs = Object.keys(productContent).sort();
  assert.deepEqual(contentSlugs, catalogSlugs);
});

test("every_product_content_is_complete", () => {
  for (const [slug, content] of Object.entries(productContent)) {
    assert.ok(
      content.overview.length > 0 && content.overview[0].length > 40,
      `${slug}: overview missing or too thin`,
    );
    assert.ok(content.keyFeatures.length >= 4, `${slug}: too few key features`);
    assert.ok(content.modules.length >= 3, `${slug}: too few modules`);
    assert.ok(content.benefits.length >= 3, `${slug}: too few benefits`);
    assert.ok(
      content.howItWorks.length > 40,
      `${slug}: howItWorks missing or too thin`,
    );
    assert.ok(content.faq.length >= 2, `${slug}: too few FAQ items`);
  }
});

test("every_listed_brochure_file_exists", () => {
  const siteDir = join(
    dirname(fileURLToPath(import.meta.url)),
    "..",
  );
  const brochures = getCatalog().products.filter((p) => p.brochure);
  for (const product of brochures) {
    const path = join(siteDir, "public", "brochures", product.brochure!);
    assert.ok(
      existsSync(path) && readFileSync(path).length > 0,
      `${product.slug} lists brochure "${product.brochure}" but the file is missing`,
    );
  }
});

test("every_industry_slug_has_content_and_vice_versa", () => {
  const catalogSlugs = getCatalog().industries.map((i) => i.slug).sort();
  const contentSlugs = Object.keys(industryContent).sort();
  assert.deepEqual(contentSlugs, catalogSlugs);
  for (const [slug, content] of Object.entries(industryContent)) {
    assert.ok(content.intro.length > 40, `${slug}: intro missing or too thin`);
    assert.ok(content.challenges.length >= 3, `${slug}: too few challenges`);
    assert.ok(content.why.length >= 2, `${slug}: too few why items`);
  }
});
