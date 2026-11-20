import type { ProductContent } from "./types.ts";

export const content: ProductContent = {
  overview: [
    "School Management System runs the school office: admissions, student records, attendance, fees, exams, and reports — one system for the tasks that used to live in registers and files. Built for primary and secondary schools.",
  ],
  keyFeatures: [
    "Admissions and student records",
    "Class and section setup per academic year",
    "Daily attendance for teachers",
    "Fee collection with due tracking",
    "Exams, grades, and report cards",
  ],
  modules: [
    "Admissions",
    "Student records",
    "Attendance",
    "Fees",
    "Examinations and results",
    "Reports for the office and guardians",
  ],
  benefits: [
    "The office answers questions in seconds, not file searches",
    "Fee dues visible before they become arrears",
    "Results ready without retabulating marks",
  ],
  howItWorks:
    "InflexHub sets up your classes and fee structure, imports your student list, and trains the office staff. Request a demo to see a full academic year's flow.",
  faq: [
    {
      summary: "Can teachers take attendance themselves?",
      content:
        "Yes — class teachers record daily attendance, and the office sees summaries and absence patterns live.",
    },
    {
      summary: "Does it print report cards?",
      content:
        "Yes — result sheets and report cards are generated from recorded grades, in the format agreed with your school.",
    },
  ],
};
