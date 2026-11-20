# InflexHub design system

Status: Draft
PRD links: 1.2 (G1), 4 (NFR-1, NFR-2, NFR-4)
> **Absolute UI rules live in [ui-guidelines](ui-guidelines.md) and override this document.** In particular UI-1: no one-sided accent borders or stripes on any card or box.

Purpose: Principles, tokens, components, and patterns for the public site (V1) and the admin app (V2). Token values are implemented once in `web/apps/site/src/styles/tokens.css`. After that the code is the source and this table must match it.

## 1. Principles

| Principle | In the UI |
|---|---|
| Confident, not loud | Generous white space, strong type, one accent colour used with intent |
| Clarity sells | Every product says what it is, who it is for, and what to do next, in that order |
| Honest | No invented numbers, logos, or testimonials (OV-4, OV-5); availability always visible |
| Momentum | The logo's upward arrow is the motif: diagonal accents, forward-pointing arrows on CTAs, subtle rise-in motion |
| Accessible by default | WCAG 2.2 AA; keyboard, focus, contrast, reduced motion |
| Fast | Static pages, no client JS where not needed, no heavy images, system of SVG illustrations |

## 2. Brand

From the supplied logo, the wordmark reads **"InflexHub"**: **"Infle" in navy**, then the letter **"x" drawn as two strokes** (a navy stroke from top-left to bottom-right, crossed by an orange stroke from bottom-left to top-right that continues past the letter into the **amber arrowhead** pointing up-right), then **"Hub" in orange**. The x is part of the word, never omitted, and the arrow is the x's rising stroke, never a separate icon after the word. Tagline in the supplied file is not used (OV-6). The wordmark is rebuilt as an HTML + SVG component (`<Logo />`) so it is crisp at every size and has a light-on-dark variant.

## 3. Colour tokens

Contrast values are against white (`#FFFFFF`) unless stated.

| Token | Value | Role | Contrast |
|---|---|---|---|
| `--navy-950` | `#080C26` | Deepest background (footer, hero) | — |
| `--navy-900` | `#0E1438` | Dark sections | white 17.6 |
| `--navy-800` | `#141A4A` | Logo navy; headings; secondary button bg | 15.9 |
| `--navy-700` | `#232C6E` | Hover on navy | 12.3 |
| `--indigo-600` | `#2B3A9E` | Links, info | 9.5 |
| `--orange-500` | `#EE7633` | Brand orange: primary button bg (with navy text), accents | 2.9 (decorative or with navy text: 5.7) |
| `--orange-600` | `#E2631C` | Primary button hover | with navy text 4.9 |
| `--orange-700` | `#B4490F` | Orange small text (eyebrows, links on light) | 5.4 |
| `--orange-50` | `#FFF3EA` | Orange tinted surface | — |
| `--amber-400` | `#F2A33A` | Arrow, gradients, decorative only | — |
| `--ink` | `#141A4A` | Headings | 15.9 |
| `--text` | `#3D4566` | Body text | 9.4 |
| `--muted` | `#5B6386` | Secondary text | 5.9 |
| `--on-dark` | `#FFFFFF` | Text on navy | 17+ |
| `--on-dark-muted` | `#A9B0D6` | Secondary text on navy | 8.6 on navy-950 |
| `--surface` | `#FFFFFF` | Cards, inputs | — |
| `--surface-alt` | `#F6F7FB` | Alternating sections | — |
| `--surface-tint` | `#EEF0FA` | Selected, info panels | — |
| `--line` | `#E4E7F1` | Decorative dividers | — |
| `--border-input` | `#8A91B4` | Input and control borders (non-text 3:1) | 3.1 |
| `--focus` | `#EE7633` outline 3 px + 2 px white offset | Focus ring | 2.9 + offset ring on navy-800 inner |

Semantic:

| Token | Text | Surface | Use |
|---|---|---|---|
| `success` | `#17663D` | `#E7F5EC` | "Ready to use", form success |
| `info` | `#2B3A9E` | `#EEF0FA` | "Built on request" |
| `upcoming` | `#B4490F` | `#FFF3EA` | "Coming soon" |
| `danger` | `#B42318` | `#FDECEA` | Errors |
| `warning` | `#8A5300` | `#FDF3E1` | Notices |

Availability badges always show icon + text: Ready to use (check-circle), Built on request (wrench), Coming soon (sparkles).

## 4. Typography

