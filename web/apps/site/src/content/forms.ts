/**
 * Copy shared by every inquiry form (V1-7 – V1-10, V1-23, V1-24): the
 * "what happens next" steps shown beside each form, the thank-you panel, and
 * the consent line. ⏳ OV-2: AI-drafted, pending owner review — no time-bound
 * promises beyond what the PRD states (a reference is issued immediately; a
 * person replies).
 */

import type { InquiryType } from "@/lib/inquiry";

export type ThankYouCopy = {
  readonly heading: string;
  readonly intro: string;
  readonly nextSteps: readonly string[];
};

export type FormCopy = {
  /** Left column of the split form section. */
  readonly whatNextTitle: string;
  readonly whatNextIntro: string;
  readonly whatNext: readonly string[];
  /** Panel shown after a successful submission (P-13). */
  readonly success: ThankYouCopy;
};

export const formCopy: Record<InquiryType, FormCopy> = {
  contact: {
    whatNextTitle: "What happens after you write",
    whatNextIntro:
      "A real reply, tied to a reference number — not a ticket queue.",
    whatNext: [
      "You get a reference number the moment you submit.",
      "Your message lands with the InflexHub team, next to the product context if there is one.",
      "A person replies — usually with an answer, sometimes with a sharp question first.",
    ],
    success: {
      heading: "Your message is in",
      intro:
        "InflexHub has your message. Keep the reference below — it identifies your conversation if you write again.",
      nextSteps: [
        "Check your email for the confirmation details.",
        "InflexHub replies to the address you gave.",
        "For anything urgent, include the reference in a follow-up.",
      ],
    },
  },
  demo: {
    whatNextTitle: "What happens after you request a demo",
    whatNextIntro:
      "A walkthrough of the product you picked, at a time that works for you.",
    whatNext: [
      "You get a reference number the moment you submit.",
      "A person from InflexHub contacts you to confirm a time slot (Bangladesh time by default).",
      "The demo runs through the parts of the product you care about — bring your questions.",
      "Afterwards you get a follow-up with the next step, with no obligation.",
    ],
    success: {
      heading: "Your demo request is in",
      intro:
        "InflexHub has your request. Keep the reference below — it identifies your submission if you get in touch.",
      nextSteps: [
        "Check your email for the confirmation details.",
        "InflexHub contacts you to agree a time within your chosen window.",
        "Mention anything specific you want to see when they reach you.",
      ],
    },
  },
  quote: {
    whatNextTitle: "How quotations work",
    whatNextIntro:
      "A transparent price for the products you selected, built around your organisation.",
    whatNext: [
      "You get a reference number the moment you submit.",
      "InflexHub reviews the products you selected with your user count and budget range.",
      "You receive a quotation with what is included, and what costs extra is listed separately.",
      "Questions go both ways before anything is signed.",
    ],
    success: {
      heading: "Your quotation request is in",
      intro:
        "InflexHub has your request. Keep the reference below — it identifies your submission if you get in touch.",
      nextSteps: [
        "Check your email for the confirmation details.",
        "InflexHub may ask a few clarifying questions about scope and users.",
        "Your quotation follows in the reply.",
      ],
    },
  },
  custom_software: {
    whatNextTitle: "What happens after you describe your project",
    whatNextIntro:
      "From your description to a proposal you can judge — step by step.",
    whatNext: [
      "You get a reference number the moment you submit.",
      "InflexHub reads your summary and replies with questions that sharpen the scope.",
      "You receive a proposal: what would be built, in which stages, and the budget range it lands in.",
      "Work starts only when you approve the proposal.",
    ],
    success: {
      heading: "Your requirements are in",
      intro:
        "InflexHub has your project description. Keep the reference below — it identifies your submission if you get in touch.",
      nextSteps: [
        "Check your email for the confirmation details.",
        "InflexHub comes back with clarifying questions on features and scope.",
        "The proposal follows once the scope is clear.",
      ],
    },
  },
  product_interest: {
    whatNextTitle: "What registering interest means",
    whatNextIntro:
      "Coming-soon products are built when enough organisations ask for them.",
    whatNext: [
      "Your interest is counted towards the product with the reference below.",
      "You are notified when the product moves forward — a demo offer, or launch news.",
      "Registering interest creates no obligation of any kind.",
    ],
    success: {
      heading: "Your interest is registered",
      intro:
        "InflexHub knows you are waiting for this product. Keep the reference below for your records.",
      nextSteps: [
        "Watch your email for updates about this product.",
        "Your interest helps decide what gets built next.",
      ],
    },
  },
  brochure_download: {
    whatNextTitle: "About the brochure",
    whatNextIntro:
      "The brochure summarises the product: what it covers and who it is for.",
    whatNext: [
      "The download starts right after you submit.",
      "Your name and email are stored with the download so InflexHub can send you product updates.",
      "A link to the file stays available on this page afterwards.",
    ],
    success: {
      heading: "Your brochure is downloading",
      intro:
        "The PDF is on its way to your device. Keep the reference below — it identifies your download.",
      nextSteps: [
        "If the download does not start, use the link below to open the brochure.",
        "Questions about the product? The reference below connects you to this download.",
      ],
    },
  },
  partner: {
    whatNextTitle: "What happens after you apply",
    whatNextIntro:
      "A short, direct process — both sides check the fit before anything is signed.",
    whatNext: [
      "You get a reference number the moment you submit.",
      "InflexHub reviews your application: your market, services, and the products you want to work with.",
      "A conversation follows to agree how you would sell or implement, and what each side provides.",
      "The partnership terms are confirmed in writing once both sides agree.",
    ],
    success: {
      heading: "Your partner application is in",
      intro:
        "InflexHub has your application. Keep the reference below — it identifies your submission if you get in touch.",
      nextSteps: [
        "Check your email for the confirmation details.",
        "InflexHub reviews applications and replies about the next conversation.",
        "Have your service area and references ready for that talk.",
      ],
    },
  },
};

/** Consent line (BR-6) shown under every form; `link` becomes the privacy
 * policy page link. */
export const consentLabel = {
  before:
    "I agree that InflexHub stores and processes this information to reply to my request, as described in the ",
  link: "privacy policy",
  after: ".",
};
