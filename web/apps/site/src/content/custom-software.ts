/**
 * Custom software page copy (V1-7, PRD P-5). ⏳ OV-2: AI-drafted, pending
 * owner review — capability descriptions only, no client numbers, no named
 * technologies beyond what the owner's own stack records (ADR 0001), no
 * local-integration claims (OV-13).
 */

export type BuildItem = {
  readonly title: string;
  readonly description: string;
};

export type FaqItem = {
  readonly summary: string;
  readonly content: string;
};

export const hero = {
  eyebrow: "Custom software",
  title: "Software built around how your organisation works",
  intro:
    "When no catalog product fits, InflexHub designs, builds, and supports software around your actual process — from the first requirements talk to go-live.",
} as const;

export const buildIntro = {
  eyebrow: "What we build",
  title: "From a single tool to a full platform",
  intro: "Every engagement starts from what your team does today, not from a template.",
} as const;

export const buildItems: readonly BuildItem[] = [
  {
    title: "Web applications",
    description:
      "Browser-based systems for the work your organisation runs daily — usable on desktop and phone.",
  },
  {
    title: "Tailored catalog products",
    description:
      "A catalog product adapted to your process: extra modules, changed workflows, your documents.",
  },
  {
    title: "Integrations and imports",
    description:
      "Connecting systems so data is entered once — including bringing your existing records across.",
  },
  {
    title: "Reporting and dashboards",
    description:
      "The numbers your organisation decides by, drawn from the system that holds them.",
  },
];

export const techIntro = {
  eyebrow: "How it is built",
  title: "A stack chosen for longevity",
  intro:
    "InflexHub builds on mature, widely supported technology so your system stays maintainable — the same standards the company holds itself to (ADR 0005).",
} as const;

// ⏳ OV-2: capability areas, not brand claims — the owner confirms the exact
// stack offered for client work.
export const techItems: readonly string[] = [
  "Modern web platforms with clear separation between data, logic, and interface",
  "Relational databases with schema kept in version control",
  "Documented APIs so later integrations stay possible",
  "Deployment on cloud or on-premise infrastructure, per your requirements",
  "Accessibility and international formats built in from the start, not retrofitted",
];

export const faqIntro = {
  eyebrow: "Questions",
  title: "Custom software FAQ",
} as const;

export const faqItems: readonly FaqItem[] = [
  {
    summary: "How much does custom software cost?",
    content:
      "It depends on scope — which is why the form asks for a budget range and a summary. After a short scoping conversation you receive a proposal with a transparent price and what is included.",
  },
  {
    summary: "How long does a build take?",
    content:
      "Small tools can take weeks; platforms take months and are delivered in stages with checkpoints you can steer. The timeline field in the form helps set expectations early.",
  },
  {
    summary: "Can a catalog product be adapted instead?",
    content:
      "Often, yes. Several catalog products are built on request exactly for that. Listing related products in the form tells InflexHub where to look first.",
  },
  {
    summary: "Who owns the result?",
    content:
      "Ownership and licensing are part of the written proposal, agreed before work starts.",
  },
];
