"use client";

/**
 * FieldContext (V1-1): the Field wrapper publishes the control id, the merged
 * aria-describedby ids, and the invalid flag. Controls (TextInput, Select,
 * Textarea, Checkbox, RadioCards) read it so id and ARIA attributes land on
 * the native control, never on a wrapper.
 */

import { createContext } from "react";

export type FieldContextValue = {
  readonly id: string;
  readonly describedBy?: string;
  readonly invalid: boolean;
};

export const FieldContext = createContext<FieldContextValue | null>(null);
