/**
 * Upcoming products page copy (V1-10, PRD P-8). ⏳ OV-2: AI-drafted, pending
 * owner review. Counts of upcoming products are computed from the catalog at
 * build time (OV-4) — never hard-coded here.
 */

export const hero = {
  eyebrow: "Coming soon",
  title: "Products on the roadmap",
  intro:
    "These products are not built yet. They are shown to measure interest: register yours and you help decide what InflexHub builds next.",
} as const;

export const explainIntro = {
  eyebrow: "How it works",
  title: "Interest shapes the roadmap",
} as const;

export const explainSteps: readonly { readonly title: string; readonly description: string }[] = [
  {
    title: "You register interest",
    description: "Name and email, one step — no call, no obligation.",
  },
  {
    title: "Demand is counted",
    description:
      "Every registration is stored with its product and industry, so interest is measured, not guessed.",
  },
  {
    title: "You hear first",
    description:
      "When a product moves forward, the people who asked for it are the first to know.",
  },
];
