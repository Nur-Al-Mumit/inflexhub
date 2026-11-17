/**
 * Tests for the aria-describedby merge helper (V1-1 review finding):
 * the Textarea merges Field ids with its counter id — never overwrites.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeDescribedBy } from "../src/lib/aria.ts";

test("mergeDescribedBy_multipleIds_joinsThemInOrder", () => {
  assert.equal(
    mergeDescribedBy("field-error", "counter"),
    "field-error counter",
  );
});

test("mergeDescribedBy_skipsUndefinedAndEmptyEntries", () => {
  assert.equal(
    mergeDescribedBy(undefined, "help", "", undefined, "counter"),
    "help counter",
  );
});

test("mergeDescribedBy_noValidIds_returnsUndefined", () => {
  assert.equal(mergeDescribedBy(), undefined);
  assert.equal(mergeDescribedBy(undefined, ""), undefined);
});

test("mergeDescribedBy_singleId_returnsItWithoutExtraSpaces", () => {
  assert.equal(mergeDescribedBy(undefined, "counter"), "counter");
});
