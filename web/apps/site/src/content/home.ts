/**
 * Home page copy (V1-3). ⏳ OV-2: AI-drafted, pending owner review — claims
 * stay modest and verifiable. OV-4: no invented client counts, years of
 * experience, awards, or testimonials; the only numbers on the page come from
 * catalog/products.json at build time.
 */

export type AvailabilityState = {
  readonly availability: "available" | "custom" | "upcoming";
  readonly label: string;
  readonly meaning: string;
  readonly primaryAction: { readonly href: string; readonly label: string };
  readonly secondaryAction: { readonly href: string; readonly label: string } | null;
};

export type Reason = {
  readonly icon: "availability" | "partner" | "standards" | "roadmap";
  readonly title: string;
  readonly description: string;
};

export type ProcessStep = {
  readonly title: string;
  readonly description: string;
};

export type EngagementModel = {
  readonly icon: "ready" | "tailor" | "custom";
  readonly title: string;
  readonly description: string;
  readonly action: { readonly href: string; readonly label: string };
};

export type FaqItem = {
  readonly summary: string;
  readonly content: string;
};

export const hero = {
  eyebrow: "InflexHub",
  // OV-6 proposed tagline (pending owner approval).
  headline: "Software that moves business forward.",
  intro:
    "InflexHub designs and delivers business software for companies, educational institutions, and healthcare organisations — ready to use, built on request, or coming soon.",
  primaryAction: { href: "/products", label: "Explore products" },
  secondaryAction: { href: "/request-demo", label: "Request a demo" },
  // Factual points only (availability model + standards, ADR 0005).
  points: ["Availability shown up front", "Bangladesh-based team", "Built to international standards"],
} as const;

export const statsIntro = {
  eyebrow: "The catalog in numbers",
  title: "What InflexHub offers today",
} as const;

// Labels for the catalog stats strip; values are computed from the catalog.
export const statsLabels = {
  products: "Products",
  categories: "Categories",
  industries: "Industries served",
  available: "Ready to use",
  custom: "Built on request",
  upcoming: "Coming soon",
} as const;

export const productsByCategoryAction = { href: "/products", label: "View all products" } as const;

export const productsByCategory = {
  eyebrow: "Products by category",
  title: "Find the system your organisation runs on",
  intro:
    "Every product is shown with its availability, so you know immediately what you can use today and what is on the roadmap.",
} as const;

// The three availability states and what each offers (PRD §1.3).
export const availabilityStates: readonly AvailabilityState[] = [
  {
    availability: "available",
    label: "Ready to use",
    meaning:
      "Built and sellable now. See it in action before you decide, and ask for a quotation for your organisation.",
    primaryAction: { href: "/request-demo", label: "Request a demo" },
    secondaryAction: { href: "/request-quote", label: "Request a quotation" },
  },
  {
    availability: "custom",
    label: "Built on request",
    meaning:
      "InflexHub builds or tailors the product to your organisation. Describe what you need and get a proposal.",
    primaryAction: { href: "/custom-software", label: "Request custom development" },
    secondaryAction: { href: "/request-quote", label: "Request a quotation" },
  },
  {
    availability: "upcoming",
    label: "Coming soon",
    meaning:
      "On the roadmap. Register your interest and InflexHub will let you know as it takes shape.",
    primaryAction: { href: "/upcoming", label: "Register interest" },
    secondaryAction: null,
  },
];

export const availabilityIntro = {
  eyebrow: "Availability, in plain words",
  title: "Three states, three ways to work with us",
  intro: "Every product carries one of three labels. Each label tells you exactly what you can do next.",
} as const;

export const industriesIntro = {
  eyebrow: "Industries",
  title: "Built for the way your industry works",
  intro:
    "Each product targets the industries it serves. Counts below come from the product catalog.",
  action: { href: "/industries", label: "All industries" },
} as const;

export const whyIntro = {
  eyebrow: "Why InflexHub",
  title: "A clear offer, from first click to launch",
  intro:
    "No guesswork about what exists, what can be built, and what is still on the roadmap — and one team from the first message to go-live.",
  action: { href: "/about", label: "About InflexHub" },
} as const;

