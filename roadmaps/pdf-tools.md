# PDF Tools — Roadmap

New `/pdf` section. All tools run **100% client-side** — files never leave the browser. This is genuine differentiation: smallpdf, ilovepdf, and most competitors upload to servers, and "no upload, private" is a real ranking + trust angle.

**Core libraries:** `pdf-lib` (create/edit/merge), `pdf.js` (render/extract), `jspdf` (alt for simple cases). Load dynamically per tool to keep main bundle slim.

## Tier 1 — Hero pages, huge global volume (build first)

- **Merge PDF** — Combine multiple PDFs, drag-to-reorder. ~500k/mo search volume globally. `pdf-lib`.
- **Split PDF** — Extract page ranges into separate files. Pairs with merge for internal linking. `pdf-lib`.
- **Compress PDF** — Reduce file size by re-encoding embedded images at lower quality. Trickiest of the tier 1, but highest volume keyword in the whole vertical (~1M/mo). `pdf-lib` + canvas re-encode.
- **PDF to JPG** — Render each page as a JPG download (zip if multi-page). `pdf.js` + canvas + `jszip`.
- **JPG to PDF** — Drop images, reorder, output single PDF. Mobile-first usage (scanned receipts). `pdf-lib`.
- **PDF to PNG** — Same as PDF→JPG but lossless. Cheap variant of an existing tool.
- **Rotate PDF** — Per-page or all pages 90/180/270°. `pdf-lib`.
- **Delete Pages from PDF** — Visual page picker, remove + download. `pdf.js` for thumbs, `pdf-lib` for output.
- **Reorder PDF Pages** — Drag-drop page reordering. Same scaffolding as Delete Pages.

## Tier 2 — Strong long-tail, specialist intent

- **Word to PDF / PDF to Word** — *Caveat:* true Word conversion is hard client-side. Honest version: HTML/Markdown → PDF works; .docx → PDF needs WASM (`mammoth.js` for read + custom render). Consider skipping or marking as "DOCX text → PDF".
- **PDF to Text** — Extract all text content. `pdf.js`. Great for SEO ("copy text from pdf").
- **Extract Pages from PDF** — Inverse of delete: pick which pages to keep. `pdf-lib`.
- **Add Page Numbers to PDF** — Position picker (corner, center), start number, format. `pdf-lib`.
- **Add Watermark to PDF** — Text or image watermark, opacity, rotation, all pages. `pdf-lib`.
- **PDF Page Counter** — Trivial: drop file, show page count + size + dimensions. Cheap, ranks well.
- **PDF Metadata Editor** — Title, author, subject, keywords. `pdf-lib`.
- **Crop PDF** — Visual crop region applied to all pages. `pdf-lib` page boxes.
- **Resize PDF (page size)** — A4 ↔ Letter ↔ Legal, fit/stretch. `pdf-lib`.

## Tier 3 — Niche but underserved

- **Unlock PDF (remove password)** — Only if user provides the password (legal/ethical). `pdf-lib` with password.
- **Protect PDF (add password)** — `pdf-lib` has limited support; may need `qpdf-wasm` for proper encryption. Test before promising.
- **PDF to HTML** — Single-page HTML rendering. `pdf.js`.
- **Combine PDF with Images** — Mixed merge: PDFs + JPGs into one PDF. Extends Merge PDF.
- **N-up PDF (multiple pages per sheet)** — 2-up, 4-up booklet printing. `pdf-lib`.
- **PDF Signature (draw + place)** — Canvas signature pad → flatten onto PDF page. `pdf-lib` + custom canvas.
- **Flatten PDF Form** — Convert filled form fields to static content. `pdf-lib`.

## Avoid (or build server-side later)

- **OCR PDF** — `tesseract.js` works but is ~10MB + slow. Worth doing eventually with a clear "may take 30s" disclaimer.
- **PDF text editing** — Genuinely hard. Not worth the complexity.
- **PDF to Excel** — Layout reconstruction is unreliable client-side. Skip.
- **AI summarize PDF** — Needs API key + server. Different product.

## Build sequencing (30-day pack)

1. **Week 1 — Foundation 4:** Merge, Split, Rotate, JPG→PDF. Establishes the `/pdf` route, shared file-drop component, shared pdf-lib loader.
2. **Week 2 — Conversion 3:** PDF→JPG, PDF→PNG, PDF→Text. All read-only, all use `pdf.js`. Shared rendering pipeline.
3. **Week 3 — Edit 4:** Delete Pages, Reorder Pages, Add Page Numbers, Add Watermark. Reuses Merge's thumbnail picker.
4. **Week 4 — Compress + niche:** Compress PDF (the hard one — image re-encode pipeline), PDF Page Counter, Metadata Editor, Crop PDF.

That's 14 tools in 30 days, all reusing 2–3 shared components.

## Shared infrastructure to build once

- **`<PdfDropzone>`** — Drag/drop, multi-file, validation, preview thumbnails (via pdf.js page 1 render).
- **`<PdfPageGrid>`** — Reorderable thumbnail grid used by Merge, Split, Delete, Reorder, Extract.
- **`usePdfLib()` / `usePdfJs()` hooks** — Lazy-load the library on first use, cache the module.
- **Download helper** — Single-file save + multi-file zip (`jszip`), consistent naming.
- **"Private — runs in your browser" trust badge** — Repeated on every tool page. This is the key SEO + conversion message.

## SEO leverage notes

- Target "**free** [tool] **no upload**" and "**[tool] online private**" — these are huge sub-keywords where smallpdf/ilovepdf can't compete because they *do* upload.
- Every tool page needs: dedicated FAQ ("Is this safe?" / "What's the file size limit?" / "Does it work offline?"), HowTo schema, side-by-side "vs uploading" comparison table.
- Cross-link aggressively: Merge ↔ Split ↔ Reorder ↔ Delete Pages are the same user, hit them with a "you might also need" rail.
- Bundle-size discipline: every tool route must dynamic-import its library. A user landing on Rotate PDF should not download the compress-image pipeline.
- Add a `/pdf` hub page listing all tools, schema'd as `CollectionPage` — collects internal link equity.

## Tradeoffs to flag in UX

- **File size ceiling:** ~50MB PDFs get slow on mobile. Show progress, warn at 30MB, hard-cap at 100MB.
- **iOS Safari memory:** Test on iPhone — Safari kills tabs >~1GB RAM. Stream-process where possible.
- **Browser-only constraint:** No "save to Drive" / "save to Dropbox" without server. Skip cloud integrations; lean into the privacy story instead.
