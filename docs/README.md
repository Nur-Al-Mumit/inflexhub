# InflexHub documentation

Status: Draft
Purpose: Reading order and document map.

- **Source of truth:** [PRD](00-product/PRD.md). If a document disagrees with it, the PRD wins; record real changes as a new [ADR](01-architecture/adr/).
- **What is done, what is next:** [tracker](00-product/tracker.md).
- **Not yet confirmed by the owner:** [owner-validation](00-product/owner-validation.md).
- **Working in the code?** Read the root [AGENTS.md](../AGENTS.md), then the full [operating manual](agents/operating-manual.md) and your [role prompt](agents/prompts/).

## Start here, by role

| Role | Read in this order |
|---|---|
| Anyone new | PRD → product-catalog → roadmap → scope/v1 → tracker |
| Backend | user-stories → clean-architecture → api-spec → schema → coding-standards → testing-strategy |
| Frontend | **ui-guidelines** → design-system → pages-and-flows → nextjs-architecture → user-stories → api-spec |
| Owner | tracker → owner-validation → scope of the current version |

## Document map

| Area | Document | Covers |
|---|---|---|
| Product | [PRD](00-product/PRD.md) | Goals, availability model, pages, forms, business rules, NFRs, stack |
| | [product-catalog](00-product/product-catalog.md) | 15 products, categories, industries, slugs |
| | [roadmap](00-product/roadmap.md) | Version order and later ideas |
| | [scope/](00-product/scope/README.md) | M0, V1, V1.1, V2 scope and exit criteria |
| | [user-stories](00-product/user-stories.md) | Gherkin acceptance criteria |
| | [tracker](00-product/tracker.md) | Status per row |
| | [owner-validation](00-product/owner-validation.md) | Unconfirmed values and decisions log |
| Architecture | [system-architecture](01-architecture/system-architecture.md) | Components and request flow |
| | [clean-architecture](01-architecture/clean-architecture.md) | Projects, layers, feature folders |
| | [adr/](01-architecture/adr/) | 0001 stack · 0002 static catalog · 0003 single inquiries table · 0004 site forwards to API · 0005 Bangladesh first, international standards |
| Backend | [api-spec](02-backend/api-spec.md) | Endpoints, fields per type, error catalog |
| | [coding-standards](02-backend/coding-standards.md) | C# and TypeScript conventions |
| Database | [schema](03-database/schema.md) | Tables, indexes, demand views |
| Frontend | [**ui-guidelines**](04-frontend/ui-guidelines.md) | **Absolute UI rules (UI-1 – UI-12), approved patterns, layout and review checklists; enforced by tests** |
| | [design-system](04-frontend/design-system.md) | Brand, tokens, components, patterns |
| | [pages-and-flows](04-frontend/pages-and-flows.md) | Routes, sections, flows |
| | [nextjs-architecture](04-frontend/nextjs-architecture.md) | Workspace, folders, rules, env |
| Quality | [testing-strategy](05-quality/testing-strategy.md) | Test levels, mandatory tests |
| | [security](05-quality/security.md) | Threats and controls |
| DevOps | [docker-and-environments](06-devops/docker-and-environments.md) | Services, environments, configuration |
| Agents | [agents/operating-manual.md](agents/operating-manual.md) | Operating manual: golden rules, conventions, commands, build order, slice workflow, commits, PR checklist, definition of done |
| | [agents/prompts/](agents/prompts/) | Role prompts: product manager, architect, .NET engineer, database architect, Next.js engineer, UI/UX designer, QA/security, DevOps |

## Change log

| Date | Change |
|---|---|
| 2026-11-20 | UI guidelines (absolute rules UI-1 – UI-12) with automated enforcement in `ui-guidelines.test.ts`; owner rule UI-1 forbids one-sided accent borders; wired into every AGENTS file, the operating manual and role prompts |
| 2026-11-17 | Agent instructions follow current best practice: one root `AGENTS.md` (short, auto-loaded), scoped `AGENTS.md` per code area (`src/`, later `web/apps/site/`), long manual renamed to `agents/operating-manual.md` |
| 2026-11-17 | International standards completed (ADR 0005 addendum): Core Web Vitals, canonical URLs, CSP + HSTS, `security.txt`, axe-core tests, accessibility statement, dependency and secret scanning, SPF/DKIM/DMARC, W3C trace context, 3-2-1 backups, company legal details; US-17 |
| 2026-11-17 | PRD v1.2: brochure downloads (US-13), partner applications and `/partners` page (US-14), sales notification email in V1 (US-15, BR-11, MailKit), protected CSV export (US-16, BR-12) |
| 2026-11-17 | PRD v1.1: Bangladesh first, international standards (ADR 0005): E.164 phones, ISO country/currency codes, UTC + time zone, BDT ranges, OWASP ASVS L1, GDPR-level privacy; `v_demand_by_country` |
| 2026-11-17 | Operating manual (`agents/AGENTS.md`) and 8 role prompts added |
| 2026-11-17 | Docs set v1.0 written before code: English only, V1 partially dynamic, stack per ADR 0001, logo-derived design system |
