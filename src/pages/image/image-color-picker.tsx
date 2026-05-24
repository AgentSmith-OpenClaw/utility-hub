import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const ImageColorPicker = dynamic(() => import('../../components/Image/ImageColorPicker'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading…</div>,
});

const SLUG = '/image/image-color-picker';

const FAQS = [
  { q: 'Is my image uploaded to a server?', a: 'No. The entire color picker runs in your browser using JavaScript and the Canvas API. Your image never leaves your device, never touches our servers, and is never logged or stored anywhere.' },
  { q: 'What image formats are supported?', a: 'JPG, PNG, WebP, AVIF, GIF, BMP, and HEIC. The tool auto-detects the format — just drop any image file.' },
  { q: 'What is the maximum file size?', a: 'You can pick colors from images up to ~50 MB. Files over 25 MB will show a warning since the canvas rendering may be slower on mobile devices.' },
  { q: 'Does this work on mobile?', a: 'Yes, on modern iOS Safari and Chrome for Android. Touch the image to pick a color at the tap location. Very large images (>25 MB) may load more slowly on older devices due to memory constraints.' },
  { q: 'How accurate is the color picker?', a: 'Pixel-perfect. The tool reads the exact RGB value from the canvas buffer at the clicked pixel location — not an approximation. The HEX, RGB, and HSL values you see are directly derived from that single pixel.' },
  { q: 'What is the difference between HEX, RGB, and HSL?', a: 'HEX is a compact six-character string (#RRGGBB) — the standard for web colors in CSS. RGB spells out each channel as a number (0–255) — useful for JavaScript and image editing. HSL uses hue (0–360), saturation, and lightness — the most human-friendly format for adjusting colors intuitively. All three represent the same color, just in different notations.' },
  { q: 'How does the palette extraction work?', a: 'The tool samples pixels at a regular grid across the image, then quantizes colors into 32-level buckets (each R, G, B channel is rounded to the nearest multiple of 32). The 5 most frequent color buckets are returned as your dominant palette. This gives a quick, representative snapshot of the image\'s main colors without deep analysis.' },
  { q: 'Can I use the picked colors in my design tool?', a: 'Yes. Every color value is displayed with a Copy button — click to copy the HEX, RGB, or HSL string directly to your clipboard. Paste it straight into Figma, Sketch, CSS, or any design or development tool that accepts color values.' },
];

