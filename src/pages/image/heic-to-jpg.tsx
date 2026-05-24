import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const HeicToJpg = dynamic(() => import('../../components/Image/HeicToJpg'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading…</div>,
});

const SLUG = '/image/heic-to-jpg';

const FAQS = [
  { q: 'Is my photo uploaded to a server?', a: 'No. The entire conversion runs in your browser using JavaScript. Your HEIC photos never leave your device, never touch our servers, and are never logged or stored anywhere.' },
  { q: 'What image formats are supported as input?', a: 'HEIC and HEIF files — the default photo format on iPhones and iPads running iOS 11+. You can also convert to JPG. The tool auto-detects the format when you drop the file.' },
  { q: 'What is the maximum file size?', a: 'You can convert HEIC photos up to 50 MB each. Files over 25 MB will show a warning since processing and decoding may be slower on mobile devices.' },
  { q: 'Will this work on my iPhone?', a: 'Absolutely — this tool is designed for mobile first. It works on modern iOS Safari and Chrome for Android. Just open the page, tap to select your HEIC photos from your camera roll, and convert them instantly. Large files (>25 MB) may take a few extra seconds on older iPhones.' },
  { q: 'What is HEIC and why does iPhone use it?', a: 'HEIC (High Efficiency Image Container) is the file format Apple introduced with iOS 11. It uses the HEIF codec to store photos at roughly half the file size of a JPEG at the same quality. iPhones default to HEIC to save storage space. However, HEIC is not universally supported — many websites, apps, and older devices cannot open HEIC files, which is why converting to JPG is often necessary.' },
  { q: 'How do I change iPhone settings to stop taking HEIC photos?', a: 'Go to Settings → Camera → Formats and select "Most Compatible" instead of "High Efficiency." Future photos will be saved as JPEG. Photos already taken in HEIC will remain HEIC — use this tool to convert existing ones. Note that JPEG photos take roughly twice the storage space, so keep HEIC on if storage matters and convert only when you need a JPG.' },
  { q: 'Will I lose image quality when converting HEIC to JPG?', a: 'JPEG is a lossy format, so some quality reduction is inherent. At 95% quality the difference is imperceptible to the human eye. At 85% quality, photos look nearly identical while files are significantly smaller. At 60% quality, you will see minor compression artifacts — best for thumbnails or sharing. The quality slider lets you find the right balance for your use case.' },
  { q: 'Can I convert multiple HEIC photos at once?', a: 'Yes — drop or select multiple HEIC files and they are processed in batch. Each photo converts individually, and when done you can download each JPG one by one or grab a single .zip containing all converted photos with their original filenames (the extension changes from .heic/.heif to .jpg).' },
];

