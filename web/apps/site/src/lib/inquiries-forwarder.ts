/**
 * Inquiry forwarding (V1-13, ADR 0004): the site's backend-for-frontend.
 * Browsers post to /api/inquiries; this module forwards server-to-server to
 * the API with the shared site key and the client IP (CF-Connecting-IP, else
 * the first X-Forwarded-For hop). Pure enough for node --test: the browser
 * glue (headers) is a plain object in, string out; fetch is injectable.
 *
 * NFR-6: nothing here logs personal data — the body is forwarded verbatim
 * and never echoed into logs.
 */

export type ForwardHeaders = {
  readonly get: (name: string) => string | null;
};

/** The client IP the API trusts only with a valid site key (ADR 0004). */
export function clientIpFrom(headers: ForwardHeaders): string | null {
  const cloudflare = headers.get("cf-connecting-ip");
  if (cloudflare && cloudflare.trim() !== "") {
    return cloudflare.trim();
  }
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    // "client, proxy1, proxy2" — the first entry is the originating client.
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }
  return null;
}

const TRACEPARENT_PATTERN = /^00-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/;
const ALL_ZERO_TRACE = "00000000000000000000000000000000";
const ALL_ZERO_SPAN = "0000000000000000";

function randomHex(length: number, nextRandom: () => number): string {
  let hex = "";
  while (hex.length < length) {
    hex += Math.floor(nextRandom() * 0x100000000).toString(16).padStart(8, "0");
  }
  return hex.slice(0, length);
}

/**
 * The traceparent the site sends upstream (W3C Trace Context, V1-33/US-17):
 * a valid incoming trace continues with a fresh parent id; anything else
 * starts a new trace. `nextRandom` is injectable for tests.
 */
export function traceparentFor(
  incoming: string | null,
  nextRandom: () => number = Math.random,
): string {
  const match = incoming ? incoming.trim().toLowerCase().match(TRACEPARENT_PATTERN) : null;
  const traceId =
    match && match[1] !== ALL_ZERO_TRACE ? match[1] : randomHex(32, nextRandom);
  const flags = match ? match[3] : "01";
  return `00-${traceId}-${randomHex(16, nextRandom)}-${flags}`;
}

export type ForwardResult = {
  readonly status: number;
  readonly body: string;
  readonly contentType: string;
};

export type ForwardDeps = {
  /** Injectable fetch (tests stub it); defaults to the global. */
  readonly fetch?: typeof fetch;
};

/** ProblemDetails the site's forms map to their generic error path. */
function problem(status: number, slug: string, title: string): ForwardResult {
  return {
    status,
    contentType: "application/problem+json",
    body: JSON.stringify({
      type: `https://inflexhub.com/errors/${slug}`,
      title,
      status,
    }),
  };
}

export type ForwardInquiryInput = {
  readonly apiBaseUrl: string;
  readonly siteKey: string;
  /** The visitor's JSON payload, forwarded verbatim. */
  readonly payload: string;
  readonly clientIp: string | null;
  /** The browser request's traceparent, if any (V1-33). */
  readonly traceparent?: string | null;
};

/**
 * Forwards one inquiry payload to the API and returns the upstream status
 * and body verbatim. Sends a `traceparent` (V1-33) so API logs correlate
 * with the site's trace. Upstream problems become ProblemDetails with a 5xx
 * status; the visitor's message never contains API internals.
 */
export async function forwardInquiry(
  input: ForwardInquiryInput,
  deps: ForwardDeps = {},
): Promise<ForwardResult> {
  const doFetch = deps.fetch ?? fetch;
  let upstream: Response;
  try {
    upstream = await doFetch(`${input.apiBaseUrl.replace(/\/$/, "")}/api/v1/inquiries`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-site-key": input.siteKey,
        traceparent: traceparentFor(input.traceparent ?? null),
        ...(input.clientIp ? { "x-forwarded-for": input.clientIp } : {}),
      },
      body: input.payload,
    });
  } catch {
    // API unreachable (compose down, network partition): the form shows its
    // retry banner and keeps every value.
    return problem(502, "upstream-unavailable", "The inquiry service is unreachable.");
  }

  const body = await upstream.text();
  if (!upstream.ok && body === "") {
    return problem(502, "upstream-error", "The inquiry service returned an error.");
  }
  return {
    status: upstream.status,
    body,
    contentType: upstream.headers.get("content-type") ?? "application/json",
  };
}
