# Delivery tracker

Status: Living document. Update it in the same commit as the change.
Purpose: What is done and what is not, per version.

| Status | Meaning |
|---|---|
| `todo` | Not started |
| `doing` | In progress |
| `review` | Waiting for owner review |
| `done` | Committed; listed tests exist and pass |
| `blocked` | Waiting on an owner decision ([owner-validation](owner-validation.md)) |

## Summary

| Version | Rows | Done | State |
|---|---|---|---|
| Docs | 1 | 0 | review |
| M0 | 8 | 8 | done (2026-11-17; docker compose verified) |
| V1 | 34 | 2 | in progress (V1-1, V1-2 done) |
| V1.1 | 9 | 0 | blocked (keys, domain, SMTP) |
| V2 | — | — | planned |

## Docs

| ID | Item | Status | Notes |
|---|---|---|---|
| D-1 | Docs set v1.0 (PRD, scopes, stories, architecture, API, schema, design system) | review | 2026-11-17 |

## M0 — Foundation

| ID | Item | Status | Tests |
|---|---|---|---|
| M0-1 | Solution, projects, references, `Directory.Build.props`, `Directory.Packages.props` | done | — |
| M0-2 | Mediator + validation pipeline, ProblemDetails + error slugs, Serilog | done | `ValidationCommandBehaviorTests` (4), `ValidationQueryBehaviorTests` (2) |
| M0-3 | `AppDbContext`, snake_case, first migration | done | — |
| M0-4 | Health endpoints | done | — |
| M0-5 | `catalog/products.json` | done | — |
| M0-6 | `web/` workspace + Next.js 16 site, tokens, fonts, layout shell; `web/apps/site/AGENTS.md` with frontend rules | done | `tokens.test.ts` (2) |
| M0-7 | Docker compose, Dockerfiles, `.env.example` | done | — |
| M0-8 | CI workflow | done | — |

M0 notes (2026-11-17): M0-2 uses Cortex.Mediator open pipeline behaviors with our own FluentValidation `ValidationCommandBehavior`/`ValidationQueryBehavior` (the package has no built-in validation behavior); ProblemDetails handler maps `validation-failed` (400) and `internal-error` (500); domain slugs arrive with V1. M0-3 migration is an intentionally empty baseline (`InitialCreate`) proving the Npgsql + snake_case + bundle toolchain; the `Inquiries` migration is V1-18; SQL script at `docs/03-database/sql/0001_initial_create.sql`; `dotnet-ef` 10.0.15 pinned as a local tool. M0-6 site on Next 16.4.6 / React 19.3.0; header/footer are the structural shell (mega menu, drawer, products-by-category footer column are V1-2); contact/legal details are OV-3/OV-18 placeholders in `src/content/company.ts`; 360 px + 1280 px + tab-order check done. M0-7 base images pinned (`sdk:10.0.404`, `aspnet:10.0.4`, `postgres:18.7`, `node:26.13.1-alpine3.24`); `docker compose up --build` verified 2026-11-17 (db healthy → migrate exit 0, `InitialCreate` applied → api → site on :3000, `/health/live` and `/health/ready` both 200). Fixes found during bring-up: the pgdata volume mounts at `/var/lib/postgresql` (postgres 18 rejects the legacy `/data` mount); the migrator stage restores `dotnet-ef` from the local tool manifest and gets `ConnectionStrings__Default` as env (the bundle re-hosts the app); `AddInflexHubInfrastructure` tolerates a missing connection string at registration so EF tooling and the bundle can build the host (an unconfigured API fails `/health/ready` instead of not starting). M0-8 runs backend (restore/build `-warnaserror`/test) and frontend (npm ci/typecheck/test/build) on .NET 10 + Node 26.

