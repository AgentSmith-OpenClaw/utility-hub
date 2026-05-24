# Image Tools — Implementation Plan

## Section Identity

| Property | Value |
|---|---|
| URL prefix | `/image/<slug>` |
| `parent` prop | `"image"` |
| `theme` prop | `"sky"` |
| Hero gradient | `from-sky-600 via-blue-600 to-cyan-500` |
| Badge / tag color | sky (`text-sky-600 bg-sky-50 border-sky-200/60`) |
| Accent color | `sky-600` |
| Section landing | `src/pages/image/index.tsx` |
| Component folder | `src/components/Image/` |
| Page folder | `src/pages/image/` |
| `ItemType` | `'image'` |

---

## ✅ Section Bootstrap — DONE

The following have been created and wired:

- `src/components/Image/ImageDropzone.tsx` — shared dropzone with sky-600 accents
- `src/components/Image/ImageTrustBadge.tsx` — privacy/speed/free badge row
- `src/components/Image/ImagePreview.tsx` — file thumbnail + metadata display
- `src/components/Image/ImageDownloadButton.tsx` — Safari-safe download button
- `src/hooks/useImageCanvas.ts` — shared Canvas utilities (loadImage, drawToCanvas, canvasToBlob, getBytes)
- `src/pages/image/index.tsx` — hub page with sky gradient, search, grid, SEO
- `src/data/masterItems.ts` — `IMAGES` array, `IMAGE_COUNT` export, `type: 'image'` in ItemType
- `src/utils/siteConfig.ts` — `'image': 'Image Tools'` breadcrumb label
- `src/components/Tools/ToolShell.tsx` — `'image'` parent + `'sky'` theme support
- `src/components/Layout/Header.tsx` — Image nav link between PDF and Learn
- `src/components/Layout/Footer.tsx` — Image Tools column
- `src/pages/index.tsx` — Image filter, badge, card, SEO content section
- `package.json` — `browser-image-compression` installed

## ✅ Completed Tools

### Tool #1: Image Compressor (`compress-image`) — DONE
- Component: `src/components/Image/CompressImage.tsx`
- Page: `src/pages/image/compress-image.tsx`
- masterItems entry: ✅
- siteConfig breadcrumb: ✅
- Features: batch compression, quality slider with presets (Low/Medium/High), before/after sizes, per-file download + zip download, sky-600 accent

### Tool #2: Image Resizer (`resize-image`) — DONE
- Component: `src/components/Image/ResizeImage.tsx`
- Page: `src/pages/image/resize-image.tsx`
- masterItems entry: ✅
- siteConfig breadcrumb: ✅
- Features: pixel/percent modes, aspect ratio lock, format/quality controls, pica lazy-load for high-quality resampling

---

## Claude Code Skill

The skill for building image tools is at `.claude/skills/new-image/SKILL.md`. It was validated by building two tools (Compressor and Resizer) and works well. **Use this skill for every remaining tool.** It contains the full checklist, file layout, design system, SEO requirements, and wire-in instructions.

---

## 20 Tools — Detailed Specs

### 1. ✅ Image Compressor — DONE

| Field | Value |
|---|---|
| Name | Image Compressor |
| Slug | `compress-image` |
| Icon | 🗜️ |
| Path | `/image/compress-image` |
| Tags | ['Image', 'Compress', 'Optimize'] |
| Primary library | `browser-image-compression` (lazy) |
| Tagline | `Compress JPG, PNG, and WebP images with a quality slider — runs in your browser, no upload.` |
| Description | Compress images up to 80% smaller with adjustable quality. Supports JPG, PNG, and WebP — 100% client-side, no upload. |
| Keywords | `compress image, image compressor, reduce image file size, compress jpg, compress png, image optimizer, compress image no upload, shrink image` |
| State shape | `'idle' \| 'loading-lib' \| 'compressing' \| 'done' \| 'error'` |
| UI | Dropzone (multi-file) → preview with original size → quality slider (1–100, presets: Low 40, Medium 65, High 85) → per-file progress → results list with before/after sizes + savings % → individual download + zip download |
| Features | 🔒 100% client-side, ⚡ Adjustable quality slider, 📊 Before/after file size comparison, 📦 Batch compress multiple files, 🆓 No sign-up no watermarks, 📱 Works on mobile |
| Steps | Drop images → Adjust quality → Compress → Download |
| SEO angle | "compress image free no upload" / "image compressor online private" |

### 2. ✅ Image Resizer — DONE

| Field | Value |
|---|---|
| Name | Image Resizer |
| Slug | `resize-image` |
| Icon | 📐 |
| Path | `/image/resize-image` |
| Tags | ['Image', 'Resize', 'Dimensions'] |
| Primary library | `pica` (lazy for high-quality downscale) |
| Tagline | `Resize images by pixels or percentage, lock aspect ratio — runs in your browser, no upload.` |
| Description | Resize images to exact dimensions or percentages with locked aspect ratio. High-quality Lanczos resampling — 100% client-side, no upload. |
| Keywords | `resize image, image resizer, change image dimensions, resize jpg, resize png, image resize no upload, resize image online free` |
| UI | Dropzone (single) → display original dimensions → width/height inputs with lock ratio toggle → percentage mode → resize button → download resized |
| Features | 🔒 100% client-side, 📐 Pixel or percentage resize, 🔗 Lock aspect ratio, 🎨 High-quality Lanczos resampling, 📦 Batch support, 🆓 Free forever |

