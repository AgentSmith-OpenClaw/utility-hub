# Spec: Split PDF

> Read `.claude/skills/new-pdf/SKILL.md` first. Build Merge PDF before this if shared infrastructure isn't in place.

Pairs with Merge PDF as the second leg of the section's hero loop. Same intent cluster: file-level reorganization.

---

## Identity

| | |
|---|---|
| Slug | `split-pdf` |
| Icon | `✂️` |
| Tagline | `Split a PDF into separate files — by page ranges or extract every page. No upload, runs in your browser.` |
| Primary library | `pdf-lib` (write), `pdf.js` (page thumbnails), `jszip` (multi-file output, lazy) |
| Component path | `src/components/Pdf/SplitPdf.tsx` |
| Page path | `src/pages/pdf/split-pdf.tsx` |

---

## UX flow

1. **Empty state** — single-file `<PdfDropzone accept="application/pdf">`. Helper text: `Drop a PDF here, or click to browse.`
2. **Loaded** — show file row at the top (filename, page count, size, "Remove" button) and a **mode toggle** with three options as a segmented control:
   - **By ranges** (default) — user types ranges, e.g. `1-3, 5, 8-12`. Each comma-separated chunk becomes a new output PDF.
   - **Every page** — every page becomes its own PDF. No further input.
   - **Fixed size** — user enters N (e.g. `5`); splits into chunks of N pages each (`1-5`, `6-10`, …).
