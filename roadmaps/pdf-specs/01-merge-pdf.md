# Spec: Merge PDF

> Read `.claude/skills/new-pdf/SKILL.md` first. If `/pdf` doesn't exist yet, this is the **first PDF tool** — run the bootstrap section of the skill (extend `ToolShell`, create shared components, create hub, install libraries) before building this tool.

This is a hero/foundation tool. ~500k/mo search volume globally. Pairs with Split PDF for the strongest internal-link loop in the section.

---

## Identity

| | |
|---|---|
| Slug | `merge-pdf` |
| Icon | `📎` |
| Tagline | `Combine multiple PDFs into one file — drag to reorder, download instantly. No upload, no sign-up.` |
| Primary library | `pdf-lib` (via `usePdfLib()`) |
| Component path | `src/components/Pdf/MergePdf.tsx` |
| Page path | `src/pages/pdf/merge-pdf.tsx` |

---

## What the user does (UX flow)

1. **Empty state** — full-width `<PdfDropzone multi accept="application/pdf">`. Helper text: `Drop PDFs here, or click to browse. Order them, then merge.`
2. **Files queued** — the dropzone shrinks to a "+ Add more PDFs" row at the top. Below it: a vertical list of file rows (not a page-thumbnail grid — this is a file-level reorder, not a page-level one). Each row shows:
   - Drag handle (`⋮⋮` icon, cursor-grab)
   - File icon (`📄`)
   - Filename (truncated mid-name with `…` if > 40 chars)
   - Page count + size (e.g. `12 pages · 1.4 MB`) — fetched by opening the doc with `pdf-lib` once on add
   - Delete button (`×`)
3. **Reorder** — drag a row to reposition. Use HTML5 drag-and-drop (`onDragStart` / `onDragOver` / `onDrop`) — do **not** add a DnD library dependency for this. Show a 2 px rose horizontal insert line at the drop target.
4. **Action bar** (sticky on mobile, inline on desktop): primary button `Merge PDFs (n files)` — disabled until ≥ 2 files. Secondary button `Clear all`.
5. **Processing** — button shows `Merging…` with a determinate progress bar (advances per file processed). Use `requestAnimationFrame` between files so the UI doesn't freeze.
6. **Done** — replace action bar with: filename input (default `merged.pdf`), `Download` primary button, `Start over` secondary button. Surface output size (e.g. `Output: 3.8 MB`).

---

## Core logic

```ts
import { PDFDocument } from 'pdf-lib';

async function mergePdfs(files: File[], onProgress: (pct: number) => void): Promise<Blob> {
  const out = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    const bytes = await files[i].arrayBuffer();
    const src = await PDFDocument.load(bytes, { ignoreEncryption: false }); // throws on encrypted
    const indices = src.getPageIndices();
    const copied = await out.copyPages(src, indices);
    copied.forEach((p) => out.addPage(p));
    onProgress(((i + 1) / files.length) * 100);
  }
  const merged = await out.save();
  return new Blob([merged], { type: 'application/pdf' });
}
```

