# STYLEGUIDE.md — Saku Visual System

This is the binding source of truth for every visual decision. If a value is not here, it does not go in the code. Components read tokens (CSS variables), never raw hex. When design.md names a color or size, it names a token defined below.

Design language name: **Ledger.** Character: quiet precision. Cool graphite foundation, monospaced money, and exactly two meaningful colors (green in, red out).

---

## 1. Brand identity in one paragraph

Saku looks like a well-made instrument, not a marketing site. The surface is calm cool-graphite. Typography does the heavy lifting: a clean Indonesian-designed sans for the interface, and a monospaced face for every figure so amounts align like a real ledger. The only saturated color on screen is green (money coming in, the brand, the primary action) and red (money going out). Everything else is neutral. That restraint is the identity.

## 2. Anti-slop bans (read before writing any CSS)

These looks are forbidden because they are AI defaults, not choices:

1. **Cream/beige background with a serif display face and a terracotta or clay accent** (anything near `#D97757`). This is the single most common generated look. Banned.
2. **Pure black background with a neon acid-green or vermilion accent.** Banned.
3. **Broadsheet layout: hairline rules everywhere, zero border-radius, dense newspaper columns.** Banned.
4. **Purple-to-blue "fintech" gradient hero.** Banned.
5. **Rainbow categorical chart palettes, default Recharts/chart-lib colors, or an untouched shadcn look.** Banned.
6. **Color used for decoration.** If a color is not encoding income, expense, or the primary action, remove it.

If a screen drifts toward any of these, it is wrong even if it "looks nice."

## 3. Color tokens

Amounts are integers in minor units elsewhere; here everything is a CSS variable. Two layers: raw ramps, then semantic aliases. Components use semantic aliases only.

### 3.1 Neutral (cool graphite) — raw ramp

Light theme:

| Token | Hex | Use |
|---|---|---|
| `--gray-0` | `#FFFFFF` | Card / raised surface |
| `--gray-25` | `#FBFCFD` | Subtle surface |
| `--gray-50` | `#F4F6F8` | App canvas (page background) |
| `--gray-100` | `#EEF1F4` | Sunken / track |
| `--gray-200` | `#E2E6EB` | Hairline border |
| `--gray-300` | `#CFD5DD` | Strong border / divider |
| `--gray-400` | `#B4BCC7` | Disabled text |
| `--gray-500` | `#8C95A3` | Muted text |
| `--gray-600` | `#5B6472` | Secondary text |
| `--gray-800` | `#2A2F38` | Strong text |
| `--gray-900` | `#12151B` | Primary text |

Dark theme (same token names, remapped):

| Token | Hex | Use |
|---|---|---|
| `--gray-0` | `#14171D` | Card / raised surface |
| `--gray-25` | `#171B22` | Subtle surface |
| `--gray-50` | `#0B0D11` | App canvas |
| `--gray-100` | `#1C212A` | Elevated surface / track |
| `--gray-200` | `#262C36` | Hairline border |
| `--gray-300` | `#333B47` | Strong border |
| `--gray-400` | `#4C5563` | Disabled text |
| `--gray-500` | `#737E8D` | Muted text |
| `--gray-600` | `#A4ADBB` | Secondary text |
| `--gray-800` | `#D4DAE2` | Strong text |
| `--gray-900` | `#EDF0F4` | Primary text |

### 3.2 Green (money in / brand / positive) — raw ramp

| Token | Hex |
|---|---|
| `--green-50` | `#E7F5EF` |
| `--green-100` | `#C6E9DA` |
| `--green-200` | `#97D6BC` |
| `--green-300` | `#5FBE98` |
| `--green-400` | `#2CA277` |
| `--green-500` | `#0E7A5A` (brand base) |
| `--green-600` | `#0B6249` |
| `--green-700` | `#094E3B` |
| `--green-800` | `#073B2C` |

Deep spruce, not kelly green, not neon. This is the whole brand color and the income color, because in a finance app positive money is the brand thesis.

### 3.3 Red (money out) — raw ramp

