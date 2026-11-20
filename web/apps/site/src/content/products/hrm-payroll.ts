import type { ProductContent } from "./types.ts";

export const content: ProductContent = {
  overview: [
    "HRM & Payroll manages the employee lifecycle from joining to exit — records, leave, attendance, and a payroll run you can trust. It is built for teams that have outgrown spreadsheets but do not want a heavy HR department's tooling.",
  ],
  keyFeatures: [
    "Employee records in one place",
    "Leave types, balances, and approvals",
    "Attendance input for payroll",
    "Monthly payroll run with clear payslips",
    "Reports for headcount, leave, and payroll",
  ],
  modules: [
    "Employee records",
    "Leave management",
    "Attendance",
    "Payroll",
    "HR reports",
  ],
  benefits: [
    "Payday without spreadsheet gymnastics",
    "Leave balances that answer themselves",
    "A clear record for every employee",
  ],
  howItWorks:
    "InflexHub imports your employee list, configures leave types and salary structures, and runs a parallel payroll with you before go-live. Request a demo to see the payroll flow.",
  faq: [
    {
      summary: "Can it calculate deductions and additions per employee?",
      content:
        "Yes — salary structures hold each employee's additions and deductions, and the monthly run applies them consistently.",
    },
    {
      summary: "Do employees get their own access?",
      content:
        "Employee self-service for leave requests and payslips is part of the scoping conversation; the core system covers the HR team's flow.",
    },
  ],
};
