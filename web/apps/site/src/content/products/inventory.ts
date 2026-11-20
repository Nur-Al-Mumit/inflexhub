import type { ProductContent } from "./types.ts";

export const content: ProductContent = {
  overview: [
    "Inventory Management keeps track of what you have, where it is, and what you are about to run out of. From goods receipt to issue and stock counts, every movement is recorded where the whole team can see it.",
  ],
  keyFeatures: [
    "Live stock levels by item and location",
    "Goods receipt and issue workflows",
    "Low-stock awareness so nothing runs out silently",
    "Stock counts with adjustments you can review",
    "Movement history per item",
  ],
  modules: [
    "Items and categories",
    "Goods receipt",
    "Issues and transfers",
    "Stock counts",
    "Movement reports",
  ],
  benefits: [
    "No more surprise stock-outs",
    "Less capital sleeping in the wrong items",
    "Counts become a routine task, not a crisis",
  ],
  howItWorks:
    "InflexHub configures the system around your item list and locations, imports your opening stock, and trains the team on receipts, issues, and counts. Request a demo to walk through the flow.",
  faq: [
    {
      summary: "Can it track stock in more than one warehouse?",
      content:
        "Yes — stock is tracked per location, and transfers between locations are recorded movements.",
    },
    {
      summary: "Does it connect to the POS?",
      content:
        "Yes. POS sales reduce stock automatically, so the counter and the store share the same numbers.",
    },
  ],
};
