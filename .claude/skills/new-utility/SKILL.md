---
name: new-utility
description: New Utility Skill — scaffold a /utilities/* everyday-tools page for toolisk.com (general-purpose utilities like percentage calculator, age calculator, unit converter — distinct from /tools developer utilities and /finance calculators).
---

# New Utility Skill

Scaffold a complete everyday utility under `/utilities/*` for toolisk.com. Use this skill when the user asks to add a general-purpose, non-developer, non-finance everyday tool (percentage calculator, age & date math, unit converter, timezone converter, tip splitter, dog-years calculator, days-between-dates, etc.).

**Section identity:** The user-facing label is **"Everyday Tools"**. The type slug is **`'utility'`**. The route is `/utilities/[slug]`.

**Boundaries:**
- Finance work → `/new-calculator` (path: `/finance/*`)
- Developer/designer/writer tools → `/new-tool` (path: `/tools/*`)
- PDF tools → `/new-pdf` (path: `/pdf/*`)
- Health/fitness (BMI, calorie, body fat, etc.) → future `/new-health` skill — DO NOT put under utilities

If unsure, ask before creating.

---

## Step 0 — Gather inputs

Ask for (if not already provided):
- **Utility name** (e.g. `"Timezone Converter"`)
- **Slug** (e.g. `timezone-converter`) — kebab-case, must not collide with any key in `STATIC_BREADCRUMB_LABELS` (`src/utils/siteConfig.ts`) or any existing route.
- **Icon emoji** (one glyph, e.g. `🌍`)
- **Primary tag bucket** — Math / Date & Time / Conversion / Productivity / Everyday
- **Short tagline** (≤ 110 chars)

---

## Step 1 — File layout

Exactly two files per utility. No nested directories.

```
src/components/Utilities/[PascalName].tsx   ← interactive component
src/pages/utilities/[slug].tsx              ← page wrapper (SEO + ToolShell + ToolSEOContent)
```

The existing `/tools/*` and `/utilities/*` pages share the same `ToolShell` + `ToolSEOContent` infrastructure — reuse it. The only differences are the route, the section theme color (amber), and the breadcrumb.

---

## Step 2 — Build the component (`src/components/Utilities/[PascalName].tsx`)

Every utility component MUST:

1. **Be 100% client-side.** No network calls. State stays in the browser.
2. **Use `<ToolCard>`** from `../Tools/ToolShell` for every panel/card. No bespoke card divs.
3. **Use `<CopyButton value={...} />`** from `../Tools/ToolShell` for every copy action — never recreate it.
4. **Provide a sample / preset** the user can load with one click (e.g. "Today" button, common preset value). Essential for indexable demo value.
5. **Validate input before computing.** Show inline error states.
6. **No `any` types.**
7. **Touch targets ≥ 44px.** Test at 375 / 768 / 1024 widths.
8. **Amber accent** for primary actions and focus rings (see "Design system" below). This is the visible signal that a page belongs to Everyday Tools.

### Imports template
```tsx
import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from '../Tools/ToolShell';
```

### Common patterns
- Two-column workspace: `grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6`
- Stacked workspace: `space-y-4 sm:space-y-6`
- Input: `w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-50 outline-none`
- Buttons (primary): `inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700`
- Buttons (secondary): `inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`
- Error chip: `text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1`
- Mono output blocks: `font-mono text-sm bg-slate-50 rounded-lg border border-slate-200 p-3`
- Result cards (highlighted output): `bg-amber-50 border border-amber-200 rounded-lg p-4`

---

## Step 3 — Build the page (`src/pages/utilities/[slug].tsx`)

Use this exact structure (modeled on the existing `/tools/*` pages, but with `theme="amber"` on `ToolShell`):

```tsx
import Head from 'next/head';
import [PascalName] from '../../components/Utilities/[PascalName]';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import {
  generateBreadcrumbs,
  generateFaqSchema,
  generateSoftwareAppSchema,
  SITE_URL,
} from '../../utils/siteConfig';

const SLUG = '/utilities/[slug]';

const FAQS = [
  { q: '...', a: '...' },
  // 4–6 entries
];

export default function [PascalName]Page() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: '[Utility Name]',
    slug: SLUG,
    description: '[≤155-char description, same as meta description]',
    featureList: '[Feature 1, Feature 2, Feature 3, Feature 4, Feature 5]',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>[Utility Name] — [Short Hook] | Toolisk</title>
        <meta name="description" content="[≤155 chars, action verb + 1 differentiator]" />
        <meta name="keywords" content="[6–10 lowercase comma terms]" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="[Utility Name] | Toolisk" />
        <meta property="og:description" content="[≤120 chars]" />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]),
          }}
        />
      </Head>

      <ToolShell
        icon="[emoji]"
        title="[Utility Name]"
        tagline="[tagline ≤ 110 chars]"
        theme="amber"
      >
        <[PascalName] />
      </ToolShell>

      <ToolSEOContent
        description="[1–2 sentences, what + why, 60–80 words]"
        features={[
          '⚡ [Feature 1]',
          '🔒 [Feature 2 — privacy hook]',
          '📋 [Feature 3]',
          '🎯 [Feature 4]',
          '📚 [Feature 5]',
          '🛡️ [Feature 6]',
        ]}
        steps={[
          { title: '[Step 1]', desc: '[≤25 words]' },
          { title: '[Step 2]', desc: '[≤25 words]' },
          { title: '[Step 3]', desc: '[≤25 words]' },
          { title: '[Step 4]', desc: '[≤25 words]' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">[Educational H2]</h2>
            <p className="text-slate-600 leading-relaxed">[paragraph]</p>
            {/* 300–500 words of unique educational content */}
          </section>
        }
        relatedTools={[
          { name: '[Sibling Utility 1]', href: '/utilities/[slug]', icon: '🔧' },
          { name: '[Sibling Utility 2]', href: '/utilities/[slug]', icon: '🔧' },
          { name: '[Sibling Utility 3]', href: '/utilities/[slug]', icon: '🔧' },
        ]}
      />
    </>
  );
}
```

**`theme="amber"` is required.** If `ToolShell` does not yet support a theme prop, extend it to accept `theme?: 'emerald' | 'amber' | 'rose'` (defaulting to `emerald`) and apply the corresponding hero gradient + breadcrumb accent. The migration job (see `MIGRATE_UTILITIES.md`) introduces this prop.

---

## Step 4 — Design system (must follow)

### Hero (handled by `ToolShell` with `theme="amber"`)
- Amber gradient: `from-amber-500 via-orange-500 to-yellow-400`
- Breadcrumb: `Home › Everyday Tools › [Utility Name]` (built in)
- Page background: `bg-slate-50`

### Colors
- All neutrals: `slate-*`. **Never `gray-*`.**
- Accent / primary actions: `amber-600`.
- Success: `emerald-*`. Warning/error: `rose-*`. Info: `sky-*`.
- Headings: `text-slate-900 font-bold`. Body: `text-slate-600`. Labels: `text-slate-700 font-semibold`.

### Cards & inputs
- `<ToolCard>` from `../Tools/ToolShell` is the only card primitive.
- Inputs, buttons, mono blocks: `rounded-lg`.

### Spacing & sizing
- Workspace container is supplied by `ToolShell` (`max-w-[1440px]`); do not wrap children in another container.
- `<ToolCard>` already supplies `p-4 sm:p-5`.
- Section gap: `gap-4 sm:gap-6`.

### Breadcrumb registration (REQUIRED)
- Add `'[slug]': '[Utility Name]'` to `STATIC_BREADCRUMB_LABELS` in `src/utils/siteConfig.ts`.
- Ensure `'utilities': 'Everyday Tools'` is present (it should be after the migration).

---

## Step 5 — SEO requirements (must follow)

1. **Title** — `[Utility Name] — [Hook] | Toolisk`, **≤ 60 chars total**. Verify in built HTML.
2. **Meta description** — ≤ 155 chars; lead with an imperative ("Calculate…", "Convert…", "Find…"); name one differentiator.
3. **Keywords** — 6–10 lowercase comma-separated terms; mix exact-match + long-tail.
4. **Canonical** — always explicit.
5. **Open Graph** — `og:title`, `og:description`, `og:url`, `og:type="website"`. No per-page `og:image`.
6. **JSON-LD** — emit `[breadcrumbSchema, softwareSchema, faqSchema]` as a single script.
7. **FAQ section** — 4–6 question/answer pairs. Single `FAQS` array feeds both accordion and schema.
8. **Educational body** — 300–500 words of unique content with a concrete example, "when not to use", or comparison.
9. **Internal links** — 3 sibling `relatedTools` from the same intent cluster.

---

## Step 6 — Wire into the site (REQUIRED)

Four edits, no exceptions:

1. **`src/utils/siteConfig.ts`** — add `'[slug]': '[Utility Name]'` to `STATIC_BREADCRUMB_LABELS`.

2. **`src/pages/utilities/index.tsx`** — append a new entry to the `utilities` array:
   ```ts
   {
     name: '[Utility Name]',
     description: '[~155 chars]',
     path: '/utilities/[slug]',
     icon: '[emoji]',
     tags: ['Primary', 'Secondary', 'Tertiary'],
     isNew: true,
   },
   ```
   Update the count in the page `<title>`, `<meta description>`, and OG tags.

3. **`src/data/masterItems.ts`** — append to the `UTILITIES` array with `type: 'utility'`. The home page and `/utilities` index both read from here.

4. **Add reciprocal `relatedTools` entries** to ≥ 2 existing `/utilities/*` pages in the same intent cluster.

The sitemap regenerates automatically from `next-sitemap.config.js` on `npm run build`.

---

## Step 7 — Build gate (mandatory)

```bash
npx tsc --noEmit && npm run build
```

Both must pass before declaring done. Report the final page count.

---

## Checklist (verify every item)

- [ ] Component at `src/components/Utilities/[PascalName].tsx`
- [ ] Page at `src/pages/utilities/[slug].tsx`
- [ ] 100% client-side; no network requests
- [ ] `<ToolCard>` for every panel; `<CopyButton>` for every copy
- [ ] One-click sample / preset present
- [ ] Input validation prevents bad-state computation
- [ ] No `any` types
- [ ] Amber accent (`amber-600`), slate neutrals only
- [ ] `theme="amber"` passed to `ToolShell`
- [ ] Touch targets ≥ 44px; responsive at 375 / 768 / 1024
- [ ] Slug added to `STATIC_BREADCRUMB_LABELS`
- [ ] Entry added to `utilities` array in `/utilities/index.tsx`
- [ ] Utility count bumped in `/utilities` index `<title>` + meta
- [ ] Entry added to `UTILITIES` in `src/data/masterItems.ts` with `type: 'utility'`
- [ ] ≥ 2 existing `/utilities/*` pages updated to include this new utility in their `relatedTools`
- [ ] `<title>` ≤ 60 chars; verified in built HTML
- [ ] `<meta description>` ≤ 155 chars
- [ ] Explicit `<link rel="canonical">`
- [ ] OG tags present (no per-page `og:image`)
- [ ] JSON-LD: BreadcrumbList + SoftwareApplication + FAQPage
- [ ] FAQs: 4–6 entries
- [ ] Educational body 300–500 words with ≥ 1 concrete example
- [ ] 3 in-cluster `relatedTools`
- [ ] `npx tsc --noEmit && npm run build` passes cleanly

---

## Quick reference — files & helpers

| Purpose | File |
|---|---|
| Hero / breadcrumb shell | `src/components/Tools/ToolShell.tsx` (`ToolShell`, `ToolCard`, `CopyButton`) |
| SEO body | `src/components/Tools/ToolSEOContent.tsx` |
| Breadcrumb labels + schema helpers | `src/utils/siteConfig.ts` |
| Utilities index (grid + counts) | `src/pages/utilities/index.tsx` |
| Master items (single source of truth) | `src/data/masterItems.ts` |
| Home-page wiring rule | `CLAUDE.md` § "Home Page Wiring Rule" |
