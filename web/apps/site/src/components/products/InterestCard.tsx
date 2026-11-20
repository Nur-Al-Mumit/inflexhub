"use client";

/**
 * InterestCard (V1-10): one upcoming product on /upcoming — the card pattern
 * from ProductCard with a "Register interest" button (no stretched link)
 * that opens the interest form in an accessible dialog.
 */

import { useRef } from "react";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { Button } from "@/components/ui/Button";
import { FormDialog } from "@/components/forms/FormDialog";
import { InterestForm } from "@/components/forms/InterestForm";
import type { InquiryProduct } from "@/lib/inquiry";
import { productIcon } from "./productIcons";
import styles from "./InterestCard.module.css";

export type InterestProduct = InquiryProduct & {
  readonly name: string;
  readonly tagline: string;
};

export type InterestCardProps = {
  readonly product: InterestProduct;
  readonly industries: readonly { readonly slug: string; readonly name: string }[];
  /** Dialog open state lives in the grid (it honours ?product=<slug>). */
  readonly open: boolean;
  readonly onOpen: (slug: string) => void;
  readonly onClose: () => void;
};

export function InterestCard({ product, industries, open, onOpen, onClose }: InterestCardProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const Icon = productIcon(product.slug);

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <span className={styles.icon} aria-hidden="true">
          <Icon size={22} />
        </span>
        <AvailabilityBadge availability={product.availability} />
      </div>
      <h3 className={styles.name}>{product.name}</h3>
      <p className={styles.tagline}>{product.tagline}</p>
      <div className={styles.action}>
        <Button
          ref={buttonRef}
          variant="outline"
          onClick={() => onOpen(product.slug)}
        >
          Register interest
        </Button>
      </div>
      {open ? (
        <FormDialog
          title={`Register interest in ${product.name}`}
          intro="Coming-soon products are built when enough organisations ask for them — this registers yours."
          onClose={onClose}
          returnFocusTo={buttonRef}
        >
          <InterestForm product={product} industries={industries} />
        </FormDialog>
      ) : null}
    </article>
  );
}
