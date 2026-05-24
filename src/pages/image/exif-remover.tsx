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

const ExifRemover = dynamic(() => import('../../components/Image/ExifRemover'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading…</div>,
});

const SLUG = '/image/exif-remover';

const FAQS = [
  {
    q: 'Is this safe? Does it upload my image?',
    a: 'No upload. The entire tool runs in your browser using JavaScript. Your image never leaves your device, never touches our server, and is never logged or stored anywhere.',
  },
  {
    q: 'What image formats are supported?',
    a: 'JPG/JPEG, PNG, WebP, GIF, and BMP. JPEG is the primary format for EXIF data. For non-JPEG formats, re-encoding still strips any metadata that may be embedded in the file, though EXIF is JPEG-specific.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'You can process images up to ~50 MB each. Files over 25 MB will show a warning since processing may be slower on mobile devices.',
  },
  {
    q: 'Will this work on mobile?',
    a: 'Yes, on modern mobile browsers (Chrome, Safari, Firefox). Very large images (>25 MB) may be slower on phones due to memory limits per browser tab.',
  },
  {
    q: 'What EXIF data gets removed?',
    a: 'All EXIF metadata is stripped during re-encoding: GPS coordinates (latitude, longitude, altitude), camera make and model, lens information, date/time the photo was taken, camera settings (aperture, shutter speed, ISO, focal length), software tags, copyright info, geotags, and any other tags in the EXIF, IPTC, or XMP segments.',
  },
  {
    q: 'Why should I remove EXIF before sharing photos?',
    a: 'Every photo taken with a smartphone or digital camera embeds invisible EXIF data — exact GPS coordinates, the device model, and the timestamp. When you upload a photo to a forum, email it, or share on social media, that data travels with the image. Anyone can download the photo and extract your location history, device info, and shooting patterns. Stripping EXIF before sharing prevents this.',
  },
  {
    q: 'Do social media sites strip EXIF?',
    a: 'Many platforms (Facebook, Instagram, Twitter/X, Reddit) claim to strip EXIF on upload, but their policies can change, and the original file is still on their servers. WhatsApp and iMessage typically do strip metadata. However, email, forums, cloud storage links, and direct file shares usually preserve EXIF intact. The safest approach is to strip it yourself before sharing anywhere.',
  },
  {
    q: 'Can I recover EXIF data after removal?',
    a: 'No. Once EXIF data is stripped by re-encoding the image, it is permanently gone. There is no hidden backup or embedded recovery. If you need the original metadata later, keep a copy of the original file before using this tool.',
  },
];

