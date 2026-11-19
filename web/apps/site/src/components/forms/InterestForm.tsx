"use client";

/**
 * InterestForm (V1-10, US-9): the one-step "register interest" form, opened
 * in a dialog from an upcoming product's card. The product is fixed
 * (upcoming or custom only, BR-2); only name and email are required, company
 * and industry optional (PRD §3.2).
 */

import { formCopy } from "@/content/forms";
import type { InquiryProduct } from "@/lib/inquiry";
import { FormPanel } from "./FormPanel";
import {
  CompanyField,
  EmailField,
  FullNameField,
  IndustrySelect,
} from "./CommonFields";
import { useInquiry } from "./useInquiry";

export type InterestFormProps = {
  /** The fixed product the visitor registers interest in. */
  readonly product: InquiryProduct & { readonly name: string };
  readonly industries: readonly { readonly slug: string; readonly name: string }[];
};

export function InterestForm({ product, industries }: InterestFormProps) {
  const form = useInquiry({
    type: "product_interest",
    products: [product],
    industries: industries.map((industry) => industry.slug),
    initialValues: { productSlugs: [product.slug] },
  });

  return (
    <FormPanel
      form={form}
      idPrefix={`interest-${product.slug}`}
      submitLabel="Register interest"
      success={formCopy.product_interest.success}
    >
      <FullNameField idPrefix={`interest-${product.slug}`} form={form} />
      <EmailField idPrefix={`interest-${product.slug}`} form={form} />
      <CompanyField idPrefix={`interest-${product.slug}`} form={form} required={false} />
      <IndustrySelect
        idPrefix={`interest-${product.slug}`}
        form={form}
        industries={industries}
      />
    </FormPanel>
  );
}
