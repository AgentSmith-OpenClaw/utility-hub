---
name: new-tool
description: New Developer Tool Skill — scaffold a /tools/* utility for toolisk.com (developer/designer/writer tools, distinct from /finance calculators).
---

# New Tool Skill

Scaffold a complete developer/utility tool under `/tools/*` for toolisk.com. Run this skill when the user asks to add a new utility tool (regex, encoders, formatters, converters, generators, etc.) that is **not** a finance calculator. For finance work use `/new-calculator`.

This skill encodes the conventions already used by the 37+ existing tools under `src/pages/tools/`. **Do not invent new patterns** — match what's there.

---

## Step 0 — Gather inputs

Ask for (if not already provided):
- **Tool name** (e.g. `"YAML Validator"`)
- **Slug** (e.g. `yaml-validator`) — kebab-case, must not collide with existing keys in `STATIC_BREADCRUMB_LABELS` in `src/utils/siteConfig.ts` or filenames in `src/pages/tools/`.
- **Icon emoji** (one glyph, e.g. `🧾`)
- **Primary tag bucket** — Developer / Design / Text / Security / Productivity / Writing / Web
- **Short tagline** (≤ 110 chars, used in the hero)

---

## Step 1 — File layout

Exactly two files per tool. No nested directories.

```
src/components/Tools/[PascalName].tsx   ← the interactive component
src/pages/tools/[slug].tsx              ← page wrapper (SEO + ToolShell + ToolSEOContent)
```

The component is the workspace UI; the page is the SEO shell. Mirror existing tools — `RegexTester`, `JwtDecoder`, `JsonViewer` are good templates.

---

## Step 2 — Build the component (`src/components/Tools/[PascalName].tsx`)

Every tool component MUST:

1. **Be 100% client-side.** No network calls. State stays in the browser. The tagline should say so when relevant ("runs locally", "no data leaves your browser").
2. **Use `<ToolCard>`** from `./ToolShell` for every panel/card. No bespoke card divs.
3. **Use `<CopyButton value={...} />`** from `./ToolShell` for every copy-to-clipboard action — never recreate it.
4. **Provide a sample / preset** the user can load with one click (the existing tools all do — JsonViewer's `SAMPLE`, RegexTester's `PRESETS`, JwtDecoder's sample token). This is essential for indexable demo value.
5. **Validate input before computing.** Show inline error states; never let a calc run on bad input. Match RegexTester's error pattern (red border + helper text).
6. **No `any` types.** TypeScript strict; if a third-party library has no types, narrow with explicit interfaces.
7. **Touch targets ≥ 44px** on all interactive elements. Test at 375 / 768 / 1024 widths.

### Imports template
```tsx
import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';
```

### Common patterns
- Two-column workspace: `grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6`
- Stacked workspace: `space-y-4 sm:space-y-6`
- Textarea: `w-full min-h-[200px] font-mono text-sm p-3 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none`
- Buttons (primary): `inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700`
- Buttons (secondary): `inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`
- Error chip: `text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1`
- Mono output blocks: `font-mono text-sm bg-slate-50 rounded-lg border border-slate-200 p-3 whitespace-pre-wrap break-words`

---

## Step 3 — Build the page (`src/pages/tools/[slug].tsx`)

Use this exact structure (modeled on `regex-tester.tsx` / `jwt-decoder.tsx`):

```tsx
import Head from 'next/head';
import [PascalName] from '../../components/Tools/[PascalName]';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import {
  generateBreadcrumbs,
  generateFaqSchema,
  generateSoftwareAppSchema,
  SITE_URL,
} from '../../utils/siteConfig';

const SLUG = '/tools/[slug]';

const FAQS = [
  { q: '...', a: '...' },
  // 4–6 entries
];

export default function [PascalName]Page() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: '[Tool Name]',
    slug: SLUG,
    description: '[≤155-char description, same as meta description]',
    featureList: '[Feature 1, Feature 2, Feature 3, Feature 4, Feature 5]',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>[Tool Name] — [Short Hook] | Toolisk</title>
        <meta name="description" content="[≤155 chars, action verb + 1 differentiator]" />
        <meta name="keywords" content="[6–10 lowercase comma terms]" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="[Tool Name] | Toolisk" />
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
        title="[Tool Name]"
        tagline="[tagline ≤ 110 chars]"
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
            <h3 className="text-xl font-bold text-slate-900 mt-8">[Sub-section]</h3>
            <p className="text-slate-600 leading-relaxed">[paragraph]</p>
            {/* Aim for 300–500 words of unique educational content here */}
          </section>
        }
        relatedTools={[
          { name: '[Sibling Tool 1]', href: '/tools/[slug]', icon: '🔧' },
          { name: '[Sibling Tool 2]', href: '/tools/[slug]', icon: '🔧' },
          { name: '[Sibling Tool 3]', href: '/tools/[slug]', icon: '🔧' },
        ]}
      />
    </>
  );
}
```

---

## Step 4 — Design system (must follow)

### Hero (handled by `ToolShell`)
- Default gradient is `from-teal-600 via-emerald-600 to-green-500` — **keep it unless the user explicitly asks for a different theme.** Consistency across `/tools/*` is intentional.
- Breadcrumb is built in: `Home › Tools › [Tool Name]`. Do **not** add a second breadcrumb in your component.
- Page background: `bg-slate-50` (also handled by `ToolShell`).

### Colors
- All neutrals: `slate-*` only. **Never `gray-*`.**
- Accent / primary actions: `emerald-600` (matches the hero).
- Success: `emerald-*`. Warning/error: `rose-*` / `amber-*`. Info: `sky-*`.
- Headings: `text-slate-900 font-bold`. Body: `text-slate-600`. Labels: `text-slate-700 font-semibold`.

### Cards & inputs
- `<ToolCard>` is the only card primitive. It already supplies `rounded-lg border border-slate-200` and the layered shadow.
- Inputs, buttons, mono blocks: `rounded-lg`. Avoid `rounded-2xl` inside the workspace — that's a finance-page idiom, not a tool-page one.

### Spacing & sizing
- Workspace container is supplied by `ToolShell` (`max-w-[1440px]`); do not wrap children in another container.
- Inner card padding is supplied by `<ToolCard>` (`p-4 sm:p-5`). Don't add extra padding.
- Section gap: `gap-4 sm:gap-6`.

### Breadcrumb registration (REQUIRED)
- Add `'[slug]': '[Tool Name]'` to `STATIC_BREADCRUMB_LABELS` in `src/utils/siteConfig.ts`. This is what powers both the visible breadcrumb in `ToolShell` and the JSON-LD `BreadcrumbList` schema. **Skipping this gives you a capitalized-slug label and a malformed schema.**

---

## Step 5 — SEO requirements (must follow)

1. **Title** — `[Tool Name] — [Hook] | Toolisk`, **≤ 60 chars total**. Verify in the built HTML.
2. **Meta description** — ≤ 155 chars; lead with an imperative ("Decode…", "Convert…", "Generate…"); name one differentiator (live, offline, multi-format, etc.).
3. **Keywords** — 6–10 lowercase comma-separated terms; mix exact match + long-tail.
4. **Canonical** — always explicit: `<link rel="canonical" href={`${SITE_URL}${SLUG}`} />`.
5. **Open Graph** — `og:title`, `og:description`, `og:url`, `og:type="website"`. Do **not** set `og:image` per page; the global default in `_document.tsx` is inherited.
6. **JSON-LD** — emit `[breadcrumbSchema, softwareSchema, faqSchema]` as a single `<script type="application/ld+json">` (the helpers in `siteConfig.ts` produce all three).
7. **FAQ section** — 4–6 question/answer pairs. The same `FAQS` array feeds both the on-page accordion and the `FAQPage` schema (write it once at the top of the page).
8. **Educational body** — 300–500 words of unique content in the `body={}` prop of `ToolSEOContent`. Pure prose isn't enough; include a real-world example, a "when not to use it" caveat, or a small comparison table to give the page computational/practical value vs. paraphrase competitors.
9. **Internal links** — populate `relatedTools` with 3 in-cluster siblings from the existing list, so the new page has inbound + outbound graph links from day one. If a related explainer in `/tools/learn/*` fits, add it to `relatedArticles`.

---

## Step 6 — Wire into the site (REQUIRED)

Three edits, no exceptions:

1. **`src/utils/siteConfig.ts`** — add `'[slug]': '[Tool Name]'` to `STATIC_BREADCRUMB_LABELS`.
2. **`src/pages/tools/index.tsx`** — append a new entry to the `tools` array:
   ```ts
   {
     name: '[Tool Name]',
     description: '[~155 chars, distinct from meta description]',
     path: '/tools/[slug]',
     icon: '[emoji]',
     tags: ['Primary', 'Secondary', 'Tertiary'],
     isNew: true,
   },
   ```
   Also update the count in the page `<title>`, `<meta description>`, and OG tags (currently "36"; bump by however many you add).
3. **Add reciprocal `relatedTools` entries** to ≥ 2 existing tool pages in the same intent cluster so the new page has inbound links. This is the biggest single lever against pages getting stuck in "Discovered – currently not indexed".

The sitemap regenerates automatically from `next-sitemap.config.js` on `npm run build` — no manual sitemap edit.

---

## Step 7 — Build gate (mandatory)

```bash
npx tsc --noEmit && npm run build
```

Both must pass before declaring done. Fix errors one at a time; re-run after each fix. Report the final page count from the Next.js build output.

---

## Checklist (verify every item)

- [ ] Component at `src/components/Tools/[PascalName].tsx`; page at `src/pages/tools/[slug].tsx`
- [ ] 100% client-side; no network requests
- [ ] `<ToolCard>` used for every panel; `<CopyButton>` for every copy action
- [ ] Sample / preset present (one-click load)
- [ ] Input validation prevents bad-state computation
- [ ] No `any` types
- [ ] Slate-only colors (no `gray-*`); emerald accent
- [ ] `rounded-lg` for inputs/buttons; `<ToolCard>` for cards (no bespoke `rounded-2xl` in workspace)
- [ ] Touch targets ≥ 44px; tested at 375 / 768 / 1024
- [ ] Slug added to `STATIC_BREADCRUMB_LABELS` in `siteConfig.ts`
- [ ] Entry added to `tools` array in `src/pages/tools/index.tsx` (with `isNew: true`)
- [ ] Tool count updated in `/tools` index `<title>`, meta description, OG tags
- [ ] ≥ 2 existing tool pages updated to include this new tool in their `relatedTools`
- [ ] `<title>` ≤ 60 chars (including ` | Toolisk`); verified in built HTML
- [ ] `<meta description>` ≤ 155 chars; action verb + differentiator
- [ ] Explicit `<link rel="canonical">` set
- [ ] OG tags (title, description, url, type); no per-page `og:image`
- [ ] JSON-LD emits BreadcrumbList + SoftwareApplication + FAQPage
- [ ] FAQ array: 4–6 entries, same source feeds accordion + schema
- [ ] Educational body 300–500 words, unique, includes ≥ 1 concrete example or caveat
- [ ] 3 in-cluster `relatedTools` set on the new page
- [ ] `npx tsc --noEmit && npm run build` passes cleanly
- [ ] No console errors when interacting with the tool

---

## Quick reference — files & helpers you'll touch

| Purpose | File |
|---|---|
| Hero / breadcrumb shell | `src/components/Tools/ToolShell.tsx` (`ToolShell`, `ToolCard`, `CopyButton`) |
| SEO body | `src/components/Tools/ToolSEOContent.tsx` |
| Breadcrumb labels + schema helpers | `src/utils/siteConfig.ts` (`generateBreadcrumbs`, `generateSoftwareAppSchema`, `generateFaqSchema`, `SITE_URL`) |
| Tools index (grid + counts) | `src/pages/tools/index.tsx` |
| Sibling references for `relatedTools` | any existing page under `src/pages/tools/*.tsx` |
