# UI guidelines — absolute rules for every contributor and AI agent

Status: **Living, binding** (owner decision 2026-11-20)
PRD links: 1.2 (G1), 4 (NFR-1, NFR-2, NFR-4, NFR-9)
Purpose: What InflexHub UI must never look like, what it must look like instead, and how both are checked. Every human and every AI coding agent (Claude, GLM, Codex, Cursor or any other) follows this document for every UI change, with no exceptions.

## How this document works

| Item | Rule |
|---|---|
| Precedence | The **absolute rules (Part A)** override everything except the PRD's behaviour rules. If the design system, a role prompt, a user story, an example in another doc, or an agent's own judgement disagrees, Part A wins |
| "Absolute" means | No exceptions on your own judgement: not for "just this card", not for a prototype, not because another site does it, not because a prompt asked for "modern" or "eye-catching". Only the owner can change a rule, by editing this file (see [Changing a rule](#changing-a-rule)) |
| Enforcement | Most rules are **checked automatically** by `web/apps/site/tests/ui-guidelines.test.ts`, which runs in `npm test`, **Verify all** and CI. A failing check blocks the work. The rest are checked in review against the [checklist](#part-d--review-checklist) |
| Companion docs | Token values and components: [design-system](design-system.md). Pages: [pages-and-flows](pages-and-flows.md) |

---

## Part A — Absolute rules (MUST NOT)

Each rule says what is forbidden, why, what to do instead, and how it is enforced (🤖 automated test · 👁 review).

### UI-1 No one-sided accent borders (owner rule)

- **Forbidden:** a coloured or thicker border on only one side of a card, panel, list item, quote, callout, menu item, table row or any box: the left "stripe", the top "accent bar", a bottom "underline bar" on a card, an inset-shadow stripe (`box-shadow: inset 4px 0 0 …`), a pseudo-element bar (`::before` 3 px wide along one edge), or squared-off corners on one side to make room for a stripe.
- **Why:** it is the most recognisable template/AI-generated look and the owner has rejected it explicitly.
- **Instead:** the standard card: full 1 px `--line` border on all sides, one radius token on all four corners, `--shadow-1`. Show state or emphasis with an **icon tile**, a **badge or pill**, a **tinted surface** (`--*-surface` tokens), or a **full border** in a token colour.
- **Allowed (and only these):** neutral 1 px dividers in `--line` (or `--navy-700` on navy) that separate *regions*: the header's bottom edge, cells inside the stats card, the footer bar, the drawer's edge, the mega-menu footer, the hero mock-window's toolbar. Component internals that are not stripes (the spinner ring's transparent side).
- 🤖 one-sided border width > 1 px or a non-neutral colour fails; inset shadows with an offset fail. 👁 pseudo-element bars.

### UI-2 No invented proof or fake data

- **Forbidden:** testimonials, client logos, "Trusted by …", star ratings, review counts, "500+ clients", years of experience, awards, certifications, case-study numbers, partner logos, avatar stacks of "happy customers", fake live counters, invented phone numbers or addresses presented as real.
- **Why:** none exist yet (owner validation OV-4, OV-5); invented proof destroys trust and may be illegal.
- **Instead:** factual numbers computed from `catalog/products.json`; placeholders only from `src/content/company.ts`, marked ⏳ in [owner-validation](../00-product/owner-validation.md).
- 🤖 banned phrases (testimonial, trusted by, happy clients, award-winning, "N+ clients/customers/projects", ★) fail. 👁 everything else.

### UI-3 No raw colours, no new colours

- **Forbidden:** hex, `rgb()`, `hsl()` or named colours (`white`, `black`, …) in component CSS or inline styles; colours outside the token set; "just a slightly different blue".
- **Instead:** `var(--token)`, or `color-mix(in srgb, var(--token) N%, transparent)` for tints. A genuinely new colour is a design-system change (owner approval + contrast check).
- 🤖 any raw colour in `*.module.css` fails (tokens live only in `styles/tokens.css`).

### UI-4 No gradient text, rainbow gradients, or neon

- **Forbidden:** `background-clip: text` gradient headings, multi-hue gradients (purple→pink→orange), neon glows, glowing borders, animated gradient backgrounds, text shadows for effect.
- **Instead:** solid token text colours. Gradients only as subtle depth inside dark navy sections (navy→navy, or a soft token glow at ≤ 30 % opacity), as already used in the hero and CTA band.
- 🤖 `background-clip: text` and `text-shadow` fail. 👁 gradient choices.

### UI-5 No emoji, no clip-art

- **Forbidden:** emoji as icons, bullets, headings or decoration (🚀 ✅ 💡 ⭐), icon packs other than lucide-react, clip-art, 3D blob illustrations, AI-generated images, stock photos of people (design-system §9).
- **Instead:** lucide-react icons at 16/18/20/22/24 px inside icon tiles; abstract SVG product visuals built from tokens (like the hero product window).
- 🤖 emoji characters in source fail; only `lucide-react` is an allowed icon dependency.

### UI-6 No UI kits, CSS frameworks, or animation libraries

- **Forbidden:** Tailwind, Bootstrap, shadcn/ui, Radix, MUI, Chakra, Ant Design, Headless UI, Framer Motion/Motion, GSAP, AOS, Lottie, any carousel/slider package, any CSS-in-JS library.
- **Instead:** own components in `src/components/ui`, CSS Modules, tokens, and the CSS motion utilities in `styles/globals.css` (ADR 0001).
- 🤖 `package.json` dependencies must match the approved list exactly.

### UI-7 No glassmorphism, heavy shadows, or random radii

- **Forbidden:** `backdrop-filter` blur panels, frosted-glass cards, shadows other than `--shadow-1/2/3`, coloured drop shadows on cards, radii other than the radius tokens, pill-shaped cards, mixed radii on one component.
- **Instead:** `--shadow-1` for resting cards, `--shadow-2` on hover/dropdowns, `--shadow-3` for overlays; radius per component type (inputs/buttons `--radius-sm`/`--radius-md`, cards `--radius-lg`, large panels `--radius-xl`, badges/pills `--radius-full`).
- 🤖 `backdrop-filter` fails. 👁 shadows and radii.

### UI-8 No flashy or blocking motion

- **Forbidden:** bounce/elastic/overshoot easing, shake/wobble/pulse attention loops, infinite animations other than the approved hero drift and loading spinners (keyframes named `*-spin`), parallax or scroll-jacking, autoplay carousels, hover scale-ups above 1.02, hover rotations, animations longer than 1.2 s on interactive UI, motion that hides content when animation is unsupported, motion that ignores `prefers-reduced-motion`.
- **Instead:** the motion catalogue in [design-system §6](design-system.md#6-motion): fade + ≤ 24 px rise, staggered reveals on list items (never on cards that lift on hover), 2 px card lift, 3 px arrow nudge.
- 🤖 overshooting `cubic-bezier`, bounce/shake/wobble/pulse keyframes, `infinite` outside `Hero.module.css` (except `*-spin` loaders), and hover `scale(>1.02)`/`rotate` fail. 👁 reduced-motion behaviour.

### UI-9 No misaligned, centred-everything, or ragged layouts

- **Forbidden:** centring long text or whole sections, mixing centred and left-aligned section headers on one page, half-empty grid rows by accident, cards of unequal height in one row, buttons at different heights in a row of cards, content touching the viewport edge, horizontal page scroll at any width.
- **Instead:** every page section uses `components/sections/Section.tsx` (left-aligned header row, optional action on the right, or the `split` layout); grids chosen so rows are full or deliberately completed (e.g. the "Need something else?" tile); `height: 100%` cards with actions pinned by `margin-top: auto`; the `Container` gutter everywhere.
- 👁 360 / 768 / 1280 px screenshots; 🤖 (later) overflow check in the accessibility suite.

### UI-10 No inaccessible patterns

- **Forbidden:** clickable `div`s, placeholders used as labels, colour as the only signal, text below AA contrast, removed focus outlines, touch targets under 44 × 44 px, icon-only buttons without a label, more than one `h1`, headings that skip levels, auto-moving content without a pause.
- **Instead:** native elements, `Field` for every input, visible focus ring token, icon + text for every status (WCAG 2.2 AA, design-system §5).
- 👁 keyboard walk-through; 🤖 axe-core suite (V1-32).

### UI-11 No style shortcuts

- **Forbidden:** `!important` in components, inline `style` except CSS custom properties (`stagger()`) or data-driven sizes, `font-family` overrides (Plus Jakarta Sans only, through the token), new font sizes outside the type scale, magic-number spacing outside the space tokens.
- 🤖 `!important` and `font-family` in `*.module.css` fail. 👁 spacing and type scale.

### UI-12 No filler copy

- **Forbidden:** lorem ipsum, "Your text here", vague buzzword copy ("revolutionary", "cutting-edge", "world-class", "seamless synergy"), claims the owner has not confirmed (local integrations such as NBR/Mushak or bKash, OV-13).
- **Instead:** short, specific, verifiable sentences in `src/content/`, marked OV-2 for owner review.
- 🤖 lorem ipsum and the listed buzzwords fail.

---

## Part B — Approved patterns (build with these)

| Need | Use | Notes |
|---|---|---|
| Page section | `Section` (`tone`: default / alt / dark; `layout`: stacked / split) | Alternate default and alt; at most one dark band between hero and CTA |
| Inner-page top | `PageHero` (navy, shorter than home hero) with breadcrumbs, eyebrow, h1, intro | One per page |
| Card | 1 px `--line` border, `--radius-lg`, `--shadow-1`, padding `--space-6`/`--space-7`; hover: 2 px lift + `--shadow-2` + orange-tinted border | Whole card clickable through one stretched link |
| Emphasis / state | Icon tile (48 px, `--radius-md`, tinted surface), badge/pill, tinted card surface, dark "feature" tile (navy with soft orange glow) | Never a side stripe (UI-1) |
| Availability | `AvailabilityBadge` (icon + text) everywhere a product appears | Never colour alone |
| Actions | One primary (orange, navy text) per view; secondary = outline or ghost; on navy = `onDarkOutline` | Forward actions get the arrow |
| Lists of cards | 1 → 2 → 3 or 4 columns; full rows or a completing tile | `revealItem` + `stagger()` on the `li` |
| Numbers | Only computed from the catalog; `CountUp` for the stats card | UI-2 |
| Visuals | SVG/CSS abstract product windows, the rising-arrow motif | UI-5 |
| Motion | `.enter`, `.reveal`, `.revealItem`, component keyframes from the motion catalogue | UI-8 |

## Part C — Layout and alignment checklist

1. Container max 1240 px with the token gutter; nothing touches the viewport edge.
2. Section padding from `--section-padding` only; header-to-content gap `--space-9`.
3. Section headers left-aligned; title ≤ 2 lines at 1280 px; intro ≤ 68ch.
4. Grid gaps from the space scale (`--space-4`/`--space-5`); equal-height cards; actions pinned to the bottom and aligned across the row.
5. Icons, badges and text baselines aligned inside cards (flex + `align-items`).
6. Check 360, 768 and 1280 px: no horizontal scroll, no orphaned single card unless intended, no clipped text.

## Part D — Review checklist

Before any UI work is called done, the author (human or agent) confirms in the report:

- [ ] `npm test` passes, including `ui-guidelines.test.ts` (UI-1, 2, 3, 4, 5, 6, 7, 8, 11, 12)
- [ ] No one-sided accent border, stripe, or bar anywhere (UI-1), including pseudo-elements
- [ ] No invented proof or unconfirmed claims (UI-2, UI-12)
- [ ] Only approved patterns from Part B; new patterns were added to the design system first
- [ ] Layout checklist (Part C) at 360 / 768 / 1280 px, with screenshots or a description of each
- [ ] Keyboard-only walk-through and reduced-motion check (UI-8, UI-10)

## Changing a rule

Only the owner changes Part A. The change is made in this file (with the date and reason in the change log below) and, if automated, in `ui-guidelines.test.ts` in the same commit. An agent that thinks a rule blocks good work stops and asks the owner; it never works around the rule or the test.

## Change log

| Date | Change |
|---|---|
| 2026-11-20 | Created. UI-1 (no one-sided accent borders) set as an owner rule after side-stripe cards were rejected; UI-2 – UI-12 codify existing design-system and owner-validation rules as absolute, with automated enforcement |
