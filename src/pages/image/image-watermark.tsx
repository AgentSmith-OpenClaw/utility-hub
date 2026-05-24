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

const ImageWatermark = dynamic(() => import('../../components/Image/ImageWatermark'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading…</div>,
});

const SLUG = '/image/image-watermark';

const FAQS = [
  {
    q: 'Is my image uploaded to a server?',
    a: 'No. The entire watermarking runs in your browser using JavaScript Canvas API. Your image never leaves your device, never touches our servers, and is never logged or stored anywhere.',
  },
  {
    q: 'What image formats are supported?',
    a: 'JPG, PNG, WebP, GIF, BMP, and AVIF. The tool auto-detects the format — just drop any image file. The watermarked output preserves your original format.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'You can watermark images up to 50 MB. Files over 25 MB will show a warning since processing may be slower on mobile devices due to per-tab memory constraints.',
  },
  {
    q: 'Will this work on mobile?',
    a: 'Yes, on modern mobile browsers (Chrome, Safari, Firefox). Very large images (>25 MB) may be slower on phones due to per-tab memory constraints. For best results, resize your image first.',
  },
  {
    q: 'What kind of watermark can I add?',
    a: 'You can add text watermarks (custom text, font size, color, opacity) or image watermarks (logo, signature, icon — PNG with transparency recommended). Both support nine position options and a tiled repeat mode for full-image coverage.',
  },
  {
    q: 'Can I use a transparent PNG as my watermark image?',
    a: 'Yes. PNG files with transparency work best as image watermarks — the alpha channel is preserved, so your logo or icon looks clean and professional over any background. Set opacity to blend it further.',
  },
  {
    q: 'What does the Tiled mode do?',
    a: 'Tiled mode repeats the watermark across the entire image at regular intervals, creating a pattern that covers every part of the photo. This is the strongest protection against cropping — even if someone crops the image, the watermark is still visible somewhere on the remaining area.',
  },
  {
    q: 'Does this tool support batch watermarking?',
    a: 'Currently, you process one image at a time. The tool is optimized for quick, single-image workflows — perfect for photographers, designers, and content creators who watermark images individually before publishing.',
  },
];

export default function ImageWatermarkPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Image Watermark',
    slug: SLUG,
    description: 'Add text or image watermarks to photos — control opacity, position, font size, and tiling. 100% client-side, no upload, private.',
    category: 'UtilitiesApplication',
    featureList: 'Text and image watermarks, Nine position options, Tiled repeat mode, Opacity control, Font size and color, Logo watermark with scale, Live preview, No upload, No sign-up',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Image Watermark — Text or Image Overlay, No Upload | Toolisk</title>
        <meta
          name="description"
          content="Add text or image watermarks to your photos — control opacity, position, font, color, and tiling. 100% client-side, no upload. Protect your images privately."
        />
        <meta
          name="keywords"
          content="image watermark, add watermark to image, watermark image no upload, text watermark, logo watermark, watermark tool online private, protect images, tiled watermark free"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Image Watermark | Toolisk" />
        <meta property="og:description" content="Add text or image watermarks to your photos in your browser. No upload, private, free. Tiled mode included." />
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
        icon="💧"
        title="Image Watermark"
        tagline="Add text or image watermarks to your photos — control opacity, position, font, and tiling. 100% client-side, no upload."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <ImageWatermark />
      </ToolShell>

      <ToolSEOContent
        description="Protect your images with watermarks — add custom text or logo overlays right in your browser. Control opacity, font size, color, position (nine placement options), and tiled repeat for full-image coverage. No upload, no sign-up, your photos never leave your device."
        features={[
          '🔒 100% client-side — your images never leave your browser',
          '💬 Add text watermarks with custom font size, color, and opacity',
          '🖼️ Add image/logo watermarks with scale and opacity control',
          '📍 Nine position options — top, middle, bottom × left, center, right',
          '🔄 Tiled mode repeats the watermark across the entire image',
          '🆓 Free forever, no sign-up, no watermark added by us',
        ]}
        steps={[
          {
            title: 'Upload your image',
            desc: 'Drag and drop or click to browse. Supports JPG, PNG, WebP, GIF, BMP, and AVIF up to 50 MB.',
          },
          {
            title: 'Choose watermark type',
            desc: 'Select Text (custom text with font, color, opacity) or Image (upload a logo or icon as watermark).',
          },
          {
            title: 'Set position and style',
            desc: 'Pick a position from the 3×3 grid or enable Tiled mode to repeat the watermark across the image.',
          },
          {
            title: 'Download',
            desc: 'See the live preview, click Apply Watermark, then download your watermarked image instantly.',
          },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Why watermark your images? A guide to copyright protection
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Anyone can right-click and save an unprotected image from the web. Watermarking is the simplest, most
              effective deterrent against unauthorized use — it visibly marks your work as yours without destroying
              its visual appeal. A well-placed watermark doesn&apos;t just protect; it promotes. Every time your
              watermarked image gets shared, your name, brand, or website travels with it, turning viewers into
              potential clients.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Photographers, designers, and e-commerce sellers face a common problem: their images get scraped,
              reposted, and reused without credit. A watermark containing &quot;© 2026 Your Name&quot; or a small
              logo in the corner tells viewers who owns the work — and where to find more. Even if the image is
              screenshotted, the watermark stays. The tiled mode takes this further: instead of one corner mark,
              dozens of overlapping watermarks cover the image end-to-end, making cropping or masking
              impractical.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Consider a product photographer shooting 50 listings for an online store. Without watermarks, a
              competitor can copy the catalog in minutes. With a semi-transparent logo applied across all images
              at 25% opacity using the tiled mode, each product photo becomes branded content — beautiful to
              look at but impossible to steal cleanly. The watermark is visible enough to claim ownership yet
              subtle enough not to distract from the product itself.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">
              Text vs. image watermarks — which should you use?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Text watermarks are quick, zero-file-size-overhead, and perfect for simple copyright lines,
              &quot;DRAFT&quot; stamps, or &quot;CONFIDENTIAL&quot; overlays. You type a phrase, pick a font
              size (8–72 px), choose a color, slide the opacity to taste, and position it anywhere on the image
              — top-left corner for subtle branding or center-screen at 50% opacity for a review proof. Image
              watermarks use an actual graphic file (like your logo PNG) and give you scale control — set it to
              40% of original size for a discreet brand mark or 80% for a prominent overlay. Transparent PNGs
              work best because the background blends naturally.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no-upload matters for watermarking</h3>
            <p className="text-slate-600 leading-relaxed">
              The images you watermark are often your most valuable digital assets — original photos, design
              drafts, unreleased product shots, or client deliverables under NDA. Uploading them to a
              third-party watermarking service is like handing your negatives to a stranger. You have no control
              over whether the server retains a copy, logs metadata, or trains an AI model on your
              compositions. This tool processes everything inside your browser tab. Your image pixels never
              cross a network boundary. The Canvas API handles compositing locally, and the final watermarked
              file streams straight to your hard drive — no intermediary, no exposure, no risk.
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
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">100% client-side</td>
                    <td className="px-4 py-2.5 text-slate-500">Images sent to a server</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Watermark types</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Text + image (logo)</td>
                    <td className="px-4 py-2.5 text-slate-500">Often text-only</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Tiled mode</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Full-image repeat pattern</td>
                    <td className="px-4 py-2.5 text-slate-500">Rarely available</td>
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
          { name: 'Image Resizer', href: '/image/resize-image', icon: '📐' },
          { name: 'Pixelate / Blur', href: '/image/pixelate-image', icon: '🔲' },
        ]}
      />
    </>
  );
}