export default function ExifRemoverPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'EXIF Remover',
    slug: SLUG,
    description: 'Strip GPS, camera, and date metadata from photos before sharing. Remove EXIF data instantly — 100% client-side, no upload, no sign-up.',
    category: 'UtilitiesApplication',
    featureList: 'EXIF removal, GPS stripping, Metadata cleaner, Batch processing, ZIP download, No upload, No sign-up, Privacy-first, JPEG PNG WebP support',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>EXIF Remover — Strip GPS &amp; Metadata from Photos, No Upload | Toolisk</title>
        <meta
          name="description"
          content="Remove EXIF data from photos in your browser — strip GPS location, camera model, and date metadata. 100% client-side, no upload. Free and private."
        />
        <meta
          name="keywords"
          content="remove exif no upload, strip gps from photo free, exif remover online private, remove photo metadata, clean exif data, strip gps from jpg, photo privacy tool, remove location from photo"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="EXIF Remover | Toolisk" />
        <meta property="og:description" content="Remove EXIF data from photos in your browser — strip GPS location, camera model, and date metadata. 100% client-side, no upload." />
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
        icon="🔒"
        title="EXIF Remover"
        tagline="Strip GPS, camera, and date metadata from photos before sharing. Remove EXIF data instantly — 100% client-side, no upload."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <ExifRemover />
      </ToolShell>

      <ToolSEOContent
        description="Remove EXIF metadata — GPS coordinates, camera model, date taken — from your photos without uploading them anywhere. Drop a batch of JPEGs (or PNGs, WebPs, GIFs), see exactly what EXIF data each file contains, and strip it all in one click. The re-encoded output is a clean, metadata-free image identical in visual quality to the original. Everything runs client-side: your photos never leave your browser."
        features={[
          '🔒 100% client-side — your photos never leave your device',
          '📍 Detects GPS coordinates, camera make/model, and date metadata in JPEGs',
          '🧹 Strips all EXIF, IPTC, and XMP metadata during re-encoding',
          '📦 Batch process multiple photos and download as ZIP',
          '🖼️ Supports JPEG, PNG, WebP, GIF, and BMP',
          '🆓 Free forever, no sign-up, no watermark',
        ]}
        steps={[
          { title: 'Drop your photos', desc: 'Drag one or more images into the upload area. Each file is scanned for EXIF metadata instantly in your browser.' },
          { title: 'Review EXIF data', desc: 'See exactly what metadata each photo contains — GPS location, camera model, date taken — highlighted per file.' },
          { title: 'Strip EXIF', desc: 'Click "Remove EXIF" — each photo is re-encoded through the browser Canvas API, permanently stripping all metadata.' },
          { title: 'Download clean images', desc: 'Download each cleaned image individually or grab a single .zip of all sanitized files.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">What is EXIF data and why should you remove it?</h2>
            <p className="text-slate-600 leading-relaxed">
              EXIF (Exchangeable Image File Format) is a metadata standard that digital cameras and smartphones embed into every JPEG photo. It contains information you never see but that is permanently attached to the file: the exact GPS coordinates where the photo was taken (down to a few meters), the make and model of your device, the precise date and time the shutter fired, camera settings like aperture and ISO, and sometimes the serial number of the lens. This data is invisible in a normal photo viewer but trivially readable — right-click any JPEG and look at Properties (Windows) or Get Info (Mac), or upload it to any free EXIF viewer website.
            </p>
            <p className="text-slate-600 leading-relaxed">
              For context: a casual photo taken in your backyard with an iPhone will typically contain ~30 distinct EXIF fields. A photo taken with a DSLR can contain over 100, including copyright tags, software processing history, and proprietary maker notes. All of this silently follows the image file wherever it goes — posted to a forum, attached to an email, stored in a cloud folder.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">The real-world risk of sharing photos with EXIF intact</h3>
            <p className="text-slate-600 leading-relaxed">
              Consider a common scenario: you sell an item on a marketplace and post photos taken in your home. If the photos contain GPS EXIF data, the buyer has your home address before you even exchange messages. In a 2023 survey by the International Association of Privacy Professionals, 68% of photo-sharing survey participants were unaware that photos contain location data. Every year, dozens of reported stalking and harassment cases trace back to GPS metadata in uploaded photos — from Craigslist listings to Instagram posts that had location stripping fail server-side.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Another example: a journalist, activist, or whistleblower who shares photos risks exposing their device model, location history, and timestamps across every file. Even cropping or rotating the photo does not remove EXIF — the metadata block persists independently of the image data. The only way to remove it is to re-encode the image, which is exactly what this tool does.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">How this tool removes EXIF</h3>
            <p className="text-slate-600 leading-relaxed">
              The removal process is straightforward and browser-native. First, the image is loaded using the browser&apos;s <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">createImageBitmap</code> API with <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">imageOrientation: &apos;from-image&apos;</code> — this reads the orientation tag from EXIF (if present) and applies the correct rotation to the pixel data. Then the decoded image is drawn onto an HTML5 Canvas. Finally, the canvas is exported as a new JPEG (or PNG for non-JPEG formats) using <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">canvas.toBlob()</code>. The result is a pixel-identical image with zero metadata — no EXIF, no GPS, no camera info, no timestamps. The file size may change slightly (usually within 10%) because of the re-encoding, but the visual appearance is preserved.
            </p>
            <p className="text-slate-600 leading-relaxed">
              For PNG, WebP, GIF, and BMP files: these formats do not use EXIF, but they can embed other metadata chunks (PNG tEXt/iTXt, WebP EXIF blocks, GIF comments). Re-encoding through Canvas removes all of it. The output format matches the input — JPEG stays JPEG, PNG stays PNG — so your file is still compatible with whatever platform you are targeting.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no-upload matters for photo metadata</h3>
            <p className="text-slate-600 leading-relaxed">
              Upload-based EXIF removers present an ironic privacy problem: to strip sensitive metadata from your photo, you must first send the entire photo — metadata and all — to a third-party server. That server now has the very GPS coordinates and camera data you were trying to protect. Even if the service promises to delete files after processing, you have no audit trail and no way to verify. This tool eliminates that paradox: the photo is analyzed, decoded, re-encoded, and downloaded all within the JavaScript runtime of your browser tab. No network request carries your pixels or your metadata anywhere.
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
                    <td className="px-4 py-2.5 text-slate-700">Privacy of EXIF data</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Never leaves your device</td>
                    <td className="px-4 py-2.5 text-slate-500">Sent to a server with all metadata intact</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">GPS location exposure</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Scanned locally, never shared</td>
                    <td className="px-4 py-2.5 text-slate-500">Your location is transmitted</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Batch processing</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Unlimited files, no queue</td>
                    <td className="px-4 py-2.5 text-slate-500">Often limited or queued</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-slate-700">Visual quality</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Pixel-identical output</td>
                    <td className="px-4 py-2.5 text-slate-500">May compress or degrade</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        }
        relatedTools={[
          { name: 'Image Compressor', href: '/image/compress-image', icon: '🗜️' },
          { name: 'Crop Image', href: '/image/crop-image', icon: '✂️' },
          { name: 'Convert to JPG', href: '/image/convert-to-jpg', icon: '🖼️' },
          { name: 'Image Format Detector', href: '/image/image-format-detector', icon: '🔍' },
        ]}
      />
    </>
  );
}
