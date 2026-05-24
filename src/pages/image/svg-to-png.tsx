import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SvgToPng = dynamic(() => import('../../components/Image/SvgToPng'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading…</div>,
});

const SLUG = '/image/svg-to-png';

const FAQS = [
  { q: 'Is my SVG uploaded to a server?', a: 'No. The entire conversion runs in your browser using JavaScript. Your SVG files never leave your device, never touch our servers, and are never logged or stored anywhere.' },
  { q: 'What resolution can I convert to?', a: 'Any resolution you choose. Set pixel dimensions directly or use 1× / 2× / 3× / 4× scale presets to multiply the original SVG viewBox dimensions. There is no upper limit — the only constraint is your browser\'s available memory.' },
  { q: 'What is the maximum file size?', a: 'You can convert SVG files up to 50 MB. Very large SVGs (>25 MB) may render slowly on mobile devices due to per-tab memory limits and DOM parsing overhead.' },
  { q: 'Does this work on mobile?', a: 'Yes, on modern mobile browsers (Chrome, Safari, Firefox). Very large SVGs may be slower on phones due to memory constraints per browser tab.' },
  { q: 'Why convert SVG to PNG?', a: 'SVG (Scalable Vector Graphics) is an XML-based vector format — it scales infinitely and stays sharp at any resolution. But many platforms (social media, email clients, CMS uploaders, document tools) don\'t support SVG. Converting to PNG gives you a universally-compatible raster image at exactly the resolution you need, while the original SVG stays editable for future changes.' },
  { q: 'Is PNG output always transparent by default?', a: 'Yes — the default mode renders your SVG with a transparent background so logos, icons, and graphics with no explicit background save with an alpha channel. Toggle "White" or "Custom" to fill the canvas with a solid color before rendering.' },
  { q: 'Can I scale up an SVG without losing quality?', a: 'Yes — that is the defining advantage of vector graphics. Because SVG is resolution-independent, you can render it at 4× or even 10× its original viewBox size without any pixelation or blur. The output PNG will be crisp at the target resolution, limited only by the canvas pixel dimensions you set.' },
  { q: 'What happens if my SVG has embedded fonts or images?', a: 'The conversion uses the browser\'s built-in SVG renderer, so system fonts and linked images will render correctly as long as they are available in the browser context. External resources loaded over HTTP may fail if the SVG references absolute URLs — inline or data-URI resources render reliably.' },
];

