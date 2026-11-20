/**
 * Industry content (V1-6). ⏳ OV-2: AI-drafted, pending owner review — the
 * challenges describe common operations per industry, kept modest and free of
 * invented numbers or client references. Keyed by catalog industry slug; a
 * test enforces parity with catalog/products.json.
 */

export type IndustryContent = {
  /** One-sentence framing used in the industry hero. */
  readonly intro: string;
  /** Operational challenges this industry brings to software. */
  readonly challenges: readonly string[];
  /** Why InflexHub fits: short paragraphs for the "why" section. */
  readonly why: readonly { readonly title: string; readonly text: string }[];
};

export const industryContent: Readonly<Record<string, IndustryContent>> = {
  retail: {
    intro:
      "Retail runs on fast counters, accurate stock, and knowing what sells — across one shop or many.",
    challenges: [
      "Stock records that disagree with the shelves",
      "Slow billing at peak hours",
      "No clear picture of which items actually earn",
      "Prices and discounts that live in someone's head",
    ],
    why: [
      {
        title: "Counter and stock in one system",
        text: "POS sales reduce stock immediately, so the shelf and the system stop arguing.",
      },
      {
        title: "Numbers that lead to decisions",
        text: "Item-level sales reports show what to reorder and what to retire.",
      },
    ],
  },
  manufacturing: {
    intro:
      "Manufacturing lives on materials, capacity, and cost — tracked together, not in separate ledgers.",
    challenges: [
      "Material and finished-goods stock tracked apart",
      "Costs that surface only at period end",
      "Production plans disconnected from procurement",
      "Overtime and payroll counted by hand",
    ],
    why: [
      {
        title: "One flow from material to delivery",
        text: "ERP ties inventory, procurement, and reporting into one record of the truth.",
      },
      {
        title: "People counted fairly",
        text: "HRM & Payroll turns attendance into payroll without a spreadsheet marathon.",
      },
    ],
  },
  education: {
    intro:
      "Education administration is registrars, fees, exams, and records — precise work at volume.",
    challenges: [
      "Registration and fee queues at term start",
      "Marks retabulated by hand every exam cycle",
      "Student records scattered across files",
      "Communication with guardians left to notes",
    ],
    why: [
      {
        title: "Built for academic cycles",
        text: "School and college systems follow terms, sections, and exams — not generic folders.",
      },
      {
        title: "Records that outlast the year",
        text: "From admission to transcript, every record stays retrievable.",
      },
    ],
  },
  healthcare: {
    intro:
      "Healthcare needs patient flow and records it can trust — under real time pressure.",
    challenges: [
      "Patient files that live on paper",
      "Appointments balanced against doctors' real schedules",
      "Lab orders and results chased by phone",
      "Billing that must be exact, every time",
    ],
    why: [
      {
        title: "The visit, end to end",
        text: "Hospital Management follows the patient from registration to billing on one record.",
      },
      {
        title: "Tests that keep their identity",
        text: "Diagnostic & Lab Management tracks each sample from order to report.",
      },
    ],
  },
  hospitality: {
    intro:
      "Hospitality is speed with a smile — orders, kitchen, and the bill all in motion at once.",
    challenges: [
      "Orders shouted or run to the kitchen",
      "Menu changes that never reach the counter",
      "End-of-day cash that only balances with luck",
    ],
    why: [
      {
        title: "Floor and kitchen in sync",
        text: "Restaurant Management sends orders to a kitchen queue the moment they are taken.",
      },
      {
        title: "The day closes itself",
        text: "Sales reconcile per shift, so closing is a report — not a calculator.",
      },
    ],
  },
  "real-estate": {
    intro:
      "Property is a portfolio of units, tenants, leases, and rent — each with dates that matter.",
    challenges: [
      "Unit status spread across notebooks",
      "Rent dues noticed only when they age",
      "Maintenance requests that disappear",
    ],
    why: [
      {
        title: "The portfolio at a glance",
        text: "Property Management keeps every unit, tenant, and lease date in one view.",
      },
      {
        title: "Nothing slips",
        text: "Rent schedules and maintenance requests carry their own status.",
      },
    ],
  },
  logistics: {
    intro:
      "Logistics moves goods through hands and vehicles — and lives or dies by accurate records.",
    challenges: [
      "Consignments tracked by phone calls",
      "Stock in transit invisible to the system",
      "Deliveries reconciled after the fact",
    ],
    why: [
      {
        title: "Movement as records",
        text: "Inventory Management records transfers and movements, so goods in transit still count.",
      },
      {
        title: "One chain from warehouse to customer",
        text: "ERP ties distribution into finance and reporting.",
      },
    ],
  },
  "professional-services": {
    intro:
      "Professional services sell expertise — clients, engagements, time, and invoices.",
    challenges: [
      "Leads and follow-ups living in inboxes",
      "Engagement profitability guessed, not measured",
      "Books that lag behind the work",
    ],
    why: [
      {
        title: "Every client conversation kept",
        text: "CRM keeps the timeline, the follow-ups, and the pipeline in one place.",
      },
      {
        title: "Clean books, less friction",
        text: "Accounting keeps vouchers and receivables current without the month-end scramble.",
      },
    ],
  },
  ngo: {
    intro:
      "NGOs answer to programmes, donors, and people in the field — transparency is the job.",
    challenges: [
      "Programme spending reported by hand",
      "Payroll for field teams assembled monthly",
      "Donor reports that retrace half-remembered numbers",
    ],
    why: [
      {
        title: "Spending that reports itself",
        text: "Accounting keeps programme costs classified as they happen, not reconstructed later.",
      },
      {
        title: "Field teams paid on time",
        text: "HRM & Payroll turns attendance into payslips, wherever the team works.",
      },
    ],
  },
};

export function getIndustryContent(slug: string): IndustryContent {
  const content = industryContent[slug];
  if (!content) {
    throw new Error(`No industry content for slug "${slug}".`);
  }
  return content;
}
