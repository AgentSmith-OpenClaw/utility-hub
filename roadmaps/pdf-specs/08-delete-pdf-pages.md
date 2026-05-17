# Spec: Delete Pages from PDF

> Read `.claude/skills/new-pdf/SKILL.md` first.

Visual page picker. Should be built **after** PDF to JPG (so `<PdfPageGrid>` is well-exercised with rendered thumbnails).

---

## Identity

| | |
|---|---|
| Slug | `delete-pdf-pages` |
| Icon | `🗑️` |
| Tagline | `Remove unwanted pages from a PDF — visual page picker, runs entirely in your browser.` |
| Primary library | `pdf-lib` (write), `pdf.js` (thumbnails) |
| Component path | `src/components/Pdf/DeletePdfPages.tsx` |
| Page path | `src/pages/pdf/delete-pdf-pages.tsx` |

---

## UX flow

1. **Empty state** — single-file dropzone.
2. **Loaded** — file row + a thumbnail grid via `<PdfPageGrid selectMode="multi">`. Each tile shows the page thumbnail + page number + a checkbox in the top-right. Clicking anywhere on the tile toggles selection. Selected pages get a **rose ring + a translucent rose overlay + a "Remove" badge** to make it visually obvious what's about to be deleted.
3. **Top bar**: `n of m pages selected` · `Select all` · `Select none` · `Invert selection`.
4. **Page range shortcut** — collapsible "Use a range instead" — same parser as Split PDF, treats the range as a selection toggle.
5. **Action button** — `Remove n pages & download` (disabled until ≥ 1 selected and selection ≠ all).
6. **Done** — filename input (default `{original}-trimmed.pdf`), download button.

### Important UX rule
- Never allow deletion of **all** pages — keep the action button disabled if the user tries to select every page. Show inline helper: `Select at least one page to keep.`

---

## Core logic

```ts
import { PDFDocument } from 'pdf-lib';

async function deletePages(file: File, pagesToDelete: Set<number>): Promise<Blob> {
  // pagesToDelete is 0-indexed.
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const total = src.getPageCount();
  const keep = Array.from({ length: total }, (_, i) => i).filter((i) => !pagesToDelete.has(i));
  if (keep.length === 0) throw new Error('Cannot delete every page');
  const out = await PDFDocument.create();
  const copied = await out.copyPages(src, keep);
  copied.forEach((p) => out.addPage(p));
  const bytesOut = await out.save();
  return new Blob([bytesOut], { type: 'application/pdf' });
}
```

### Edge cases
- **Single-page PDF** — there's nothing to delete; disable the action button and show a helper.
- **Encrypted PDF** — same rejection pattern.
- **Performance for very large PDFs** — for a 500-page PDF, the thumbnail grid must virtualize (render only what's near the viewport, +/- 20). Use the `<PdfPageGrid>` virtualization mode; do not render all 500 thumbnails synchronously.

---

## SEO

### `<title>`
`Delete Pages from PDF — In Browser, No Upload | Toolisk`  (57 chars)

### Meta description
`Remove unwanted pages from a PDF with a visual picker — multi-select, range support, instant download. No upload, no sign-up. Runs in your browser.`

### Keywords
`delete pdf pages, remove pdf pages, delete pages from pdf, remove pages pdf free, delete pages pdf no upload, pdf page remover, trim pdf, delete pdf pages online`

### Features
- `🔒 100% client-side — your PDF never leaves your browser`
- `👀 Visual page picker with live thumbnails`
- `🔢 Multi-select or use a page range (e.g. 5, 8-12)`
- `🪶 No re-render — original quality preserved`
- `⚡ Instant download — works for hundreds of pages`
- `🆓 Free, no sign-up, no watermark`

### How-to
1. **Drop your PDF** — Any size up to 100 MB.
2. **Click pages to mark for deletion** — Or use the range input.
3. **Remove & download** — One click, original quality preserved.
4. **(Optional) Rename** — Default name is `{original}-trimmed.pdf`.

### FAQs (after the 4 baseline)
5. **`Will deleting pages change the look of the remaining ones?`** — No. We don't re-render anything — pdf-lib copies the kept pages byte-for-byte into a new document. Quality is identical to the input.
6. **`Can I undo after downloading?`** — Not in the tool — once the new PDF is saved, the previous state isn't kept. Your original file is untouched, though, so you can always restart from it.
7. **`What's the difference between Delete Pages and Extract Pages?`** — They're inverses. Delete removes the pages you pick. Extract keeps the pages you pick. Same outcome, opposite ergonomics — choose whichever has fewer clicks.
8. **`Can I delete the first n pages quickly?`** — Use the range input: `1-5` selects pages 1 through 5 for deletion, then click the action button.

### Educational body

Cover:
- Concrete use cases: removing the cover/back pages from a scanned bundle; cutting the unsigned pages out of a contract after only some pages got signed; trimming a printable PDF to just the pages you need.
- Worked example: `"A 50-page bundle, 6.2 MB. Removing pages 1-3 (cover) and 48-50 (back matter) gives a 44-page output ~5.5 MB. Quality identical to the source — we don't re-render."`
- "Why no upload matters" — same depth as the other tools, with a privacy-specific callout that some online tools watermark or log filenames.
- Mini comparison.

### Related tools
- `Reorder PDF Pages` → `/pdf/reorder-pdf-pages`
- `Split PDF` → `/pdf/split-pdf`
- `Merge PDF` → `/pdf/merge-pdf`

---

## masterItems entry

```ts
{
  name: 'Delete Pages from PDF',
  description: 'Remove unwanted pages from a PDF with a visual page picker. Runs entirely in your browser — original quality preserved.',
  path: '/pdf/delete-pdf-pages',
  icon: '🗑️',
  tags: ['PDF', 'Edit', 'Delete'],
  type: 'pdf',
  isNew: true,
},
```

## Breadcrumb label

```ts
'delete-pdf-pages': 'Delete Pages from PDF',
```

## Acceptance

- Selecting every page disables the action button with the helper text shown.
- Page range `5, 8-12` selects those exact pages for deletion.
- 500-page PDF renders without freezing — virtualization confirmed via DevTools (only ~20 thumbnails in the DOM at any moment).
- Output PDF has correct page count and identical quality.
- `tsc` + `npm run build` pass.
