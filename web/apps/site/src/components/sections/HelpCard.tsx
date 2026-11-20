/**
 * HelpCard (ui-guidelines Part B): small "still have a question?" card used
 * beside FAQs in the split Section layout.
 */

import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import styles from "./HelpCard.module.css";

export type HelpCardProps = {
  readonly title: string;
  readonly text: string;
  readonly action: { readonly href: string; readonly label: string };
};

export function HelpCard({ title, text, action }: HelpCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.icon} aria-hidden="true">
        <MessageSquare size={20} />
      </span>
      <p className={styles.title}>{title}</p>
      <p className={styles.text}>{text}</p>
      <Link href={action.href} className={styles.link}>
        {action.label}
        <ArrowRight aria-hidden="true" size={16} />
      </Link>
    </div>
  );
}
