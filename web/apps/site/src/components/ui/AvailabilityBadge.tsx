/**
 * AvailabilityBadge (V1-1): availability is always visible (design-system §1,
 * §3): icon + text — Ready to use (check-circle, success), Built on request
 * (wrench, info), Coming soon (sparkles, upcoming).
 */

import { CheckCircle2, Sparkles, Wrench } from "lucide-react";
import styles from "./AvailabilityBadge.module.css";

export type Availability = "available" | "custom" | "upcoming";

const availabilityMeta: Record<
  Availability,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  available: {
    label: "Ready to use",
    className: styles.available,
    icon: CheckCircle2,
  },
  custom: {
    label: "Built on request",
    className: styles.custom,
    icon: Wrench,
  },
  upcoming: {
    label: "Coming soon",
    className: styles.upcoming,
    icon: Sparkles,
  },
};

export type AvailabilityBadgeProps = {
  availability: Availability;
};

export function AvailabilityBadge({ availability }: AvailabilityBadgeProps) {
  const { label, className, icon: Icon } = availabilityMeta[availability];
  return (
    <span className={`${styles.badge} ${className}`}>
      <Icon aria-hidden="true" size={14} />
      {label}
    </span>
  );
}
