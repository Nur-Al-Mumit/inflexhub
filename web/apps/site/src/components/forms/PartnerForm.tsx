"use client";

/**
 * PartnerForm (V1-24, US-14): the /partners application form. Country and
 * partner type are required (api-spec); region, products of interest, team
 * size and message are optional. Industry is not sent — the api-spec ignores
 * it for partner applications.
 */

import { RadioCards } from "@/components/ui/RadioCards";
import { formCopy } from "@/content/forms";
import { partnerTypeOptions } from "@/content/form-options";
import { limits } from "@/lib/inquiry";
import { FormPanel } from "./FormPanel";
import {
  CompanyField,
  CompanySizeSelect,
  CountrySelect,
  EmailField,
  FullNameField,
  JobTitleField,
  MessageArea,
  PhoneField,
  ProductChipsField,
  RegionField,
  type NamedInquiryProduct,
} from "./CommonFields";
import { useInquiry } from "./useInquiry";
import styles from "./PartnerForm.module.css";

export type PartnerFormProps = {
  /** All catalog products (validation context + products of interest). */
  readonly products: readonly NamedInquiryProduct[];
};

export function PartnerForm({ products }: PartnerFormProps) {
  const form = useInquiry({
    type: "partner",
    products,
    initialValues: { country: "BD" },
  });
  const copy = formCopy.partner;
  const partnerTypeErrorId = "partner-partnerType-error";

  return (
    <FormPanel
      form={form}
      idPrefix="partner"
      submitLabel="Apply to partner"
      success={copy.success}
    >
      <FullNameField idPrefix="partner" form={form} />
      <EmailField idPrefix="partner" form={form} />
      <PhoneField idPrefix="partner" form={form} />
      <CompanyField idPrefix="partner" form={form} required />
      <JobTitleField idPrefix="partner" form={form} />
      <div>
        <CountrySelect idPrefix="partner" form={form} required />
        <div className={styles.regionBelow}>
          <RegionField idPrefix="partner" form={form} />
        </div>
      </div>
      <RadioCards
        id="partner-partnerType"
        legend="Partner type"
        name="partnerType"
        cards={partnerTypeOptions.map((option) => ({
          value: option.value,
          title: option.label,
          description: option.description,
        }))}
        aria-describedby={partnerTypeErrorId}
        invalid={Boolean(form.shownErrors.partnerType)}
        onChange={(event) => form.setValue("partnerType", event.target.value)}
        onBlur={() => form.blur("partnerType")}
      />
      <p
        className={
          form.shownErrors.partnerType ? styles.partnerTypeError : styles.partnerTypeHelp
        }
        id={partnerTypeErrorId}
      >
        {form.shownErrors.partnerType ??
          "Pick the type that fits how you want to work with InflexHub."}
      </p>
      <ProductChipsField
        idPrefix="partner"
        form={form}
        products={products}
        legend="Products of interest"
        optional
        max={limits.productsMax}
      />
      <CompanySizeSelect idPrefix="partner" form={form} />
      <MessageArea
        idPrefix="partner"
        form={form}
        label="About your services (optional)"
        placeholder="What you sell or implement today, and where you want to take it…"
      />
    </FormPanel>
  );
}