export default function HeicToJpgPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'HEIC to JPG',
    slug: SLUG,
    description: 'Convert iPhone HEIC photos to JPG instantly. Batch conversion, quality slider — 100% client-side, no upload, no sign-up. Free and private.',
    category: 'UtilitiesApplication',
    featureList: 'HEIC to JPG conversion, iPhone photo converter, Batch processing, Quality slider, ZIP download, No upload, No sign-up, Privacy-first, Mobile-first',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>HEIC to JPG — Free iPhone Photo Converter, No Upload | Toolisk</title>
        <meta name="description" content="Convert iPhone HEIC photos to JPG right on your phone. Batch conversion, quality control — all client-side, no upload. Free, private, instant." />
        <meta name="keywords" content="heic to jpg, heic to jpg iphone, convert heic no upload, heic converter online private, heic to jpg free, heif to jpg, iphone photo converter, batch heic to jpg, convert heic to jpg browser" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="HEIC to JPG | Toolisk" />
        <meta property="og:description" content="Convert HEIC photos to JPG right on your phone. No upload, private, free." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="📱"
        title="HEIC to JPG"
        tagline="Convert your iPhone photos to JPG — right on your phone, no upload. Batch convert HEIC and HEIF files with adjustable quality, 100% private."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <HeicToJpg />
      </ToolShell>

      <ToolSEOContent
        description="Stop wrestling with HEIC files. Drop your iPhone photos here, pick your quality, and get standard JPGs back — all inside your browser. No upload, no sign-up, no watermark. Works on your phone and your desktop."
        features={[
          '🔒 100% client-side — your photos never leave your device',
          '📱 Built for iPhone — tap, select photos, convert instantly',
          '🎚️ Adjustable quality slider (60–95%) with Low / Medium / High presets',
          '📦 Batch convert multiple HEIC photos and download as ZIP',
          '🆓 Free forever, no sign-up, no watermark',
          '🖥️ Works on mobile Safari, Chrome, and desktop browsers',
        ]}
        steps={[
          { title: 'Select your HEIC photos', desc: 'Tap "Choose Files" on your phone to pick HEIC photos from your camera roll. Or drag and drop on desktop.' },
          { title: 'Choose JPG quality', desc: 'Use the quality slider to set the JPG compression level. Pick a preset — Low (60%), Medium (80%), or High (95%).' },
          { title: 'Convert', desc: 'Tap "Convert HEIC to JPG" — each photo converts locally in your browser. A progress bar shows you how many are done.' },
          { title: 'Download your JPGs', desc: 'Download each converted JPG individually or grab a single .zip with all of them. Files are named the same as your originals with .jpg extension.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why your iPhone photos need to become JPGs</h2>
            <p className="text-slate-600 leading-relaxed">
              Since iOS 11, iPhones have defaulted to capturing photos in the HEIC (High Efficiency Image Container) format. Apple made this switch because HEIC stores photos at roughly half the file size of a comparable JPEG, saving gigabytes of storage on your device over time. A 12-megapixel iPhone photo that would occupy 3–5 MB as a JPEG typically takes just 1.5–2.5 MB as a HEIC — same visual quality, half the space. For casual photo library management on your phone alone, this is a clear win.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The problem appears the moment you take that photo beyond your Apple ecosystem. Upload a HEIC to a website, attach it to an email for a Windows colleague, or drop it into a PDF document — and you will quickly discover that HEIC support outside of Apple devices and recent macOS is inconsistent at best. WordPress sites, e-commerce platforms, government document portals, and even some social media platforms still reject HEIC uploads or silently fail to display them. That is where this converter steps in: take your HEIC photos and turn them into universally readable JPGs, without ever uploading them to a server.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">How the HEIC-to-JPG conversion works</h3>
            <p className="text-slate-600 leading-relaxed">
              This tool uses the heic2any library, which decodes HEIC/HEIF image data directly in your browser using JavaScript. When you drop a HEIC file, the library reads the internal HEIF container, extracts the compressed image frames, decodes them into raw pixel data, then re-encodes that pixel data as a JPEG at the quality level you choose. Every step — decode, re-encode, and compression — happens inside your browser tab. No bytes are sent over the network. The result is a standard, portable JPEG that opens on any device, any operating system, and any web browser going back decades.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a practical example: a 2.1 MB HEIC photo taken on an iPhone 14, converted at 85% quality through this tool, becomes a 1.8 MB JPEG with virtually no visible quality difference. At 95% quality, the JPG grows to about 3.2 MB but preserves every last detail for archiving or printing. At 60% quality, the file drops to roughly 600 KB — ideal for email attachments or quick sharing where a slightly smaller file matters more than pixel-perfect fidelity.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">iPhone camera settings: HEIC vs. Most Compatible</h3>
            <p className="text-slate-600 leading-relaxed">
              You can change how your iPhone captures photos by going to <strong>Settings → Camera → Formats</strong> and choosing between "High Efficiency" (HEIC) and "Most Compatible" (JPEG). The trade-off is straightforward: Most Compatible means every photo is a universally readable JPEG, but your photo library will use roughly twice the storage. High Efficiency preserves space but forces you to convert to JPEG whenever you need to share outside the Apple ecosystem. There is no right answer — many users keep HEIC on for daily use and convert specific photos on demand with this tool. The important thing is knowing the option exists and having a tool that makes conversion painless when needed.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no-upload matters for photo conversion</h3>
            <p className="text-slate-600 leading-relaxed">
              Your camera roll is deeply personal. It contains faces of loved ones, locations you have visited, sensitive documents you photographed, screenshots of private conversations, and possibly images of ID cards, medical records, or financial documents. Uploading any of these to a "free HEIC converter" website means sending your personal data to a third-party server — and you have no guarantee that the server deletes the file afterward, no audit trail, and no way to verify that the file was not logged, indexed, or mined for data. This tool eliminates that risk entirely by running the conversion inside your browser. The decoded pixel data stays in your device memory, the re-encoded JPEG is written to your download folder, and nothing traverses the network. The only data that moves is the final JPG streaming to your local storage.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">Feature</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">This tool</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">Upload-based converters</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Privacy</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">100% client-side</td>
                    <td className="px-4 py-2.5 text-slate-500">Photos sent to a server</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Speed</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Instant (no upload wait)</td>
                    <td className="px-4 py-2.5 text-slate-500">Upload + convert + download</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Mobile experience</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Works on iPhone Safari</td>
                    <td className="px-4 py-2.5 text-slate-500">Uploads eat mobile data</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-slate-700">Data retention risk</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">None</td>
                    <td className="px-4 py-2.5 text-slate-500">Server logs, CDN caches</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        }
        relatedTools={[
          { name: 'Image Compressor', href: '/image/compress-image', icon: '🗜️' },
          { name: 'Image Resizer', href: '/image/resize-image', icon: '📐' },
          { name: 'Convert to JPG', href: '/image/convert-to-jpg', icon: '🖼️' },
        ]}
      />
    </>
  );
}
