# Database schema (V1)

Status: Draft
PRD links: 3.2, 3.3, 3.4

PostgreSQL 18, UTF-8. snake_case names. Formats per [ADR 0005](../01-architecture/adr/0005-bangladesh-first-international-standards.md). `timestamptz` for every time, stored in UTC. Migrations live in `InflexHub.Infrastructure/Persistence/Migrations` and run as a separate deploy step (`dotnet ef database update` or a migration bundle), never at API startup.

## ERD

```
inquiries 1 ───< inquiry_products
```

## inquiries

| Column | Type | Null | Notes |
|---|---|---|---|
| id | `uuid` | no | PK, UUIDv7 generated in the app; never returned by the API |
| reference | `varchar(16)` | no | BR-1, **unique** |
| type | `varchar(24)` | no | `demo`, `quote`, `custom_software`, `contact`, `product_interest`, `brochure_download`, `partner` |
| status | `varchar(24)` | no | default `new` (BR-9) |
| full_name | `varchar(120)` | no | |
| email | `varchar(254)` | no | lower-case |
| phone | `varchar(16)` | yes | E.164 (BR-10) |
| company | `varchar(160)` | yes | |
| job_title | `varchar(120)` | yes | |
| industry | `varchar(48)` | yes | visitor's own industry slug |
| company_size | `varchar(16)` | yes | |
| country | `char(2)` | no | ISO 3166-1 alpha-2, default `BD` (BR-10) |
| region | `varchar(120)` | yes | partner |
| partner_type | `varchar(24)` | yes | partner: `reseller`, `implementation`, `referral`, `technology` |
| subject | `varchar(160)` | yes | contact |
| message | `text` | yes | ≤ 5000 by validation |
| preferred_date | `date` | yes | demo |
| preferred_time | `varchar(16)` | yes | demo |
| time_zone | `varchar(64)` | yes | demo; IANA zone, default `Asia/Dhaka` |
| user_count | `integer` | yes | quote, custom |
| budget_range | `varchar(16)` | yes | range code |
| budget_currency | `char(3)` | yes | ISO 4217, `BDT` when a range is set |
| timeline | `varchar(24)` | yes | |
| details | `jsonb` | yes | type-specific extras (ADR 0003) |
| consent_at | `timestamptz` | no | BR-6 |
| page_path | `varchar(300)` | yes | |
| referrer | `varchar(500)` | yes | |
| utm_source, utm_medium, utm_campaign, utm_term, utm_content | `varchar(120)` | yes | |
| ip_hash | `varchar(64)` | yes | SHA-256 of IP + secret salt (NFR-6) |
| user_agent | `varchar(300)` | yes | truncated |
| sales_notified_at | `timestamptz` | yes | set when the sales email was sent (BR-11); `null` = not sent (disabled or failed), so V1.1/V2 can resend |
| created_at | `timestamptz` | no | |

Indexes: `ux_inquiries_reference` (unique), `ix_inquiries_created_at` (desc), `ix_inquiries_type_created_at`, `ix_inquiries_email`.

## inquiry_products

| Column | Type | Null | Notes |
|---|---|---|---|
| inquiry_id | `uuid` | no | FK → inquiries, cascade delete; PK part 1 |
| product_slug | `varchar(64)` | no | PK part 2 |
| product_name | `varchar(120)` | no | snapshot (BR-7) |
| category_slug | `varchar(48)` | no | snapshot |
| availability | `varchar(16)` | no | snapshot `available`/`custom`/`upcoming` |

Indexes: `ix_inquiry_products_product_slug`.

Duplicates (BR-3) are checked by the handler (`type` in `product_interest`, `brochure_download` + email + product slug). It is not a unique constraint, because the same pair is legitimately repeated for other types.

## Demand views

```sql
CREATE VIEW v_demand_by_product AS
SELECT p.product_slug, p.product_name, p.category_slug,
       count(*)                                         AS inquiries,
       count(*) FILTER (WHERE i.type = 'demo')          AS demos,
       count(*) FILTER (WHERE i.type = 'quote')         AS quotes,
       count(*) FILTER (WHERE i.type = 'product_interest') AS interest,
       count(*) FILTER (WHERE i.type = 'custom_software')  AS custom,
       count(*) FILTER (WHERE i.type = 'brochure_download') AS brochures,
       count(*) FILTER (WHERE i.type = 'partner')          AS partner_mentions,
       max(i.created_at)                                AS last_inquiry_at
FROM inquiry_products p
JOIN inquiries i ON i.id = p.inquiry_id
WHERE i.status <> 'spam'
GROUP BY p.product_slug, p.product_name, p.category_slug;

CREATE VIEW v_demand_by_industry AS
SELECT coalesce(i.industry, 'unspecified') AS industry,
       count(*) AS inquiries,
       count(DISTINCT i.email) AS unique_contacts
FROM inquiries i
WHERE i.status <> 'spam'
GROUP BY coalesce(i.industry, 'unspecified');

CREATE VIEW v_demand_by_country AS
SELECT i.country,
       count(*) AS inquiries,
       count(DISTINCT i.email) AS unique_contacts
FROM inquiries i
WHERE i.status <> 'spam'
GROUP BY i.country;
```

(`product_name` uses the latest snapshot per slug in V2 dashboards.)

## V2 (planned)

`products`, `categories`, `industries`, `product_industries`, `content_blocks`, `users`, `roles`, `inquiry_notes`, `inquiry_status_history`, `audit_log`. `inquiry_products.product_slug` gains a FK to `products.slug` after seeding.
