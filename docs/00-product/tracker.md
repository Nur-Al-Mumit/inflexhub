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
| M0 | 8 | 0 | todo |
| V1 | 34 | 0 | todo |
| V1.1 | 9 | 0 | blocked (keys, domain, SMTP) |
| V2 | — | — | planned |

## Docs

| ID | Item | Status | Notes |
|---|---|---|---|
| D-1 | Docs set v1.0 (PRD, scopes, stories, architecture, API, schema, design system) | review | 2026-11-17 |

## M0 — Foundation

| ID | Item | Status | Tests |
|---|---|---|---|
| M0-1 | Solution, projects, references, `Directory.Build.props`, `Directory.Packages.props` | todo | — |
| M0-2 | Mediator + validation pipeline, ProblemDetails + error slugs, Serilog | todo | — |
| M0-3 | `AppDbContext`, snake_case, first migration | todo | — |
| M0-4 | Health endpoints | todo | — |
| M0-5 | `catalog/products.json` | todo | — |
| M0-6 | `web/` workspace + Next.js 16 site, tokens, fonts, layout shell; `web/apps/site/AGENTS.md` with frontend rules | todo | — |
| M0-7 | Docker compose, Dockerfiles, `.env.example` | todo | — |
| M0-8 | CI workflow | todo | — |

## V1 — Launch

| ID | Item | Story | Status | Tests |
|---|---|---|---|---|
| V1-1 | UI components (§7 design system) | — | todo | @ui |
| V1-2 | Header with mega menu, mobile drawer, footer | US-1 | todo | @ui |
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
