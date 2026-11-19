/**
 * Automated enforcement of docs/04-frontend/ui-guidelines.md (Part A).
 * These rules are absolute: never weaken, skip, or delete a check to make a
 * change pass. Only the owner changes a rule, in the guidelines and here in
 * the same commit.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = join(siteRoot, "src");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const allFiles = walk(srcRoot);
const cssFiles = allFiles.filter((file) => extname(file) === ".css");
const moduleCssFiles = cssFiles.filter((file) => file.endsWith(".module.css"));
const sourceFiles = allFiles.filter((file) => [".ts", ".tsx"].includes(extname(file)));

type Hit = { file: string; line: number; text: string };

function stripComments(css: string): string {
  // Keep newlines so reported line numbers stay right.
  return css.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, " "));
}

const COMMENT_LINE = /^\s*(\*|\/\/|\/\*)/;

function findHits(files: string[], pattern: RegExp, strip = true): Hit[] {
  return files.flatMap((file) => {
    const raw = readFileSync(file, "utf8");
    const text = strip && extname(file) === ".css" ? stripComments(raw) : raw;
    const isSource = extname(file) !== ".css";
    return text.split("\n").flatMap((lineText, index) =>
      pattern.test(lineText) && !(strip && isSource && COMMENT_LINE.test(lineText))
        ? [{ file: relative(siteRoot, file), line: index + 1, text: lineText.trim() }]
        : [],
    );
  });
}

function report(rule: string, hits: Hit[]): string {
  return (
    `${rule} — see docs/04-frontend/ui-guidelines.md\n` +
    hits.map((hit) => `  ${hit.file}:${hit.line}  ${hit.text}`).join("\n")
  );
}

/** Innermost CSS rule blocks: { selector, body, line }. */
function ruleBlocks(file: string): { selector: string; body: string; line: number }[] {
  const css = stripComments(readFileSync(file, "utf8"));
  const blocks: { selector: string; body: string; line: number }[] = [];
  const pattern = /([^{}]+)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(css)) !== null) {
    const rawSelector = match[1] ?? "";
    const selector = rawSelector.trim();
    const leading = rawSelector.length - rawSelector.trimStart().length;
    const line = css.slice(0, match.index + leading).split("\n").length;
    blocks.push({ selector, body: match[2] ?? "", line });
  }
  return blocks;
}

// ---------- UI-1 no one-sided accent borders ----------

const SIDES = "top|right|bottom|left|inline-start|inline-end|block-start|block-end";
const NEUTRAL_DIVIDER = /^(var\(--line\)|var\(--navy-700\)|transparent)$/;

test("ui1_one_sided_borders_are_only_neutral_1px_dividers", () => {
  const hits: Hit[] = [];
  for (const file of cssFiles) {
    const lines = stripComments(readFileSync(file, "utf8")).split("\n");
    lines.forEach((lineText, index) => {
      const match = lineText.match(
        new RegExp(`border-(?:${SIDES})(-width|-color|-style)?\\s*:\\s*([^;]+);`),
      );
      if (!match) return;
      const part = match[1] ?? "";
      const value = (match[2] ?? "").trim();
      let bad = false;
      if (part === "-width") {
        bad = !/^(0|1px)$/.test(value);
      } else if (part === "-color") {
        bad = !NEUTRAL_DIVIDER.test(value);
      } else if (part === "") {
        if (value !== "0" && value !== "none") {
          const width = value.match(/(^|\s)(\d*\.?\d+)(px|rem|em)?(\s|$)/);
          const colour = value.replace(/\b\d*\.?\d+(px|rem|em)?\b/, "").replace(/\b(solid|dashed|dotted)\b/, "").trim();
          bad = !(width && width[2] === "1" && (width[3] ?? "px") === "px") || !NEUTRAL_DIVIDER.test(colour);
        }
      }
      if (bad) hits.push({ file: relative(siteRoot, file), line: index + 1, text: lineText.trim() });
    });
  }
  assert.equal(hits.length, 0, report("UI-1: one-sided accent border", hits));
});

test("ui1_no_inset_shadow_stripes", () => {
  const hits = findHits(cssFiles, /inset\s+(-?(?:0*[1-9]\d*|\d*\.\d*[1-9]))(px|rem|em)?\s|inset\s+0(px)?\s+-?(?:0*[1-9]|\d*\.\d*[1-9])/);
  assert.equal(hits.length, 0, report("UI-1: inset shadow used as a stripe", hits));
});

