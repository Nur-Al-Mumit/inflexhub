# Roadmap

Status: Draft
PRD links: 2
Purpose: Version order, dependencies, and what each milestone unlocks.

```
M0 Foundation ──► V1 Launch (partially dynamic) ──► V1.1 Launch hardening ──► V2 Admin + fully dynamic ──► Later
```

| Version | Depends on | Unlocks | Milestone |
|---|---|---|---|
| M0 | — | Every later version | `docker compose up` runs site + API + database; CI green |
| V1 | M0 | Collecting real inquiries and demand data | Every form stores an inquiry; all pages complete and reviewed |
| V1.1 | V1 | Public launch | Production deploy on the domain, Turnstile, sales emails, analytics |
| V2 | V1.1 | Running the business from the admin panel | Products, content, and leads managed without a developer |

## Later (not committed)

| Idea | Why it might matter |
|---|---|
| Insights / blog | SEO and thought leadership |
| Case studies with real clients | Trust (needs real, permitted client stories, OV-5) |
| Careers page | Hiring |
| Customer portal (licences, support tickets) | Post-sale service |
| Live chat / WhatsApp business integration | Faster lead response |
| CRM export (HubSpot, Zoho) or webhook | Sales tooling |
| Pricing pages for ready products | Self-serve buying |
| Bangla language | Local reach (English only for now, owner decision) |
