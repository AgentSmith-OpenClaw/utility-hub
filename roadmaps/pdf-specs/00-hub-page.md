# Spec: `/pdf` Hub Page

> Read the skill at `.claude/skills/new-pdf/SKILL.md` first. This spec describes only the hub. It assumes the **first-time bootstrap section of the skill has already been executed** — `ToolShell` extended to support `parent="pdf"`, shared components scaffolded, `PDFS` array exported from `masterItems.ts`, header / footer / breadcrumb-label updated.

The hub is the landing page for the entire `/pdf` section. Same role as `/tools/index.tsx` for utility tools and `/finance/index.tsx` for calculators. It must mirror the structure of `/tools/index.tsx` very closely so the UX is consistent across sections.

---

## File

`src/pages/pdf/index.tsx`

A single file. No hub-specific subcomponent — the hub reads from the `PDFS` array in `src/data/masterItems.ts` and renders inline, exactly as `/tools/index.tsx` reads from `TOOLS`.

---

## Imports

```tsx
import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { PDFS as pdfTools } from '../../data/masterItems';
```

---

## Page structure (in order)

1. **`<Head>`** — see SEO section below.
2. **Hero section** — gradient background, icon + H1 + tagline + search box. Same shape as `/tools/index.tsx` lines 105–153, but with the PDF gradient + copy.
3. **Feature strip** — 3 cards on white, between hero and grid. Same shape as `/tools/index.tsx` lines 156–188.
4. **Tools grid** — card grid filtered by search. Same shape and card markup as `/tools/index.tsx` lines 191–258.
5. **SEO content article** — long-form below the grid. Sections: "Why use Toolisk PDF tools?", "What each tool does", "Privacy: why in-browser matters", "FAQ", "Learn more". Same outer container as `/tools/index.tsx` lines 261–414, with PDF-specific copy.

Do not invent additional sections. The point is consistency.

---

## Hero copy

- Icon: `📄`
- H1: `Toolisk PDF Tools`
- Tagline: `Merge, split, rotate, compress, and convert PDFs — entirely in your browser. No upload, no sign-up.`
- Search placeholder: `Search PDF tools… e.g. merge, split, compress`
- KBD chip: `{pdfTools.length} tools`

**Gradient** (this is what visually separates the section):
```
bg-gradient-to-r from-rose-600 via-red-600 to-orange-500
```

The hero search input mirrors `/tools/index.tsx` exactly — same classes, same clear-button, same `kbd` chip on the right. The only swap is the focus accent: change `focus:ring-emerald-500` / `group-focus-within:text-emerald-500` to `focus:ring-rose-500` / `group-focus-within:text-rose-500`.

---

## Feature strip copy (3 cards)

| Icon | Heading | Body |
|---|---|---|
| 📄 | **Built for everyday PDF work** | Merge contracts, split scanned bundles, rotate misaligned pages, compress oversized exports, convert to and from images. The PDF jobs that always come up, solved in one place. |
| 🔒 | **No upload — really** | Every tool runs in your browser using JavaScript. Files never travel to a server, never get logged, and never sit in someone else's storage. Other PDF sites can't make this claim, because they upload. |
| ⚡ | **{pdfTools.length} tools, no friction** | Drag, drop, download. No sign-up, no email, no watermarks, no daily limits. Works on any modern browser — desktop or mobile. |

Use the same icon chip background as `/tools/index.tsx` (`bg-teal-50`) but swap to `bg-rose-50` for visual consistency with the section accent.

---

## Tools grid

Filtering logic: identical to `/tools/index.tsx` — search filters by name / description / tag, case-insensitive, trims whitespace. Empty-state copy: `No PDF tools match "{search}"`.

Card markup: identical to `/tools/index.tsx` lines 206–246, with these swaps:
- `hover:shadow-emerald-100/50` → `hover:shadow-rose-100/50`
- `hover:border-emerald-200` → `hover:border-rose-200`
- `group-hover:text-emerald-600` → `group-hover:text-rose-600`
- `text-emerald-700 bg-emerald-50 border-emerald-200/60` (New badge) → `text-rose-700 bg-rose-50 border-rose-200/60`
- `text-emerald-600/80 bg-emerald-50/80` (tag chip) → `text-rose-600/80 bg-rose-50/80`

Grid breakpoints: `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5` (same as `/tools`).

Trailing footer note (when no search): `All tools run client-side — your PDFs never leave your browser.`

---

## SEO content (below the grid)

