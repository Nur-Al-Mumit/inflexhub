# AGENTS.md — InflexHub

Short operating manual for anyone (human or AI) changing this repository, loaded automatically by coding agents. Keep it short.

- Full manual (read before build work): [docs/agents/operating-manual.md](docs/agents/operating-manual.md). If this file and the manual disagree, fix this file.
- Role prompts: [docs/agents/prompts/](docs/agents/prompts/).
- Area rules load automatically when you work in that folder: [src/AGENTS.md](src/AGENTS.md) (backend), `web/apps/site/AGENTS.md` (frontend, created in M0).

## Read first

1. [docs/00-product/PRD.md](docs/00-product/PRD.md) — source of truth.
2. The current version's scope: [docs/00-product/scope/v1.md](docs/00-product/scope/v1.md). Build only that scope.
3. [docs/00-product/tracker.md](docs/00-product/tracker.md) — pick a row; update it in the same commit.

## Golden rules

1. Docs before code. If behaviour changes, update the PRD (or add an ADR) in the same change.
2. Never invent business rules, prices, client numbers, testimonials, or logos. Unknown → [owner-validation](docs/00-product/owner-validation.md).
3. Dependency rule: Api → Application, Infrastructure → Application, Application → Domain. Domain references nothing.
4. Feature folders (`Features/<Feature>/Commands|Queries/`), thin controllers, one validator per command.
5. Errors are ProblemDetails with a slug from the [error catalog](docs/02-backend/api-spec.md#error-catalog).
6. No personal data in logs. IPs only as salted hashes.
7. Product slugs never change. The catalog is `catalog/products.json`, read by both site and API.
8. Frontend: tokens and own components from the [design system](docs/04-frontend/design-system.md); no UI libraries; CSS Modules.
9. Packages: only those in [ADR 0001](docs/01-architecture/adr/0001-stack.md); ask before adding any other.
10. Bangladesh first, international standards ([ADR 0005](docs/01-architecture/adr/0005-bangladesh-first-international-standards.md)): BDT / +880 / `BD` / Asia/Dhaka defaults; E.164, ISO codes, UTC times, WCAG 2.2 AA, OWASP ASVS L1.
11. **UI guidelines are absolute:** every UI change follows [docs/04-frontend/ui-guidelines.md](docs/04-frontend/ui-guidelines.md). Never: one-sided accent borders/stripes on cards, invented proof (testimonials, logos, client numbers), raw colours, gradient text, emoji icons, UI kits or animation libraries, glassmorphism, bouncy motion. `web/apps/site/tests/ui-guidelines.test.ts` enforces it; never weaken or skip it.

## Commands

| Task | Command | From |
|---|---|---|
| Build backend | `dotnet build InflexHub.slnx` | repo root |
| Backend tests | `dotnet test InflexHub.slnx` | repo root |
| Run API | `dotnet run --project src/InflexHub.Api` | repo root |
| Add migration | `dotnet ef migrations add <Name> --project src/InflexHub.Infrastructure --startup-project src/InflexHub.Api --output-dir Persistence/Migrations` | repo root |
| Frontend install / dev | `npm install` · `npm run dev` | `web/` |
| Frontend checks | `npm run typecheck && npm test && npm run build` | `web/` |
| Full stack | `docker compose up --build` | repo root |
| **Verify all** | `dotnet build InflexHub.slnx -warnaserror && dotnet test InflexHub.slnx && (cd web && npm run typecheck && npm test && npm run build)` | repo root |

## Definition of done

Scope row implemented · UI guidelines respected (Part D checklist) · listed tests exist and pass · Verify all green · docs and tracker updated · no personal data logged · keyboard and 360 px check for UI changes.
