import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import {
  generateBreadcrumbs,
  generateFaqSchema,
  generateSoftwareAppSchema,
  SITE_URL,
} from '../../utils/siteConfig';

const ConvertToAvif = dynamic(() => import('../../components/Image/ConvertToAvif'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading…</div>,
});

const SLUG = '/image/convert-to-avif';

const FAQS = [
  {
    q: 'Is my image uploaded to a server?',
    a: 'No. The entire conversion runs in your browser using JavaScript and the Canvas API. Your images never leave your device, never touch our servers, and are never logged or stored anywhere.',
  },
  {
    q: 'What image formats are supported as input?',
    a: 'JPG, PNG, WebP, GIF, BMP, and AVIF files can all be converted to AVIF. The tool uses the browser\'s built-in image decoder, so any format your browser can display can be converted.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'You can convert images up to 50 MB each. Files over 25 MB will show a warning since processing may be slower on mobile devices.',
  },
  {
    q: 'Will this work on mobile?',
    a: 'Yes, on modern mobile Chrome, Edge, and Opera. Safari and Firefox on iOS and Android do not yet support AVIF encoding. The tool checks your browser before processing and warns you if encoding is unavailable.',
  },
  {
    q: 'What browsers support AVIF encoding?',
    a: 'Currently, AVIF encoding (creating AVIF files) is supported in Chrome, Edge, and Opera — both on desktop and Android. Safari and Firefox can display AVIF images but cannot yet encode them. If your browser does not support AVIF encoding, the tool will show a helpful message and suggest converting to WebP instead.',
  },
  {
    q: 'How much smaller is AVIF compared to JPG?',
    a: 'AVIF is typically 50% smaller than an equivalent-quality JPG. At the same file size, AVIF preserves significantly more detail and fewer artifacts. For example, a 3 MB JPG converted at 75% quality often becomes 400–600 KB as AVIF with no visible quality loss.',
  },
  {
    q: 'AVIF vs WebP — which should I choose?',
    a: 'AVIF is more efficient than WebP for most photos and can be 20–30% smaller than WebP at equivalent quality. It also supports HDR, wide color gamut, and lossless mode. WebP is more widely supported across all browsers for encoding (Safari, Firefox, Chrome). If you need maximum browser reach, WebP may be the safer choice. If you want smallest file size and your audience uses Chrome or modern browsers, AVIF wins.',
  },
  {
    q: 'What does the quality slider control?',
    a: 'AVIF quality ranges from 1 (smallest file, lowest quality) to 100 (largest file, highest quality). Unlike JPG, AVIF at 30–40% quality is still usable — it is far more efficient at low bitrates. The presets help: Low (30%) for thumbnails, Medium (55%) for web use, and High (75%) for archival-quality images.',
  },
];

