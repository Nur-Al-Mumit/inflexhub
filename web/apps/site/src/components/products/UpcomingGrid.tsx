"use client";

/**
 * UpcomingGrid (V1-10, US-9): the /upcoming product cards. Owns the open
 * dialog state: a card button opens it, and `?product=<slug>` (e.g. from a
 * product page's "Register interest" action) opens that product's dialog
 * after mount, when the slug really is an upcoming product.
 */

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CardGrid } from "@/components/ui/CardGrid";
import { stagger } from "@/lib/motion";
import { InterestCard, type InterestProduct } from "./InterestCard";

export type UpcomingGridProps = {
  readonly products: readonly InterestProduct[];
  readonly industries: readonly { readonly slug: string; readonly name: string }[];
};

export function UpcomingGrid({ products, industries }: UpcomingGridProps) {
  const searchParams = useSearchParams();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const autoOpenedRef = useRef(false);

  useEffect(() => {
    // The params can arrive after mount (the grid hydrates inside Suspense),
    // so react to them — but auto-open at most once per visit, so closing the
    // dialog is final.
    if (autoOpenedRef.current) {
      return;
    }
    const requested = searchParams.get("product") ?? "";
    if (requested && products.some((product) => product.slug === requested)) {
      autoOpenedRef.current = true;
      setOpenSlug(requested);
    }
  }, [searchParams, products]);

  return (
    <CardGrid count={products.length}>
      {products.map((product, index) => (
        <li key={product.slug} className="revealItem" style={stagger(index % 4)}>
          <InterestCard
            product={product}
            industries={industries}
            open={openSlug === product.slug}
            onOpen={(slug) => setOpenSlug(slug)}
            onClose={() => setOpenSlug(null)}
          />
        </li>
      ))}
    </CardGrid>
  );
}
