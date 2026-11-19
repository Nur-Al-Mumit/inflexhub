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

/**
 * Forwards one inquiry payload to the API and returns the upstream status
 * and body verbatim. Upstream problems become ProblemDetails with a 5xx
 * status; the visitor's message never contains API internals.
 */
export async function forwardInquiry(
  apiBaseUrl: string,
  siteKey: string,
  payload: string,
  clientIp: string | null,
  deps: ForwardDeps = {},
): Promise<ForwardResult> {
  const doFetch = deps.fetch ?? fetch;
  let upstream: Response;
  try {
    upstream = await doFetch(`${apiBaseUrl.replace(/\/$/, "")}/api/v1/inquiries`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-site-key": siteKey,
        ...(clientIp ? { "x-forwarded-for": clientIp } : {}),
      },
      body: payload,
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
