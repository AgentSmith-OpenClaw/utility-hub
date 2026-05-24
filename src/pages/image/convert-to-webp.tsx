import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const ConvertToWebp = dynamic(() => import('../../components/Image/ConvertToWebp'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading…</div>,
});

const SLUG = '/image/convert-to-webp';

const FAQS = [
  { q: 'Is my image uploaded to a server?', a: 'No. The entire conversion runs in your browser using JavaScript and the Canvas API. Your images never leave your device, never touch our servers, and are never logged or stored anywhere.' },
  { q: 'What image formats are supported for input?', a: 'JPG/JPEG, PNG, WebP, GIF, BMP, and AVIF. The tool reads the original image through the browser Canvas API and re-encodes it as WebP — so almost any format the browser can display is supported.' },
  { q: 'What is the maximum file size?', a: 'You can convert images up to 50 MB each. Files over 25 MB will show a warning since processing may be slower on mobile devices.' },
  { q: 'Does this work on mobile?', a: 'Yes, on modern mobile browsers. Chrome, Edge, Opera, Samsung Internet, and Safari all support WebP encoding. Very large images (>25 MB) may be slower on phones due to memory limits.' },
  { q: 'How much smaller is WebP compared to JPG or PNG?', a: 'WebP typically produces files ~25–35% smaller than equivalent-quality JPEGs, and up to 30% smaller than PNGs with transparency. The actual savings vary by image content — the savings badge on each result shows your exact reduction.' },
  { q: 'Which browsers support WebP encoding?', a: 'All modern browsers support WebP decoding (viewing). For encoding (creating WebP), Chrome, Edge, Safari, Opera, and Samsung Internet all support it. Firefox added WebP encoding support in version 96+. This tool checks your browser on load and warns you if encoding is unavailable.' },
  { q: 'Does WebP support transparency like PNG?', a: 'Yes. WebP supports full alpha-channel transparency and lossless compression. When you convert a PNG with transparency, the resulting WebP preserves the transparent areas. WebP also supports animation (like animated GIFs).' },
  { q: 'Can I convert multiple images at once?', a: 'Yes. Drop or select multiple files and they are processed sequentially. When done, you can download each WebP individually or grab a single .zip containing all converted files with their original names (extension changed to .webp).' },
];

