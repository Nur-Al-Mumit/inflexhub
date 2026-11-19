import type { ProductContent } from "./types.ts";

export const content: ProductContent = {
  overview: [
    "CRM System keeps every lead and customer conversation in one place: who contacted whom, what was discussed, and what happens next. Built on request around your sales process — from first inquiry to a closed deal and beyond.",
  ],
  keyFeatures: [
    "One timeline per customer and lead",
    "Follow-ups with dates and owners",
    "Pipeline stages that match how you sell",
    "Notes and attachments on every interaction",
    "Sales reports by stage, owner, and source",
  ],
  modules: [
    "Leads and customers",
    "Activity timeline",
    "Pipeline and follow-ups",
    "Team assignments",
    "Sales reporting",
  ],
  benefits: [
    "No lead forgotten in someone's inbox",
    "Handovers between salespeople without losing context",
    "A pipeline you can actually forecast from",
  ],
  howItWorks:
    "Because the CRM is built on request, it starts with your sales stages and fields — not a generic template. InflexHub scopes the process with you, configures the system, and moves your existing lead list in.",
  faq: [
    {
      summary: "Can it import our current leads?",
      content:
        "Yes — existing leads and customers are imported as part of setup, with their history where you have it recorded.",
    },
    {
      summary: "Does it work for small sales teams?",
      content:
        "Yes. The system is scoped to your team size and process; single-owner pipelines stay simple.",
    },
  ],
};
