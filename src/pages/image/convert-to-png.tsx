import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const ConvertToPng = dynamic(() => import('../../components/Image/ConvertToPng'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading…</div>,
});

const SLUG = '/image/convert-to-png';

const FAQS = [
  { q: 'Is my image uploaded to a server?', a: 'No. The entire conversion runs in your browser using JavaScript. Your images never leave your device, never touch our servers, and are never logged or stored anywhere.' },
  { q: 'What image formats are supported for input?', a: 'JPG/JPEG, WebP, AVIF, HEIC (iPhone photos), GIF, and BMP. All are converted to PNG using the browser\'s native canvas APIs — no server-side processing involved.' },
  { q: 'What is the maximum file size?', a: 'You can convert images up to 50 MB each. Files over 25 MB will show a warning since processing may be slower on mobile devices due to per-tab memory limits.' },
  { q: 'Does this work on mobile?', a: 'Yes, on modern mobile browsers (Chrome, Safari, Firefox). Very large images (>25 MB) may be slower on phones due to memory constraints per browser tab.' },
  { q: 'Why is PNG lossless while JPG is lossy?', a: 'PNG uses DEFLATE compression — a lossless algorithm that preserves every pixel exactly as encoded. JPG uses discrete cosine transform (DCT) which discards subtle color detail the human eye cannot easily perceive. The trade-off: PNG files are larger but pixel-perfect, while JPG files are smaller but introduce artifacts with every re-save.' },
  { q: 'Does PNG support transparency?', a: 'Yes. PNG\'s RGBA color model includes an alpha channel, giving you 256 levels of transparency per pixel. This makes PNG the standard for logos, icons, UI elements, and any graphic that needs to overlay other content. By default, this tool preserves transparency — toggle "White background" if you prefer an opaque result, for example when converting a JPG.' },
  { q: 'Will my PNG file be larger than the original JPG?', a: 'Almost always yes. JPG is designed for photographs and achieves small file sizes by discarding data. When you convert JPG to PNG, the output stores every pixel exactly as decoded, typically resulting in a file 3–10× larger. This is expected and not a bug — use PNG when you need lossless quality or transparency, and JPG when file size is the priority.' },
  { q: 'When should I convert JPG to PNG vs keeping it as JPG?', a: 'Convert to PNG when you need transparency, plan to edit and re-save the image multiple times, need text or sharp lines to stay crisp, or are preparing graphics for print. Keep as JPG when you are sharing photos online, sending email attachments, or prioritizing storage — because JPG files are dramatically smaller with acceptable quality loss for photographic content.' },
];

