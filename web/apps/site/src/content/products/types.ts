/**
 * Product content types (V1-5). Rich marketing copy lives here, keyed by
 * catalog slug (ADR 0002); a test fails if a catalog slug has no content or
 * content has no catalog entry. ⏳ OV-2: AI-drafted, pending owner review —
 * keep claims modest and functional.
 */

export type ProductFaqItem = {
  readonly summary: string;
  readonly content: string;
};

export type ProductContent = {
  /** One or two paragraphs introducing the product. */
  readonly overview: readonly string[];
  /** Headline capabilities (bullet list). */
  readonly keyFeatures: readonly string[];
  /** Functional modules the product is organised into. */
  readonly modules: readonly string[];
  /** What the organisation gains (bullet list). */
  readonly benefits: readonly string[];
  /** How it is delivered / how working with InflexHub looks. */
  readonly howItWorks: string;
  readonly faq: readonly ProductFaqItem[];
};
