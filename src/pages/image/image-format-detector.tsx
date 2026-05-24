import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const ImageFormatDetector = dynamic(() => import('../../components/Image/ImageFormatDetector'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading…</div>,
});

const SLUG = '/image/image-format-detector';

const FAQS = [
  { q: 'Is this safe? Does it upload my image?',
    a: 'No upload. The entire tool runs in your browser using JavaScript. Your image never leaves your device, never touches our server, and is never logged.' },
  { q: 'What image formats can be detected?',
    a: 'The detector identifies PNG, JPEG, GIF, WebP, BMP, AVIF, SVG, ICO, HEIC, and TIFF — plus common variants like HEIF and JPEG 2000 precursor signatures.' },
  { q: 'What is the maximum file size?',
    a: 'You can analyze images up to ~50 MB. Files over 25 MB will be slower, especially on mobile. For very large images beyond 50 MB, try reducing the file first.' },
  { q: 'Will this work on mobile?',
    a: 'Yes, on modern iOS Safari and Chrome for Android. Very large images may be slow on older devices due to memory constraints.' },
  { q: 'How does format detection work?',
    a: 'It reads the first 8–16 bytes of the file — called "magic bytes" — which are a unique signature hardcoded at the start of every image format. PNG always begins with 89 50 4E 47, JPEG with FF D8 FF, GIF with 47 49 46 38, and so on. These bytes are independent of the filename or extension.' },
  { q: 'What are magic bytes exactly?',
    a: 'Magic bytes are a fixed sequence of bytes at the very beginning of a file that identify the format. Think of them as a file’s DNA — they are embedded by the software that creates the image and cannot be changed by simply renaming the file. Operating systems, browsers, and image libraries all rely on magic bytes, not file extensions, to determine how to decode a file.' },
  { q: 'Why would an image file have the wrong extension?',
    a: 'Common scenarios: (1) Someone renamed a PNG to .jpg for compatibility with a website that only accepts JPEG, (2) an app saved a WebP file but retained the original .png filename, (3) a download manager stripped or altered the extension, or (4) a HEIC photo from an iPhone was mislabeled. In all cases, the image still opens because browsers read magic bytes, not the filename.' },
  { q: 'What are the most common format misidentifications?',
    a: 'WebP files saved with a .png extension (happens often with browser-based image editors). iPhone HEIC photos arriving as .jpg attachments (email proxies sometimes alter extensions). SVG icons saved as .png after exporting from design tools. And renamed BMP files pretending to be JPEGs — the detector catches all of these.' },
];

