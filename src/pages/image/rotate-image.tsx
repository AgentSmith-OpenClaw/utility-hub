import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const RotateImage = dynamic(() => import('../../components/Image/RotateImage'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading&hellip;</div>,
});

const SLUG = '/image/rotate-image';

const FAQS = [
  { q: 'Is my image uploaded to a server?', a: 'No. The entire rotation runs in your browser using JavaScript. Your image never leaves your device, never touches our servers, and is never logged or stored anywhere.' },
  { q: 'What image formats are supported?', a: 'JPG/JPEG, PNG, WebP, GIF, and BMP. The output preserves your original format — JPGs stay JPG, PNGs stay PNG, and so on.' },
  { q: 'What is the maximum file size?', a: 'You can rotate images up to 50 MB. Files over 25 MB will show a warning since processing may be slower on mobile devices due to memory limits per browser tab.' },
  { q: 'Will this work on mobile?', a: 'Yes, on modern mobile browsers (Chrome, Safari, Firefox). Very large images (&gt;25 MB) may be slower on phones due to per-tab memory constraints. The CSS preview rotates instantly regardless of file size.' },
  { q: 'What is EXIF orientation and does this tool handle it?', a: 'EXIF orientation is metadata that cameras embed to tell viewers which way to display a photo — it is why a portrait phone shot sometimes appears sideways on desktop. The canvas-based rotation in this tool physically rotates the pixel data, baking the orientation into the image itself so it displays correctly everywhere without relying on EXIF tags.' },
  { q: 'Can I rotate by any angle, not just 90&deg; steps?', a: 'Yes. You can rotate by any angle from 0&deg; to 360&deg; using the free-rotate slider. The 90&deg;, 180&deg;, and Reset buttons jump to common angles instantly. The live CSS preview shows the rotation in real time before you apply it.' },
  { q: 'Will rotating change the quality of my image?', a: 'For JPEG and WebP images, each rotation re-encodes the image at 92% quality — a minimal loss that is imperceptible for a single rotation. PNGs are lossless so quality is fully preserved. Repeated rotations can accumulate slight artifacts, so we recommend rotating only once at the correct angle. The live preview lets you get the angle right before applying.' },
  { q: 'Does rotation change the canvas size?', a: 'Yes. When you rotate by an angle that is not a multiple of 90&deg;, the bounding box grows to fit the rotated image without cropping. The tool calculates the new width and height using the formula newWidth = |w&middot;cos&theta;| + |h&middot;sin&theta;|, so no part of your image is clipped. Non-transparent backgrounds are filled with white.' },
];

