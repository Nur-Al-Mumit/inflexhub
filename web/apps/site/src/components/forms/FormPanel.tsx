"use client";

/**
 * FormPanel (V1-7 – V1-10, V1-23, V1-24): the shell every inquiry form
 * renders in — the standard card (full border, one radius, --shadow-1) plus
 * the shared behaviour from design-system §9 "Forms": honeypot (BR-5), the
 * network-error Alert, the error summary linking to each field, the consent
 * checkbox (BR-6), the loading submit button, and the swap to the ThankYou
 * panel on success. Field ids follow `${idPrefix}-${field}` so the summary
 * can link to them; values are never cleared on error (NFR-7).
 */

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { consentLabel } from "@/content/forms";
import { ThankYou } from "./ThankYou";
import type { InquiryFormApi } from "./useInquiry";
import styles from "./FormPanel.module.css";

export type FormPanelProps = {
  readonly form: InquiryFormApi;
  /** Field ids follow `${idPrefix}-${field}` (error-summary anchors). */
  readonly idPrefix: string;
  readonly submitLabel: string;
  readonly children: ReactNode;
  /** Thank-you panel content (P-13). */
  readonly success: {
    readonly heading: string;
    readonly intro: string;
    readonly nextSteps: readonly string[];
  };
  /** Extra node inside the thank-you panel (the brochure download link). */
  readonly successExtra?: ReactNode;
};

export function FormPanel({
  form,
  idPrefix,
  submitLabel,
  children,
  success,
  successExtra,
}: FormPanelProps) {
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (form.focusRequest?.target === "summary") {
      summaryRef.current?.focus();
    }
  }, [form.focusRequest]);

  if (form.status === "success" && form.result) {
    return (
      <div className={styles.panel}>
        <ThankYou
          heading={success.heading}
          intro={success.intro}
          reference={form.result.reference}
          nextSteps={success.nextSteps}
        >
          {successExtra}
        </ThankYou>
      </div>
    );
  }

  const consentId = `${idPrefix}-consent`;
  const consentErrorId = `${consentId}-error`;
  const summaryLinks = Object.entries(form.shownErrors).map(([field, message]) => ({
    field,
    href: `#${idPrefix}-${field}`,
    message,
  }));

  return (
    <form className={styles.panel} onSubmit={form.submit} noValidate>
      {/* Honeypot (BR-5): hidden from people, out of the tab order. */}
      <div className={styles.honeypot}>
        <label htmlFor={`${idPrefix}-website`}>Website (leave empty)</label>
        <input
          id={`${idPrefix}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.values.website ?? ""}
          onChange={(event) => form.setValue("website", event.target.value)}
        />
      </div>

      {form.networkError ? (
        <div className={styles.alert}>
          <Alert tone="danger">{form.networkError}</Alert>
        </div>
      ) : null}

      {summaryLinks.length > 0 ? (
        <div ref={summaryRef} role="alert" tabIndex={-1} className={styles.summary}>
          <h3 className={styles.summaryTitle}>There is a problem</h3>
          <ul className={styles.summaryList}>
            {summaryLinks.map((link) => (
              <li key={link.field}>
                <a href={link.href}>{link.message}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className={styles.fields}>{children}</div>

      <div className={styles.consentBlock}>
        <Checkbox
          id={consentId}
          name="consent"
          checked={form.values.consent === true}
          invalid={Boolean(form.shownErrors.consent)}
          aria-describedby={form.shownErrors.consent ? consentErrorId : undefined}
          onChange={(event) => form.setValue("consent", event.target.checked)}
          label={
            <>
              {consentLabel.before}
              <Link href="/privacy">{consentLabel.link}</Link>
              {consentLabel.after}
            </>
          }
        />
        {form.shownErrors.consent ? (
          <p className={styles.consentError} id={consentErrorId}>
            {form.shownErrors.consent}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        size="lg"
        loading={form.status === "submitting"}
        className={styles.submit}
      >
        {submitLabel}
      </Button>
    </form>
  );
}