### 3. Convert to JPG

| Field | Value |
|---|---|
| Name | Convert to JPG |
| Slug | `convert-to-jpg` |
| Icon | 🖼️ |
| Path | `/image/convert-to-jpg` |
| Tags | ['Image', 'Convert', 'JPG'] |
| Primary library | Canvas API |
| Tagline | `Convert PNG, WebP, AVIF, HEIC, GIF, and BMP to JPG — runs in your browser, no upload.` |
| Description | Convert any image format to JPG with quality control. Supports PNG, WebP, HEIC, GIF, AVIF, and BMP — 100% client-side, no upload. |
| Keywords | `convert to jpg, png to jpg, webp to jpg, heic to jpg, image to jpg, convert image to jpg free, convert to jpg no upload` |
| UI | Dropzone (multi-file) → quality slider → convert → results list → individual/zip download |
| Features | 🔒 100% client-side, 🖼️ PNG/WebP/HEIC/AVIF/GIF/BMP input, 🎛️ Adjustable quality, 📦 Batch conversion, 🆓 No sign-up, ⚡ Instant download |
| Notes | HEIC support via lazy-loaded `heic2any` — show "Loading HEIC support…" state only when a HEIC file is dropped. Canvas `toBlob('image/jpeg', quality)` is the core. |

### 4. Convert to PNG

| Field | Value |
|---|---|
| Name | Convert to PNG |
| Slug | `convert-to-png` |
| Icon | 🖼️ |
| Path | `/image/convert-to-png` |
| Tags | ['Image', 'Convert', 'PNG'] |
| Primary library | Canvas API |
| Tagline | `Convert any image to PNG with transparency — runs in your browser, no upload.` |
| Description | Convert images to lossless PNG with full transparency support. Accepts JPG, WebP, AVIF, HEIC, GIF, BMP — 100% client-side. |
| Keywords | `convert to png, jpg to png, webp to png, heic to png, image to png, convert image to png free, convert to png no upload` |
| UI | Same as Convert to JPG but no quality slider (PNG is lossless). Transparency toggle for JPG input (white vs transparent bg). |

### 5. Convert to WebP

| Field | Value |
|---|---|
| Name | Convert to WebP |
| Slug | `convert-to-webp` |
| Icon | 🌐 |
| Path | `/image/convert-to-webp` |
| Tags | ['Image', 'Convert', 'WebP'] |
| Primary library | Canvas API (`image/webp`) |
| Tagline | `Convert images to modern WebP format — 30% smaller than JPG, runs in your browser.` |
| Description | Convert any image to WebP for ~30% smaller files. Quality slider, batch support — 100% client-side, no upload. |
| Keywords | `convert to webp, jpg to webp, png to webp, webp converter, image to webp, convert to webp free, convert to webp no upload` |
| UI | Dropzone (multi) → quality slider → convert → results list with savings % → zip download |
| Browser check | `CanvasRenderingContext2D.prototype.toBlob` with `image/webp` probe — if unsupported, show "Your browser doesn't support WebP encoding. Try Chrome or Edge." |

### 6. HEIC to JPG

| Field | Value |
|---|---|
| Name | HEIC to JPG |
| Slug | `heic-to-jpg` |
| Icon | 📱 |
| Path | `/image/heic-to-jpg` |
| Tags | ['Image', 'HEIC', 'iPhone'] |
| Primary library | `heic2any` (lazy, ~130KB) |
| Tagline | `Convert iPhone HEIC photos to JPG — runs in your browser, no upload, no sign-up.` |
| Description | Convert HEIC/HEIF photos from iPhone to JPG instantly. Batch conversion, quality control — all client-side, no upload. |
| Keywords | `heic to jpg, heic converter, iphone photo converter, heic to jpg free, heic to jpg no upload, convert heic, heif to jpg` |
| UI | Dropzone (multi, accept `.heic,.heif`) → quality slider → convert → results → download. Mobile-optimized — this is a mobile-first tool. |
| Mobile first | This tool has high mobile traffic. Hero, CTA, and touch targets MUST be optimized for 375px width. Show "iPhone photos, converted right on your phone" messaging. |

### 7. Convert to AVIF

| Field | Value |
|---|---|
| Name | Convert to AVIF |
| Slug | `convert-to-avif` |
| Icon | ✨ |
| Path | `/image/convert-to-avif` |
| Tags | ['Image', 'Convert', 'AVIF'] |
| Primary library | Canvas API (`image/avif` — Chrome/Safari only) |
| Tagline | `Convert images to AVIF — up to 50% smaller than JPG. Runs in your browser, no upload.` |
| Description | Convert any image to next-gen AVIF format for massive file size savings. Quality slider, browser compatibility check — 100% client-side. |
| Keywords | `convert to avif, jpg to avif, png to avif, avif converter, image to avif, avif converter free, avif no upload` |
| Browser check | Probe `toBlob` with `image/avif`. If unsupported: "AVIF encoding is only available in Chrome, Edge, and Safari. Try one of these browsers." |

### 8. Crop Image

