/**
 * ARIA helper (V1-1): merges aria-describedby ids from several sources without
 * losing or overwriting any. Used by form controls that combine the Field
 * wrapper's help/error ids with their own (e.g. the Textarea counter).
 */

export function mergeDescribedBy(
  ...ids: ReadonlyArray<string | undefined>
): string | undefined {
  const merged = ids.filter(
    (id): id is string => typeof id === "string" && id.length > 0,
  );
  return merged.length > 0 ? merged.join(" ") : undefined;
}
