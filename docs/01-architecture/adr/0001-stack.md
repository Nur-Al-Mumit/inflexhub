# ADR 0001 — Technology stack

Status: Accepted (2026-11-17)

## Context

InflexHub needs a stack that is long-term supported, well known to the owner, and strong for a fast static site plus a small, strict API. The owner's engineering standard is: .NET 10 LTS Clean Architecture API, Next.js 16, PostgreSQL 18, Docker, own UI components, unit tests, docs before code.

## Decision

InflexHub uses this stack: one public Next.js app in V1 (admin app in V2), one API, one database.

| Package | Project | Why |
|---|---|---|
| Cortex.Mediator | Application | Commands/queries through one pipeline (validation behaviour) |
| FluentValidation (+ DependencyInjectionExtensions) | Application | Input validation |
| Npgsql.EntityFrameworkCore.PostgreSQL | Infrastructure | PostgreSQL |
| EFCore.NamingConventions | Infrastructure | snake_case tables and columns |
| Microsoft.EntityFrameworkCore.Design | Api | Migrations tooling |
| Serilog.AspNetCore | Api | Structured logs |
| AspNetCore.HealthChecks.NpgSql | Api | Readiness check |
| Microsoft.AspNetCore.OpenApi | Api | OpenAPI document |
| MailKit | Infrastructure | Sales notification email over SMTP (owner decision 2026-11-17: lead visibility in V1) |
| NUnit 4, Shouldly, Microsoft.NET.Test.Sdk, coverlet | Tests | Unit tests |
| next, react, react-dom, lucide-react, typescript | Site | Frontend |
| axe-core, jsdom (dev only) | Site tests | Automated WCAG checks inside `node --test` without a browser (ADR 0005) |

Not used in V1: Mapster (small DTOs are mapped by hand; added when mapping grows), Hangfire (V1 emails use an in-process `Channel<T>` queue with a hosted service; Hangfire comes when durable jobs are needed), Redis (single instance).

## Consequences

Only LTS or latest-stable lines; one structure across backend and frontend. Anything outside this list needs owner approval.