export default function ConvertToPngPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Convert to PNG',
    slug: SLUG,
    description: 'Convert images to lossless PNG with full transparency support. Accepts JPG, WebP, AVIF, HEIC, GIF, BMP — 100% client-side, no upload.',
    category: 'UtilitiesApplication',
    featureList: 'Lossless PNG output, Transparency preservation, White background option, HEIC support, Batch processing, ZIP download, No upload, No sign-up, Privacy-first',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Convert to PNG — Free, No Upload, Private | Toolisk</title>
        <meta name="description" content="Convert images to lossless PNG with full transparency support. Accepts JPG, WebP, AVIF, HEIC, GIF, BMP — 100% client-side, no upload, private, free." />
        <meta name="keywords" content="convert to png, convert image to png, jpg to png, webp to png, heic to png, image to png converter, convert to png no upload, lossless image converter, png transparency, free png converter online" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Convert to PNG — Free, No Upload, Private | Toolisk" />
        <meta property="og:description" content="Convert images to lossless PNG with full transparency support. No upload, no sign-up. Private and free." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="🖼️"
        title="Convert to PNG"
        tagline="Convert images to lossless PNG with full transparency support. Accepts JPG, WebP, AVIF, HEIC, GIF, BMP — 100% client-side, no upload."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <ConvertToPng />
      </ToolShell>

      <ToolSEOContent
        description="Convert any image to PNG format right in your browser. Drop JPG, WebP, AVIF, HEIC (iPhone), GIF, or BMP files and get back lossless PNGs with full alpha-channel transparency — no upload, no sign-up, no watermark."
        features={[
          '🔒 100% client-side — your images never leave your browser',
          '🫧 Full alpha-channel transparency preservation',
          '⬜ Toggle between transparent and white background',
          '📱 Converts iPhone HEIC photos without losing quality',
          '📦 Batch process multiple images and download as ZIP',
          '🆓 Free forever, no sign-up, no watermark',
        ]}
        steps={[
          { title: 'Upload your images', desc: 'Drag and drop one or more images into the upload area, or click to browse. Supports JPG, WebP, AVIF, HEIC, GIF, and BMP.' },
          { title: 'Choose background', desc: 'Select "Transparent background" to preserve alpha channel (good for logos and icons) or "White background" to fill the canvas with white (useful for JPG-to-PNG conversions).' },
          { title: 'Convert', desc: 'Click "Convert to PNG" — each file is processed locally in your browser using Canvas APIs. HEIC files are decoded via heic2any.' },
          { title: 'Download results', desc: 'See each output filename (extension changed to .png) and file size. Download individually or grab a single .zip of everything.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why convert images to PNG?</h2>
            <p className="text-slate-600 leading-relaxed">
              PNG (Portable Network Graphics) is the go-to format when every pixel matters. Unlike lossy formats like JPG or WebP, PNG uses DEFLATE compression — a lossless algorithm that preserves the exact color value of every pixel. This makes PNG the gold standard for graphics that contain text, sharp edges, or areas of uniform color: logos, screenshots, diagrams, icons, UI mockups, and any image intended for further editing. When you convert a JPG to PNG, you stop the cumulative degradation that happens every time a lossy format is re-saved.
            </p>
            <p className="text-slate-600 leading-relaxed">
              PNG also supports an alpha channel — 256 levels of transparency per pixel — which JPG cannot do at all. This is why web designers, app developers, and content creators reach for PNG whenever an image needs to sit on top of a variable background. The trade-off is file size: a PNG will almost always be larger than a JPG of the same visual content, sometimes 3–10× larger. That is the expected cost of storing every pixel without any loss. Use this tool to convert to PNG when you need maximum fidelity or transparency, and use our Image Compressor when file size is the priority.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Transparency and the alpha channel</h3>
            <p className="text-slate-600 leading-relaxed">
              Every PNG pixel is stored as RGBA: red, green, blue, and alpha. The alpha value ranges from 0 (fully transparent) to 255 (fully opaque). When you open a PNG in a browser or image editor, the alpha channel blends seamlessly with whatever sits behind it. This is why PNG is the only reasonable format for company logos, app icons, watermarks, and UI sprites. If your source image already has transparency (e.g., a WebP or GIF with transparent areas), this tool preserves it by default. If you toggle "White background," the canvas is filled with solid white before the image is drawn — useful when converting an opaque JPG where transparency is not relevant.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">HEIC to PNG — iPhone photo conversion</h3>
            <p className="text-slate-600 leading-relaxed">
              Modern iPhones capture photos in HEIC (High Efficiency Image Container) format by default. While HEIC offers great compression, it is not universally supported — many websites, CMS platforms, and desktop apps cannot open HEIC files. This tool detects HEIC files automatically and uses the heic2any library to decode them client-side before rendering to a PNG canvas. The result is a universally-compatible PNG that you can open anywhere, with no loss of quality compared to the HEIC original. Note that heic2any is lazy-loaded only when HEIC files are detected, so JPG, WebP, and other formats do not incur the extra library download.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no-upload matters for image conversion</h3>
            <p className="text-slate-600 leading-relaxed">
              Converting an image to a different format sounds trivial, but the privacy implications are not. When you use an upload-based converter, you are sending the entire pixel data of your image to a remote server — along with any embedded metadata like GPS coordinates, camera model, timestamps, and possibly faces of people in the photo. The server may process and return the PNG, but you have no audit trail. Was the original file deleted? Was a copy cached on a CDN? Was it logged for analytics? This tool eliminates all of those questions by running the entire conversion inside your browser tab. The Canvas API, the heic2any decoder, the JSZip bundler — every component runs locally. No bytes of your image ever leave your machine.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Image Compressor', href: '/image/compress-image', icon: '🗜️' },
          { name: 'Image Resizer', href: '/image/resize-image', icon: '📐' },
          { name: 'Round Image Corners', href: '/image/round-image-corners', icon: '⬛' },
        ]}
      />
    </>
  );
}