export default function ImageFormatDetectorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Image Format Detector',
    slug: SLUG,
    description: 'Drop any image to reveal its true format, dimensions, and metadata. Detects file type from magic bytes — 100% private, no upload.',
    category: 'UtilitiesApplication',
    featureList: 'PNG JPEG GIF WebP BMP AVIF SVG ICO HEIC TIFF detection, Magic byte analysis, Extension mismatch warning, Dimensions readout, Color depth, No upload',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Image Format Detector — Check True File Type, No Upload | Toolisk</title>
        <meta name="description" content="Drop any image to see its real format, dimensions, and metadata. Detects true file type from magic bytes — 100% client-side, no upload." />
        <meta name="keywords" content="image format detector, check file type, image magic bytes, detect image format no upload, image format checker online private, identify file type, extension mismatch, file inspector" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Image Format Detector | Toolisk" />
        <meta property="og:description" content="Drop any image to reveal its true format from magic bytes. 100% private, no upload." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="🔍"
        title="Image Format Detector"
        tagline="Drop any image to see its real format, dimensions, and metadata. Detects true file type from magic bytes — 100% client-side, no upload."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <ImageFormatDetector />
      </ToolShell>

      <ToolSEOContent
        description="Not sure if that file is really a PNG or actually a WebP? Drop it here and this detector reads the file's magic bytes — the unique binary signature embedded in every image — to tell you the true format, regardless of what the filename claims. It also shows dimensions, MIME type, file size, and color depth. Everything runs in your browser: no upload, no server analysis, no privacy risk."
        features={[
          '🔒 100% client-side — your image never leaves your browser',
          '🔬 Reads magic bytes from first 16 bytes of the file',
          '⚠️ Extension mismatch warning when filename disagrees with content',
          '📐 Shows dimensions (W x H) and color depth',
          '🧬 Detects PNG, JPEG, GIF, WebP, BMP, AVIF, SVG, ICO, HEIC, TIFF',
          '📋 Copy All Info button exports results as formatted text',
        ]}
        steps={[
          { title: 'Drop your image', desc: 'Drag and drop any image file into the upload area, paste from clipboard, or click to browse.' },
          { title: 'Instant analysis', desc: 'The tool reads the first 16 bytes of the file and compares them against known format signatures.' },
          { title: 'Review the report', desc: 'See the true format, declared extension, MIME type, file size, dimensions, and magic bytes hex preview.' },
          { title: 'Copy or re-check', desc: 'Use "Copy All Info" to save the report, or drop another image to analyze it.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why file extensions lie — and how to know the truth</h2>
            <p className="text-slate-600 leading-relaxed">
              File extensions are a naming convention, not a guarantee. Rename <code className="px-1 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-mono">photo.png</code> to <code className="px-1 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-mono">photo.jpg</code> in any file manager and the icon changes — but the bytes inside do not. The browser, the operating system, and any image editor will still open it as a PNG because they read the file&apos;s header, not its name. This detector surfaces that truth: it reads the raw binary signature at the start of the file and reports what the data actually says.
            </p>
            <p className="text-slate-600 leading-relaxed">
              A concrete example: someone sends you <code className="px-1 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-mono">chart.png</code> that won&apos;t open in your PNG-only tool. Drop it into this detector and you see the magic bytes are <code className="px-1 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-mono">52 49 46 46 ... 57 45 42 50</code> — the RIFF/WEBP signature. The file is actually a WebP image that someone (or some app) saved with a .png extension. Knowing this, you can convert it to PNG using a dedicated converter instead of troubleshooting a &quot;corrupt&quot; file that isn&apos;t corrupted at all.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">How magic byte detection works</h3>
            <p className="text-slate-600 leading-relaxed">
              Every image format has a mandated sequence of bytes at position zero. PNG files start with <code className="px-1 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-mono">89 50 4E 47</code> (‰PNG). JPEG files start with <code className="px-1 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-mono">FF D8 FF</code>. GIF files start with <code className="px-1 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-mono">47 49 46 38</code> (GIF8). These are called magic bytes or file signatures, and they are required by the format specification — no valid image file exists without them. This detector reads the first 16 bytes of your file using the browser&apos;s FileReader API, compares them against a lookup table of 10+ format signatures, and reports the match. Because it happens entirely in your browser&apos;s JavaScript runtime, there is zero network activity.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Common scenarios where detection saves the day</h3>
            <p className="text-slate-600 leading-relaxed">
              iPhone HEIC photos arriving as .jpg email attachments, WebP images from design tools saved under .png filenames, AVIF files that a CMS renamed to .jpg, SVG icons exported as .png, and BMP screenshots mislabeled as TIFF — these are everyday realities for anyone who works with images across multiple platforms. The format detector identifies each one in under a second, tells you exactly what went wrong, and gives you the data you need to rename or convert the file correctly.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no-upload matters for image inspection</h3>
            <p className="text-slate-600 leading-relaxed">
              Images can contain sensitive content: personal photos, identity documents, private screenshots, medical scans, financial statements, or confidential business assets. Uploading an image to a &quot;format checker&quot; website means you are sending that private data to an unknown server, where it may be stored, indexed, or analyzed. This tool eliminates that risk entirely. It reads the file&apos;s header bytes directly in your browser tab using the standard FileReader API. No bytes ever travel over the network. The analysis is instant, private, and leaves no trace — just like any file inspection tool should operate.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">Feature</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">This tool</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">Upload-based detectors</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Privacy</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">100% client-side</td>
                    <td className="px-4 py-2.5 text-slate-500">File sent to a server</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Speed</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Instant (no upload wait)</td>
                    <td className="px-4 py-2.5 text-slate-500">Depends on network + queue</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Formats detected</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">10+ via magic bytes</td>
                    <td className="px-4 py-2.5 text-slate-500">Variable, often fewer</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Extension mismatch flag</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Yes, with amber warning</td>
                    <td className="px-4 py-2.5 text-slate-500">Rarely</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-slate-700">Cost</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Free, no sign-up</td>
                    <td className="px-4 py-2.5 text-slate-500">Sometimes freemium</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        }
        relatedTools={[
          { name: 'Image Compressor', href: '/image/compress-image', icon: '🗜️' },
          { name: 'Convert to JPG', href: '/image/convert-to-jpg', icon: '🖼️' },
          { name: 'HEIC to JPG', href: '/image/heic-to-jpg', icon: '📱' },
        ]}
      />
    </>
  );
}
