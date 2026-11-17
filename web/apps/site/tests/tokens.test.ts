/**
 * Token consistency (M0-6): every design-system token must be defined in
 * src/styles/tokens.css. Keeps the CSS implementation and the design-system
 * tables in docs/04-frontend/design-system.md from drifting apart.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const stylesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "styles",
);
const tokensCss = readFileSync(join(stylesDir, "tokens.css"), "utf8");

const definedTokens = new Set(
  [...tokensCss.matchAll(/--([a-z0-9-]+)\s*:/gi)].map((match) =>
    match[1].toLowerCase(),
  ),
);

const requiredTokens = [
  // Brand colours (design-system §3)
  "navy-950",
  "navy-900",
  "navy-800",
  "navy-700",
  "indigo-600",
  "orange-500",
  "orange-600",
  "orange-700",
  "orange-50",
  "amber-400",
  // Text and surfaces
  "ink",
  "text",
  "muted",
  "on-dark",
  "on-dark-muted",
  "surface",
  "surface-alt",
  "surface-tint",
  "line",
  "border-input",
  // Semantic
  "success-text",
  "success-surface",
  "info-text",
  "info-surface",
  "upcoming-text",
  "upcoming-surface",
  "danger-text",
  "danger-surface",
  "warning-text",
  "warning-surface",
  // Typography roles (§4)
  "font-family",
  "font-display-size",
  "font-h1-size",
  "font-h2-size",
  "font-h3-size",
  "font-h4-size",
  "font-body-lg-size",
  "font-body-size",
  "font-small-size",
  "font-overline-size",
  // Spacing (§5)
  "space-1",
  "space-2",
  "space-3",
  "space-4",
  "space-5",
  "space-6",
  "space-7",
  "space-8",
  "space-9",
  "space-10",
  "space-11",
  "space-12",
  "space-13",
  "section-padding",
  // Radius, elevation, layout
  "radius-sm",
  "radius-md",
  "radius-lg",
  "radius-xl",
  "radius-full",
  "shadow-1",
  "shadow-2",
  "shadow-3",
  "container-max",
  "container-gutter",
  "touch-target-min",
  // Motion (§6)
  "dur-fast",
  "dur-med",
  "dur-slow",
  "ease",
  // Focus
  "focus-color",
] as const;

test("tokens_css_defines_every_design_system_token", () => {
  const missing = requiredTokens.filter((token) => !definedTokens.has(token));
  assert.deepEqual(
    missing,
    [],
    `tokens.css is missing: ${missing.join(", ")}`,
  );
});

test("tokens_css_defines_no_unexpected_duplicate_token_blocks", () => {
  // Each token name must be declared exactly once (media queries only override).
  const names = [...tokensCss.matchAll(/--([a-z0-9-]+)\s*:/gi)].map((m) =>
    m[1].toLowerCase(),
  );
  const duplicates = names.filter(
    (name, index) => names.indexOf(name) !== index,
  );
  // Overrides in media queries are allowed only for the responsive scale tokens
  // (typography roles and gutters change at the 640 px breakpoint; §4 table).
  const responsivePattern = /^(font-|container-|section-)/;
  const allowedOverrides = new Set(
    names.filter((name) => responsivePattern.test(name)),
  );
  allowedOverrides.add("section-padding");
  const unexpected = duplicates.filter((name) => !allowedOverrides.has(name));
  assert.deepEqual(
    unexpected,
    [],
    `unexpected duplicate declarations: ${unexpected.join(", ")}`,
  );
});
