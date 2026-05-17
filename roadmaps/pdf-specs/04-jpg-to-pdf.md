# Spec: JPG to PDF

> Read `.claude/skills/new-pdf/SKILL.md` first.

Foundation-4 tool. Mobile-first usage — receipts, ID scans, whiteboard photos. PNG / WebP / GIF input is also supported (handled by the same component); the page itself is keyworded for JPG because that's the search volume.

---

## Identity

| | |
|---|---|
| Slug | `jpg-to-pdf` |
| Icon | `🖼️` |
| Tagline | `Convert JPG, PNG, or WebP images to a single PDF — drag to reorder, runs entirely in your browser.` |
| Primary library | `pdf-lib` (image embedding + page creation) |
| Component path | `src/components/Pdf/JpgToPdf.tsx` |
| Page path | `src/pages/pdf/jpg-to-pdf.tsx` |

---

## UX flow

1. **Empty state** — multi-file dropzone, `accept="image/jpeg,image/png,image/webp"`. Helper: `Drop JPGs, PNGs, or WebPs here, or click to browse.`
2. **Loaded** — show a thumbnail grid (NOT `PdfPageGrid` — these are image files, not PDF pages). Each tile shows the image thumbnail (`URL.createObjectURL` on the file), filename, size, delete button, drag handle.
3. **Options sidebar** (right side on desktop, below grid on mobile):
   - **Page size**: dropdown — `Fit to image` (default — page matches image dimensions exactly), `Letter`, `A4`, `Legal`.
   - **Orientation**: `Auto` (default — chooses portrait or landscape per image), `Portrait`, `Landscape`. Disabled when page-size is `Fit to image`.
   - **Margin**: dropdown — `None` (default), `Small (12 mm)`, `Medium (25 mm)`, `Large (40 mm)`. Disabled when page-size is `Fit to image`.
4. **Action button** — `Create PDF (n images)`. Disabled until ≥ 1 image.
5. **Processing** — progress bar per image embedded.
6. **Done** — filename input (default `images.pdf`), download button.

---

## Core logic

```ts
import { PDFDocument, PageSizes } from 'pdf-lib';

interface Options {
  pageSize: 'fit' | 'letter' | 'a4' | 'legal';
  orientation: 'auto' | 'portrait' | 'landscape';
  marginMm: 0 | 12 | 25 | 40;
}

const MM_TO_PT = 2.834645669;

async function imagesToPdf(
  files: File[],
  opts: Options,
  onProgress: (pct: number) => void,
): Promise<Blob> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const bytes = new Uint8Array(await file.arrayBuffer());
    const isPng = file.type === 'image/png';
    const isWebp = file.type === 'image/webp';
    const img = isWebp
      ? await embedWebp(doc, bytes)          // see below
      : isPng
        ? await doc.embedPng(bytes)
        : await doc.embedJpg(bytes);

    let pageW: number, pageH: number;
    if (opts.pageSize === 'fit') {
      pageW = img.width;
      pageH = img.height;
    } else {
      const base =
        opts.pageSize === 'letter' ? PageSizes.Letter :
        opts.pageSize === 'legal'  ? PageSizes.Legal  :
        PageSizes.A4;
      const portrait = opts.orientation === 'portrait' ? true
        : opts.orientation === 'landscape' ? false
        : img.height >= img.width;
      [pageW, pageH] = portrait ? base : [base[1], base[0]];
    }

    const page = doc.addPage([pageW, pageH]);
    const margin = opts.marginMm * MM_TO_PT;
    const availW = pageW - 2 * margin;
    const availH = pageH - 2 * margin;
    const scale = Math.min(availW / img.width, availH / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    page.drawImage(img, {
      x: (pageW - w) / 2,
      y: (pageH - h) / 2,
      width: w,
      height: h,
    });
    onProgress(((i + 1) / files.length) * 100);
  }
  const out = await doc.save();
  return new Blob([out], { type: 'application/pdf' });
}
```

### Handling WebP (pdf-lib does not support it natively)

```ts
async function embedWebp(doc: PDFDocument, bytes: Uint8Array) {
  // Decode WebP → canvas → JPEG bytes → embed as JPG.
  const blob = new Blob([bytes], { type: 'image/webp' });
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0);
  const jpgBlob: Blob = await new Promise((r) =>
    canvas.toBlob((b) => r(b!), 'image/jpeg', 0.92),
  );
  const jpgBytes = new Uint8Array(await jpgBlob.arrayBuffer());
  return doc.embedJpg(jpgBytes);
}
```

