"use client";

/**
 * SourceCapture (pages-and-flows "Source tracking"): mounted once in the root
 * layout; on the first load of a session it stores the UTM parameters and the
 * landing referrer (src/lib/source.ts). Renders nothing.
 */

import { useEffect } from "react";
import { captureSource } from "@/lib/source";

export function SourceCapture() {
  useEffect(() => {
    captureSource();
  }, []);

  return null;
}
