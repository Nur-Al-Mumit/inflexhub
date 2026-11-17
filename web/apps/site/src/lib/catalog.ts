/**
 * The only reader of catalog/products.json (ADR 0002, nextjs-architecture
 * rule 2). Server-side only: every page is statically generated at build
 * time, and the JSON never reaches the browser.
 *
 * Path resolution works in every execution context:
 * - `next dev` / `next build` / `node --test` with cwd = web/apps/site
 *   → <repo>/catalog/products.json (../../../catalog)
 * - the Docker runtime (next.config.ts anchors the tracing root at the repo
 *   root and the site Dockerfile mirrors it) with cwd = the standalone app
 *   → /app/catalog/products.json (./catalog)
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export type ProductAvailability = "available" | "custom" | "upcoming";

export type CatalogCategory = {
  readonly slug: string;
  readonly name: string;
};

export type CatalogIndustry = {
  readonly slug: string;
  readonly name: string;
};

export type CatalogProduct = {
  readonly slug: string;
  readonly name: string;
  readonly tagline: string;
  readonly category: string;
  readonly industries: readonly string[];
  readonly availability: ProductAvailability;
  readonly brochure: string | null;
};

export type Catalog = {
  readonly categories: readonly CatalogCategory[];
  readonly industries: readonly CatalogIndustry[];
  readonly products: readonly CatalogProduct[];
};

export type CategoryGroup = CatalogCategory & {
  /** Products of this category, in catalog order. */
  readonly products: readonly CatalogProduct[];
};

const CATALOG_FILENAME = "catalog/products.json";

function locateCatalog(): string {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  // src/lib → src → site → apps → web → repo root.
  const repoRoot = join(moduleDir, "..", "..", "..", "..");
  const candidates = [
    join(process.cwd(), CATALOG_FILENAME), // standalone runtime (/app/catalog)
    join(process.cwd(), "..", "..", "..", CATALOG_FILENAME), // web/apps/site
    join(repoRoot, CATALOG_FILENAME), // anywhere else
  ];
  const found = candidates.find((path) => existsSync(path));
  if (!found) {
    throw new Error(
      `catalog/products.json not found; looked in: ${candidates.join(", ")}`,
    );
  }
  return found;
}

let cached: Catalog | undefined;

/** Reads (and caches) the shared product catalog. */
export function getCatalog(): Catalog {
  if (!cached) {
    cached = JSON.parse(
      readFileSync(locateCatalog(), "utf8"),
    ) as Catalog;
  }
  return cached;
}

/**
 * Categories with their products, in catalog order — the shape the header
 * mega menu and the footer products column need.
 */
export function getCategoryGroups(): CategoryGroup[] {
  const { categories, products } = getCatalog();
  return categories.map((category) => ({
    ...category,
    products: products.filter(
      (product) => product.category === category.slug,
    ),
  }));
}

/** All products with the given availability (for "Coming soon" links). */
export function getProductsByAvailability(
  availability: ProductAvailability,
): readonly CatalogProduct[] {
  return getCatalog().products.filter(
    (product) => product.availability === availability,
  );
}
