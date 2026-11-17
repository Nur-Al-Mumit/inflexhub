# Testing strategy

Status: Draft

## Levels

| Level | Tool | What | Gate |
|---|---|---|---|
| Backend unit | NUnit 4 + Shouldly in `tests/InflexHub.Application.UnitTests` | Every validator, handler, domain rule, reference generator | CI, every PR |
| Frontend unit | `node --test` (Node 26 strips TypeScript types natively) in `web/apps/site/tests` | Filters, catalog/content consistency, inquiry payload building, client validation | CI, every PR |
| Accessibility (automated) | axe-core with jsdom inside `node --test`, run against the built HTML of key pages (home, products, product detail, each form page) | No serious or critical violations (WCAG 2.2 AA rules) | CI, every PR |
| Supply chain | `npm audit --audit-level=high`, `dotnet list package --vulnerable --include-transitive` | No high/critical advisories | CI, every PR |
| Build | `next build`, `dotnet build -warnaserror` | Types, static generation of every route | CI |
| Manual `@ui` | Browser at 360 / 768 / 1280 px, keyboard only, screen reader spot check (VoiceOver / NVDA), Lighthouse and Core Web Vitals | Layout, focus, contrast, motion, LCP/INP/CLS | Before each release |

Integration tests against a real PostgreSQL are deferred until V2 (V1 has one write path and simple queries; unit tests plus hand-reviewed migration SQL cover the risk).

## Mandatory tests (never skipped or deleted)

| Class | Covers |
|---|---|
| `SubmitInquiryValidatorTests` | Required fields per type, lengths, enums, consent (BR-6, BR-8) |
| `SubmitInquiryHandlerTests` | Eligibility (BR-2), duplicate interest (BR-3), honeypot (BR-5), snapshot (BR-7), status `new` (BR-9), reference retry on collision (BR-1) |
| `InquiryReferenceTests` | Format and alphabet (BR-1) |
| `SalesNotificationTests` | One notification per stored inquiry, none for honeypot/duplicates, disabled mode, retries (BR-11) |
| `ExportInquiriesHandlerTests`, `CsvWriterTests` | Date range in Asia/Dhaka days, BOM, column order, CSV-injection prefix (BR-12) |
| `catalog.test.ts` | Every catalog slug has content and vice versa; slugs unique; references valid; every listed brochure file exists |
| `filters.test.ts` | Category / industry / availability / search filters and URL round-trip |
| `inquiry.test.ts` | Client validation matches API rules per type |
| `a11y.test.ts` | axe-core: no serious/critical violations on key pages |
