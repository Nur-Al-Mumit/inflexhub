# InflexHub — Product Requirements Document

Status: Draft (v1.2, 2026-11-17: brochure downloads, partner inquiries, lead visibility in V1)
Purpose: What InflexHub's public website and inquiry platform must do, for whom, and with which stack. **This document is the source of truth.** If any other document disagrees, the PRD wins: fix the other document, or record a real decision as a new [ADR](../01-architecture/adr/).

## 1. Product summary

### 1.1 The company

InflexHub is a software solutions company. It sells and builds business software for companies, educational institutions, healthcare organisations, and other industries. Its catalog starts with about 15 products (ERP, POS, school, college and university, hospital, LMS, e-commerce, HRM and payroll, CRM, inventory, accounting, and more; full list in [product-catalog](product-catalog.md)).

### 1.2 What the website is for

| # | Goal | How we know it works |
|---|---|---|
| G1 | Present InflexHub as a premium, trustworthy software partner | Visitors reach a product page and a form; bounce rate and time on page (Cloudflare Web Analytics) |
| G2 | Let visitors explore products by category, industry, and availability | Product list and detail pages, filters, search |
| G3 | Capture every inquiry: demo, quotation, custom software, contact, interest in upcoming products, brochure download, partner application | Every valid submission stored once in the database with a reference number |
| G3a | **No lead goes unseen**: sales staff learn about every inquiry quickly, even before the admin panel exists | Sales email per inquiry (when SMTP is configured) and a protected CSV export (§3.5) |
| G4 | **Measure demand**: which products and industries get the most interest, before InflexHub invests in building them | Every inquiry is tagged with product, category, industry, and availability at the time of submission, so demand can be counted per product and per industry |
| G5 | Prepare for a full admin panel without rework | Stable product identifiers (slugs), stored inquiry data and an API that V2 extends (see [scope/v2](scope/v2.md)) |

### 1.3 Product availability (the core concept)

Every product has exactly one availability state. It decides what the product page offers.

| State | Label on the site | Meaning | Primary action | Secondary action |
|---|---|---|---|---|
| `available` | Ready to use | Built and sellable now | Request a demo | Request a quotation |
| `custom` | Built on request | InflexHub builds or tailors it per client | Request custom development | Request a quotation |
| `upcoming` | Coming soon | Shown to measure interest before building | Register interest | — |

The availability shown is recorded on each inquiry (`availability_at_submission`). Demand reports then remain correct after a product changes state.

### 1.4 Audiences

| Audience | Needs |
|---|---|
| Business owners and managers (SME to enterprise) | Find the right system fast, see features, trust the company, ask for a demo or price |
| Education decision makers (school principals, college/university administrators) | Education-specific products, modules, and proof of fit |
| Healthcare administrators (hospitals, clinics, diagnostics, pharmacies) | Healthcare products, data safety, reliability |
| Organisations with unique processes | Describe custom requirements and get a proposal |
| Partners and resellers (agencies, IT firms, consultants) | Understand the partner program and apply to sell or implement InflexHub products in their area |
| InflexHub sales team (internal, V1 reads the database; V2 admin panel) | Every lead with full context: who, what product, which industry, how urgent |
| InflexHub owner (internal) | Demand per product and industry to decide what to build next |

### 1.5 Market and standards

Owner decision 2026-11-17: **Bangladesh first, built to international standards** ([ADR 0005](../01-architecture/adr/0005-bangladesh-first-international-standards.md)).

- Defaults are Bangladeshi: BDT budget ranges, +880 phone default, country Bangladesh, Bangladesh time (Asia/Dhaka) for business hours and demos, head office in Bangladesh.
- Data and quality follow international standards: E.164 phones, ISO 3166-1 country codes, ISO 4217 currency codes, ISO 8601 / UTC times, Unicode names, WCAG 2.2 AA, OWASP Top 10 / ASVS level 1, RFC 9457 errors, schema.org SEO, GDPR-level privacy practice.
- Visitors from any country can submit every form.

### 1.6 Out of scope for the whole product (until a new PRD version)

Online payments and checkout, customer accounts or login on the public site, customer support ticket portal, licence delivery, multi-language content (owner decision 2026-11-17: **English only**; Bangla is a later idea).

## 2. Phases and versions

| Version | Name | Summary | Scope file |
|---|---|---|---|
| M0 | Foundation | Repository, solution, workspace, Docker, CI, health checks, design tokens | [m0](scope/m0.md) |
| **V1** | **Launch: partially dynamic** | Complete professional public site with a static product catalog, plus a working inquiry API and database for all seven inquiry types | [v1](scope/v1.md) |
| V1.1 | Launch hardening | Bot protection (Cloudflare Turnstile), sales email notifications, analytics, SEO polish, production deploy | [v1.1](scope/v1.1.md) |
| V2 | Fully dynamic + admin panel | Admin panel (products, categories, availability, website content, inquiries, leads, demand analytics); the site reads catalog and content from the API | [v2](scope/v2.md) |
| Later | Ideas, not committed | Blog/insights, case studies, careers, customer portal, live chat, CRM integrations | [roadmap](roadmap.md) |

