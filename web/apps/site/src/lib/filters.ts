/**
 * Product filters (V1-4): pure functions shared by the products page (server)
 * and the filter bar (client). Filter state lives in the URL:
 * ?category=a,b&availability=upcoming&industry=retail&q=school — so links are
 * shareable and survive reload (US-2).
 */

import type { ProductAvailability } from "./catalog";

export type ProductFilters = {
  /** Selected category slugs (multi). */
  readonly categories: readonly string[];
  /** Selected availabilities (multi). */
  readonly availabilities: readonly ProductAvailability[];
  /** Selected industry slug, or null for all. */
  readonly industry: string | null;
  /** Free-text search over name and tagline. */
  readonly search: string;
};

export const emptyFilters: ProductFilters = {
  categories: [],
  availabilities: [],
  industry: null,
  search: "",
};

const AVAILABILITIES: readonly ProductAvailability[] = [
  "available",
  "custom",
  "upcoming",
];

function toList(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value.join(",") : value;
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

/** Reads filters from URL search params (Next.js searchParams shape). */
export function parseFilters(
  params: Record<string, string | string[] | undefined>,
): ProductFilters {
  return {
    categories: toList(params.category),
    availabilities: toList(params.availability).filter((value): value is ProductAvailability =>
      (AVAILABILITIES as readonly string[]).includes(value),
    ),
    industry: params.industry ? String(params.industry).toLowerCase() : null,
    search: params.q ? String(params.q).trim() : "",
  };
}

/** Serializes filters to a query string (no leading "?"); empty when no filter.
 * Commas stay literal so URLs stay readable and shareable. */
export function filtersToQuery(filters: ProductFilters): string {
  const parts = new URLSearchParams();
  if (filters.categories.length > 0) {
    parts.set("category", filters.categories.join(","));
  }
  if (filters.availabilities.length > 0) {
    parts.set("availability", filters.availabilities.join(","));
  }
  if (filters.industry) {
    parts.set("industry", filters.industry);
  }
  if (filters.search) {
    parts.set("q", filters.search);
  }
  return parts.toString().replaceAll("%2C", ",");
}

/** The product shape applyFilters needs — catalog products and slim client
 * copies both satisfy it. */
export type FilterableProduct = {
  readonly category: string;
  readonly availability: ProductAvailability;
  readonly industries: readonly string[];
  readonly name: string;
  readonly tagline: string;
};

/** Applies the filters to a product list. Empty filters return everything. */
export function applyFilters<T extends FilterableProduct>(
  products: readonly T[],
  filters: ProductFilters,
): T[] {
  const search = filters.search.toLowerCase();
  return products.filter(
    (product) =>
      (filters.categories.length === 0 ||
        filters.categories.includes(product.category)) &&
      (filters.availabilities.length === 0 ||
        filters.availabilities.includes(product.availability)) &&
      (filters.industry === null ||
        product.industries.includes(filters.industry)) &&
      (search === "" ||
        product.name.toLowerCase().includes(search) ||
        product.tagline.toLowerCase().includes(search)),
  );
}

/** True when any filter is active (drives the empty state's "Clear filters"). */
export function hasActiveFilters(filters: ProductFilters): boolean {
  return (
    filters.categories.length > 0 ||
    filters.availabilities.length > 0 ||
    filters.industry !== null ||
    filters.search !== ""
  );
}
