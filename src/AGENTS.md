# AGENTS.md — Backend (`src/`)

Loaded automatically when working in `src/`. Root rules in [../AGENTS.md](../AGENTS.md) still apply. Role prompt: [senior .NET engineer](../docs/agents/prompts/senior-dotnet-engineer.md).

## Layout

`InflexHub.Domain` ← `InflexHub.Application` ← `InflexHub.Infrastructure` ← `InflexHub.Api` (composition root). Domain references nothing.
Feature folders: `Application/Features/<Feature>/Commands|Queries/<UseCase>/` with Command, Handler, Validator side by side.

## Rules

1. Controllers only send a command or query through the mediator and return the result.
2. Every command has a FluentValidation validator (shape only). Business rules (BR-2, BR-3, BR-5, BR-11) live in handlers or the domain and throw typed exceptions mapped to error slugs ([api-spec](../docs/02-backend/api-spec.md#error-catalog)).
3. Time from `IClock`, never `DateTime.UtcNow`. Config from options classes, never literals.
4. EF Core only in Infrastructure; no `IQueryable` outside it; no raw SQL strings.
5. Never log names, emails, phones, messages, or IPs. Log reference and type.
6. Phones E.164, countries ISO 3166-1, currency ISO 4217, times UTC (ADR 0005).
7. Migrations never run at startup. After adding one, generate its SQL script for review.
8. Package versions only in `Directory.Packages.props`; only packages from ADR 0001.
9. Tests: `tests/InflexHub.Application.UnitTests`, NUnit 4 + Shouldly, `Method_Scenario_ExpectedResult`, fakes over mocks.

## Commands (repo root)

If `dotnet` is not found: `export PATH="$HOME/.dotnet:$PATH"`.
`dotnet build InflexHub.slnx -warnaserror` · `dotnet test InflexHub.slnx` · `dotnet run --project src/InflexHub.Api`