export default function ConvertToAvifPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Convert to AVIF',
    slug: SLUG,
    description: 'Convert JPG, PNG, WebP, and other images to next-gen AVIF format — 50% smaller files, same quality. 100% client-side, no upload.',
    category: 'UtilitiesApplication',
    featureList: 'JPEG PNG WebP to AVIF conversion, Quality slider, Browser support check, Batch processing, ZIP download, No upload, Privacy-first',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Convert to AVIF — Next-Gen Format, 50% Smaller, No Upload | Toolisk</title>
        <meta name="description" content="Convert any image to AVIF in your browser. Next-gen format saves 50% vs JPG with same quality. Quality slider, browser check — 100% private, no upload." />
        <meta name="keywords" content="convert to avif, avif converter, jpg to avif, png to avif, convert image to avif no upload, avif converter online private, next gen image format, webp alternative" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Convert to AVIF | Toolisk" />
        <meta property="og:description" content="Convert images to next-gen AVIF format in your browser. 50% smaller than JPG, no upload, private and free." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]),
          }}
        />
      </Head>

      <ToolShell
        icon="✨"
        title="Convert to AVIF"
        tagline="Convert any image to next-gen AVIF format in your browser — 50% smaller than JPG, same visual quality. Quality slider, batch processing, browser check. No upload, 100% private."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <ConvertToAvif />
      </ToolShell>

      <ToolSEOContent
        description="Convert JPEG, PNG, WebP, GIF, and BMP images to the next-generation AVIF format — entirely in your browser. Dial in quality with presets, batch-convert multiple files, and download results as a ZIP. AVIF files are up to 50% smaller than equivalent-quality JPEGs and 20–30% smaller than WebP, making them the most efficient modern image format."
        features={[
          '🔒 100% client-side — your images never leave your browser',
          '✨ Convert to AVIF — 50% smaller than JPG at same quality',
          '🎚️ Quality slider with Low (30%), Medium (55%), High (75%) presets',
          '🛡️ Automatic browser check — warns on Safari/Firefox',
          '📦 Batch convert multiple files and download as ZIP',
          '🆓 Free forever, no sign-up, no watermark',
        ]}
        steps={[
          { title: 'Drop your images', desc: 'Drag and drop JPG, PNG, WebP, GIF, or BMP images into the upload area, or click to browse.' },
          { title: 'Choose quality', desc: 'Use the slider to set AVIF quality (1–100%), or pick a preset: Low (30%), Medium (55%), or High (75%).' },
          { title: 'Convert', desc: 'Click "Convert to AVIF" — each file is encoded client-side using the Canvas API. The tool checks browser support first.' },
          { title: 'Download results', desc: 'See before/after file sizes and savings. Download each AVIF individually or grab everything as a .zip.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">What is AVIF and why does it matter?</h2>
            <p className="text-slate-600 leading-relaxed">
              AVIF (AV1 Image File Format) is the next-generation image format built on the AV1 video codec. Released in 2019 and now supported by all major browsers for display, AVIF offers dramatically better compression than JPEG, PNG, and even WebP. A typical smartphone photo at 3–6 MB as a JPEG can be stored at 400–800 KB as an AVIF — with no visible quality difference. For websites, CDNs, and apps, this means faster page loads, lower bandwidth costs, and happier users on slow connections.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The numbers tell the story: in Netflix&apos;s 2020 study comparing image codecs, AVIF outperformed JPEG by 50% at equivalent DSSIM scores, and beat WebP by 20–30%. AVIF also supports features JPEG cannot touch — HDR, wide color gamut, lossless mode, and alpha transparency. For e-commerce product images, photography portfolios, and any web asset where quality matters, AVIF is the modern default.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Where AVIF encoding works — and where it doesn&apos;t</h3>
            <p className="text-slate-600 leading-relaxed">
              All modern browsers (Chrome 85+, Firefox 93+, Safari 16.4+, Edge 121+) can <em>display</em> AVIF images. However, <em>encoding</em> AVIF (creating the files) from the browser Canvas API is a different story. Chrome, Edge, and Opera — all Chromium-based — support <code>canvas.toBlob(&apos;image/avif&apos;)</code>. Safari and Firefox do not. This tool automatically tests your browser&apos;s encoding capability before processing any images. If you are on Safari or Firefox, you will see a friendly message suggesting WebP as a broadly-supported alternative that still offers excellent compression.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">How the conversion works</h3>
            <p className="text-slate-600 leading-relaxed">
              Each image is loaded into the browser using the Canvas API, corrected for EXIF orientation, and then re-encoded as AVIF at your chosen quality level. The process is entirely local — the image is drawn onto an HTML5 canvas, and the canvas exports it as an AVIF blob. Because the encoding uses the browser&apos;s built-in codec, no server-side library or WebAssembly bundle is needed. The result is a genuine, spec-compliant AVIF file, not a re-container of an existing compressed frame.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no-upload matters for image conversion</h3>
            <p className="text-slate-600 leading-relaxed">
              Converting images means opening them, decoding their pixels, and re-encoding them. Online conversion tools that promise &quot;free JPG to AVIF&quot; often work by uploading your image to a server, running the conversion in a headless environment, and sending back the result. That exposes every pixel — family photos, ID scans, private screenshots, business documents — to third-party infrastructure. Even if the server claims to delete files after processing, you have no audit trail and no way to verify. This tool runs the entire pipeline in your browser tab. The Canvas API does the decoding and encoding locally. No network request carries your image data anywhere.
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
                    <td className="px-4 py-2.5 text-slate-700">AVIF quality</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Native browser encoder</td>
                    <td className="px-4 py-2.5 text-slate-500">Server-side codec (variable)</td>
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
          { name: 'Convert to WebP', href: '/image/convert-to-webp', icon: '🖼️' },
          { name: 'Compress Image', href: '/image/compress-image', icon: '🗜️' },
          { name: 'Convert to JPG', href: '/image/convert-to-jpg', icon: '🖼️' },
        ]}
      />
    </>
  );
}