### Edge cases to handle
- **Encrypted source PDF** — `PDFDocument.load` throws. Catch and show: `"{filename} is password-protected. Unlock it first, or use our Unlock PDF tool."`
- **Corrupt PDF** — same catch path, message: `"{filename} could not be opened. The file may be corrupt or not a real PDF."`
- **Single file submitted** — disable the action button until ≥ 2 files (don't bother merging one).
- **Very large total** — if combined input > 200 MB, warn before merge: `"Combined files are very large (~XXX MB). Processing may take 30+ seconds and may fail on mobile."` — let user proceed anyway.
- **File name collisions in download** — always output `merged.pdf` by default; the rename input handles user preference.

---

## SEO

### `<title>` (60 chars)
`Merge PDF — Free, Private, No Upload | Toolisk`

### Meta description (155 chars)
`Merge PDFs in your browser — drag, drop, reorder, and combine into one file. 100% private: nothing is uploaded to a server. Free, no sign-up.`

### Keywords
`merge pdf, combine pdf, merge pdf free, merge pdf no upload, merge pdf online private, pdf merger, join pdf, combine multiple pdfs, merge pdf in browser`

### Features (for `ToolSEOContent`)
- `🔒 100% client-side — your PDFs never leave your browser`
- `🔀 Drag-to-reorder files before merging`
- `📑 No page limit, no file count limit`
- `⚡ Instant download — no queue, no waiting`
- `🆓 Free forever, no sign-up, no watermark`
- `📱 Works on desktop and mobile browsers`

### How-to steps
1. **Add your PDFs** — Drop multiple PDF files into the upload area, or click to browse.
2. **Reorder** — Drag the rows up or down to set the final page order.
3. **Merge** — Click "Merge PDFs". Everything happens in your browser, in seconds.
4. **Download** — Save the combined file. The original files stay untouched on your device.

### FAQs (in addition to the 4 baseline privacy/size/offline/iOS)

5. **`Is there a limit to how many PDFs I can merge?`**
   No hard limit, but performance depends on your device. Most modern browsers handle 20+ PDFs (or several hundred pages total) comfortably. For very large merges, expect 10–30 seconds of processing.

6. **`Will the merged PDF be larger than the originals?`**
   The merged file's size is approximately the sum of the inputs, minus a small overhead. We don't recompress anything — the original quality of each page is preserved exactly.

7. **`Can I merge a password-protected PDF?`**
   Not directly. Unlock the PDF first (using our Unlock PDF tool, or any PDF reader that supports the password), then merge the unlocked version.

8. **`Does the order in the file list determine the page order?`**
   Yes. Files merge top-to-bottom. Drag rows to change the order before clicking Merge.

### Educational body (350–500 words)

Two sections:

#### "When you actually need to merge PDFs"
Concrete examples: combining a scanned signed contract page with the rest of the unsigned PDF; collating bank statements from multiple months into one file for an accountant; building a single PDF portfolio from separate design exports; assembling a complete chapter from a textbook split into per-page scans.

Include a worked example with numbers:
> *"You have 4 bank statement PDFs, one per month, totaling 1.4 MB. After merging, the output is 1.4 MB and 24 pages — the original quality of every page is preserved because we don't re-render; pdf-lib copies pages byte-for-byte."*

#### "Why no upload matters"
PDF documents are often the most sensitive files in your filesystem — signed contracts, tax returns, payslips, medical records. Most online "merge PDF" tools upload your file to a third-party server, hold it for a few minutes, and trust that the company deletes it afterward. Toolisk does not upload. The PDF is opened, merged, and saved entirely inside the JavaScript runtime of your browser tab. When you close the tab, the merged file is gone from our reach forever — because it was never in our reach.

Include a small comparison block (markdown bullet list):
- **Server-side merge tools**: upload your PDF over the network → server holds the file → output downloaded → file may be cached, indexed, or retained.
- **Toolisk Merge PDF**: file stays in your browser's memory → merged in JavaScript → saved to your device → nothing ever leaves your machine.

### Related tools
- `Split PDF` → `/pdf/split-pdf`
- `Reorder PDF Pages` → `/pdf/reorder-pdf-pages`
- `Delete Pages from PDF` → `/pdf/delete-pdf-pages`

---

## masterItems entry

```ts
{
  name: 'Merge PDF',
  description: 'Combine multiple PDFs into one file with drag-to-reorder. Runs entirely in your browser — files are never uploaded.',
  path: '/pdf/merge-pdf',
  icon: '📎',
  tags: ['PDF', 'Merge', 'Combine'],
  type: 'pdf',
  isNew: true,
},
```

## Breadcrumb label

```ts
'merge-pdf': 'Merge PDF',
```

## Acceptance

- Drag-drop reordering works smoothly without a DnD library.
- Encrypted PDF is rejected with the named error message.
- 4 × 5 MB PDFs merge in < 5 s on desktop Chrome.
- Output file size ≈ sum of inputs.
- Built page passes `tsc` + `npm run build`; per-route JS for `/pdf/merge-pdf` ≤ 100 KB (excluding the lazy-loaded `pdf-lib` chunk).
