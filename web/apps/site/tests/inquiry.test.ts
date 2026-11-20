/**
 * Inquiry rule tests (V1-7 – V1-10, V1-23, V1-24, mandatory per tracker):
 * the per-type field table, lengths (BR-8), enums, product eligibility
 * (BR-2), phone normalisation to E.164 (BR-10), the demo date window, and
 * buildPayload's request body — mirroring the api-spec
 * "Inquiry fields per type" table exactly. Scenarios mirror US-5, US-6,
 * US-7, US-9, US-12, US-13, US-14.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  REFERENCE_PATTERN,
  budgetRangeValues,
  buildPayload,
  companySizeValues,
  eligibleProducts,
  fieldRequirement,
  isProductEligible,
  isValidEmail,
  isValidPreferredDate,
  limits,
  normalisePhone,
  partnerTypeValues,
  preferredTimeValues,
  productCountRange,
  timelineValues,
  validateInquiry,
  type InquiryValues,
} from "../src/lib/inquiry.ts";
import { getCatalog } from "../src/lib/catalog.ts";
import {
  budgetOptions,
  companySizeOptions,
  countryOptions,
  partnerTypeOptions,
  timelineOptions,
  timeWindowOptions,
} from "../src/content/form-options.ts";

const catalog = getCatalog();
const products = catalog.products.map((product) => ({
  slug: product.slug,
  availability: product.availability,
  brochure: product.brochure,
}));
const industrySlugs = catalog.industries.map((industry) => industry.slug);

const NOW = new Date("2026-11-20T09:30:00Z");

function validate(type: Parameters<typeof validateInquiry>[0], values: InquiryValues) {
  return validateInquiry(type, values, { products, industries: industrySlugs, now: NOW });
}

const validBase: Record<string, InquiryValues> = {
  demo: {
    fullName: "Ayesha Rahman",
    email: "ayesha@acme.com",
    phone: "01711000000",
    company: "Acme Retail Ltd",
    productSlugs: ["pos"],
    consent: true,
  },
  quote: {
    fullName: "Ayesha Rahman",
    email: "ayesha@acme.com",
    phone: "01711000000",
    company: "Acme Retail Ltd",
    productSlugs: ["pos", "inventory"],
    consent: true,
  },
  custom_software: {
    fullName: "Ayesha Rahman",
    email: "ayesha@acme.com",
    phone: "01711000000",
    company: "Acme Retail Ltd",
    message: "We need a grain silo tracking system for three depots.",
    consent: true,
  },
  contact: {
    fullName: "Ayesha Rahman",
    email: "ayesha@acme.com",
    subject: "Partnership question",
    message: "Do you work with resellers in Chattogram?",
    consent: true,
  },
  product_interest: {
    fullName: "Ayesha Rahman",
    email: "ayesha@acme.com",
    productSlugs: ["lms"],
    consent: true,
  },
  brochure_download: {
    fullName: "Ayesha Rahman",
    email: "ayesha@acme.com",
    productSlugs: ["pos"],
    consent: true,
  },
  partner: {
    fullName: "Ayesha Rahman",
    email: "ayesha@acme.com",
    phone: "01711000000",
    company: "Acme Retail Ltd",
    country: "BD",
    partnerType: "reseller",
    region: "Chattogram",
    productSlugs: ["pos", "inventory"],
    consent: true,
  },
};

// A catalog where "pos" has a brochure, for brochure eligibility
// (the real catalog has none yet, OV-16).
const brochureContext = {
  products: products.map((product) =>
    product.slug === "pos" ? { ...product, brochure: "pos.pdf" } : product,
  ),
  industries: industrySlugs,
  now: NOW,
};

// ---------- The api-spec table ----------

test("fieldRequirement_mirrors_the_api_spec_table", () => {
  // Required everywhere
  for (const type of ["demo", "quote", "custom_software", "contact", "product_interest", "brochure_download", "partner"] as const) {
    assert.equal(fieldRequirement(type, "fullName"), "required", `${type} fullName`);
    assert.equal(fieldRequirement(type, "email"), "required", `${type} email`);
  }
  // The surprising cells from the table
  assert.equal(fieldRequirement("demo", "phone"), "required");
  assert.equal(fieldRequirement("contact", "phone"), "optional");
  assert.equal(fieldRequirement("product_interest", "phone"), "optional");
  assert.equal(fieldRequirement("partner", "phone"), "required");
  assert.equal(fieldRequirement("partner", "country"), "required");
  assert.equal(fieldRequirement("demo", "country"), "optional");
  assert.equal(fieldRequirement("partner", "industry"), "ignored");
  assert.equal(fieldRequirement("contact", "companySize"), "ignored");
  assert.equal(fieldRequirement("product_interest", "jobTitle"), "ignored");
  assert.equal(fieldRequirement("brochure_download", "message"), "ignored");
  assert.equal(fieldRequirement("contact", "subject"), "required");
  assert.equal(fieldRequirement("demo", "subject"), "ignored");
  assert.equal(fieldRequirement("custom_software", "message"), "required");
  assert.equal(fieldRequirement("demo", "message"), "optional");
  assert.equal(fieldRequirement("partner", "region"), "optional");
  assert.equal(fieldRequirement("demo", "region"), "ignored");
  assert.equal(fieldRequirement("quote", "userCount"), "optional");
  assert.equal(fieldRequirement("demo", "userCount"), "ignored");
  assert.equal(fieldRequirement("quote", "budgetRange"), "optional");
  assert.equal(fieldRequirement("partner", "budgetRange"), "ignored");
  assert.equal(fieldRequirement("demo", "preferredDate"), "optional");
  assert.equal(fieldRequirement("quote", "preferredDate"), "ignored");
  assert.equal(fieldRequirement("demo", "timeZone"), "optional");
});

test("validateInquiry_valid_submission_of_every_type_has_no_errors", () => {
  // brochure_download needs a product that has one (see the eligibility test below)
  const brochureErrors = validateInquiry(
    "brochure_download",
    validBase.brochure_download!,
    brochureContext,
  );
  assert.deepEqual(brochureErrors, {});
  for (const [type, values] of Object.entries(validBase)) {
    if (type === "brochure_download") continue;
    assert.deepEqual(validate(type as "demo", values!), {}, `${type} should be valid`);
  }
});

// ---------- Required / optional / ignored behaviour ----------

test("validateInquiry_demo_missing_required_fields_errors_each_one", () => {
  const errors = validate("demo", { consent: true });
  for (const field of ["fullName", "email", "phone", "company", "productSlugs"]) {
    assert.ok(errors[field], `${field} error expected`);
  }
  assert.equal(errors.consent, undefined);
});

test("validateInquiry_missing_consent_is_an_error_for_every_type", () => {
  for (const [type, values] of Object.entries(validBase)) {
    const errors =
      type === "brochure_download"
        ? validateInquiry("brochure_download", { ...values!, consent: false }, brochureContext)
        : validate(type as "demo", { ...values!, consent: false });
    assert.ok(errors.consent, `${type} consent error expected`);
  }
});

test("validateInquiry_optional_phone_empty_is_fine_for_interest", () => {
  const errors = validate("product_interest", validBase.product_interest!);
  assert.equal(errors.phone, undefined);
});

test("validateInquiry_ignored_fields_do_not_block_submission", () => {
  // A message on a brochure download and an industry on a partner application
  // are ignored by the api-spec: they must not produce errors.
  const brochure = validateInquiry(
    "brochure_download",
    { ...validBase.brochure_download!, message: "x" },
    brochureContext,
  );
  assert.equal(brochure.message, undefined);
  const partner = validate("partner", { ...validBase.partner!, industry: "not-a-slug" });
  assert.equal(partner.industry, undefined);
});

test("validateInquiry_industry_must_be_a_catalog_slug_or_other", () => {
  const bad = validate("demo", { ...validBase.demo!, industry: "space-mining" });
  assert.ok(bad.industry);
  const other = validate("demo", { ...validBase.demo!, industry: "other" });
  assert.equal(other.industry, undefined);
});

test("validateInquiry_partner_type_required", () => {
  const errors = validate("partner", { ...validBase.partner!, partnerType: "" });
  assert.ok(errors.partnerType, "US-14: field error on partnerType");
});

// ---------- Lengths (BR-8) ----------

test("validateInquiry_name_length_2_to_120", () => {
  assert.ok(validate("demo", { ...validBase.demo!, fullName: "A" }).fullName);
  assert.ok(validate("demo", { ...validBase.demo!, fullName: "A".repeat(121) }).fullName);
  assert.equal(validate("demo", { ...validBase.demo!, fullName: "Ay" }).fullName, undefined);
  assert.equal(validate("demo", { ...validBase.demo!, fullName: "A".repeat(120) }).fullName, undefined);
});

test("validateInquiry_company_and_job_title_lengths", () => {
  assert.ok(validate("demo", { ...validBase.demo!, company: "A".repeat(161) }).company);
  assert.ok(validate("demo", { ...validBase.demo!, jobTitle: "A".repeat(121) }).jobTitle);
});

test("validateInquiry_custom_message_min_30_chars", () => {
  // US-7: a 12-character summary is a field error on message
  const short = validate("custom_software", { ...validBase.custom_software!, message: "12 characters" });
  assert.ok(short.message, "US-7: field error on message");
  const edge = validate("custom_software", {
    ...validBase.custom_software!,
    message: "A".repeat(limits.customMessageMin),
  });
  assert.equal(edge.message, undefined);
});

test("validateInquiry_contact_message_min_10_chars", () => {
  assert.ok(validate("contact", { ...validBase.contact!, message: "too short" }).message);
});

test("validateInquiry_subject_3_to_160", () => {
  assert.ok(validate("contact", { ...validBase.contact!, subject: "ab" }).subject);
  assert.ok(validate("contact", { ...validBase.contact!, subject: "A".repeat(161) }).subject);
});

test("validateInquiry_user_count_bounds_1_to_100000", () => {
  assert.ok(validate("quote", { ...validBase.quote!, userCount: "0" }).userCount);
  assert.ok(validate("quote", { ...validBase.quote!, userCount: "100001" }).userCount);
  assert.ok(validate("quote", { ...validBase.quote!, userCount: "1.5" }).userCount);
  assert.equal(validate("quote", { ...validBase.quote!, userCount: "25" }).userCount, undefined);
  assert.equal(validate("quote", { ...validBase.quote!, userCount: "100000" }).userCount, undefined);
});

// ---------- Enums ----------

test("validateInquiry_enum_fields_reject_unknown_values", () => {
  const demo = validate("demo", {
    ...validBase.demo!,
    companySize: "5-9",
    preferredTime: "night",
  });
  assert.ok(demo.companySize);
  assert.ok(demo.preferredTime);

  // budgetRange and timeline are quote/custom fields (ignored for demo)
  const quote = validate("quote", {
    ...validBase.quote!,
    budgetRange: "10l-20l",
    timeline: "someday",
  });
  assert.ok(quote.budgetRange);
  assert.ok(quote.timeline);

  const ok = validate("demo", {
    ...validBase.demo!,
    companySize: "51-200",
    preferredTime: "morning",
  });
  assert.equal(ok.companySize, undefined);
  assert.equal(ok.preferredTime, undefined);
});

test("formOptions_values_match_the_inquiry_enums_exactly", () => {
  assert.deepEqual(budgetOptions.map((o) => o.value), [...budgetRangeValues]);
  assert.deepEqual(companySizeOptions.map((o) => o.value), [...companySizeValues]);
  assert.deepEqual(timelineOptions.map((o) => o.value), [...timelineValues]);
  assert.deepEqual(partnerTypeOptions.map((o) => o.value), [...partnerTypeValues]);
  assert.deepEqual(timeWindowOptions.map((o) => o.value), [...preferredTimeValues]);
});

test("countryOptions_iso_alpha2_unique_with_bangladesh_first", () => {
  assert.equal(countryOptions[0]?.value, "BD");
  const codes = countryOptions.map((option) => option.value);
  assert.ok(codes.every((code) => /^[A-Z]{2}$/.test(code)), "ISO 3166-1 alpha-2 only");
  assert.equal(new Set(codes).size, codes.length, "no duplicates");
});

// ---------- Product eligibility (BR-2) ----------

test("isProductEligible_demo_only_available", () => {
  assert.equal(isProductEligible("demo", { slug: "pos", availability: "available", brochure: null }), true);
  assert.equal(isProductEligible("demo", { slug: "erp", availability: "custom", brochure: null }), false);
  assert.equal(isProductEligible("demo", { slug: "lms", availability: "upcoming", brochure: null }), false);
});

test("isProductEligible_quote_available_or_custom", () => {
  assert.equal(isProductEligible("quote", { slug: "pos", availability: "available", brochure: null }), true);
  assert.equal(isProductEligible("quote", { slug: "erp", availability: "custom", brochure: null }), true);
  assert.equal(isProductEligible("quote", { slug: "lms", availability: "upcoming", brochure: null }), false);
});

test("isProductEligible_interest_upcoming_or_custom", () => {
  assert.equal(isProductEligible("product_interest", { slug: "lms", availability: "upcoming", brochure: null }), true);
  assert.equal(isProductEligible("product_interest", { slug: "erp", availability: "custom", brochure: null }), true);
  assert.equal(isProductEligible("product_interest", { slug: "pos", availability: "available", brochure: null }), false);
});

test("isProductEligible_brochure_requires_a_brochure", () => {
  assert.equal(
    isProductEligible("brochure_download", { slug: "pos", availability: "available", brochure: "pos.pdf" }),
    true,
  );
  assert.equal(
    isProductEligible("brochure_download", { slug: "erp", availability: "custom", brochure: null }),
    false,
  );
});

test("isProductEligible_custom_contact_partner_any_product", () => {
  for (const availability of ["available", "custom", "upcoming"] as const) {
    for (const type of ["custom_software", "contact", "partner"] as const) {
      assert.equal(isProductEligible(type, { slug: "x", availability, brochure: null }), true);
    }
  }
});

test("validateInquiry_demo_for_upcoming_product_is_ineligible", () => {
  // US-5: demo for lms → product-not-eligible (client-side mirror)
  const errors = validate("demo", { ...validBase.demo!, productSlugs: ["lms"] });
  assert.ok(errors.productSlugs);
});

test("validateInquiry_quote_without_products_is_an_error", () => {
  // US-6: 400 with a field error on productSlugs
  const errors = validate("quote", { ...validBase.quote!, productSlugs: [] });
  assert.ok(errors.productSlugs);
});

test("validateInquiry_unknown_product_slug_is_an_error", () => {
  const errors = validate("demo", { ...validBase.demo!, productSlugs: ["does-not-exist"] });
  assert.ok(errors.productSlugs);
});

test("productCountRange_follows_the_api_spec_rule_column", () => {
  assert.deepEqual(productCountRange("demo"), [1, 1]);
  assert.deepEqual(productCountRange("quote"), [1, 10]);
  assert.deepEqual(productCountRange("custom_software"), [0, 10]);
  assert.deepEqual(productCountRange("contact"), [0, 1]);
  assert.deepEqual(productCountRange("product_interest"), [1, 1]);
  assert.deepEqual(productCountRange("brochure_download"), [1, 1]);
  assert.deepEqual(productCountRange("partner"), [0, 10]);
});

test("eligibleProducts_from_catalog_demo_5_quote_10_interest_10", () => {
  const byAvailability = (value: string) =>
    catalog.products.filter((product) => product.availability === value).length;
  assert.equal(eligibleProducts("demo", products).length, byAvailability("available"));
  assert.equal(
    eligibleProducts("quote", products).length,
    byAvailability("available") + byAvailability("custom"),
  );
  assert.equal(
    eligibleProducts("product_interest", products).length,
    byAvailability("upcoming") + byAvailability("custom"),
  );
  assert.deepEqual(eligibleProducts("brochure_download", products), []);
});

// ---------- Phone (BR-10) ----------

test("normalisePhone_bangladesh_mobile_shapes_to_e164", () => {
  assert.equal(normalisePhone("01711000000"), "+8801711000000");
  assert.equal(normalisePhone("01711-000000"), "+8801711000000");
  assert.equal(normalisePhone("8801711000000"), "+8801711000000");
  assert.equal(normalisePhone("+8801711000000"), "+8801711000000");
  assert.equal(normalisePhone("+880 1711-000000"), "+8801711000000");
});

test("normalisePhone_international_e164_shape_stays", () => {
  assert.equal(normalisePhone("+44 20 7946 0000"), "+442079460000");
  assert.equal(normalisePhone("+1 (415) 555-0100"), "+14155550100");
});

test("normalisePhone_invalid_numbers_return_null", () => {
  assert.equal(normalisePhone("12345"), null);
  assert.equal(normalisePhone("01234567890"), null); // 01 then non-[3-9]
  assert.equal(normalisePhone("880171100000"), null); // too short
  assert.equal(normalisePhone(""), null);
});

test("validateInquiry_invalid_phone_is_a_field_error", () => {
  // US-12: phone "12345" → 400 with a field error on phone
  const errors = validate("demo", { ...validBase.demo!, phone: "12345" });
  assert.ok(errors.phone);
  const international = validate("demo", { ...validBase.demo!, phone: "+44 20 7946 0000" });
  assert.equal(international.phone, undefined);
});

// ---------- Email ----------

test("isValidEmail_shape_and_length", () => {
  assert.equal(isValidEmail("name@company.com"), true);
  assert.equal(isValidEmail("Name@Company.COM"), true);
  assert.equal(isValidEmail("no-dot@host"), false);
  assert.equal(isValidEmail("missing@"), false);
  assert.equal(isValidEmail(`${"a".repeat(250)}@x.com`), false);
});

// ---------- Demo date window ----------

test("isValidPreferredDate_today_or_later_up_to_180_days_dhaka", () => {
  assert.equal(isValidPreferredDate("2026-11-20", NOW), true, "today (Dhaka) is allowed");
  assert.equal(isValidPreferredDate("2026-11-19", NOW), false, "yesterday is not");
  assert.equal(isValidPreferredDate("2026-11-21", NOW), true);
  assert.equal(isValidPreferredDate("2027-05-19", NOW), true, "180 days ahead");
  assert.equal(isValidPreferredDate("2027-05-20", NOW), false, "181 days ahead");
  assert.equal(isValidPreferredDate("2026-02-30", NOW), false, "impossible date");
  assert.equal(isValidPreferredDate("25-11-2026", NOW), false, "wrong format");
});

// ---------- buildPayload ----------

test("buildPayload_demo_matches_the_api_spec_request_example", () => {
  const payload = buildPayload(
    "demo",
    {
      fullName: "Ayesha Rahman",
      email: "ayesha@acme.com",
      phone: "01711000000",
      company: "Acme Retail Ltd",
      jobTitle: "Operations Manager",
      industry: "retail",
      companySize: "51-200",
      country: "BD",
      productSlugs: ["pos"],
      message: "We run 6 outlets and need central stock control.",
      preferredDate: "2026-11-25",
      preferredTime: "morning",
      timeZone: "Asia/Dhaka",
      consent: true,
      website: "",
    },
    {
      pagePath: "/products/pos",
      referrer: "https://www.google.com/",
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "launch",
      utmTerm: null,
      utmContent: null,
    },
  );
  // Exactly the api-spec "POST /api/v1/inquiries" example body.
  assert.deepEqual(payload, {
    type: "demo",
    fullName: "Ayesha Rahman",
    email: "ayesha@acme.com",
    phone: "+8801711000000",
    company: "Acme Retail Ltd",
    jobTitle: "Operations Manager",
    industry: "retail",
    companySize: "51-200",
    country: "BD",
    region: null,
    partnerType: null,
    productSlugs: ["pos"],
    subject: null,
    message: "We run 6 outlets and need central stock control.",
    preferredDate: "2026-11-25",
    preferredTime: "morning",
    timeZone: "Asia/Dhaka",
    userCount: null,
    budgetRange: null,
    timeline: null,
    details: null,
    consent: true,
    website: "",
    source: {
      pagePath: "/products/pos",
      referrer: "https://www.google.com/",
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "launch",
      utmTerm: null,
      utmContent: null,
    },
  });
});

test("buildPayload_normalises_email_phone_and_defaults_country", () => {
  const payload = buildPayload("quote", validBase.quote!, {
    pagePath: "/request-quote",
    referrer: null,
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmTerm: null,
    utmContent: null,
  });
  assert.equal(payload.email, "ayesha@acme.com");
  assert.equal(payload.phone, "+8801711000000");
  assert.equal(payload.country, "BD", "BR-10: omitted country defaults to BD");
  assert.equal(payload.userCount, null);
});

test("buildPayload_lowercases_mixed_case_email", () => {
  const payload = buildPayload(
    "product_interest",
    { ...validBase.product_interest!, email: "Ayesha@ACME.com" },
    { pagePath: "/upcoming", referrer: null, utmSource: null, utmMedium: null, utmCampaign: null, utmTerm: null, utmContent: null },
  );
  assert.equal(payload.email, "ayesha@acme.com", "stored lower-case");
});

test("buildPayload_sends_null_for_ignored_fields", () => {
  const payload = buildPayload(
    "partner",
    { ...validBase.partner!, industry: "retail" },
    { pagePath: "/partners", referrer: null, utmSource: null, utmMedium: null, utmCampaign: null, utmTerm: null, utmContent: null },
  );
  assert.equal(payload.industry, null, "api-spec: industry ignored for partner");
  const brochure = buildPayload(
    "brochure_download",
    { ...validBase.brochure_download!, message: "should not be sent" },
    { pagePath: "/products/pos", referrer: null, utmSource: null, utmMedium: null, utmCampaign: null, utmTerm: null, utmContent: null },
  );
  assert.equal(brochure.message, null, "api-spec: message ignored for brochure");
});

test("buildPayload_custom_software_details_object", () => {
  const payload = buildPayload(
    "custom_software",
    {
      ...validBase.custom_software!,
      features: "Billing\nAttendance",
      referenceLinks: "https://example.com",
      currentSystem: "Spreadsheets",
    },
    { pagePath: "/custom-software", referrer: null, utmSource: null, utmMedium: null, utmCampaign: null, utmTerm: null, utmContent: null },
  );
  assert.deepEqual(payload.details, {
    features: "Billing\nAttendance",
    referenceLinks: "https://example.com",
    currentSystem: "Spreadsheets",
  });

  const withoutDetails = buildPayload(
    "custom_software",
    validBase.custom_software!,
    { pagePath: "/custom-software", referrer: null, utmSource: null, utmMedium: null, utmCampaign: null, utmTerm: null, utmContent: null },
  );
  assert.equal(withoutDetails.details, null);
});

test("buildPayload_demo_time_zone_defaults_to_dhaka", () => {
  const payload = buildPayload(
    "demo",
    validBase.demo!,
    { pagePath: "/request-demo", referrer: null, utmSource: null, utmMedium: null, utmCampaign: null, utmTerm: null, utmContent: null },
  );
  assert.equal(payload.timeZone, "Asia/Dhaka");
});

test("buildPayload_user_count_becomes_a_number", () => {
  const payload = buildPayload(
    "quote",
    { ...validBase.quote!, userCount: "25" },
    { pagePath: "/request-quote", referrer: null, utmSource: null, utmMedium: null, utmCampaign: null, utmTerm: null, utmContent: null },
  );
  assert.equal(payload.userCount, 25);
});

test("referencePattern_matches_ih_yymm_xxxxx", () => {
  assert.equal(REFERENCE_PATTERN.test("IH-2611-7K3QF"), true);
  assert.equal(REFERENCE_PATTERN.test("IH-2611-7K3Q"), false);
  assert.equal(REFERENCE_PATTERN.test("XX-2611-7K3QF"), false);
});
