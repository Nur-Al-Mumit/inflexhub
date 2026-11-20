# Next.js architecture

Status: Draft
PRD links: 5.2, 5.4

## Workspace

```
web/                       npm workspace root (package.json with "workspaces": ["apps/*"])
  apps/
    site/                  public site (V1)
    admin/                 staff console (V2)
```

A shared `packages/ui` is created in V2 when the admin app needs the same tokens and components. Until then they live in `apps/site/src/components/ui` and `src/styles/tokens.css`.

## Site folders

```
web/apps/site/src/
  app/                     routes (App Router), layout.tsx, sitemap.ts, robots.ts, api/inquiries/route.ts
  components/
    ui/                    Button, Badge, Field, Select, Textarea, Checkbox, Alert, Accordion, ...
    layout/                Header, MegaMenu, MobileNav, Footer
    brand/                 Logo, ArrowMark
    sections/              Hero, CtaBand, ProcessSteps, FaqSection, ...
    products/              ProductCard, ProductFilters, AvailabilityBadge, ProductIcon
    forms/                 InquiryForm parts, DemoForm, QuoteForm, CustomForm, ContactForm, InterestForm, ThankYou
  content/                 company.ts, home.ts, products/*.ts, industries.ts, faqs.ts, form-options.ts
  lib/                     catalog.ts (reads catalog/products.json), filters.ts, inquiry.ts (payload + validation), source.ts, seo.ts
  styles/                  tokens.css, globals.css
tests/                     node --test suites for lib/
```

## Rules

1. Server Components by default; client components only for header scroll/menu, filters, forms, interest dialog.
2. The catalog is read only through `src/lib/catalog.ts` (V2 swaps it to the API).
3. Product and industry pages are statically generated with `generateStaticParams`. With Cache Components, `dynamicParams` is not available and `notFound()` inside a streamed page cannot change a status already sent, so `src/proxy.ts` rejects unknown slugs before rendering (real 404 on the first request); pages still call `notFound()` as a second guard.
4. Forms post to `/api/inquiries`; the route handler forwards to `process.env.API_BASE_URL` with `X-Site-Key` from `process.env.SITE_API_KEY` (server-only env).
5. Client validation mirrors the API rules in `src/lib/inquiry.ts`; the API remains the authority.
6. Images: SVG components, no raster hero images. `next/font` for Plus Jakarta Sans.
7. Production build uses `output: "standalone"` for the Docker image.
8. Next.js 16 changed APIs (for example async `params`): read `node_modules/next/dist/docs/` before writing route code.
9. Every page sets a canonical URL through `metadata.alternates.canonical` (base `NEXT_PUBLIC_SITE_URL`).
10. Security headers and a nonce-based Content-Security-Policy are set in `proxy.ts` (Next.js 16 name for middleware) and `next.config.ts` ([security](../05-quality/security.md)).
11. The route handler forwards the W3C `traceparent` header to the API (or starts one), so a visitor's error can be traced end to end.

## Environment

| Variable | Where | Example |
|---|---|---|
| `API_BASE_URL` | site server | `http://api:8080` |
| `SITE_API_KEY` | site server and API (`Site__ApiKey`) | random 32+ chars |
| `NEXT_PUBLIC_SITE_URL` | site | `https://inflexhub.com` |

## Commands (from `web/`)

`npm install` · `npm run dev` (site on :3000) · `npm run typecheck` · `npm test` · `npm run build`
