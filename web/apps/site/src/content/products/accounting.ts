import type { ProductContent } from "./types.ts";

export const content: ProductContent = {
  overview: [
    "Accounting Software keeps the books in order: vouchers, ledgers, and reports for daily bookkeeping through to period closing. It is built for small and medium organisations that need clear, disciplined accounts without a complex finance department.",
  ],
  keyFeatures: [
    "Day books for cash and bank",
    "Ledgers and a clean chart of accounts",
    "Receivables and payables tracking",
    "Period closing with trial balance",
    "Reports owners and accountants both understand",
  ],
  modules: [
    "Vouchers and day books",
    "General ledger",
    "Receivables and payables",
    "Period closing",
    "Financial reports",
  ],
  benefits: [
    "Books that are current, not months behind",
    "Clear answers on who owes what",
    "Closing a period without panic",
  ],
  howItWorks:
    "InflexHub sets up your chart of accounts, imports opening balances, and trains your bookkeeper on the daily flow. Request a demo to see the reports you would work with.",
  faq: [
    {
      summary: "Can my accountant use it alongside me?",
      content:
        "Yes — access is role-based, so an accountant can review and post while daily entry stays with your team.",
    },
    {
      summary: "Does it handle multiple currencies?",
      content:
        "Foreign-currency transactions are part of the scoping conversation; the core books work in your reporting currency.",
    },
  ],
};
