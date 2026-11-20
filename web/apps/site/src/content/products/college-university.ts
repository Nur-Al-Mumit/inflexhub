import type { ProductContent } from "./types.ts";

export const content: ProductContent = {
  overview: [
    "College & University Management covers the academic and administrative operations of higher education: programmes and semesters, course registration, faculty workloads, exams and results, and student records from enrolment to graduation. Built on request for your institution's structure.",
  ],
  keyFeatures: [
    "Programmes, departments, and semester setup",
    "Course offering and student registration",
    "Faculty assignment and workloads",
    "Exams, marks, and grade processing",
    "Student records from admission to graduation",
  ],
  modules: [
    "Academic structure",
    "Registration",
    "Faculty and teaching allocation",
    "Examinations and grading",
    "Student records and transcripts",
    "Institution reports",
  ],
  benefits: [
    "Registration runs without paper queues",
    "Results processed by rules, not by hand",
    "Transcripts and records on demand",
  ],
  howItWorks:
    "Because institutions differ, the system is configured around your programmes, credit structure, and grading rules. InflexHub scopes with the academic office, configures, migrates records, and trains staff.",
  faq: [
    {
      summary: "Can it follow our credit and grading scheme?",
      content:
        "Yes — credit weights, grade points, and GPA rules are configured as part of setup, not hard-coded.",
    },
    {
      summary: "Does it keep records for graduated students?",
      content:
        "Yes — records persist after graduation, so transcripts and verifications can be produced later.",
    },
  ],
};
