import type { ProductContent } from "./types.ts";

export const content: ProductContent = {
  overview: [
    "Hospital Management System coordinates the daily flow of a hospital or clinic: patient registration, appointments, doctors' schedules, billing, and records — so the front desk, doctors, and accounts work from the same information. Built on request around your facility.",
  ],
  keyFeatures: [
    "Patient registration and records",
    "Appointments and doctor schedules",
    "Departments and consultations",
    "Service billing and payments",
    "Daily reports for the administration",
  ],
  modules: [
    "Patients",
    "Appointments and scheduling",
    "Clinical records",
    "Billing and payments",
    "Administration reports",
  ],
  benefits: [
    "Shorter queues at registration",
    "Doctors find the patient's history, not a paper file",
    "The administration sees the day in numbers",
  ],
  howItWorks:
    "InflexHub scopes your departments, services, and fee structure, configures the system, and trains front desk and clinical staff before go-live.",
  faq: [
    {
      summary: "Can it handle multiple departments?",
      content:
        "Yes — departments, their services, and doctor schedules are configured per facility.",
    },
    {
      summary: "How is patient data protected?",
      content:
        "Access is role-based and patient data handling follows the privacy standards described in InflexHub's privacy policy.",
    },
  ],
};