| Field | Value |
|---|---|
| Name | Crop Image |
| Slug | `crop-image` |
| Icon | ✂️ |
| Path | `/image/crop-image` |
| Tags | ['Image', 'Crop', 'Edit'] |
| Primary library | `react-image-crop` (lazy) |
| Tagline | `Crop images with free-form or preset ratios — Instagram, YouTube, Facebook sizes built-in. No upload.` |
| Description | Crop images with drag selection, preset aspect ratios (1:1, 16:9, 4:3, 9:16), and social media presets. 100% client-side, no upload. |
| Keywords | `crop image, image cropper, crop image online, crop photo, image crop no upload, crop image for instagram, crop image free` |
| UI | Dropzone (single) → canvas with `react-image-crop` overlay → ratio presets (Free, 1:1, 16:9, 4:3, 9:16, Instagram Post, Facebook Cover, YouTube Thumbnail) → width/height display → crop & download |
| Presets | Square (1:1), Landscape (16:9), Portrait (9:16), Classic (4:3), Instagram Post (4:5), Instagram Story (9:16), Facebook Cover (820×312), YouTube Thumbnail (1280×720) |

### 9. Rotate Image

| Field | Value |
|---|---|
| Name | Rotate Image |
| Slug | `rotate-image` |
| Icon | 🔄 |
| Path | `/image/rotate-image` |
| Tags | ['Image', 'Rotate', 'Edit'] |
| Primary library | Canvas API |
| Tagline | `Rotate images 90°, 180°, 270°, or by any angle — runs in your browser, no upload.` |
| Description | Rotate image left, right, flip, or by a custom angle with a slider preview. JPG, PNG, WebP — 100% client-side, no upload. |
| Keywords | `rotate image, rotate jpg, rotate png, image rotator, rotate photo, rotate image online free, rotate image no upload` |
| UI | Dropzone (single) → preview with rotation controls → 90° left/right buttons → 180° button → free-rotate slider (0–360) → download |

### 10. Flip Image

| Field | Value |
|---|---|
| Name | Flip Image |
| Slug | `flip-image` |
| Icon | ↔️ |
| Path | `/image/flip-image` |
| Tags | ['Image', 'Flip', 'Mirror'] |
| Primary library | Canvas API |
| Tagline | `Flip or mirror images horizontally and vertically — runs in your browser, no upload.` |
| Description | Flip or mirror any image horizontally or vertically. One-click operation — 100% client-side, no upload, instant download. |
| Keywords | `flip image, mirror image, flip horizontally, flip vertically, image mirror, flip photo, flip image online free, flip image no upload` |
| UI | Dropzone (single) → preview with flip buttons → horizontal flip / vertical flip → download. Simple but effective. |

### 11. Background Remover

| Field | Value |
|---|---|
| Name | Background Remover |
| Slug | `remove-background` |
| Icon | 🪄 |
| Path | `/image/remove-background` |
| Tags | ['Image', 'Background', 'Edit'] |
| Primary library | `@imgly/background-removal` (lazy, ~20MB WASM model) |
| Tagline | `Remove image backgrounds instantly with AI — runs in your browser, 100% private, no upload.` |
| Description | Remove backgrounds from photos with AI. Get transparent PNGs in seconds — all processing happens locally in your browser, no server, no upload. |
| Keywords | `remove background, background remover, remove background from image, bg remover, transparent background, remove background free, remove background no upload` |
| UI | Dropzone (single) → "Processing…" progress bar (model download + inference) → before/after slider → download transparent PNG |
| Lazy load | **The WASM model (~20MB) must only load when the user clicks "Start"**. Show a loading state with progress: "Downloading AI model… 12/20 MB" then "Processing image…" |
| Hero | This is the marquee tool. Design it like a hero product. Large before/after, clear "Remove Background" CTA, trust badge prominent. |

### 12. Image Watermark

| Field | Value |
|---|---|
| Name | Image Watermark |
| Slug | `image-watermark` |
| Icon | 💧 |
| Path | `/image/image-watermark` |
| Tags | ['Image', 'Watermark', 'Protect'] |
| Primary library | Canvas API |
| Tagline | `Add text or image watermarks to your photos — opacity, position, and tiling — runs in your browser.` |
| Description | Add text or image watermarks to photos. Control opacity, position, font size, and tiling — 100% client-side, no upload. |
| Keywords | `image watermark, add watermark to photo, watermark image, watermark online free, watermark no upload, protect photo` |
| UI | Dropzone (single) → text input or image watermark → opacity slider → position grid (9 positions or tiled) → font size → download |

### 13. Image Color Picker

| Field | Value |
|---|---|
| Name | Image Color Picker |
| Slug | `image-color-picker` |
| Icon | 🎨 |
| Path | `/image/image-color-picker` |
| Tags | ['Image', 'Color', 'Design'] |
| Primary library | Canvas API |
| Tagline | `Pick colors from any image — get HEX, RGB, and HSL values instantly. Runs in your browser.` |
| Description | Click any pixel to get its HEX, RGB, and HSL values. Extract dominant color palette automatically — 100% client-side, no upload. |
| Keywords | `image color picker, pick color from image, color picker from image, hex color from image, rgb from image, extract colors from image` |
| UI | Dropzone (single) → canvas with crosshair cursor → click to pick → display HEX/RGB/HSL with copy buttons → extracted palette (top 5 dominant colors via simple k-means) |