export default function ConvertToWebpPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Convert to WebP',
    slug: SLUG,
    description: 'Convert JPG, PNG, GIF, BMP, and AVIF images to WebP format in your browser — no upload. Adjustable quality, batch processing, instant download.',
    category: 'UtilitiesApplication',
    featureList: 'WebP conversion, JPG to WebP, PNG to WebP, Quality slider, Batch processing, ZIP download, No upload, No sign-up, Privacy-first',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Convert to WebP — Smaller Files, No Upload | Toolisk</title>
        <meta name="description" content="Convert images to modern WebP format in your browser. Quality slider, batch processing, ~30% smaller files — 100% client-side, no upload, no sign-up." />
        <meta name="keywords" content="convert to webp, convert image to webp, webp converter, convert jpg to webp, convert png to webp, webp converter no upload, webp converter online private" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Convert to WebP | Toolisk" />
        <meta property="og:description" content="Convert images to WebP format in your browser. Batch processing, quality control, ~30% smaller files. No upload." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="🌐"
        title="Convert to WebP"
        tagline="Convert images to WebP format — ~30% smaller files with adjustable quality. Batch process JPG, PNG, GIF, and more — 100% in your browser, no upload."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <ConvertToWebp />
      </ToolShell>

      <ToolSEOContent
        description="Modernize your images by converting them to WebP — a next-generation format that delivers smaller files at equal or better quality. Drop JPG, PNG, GIF, BMP, or AVIF images, tweak the quality slider, and download WebP files that are typically 25–35% smaller. Everything runs in your browser, so your images never touch a server."
        features={[
          '🔒 100% client-side — your images never leave your browser',
          '🌐 Converts JPG, PNG, GIF, BMP, and AVIF to WebP',
          '🎚️ Adjustable quality slider with Low / Medium / High presets',
          '📦 Batch process multiple images and download as ZIP',
          '🆓 Free forever, no sign-up, no watermark',
          '📱 Works on desktop and mobile browsers',
        ]}
        steps={[
          { title: 'Drop your images', desc: 'Drag and drop one or more images into the upload area, or click to browse your files.' },
          { title: 'Choose quality', desc: 'Use the slider to set WebP quality (1–100%), or pick a preset: Low (40%), Medium (65%), or High (85%).' },
          { title: 'Convert', desc: 'Click "Convert to WebP" — each file is re-encoded locally in your browser. A progress bar tracks batch progress.' },
          { title: 'Download results', desc: 'See before/after sizes and savings for each file. Download individually or grab a .zip of everything.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why convert images to WebP?</h2>
            <p className="text-slate-600 leading-relaxed">
              WebP is the modern image format developed by Google that delivers significantly smaller file sizes than JPEG and PNG — without sacrificing visual quality. On average, WebP images are 25–35% smaller than equivalent JPEGs, and lossless WebP files are up to 30% smaller than PNGs. For websites, that translates directly to faster page loads, lower bandwidth costs, and better Core Web Vitals scores. Major platforms — YouTube, Amazon, eBay, Shopify — already serve WebP to compliant browsers. Converting your assets to WebP is one of the highest-ROI optimizations you can make for web performance.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a concrete example: a 3.2 MB product photo in JPEG format, converted to WebP at 80% quality through this tool, typically drops to around 950 KB — a 70% reduction — with no visible quality difference when displayed on a website. A 2.1 MB PNG screenshot with transparency converts to roughly 600 KB of lossless WebP, preserving every pixel while cutting the file to less than a third of its original size. The savings badge on every result shows your exact reduction so you can tune the quality slider for your specific use case.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">How WebP conversion works under the hood</h3>
            <p className="text-slate-600 leading-relaxed">
              This tool uses the browser&apos;s built-in Canvas API to re-encode images to the WebP format. Each image is loaded, drawn onto an HTML5 canvas at its original dimensions, and then exported using <code className="bg-slate-100 px-1 py-0.5 rounded text-sm">canvas.toBlob(callback, &apos;image/webp&apos;, quality)</code>. The entire process is local — the image data never leaves your browser tab. The quality parameter maps directly to the same compression scale used by the WebP encoder in Chrome&apos;s rendering engine, so the output is consistent and production-ready. No server-side library, no cloud service, and no network request of any kind.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">WebP vs JPG vs PNG — a quick comparison</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">Feature</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">WebP</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">JPG</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">PNG</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700 font-medium">Lossy compression</td>
                    <td className="px-4 py-2.5 text-emerald-700">Yes (~30% smaller than JPG)</td>
                    <td className="px-4 py-2.5 text-slate-500">Yes</td>
                    <td className="px-4 py-2.5 text-slate-500">No</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700 font-medium">Lossless compression</td>
                    <td className="px-4 py-2.5 text-emerald-700">Yes (~30% smaller than PNG)</td>
                    <td className="px-4 py-2.5 text-slate-500">No</td>
                    <td className="px-4 py-2.5 text-slate-500">Yes</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700 font-medium">Transparency (alpha)</td>
                    <td className="px-4 py-2.5 text-emerald-700">Yes</td>
                    <td className="px-4 py-2.5 text-slate-500">No</td>
                    <td className="px-4 py-2.5 text-slate-500">Yes</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700 font-medium">Animation</td>
                    <td className="px-4 py-2.5 text-emerald-700">Yes</td>
                    <td className="px-4 py-2.5 text-slate-500">No</td>
                    <td className="px-4 py-2.5 text-slate-500">No (APNG limited)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-slate-700 font-medium">Browser support</td>
                    <td className="px-4 py-2.5 text-emerald-700">97%+ global</td>
                    <td className="px-4 py-2.5 text-slate-500">Universal</td>
                    <td className="px-4 py-2.5 text-slate-500">Universal</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Browser support for WebP encoding</h3>
            <p className="text-slate-600 leading-relaxed">
              Every major browser today can display WebP images (decoding support is at 97%+ globally). For encoding — actually creating new WebP files — the story is nearly as strong: Chrome, Edge, Opera, Samsung Internet, and Safari all support the <code className="bg-slate-100 px-1 py-0.5 rounded text-sm">canvas.toBlob(&apos;image/webp&apos;)</code> API. Firefox added WebP encoding support in version 96 (December 2021). This tool checks your browser on load and shows a clear warning if WebP encoding is unavailable, so you never waste time on an unsupported browser.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no-upload matters</h3>
            <p className="text-slate-600 leading-relaxed">
              The images you convert may contain sensitive content — product mockups under NDA, proprietary design assets, personal photos, scans of identity documents, or medical imagery. When you use a server-based WebP converter, every file is transmitted to a third-party server, stored (even if temporarily), and processed on infrastructure you cannot audit. You have no guarantee the file was deleted afterward, no visibility into logging, and no recourse if a breach occurs. This tool eliminates that risk entirely: the browser&apos;s Canvas API re-encodes your images locally, in your tab, with zero network activity. The converted WebP file is delivered directly from memory to your download folder. Your original file never leaves your device.
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
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Instant — no upload wait</td>
                    <td className="px-4 py-2.5 text-slate-500">Minutes for large files</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">File limit</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">50 MB per file (browser memory)</td>
                    <td className="px-4 py-2.5 text-slate-500">Often 5–20 MB</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-slate-700">Sign-up required</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Never</td>
                    <td className="px-4 py-2.5 text-slate-500">Oftenrequired for batches</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        }
        relatedTools={[
          { name: 'Image Compressor', href: '/image/compress-image', icon: '🗜️' },
          { name: 'Convert to JPG', href: '/image/convert-to-jpg', icon: '🖼️' },
          { name: 'Convert to AVIF', href: '/image/convert-to-avif', icon: '🖼️' },
        ]}
      />
    </>
  );
}