| Token | Hex |
|---|---|
| `--red-50` | `#FCEBEA` |
| `--red-100` | `#F8CFCC` |
| `--red-200` | `#F0A6A1` |
| `--red-300` | `#E5756E` |
| `--red-400` | `#D84B44` |
| `--red-500` | `#C63A34` (base) |
| `--red-600` | `#A82E29` |
| `--red-700` | `#86241F` |

A true crimson-coral. Deliberately not terracotta, to stay off the banned palette.

### 3.4 Support colors (use sparingly)

| Token | Hex (light) | Hex (dark) | Use |
|---|---|---|---|
| `--steel-500` | `#4F6D8C` | `#7F9DBD` | Transfers only (a transfer is neither in nor out) |
| `--amber-500` | `#B45309` | `#F0B429` | "Approaching budget limit" warning |

Over-budget reuses red. Steel appears only on the transfer glyph and transfer rows, never as general chrome.

### 3.5 Semantic aliases (components use ONLY these)

```css
/* light theme */
--color-canvas:        var(--gray-50);
--color-surface:       var(--gray-0);
--color-surface-subtle:var(--gray-25);
--color-sunken:        var(--gray-100);
--color-border:        var(--gray-200);
--color-border-strong: var(--gray-300);

--color-text:          var(--gray-900);
--color-text-secondary:var(--gray-600);
--color-text-muted:    var(--gray-500);
--color-text-disabled: var(--gray-400);

--color-brand:         var(--green-500);
--color-brand-hover:   var(--green-600);
--color-brand-active:  var(--green-700);
--color-on-brand:      #FFFFFF;

--color-income:        var(--green-600);  /* text on light surface, AA */
--color-income-bg:     var(--green-50);
--color-expense:       var(--red-500);
--color-expense-bg:    var(--red-50);
--color-transfer:      var(--steel-500);

--color-focus:         var(--green-500);
```

Dark-theme block remaps the money text tokens to the lighter ramp steps for contrast: `--color-income: var(--green-300)`, `--color-expense: var(--red-300)`, `--color-brand` stays `--green-500` for buttons (white text still passes), income/expense **text** uses the 300 steps, income/expense **backgrounds** use translucent tints of the ramp rather than the `-50` steps.

Contrast rule: money text must meet 4.5:1 against its surface in both themes. Green-600 on white and green-300 on `--gray-0`(dark) are the tested pairs; do not use green-400/500 as text on light backgrounds.

## 4. Typography

Two families. No third face without a written reason.

- **Interface / body:** `Plus Jakarta Sans` (Google Fonts). Chosen deliberately: an Indonesian-designed grotesque, professional, slightly geometric, on-brief for an Indonesian product, and not the default Inter that every generated app ships. Weights: 400, 500, 600, 700.
- **Money / tabular data:** `IBM Plex Mono`. Every currency amount, every figure in a table or chart tooltip, the hero balance. `font-variant-numeric: tabular-nums` always on. This monospaced-figures decision is the app's one aesthetic risk and its signature. Do not render amounts in the sans face.

Fallback stack: `"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif` and `"IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace`.

### 4.1 Type scale

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
|---|---|---|---|---|---|---|
| Balance hero | Mono | 44px (mobile 36) | 600 | 1.05 | -0.02em | tabular-nums, the signature figure |
| Display | Mono | 30px | 600 | 1.1 | -0.01em | secondary big numbers |
| H1 | Sans | 24px | 700 | 1.2 | -0.01em | page titles |
| H2 | Sans | 20px | 700 | 1.25 | -0.01em | section headers |
| H3 | Sans | 17px | 600 | 1.3 | 0 | card headers |
| Body-lg | Sans | 16px | 500/400 | 1.5 | 0 | primary reading |
| Body | Sans | 14px | 400 | 1.5 | 0 | default UI text |
| Amount (row) | Mono | 14-15px | 500 | 1.3 | 0 | list-row amounts, tabular-nums |
| Caption | Sans | 12px | 500 | 1.4 | +0.01em | labels, meta |
| Eyebrow | Sans | 11px | 600 | 1.3 | +0.06em, UPPERCASE | section eyebrows, used rarely |
| Micro | Sans | 11px | 500 | 1.3 | 0 | dense meta |

