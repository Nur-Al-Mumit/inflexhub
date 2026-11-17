# InflexHub

Corporate website and inquiry platform for InflexHub, a software solutions company (ERP, POS, school, college and university, hospital, LMS, e-commerce, HRM, CRM, inventory, accounting, and more).

- **V1 (current):** complete public site with a static product catalog, plus an API and database that store every demo, quotation, custom software, contact, and product-interest inquiry.
- **V2 (planned):** admin panel, with the catalog and content fully dynamic.

| Part | Path | Stack |
|---|---|---|
| Docs | [`docs/`](docs/README.md) | PRD, scopes, stories, architecture, design system |
| Catalog | `catalog/products.json` | Shared by site and API |
| API | `src/` | .NET 10, Clean Architecture, EF Core, PostgreSQL 18 |
| Site | `web/apps/site` | Next.js 16, React 19, CSS Modules |
| Tests | `tests/`, `web/apps/site/tests` | NUnit 4 + Shouldly, `node --test` |

Start with [docs/README.md](docs/README.md) and [AGENTS.md](AGENTS.md).
