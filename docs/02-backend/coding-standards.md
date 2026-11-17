# Coding standards

Status: Draft

## C#

| Rule | Example |
|---|---|
| File-scoped namespaces, one type per file | `namespace InflexHub.Application.Features.Inquiries.Commands.SubmitInquiry;` |
| PascalCase types and members, camelCase locals, `_camelCase` private fields, `I` prefix for interfaces, `Async` suffix | `SubmitInquiryHandler.Handle`, `_repository` |
| Nullable enabled; warnings as errors in CI | `Directory.Build.props` |
| Records for commands, queries, DTOs | `public sealed record SubmitInquiryCommand(...)` |
| `sealed` by default for classes | |
| No business literals in handlers | Values from options or the catalog |
| Time from `IClock`, never `DateTime.UtcNow` | |
| Never log personal data | No email, phone, name, message, IP in logs; log the reference and type |

## Names

`<Verb><Entity>Command` + `Handler` + `Validator` side by side; `Get<Thing>Query` + `Handler`.

## Tests

- NUnit 4 + Shouldly, one test project `InflexHub.Application.UnitTests` mirroring `Features/`.
- Test names: `Method_Scenario_ExpectedResult` (e.g. `Handle_DuplicateInterest_ReturnsExistingReference`).
- Fakes over mocks: in-memory `FakeInquiryRepository`, `FixedClock`, `StaticCatalog`.

## TypeScript / React

| Rule | Detail |
|---|---|
| Strict TypeScript, no `any` | `tsconfig` strict |
| Server Components by default | `"use client"` only for interactive parts (filters, forms, menus) |
| One CSS Module per component | Tokens only (`var(--color-...)`, `var(--space-...)`), no raw hex in modules |
| Content lives in `src/content/` | Components never hard-code marketing copy |
| Accessibility | Real elements (`button`, `a`, `label`), visible focus, `aria-*` only when native semantics fall short |

## Commits

Conventional commits: `feat(site): products filter`, `feat(api): submit inquiry`, `docs: scope v1`, `chore: docker compose`.
