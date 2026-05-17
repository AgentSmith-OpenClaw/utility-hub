# Spec: PDF to Text

> Read `.claude/skills/new-pdf/SKILL.md` first.

A Tier-2 tool from the roadmap but moved into the top 10 because it's read-only (shares the pdf.js pipeline with PDF→JPG/PNG), unlocks the `"copy text from pdf"` keyword cluster, and pairs naturally with conversion tools.

---

## Identity

| | |
|---|---|
| Slug | `pdf-to-text` |
| Icon | `📝` |
| Tagline | `Extract all text from a PDF — copy or download as .txt. Runs in your browser, no upload.` |
| Primary library | `pdf.js` (text content extraction) |
| Component path | `src/components/Pdf/PdfToText.tsx` |
| Page path | `src/pages/pdf/pdf-to-text.tsx` |

---

## UX flow

1. **Empty state** — single-file dropzone.
2. **Loaded** — file row + options + immediate extraction (no separate action button; this tool runs as soon as a file is loaded since extraction is cheap).
3. **Options**:
   - **Page selector** (segmented control): `All pages` (default), `Page range` (with text input — same parser as Split PDF).
   - **Layout mode**: `Preserve line breaks` (default) / `Joined paragraphs` (collapses single line-breaks within a paragraph; keeps blank-line paragraph separators).
   - **Include page numbers**: checkbox. When checked, output is prefixed per page with `--- Page n ---`.
4. **Output panel** (right side or below on mobile): large read-only `<textarea>` showing the extracted text. Above the textarea: stats — `n words · m characters · p pages`. Below: action row — `<CopyButton>`, `Download as .txt`, `Download as .md` (same content but `.md` extension).

The output panel re-runs extraction live as options change (no "Extract" button needed — it's near-instant).

---

## Core logic

```ts
import * as pdfjsLib from 'pdfjs-dist';

interface ExtractOpts {
  pages: 'all' | number[];        // 0-indexed
  joinParagraphs: boolean;
  includePageNumbers: boolean;
}

async function extractText(file: File, opts: ExtractOpts): Promise<string> {
  const bytes = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
  const pages = opts.pages === 'all'
    ? Array.from({ length: doc.numPages }, (_, i) => i)
    : opts.pages;
  const parts: string[] = [];
  for (const i of pages) {
    const page = await doc.getPage(i + 1);
    const content = await page.getTextContent();
    let text = '';
    let lastY: number | null = null;
    for (const item of content.items) {
      const it = item as any; // pdf.js types are awkward; narrow inline
      if (typeof it.str !== 'string') continue;
      const y = it.transform[5];
      // pdf.js returns items in reading order; a Y change ≈ new line.
      if (lastY !== null && Math.abs(y - lastY) > 1) text += '\n';
      text += it.str;
      lastY = y;
    }
    if (opts.joinParagraphs) {
      // Collapse single \n inside a block, preserve \n\n.
      text = text.replace(/([^\n])\n(?!\n)/g, '$1 ').replace(/\n{2,}/g, '\n\n');
    }
    if (opts.includePageNumbers) {
      parts.push(`--- Page ${i + 1} ---\n${text}`);
    } else {
      parts.push(text);
    }
    page.cleanup();
  }
  return parts.join(opts.includePageNumbers ? '\n\n' : '\n\n');
}
```

### Edge cases
- **Scanned PDF (image-only, no text layer)** — extraction returns empty strings. Detect this (`totalChars < 10 && numPages > 0`) and surface a helpful banner: `"This PDF has no extractable text — it looks like a scan. OCR is needed to read scanned text, which we don't yet offer client-side."`
- **Mixed text + scanned pages** — extraction returns whatever text is real; the scanned pages will appear blank. Note this clearly when only some pages are empty.
- **Encrypted PDF** — `PasswordException` → password prompt.
- **Reading order on multi-column PDFs** — pdf.js returns items in PDF object order, which often produces interleaved lines on two-column layouts. Note this in FAQs; for academic papers, output may need manual cleanup. Don't try to be too clever here — keep it predictable.

---

## SEO

### `<title>`
`PDF to Text — Copy Text from PDF | Toolisk`  (43 chars)

### Meta description
`Extract all text from a PDF in your browser — copy to clipboard, download as .txt or .md. No upload, no sign-up, works offline.`

### Keywords
`pdf to text, copy text from pdf, pdf to txt, extract text from pdf, pdf to text free, pdf to text no upload, pdf text extractor, pdf to markdown`

### Features
- `🔒 100% client-side — your PDF never leaves your browser`
- `📋 One-click copy or download as .txt / .md`
- `🎚️ Page range support — extract just what you need`
- `📐 Preserve line breaks or join into paragraphs`
- `🔢 Optional per-page section headers`
- `📊 Live word and character count`

### How-to
1. **Drop your PDF** — Any size up to 100 MB.
2. **Pick a range (optional)** — Default is all pages.
3. **Choose layout** — Preserve line breaks, or join into paragraphs.
4. **Copy or download** — Clipboard, .txt, or .md.

### FAQs (after the 4 baseline)
5. **`Why is the extracted text empty?`** — Your PDF is probably a scan (a photo of a page, not a real text PDF). Real PDFs have a hidden text layer that we can read; scans don't. Extracting text from scans needs OCR, which we don't yet offer client-side.
6. **`Why does the text look jumbled on two-column papers?`** — pdf.js reads text in PDF object order, which on multi-column layouts often interleaves the columns. Single-column layouts (most office docs, books, contracts) extract cleanly.
7. **`What's the difference between .txt and .md output?`** — The content is identical. The `.md` extension just means apps that recognize Markdown (Obsidian, VS Code, GitHub) will treat the file like a Markdown document. Pick whatever your downstream tool prefers.
8. **`Can I extract tables as proper rows and columns?`** — Not reliably — PDF doesn't store tables as structured data, just as text positioned at coordinates. The output will contain all the table cells in roughly reading order, but you'll need to reformat manually.

### Educational body

Cover:
- The mental model: a real PDF has a "text layer" sitting on top of (or inside) the visible page content. Most PDFs created by Word, Pages, LaTeX, etc. have this layer; scans don't. Our tool reads the layer — no OCR, no AI.
- Worked example: `"A 20-page contract PDF, ~80 KB: full text extraction takes ~300 ms, output is ~25 KB of plain text and ~4,500 words."`
- "Why no upload matters" — text from a contract or NDA is the literal content of the agreement; uploading it to a stranger's server is rarely acceptable.
- Mini comparison vs server tools, with a callout that some server tools charge per page over a free quota.

### Related tools
- `PDF to JPG` → `/pdf/pdf-to-jpg`
- `PDF to PNG` → `/pdf/pdf-to-png`
- `Merge PDF` → `/pdf/merge-pdf`

---

## masterItems entry

```ts
{
  name: 'PDF to Text',
  description: 'Extract every word from a PDF, copy or save as .txt / .md. Page-range and paragraph-join options. Runs in your browser.',
  path: '/pdf/pdf-to-text',
  icon: '📝',
  tags: ['PDF', 'Convert', 'Text'],
  type: 'pdf',
  isNew: true,
},
```

## Breadcrumb label

```ts
'pdf-to-text': 'PDF to Text',
```

## Acceptance

- Extraction of a 20-page text PDF completes in < 1 s on desktop Chrome.
- Empty-result banner shown for a known scanned PDF.
- Page-range parser accepts the same syntax as Split PDF.
- Copy-to-clipboard works on Safari, Chrome, Firefox.
- `tsc` + `npm run build` pass.
