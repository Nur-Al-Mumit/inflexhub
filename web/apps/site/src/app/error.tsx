"use client";

/**
 * Error boundary (V1-11, PRD P-12): shown when a page throws during render.
 * Offers a retry and a way out; never logs page data itself.
 */

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import styles from "./error.module.css";

export default function ErrorPage({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  return (
    <div className={styles.wrap}>
      <Container>
        <span className={styles.icon} aria-hidden="true">
          <TriangleAlert size={24} />
        </span>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.text}>
          This page could not be shown. Nothing you submitted is affected.
          {error.digest ? ` Reference for support: ${error.digest}.` : ""}
        </p>
        <div className={styles.actions}>
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href="/" variant="outline">
            Go to the home page
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
