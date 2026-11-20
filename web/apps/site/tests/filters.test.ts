/**
 * Product filter tests (V1-4, mandatory: category / industry / availability /
 * search filters and URL round-trip). Scenarios mirror US-2.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applyFilters,
  emptyFilters,
  filtersToQuery,
  hasActiveFilters,
  parseFilters,
} from "../src/lib/filters.ts";
import { getCatalog } from "../src/lib/catalog.ts";

const products = getCatalog().products;

test("parseFilters_reads_url_params", () => {
  const filters = parseFilters({
    category: "Education",
    availability: "upcoming",
    industry: "retail",
    q: "  school ",
  });
  assert.deepEqual(filters.categories, ["education"]);
  assert.deepEqual(filters.availabilities, ["upcoming"]);
  assert.equal(filters.industry, "retail");
  assert.equal(filters.search, "school");
});

test("parseFilters_drops_invalid_availability_and_defaults", () => {
  const filters = parseFilters({ availability: "upcoming,sold,nope" });
  assert.deepEqual(filters.availabilities, ["upcoming"]);

  const empty = parseFilters({});
  assert.deepEqual(empty, emptyFilters);
  assert.equal(hasActiveFilters(empty), false);
});

test("applyFilters_availability_upcoming_returns_only_upcoming", () => {
  const result = applyFilters(products, {
    ...emptyFilters,
    availabilities: ["upcoming"],
  });
  assert.ok(result.length > 0);
  assert.ok(result.every((p) => p.availability === "upcoming"));
});

test("applyFilters_category_education_plus_search_school_finds_school_system", () => {
  const result = applyFilters(products, {
    ...emptyFilters,
    categories: ["education"],
    search: "school",
  });
  assert.deepEqual(
    result.map((p) => p.slug),
    ["school-management"],
  );
});

test("applyFilters_industry_and_search_over_tagline", () => {
  const byIndustry = applyFilters(products, {
    ...emptyFilters,
    industry: "healthcare",
  });
  assert.ok(byIndustry.length > 0);
  assert.ok(byIndustry.every((p) => p.industries.includes("healthcare")));

  const byTagline = applyFilters(products, {
    ...emptyFilters,
    search: "point-of-sale",
  });
  assert.deepEqual(
    byTagline.map((p) => p.slug),
    ["pos"],
  );
});

test("applyFilters_empty_filters_return_everything", () => {
  assert.equal(applyFilters(products, emptyFilters).length, products.length);
});

test("filtersToQuery_round_trips_through_parseFilters", () => {
  const filters = {
    categories: ["education", "healthcare"],
    availabilities: ["available", "custom"],
    industry: "retail",
    search: "school",
  } as const;

  const query = filtersToQuery(filters);
  assert.equal(
    query,
    "category=education,healthcare&availability=available,custom&industry=retail&q=school",
  );
  // Round trip: parsing the serialized query yields the same filters.
  assert.deepEqual(
    parseFilters(Object.fromEntries(new URLSearchParams(query))),
    {
      categories: ["education", "healthcare"],
      availabilities: ["available", "custom"],
      industry: "retail",
      search: "school",
    },
  );

  // Empty filters serialize to an empty query and back.
  assert.equal(filtersToQuery(emptyFilters), "");
  assert.deepEqual(
    parseFilters(Object.fromEntries(new URLSearchParams(""))),
    emptyFilters,
  );
});

test("applyFilters_no_match_returns_empty_and_flag_active", () => {
  const filters = { ...emptyFilters, search: "quantum-mainframe" };
  assert.equal(hasActiveFilters(filters), true);
  assert.deepEqual(applyFilters(products, filters), []);
});
