/**
 * Inquiry rules (V1-7 – V1-10, V1-23, V1-24): pure functions mirroring the
 * api-spec "Inquiry fields per type" table exactly (required / optional /
 * ignored), the length limits (BR-8), the enums, product eligibility
 * (BR-2), phone normalisation to E.164 (BR-10), and buildPayload producing
 * the api-spec POST /api/v1/inquiries request body. No React, no browser
 * APIs — covered by tests/inquiry.test.ts (node --test).
 */

import type { ProductAvailability } from "./catalog";

export type InquiryType =
  | "demo"
  | "quote"
  | "custom_software"
  | "contact"
  | "product_interest"
  | "brochure_download"
  | "partner";

export const inquiryTypes: readonly InquiryType[] = [
  "demo",
  "quote",
  "custom_software",
  "contact",
  "product_interest",
  "brochure_download",
  "partner",
];

export type Requirement = "required" | "optional" | "ignored";

/** Every request-body field the api-spec table covers (details sub-fields
 * live inside `details`; website and consent are always required/hidden). */
export type InquiryField =
  | "fullName"
  | "email"
  | "phone"
  | "company"
  | "jobTitle"
  | "industry"
  | "companySize"
  | "country"
  | "region"
  | "partnerType"
  | "productSlugs"
  | "subject"
  | "message"
  | "preferredDate"
  | "preferredTime"
  | "timeZone"
  | "userCount"
  | "budgetRange"
  | "timeline";

/** The api-spec table, column by column. Mirrors it exactly; tests pin the
 * surprising cells (partner ignores industry, contact ignores companySize,
 * interest ignores jobTitle, brochure ignores message). */
const TABLE: Record<InquiryField, Record<InquiryType, Requirement>> = {
  fullName: byType({ all: "required" }),
  email: byType({ all: "required" }),
  phone: byType({
    demo: "required",
    quote: "required",
    custom_software: "required",
    contact: "optional",
    product_interest: "optional",
    brochure_download: "optional",
    partner: "required",
  }),
  company: byType({
    demo: "required",
    quote: "required",
    custom_software: "required",
    contact: "optional",
    product_interest: "optional",
    brochure_download: "optional",
    partner: "required",
  }),
  jobTitle: byType({
    all: "optional",
    product_interest: "ignored",
  }),
  industry: byType({ all: "optional", partner: "ignored" }),
  companySize: byType({ all: "optional", contact: "ignored" }),
  country: byType({ all: "optional", partner: "required" }),
  region: byType({ all: "ignored", partner: "optional" }),
  partnerType: byType({ all: "ignored", partner: "required" }),
  productSlugs: byType({ all: "optional" }),
  subject: byType({ all: "ignored", contact: "required" }),
  message: byType({
    demo: "optional",
    quote: "optional",
    custom_software: "required",
    contact: "required",
    product_interest: "optional",
    brochure_download: "ignored",
    partner: "optional",
  }),
  preferredDate: byType({ all: "ignored", demo: "optional" }),
  preferredTime: byType({ all: "ignored", demo: "optional" }),
  timeZone: byType({ all: "ignored", demo: "optional" }),
  userCount: byType({ all: "ignored", quote: "optional", custom_software: "optional" }),
  budgetRange: byType({ all: "ignored", quote: "optional", custom_software: "optional" }),
  timeline: byType({ all: "ignored", quote: "optional", custom_software: "optional" }),
};

function byType(overrides: {
  all?: Requirement;
} & Partial<Record<InquiryType, Requirement>>): Record<InquiryType, Requirement> {
  const base = overrides.all ?? "ignored";
  return {
    demo: overrides.demo ?? base,
    quote: overrides.quote ?? base,
    custom_software: overrides.custom_software ?? base,
    contact: overrides.contact ?? base,
    product_interest: overrides.product_interest ?? base,
    brochure_download: overrides.brochure_download ?? base,
    partner: overrides.partner ?? base,
  };
}

export function fieldRequirement(type: InquiryType, field: InquiryField): Requirement {
  return TABLE[field][type];
}

// ---------- Limits (BR-8, api-spec Rule column) ----------

