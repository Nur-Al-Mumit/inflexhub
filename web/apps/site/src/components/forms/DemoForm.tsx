"use client";

/**
 * DemoForm (V1-8, US-5): the /request-demo form. Product options are the
 * `available` products (BR-2); `?product=<slug>` preselects one when it is
 * eligible for a demo, and is ignored otherwise (P-6).
 */

import { useSearchParams } from "next/navigation";
import { Field } from "@/components/ui/Field";
import { TextInput } from "@/components/ui/TextInput";
import { formCopy } from "@/content/forms";
import { eligibleProducts, limits } from "@/lib/inquiry";
import { FormPanel } from "./FormPanel";
import {
  CompanyField,
  CompanySizeSelect,
  CountrySelect,
  EmailField,
  FullNameField,
  IndustrySelect,
  JobTitleField,
  MessageArea,
  PhoneField,
  ProductSelectField,
  TimeWindowSelect,
  type NamedInquiryProduct,
} from "./CommonFields";
import { useInquiry } from "./useInquiry";
import rowStyles from "./FormRows.module.css";

export type DemoFormProps = {
  /** All catalog products (validation context; options need names). */
  readonly products: readonly NamedInquiryProduct[];
  readonly industries: readonly { readonly slug: string; readonly name: string }[];
};

export function DemoForm({ products, industries }: DemoFormProps) {
  const searchParams = useSearchParams();
  const requested = searchParams.get("product") ?? "";
  const options = eligibleProducts("demo", products);
  const preselected = options.some((product) => product.slug === requested)
    ? [requested]
    : undefined;

  const form = useInquiry({
    type: "demo",
    products,
    industries: industries.map((industry) => industry.slug),
    initialValues: preselected
      ? { productSlugs: preselected, country: "BD" }
      : { country: "BD" },
  });
  const copy = formCopy.demo;

  return (
    <FormPanel
      form={form}
      idPrefix="demo"
      submitLabel="Request a demo"
      success={copy.success}
    >
      <ProductSelectField idPrefix="demo" form={form} products={options} />
      <FullNameField idPrefix="demo" form={form} />
      <EmailField idPrefix="demo" form={form} />
      <PhoneField idPrefix="demo" form={form} />
      <CompanyField idPrefix="demo" form={form} required />
      <JobTitleField idPrefix="demo" form={form} />
      <div className={rowStyles.row}>
        <Field
          id="demo-preferredDate"
          label="Preferred date (optional)"
          help="Up to 180 days ahead, in Bangladesh time."
          error={form.shownErrors.preferredDate}
        >
          <TextInput
            type="date"
            value={form.values.preferredDate ?? ""}
            onChange={(event) => form.setValue("preferredDate", event.target.value)}
            onBlur={() => form.blur("preferredDate")}
          />
        </Field>
        <TimeWindowSelect idPrefix="demo" form={form} />
      </div>
      <div className={rowStyles.row}>
        <IndustrySelect idPrefix="demo" form={form} industries={industries} />
        <CompanySizeSelect idPrefix="demo" form={form} />
      </div>
      <CountrySelect idPrefix="demo" form={form} required={false} />
      <MessageArea
        idPrefix="demo"
        form={form}
        label="Anything specific to show in the demo? (optional)"
        placeholder="Processes to cover, questions to answer…"
        help={`Up to ${limits.messageMax.toLocaleString("en")} characters.`}
      />
    </FormPanel>
  );
}
