import type { ProductContent } from "./types.ts";

export const content: ProductContent = {
  overview: [
    "InflexHub ERP brings an organisation's core operations into one system: finance, inventory, procurement, human resources, and reporting on a shared data foundation. Instead of separate registers and spreadsheets, every department works from the same numbers.",
  ],
  keyFeatures: [
    "One shared database across departments",
    "Role-based access for every team",
    "Dashboards and reports built on live data",
    "Documented processes for approvals and hand-offs",
    "Structured master data for items, parties, and accounts",
  ],
  modules: [
    "Finance and accounting",
    "Inventory and warehousing",
    "Procurement",
    "Human resources",
    "Reporting and dashboards",
  ],
  benefits: [
    "One source of truth instead of parallel spreadsheets",
    "Faster period-end closes with live reporting",
    "Clear accountability through roles and approvals",
  ],
  howItWorks:
    "InflexHub scopes the modules your organisation needs, configures the system around your processes, migrates your master data, and trains your teams before go-live. The ERP is built on request, so the starting point is a conversation about scope.",
  faq: [
    {
      summary: "Which modules do we start with?",
      content:
        "You choose. Most organisations start with finance and inventory, then add modules in later phases as teams adopt the system.",
    },
    {
      summary: "Can it connect to what we already use?",
      content:
        "Yes — data import and integration points are part of the scoping conversation, so existing records come across and key connections are planned up front.",
    },
  ],
};
