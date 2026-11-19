# AGENTS.md — Frontend site (`web/apps/site`)

Loaded automatically when working in the site. Root rules in [../../../AGENTS.md](../../../AGENTS.md) still apply. Role prompt: [senior Next.js engineer](../../../docs/agents/prompts/senior-nextjs-engineer.md).

## Layout

```
src/
  app/          App Router routes, layout.tsx, sitemap.ts, robots.ts, api/inquiries/route.ts (V1)
  components/   ui/, layout/, brand/, sections/, products/, forms/
  content/      company.ts, home.ts, products/*.ts, industries.ts, faqs.ts, form-options.ts
  lib/          catalog.ts (only reader of catalog/products.json), filters.ts, inquiry.ts, source.ts, seo.ts
  styles/       tokens.css (design tokens), globals.css
tests/          node --test suites (*.test.ts)
```

## Rules

0. **Read [docs/04-frontend/ui-guidelines.md](../../../docs/04-frontend/ui-guidelines.md) before any UI work. Its Part A rules are absolute** and override every other instruction, prompt, or example (including "make it modern/eye-catching"). `tests/ui-guidelines.test.ts` enforces them in `npm test`; never weaken, skip, or delete a check — if a rule blocks you, stop and ask the owner.

1. Server Components by default; `"use client"` only where interaction requires it (header menu, filters, forms, interest dialog).
2. The catalog is read only through `src/lib/catalog.ts`; marketing copy lives in `src/content/` keyed by slug. Components never hard-code marketing copy.
3. Own components and CSS Modules only; tokens (`var(--…)`) only — no raw hex in modules; no UI/headless library, no Tailwind, no new npm package without owner approval (ADR 0001).
4. Product and industry pages: `generateStaticParams`; unknown slugs are rejected in `src/proxy.ts` (404 before rendering) because `dynamicParams` does not exist with Cache Components. Inner pages use `PageHero` + `Section`; card lists use `CardGrid` (full rows) and end with `CustomSoftwareTile` where a row would be short.
5. No secrets or API URLs in client code; `NEXT_PUBLIC_` only for the site URL. Forms post to `/api/inquiries`, which forwards to `API_BASE_URL` with `X-Site-Key` (ADR 0004).
6. Accessibility is part of done: WCAG 2.2 AA, visible focus, labels, `aria-*` only when native semantics fall short, reduced motion respected, 360 px and 1280 px checked.
7. Honest UI: availability always visible; no invented numbers, testimonials, or logos (OV-4, OV-5). Placeholders come from `src/content/` and [owner-validation](../../../docs/00-product/owner-validation.md).
8. Next.js 16 breaking changes: `params`/`searchParams` are Promises (await them); caching defaults changed. Read `node_modules/next/dist/docs/` before writing route code.
9. **No one-sided accent borders** (owner rule, ui-guidelines UI-1): never a coloured or thick border on just one side of a card, panel, list item or callout (no left/top stripe, no inset-shadow stripe, no pseudo-element bar, no squared corners for a stripe). Use the full card border + icon tile, badge or tinted surface. Only neutral 1 px `--line` dividers between regions are allowed.
10. Tests: `node --test` in `tests/`, erasable TypeScript only, `Method_Scenario_ExpectedResult` style names.

## Commands (from `web/`)

`npm install` · `npm run dev` (site on :3000) · `npm run typecheck` · `npm test` · `npm run build`