## 5. Spacing

4px base scale. Name = multiple.

`--space-1:4  --space-2:8  --space-3:12  --space-4:16  --space-5:20  --space-6:24  --space-8:32  --space-10:40  --space-12:48  --space-16:64`

Card padding: `--space-5` mobile, `--space-6` desktop. Screen gutters: `--space-4` mobile, `--space-6`+ desktop. List-row vertical padding: `--space-3`.

## 6. Radius

`--radius-sm:8  --radius-md:12  --radius-lg:16  --radius-xl:20  --radius-full:9999`

Chips/inputs `sm`-`md`, buttons `md`, cards `lg`, sheets/large panels `xl`, pills/FAB/avatars `full`. Moderate rounding: serious, not blobby, and deliberately not the zero-radius broadsheet look.

## 7. Elevation

Favor hairline border plus a soft, low shadow. Do not stack heavy drop shadows.

```css
--shadow-sm: 0 1px 2px rgba(16,21,27,0.06);
--shadow-md: 0 4px 12px rgba(16,21,27,0.08);
--shadow-lg: 0 12px 32px rgba(16,21,27,0.14);
```

Cards = `--color-surface` + `1px solid --color-border` + `--shadow-sm`. In dark mode, shadows are nearly invisible; convey elevation with surface lightness steps (`--gray-0` → `--gray-100`) and borders, not shadow. FAB and sheets use `--shadow-lg`.

## 8. Focus and motion

- **Focus ring:** `outline: 2px solid var(--color-focus); outline-offset: 2px;` on every interactive element. Never remove focus styles. In dark mode keep the same green; it reads.
- **Touch target:** minimum 44x44px on mobile, honor safe-area insets for bottom nav and FAB.
- **Motion tokens:**
  - duration-fast 120ms, duration-base 200ms, duration-slow 320ms
  - easing-standard `cubic-bezier(0.2, 0, 0, 1)` (ease-out), easing-spring for sheets/toggles
  - Count-up on hero and key figures: 600-800ms once on mount.
  - Charts animate in once, not on every re-render.
  - `@media (prefers-reduced-motion: reduce)`: all transitions and count-ups collapse to 0ms, charts render final frame immediately.

## 9. Breakpoints

Mobile-first. `sm 480 / md 768 / lg 1024 / xl 1280`. Nav model changes at `md` (bottom bar → rail) and `lg` (rail → sidebar). See design.md §3.

## 10. Component specs

Values reference tokens above.

- **Primary button:** bg `--color-brand`, text `--color-on-brand`, `--radius-md`, weight 600, height 44 (mobile) / 40 (desktop), hover `--color-brand-hover`, active `--color-brand-active`, disabled 40% opacity + no shadow, focus ring.
- **Secondary button:** `--color-surface` bg, `1px --color-border-strong`, text `--color-text`.
- **Ghost button:** transparent, text `--color-text-secondary`, hover `--color-sunken`.
- **Destructive button:** `--red-500` bg, white text (delete confirmations only).
- **Input / select:** `--color-surface` bg, `1px --color-border`, `--radius-md`, text 14-16px, focus = `--color-border` → `--color-brand` + focus ring, error = `1px --red-500` + helper text in `--color-expense`. Label above, sentence case.
- **Amount input:** mono, larger (Display size in the entry sheet), currency prefix in `--color-text-muted`, tabular-nums, grouping applied per locale on blur.
- **Card:** as §7. Header uses H3, body Body.
- **List row:** min-height 56px, layout `[category icon] [name + meta] ......... [amount]`, amount right-aligned mono signed and colored (`--color-income` / `--color-expense` / `--color-transfer`), whole row tappable, 44px+ target.
- **Chip / pill:** `--radius-full`, `--color-sunken` bg, Caption text, optional leading glyph. Account chip and category token are chip variants.
- **Segmented control (Expense/Income/Transfer switch):** pill track `--color-sunken`, active segment `--color-surface` + `--shadow-sm`, active label weight 600.
- **FAB:** `--radius-full`, `--color-brand` bg, white plus-glyph, 56px, `--shadow-lg`, bottom-center above the tab bar within safe-area.
- **Bottom sheet / side panel:** `--color-surface`, `--radius-xl` top corners (sheet), `--shadow-lg`, drag handle on mobile, ESC/overlay-tap to close, focus trapped.
- **Toast:** elevated surface, `--radius-md`, `--shadow-lg`, auto-dismiss with an action slot (Undo).
- **Progress bar (budget):** track `--color-sunken`, fill `--color-brand` when under, `--amber-500` when near, `--red-500` when over.
- **Auth card:** centered on desktop (max-width ~400px), full-width on mobile, `--color-surface`, `--radius-lg`, `--shadow-md`. Inline password rules in Caption `--color-text-muted`. One primary button. Errors in `--color-expense`, blameless copy.
- **Marketing sections:** same tokens as the app, so landing and product feel continuous. No gradient hero, no decorative accent. The hero shows the real product (framed screen or static preview), not clip-art. Primary CTA uses the primary button; the only saturated color remains brand green.
- **Footer (public):** `--color-surface-subtle` background, hairline top border, Caption links to Privacy, Terms, Contact, plus language switch and copyright.

