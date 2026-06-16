# Drive Max USA — Website Redesign (2026)

**Design-only project. No backend.** Plain HTML + CSS + Tailwind (CDN). No build step, no `npm`, no `node_modules` — open any `.html` file directly in a browser and it works.

## What this is
Full redesign of the Drive Max USA dealership site (drivemaxusa.com). A pre-owned & luxury car dealer in Woodbury, NY. Financing-first model; key differentiator = **ITIN / Tax ID financing ("No SSN or DOB")**.

We reuse the *meaning/structure* of the old site's sections — never its visual design or copy.

## File tree
```
index.html              ← Home page
design.html             ← Design-system reference (colors, type, components)
css/
  tokens.css            ← SINGLE SOURCE OF TRUTH (tokens + type + components)
js/
  tailwind.config.js    ← Tailwind CDN config (maps tokens → utilities)
  reveal.js             ← tiny scroll-reveal (vanilla, no deps)
images/
  hero/  vehicles/  icons/   ← drop images here, reference as /images/...
CLAUDE.md
```

Planned pages: **index (Home) → SRP (search results) → VDP (vehicle detail).**

## How it works
Every page includes, in `<head>`, in this order:
1. Google Fonts — **Sora** (display/headings/price), **Inter** (body/UI), **JetBrains Mono** (eyebrow/data).
2. Tailwind CDN: `<script src="https://cdn.tailwindcss.com"></script>`
3. Token config: `<script src="js/tailwind.config.js"></script>`
4. `<link rel="stylesheet" href="css/tokens.css" />`

Then Tailwind utilities (`bg-navy`, `text-blue`, `rounded-field`, `font-display`…) and the component/type classes from `tokens.css` are both available.

## Single source of truth — `css/tokens.css`
All design decisions live here as CSS variables: colors, type scale, radius, shadows, layout.
**Change a value once → it updates across every page and `design.html`.** Tailwind reads the same vars via `js/tailwind.config.js`, so utilities stay in sync too.

### Token-driven classes (defined in tokens.css)
- **Typography (role-based):** `.t-display-xl .t-display-l .t-h1 .t-h2 .t-h3 .t-h4 .t-eyebrow .t-lead .t-body .t-body-sm .t-caption .t-label .t-button .t-price .t-data` — each carries the exact font/size(clamp)/line-height/letter-spacing/weight from the type scale.
- **Buttons:** `.btn` + `.btn--primary|secondary|outline|ghost|danger|link` + `.btn--sm|lg|block`. Amber `.btn--primary` = primary CTA ONLY.
- **Forms:** `.field`, `.ctrl` (inputs/select/textarea — tighter `--radius-field: 8px`).
- **Badges:** `.badge` + `.badge--neutral|blue|success|danger|warning`.
- **Cards:** `.card`, `.card__media`, `.card__body`.
- **Layout:** `.container`.
- **Reveal:** add `data-reveal` (+ optional `data-reveal-delay="0.1"`) to animate in on scroll.

## Design rules (locked)
- Palette: light automotive — white/off-white surfaces; logo blues (navy `#1C1F53` / blue `#2A4FA2` / cyan `#4CB8E9`) as ACCENTS, not fills; **amber `#F5A623` = primary CTA only**.
- Mood: clean / modern light.
- Do NOT use colors from the client reference screenshots — they were pattern refs only.
- Fonts: Sora / Inter / JetBrains Mono per the type scale.

## Conventions
- New page → copy the `<head>` block from `index.html` so fonts/Tailwind/config/tokens load identically.
- Reuse `tokens.css` classes before writing new CSS. If a value is reused, add it as a token in `tokens.css`, don't hardcode.
- Images go in `images/`, referenced as `/images/...`. Placeholders use soft token gradients with a `<!-- /images/... -->` note.
