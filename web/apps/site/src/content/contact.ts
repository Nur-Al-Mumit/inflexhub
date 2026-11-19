/**
 * Contact page copy (V1-11, PRD P-10). Contact details come from
 * content/company.ts (⏳ OV-3 placeholders). Office hours use Bangladesh
 * time (ADR 0005).
 */

export const hero = {
  eyebrow: "Contact",
  title: "Talk to a person",
  intro:
    "Questions about a product, a quotation, or partnering? Send a message and InflexHub replies — every submission gets a reference number.",
} as const;

export const cardsIntro = {
  eyebrow: "Reach InflexHub",
  title: "Direct channels",
} as const;

export const formIntro = {
  eyebrow: "Message",
  title: "Write to InflexHub",
  intro:
    "For questions about an existing inquiry, include its reference (IH-YYMM-XXXXX) so it reaches the right conversation.",
} as const;

export const hoursIntro = {
  eyebrow: "Office hours",
  title: "When InflexHub answers",
} as const;

export const hoursNote =
  "Outside office hours, the form works around the clock — messages are handled in the order they arrive.";
