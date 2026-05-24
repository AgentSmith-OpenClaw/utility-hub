# PDF Tools — Roadmap

New `/pdf` section. All tools run **100% client-side** — files never leave the browser. This is genuine differentiation: smallpdf, ilovepdf, and most competitors upload to servers, and "no upload, private" is a real ranking + trust angle.

**Core libraries:** `pdf-lib` (create/edit/merge), `pdf.js` (render/extract), `jspdf` (alt for simple cases). Load dynamically per tool to keep main bundle slim.

**Status:** 14 done / 11 todo / 4 skipped. Goal: ship all 25 doable tools.

## Tier 1 — Hero pages, huge global volume

- [x] **Merge PDF** — Combine multiple PDFs, drag-to-reorder. `pdf-lib`.
- [x] **Split PDF** — Extract page ranges into separate files. `pdf-lib`.
- [x] **Compress PDF** — Reduce file size by re-encoding embedded images at lower quality. `pdf-lib` + canvas re-encode.
- [x] **PDF to JPG** — Render each page as a JPG download (zip if multi-page). `pdf.js` + canvas + `jszip`.
- [x] **JPG to PDF** — Drop images, reorder, output single PDF. `pdf-lib`.
- [x] **PDF to PNG** — Same as PDF→JPG but lossless. Cheap variant of an existing tool.
- [x] **Rotate PDF** — Per-page or all pages 90/180/270°. `pdf-lib`.
- [x] **Delete Pages from PDF** — Visual page picker, remove + download. `pdf.js` for thumbs, `pdf-lib` for output.
- [x] **Reorder PDF Pages** — Drag-drop page reordering. Same scaffolding as Delete Pages.

## Tier 2 — Strong long-tail, specialist intent

- [ ] **Word to PDF (text extract)** — Extract .docx text via `mammoth.js`, render into a basic PDF. Honest labeling: "DOCX text → PDF".
- [x] **PDF to Text** — Extract all text content. `pdf.js`.
- [ ] **Extract Pages from PDF** — Inverse of delete: pick which pages to keep. `pdf-lib`.
- [ ] **Add Page Numbers to PDF** — Position picker (corner, center), start number, format. `pdf-lib` drawText.
- [ ] **Add Watermark to PDF** — Text or image watermark, opacity, rotation, all pages. `pdf-lib` drawText.
- [x] **PDF Page Counter** — Drop file, show page count + size + dimensions. `pdf-lib`.
- [x] **PDF Metadata Editor** — Title, author, subject, keywords. `pdf-lib`.
- [ ] **Crop PDF** — Crop region applied to all pages. `pdf-lib` page boxes.
- [ ] **Resize PDF (page size)** — A4 ↔ Letter ↔ Legal, fit/stretch. `pdf-lib` setSize.

## Tier 3 — Niche but underserved

- [x] **Unlock PDF (remove password)** — Standard PDF passwords + Toolisk custom encrypted files. `pdf-lib` + Web Crypto API.
- [x] **Protect PDF (add password)** — AES-256-GCM via Web Crypto API. Pairs with Unlock PDF.
- [ ] **PDF to HTML** — Single-page HTML rendering. `pdf.js`. (Complex — defer.)
- [ ] **Combine PDF with Images** — Mixed merge: PDFs + JPGs into one PDF. Extends Merge PDF. `pdf-lib`.
- [ ] **N-up PDF (multiple pages per sheet)** — 2-up, 4-up booklet printing. `pdf-lib`.
- [ ] **PDF Signature (draw + place)** — Canvas signature pad → flatten onto PDF page. `pdf-lib` + canvas.
- [ ] **Flatten PDF Form** — Convert filled form fields to static content. `pdf-lib`.

## Bonus tools (not in original roadmap, simple adds)

- [ ] **PDF to Grayscale** — Convert color pages to grayscale (via Canvas re-render). `pdf.js` + canvas.

## Avoid (or build server-side later)

- [ ] **OCR PDF** — `tesseract.js` works but is ~10MB + slow. Worth doing eventually.
- [ ] **PDF text editing** — Genuinely hard. Not worth the complexity.
- [ ] **PDF to Excel** — Layout reconstruction is unreliable client-side. Skip.
- [ ] **AI summarize PDF** — Needs API key + server. Different product.

## Build sequencing (final push)

1. **Batch 1 — Inverse/reuse:** Extract Pages, Flatten Form, Resize PDF. Reuses DeletePages/Reorder scaffolding.
2. **Batch 2 — Draw/crop:** Crop PDF, Add Page Numbers, Add Watermark. Uses pdf-lib page manipulation APIs.
3. **Batch 3 — Composite:** Combine PDF+Images, N-up PDF, PDF Signature. More complex layouts.
4. **Stretch:** PDF to Grayscale, Word to PDF (text).

## Shared infrastructure (done)

- [x] `<PdfDropzone>` — Drag/drop, multi-file, validation, preview thumbnails.
- [x] `<PdfPageGrid>` — Reorderable thumbnail grid.
- [x] `usePdfLib()` / `usePdfJs()` hooks — Lazy-load + cache.
- [x] Download helper — Single-file save + multi-file zip (`jszip`).
- [x] `<PdfTrustBadge>` — "Private — runs in your browser" trust badge.

## SEO leverage notes

- Target "**free** [tool] **no upload**" and "**[tool] online private**" — these are huge sub-keywords where smallpdf/ilovepdf can't compete because they *do* upload.
- Every tool page needs: dedicated FAQ ("Is this safe?" / "What's the file size limit?" / "Does it work offline?"), HowTo schema, side-by-side "vs uploading" comparison table.
- Cross-link aggressively: Merge ↔ Split ↔ Reorder ↔ Delete Pages are the same user, hit them with a "you might also need" rail.
- Bundle-size discipline: every tool route must dynamic-import its library.

## Tradeoffs to flag in UX

- **File size ceiling:** ~50MB PDFs get slow on mobile. Show progress, warn at 30MB, hard-cap at 100MB.
- **iOS Safari memory:** Test on iPhone — Safari kills tabs >~1GB RAM. Stream-process where possible.
- **Browser-only constraint:** No "save to Drive" / "save to Dropbox" without server. Skip cloud integrations; lean into the privacy story instead.