Same outer container as `/tools/index.tsx`:
```tsx
<article className="max-w-4xl mx-auto px-4 pb-20">
  <div className="bg-white rounded-lg border border-slate-200/80 p-8 sm:p-10 space-y-10">
    {/* sections */}
  </div>
</article>
```

### Section 1 — Why use Toolisk PDF tools?

Two paragraphs, ~180 words total. Lead with the privacy difference vs smallpdf / ilovepdf / sodapdf, then talk about UX (drag-to-reorder, instant downloads, no sign-up). End with a soft sell: "the kind of tools you bookmark and use whenever a PDF shows up in your inbox".

### Section 2 — What you can do with each tool

A list of `<h3>` per shipped PDF tool — same shape as `/tools/index.tsx` lines 274–349. Each item: `<h3>` with a `<Link>` to the tool, then a one-paragraph description (~50 words).

Render this dynamically from `pdfTools` so it stays in sync as new tools land:
```tsx
{pdfTools.map((tool) => (
  <div key={tool.path}>
    <h3 className="text-lg font-semibold text-slate-800 mb-1">
      <Link href={tool.path} className="text-rose-600 hover:underline">{tool.name}</Link>
    </h3>
    <p className="text-slate-600 leading-relaxed">{tool.description}</p>
  </div>
))}
```

### Section 3 — Privacy: why in-browser matters

One paragraph (~120 words). Talk about what PDFs typically contain (contracts, payslips, medical records, signed agreements). Spell out the difference between "upload to a server" and "process locally". This is the keyword bait paragraph — naturally include `"upload"`, `"private"`, `"browser"`, `"server"`, `"local"`, `"no sign-up"`.

### Section 4 — FAQ

Five questions. The first four MUST match the baseline FAQs in the skill (privacy / max file size / offline / iOS) for cross-page consistency. Add one hub-specific question: `"Why is Toolisk's PDF tools free?"`.

Render with the same `<details>`/`<summary>` markup as `/tools/index.tsx`, swapping `emerald` → `rose` for the chevron color.

### Section 5 — Learn more

A `<ul>` of 3–5 links to `/tools/learn/*` or `/pdf/learn/*` articles when they exist. Until the first learn-article ships, omit this section entirely — don't link to placeholder URLs.

---

## SEO meta

- **`<title>`** (≤ 60 chars): `` `Free PDF Tools — Merge, Split, Compress | Toolisk` ``  (52 chars — leaves headroom)
- **Meta description** (≤ 155 chars):
  `` `Free PDF tools that run in your browser — merge, split, compress, rotate, convert to JPG. No upload, no sign-up, no watermarks. Private and fast.` ``
- **Keywords**: `pdf tools, merge pdf, split pdf, compress pdf, rotate pdf, pdf to jpg, jpg to pdf, free pdf editor, pdf no upload, online pdf private`
- **Canonical**: `https://toolisk.com/pdf`
- **OG title**: same as `<title>`
- **OG description**: same as meta description (or trimmed to ≤ 120 chars)
- **OG url**: `https://toolisk.com/pdf`
- **OG type**: `website`
- **Twitter card**: `summary`

---

## JSON-LD (two scripts)

1. **`ItemList`** of every entry in `PDFS` — same shape as `/tools/index.tsx` lines 47–65, but `name: 'Toolisk PDF Tools'` and `description: 'Free in-browser PDF utilities — merge, split, compress, rotate, and convert.'`.
2. **`FAQPage`** with the same four-question baseline as the on-page FAQ (privacy / max file size / offline / iOS), so the hub itself can earn an FAQ rich snippet.

Plus the standard `BreadcrumbList` via `generateBreadcrumbs('/pdf')`.

---

## Wiring (already done if the skill bootstrap ran)

- Header nav link to `/pdf` exists.
- Footer column with 5 hero PDF tools + "All PDF tools" exists.
- `'pdf': 'PDF Tools'` in `STATIC_BREADCRUMB_LABELS`.
- `PDFS` exported from `masterItems.ts`.

If any of these is missing when this page is built, do them now — they belong with the hub, not with an individual tool.

---

## Acceptance

- Loads at `/pdf` with the rose gradient hero.
- Search filters cards live as you type.
- Grid is empty until the first PDF tool lands (the foundation-4 specs in this directory build the first four tools).
- All four `<head>` requirements present in the built HTML.
- `npx tsc --noEmit && npm run build` passes.
- Lighthouse SEO score ≥ 95 on the built page.
