import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const CompressImage = dynamic(() => import('../../components/Image/CompressImage'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading…</div>,
});

const SLUG = '/image/compress-image';

const FAQS = [
  { q: 'Is my image uploaded to a server?', a: 'No. The entire compression runs in your browser using JavaScript. Your images never leave your device, never touch our servers, and are never logged or stored anywhere.' },
  { q: 'What image formats are supported?', a: 'JPG/JPEG, PNG, WebP, GIF, and BMP. The output preserves your original format — JPGs stay JPG, PNGs stay PNG, and so on.' },
  { q: 'What is the maximum file size?', a: 'You can compress images up to 50 MB each. Files over 25 MB will show a warning since processing may be slower on mobile devices.' },
  { q: 'Does this work on mobile?', a: 'Yes, on modern mobile browsers (Chrome, Safari, Firefox). Very large images (>25 MB) may be slower on phones due to memory limits per browser tab.' },
  { q: 'What does the quality slider actually do?', a: 'It controls the JPEG/WebP compression quality from 1% (smallest file, lowest quality) to 100% (largest file, highest quality). For PNGs, the quality parameter affects the optimization level. Most photos look great between 75–85%.' },
  { q: 'Will I lose image quality?', a: 'JPEG and WebP are lossy formats, so lowering quality does reduce visual fidelity — but the trade-off is a dramatically smaller file. PNG compression is lossless, so quality is preserved. The savings badge on each result tells you exactly how much smaller the file became.' },
  { q: 'Can I compress multiple images at once?', a: 'Yes. Drop or select multiple files and they are processed in batch. When done, you can download each image individually or grab a single .zip containing all of them.' },
  { q: 'Should I pick Low, Medium, or High quality?', a: 'Low (40%) gives the smallest files but visible artifacts — good for thumbnails. Medium (65%) is a decent balance. High (85%) keeps most visual detail while still shaving 15–40% off the file size. The slider lets you fine-tune beyond presets.' },
];

export default function CompressImagePage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Image Compressor',
    slug: SLUG,
    description: 'Compress JPG, PNG, and WebP images in your browser — no upload, no sign-up. Adjust quality, batch process files, and download results instantly.',
    category: 'UtilitiesApplication',
    featureList: 'JPEG PNG WebP compression, Quality slider, Batch processing, ZIP download, No upload, No sign-up, Privacy-first',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Compress Image — Online, Private, No Upload | Toolisk</title>
        <meta name="description" content="Compress JPG, PNG, and WebP images in your browser. No upload, no sign-up. Adjust quality and download smaller files instantly." />
        <meta name="keywords" content="compress image, image compressor, compress image no upload, image compressor online private, reduce image file size, compress jpg, compress png, compress webp, batch image compression" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Compress Image | Toolisk" />
        <meta property="og:description" content="Compress JPG, PNG, and WebP images in your browser. No upload, no sign-up. Private and free." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="🗜️"
        title="Image Compressor"
        tagline="Compress JPG, PNG, and WebP images in your browser — adjust quality, batch process, and download smaller files instantly. No upload, no sign-up."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <CompressImage />
      </ToolShell>

      <ToolSEOContent
        description="Shrink image file sizes without leaving your browser. Drop one image or a hundred, dial in the quality you want, and download the results — individually or as a ZIP. Everything runs client-side, so your photos never touch a server."
        features={[
          '🔒 100% client-side — your images never leave your browser',
          '🎚️ Adjustable quality slider with Low / Medium / High presets',
          '📦 Batch process multiple images and download as ZIP',
          '🖼️ Supports JPG, PNG, WebP, GIF, and BMP',
          '🆓 Free forever, no sign-up, no watermark',
          '📱 Works on desktop and mobile browsers',
        ]}
        steps={[
          { title: 'Drop your images', desc: 'Drag and drop one or more images into the upload area, or click to browse your files.' },
          { title: 'Choose quality', desc: 'Use the slider to set compression quality (1–100%), or pick a preset: Low (40%), Medium (65%), or High (85%).' },
          { title: 'Compress', desc: 'Click "Compress Images" — each file is processed locally in your browser. A progress bar tracks batch progress.' },
          { title: 'Download results', desc: 'See before/after sizes and savings for each file. Download individually or grab a .zip of everything.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why image compression matters</h2>
            <p className="text-slate-600 leading-relaxed">
              Unoptimized images are the single largest contributor to slow web pages. A typical smartphone photo weighs 3–8 MB straight out of the camera. A product page with six such images forces the browser to download 18–48 MB before the user sees anything — and on mobile data, that means bounce rates north of 50%. The fix is not to recompress once and forget it; it is to have a fast, frictionless tool that lets you dial quality to the exact level your context demands.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a concrete example: a 4.7 MB JPEG from an iPhone, compressed at 80% quality through this tool, typically drops to 1.1–1.4 MB — a 70% reduction — with no visible difference when displayed on a website. At 65% quality, the same file can shrink below 800 KB. The quality slider lets you find the sweet spot between file size and visual fidelity for every use case, from email attachments to web assets to slideshow thumbnails.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">How it works under the hood</h3>
            <p className="text-slate-600 leading-relaxed">
              For JPEG and WebP images, this tool uses the browser-image-compression library, which leverages the browser&apos;s built-in canvas API to re-encode images at the quality level you choose. The process is entirely local: the image is drawn onto an HTML5 canvas, then exported at the specified quality factor. For PNGs, the canvas is re-encoded using the browser&apos;s native PNG encoder with the quality parameter applied. Because the encoding happens through the standard canvas APIs, the output is consistent across browsers and does not depend on any server-side library.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Batch processing and ZIP download</h3>
            <p className="text-slate-600 leading-relaxed">
              When you have dozens of product photos or a folder of blog images, compressing them one by one is tedious. This tool processes all dropped files sequentially and shows a live progress indicator ("Compressing 3 of 12…"). Once every image is done, you can download each result individually, or click "Download all as .zip" to get a single archive containing every compressed file with its original name preserved — minus the bulk. The ZIP is generated locally using JSZip, so again nothing leaves your machine.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no-upload matters</h3>
            <p className="text-slate-600 leading-relaxed">
              Photos are personal — they may contain faces, locations, documents, or private moments you never intended to share. Most "free" image compressors operate on a simple bargain: you give them your photo, they compress it on their server, and send it back. That means your image is stored, even if briefly, on someone else&apos;s infrastructure. You have no audit trail, no delete guarantee, and no way to know if the file was logged, indexed, or shared. This tool compresses images entirely inside the JavaScript runtime of your browser tab. There is no network request carrying your pixels anywhere. The processing happens on your device, and the only data that moves is the compressed file streaming back to your download folder.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Image Resizer', href: '/image/resize-image', icon: '📐' },
          { name: 'Image Watermark', href: '/image/image-watermark', icon: '💧' },
          { name: 'Pixelate / Blur', href: '/image/pixelate-image', icon: '🔲' },
        ]}
      />
    </>
  );
}