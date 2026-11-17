# Docker and environments

Status: Draft

## Services (`docker-compose.yml`)

| Service | Image | Port (dev) | Notes |
|---|---|---|---|
| `db` | `postgres:18` | 5432 | Volume `pgdata`; health check `pg_isready` |
| `migrate` | built from `src/InflexHub.Api/Dockerfile` (`migrator` stage) | — | Runs the EF Core migration bundle once, then exits |
| `api` | built from `src/InflexHub.Api/Dockerfile` | 8080 | Waits for `migrate`; `ASPNETCORE_ENVIRONMENT` |
| `site` | built from `web/apps/site/Dockerfile` | 3000 | Next.js standalone on `node:26-alpine` |

Build context is the repository root for both images (both need `catalog/products.json`).

## Environments

| Name | Where | Notes |
|---|---|---|
| Local | `npm run dev` + `dotnet run` + local or Docker PostgreSQL | API on :5080 when run with `dotnet run` |
| Docker local | `docker compose up --build` | Everything in containers |
| Production (V1.1) | One VPS behind Cloudflare | Only `site` published (via reverse proxy); `api` and `db` internal |

## Configuration

| Key | Service | Notes |
|---|---|---|
| `ConnectionStrings__Default` | api, migrate | Npgsql connection string |
| `Site__ApiKey` | api | Same value as the site's `SITE_API_KEY` |
| `Privacy__IpHashSalt` | api | Random secret |
| `RateLimits__Inquiries__PermitLimit` / `__WindowMinutes` | api | Default 5 / 10 (BR-4, OV-8) |
| `Catalog__Path` | api | Default `catalog/products.json` next to the binary |
| `Admin__ExportKey` | api | Random secret; export disabled (404) when empty |
| `Email__Enabled`, `Email__Host`, `Email__Port`, `Email__Username`, `Email__Password`, `Email__UseStartTls`, `Email__From`, `Email__SalesRecipients` | api | Sales notification (OV-12); disabled when not set |
| `API_BASE_URL`, `SITE_API_KEY`, `NEXT_PUBLIC_SITE_URL` | site | See nextjs-architecture |
