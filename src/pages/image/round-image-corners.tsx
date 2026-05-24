import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const RoundImageCorners = dynamic(() => import('../../components/Image/RoundImageCorners'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading&hellip;</div>,
});

const SLUG = '/image/round-image-corners';

const FAQS = [
  { q: 'Is my image uploaded to a server?', a: 'No. The entire tool runs in your browser using JavaScript. Your image never leaves your device, never touches our servers, and is never logged or stored anywhere.' },
  { q: 'What image formats are supported?', a: 'JPG/JPEG, PNG, WebP, GIF, BMP, and AVIF. The output is always a PNG so that transparency is preserved — even if your original was a JPG.' },
  { q: 'What is the maximum file size?', a: 'You can process images up to 50 MB. Files over 25 MB will show a warning since processing may be slower on mobile devices due to memory limits per browser tab.' },
  { q: 'Will this work on mobile?', a: 'Yes, on modern mobile browsers (Chrome, Safari, Firefox). Very large images (&gt;25 MB) may be slower on phones. The live preview updates as you adjust the corner radius slider so you can fine-tune on any device.' },
  { q: 'What does the radius percentage actually control?', a: 'The radius slider sets the corner radius as a percentage of the shorter image dimension (min of width and height). At 50%, a square image becomes a perfect circle. At 25%, a 1000&times;800 image gets 200 px radius corners. At 0%, there is no rounding.' },
  { q: 'What is the Padding slider for?', a: 'Padding adds a transparent (or colored) border around the image before rounding. This is useful when you want rounded corners with some breathing room between the edge of the image and the clipped curve. Padding up to 50 px is supported.' },
  { q: 'Can I choose the background color?', a: 'Yes. By default the background is transparent — the rounded corner areas show whatever is behind the image. You can also pick White or any custom hex color via the color picker. The background fills the areas outside the rounded corners.' },
  { q: 'Why does the output always export as PNG?', a: 'JPG does not support transparency, so any rounded-corner image with a transparent background would lose the rounded effect when saved as JPG. PNG preserves the alpha channel so the corner curves remain crisp and see-through on any background. If you need JPG, use the white background option first.' },
];

