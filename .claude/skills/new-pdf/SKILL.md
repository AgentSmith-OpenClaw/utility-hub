---
name: new-pdf
description: New PDF Tool Skill — scaffold a /pdf/* utility for toolisk.com (client-side PDF manipulation tools, distinct from /tools and /finance).
---

# New PDF Tool Skill

Scaffold a complete PDF utility under `/pdf/*` for toolisk.com. Run this skill when the user asks to add a PDF manipulation tool (merge, split, rotate, compress, convert, watermark, page-pick, etc.).

**This is a new section.** For developer/utility tools use `/new-tool`; for finance calculators use `/new-calculator`.

The differentiating story for `/pdf/*` is **100% client-side, no upload, private**. Every tool must honor that — no network calls, no telemetry on file contents. This is the actual SEO + trust angle vs. smallpdf / ilovepdf, which all upload to a server.

This skill encodes the conventions defined when the section was launched. **Do not invent new patterns** — match what's there.

---

## Step 0 — Gather inputs

Ask for (if not already provided):

- **Tool name** (e.g. `"Merge PDF"`)
- **Slug** (e.g. `merge-pdf`) — kebab-case, must not collide with existing keys in `STATIC_BREADCRUMB_LABELS` in `src/utils/siteConfig.ts` or filenames in `src/pages/pdf/`.
- **Icon emoji** (one glyph, e.g. `📎`, `📄`, `🔀`, `✂️`)
- **Primary library** — `pdf-lib` (write/edit), `pdf.js` (read/render), `jspdf` (simple), `jszip` (zip download), `tesseract.js` (OCR)
- **Short tagline** (≤ 110 chars, used in the hero — should reinforce "in your browser" / "no upload")

---

## Step 1 — First-time section bootstrap (only on the very first PDF tool)

If `src/pages/pdf/` does **not** yet exist, you MUST first create the shared infrastructure before the tool. Skip this section if the directory already exists.

1. **Extend `ToolShell` parent type** in `src/components/Tools/ToolShell.tsx`:
   ```ts
   parent?: 'tools' | 'finance' | 'pdf';
   ```
   In the body, map `'pdf'` to `parentLabel = 'PDF Tools'`, `parentHref = '/pdf'`.

2. **Add the `'pdf'` breadcrumb label** to `STATIC_BREADCRUMB_LABELS` in `src/utils/siteConfig.ts`:
   ```ts
   'pdf': 'PDF Tools',
   ```

3. **Create the shared PDF components** under `src/components/Pdf/`:
   - `src/components/Pdf/PdfDropzone.tsx` — drag/drop multi-file dropzone with file-type validation (PDF only, configurable for images), size cap warning at 30 MB, hard cap at 100 MB, MIME + extension sniff.
   - `src/components/Pdf/PdfPageGrid.tsx` — reorderable thumbnail grid (HTML5 drag-drop, not a heavy DnD library). Each tile shows page number, the rendered thumbnail (via pdf.js), and a per-tile action slot (delete / rotate / select toggle).
   - `src/components/Pdf/PdfTrustBadge.tsx` — small inline badge: lock icon + "Runs in your browser — your files never leave your device." Reused on every PDF tool page above the workspace.
   - `src/hooks/usePdfLib.ts` — lazy-imports `pdf-lib` on first call, caches the module reference. Returns `{ PDFDocument, degrees, … } | null` until ready.
   - `src/hooks/usePdfJs.ts` — lazy-imports `pdfjs-dist` + sets the worker via `pdfjsLib.GlobalWorkerOptions.workerSrc = …`. Returns `{ getDocument } | null` until ready.

4. **Install the libraries** (only on first bootstrap):
   ```bash
   npm install pdf-lib pdfjs-dist jszip
   ```
   Save additional libraries (`jspdf`, `tesseract.js`, `mammoth`, `qpdf-wasm`) only when an individual tool needs them.

5. **Create the hub page** `src/pages/pdf/index.tsx` per the hub spec (see `roadmaps/pdf-specs/00-hub-page.md`). The hub uses the same shape as `/tools/index.tsx` and `/finance/index.tsx`: hero with search, feature strip, grid of tool cards, FAQ schema. The accent color is **rose / red** (PDF brand red), not emerald or blue.

6. **Export a `PDFS` array** from `src/data/masterItems.ts`, alongside `CALCULATORS` and `TOOLS`. Add `PDFS` to `ALL_ITEMS` and add `PDF_COUNT = PDFS.length`. Each PDF tool gets its own entry.

7. **Add a `PDF` nav link** to `src/components/Layout/Header.tsx`:
   ```ts
   {
     label: 'PDF',
     href: '/pdf',
     match: (p) => p.startsWith('/pdf'),
     activeClass: 'text-rose-600 bg-rose-50',
     hoverClass: 'hover:text-rose-600 hover:bg-slate-50',
   },
   ```
   Insert it between `Tools` and `Learn`.

8. **Add a PDF column** to `src/components/Layout/Footer.tsx` matching the existing Finance / Tools columns. Include 5 hero PDF tools + an "All PDF tools" link to `/pdf`.

9. **Update home page** (`src/pages/index.tsx`) if it surfaces a section grid — add a PDF tile.

After bootstrap is done, proceed with Step 2 for the specific tool.

---

## Step 2 — File layout

Exactly two files per tool. No nested directories.

```
src/components/Pdf/[PascalName].tsx   ← the interactive component
src/pages/pdf/[slug].tsx              ← page wrapper (SEO + ToolShell + ToolSEOContent)
```

The component is the workspace UI; the page is the SEO shell. The component **MUST** import and use the shared `PdfDropzone`, `PdfPageGrid` (if pages are listed/picked), and `PdfTrustBadge` — never recreate them.

---

## Step 3 — Build the component (`src/components/Pdf/[PascalName].tsx`)

Every PDF tool component MUST:

1. **Be 100% client-side.** No network calls — none, ever. The tagline + first card must reinforce this.
2. **Lazy-load libraries** via `usePdfLib()` / `usePdfJs()`. Never `import` them at module top — that bloats the route bundle. The component should render an inline "Loading PDF engine…" state while the hook resolves.
3. **Use `<PdfDropzone>`** for file input. Never recreate drag-drop logic per tool.
4. **Use `<ToolCard>`** from `../Tools/ToolShell` for every panel/card. No bespoke card divs.
5. **Use `<CopyButton>`** for any copy-to-clipboard action.
6. **Render `<PdfTrustBadge>`** as the FIRST element above the workspace inside the component (not inside `ToolShell`).
7. **Use `<PdfPageGrid>`** if the tool involves picking, reordering, deleting, or rotating individual pages.
8. **Validate before computing:**
   - Reject non-PDF files with an inline error chip.
   - Warn at 30 MB ("Large file — processing may take a moment").
   - Hard-cap at 100 MB ("File too large — try splitting first").
   - For password-protected PDFs, surface a password prompt cleanly; never silently fail.
9. **Show progress** for any operation > 200 ms — use a determinate progress bar driven by the operation (per-page counter for multi-page work). iOS Safari kills tabs over ~1 GB RAM, so stream-process where possible (don't load all page thumbnails at once for 500-page PDFs — virtualize at 50+).
10. **Download cleanly — two patterns, use the right one:**

    **Single-file output** (Merge PDF, Rotate PDF, Compress PDF, JPG to PDF, Delete Pages, Reorder Pages): show a filename `<input>` pre-filled with a sensible default, then a primary "Download" button. Use `URL.createObjectURL` + `document.body.appendChild(a); a.click(); document.body.removeChild(a)` for Safari/Firefox compatibility.

    **Multi-file output** (Split PDF, PDF to JPG, PDF to PNG): use the **standard artifact list** — a vertical list of rows, one per output file, followed by a full-width "Download all as .zip" primary button (lazy-load `jszip` inside the handler). **Do not use thumbnail grids, `<a href download>` links, or image previews in the done state — always use the list pattern.** The exact JSX:

    ```tsx
    // Success banner
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
      <span aria-hidden="true">✓</span>
      <span>{outputs.length} {fileType}{outputs.length !== 1 ? 's' : ''} ready</span>
    </div>

    // Output list
    <div className="space-y-2">
      {outputs.map((f) => (
        <div key={f.name} className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-3 py-2">
          <span className="text-base flex-shrink-0" aria-hidden="true">{icon}</span>
          <span className="text-sm font-medium text-slate-800 flex-1 truncate">{f.name}</span>
          <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">{metadata}</span>
          <button type="button" onClick={() => handleDownloadFile(f)}
            className="flex-shrink-0 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-medium transition-colors">
            Download
          </button>
        </div>
      ))}
    </div>

    // ZIP button (only when > 1 output)
    {outputs.length > 1 && (
      <button type="button" onClick={handleDownloadZip} disabled={isZipping}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:opacity-60 transition-all">
        {isZipping ? 'Packing zip…' : 'Download all as .zip'}
      </button>
    )}
    ```

    Metadata per file type: PDFs → `{pageCount} page{s} · {sizeLabel}`; images → `{formatBytes(f.blob.size)}`. Use icon 📄 for PDF outputs, 🖼️ for image outputs. `handleDownloadFile` must use the body-append pattern (not a detached anchor click).
11. **No `any` types.**
12. **Touch targets ≥ 44 px.** Test at 375 / 768 / 1024 widths.

### Imports template
```tsx
import React, { useState, useCallback } from 'react';
import { ToolCard, CopyButton } from '../Tools/ToolShell';
import PdfDropzone from './PdfDropzone';
import PdfPageGrid from './PdfPageGrid';     // only if pages are picked/reordered
import PdfTrustBadge from './PdfTrustBadge';
import { usePdfLib } from '../../hooks/usePdfLib';
import { usePdfJs } from '../../hooks/usePdfJs';   // only if reading/rendering pages
```

### Common patterns
- Two-column workspace: `grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 sm:gap-6` (workspace + sidebar with action button)
- Single-column (most tools): `space-y-4 sm:space-y-6`
- Action button (primary): `inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all`
- Action button (secondary): `inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`
- Error chip: `text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2`
- Progress bar: `h-2 rounded-full bg-slate-100 overflow-hidden` containing `<div className="h-full bg-rose-500 transition-all" style={{ width: \`${pct}%\` }} />`
- File-info row: `flex items-center justify-between gap-3 text-sm text-slate-600 bg-slate-50 rounded-lg border border-slate-200 px-3 py-2`

### State shape suggestion
```ts
type Status = 'idle' | 'loading-lib' | 'reading' | 'processing' | 'done' | 'error';
const [status, setStatus] = useState<Status>('idle');
const [files, setFiles] = useState<File[]>([]);
const [progress, setProgress] = useState(0);        // 0–100
const [error, setError] = useState<string | null>(null);
const [output, setOutput] = useState<Blob | null>(null);
```

Never let the action button submit while `status !== 'idle'` and `files.length > 0` — wire `disabled` accordingly.

---

## Step 4 — Build the page (`src/pages/pdf/[slug].tsx`)

Use this exact structure (modeled on `/tools/regex-tester.tsx`, adapted for `parent="pdf"`):

```tsx
import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import {
  generateBreadcrumbs,
  generateFaqSchema,
  generateSoftwareAppSchema,
  SITE_URL,
} from '../../utils/siteConfig';

// Dynamic import: PDF libraries use browser-only APIs (File, Blob, Canvas, Worker).
// ssr:false is REQUIRED — server-rendering will throw "window is not defined".
const [PascalName] = dynamic(() => import('../../components/Pdf/[PascalName]'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>
  ),
});

const SLUG = '/pdf/[slug]';

const FAQS = [
  { q: 'Is this safe? Does it upload my PDF?',
    a: 'No upload. The entire tool runs in your browser using JavaScript. Your file never leaves your device, never touches our server, and is never logged.' },
  { q: 'What is the maximum file size?',
    a: 'You can process PDFs up to ~100 MB. Files over 30 MB will be slower, especially on mobile. For very large PDFs, try splitting first, then operating on the parts.' },
  { q: 'Does it work offline?',
    a: 'After the page has loaded once, yes — the PDF engine is cached and the tool runs locally. Refresh while online to update.' },
  { q: 'Will this work on iPhone / iPad?',
    a: 'Yes, on modern iOS Safari. iOS limits per-tab memory, so very large PDFs (>50 MB) may fail. Desktop browsers handle bigger files comfortably.' },
  // Add 2–3 tool-specific FAQs after these four baseline ones.
];

export default function [PascalName]Page() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: '[Tool Name]',
    slug: SLUG,
    description: '[≤155-char description; same as meta description]',
    category: 'UtilitiesApplication',
    featureList: '[Feature 1, Feature 2, …]',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>[Tool Name] — [Hook with "no upload" angle] | Toolisk</title>
        <meta name="description" content="[≤155 chars, action verb + the privacy differentiator]" />
        <meta name="keywords" content="[6–10 lowercase comma terms; include 'free [tool] no upload' and '[tool] online private']" />
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
        tagline="[tagline ≤ 110 chars — must mention 'in your browser' or 'no upload']"
        gradient="from-rose-600 via-red-600 to-orange-500"
        parent="pdf"
      >
        <[PascalName] />
      </ToolShell>

      <ToolSEOContent
        description="[1–2 sentences, what + why + privacy hook, 60–80 words]"
        features={[
          '🔒 100% client-side — your file never leaves your browser',
          '⚡ [Speed / scale differentiator]',
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

            <h3 className="text-xl font-bold text-slate-900 mt-8">[Why no-upload matters]</h3>
            <p className="text-slate-600 leading-relaxed">
              [Talk concretely about what is in PDFs — contracts, payslips, medical records — and
               why "upload to a server" tools are a privacy risk. Tie this back to the tool.]
            </p>

            {/* Aim for 350–500 words of unique content. Include a "vs uploading" mini-table
                or a concrete real-world example for indexable depth. */}
          </section>
        }
        relatedTools={[
          /* 3 sibling PDF tools from the same intent cluster — e.g. Merge ↔ Split ↔ Reorder */
        ]}
      />
    </>
  );
}
```

---

## Step 5 — Design system (must follow)

### Hero
- Default gradient for `/pdf/*` is `from-rose-600 via-red-600 to-orange-500` — **always pass this explicitly to `ToolShell`** (don't rely on the default, which is the emerald `/tools` gradient). This is what visually separates the section.
- Page background: `bg-slate-50` (supplied by `ToolShell`).
- Breadcrumb: `Home › PDF Tools › [Tool Name]` (handled automatically by `parent="pdf"`).

### Colors
- All neutrals: `slate-*` only. **Never `gray-*`.**
- Accent / primary action: `rose-600` (matches the hero, differentiates from emerald `/tools`).
- Success: `emerald-*`. Warning: `amber-*`. Destructive / error: `rose-700` text on `rose-50` bg (don't mix accent and error styling; the destructive variant uses a darker rose).
- Headings: `text-slate-900 font-bold`. Body: `text-slate-600`. Labels: `text-slate-700 font-semibold`.

### Cards & inputs
- `<ToolCard>` is the only card primitive. Workspace uses `rounded-lg` everywhere — **no `rounded-2xl`** (that's the finance idiom).
- Inputs, buttons, mono blocks: `rounded-lg`.
- Drop zone: rendered by `<PdfDropzone>` — use `dashed` variant for empty state, solid for "files queued".

### Spacing
- Workspace container is supplied by `ToolShell` (`max-w-[1440px]`); never wrap children in another container.
- Inner card padding supplied by `<ToolCard>` (`p-4 sm:p-5`).
- Section gap: `gap-4 sm:gap-6`.

### Breadcrumb registration (REQUIRED)
- Add `'[slug]': '[Tool Name]'` to `STATIC_BREADCRUMB_LABELS` in `src/utils/siteConfig.ts`. The `'pdf'` parent label is already there from bootstrap. Skipping this gives a capitalized-slug fallback and a malformed `BreadcrumbList` schema.

---

## Step 6 — SEO requirements (must follow)

PDF tools compete with smallpdf, ilovepdf, sodapdf — heavyweights with massive backlink profiles. The winning angle is the **privacy keyword cluster**, which the big players literally cannot rank for (they upload to a server). Lean into it on every page.

1. **Title** — `[Tool Name] — [Privacy Hook] | Toolisk`, **≤ 60 chars total**. Examples: `"Merge PDF — Free, No Upload, Private | Toolisk"`, `"Rotate PDF Online — In Browser, No Upload | Toolisk"`. Verify in built HTML.
2. **Meta description** — ≤ 155 chars; imperative verb + the no-upload differentiator. Example: `"Merge PDFs in your browser — drag, drop, reorder, and download. 100% private: files never leave your device. No sign-up."`
3. **Keywords** — 6–10 lowercase comma terms. MUST include at least one of: `"[tool] no upload"`, `"[tool] online private"`, `"[tool] free"`, `"[tool] in browser"`. These are the high-intent privacy-aware searches.
4. **Canonical** — always explicit: `<link rel="canonical" href={`${SITE_URL}${SLUG}`} />`.
5. **Open Graph** — `og:title`, `og:description`, `og:url`, `og:type="website"`. Do **not** set `og:image` per page; the global default in `_document.tsx` is inherited.
6. **JSON-LD** — emit `[breadcrumbSchema, softwareSchema, faqSchema]` as a single `<script type="application/ld+json">`. Pass `category: 'UtilitiesApplication'` to `generateSoftwareAppSchema` for PDF tools.
7. **FAQ section** — 6–8 question/answer pairs. The first 4 are the baseline privacy/size/offline/iOS FAQs from the page template; add 2–4 tool-specific ones below. The same `FAQS` array feeds the accordion and the `FAQPage` schema (write once at the top of the page).
8. **Educational body** — 350–500 words of unique content in `body={}`. Required ingredients:
   - One concrete real-world example with numbers (file size before/after, page count, etc.).
   - A "Why no-upload matters" paragraph that names concrete kinds of sensitive content PDFs typically contain (contracts, medical records, payslips).
   - A mini "vs uploading" comparison (3–5 row table or bullet block).
9. **Internal links** — populate `relatedTools` with 3 in-cluster PDF siblings. Cross-link aggressively inside the cluster (Merge ↔ Split ↔ Reorder ↔ Delete Pages share the same user intent).

---

## Step 7 — Wire into the site (REQUIRED)

Three edits, no exceptions:

1. **`src/utils/siteConfig.ts`** — add `'[slug]': '[Tool Name]'` to `STATIC_BREADCRUMB_LABELS`.
2. **`src/data/masterItems.ts`** — append a new entry to the `PDFS` array (created at bootstrap):
   ```ts
   {
     name: '[Tool Name]',
     description: '[~155 chars, distinct from meta description]',
     path: '/pdf/[slug]',
     icon: '[emoji]',
     tags: ['PDF', 'Primary tag', 'Secondary tag'],
     type: 'pdf',
     isNew: true,
   },
   ```
   The `/pdf` hub auto-renders from this array — no manual hub edit needed once the entry lands here. The total `PDF_COUNT` exported from `masterItems.ts` updates automatically.
3. **Add reciprocal `relatedTools` entries** to ≥ 2 existing PDF tool pages in the same intent cluster so the new page has inbound links from day one. This is the biggest single lever against pages getting stuck in "Discovered – currently not indexed".

The sitemap regenerates automatically from `next-sitemap.config.js` on `npm run build` — no manual sitemap edit.

---

## Step 8 — Bundle-size discipline (REQUIRED for `/pdf`)

`pdf-lib` is ~300 KB gzipped; `pdfjs-dist` is ~400 KB gzipped + a worker. A user landing on Rotate PDF **must not** download the compress-image pipeline. Enforce this:

1. **Per-tool dynamic import.** The page-level `dynamic(() => import('…'), { ssr: false })` already handles this for the component. Inside the component, never statically import `pdf-lib` or `pdfjs-dist` — use the `usePdfLib()` / `usePdfJs()` hooks, which lazy-load on first call.
2. **Per-feature dynamic import inside the hook.** If a tool needs `jszip` only when outputting multiple files, lazy-import `jszip` inside the action handler:
   ```ts
   const handleDownload = async () => {
     const { default: JSZip } = await import('jszip');
     // …
   };
   ```
3. **Image re-encode (Compress PDF only).** The canvas re-encode pipeline is heavy — keep it isolated in `src/components/Pdf/CompressPdf.tsx`, not in a shared module.
4. **Verify after build.** Run `npm run build` and inspect the per-route bundle sizes in the Next.js output. A tool that only uses `pdf-lib` should weigh in around 50–80 KB JS for the route shell; if a Rotate PDF page is downloading 500 KB, something was statically imported. Fix it before declaring done.

---

## Step 9 — Build gate (mandatory)

```bash
npx tsc --noEmit && npm run build
```

Both must pass before declaring done. Fix errors one at a time; re-run after each fix. Report the final page count from the Next.js build output and the per-route JS size for the new page.

---

## Checklist (verify every item)

- [ ] Component at `src/components/Pdf/[PascalName].tsx`; page at `src/pages/pdf/[slug].tsx`
- [ ] 100% client-side; **no** network requests of any kind
- [ ] `PdfDropzone`, `PdfPageGrid` (when relevant), `PdfTrustBadge` used — no recreated drag-drop or thumbnail-grid logic
- [ ] `usePdfLib()` / `usePdfJs()` hooks used — libraries never statically imported at module top
- [ ] Dynamic import of the component on the page with `{ ssr: false }` + loading state
- [ ] Sample / preset present where useful (e.g. "Try with sample.pdf" button)
- [ ] File validation: PDF MIME + extension; reject mismatch; warn at 30 MB; hard-cap at 100 MB; password prompt on encrypted PDFs
- [ ] Progress bar for any operation > 200 ms; per-page counter for multi-page work
- [ ] iOS Safari memory: virtualize thumbnail grid at 50+ pages
- [ ] Single-file output via `URL.createObjectURL` + auto-revoke; multi-file output via lazy-loaded `jszip`
- [ ] No `any` types
- [ ] Slate-only colors; rose accent (not emerald); `rounded-lg` (no `rounded-2xl` in workspace)
- [ ] Touch targets ≥ 44 px; tested at 375 / 768 / 1024
- [ ] Slug added to `STATIC_BREADCRUMB_LABELS`
- [ ] Entry added to `PDFS` array in `src/data/masterItems.ts` (with `isNew: true`)
- [ ] ≥ 2 existing PDF tool pages updated to include this new tool in their `relatedTools`
- [ ] `<title>` ≤ 60 chars (including ` | Toolisk`); verified in built HTML
- [ ] `<meta description>` ≤ 155 chars; verb + no-upload differentiator
- [ ] Keywords include at least one privacy phrase (`no upload`, `online private`, `in browser`)
- [ ] Explicit `<link rel="canonical">` set
- [ ] OG tags (title, description, url, type); no per-page `og:image`
- [ ] JSON-LD emits `BreadcrumbList` + `SoftwareApplication` (`UtilitiesApplication`) + `FAQPage`
- [ ] FAQ array: 6–8 entries starting with 4 baseline privacy/size/offline/iOS FAQs; same source feeds accordion + schema
- [ ] Educational body 350–500 words; includes ≥ 1 concrete example with numbers, ≥ 1 "why no-upload matters" paragraph, and 1 "vs uploading" comparison block
- [ ] 3 in-cluster `relatedTools` set on the new page
- [ ] `<PdfTrustBadge>` rendered above the workspace
- [ ] Per-route JS bundle inspected; no static import of `pdf-lib` / `pdfjs-dist`
- [ ] `npx tsc --noEmit && npm run build` passes cleanly
- [ ] Manually verified the tool with: a 1-page PDF, a 50-page PDF, a 30 MB PDF, a password-protected PDF (rejected gracefully)
- [ ] Tried on iOS Safari (or at least Chrome DevTools iPhone profile) with a 30 MB file

---

## Quick reference — files & helpers you'll touch

| Purpose | File |
|---|---|
| Hero / breadcrumb shell | `src/components/Tools/ToolShell.tsx` (extend `parent` once, then reuse) |
| Card + copy button | `src/components/Tools/ToolShell.tsx` (`ToolCard`, `CopyButton`) |
| File dropzone | `src/components/Pdf/PdfDropzone.tsx` |
| Page thumbnail grid | `src/components/Pdf/PdfPageGrid.tsx` |
| Trust badge | `src/components/Pdf/PdfTrustBadge.tsx` |
| Lazy-loaded PDF libs | `src/hooks/usePdfLib.ts`, `src/hooks/usePdfJs.ts` |
| SEO body | `src/components/Tools/ToolSEOContent.tsx` |
| Breadcrumb labels + schema helpers | `src/utils/siteConfig.ts` |
| Master items list | `src/data/masterItems.ts` (`PDFS` array, `PDF_COUNT`) |
| Hub | `src/pages/pdf/index.tsx` |
| Sibling references for `relatedTools` | any existing page under `src/pages/pdf/*.tsx` |
