---
name: new-image
description: New Image Tool Skill — scaffold a /image/* utility for toolisk.com (client-side image processing tools, distinct from /tools, /pdf, /finance, and /utilities).
---

# New Image Tool Skill

Scaffold a complete image processing tool under `/image/*` for toolisk.com. Run this skill when the user asks to add an image manipulation tool (compress, resize, convert, crop, rotate, flip, watermark, background remover, EXIF strip, etc.).

**This is a new section.** For developer tools use `/new-tool`; for finance calculators use `/new-calculator`; for PDF tools use `/new-pdf`; for everyday utilities use `/new-utility`; for health tools use `/new-health`.

The differentiating story for `/image/*` is **100% client-side, no upload, private**. Every tool must honor that — no network calls, no telemetry on file contents. This is the actual SEO + trust angle vs. tinypng, iloveimg, and most competitors which upload to servers.

This skill encodes the conventions defined when the section was launched. **Do not invent new patterns** — match what's there.

---

## Section Identity

| Property | Value |
|---|---|
| URL prefix | `/image/<slug>` |
| `parent` prop | `"image"` |
| `theme` prop | `"sky"` |
| Hero gradient | `from-sky-600 via-blue-600 to-cyan-500` |
| Badge / tag color | sky (`text-sky-600 bg-sky-50 border-sky-200/60`) |
| Accent color | `sky-600` |
| Section landing | `src/pages/image/index.tsx` |
| Component folder | `src/components/Image/` |
| Page folder | `src/pages/image/` |

---

## Step 0 — Gather inputs

Ask for (if not already provided):

- **Tool name** (e.g. `"Image Compressor"`)
- **Slug** (e.g. `compress-image`) — kebab-case, must not collide with existing keys in `STATIC_BREADCRUMB_LABELS` in `src/utils/siteConfig.ts` or filenames in `src/pages/image/`.
- **Icon emoji** (one glyph, e.g. `🗜️`, `📐`, `🖼️`, `🔄`)
- **Primary library** — `browser-image-compression` (compress), `pica` (resize), `heic2any` (HEIC convert), `@imgly/background-removal` (bg remove), `react-image-crop` (crop), native `Canvas` API (most conversions/transforms). Lazy-load per tool.
- **Short tagline** (≤ 110 chars, used in the hero — should reinforce "in your browser" / "no upload")

---

## Step 1 — First-time section bootstrap (only on the very first image tool)

If `src/pages/image/` does **not** yet exist, you MUST first create the shared infrastructure before the tool. Skip this section if the directory already exists.

1. **Extend `ToolShell` parent type** in `src/components/Tools/ToolShell.tsx`:
   In the `parent` prop JSDoc and type, add `'image'` as an option. In the body, map `'image'` to `parentLabel = 'Image Tools'`, `parentHref = '/image'`.

2. **Add the `'image'` breadcrumb label** to `STATIC_BREADCRUMB_LABELS` in `src/utils/siteConfig.ts`:
   ```ts
   'image': 'Image Tools',
   ```

3. **Create the shared Image components** under `src/components/Image/`:
   - `src/components/Image/ImageDropzone.tsx` — drag/drop + paste-from-clipboard + click-to-browse. Accepts `image/*` MIME types by default (configurable). Multi-file capable. Size cap: warn at 25 MB, hard-cap at 50 MB. Shows file thumbnails after drop. Follow the exact same pattern as `PdfDropzone.tsx` but with image MIME types and file-count + total-size display.

   - `src/components/Image/ImageTrustBadge.tsx` — lock icon + "Runs in your browser — your images never leave your device." + speed icon + "Instant — no upload, no waiting." + free icon + "No sign-up, no watermark." Same layout as `PdfTrustBadge.tsx` but with image-specific text.

   - `src/components/Image/ImagePreview.tsx` — Shows original image with dimensions label, file size, format badge. Used by most tools to display the loaded image.

   - `src/components/Image/ImageDownloadButton.tsx` — Download button using `URL.createObjectURL` + body-append pattern for Safari compat. Accepts `blob`, `fileName`, optional `disabled` state.

4. **Add the `'image'` theme gradient** to `THEME_GRADIENTS` in `src/components/Tools/ToolShell.tsx`:
   ```ts
   sky: 'from-sky-600 via-blue-600 to-cyan-500',
   ```

5. **Create the hub page** `src/pages/image/index.tsx` — modeled on `/health/index.tsx` and `/pdf/index.tsx`. Hero gradient is sky blue. Search bar. Grid of `IMAGES` cards. FAQ schema. The accent color is **sky** (matching the section brand, not emerald or rose).

6. **Export an `IMAGES` array** from `src/data/masterItems.ts`, alongside the existing arrays. Add `IMAGES` to `ALL_ITEMS` and export `IMAGE_COUNT = IMAGES.length`. Each image tool gets its own entry.

7. **Add an Image nav link** to `src/components/Layout/Header.tsx`:
   ```ts
   {
     label: 'Image',
     href: '/image',
     match: (p) => p.startsWith('/image'),
     activeClass: 'text-sky-600 bg-sky-50',
     hoverClass: 'hover:text-sky-600 hover:bg-slate-50',
   },
   ```
   Insert it between `PDF` and `Learn`.

8. **Add an Image column** to `src/components/Layout/Footer.tsx` — 5 hero image tools + "All image tools" link to `/image`.

9. **Update home page** (`src/pages/index.tsx`) per CLAUDE.md's Home Page Wiring Rule:
   - Import `IMAGE_COUNT` from `masterItems`
   - Add `{ key: 'image', label: 'Image', count: IMAGE_COUNT }` to the `filters` array
   - Add `f.key === 'image' ? 'bg-sky-600 text-white border-sky-600 shadow-sm'` branch in the active-filter ternary
   - Add `item.type === 'image' ? 'hover:shadow-sky-100/50 hover:border-sky-200'` branch for card hover shadow/border
   - Add `item.type === 'image' ? 'text-sky-600 bg-sky-50 border-sky-200/60'` for type badge color
   - Add `item.type === 'image' ? 'Image'` branch for type badge label
   - Add `item.type === 'image' ? 'group-hover:text-sky-600'` for card title hover color
   - Add `item.type === 'image' ? 'text-sky-500/80 bg-sky-50/80'` for tag chip color
   - Update `<title>`, `<meta description>`, keywords, and OG tags to mention image tools
   - Add an SEO content section for Image Tools with a "Browse all N →" link in sky color

10. **Install image libraries** (only the ones needed for the first tool):
    ```bash
    npm install browser-image-compression
    ```
    Save additional libraries (`pica`, `heic2any`, `@imgly/background-removal`, `react-image-crop`) only when individual tools need them.

After bootstrap is done, proceed with Step 2 for the specific tool.

---

## Step 2 — File layout

Exactly two files per tool. No nested directories.

```
src/components/Image/[PascalName].tsx   ← the interactive component
src/pages/image/[slug].tsx              ← page wrapper (SEO + ToolShell + ToolSEOContent)
```

The component is the workspace UI; the page is the SEO shell. The component **MUST** import and use the shared `ImageDropzone`, `ImagePreview` (if relevant), and `ImageTrustBadge` — never recreate them.

---

## Step 3 — Build the component (`src/components/Image/[PascalName].tsx`)

Every image tool component MUST:

1. **Be 100% client-side.** No network calls — none, ever. The tagline + first card must reinforce this.
2. **Lazy-load libraries** via dynamic import inside the action handler. Never `import` heavy libs at module top — that bloats the route bundle. Show an inline "Loading…" or "Processing…" state while the library loads.
3. **Use `<ImageDropzone>`** for file input. Never recreate drag-drop logic per tool.
4. **Use `<ToolCard>`** from `../Tools/ToolShell` for every panel/card. No bespoke card divs.
5. **Use `<CopyButton>`** for any copy-to-clipboard action.
6. **Render `<ImageTrustBadge>`** as the FIRST element above the workspace inside the component (not inside `ToolShell`).
7. **Use `<ImagePreview>`** if the tool displays the original image with dimensions/format info.
8. **Validate before computing:**
   - Reject non-image files with an inline error chip.
   - Warn at 25 MB ("Large file — processing may be slow on mobile").
   - Hard-cap at 50 MB ("File too large — try a smaller file").
   - For HEIC files, show "Loading HEIC support…" state while `heic2any` lazy-loads.
9. **Show progress** for any operation > 200 ms — use a determinate progress bar. For batch operations, show per-file progress (e.g. "Compressing 3 of 8…").
10. **Download cleanly — two patterns, use the right one:**

    **Single-file output** (Compress, Resize, Rotate, Flip, Crop, Watermark, etc.): show a filename `<input>` pre-filled with a sensible default, then a primary "Download" button. Use `URL.createObjectURL` + `document.body.appendChild(a); a.click(); document.body.removeChild(a)` for Safari/Firefox compatibility.

    **Multi-file output** (Convert to JPG/PNG/WebP with batch, Favicon Generator): use the **standard artifact list** — a vertical list of rows, one per output file, followed by a full-width "Download all as .zip" primary button (lazy-load `jszip` inside the handler). **Do not use thumbnail grids or `<a href download>` links in the done state — always use the list pattern.** The exact JSX:

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
            className="flex-shrink-0 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 text-xs font-medium transition-colors">
            Download
          </button>
        </div>
      ))}
    </div>

    // ZIP button (only when > 1 output)
    {outputs.length > 1 && (
      <button type="button" onClick={handleDownloadZip} disabled={isZipping}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 disabled:opacity-60 transition-all">
        {isZipping ? 'Packing zip…' : 'Download all as .zip'}
      </button>
    )}
    ```

11. **No `any` types.**
12. **Touch targets ≥ 44 px.** Test at 375 / 768 / 1024 widths.

### Imports template

```tsx
import React, { useState, useCallback } from 'react';
import { ToolCard, CopyButton } from '../Tools/ToolShell';
import ImageDropzone from './ImageDropzone';
import ImagePreview from './ImagePreview';      // if showing original image
import ImageTrustBadge from './ImageTrustBadge';
import ImageDownloadButton from './ImageDownloadButton'; // if single-file download
```

### Common patterns

- Two-column workspace: `grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 sm:gap-6` (workspace + sidebar with action button)
- Single-column (most tools): `space-y-4 sm:space-y-6`
- Action button (primary): `inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all`
- Action button (secondary): `inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`
- Error chip: `text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2`
- Progress bar: `h-2 rounded-full bg-slate-100 overflow-hidden` containing `<div className="h-full bg-sky-500 transition-all" style={{ width: \`${pct}%\` }} />`
- File-info row: `flex items-center justify-between gap-3 text-sm text-slate-600 bg-slate-50 rounded-lg border border-slate-200 px-3 py-2`
- Quality slider: `<input type="range" min={1} max={100} ... className="w-full accent-sky-600" />`

### State shape suggestion

```ts
type Status = 'idle' | 'loading-lib' | 'processing' | 'done' | 'error';
const [status, setStatus] = useState<Status>('idle');
const [files, setFiles] = useState<File[]>([]);
const [progress, setProgress] = useState(0);        // 0–100
const [error, setError] = useState<string | null>(null);
const [output, setOutput] = useState<Blob | null>(null);   // single-file output
// OR for batch:
const [outputs, setOutputs] = useState<{ name: string; blob: Blob; size: number }[]>([]);
```

Never let the action button submit while `status !== 'idle'` and `files.length > 0` — wire `disabled` accordingly.

### Library lazy-loading pattern

```ts
const handleCompress = async () => {
  setStatus('loading-lib');
  try {
    const imageCompression = (await import('browser-image-compression')).default;
    setStatus('processing');
    // ... use imageCompression
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Processing failed');
    setStatus('error');
  }
};
```

**Never statically `import` the library at the top.** The page already uses `dynamic()` with `ssr: false`, but the library must also be lazy-loaded inside the action handler so that a user landing on the page doesn't download the WASM model or compression library until they click the action button.

---

## Step 4 — Build the page (`src/pages/image/[slug].tsx`)

Use this exact structure (modeled on `/pdf/rotate-pdf.tsx`, adapted for `parent="image"` and `theme="sky"`):

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

// Dynamic import: image processing uses browser-only APIs (Canvas, File, Blob, Worker).
// ssr:false is REQUIRED — server-rendering will throw "window is not defined".
const [PascalName] = dynamic(() => import('../../components/Image/[PascalName]'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-12 text-slate-500 text-sm">Loading…</div>
  ),
});

const SLUG = '/image/[slug]';

const FAQS = [
  { q: 'Is this safe? Does it upload my image?',
    a: 'No upload. The entire tool runs in your browser using JavaScript. Your image never leaves your device, never touches our server, and is never logged.' },
  { q: 'What image formats are supported?',
    a: 'JPG, PNG, WebP, AVIF, GIF, BMP, and HEIC (iPhone photos). The tool auto-detects the format — just drop any image file.' },
  { q: 'What is the maximum file size?',
    a: 'You can process images up to ~50 MB. Files over 25 MB will be slower, especially on mobile. For very large images, try resizing first.' },
  { q: 'Will this work on mobile?',
    a: 'Yes, on modern iOS Safari and Chrome for Android. Very large images (>25 MB) may be slow on older devices due to memory constraints.' },
  // Add 2–4 tool-specific FAQs after these four baseline ones.
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
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <[PascalName] />
      </ToolShell>

      <ToolSEOContent
        description="[1–2 sentences, what + why + privacy hook, 60–80 words]"
        features={[
          '🔒 100% client-side — your image never leaves your browser',
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
              [Talk concretely about what is in images — personal photos, ID documents, private
                screenshots — and why "upload to a server" tools are a privacy risk. Tie this
                back to the tool.]
            </p>

            {/* Aim for 350–500 words of unique content. Include a "vs uploading" mini-table
                or a concrete real-world example for indexable depth. */}
          </section>
        }
        relatedTools={[
          /* 3 sibling image tools from the same intent cluster */
        ]}
      />
    </>
  );
}
```

---

## Step 5 — Design system (must follow)

### Hero
- Default gradient for `/image/*` is `from-sky-600 via-blue-600 to-cyan-500` — **always pass this explicitly to `ToolShell`** (don't rely on the default, which is the emerald `/tools` gradient). This is what visually separates the section.
- Page background: `bg-slate-50` (supplied by `ToolShell`).
- Breadcrumb: `Home › Image Tools › [Tool Name]` (handled automatically by `parent="image"`).

### Colors
- All neutrals: `slate-*` only. **Never `gray-*`.**
- Accent / primary action: `sky-600` (matches the hero, differentiates from emerald `/tools` and rose `/pdf`).
- Success: `emerald-*`. Warning: `amber-*`. Destructive / error: `rose-700` text on `rose-50` bg.
- Headings: `text-slate-900 font-bold`. Body: `text-slate-600`. Labels: `text-slate-700 font-semibold`.

### Cards & inputs
- `<ToolCard>` is the only card primitive. Workspace uses `rounded-lg` everywhere — **no `rounded-2xl`** (that's the finance idiom).
- Inputs, buttons, mono blocks: `rounded-lg`.
- Drop zone: rendered by `<ImageDropzone>` — use `dashed` variant for empty state, solid for "files queued".

### Spacing
- Workspace container is supplied by `ToolShell` (`max-w-[1440px]`); never wrap children in another container.
- Inner card padding supplied by `<ToolCard>` (`p-4 sm:p-5`).
- Section gap: `gap-4 sm:gap-6`.

### Breadcrumb registration (REQUIRED)
- Add `'<slug>': '<Tool Name>'` to `STATIC_BREADCRUMB_LABELS` in `src/utils/siteConfig.ts`. The `'image'` parent label is already there from bootstrap. Skipping this gives a capitalized-slug fallback and a malformed `BreadcrumbList` schema.

---

## Step 6 — SEO requirements (must follow)

Image tools compete with tinypng, iloveimg, squoosh — heavyweights with massive backlink profiles. The winning angle is the **privacy keyword cluster**, which the big players literally cannot rank for (they upload to a server). Lean into it on every page.

1. **Title** — `[Tool Name] — [Privacy Hook] | Toolisk`, **≤ 60 chars total**. Examples: `"Compress Image — Free, No Upload, Private | Toolisk"`, `"Rotate Image Online — In Browser, No Upload | Toolisk"`. Verify in built HTML.
2. **Meta description** — ≤ 155 chars; imperative verb + the no-upload differentiator. Example: `"Compress images in your browser — drag, adjust quality, and download. 100% private: images never leave your device. No sign-up."`
3. **Keywords** — 6–10 lowercase comma terms. MUST include at least one of: `"[tool] no upload"`, `"[tool] online private"`, `"[tool] free"`, `"[tool] in browser"`. These are the high-intent privacy-aware searches.
4. **Canonical** — always explicit: `<link rel="canonical" href={`${SITE_URL}${SLUG}`} />`.
5. **Open Graph** — `og:title`, `og:description`, `og:url`, `og:type="website"`. Do **not** set `og:image` per page; the global default in `_document.tsx` is inherited.
6. **JSON-LD** — emit `[breadcrumbSchema, softwareSchema, faqSchema]` as a single `<script type="application/ld+json">`. Pass `category: 'UtilitiesApplication'` to `generateSoftwareAppSchema` for image tools.
7. **FAQ section** — 6–8 question/answer pairs. The first 4 are the baseline privacy/format/size/mobile FAQs from the page template; add 2–4 tool-specific ones below. The same `FAQS` array feeds the accordion and the `FAQPage` schema (write once at the top of the page).
8. **Educational body** — 350–500 words of unique content in `body={}`. Required ingredients:
   - One concrete real-world example with numbers (file size before/after, resolution, etc.).
   - A "Why no-upload matters" paragraph that names concrete kinds of sensitive content images typically contain (personal photos, ID documents, private screenshots, medical images).
   - A mini "vs uploading" comparison (3–5 row table or bullet block).
9. **Internal links** — populate `relatedTools` with 3 in-cluster image siblings. Cross-link aggressively inside the cluster (Compress ↔ Convert to JPG ↔ Convert to WebP share the same user intent).

---

## Step 7 — Wire into the site (REQUIRED)

Three edits, no exceptions:

1. **`src/utils/siteConfig.ts`** — add `'<slug>': '<Tool Name>'` to `STATIC_BREADCRUMB_LABELS`.
2. **`src/data/masterItems.ts`** — append a new entry to the `IMAGES` array:
   ```ts
   {
     name: '[Tool Name]',
     description: '[~155 chars, distinct from meta description]',
     path: '/image/[slug]',
     icon: '[emoji]',
     tags: ['Image', 'Primary tag', 'Secondary tag'],
     type: 'image',
     isNew: true,
   },
   ```
   The `/image` hub auto-renders from this array — no manual hub edit needed once the entry lands here. The total `IMAGE_COUNT` exported from `masterItems.ts` updates automatically.
3. **Add reciprocal `relatedTools` entries** to ≥ 2 existing image tool pages in the same intent cluster so the new page has inbound links from day one. This is the biggest single lever against pages getting stuck in "Discovered – currently not indexed".

The sitemap regenerates automatically from `next-sitemap.config.js` on `npm run build` — no manual sitemap edit.

---

## Step 8 — Bundle-size discipline (REQUIRED for `/image`)

Heavy image-processing libraries can bloat the route bundle. A user landing on Rotate Image **must not** download the compress-image pipeline or the background-removal WASM model. Enforce this:

1. **Per-tool dynamic import.** The page-level `dynamic(() => import('…'), { ssr: false })` already handles this for the component. Inside the component, never statically import `browser-image-compression`, `heic2any`, `@imgly/background-removal`, `pica`, or `react-image-crop` — lazy-import them inside the action handler:
   ```ts
   const handleCompress = async () => {
     setStatus('loading-lib');
     const imageCompression = (await import('browser-image-compression')).default;
     setStatus('processing');
     // ... use it
   };
   ```
2. **Per-feature dynamic import only when needed.** If a tool needs `jszip` only for batch-zip download, lazy-import `jszip` inside the zip handler:
   ```ts
   const handleDownloadZip = async () => {
     const { default: JSZip } = await import('jszip');
     // ...
   };
   ```
3. **Verify after build.** Run `npm run build` and inspect the per-route bundle sizes in the Next.js output. A tool that only uses Canvas API should weigh in around 50–80 KB JS for the route shell; if it's downloading 500 KB, something was statically imported. Fix it before declaring done.

---

## Step 9 — Build gate (mandatory)

```bash
npx tsc --noEmit && npm run build
```

Both must pass before declaring done. Fix errors one at a time; re-run after each fix. Report the final page count from the Next.js build output and the per-route JS size for the new page.

---

## Checklist (verify every item)

- [ ] Component at `src/components/Image/[PascalName].tsx`; page at `src/pages/image/[slug].tsx`
- [ ] 100% client-side; **no** network requests of any kind
- [ ] `ImageDropzone`, `ImagePreview` (when relevant), `ImageTrustBadge` used — no recreated drag-drop or preview logic
- [ ] Heavy libraries (`browser-image-compression`, `heic2any`, `pica`, `react-image-crop`, `@imgly/background-removal`) are **never** statically imported — always lazy-loaded inside the action handler
- [ ] Dynamic import of the component on the page with `{ ssr: false }` + loading state
- [ ] Sample / preset image or one-click "Try with sample" where useful
- [ ] File validation: image MIME + extension; reject mismatch; warn at 25 MB; hard-cap at 50 MB
- [ ] Progress bar for any operation > 200 ms; per-file counter for batch work
- [ ] Single-file output via `URL.createObjectURL` + auto-revoke; multi-file output via lazy-loaded `jszip`
- [ ] No `any` types
- [ ] Slate-only colors; sky accent (not emerald or rose); `rounded-lg` (no `rounded-2xl` in workspace)
- [ ] Touch targets ≥ 44 px; tested at 375 / 768 / 1024
- [ ] Slug added to `STATIC_BREADCRUMB_LABELS`
- [ ] Entry added to `IMAGES` array in `src/data/masterItems.ts` (with `isNew: true`)
- [ ] ≥ 2 existing image tool pages updated to include this new tool in their `relatedTools`
- [ ] `<title>` ≤ 60 chars (including ` | Toolisk`); verified in built HTML
- [ ] `<meta description>` ≤ 155 chars; verb + no-upload differentiator
- [ ] Keywords include at least one privacy phrase (`no upload`, `online private`, `in browser`)
- [ ] Explicit `<link rel="canonical">` set
- [ ] OG tags (title, description, url, type); no per-page `og:image`
- [ ] JSON-LD emits `BreadcrumbList` + `SoftwareApplication` (`UtilitiesApplication`) + `FAQPage`
- [ ] FAQ array: 6–8 entries starting with 4 baseline privacy/format/size/mobile FAQs; same source feeds accordion + schema
- [ ] Educational body 350–500 words; includes ≥ 1 concrete example with numbers, ≥ 1 "why no-upload matters" paragraph, and 1 "vs uploading" comparison block
- [ ] 3 in-cluster `relatedTools` set on the new page
- [ ] `<ImageTrustBadge>` rendered above the workspace
- [ ] Per-route JS bundle inspected; no static import of heavy image libraries
- [ ] `npx tsc --noEmit && npm run build` passes cleanly
- [ ] Manually verified the tool with: a small JPG (< 1 MB), a large PNG (> 5 MB), a WebP file, and a HEIC file (if HEIC support is claimed)

---

## Quick reference — files & helpers you'll touch

| Purpose | File |
|---|---|
| Hero / breadcrumb shell | `src/components/Tools/ToolShell.tsx` (`ToolShell`, `ToolCard`, `CopyButton`) |
| Card + copy button | `src/components/Tools/ToolShell.tsx` (`ToolCard`, `CopyButton`) |
| File dropzone | `src/components/Image/ImageDropzone.tsx` |
| Image preview | `src/components/Image/ImagePreview.tsx` |
| Trust badge | `src/components/Image/ImageTrustBadge.tsx` |
| Download button | `src/components/Image/ImageDownloadButton.tsx` |
| SEO body | `src/components/Tools/ToolSEOContent.tsx` |
| Breadcrumb labels + schema helpers | `src/utils/siteConfig.ts` |
| Master items list | `src/data/masterItems.ts` (`IMAGES` array, `IMAGE_COUNT`) |
| Hub | `src/pages/image/index.tsx` |
| Nav | `src/components/Layout/Header.tsx` |
| Footer | `src/components/Layout/Footer.tsx` |
| Home page | `src/pages/index.tsx` |
| Sibling references for `relatedTools` | any existing page under `src/pages/image/*.tsx` |