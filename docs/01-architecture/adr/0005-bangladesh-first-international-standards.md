# ADR 0005 — Bangladesh first, international standards

Status: Accepted (2026-11-17, owner decision)

## Context

InflexHub's first market is Bangladesh. The owner wants the site and data to follow international standards so it stays credible to any visitor and can expand to other markets later without rework.

## Decision

**Market defaults are Bangladeshi. Formats, data, and quality follow international standards.**

| Area | Bangladesh-first default | International standard kept |
|---|---|---|
| Language | English content (owner decision); Bangla later | UTF-8 everywhere; names and messages accept any Unicode script (Bangla names valid); `lang="en"` |
| Currency | BDT (`৳`) on budget ranges | ISO 4217 code `BDT` stored with the range; ranges are codes, not free text, so other currencies can be added |
| Phone | Country picker defaults to Bangladesh (+880); local input `01XXXXXXXXX` accepted | Stored in E.164 (`+8801XXXXXXXXX`); any country allowed |
| Country | Defaults to Bangladesh, optional | ISO 3166-1 alpha-2 code stored (`BD`) |
| Time | Business hours and demo slots in Bangladesh time (Asia/Dhaka) | All timestamps stored in UTC (`timestamptz`); API uses ISO 8601; the visitor's IANA time zone is stored with a demo request |
| Dates on screen | `17 November 2026` | Unambiguous day–month-name–year; ISO 8601 in data |
| Address and contact | Head office in Bangladesh | schema.org `PostalAddress` with country code in JSON-LD |
| Privacy | Bangladesh data protection law | GDPR-level practice: purpose-limited fields, explicit consent, stated retention, access and deletion on request, no tracking cookies |
| Accessibility | — | WCAG 2.2 AA |
| Security | — | OWASP Top 10 and OWASP ASVS level 1 for V1 |
| API errors | — | RFC 9457 Problem Details |
| SEO | Target Bangladesh (`en-BD` alternate later with Bangla) | schema.org JSON-LD, sitemap protocol, Open Graph |

### Web, security, and operations standards (added 2026-11-17)

| Area | Standard | Version |
|---|---|---|
| Performance | Core Web Vitals "good" at the 75th percentile on mobile: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 | V1 |
| SEO | Canonical URL on every page; `hreflang` added when Bangla arrives; `lang="en"`; one `h1` per page | V1 |
| Web app basics | Favicon set (SVG + PNG + Apple touch icon), web app manifest, theme colour, `robots.txt`, `sitemap.xml` | V1 |
| Security headers | nonce-based Content-Security-Policy (no unsafe inline scripts; `frame-ancestors 'none'`), HSTS with `includeSubDomains; preload` in production, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` | V1 (HSTS V1.1) |
| Vulnerability disclosure | `/.well-known/security.txt` (RFC 9116) with a contact and expiry | V1 |
| Supply chain | Dependency vulnerability checks in CI (`npm audit --audit-level=high`, `dotnet list package --vulnerable`), automated update PRs (Dependabot), secret scanning | V1 (CI) |
| Accessibility | Automated axe-core checks in the frontend tests plus manual checks; public accessibility statement page | V1 |
| Email | SPF, DKIM, and DMARC for the sending domain before any email goes to production | V1.1 |
| Observability | W3C Trace Context (`traceparent`) propagated site → API; `traceId` in every ProblemDetails and log line | V1 |
| Backups | Daily encrypted PostgreSQL backups, 3-2-1 rule (3 copies, 2 media, 1 off-site), RPO 24 h, RTO 4 h (ASSUMPTION), restore tested each quarter | V1.1 |
| Legal transparency | Registered company name, trade licence number, registered address in the footer and legal pages (common in Bangladesh and required by EU imprint rules) | V1 (values OV-18) |
| Privacy transparency | The privacy policy lists processors (hosting provider, Cloudflare, SMTP provider), the purposes, the legal basis (consent), retention, rights, and international data transfer if hosting is outside Bangladesh | V1 (text OV-7) |

## Consequences

- Validators normalise phone numbers to E.164 and countries to ISO codes; the site's phone field has a country selector.
- Demand reports can group by country from day one (`v_demand_by_country`).
- Local product claims (for example NBR VAT/Mushak support, bKash/Nagad payments) are attractive but must be confirmed by the owner before they appear (OV-13).
