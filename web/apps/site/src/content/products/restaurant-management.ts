import type { ProductContent } from "./types.ts";

export const content: ProductContent = {
  overview: [
    "Restaurant Management runs the floor and the kitchen from one system: table orders, the kitchen queue, menu and pricing, and the day's numbers. Coming soon — for restaurants and food service teams.",
  ],
  keyFeatures: [
    "Table and takeaway orders",
    "Kitchen display queue",
    "Menu with prices and variants",
    "Bill settlement and shift close",
    "Daily sales and item reports",
  ],
  modules: [
    "Orders",
    "Kitchen queue",
    "Menu management",
    "Billing",
    "Reports",
  ],
  benefits: [
    "Orders reach the kitchen without a runner",
    "Menu changes take effect immediately",
    "The day reconciles without a calculator",
  ],
  howItWorks:
    "Restaurant Management is upcoming. Register interest to be notified when it is ready for a demo.",
  faq: [
    {
      summary: "Does it work for takeaway only?",
      content:
        "Yes — the flow works for dine-in tables, takeaway, or both; the setup matches your service.",
    },
    {
      summary: "Can the menu differ by time of day?",
      content:
        "Menu scheduling (breakfast, lunch, dinner) is part of the planned scope and will be confirmed with early users.",
    },
  ],
};
