# Spec: PDF to JPG

> Read `.claude/skills/new-pdf/SKILL.md` first.

Conversion tool — week 2 of the build sequencing. Shares its rendering pipeline with PDF to PNG. The PR that introduces this tool should consider building both at once and extracting a shared `renderPagesToCanvas` helper.

---

## Identity

| | |
|---|---|
| Slug | `pdf-to-jpg` |
| Icon | `🖼️` |
| Tagline | `Convert each page of a PDF to a high-quality JPG image — runs in your browser, no upload.` |
| Primary library | `pdf.js` (rendering), `jszip` (multi-file output, lazy) |
| Component path | `src/components/Pdf/PdfToJpg.tsx` |
| Page path | `src/pages/pdf/pdf-to-jpg.tsx` |

---

## UX flow

1. **Empty state** — single-file dropzone.
2. **Loaded** — file row + options panel + page-thumbnail strip via `<PdfPageGrid selectMode="multi">` (default = all pages selected). User can deselect pages they don't want.
3. **Options**:
   - **Resolution** dropdown: `Low (72 DPI)`, `Medium (150 DPI)` (default), `High (300 DPI)`. Show estimated output size next to the label (e.g. `~80 KB/page`, `~250 KB/page`, `~900 KB/page`) based on average measurements.
   - **JPG quality** slider: 50–100 (default 90). Show a small explanatory tooltip: `Higher = larger file & sharper detail.`
4. **Selection bar**: `Select all`, `Select none`, `n of m pages selected`.
5. **Action button** — `Convert n pages to JPG`.
6. **Processing** — progress bar per page rendered.
7. **Done** — show a result grid (thumbnail of each generated JPG) with per-image download buttons + a `Download all as .zip` primary button.

For a single-page result, hide the zip button.

---

## Core logic

```ts
import * as pdfjsLib from 'pdfjs-dist';
// (Worker is set inside the usePdfJs hook.)

interface RenderOpts { dpi: 72 | 150 | 300; quality: number; }

async function renderPageToBlob(
  page: pdfjsLib.PDFPageProxy,
  opts: RenderOpts,
  format: 'image/jpeg' | 'image/png',
): Promise<Blob> {
  // 72 DPI is pdf.js's native scale of 1.0. Higher DPI = larger scale.
  const scale = opts.dpi / 72;
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff'; // PDFs use transparent backgrounds by default; flatten to white for JPG.
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b!), format, format === 'image/jpeg' ? opts.quality / 100 : undefined);
  });
}

async function convertPdfToJpg(
  file: File,
  selectedPageIndices: number[],
  opts: RenderOpts,
  onProgress: (pct: number) => void,
): Promise<{ name: string; blob: Blob }[]> {
  const bytes = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
  const base = file.name.replace(/\.pdf$/i, '');
  const out: { name: string; blob: Blob }[] = [];
  for (let i = 0; i < selectedPageIndices.length; i++) {
    const pageNum = selectedPageIndices[i] + 1;
    const page = await doc.getPage(pageNum);
    const blob = await renderPageToBlob(page, opts, 'image/jpeg');
    out.push({ name: `${base}-page-${String(pageNum).padStart(3, '0')}.jpg`, blob });
    page.cleanup();
    onProgress(((i + 1) / selectedPageIndices.length) * 100);
  }
  return out;
}
```

### Edge cases
- **300 DPI on a 50-page PDF** — could produce 40+ MB of JPGs and consume substantial memory. Show a pre-flight warning if `selectedPages * estimatedSize > 100 MB`.
- **Encrypted PDF** — `getDocument` will throw `PasswordException`. Catch and surface a password prompt; on success, retry with the password.
- **Page with transparent regions** — flatten to white background (see canvas fill above). Don't let users see "see-through" page edges.
- **Memory release** — call `page.cleanup()` after each page; otherwise pdf.js keeps everything in memory.

---

## SEO

### `<title>`
`PDF to JPG — In Browser, No Upload | Toolisk`  (46 chars)

### Meta description
`Convert PDF pages to JPG images — pick pages, choose resolution (72 / 150 / 300 DPI), download as zip. Runs in your browser. No upload, no sign-up.`

### Keywords
`pdf to jpg, pdf to jpeg, convert pdf to jpg, pdf to image, pdf to jpg high quality, pdf to jpg no upload, pdf to jpg online, extract images from pdf`

### Features
- `🔒 100% client-side — your PDF never leaves your browser`
- `🎯 Pick which pages to convert — not all-or-nothing`
- `🔍 Three resolutions: 72 / 150 / 300 DPI`
- `🎛️ Adjustable JPG quality (50–100)`
- `📦 Download individually or as a single zip`
- `🆓 Free, no watermark, no daily limits`

### How-to
1. **Drop your PDF** — Any size up to 100 MB.
2. **Pick pages** — Click thumbnails to include or exclude (default: all selected).
3. **Choose quality** — Resolution and JPG quality slider.
4. **Convert & download** — Per-image downloads or the all-in-one zip.

### FAQs (after the 4 baseline)
5. **`What resolution should I pick?`** — 72 DPI is screen quality (web, email). 150 DPI is print-ready for most uses. 300 DPI is publication-grade and noticeably larger files. Default is 150 — adjust up only if you'll print.
6. **`Why are my JPGs slightly different from the original page?`** — JPG is lossy by definition: rasterization + JPG compression introduces minor color and edge changes. For pixel-perfect output, use PDF to PNG instead.
7. **`Can I extract images embedded in the PDF directly?`** — No. This tool renders each page as one image. To extract embedded image assets, you'd need a PDF parser — a feature we may add separately later.
8. **`My PDF is 200 pages. Will my browser crash?`** — Probably not, but the progress is slower and the zip download is large. Try splitting first (use the Split PDF tool) and converting in batches.

### Educational body

Cover:
- When you actually need page-as-image vs. extracted-asset: thumbnails for an image gallery, source frames for a video, embeddable previews for a webpage, asset prep for design tools that don't read PDF.
- Worked example with concrete file sizes: `"A 10-page PDF (1.2 MB) at 150 DPI quality 90 produces ~2.4 MB of JPGs (240 KB per page). At 300 DPI quality 95 the same PDF produces ~9 MB."`
- "Why no upload matters" with PDF-specific examples.
- A note on the lossy nature of JPG and a CTA to PDF to PNG for lossless.

### Related tools
- `PDF to PNG` → `/pdf/pdf-to-png`
- `JPG to PDF` → `/pdf/jpg-to-pdf`
- `PDF to Text` → `/pdf/pdf-to-text`

---

## masterItems entry

```ts
{
  name: 'PDF to JPG',
  description: 'Render PDF pages as JPG images at 72/150/300 DPI. Pick pages, set quality, download as zip — all in your browser.',
  path: '/pdf/pdf-to-jpg',
  icon: '🖼️',
  tags: ['PDF', 'Convert', 'Image'],
  type: 'pdf',
  isNew: true,
},
```

## Breadcrumb label

```ts
'pdf-to-jpg': 'PDF to JPG',
```

## Acceptance

- 10-page PDF at 150 DPI converts in < 6 s on desktop Chrome.
- `Select none` / `Select all` toggle works.
- Output filenames are zero-padded (`-page-001.jpg`) so they sort correctly.
- Lazy-loaded `jszip` confirmed via DevTools.
- `tsc` + `npm run build` pass; per-route JS ≤ 100 KB shell + lazy pdf.js chunk.