## 11. Iconography

- One set only: **lucide-react** (reliable, consistent). If a more distinctive look is wanted later, Phosphor duotone is the sanctioned alternative, but never mix sets.
- Stroke width consistent (1.75px), sizes 16 / 20 / 24 only, color inherits `currentColor` from text tokens.
- Account-type glyphs: cash, bank, card, e-wallet each get a fixed icon used everywhere that type appears.

## 12. Data visualization (this is where slop dies)

Charts follow the same color discipline as the rest of the app. Do not let the chart library pick colors.

- **Fixed series colors, always:** income = `--color-income`, expense = `--color-expense`, net/total = `--color-text` (ink line), transfer = `--color-transfer`. These never change chart to chart.
- **Category breakdown (many slices):** do NOT use a rainbow. Use either (a) a single-hue graphite-to-teal sequential ramp ordered by value, or (b) a curated qualitative set of at most 8 muted hues plus an explicit "Other" bucket for the tail. Never 15 saturated colors.
- **Chart chrome:** gridlines `--color-border` hairline only (often just a baseline), axis labels `--color-text-muted` Caption, no chart border, no default legend. The ranked number list beside the chart is the legend and the a11y fallback.
- **Tooltips:** custom, styled as a small card (`--color-surface`, border, `--shadow-md`), amounts in mono tabular.
- **Bars:** 3-4px top radius, flat fill, no 3D, no shadows on data marks, comfortable gap.
- **Lines/areas:** 2px stroke, area fill at low opacity of the series color, no glow.
- **Dark mode:** every chart color has a dark variant (use the 300-400 ramp steps for money series, dark border token for gridlines). Verify legibility on `--color-canvas` dark.
- Every chart is drillable (design.md §4.5). A non-interactive chart is decoration and should be cut.

## 13. Do / Don't

**Do**
- Keep the canvas neutral and let green/red be the only saturated color.
- Set every amount in IBM Plex Mono with tabular-nums.
- Use one component per concept (amount chip, account chip, category token) everywhere.
- Meet AA contrast in both themes; test the light theme hardest.
- Pair every chart with real numbers.

**Don't**
- Introduce a third brand color, a gradient hero, or a decorative accent.
- Use color for anything other than in / out / primary action.
- Render amounts in the sans face or with proportional figures.
- Ship default chart-library colors or an untouched component-library look.
- Remove focus rings or drop below 44px touch targets.

## 14. Token delivery

Tokens live as CSS custom properties on `:root` (light) and `.dark` (dark override), consumed through Tailwind theme extension so utilities map to variables (e.g. `bg-surface`, `text-income`). Never write raw hex in a component. Theme switch flips the `.dark` class on `<html>`; default is light with no class.

Because the app is server-rendered (Next.js), a **no-flash inline script** in the document head must set the `.dark` class before first paint whenever the stored preference is `dark`, or `system` resolving to dark. Since the default is light, most first paints have no class and no flash; the script exists only to prevent a light-to-dark flicker for users who opted into dark. Implementation in CODEBASE.md §Theming.
