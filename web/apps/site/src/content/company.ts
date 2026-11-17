/**
 * Company details shown across the site (M0-6).
 *
 * ⏳ Owner validation (docs/00-product/owner-validation.md):
 * - OV-3: contact details are placeholders until the owner confirms them.
 * - OV-18: legal details (registered name, trade licence, address) are placeholders.
 * Never present these as verified facts; replace here when the owner answers.
 */

export type Company = {
  readonly name: string;
  readonly tagline: string;
  readonly email: string;
  readonly phone: string;
  readonly phoneHref: string;
  readonly location: string;
  readonly officeHours: string;
  readonly legalName: string;
  readonly tradeLicence: string;
  readonly registeredAddress: string;
  /** Copyright year, fixed at module load (Next 16 cacheComponents: no
   * render-time Date access on statically prerendered pages). */
  readonly copyrightYear: number;
};

export const company: Company = {
  name: "InflexHub",
  // OV-6: proposed tagline, pending owner approval.
  tagline: "Software that moves business forward.",
  // OV-3 placeholders:
  email: "hello@inflexhub.com",
  phone: "+880 1XXX-XXXXXX",
  phoneHref: "tel:+8801XXXXXXXXX",
  location: "Dhaka, Bangladesh",
  officeHours: "Sun–Thu 10:00–18:00 (Bangladesh time, GMT+6)",
  // OV-18 placeholders:
  legalName: "InflexHub Ltd.",
  tradeLicence: "TRAD/DNCC/XXXXXX/2026",
  registeredAddress: "Dhaka, Bangladesh",
  copyrightYear: new Date().getFullYear(),
};
