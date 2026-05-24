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

const PixelateImage = dynamic(() => import('../../components/Image/PixelateImage'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-12 text-slate-500 text-sm">Loading...</div>
  ),
});

const SLUG = '/image/pixelate-image';

const FAQS = [
  {
    q: 'Is my image uploaded to a server?',
    a: 'No. Everything runs in your browser using the Canvas API. Your image never leaves your device, never touches our servers, and is never logged or stored anywhere.',
  },
  {
    q: 'What image formats are supported?',
    a: 'JPG, PNG, WebP, GIF, BMP, and AVIF. The tool auto-detects the format — just drop any image file. The output preserves your original format.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'You can process images up to 50 MB. Files over 25 MB will show a warning since processing may be slower on mobile devices due to memory limits per browser tab.',
  },
  {
    q: 'Will this work on mobile?',
    a: 'Yes, on modern mobile browsers (Chrome, Safari, Firefox). Touch-drag selection works on phones and tablets. Very large images (>25 MB) may be slower due to per-tab memory constraints.',
  },
  {
    q: 'What does the pixelation mode do?',
    a: 'Pixelation reduces the resolution of a selected area by grouping neighboring pixels into larger blocks of a single average color — creating the classic "blocky" censorship effect you see on news footage, reality TV, and redacted documents. The block size slider controls how large each block is: 1 is barely visible, 50 turns the entire selection into a handful of large colored squares.',
  },
  {
    q: 'How is pixelation different from blur?',
    a: 'Blur softens the image by averaging each pixel with its neighbors within a given radius, producing a smooth, cloudy obscuring effect similar to a camera lens out of focus. Pixelation creates a chunky, mosaic-style block effect. Blur preserves some color gradients and shapes but makes details unreadable; pixelation completely destroys any recognizable detail within each block. Choose pixelation for a clear "this is redacted" signal and blur for a softer privacy mask.',
  },
  {
    q: 'Can I use this to blur faces or personal data before posting online?',
    a: 'Yes — that is one of the most common use cases. You can draw a rectangle over one or more faces, license plates, addresses, phone numbers, or credit card details in a screenshot and apply pixelation or blur. Because the tool runs entirely in your browser, the original, uncensored image never leaves your device. This is especially important for journalists, whistleblowers, and anyone sharing photos taken in public or screenshots containing sensitive information.',
  },
  {
    q: 'What happens if I make a mistake? Can I undo?',
    a: 'Yes. The Undo button restores the image to its original state, removing all pixelation and blur from every applied area. You can also draw a new selection over a previously modified area and re-apply a different intensity or switch between pixelate and blur to fine-tune the result before downloading.',
  },
];

