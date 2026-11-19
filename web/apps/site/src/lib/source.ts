/**
 * Source tracking (pages-and-flows "Source tracking", US-12): on the first
 * page load of a session the site stores the UTM parameters and the landing
 * referrer in sessionStorage; every form attaches them plus the current page
 * path to its submission. Storage access is wrapped in try/catch so private
 * browsing or blocked storage never breaks a form. The pure helpers are
 * covered by tests/source.test.ts; only the thin wrappers touch the browser.
 */

const STORAGE_KEY = "inflexhub.source";

export type StoredSource = {
  readonly referrer: string | null;
  readonly utmSource: string | null;
  readonly utmMedium: string | null;
  readonly utmCampaign: string | null;
  readonly utmTerm: string | null;
  readonly utmContent: string | null;
};

function clean(value: string | null): string | null {
  const trimmed = (value ?? "").trim();
  return trimmed === "" ? null : trimmed;
}

/**
 * Pure: the landing values to store — utm_* from the query string (empty
 * values are dropped) plus the referrer. Only the first load stores anything.
 */
export function captureSourceFrom(search: string, referrer: string): StoredSource {
  const params = new URLSearchParams(search);
  return {
    referrer: clean(referrer),
    utmSource: clean(params.get("utm_source")),
    utmMedium: clean(params.get("utm_medium")),
    utmCampaign: clean(params.get("utm_campaign")),
    utmTerm: clean(params.get("utm_term")),
    utmContent: clean(params.get("utm_content")),
  };
}

/** True when nothing worth storing was captured (keeps storage clean). */
export function isEmptySource(source: StoredSource): boolean {
  return (
    source.referrer === null &&
    source.utmSource === null &&
    source.utmMedium === null &&
    source.utmCampaign === null &&
    source.utmTerm === null &&
    source.utmContent === null
  );
}

/**
 * Pure: merges the stored landing values with the page path the form sits on
 * (`source` in the api-spec request body).
 */
export function buildSource(stored: StoredSource | null, pagePath: string) {
  const empty: StoredSource = {
    referrer: null,
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmTerm: null,
    utmContent: null,
  };
  return { ...empty, ...(stored ?? {}), pagePath };
}

function safeStorage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Browser: captures the landing source once per session. Called from a tiny
 * client component in the root layout; later navigations keep the first
 * landing values.
 */
export function captureSource(): void {
  const storage = safeStorage();
  if (!storage) {
    return;
  }
  try {
    if (storage.getItem(STORAGE_KEY) !== null) {
      return; // first load already captured in this session
    }
    const captured = captureSourceFrom(window.location.search, document.referrer);
    if (isEmptySource(captured)) {
      return; // nothing to remember; the next load with UTMs still can
    }
    storage.setItem(STORAGE_KEY, JSON.stringify(captured));
  } catch {
    // Blocked storage (private mode, disabled cookies): forms still submit
    // with an empty source.
  }
}

/** Browser: the stored landing source, or null when nothing was captured. */
export function readStoredSource(): StoredSource | null {
  const storage = safeStorage();
  if (!storage) {
    return null;
  }
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<StoredSource>;
    return {
      referrer: clean(parsed.referrer ?? null),
      utmSource: clean(parsed.utmSource ?? null),
      utmMedium: clean(parsed.utmMedium ?? null),
      utmCampaign: clean(parsed.utmCampaign ?? null),
      utmTerm: clean(parsed.utmTerm ?? null),
      utmContent: clean(parsed.utmContent ?? null),
    };
  } catch {
    return null;
  }
}

/** Browser: the `source` object for a form submission from the current page. */
export function formSource() {
  let pagePath = "";
  try {
    pagePath = window.location.pathname;
  } catch {
    // Non-browser contexts (tests) get an empty path.
  }
  return buildSource(readStoredSource(), pagePath);
}
