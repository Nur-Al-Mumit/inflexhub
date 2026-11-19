"use client";

/**
 * CommonFields (V1-7 – V1-10, V1-23, V1-24): the field blocks every inquiry
 * form shares, wired to the useInquiry api. Labels mark optional fields;
 * required ones stay plain. Every control gets a stable
 * `${idPrefix}-${field}` id so FormPanel's error summary can link to it.
 */

import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { TextInput } from "@/components/ui/TextInput";
import { Textarea } from "@/components/ui/Textarea";
import {
  budgetOptions,
  companySizeOptions,
  countryOptions,
  DEFAULT_COUNTRY,
  timelineOptions,
} from "@/content/form-options";
import { limits, type InquiryProduct } from "@/lib/inquiry";
import { ChipGroup } from "@/components/ui/ChipGroup";
import type { InquiryFormApi } from "./useInquiry";
import styles from "./CommonFields.module.css";

type Api = {
  readonly idPrefix: string;
  readonly form: InquiryFormApi;
};

type TextApi = Api & {
  /** The InquiryValues key the input writes to (matches the error key). */
  readonly field: "fullName" | "email" | "phone" | "company" | "jobTitle" | "region" | "userCount" | "currentSystem";
};

function TextField({
  idPrefix,
  form,
  field,
  label,
  help,
  type = "text",
  autoComplete,
  placeholder,
  inputMode,
}: TextApi & {
  label: string;
  help?: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  placeholder?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
}) {
  return (
    <Field id={`${idPrefix}-${field}`} label={label} help={help} error={form.shownErrors[field]}>
      <TextInput
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={form.values[field] ?? ""}
        onChange={(event) => form.setValue(field, event.target.value)}
        onBlur={() => form.blur(field)}
      />
    </Field>
  );
}

export function FullNameField({ idPrefix, form }: Api) {
  return (
    <TextField
      idPrefix={idPrefix}
      form={form}
      field="fullName"
      label="Full name"
      autoComplete="name"
    />
  );
}

export function EmailField({ idPrefix, form }: Api) {
  return (
    <TextField
      idPrefix={idPrefix}
      form={form}
      field="email"
      label="Email address"
      type="email"
      inputMode="email"
      autoComplete="email"
      placeholder="name@company.com"
    />
  );
}

export function PhoneField({ idPrefix, form }: Api) {
  return (
    <TextField
      idPrefix={idPrefix}
      form={form}
      field="phone"
      label="Phone number"
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder="01XXXXXXXXX"
      help="Bangladesh mobile like 01711000000, or a full number with country code."
    />
  );
}

export function CompanyField({ idPrefix, form, required }: Api & { required: boolean }) {
  return (
    <TextField
      idPrefix={idPrefix}
      form={form}
      field="company"
      label={required ? "Company or organisation" : "Company or organisation (optional)"}
      autoComplete="organization"
    />
  );
}

export function JobTitleField({ idPrefix, form }: Api) {
  return (
    <TextField
      idPrefix={idPrefix}
      form={form}
      field="jobTitle"
      label="Job title (optional)"
      autoComplete="organization-title"
    />
  );
}

export function RegionField({ idPrefix, form }: Api) {
  return (
    <TextField
      idPrefix={idPrefix}
      form={form}
      field="region"
      label="City or region you cover (optional)"
      autoComplete="address-level2"
      placeholder="e.g. Chattogram"
    />
  );
}

type SelectApi = Api & {
  readonly field: "industry" | "companySize" | "country" | "budgetRange" | "timeline" | "preferredTime";
};

