/**
 * SEO tests (V1-12, US-11): the JSON-LD builders, absolute URLs, the sitemap
 * (every static page + every product + every industry, /dev/ui excluded),
 * and robots.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  organizationJsonLd,
  softwareApplicationJsonLd,
} from "../src/lib/seo.ts";
import { getCatalog } from "../src/lib/catalog.ts";
import sitemap from "../src/app/sitemap.ts";
import robots from "../src/app/robots.ts";

const catalog = getCatalog();

test("absoluteUrl_joins_paths_onto_the_site_url", () => {
  const url = new URL(absoluteUrl("/products/pos"));
  assert.equal(url.pathname, "/products/pos");
  assert.equal(url.search, "", "no query parameters leak into canonical/sitemap URLs");
});

test("organizationJsonLd_has_schemaorg_shape_and_company_data", () => {
  const jsonLd = organizationJsonLd();
  assert.equal(jsonLd["@type"], "Organization");
  assert.equal(jsonLd.url, absoluteUrl("/"));
  assert.equal(jsonLd.legalName, "InflexHub Ltd.");
  assert.equal(jsonLd.address.addressCountry, "BD");
});

test("softwareApplicationJsonLd_names_the_product_and_its_url", () => {
  const pos = catalog.products.find((product) => product.slug === "pos")!;
  const jsonLd = softwareApplicationJsonLd(pos);
  assert.equal(jsonLd["@type"], "SoftwareApplication");
  assert.equal(jsonLd.name, "InflexHub POS");
  assert.equal(jsonLd.url, absoluteUrl("/products/pos"));
  assert.equal(jsonLd.applicationCategory, "BusinessApplication");
});

test("faqJsonLd_maps_every_visible_question", () => {
  const items = [
    { summary: "What does it cost?", content: "It depends." },
    { summary: "How long?", content: "Weeks to months." },
  ];
  const jsonLd = faqJsonLd(items);
  assert.equal(jsonLd["@type"], "FAQPage");
  assert.equal(jsonLd.mainEntity.length, 2);
  assert.equal(jsonLd.mainEntity[0].name, "What does it cost?");
  assert.equal(jsonLd.mainEntity[1].acceptedAnswer.text, "Weeks to months.");
});

test("breadcrumbJsonLd_positions_start_at_one_with_absolute_items", () => {
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "InflexHub POS", path: "/products/pos" },
  ]);
  assert.equal(jsonLd["@type"], "BreadcrumbList");
  assert.deepEqual(
    jsonLd.itemListElement.map((entry) => entry.position),
    [1, 2, 3],
  );
  assert.equal(jsonLd.itemListElement[2].item, absoluteUrl("/products/pos"));
});

test("sitemap_lists_static_pages_products_and_industries", () => {
  const entries = sitemap();
  const urls = entries.map((entry) => new URL(entry.url).pathname);

  // Every static public page
  for (const path of [
    "/",
    "/products",
    "/industries",
    "/custom-software",
    "/request-demo",
    "/request-quote",
    "/upcoming",
    "/partners",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ]) {
    assert.ok(urls.includes(path), `${path} missing from sitemap`);
  }
  // Every product and industry
  for (const product of catalog.products) {
    assert.ok(urls.includes(`/products/${product.slug}`), `${product.slug} missing`);
  }
  for (const industry of catalog.industries) {
    assert.ok(urls.includes(`/industries/${industry.slug}`), `${industry.slug} missing`);
  }
  // The development gallery is never listed
  assert.ok(!urls.some((path) => path.startsWith("/dev")));
});

test("sitemap_urls_are_absolute_and_unique", () => {
  const entries = sitemap();
  const absolute = entries.every((entry) => new URL(entry.url).origin === new URL(absoluteUrl("/")).origin);
  assert.ok(absolute);
  assert.equal(new Set(entries.map((entry) => entry.url)).size, entries.length);
});

test("robots_allows_crawling_but_blocks_api_and_dev", () => {
  const rules = robots();
  const ruleList = Array.isArray(rules.rules) ? rules.rules : [rules.rules];
  const all = ruleList.find((rule) => rule.userAgent === "*");
  assert.ok(all);
  assert.deepEqual(all!.disallow, ["/api/", "/dev/"]);
  assert.equal(all!.allow, "/");
  assert.equal(rules.sitemap, absoluteUrl("/sitemap.xml"));
});