Family: **Plus Jakarta Sans** (geometric, matches the logo's heavy rounded letterforms), weights 400, 500, 600, 700, 800, via `next/font/google` (self-hosted, `display: swap`). Fallback `ui-sans-serif, system-ui, "Segoe UI", Roboto, Arial`.

| Token | Desktop | Phone (≤ 640) | Weight | Use |
|---|---|---|---|---|
| `display` | 64 / 1.05, −0.03em | 40 / 1.1 | 800 | Home hero |
| `h1` | 52 / 1.1, −0.025em | 36 / 1.15 | 800 | Page heroes |
| `h2` | 40 / 1.15, −0.02em | 30 / 1.2 | 750 | Section titles |
| `h3` | 22 / 1.3 | 20 / 1.3 | 700 | Card titles |
| `h4` | 18 / 1.4 | 17 / 1.4 | 700 | Sub-sections |
| `body-lg` | 19 / 1.65 | 17 / 1.6 | 400 | Intros |
| `body` | 16 / 1.65 | 16 / 1.6 | 400 | Default |
| `small` | 14 / 1.55 | 14 / 1.55 | 500 | Meta, help text |
| `overline` | 13 / 1.4, 0.14em, uppercase | 12 | 700 | Eyebrows in `orange-700` (light) or `orange-500` (dark) |

Line length ≤ 68ch for paragraphs.

## 5. Spacing, radius, elevation, layout

| Scale | Values |
|---|---|
| Spacing | `--space-1` 4 · 2 8 · 3 12 · 4 16 · 5 20 · 6 24 · 7 32 · 8 40 · 9 48 · 10 64 · 11 80 · 12 96 · 13 128 px |
| Section padding | 112 px desktop · 80 tablet · 64 phone |
| Radius | `--radius-sm` 8 (inputs, small buttons) · `--radius-md` 12 (buttons) · `--radius-lg` 20 (cards) · `--radius-xl` 28 (hero panels) · `--radius-full` |
| Elevation | `--shadow-1` `0 1px 2px rgb(20 26 74 / .06), 0 2px 6px rgb(20 26 74 / .05)` · `--shadow-2` `0 8px 24px rgb(20 26 74 / .08)` · `--shadow-3` `0 24px 60px rgb(20 26 74 / .14)` · `--shadow-on-dark` `0 40px 80px rgb(0 0 0 / .45)` and `--shadow-on-dark-sm` `0 8px 18px rgb(0 0 0 / .35)` (only for elements floating on navy) |
| Overlay | `--overlay` `rgb(8 12 38 / .5)` behind dialogs and the mobile drawer |
| Container | max 1240 px, gutters 24 px (16 px under 400 px) |
| Breakpoints | 640 · 900 · 1200 px; designed from 360 px |
| Touch targets | ≥ 44 × 44 px |

## 6. Motion

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 160 ms | Hover, focus |
| `--dur-med` | 280 ms | Menus, accordions |
| `--dur-slow` | 600 ms | Section reveal (opacity + 16 px rise) |
| `--ease` | `cubic-bezier(.2,.7,.2,1)` | Default |

`prefers-reduced-motion: reduce` removes all transitions and reveals.

### Motion catalogue (V1)

Principles: motion explains structure (what appeared, what changed, where to look next); it is quick, subtle (≤ 24 px travel, no bounce), never blocks reading or input, and never hides content from visitors without animation support. CSS only (keyframes, transitions, scroll-driven animations as progressive enhancement); the one exception is the stats count-up, a tiny client component. No animation library.

| Pattern | Where | Behaviour |
|---|---|---|
| Entrance stagger | Hero copy and visual on load | Fade + 16 px rise, `--dur-slow`, 90 ms between items |
| Visual build | Hero product window | Chart bars grow from the baseline in sequence, the trend line draws itself, floating cards fade in then drift ±8 px slowly (6 s loop), arrow rises in; background glow drifts very slowly (20 s) |
| Count-up | Stats card | Numbers count from 0 to the real value over 1.2 s (ease-out) once visible; screen readers always get the final value |
| Scroll reveal | Section headers and cards | Fade + rise as they enter the viewport, cards staggered by index; only where `animation-timeline: view()` is supported, otherwise content is simply visible |
| Timeline draw | Process connectors | Lines draw left → right (top → bottom on phones) as the section scrolls in |
| Tab change | Products by category | New cards fade + rise, staggered |
| Overlay open | Mega menu, mobile drawer | Menu fades + drops 8 px; drawer slides in from the left over a fading backdrop |
| Disclosure | FAQ accordion, drawer products group | Height animates open and closed where supported |
| Micro-interactions | Buttons, cards, links | Cards lift 2 px with a stronger shadow, arrows nudge 3 px, buttons press 1 px on click |

## 7. Components (V1)

| Component | Variants | States / a11y |
|---|---|---|
| Button / ButtonLink | primary (orange, navy text), secondary (navy), outline, ghost, on-dark ghost, on-dark outline (white text, translucent white border, for secondary actions on navy); sizes md, lg; optional trailing arrow | hover lifts arrow 2 px; focus ring; disabled; loading keeps width and announces |
| Logo | default, on-dark; with or without wordmark | `aria-label="InflexHub home"` |
| Header | sticky, transparent-on-hero → solid on scroll; products mega menu; mobile drawer | Skip link; menu opens on click, Escape closes, focus returns |
| Footer | sitemap columns, contact, legal | `contentinfo` landmark |
| Section header | eyebrow, title, intro; left or centered | heading level passed in |
| Product card | icon, name, tagline, category, availability badge, link | whole card clickable via one link |
| Availability badge | available, custom, upcoming | icon + text |
| Feature list / module grid | 2 or 3 columns | — |
| Industry card | icon, name, product count | — |
| Filter bar | chip groups (category, availability), select (industry), search | `aria-pressed` chips; results count announced (`aria-live="polite"`) |
| Form fields | text, email, tel, select, textarea (with counter), date, checkbox, multi-select chips, radio cards | label always visible; error text linked with `aria-describedby`; error summary at top on submit |
| Alert | success, danger, info | `role="status"` / `role="alert"` |
| Accordion (FAQ) | — | native `<details>`/`<summary>` |
| Steps / process | numbered, connected line | ordered list |
| CTA band | dark navy with orange accent | — |
| Section | default (white), alt (`surface-alt`), dark (navy); header row: eyebrow + h2 + intro on the left, optional action link on the right; `split` layout puts the header in a left column and content on the right | `aria-labelledby` its h2; one consistent alignment and spacing for every page section |
| Product card | icon tile, availability badge (never wraps), name (stretched link), tagline, "View product" cue | whole card clickable through one link |
| Stats card | elevated white card, 2 × 2 on phones, 4 columns from 900 px; factual catalog counts only | each value and label read together |
| Breadcrumbs | — | `nav aria-label="Breadcrumb"`, `aria-current` |
| Thank-you panel | with reference, next steps | focus moved to its heading |

## 8. Formats (ADR 0005: Bangladesh first, international standards)

| Item | On screen | In data |
|---|---|---|
| Money | `৳5 lakh`, `৳15–50 lakh` (range labels); exact amounts `BDT 1,250,000` | Range code + `BDT` |
| Dates | `17 November 2026` | ISO 8601 |
| Times | `10:00–18:00 (Bangladesh time, GMT+6)` | UTC + IANA zone |
| Phone | Country selector (Bangladesh first, then all countries A–Z), placeholder `01XXXXXXXXX` | E.164 |
| Country | Select, Bangladesh preselected | ISO 3166-1 alpha-2 |
| Names | Any script; no "first/last name" split (one full-name field) | UTF-8 |

## 9. Patterns

| Pattern | Rule |
|---|---|
| Forms | Validate on blur and submit; never clear on error; server errors mapped to fields; submit button disabled while sending; thank-you replaces the form and shows the reference |
| Calls to action | One primary per view; the arrow icon only on forward actions |
| Imagery | Abstract SVG product "screens" and diagonal arrow shapes in brand colours; no stock photos of people |
| Empty states | Explain and offer a next step |
| Numbers | Only factual (product count, industries count); never invented client counts |
| Dark sections | Hero, CTA band, footer use `navy-950/900` with subtle grid and orange glow |
| **No one-sided accent borders (owner rule)** | Never put a coloured or thick border on only one side of a card, panel, list item, quote or callout (no left/top "stripe", no inset-shadow stripe, no squared-off corners to make room for one). Cards use the full 1 px `--line` border, one radius on every corner and `--shadow-1`. Show state or emphasis with an icon tile, a badge or pill, a tinted surface, or a full border colour instead. Allowed: neutral 1 px `--line` dividers that separate regions (header bottom edge, stats-card cells, footer bar, drawer edge, menu footer) and component internals such as the spinner ring |