function SelectField({
  idPrefix,
  form,
  field,
  label,
  help,
  placeholder,
  options,
  value,
}: SelectApi & {
  label: string;
  help?: string;
  /** Leading empty option; omit when the field always has a real value. */
  placeholder?: string;
  options: readonly { readonly value: string; readonly label: string }[];
  value: string;
}) {
  return (
    <Field id={`${idPrefix}-${field}`} label={label} help={help} error={form.shownErrors[field]}>
      <Select
        value={value}
        onChange={(event) => form.setValue(field, event.target.value)}
        onBlur={() => form.blur(field)}
      >
        {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </Field>
  );
}

export function IndustrySelect({
  idPrefix,
  form,
  industries,
}: Api & { industries: readonly { readonly slug: string; readonly name: string }[] }) {
  return (
    <SelectField
      idPrefix={idPrefix}
      form={form}
      field="industry"
      label="Your industry (optional)"
      options={[...industries.map((i) => ({ value: i.slug, label: i.name })), { value: "other", label: "Other" }]}
      value={form.values.industry ?? ""}
    />
  );
}

export function CompanySizeSelect({ idPrefix, form }: Api) {
  return (
    <SelectField
      idPrefix={idPrefix}
      form={form}
      field="companySize"
      label="Company size (optional)"
      options={companySizeOptions}
      value={form.values.companySize ?? ""}
    />
  );
}

export function CountrySelect({ idPrefix, form, required }: Api & { required: boolean }) {
  return (
    <SelectField
      idPrefix={idPrefix}
      form={form}
      field="country"
      label={required ? "Country" : "Country (optional)"}
      // Bangladesh leads the list and is the default selection (BR-10);
      // no empty option — the field always holds a real country.
      options={countryOptions}
      value={form.values.country ?? DEFAULT_COUNTRY}
    />
  );
}

export function BudgetSelect({ idPrefix, form }: Api) {
  return (
    <SelectField
      idPrefix={idPrefix}
      form={form}
      field="budgetRange"
      label="Budget range (optional)"
      help="Ranges in Bangladeshi taka (BDT)."
      options={budgetOptions}
      value={form.values.budgetRange ?? ""}
    />
  );
}

export function TimelineSelect({ idPrefix, form }: Api) {
  return (
    <SelectField
      idPrefix={idPrefix}
      form={form}
      field="timeline"
      label="Timeline (optional)"
      options={timelineOptions}
      value={form.values.timeline ?? ""}
    />
  );
}

export function TimeWindowSelect({ idPrefix, form }: Api) {
  return (
    <SelectField
      idPrefix={idPrefix}
      form={form}
      field="preferredTime"
      label="Preferred time of day (optional)"
      help="Interpreted in your time zone."
      options={[
        { value: "morning", label: "Morning" },
        { value: "afternoon", label: "Afternoon" },
        { value: "evening", label: "Evening" },
      ]}
      value={form.values.preferredTime ?? ""}
    />
  );
}

export function UserCountField({ idPrefix, form }: Api) {
  return (
    <TextField
      idPrefix={idPrefix}
      form={form}
      field="userCount"
      label="Approximate users (optional)"
      inputMode="numeric"
      placeholder="e.g. 25"
    />
  );
}

export function CurrentSystemField({ idPrefix, form }: Api) {
  return (
    <TextField
      idPrefix={idPrefix}
      form={form}
      field="currentSystem"
      label="System you use today (optional)"
      placeholder="Spreadsheets, a legacy app, nothing yet…"
    />
  );
}

export function MessageArea({
  idPrefix,
  form,
  label,
  help,
  placeholder,
}: Api & { label: string; help?: string; placeholder?: string }) {
  return (
    <Field id={`${idPrefix}-message`} label={label} help={help} error={form.shownErrors.message}>
      <Textarea
        rows={5}
        maxLength={limits.messageMax}
        placeholder={placeholder}
        value={form.values.message ?? ""}
        onChange={(event) => form.setValue("message", event.target.value)}
        onBlur={() => form.blur("message")}
      />
    </Field>
  );
}

/** A catalog product with its display name, for option lists. */
export type NamedInquiryProduct = InquiryProduct & { readonly name: string };

/** Single eligible product (demo, interest, brochure): a select. */
export function ProductSelectField({
  idPrefix,
  form,
  products,
  label = "Product",
}: Api & { products: readonly NamedInquiryProduct[]; label?: string }) {
  const selected = form.values.productSlugs?.[0] ?? "";
  return (
    <Field
      id={`${idPrefix}-productSlugs`}
      label={label}
      error={form.shownErrors.productSlugs}
    >
      <Select
        value={selected}
        onChange={(event) =>
          form.setValue("productSlugs", event.target.value ? [event.target.value] : [])
        }
        onBlur={() => form.blur("productSlugs")}
      >
        <option value="">Select a product</option>
        {products.map((product) => (
          <option key={product.slug} value={product.slug}>
            {product.name}
          </option>
        ))}
      </Select>
    </Field>
  );
}

/** One-to-ten eligible products (quote, custom, partner): toggle chips. */
export function ProductChipsField({
  idPrefix,
  form,
  products,
  legend,
  optional,
  max,
}: Api & {
  products: readonly NamedInquiryProduct[];
  legend: string;
  optional: boolean;
  max: number;
}) {
  const groupId = `${idPrefix}-productSlugs`;
  const errorId = `${groupId}-error`;
  const error = form.shownErrors.productSlugs;
  return (
    <div className={styles.productChips}>
      <p className={styles.chipsLegend}>
        {legend}
        {optional ? " (optional)" : ""}
      </p>
      <ChipGroup
        id={groupId}
        aria-label={`${legend}${optional ? " (optional)" : ""} — pick up to ${max}`}
        chips={products.map((product) => ({ value: product.slug, label: product.name }))}
        pressed={[...(form.values.productSlugs ?? [])]}
        onChange={(pressed) => form.setValue("productSlugs", pressed)}
        aria-describedby={errorId}
        invalid={Boolean(error)}
      />
      <p className={error ? styles.chipsError : styles.chipsHelp} id={errorId}>
        {error ?? `Pick up to ${max}.`}
      </p>
    </div>
  );
}
