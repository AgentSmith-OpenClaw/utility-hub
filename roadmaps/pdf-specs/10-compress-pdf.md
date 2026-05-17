# Spec: Compress PDF

> Read `.claude/skills/new-pdf/SKILL.md` first.

The hardest tool in the Tier-1 set, and the highest-volume keyword in the whole vertical (~1M/mo). Save it for last — build the easier 9 first to validate the shared infrastructure, then tackle this one when `<PdfDropzone>`, `<PdfPageGrid>`, the hooks, and the rendering pipeline are all battle-tested.

This tool is more of a "smart re-encoder" than a true compressor. Real PDF compression involves font subsetting, object-stream packing, and image re-encoding. The image-re-encode pipeline is what users actually care about (it's where 90% of the size lives), and that's what we ship.

---

## Identity

| | |
|---|---|
| Slug | `compress-pdf` |
| Icon | `🗜️` |
| Tagline | `Shrink PDF file size by re-encoding embedded images — runs in your browser, no upload.` |
| Primary library | `pdf-lib` (read/write embedded image objects), `pdf.js` (page render fallback) |
| Component path | `src/components/Pdf/CompressPdf.tsx` |
| Page path | `src/pages/pdf/compress-pdf.tsx` |

---

## UX flow

1. **Empty state** — single-file dropzone.
2. **Loaded** — file row + a **compression-level selector** (segmented control, three options):
   - **Light** — JPEG quality 0.85, max dimension 2400 px. Best for printable PDFs where some fine detail must be preserved.
   - **Medium** (default) — quality 0.7, max 1800 px. Best balance for screen reading and email attachments.
   - **Strong** — quality 0.55, max 1200 px. Smallest size, suitable when "readable" is the only requirement.
3. **Preview pane** — a "before vs after" sample of page 1: left side shows the original page rendered, right side shows the re-encoded preview. Updates live as the user changes compression level. This is the trust-builder — let people see what they're trading away.
4. **Estimated size** — under the action button, show: `Original: 24.6 MB → Estimated output: ~6.8 MB (-72%)`. The estimate is computed by running the compression on **one** representative page and extrapolating; refine as the real run completes.
5. **Action button** — `Compress PDF`.
6. **Processing** — progress bar advances per page processed (since image-extraction-and-re-encode is the slow part).
7. **Done** — final actual size + percentage saved + a side-by-side comparison row: `Original 24.6 MB` / `Compressed 6.4 MB (–74%)`. Filename input + Download.

---

## Core logic

Two paths exist; ship **Path A** first and only consider Path B if Path A under-compresses real-world PDFs significantly.

### Path A — Per-page raster re-encode (simpler, smaller code, predictable)

Render each page with pdf.js at a controlled resolution (max-dimension-driven), encode that canvas as JPEG at the chosen quality, then build a new PDF where each page is just that JPEG embedded full-bleed. Page boxes and dimensions match the original.

```ts
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

interface Level { quality: number; maxPx: number; }

const LEVELS: Record<'light' | 'medium' | 'strong', Level> = {
  light:  { quality: 0.85, maxPx: 2400 },
  medium: { quality: 0.70, maxPx: 1800 },
  strong: { quality: 0.55, maxPx: 1200 },
};

async function compressPdf(
  file: File,
  level: 'light' | 'medium' | 'strong',
  onProgress: (pct: number, samplePreview?: Blob) => void,
): Promise<Blob> {
  const { quality, maxPx } = LEVELS[level];
  const bytes = await file.arrayBuffer();
  const src = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
  const out = await PDFDocument.create();

  for (let i = 1; i <= src.numPages; i++) {
    const page = await src.getPage(i);
    const native = page.getViewport({ scale: 1 });   // 72 DPI baseline
    const longSide = Math.max(native.width, native.height);
    const scale = Math.min(1, maxPx / longSide);     // never upscale
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    const blob: Blob = await new Promise((r) =>
      canvas.toBlob((b) => r(b!), 'image/jpeg', quality),
    );
    const jpgBytes = new Uint8Array(await blob.arrayBuffer());
    const embedded = await out.embedJpg(jpgBytes);
    const outPage = out.addPage([native.width, native.height]);
    outPage.drawImage(embedded, { x: 0, y: 0, width: native.width, height: native.height });
    page.cleanup();
    onProgress((i / src.numPages) * 100, i === 1 ? blob : undefined);
  }

  const bytesOut = await out.save({ useObjectStreams: true });
  return new Blob([bytesOut], { type: 'application/pdf' });
}
```

### Path B — Selective image re-encode (only if Path A under-compresses)

Walk the PDF object tree with pdf-lib, find embedded `XObject`s with `Subtype = /Image`, decode the relevant ones (JPEG via `embedJpg`, etc.), re-encode at the target quality, swap them back. Preserves vector text and shapes (much sharper text). More code, more edge cases (CMYK images, paletted images, JBIG2). **Don't ship Path B in the first version** — Path A is acceptable for the keyword target and predictably hits 50–80% reduction on real-world PDFs.

### Important tradeoffs to document in the FAQ
- Path A rasterizes everything, so text in the output is no longer selectable. Users who need selectable text should compress externally or accept Path B in a later version.
- Path A can't increase compression beyond the chosen DPI — there's a floor. A 5 MB PDF that's already heavily compressed may produce a 5 MB output.
- For PDFs that are already mostly text (~80 KB documents), Path A may produce a **larger** output. Detect this on a 1-page sample before committing to the full run, and warn the user: `"This PDF is text-heavy. Compressing may make it larger, not smaller. Skip?"`.

---

## SEO

### `<title>`
`Compress PDF — In Browser, No Upload | Toolisk`  (47 chars)

### Meta description
`Shrink PDF file size in your browser — three quality levels, live preview, instant download. No upload, no sign-up, free.`

### Keywords
`compress pdf, reduce pdf size, shrink pdf, compress pdf free, compress pdf no upload, pdf compressor online, compress pdf in browser, reduce pdf file size`

### Features
- `🔒 100% client-side — your PDF never leaves your browser`
- `🎚️ Three quality levels — Light / Medium / Strong`
- `👀 Live before/after preview of page 1`
- `📊 Estimated and actual size shown side by side`
- `⚡ Works on 50+ MB PDFs without timeouts`
- `🆓 No sign-up, no watermark, no daily quotas`

### How-to
1. **Drop your PDF** — Any size up to 100 MB.
2. **Pick a level** — Light (best detail) / Medium (best balance) / Strong (smallest).
3. **Preview** — See the before/after on page 1; switch levels live.
4. **Compress & download** — Instant download, original file untouched.

### FAQs (after the 4 baseline)

5. **`How much smaller will my PDF get?`** — It depends on what's inside. Image-heavy scans typically shrink 60–80%. Text-heavy PDFs may only shrink 10–20% (or not at all — see next FAQ). The live preview and estimated-size readout tell you what to expect before you commit.

6. **`Why did Compress make my PDF larger?`** — Most likely your PDF is already text-only and tightly compressed. Our pipeline re-renders each page as an image and re-embeds it — that's much bigger than the original text-only encoding. Skip the compress step for text-only PDFs; you don't need it.

7. **`Will the text still be selectable / searchable after compression?`** — No. We render each page as a JPG and re-embed it, which means the output is a "scan" of your PDF. If text-selection matters, don't compress — or use an external tool that handles selective image re-encoding (a feature we may add later).

8. **`Can I compress a password-protected PDF?`** — Not directly. Unlock first, then compress. Future versions may handle this in one step.

9. **`Does Strong always produce the smallest file?`** — Almost always, yes. Edge case: extremely small images may not compress further at Strong's quality 0.55 vs. Medium's 0.70 because the JPEG encoder hits a floor.

### Educational body

Cover:
- The reality of "PDF compression": file size in a PDF is dominated by embedded images. Compressing a PDF = re-encoding those images. The compression target is therefore really "how much detail in the images are you willing to give up".
- A concrete numbered example: `"A 24.6 MB PDF of scanned 300 DPI receipts → Medium compression → 6.8 MB (–72%). Same readability, much smaller email attachment."`
- A "this isn't the right tool" callout: text-only PDFs gain nothing from compression. Tell users honestly.
- "Why no upload matters" — the very PDFs people most want to compress (scanned tax returns, ID copies, signed contracts) are the most sensitive.
- Mini comparison vs server-side compressors (ilovepdf, smallpdf): server tools have a per-file size cap on the free tier, often watermark or paywall the output, and require an email for "high compression" — Toolisk has no caps, no watermarks, no email.

### Related tools
- `Merge PDF` → `/pdf/merge-pdf`
- `Split PDF` → `/pdf/split-pdf`
- `PDF to JPG` → `/pdf/pdf-to-jpg`

---

## masterItems entry

```ts
{
  name: 'Compress PDF',
  description: 'Shrink PDF file size with three quality levels and a live before/after preview. Runs entirely in your browser — no upload.',
  path: '/pdf/compress-pdf',
  icon: '🗜️',
  tags: ['PDF', 'Compress', 'Optimize'],
  type: 'pdf',
  isNew: true,
},
```

## Breadcrumb label

```ts
'compress-pdf': 'Compress PDF',
```

## Acceptance

- A scanned 24-page PDF (~25 MB) compresses to under 8 MB at Medium in < 30 s on desktop Chrome.
- Live preview of page 1 updates within 1 s of changing the compression level.
- Text-only PDF triggers the "may be larger, not smaller" warning before the full run.
- Estimated size and actual size differ by < 15% in practice.
- `tsc` + `npm run build` pass.
- This page's per-route JS chunk does NOT appear on any other PDF tool's network tab (i.e., the re-encode pipeline is isolated to this route).
