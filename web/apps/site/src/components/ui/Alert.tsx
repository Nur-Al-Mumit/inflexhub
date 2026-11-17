/**
 * Alert (V1-1): success, danger, info (design-system §7). Danger alerts are
 * assertive (role="alert"); the others are status messages.
 */

import { CheckCircle2, Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./Alert.module.css";

export type AlertTone = "success" | "danger" | "info";

const toneMeta: Record<AlertTone, { className: string; icon: typeof Info }> = {
  success: { className: styles.success, icon: CheckCircle2 },
  danger: { className: styles.danger, icon: TriangleAlert },
  info: { className: styles.info, icon: Info },
};

export type AlertProps = {
  tone: AlertTone;
  children: ReactNode;
};

export function Alert({ tone, children }: AlertProps) {
  const { className, icon: Icon } = toneMeta[tone];
  return (
    <div
      className={[styles.alert, className].join(" ")}
      role={tone === "danger" ? "alert" : "status"}
    >
      <Icon aria-hidden="true" size={18} className={styles.icon} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
