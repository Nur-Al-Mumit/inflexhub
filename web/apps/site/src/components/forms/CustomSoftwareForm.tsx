"use client";

/**
 * CustomSoftwareForm (V1-7, US-7): the /custom-software requirements form.
 * The project summary (message) is required at 30–5,000 characters; features,
 * reference links and the current system travel in `details`
 * (api-spec: custom_software); catalog products are optional context.
 */

import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Textarea";
import { formCopy } from "@/content/forms";
import { limits } from "@/lib/inquiry";
import { FormPanel } from "./FormPanel";
import {
  BudgetSelect,
  CompanyField,
  CompanySizeSelect,
  CountrySelect,
  CurrentSystemField,
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

export type CustomSoftwareFormProps = {
  /** All catalog products (validation context + optional related products). */
  readonly products: readonly NamedInquiryProduct[];
  readonly industries: readonly { readonly slug: string; readonly name: string }[];
};

export function CustomSoftwareForm({ products, industries }: CustomSoftwareFormProps) {
  const form = useInquiry({
    type: "custom_software",
    products,
    industries: industries.map((industry) => industry.slug),
    initialValues: { country: "BD" },
  });
  const copy = formCopy.custom_software;

  return (
    <FormPanel
      form={form}
      idPrefix="custom"
      submitLabel="Send requirements"
      success={copy.success}
    >
      <FullNameField idPrefix="custom" form={form} />
      <EmailField idPrefix="custom" form={form} />
      <PhoneField idPrefix="custom" form={form} />
      <CompanyField idPrefix="custom" form={form} required />
      <JobTitleField idPrefix="custom" form={form} />
      <MessageArea
        idPrefix="custom"
        form={form}
        label="Project summary"
        placeholder="What should the software do, for whom, and which problem does it solve today?"
        help={`At least ${limits.customMessageMin} characters — the more specific, the sharper the proposal.`}
      />
      <Field
        id="custom-features"
        label="Features you need (optional)"
        help="One feature per line works well."
        error={form.shownErrors.features}
      >
        <Textarea
          rows={4}
          maxLength={limits.messageMax}
          placeholder={"Billing with VAT\nStudent attendance\nOffline mode…"}
          value={form.values.features ?? ""}
          onChange={(event) => form.setValue("features", event.target.value)}
          onBlur={() => form.blur("features")}
        />
      </Field>
      <Field
        id="custom-referenceLinks"
        label="Reference links (optional)"
        help="Systems or examples to look at, one per line."
        error={form.shownErrors.referenceLinks}
      >
        <Textarea
          rows={3}
          maxLength={limits.messageMax}
          placeholder="https://…"
          value={form.values.referenceLinks ?? ""}
          onChange={(event) => form.setValue("referenceLinks", event.target.value)}
          onBlur={() => form.blur("referenceLinks")}
        />
      </Field>
      <CurrentSystemField idPrefix="custom" form={form} />
      <div className={rowStyles.row}>
        <IndustrySelect idPrefix="custom" form={form} industries={industries} />
        <CompanySizeSelect idPrefix="custom" form={form} />
      </div>
      <div className={rowStyles.row}>
        <UserCountField idPrefix="custom" form={form} />
        <CountrySelect idPrefix="custom" form={form} required={false} />
      </div>
      <div className={rowStyles.row}>
        <BudgetSelect idPrefix="custom" form={form} />
        <TimelineSelect idPrefix="custom" form={form} />
      </div>
      <ProductChipsField
        idPrefix="custom"
        form={form}
        products={products}
        legend="Catalog products relevant to this project"
        optional
        max={limits.productsMax}
      />
    </FormPanel>
  );
}
