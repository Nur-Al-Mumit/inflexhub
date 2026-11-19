/**
 * Product content index (V1-5): every catalog slug's marketing copy, keyed by
 * slug (ADR 0002). catalog.test.ts enforces that this map and the catalog hold
 * exactly the same set of slugs.
 */

import type { ProductContent } from "./types.ts";
import { content as accounting } from "./accounting.ts";
import { content as collegeUniversity } from "./college-university.ts";
import { content as crm } from "./crm.ts";
import { content as diagnosticLab } from "./diagnostic-lab.ts";
import { content as ecommerce } from "./ecommerce.ts";
import { content as erp } from "./erp.ts";
import { content as hospitalManagement } from "./hospital-management.ts";
import { content as hrmPayroll } from "./hrm-payroll.ts";
import { content as inventory } from "./inventory.ts";
import { content as lms } from "./lms.ts";
import { content as pharmacyManagement } from "./pharmacy-management.ts";
import { content as pos } from "./pos.ts";
import { content as propertyManagement } from "./property-management.ts";
import { content as restaurantManagement } from "./restaurant-management.ts";
import { content as schoolManagement } from "./school-management.ts";

export type { ProductContent } from "./types.ts";

export const productContent: Readonly<Record<string, ProductContent>> = {
  erp,
  pos,
  inventory,
  accounting,
  "hrm-payroll": hrmPayroll,
  crm,
  ecommerce,
  "school-management": schoolManagement,
  "college-university": collegeUniversity,
  lms,
  "hospital-management": hospitalManagement,
  "pharmacy-management": pharmacyManagement,
  "diagnostic-lab": diagnosticLab,
  "restaurant-management": restaurantManagement,
  "property-management": propertyManagement,
};

/** Content for one product; throws if a slug has no content (guarded by test). */
export function getProductContent(slug: string): ProductContent {
  const content = productContent[slug];
  if (!content) {
    throw new Error(`No product content for slug "${slug}".`);
  }
  return content;
}
