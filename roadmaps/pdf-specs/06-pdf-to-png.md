# Spec: PDF to PNG

> Read `.claude/skills/new-pdf/SKILL.md` first.

Cheap variant of PDF to JPG — same rendering pipeline. **Build PDF to JPG first**, then this one should reuse a shared helper. The two tools have meaningfully different SEO ("PNG" = "lossless / transparent" = different audience).

---

## Identity

| | |
|---|---|
| Slug | `pdf-to-png` |
| Icon | `🖼️` |
| Tagline | `Convert PDF pages to lossless PNG images — keeps transparency, runs in your browser.` |
| Primary library | `pdf.js` (rendering), `jszip` (multi-file output, lazy) |
| Component path | `src/components/Pdf/PdfToPng.tsx` |
| Page path | `src/pages/pdf/pdf-to-png.tsx` |

---

## UX flow

Identical to PDF to JPG with two differences:

1. **No quality slider** — PNG is lossless; nothing to tune.
2. **Background toggle** — segmented control: `White background` (default) / `Transparent background`. When `Transparent` is selected, the canvas fill is skipped and the output preserves the PDF's transparent areas (useful for logos / diagrams extracted to designs).

Everything else (page selector, DPI dropdown, progress, zip download) is identical.

---

## Core logic

Reuse the `renderPageToBlob` helper from PDF to JPG, but pass `'image/png'` as the format and skip the canvas fill when transparent mode is on:

```ts
async function renderPageToPng(
  page: pdfjsLib.PDFPageProxy,
  dpi: 72 | 150 | 300,
  transparent: boolean,
): Promise<Blob> {
  const scale = dpi / 72;
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext('2d')!;
  if (!transparent) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  await page.render({
    canvasContext: ctx,
    viewport,
    // pdf.js options: omitting `background` is what enables transparency.
    ...(transparent ? { background: 'rgba(0,0,0,0)' } : {}),
  }).promise;
  return new Promise((r) => canvas.toBlob((b) => r(b!), 'image/png'));
}
```

### Edge cases
- **Transparent PNGs with default-white-background PDFs** — the result will be transparent only where the source PDF had no painted background. Most office PDFs paint white themselves; the output won't be transparent. Mention this in the FAQ.
- **PNG file size** — for 300 DPI on a graphic-heavy page, PNGs are 2–4× the size of equivalent JPGs. Show estimated sizes accordingly: `~100 KB/page`, `~400 KB/page`, `~1.5 MB/page`.

Other edge cases (encrypted PDF, very large jobs, page cleanup) are identical to PDF to JPG.

---

## SEO

### `<title>`
`PDF to PNG — Lossless, In Browser, No Upload | Toolisk`  (55 chars)

### Meta description
`Convert PDF pages to lossless PNG images — keep transparency, pick pages, 72 / 150 / 300 DPI. Runs in your browser. No upload, no sign-up.`

### Keywords
`pdf to png, convert pdf to png, pdf to png lossless, pdf to png transparent, pdf to png no upload, pdf to png online, pdf page to png, pdf to png high quality`

### Features
- `🔒 100% client-side — your PDF never leaves your browser`
- `🪶 Lossless PNG output — no compression artifacts`
- `🪟 Optional transparent background — great for logos/diagrams`
- `🔍 Three resolutions: 72 / 150 / 300 DPI`
- `🎯 Pick which pages to export`
- `📦 Download per file or as a single zip`

### How-to
1. **Drop your PDF** — Any size up to 100 MB.
2. **Pick pages** — Click thumbnails to include or exclude.
3. **Choose options** — Resolution and white-vs-transparent background.
4. **Convert & download** — Per-image or zip.

### FAQs (after the 4 baseline)
5. **`PNG vs JPG — which should I use?`** — PNG is lossless and supports transparency; pick it for diagrams, logos, or anything you'll edit later. JPG is smaller but lossy; pick it for photo-heavy PDFs or web/email use.
6. **`Will the transparent background really be transparent?`** — Only where the source PDF had no painted background. Most office PDFs paint white themselves, so the output will still appear white. For designs / logos with intentional transparency, the export preserves it cleanly.
7. **`Why is my PNG so much bigger than a JPG would be?`** — PNG is lossless: every pixel is preserved. JPG sacrifices some detail to shrink the file. For graphics-heavy pages, expect 2–4× bigger files than JPG.
8. **`Can I extract images embedded in the PDF directly?`** — No — this tool renders each page as one image. Asset extraction is a different feature, not covered here.

### Educational body

Reuse the PDF to JPG body structure with substitutions:
- Lead with PNG-specific use cases: extracting logos / diagrams / illustrations for design work; preserving small text edges that JPG would blur; archiving where lossy compression is unacceptable.
- Worked example: `"A 5-page brochure PDF (2.1 MB), 300 DPI lossless PNGs: ~7.5 MB total. The same job as JPG at quality 95 would be ~2.8 MB — but PNG keeps every pixel."`
- Same "why no upload matters" treatment.
- Same mini comparison vs server-side tools.

### Related tools
- `PDF to JPG` → `/pdf/pdf-to-jpg`
- `JPG to PDF` → `/pdf/jpg-to-pdf`
- `PDF to Text` → `/pdf/pdf-to-text`

---

## masterItems entry

```ts
{
  name: 'PDF to PNG',
  description: 'Render PDF pages as lossless PNG images, optionally transparent. Pick pages, set DPI, download as zip — all in your browser.',
  path: '/pdf/pdf-to-png',
  icon: '🖼️',
  tags: ['PDF', 'Convert', 'Image'],
  type: 'pdf',
  isNew: true,
},
```

## Breadcrumb label

```ts
'pdf-to-png': 'PDF to PNG',
```

## Acceptance

- Transparent toggle produces a PNG with alpha when the source PDF has unpainted areas.
- Output filenames zero-padded (`-page-001.png`).
- Shared `renderPageToBlob` helper consolidated with PDF to JPG.
- Built page passes `tsc` + `npm run build`.