### Edge cases
- **HEIC / HEIF** — Safari can read these but Chrome / Firefox cannot. Reject with a helpful message: `"HEIC isn't widely supported in browsers. Convert to JPG first."`
- **Animated GIF / WebP** — only the first frame goes into the PDF; mention this in the FAQ.
- **Very large image (e.g. 12000 × 8000)** — embed succeeds but the resulting PDF may be huge. Don't auto-downscale; the user is in control.
- **EXIF orientation** — JPGs with EXIF orientation 6/8 (sideways photos from phones) render rotated in `<img>` but their raw pixel orientation is unrotated. Read EXIF orientation with a tiny helper and rotate via canvas before embedding, OR use `createImageBitmap(blob, { imageOrientation: 'from-image' })` which respects EXIF.

---

## SEO

### `<title>`
`JPG to PDF — Free, In Browser, No Upload | Toolisk`  (51 chars)

### Meta description
`Convert JPG, PNG, or WebP images to a single PDF in your browser — drag to reorder, choose page size, free with no sign-up or watermarks.`

### Keywords
`jpg to pdf, png to pdf, image to pdf, jpg to pdf free, jpg to pdf no upload, photos to pdf, scan to pdf, multiple images to pdf, jpg to pdf online`

### Features
- `🔒 Images processed in your browser — never uploaded`
- `🔀 Drag-to-reorder before exporting`
- `📏 Page size: fit to image, Letter, A4, or Legal`
- `📱 EXIF orientation respected — phone photos appear correctly`
- `🪶 PNG and WebP supported alongside JPG`
- `🆓 No sign-up, no watermark, no daily limits`

### How-to
1. **Drop your images** — JPGs, PNGs, or WebPs, multi-select supported.
2. **Reorder** — Drag thumbnails to set the page order.
3. **Set page size** — Fit to image keeps original dimensions; Letter / A4 / Legal centers with margin.
4. **Create PDF** — One click, download instantly.

### FAQs (after the 4 baseline)
5. **`What image formats are supported?`** — JPG, PNG, and WebP. HEIC (iPhone's default) isn't supported in most browsers — convert to JPG first.
6. **`Does the order I drop matter?`** — Yes, but you can drag thumbnails to reorder before creating the PDF.
7. **`Will my image be compressed?`** — JPG and PNG are embedded as-is, byte-for-byte. WebP is re-encoded to JPG (quality 0.92) because PDF doesn't support WebP natively. PNG transparency is preserved.
8. **`Will sideways photos from my phone look right?`** — Yes. We read EXIF orientation and rotate accordingly so portraits appear portrait, even if the camera saved the file landscape with a rotate flag.

### Educational body

Cover:
- The two real flows: (1) photographing a receipt / signed page with a phone camera and turning it into a PDF for accounting or HR, and (2) consolidating a stack of scanned image files (one per page) from a scanner that didn't bundle them.
- Worked example: `"6 phone photos of a signed lease — totaling 18 MB of JPGs — converted to a single 18 MB PDF in ~3 seconds. Originals are kept bit-perfect; the PDF just wraps them in page containers."`
- "Why no upload matters" — receipts and IDs are exactly the kind of thing you should never email to a random server.
- Mini comparison block.

### Related tools
- `PDF to JPG` → `/pdf/pdf-to-jpg`
- `PDF to PNG` → `/pdf/pdf-to-png`
- `Merge PDF` → `/pdf/merge-pdf`

---

## masterItems entry

```ts
{
  name: 'JPG to PDF',
  description: 'Convert JPG, PNG, or WebP images to a single PDF with drag-to-reorder and page-size options. Runs in your browser.',
  path: '/pdf/jpg-to-pdf',
  icon: '🖼️',
  tags: ['PDF', 'Convert', 'Image'],
  type: 'pdf',
  isNew: true,
},
```

## Breadcrumb label

```ts
'jpg-to-pdf': 'JPG to PDF',
```

## Acceptance

- Sideways phone JPG appears upright in the output (EXIF respected).
- PNG with transparency renders correctly (alpha preserved against white page background).
- `Fit to image` produces pages with no margin, dimensions matching the image exactly.
- A 6-image (18 MB) batch produces a 18 MB PDF in < 5 s on desktop.
- `tsc` + `npm run build` pass.
