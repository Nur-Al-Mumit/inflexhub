/**
 * About page copy (V1-11, PRD P-9). ⏳ OV-2: AI-drafted, pending owner
 * review. OV-4: no invented history, client counts, or milestones — the only
 * numbers are catalog counts computed at build time; legal details are OV-18
 * placeholders from content/company.ts.
 */

export type Value = {
  readonly title: string;
  readonly description: string;
};

export const hero = {
  eyebrow: "About",
  title: "The team behind the InflexHub catalog",
  intro:
    "InflexHub designs and delivers business software for companies, educational institutions, and healthcare organisations — from Bangladesh, to international standards.",
} as const;

export const story = {
  eyebrow: "Story",
  title: "Why InflexHub exists",
  paragraphs: [
    "Every organisation runs on a handful of core processes: selling, stock, people, money, learning. Software for those processes exists everywhere — but in many markets it comes with unclear pricing, hidden availability, and a long sales conversation before the first useful answer.",
    "InflexHub takes the opposite approach. The catalog says up front what exists today, what can be built on request, and what is still on the roadmap. Every product page ends in a working form, not a phone wall. What is on the roadmap is shaped by the organisations who register interest in it.",
    "The company is based in Dhaka, Bangladesh, and works with visitors from any country (ADR 0005): prices in BDT, phone numbers and dates in international formats, accessibility built in rather than bolted on.",
  ],
} as const;

export const mission = {
  eyebrow: "Mission and vision",
  missionTitle: "Mission",
  mission:
    "Software that moves business forward: the right system, honest availability, and one team from the first message to go-live.",
  visionTitle: "Vision",
  vision:
    "A catalog where every organisation — a shop, a school, a hospital, a factory — finds software that fits the way it already works.",
} as const;

export const valuesIntro = {
  eyebrow: "Values",
  title: "How the work gets done",
} as const;

export const values: readonly Value[] = [
  {
    title: "Honesty up front",
    description:
      "Availability is stated on every product. If something is not built yet, the site says so and counts interest instead of pretending.",
  },
  {
    title: "Clarity over jargon",
    description:
      "Plain words for prices, timelines, and scope. A quotation states what is included and what costs extra.",
  },
  {
    title: "Standards, not shortcuts",
    description:
      "International formats, accessibility, and security practices are the baseline for every page and every product (ADR 0005).",
  },
  {
    title: "One team end to end",
    description:
      "The people who scope the work are the people who build and support it — no hand-offs into a void.",
  },
];

export const whatWeDoIntro = {
  eyebrow: "What we do",
  title: "The catalog today",
  intro: "Counts computed from the product catalog — never marketing numbers (OV-4).",
} as const;

export const ctaBand = {
  eyebrow: "Next step",
  title: "See what InflexHub can run for you",
  intro: "Browse the catalog with availability up front, or ask for a walkthrough of a product that fits.",
  cta: { href: "/products", label: "Explore products" },
} as const;
