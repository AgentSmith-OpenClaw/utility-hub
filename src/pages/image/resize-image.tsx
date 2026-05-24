import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const ResizeImage = dynamic(() => import('../../components/Image/ResizeImage'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading…</div>,
});

const SLUG = '/image/resize-image';

const FAQS = [
  { q: 'Is my image uploaded to a server?', a: 'No. The entire resize runs in your browser using JavaScript. Your image never leaves your device, never touches our servers, and is never logged or stored anywhere.' },
  { q: 'What image formats are supported?', a: 'JPG, PNG, WebP, GIF, BMP, and AVIF. The tool auto-detects the format — just drop any image file. You can also choose the output format (JPEG, PNG, or WebP) regardless of the input format.' },
  { q: 'What is the maximum file size?', a: 'You can resize images up to 50 MB. Files over 25 MB will show a warning since processing may be slower on mobile devices due to memory limits per browser tab.' },
  { q: 'Will this work on mobile?', a: 'Yes, on modern mobile browsers (Chrome, Safari, Firefox). Very large images (>25 MB) may be slower on phones due to per-tab memory constraints. For best results on mobile, resize to a smaller dimension first.' },
  { q: 'What is the difference between resizing and resampling?', a: 'Resizing changes the pixel dimensions (width and height) of an image. Resampling is the algorithm that determines how new pixel values are calculated. Every resize involves resampling — this tool uses Lanczos3, which looks at a 3×3 neighborhood of pixels to produce the highest-quality output, significantly better than basic bilinear or nearest-neighbor methods.' },
  { q: 'What quality does Lanczos3 resampling give?', a: 'Lanczos3 is a high-quality resampling filter that preserves sharpness, reduces aliasing, and minimizes visual artifacts. It is the same algorithm used in professional tools like Photoshop. You get crisp edges, smooth gradients, and no visible pixelation — even when downscaling by more than 50%.' },
  { q: 'Can I unlock the aspect ratio to stretch or squash the image?', a: 'Yes. By default the aspect ratio is locked so your image stays proportional. Click the lock icon (🔗) to unlock it, then set any width and height independently. Lock it again to return to proportional scaling.' },
  { q: 'Does the resize tool work on phones and tablets?', a: 'Yes. The tool runs entirely in your browser using Web Workers, so it works on any modern phone or tablet. For very large source images (e.g. 8000×6000), the processing time will be longer on lower-powered devices. Setting a smaller target dimension helps.' },
];

