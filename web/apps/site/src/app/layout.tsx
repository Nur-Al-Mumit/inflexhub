import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import { SourceCapture } from "@/components/forms/SourceCapture";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { company } from "@/content/company";
import { getCategoryGroups } from "@/lib/catalog";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${company.name} — ${company.tagline}`,
    template: `%s — ${company.name}`,
  },
  description:
    "Business software for companies, educational institutions, and healthcare organisations: ready to use, built on request, or coming soon.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // The catalog is read server-side once and passed to the client Header as
  // plain data (src/lib/catalog.ts stays the only catalog reader).
  const categoryGroups = getCategoryGroups().map((group) => ({
    slug: group.slug,
    name: group.name,
    products: group.products.map((product) => ({
      slug: product.slug,
      name: product.name,
    })),
  }));

  return (
    <html lang="en" className={jakarta.variable}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {/* First-load UTM/referrer capture for form source tracking. */}
        <SourceCapture />
        <Header categoryGroups={categoryGroups} />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