export default function RotateImagePage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Rotate Image',
    slug: SLUG,
    description: 'Rotate images 90&deg;, 180&deg;, 270&deg;, or by any custom angle with live preview. JPG, PNG, WebP — 100% client-side, no upload.',
    category: 'UtilitiesApplication',
    featureList: 'Rotate by any angle 0-360 degrees, 90/180/270 presets, Live CSS preview, EXIF orientation fix, No upload, No sign-up, Privacy-first',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Rotate Image — 90&deg; 180&deg; 270&deg; or Any Angle, No Upload | Toolisk</title>
        <meta name="description" content="Rotate images 90&deg;, 180&deg;, 270&deg;, or by any custom angle with live preview. JPG, PNG, WebP — 100% client-side, no upload. Private and free." />
        <meta name="keywords" content="rotate image, rotate image no upload, rotate image online, free rotate image, image rotation tool, fix image orientation, rota&ccedil;&atilde;o de imagem, 90 degrees rotate, 180 degrees rotate" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Rotate Image | Toolisk" />
        <meta property="og:description" content="Rotate images 90&deg;, 180&deg;, 270&deg;, or by any custom angle in your browser. No upload, free, private." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="🔄"
        title="Rotate Image"
        tagline="Rotate images 90&deg;, 180&deg;, 270&deg;, or by any custom angle — live CSS preview, instant download. No upload, no sign-up."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <RotateImage />
      </ToolShell>

      <ToolSEOContent
        description="Fix sideways photos and apply custom rotations right in your browser. Drop an image, dial in the angle with the slider or one-click 90&deg;/180&deg; presets, see a live preview, and download the rotated result. Everything runs locally — zero bytes leave your device."
        features={[
          '🔒 100% client-side — your image never leaves your browser',
          '🔄 Rotate by any angle 0&deg;–360&deg; with the free-rotate slider',
          '📐 One-click 90&deg; Left, 90&deg; Right, and 180&deg; presets',
          '👁️ Live CSS preview shows rotation instantly before applying',
          '🖼️ Supports JPG, PNG, WebP, GIF, and BMP',
          '🆓 Free forever, no sign-up, no watermark',
        ]}
        steps={[
          { title: 'Upload your image', desc: 'Drag and drop or click to browse. Supports JPG, PNG, WebP, GIF, and BMP up to 50 KB.' },
          { title: 'Choose the angle', desc: 'Use the slider for any angle, or one of the preset buttons: 90&deg; left, 90&deg; right, 180&deg;, or reset to 0&deg;.' },
          { title: 'Preview live', desc: 'The CSS preview updates instantly as you adjust the angle so you can see the rotation before committing.' },
          { title: 'Apply and download', desc: 'Click &quot;Apply &amp; Download&quot; to render the rotated image and save it to your device.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why image rotation matters</h2>
            <p className="text-slate-600 leading-relaxed">
              Every digital photo carries EXIF metadata — a hidden block of data that includes camera model, date, GPS coordinates, and orientation. When you snap a picture in portrait orientation on your phone, the camera does not physically rotate the sensor. Instead, it writes an orientation flag into the EXIF data (typically value 6 = 90&deg; clockwise) telling software how to display the image. Many older viewers, file managers, and web upload forms ignore this flag, leaving your portrait photos displayed sideways.
            </p>
            <p className="text-slate-600 leading-relaxed">
              This tool solves the problem at its root: it physically rotates the pixel data and writes a new image file. The EXIF orientation gap disappears because the pixel layout now matches the intended display orientation. As a concrete example: a 3024 &times; 4032 HEIC photo from an iPhone, when opened on a desktop that ignores EXIF, appears rotated 90&deg; counter-clockwise. Rotating it 90&deg; right through this tool produces a correctly oriented 4032 &times; 3024 JPEG that displays properly on every viewer, operating system, and web platform — no EXIF dependency.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">EXIF orientation vs physical rotation</h3>
            <p className="text-slate-600 leading-relaxed">
              EXIF orientation is a metadata instruction — it does not change the pixel array. Think of it as a note attached to the image saying &quot;display me rotated.&quot; The problem is that not every software reads the note. File managers, Windows Photo Viewer (prior to Windows 10), legacy CMS platforms, and some e-commerce backends ignore orientation tags entirely. Physically rotating the pixel data removes this ambiguity: the image is correct without metadata interpretation.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Custom-angle rotation use cases</h3>
            <p className="text-slate-600 leading-relaxed">
              Beyond fixing orientation, arbitrary-angle rotation serves creative purposes. Graphic designers often rotate logos or overlays by 15&deg; or 22.5&deg; for diagonal layouts. Photographers use small corrections — 1&deg; to 3&deg; — to level a slightly tilted horizon. Scanned documents frequently need a fractional rotation to deskew text before OCR processing. The free-rotate slider handles all these cases, and because the tool computes the correct bounding box, no pixels are cropped at non-90&deg; angles.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no-upload matters</h3>
            <p className="text-slate-600 leading-relaxed">
              Photos are personal — they may contain faces, locations, documents, or private moments. Upload-based rotation tools require you to send the entire image to a remote server. Once uploaded, you have no audit trail, no retention guarantee, and no way to confirm deletion. This tool rotates images entirely inside your browser tab. The Canvas API renders the rotated pixels locally, and the resulting file streams directly to your download folder. No network request carries your image anywhere.
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
                    <td className="px-4 py-2.5 text-slate-700">Rotation method</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Physical pixel rotation</td>
                    <td className="px-4 py-2.5 text-slate-500">Varies (may only set EXIF)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        }
        relatedTools={[
          { name: 'Flip Image', href: '/image/flip-image', icon: '🪞' },
          { name: 'Crop Image', href: '/image/crop-image', icon: '✂️' },
          { name: 'Image Compressor', href: '/image/compress-image', icon: '🗜️' },
        ]}
      />
    </>
  );
}