export default function ImageColorPickerPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Image Color Picker',
    slug: SLUG,
    description: 'Pick and extract HEX, RGB, and HSL colors from any image — 100% client-side. Click any pixel or extract dominant palette colors. No upload, no sign-up.',
    category: 'UtilitiesApplication',
    featureList: 'Pixel color picker, HEX RGB HSL output, Color palette extraction, Click-to-copy, No upload, No sign-up, Privacy-first',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Image Color Picker — Extract HEX, RGB, HSL from Any Image | Toolisk</title>
        <meta name="description" content="Pick any pixel from an image and get its exact HEX, RGB, and HSL color code. Extract dominant palette colors — 100% in your browser, no upload, no sign-up." />
        <meta name="keywords" content="image color picker, pick color from image, extract color from photo, image palette generator, color picker no upload, color picker online private, hex from image, rgb from image, hsl from image" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Image Color Picker | Toolisk" />
        <meta property="og:description" content="Pick any pixel from an image and get its exact HEX, RGB, and HSL color code. 100% in your browser, no upload." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="🎨"
        title="Image Color Picker"
        tagline="Click any pixel to get its HEX, RGB, and HSL color code — plus extract dominant palette colors. 100% client-side, no upload."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <ImageColorPicker />
      </ToolShell>

      <ToolSEOContent
        description="A simple, precise color picker that works on any image you drop. Click a pixel to get its exact HEX, RGB, and HSL values with one-click copy. Extract a five-color dominant palette from any photo. Everything runs client-side — your images stay on your device, and your color choices stay private."
        features={[
          '\uD83D\uDD12 100% client-side — your image never leaves your browser',
          '\uD83C\uDFA8 Pixel-perfect color picking — click any point on the image',
          '\uD83D\uDCCB Copy HEX, RGB, and HSL values instantly with one click',
          '\uD83C\uDF1F Extract dominant 5-color palette from any photo',
          '\uD83D\uDCF1 Works on desktop and mobile — tap to pick',
          '\uD83D\uDDD2\uFE0F No sign-up, no watermark, no tracking',
        ]}
        steps={[
          { title: 'Drop your image', desc: 'Drag an image into the upload area, paste from clipboard, or click to browse your files.' },
          { title: 'Click to pick a color', desc: 'Click or tap any pixel on the displayed image. The exact HEX, RGB, and HSL values appear instantly.' },
          { title: 'Copy color values', desc: 'Use the Copy button next to each format (HEX, RGB, HSL) to grab the value you need for your project.' },
          { title: 'Extract palette', desc: 'Click "Extract Dominant Colors" to get the 5 most frequent colors in the image — useful for branding and mood boards.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why you need an image color picker</h2>
            <p className="text-slate-600 leading-relaxed">
              Color is the foundation of visual design. Whether you are building a website, designing a brand identity, or creating social media graphics, getting the exact color from a reference image saves time and avoids guesswork. An image color picker bridges the gap between inspiration and execution — you see a color you love in a photo, click it, and you have the precise HEX code ready for your CSS, the RGB for your graphics editor, or the HSL to tweak the tint. No more squinting at a screenshot trying to match colors by eye.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a concrete example: a designer working on a landing page sees a sunset photo with the perfect warm orange for their CTA button. With this tool, they drop the photo, click the orange sky pixel, and get <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">#E87A3A</code> — ready to paste directly into their CSS. The palette extractor then reveals the complementary navy blue and cream tones, giving them a complete 5-color scheme in seconds. What would have taken 15 minutes of manual sampling in Photoshop happens in under 30 seconds.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">HEX, RGB, and HSL — which one to use when</h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>HEX</strong> (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">#3B82F6</code>) is the universal web standard. It is compact, works in every CSS property, and is the format most design handoff tools default to. Use HEX for CSS, SVG, and any web-facing style.<br /><br />
              <strong>RGB</strong> (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">rgb(59, 130, 246)</code>) spells out each channel as a number between 0 and 255. It is the format used by most image editors (Photoshop, GIMP) and JavaScript canvas operations. Use RGB when you need to pass colors to code or want per-channel visibility.<br /><br />
              <strong>HSL</strong> (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">hsl(217, 91%, 60%)</code>) separates the hue (the actual color on the wheel) from saturation and lightness. This makes it the best format for human reasoning — want the same color but darker? Lower the lightness. Need a complementary accent? Rotate the hue by 180°. HSL is ideal for programmatic color systems, theme generation, and when you want to understand why a color looks the way it does.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">How palette extraction works</h3>
            <p className="text-slate-600 leading-relaxed">
              Behind the one-click palette button is a color quantization algorithm. The tool samples several thousand pixels evenly spaced across the image, then maps each pixel&apos;s RGB value into a 32-level bucket (so colors like <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">rgb(240, 128, 64)</code> and <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">rgb(248, 125, 70)</code> land in the same bucket). The five most crowded buckets become your palette. This approach is intentionally simple — it gives you the genuinely dominant visual colors rather than splitting hairs over barely-different shades. For quick brand extraction from a photo or mood board, it is surprisingly effective.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no-upload matters</h3>
            <p className="text-slate-600 leading-relaxed">
              Most "free" color picker tools require you to upload your image to a server first. That means your photo — possibly containing personal moments, client work under NDA, unreleased product shots, or private designs — sits on someone else&apos;s infrastructure. You have no control, no audit trail, and no delete guarantee. This tool does all the work in the JavaScript runtime of your browser tab. The image is loaded onto a local HTML canvas; pixel data is read directly from that canvas; nothing — not the image file, not the pixel values, not the extracted palette — ever leaves your device. The color picker works offline once the page is loaded, and your visual assets stay private.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Uploading your image vs using this tool</h3>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-2.5 text-slate-700 font-semibold">Feature</th>
                    <th className="text-left px-4 py-2.5 text-slate-700 font-semibold">Upload-based service</th>
                    <th className="text-left px-4 py-2.5 text-sky-700 font-semibold bg-sky-50/60">This tool</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-200">
                    <td className="px-4 py-2.5 text-slate-600">Privacy</td>
                    <td className="px-4 py-2.5 text-slate-500">Image is stored on third-party server</td>
                    <td className="px-4 py-2.5 text-sky-700 bg-sky-50/30 font-medium">Image stays on your device</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="px-4 py-2.5 text-slate-600">Speed</td>
                    <td className="px-4 py-2.5 text-slate-500">Depends on upload bandwidth and queue</td>
                    <td className="px-4 py-2.5 text-sky-700 bg-sky-50/30 font-medium">Instant — no network transfer</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="px-4 py-2.5 text-slate-600">Sign-up</td>
                    <td className="px-4 py-2.5 text-slate-500">Often requires account for larger files</td>
                    <td className="px-4 py-2.5 text-sky-700 bg-sky-50/30 font-medium">No sign-up, no limits</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="px-4 py-2.5 text-slate-600">Watermarks</td>
                    <td className="px-4 py-2.5 text-slate-500">Common in "free" tiers</td>
                    <td className="px-4 py-2.5 text-sky-700 bg-sky-50/30 font-medium">Never — always watermark-free</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        }
        relatedTools={[
          { name: 'Image Compressor', href: '/image/compress-image', icon: '\uD83D\uDDDC\uFE0F' },
          { name: 'Image Resizer', href: '/image/resize-image', icon: '\uD83D\uDCD0' },
          { name: 'Convert to JPG', href: '/image/convert-to-jpg', icon: '\uD83D\uDDBC\uFE0F' },
        ]}
      />
    </>
  );
}
