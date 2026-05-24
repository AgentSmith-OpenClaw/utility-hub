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

const CropImage = dynamic(() => import('../../components/Image/CropImage'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-12 text-slate-500 text-sm">Loading…</div>
  ),
});

const SLUG = '/image/crop-image';

const FAQS = [
  {
    q: 'Is my image uploaded to a server?',
    a: 'No. The entire crop runs in your browser using JavaScript and the Canvas API. Your image never leaves your device, never touches our servers, and is never logged or stored anywhere.',
  },
  {
    q: 'What image formats are supported?',
    a: 'JPG, PNG, WebP, GIF, BMP, and AVIF. The tool auto-detects the format — just drop any image file. You can also choose the output format (JPEG, PNG, or WebP) regardless of the input.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'You can crop images up to 50 MB. Files over 25 MB will show a warning since processing may be slower on mobile devices due to memory limits per browser tab.',
  },
  {
    q: 'Will this work on mobile?',
    a: 'Yes, on modern mobile browsers (Chrome, Safari, Firefox). The drag-to-select crop handles are touch-friendly. Very large images (>25 MB) may be slower on phones due to per-tab memory constraints.',
  },
  {
    q: 'What aspect ratio presets are available?',
    a: 'Free (no constraint), 1:1 Square, 16:9 Landscape, 9:16 Portrait, 4:3 Classic, 4:5 Instagram Post, 820:312 Facebook Cover, and 1280:720 YouTube Thumbnail. Select any preset to lock the crop handles to that ratio.',
  },
  {
    q: 'Can I convert the cropped image to a different format?',
    a: 'Yes. After cropping, you can download as the original format (JPG stays JPG, PNG stays PNG), or convert to JPEG, PNG, or WebP. For JPEG and WebP output you can also adjust the quality from 1–100%.',
  },
  {
    q: 'How precise is the crop?',
    a: 'The crop uses the browser Canvas API to extract exactly the pixels within the selection rectangle, preserving the original resolution of the cropped area. No resampling or quality loss occurs beyond what the format and quality settings dictate.',
  },
  {
    q: 'Does the crop tool work offline?',
    a: 'Once the page is loaded and the crop editor component is cached by your browser, the tool works entirely offline. No internet connection is needed — the image is processed purely in your browser tab.',
  },
];