// Modest, verifiable reasons — no invented claims (OV-4).
export const reasons: readonly Reason[] = [
  {
    icon: "availability",
    title: "Availability up front",
    description:
      "Every product states clearly whether it is ready to use, built on request, or coming soon — no sales calls needed to find out.",
  },
  {
    icon: "partner",
    title: "One partner across the catalog",
    description:
      "From point of sale to ERP, education, and healthcare systems: one team, one process, and products that share the same foundation.",
  },
  {
    icon: "standards",
    title: "Bangladesh first, international standards",
    description:
      "Priced and scheduled around Bangladesh (BDT, Bangladesh time), built to international standards for formats, accessibility, and data protection.",
  },
  {
    icon: "roadmap",
    title: "Interest shapes the roadmap",
    description:
      "Upcoming products exist to measure demand. Registering interest tells InflexHub what to build next — your input is part of the decision.",
  },
];

export const processIntro = {
  eyebrow: "How it works",
  title: "From first message to go-live in four steps",
  intro: "The same clear path whether you pick a ready product or ask for something custom.",
} as const;

export const processSteps: readonly ProcessStep[] = [
  {
    title: "Tell us what you need",
    description:
      "Request a demo, a quotation, or describe a custom requirement through a form. A person from InflexHub replies — no ticket queue.",
  },
  {
    title: "Scope it together",
    description:
      "A short conversation maps the product to your organisation: modules, data, timeline, and a transparent quotation.",
  },
  {
    title: "Build and configure",
    description:
      "Ready products are set up for you; custom builds are developed in stages with checkpoints you can see and steer.",
  },
  {
    title: "Go live with support",
    description:
      "Your team is trained, your data is brought across, and the system goes live with InflexHub reachable for what comes next.",
  },
];

export const engagementIntro = {
  eyebrow: "Engagement models",
  title: "Three ways to work with InflexHub",
  intro: "Start where you are: a ready product, a tailored one, or software built from scratch.",
} as const;

export const engagementModels: readonly EngagementModel[] = [
  {
    icon: "ready",
    title: "Use a ready product",
    description:
      "Pick a product that is ready to use. InflexHub sets it up for your organisation and supports it from day one.",
    action: { href: "/request-demo", label: "Request a demo" },
  },
  {
    icon: "tailor",
    title: "Tailor or build on request",
    description:
      "Start from a product that is built on request and have it configured around your processes instead of the other way around.",
    action: { href: "/request-quote", label: "Request a quotation" },
  },
  {
    icon: "custom",
    title: "Custom software from scratch",
    description:
      "When no product fits, InflexHub designs and develops software around exactly how your organisation works.",
    action: { href: "/custom-software", label: "Describe your project" },
  },
];

export const faqIntro = {
  eyebrow: "Questions",
  title: "Frequently asked",
  intro: "Short answers about availability, demos, custom work, and what happens after you get in touch.",
  aside: {
    title: "Still have a question?",
    text: "Send it through the contact form and a person from InflexHub replies.",
    action: { href: "/contact", label: "Contact InflexHub" },
  },
} as const;

export const ctaBand = {
  eyebrow: "Next step",
  title: "See what InflexHub can run for you",
  intro:
    "Browse the catalog with availability up front, or ask for a walkthrough of the product that fits your organisation.",
  cta: { href: "/products", label: "Explore products" },
} as const;

export const faqItems: readonly FaqItem[] = [
  {
    summary: "What do “Ready to use”, “Built on request”, and “Coming soon” mean?",
    content:
      "Ready to use means the product exists today and can be deployed for you. Built on request means InflexHub tailors or builds the product per organisation. Coming soon means it is on the roadmap — you can register interest to be notified.",
  },
  {
    summary: "How do I see a product in action?",
    content:
      "Open any ready-to-use product and request a demo. You will get a walkthrough scheduled in Bangladesh time, at a time window you choose.",
  },
  {
    summary: "Can InflexHub build something that is not in the catalog?",
    content:
      "Yes. Use the custom software page to describe your requirement — scope, features, and budget range — and InflexHub responds with a proposal.",
  },
  {
    summary: "Which countries does InflexHub work with?",
    content:
      "InflexHub is based in Bangladesh and works with visitors from any country: every form accepts an international phone number and country.",
  },
  {
    summary: "What happens after I submit a form?",
    content:
      "You receive a reference number immediately. InflexHub's sales team reviews every submission and replies — your form keeps what you typed if anything goes wrong.",
  },
];
