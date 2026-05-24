import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const ConvertToJpg = dynamic(() => import('../../components/Image/ConvertToJpg'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading…</div>,
});

const SLUG = '/image/convert-to-jpg';

const FAQS = [
  { q: 'Is this safe? Does it upload my image?', a: 'No upload. The entire tool runs in your browser using JavaScript. Your image never leaves your device, never touches our server, and is never logged.' },
  { q: 'What image formats are supported?', a: 'PNG, WebP, AVIF, HEIC, GIF, and BMP — all convert to JPG. You can mix formats in a single batch; each file is detected and converted independently.' },
  { q: 'What is the maximum file size?', a: 'You can convert images up to ~50 MB each. Files over 25 MB will be slower, especially on mobile. For very large images, consider resizing first.' },
  { q: 'Will this work on mobile?', a: 'Yes, on modern iOS Safari and Chrome for Android. Very large images (>25 MB) may be slow on older devices due to memory constraints. HEIC conversion is fully supported on mobile.' },
  { q: 'What happens to transparent areas in PNG or WebP?', a: 'JPG does not support transparency. Any transparent areas (alpha channel) are filled with a white background. If you need to preserve transparency, use the Convert to PNG tool instead.' },
  { q: 'Why would I convert my images to JPG?', a: 'JPG is the most widely supported image format — ideal for photos, web content, email attachments, and social media. Converting to JPG often dramatically reduces file size compared to PNG (up to 90% smaller for photographic content), and virtually every device and app can display it.' },
  { q: 'Can I convert multiple images at once?', a: 'Yes. Drop or select as many files as you need and they are processed sequentially. Each output file gets a .jpg extension. After conversion, download each file individually or grab a single .zip containing all of them.' },
  { q: 'Does this support HEIC photos from my iPhone?', a: 'Yes. HEIC/HEIF files (the default iPhone photo format since iOS 11) are detected automatically. The tool lazy-loads the HEIC decoder only when needed, so regular JPG/PNG conversions stay fast.' },
];

export default function ConvertToJpgPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Convert to JPG',
    slug: SLUG,
    description: 'Convert PNG, WebP, AVIF, HEIC, GIF, and BMP to JPG with quality control. Batch conversion, 100% client-side, no upload.',
    category: 'UtilitiesApplication',
    featureList: 'PNG to JPG, WebP to JPG, HEIC to JPG, AVIF to JPG, GIF to JPG, BMP to JPG, Quality slider, Batch processing, ZIP download, No upload, No sign-up, Privacy-first',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Convert to JPG — Free, No Upload, Private | Toolisk</title>
        <meta name="description" content="Convert PNG, WebP, AVIF, HEIC, GIF, and BMP to JPG with quality control. Batch conversion, 100% client-side — no upload, no sign-up. Free and private." />
        <meta name="keywords" content="convert to jpg, convert to jpg no upload, png to jpg, webp to jpg, heic to jpg, avif to jpg, batch image conversion, free online jpg converter private" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Convert to JPG | Toolisk" />
        <meta property="og:description" content="Convert PNG, WebP, AVIF, HEIC, GIF, and BMP to JPG in your browser. Batch conversion, quality control, no upload." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="🖼️"
        title="Convert to JPG"
        tagline="Convert PNG, WebP, AVIF, HEIC, GIF, and BMP to JPG in your browser — control quality, batch process, and download instantly. No upload, no sign-up."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <ConvertToJpg />
      </ToolShell>

      <ToolSEOContent
        description="Convert any image format to JPG without leaving your browser. Drop PNG, WebP, AVIF, HEIC, GIF, or BMP files, set the quality level you want, and download crisp JPGs — individually or as a ZIP. Everything runs client-side, so your images never touch a server."
        features={[
          '🔒 100% client-side — your images never leave your browser',
          '🖼️ Converts PNG, WebP, AVIF, HEIC, GIF, and BMP to JPG',
          '🎚️ Adjustable quality slider with Low / Medium / High presets',
          '📦 Batch process multiple files and download as ZIP',
          '📱 Full HEIC support for iPhone photos',
          '🆓 Free forever, no sign-up, no watermark',
        ]}
        steps={[
          { title: 'Drop your images', desc: 'Drag and drop one or more images into the upload area, or paste from clipboard. Any format works.' },
          { title: 'Choose JPG quality', desc: 'Use the slider (1–100%) or pick a preset: Low (30%), Medium (65%), or High (85%). Higher = larger file, sharper image.' },
          { title: 'Convert', desc: 'Click "Convert to JPG" — each file is converted locally. HEIC files auto-load the decoder. A progress bar tracks batch status.' },
          { title: 'Download', desc: 'Download each JPG individually or grab a single .zip of all converted files. Original filenames are preserved with .jpg extension.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why convert images to JPG?</h2>
            <p className="text-slate-600 leading-relaxed">
              JPG remains the single most compatible image format on the planet. Every web browser, email client, social platform, and messaging app renders JPG natively. File sizes are dramatically smaller than PNG for photographic content, and smaller than WebP or AVIF for the broadest device support. If you need an image that &ldquo;just works&rdquo; everywhere — from a government form upload to a Craigslist listing to a slideshow — JPG is the safest choice.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a concrete example: a 2.8 MB PNG screenshot from a design tool, converted to JPG at 85% quality, typically drops to 320 KB — an 89% reduction — with imperceptible quality loss for on-screen viewing. A 5 MB HEIC photo from an iPhone converts to roughly a 1.2 MB JPG at the same quality level, making it usable in every app that still rejects the HEIC format.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">How the conversion works</h3>
            <p className="text-slate-600 leading-relaxed">
              This tool uses the browser&apos;s built-in Canvas API for standard formats (PNG, WebP, AVIF, GIF, BMP). The source image is loaded, drawn onto an HTML5 canvas, and re-encoded as JPEG at the quality level you specify. For HEIC files — Apple&apos;s default photo format — the tool lazy-loads the heic2any decoder only when a .heic or .heif file is detected, so regular conversions stay light and fast. The entire pipeline runs inside your browser&apos;s JavaScript runtime; no byte of your image touches a server.
            </p>
            <p className="text-slate-600 leading-relaxed">
              A note on transparency: JPG does not support an alpha channel. If your PNG or WebP has transparent areas, they will be filled with a white background in the output JPG. If you need to keep transparency, use the Convert to PNG tool instead.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no-upload matters for image conversion</h3>
            <p className="text-slate-600 leading-relaxed">
              The images you convert often contain the most personal data on your device — family photos, ID documents, private screenshots, medical records, or financial statements. Upload-based converters send your original file to a remote server, where it may be stored, logged, or analyzed. You have no way to audit what happens after the upload. This tool processes everything locally: drag in a photo, hit Convert, and the resulting JPG streams directly to your download folder. No network request carries your pixels anywhere.
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
                    <td className="px-4 py-2.5 text-slate-700">HEIC support</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Built-in, lazy-loaded</td>
                    <td className="px-4 py-2.5 text-slate-500">Often missing or server-side</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-slate-700">Original file exposure</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Never leaves your device</td>
                    <td className="px-4 py-2.5 text-slate-500">Stored on external servers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        }
        relatedTools={[
          { name: 'Image Compressor', href: '/image/compress-image', icon: '🗜️' },
          { name: 'Convert to PNG', href: '/image/convert-to-png', icon: '🖼️' },
          { name: 'EXIF Remover', href: '/image/exif-remover', icon: '🔒' },
        ]}
      />
    </>
  );
}
