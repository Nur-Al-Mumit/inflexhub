/**
 * Component gallery (V1-1 review aid): every UI component in every state.
 * Development only — calls notFound() in production so it never ships.
 * Excluded from the sitemap (V1-12). Route documented in
 * docs/04-frontend/pages-and-flows.md.
 */

import { notFound } from "next/navigation";
import { Accordion } from "@/components/ui/Accordion";
import { Alert } from "@/components/ui/Alert";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { ChipGroup } from "@/components/ui/ChipGroup";
import { Container } from "@/components/ui/Container";
import { CtaBand } from "@/components/ui/CtaBand";
import { Field } from "@/components/ui/Field";
import { RadioCards } from "@/components/ui/RadioCards";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { TextInput } from "@/components/ui/TextInput";
import styles from "./page.module.css";

const variants = ["primary", "secondary", "outline", "ghost"] as const;

const faqItems = [
  {
    summary: "What is this page for?",
    content:
      "Reviewing every UI component in every state without hunting through real pages.",
  },
  {
    summary: "Is it shipped to production?",
    content:
      "No. It calls notFound() when NODE_ENV is production, so the route 404s there.",
  },
] as const;

export default function DevUiPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <>
      <Container as="div" className={styles.page}>
        <SectionHeader
        eyebrow="Review aid"
        title="UI component gallery"
        intro="Every V1-1 component in every state. Development only."
      />

      {/* Buttons */}
      <section aria-labelledby="dev-buttons" className={styles.section}>
        <h2 id="dev-buttons" className={styles.sectionTitle}>
          Button
        </h2>
        <div className={styles.row}>
          {variants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
        <div className={styles.row}>
          <Button variant="primary" size="lg">
            lg
          </Button>
          <Button variant="primary" arrow>
            with arrow
          </Button>
          <Button variant="outline" arrow>
            outline + arrow
          </Button>
          <Button variant="secondary" disabled>
            disabled
          </Button>
          <Button variant="primary" loading>
            loading (width kept)
          </Button>
        </div>
        <div className={styles.panelDark}>
          <Button variant="onDarkGhost">on-dark ghost</Button>
          <Button variant="onDarkGhost" arrow>
            on-dark ghost + arrow
          </Button>
        </div>
      </section>

      {/* ButtonLink */}
      <section aria-labelledby="dev-button-link" className={styles.section}>
        <h2 id="dev-button-link" className={styles.sectionTitle}>
          ButtonLink
        </h2>
        <div className={styles.row}>
          {variants.map((variant) => (
            <ButtonLink key={variant} href="/" variant={variant}>
              {variant}
            </ButtonLink>
          ))}
          <ButtonLink href="/" size="lg" arrow>
            lg + arrow
          </ButtonLink>
        </div>
      </section>

      {/* Badges */}
      <section aria-labelledby="dev-badges" className={styles.section}>
        <h2 id="dev-badges" className={styles.sectionTitle}>
          Badge · AvailabilityBadge
        </h2>
        <div className={styles.row}>
          <Badge>neutral</Badge>
          <AvailabilityBadge availability="available" />
          <AvailabilityBadge availability="custom" />
          <AvailabilityBadge availability="upcoming" />
        </div>
      </section>

      {/* Card */}
      <section aria-labelledby="dev-card" className={styles.section}>
        <h2 id="dev-card" className={styles.sectionTitle}>
          Card
        </h2>
        <div className={styles.grid}>
          <Card>
            <h3 className={styles.sectionTitle}>Card title</h3>
            <p className={styles.note}>
              Surface, radius-lg, shadow-1. Hover is not a card state — the
              interactive product card is built on top of it in V1-4.
            </p>
          </Card>
        </div>
      </section>

      {/* Fields */}
      <section aria-labelledby="dev-fields" className={styles.section}>
        <h2 id="dev-fields" className={styles.sectionTitle}>
          Field · TextInput · Select · Textarea · Checkbox
        </h2>
        <div className={styles.grid}>
          <Field label="Full name">
            <TextInput name="name" placeholder="Ayesha Rahman" />
          </Field>
          <Field label="Email" help="We reply to this address.">
            <TextInput name="email" type="email" placeholder="you@company.com" />
          </Field>
          <Field label="Company" error="Company is required for a demo.">
            <TextInput name="company" invalid placeholder="Acme Ltd" />
          </Field>
          <Field label="Phone" help="Disabled state.">
            <TextInput name="phone" disabled placeholder="+880…" />
          </Field>
          <Field label="Industry">
            <Select name="industry" defaultValue="">
              <option value="" disabled>
                Choose an industry
              </option>
              <option value="retail">Retail &amp; Wholesale</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
            </Select>
          </Field>
          <Field label="Country" error="Pick a country.">
            <Select name="country" invalid defaultValue="">
              <option value="">Choose…</option>
              <option value="BD">Bangladesh</option>
            </Select>
          </Field>
          <Field label="Message" help="Counter announces live (try typing).">
            <Textarea name="message" maxLength={120} placeholder="Type here…" />
          </Field>
          <Field label="Summary" error="At least 30 characters.">
            <Textarea name="summary" invalid maxLength={120} />
          </Field>
        </div>
        <div className={styles.stack}>
          <Checkbox label="I accept the privacy policy" defaultChecked />
          <Checkbox label="Disabled checkbox" disabled />
          <Checkbox label="Required consent (error state)" invalid />
        </div>
      </section>

      {/* RadioCards */}
      <section aria-labelledby="dev-radio" className={styles.section}>
        <h2 id="dev-radio" className={styles.sectionTitle}>
          RadioCards
        </h2>
        <RadioCards
          legend="Engagement"
          name="engagement"
          cards={[
            { value: "demo", title: "Demo", description: "See it live" },
            { value: "quote", title: "Quotation", description: "Priced for you" },
            {
              value: "custom",
              title: "Custom build",
              description: "Your process, your software",
            },
            { value: "later", title: "Later", description: "Disabled option", disabled: true },
          ]}
        />
      </section>

      {/* ChipGroup */}
      <section aria-labelledby="dev-chips" className={styles.section}>
        <h2 id="dev-chips" className={styles.sectionTitle}>
          ChipGroup
        </h2>
        <ChipGroup
          aria-label="Filter by category"
          defaultPressed={["education"]}
          chips={[
            { value: "business-management", label: "Business Management" },
            { value: "sales-commerce", label: "Sales & Commerce" },
            { value: "finance-hr", label: "Finance & HR" },
            { value: "education", label: "Education" },
            { value: "healthcare", label: "Healthcare" },
          ]}
        />
      </section>

      {/* Alerts */}
      <section aria-labelledby="dev-alerts" className={styles.section}>
        <h2 id="dev-alerts" className={styles.sectionTitle}>
          Alert
        </h2>
        <div className={styles.stack}>
          <Alert tone="success">Inquiry received — reference IH-2611-7K3QF.</Alert>
          <Alert tone="danger">Something went wrong. Your input is still here.</Alert>
          <Alert tone="info">Sales replies within one business day.</Alert>
        </div>
      </section>

      {/* Accordion */}
      <section aria-labelledby="dev-accordion" className={styles.section}>
        <h2 id="dev-accordion" className={styles.sectionTitle}>
          Accordion
        </h2>
        <div className={styles.narrow}>
          <Accordion items={faqItems} />
        </div>
      </section>

      {/* Breadcrumbs */}
      <section aria-labelledby="dev-breadcrumbs" className={styles.section}>
        <h2 id="dev-breadcrumbs" className={styles.sectionTitle}>
          Breadcrumbs
        </h2>
        <Breadcrumbs
          items={[{ href: "/products", label: "Products" }]}
          current="InflexHub POS"
        />
      </section>

      <p className={styles.note}>
        Header, mobile drawer, footer, CtaBand and Container are part of the
        layout: resize below 900 px for the drawer, and see the CtaBand below.
      </p>

      <CtaBand
        eyebrow="Next"
        title="V1-3 continues with the home page"
        intro="This band closes the gallery and demonstrates the dark section pattern."
        cta={{ href: "/", label: "Back to home" }}
      />
    </Container>
    </>
  );
}
