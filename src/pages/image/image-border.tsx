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

const ImageBorder = dynamic(() => import('../../components/Image/ImageBorder'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading…</div>,
});

const SLUG = '/image/image-border';

const FAQS = [
  {
    q: 'Is my image uploaded to a server?',
    a: 'No. The entire border rendering runs in your browser using the JavaScript Canvas API. Your image never leaves your device, never touches our servers, and is never logged or stored anywhere.',
  },
  {
    q: 'What image formats are supported?',
    a: 'JPG, PNG, WebP, GIF, BMP, and AVIF. The tool auto-detects the format — just drop any image file. You can choose to output as original format, JPEG, or PNG regardless of the input.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'You can add borders to images up to 50 MB. Files over 25 MB will show a warning since processing may be slower on mobile devices due to per-tab memory constraints.',
  },
  {
    q: 'Will this work on mobile?',
    a: 'Yes, on modern mobile browsers (Chrome, Safari, Firefox). Very large images (&gt;25 MB) may be slower on phones due to per-tab memory constraints. For best results, resize your image first.',
  },
  {
    q: 'What border styles can I add?',
    a: 'Three styles: Solid (a single solid-color frame around your image), Double (two concentric rectangular borders for a classic matted look), and Gradient (a smooth color transition from one color to another across the frame).',
  },
  {
    q: 'What does the padding control do?',
    a: 'Padding creates a gap between the image and the inner edge of the border — think of it like a mat in a photo frame. Setting padding to 20px with a white border gives the classic gallery-mat look.',
  },
  {
    q: 'Can I change the border color?',
    a: 'Yes. You can use the color picker to choose any color, or type a hex value. For gradient borders, you pick two colors and the frame smoothly transitions between them diagonally.',
  },
  {
    q: 'What is the Polaroid preset?',
    a: 'The Polaroid preset applies a 30px white border around your image, giving it the iconic instant-photo look. Combined with padding, you can achieve the classic bottom-heavy Polaroid frame that was popularized by instant cameras.',
  },
];

export default function ImageBorderPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Image Border',
    slug: SLUG,
    description: 'Add solid, double, or gradient borders to any image — adjustable width, color, and padding. 100% client-side, no upload, private.',
    category: 'UtilitiesApplication',
    featureList: 'Solid double and gradient borders, Adjustable width 1–100px, Color picker, Padding control, Presets, Original JPEG PNG output, No upload, No sign-up',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Image Border — Add Solid, Double, or Gradient Frame, No Upload | Toolisk</title>
        <meta
          name="description"
          content="Add solid, double, or gradient borders to any image in your browser. Adjustable width, color, padding — 100% client-side, no upload. Free and private."
        />
        <meta
          name="keywords"
          content="image border, add border to image, image frame, image border no upload, add frame to photo online private, gradient border, solid border, double border, Polaroid frame, picture border tool free"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Image Border | Toolisk" />
        <meta property="og:description" content="Add solid, double, or gradient borders to any image in your browser. No upload, private, free." />
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
        icon="🖼️"
        title="Image Border"
        tagline="Add solid, double, or gradient borders to any image — adjustable width, color, padding. 100% client-side, no upload."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <ImageBorder />
      </ToolShell>

      <ToolSEOContent
        description="Frame your images with borders right in your browser. Choose solid, double, or gradient styles, dial in the width (1–100px), pick any color, add padding for a gallery-mat effect, and download in your original format or as JPEG/PNG. Everything runs client-side — your photos never leave your device."
        features={[
          '🔒 100% client-side — your images never leave your browser',
          '🎨 Three border styles — solid, double, and gradient',
          '🎚️ Adjustable border width from 1 to 100 pixels',
          '📏 Padding control for gallery-mat spacing effects',
          '🎯 Quick presets — Thin black, Photo frame, Polaroid',
          '🆓 Free forever, no sign-up, no watermark',
        ]}
        steps={[
          { title: 'Upload your image', desc: 'Drag and drop or click to browse. Supports JPG, PNG, WebP, GIF, BMP, and AVIF up to 50 MB.' },
          { title: 'Choose border style and color', desc: 'Pick Solid, Double, or Gradient. Use the color picker to select your border color — or two colors for gradients.' },
          { title: 'Adjust width and padding', desc: 'Set border thickness (1–100px) and padding (0–50px) to get the exact framing look you want.' },
          { title: 'Download', desc: 'Preview your framed image live, then click Apply & Download to save in your original format or as JPEG/PNG.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why add a border to your images?</h2>
            <p className="text-slate-600 leading-relaxed">
              Borders do more than decorate — they separate an image from its surrounding context, drawing the viewer&apos;s eye directly to the subject. A thin 2px black line creates a clean, editorial boundary that works on light and dark backgrounds alike. A wide white frame invokes gallery prints and museum displays. Gradient borders bring a polished, modern look that fits brand assets and social media templates. Whatever the goal, adding a border is one of the quickest ways to make an image feel finished and intentional rather than a raw camera dump.
            </p>
            <p className="text-slate-600 leading-relaxed">
              For photographers, borders unify a portfolio: a consistent 20px white frame across every image signals curation and professionalism. For e-commerce sellers, a thin neutral border separates product photos from the page background on every device, ensuring the product is always distinguishable — critical when dark products sit on dark-mode storefronts or light goods blend into white-themed listings. A curated Instagram carousel with a uniform gradient frame can mean the difference between a casual scroll and a profile visit.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Solid, double, and gradient — choose the right style</h3>
            <p className="text-slate-600 leading-relaxed">
              A solid border is the workhorse — clean, crisp, and fast. Use it when you need a straightforward frame that recedes behind the image. The double border creates a classic matted look by drawing two concentric rectangles: an outer band of color and an inner white gap before the image itself, simulating the visual depth of a physical frame. The gradient border is the showpiece — two colors blend diagonally across the frame for a dynamic, modern effect. Pick a brand palette (e.g. sky blue to navy) and every export carries a touch of identity.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Padding: the secret to a professional frame</h3>
            <p className="text-slate-600 leading-relaxed">
              Padding is the space between the image edge and the inner border — the digital equivalent of a mat board in physical framing. Without padding, the border hugs the image tightly like a phone case. With 20–30px of padding and a white border, you get the gallery-mat aesthetic. With a dark border and no padding, you get a high-contrast editorial crop. The slider lets you dial from zero (tight frame) to 50px (generous gallery spacing), and the live preview updates instantly so you see exactly what you get before downloading.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no-upload matters for image framing</h3>
            <p className="text-slate-600 leading-relaxed">
              The photos you frame may be personal (family portraits, travel shots), professional (client deliverables, real estate photos), or sensitive (ID documents, signed contracts as images). Uploading them to a third-party border tool means handing over raw files to infrastructure you do not control. Most &quot;free&quot; online border tools operate on a server-upload model — your image travels to their server, gets processed, and is sent back. You cannot verify deletion, audit access logs, or prevent indexing. This tool renders every border inside your browser&apos;s Canvas API. The original image file and the framed result stay on your device. There is zero network traffic carrying your pixels — the only data movement is the final download to your local file system.
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
                    <td className="px-4 py-2.5 text-slate-700">Border styles</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Solid, double, gradient</td>
                    <td className="px-4 py-2.5 text-slate-500">Usually solid only</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Padding control</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Mat effect with slider</td>
                    <td className="px-4 py-2.5 text-slate-500">Often fixed or absent</td>
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
          { name: 'Image Watermark', href: '/image/image-watermark', icon: '💧' },
          { name: 'Image Resizer', href: '/image/resize-image', icon: '📐' },
        ]}
      />
    </>
  );
}