### 14. SVG to PNG

| Field | Value |
|---|---|
| Name | SVG to PNG |
| Slug | `svg-to-png` |
| Icon | 📐 |
| Path | `/image/svg-to-png` |
| Tags | ['Image', 'SVG', 'Convert'] |
| Primary library | Canvas API + `Image` element |
| Tagline | `Convert SVG to PNG at any resolution — runs in your browser, no upload.` |
| Description | Render SVG to PNG at custom dimensions and DPI. Scaling, background color options — 100% client-side, no upload. |
| Keywords | `svg to png, convert svg to png, svg converter, svg to png online, svg to png free, svg to png no upload` |
| UI | Dropzone (single, accept `.svg`) → width/height inputs with lock ratio → background toggle (transparent/white) → scale selector → convert → download PNG |

### 15. Favicon Generator (PNG to ICO)

| Field | Value |
|---|---|
| Name | Favicon Generator |
| Slug | `favicon-generator` |
| Icon | 🌐 |
| Path | `/image/favicon-generator` |
| Tags | ['Image', 'Favicon', 'ICO', 'Developer'] |
| Primary library | Canvas API for resizing, custom ICO encoder |
| Tagline | `Generate a complete favicon pack — ICO, Apple Touch, and manifest icons from any image. No upload.` |
| Description | Upload any image and generate a complete favicon pack: favicon.ico (16+32+48px), Apple Touch Icon, and PWA manifest icons — 100% client-side. |
| Keywords | `favicon generator, ico generator, png to ico, favicon creator, favicon pack, app icon generator, favicon no upload` |
| UI | Dropzone (single) → preview source → generate → download .zip containing: favicon.ico, apple-touch-icon.png, android-chrome-192x192.png, android-chrome-512x512.png, site.webmanifest |
| Pack contents | favicon-16x16.png, favicon-32x32.png, favicon.ico, apple-touch-icon.png (180x180), android-chrome-192x192.png, android-chrome-512x512.png, site.webmanifest |

### 16. EXIF Remover

| Field | Value |
|---|---|
| Name | EXIF Remover |
| Slug | `exif-remover` |
| Icon | 🔒 |
| Path | `/image/exif-remover` |
| Tags | ['Image', 'EXIF', 'Privacy'] |
| Primary library | Canvas API (re-encode strips EXIF) |
| Tagline | `Strip EXIF data from photos — remove GPS location, camera info, and metadata. No upload.` |
| Description | Remove GPS coordinates, camera model, timestamp, and all EXIF metadata from your photos before sharing — 100% client-side, no upload. |
| Keywords | `exif remover, remove exif data, strip exif, remove gps from photo, exif cleaner, photo privacy, remove metadata from image, exif remover no upload` |
| UI | Dropzone (multi) → show EXIF preview (GPS, camera, date) → "Remove EXIF" button → results with before/after metadata comparison → download |

### 17. Image Format Detector

| Field | Value |
|---|---|
| Name | Image Format Detector |
| Slug | `image-format-detector` |
| Icon | 🔍 |
| Path | `/image/image-format-detector` |
| Tags | ['Image', 'Info', 'Metadata'] |
| Primary library | Canvas API (for decode), `file-type` or magic bytes for true format |
| Tagline | `Drop any image to see its real format, dimensions, color depth, and EXIF — no upload.` |
| Description | Detect the true format of any image file (even if the extension is wrong). Shows dimensions, file size, color depth, and metadata — 100% client-side. |
| Keywords | `image format detector, check image format, image info, image metadata viewer, what format is my image, image file inspector, detect image type` |
| UI | Dropzone (single) → display: true format (from magic bytes), declared extension, dimensions (W×H), file size, color depth, MIME type, EXIF summary → copy all info button |

### 18. Round Image Corners

| Field | Value |
|---|---|
| Name | Round Image Corners |
| Slug | `round-image-corners` |
| Icon | ⬛ |
| Path | `/image/round-image-corners` |
| Tags | ['Image', 'Rounded', 'CSS'] |
| Primary library | Canvas API + `clip` |
| Tagline | `Add rounded corners to any image with adjustable radius and transparent background. No upload.` |
| Description | Round image corners with adjustable border radius, transparent PNG output, and optional border color — 100% client-side, no upload. |
| Keywords | `round image corners, rounded corners image, border radius image, round corners photo, rounded image, circle image, no upload` |
| UI | Dropzone (single) → radius slider (0–50%) → padding option → background toggle (transparent / white / custom) → preview → download |

### 19. Image Border

| Field | Value |
|---|---|
| Name | Image Border |
| Slug | `image-border` |
| Icon | 🖼️ |
| Path | `/image/image-border` |
| Tags | ['Image', 'Border', 'Frame'] |
| Primary library | Canvas API |
| Tagline | `Add solid or gradient borders to your images — adjustable width, color, and style. No upload.` |
| Description | Add custom borders to images with adjustable width, color, and style (solid, gradient). Batch-ready — 100% client-side, no upload. |
| Keywords | `image border, add border to image, photo frame, image border generator, add border to photo, image outline, photo frame no upload` |
| UI | Dropzone (single) → border width slider → color picker → style: solid / double / gradient → padding → download |