export const limits = {
  fullNameMin: 2,
  fullNameMax: 120,
  emailMax: 254,
  phoneMax: 32,
  companyMax: 160,
  jobTitleMax: 120,
  regionMax: 120,
  subjectMin: 3,
  subjectMax: 160,
  messageMax: 5000,
  customMessageMin: 30,
  contactMessageMin: 10,
  userCountMin: 1,
  userCountMax: 100_000,
  productsMax: 10,
  preferredDateMaxDays: 180,
} as const;

// ---------- Enums (api-spec Rule column; labels in content/form-options.ts) ----------

export const companySizeValues = ["1-10", "11-50", "51-200", "201-1000", "1000+"] as const;
export type CompanySize = (typeof companySizeValues)[number];

export const budgetRangeValues = ["lt-2l", "2l-5l", "5l-15l", "15l-50l", "gt-50l", "not-sure"] as const;
export type BudgetRange = (typeof budgetRangeValues)[number];

export const timelineValues = ["asap", "1-3-months", "3-6-months", "6-plus-months", "exploring"] as const;
export type Timeline = (typeof timelineValues)[number];

export const preferredTimeValues = ["morning", "afternoon", "evening"] as const;
export type PreferredTime = (typeof preferredTimeValues)[number];

export const partnerTypeValues = ["reseller", "implementation", "referral", "technology"] as const;
export type PartnerType = (typeof partnerTypeValues)[number];

// ---------- Product eligibility (BR-2) ----------

export type InquiryProduct = {
  readonly slug: string;
  readonly availability: ProductAvailability;
  readonly brochure: string | null;
  /** Display name for option lists (not needed for validation). */
  readonly name?: string;
};

/** True when the product accepts this inquiry type (api-spec eligibility table). */
export function isProductEligible(type: InquiryType, product: InquiryProduct): boolean {
  switch (type) {
    case "demo":
      return product.availability === "available";
    case "quote":
      return product.availability === "available" || product.availability === "custom";
    case "product_interest":
      return product.availability === "upcoming" || product.availability === "custom";
    case "brochure_download":
      return product.brochure !== null;
    default:
      return true; // custom_software, contact, partner: any
  }
}

/** The products a form of this type may offer (catalog order kept). */
export function eligibleProducts<T extends InquiryProduct>(type: InquiryType, products: readonly T[]): T[] {
  return products.filter((product) => isProductEligible(type, product));
}

/** Counts per the productSlugs Rule column: [min, max]. */
export function productCountRange(type: InquiryType): readonly [number, number] {
  switch (type) {
    case "demo":
    case "product_interest":
    case "brochure_download":
      return [1, 1];
    case "quote":
      return [1, limits.productsMax];
    case "contact":
      return [0, 1];
    default:
      return [0, limits.productsMax];
  }
}

// ---------- Phone (BR-10, OV-15: Bangladesh exact, others E.164 shape) ----------

/**
 * Normalises a phone number to E.164, or returns null when it matches no
 * accepted shape. Spaces, dashes, dots and brackets are stripped first.
 * - Bangladesh mobile `01[3-9]XXXXXXXX`, `8801…`, `+8801…` → `+8801XXXXXXXXX`
 * - Other countries: `+[1-9]` followed by 6–14 digits, unchanged.
 */
export function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/[\s\-().]/g, "");
  if (!digits) {
    return null;
  }
  const withoutPlus = digits.startsWith("+") ? digits.slice(1) : digits;
  if (/^01[3-9]\d{8}$/.test(withoutPlus)) {
    return `+880${withoutPlus.slice(1)}`;
  }
  if (/^8801[3-9]\d{8}$/.test(withoutPlus)) {
    return `+${withoutPlus}`;
  }
  if (/^\+[1-9]\d{6,14}$/.test(digits)) {
    return digits;
  }
  return null;
}

// ---------- Email ----------

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(raw: string): boolean {
  return raw.length <= limits.emailMax && EMAIL_PATTERN.test(raw);
}

// ---------- Dates (demo: today or later in Asia/Dhaka, ≤ 180 days ahead) ----------

