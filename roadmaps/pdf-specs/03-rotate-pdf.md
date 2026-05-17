# Spec: Rotate PDF

> Read `.claude/skills/new-pdf/SKILL.md` first.

A foundation-4 tool. Simplest tool to ship — single library, no shared zip code path. Good early ranking opportunity because most competitors charge for it.

---

## Identity

| | |
|---|---|
| Slug | `rotate-pdf` |
| Icon | `🔄` |
| Tagline | `Rotate PDF pages 90, 180, or 270 degrees — all pages or individual ones. Runs in your browser.` |
| Primary library | `pdf-lib` (rotation via `setRotation` + `degrees()`), `pdf.js` (thumbnails) |
| Component path | `src/components/Pdf/RotatePdf.tsx` |
| Page path | `src/pages/pdf/rotate-pdf.tsx` |

---

## UX flow

1. **Empty state** — single-file dropzone.
2. **Loaded** — show file row + a mode toggle (segmented control):
   - **Rotate all pages** (default) — pick angle (90 / 180 / 270) once, applies to everything.
   - **Rotate individual pages** — show `<PdfPageGrid>` with a click-to-rotate overlay on each thumbnail (each click cycles 0 → 90 → 180 → 270 → 0). Each tile shows the current rotation in the bottom-right corner (e.g. `90°`).
3. **Bulk-action toolbar** (only in individual mode): `Rotate all 90°`, `Rotate all 180°`, `Rotate all 270°`, `Reset all`.
4. **Action button** — `Apply rotation & download`. Disabled if no pages have rotation changes.
5. **Done** — single-file download.

The thumbnail grid is the star of this tool. Render each thumb with `pdf.js` at 0.25 scale (small, fast). Apply the live rotation in CSS via `transform: rotate(deg)` for instant preview; the actual rotation goes into the output via `pdf-lib`.

---

## Core logic

```ts
import { PDFDocument, degrees } from 'pdf-lib';

type Rotation = 0 | 90 | 180 | 270;

async function rotatePdf(file: File, rotations: Rotation[]): Promise<Blob> {
  // rotations[i] is the angle to apply to page i, ADDITIVE to the existing rotation.
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const pages = doc.getPages();
  pages.forEach((page, i) => {
    if (!rotations[i]) return;
    const currentDeg = page.getRotation().angle;
    const newDeg = (currentDeg + rotations[i]) % 360;
    page.setRotation(degrees(newDeg));
  });
  const out = await doc.save();
  return new Blob([out], { type: 'application/pdf' });
}
```

### Edge cases
- **PDF already has page rotation set** — read the existing rotation with `page.getRotation().angle` and add to it. Don't overwrite.
- **Encrypted PDF** — same reject pattern as Merge.
- **No rotations selected** — disable the button (`Apply rotation` is meaningless if everything is 0°).
- **Output should preserve quality exactly** — rotation in pdf-lib only changes the page's `/Rotate` entry; no re-render, no quality loss.

---

## SEO

### `<title>`
`Rotate PDF — Online, In Browser, No Upload | Toolisk`  (53 chars)

### Meta description
`Rotate PDF pages 90, 180, or 270 degrees — all pages or one at a time. Runs in your browser. No upload, no sign-up, no quality loss.`

### Keywords
`rotate pdf, rotate pdf pages, rotate pdf online, rotate pdf free, rotate pdf no upload, fix sideways pdf, pdf landscape to portrait, rotate single pdf page`

### Features
- `🔒 Runs in your browser — files stay on your device`
- `🔄 90°, 180°, 270° rotation, per page or all pages`
- `👀 Live thumbnail preview as you rotate`
- `🪶 No re-render — original quality preserved`
- `🆓 Free, no sign-up, no watermark`
- `📱 Works on mobile`

### How-to
1. **Drop your PDF** — Single file, any size up to 100 MB.
2. **Choose a mode** — Rotate all pages by the same angle, or click thumbnails individually.
3. **Pick angles** — 90° clockwise, 180°, or 270° (90° counter-clockwise).
4. **Apply & download** — One click, instant download, original quality intact.

### FAQs (after the 4 baseline)
5. **`Will rotating reduce my PDF quality?`** — No. Rotation only changes a metadata flag in the PDF — the page content isn't re-rendered. The output is byte-equivalent in quality to the input.
6. **`Why does my PDF look rotated already, before I do anything?`** — Some PDFs have a `Rotate` entry baked in by the scanner or source app. The thumbnails show the rotation that will be displayed by readers. You're rotating relative to that.
7. **`Can I rotate only the even or odd pages?`** — Yes, via the "Rotate individual pages" mode — click the pages you want to rotate. There's no shortcut for parity yet.
8. **`Why is 270° the same as -90°?`** — Same rotation, different math. We label it 270° because PDF readers expect non-negative angles in the `/Rotate` field.

### Educational body

Cover:
- The everyday cause: scanners that orient pages landscape when they should be portrait, or scans where every other page is upside-down (duplex scanners with skewed input). Mention the typical user is fixing a scanned document rather than designing one.
- Worked example: `"A 12-page scanned contract: pages 1, 3, 5, 7, 9, 11 are upside-down. Rotate the odd pages 180° and re-export — done in ~2 seconds, no re-render, identical quality to the original."`
- Why no-upload matters: same depth as the other tools. Contracts and signed docs.
- A small "vs uploading" comparison.

### Related tools
- `Merge PDF` → `/pdf/merge-pdf`
- `Reorder PDF Pages` → `/pdf/reorder-pdf-pages`
- `Crop PDF` → if shipped later

---

## masterItems entry

```ts
{
  name: 'Rotate PDF',
  description: 'Rotate PDF pages 90, 180, or 270 degrees — bulk or per page, with live thumbnail preview. No upload, runs in your browser.',
  path: '/pdf/rotate-pdf',
  icon: '🔄',
  tags: ['PDF', 'Rotate', 'Fix'],
  type: 'pdf',
  isNew: true,
},
```

## Breadcrumb label

```ts
'rotate-pdf': 'Rotate PDF',
```

## Acceptance

- Click on a thumbnail cycles 0 → 90 → 180 → 270 → 0 visually within 50 ms.
- Output PDF opens in Preview / Adobe Reader rotated as expected.
- Existing `/Rotate` value on input pages is honored (additive, not overwriting).
- Built page passes `tsc` + `npm run build`.
