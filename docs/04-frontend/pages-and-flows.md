# Pages and flows (V1)

Status: Draft
PRD links: 3.1, 3.2

## Navigation

Header: **Products** (mega menu by category + "All products" + "Coming soon") · **Industries** · **Custom Software** · **About** · **Contact** · button **Request a demo**.

Footer columns: Products (by category) · Company (About, Custom software, Upcoming, **Partners**, Contact) · Get started (Request a demo, Request a quote, Register interest) · Contact details · Legal (Privacy, Terms, Accessibility). Bottom bar: © year, registered company name, trade licence number, registered address (OV-18).

## Route table

| Route | Page | Rendering | Sections |
|---|---|---|---|
| `/` | Home | static | Hero · catalog stats strip · products by category (tabs) · availability explainer · industries grid · why InflexHub · process (4 steps) · engagement models · FAQ · CTA band |
| `/products` | Products | static shell + client filters | Page hero · filter bar · results grid · custom software CTA |
| `/products/[slug]` | Product detail | static per slug (`generateStaticParams`) | Breadcrumbs · hero with badge and actions (+ "Download brochure" when available) · overview · key features · modules · industries · benefits · how it works / delivery · FAQ · related products · CTA |
| `/industries` | Industries | static | Hero · industry cards |
| `/industries/[slug]` | Industry detail | static per slug | Hero · challenges · matching products · why InflexHub · CTA |
| `/custom-software` | Custom software | static + form | Hero · what we build · process · tech stack · engagement models · requirements form · FAQ |
| `/request-demo` | Demo form | static + form | Two-column: what to expect / form |
| `/request-quote` | Quotation form | static + form | Two-column: how quotes work / form |
| `/upcoming` | Upcoming products | static + forms | Hero · explanation · cards with "Register interest" (inline dialog form) |
| `/partners` | Partner program | static + form | Hero · who can partner · partner types · what partners get (no numbers until OV-17) · how it works (steps) · application form · FAQ |
| `/about` | About | static | Hero · story · mission/vision · values · what we do · CTA |
| `/contact` | Contact | static + form | Contact cards · form · office hours |
| `/privacy`, `/terms` | Legal | static | Long-form text |
| `/accessibility` | Accessibility statement | static | Target (WCAG 2.2 AA), known limitations, how to report a problem, date of last review |
| `/.well-known/security.txt` | Security contact | static file | RFC 9116 |
| `/manifest.webmanifest`, icons | Web app basics | static | Name, theme colour `#141A4A`, icons |
| `not-found` | 404 | static | Message · links |
| `/dev/ui` | Component gallery (review aid) | static, **development only** | Every V1-1 component in every state (hover, focus-visible, disabled, error, loading); calls `notFound()` when `NODE_ENV=production`; never linked from the site and excluded from `sitemap.xml` (V1-12) |
| `/api/inquiries` | Route handler | dynamic (server) | Forwards to API (ADR 0004) |
| `/sitemap.xml`, `/robots.txt` | SEO | static | — |

## Flow: product → inquiry

1. Visitor opens `/products/pos` (available).
2. Clicks **Request a demo** → `/request-demo?product=pos` with POS pre-selected.
3. Fills the form; client validation on blur.
4. Submit → `POST /api/inquiries` → API → `201`.
5. Form is replaced by the thank-you panel with reference `IH-2611-XXXXX` and next steps; focus moves to its heading.

Error paths: `400` → field errors + summary; `422` → product field error; `429` → "Too many requests, try again in N minutes"; network/`5xx` → banner with retry, fields kept.

## Flow: brochure download

1. On a product page with a brochure, the visitor clicks **Download brochure**.
2. A dialog asks for name and email (company optional) and consent.
3. Submit → API stores a `brochure_download` inquiry (or finds the earlier one, BR-3) and returns `downloadUrl`.
4. The site starts the download and shows a "Your brochure is downloading — open it here" link in the dialog.

## Source tracking

On first page load, the site stores UTM parameters and the landing referrer in `sessionStorage` (wrapped in try/catch). Every form adds them and the current path to `source`.
