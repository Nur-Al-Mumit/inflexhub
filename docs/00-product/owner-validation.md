# Owner validation register

Status: Living document
Purpose: Every value, text, or rule that the owner has not confirmed yet. Items marked ⏳ are never built as fact: they stay configurable or appear as clearly replaceable placeholder content.

| ID | Item | Current placeholder | Where it lives | State |
|---|---|---|---|---|
| OV-1 | Availability of each product (available / custom / upcoming) | 5 / 5 / 5 split in [product-catalog](product-catalog.md) | `catalog/products.json` | ⏳ |
| OV-2 | Product marketing copy (overview, features, modules, FAQ) | AI-drafted | `web/apps/site/src/content/` | ⏳ |
| OV-3 | Company contact details: address, phone, email, office hours | `hello@inflexhub.com`, `+880 1XXX-XXXXXX`, "Dhaka, Bangladesh", Sun–Thu 10:00–18:00 Bangladesh time (GMT+6) | `web/apps/site/src/content/company.ts` | ⏳ |
| OV-4 | Company claims (years of experience, number of clients, projects) | **Not shown.** No unverified numbers on the site; the home page shows factual catalog counts only | — | ⏳ |
| OV-5 | Client logos and testimonials | **Not shown** until real, permitted ones exist | — | ⏳ |
| OV-6 | Logo files | Rebuilt wordmark from the supplied image; the supplied tagline "Influencers. Growth. Together." is **not used** (it does not describe a software company). New tagline proposal: "Software that moves business forward." | `web/apps/site/src/components/brand/` | ⏳ |
| OV-7 | Privacy policy and terms of use text | Generic draft, needs legal review before launch | `/privacy`, `/terms` | ⏳ |
| OV-8 | Rate limit for submissions (BR-4) | 5 per 10 minutes per IP | API configuration | ⏳ |
| OV-9 | Budget ranges offered on forms (BDT, ADR 0005) | Under ৳2 lakh · ৳2–5 lakh · ৳5–15 lakh · ৳15–50 lakh · Over ৳50 lakh · Not sure | `web/apps/site/src/content/form-options.ts` | ⏳ |
| OV-10 | Company size bands | 1–10 · 11–50 · 51–200 · 201–1000 · 1000+ | same file | ⏳ |
| OV-11 | Domain and production server | inflexhub.com (to confirm), VPS chosen later | V1.1 | ⏳ |
| OV-12 | Who receives new-inquiry emails (sales recipients), sender address, and the SMTP provider | Email code in V1, disabled until configured | API configuration `Email__*` | ⏳ |
| OV-13 | Local product claims: NBR VAT (Mushak) support, bKash / Nagad / SSLCommerz payment integration, Bangla invoices, BDT accounting | **Not claimed** until confirmed per product | product content | ⏳ |
| OV-14 | Data retention period for inquiries (GDPR-level practice) | Proposal: 3 years, then anonymised | privacy policy, V2 job | ⏳ |
| OV-16 | Brochure PDFs per product | None yet; brochure buttons hidden until files are supplied | `web/apps/site/public/brochures/` | ⏳ |
| OV-17 | Partner program details: partner types offered, benefits (margins, training, leads), regions | Placeholder types: reseller, implementation partner, referral partner, technology partner; benefits described without numbers | `src/content/partners.ts` | ⏳ |
| OV-18 | Company legal details: registered company name, trade licence number, registered address (and BIN/TIN if you want them shown) | Placeholders `InflexHub Ltd.` · `TRAD/DNCC/XXXXXX/2026` · head office address | `src/content/company.ts`, footer | ⏳ |
| OV-19 | Which Bangladesh data protection law currently applies, and hosting location (inside or outside Bangladesh, for the cross-border transfer notice) | Privacy text kept generic until a lawyer confirms | privacy policy | ⏳ |
| OV-20 | Security contact address for `security.txt` | `security@inflexhub.com` | `public/.well-known/security.txt` | ⏳ |
| OV-15 | Phone validation library for full per-country checks (`libphonenumber-csharp` / `libphonenumber-js`) | Not added; Bangladesh rule exact, other countries E.164 shape only | API + site | ⏳ |

## Decided

| Date | Decision |
|---|---|
| 2026-11-17 | English only |
| 2026-11-17 | V1 is partially dynamic: static content and catalog, dynamic forms with API + database |
| 2026-11-17 | Stack: .NET 10, Next.js 16, PostgreSQL 18, Docker (ADR 0001) |
| 2026-11-17 | Docs are written before any code |
| 2026-11-17 | V1 adds brochure downloads, partner/reseller applications, and lead visibility (sales email when configured + protected CSV export) |
| 2026-11-17 | Bangladesh first, built to international standards ([ADR 0005](../01-architecture/adr/0005-bangladesh-first-international-standards.md)) |
