# ADR 0003 — One inquiries table for all form types

Status: Accepted (2026-11-17)

## Context

Seven inquiry types (demo, quote, custom software, contact, product interest, brochure download, partner) share most fields (who, company, industry, source) and all feed the same sales pipeline and demand reports.

## Decision

One `inquiries` table with a `type` column, shared columns, and nullable type-specific columns (`preferred_date`, `user_count`, `budget_range`, `timeline`, ...). Products are a child table `inquiry_products` because a quotation can cover several products. Per-type required fields are enforced by the validator.

## Consequences

- One query answers "all leads", and demand views are simple `GROUP BY`s.
- V2 adds lead status history and notes as child tables of the same inquiry.
- Rarely used type-specific fields that do not deserve a column go into `details jsonb` (for example custom-software feature lists).