export default function RoundImageCornersPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Round Image Corners',
    slug: SLUG,
    description: 'Add rounded corners to images with adjustable radius, padding, and background color. PNG output with transparency — 100% client-side, no upload.',
    category: 'UtilitiesApplication',
    featureList: 'Adjustable corner radius 0-50%, Padding control, Background color picker, Live preview, PNG output with transparency, No upload, Privacy-first',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Round Image Corners &mdash; Free, No Upload, Private | Toolisk</title>
        <meta name="description" content="Add rounded corners to any image with adjustable radius, padding, and background color. PNG output with transparency. 100% client-side, no upload." />
        <meta name="keywords" content="round image corners, rounded corners image, image border radius, round image corners no upload, rounded corners online private, image corner rounder, free image rounder, css border radius image, circle crop online" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Round Image Corners | Toolisk" />
        <meta property="og:description" content="Add rounded corners to any image in your browser. Adjustable radius, padding, and background color. No upload, free, private." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="⬛"
        title="Round Image Corners"
        tagline="Add rounded corners to any image — adjustable radius, padding, and background color with live preview. 100% client-side, no upload."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <RoundImageCorners />
      </ToolShell>

      <ToolSEOContent
        description="Give your images smooth, rounded corners right in your browser. Dial in the radius as a percentage of the image size, add padding for breathing room, pick a background color, and download a crisp PNG with full transparency. Everything runs locally — your photos never leave your device."
        features={[
          '🔒 100% client-side — your image never leaves your browser',
          '📐 Adjustable radius slider from 0% (sharp) to 50% (full circle)',
          '🖼️ PNG output with alpha channel transparency preserved',
          '🎨 Background color picker: transparent, white, or custom hex',
          '➕ Padding slider to add space around the image before rounding',
          '🆓 Free forever, no sign-up, no watermark',
        ]}
        steps={[
          { title: 'Upload your image', desc: 'Drag and drop or click to browse. Supports JPG, PNG, WebP, GIF, BMP, and AVIF.' },
          { title: 'Adjust the radius', desc: 'Use the slider or preset buttons (Slight / Medium / Fully rounded) to set corner curvature.' },
          { title: 'Fine-tune padding and background', desc: 'Add padding for breathing room and pick a background color if you don&apos;t want transparency.' },
          { title: 'Download the result', desc: 'A live preview shows your changes in real time. Click Download to save the PNG.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why rounded image corners matter</h2>
            <p className="text-slate-600 leading-relaxed">
              Rounded corners are one of the most effective micro-design choices you can make for modern web and app interfaces. Since iOS 7 and Android Lollipop, circles and rounded rectangles have been the dominant shape language of UI. A profile picture with a 50% radius becomes a clean circle. A product thumbnail with a 10&ndash;15% radius feels approachable and human. Research going back to the Bauhaus movement shows that rounded shapes are perceived as safer, friendlier, and more inviting than sharp rectangles &mdash; and that translates directly to conversion rates in e-commerce, social media, and SaaS dashboards.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a concrete example: a 1200&times;800 blog header image with 15% corner rounding (180 px radius on the shorter edge) instantly looks like it belongs in a modern design system. The same image at 25% rounding (200 px radius) reads as a card-style layout that pairs well with Material Design or Tailwind&apos;s default rounded-lg utility. For a 500&times;500 avatar, setting the radius to 50% produces a mathematically perfect circle with no cropped edges &mdash; the same result as CSS border-radius: 50%, but baked into the file so it renders correctly in email clients, PDFs, and platforms that ignore CSS.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Radius as a percentage of image dimensions</h3>
            <p className="text-slate-600 leading-relaxed">
              Most image editors express corner radius in absolute pixels, which means a 20 px radius looks completely different on a 100&times;100 icon than on a 3000&times;2000 photo. This tool expresses the radius as a percentage of the smaller image dimension. A 10% radius on any image produces a corner curve that is 10% of the shorter side &mdash; proportionally consistent across all sizes. This is especially useful when batch-processing assets for a design system where you want every image to have the same proportional rounding regardless of resolution.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Padding and background control</h3>
            <p className="text-slate-600 leading-relaxed">
              The padding slider adds a transparent border around the image before rounding is applied. This is subtle but powerful: without padding, the corner arcs clip directly against the image edge. With 20 px of padding, the rounded corners have 20 px of breathing room, and the underlying background (whether transparent or colored) fills the space. This is exactly the visual effect of a CSS card with padding and border-radius, but rendered into the file itself. Combined with the white or custom-color background picker, you can create standalone rounded images that work in any context &mdash; no CSS required.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no-upload matters</h3>
            <p className="text-slate-600 leading-relaxed">
              Images are among the most personal files on any device. A photo might contain faces of family members, geo-location metadata, private documents, medical records, or sensitive screenshots. Upload-based rounding tools require you to send every pixel of that image to a remote server. You have no way to confirm deletion, no audit log, and no guarantee the image was not cached, indexed, or used for training data. This tool processes every image entirely inside the JavaScript runtime of your browser tab. The Canvas API draws the clipping path, the rounded pixels are rendered locally, and the PNG file streams directly to your download folder. Not a single byte of your image crosses the network.
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
                    <td className="px-4 py-2.5 text-slate-700">Output format</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">PNG with transparency</td>
                    <td className="px-4 py-2.5 text-slate-500">Varies (often JPG only)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-slate-700">Live preview</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Real-time canvas preview</td>
                    <td className="px-4 py-2.5 text-slate-500">Apply then review</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        }
        relatedTools={[
          { name: 'Image Compressor', href: '/image/compress-image', icon: '🗜️' },
          { name: 'Convert to PNG', href: '/image/convert-to-png', icon: '🖼️' },
          { name: 'Image Resizer', href: '/image/resize-image', icon: '📐' },
        ]}
      />
    </>
  );
}
