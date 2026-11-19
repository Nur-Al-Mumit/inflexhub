"use client";

/**
 * useInquiry (V1-7 – V1-10, V1-23, V1-24): the shared behaviour of every
 * inquiry form (design-system §9 "Forms"). All rules live in the pure
 * src/lib/inquiry.ts; this hook wires them to React state:
 * validate on blur and on submit, revalidate a field once it was touched,
 * never clear values on error (NFR-7), honeypot + consent + loading submit,
 * POST to /api/inquiries (the site route handler; V1-13) and map the api-spec
 * error paths (400 field errors, 422 product-not-eligible, 429 rate limit,
 * network failure) to the UI.
 *
 * Values and the touched-field set are mirrored into refs because the
 * handlers need the latest state without stale closures; only `values`,
 * `shownErrors` and the status flags drive rendering.
 */

import { useCallback, useMemo, useRef, useState, type FormEvent } from "react";
import {
  buildPayload,
  validateInquiry,
  type FieldErrors,
  type InquiryProduct,
  type InquiryResult,
  type InquiryType,
  type InquiryValues,
} from "@/lib/inquiry";
import { formSource } from "@/lib/source";

export type SubmitStatus = "idle" | "submitting" | "success";

export type FocusRequest = { readonly target: "summary" | "success"; readonly nonce: number };

export type UseInquiryOptions = {
  readonly type: InquiryType;
  /** Eligible catalog products (validation context + option source). */
  readonly products: readonly InquiryProduct[];
  /** Catalog industry slugs (the `industry` rule allows these or `other`). */
  readonly industries?: readonly string[];
  readonly initialValues?: InquiryValues;
  /** Called once on success (the brochure form starts its download here). */
  readonly onSuccess?: (result: InquiryResult) => void;
};

export type InquiryFormApi = {
  readonly values: InquiryValues;
  readonly shownErrors: FieldErrors;
  readonly status: SubmitStatus;
  readonly result: InquiryResult | null;
  readonly networkError: string | null;
  readonly focusRequest: FocusRequest | null;
  readonly setValue: (field: keyof InquiryValues, value: string | boolean | readonly string[]) => void;
  readonly toggleProduct: (slug: string) => void;
  readonly blur: (field: string) => void;
  readonly submit: (event: FormEvent) => void;
};

const GENERIC_ERROR =
  "Something went wrong while sending your request. Nothing you typed was lost — check your connection and try again.";

function resolveTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Dhaka";
  } catch {
    return "Asia/Dhaka";
  }
}

/** Picks the first validation ProblemDetails message per field. */
function problemDetailsErrors(body: unknown): FieldErrors {
  if (typeof body !== "object" || body === null) {
    return {};
  }
  const errors = (body as { errors?: Record<string, unknown> }).errors;
  if (typeof errors !== "object" || errors === null) {
    return {};
  }
  const mapped: FieldErrors = {};
  for (const [field, messages] of Object.entries(errors)) {
    const first = Array.isArray(messages) ? messages[0] : messages;
    if (typeof first === "string" && first !== "") {
      mapped[field] = first;
    }
  }
  return mapped;
}

export function useInquiry({
  type,
  products,
  industries,
  initialValues,
  onSuccess,
}: UseInquiryOptions): InquiryFormApi {
  const [values, setValues] = useState<InquiryValues>(initialValues ?? {});
  const [shownErrors, setShownErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [result, setResult] = useState<InquiryResult | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null);

  const valuesRef = useRef(values);
  const touchedRef = useRef<ReadonlySet<string>>(new Set());

  const context = useMemo(
    () => ({ products, industries }),
    [products, industries],
  );

  const errorsFor = useCallback(
    (current: InquiryValues): FieldErrors =>
      validateInquiry(type, current, { ...context, now: new Date() }),
    [type, context],
  );

  /** Re-shows the error state of `fields` against `current` values. */
  const refreshFields = useCallback(
    (current: InquiryValues, fields: readonly string[]) => {
      const all = errorsFor(current);
      setShownErrors((previous) => {
        const next = { ...previous };
        for (const field of fields) {
          const error = all[field];
          if (error) {
            next[field] = error;
          } else {
            delete next[field];
          }
        }
        return next;
      });
    },
    [errorsFor],
  );

  const setValue = useCallback<InquiryFormApi["setValue"]>(
    (field, value) => {
      const next = { ...valuesRef.current, [field]: value };
      valuesRef.current = next;
      setValues(next);
      if (touchedRef.current.has(field)) {
        refreshFields(next, [field]);
      }
    },
    [refreshFields],
  );

  const toggleProduct = useCallback(
    (slug: string) => {
      const current = valuesRef.current.productSlugs ?? [];
      const next = current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug];
      setValue("productSlugs", next);
    },
    [setValue],
  );

  const blur = useCallback(
    (field: string) => {
      const nextTouched = new Set(touchedRef.current);
      nextTouched.add(field);
      touchedRef.current = nextTouched;
      refreshFields(valuesRef.current, [field]);
    },
    [refreshFields],
  );

  const submit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const current = valuesRef.current;
      const errors = errorsFor(current);
      if (Object.keys(errors).length > 0) {
        setShownErrors(errors);
        touchedRef.current = new Set(Object.keys(errors));
        setNetworkError(null);
        setFocusRequest({ target: "summary", nonce: Date.now() });
        return;
      }

      setStatus("submitting");
      setNetworkError(null);

      const payload = buildPayload(
        type,
        type === "demo" ? { ...current, timeZone: resolveTimeZone() } : current,
        formSource(),
      );

      void (async () => {
        try {
          const response = await fetch("/api/inquiries", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            const body = (await response.json()) as InquiryResult;
            setResult(body);
            setStatus("success");
            setFocusRequest({ target: "success", nonce: Date.now() });
            onSuccess?.(body);
            return;
          }

          let body: unknown = null;
          try {
            body = await response.json();
          } catch {
            // Not JSON (e.g. the route handler does not exist yet): the
            // generic failure message below applies.
          }

          if (response.status === 422) {
            setShownErrors({
              productSlugs:
                "One of the selected products does not accept this kind of request.",
            });
            setFocusRequest({ target: "summary", nonce: Date.now() });
          } else if (response.status === 400) {
            const serverErrors = problemDetailsErrors(body);
            if (Object.keys(serverErrors).length > 0) {
              setShownErrors(serverErrors);
              setFocusRequest({ target: "summary", nonce: Date.now() });
            } else {
              setNetworkError(GENERIC_ERROR);
            }
          } else if (response.status === 429) {
            const seconds = Number(response.headers.get("retry-after"));
            const minutes =
              Number.isFinite(seconds) && seconds > 0
                ? Math.max(1, Math.ceil(seconds / 60))
                : null;
            setNetworkError(
              minutes === null
                ? "Too many requests from your network — please try again in a few minutes."
                : `Too many requests from your network — please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
            );
          } else {
            setNetworkError(GENERIC_ERROR);
          }
        } catch {
          setNetworkError(GENERIC_ERROR);
        } finally {
          setStatus((currentStatus) =>
            currentStatus === "success" ? currentStatus : "idle",
          );
        }
      })();
    },
    [errorsFor, onSuccess, type],
  );

  return {
    values,
    shownErrors,
    status,
    result,
    networkError,
    focusRequest,
    setValue,
    toggleProduct,
    blur,
    submit,
  };
}
