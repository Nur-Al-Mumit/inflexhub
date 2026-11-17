# Clean Architecture

Status: Draft
PRD links: 5.1, 5.3

## Projects and dependencies

```
InflexHub.Api ──────► InflexHub.Infrastructure ──► InflexHub.Application ──► InflexHub.Domain
      └─────────────────────────────────────────────► InflexHub.Application
```

| Project | Responsibility | Must not contain |
|---|---|---|
| `InflexHub.Domain` | Entities (`Inquiry`, `InquiryProduct`), enums (`InquiryType`, `InquiryStatus`, `Availability`), value objects (`InquiryReference`), domain exceptions | EF Core, HTTP, anything external |
| `InflexHub.Application` | Commands, queries, handlers, validators, DTOs; contracts in `Contracts/` (`IInquiryRepository`, `ICatalog`, `IClock`, `IReferenceGenerator`, `IUnitOfWork`) | EF Core, SQL, controllers |
| `InflexHub.Infrastructure` | `AppDbContext`, migrations, repositories, `JsonCatalog` (reads `catalog/products.json`), `SystemClock`, `IpHasher` | Business rules, HTTP |
| `InflexHub.Api` | Composition root, controllers, middleware (ProblemDetails, site key), rate limiter, health checks, OpenAPI | Business logic, direct `DbContext` use |

## Feature folders

```
InflexHub.Application/
  Features/
    Inquiries/
      Commands/SubmitInquiry/   SubmitInquiryCommand.cs, ...Handler.cs, ...Validator.cs, SubmitInquiryResult.cs
    Catalog/
      Queries/GetProducts/      GetProductsQuery.cs, ...Handler.cs, ProductDto.cs
  Contracts/
  Common/                       ValidationBehavior, exceptions mapped to slugs
InflexHub.Domain/
  Features/Inquiries/           Inquiry.cs, InquiryProduct.cs, InquiryType.cs, ...
  Features/Catalog/             Availability.cs, CatalogProduct.cs
```

## Rules

1. Controllers translate HTTP into a command or query, send it through the mediator, and return the result. Nothing else.
2. Every command has a FluentValidation validator, executed by a pipeline behaviour before the handler.
3. Validators check input shape (required, length, format). Business rules (BR-2, BR-3, BR-5) live in the handler or domain and throw typed exceptions mapped to error slugs.
4. Repositories return domain entities, never `IQueryable`.
5. Configuration values (rate limit numbers, site key) come from options classes, never literals in handlers.
