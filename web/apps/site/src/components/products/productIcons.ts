/**
 * Decorative icons per product and industry slug (design-system §7: product
 * card icon tile). Presentation only — never shown without a text label.
 */

import {
  BookOpen,
  Boxes,
  Briefcase,
  Building2,
  Calculator,
  Factory,
  FlaskConical,
  GraduationCap,
  HandHeart,
  Handshake,
  HeartPulse,
  Hospital,
  House,
  type LucideIcon,
  Package,
  Pill,
  ScanBarcode,
  School,
  ShoppingCart,
  Store,
  Truck,
  Users,
  UtensilsCrossed,
} from "lucide-react";

const productIcons: Record<string, LucideIcon> = {
  erp: Boxes,
  pos: ScanBarcode,
  inventory: Package,
  accounting: Calculator,
  "hrm-payroll": Users,
  crm: Handshake,
  ecommerce: ShoppingCart,
  "school-management": School,
  "college-university": GraduationCap,
  lms: BookOpen,
  "hospital-management": Hospital,
  "pharmacy-management": Pill,
  "diagnostic-lab": FlaskConical,
  "restaurant-management": UtensilsCrossed,
  "property-management": House,
};

const industryIcons: Record<string, LucideIcon> = {
  retail: Store,
  manufacturing: Factory,
  education: GraduationCap,
  healthcare: HeartPulse,
  hospitality: UtensilsCrossed,
  "real-estate": Building2,
  logistics: Truck,
  "professional-services": Briefcase,
  ngo: HandHeart,
};

export function productIcon(slug: string): LucideIcon {
  return productIcons[slug] ?? Boxes;
}

export function industryIcon(slug: string): LucideIcon {
  return industryIcons[slug] ?? Building2;
}
