/**
 * Accessibility tests (V1-32, US-17): axe-core against the prerendered HTML
 * of the key pages — no serious or critical violations. Runs on the output
 * of `npm run build` (.next/server/app/**.html), so build before testing
 * (CI does; locally run `npm run build` once).
 *
 * colour-contrast is disabled here: jsdom has no layout engine, so computed
 * colours are unavailable — contrast is guaranteed by the checked token set
 * (tests/tokens.test.ts, design-system §3) and manual review.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import axe from "axe-core";

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const prerenderRoot = join(siteRoot, ".next", "server", "app");

/** Every public page type; product/industry samples cover the dynamic templates. */
const pages = [
  "index.html",
  "products.html",
  join("products", "pos.html"),
  join("products", "erp.html"),
  join("products", "lms.html"),
  "industries.html",
  join("industries", "healthcare.html"),
  "custom-software.html",
  "request-demo.html",
  "request-quote.html",
  "upcoming.html",
  "partners.html",
  "about.html",
  "contact.html",
  "privacy.html",
  "terms.html",
  "accessibility.html",
  "_not-found.html",
];

test("a11y_prerendered_html_exists_for_every_key_page", () => {
  const missing = pages.filter((page) => !existsSync(join(prerenderRoot, page)));
  assert.deepEqual(
    missing,
    [],
    `prerendered HTML missing — run "npm run build" first. Missing: ${missing.join(", ")}`,
  );
});

async function runAxe(page: string) {
  const html = readFileSync(join(prerenderRoot, page), "utf8");
  const dom = new JSDOM(html, { url: "https://inflexhub.test/" });
  const results = await axe.run(dom.window.document.documentElement, {
    rules: { "color-contrast": { enabled: false } },
  });
  const seriousPlus = results.violations.filter((violation) => {
    const impact = violation.impact ?? "minor";
    return impact === "serious" || impact === "critical" || impact === "moderate";
  });
  return seriousPlus.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.slice(0, 3).map((node) => node.target.join(" ")),
  }));
}

test("a11y_key_pages_have_no_serious_or_critical_violations", async () => {
  const failures: { page: string; violations: unknown[] }[] = [];
  for (const page of pages) {
    if (!existsSync(join(prerenderRoot, page))) {
      continue; // covered by the existence test above
    }
    const violations = await runAxe(page);
    if (violations.length > 0) {
      failures.push({ page, violations });
    }
  }
  assert.deepEqual(
    failures,
    [],
    `axe-core found serious/critical/moderate violations (US-17):\n${JSON.stringify(failures, null, 2)}`,
  );
});
