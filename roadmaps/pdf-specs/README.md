# PDF Tools — Spec Pack

Implementation specs for the first 10 tools of the `/pdf` section. Each spec is self-contained and intended to be handed to a coding agent (Claude Sonnet) one at a time.

**Prerequisite reading for every spec**: `.claude/skills/new-pdf/SKILL.md`. The skill contains the shared file layout, design system, lazy-loading rules, SEO requirements, build gate, and acceptance checklist. The specs only describe what's *different* per tool.

---

## Order of implementation

The dependencies between tools are real — build in this order:

| # | Spec | Slug | Why this order |
|---|---|---|---|
| 0 | [00-hub-page.md](./00-hub-page.md) | `/pdf` | Bootstraps the section. Header nav, footer column, `PDFS` array, shared components, hub itself. |
| 1 | [01-merge-pdf.md](./01-merge-pdf.md) | `/pdf/merge-pdf` | Foundation. Establishes the dropzone + file-row UI pattern. |
| 2 | [02-split-pdf.md](./02-split-pdf.md) | `/pdf/split-pdf` | Pairs with Merge. Adds the page-range parser + lazy `jszip`. |
| 3 | [03-rotate-pdf.md](./03-rotate-pdf.md) | `/pdf/rotate-pdf` | Simplest tool — proves the per-page action + thumbnail-grid pattern. |
| 4 | [04-jpg-to-pdf.md](./04-jpg-to-pdf.md) | `/pdf/jpg-to-pdf` | Mobile-first conversion. Validates image input path. |
| 5 | [05-pdf-to-jpg.md](./05-pdf-to-jpg.md) | `/pdf/pdf-to-jpg` | First pdf.js render. Introduces the page-render-to-canvas helper. |
| 6 | [06-pdf-to-png.md](./06-pdf-to-png.md) | `/pdf/pdf-to-png` | Reuses #5's helper. Tiny incremental work. |
| 7 | [07-pdf-to-text.md](./07-pdf-to-text.md) | `/pdf/pdf-to-text` | Uses pdf.js text extraction (different code path). High SEO leverage. |
| 8 | [08-delete-pdf-pages.md](./08-delete-pdf-pages.md) | `/pdf/delete-pdf-pages` | Exercises `<PdfPageGrid>` in `multi-select` mode. |
| 9 | [09-reorder-pdf-pages.md](./09-reorder-pdf-pages.md) | `/pdf/reorder-pdf-pages` | Same grid in `reorder` mode. |
| 10 | [10-compress-pdf.md](./10-compress-pdf.md) | `/pdf/compress-pdf` | Hardest tool — image re-encode pipeline. Build last. |

---

## What's shared across all 10

These get built **once** during the first tool (#1 — Merge PDF) and reused by every subsequent tool. The bootstrap section of the new-pdf skill covers them:

- `src/components/Pdf/PdfDropzone.tsx`
- `src/components/Pdf/PdfPageGrid.tsx` (modes: `display`, `multi`, `reorder`)
- `src/components/Pdf/PdfTrustBadge.tsx`
- `src/hooks/usePdfLib.ts`
- `src/hooks/usePdfJs.ts`
- `ToolShell` `parent="pdf"` support
- `'pdf': 'PDF Tools'` breadcrumb label
- `PDFS` array + `PDF_COUNT` exported from `src/data/masterItems.ts`
- Header / footer nav links to `/pdf`
- The `/pdf` hub page itself

If any of these is missing when you start tool #N (N > 1), do the bootstrap first.

---

## Section design tokens

- Hero gradient: `from-rose-600 via-red-600 to-orange-500`
- Accent color: `rose-600`
- Trust badge color: rose/red (matches accent)
- Card primitive: `<ToolCard>` from `src/components/Tools/ToolShell.tsx`
- Workspace radius: `rounded-lg` (never `rounded-2xl`)
- Touch target floor: 44 px
- Colors: `slate-*` only, never `gray-*`

---

## SEO posture for the section

Every PDF page targets the **privacy keyword cluster** (`"[tool] no upload"`, `"[tool] online private"`, `"[tool] in browser"`). The big PDF sites (smallpdf, ilovepdf, sodapdf) can't compete on those phrases because they actually do upload. That's the differentiation thesis — every page should reinforce it via:

- Hero tagline that names "in your browser" / "no upload"
- A `<PdfTrustBadge>` above the workspace
- A "Why no-upload matters" paragraph in the educational body
- A "vs uploading" comparison block in the educational body
- Privacy phrases in keyword meta
- The first 4 FAQs (privacy / size / offline / iOS) baked in as a baseline

---

## Build gate (per tool)

Each spec ends with an Acceptance section. Before declaring a tool done:

```bash
npx tsc --noEmit && npm run build
```

Both must pass cleanly. Report per-route JS size for the new page in the Next.js build output — bundle discipline is a hard requirement for `/pdf` because each PDF library is hundreds of KB.

---

## What's intentionally NOT in this pack

The roadmap (`roadmaps/pdf-tools.md`) lists many more tools — Add Page Numbers, Watermark, Crop, Resize, Metadata Editor, Unlock, Protect, N-up, Signature, Flatten Form. They're explicitly **out of scope for this first pack**.

Reasons:
- They share infrastructure that's *introduced* by the first 10 (dropzone + page grid + hooks), so building any of them before the first 10 reuses nothing and bakes in patterns we haven't proven.
- They depend on niche library features (`qpdf-wasm` for proper encryption, `tesseract.js` for OCR) that we don't want to commit to until the simpler tools have shipped and the section has traffic.
- The first 10 cover the highest-volume keyword clusters globally. Once they ship and start earning impressions in Search Console, **then** pick the next 5 based on which long-tail clusters are showing up in the queries report — not based on guesses.

If you're asked to add an 11th tool, write a new spec MD file under this directory and append it to the table above. Don't bake new tools into existing specs.
