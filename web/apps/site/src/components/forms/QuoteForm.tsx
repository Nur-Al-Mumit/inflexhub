"use client";

/**
 * QuoteForm (V1-9, US-6): the /request-quote form. One to ten products from
 * the `available` and `custom` catalog (BR-2); `?product=<slug>` preselects
 * one when it is eligible for a quotation (P-7).
 */

import { useSearchParams } from "next/navigation";
import { formCopy } from "@/content/forms";
import { eligibleProducts, limits } from "@/lib/inquiry";
import { FormPanel } from "./FormPanel";
import {
  BudgetSelect,
  CompanyField,
  CompanySizeSelect,
  CountrySelect,
  EmailField,
  FullNameField,
  IndustrySelect,
  JobTitleField,
  MessageArea,
  PhoneField,
  ProductChipsField,
  TimelineSelect,
  UserCountField,
  type NamedInquiryProduct,
} from "./CommonFields";
import { useInquiry } from "./useInquiry";
import rowStyles from "./FormRows.module.css";

export type QuoteFormProps = {
  /** All catalog products (validation context; options need names). */
  readonly products: readonly NamedInquiryProduct[];
  readonly industries: readonly { readonly slug: string; readonly name: string }[];
};

export function QuoteForm({ products, industries }: QuoteFormProps) {
  const searchParams = useSearchParams();
  const requested = searchParams.get("product") ?? "";
  const options = eligibleProducts("quote", products);
  const preselected = options.some((product) => product.slug === requested)
    ? [requested]
    : undefined;

  const form = useInquiry({
    type: "quote",
    products,
    industries: industries.map((industry) => industry.slug),
    initialValues: {
      ...(preselected ? { productSlugs: preselected } : {}),
      country: "BD",
    },
  });
  const copy = formCopy.quote;

  return (
    <FormPanel
      form={form}
      idPrefix="quote"
      submitLabel="Request a quotation"
      success={copy.success}
    >
      <ProductChipsField
        idPrefix="quote"
        form={form}
        products={options}
        legend="Products to quote"
        optional={false}
        max={limits.productsMax}
      />
      <FullNameField idPrefix="quote" form={form} />
      <EmailField idPrefix="quote" form={form} />
      <PhoneField idPrefix="quote" form={form} />
      <CompanyField idPrefix="quote" form={form} required />
      <JobTitleField idPrefix="quote" form={form} />
      <div className={rowStyles.row}>
        <IndustrySelect idPrefix="quote" form={form} industries={industries} />
        <CompanySizeSelect idPrefix="quote" form={form} />
      </div>
      <div className={rowStyles.row}>
        <UserCountField idPrefix="quote" form={form} />
        <CountrySelect idPrefix="quote" form={form} required={false} />
      </div>
      <div className={rowStyles.row}>
        <BudgetSelect idPrefix="quote" form={form} />
        <TimelineSelect idPrefix="quote" form={form} />
      </div>
      <MessageArea
        idPrefix="quote"
        form={form}
        label="Anything else relevant to the price? (optional)"
        placeholder="Modules you need, integrations, rollout plans…"
      />
    </FormPanel>
  );
}
