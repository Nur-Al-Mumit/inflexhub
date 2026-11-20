import type { ProductContent } from "./types.ts";

export const content: ProductContent = {
  overview: [
    "InflexHub POS is the point-of-sale system for retail stores and hospitality counters: fast billing, clear pricing, and stock that stays in sync with every sale. Counter staff learn it quickly; owners see what sold, when, and for how much.",
  ],
  keyFeatures: [
    "Fast counter billing with barcode and manual entry",
    "Clear pricing, discounts, and returns handling",
    "Stock reduces as you sell",
    "Shift open/close with cash reconciliation",
    "Sales reports by item, category, and time",
  ],
  modules: [
    "Billing counter",
    "Item and price management",
    "Stock awareness",
    "Shift and cash management",
    "Sales reporting",
  ],
  benefits: [
    "Shorter queues at the counter",
    "Fewer billing and pricing mistakes",
    "A clear picture of daily sales without end-of-day typing",
  ],
  howItWorks:
    "Request a demo to see the billing flow with your kind of items and prices. InflexHub sets the system up for your outlets, brings in your item list, and trains your counter staff.",
  faq: [
    {
      summary: "Does it work with a barcode scanner?",
      content:
        "Yes — standard barcode scanners work with the billing screen, and items without barcodes can be entered by search or code.",
    },
    {
      summary: "Can it handle more than one outlet?",
      content:
        "Yes. Multiple counters and outlets are supported, with sales reports per location as well as combined.",
    },
  ],
};
