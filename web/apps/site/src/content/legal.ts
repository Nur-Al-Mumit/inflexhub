/**
 * Legal page copy (V1-11, PRD P-11).
 *
 * ⏳ Owner validation (docs/00-product/owner-validation.md):
 * - OV-7: both texts are generic drafts; a lawyer must review before launch.
 * - OV-14: the retention period is a proposal (3 years, then anonymised).
 * - OV-19: the applicable Bangladesh data-protection law and hosting
 *   location are not yet confirmed; the text stays generic on both.
 * - OV-18: registered name, trade licence, and address are placeholders.
 */

export type LegalSection = {
  readonly heading: string;
  readonly paragraphs: readonly string[];
  /** Optional bulleted list under the paragraphs. */
  readonly bullets?: readonly string[];
  /** Optional action link under the paragraphs (e.g. the report address). */
  readonly link?: { readonly href: string; readonly label: string };
};

export type LegalDocument = {
  readonly eyebrow: string;
  readonly title: string;
  readonly intro: string;
  readonly lastUpdated: string;
  /** Overrides the default "last updated" line (e.g. "Last reviewed …"). */
  readonly updatedLabel?: string;
  readonly sections: readonly LegalSection[];
};

export const privacy: LegalDocument = {
  eyebrow: "Legal",
  title: "Privacy policy",
  intro:
    "What InflexHub collects through this website, why, for how long, and the rights you have over it.",
  lastUpdated: "17 November 2026",
  sections: [
    {
      heading: "Who is responsible",
      paragraphs: [
        "This website is operated by InflexHub Ltd. (trade licence TRAD/DNCC/XXXXXX/2026, registered address Dhaka, Bangladesh — OV-18 placeholders). For any privacy question or request, write to hello@inflexhub.com (OV-3).",
      ],
    },
    {
      heading: "What is collected",
      paragraphs: [
        "The website has no accounts and sets no tracking cookies. The only personal data collected is what you submit through a form:",
      ],
      bullets: [
        "Contact details: your name, email address, and — where you provide them — phone number, company, job title, city or region, and country.",
        "The content of your request: subject, message, project details, product selections, and the form fields that go with them (budget range, timeline, preferred demo time).",
        "Technical context: the page you submitted from, the site that referred you, and campaign parameters (utm_*) when they are present in the URL. IP addresses are stored only in hashed form (salted SHA-256) for abuse protection.",
      ],
    },
    {
      heading: "Why it is processed (legal basis)",
      paragraphs: [
        "Form submissions are processed to answer your request and prepare a possible business relationship (steps before a contract, and our legitimate interest in responding to sales inquiries). The privacy-policy checkbox you tick is your consent to this processing; the time of consent is stored with your submission.",
        "Hashed IP addresses are processed for protection against automated abuse, based on legitimate interest. No data is used for advertising or profiling, and nothing is sold.",
      ],
    },
    {
      heading: "Who receives the data",
      paragraphs: [
        "Your submission is stored in InflexHub's database. It is disclosed only to the service providers that operate our infrastructure (hosting, email delivery) under contract, and otherwise only where the law requires it. When a sales notification is sent, it goes to InflexHub staff mailboxes only.",
      ],
    },
    {
      heading: "How long it is kept",
      paragraphs: [
        "Inquiries are kept for 3 years after the last contact, then anonymised (OV-14 proposal — the final period will be confirmed with legal review). Honeypot-trapped bot submissions are not stored at all.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "You can ask for a copy of your data, ask for corrections, ask for deletion, object to processing, or request that your data be transferred to you. Write to hello@inflexhub.com from the email address you used; requests are answered within a reasonable period. If you are unsatisfied, you may complain to the competent supervisory authority.",
      ],
    },
    {
      heading: "Security",
      paragraphs: [
        "The site is served over HTTPS, form submissions travel server-to-server inside the operator's network, and access to the database is restricted. No system is perfectly secure; if a breach affects your data, you will be informed.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "If this policy changes, the new version appears on this page with a new “last updated” date. Substantial changes are announced on the website.",
      ],
    },
  ],
};

