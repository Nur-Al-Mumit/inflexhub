/**
 * Partner program copy (V1-24, PRD P-14). ⏳ OV-17: partner program details
 * (types, benefits, regions) are placeholders pending the owner's program
 * design — benefits are described WITHOUT numbers (no margins, no fees).
 * OV-2: AI-drafted wording, pending owner review.
 */

export type PartnerWhoItem = {
  readonly title: string;
  readonly description: string;
};

export type PartnerBenefit = {
  readonly title: string;
  readonly description: string;
};

export type ProcessStep = {
  readonly title: string;
  readonly description: string;
};

export type FaqItem = {
  readonly summary: string;
  readonly content: string;
};

export const hero = {
  eyebrow: "Partner program",
  title: "Sell and implement InflexHub products with us",
  intro:
    "Agencies, IT firms, and consultants bring InflexHub products to organisations in their market — with the catalog, the process, and one team behind both.",
} as const;

export const whoIntro = {
  eyebrow: "Who can partner",
  title: "Four kinds of partners, one program",
  intro: "If your clients need business software, there is a way to work together.",
} as const;

export const whoItems: readonly PartnerWhoItem[] = [
  {
    title: "Resellers",
    description: "You sell InflexHub products to clients in your market and run the relationship.",
  },
  {
    title: "Implementation partners",
    description: "You deploy, configure, and support products for clients end to end.",
  },
  {
    title: "Referral partners",
    description: "You introduce organisations that need software and stay as close to the deal as you want.",
  },
  {
    title: "Technology partners",
    description: "You bring platforms or tools that extend what the products can do.",
  },
];

export const benefitsIntro = {
  eyebrow: "What partners get",
  title: "What working with InflexHub looks like",
  intro: "Concrete support, described without numbers until the program terms are final (OV-17).",
} as const;

// ⏳ OV-17: no margins, fees, or lead-split numbers until the owner confirms them.
export const benefits: readonly PartnerBenefit[] = [
  {
    title: "The full catalog to work with",
    description:
      "Every product with its availability stated up front — you always know what you can offer today.",
  },
  {
    title: "One team behind the products",
    description:
      "Product questions, scoping help, and delivery come from InflexHub; you are never alone with a client.",
  },
  {
    title: "Clear process from first talk to go-live",
    description:
      "The same four-step path InflexHub runs itself — you always know where a project stands.",
  },
  {
    title: "Written terms",
    description:
      "Partner terms are agreed in writing before any joint work starts, for both sides' protection.",
  },
];

export const stepsIntro = {
  eyebrow: "How it works",
  title: "From application to partnership in four steps",
} as const;

export const steps: readonly ProcessStep[] = [
  {
    title: "Apply",
    description: "The form below: who you are, what you do, and the products you are interested in.",
  },
  {
    title: "Review",
    description: "InflexHub reads every application and replies about a first conversation.",
  },
  {
    title: "Agree",
    description: "A talk about your market, services, and how selling or implementing would work.",
  },
  {
    title: "Start",
    description: "Terms confirmed in writing — and the first project together gets going.",
  },
];

export const formIntro = {
  eyebrow: "Apply",
  title: "Partner application",
  intro:
    "Tell InflexHub about your organisation and how you want to work together. The more specific, the better the first conversation.",
} as const;

export const faqIntro = {
  eyebrow: "Questions",
  title: "Partner FAQ",
} as const;

export const faqItems: readonly FaqItem[] = [
  {
    summary: "Is there a fee to become a partner?",
    content:
      "Program terms, including any fees, are part of the written agreement and confirmed during the process — nothing is owed for applying.",
  },
  {
    summary: "Can partners work outside Bangladesh?",
    content:
      "The application form accepts any country; the region field tells InflexHub which market you would cover.",
  },
  {
    summary: "Do partners need technical staff?",
    content:
      "Reseller and referral partnerships do not; implementation partners naturally do. The partner type you choose frames the conversation.",
  },
  {
    summary: "What happens to my application?",
    content:
      "It lands with InflexHub's team like every inquiry — with a reference number, and a reply about the next conversation.",
  },
];
