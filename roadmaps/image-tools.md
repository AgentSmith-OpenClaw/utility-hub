# Image Tools — Roadmap

New `/image` section. All tools run **100% client-side** — files never leave the browser. Same differentiation as PDF: tinypng, iloveimg, and most competitors upload to servers. "No upload, private, instant" is the wedge.

**Core APIs/libs:** native `Canvas` API (most conversions/resizes), `browser-image-compression` (smart compress), `heic2any` (HEIC), `@imgly/background-removal` (WASM bg remover), `pica` (high-quality resize). Lazy-load per tool.

## Tier 1 — Hero pages, massive volume

- **Image Compressor** — Drop image(s), quality slider, before/after size. ~2M/mo search volume globally for compress variants. `browser-image-compression`.
- **Image Resizer** — Pixel or percentage, lock aspect ratio, batch. `pica` for high-quality downscale.
- **Convert to JPG** — Any format (PNG, WebP, HEIC, AVIF, GIF, BMP) → JPG with quality control. Canvas.
- **Convert to PNG** — Same, with transparency preserved. Canvas.
- **Convert to WebP** — Modern format, ~30% smaller than JPG. Canvas with `image/webp`.
- **HEIC to JPG** — iPhone photos. Massive volume — every iPhone user hits this monthly. `heic2any`.
- **Image to PDF** — *(Already in PDF roadmap as JPG→PDF; cross-list here too.)*
- **Crop Image** — Free-form, fixed ratios (1:1, 16:9, 4:3, 9:16), preset sizes (Instagram, FB cover, YouTube thumb). `react-image-crop`.
- **Rotate Image** — 90/180/270 + free-rotate slider. Canvas.
- **Flip Image** — Horizontal / vertical. Canvas (trivial).

## Tier 2 — Strong intent, polish opportunities

- **Background Remover** — `@imgly/background-removal` runs in browser via WASM (~20MB model, lazy-loaded with progress UI). One of the highest-CTR features anywhere right now. **Worth a dedicated landing page.**
- **Image Color Picker** — Click pixel, get hex/rgb/hsl. Bonus: extract dominant palette. Canvas + clustering.
- **Image to Base64** — Encode + copy data URI. Trivial, ranks well for "image to base64".
- **Base64 to Image** — Decode + download. Pairs with above.
- **SVG to PNG** — Render SVG to canvas at chosen resolution, export PNG. Trivial, high-intent (designers).
- **SVG to JPG** — Same as above.
- **PNG to ICO / Favicon Generator** — Multi-size ICO (16, 32, 48, 64), full favicon pack (apple-touch, manifest, etc). High-CPC ("favicon generator" ranks for dev intent).
- **Image Watermark** — Text or image overlay, opacity, position, batch. Canvas.
- **Convert to AVIF** — Cutting-edge, ~50% smaller than JPG. Canvas `image/avif` (Chrome/Safari support).
- **GIF to MP4 / MP4 to GIF** — Worth investigating `ffmpeg.wasm` (~25MB). Powerful but heavy — bundle carefully.
- **Image Format Detector** — Drop file, show format / dimensions / color depth / EXIF. Cheap, useful.

## Tier 3 — Specialist, lower volume

- **EXIF Viewer / Remover** — Privacy angle: strip GPS + camera metadata before sharing. `exifr`.
- **Image Histogram** — RGB channel distribution. Photographer/designer intent.
- **Pixelate / Blur Tool** — Selective blur (faces, license plates). Canvas + mouse drag.
- **Image Filter (CSS-style)** — Grayscale, sepia, vintage, contrast, brightness. Live preview. Canvas filters.
- **Tile / Pattern Repeat** — Make repeating background patterns. Canvas.
- **Image Border / Frame** — Add solid or gradient borders. Canvas.
- **Round Image Corners** — Add radius, transparent PNG output. Canvas + clip.
- **Image to ASCII Art** — Fun/viral. Pure canvas + character mapping.
- **Image Splitter (for Instagram grid)** — Slice into N×N tiles. Trendy social use case.
- **Spritesheet Generator** — Pack multiple images into one sheet + JSON map. Game dev niche, high intent.
- **Image Diff / Compare** — Side-by-side or overlay. `pixelmatch`.
- **Photo Collage Maker** — Grid layouts, drag images in. Higher complexity, big volume.

## Avoid (or hard later)

- **AI Upscaler (Real-ESRGAN, etc)** — Possible with ONNX runtime in-browser but 100MB+ models. Skip until WebGPU is more universal.
- **AI Style Transfer** — Same problem. Skip.
- **OCR from image** — Tesseract.js works, ~10MB; do it eventually for "image to text".
- **RAW (.CR2/.NEF) conversion** — Limited browser support, niche audience. Skip.
- **Photoshop-grade editor** — Out of scope. Don't compete with Photopea.

## Build sequencing (30-day pack)

1. **Week 1 — Foundation 4:** Compressor, Resizer, Convert to JPG, Convert to PNG. Establishes the `/image` route, shared dropzone, shared canvas pipeline.
2. **Week 2 — Conversion + mobile 4:** HEIC to JPG, Convert to WebP, Crop, Rotate. Mobile-first traffic — these are searched on phones.
3. **Week 3 — Designer toolkit 4:** Background Remover (the marquee feature), Color Picker, SVG to PNG, Favicon Generator. Each gets a polished landing page.
4. **Week 4 — Utility 4:** Image to Base64, Base64 to Image, EXIF Remover, Watermark.

That's 16 tools in 30 days. Background Remover alone justifies a dedicated push.

## Shared infrastructure to build once

- **`<ImageDropzone>`** — Drag/drop, paste-from-clipboard, multi-file, preview. Should accept folder drops.
- **`<CanvasProcessor>`** — Wraps the load → process → export pipeline. Most tools are 5 lines on top of this.
- **`useImageWorker()` hook** — Off-main-thread processing via Web Worker for heavy ops (compress, bg remove). Keeps UI responsive.
- **Batch processor** — Queue + per-file progress + zip output. Reused by Compress, Resize, Convert, Watermark.
- **Before/after slider** — Reused by Compress, Bg Remove, Filter, Upscaler-if-ever.
- **"Private — runs in your browser" badge** — Consistent placement on every tool.

## SEO leverage notes

- "**Free** [tool] **online no upload**" + "**private** [tool]" is the wedge — tinypng/iloveimg upload, so we win this sub-keyword cluster.
- HEIC to JPG specifically is high-intent and mobile-dominant — needs mobile-optimized landing with iPhone screenshots.
- Background Remover is the marquee tool — design it like a hero product (slow load is fine if UX is great), capture "remove background from image" (~500k/mo).
- Favicon Generator should output a *complete* pack (sizes + manifest.json + HTML snippet) to beat thin competitors.
- Cross-link Convert-to-X family: one user often wants 2–3 of these in a session.
- Image tools convert well to AdSense and to affiliate (Canva, Adobe) — keep an eye on placement.

## Tradeoffs to flag in UX

- **File size ceiling:** 4K+ photos eat memory fast on mobile. Warn at 25MB, hard-cap at 50MB.
- **iOS Safari memory:** Test on iPhone — same warning as PDF.
- **Bundle weight discipline:** Background Remover (~20MB WASM model) and ffmpeg.wasm (~25MB) MUST be lazy-loaded only when the user clicks "start" — never on route navigation.
- **Quality expectations:** Set expectations clearly — "compressed 60%" is more honest than "smart AI compression". Don't oversell.
