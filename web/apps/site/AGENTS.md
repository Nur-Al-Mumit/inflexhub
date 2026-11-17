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

1. Server Components by default; `"use client"` only where interaction requires it (header menu, filters, forms, interest dialog).
2. The catalog is read only through `src/lib/catalog.ts`; marketing copy lives in `src/content/` keyed by slug. Components never hard-code marketing copy.
3. Own components and CSS Modules only; tokens (`var(--…)`) only — no raw hex in modules; no UI/headless library, no Tailwind, no new npm package without owner approval (ADR 0001).
4. Product and industry pages: `generateStaticParams` + `dynamicParams = false`.
5. No secrets or API URLs in client code; `NEXT_PUBLIC_` only for the site URL. Forms post to `/api/inquiries`, which forwards to `API_BASE_URL` with `X-Site-Key` (ADR 0004).
6. Accessibility is part of done: WCAG 2.2 AA, visible focus, labels, `aria-*` only when native semantics fall short, reduced motion respected, 360 px and 1280 px checked.
7. Honest UI: availability always visible; no invented numbers, testimonials, or logos (OV-4, OV-5). Placeholders come from `src/content/` and [owner-validation](../../../docs/00-product/owner-validation.md).
8. Next.js 16 breaking changes: `params`/`searchParams` are Promises (await them); caching defaults changed. Read `node_modules/next/dist/docs/` before writing route code.
9. Tests: `node --test` in `tests/`, erasable TypeScript only, `Method_Scenario_ExpectedResult` style names.

## Commands (from `web/`)

`npm install` · `npm run dev` (site on :3000) · `npm run typecheck` · `npm test` · `npm run build`