/** Asia/Dhaka is UTC+6 with no DST — a fixed offset gives the local date. */
function dhakaDateString(now: Date): string {
  return new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** Days from the Dhaka `today` to the date; negative = in the past. */
function daysFromToday(date: string, now: Date): number {
  const today = new Date(`${dhakaDateString(now)}T00:00:00Z`).getTime();
  const target = new Date(`${date}T00:00:00Z`).getTime();
  return Math.round((target - today) / 86_400_000);
}

export function isValidPreferredDate(raw: string, now: Date): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return false;
  }
  const parsed = new Date(`${raw}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== raw) {
    return false; // rejects 2026-02-30 and similar impossible dates
  }
  const days = daysFromToday(raw, now);
  return days >= 0 && days <= limits.preferredDateMaxDays;
}

// ---------- Values and validation ----------

/** Every value a form can hold; strings are trimmed before validation. */
export type InquiryValues = {
  fullName?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  companySize?: string;
  country?: string;
  region?: string;
  partnerType?: string;
  productSlugs?: readonly string[];
  subject?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  timeZone?: string;
  userCount?: string;
  budgetRange?: string;
  timeline?: string;
  /** custom_software `details` sub-fields. */
  features?: string;
  referenceLinks?: string;
  currentSystem?: string;
  consent?: boolean;
  /** Honeypot (BR-5): sent as `website`; filled = bot. */
  website?: string;
};

export type ValidationContext = {
  /** Catalog products, used for slug existence and eligibility. */
  readonly products: readonly InquiryProduct[];
  /** Catalog industry slugs, for the `industry` rule (slug or `other`). */
  readonly industries?: readonly string[];
  /** Clock for date rules; defaults to the current time. */
  readonly now?: Date;
};

/** Field errors keyed by api-spec request-body name (server 400s map 1:1). */
export type FieldErrors = Record<string, string>;

function text(value: string | undefined): string {
  return (value ?? "").trim();
}

/** Validates one submission against the api-spec table. Ignored fields are
 * skipped, so a value the type does not use never blocks submission. */
export function validateInquiry(
  type: InquiryType,
  values: InquiryValues,
  context: ValidationContext,
): FieldErrors {
  const errors: FieldErrors = {};
  const now = context.now ?? new Date();
  const need = (field: InquiryField) => fieldRequirement(type, field);

  if (need("fullName") !== "ignored") {
    const name = text(values.fullName);
    if (need("fullName") === "required" && name === "") {
      errors.fullName = "Enter your full name.";
    } else if (name !== "" && name.length < limits.fullNameMin) {
      errors.fullName = `Your name needs at least ${limits.fullNameMin} characters.`;
    } else if (name.length > limits.fullNameMax) {
      errors.fullName = `Keep your name under ${limits.fullNameMax} characters.`;
    }
  }

  if (need("email") !== "ignored") {
    const email = text(values.email).toLowerCase();
    if (need("email") === "required" && email === "") {
      errors.email = "Enter your email address.";
    } else if (email !== "" && !isValidEmail(email)) {
      errors.email = "Enter a valid email address, like name@company.com.";
    }
  }

  if (need("phone") !== "ignored") {
    const phone = text(values.phone);
    if (phone === "") {
      if (need("phone") === "required") {
        errors.phone = "Enter your phone number.";
      }
    } else if (phone.length > limits.phoneMax) {
      errors.phone = `Keep the phone number under ${limits.phoneMax} characters.`;
    } else if (normalisePhone(phone) === null) {
      errors.phone =
        "Enter a valid phone number: a Bangladesh mobile (01XXXXXXXXX) or a full international number with country code.";
    }
  }

  if (need("company") !== "ignored") {
    const company = text(values.company);
    if (need("company") === "required" && company === "") {
      errors.company = "Enter your company or organisation name.";
    } else if (company.length > limits.companyMax) {
      errors.company = `Keep the company name under ${limits.companyMax} characters.`;
    }
  }

  if (need("jobTitle") !== "ignored" && text(values.jobTitle).length > limits.jobTitleMax) {
    errors.jobTitle = `Keep your job title under ${limits.jobTitleMax} characters.`;
  }

  if (need("industry") !== "ignored" && context.industries) {
    const industry = text(values.industry);
    if (industry !== "" && industry !== "other" && !context.industries.includes(industry)) {
      errors.industry = "Choose an industry from the list.";
    }
  }

  if (need("companySize") !== "ignored" && !enumOk(values.companySize, companySizeValues)) {
    errors.companySize = "Choose a company size from the list.";
  }

  if (need("country") !== "ignored") {
    const country = text(values.country);
    if (need("country") === "required" && country === "") {
      errors.country = "Select your country.";
    } else if (country !== "" && !/^[A-Z]{2}$/.test(country)) {
      errors.country = "Select a country from the list.";
    }
  }

  if (need("region") !== "ignored" && text(values.region).length > limits.regionMax) {
    errors.region = `Keep the city or region under ${limits.regionMax} characters.`;
  }

  if (need("partnerType") !== "ignored") {
    const partnerType = text(values.partnerType);
    if (partnerType === "") {
      if (need("partnerType") === "required") {
        errors.partnerType = "Choose the partner type that fits you best.";
      }
    } else if (!partnerTypeValues.includes(partnerType as PartnerType)) {
      errors.partnerType = "Choose a partner type from the list.";
    }
  }

  if (need("productSlugs") !== "ignored") {
    const [min, max] = productCountRange(type);
    const slugs = (values.productSlugs ?? []).map((slug) => slug.trim()).filter(Boolean);
    if (slugs.length < min) {
      errors.productSlugs = min === 1 ? "Select a product." : "Select at least one product.";
    } else if (slugs.length > max) {
      errors.productSlugs = `Select at most ${max} products.`;
    } else {
      const catalogSlugs = new Set(context.products.map((product) => product.slug));
      const unknown = slugs.filter((slug) => !catalogSlugs.has(slug));
      if (unknown.length > 0) {
        errors.productSlugs = "One of the selected products is not in the catalog.";
      } else {
        const ineligible = slugs.filter(
          (slug) =>
            !isProductEligible(
              type,
              // Safe: unknown slugs were checked above.
              context.products.find((product) => product.slug === slug)!,
            ),
        );
        if (ineligible.length > 0) {
          errors.productSlugs = "One of the selected products does not accept this kind of request.";
        }
      }
    }
  }

  if (need("subject") !== "ignored") {
    const subject = text(values.subject);
    if (need("subject") === "required" && subject === "") {
      errors.subject = "Enter a subject.";
    } else if (subject !== "" && subject.length < limits.subjectMin) {
      errors.subject = `The subject needs at least ${limits.subjectMin} characters.`;
    } else if (subject.length > limits.subjectMax) {
      errors.subject = `Keep the subject under ${limits.subjectMax} characters.`;
    }
  }

  if (need("message") !== "ignored") {
    const message = text(values.message);
    if (message === "") {
      if (need("message") === "required") {
        errors.message =
          type === "custom_software"
            ? `Describe your project in at least ${limits.customMessageMin} characters.`
            : `Write your message (at least ${limits.contactMessageMin} characters).`;
      }
    } else {
      const min = type === "custom_software" ? limits.customMessageMin : type === "contact" ? limits.contactMessageMin : 0;
      if (message.length < min) {
        errors.message = `Add a little more detail — at least ${min} characters.`;
      } else if (message.length > limits.messageMax) {
        errors.message = `Keep this under ${limits.messageMax} characters.`;
      }
    }
  }

  if (need("preferredDate") !== "ignored") {
    const date = text(values.preferredDate);
    if (date !== "" && !isValidPreferredDate(date, now)) {
      errors.preferredDate = `Pick a date from today up to ${limits.preferredDateMaxDays} days ahead (Bangladesh time).`;
    }
  }

  if (need("preferredTime") !== "ignored" && !enumOk(values.preferredTime, preferredTimeValues)) {
    errors.preferredTime = "Choose a time of day from the list.";
  }

  if (need("userCount") !== "ignored") {
    const userCount = text(values.userCount);
    if (userCount !== "") {
      const parsed = Number(userCount);
      if (!Number.isInteger(parsed) || parsed < limits.userCountMin || parsed > limits.userCountMax) {
        errors.userCount = `Enter a whole number between ${limits.userCountMin} and ${limits.userCountMax}.`;
      }
    }
  }

  if (need("budgetRange") !== "ignored" && !enumOk(values.budgetRange, budgetRangeValues)) {
    errors.budgetRange = "Choose a budget range from the list.";
  }

  if (need("timeline") !== "ignored" && !enumOk(values.timeline, timelineValues)) {
    errors.timeline = "Choose a timeline from the list.";
  }

  if (values.consent !== true) {
    errors.consent = "Accept the privacy policy so InflexHub can reply to you.";
  }

  return errors;
}

function enumOk(value: string | undefined, allowed: readonly string[]): boolean {
  const trimmed = text(value);
  // Empty is fine: every enum field is optional (consent is separate).
  return trimmed === "" || allowed.includes(trimmed);
}

// ---------- Request body ----------

/** The `source` object attached to every submission (pages-and-flows). */
export type InquirySource = {
  readonly pagePath: string;
  readonly referrer: string | null;
  readonly utmSource: string | null;
  readonly utmMedium: string | null;
  readonly utmCampaign: string | null;
  readonly utmTerm: string | null;
  readonly utmContent: string | null;
};

export type InquiryDetails = {
  readonly features?: string;
  readonly referenceLinks?: string;
  readonly currentSystem?: string;
};

/** POST /api/v1/inquiries request body (api-spec example shape). */
export type InquiryPayload = {
  readonly type: InquiryType;
  readonly fullName: string | null;
  readonly email: string | null;
  readonly phone: string | null;
  readonly company: string | null;
  readonly jobTitle: string | null;
  readonly industry: string | null;
  readonly companySize: string | null;
  readonly country: string | null;
  readonly region: string | null;
  readonly partnerType: string | null;
  readonly productSlugs: readonly string[];
  readonly subject: string | null;
  readonly message: string | null;
  readonly preferredDate: string | null;
  readonly preferredTime: string | null;
  readonly timeZone: string | null;
  readonly userCount: number | null;
  readonly budgetRange: string | null;
  readonly timeline: string | null;
  readonly details: InquiryDetails | null;
  readonly consent: boolean;
  readonly website: string;
  readonly source: InquirySource;
};

/** The API response body (201/200). */
export type InquiryResult = {
  readonly reference: string;
  readonly type: InquiryType;
  readonly createdAt: string;
  readonly downloadUrl?: string | null;
};

/** Reference format IH-YYMM-XXXXX (BR-1), for client-side display checks. */
export const REFERENCE_PATTERN = /^IH-\d{2}\d{2}-[A-Z0-9]{5}$/;

function included(type: InquiryType, field: InquiryField): boolean {
  return fieldRequirement(type, field) !== "ignored";
}

/** The string-valued request fields buildPayload copies verbatim. */
type StringField = Exclude<InquiryField, "productSlugs">;

/**
 * Builds the api-spec request body. Values the type ignores are sent as null
 * (matching the api-spec example); strings are trimmed, the email lower-cased,
 * the phone normalised to E.164, and the country defaults to `BD` (BR-10).
 */
export function buildPayload(
  type: InquiryType,
  values: InquiryValues,
  source: InquirySource,
): InquiryPayload {
  const use = (field: StringField): string | null => {
    if (!included(type, field)) {
      return null;
    }
    const value = text(values[field]);
    return value === "" ? null : value;
  };

  const phone = included(type, "phone") ? normalisePhone(text(values.phone)) : null;
  const email = use("email");

  const details =
    type === "custom_software" &&
    (text(values.features) !== "" || text(values.referenceLinks) !== "" || text(values.currentSystem) !== "")
      ? {
          features: text(values.features) || undefined,
          referenceLinks: text(values.referenceLinks) || undefined,
          currentSystem: text(values.currentSystem) || undefined,
        }
      : null;

  const userCount = use("userCount");

  return {
    type,
    fullName: use("fullName"),
    email: email === null ? null : email.toLowerCase(),
    phone,
    company: use("company"),
    jobTitle: use("jobTitle"),
    industry: use("industry"),
    companySize: use("companySize"),
    country: included(type, "country")
      ? text(values.country) || "BD"
      : null,
    region: use("region"),
    partnerType: use("partnerType"),
    productSlugs: included(type, "productSlugs")
      ? (values.productSlugs ?? []).map((slug) => slug.trim()).filter(Boolean)
      : [],
    subject: use("subject"),
    message: use("message"),
    preferredDate: use("preferredDate"),
    preferredTime: use("preferredTime"),
    timeZone: use("timeZone") ?? (included(type, "timeZone") ? "Asia/Dhaka" : null),
    userCount: userCount === null ? null : Number(userCount),
    budgetRange: use("budgetRange"),
    timeline: use("timeline"),
    details,
    consent: values.consent === true,
    website: text(values.website),
    source,
  };
}
