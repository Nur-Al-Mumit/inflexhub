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
