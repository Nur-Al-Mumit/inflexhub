/**
 * Site route handler POST /api/inquiries (V1-13, ADR 0004): receives the
 * browser's form payload and forwards it server-to-server to the API with
 * the shared site key and the client IP. The API's status and body pass
 * through unchanged (201/200 success, 400/422/429 errors), so the forms'
 * error mapping keeps working. GET is not offered. Secrets stay here — the
 * browser never sees API_BASE_URL or SITE_API_KEY (NFR-5), and nothing about
 * the payload is logged (NFR-6).
 */

import { NextResponse } from "next/server";
import { clientIpFrom, forwardInquiry } from "@/lib/inquiries-forwarder";

const MAX_BODY_BYTES = 64 * 1024;

export async function POST(request: Request): Promise<NextResponse> {
  const apiBaseUrl = process.env.API_BASE_URL;
  const siteKey = process.env.SITE_API_KEY;
  if (!apiBaseUrl || !siteKey) {
    return NextResponse.json(
      {
        type: "https://inflexhub.com/errors/upstream-unconfigured",
        title: "The inquiry service is not configured.",
        status: 503,
      },
      { status: 503, headers: { "content-type": "application/problem+json" } },
    );
  }

  const raw = await request.text();
  if (raw.length === 0) {
    return NextResponse.json(
      {
        type: "https://inflexhub.com/errors/empty-body",
        title: "The request body is empty.",
        status: 400,
      },
      { status: 400, headers: { "content-type": "application/problem+json" } },
    );
  }
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json(
      {
        type: "https://inflexhub.com/errors/body-too-large",
        title: "The request body is too large.",
        status: 413,
      },
      { status: 413, headers: { "content-type": "application/problem+json" } },
    );
  }
  try {
    JSON.parse(raw);
  } catch {
    return NextResponse.json(
      {
        type: "https://inflexhub.com/errors/invalid-json",
        title: "The request body is not valid JSON.",
        status: 400,
      },
      { status: 400, headers: { "content-type": "application/problem+json" } },
    );
  }

  const result = await forwardInquiry(apiBaseUrl, siteKey, raw, clientIpFrom(request.headers));
  return new NextResponse(result.body, {
    status: result.status,
    headers: { "content-type": result.contentType },
  });
}

export function GET(): NextResponse {
  return NextResponse.json(
    {
      type: "https://inflexhub.com/errors/method-not-allowed",
      title: "Use POST to submit an inquiry.",
      status: 405,
    },
    { status: 405, headers: { "content-type": "application/problem+json", allow: "POST" } },
  );
}