export default function ResizeImagePage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Image Resizer',
    slug: SLUG,
    description: 'Resize images by pixels or percentage with locked aspect ratio — 100% client-side, no upload, private.',
    category: 'UtilitiesApplication',
    featureList: 'Pixel and percent resize, Aspect ratio lock, Lanczos3 resampling, Format conversion, Quality slider, No upload, No sign-up, Privacy-first',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Resize Image — Change Dimensions, Lock Aspect Ratio | Toolisk</title>
        <meta name="description" content="Resize images by pixels or percentage with locked aspect ratio. High-quality Lanczos resampling — 100% client-side, no upload. Free, private." />
        <meta name="keywords" content="resize image, resize image no upload, image resizer, change image dimensions, aspect ratio lock, image resample lanczos, free image resize online" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Resize Image | Toolisk" />
        <meta property="og:description" content="Resize images by pixels or percentage in your browser. No upload, private, free. Lanczos3 quality." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="📐"
        title="Image Resizer"
        tagline="Resize images by pixels or percentage in your browser — lock the aspect ratio, pick your format, and download instantly. No upload, no sign-up."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <ResizeImage />
      </ToolShell>

      <ToolSEOContent
        description="Change image dimensions effortlessly. Drop any image, pick pixels or percentage, lock the aspect ratio, choose JPEG/PNG/WebP output, and download the result — all in your browser, no files ever leave your device."
        features={[
          '🔒 100% client-side — your images never leave your browser',
          '📐 Resize by exact pixels or percentage (10–200%)',
          '🔗 Lock or unlock aspect ratio with one click',
          '🎨 Lanczos3 resampling — same algorithm as Photoshop',
          '🖼️ Output as JPEG, PNG, or WebP regardless of input format',
          '🆓 Free forever, no sign-up, no watermark',
        ]}
        steps={[
          { title: 'Upload your image', desc: 'Drag and drop or click to browse. Supports JPG, PNG, WebP, GIF, BMP, and AVIF up to 50 MB.' },
          { title: 'Set dimensions', desc: 'Choose Pixels or Percent mode. Enter width/height or pick a preset (50%, 75%, 100%, 150%, 200%).' },
          { title: 'Pick format and quality', desc: 'Keep the original format or convert to JPEG, PNG, or WebP. Adjust quality for JPEG/WebP output.' },
          { title: 'Download', desc: 'Click Resize Image, then download your resized file. See original vs. new dimensions and file size.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why image resizing matters</h2>
            <p className="text-slate-600 leading-relaxed">
              Every website, social platform, and app has specific dimension requirements for images. Uploading an oversized photo wastes bandwidth and slows load times — a 5472 × 3648 iPhone shot is 20 megapixels, but most web layouts need only 1920 px wide. Conversely, upscaling a tiny thumbnail destroys sharpness. This tool lets you set any target dimension, lock the aspect ratio so nothing looks stretched, and choose the resampling algorithm that best preserves quality.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a concrete example: a 5472 × 3648 JPEG from a smartphone (roughly 3.5 MB) resized to 1920 × 1280 with Lanczos3 resampling produces a 280 KB file — 92% smaller — with no visible quality loss when displayed on a website. The same image resized to 50% (2736 × 1824) still looks crisp and weighs just 900 KB, making it ideal for email attachments or blog posts.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Resize vs. resample — what is the difference?</h3>
            <p className="text-slate-600 leading-relaxed">
              Technically, resizing changes an image&apos;s pixel dimensions, while resampling determines <em>how</em> the new pixel values are computed. Every resize operation involves resampling — you cannot change pixel count without deciding how to fill in or discard pixels. This tool uses Lanczos3 resampling, which examines a 3×3 neighborhood around each pixel to compute the output. Compared to naive bilinear or nearest-neighbor interpolation, Lanczos3 preserves edges, reduces aliasing, and produces results comparable to desktop software like Photoshop or GIMP — with no quality compromise.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The tool also applies an unsharp mask (amount 80, radius 0.6, threshold 2) after downscaling to counteract the natural softening that occurs when pixels are averaged together. The result is sharper, more detailed output than most browser-based resizers that skip this step.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no-upload matters for image resizing</h3>
            <p className="text-slate-600 leading-relaxed">
              Photos you resize often contain personal content — family faces, home interiors, ID documents, private screenshots, or medical records. Upload-based resizers send your original file to a remote server for processing, and you have no audit trail, no retention guarantee, and no way to verify the file was deleted afterward. This tool runs entirely inside your browser tab. Zero bytes of your image leave your device. The JavaScript code runs locally, produces the resized file, and streams it straight to your download folder.
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
                    <td className="px-4 py-2.5 text-slate-700">Data retention risk</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">None</td>
                    <td className="px-4 py-2.5 text-slate-500">Server logs, CDN caches</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-slate-700">Resampling quality</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Lanczos3 + unsharp mask</td>
                    <td className="px-4 py-2.5 text-slate-500">Varies (often bilinear)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        }
        relatedTools={[
          { name: 'Image Compressor', href: '/image/compress-image', icon: '🗜️' },
          { name: 'Image Color Picker', href: '/image/image-color-picker', icon: '🎨' },
          { name: 'HEIC to JPG', href: '/image/heic-to-jpg', icon: '📱' },
        ]}
      />
    </>
  );
}