M0 review fixes (2026-11-17, same branch): logo wordmark is "Infle" (navy) + a drawn letter x on the text baseline — navy stroke TL→BR, orange stroke BL→TR rising into an amber arrowhead (em-sized, `role="img"` accessible name "InflexHub"); site Dockerfile mirrors the repo layout at `/repo` (web/, catalog/) with `outputFileTracingRoot`/`turbopack.root` anchored at the repo root, so `../../../catalog/products.json` resolves identically locally and in the image and the standalone output is `web/apps/site/server.js`; `lucide-react` lives only in `apps/site` (workspace root has no dependencies); bare 404s from unmatched routes return ProblemDetails slug `not-found`, and all ProblemDetails + logs share the traceId from `Activity.Current?.Id ?? HttpContext.TraceIdentifier`.

## V1 — Launch

| ID | Item | Story | Status | Tests |
|---|---|---|---|---|
| V1-1 | UI components (§7 design system) | — | done | @ui + `catalog.test.ts` (4), `aria.test.ts` (4) |
| V1-2 | Header with mega menu, mobile drawer, footer | US-1 | done | @ui |
| V1-3 | Home page | US-1 | todo | @ui |
| V1-4 | Products list + filters | US-2 | todo | `filters.test.ts` |
| V1-5 | Product detail + content for 15 products | US-3 | todo | `catalog.test.ts` |
| V1-6 | Industries list + detail | US-4 | todo | @ui |
| V1-7 | Custom software page + form | US-7 | todo | `inquiry.test.ts` |
| V1-8 | Request demo page + form | US-5 | todo | `inquiry.test.ts` |
| V1-9 | Request quote page + form | US-6 | todo | `inquiry.test.ts` |
| V1-10 | Upcoming page + interest form | US-9 | todo | `inquiry.test.ts` |
| V1-11 | About, contact, privacy, terms, 404 | US-8, US-10 | todo | @ui |
| V1-12 | SEO: metadata, sitemap, robots, JSON-LD | US-11 | todo | build |
| V1-13 | Site route handler `/api/inquiries` + source tracking | US-12 | todo | — |
| V1-14 | Domain: `Inquiry`, `InquiryProduct`, enums, `InquiryReference` | US-5–9 | todo | `InquiryReferenceTests` |
| V1-15 | `SubmitInquiryCommand` + validator | US-5–9, US-12 | todo | `SubmitInquiryValidatorTests` |
| V1-16 | `SubmitInquiryHandler` (BR-1, 2, 3, 5, 7, 9) | US-5–9, US-12 | todo | `SubmitInquiryHandlerTests` |
| V1-17 | `JsonCatalog` + `GET /catalog/products` | — | todo | `GetProductsHandlerTests` |
| V1-18 | Repository, migration `Inquiries`, demand views | US-12 | todo | review |
| V1-19 | Site key check, rate limiter (BR-4), body size limit | US-12 | todo | — |
| V1-20 | Inquiries controller | US-5–9 | todo | — |
| V1-21 | Security headers on the site | — | todo | — |
| V1-22 | Owner content review (OV-1, OV-2, OV-3) | — | blocked | — |
| V1-23 | Brochure download: catalog field, button, form, link (site) | US-13 | todo | `catalog.test.ts` (brochure files exist) |
| V1-24 | Partners page + application form | US-14 | todo | `inquiry.test.ts` |
| V1-25 | API: `brochure_download` and `partner` types (validator, eligibility, BR-3 for brochures) | US-13, US-14 | todo | `SubmitInquiryValidatorTests`, `SubmitInquiryHandlerTests` |
| V1-26 | Sales notification: queue, MailKit sender, retries, `sales_notified_at` | US-15 | todo | `SubmitInquiryHandlerTests`, `SalesNotificationTests` |
| V1-27 | CSV export endpoint with admin key and CSV-injection protection | US-16 | todo | `ExportInquiriesHandlerTests`, `CsvWriterTests` |
| V1-28 | Brochure PDFs from the owner | US-13 | blocked | OV-16 |
| V1-29 | Enable sales email in an environment | US-15 | blocked | OV-12 |
| V1-30 | CSP (nonce) + security headers, `security.txt`, canonical URLs, favicon set + manifest | US-17 | todo | @ui (securityheaders.com) |
| V1-31 | Accessibility statement page; company legal details in footer | US-17 | todo | @ui |
| V1-32 | axe-core accessibility tests | US-17 | todo | `a11y.test.ts` |
| V1-33 | `traceparent` propagation site → API | US-17 | todo | — |
| V1-34 | CI: dependency audit, Dependabot, secret scanning | US-17 | todo | CI |