export default function CropImagePage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Crop Image',
    slug: SLUG,
    description:
      'Crop images with drag selection, preset aspect ratios (1:1, 16:9, 4:3, 9:16), and social media presets. 100% client-side, no upload, private.',
    category: 'UtilitiesApplication',
    featureList:
      'Drag-to-crop selection, Aspect ratio lock (Free, 1:1, 16:9, 9:16, 4:3, 4:5), Social media presets (Facebook Cover, YouTube Thumbnail), Format conversion (JPEG, PNG, WebP), Quality slider, No upload, No sign-up, Privacy-first',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Crop Image — Free-form &amp; Preset Ratios, No Upload | Toolisk</title>
        <meta
          name="description"
          content="Crop images with drag selection, preset ratios (1:1, 16:9, 4:3, 9:16), and social media presets. 100% client-side, no upload, private. Free."
        />
        <meta
          name="keywords"
          content="crop image, crop image no upload, image crop tool, crop image online private, free image cropper, aspect ratio crop, crop photo, crop jpg png, social media crop, square crop"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Crop Image | Toolisk" />
        <meta
          property="og:description"
          content="Crop images in your browser with drag selection and preset ratios. No upload, private, free."
        />
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
        icon="✂️"
        title="Crop Image"
        tagline="Crop images with drag selection and preset aspect ratios — 1:1, 16:9, 4:3, 9:16, and social media presets. 100% client-side, no upload."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <CropImage />
      </ToolShell>

      <ToolSEOContent
        description="Crop images precisely in your browser with an interactive drag-to-select crop overlay. Choose from eight aspect ratio presets — Free, Square, Landscape, Portrait, Instagram, Facebook Cover, YouTube Thumbnail — or drag freely. Convert the result to JPEG, PNG, or WebP with adjustable quality. Everything runs client-side: your image never leaves your device."
        features={[
          '🔒 100% client-side — your image never leaves your browser',
          '✂️ Drag-to-select crop with interactive handles and move',
          '📐 8 aspect ratio presets: Free, 1:1, 16:9, 9:16, 4:3, 4:5, FB Cover, YT Thumb',
          '🖼️ Output as JPEG, PNG, or WebP with quality control',
          '📱 Touch-friendly crop handles for mobile browsers',
          '🆓 Free forever, no sign-up, no watermark',
        ]}
        steps={[
          {
            title: 'Upload your image',
            desc: 'Drag and drop or click to browse. Supports JPG, PNG, WebP, GIF, BMP, and AVIF up to 50 MB.',
          },
          {
            title: 'Select crop area',
            desc: 'Drag the corner handles to define the crop area. Drag inside the box to reposition the selection.',
          },
          {
            title: 'Pick aspect ratio',
            desc: 'Choose from 8 presets — Free, Square, 16:9, 4:3, Instagram, Facebook Cover, YouTube Thumbnail — to lock the ratio.',
          },
          {
            title: 'Download result',
            desc: 'Pick JPEG, PNG, or WebP output, set quality, then click Crop Image. Your cropped file stays exactly as selected.',
          },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why image cropping matters</h2>
            <p className="text-slate-600 leading-relaxed">
              Every platform has a different aspect ratio requirement. Instagram posts need 1:1 or
              4:5, Stories want 9:16, Facebook cover photos require 820:312, and YouTube thumbnails
              demand 1280:720. Cropping by eye in a photo editor leads to off-center compositions,
              accidentally clipped subjects, and multiple export-and-check cycles. A dedicated crop
              tool with preset ratios lets you frame the shot once and export with confidence that
              it will display exactly as intended on the target platform.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a concrete example: a 4000 × 3000 smartphone photo (4:3) needs to become a
              YouTube thumbnail at 1280:720 (16:9). Without a ratio lock, you might crop 2800
              × 1575 — close but not exact, causing YouTube to re-crop or add black bars. With the
              16:9 preset locked, you drag the crop box to frame the subject and the tool enforces
              the exact 16:9 ratio, producing a pixel-perfect 1280 × 720 output ready for upload.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">
              Free-form vs. preset cropping — when to use each
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Free-form cropping (no aspect ratio constraint) is ideal when the output destination
              has flexible dimensions — cropping a photo for your personal website hero, trimming
              distracting background elements, or removing a timestamp overlay. Preset cropping is
              the right choice when you are targeting a specific platform: Instagram post (1:1 or
              4:5), Facebook cover (820:312), YouTube thumbnail (1280:720), or 16:9 widescreen for
              presentations and blog headers. The tool supports both modes seamlessly — toggle any
              preset or go free-form with one click.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">
              Social media crop presets explained
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Understanding platform aspect ratios saves time and eliminates rework. A 1:1 square
              crop is the universal safe format — it renders identically in feeds on Instagram,
              Facebook, LinkedIn, and Twitter. The 4:5 Instagram Portrait ratio (1080 × 1350) takes
              up more vertical screen real estate and often drives higher engagement. Facebook cover
              photos at 820:312 are extremely wide — crop carefully to keep the focal subject
              centered, as Facebook crops differently on mobile vs desktop. YouTube thumbnails at
              1280:720 (16:9) are the first thing viewers see; a well-cropped thumbnail with the
              subject offset for the video title overlay is proven to increase click-through rates.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">
              Why no-upload matters for image cropping
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Photos are personal. They contain faces, locations, private moments, ID documents,
              sensitive screenshots, and family memories. Uploading them to an online cropper means
              trusting an unknown third party with that content — with no audit trail, no retention
              guarantee, and no way to verify deletion. This tool crops images entirely inside your
              browser&apos;s JavaScript runtime using the Canvas API. The image is drawn onto a
              canvas at the exact crop coordinates, exported at your chosen quality, and streamed
              directly to your download folder. Zero bytes of your original or cropped image leave
              your device.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">
                      Feature
                    </th>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">
                      This tool
                    </th>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">
                      Upload-based tools
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Privacy</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">
                      100% client-side
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">
                      Image sent to a server
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Speed</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">
                      Instant (no upload)
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">
                      Upload + process + download
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Aspect presets</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">
                      8 presets + free-form
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">
                      Varies, often limited
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-slate-700">Data retention risk</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">None</td>
                    <td className="px-4 py-2.5 text-slate-500">
                      Server logs, CDN caches
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        }
        relatedTools={[
          { name: 'Image Resizer', href: '/image/resize-image', icon: '📐' },
          { name: 'Rotate Image', href: '/image/rotate-image', icon: '🔄' },
          { name: 'Image Compressor', href: '/image/compress-image', icon: '🗜️' },
        ]}
      />
    </>
  );
}
