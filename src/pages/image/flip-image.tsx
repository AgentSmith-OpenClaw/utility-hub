import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const FlipImage = dynamic(() => import('../../components/Image/FlipImage'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading…</div>,
});

const SLUG = '/image/flip-image';

const FAQS = [
  { q: 'Is my image uploaded to a server?', a: 'No. The entire flip runs in your browser using the Canvas API. Your image never leaves your device, never touches our servers, and is never logged or stored anywhere.' },
  { q: 'What image formats are supported?', a: 'JPG, PNG, WebP, GIF, BMP, and AVIF. The tool auto-detects the format — just drop any image file. The output preserves your original format.' },
  { q: 'What is the maximum file size?', a: 'You can flip images up to 50 MB. Files over 25 MB will show a warning since processing may be slower on mobile devices due to memory limits per browser tab.' },
  { q: 'Will this work on mobile?', a: 'Yes, on modern mobile browsers (Chrome, Safari, Firefox). The flip is instantaneous for most images. Very large images (>25 MB) may take a moment on older phones due to canvas rendering.' },
  { q: 'What exactly does "flip" mean vs "rotate"?', a: 'Flipping creates a mirror image — horizontally (left ↔ right), vertically (top ↔ bottom), or both. Rotation turns the image by an angle (e.g. 90°, 180°). A horizontal flip is what you see in a mirror; a vertical flip turns the image upside-down. If you need rotation, use our Rotate Image tool.' },
  { q: 'Can I apply both horizontal and vertical flips at once?', a: 'Yes. Click both buttons and the image will be flipped in both directions. The live preview updates instantly so you can see the result. Clicking one button a second time toggles the flip off — both directions are cumulative.' },
  { q: 'Does flipping reduce image quality?', a: 'No — the effect is lossless. The pixel data is simply repositioned within the canvas at the same resolution. The output file is re-encoded from the canvas, so the quality stays identical to the original.' },
  { q: 'Why would I need to flip an image?', a: 'Common use cases: fixing a selfie that was captured mirrored, correcting a scanned document fed upside-down, preparing assets for print layouts that require mirrored duplicates, or simply creating a reflection effect for design work.' },
];

export default function FlipImagePage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Flip Image',
    slug: SLUG,
    description: 'Flip or mirror any image horizontally and vertically — one-click operation, 100% client-side, no upload, instant download.',
    category: 'UtilitiesApplication',
    featureList: 'Horizontal flip, Vertical flip, Live preview, Lossless quality, No upload, No sign-up, Privacy-first',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Flip Image — Mirror Horizontally or Vertically, No Upload | Toolisk</title>
        <meta name="description" content="Flip or mirror any image horizontally and vertically. One-click operation — 100% client-side, no upload, instant download. Free and private." />
        <meta name="keywords" content="flip image, mirror image, flip image no upload, mirror image online, flip image horizontally, flip image vertically, mirror image in browser, free flip image" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Flip Image | Toolisk" />
        <meta property="og:description" content="Flip or mirror any image horizontally and vertically in your browser. No upload, private, free." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="↔️"
        title="Flip Image"
        tagline="Flip or mirror any image horizontally and vertically right in your browser. One-click operation, instant preview, no upload ever."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <FlipImage />
      </ToolShell>

      <ToolSEOContent
        description="Flip any image in seconds — mirror horizontally, flip vertically, or do both at once. The live preview updates instantly, and the download is ready the moment you click. Everything runs client-side, so your photo never leaves your device."
        features={[
          '🔒 100% client-side — your image never leaves your browser',
          '↔️ Flip horizontally or vertically with one click',
          '🪞 Live CSS preview updates instantly as you flip',
          '📦 Output preserves the original format and quality',
          '🆓 Free forever, no sign-up, no watermark',
          '📱 Works on desktop and mobile browsers',
        ]}
        steps={[
          { title: 'Drop your image', desc: 'Drag and drop or click to browse. Supports JPG, PNG, WebP, GIF, BMP, and AVIF.' },
          { title: 'Click Flip Horizontal or Flip Vertical', desc: 'Press either button to mirror the image. The thumbnail updates instantly so you see the result.' },
          { title: 'Toggle as needed', desc: 'Apply both flips, undo either one, or click Reset to start over — the preview always keeps up.' },
          { title: 'Download', desc: 'When the preview looks right, click Download and save the flipped image in its original format.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why flipping images matters</h2>
            <p className="text-slate-600 leading-relaxed">
              Flipping is one of the simplest and most common image edits — yet most people reach for heavyweight software just to mirror a photo. Whether you are fixing a mirrored selfie, correcting the orientation of a scanned document, or creating a reflection effect for a design layout, this tool does it in one click with zero learning curve.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a concrete example: a 4032 × 3024 selfie from an iPhone (roughly 2.8 MB JPEG) that was captured mirrored can be flipped horizontally back to normal. The output is a 4032 × 3024 JPEG at the same quality — the pixels are simply rearranged. No recompression, no quality loss, no dimension change. The entire operation completes in under 200 milliseconds on a desktop browser.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">How the Canvas API flips work</h3>
            <p className="text-slate-600 leading-relaxed">
              The tool uses the browser&apos;s native Canvas API to mirror pixel data. For a horizontal flip, the canvas transform is set to <code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">ctx.scale(-1, 1)</code>, which mirrors the X axis. For a vertical flip, <code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">ctx.scale(1, -1)</code> mirrors the Y axis. When both are applied together, the result is equivalent to a 180° rotation — every pixel maps to its opposite corner. Because the operation only rearranges existing pixels without interpolation or blending, the output is mathematically lossless aside from the canvas re-encoding step.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Flip vs rotate — know the difference</h3>
            <p className="text-slate-600 leading-relaxed">
              A horizontal flip mirrors the image left-to-right, as if you held it up to a mirror. A vertical flip mirrors it top-to-bottom, turning it upside-down. A rotation turns the image around its center by a given angle. Flipping a portrait photo horizontally is how you correct a mirrored selfie; rotating it 180° is how you fix a photo that was taken upside-down. These are distinct transforms, and this tool focuses on the former. For rotation, we have a dedicated Rotate Image tool.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no-upload matters</h3>
            <p className="text-slate-600 leading-relaxed">
              Photos are among the most personal files on any device. They can contain faces, home interiors, ID documents, private screenshots of messages, or medical images. Upload-based flip tools send your original file to a remote server for processing — and you have no way to verify it was deleted afterward. This tool runs entirely inside your browser&apos;s JavaScript runtime. The canvas operations execute locally, the output Blob is created in-memory, and the download streams directly from your tab to your filesystem. Zero bytes of your image leave your device at any point.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">Feature</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">This tool</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">Upload-based tools</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Privacy</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">100% client-side</td>
                    <td className="px-4 py-2.5 text-slate-500">Images sent to a server</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Speed</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Instant (no upload)</td>
                    <td className="px-4 py-2.5 text-slate-500">Upload + process + download</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Quality</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Lossless pixel repositioning</td>
                    <td className="px-4 py-2.5 text-slate-500">Varies; often recompresses</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-slate-700">Data retention risk</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">None</td>
                    <td className="px-4 py-2.5 text-slate-500">Server logs, CDN caches</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        }
        relatedTools={[
          { name: 'Image Compressor', href: '/image/compress-image', icon: '🗜️' },
          { name: 'Image Resizer', href: '/image/resize-image', icon: '📐' },
          { name: 'HEIC to JPG', href: '/image/heic-to-jpg', icon: '📱' },
        ]}
      />
    </>
  );
}