### 20. Pixelate / Blur

| Field | Value |
|---|---|
| Name | Pixelate / Blur |
| Slug | `pixelate-image` |
| Icon | 🔲 |
| Path | `/image/pixelate-image` |
| Tags | ['Image', 'Pixelate', 'Blur', 'Privacy'] |
| Primary library | Canvas API |
| Tagline | `Pixelate or blur parts of an image — faces, license plates, sensitive data. No upload.` |
| Description | Selectively pixelate or blur regions of an image. Draw a rectangle to blur faces, license plates, or sensitive data — 100% client-side, no upload. |
| Keywords | `pixelate image, blur image, pixelate face, blur face, image censor, pixelate photo, blur part of image, image privacy, pixelate no upload` |
| UI | Dropzone (single) → canvas with drag-to-select rectangle → pixelation intensity slider → "Pixelate selected" button → undo → download |

---

## Build Order

### Phase 1 — Foundation (Tool #1 scaffolds the section)

1. **Image Compressor** — Establishes `/image` route, `ImageDropzone`, `ImageTrustBadge`, shared canvas pipeline, section in `masterItems.ts`, header, footer, home page.

### Phase 2 — Conversion family (batch, builds on dropzone + canvas pipeline)

2. **Convert to JPG** — Batch convert, reuses `ImageDropzone` + `CanvasPipeline`
3. **Convert to PNG** — Same pattern, different output MIME
4. **Convert to WebP** — WebP-specific MIME + browser check
5. **HEIC to JPG** — HEIC-specific, lazy-loads `heic2any`
6. **Convert to AVIF** — AVIF-specific MIME + browser check

### Phase 3 — Transform tools (single-file manipulation)

7. **Image Resizer** — Dimensions UI + `pica` for quality
8. **Crop Image** — `react-image-crop` integration
9. **Rotate Image** — Simple angle controls
10. **Flip Image** — Simplest tool, good warm-up

### Phase 4 — Designer toolkit

11. **Background Remover** — Marquee feature, `@imgly/background-removal`
12. **Image Watermark** — Text/image overlay on Canvas
13. **Image Color Picker** — Click-to-pick + palette extraction
14. **SVG to PNG** — SVG → Image → Canvas → PNG
15. **Favicon Generator** — Multi-size ICO + zip package

### Phase 5 — Privacy & utility

16. **EXIF Remover** — Re-encode to strip metadata
17. **Image Format Detector** — Magic bytes + metadata display
18. **Round Image Corners** — Canvas clip with radius
19. **Image Border** — Canvas draw with padding
20. **Pixelate / Blur** — Canvas region pixelation

---

## Shared Infrastructure (built once in Phase 1)

| Component | File | Purpose |
|---|---|---|
| `<ImageDropzone>` | `src/components/Image/ImageDropzone.tsx` | Drag/drop + paste-from-clipboard + click-to-browse. Accepts `image/*` MIME types by default. 25MB warn, 50MB hard-cap. Shows thumbnails. Multi-file capable (configurable). |
| `<ImageTrustBadge>` | `src/components/Image/ImageTrustBadge.tsx` | Lock icon + "Runs in your browser — your images never leave your device." Badge above workspace on every tool page. |
| `<ImagePreview>` | `src/components/Image/ImagePreview.tsx` | Shared component showing original image with dimensions, file size, and format info. Used by most tools. |
| `<ImageDownloadButton>` | `src/components/Image/ImageDownloadButton.tsx` | Download button with `URL.createObjectURL` + body-append pattern for Safari compat. |
| `useImageCanvas()` | `src/hooks/useImageCanvas.ts` | Hook: load File → HTMLImageElement → draw to canvas → export Blob. Shared pipeline for all conversion/transform tools. |

---

## Wire-in Checklist (per tool)

For each tool, the implementing agent MUST:

1. **`src/utils/siteConfig.ts`** — add `'<slug>': '<Tool Name>'` to `STATIC_BREADCRUMB_LABELS`
2. **`src/data/masterItems.ts`** — add entry to `IMAGES` array with `type: 'image'` and `isNew: true`
3. **`src/pages/image/<slug>.tsx`** — page wrapper with SEO, ToolShell (`parent="image"`, `theme="sky"`), ToolSEOContent
4. **`src/components/Image/<PascalName>.tsx`** — interactive component (dynamic imported with `ssr: false`)
5. **Add reciprocal `relatedTools`** entries to ≥ 2 existing `/image/*` pages in the same intent cluster

---

## SEO Pattern (per tool)

- Title: `<Tool Name> — <Privacy Hook> | Toolisk` (≤ 60 chars)
- Description: ≤ 155 chars, imperative verb + "no upload" differentiator
- Keywords: include at least one privacy phrase (`no upload`, `online private`, `in browser`)
- JSON-LD: `BreadcrumbList` + `SoftwareApplication` (`UtilitiesApplication`) + `FAQPage`
- FAQ: 4 baseline privacy/size/offline/mobile FAQs + 2–4 tool-specific FAQs
- Educational body: 350–500 words with ≥ 1 concrete example, ≥ 1 "why no-upload matters" paragraph

---

## Bundle-size Discipline

