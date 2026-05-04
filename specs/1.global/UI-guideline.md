# UI Guideline: AI Story Chain

## Aesthetic Direction

**Theme: Warm Notebook**

Like writing in a cozy journal on a rainy afternoon. Cream paper, ink-dark text, soft warm accents. Relaxed, casual, and simple — nothing competes for attention.

---

## Tech Constraints

- Next.js 15 + React 19 (App Router)
- Tailwind CSS 4 only — no external UI libraries, no CDN fonts
- No additional npm packages for UI

---

## Color Palette

```css
/* Tailwind CSS 4 custom theme — defined in globals.css */
--color-bg:        #faf7f2   /* warm cream — page background */
--color-surface:   #f3ede3   /* slightly darker cream — cards */
--color-border:    #e0d5c5   /* warm gray — dividers, borders */
--color-ink:       #2c2416   /* near-black warm — primary text */
--color-muted:     #8a7a65   /* warm gray — timestamps, labels */
--color-accent:    #c17f3e   /* amber — AI badge, highlights */
--color-human:     #5a7a5a   /* muted sage green — Human badge */
```

---

## Typography

Use system serif stack — no external fonts needed, feels like a printed page:

```css
--font-body: Georgia, 'Times New Roman', serif;
--font-ui:   ui-rounded, 'Helvetica Neue', sans-serif;  /* labels, buttons */
```

- Body text: `font-serif`, `text-base` (16px), `leading-relaxed`
- Timestamps / labels: `font-sans`, `text-xs`, `tracking-wide`, `uppercase`
- Page title: `font-serif`, `text-3xl`, `font-normal` — not bold, not loud

---

## Spacing & Layout

- Max content width: `max-w-2xl mx-auto` — narrow column, like a journal page
- Page padding: `px-6 py-10`
- Between sentence items: `gap-4`
- Card padding: `p-4`

---

## Components

### Sentence Item

```
┌─────────────────────────────────────────┐
│  "Once upon a time in a quiet village…" │
│                                         │
│  Alice          2 min ago    [Human]    │
└─────────────────────────────────────────┘
```

- Background: `--color-surface`, rounded-lg, subtle border `--color-border`
- Content: serif, `text-base`, `text-ink`
- Footer row: muted text, small caps label badge
- AI badge: amber background, warm white text
- Human badge: sage green background, white text

### Empty State

Centered, muted italic serif text:

> *"No story yet. Be the first to add a sentence."*

### Buttons

- Primary (Submit): warm amber fill, ink-dark text, no rounded pill — `rounded-md`
- Danger (Reset): ghost style, muted border, only shows red on hover

---

## Motion

Minimal. Only one effect:

- New sentence items fade + slide up on mount: `opacity-0 → opacity-100`, `translateY(8px) → 0`, duration `300ms ease-out`
- No loaders, no spinners — keep it still and calm

---

## Do / Don't

| Do | Don't |
|----|-------|
| Warm cream backgrounds | White or gray backgrounds |
| Serif body text | Sans-serif body text |
| Subtle borders | Drop shadows |
| Lowercase casual labels | ALL-CAPS aggressive labels |
| Generous line height | Tight, dense text |
| One accent color (amber) | Multiple competing colors |
