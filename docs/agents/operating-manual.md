# Operating manual — InflexHub

Status: Living document
PRD links: 2, 3, 5
Purpose: The complete workflow for any contributor, human or AI, writing code, tests, or documentation for InflexHub. Read it in full before you change anything.

## Agent instruction files

| File | Loaded | Holds |
|---|---|---|
| [`AGENTS.md`](../../AGENTS.md) (root) | Automatically, every session | Golden rules summary, commands, definition of done. Short on purpose |
| [`src/AGENTS.md`](../../src/AGENTS.md) | Automatically when working in `src/` | Backend-only rules |
| `web/apps/site/AGENTS.md` | Automatically when working in the site (created in M0) | Frontend-only rules, Next.js 16 notes |
| This manual | On purpose, before build work | Everything: full rules, build order, workflow, checklists |
| [`prompts/`](prompts/) | On purpose, per role | Role mission, ownership, guardrails |

This manual is the authority among them. If the root file disagrees with it, fix the root file. If anything disagrees with the [PRD](../00-product/PRD.md), the PRD wins. Never put rules only in an auto-loaded file; keep auto-loaded files short and point here.

## How to use this file

1. Read the [PRD](../00-product/PRD.md). It wins over every other document, including this one.
2. Read the current version's scope ([V1](../00-product/scope/v1.md)). Build only that version's scope.
3. Open the [tracker](../00-product/tracker.md) and pick your row. A row marked `blocked` is not started.
4. Load the role prompt for your discipline from [prompts/](prompts/) (see [Roles](#roles)).
5. Find your version in [Build order](#build-order), re-read the docs it lists, then follow the [Slice workflow](#slice-workflow).
6. Before every commit: run **Verify all** from [Commands](#commands) and go through the [PR checklist](#pr-checklist).

## Project overview

InflexHub is a software solutions company. Its website presents about 15 business software products (ERP, POS, school, college and university, hospital, LMS, e-commerce, HRM and payroll, CRM, inventory, accounting, and more) to businesses, educational institutions, and healthcare organisations. Each product is **ready to use**, **built on request**, or **coming soon**. Visitors request demos and quotations, submit custom software requirements, contact the company, and register interest in upcoming products. Every submission is stored as an inquiry tagged with product, industry, and availability, so the owner can see **which products and industries have the most demand** before investing.

V1 is **partially dynamic**: static pages and a static catalog (`catalog/products.json`), with dynamic forms stored through the API. V2 adds the admin panel and makes catalog and content dynamic.

Market: **Bangladesh first, built to international standards** (ADR 0005). Stack (PRD §5.2): .NET 10 (Clean Architecture, Cortex.Mediator, FluentValidation, Serilog), EF Core with Npgsql on PostgreSQL 18, one Next.js 16 site (`web/apps/site`) that forwards forms to the API (ADR 0004), Docker. English only.

## Golden rules

1. **The PRD is the source of truth.** If code and docs disagree, fix the code. If the PRD must change, record the decision in a new [ADR](../01-architecture/adr/) or the decisions table in [owner-validation](../00-product/owner-validation.md), update the PRD, and bump its version note. Never let docs drift silently.
2. **Docs before code.** A new feature or behaviour change starts with its docs (PRD, scope, story, API spec, schema) in the same change or earlier.
3. **Never invent business rules, prices, client numbers, testimonials, client logos, or company facts.** Missing → add it to [owner-validation](../00-product/owner-validation.md) and keep it configurable or clearly placeholder. Anything ⏳ there is not decided.
4. **Dependency rule:** Api → Application, Infrastructure → Application, Application → Domain. Domain references nothing. Api is the only composition root ([clean-architecture](../01-architecture/clean-architecture.md)).
5. **Feature folders, never technical folders:** `Features/<Feature>/Commands|Queries/<UseCase>/` in Application, matching folders in Domain and tests.
6. **Controllers are thin:** translate HTTP into a command or query, send it through the mediator, return the result. Errors become ProblemDetails with a slug from the [error catalog](../02-backend/api-spec.md#error-catalog).
7. **Every command has a FluentValidation validator.** Validators check shape; handlers and domain enforce business rules (BR-2, BR-3, BR-5).
8. **No persistence detail in Application or Domain.** EF Core lives in Infrastructure behind Application contracts. No `IQueryable` leaves Infrastructure.
9. **Product slugs never change.** The catalog is `catalog/products.json`, read by both the site and the API (ADR 0002). Inquiries snapshot product name, category, and availability (BR-7).
10. **Never log personal data:** names, emails, phones, messages, IPs. Log the inquiry reference and type. IPs are stored only as salted hashes.
11. **The browser never calls the API directly.** Forms go to the site's `/api/inquiries` route handler, which forwards with `X-Site-Key` (ADR 0004).
12. **Configuration, not literals:** rate limits, site key, salts, URLs come from options/environment.
13. **Public identifiers only:** the API returns references (`IH-2611-7K3QF`), never internal ids.
14. **Frontend design:** tokens and own components from the [design system](../04-frontend/design-system.md); CSS Modules; no UI or headless component library; no Tailwind. Use an existing component before creating a new one.
15. **Honest UI:** availability always visible; only factual numbers; no fake urgency.
16. **Accessibility is part of done:** WCAG 2.2 AA, keyboard, visible focus, labels, reduced motion.
17. **Tests are unit tests** (backend `tests/InflexHub.Application.UnitTests`, frontend `node --test`). Mandatory tests in [testing-strategy](../05-quality/testing-strategy.md#mandatory-tests-never-skipped-or-deleted) are never skipped or deleted.
18. **Packages:** only those in [ADR 0001](../01-architecture/adr/0001-stack.md); LTS or latest-stable lines; ask the owner before adding anything else. Backend versions live in `Directory.Packages.props`.
19. **Migrations never run at API startup.** They run as a separate step (`migrate` service or `dotnet ef database update`).
20. **Commit only when the owner asks**, on a feature branch, conventional commit messages.
21. **Bangladesh first, international standards** ([ADR 0005](../01-architecture/adr/0005-bangladesh-first-international-standards.md)): Bangladeshi defaults (BDT, +880, `BD`, Asia/Dhaka) with E.164 phones, ISO 3166-1 / ISO 4217 codes, UTC + ISO 8601 times, Unicode names, WCAG 2.2 AA, OWASP ASVS L1, GDPR-level privacy.
22. **UI guidelines are absolute.** [ui-guidelines](../04-frontend/ui-guidelines.md) Part A (UI-1 – UI-12) overrides every other instruction for UI work, including role prompts and requests for a "modern" look. The owner's rule UI-1 forbids one-sided accent borders/stripes on any card or box. `web/apps/site/tests/ui-guidelines.test.ts` enforces the rules; an agent never weakens, skips, or deletes a check, and stops to ask the owner if a rule blocks the work.

## Conventions quick reference

| Area | Rule | Authoritative doc |
|---|---|---|
| C# naming | PascalCase types and members, camelCase locals, `_camelCase` fields, `I` prefix, `Async` suffix, file-scoped namespaces, `sealed` by default | [coding-standards](../02-backend/coding-standards.md) |
| Commands / queries | `<Verb><Entity>Command` + Handler + Validator side by side; `Get<Thing>Query` + Handler | [clean-architecture](../01-architecture/clean-architecture.md) |
| Tests | NUnit 4 + Shouldly; `Method_Scenario_ExpectedResult`; fakes over mocks | [testing-strategy](../05-quality/testing-strategy.md) |
| REST | `/api/v1`, camelCase JSON, ProblemDetails with `traceId` | [api-spec](../02-backend/api-spec.md) |
| Database | PostgreSQL 18, snake_case, `timestamptz` UTC, UUIDv7 ids | [schema](../03-database/schema.md) |
| Frontend | Next.js 16 App Router, Server Components by default, catalog only via `src/lib/catalog.ts`, content in `src/content/` | [nextjs-architecture](../04-frontend/nextjs-architecture.md) |
| **UI rules (absolute)** | Forbidden patterns, approved patterns, layout and review checklists | [ui-guidelines](../04-frontend/ui-guidelines.md) |
| Visual design | Tokens, type scale, components, patterns | [design-system](../04-frontend/design-system.md) |
| Pages | Route table and flows | [pages-and-flows](../04-frontend/pages-and-flows.md) |
| Stories | Gherkin with `@v1`/`@ui`/`@open` tags | [user-stories](../00-product/user-stories.md) |

## Commands

The .NET 10 SDK on the owner's machine is in `~/.dotnet`; prefix commands with `export PATH="$HOME/.dotnet:$PATH"` if `dotnet` is not found.

| Task | Command | Run from |
|---|---|---|
| Build backend | `dotnet build InflexHub.slnx` | repo root |
| Run backend tests | `dotnet test InflexHub.slnx` | repo root |
| Run the API | `dotnet run --project src/InflexHub.Api` | repo root |
| Add a migration | `dotnet ef migrations add <Name> --project src/InflexHub.Infrastructure --startup-project src/InflexHub.Api --output-dir Persistence/Migrations` | repo root |
| Apply migrations | `dotnet ef database update --project src/InflexHub.Infrastructure --startup-project src/InflexHub.Api` | repo root |
| Install frontend deps | `npm install` | `web/` |
| Run the site | `npm run dev` (port 3000) | `web/` |
| Frontend checks | `npm run typecheck && npm test && npm run build` | `web/` |
| Full stack | `docker compose up --build` | repo root |
| **Verify all** | `dotnet build InflexHub.slnx -warnaserror && dotnet test InflexHub.slnx && (cd web && npm run typecheck && npm test && npm run build)` | repo root |

## Build order

```
M0 Foundation ──► V1 Launch ──► V1.1 Launch hardening ──► V2 Admin + fully dynamic
```

### M0 — Foundation

| Aspect | Detail |
|---|---|
| Goal | Every layer builds, tests, and runs together |
| Backend | `Directory.Build.props`, `Directory.Packages.props`; remove template code; mediator + validation behaviour; ProblemDetails + slugs; Serilog; `IClock`; health endpoints |
| Database | `AppDbContext`, snake_case naming, first migration |
| Frontend | `web/` workspace, Next.js 16 site, tokens, fonts, layout shell |
| DevOps | Compose (db, migrate, api, site), Dockerfiles, `.env.example`, CI |
| Re-read first | [system-architecture](../01-architecture/system-architecture.md), [clean-architecture](../01-architecture/clean-architecture.md), [docker-and-environments](../06-devops/docker-and-environments.md) |
| Done when | [scope/m0.md](../00-product/scope/m0.md) exit criteria; tracker M0 rows `done` |

### V1 — Launch (partially dynamic)

| Aspect | Detail |
|---|---|
| Goal | Complete premium public site; all seven inquiry types stored with references; sales email and CSV export; demand views |
| Slices, in order | Design system components → Layout → Catalog + products pages → Industries → Forms (incl. brochure, partners) + site route handler → Inquiries API (domain → validator → handler → persistence → controller) → Sales email + CSV export → Company pages → SEO |
| Stories | Every `@v1` scenario in [user-stories](../00-product/user-stories.md) |
| Re-read first | [PRD §3](../00-product/PRD.md#3-functional-requirements), [api-spec](../02-backend/api-spec.md), [schema](../03-database/schema.md), [design-system](../04-frontend/design-system.md), [pages-and-flows](../04-frontend/pages-and-flows.md) |
| Done when | [scope/v1.md](../00-product/scope/v1.md) exit criteria; tracker V1 rows `done` |

### V1.1 — Launch hardening

Needs owner input first (Turnstile keys, domain, SMTP: OV-11, OV-12). See [scope/v1.1.md](../00-product/scope/v1.1.md).

### V2 — Admin panel and fully dynamic site

Starts with refining [scope/v2.md](../00-product/scope/v2.md) into stories, schema, and API before any code (golden rule 2).

## Slice workflow

**spec → domain → database → implementation → tests → review.**

1. **Spec.** Confirm the story scenarios, API shape, and schema exist in the docs. If not, write them first.
2. **Domain.** Entities, enums, value objects, domain exceptions, with unit tests.
3. **Database.** EF configuration and migration. Generate the SQL script (`dotnet ef migrations script`) and include it for owner review.
4. **Implementation.** Commands/queries, handlers, validators, controllers, Infrastructure implementations; frontend pages and components.
5. **Tests.** Every test class listed in the tracker row; every non-`@ui` scenario covered.
6. **Review.** Verify all green, PR checklist, tracker updated.

## Commits and branches

- `main` holds reviewed work. Feature work on `feature/<row-id>-<short-name>` (for example `feature/V1-4-products-filters`).
- Conventional commits: `feat(site): ...`, `feat(api): ...`, `fix: ...`, `docs: ...`, `test: ...`, `chore: ...`.
- One tracker row (or a small group of related rows) per commit or PR.
- Commit only when the owner asks.

## PR checklist

- [ ] The row is in the current version's scope; nothing from a later version slipped in.
- [ ] Verify all is green.
- [ ] Every listed test class exists and passes; mandatory tests untouched.
- [ ] New error slugs added to the error catalog; endpoints match api-spec and appear in OpenAPI.
- [ ] No personal data in logs, test names, fixtures, or the diff.
- [ ] No string-built SQL.
- [ ] Migration: SQL script included; never runs at startup.
- [ ] UI: [ui-guidelines](../04-frontend/ui-guidelines.md) Part D checklist done (no side stripes, no invented proof, approved patterns only), `ui-guidelines.test.ts` green, tokens only, keyboard walk-through, 360 / 768 / 1280 px checked, contrast AA, reduced motion respected.
- [ ] No invented company facts, numbers, testimonials, or logos.
- [ ] Docs updated where behaviour or contracts changed; ADR for cross-cutting decisions.
- [ ] Tracker row and summary counts updated.

### Definition of done

A tracker row is `done` when its code is committed, its test classes exist and pass, **Verify all** is green, the docs match the behaviour, and any required owner review is complete. A document is done when it follows the template (Status / PRD links / Purpose), links the PRD sections it relies on, and invents nothing.

### Asking questions and recording decisions

| Kind | Where the answer goes |
|---|---|
| Product behaviour, content, or value | [owner-validation](../00-product/owner-validation.md) row; when answered, the PRD or catalog, then the decisions table |
| Cross-cutting technical decision | New ADR with the next number in [01-architecture/adr/](../01-architecture/adr/) |
| New package or runtime | Ask the owner first; record approval in ADR 0001 |
| Local assumption in code | Commit or PR description |

Answers never live only in chat.

## Roles

| Role | Prompt | Owns |
|---|---|---|
| Product manager | [product-manager](prompts/product-manager.md) | PRD, catalog, scopes, stories, roadmap, tracker, owner validation |
| Principal software architect | [principal-software-architect](prompts/principal-software-architect.md) | Architecture docs, ADRs, cross-cutting contracts |
| Senior .NET engineer | [senior-dotnet-engineer](prompts/senior-dotnet-engineer.md) | API spec, coding standards, backend code |
| Database architect | [database-architect](prompts/database-architect.md) | Schema, migrations, indexes, demand views |
| Senior Next.js engineer | [senior-nextjs-engineer](prompts/senior-nextjs-engineer.md) | Next.js architecture, site code, route handler |
| Senior UI/UX designer | [senior-uiux-designer](prompts/senior-uiux-designer.md) | Design system, pages and flows, content structure |
| QA and security engineer | [qa-security-engineer](prompts/qa-security-engineer.md) | Testing strategy, security, review gate |
| DevOps engineer | [devops-engineer](prompts/devops-engineer.md) | Docker, environments, CI, backups |

## Where things live

| Path | Contents |
|---|---|
| [docs/README.md](../README.md) | Documentation index and reading order |
| [docs/00-product/](../00-product/) | PRD, product catalog, scopes, stories, roadmap, tracker, owner validation |
| [docs/01-architecture/](../01-architecture/) | System and clean architecture, ADRs |
| [docs/02-backend/](../02-backend/) | API spec + error catalog, coding standards |
| [docs/03-database/](../03-database/) | Schema, indexes, demand views |
| [docs/04-frontend/](../04-frontend/) | **UI guidelines (absolute)**, design system, pages and flows, Next.js architecture |
| [docs/05-quality/](../05-quality/) | Testing strategy, security |
| [docs/06-devops/](../06-devops/) | Docker and environments |
| [docs/agents/prompts/](prompts/) | Role prompts |
| `catalog/products.json` | Shared product catalog |
| `src/`, `tests/` | Backend projects and unit tests |
| `web/apps/site` | Public Next.js site |

## Open questions

1. CI provider: GitHub Actions assumed; confirm the repository host.
