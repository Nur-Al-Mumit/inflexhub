/**
 * JsonLd (V1-12): renders one JSON-LD object as a script tag (NFR-3).
 * Objects come from the pure builders in src/lib/seo.ts.
 */

export type JsonLdProps = {
  readonly data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Builders produce plain JSON-safe objects (no user input).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
