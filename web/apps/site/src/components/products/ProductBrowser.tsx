"use client";

/**
 * ProductBrowser (V1-4): the products page filter bar and results grid
 * (design-system §7 filter bar). Filter state lives in the URL — chips toggle
 * category/availability, a select filters industry, the search box filters
 * name and tagline; the result count is announced politely (aria-live) and an
 * empty state offers "Clear filters" plus a custom-software link (US-2).
 */

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomSoftwareTile } from "@/components/products/CustomSoftwareTile";
import { ProductCard } from "@/components/products/ProductCard";
import { CardGrid } from "@/components/ui/CardGrid";
import { stagger } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ChipGroup } from "@/components/ui/ChipGroup";
import { Select } from "@/components/ui/Select";
import { TextInput } from "@/components/ui/TextInput";
import type { ProductAvailability } from "@/lib/catalog";
import {
  applyFilters,
  emptyFilters,
  filtersToQuery,
  parseFilters,
  type ProductFilters,
} from "@/lib/filters";
import styles from "./ProductBrowser.module.css";

export type BrowserProduct = {
  readonly slug: string;
  readonly name: string;
  readonly tagline: string;
  readonly availability: ProductAvailability;
  readonly industries: readonly string[];
};

export type ProductBrowserProps = {
  readonly products: readonly (BrowserProduct & { readonly category: string; readonly categoryName: string })[];
  readonly categories: readonly { readonly slug: string; readonly name: string }[];
  readonly industries: readonly { readonly slug: string; readonly name: string }[];
};

const availabilityChips = [
  { value: "available", label: "Ready to use" },
  { value: "custom", label: "Built on request" },
  { value: "upcoming", label: "Coming soon" },
] as const;

export function ProductBrowser({
  products,
  categories,
  industries,
}: ProductBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseFilters(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );

  const push = useCallback(
    (next: ProductFilters) => {
      const query = filtersToQuery(next);
      router.replace(query ? `/products?${query}` : "/products", {
        scroll: false,
      });
    },
    [router],
  );

  const toggleValue = (list: readonly string[], value: string) =>
    list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];

  const visible = useMemo(
    () => applyFilters(products, filters),
    [products, filters],
  );

  const count = visible.length;

  return (
    <div>
      {/* The results region's heading: the page jumps from the hero h1 to
          product-card h3s otherwise (axe heading-order). */}
      <h2 className="visually-hidden">Products</h2>
      <div className={styles.bar}>
        <ChipGroup
          aria-label="Filter by category"
          chips={categories.map((category) => ({
            value: category.slug,
            label: category.name,
          }))}
          pressed={filters.categories}
          onChange={(next) => push({ ...filters, categories: next })}
        />
        <ChipGroup
          aria-label="Filter by availability"
          chips={availabilityChips}
          pressed={filters.availabilities}
          onChange={(next) =>
            push({
              ...filters,
              availabilities: next as ProductAvailability[],
            })
          }
        />
        <div className={styles.controls}>
          <label className={styles.controlLabel} htmlFor="industry-filter">
            Industry
          </label>
          <Select
            id="industry-filter"
            value={filters.industry ?? ""}
            onChange={(event) =>
              push({
                ...filters,
                industry: event.target.value || null,
              })
            }
          >
            <option value="">All industries</option>
            {industries.map((industry) => (
              <option key={industry.slug} value={industry.slug}>
                {industry.name}
              </option>
            ))}
          </Select>
          <label className={styles.controlLabel} htmlFor="product-search">
            Search
          </label>
          <TextInput
            id="product-search"
            type="search"
            placeholder="Search products…"
            value={filters.search}
            onChange={(event) => push({ ...filters, search: event.target.value })}
          />
        </div>
      </div>

      <p className={styles.count} aria-live="polite">
        {count} {count === 1 ? "product" : "products"}
      </p>

      {count > 0 ? (
        <CardGrid count={visible.length + 1}>
          {visible.map((product, index) => (
            <li key={product.slug} className={styles.item} style={stagger(index % 4)}>
              <ProductCard
                slug={product.slug}
                name={product.name}
                tagline={product.tagline}
                category={product.categoryName}
                availability={product.availability}
              />
            </li>
          ))}
          <li className={styles.item} style={stagger(visible.length % 4)}>
            <CustomSoftwareTile />
          </li>
        </CardGrid>
      ) : (
        <div className={styles.empty}>
          <h2 className={styles.emptyTitle}>No products match your filters</h2>
          <p className={styles.emptyText}>
            Try removing a filter or clearing the search. If nothing fits,
            InflexHub can build what your organisation needs.
          </p>
          <div className={styles.emptyActions}>
            <Button onClick={() => push(emptyFilters)}>Clear filters</Button>
            <ButtonLink href="/custom-software" variant="outline">
              Describe custom software
            </ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}
