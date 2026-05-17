# Spec: Reorder PDF Pages

> Read `.claude/skills/new-pdf/SKILL.md` first.

Page-level drag-and-drop. Reuses `<PdfPageGrid>` from Delete Pages with the `reorder` mode enabled.

---

## Identity

| | |
|---|---|
| Slug | `reorder-pdf-pages` |
| Icon | `🔀` |
| Tagline | `Drag PDF pages into any order — runs in your browser, original quality preserved.` |
| Primary library | `pdf-lib` (write), `pdf.js` (thumbnails) |
| Component path | `src/components/Pdf/ReorderPdfPages.tsx` |
| Page path | `src/pages/pdf/reorder-pdf-pages.tsx` |

---

## UX flow

1. **Empty state** — single-file dropzone.
2. **Loaded** — file row + `<PdfPageGrid selectMode="reorder">`. Each tile is draggable; dragging shows a 2 px rose insertion line at the drop target. Tile shows the current position (`Page 1`, `Page 2`, etc., updating as the user drags).
3. **Top bar**: utility actions — `Reset to original order`, `Reverse all`, `Move first to last`, `Move last to first`. These are quick-action chips, not a separate panel.
4. **Action button** — `Save reordered PDF` (disabled if order is unchanged from input).
5. **Done** — filename input (default `{original}-reordered.pdf`), download.

### Drag-and-drop implementation

HTML5 drag-and-drop on each tile. State is an array of original page indices (`order: number[]`). Drop reorders the array:

```ts
function reorder(order: number[], fromIndex: number, toIndex: number): number[] {
  const next = order.slice();
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}
```

No DnD library — the page-grid component takes `onReorder` and emits the new index pair.

---

## Core logic

```ts
import { PDFDocument } from 'pdf-lib';

async function reorderPdf(file: File, newOrder: number[]): Promise<Blob> {
  // newOrder[i] = the 0-indexed source page that should appear at output position i.
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const out = await PDFDocument.create();
  const copied = await out.copyPages(src, newOrder);
  copied.forEach((p) => out.addPage(p));
  const bytesOut = await out.save();
  return new Blob([bytesOut], { type: 'application/pdf' });
}
```

### Edge cases
- **Order unchanged** — disable the action button; nothing to save.
- **Encrypted PDF** — same rejection pattern.
- **Large PDF** — same virtualization rule as Delete Pages.

---

## SEO

### `<title>`
`Reorder PDF Pages — In Browser, No Upload | Toolisk`  (52 chars)

### Meta description
`Drag PDF pages into any order — visual reorder grid, instant download, runs in your browser. No upload, no sign-up, no watermarks.`

### Keywords
`reorder pdf pages, rearrange pdf pages, sort pdf pages, reorder pdf no upload, change pdf page order, move pdf pages, pdf page reorder online, drag pdf pages`

### Features
- `🔒 100% client-side — your PDF never leaves your browser`
- `🖱️ Smooth drag-and-drop with live position labels`
- `⚡ Quick actions: reverse all, move first/last, reset`
- `🪶 No re-render — original quality preserved`
- `📱 Touch-friendly on tablets`
- `🆓 Free, no sign-up, no watermark`

### How-to
1. **Drop your PDF** — Any size up to 100 MB.
2. **Drag thumbnails** — Drop anywhere in the grid to insert the page.
3. **(Optional) Use quick actions** — Reverse all, move first/last, reset.
4. **Save & download** — One click, identical page quality.

### FAQs (after the 4 baseline)
5. **`Will reordering re-render the pages?`** — No. We copy pages byte-for-byte using pdf-lib; the visible content of each page is untouched. Only the order changes.
6. **`Can I duplicate a page while reordering?`** — Not in this tool — reorder is a one-to-one rearrangement. If you need to duplicate a page, extract it with Split PDF and merge it in where you want.
7. **`Does drag-and-drop work on a phone or tablet?`** — Yes — the page grid responds to touch events on iOS Safari and Chrome for Android. Long-press a thumbnail to start dragging.
8. **`Can I save my reordered file with a different name?`** — Yes — the filename field defaults to `{original}-reordered.pdf` but you can change it before downloading.

### Educational body

Cover:
- Concrete use cases: a scanner produced pages out of order (e.g. duplex scanning reversed the odd pages); building a presentation deck from sections that need rearranging; preparing a chapter sequence from a textbook scan.
- Worked example: `"A 24-page bundle where pages 7-12 belong before pages 1-6. Drag and drop the chunk → save → 24-page output with new order. Identical visual quality."`
- "Why no upload matters."
- Mini comparison block.

### Related tools
- `Delete Pages from PDF` → `/pdf/delete-pdf-pages`
- `Merge PDF` → `/pdf/merge-pdf`
- `Split PDF` → `/pdf/split-pdf`

---

## masterItems entry

```ts
{
  name: 'Reorder PDF Pages',
  description: 'Drag PDF pages into any order with a visual grid. Quality preserved exactly. Runs entirely in your browser — no upload.',
  path: '/pdf/reorder-pdf-pages',
  icon: '🔀',
  tags: ['PDF', 'Edit', 'Reorder'],
  type: 'pdf',
  isNew: true,
},
```

## Breadcrumb label

```ts
'reorder-pdf-pages': 'Reorder PDF Pages',
```

## Acceptance

- Dragging a tile over another tile shows an insertion line at the drop target.
- Quick actions update the grid order instantly.
- `Save reordered PDF` button is disabled when order matches input.
- Touch-drag works on iOS Safari (tested with Chrome DevTools mobile emulation at minimum).
- `tsc` + `npm run build` pass.
