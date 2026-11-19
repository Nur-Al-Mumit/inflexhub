/**
 * Forwarder tests (V1-13): client-IP extraction (CF-Connecting-IP priority,
 * first X-Forwarded-For hop) and the server-to-server forward — site key
 * header, verbatim payload, status/body pass-through, and upstream failures
 * becoming anonymous ProblemDetails (never leaking internals or personal
 * data).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { clientIpFrom, forwardInquiry, traceparentFor } from "../src/lib/inquiries-forwarder.ts";

function headersOf(entries: Record<string, string>) {
  const map = new Map(
    Object.entries(entries).map(([key, value]) => [key.toLowerCase(), value]),
  );
  return {
    get: (name: string) => map.get(name.toLowerCase()) ?? null,
  };
}

test("clientIpFrom_prefers_cf_connecting_ip", () => {
  const ip = clientIpFrom(
    headersOf({ "CF-Connecting-IP": "203.0.113.9", "X-Forwarded-For": "10.0.0.1, 10.0.0.2" }),
  );
  assert.equal(ip, "203.0.113.9");
});

test("clientIpFrom_takes_the_first_x_forwarded_for_hop", () => {
  const ip = clientIpFrom(headersOf({ "X-Forwarded-For": "198.51.100.7, 10.0.0.2, 10.0.0.3" }));
  assert.equal(ip, "198.51.100.7");
});

test("clientIpFrom_null_without_known_headers", () => {
  assert.equal(clientIpFrom(headersOf({ "User-Agent": "test" })), null);
  assert.equal(clientIpFrom(headersOf({ "X-Forwarded-For": " , " })), null);
});

function jsonResponse(status: number, body: unknown, contentType = "application/json") {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": contentType },
  });
}

test("forwardInquiry_posts_to_the_api_with_site_key_and_client_ip", async () => {
  let captured: Request | null = null;
  const fetchStub = (async (input: RequestInfo | URL, init?: RequestInit) => {
    captured = new Request(input, init);
    return jsonResponse(201, { reference: "IH-2611-7K3QF", type: "demo", createdAt: "2026-11-20T09:30:00Z", downloadUrl: null });
  }) as typeof fetch;

  const payload = JSON.stringify({ type: "demo", fullName: "Ayesha Rahman", consent: true });
  const result = await forwardInquiry(
    { apiBaseUrl: "http://api:8080", siteKey: "secret-key", payload, clientIp: "203.0.113.9" },
    { fetch: fetchStub },
  );

  assert.equal(captured!.url, "http://api:8080/api/v1/inquiries");
  assert.equal(captured!.method, "POST");
  assert.equal(captured!.headers.get("x-site-key"), "secret-key");
  assert.equal(captured!.headers.get("x-forwarded-for"), "203.0.113.9");
  assert.equal(captured!.headers.get("content-type"), "application/json");
  assert.match(String(captured!.headers.get("traceparent")), /^00-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}$/, "traceparent sent upstream (V1-33)");
  assert.equal(await captured!.text(), payload, "payload forwarded verbatim");

  assert.equal(result.status, 201);
  assert.equal(JSON.parse(result.body).reference, "IH-2611-7K3QF");
});

test("forwardInquiry_passes_through_upstream_errors_verbatim", async () => {
  const fetchStub = (async () =>
    jsonResponse(
      422,
      { title: "Product not eligible", errors: { productSlugs: ["not eligible"] } },
      "application/problem+json",
    )) as typeof fetch;

  const result = await forwardInquiry(
    { apiBaseUrl: "http://api:8080/", siteKey: "key", payload: "{}", clientIp: null },
    { fetch: fetchStub },
  );
  assert.equal(result.status, 422);
  assert.equal(result.contentType, "application/problem+json");
  assert.deepEqual(JSON.parse(result.body).errors.productSlugs, ["not eligible"]);
});

test("forwardInquiry_unreachable_api_becomes_anonymous_502", async () => {
  const fetchStub = (async () => {
    throw new Error("connect ECONNREFSED 10.0.0.5:8080");
  }) as typeof fetch;

  const result = await forwardInquiry(
    { apiBaseUrl: "http://api:8080", siteKey: "key", payload: "{}", clientIp: null },
    { fetch: fetchStub },
  );
  assert.equal(result.status, 502);
  assert.equal(result.contentType, "application/problem+json");
  const problem = JSON.parse(result.body);
  assert.equal(problem.type, "https://inflexhub.com/errors/upstream-unavailable");
  assert.equal(problem.title.includes("ECONNREFSED"), false, "no internals in the visitor message");
});

test("forwardInquiry_omits_ip_header_when_client_ip_unknown", async () => {
  let captured: Request | null = null;
  const fetchStub = (async (input: RequestInfo | URL, init?: RequestInit) => {
    captured = new Request(input, init);
    return jsonResponse(200, { reference: "IH-2611-7K3QF", type: "demo", createdAt: "2026-11-20T09:30:00Z", downloadUrl: null });
  }) as typeof fetch;

  await forwardInquiry(
    { apiBaseUrl: "http://api:8080", siteKey: "key", payload: "{}", clientIp: null },
    { fetch: fetchStub },
  );
  assert.equal(captured!.headers.get("x-forwarded-for"), null);
});

test("traceparentFor_generates_a_valid_w3c_trace_when_none_incoming", () => {
  let counter = 0;
  const deterministic = () => {
    counter += 1;
    return (counter % 97) / 97;
  };
  const value = traceparentFor(null, deterministic);
  assert.match(value, /^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/);
});

test("traceparentFor_continues_a_valid_incoming_trace_with_a_new_span", () => {
  let counter = 0;
  const deterministic = () => {
    counter += 1;
    return (counter % 89) / 89;
  };
  const value = traceparentFor("00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01", deterministic);
  assert.match(value, /^00-4bf92f3577b34da6a3ce929d0e0e4736-[0-9a-f]{16}-01$/);
  assert.notEqual(value.split("-")[2], "00f067aa0ba902b7", "parent id is fresh");
});

test("traceparentFor_rejects_malformed_or_all_zero_incoming_values", () => {
  let counter = 0;
  const deterministic = () => {
    counter += 1;
    return (counter % 71) / 71;
  };
  for (const bad of ["garbage", "00-abc-abc-01", `00-${"0".repeat(32)}-${"1".repeat(16)}-01`]) {
    const value = traceparentFor(bad, deterministic);
    assert.match(value, /^00-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}$/, `${bad} starts a new trace`);
    assert.notEqual(value.split("-")[1], "0".repeat(32), `${bad} trace id is not all zeros`);
  }
});

test("forwardInquiry_propagates_the_incoming_trace_id_upstream", async () => {
  let captured: Request | null = null;
  const fetchStub = (async (input: RequestInfo | URL, init?: RequestInit) => {
    captured = new Request(input, init);
    return jsonResponse(201, { reference: "IH-2611-7K3QF", type: "demo", createdAt: "2026-11-20T09:30:00Z", downloadUrl: null });
  }) as typeof fetch;

  await forwardInquiry(
    {
      apiBaseUrl: "http://api:8080",
      siteKey: "key",
      payload: "{}",
      clientIp: null,
      traceparent: "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
    },
    { fetch: fetchStub },
  );
  assert.equal(String(captured!.headers.get("traceparent")).split("-")[1], "4bf92f3577b34da6a3ce929d0e0e4736");
});
