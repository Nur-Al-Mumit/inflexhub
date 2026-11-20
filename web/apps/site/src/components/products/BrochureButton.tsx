"use client";

/**
 * BrochureButton (V1-23, US-13): the "Download brochure" action on a product
 * page whose catalog entry lists a brochure. Opens the soft-gate dialog
 * (name + email required, company optional); on success the download starts
 * and the dialog keeps an "open it here" link.
 */

import { useRef, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FormDialog } from "@/components/forms/FormDialog";
import { FormPanel } from "@/components/forms/FormPanel";
import {
  CompanyField,
  EmailField,
  FullNameField,
} from "@/components/forms/CommonFields";
import { useInquiry } from "@/components/forms/useInquiry";
import { formCopy } from "@/content/forms";
import type { InquiryProduct } from "@/lib/inquiry";
import styles from "./BrochureButton.module.css";

export type BrochureButtonProps = {
  /** The product with its brochure file; eligibility is fixed to it. */
  readonly product: InquiryProduct & { readonly name: string };
  /** Catalog brochure file (e.g. "pos.pdf") — the link target on success. */
  readonly brochure: string;
};

function startDownload(url: string): void {
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "";
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  } catch {
    // The visible link below still works.
  }
}

export function BrochureButton({ product, brochure }: BrochureButtonProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const downloadUrl = `/brochures/${brochure}`;

  const form = useInquiry({
    type: "brochure_download",
    products: [product],
    initialValues: { productSlugs: [product.slug] },
    onSuccess: (result) => {
      if (result.downloadUrl) {
        startDownload(result.downloadUrl);
      }
    },
  });

  return (
    <>
      <Button
        ref={buttonRef}
        size="lg"
        variant="onDarkGhost"
        onClick={() => setOpen(true)}
      >
        <Download aria-hidden="true" size={16} />
        Download brochure
      </Button>
      {open ? (
        <FormDialog
          title={`Download the ${product.name} brochure`}
          intro="Tell us who is downloading — the PDF starts right after you submit."
          onClose={() => setOpen(false)}
          returnFocusTo={buttonRef}
        >
          <FormPanel
            form={form}
            idPrefix="brochure"
            submitLabel="Download brochure"
            success={formCopy.brochure_download.success}
            successExtra={
              <ButtonLink href={downloadUrl} download className={styles.downloadLink}>
                <Download aria-hidden="true" size={16} />
                Open the brochure
              </ButtonLink>
            }
          >
            <FullNameField idPrefix="brochure" form={form} />
            <EmailField idPrefix="brochure" form={form} />
            <CompanyField idPrefix="brochure" form={form} required={false} />
          </FormPanel>
        </FormDialog>
      ) : null}
    </>
  );
}