export const terms: LegalDocument = {  eyebrow: "Legal",
  title: "Terms of use",
  intro:
    "The rules for using this website. Quotations, projects, and partnerships are governed by their own written agreements.",
  lastUpdated: "17 November 2026",
  sections: [
    {
      heading: "The offer on this website",
      paragraphs: [
        "This website presents InflexHub's product catalog and lets you send inquiries. Product descriptions, availability states, and prices or budget ranges shown here are indicative; only a written quotation or agreement is binding.",
      ],
    },
    {
      heading: "Acceptable use",
      paragraphs: [
        "You agree to use the website and its forms lawfully, to submit accurate information about yourself, and not to attempt to disrupt, overload, or probe the service. Automated mass submission is blocked and not stored.",
      ],
    },
    {
      heading: "Inquiries are not contracts",
      paragraphs: [
        "Sending a form creates an inquiry, not an order, contract, or obligation for either side. InflexHub may decline any request, for example when a requirement falls outside what the company can deliver.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        "The website's design, texts, and the InflexHub name and logo are protected. Product names and catalog content may not be copied for competing offerings.",
      ],
    },
    {
      heading: "Availability and liability",
      paragraphs: [
        "The website is provided “as is”. InflexHub works to keep it available and correct but does not guarantee uninterrupted availability or the absence of errors. To the extent permitted by law, liability for the use of this website is limited to intent and gross negligence.",
      ],
    },
    {
      heading: "Links and third parties",
      paragraphs: [
        "Links to third-party sites are provided for convenience; their content and practices are not InflexHub's responsibility.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: [
        "These terms are governed by the laws of Bangladesh (OV-19: the applicable data-protection statute is pending legal confirmation); the courts of Dhaka have jurisdiction.",
      ],
    },
    {
      heading: "Changes",
      paragraphs: [
        "InflexHub may update these terms; the current version is always on this page with its “last updated” date.",
      ],
    },
  ],
};

/**
 * Accessibility statement (V1-31, PRD P-11, US-17): target, how the site is
 * built, known limitations, how to report a problem, date of last review
 * (pages-and-flows "/accessibility"). ⏳ OV-2: draft wording pending owner
 * review; the feedback address is the OV-3 placeholder.
 */
export const accessibility: LegalDocument = {
  eyebrow: "Accessibility",
  title: "Accessibility statement",
  intro:
    "InflexHub wants this website usable by everyone, including people using screen readers, keyboard navigation, or reduced-motion settings.",
  lastUpdated: "20 November 2026",
  updatedLabel: "Last reviewed",
  sections: [
    {
      heading: "Conformance target",
      paragraphs: [
        "This website aims to meet WCAG 2.2 level AA. Conformance is checked in three ways: keyboard-only walk-throughs of every interactive flow, automated accessibility tests on the key pages, and manual checks of contrast, focus visibility, and motion at phone and desktop widths.",
      ],
    },
    {
      heading: "How the site is built",
      paragraphs: [
        "Accessibility is part of the site's design baseline, not an afterthought:",
      ],
      bullets: [
        "Every interactive element is a native link, button, input, or select, with a visible label and a visible focus ring.",
        "Forms validate as you go, show an error summary at the top that links to each problem, and never delete what you typed.",
        "Dialogs trap keyboard focus while open, close with Escape, and return focus to the element that opened them.",
        "Motion is subtle and short; when your system requests reduced motion, transitions and reveals are switched off.",
        "Colour contrast uses a checked token set; colour is never the only signal for state or availability.",
        "Pages are laid out to work from 360 pixel phone widths upward, with no horizontal scrolling.",
      ],
    },
    {
      heading: "Known limitations",
      paragraphs: [
        "No accessibility problems are currently known on this website. Two things are worth stating plainly:",
      ],
      bullets: [
        "Product brochures, once published, are PDF documents; their accessibility depends on the source document, and InflexHub aims to provide tagged, searchable PDFs.",
        "Automated tests catch many issues but not all — if something is hard or impossible to use, the report below is the fastest route to a fix.",
      ],
    },
    {
      heading: "Report a problem",
      paragraphs: [
        "Write with the page address and what happened; please include the browser and device if you can. Reports are treated as bugs and answered in the order they arrive.",
      ],
      link: { href: "mailto:hello@inflexhub.com", label: "hello@inflexhub.com" },
    },
    {
      heading: "Assessment approach",
      paragraphs: [
        "This statement reflects the site as of the review date above. The site is reassessed whenever significant changes ship.",
      ],
    },
  ],
};