- Never `import` heavy image libraries at module top level
- Always use `dynamic(() => import(...), { ssr: false })` for pages
- For `browser-image-compression`, `heic2any`, `@imgly/background-removal`, `pica`, `react-image-crop` — lazy-load only inside the action handler
- Verify per-route JS size after build — a simple tool (Rotate, Flip) should be < 80KB JS for the route shell

---

## Per-Tool Implementation Notes (for the next agent)

These are the 18 remaining tools (tools 1 and 2 are done). For each tool, the implementing agent should use `/new-image` skill and follow these specific notes.

### Tool #3: Convert to JPG

**Slug:** `convert-to-jpg` | **Icon:** 🖼️ | **PascalName:** `ConvertToJpg`
- **Component:** `src/components/Image/ConvertToJpg.tsx` | **Page:** `src/pages/image/convert-to-jpg.tsx`
- **Multi-file batch mode** — accept multiple images, convert all to JPG
- **Quality slider** (1–100, default 85) for JPEG quality control
- **State includes:** `files: File[]`, `quality`, `status`, `outputs: { name, blob, size }[]`, progress tracking (per-file)
- **Batch download:** "Download all as .zip" button using lazy-loaded `jszip`
- **HEIC detection:** If user drops a HEIC file, lazy-load `heic2any` (`npm install heic2any` first). Show "Loading HEIC support…" state during load.
- **Canvas pipeline:** `loadImage(file)` → `drawToCanvas(img)` → `canvasToBlob(canvas, 'image/jpeg', quality/100)`
- **Output filename:** Replace original extension with `.jpg` (e.g., `photo.png` → `photo.jpg`)
- **Install:** `npm install heic2any` (add as dependency)
- **Related tools:** compress-image, convert-to-png, convert-to-webp

### Tool #4: Convert to PNG

**Slug:** `convert-to-png` | **Icon:** 🖼️ | **PascalName:** `ConvertToPng`
- **Component:** `src/components/Image/ConvertToPng.tsx` | **Page:** `src/pages/image/convert-to-png.tsx`
- **Multi-file batch mode**, same structure as Convert to JPG
- **No quality slider** — PNG is lossless, so just convert
- **Transparency toggle:** When input is JPG (no alpha), offer "Transparent background" vs "White background" option
- **Canvas pipeline:** `loadImage(file)` → `drawToCanvas(img)` → `canvasToBlob(canvas, 'image/png')`
- **Output filename:** Replace extension with `.png`
- **Related tools:** compress-image, convert-to-jpg, convert-to-webp

### Tool #5: Convert to WebP

**Slug:** `convert-to-webp` | **Icon:** 🌐 | **PascalName:** `ConvertToWebp`
- **Component:** `src/components/Image/ConvertToWebp.tsx` | **Page:** `src/pages/image/convert-to-webp.tsx`
- **Multi-file batch mode** with quality slider (1–100, default 80)
- **Browser compatibility check:** Before processing, probe `canvas.toBlob(cb, 'image/webp')` — if it produces a WebP blob, the browser supports it. If not or if blob is empty, show: "Your browser doesn't support WebP encoding. Try Chrome, Edge, or Safari."
- **Savings display:** Show before/after sizes and savings percentage
- **Canvas pipeline:** `loadImage(file)` → `drawToCanvas(img)` → `canvasToBlob(canvas, 'image/webp', quality/100)`
- **Output filename:** Replace extension with `.webp`
- **Related tools:** compress-image, convert-to-jpg, convert-to-png

### Tool #6: HEIC to JPG

**Slug:** `heic-to-jpg` | **Icon:** 📱 | **PascalName:** `HeicToJpg`
- **Component:** `src/components/Image/HeicToJpg.tsx` | **Page:** `src/pages/image/heic-to-jpg.tsx`
- **Multi-file batch mode** with quality slider
- **Accept only `.heic,.heif`** — set `accept="image/heic,.heic,.heif"` on ImageDropzone
- **Lazy-load `heic2any`** only when a HEIC file is detected. Show "Converting HEIC…" progress state.
- **Mobile-optimized hero:** This page gets mobile-first traffic. Ensure hero, CTA, and touch targets are sized for 375px.
- **SEO targeting:** iPhone users searching "heic to jpg" on their phones. Keywords: "heic to jpg iphone", "convert heic no upload"
- **Install:** `npm install heic2any` (if not already)
- **Related tools:** convert-to-jpg, compress-image, convert-to-webp

### Tool #7: Convert to AVIF

**Slug:** `convert-to-avif` | **Icon:** ✨ | **PascalName:** `ConvertToAvif`
- **Component:** `src/components/Image/ConvertToAvif.tsx` | **Page:** `src/pages/image/convert-to-avif.tsx`
- **Multi-file batch mode** with quality slider (1–100, default 75)
- **Browser compatibility check:** Probe `canvas.toBlob(cb, 'image/avif')` — show error if unsupported
- **Canvas pipeline:** Same as WebP but with `'image/avif'` MIME type
- **SEO angle:** Cutting-edge format, 50% smaller than JPG. Target "convert to avif free"
- **Related tools:** convert-to-webp, compress-image, convert-to-jpg

### Tool #8: Crop Image