test("ui1_no_squared_corners_for_a_stripe", () => {
  // A radius with a 0 corner next to non-zero corners, e.g. 0 12px 12px 0.
  const hits = findHits(cssFiles, /border-radius\s*:\s*(0\s+[^;]*var\(--radius|[^;]*var\(--radius[^;]*\s0)\s*[;)]/);
  assert.equal(hits.length, 0, report("UI-1: squared-off corners (stripe layout)", hits));
});

// ---------- UI-2 / UI-12 no invented proof, no filler copy ----------

test("ui2_ui12_no_fake_proof_or_filler_copy", () => {
  const hits = findHits(
    sourceFiles,
    /testimonial|trusted by|happy (clients|customers)|award[- ]winning|\b\d+\s*\+\s*(clients|customers|projects|companies)|★|lorem ipsum|cutting[- ]edge|world[- ]class|revolutionary|seamless synergy/i,
  );
  assert.equal(hits.length, 0, report("UI-2/UI-12: invented proof or filler copy", hits));
});

// ---------- UI-3 no raw colours ----------

test("ui3_no_raw_colours_in_component_css", () => {
  const hits = findHits(
    moduleCssFiles,
    /#[0-9a-fA-F]{3,8}\b|\b(rgba?|hsla?)\(|:\s*(white|black|red|blue|green|gray|grey|orange|navy|purple|pink|yellow)\s*;/,
  );
  assert.equal(hits.length, 0, report("UI-3: raw colour (use tokens)", hits));
});

test("ui3_no_raw_colours_in_inline_styles", () => {
  const hits = findHits(sourceFiles, /style=\{\{[^}]*(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\()/);
  assert.equal(hits.length, 0, report("UI-3: raw colour in inline style", hits));
});

// ---------- UI-4 no gradient text or neon ----------

test("ui4_no_gradient_text_or_text_shadow", () => {
  const hits = findHits(cssFiles, /background-clip\s*:\s*text|text-shadow\s*:/);
  assert.equal(hits.length, 0, report("UI-4: gradient text / text shadow", hits));
});

// ---------- UI-5 no emoji ----------

test("ui5_no_emoji_in_source", () => {
  const hits = findHits(sourceFiles, /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}\u{2B50}\u{2B55}]/u, false);
  assert.equal(hits.length, 0, report("UI-5: emoji (use lucide-react icons)", hits));
});

// ---------- UI-6 approved dependencies only ----------

test("ui6_dependencies_match_the_approved_list", () => {
  const pkg = JSON.parse(readFileSync(join(siteRoot, "package.json"), "utf8")) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const approvedDeps = new Set(["next", "react", "react-dom", "lucide-react"]);
  const approvedDev = new Set([
    "typescript",
    "@types/node",
    "@types/react",
    "@types/react-dom",
    "axe-core",
    "jsdom",
    "@types/jsdom",
  ]);
  const extraDeps = Object.keys(pkg.dependencies ?? {}).filter((name) => !approvedDeps.has(name));
  const extraDev = Object.keys(pkg.devDependencies ?? {}).filter((name) => !approvedDev.has(name));
  assert.deepEqual(
    [...extraDeps, ...extraDev],
    [],
    "UI-6: unapproved package (ADR 0001; ask the owner first) — see docs/04-frontend/ui-guidelines.md",
  );
});

// ---------- UI-7 no glassmorphism ----------

test("ui7_no_backdrop_filter", () => {
  const hits = findHits(cssFiles, /backdrop-filter\s*:/);
  assert.equal(hits.length, 0, report("UI-7: glassmorphism / backdrop blur", hits));
});

// ---------- UI-8 no flashy motion ----------

test("ui8_no_overshooting_easing_or_attention_loops", () => {
  const overshoot = findHits(cssFiles, /cubic-bezier\(\s*[\d.]+\s*,\s*(-[\d.]+|1\.\d*[1-9]|[2-9])|cubic-bezier\([^)]*,\s*(-[\d.]+|1\.\d*[1-9]|[2-9][\d.]*)\s*\)/);
  const names = findHits(cssFiles, /@keyframes\s+[\w-]*(bounce|shake|wobble|pulse|jello|tada|swing|flash)/i);
  // Allowed infinite animations: the approved hero drift (Hero.module.css)
  // and loading spinners (an animation whose keyframes name ends in -spin).
  const infinite = findHits(
    cssFiles.filter((file) => !file.endsWith("Hero.module.css")),
    /\binfinite\b/,
  ).filter((hit) => !/[\w-]+-spin\b/.test(hit.text));
  const hits = [...overshoot, ...names, ...infinite];
  assert.equal(hits.length, 0, report("UI-8: bouncy easing, attention loop, or infinite animation", hits));
});

test("ui8_no_hover_scale_up_or_rotate", () => {
  const hits: Hit[] = [];
  for (const file of cssFiles) {
    for (const block of ruleBlocks(file)) {
      if (!/:hover|:focus-visible/.test(block.selector)) continue;
      const scale = block.body.match(/scale\s*[:(]\s*(\d*\.?\d+)/);
      if ((scale && Number(scale[1]) > 1.02) || /rotate/.test(block.body)) {
        hits.push({ file: relative(siteRoot, file), line: block.line, text: block.selector });
      }
    }
  }
  assert.equal(hits.length, 0, report("UI-8: hover scale > 1.02 or rotate", hits));
});

// ---------- UI-11 no style shortcuts ----------

test("ui11_no_important_or_font_family_in_components", () => {
  const hits = findHits(moduleCssFiles, /!important|font-family\s*:(?!\s*inherit\s*;)/);
  assert.equal(hits.length, 0, report("UI-11: !important or font-family override", hits));
});