export default function SvgToPngPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'SVG to PNG',
    slug: SLUG,
    description: 'Convert SVG to PNG at any resolution with custom dimensions and background color. 100% client-side, no upload, no sign-up.',
    category: 'UtilitiesApplication',
    featureList: 'SVG to PNG conversion, Custom dimensions, Scale presets 1x-4x, Lock aspect ratio, Transparent or custom background, No upload, No sign-up, Privacy-first',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>SVG to PNG — Convert at Any Resolution, No Upload | Toolisk</title>
        <meta name="description" content="Convert SVG to PNG at any pixel dimensions with custom background color. Scale up without quality loss — 100% client-side, no upload, private." />
        <meta name="keywords" content="svg to png, convert svg to png, svg to png converter, svg to png no upload, svg to png online private, svg to png free, vector to raster, svg render" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="SVG to PNG — Convert at Any Resolution, No Upload | Toolisk" />
        <meta property="og:description" content="Convert SVG to PNG at any pixel dimensions with custom background color. Scale up without quality loss — 100% client-side, no upload." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="📐"
        title="SVG to PNG"
        tagline="Convert SVG to high-resolution PNG at any dimensions. Scale up to 4× without quality loss — 100% client-side, no upload."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <SvgToPng />
      </ToolShell>

      <ToolSEOContent
        description="Convert SVG vector graphics to PNG raster images right in your browser. Pick any pixel dimensions, lock the aspect ratio, scale up 2×, 3×, or 4× for high-DPI output, and choose a transparent, white, or custom color background. Everything runs client-side using Canvas APIs — your SVG files never leave your device."
        features={[
          '🔒 100% client-side — your SVG never leaves your browser',
          '📐 Custom pixel dimensions with aspect ratio lock',
          '🔢 Scale presets: 1×, 2×, 3×, 4× for high-DPI output',
          '🎨 Transparent, white, or custom background color',
          '🔄 Infinite scalability — vectors render crisp at any resolution',
          '🆓 Free forever, no sign-up, no watermark',
        ]}
        steps={[
          { title: 'Upload your SVG', desc: 'Drag and drop an SVG file into the upload area, or click to browse. SVG files are read as text and parsed for viewBox dimensions.' },
          { title: 'Set output size', desc: 'Enter pixel width and height, or use the 1×/2×/3×/4× scale buttons to multiply the original SVG dimensions. Lock aspect ratio is on by default.' },
          { title: 'Choose background', desc: 'Pick Transparent (preserves alpha channel), White, or a custom color using the color picker to fill the canvas before rendering.' },
          { title: 'Convert and download', desc: 'Click "Convert to PNG" — the SVG is rendered in a Canvas at your target resolution and exported as a PNG blob. Rename the file and download instantly.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">SVG to PNG: vector fidelity, pixel delivery</h2>
            <p className="text-slate-600 leading-relaxed">
              SVG (Scalable Vector Graphics) is the ideal format for design work — it stores shapes, paths, and text as mathematical descriptions rather than a grid of pixels. This means an SVG logo designed at 100×100 pixels can be rendered perfectly at 4000×4000 without a single jagged edge. But the real world runs on raster: social media posts, email signatures, CMS thumbnail uploads, presentation slides, and print layouts all expect PNG or JPG. Converting SVG to PNG bridges that gap, letting you author in vector and deliver in pixel form at exactly the resolution your destination demands.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a concrete example: a 24 KB SVG icon with a 512×512 viewBox, rendered at 1× through this tool, produces a 512×512 PNG around 15–40 KB depending on complexity. Rendering the same icon at 4× (2048×2048) produces a high-DPI asset suitable for Retina displays and print — no re-export from Illustrator or Figma required. The file size scales predictably with the pixel area, so you can dial resolution up or down based on your use case, all without touching the original vector source.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">How the conversion works</h3>
            <p className="text-slate-600 leading-relaxed">
              The tool reads your SVG as plain text, parses the viewBox attribute to determine the original coordinate space, and renders it into an HTML5 Canvas element using the browser&apos;s native SVG renderer — the same rendering engine that displays SVGs inline on any web page. The canvas is sized to your target width and height in pixels. If you choose a non-transparent background, a solid fill is applied before the SVG is drawn. Finally, the canvas is exported as a PNG blob via <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm text-slate-700">canvas.toBlob(&apos;image/png&apos;)</code>. Every step runs inside your browser tab using standard Web APIs — no libraries, no servers, no uploads.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Scaling and high-DPI output</h3>
            <p className="text-slate-600 leading-relaxed">
              The 1× / 2× / 3× / 4× scale buttons multiply your SVG&apos;s original viewBox dimensions by the chosen factor. For a 512×512 SVG: 1× produces a 512×512 PNG, 2× produces 1024×1024, 3× = 1536×1536, and 4× = 2048×2048. On Retina/HiDPI screens, a 2× or 3× PNG displayed at its logical size looks dramatically sharper than a 1× asset. Android app icons commonly need 4× variants (xxxhdpi). The tool lets you set any custom dimension in pixels too — uncheck the lock ratio to stretch or squash the output as needed.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no-upload matters for SVG conversion</h3>
            <p className="text-slate-600 leading-relaxed">
              SVGs are not just pictures — they are structured documents. A company logo SVG may contain layered shapes, brand color hex codes, and text elements that reveal design decisions and embedded metadata. An architectural or engineering SVG may include floor plans, measurements, and proprietary annotations. Uploading these files to a remote converter gives a third party the full source document, not just its visual output. This tool reads the SVG text, renders it, and hands you a flat PNG — none of the source structure, metadata, or design information ever leaves your machine. The conversion happens in the same browser context that renders the page you&apos;re reading.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Convert to PNG', href: '/image/convert-to-png', icon: '🖼️' },
          { name: 'Image Resizer', href: '/image/resize-image', icon: '📐' },
          { name: 'Image Compressor', href: '/image/compress-image', icon: '🗜️' },
        ]}
      />
    </>
  );
}