**Slug:** `crop-image` | **Icon:** ✂️ | **PascalName:** `CropImage`
- **Component:** `src/components/Image/CropImage.tsx` | **Page:** `src/pages/image/crop-image.tsx`
- **Single-file mode** — crop one image at a time
- **Lazy-load `react-image-crop`** only when the component mounts (`npm install react-image-crop`)
- **Preset ratios:** Free, 1:1, 16:9, 4:3, 9:16, plus social media presets (Instagram Post 4:5, Instagram Story 9:16, Facebook Cover 820×312, YouTube Thumbnail 1280×720)
- **Canvas pipeline:** After crop, use the crop coordinates to draw the selected region to a new canvas
- **Output format selector:** Original (default), JPEG, PNG, WebP
- **Related tools:** resize-image, rotate-image, compress-image

### Tool #9: Rotate Image

**Slug:** `rotate-image` | **Icon:** 🔄 | **PascalName:** `RotateImage`
- **Component:** `src/components/Image/RotateImage.tsx` | **Page:** `src/pages/image/rotate-image.tsx`
- **Single-file mode**
- **Pure Canvas API** — no external library needed
- **Controls:** 90° left, 90° right, 180° buttons + free-rotate slider (0–360°, step 1°)
- **Canvas pipeline:** Create canvas with swapped width/height for 90° rotations, draw rotated image
- **Live preview:** Show rotated preview using CSS transform on the image, then apply actual Canvas rotation on download
- **Related tools:** flip-image, crop-image, compress-image

### Tool #10: Flip Image

**Slug:** `flip-image` | **Icon:** ↔️ | **PascalName:** `FlipImage`
- **Component:** `src/components/Image/FlipImage.tsx` | **Page:** `src/pages/image/flip-image.tsx`
- **Single-file mode**
- **Pure Canvas API** — simplest tool, no external library
- **Controls:** Two buttons — "Flip Horizontal" and "Flip Vertical" + a "Reset" button
- **Canvas pipeline:** `ctx.scale(-1, 1)` for horizontal, `ctx.scale(1, -1)` for vertical, then draw
- **Live preview:** Show flipped preview immediately, download on button click
- **Related tools:** rotate-image, crop-image, compress-image

### Tool #11: Background Remover

**Slug:** `remove-background` | **Icon:** 🪄 | **PascalName:** `RemoveBackground`
- **Component:** `src/components/Image/RemoveBackground.tsx` | **Page:** `src/pages/image/remove-background.tsx`
- **Single-file mode**
- **Lazy-load `@imgly/background-removal`** ONLY when user clicks "Remove Background" — this is a ~20MB WASM model. **Never import at top level.**
- **Install:** `npm install @imgly/background-removal`
- **Progress UI:** Two-phase progress: "Downloading AI model… 12/20 MB" → "Processing image…"
- **Before/after slider:** Show original and result side-by-side with a draggable slider
- **Download as transparent PNG**
- **This is the MARQUEE tool** — design it like a hero product. Large before/after, prominent CTA, trust badge very visible.
- **SEO angle:** "remove background from image free no upload" (~500k/mo). Dedicated landing page quality.
- **Related tools:** compress-image, crop-image, convert-to-png

### Tool #12: Image Watermark

**Slug:** `image-watermark` | **Icon:** 💧 | **PascalName:** `ImageWatermark`
- **Component:** `src/components/Image/ImageWatermark.tsx` | **Page:** `src/pages/image/image-watermark.tsx`
- **Single-file mode**
- **Pure Canvas API**
- **Controls:** Text input OR image upload for watermark, opacity slider (0–100, default 30), position grid (9 positions: TL, TC, TR, ML, MC, MR, BL, BC, BR) OR "Tiled" (repeating), font size slider (8–72, default 24), text color picker
- **Canvas pipeline:** Draw original image → draw watermark text/image with opacity → export
- **Live preview:** Show preview with watermark overlay
- **Related tools:** compress-image, crop-image, round-image-corners

### Tool #13: Image Color Picker

**Slug:** `image-color-picker` | **Icon:** 🎨 | **PascalName:** `ImageColorPicker`
- **Component:** `src/components/Image/ImageColorPicker.tsx` | **Page:** `src/pages/image/image-color-picker.tsx`
- **Single-file mode**
- **Pure Canvas API** — no external library
- **Click-to-pick:** User clicks on image → show HEX, RGB, HSL values with CopyButton for each
- **Dominant palette:** Simple k-means (or simpler median-cut) on sampled pixels to extract top 5 colors, displayed as swatches with HEX values
- **Canvas pipeline:** Draw image to hidden canvas → read pixel data at click coordinates → convert to HEX/RGB/HSL
- **Related tools:** svg-to-png, favicon-generator, compress-image

### Tool #14: SVG to PNG

**Slug:** `svg-to-png` | **Icon:** 📐 | **PascalName:** `SvgToPng`
- **Component:** `src/components/Image/SvgToPng.tsx` | **Page:** `src/pages/image/svg-to-png.tsx`
- **Single-file mode** — accept only `.svg` files
- **Controls:** Width × Height inputs (default: original SVG dimensions), background toggle (transparent / white / custom color), scale selector (1×, 2×, 3×)
- **Canvas pipeline:** Create Image from SVG → draw to canvas at desired dimensions → `canvasToBlob(canvas, 'image/png')`
- **Install:** No extra packages needed (native SVG rendering)
- **Related tools:** favicon-generator, compress-image, convert-to-png

