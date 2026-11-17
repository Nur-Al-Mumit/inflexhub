# API specification (V1)

Status: Draft
PRD links: 3.2, 3.3, 3.5, 5.3, 5.4

Base path `/api/v1`. JSON in camelCase. Errors are ProblemDetails (`application/problem+json`) with `type` = `https://inflexhub.com/errors/<slug>`, `title`, `status`, `detail`, `traceId`, and for validation `errors: { field: [messages] }`.

## Endpoints

| Method | Path | Purpose | Auth |
|---|---|---|---|
| POST | `/api/v1/inquiries` | Submit any inquiry type | `X-Site-Key` header ([ADR 0004](../01-architecture/adr/0004-site-forwards-to-api.md)) |
| GET | `/api/v1/catalog/products` | Products, categories, industries from the catalog | Public (read-only) |
| GET | `/api/v1/admin/inquiries/export` | CSV of inquiries in a date range (PRD §3.5, BR-12) | `X-Admin-Key` header; the API is reachable only from the server |
| GET | `/health/live` | Process is up | Public |
| GET | `/health/ready` | Database reachable | Public |

## POST /api/v1/inquiries

### Request

```json
{
  "type": "demo",
  "fullName": "Ayesha Rahman",
  "email": "ayesha@acme.com",
  "phone": "01711000000",
  "company": "Acme Retail Ltd",
  "jobTitle": "Operations Manager",
  "industry": "retail",
  "companySize": "51-200",
  "country": "BD",
  "productSlugs": ["pos"],
  "subject": null,
  "message": "We run 6 outlets and need central stock control.",
  "preferredDate": "2026-11-25",
  "preferredTime": "morning",
  "timeZone": "Asia/Dhaka",
  "userCount": null,
  "budgetRange": null,
  "timeline": null,
  "details": null,
  "consent": true,
  "website": "",
  "source": {
    "pagePath": "/products/pos",
    "referrer": "https://www.google.com/",
    "utmSource": "google", "utmMedium": "cpc", "utmCampaign": "launch", "utmTerm": null, "utmContent": null
  }
}
```

`website` is the honeypot (BR-5). Formats follow [ADR 0005](../01-architecture/adr/0005-bangladesh-first-international-standards.md): the example phone `01711000000` is stored as `+8801711000000`. `details` is an optional object of strings or string arrays (custom software: `features`, `referenceLinks`, `currentSystem`).

### Inquiry fields per type

✔ required · ○ optional · — ignored. Column keys: **demo**, **quote**, **custom** = `custom_software`, **contact**, **interest** = `product_interest`, **brochure** = `brochure_download`, **partner**.

| Field | demo | quote | custom | contact | interest | brochure | partner | Rule |
|---|---|---|---|---|---|---|---|---|
| fullName | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | 2–120, any script |
| email | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | valid, ≤ 254, stored lower-case |
| phone | ✔ | ✔ | ✔ | ○ | ○ | ○ | ✔ | Bangladesh mobile: `01[3-9]XXXXXXXX`, `8801…` or `+8801…` → stored `+8801XXXXXXXXX`; other countries: E.164 shape `+[1-9]` followed by 6–14 digits (spaces, dashes, brackets stripped). Full per-country validation needs a phone library (OV-15) (BR-10) |
| company | ✔ | ✔ | ✔ | ○ | ○ | ○ | ✔ | ≤ 160 |
| jobTitle | ○ | ○ | ○ | ○ | — | ○ | ○ | ≤ 120 |
| industry | ○ | ○ | ○ | ○ | ○ | ○ | — | catalog industry slug or `other` |
| companySize | ○ | ○ | ○ | — | ○ | ○ | ○ | `1-10`, `11-50`, `51-200`, `201-1000`, `1000+` |
| country | ○ | ○ | ○ | ○ | ○ | ○ | ✔ | ISO 3166-1 alpha-2; default `BD` when omitted (BR-10) |
| region | — | — | — | — | — | — | ○ | City or region the partner covers, ≤ 120 |
| partnerType | — | — | — | — | — | — | ✔ | `reseller`, `implementation`, `referral`, `technology` (OV-17) |
| productSlugs | ✔ exactly 1 | ✔ 1–10 | ○ 0–10 | ○ 0–1 | ✔ exactly 1 | ✔ exactly 1 | ○ 0–10 | catalog slugs, eligible (BR-2) |
| subject | — | — | — | ✔ | — | — | — | 3–160 |
| message | ○ | ○ | ✔ 30–5000 | ✔ 10–5000 | ○ | — | ○ | ≤ 5000 |
| preferredDate | ○ | — | — | — | — | — | — | today or later (Asia/Dhaka), ≤ 180 days ahead |
| preferredTime | ○ | — | — | — | — | — | — | `morning`, `afternoon`, `evening` (in `timeZone`) |
| timeZone | ○ | — | — | — | — | — | — | IANA zone from the browser (e.g. `Asia/Dhaka`); default `Asia/Dhaka` |
| userCount | — | ○ | ○ | — | — | — | — | 1–100000 |
| budgetRange | — | ○ | ○ | — | — | — | — | BDT range codes: `lt-2l` (under ৳2 lakh), `2l-5l`, `5l-15l`, `15l-50l`, `gt-50l`, `not-sure` (OV-9); stored with currency `BDT` |
| timeline | — | ○ | ○ | — | — | — | — | `asap`, `1-3-months`, `3-6-months`, `6-plus-months`, `exploring` |
| consent | ✔ true | ✔ true | ✔ true | ✔ true | ✔ true | ✔ true | ✔ true | BR-6 |