export default function PixelateImagePage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Pixelate / Blur Image',
    slug: SLUG,
    description: 'Selectively pixelate or blur parts of an image. Draw a rectangle to obscure faces, license plates, or sensitive data — 100% client-side, no upload.',
    category: 'UtilitiesApplication',
    featureList: 'Drag-to-select area, Pixelate mode (block size 1-50), Blur mode (radius 1-20), Select All, Undo, No upload, No sign-up, Privacy-first',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Pixelate Image — Blur Faces &amp; Sensitive Data, No Upload | Toolisk</title>
        <meta
          name="description"
          content="Selectively pixelate or blur parts of an image. Draw a rectangle to obscure faces, license plates, or sensitive data — 100% client-side, no upload. Free and private."
        />
        <meta
          name="keywords"
          content="pixelate image no upload, blur face online free, pixelate image online private, blur image parts, censor photo, pixelate face, redact image, pixelate photo browser"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Pixelate / Blur Image | Toolisk" />
        <meta
          property="og:description"
          content="Selectively pixelate or blur parts of an image in your browser. No upload, private, free. Obscure faces and sensitive data instantly."
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
        icon="🔲"
        title="Pixelate / Blur Image"
        tagline="Selectively pixelate or blur parts of an image — draw a rectangle to obscure faces, license plates, or sensitive data. 100% client-side, no upload."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <PixelateImage />
      </ToolShell>

      <ToolSEOContent
        description="Obscure faces, license plates, addresses, credit card numbers, or any sensitive data inside your images — right in your browser. Draw a rectangle over the area you want to hide, choose pixelation (mosaic blocks) or blur (soft Gaussian smoothing), set the intensity, and download the censored result. Nothing is uploaded: the original and modified images stay entirely on your device."
        features={[
          '🔒 100% client-side — your images never leave your browser',
          '🧱 Pixelate mode with adjustable block size (1–50)',
          '🌫️ Blur mode with adjustable radius (1–20)',
          '✏️ Drag-to-select any rectangular region on the image',
          '↩️ Undo button to restore the original image at any time',
          '🆓 Free forever, no sign-up, no watermark',
        ]}
        steps={[
          { title: 'Upload your image', desc: 'Drag and drop or click to browse. Supports JPG, PNG, WebP, GIF, BMP, and AVIF up to 50 MB.' },
          { title: 'Select the area to censor', desc: 'Draw a rectangle over the face, license plate, or text you want to hide. Use Select All for the entire image.' },
          { title: 'Choose mode and intensity', desc: 'Pick Pixelate (blocky mosaic) or Blur (smooth haze). Adjust the slider to control how strong the effect is.' },
          { title: 'Apply and download', desc: 'Click Apply to Selection, review the result, then download your censored image. Use Undo to fix mistakes.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Why you need a privacy-first image censor
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Every day, millions of people share photos online containing information they
              didn&apos;t mean to broadcast: a screenshot with a visible email address, a travel
              photo with a stranger&apos;s face clearly recognizable, a receipt with a partial
              credit card number, a work document with confidential figures. Once posted, that
              data is scraped, indexed, and nearly impossible to fully retract. A dedicated
              pixelation and blur tool lets you censor just the sensitive parts — leaving the
              rest of the image intact — before it ever leaves your computer.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Consider a journalist sharing a screenshot of a leaked document. The source&apos;s
              name and phone number appear at the top. Applying a pixelation block over that
              header — a 300 × 80 pixel rectangle at block size 15 — renders the identifying
              information completely unreadable while preserving the document body in full
              clarity. The entire operation takes seconds and runs locally in the browser tab;
              neither the original nor the censored image is transmitted anywhere.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">
              Pixelation vs. blur — which one should you choose?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Pixelation (also called mosaic or block filters) replaces each group of pixels with
              a single average color, creating large square blocks. The effect is immediately
              recognizable as intentional censorship — it signals to viewers that the area was
              deliberately redacted. This is the style used by news organizations when masking
              faces in crime footage, by Google Street View to blur license plates and faces, and
              by government agencies releasing redacted documents under FOIA. Blur, by contrast,
              softens pixel transitions to create a smooth, out-of-focus haze that preserves
              overall shapes and color gradients while making fine details unrecognizable. Blur
              feels less aggressive visually and is often preferred for hiding background faces in
              vacation photos or softening text that should be illegible but not jarring to the
              viewer.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">
              Common use cases — photos, screenshots, and documents
            </h3>
            <p className="text-slate-600 leading-relaxed">
              The most frequent use case is obscuring faces in photos shared to social media or
              public forums — children, bystanders, or people who didn&apos;t consent to being in
              the shot. License plate blurring is essential for anyone selling a car online or
              posting dashcam footage. Screenshots are especially dangerous: they often contain
              email addresses in browser tab titles, phone numbers in text messages, company
              names in Slack channels, or API keys in terminal output. A quick rectangle select
              over those elements and one click makes the screenshot safe to share. Finally,
              redacting documents — contracts, invoices, ID cards, medical records — by pixelating
              names, account numbers, and signatures before sending them via email or messaging
              apps is a simple but powerful privacy habit.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">
              Why no-upload matters for image censoring
            </h3>
            <p className="text-slate-600 leading-relaxed">
              The entire point of censoring an image is to hide sensitive information from the
              wrong people. Uploading that same image — with the sensitive information still fully
              visible — to a server-based blur tool is self-defeating. The server now has
              unrestricted access to the exact data you&apos;re trying to protect. It may store a
              copy in a CDN cache, write the file to a processing directory that isn&apos;t
              cleaned up, or log metadata including the file name, dimensions, and timestamp. Any
              of these is a privacy leak — and with server-based tools, you have no way to audit
              or verify what happened. This tool does everything in your browser&apos;s Canvas API
              and JavaScript runtime. The original pixels, the selection coordinates, and the
              modified output all exist solely in your device&apos;s memory. Nothing crosses a
              network boundary.
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
                      Sensitive image uploaded to server
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Selection</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">
                      Drag-to-select any rectangle
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">
                      Often applies to entire image only
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Effects</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">
                      Pixelate + Blur with adjustable intensity
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">
                      Usually blur-only, single strength
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-slate-700">Original file exposure</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Never leaves your device</td>
                    <td className="px-4 py-2.5 text-slate-500">
                      Stored on external servers, often indefinitely
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        }
        relatedTools={[
          { name: 'Image Compressor', href: '/image/compress-image', icon: '🗜️' },
          { name: 'Image Watermark', href: '/image/image-watermark', icon: '💧' },
          { name: 'Crop Image', href: '/image/crop-image', icon: '✂️' },
        ]}
      />
    </>
  );
}
