"use client";

/**
 * ContactForm (V1-11, US-8): the /contact message form. Name, email, subject
 * and message are required; phone and company optional (api-spec `contact`
 * column). General questions — no product picker.
 */

import { formCopy } from "@/content/forms";
import { FormPanel } from "./FormPanel";
import {
  CompanyField,
  EmailField,
  FullNameField,
  MessageArea,
  PhoneField,
  SubjectField,
  type NamedInquiryProduct,
} from "./CommonFields";
import { useInquiry } from "./useInquiry";

export type ContactFormProps = {
  /** All catalog products (validation context). */
  readonly products: readonly NamedInquiryProduct[];
};

export function ContactForm({ products }: ContactFormProps) {
  const form = useInquiry({ type: "contact", products });

  return (
    <FormPanel
      form={form}
      idPrefix="contact"
      submitLabel="Send message"
      success={formCopy.contact.success}
    >
      <FullNameField idPrefix="contact" form={form} />
      <EmailField idPrefix="contact" form={form} />
      <PhoneField idPrefix="contact" form={form} />
      <CompanyField idPrefix="contact" form={form} required={false} />
      <SubjectField idPrefix="contact" form={form} />
      <MessageArea
        idPrefix="contact"
        form={form}
        label="Your message"
        placeholder="What can InflexHub help with?"
      />
    </FormPanel>
  );
}