### Product eligibility (BR-2)

| Type | Allowed products |
|---|---|
| demo | availability `available` |
| quote | availability `available` or `custom` |
| custom_software | any |
| contact | any |
| product_interest | availability `upcoming` or `custom` |
| brochure_download | any product whose catalog entry has a `brochure` |
| partner | any |

### Responses

| Status | When | Body |
|---|---|---|
| 201 | Stored (or honeypot triggered, BR-5) | `{ "reference": "IH-2611-7K3QF", "type": "demo", "createdAt": "2026-11-17T09:30:00Z", "downloadUrl": null }` |
| 200 | Duplicate interest or brochure download (BR-3) | Same shape, the first inquiry's reference |
| 400 | Validation | ProblemDetails `validation-failed` with `errors` |
| 401 | Missing or wrong `X-Site-Key` | `site-key-invalid` |
| 422 | Product unknown or not eligible | `product-not-eligible` with `errors.productSlugs` |
| 429 | Rate limited (BR-4) | `rate-limited`, `Retry-After` header |

`downloadUrl` is set only for `brochure_download`: the site-relative path of the PDF (for example `/brochures/pos.pdf`). For a honeypot hit on a brochure request, the link is still returned so bots learn nothing.

### After saving

When the inquiry is stored (not for honeypot hits or BR-3 duplicates), the handler queues one sales notification (BR-11). The response does not wait for the email.

## GET /api/v1/admin/inquiries/export

Query: `from`, `to` (ISO 8601 dates, inclusive, Asia/Dhaka days; default the last 30 days; at most 366 days). Header `X-Admin-Key` (constant-time comparison with `Admin__ExportKey`; the endpoint returns `404` when no key is configured).

Response `200 text/csv; charset=utf-8` with a UTF-8 BOM (opens correctly in Excel, including Bangla text), file name `inquiries-<from>-<to>.csv`. Columns: `reference, created_at (Asia/Dhaka), type, status, full_name, email, phone, company, job_title, industry, company_size, country, region, partner_type, products, availabilities, subject, message, preferred_date, preferred_time, time_zone, user_count, budget_range, budget_currency, timeline, page_path, referrer, utm_source, utm_medium, utm_campaign`. Products joined with `; `. Cells starting with `= + - @` are prefixed with `'` (BR-12).

Usage on the server: `curl -H "X-Admin-Key: $ADMIN_EXPORT_KEY" "http://localhost:8080/api/v1/admin/inquiries/export?from=2026-11-01&to=2026-11-30" -o inquiries.csv`

## GET /api/v1/catalog/products

```json
{
  "categories": [{ "slug": "education", "name": "Education" }],
  "industries": [{ "slug": "healthcare", "name": "Healthcare" }],
  "products": [{
    "slug": "pos", "name": "InflexHub POS", "tagline": "...", "category": "sales-commerce",
    "industries": ["retail", "hospitality"], "availability": "available", "brochure": null
  }]
}
```

## Sales notification email (BR-11)

| Item | Value |
|---|---|
| To | `Email__SalesRecipients` (comma-separated, OV-12) |
| From | `Email__From` |
| Reply-To | The visitor's email |
| Subject | `[InflexHub] New <type label>: <product names or subject> — <reference>` |
| Body | Plain text and simple HTML: type, reference, time (Asia/Dhaka), products with availability, contact details, company, country, all filled type-specific fields, message, source page and UTM |
| Delivery | In-process background queue; 3 attempts with backoff (ASSUMPTION); failure logged with the reference only |
| Disabled | When `Email__Enabled` is false or SMTP settings are missing; inquiries are still stored |

## Error catalog

| Slug | Status | Meaning |
|---|---|---|
| `validation-failed` | 400 | One or more fields invalid; see `errors` |
| `site-key-invalid` | 401 | Request did not come from the site server |
| `admin-key-invalid` | 401 | Export called without the correct admin key |
| `not-found` | 404 | Route or resource not found |
| `product-not-eligible` | 422 | Product does not exist or does not allow this inquiry type |
| `rate-limited` | 429 | Too many submissions; retry after the given seconds |
| `internal-error` | 500 | Unexpected failure; `traceId` for support |
