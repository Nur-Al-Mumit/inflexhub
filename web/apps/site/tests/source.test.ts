/**
 * Source tracking tests (pages-and-flows "Source tracking", US-12): the pure
 * helpers behind the sessionStorage capture — utm_* from the landing URL,
 * referrer, first-load-only semantics, and the source object attached to
 * every submission.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildSource,
  captureSourceFrom,
  isEmptySource,
} from "../src/lib/source.ts";

test("captureSourceFrom_reads_utm_params_and_referrer", () => {
  const stored = captureSourceFrom(
    "?utm_source=facebook&utm_campaign=launch&utm_medium=&other=1",
    "https://www.google.com/",
  );
  assert.deepEqual(stored, {
    referrer: "https://www.google.com/",
    utmSource: "facebook",
    utmMedium: null, // empty values are dropped, not stored as ""
    utmCampaign: "launch",
    utmTerm: null,
    utmContent: null,
  });
});

test("captureSourceFrom_without_utm_stores_only_the_referrer", () => {
  const stored = captureSourceFrom("/products?category=education", "");
  assert.deepEqual(stored, {
    referrer: null,
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmTerm: null,
    utmContent: null,
  });
  assert.equal(isEmptySource(stored), true);
});

test("isEmptySource_false_when_anything_was_captured", () => {
  assert.equal(isEmptySource(captureSourceFrom("?utm_source=fb", "")), false);
  assert.equal(isEmptySource(captureSourceFrom("", "https://news.example/")), false);
});

test("buildSource_attaches_the_form_page_path", () => {
  const stored = captureSourceFrom("?utm_source=facebook&utm_campaign=launch", "https://x/");
  const source = buildSource(stored, "/upcoming");
  assert.deepEqual(source, {
    pagePath: "/upcoming",
    referrer: "https://x/",
    utmSource: "facebook",
    utmMedium: null,
    utmCampaign: "launch",
    utmTerm: null,
    utmContent: null,
  });
});

test("buildSource_without_stored_landing_values_sends_nulls", () => {
  assert.deepEqual(buildSource(null, "/request-demo"), {
    pagePath: "/request-demo",
    referrer: null,
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmTerm: null,
    utmContent: null,
  });
});