V1-1/V1-2 notes (2026-11-17, branch `feature/V1-1-2-ui-layout`): 18 components in `src/components/ui/` (Button, ButtonLink, Badge, AvailabilityBadge, Card, Container, SectionHeader, Field, TextInput, Select, Textarea with counter, Checkbox, RadioCards, ChipGroup, Alert, Accordion, Breadcrumbs, CtaBand), each with its own CSS Module, tokens only. `src/lib/catalog.ts` is the only catalog reader (path resolution works in dev, `node --test`, and the standalone image); `catalog.test.ts` covers category grouping, slug uniqueness, reference validity, availability values. Review aid `/dev/ui` (route added to pages-and-flows.md) shows every component in every state and 404s in production (verified with `next start`); sitemap exclusion applies when V1-12 builds it. Header: sticky, solid on scroll; mega menu grouped by the 5 catalog categories + "All products" + "Coming soon" (catalog data passed from the server layout to the client Header as plain data); opens on click, Escape closes wherever focus is inside the products wrapper (including the trigger), focus returns to the trigger, outside click closes. Mobile drawer <900 px: `role="dialog"` + `aria-modal`, focus trapped (Tab cycles), Escape and close button, body scroll lock, focus returns to the menu button; order: Request a demo → Products (native details/summary: All products, category groups, Coming soon) → Industries → Custom Software → About → Contact; nav labelled "Mobile navigation". Footer gained the Products-by-category column (`/products?category=<slug>`). Logo: x stroke equals the letter stems (2.99 px vs 3.00 px at 22 px), zero gap before "Hub" (viewBox hugs the arrow), larger arrowhead with the tip 0.85 px above the cap height. Checked at 360/768/1280 px (no horizontal scroll) and keyboard-only (mega menu, drawer, skip link).

V1-1/V1-2 review fixes (2026-11-17, same branch): Field now provides `FieldContext` (id, describedBy, invalid); TextInput, Select, Textarea, Checkbox and RadioCards are client components that consume it, so id/`aria-describedby`/`aria-invalid` land on the native control (never a wrapper); Textarea merges the Field ids with its counter id through `mergeDescribedBy` (`src/lib/aria.ts`, covered by `aria.test.ts`). Result verified on `/dev/ui` in dev: the Next.js hydration error overlay/badge is gone, all 11 label `for` attributes resolve to native controls, and the Textarea `aria-describedby` carries field-error/help **and** counter ids. Mega-menu Escape works from the trigger and from inside the panel (both return focus to the trigger). Drawer reordered with the Products details group; "Menu" button label vertically centred.

## V1.1 — Launch hardening

| ID | Item | Status | Blocked on |
|---|---|---|---|
| V11-1 | Turnstile | blocked | keys |
| V11-2 | Resend job for failed sales emails | todo | — |
| V11-3 | Visitor auto-reply | blocked | OV-12 |
| V11-4 | Cloudflare Web Analytics | blocked | OV-11 |
| V11-5 | Production deploy + TLS | blocked | OV-11 |
| V11-6 | Backups + restore test | todo | — |
| V11-7 | Legal review | blocked | OV-7, OV-19 |
| V11-8 | SPF, DKIM, DMARC | blocked | OV-11, OV-12 |
| V11-9 | HSTS preload, TLS 1.2+ | blocked | OV-11 |