3. **Preview rail** — below the mode, show a horizontal scrolling page-thumbnail strip via `<PdfPageGrid>` with `selectMode="display"` (no checkboxes — just visualization so the user can see what they're splitting). Each thumb is 80 × 110 px, labelled `Page n`. For PDFs > 50 pages, virtualize.
4. **Range parser** — live-validate the range string. Show an inline chip below the input:
   - Valid: `→ 3 output files: 1-3, 5, 8-12` (green text)
   - Invalid: `Invalid range "ab-3" — use numbers and dashes only.` (rose text, action button disabled)
5. **Action button** — primary `Split into N files`. Disabled if input is invalid or mode is `By ranges` and the input is empty.
6. **Processing** — progress bar per chunk.
7. **Done** — show result list with one row per output file (name + page count + size + per-file `Download` button). Plus a single `Download all as .zip` primary button (lazy-loads `jszip`).

---

## Core logic

```ts
import { PDFDocument } from 'pdf-lib';

function parseRanges(str: string, maxPage: number): number[][] {
  // Returns 0-indexed page arrays per chunk. Throws on invalid input.
  // "1-3, 5, 8-12" -> [[0,1,2], [4], [7,8,9,10,11]]
  return str.split(',').map((chunk) => {
    const part = chunk.trim();
    if (!part) throw new Error('Empty range');
    const m = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) throw new Error(`Invalid range "${part}"`);
    const start = parseInt(m[1], 10);
    const end = m[2] ? parseInt(m[2], 10) : start;
    if (start < 1 || end > maxPage || start > end) {
      throw new Error(`Range "${part}" is out of bounds (1-${maxPage})`);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
  });
}

async function splitPdf(
  file: File,
  chunks: number[][],
  onProgress: (pct: number) => void,
): Promise<{ name: string; blob: Blob }[]> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const out: { name: string; blob: Blob }[] = [];
  const baseName = file.name.replace(/\.pdf$/i, '');
  for (let i = 0; i < chunks.length; i++) {
    const doc = await PDFDocument.create();
    const copied = await doc.copyPages(src, chunks[i]);
    copied.forEach((p) => doc.addPage(p));
    const bytesOut = await doc.save();
    const first = chunks[i][0] + 1;
    const last = chunks[i][chunks[i].length - 1] + 1;
    const suffix = first === last ? `page-${first}` : `pages-${first}-${last}`;
    out.push({
      name: `${baseName}-${suffix}.pdf`,
      blob: new Blob([bytesOut], { type: 'application/pdf' }),
    });
    onProgress(((i + 1) / chunks.length) * 100);
  }
  return out;
}
```

### Edge cases
- **Range overlaps or duplicates** — allowed (e.g. `1-3, 2-4` produces two files with overlapping pages). Don't reject.
- **`Every page` on a 1-page PDF** — produces 1 output file. Allowed.
- **`Fixed size` with N > page count** — produces 1 output containing all pages.
- **Encrypted PDF** — same rejection pattern as Merge: catch and surface a clear message.
- **Single-output result** — if only 1 chunk, hide the "Download all as .zip" button (it's silly for one file).

### Lazy-load JSZip

```ts
async function downloadZip(files: { name: string; blob: Blob }[]) {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  files.forEach((f) => zip.file(f.name, f.blob));
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  // …trigger download, then URL.revokeObjectURL(url) after a tick.
}
```

---

## SEO

### `<title>` (≤ 60 chars)
`Split PDF — Free, In Browser, No Upload | Toolisk`

### Meta description (≤ 155 chars)
`Split a PDF by page ranges or extract every page — entirely in your browser. No upload, no sign-up, no watermarks. Free and private.`

### Keywords
`split pdf, split pdf free, split pdf online, split pdf no upload, extract pdf pages, separate pdf, split pdf by pages, pdf splitter in browser`

### Features
- `🔒 100% client-side — your PDF never leaves your browser`
- `📑 Three modes: by ranges, every page, or fixed-size chunks`
- `🔢 Smart range parser with live validation`
- `📦 Download all as .zip in one click`
- `🆓 Free forever, no sign-up, no watermark`
- `📱 Mobile-friendly with thumbnail preview`

### How-to
1. **Drop your PDF** — Click or drag a single PDF onto the upload area.
2. **Choose a split mode** — Type page ranges (e.g. `1-3, 5, 8-12`), pick "every page", or set a fixed chunk size.
3. **Split** — Click the button. Each chunk becomes a separate PDF, all in your browser.
4. **Download** — Save each file individually, or download everything as a single zip.

### FAQs (after the 4 baseline)
5. **`What's the difference between Split and Extract Pages?`** — Split breaks a PDF into multiple files. Extract Pages keeps the pages you want in a single output file. If you want one file with pages 3, 5, and 7 — use Extract. If you want three separate files — use Split.
6. **`Can I split into uneven chunks?`** — Yes. The "By ranges" mode accepts any combination of single pages and ranges separated by commas: `1, 4-6, 9, 12-15`.
7. **`Are overlapping ranges allowed?`** — Yes. `1-3, 2-4` will produce two output files, with pages 2 and 3 appearing in both.
8. **`What if my PDF has 500 pages?`** — Fine, but generating 500 single-page outputs takes ~20 seconds and the resulting zip will be large. Consider chunking instead (`Fixed size: 25`).

### Educational body (350–500 words)

Cover:
- The two real use cases: (1) extracting a clean piece of a larger PDF (you signed page 3 of a 50-page contract — split it out, send just that), and (2) breaking up a scanned bundle (someone scanned 20 invoices as one file — split into per-invoice PDFs).
- Worked example: `"A 24-page bank-statement PDF, 1.4 MB. Splitting into 'every page' produces 24 files at ~60 KB each — the same content as the original, just sliced."`
- "Why no upload matters" paragraph — same depth as Merge PDF, calling out that bank statements / contracts / payslips contain sensitive info.
- Mini comparison: server-side splitters cap free splits at 50 pages, gate larger ones behind a paywall, and add watermarks. Toolisk has no caps and no watermarks because there's no server cost.

### Related tools
- `Merge PDF` → `/pdf/merge-pdf`
- `Delete Pages from PDF` → `/pdf/delete-pdf-pages`
- `Reorder PDF Pages` → `/pdf/reorder-pdf-pages`

---

## masterItems entry

```ts
{
  name: 'Split PDF',
  description: 'Split a PDF by page ranges, every page, or fixed chunks. Runs entirely in your browser — no upload, no sign-up.',
  path: '/pdf/split-pdf',
  icon: '✂️',
  tags: ['PDF', 'Split', 'Extract'],
  type: 'pdf',
  isNew: true,
},
```

## Breadcrumb label

```ts
'split-pdf': 'Split PDF',
```

## Acceptance

- Range parser correctly rejects `1-`, `a-3`, `5-3`, `0-2`, `99-100` on a 50-page PDF; accepts `1`, `1-3`, `1-3, 5, 8-12`.
- Zip download lazy-loads `jszip` — verify in DevTools network tab that `jszip` is **not** in the initial page bundle.
- 50-page PDF splits "every page" in < 8 s on desktop Chrome.
- `tsc --noEmit && npm run build` passes.
