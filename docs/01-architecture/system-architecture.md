# System architecture

Status: Draft
PRD links: 5

## V1 components

```
 Browser
   │  HTTPS (Cloudflare in V1.1)
   ▼
 site  (Next.js 16, node:26)                       port 3000
   ├─ static pages (built from catalog/products.json + src/content)
   └─ /api/inquiries  route handler  ──► forwards server-to-server
                                           │  X-Forwarded-For, X-Site-Key
                                           ▼
 api   (ASP.NET Core 10)                           port 8080 (internal network only)
   ├─ POST /api/v1/inquiries
   ├─ GET  /api/v1/catalog/products
   ├─ GET  /api/v1/admin/inquiries/export   (X-Admin-Key, server only)
   ├─ background: sales email queue ──► SMTP (when configured)
   └─ /health/live, /health/ready
                                           │  Npgsql
                                           ▼
 db    (PostgreSQL 18)                              port 5432 (internal network only)
```

| Component | Responsibility | State |
|---|---|---|
| `site` | Render pages, client-side validation, forward forms with the visitor IP | Stateless |
| `api` | Validate, apply business rules, rate limit, store inquiries | Stateless (in-memory rate limiter is per instance; acceptable on one instance, Redis-backed limiter if scaled) |
| `db` | Inquiries and (V2) catalog, content, users | Stateful, backed up daily from V1.1 |

## Request flow: submit an inquiry

1. Browser validates the form and posts JSON to `/api/inquiries` on the site.
2. Site route handler adds the client IP (`CF-Connecting-IP` or `X-Forwarded-For`), the shared `X-Site-Key`, and forwards to `API_BASE_URL/api/v1/inquiries`.
3. API checks the site key, applies the rate limit (BR-4) keyed by the forwarded IP, runs the FluentValidation validator, then the handler.
4. Handler checks the honeypot (BR-5), product eligibility (BR-2) through `ICatalog`, duplicate interest (BR-3), creates the reference (BR-1), snapshots product fields (BR-7), saves.
5. After saving, the handler queues a sales notification (BR-11); a hosted service sends it with MailKit and sets `sales_notified_at`. The queue is in memory: an email pending during a restart is lost, but the inquiry is safe and `sales_notified_at` stays null for resending (V1.1).
6. API returns `201 { reference, type, createdAt, downloadUrl }` (or `200` for a duplicate); the site shows the thank-you state or starts the brochure download.

## V2 additions

`admin` Next.js app on its own subdomain; API gains authenticated `/api/v1/admin/*` endpoints; `products`, `categories`, `industries`, `content_blocks`, `users`, `audit_log`, `inquiry_status_history` tables; site moves to API-backed catalog with on-demand revalidation.
