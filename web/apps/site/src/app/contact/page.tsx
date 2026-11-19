/**
 * Contact (V1-11, PRD P-10, US-8/US-10): direct channels, the contact form
 * (the seventh inquiry type, `contact`), office hours. Details are OV-3
 * placeholders from content/company.ts — never shown as verified facts.
 */

import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { WhatNext } from "@/components/forms/WhatNext";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { CardGrid } from "@/components/ui/CardGrid";
import { company } from "@/content/company";
import { cardsIntro, formIntro, hero, hoursNote } from "@/content/contact";
import { formCopy } from "@/content/forms";
import { getCatalog } from "@/lib/catalog";
import { stagger } from "@/lib/motion";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Write to InflexHub: email, phone, office hours in Dhaka, and a contact form that answers with a reference number.",
};

export default function ContactPage() {
  const { products } = getCatalog();
  const formProducts = products.map((product) => ({
    slug: product.slug,
    name: product.name,
    availability: product.availability,
    brochure: product.brochure,
  }));

  // OV-3: all four values are placeholders until the owner confirms them.
  const channels = [
    {
      icon: Mail,
      title: "Email",
      line: company.email,
      href: `mailto:${company.email}`,
    },
    {
      icon: Phone,
      title: "Phone",
      line: company.phone,
      href: company.phoneHref,
    },
    {
      icon: MapPin,
      title: "Office",
      line: company.location,
      href: null,
    },
    {
      icon: Clock,
      title: "Office hours",
      line: company.officeHours,
      href: null,
    },
  ];

  return (
    <>
      <PageHero
        breadcrumbs={{ items: [], current: "Contact" }}
        eyebrow={hero.eyebrow}
        title={hero.title}
        intro={hero.intro}
      />

      <Section
        id="channels"
        eyebrow={cardsIntro.eyebrow}
        title={cardsIntro.title}
      >
        <CardGrid count={channels.length}>
          {channels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <li key={channel.title} className={`${styles.card} revealItem`} style={stagger(index)}>
                <span className={styles.cardIcon} aria-hidden="true">
                  <Icon size={22} />
                </span>
                <h3 className={styles.cardTitle}>{channel.title}</h3>
                {channel.href ? (
                  <a className={styles.cardLink} href={channel.href}>
                    {channel.line}
                  </a>
                ) : (
                  <p className={styles.cardLine}>{channel.line}</p>
                )}
              </li>
            );
          })}
        </CardGrid>
        <p className={styles.hoursNote}>{hoursNote}</p>
      </Section>

      <Section
        id="message"
        tone="alt"
        layout="split"
        eyebrow={formIntro.eyebrow}
        title={formIntro.title}
        intro={formIntro.intro}
        aside={<WhatNext copy={formCopy.contact} />}
      >
        <ContactForm products={formProducts} />
      </Section>
    </>
  );
}
