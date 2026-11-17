# ADR 0002 — Static product catalog in V1, shared by site and API

Status: Accepted (2026-11-17)

## Context

V1 is "partially dynamic" (owner decision). Products must render statically for speed and SEO, but the API must also know the products to validate inquiries and compute demand per product. Two separate lists would drift.

## Decision

- `catalog/products.json` at the repository root holds product identity: slug, name, short description, category, industries, availability. It also lists categories and industries.
- The **site** imports it at build time through one module (`src/lib/catalog.ts`). Rich marketing copy is kept in `src/content/products/*.ts`, keyed by slug; a test fails if a catalog slug has no content or content has no catalog entry.
- The **API** reads the same file through `ICatalog` (`JsonCatalog` in Infrastructure; the file is copied into the API's output and Docker image).
- There is **no products table in V1**. Inquiries store the slug plus a snapshot of name, category, and availability (BR-7).

## Consequences

- One edit + redeploy changes the catalog everywhere.
- V2 seeds a `products` table from the same file and swaps `JsonCatalog` for a database implementation; slugs remain the keys, so V1 inquiries join cleanly.
