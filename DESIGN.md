# Design

<!-- impeccable:design-schema 1 -->

## World

Midnight operator console. Near-black navy ground with aurora washes,
electric azure carry, cyan sparks. Glassy topbar, glowing rail pill,
luminous stat numerals, tables with glass sticky headers. Neutral training
identity — no company branding anywhere.

## Palette (OKLCH)

- Ground `--bg` 0.198/0.032/266, washes of azure and cyan at low alpha
- Surfaces `--surface` 0.252/0.042/266, `--surface-2` 0.29/0.05/266
- Ink `--ink` 0.93, secondary `--ink-2` tinted blue 0.698/0.035/262 (never gray)
- Lines `--line` 0.38/0.055/266
- Action gradient `--grad`: azure 0.62/0.17/258 → cyan 0.72/0.13/205
- States: success 152, danger 24, info 254, violet 300 — all as bg washes + ink

## Type

Single system sans everywhere (offline-safe training machines). H2 20–22px
tight tracking; table headers 11.5px uppercase +0.07em; data in tabular
numerals; stat numerals 32–38px weight 800 with soft color-matched glow.

## Components

- Buttons: gradient primary with neon shadow, lift on hover, press on active;
  quiet secondary; red-gradient danger
- Tables (`.data-table`): separate borders, glass sticky header, hover row
  glows with 2px azure inset bar
- Forms (`.panel`): dark card, labels tint cyan on focus-within, red invalid rings
- Feedback: shimmer skeletons for content, blurred overlay spinner for
  mutations, glowing toasts, dashed empty states, red-glow error boxes
- Badges: uppercase pill, text + color (never color-only)
- One authored motion: workspace `rise-in` on route change (220ms); all other
  transitions 140–170ms state feedback only; reduced-motion respected

## Browser surfaces

Themed selection, cyan focus rings, thin tinted scrollbars, styled placeholders
and select options.