"Partially dynamic" means (owner decision 2026-11-17): **page content and the product catalog are static files in V1**; **every form is dynamic** (validated, sent through the site's server to the API, stored in PostgreSQL). V2 moves catalog and content into the database behind the admin panel.

## 3. Functional requirements

### 3.1 Public pages (V1)

| ID | Page | Requirement |
|---|---|---|
| P-1 | Home | Hero with value proposition and two calls to action; product highlights by category; industries served; availability explanation; how InflexHub works (process); engagement models; FAQ; final call to action |
| P-2 | Products | Every product as a card; filter by category, industry, and availability; text search; filters kept in the URL; empty state |
| P-3 | Product detail | Overview, key features, modules, who it is for (industries), benefits, availability badge, the actions for its availability (§1.3), **brochure download** when the product has a brochure (§3.2), related products, FAQ |
| P-4 | Industries | Industry list; each industry page shows its challenges, the matching products, and a call to action |
| P-5 | Custom software | Explains custom development (process, technologies, engagement) and holds the custom requirements form |
| P-6 | Request a demo | Demo form; product pre-selected from `?product=<slug>` |
| P-7 | Request a quotation | Quotation form; one or more products pre-selected from `?product=<slug>` |
| P-8 | Upcoming products | All `upcoming` products with a one-step "register interest" form per product |
| P-9 | About | Company story, mission, values, why InflexHub |
| P-10 | Contact | Contact form, company contact details, office hours |
| P-11 | Legal | Privacy policy (with processors, legal basis, retention, rights), terms of use, accessibility statement; company legal details (registered name, trade licence, address) in the footer |
| P-12 | Errors | 404 and error pages with helpful links |
| P-13 | Thank-you state | After every form: a confirmation with the reference number and what happens next (brochure: the download starts and a link is shown) |
| P-14 | Partners | Partner program: who can partner, partner types, what InflexHub provides, how it works, partner application form |

### 3.2 Forms and inquiry types (V1)

All forms create one **inquiry**. Fields per type are defined in [api-spec](../02-backend/api-spec.md#inquiry-fields-per-type).

| Type | Form | Required (besides name and email) | Notes |
|---|---|---|---|
| `demo` | Request a demo | Product, company, phone | Preferred date and time window optional |
| `quote` | Request a quotation | At least one product, company, phone | User count, budget range, timeline optional |
| `custom_software` | Custom requirements | Project summary (min 30 chars), company, phone | Industry, features needed, budget range, timeline, reference links optional |
| `contact` | Contact | Subject, message | General questions |
| `product_interest` | Register interest | Product (must be `upcoming` or `custom`) | Only name and email required; company and industry optional |
| `brochure_download` | Download brochure | Product (must have a brochure) | Only name and email required (soft gate); the response gives the PDF link |
| `partner` | Partner application | Company, phone, partner type, country | City or region, products of interest, team size, message optional |

### 3.3 Business rules

| ID | Rule | Value |
|---|---|---|
| BR-1 | Every inquiry gets a unique, human-readable reference number | Format `IH-YYMM-XXXXX` (5 random characters from a 31-character alphabet without look-alike characters) |
| BR-2 | A product referenced by an inquiry must exist in the catalog; availability rules from §1.3 apply (for example `demo` only for `available`) | Validation error `product-not-eligible` |
| BR-3 | Registering interest or downloading a brochure twice for the same product with the same email does not count twice | Second submission returns the first inquiry's reference (and the brochure link), `200` instead of `201` |
| BR-4 | Submission rate limit per client IP | ASSUMPTION: 5 submissions per 10 minutes; configurable (`RateLimits:Inquiries`) |
| BR-5 | Bot trap: a hidden honeypot field; if filled, the API answers success but stores nothing | — |
| BR-6 | Consent: every form needs the visitor to accept the privacy policy; the time of consent is stored | — |
| BR-7 | Product name, category, and availability are copied into the inquiry at submission (snapshot), so reports stay correct after catalog changes | — |
| BR-8 | Text limits | Name 120, company 160, email 254, phone 32, subject 160, message / summary 5,000 characters |
| BR-10 | Standard formats (ADR 0005) | Phone stored as E.164 (Bangladesh local numbers like `01711000000` normalised to `+8801711000000`); country as ISO 3166-1 alpha-2, default `BD`; budget stored as a range code plus currency `BDT`; times in UTC; demo requests store the visitor's IANA time zone |
| BR-9 | Inquiry status in V1 is always `new`; status changes come with the V2 admin panel | Statuses reserved: `new`, `contacted`, `qualified`, `proposal_sent`, `won`, `lost`, `spam` |
| BR-11 | Every stored inquiry (not honeypot hits, not BR-3 duplicates) sends one sales notification email to the configured recipients, after the inquiry is saved. Sending never delays or fails the visitor's submission; failures are retried | Retries: 3 with backoff (ASSUMPTION); recipients from configuration (OV-12) |
| BR-12 | The CSV export contains every inquiry in a date range; cells starting with `= + - @` are prefixed with `'` (CSV injection) | Export protected by an admin key; reachable only from the server (§3.5) |

### 3.4 Demand measurement (V1 data, V2 screens)

Each inquiry stores: type, product slug(s), category, industry (visitor's own), availability at submission, company size, country, source page, referrer, and UTM parameters. V1 provides documented SQL views (`v_demand_by_product`, `v_demand_by_industry`, `v_demand_by_country`) for the owner. V2 shows them as dashboards.

### 3.5 Lead visibility before the admin panel (V1)

| Channel | What | Requires |
|---|---|---|
| Sales email (BR-11) | One email per new inquiry: type, reference, product(s), contact details, message, source; reply-to set to the visitor | SMTP settings and recipient list (OV-12). Code ships in V1; disabled until configured |
| CSV export (BR-12) | `GET /api/v1/admin/inquiries/export` with `X-Admin-Key`, run from the server (the API is not public) | `Admin__ExportKey` in the environment |

Both are replaced or extended by the V2 admin panel.

## 4. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-1 | Performance: Core Web Vitals "good" on mobile (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1) and Lighthouse performance ≥ 90 on home, products, product detail; static pages generated at build time |
| NFR-2 | Accessibility: WCAG 2.2 AA (contrast, keyboard, focus, labels, reduced motion) |
| NFR-3 | SEO: unique title and description per page, canonical URL, Open Graph and Twitter card tags, `sitemap.xml`, `robots.txt`, favicon set and web manifest, JSON-LD (`Organization`, `SoftwareApplication` per product, `FAQPage`, `BreadcrumbList`) |
| NFR-4 | Responsive: designed from 360 px up; no horizontal scroll |
| NFR-5 | Security: server-side validation, rate limits, honeypot, no secrets in the browser, the API not exposed to browsers directly (site server forwards), security headers ([security](../05-quality/security.md)) |
| NFR-6 | Privacy: no personal data in logs; client IP stored only as a salted hash; GDPR-level practice (consent, stated retention, access and deletion on request, no tracking cookies) on top of Bangladesh law |
| NFR-9 | Standards: E.164, ISO 3166-1, ISO 4217, ISO 8601, UTF-8, RFC 9457, RFC 9116 (`security.txt`), W3C Trace Context, OWASP Top 10 / ASVS level 1, CSP + HSTS, SPF/DKIM/DMARC, 3-2-1 backups (full list: ADR 0005) |
| NFR-7 | Reliability: a failed submission shows a clear error and keeps everything the visitor typed |
| NFR-8 | Browser support: last two versions of Chrome, Edge, Safari, Firefox; iOS Safari 16+ |

## 5. Architecture and tech stack

The owner's engineering standard (owner decision 2026-11-17), scaled to this product.

### 5.1 Style

Clean Architecture modular monolith. Application and Domain code organised by **feature folder** (`Features/Inquiries`, later `Features/Products`, `Features/Content`, `Features/Leads`, `Features/Analytics`). Inquiries are simple CRUD handlers; no aggregate ceremony.

### 5.2 Stack

| Layer | Choice | Version rule |
|---|---|---|
| Backend | ASP.NET Core Web API (controllers), Clean Architecture | .NET 10 LTS, target `net10.0` |
| Mediator, validation | Cortex.Mediator, FluentValidation | Latest stable |
| Logging | Serilog | Latest stable |
| Database | PostgreSQL with EF Core + Npgsql | PostgreSQL 18; EF Core 10.x |
| Frontend | Next.js App Router, React, TypeScript | Next.js 16 (latest 16.x), React 19.2 |
| Styling | Own components, CSS Modules, CSS custom properties (no UI library, no Tailwind) | — |
| Icons | lucide-react | Latest stable |
| Fonts | Plus Jakarta Sans via `next/font` (self-hosted at build) | — |
| Node.js | Build and runtime of the site | Node.js 26 LTS |
| Hosting | Docker (site, API, PostgreSQL) behind Cloudflare, one VPS to start | `mcr.microsoft.com/dotnet/aspnet:10.0`, `node:26-alpine`, `postgres:18` |
| Tests | NUnit 4 + Shouldly (backend, unit only); `node --test` (frontend logic) | Latest stable |

Version rules: LTS or latest stable only, never previews. Ask the owner before adding any package not listed here or in [ADR 0001](../01-architecture/adr/0001-stack.md).

### 5.3 API conventions

Versioned routes `/api/v1/...`, camelCase JSON, ProblemDetails errors with a slug from the [error catalog](../02-backend/api-spec.md#error-catalog), FluentValidation for input, OpenAPI document. Public identifiers are references (`IH-2611-7K3QF`) or random ids; internal ids never leave the API.

### 5.4 Site → API

Browsers never call the API directly. Forms post to the site's own route handler (`/api/inquiries`), which adds the client IP and forwards server-to-server to the API (backend-for-frontend, [ADR 0004](../01-architecture/adr/0004-site-forwards-to-api.md)).

## 6. Assumptions and open questions

All unvalidated values are listed in the [owner validation register](owner-validation.md). Nothing marked ⏳ there is built as fact: it stays configurable or is shown as placeholder content.
