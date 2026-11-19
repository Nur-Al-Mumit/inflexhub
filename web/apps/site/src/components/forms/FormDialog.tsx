"use client";

/**
 * FormDialog (V1-10, V1-23): the accessible dialog the register-interest and
 * brochure forms open in. While open, focus is trapped inside (Tab cycles),
 * Escape closes, body scroll is locked, and focus returns to the trigger on
 * close. Clicking the overlay does NOT close it — a stray click must not
 * throw away what the visitor typed (NFR-7).
 *
 * The overlay is portaled to document.body: dialogs open from inside cards
 * whose reveal animations apply a transform, and a transformed ancestor
 * would become the containing block for the fixed overlay.
 */

import { useEffect, useId, useRef, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import styles from "./FormDialog.module.css";

function focusableIn(root: HTMLElement | null): HTMLElement[] {
  if (!root) {
    return [];
  }
  return [
    ...root.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary",
    ),
  ];
}

export type FormDialogProps = {
  readonly title: string;
  readonly intro?: string;
  readonly onClose: () => void;
  /** The trigger element; focus returns to it when the dialog closes. */
  readonly returnFocusTo: RefObject<HTMLElement | null>;
  readonly children: ReactNode;
};

export function FormDialog({ title, intro, onClose, returnFocusTo, children }: FormDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // The panel itself receives focus first, so the dialog is announced from
    // its title; Tab then reaches the close button and the form fields.
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      returnFocusTo.current?.focus();
    };
  }, [returnFocusTo]);

  return createPortal(
    <div className={styles.overlay}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={styles.panel}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onClose();
            return;
          }
          if (event.key !== "Tab") {
            return;
          }
          const focusables = focusableIn(panelRef.current);
          if (focusables.length === 0) {
            return;
          }
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          const active = document.activeElement;
          if (event.shiftKey && active === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <div className={styles.head}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.close}
            aria-label={`Close ${title.toLowerCase()}`}
            onClick={onClose}
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>
        {intro ? <p className={styles.intro}>{intro}</p> : null}
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