### Tool #15: Favicon Generator

**Slug:** `favicon-generator` | **Icon:** 🌐 | **PascalName:** `FaviconGenerator`
- **Component:** `src/components/Image/FaviconGenerator.tsx` | **Page:** `src/pages/image/favicon-generator.tsx`
- **Single-file mode**
- **Input:** Any image file → resize to all favicon sizes
- **Output:** ZIP containing: `favicon-16x16.png`, `favicon-32x32.png`, `favicon.ico` (16+32), `apple-touch-icon.png` (180×180), `android-chrome-192x192.png`, `android-chrome-512x512.png`, `site.webmanifest`
- **Canvas pipeline:** For each size, draw image scaled to NxN → export PNG. For ICO, combine 16×16 and 32×32 PNGs into ICO binary format.
- **Lazy-load `jszip`** for ZIP creation
- **SEO angle:** High-CPC "favicon generator" keyword, dev intent
- **Related tools:** svg-to-png, compress-image, convert-to-png

### Tool #16: EXIF Remover

**Slug:** `exif-remover` | **Icon:** 🔒 | **PascalName:** `ExifRemover`
- **Component:** `src/components/Image/ExifRemover.tsx` | **Page:** `src/pages/image/exif-remover.tsx`
- **Multi-file batch mode**
- **Pure Canvas API** — re-encoding the image strips all EXIF metadata
- **Show EXIF preview before:** Parse and display GPS coordinates, camera model, date taken, software (using basic EXIF parsing or just note "Contains metadata")
- **Canvas pipeline:** `loadImage(file)` (which uses `createImageBitmap` with `imageOrientation: 'from-image'` to auto-correct orientation) → draw to canvas → export as JPEG/PNG with no metadata
- **Results:** Show "Before: 3.2 MB with EXIF" → "After: 2.8 MB without EXIF" savings
- **Privacy angle:** This is the main selling point. "Strip GPS + camera metadata before sharing photos online"
- **Related tools:** compress-image, image-format-detector, convert-to-jpg

### Tool #17: Image Format Detector

**Slug:** `image-format-detector` | **Icon:** 🔍 | **PascalName:** `ImageFormatDetector`
- **Component:** `src/components/Image/ImageFormatDetector.tsx` | **Page:** `src/pages/image/image-format-detector.tsx`
- **Single-file mode**
- **No Canvas library needed** — read file magic bytes (first 8–16 bytes)
- **Display:** True format (from magic bytes), declared extension, MIME type, file size, image dimensions (from canvas), color depth info
- **Copy all info button** using CopyButton
- **Magic bytes detection:** PNG (89504E47), JPEG (FFD8FF), GIF (474946), WebP (52494646…57454250), BMP (424D), AVIF (000000…61766966), SVG (3C3F786D or 3C737667), ICO (00000100)
- **Related tools:** exif-remover, compress-image, image-format-detector

### Tool #18: Round Image Corners

**Slug:** `round-image-corners` | **Icon:** ⬛ | **PascalName:** `RoundImageCorners`
- **Component:** `src/components/Image/RoundImageCorners.tsx` | **Page:** `src/pages/image/round-image-corners.tsx`
- **Single-file mode**
- **Pure Canvas API** — use `ctx.clip()` with a rounded rectangle path
- **Controls:** Border radius slider (0–50%, default 20%), padding toggle (0–50px), background color (transparent / white / custom hex)
- **Canvas pipeline:** Create canvas with target dimensions → draw rounded rect clip path → draw image inside → export as PNG (always PNG to preserve transparency)
- **Live preview:** Show rounded preview in real-time as slider changes
- **Related tools:** compress-image, image-border, convert-to-png

### Tool #19: Image Border

**Slug:** `image-border` | **Icon:** 🖼️ | **PascalName:** `ImageBorder`
- **Component:** `src/components/Image/ImageBorder.tsx` | **Page:** `src/pages/image/image-border.tsx`
- **Single-file mode**
- **Pure Canvas API**
- **Controls:** Border width slider (1–100px, default 10), border color picker, border style (solid / double / gradient), padding (0–50px), background color for padding area
- **Canvas pipeline:** Create canvas sized = image + 2*(border+padding) → fill border area → draw centered image
- **Output format selector:** Original, JPEG, PNG
- **Related tools:** round-image-corners, compress-image, watermark

### Tool #20: Pixelate / Blur

**Slug:** `pixelate-image` | **Icon:** 🔲 | **PascalName:** `PixelateImage`
- **Component:** `src/components/Image/PixelateImage.tsx` | **Page:** `src/pages/image/pixelate-image.tsx`
- **Single-file mode**
- **Pure Canvas API** — no external library
- **Controls:** Mode toggle (Pixelate / Blur), intensity slider (1–50 for pixelation block size, 1–20 for blur radius), draw-to-select rectangle overlay
- **Canvas pipeline for pixelate:** Select region → scale down to small size → scale back up (nearest-neighbor) → paste region back
- **Canvas pipeline for blur:** Use `ctx.filter = 'blur(Npx)'` on selected region
- **Undo support:** Store original canvas state, allow undo
- **Privacy angle:** "Blur faces, license plates, or sensitive data before sharing photos"
- **Related tools:** exif-remover, compress-image, watermark