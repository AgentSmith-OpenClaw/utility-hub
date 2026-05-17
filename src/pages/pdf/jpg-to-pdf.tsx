import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const JpgToPdf = dynamic(() => import('../../components/Pdf/JpgToPdf'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/jpg-to-pdf';

const FAQS = [
  {
    q: 'Is this safe? Does it upload my images?',
    a: 'No upload whatsoever. The entire conversion runs in your browser using JavaScript. Your images never leave your device, are never sent to a server, and are never logged. This makes it safe for sensitive files like ID scans or medical receipts.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'Individual images up to 100 MB are accepted. Files over 30 MB may be slower on mobile. For best results keep total combined size under 200 MB.',
  },
  {
    q: 'Does it work offline?',
    a: 'After the page has loaded once, yes — the PDF engine is cached in your browser and the conversion runs locally even without an internet connection.',
  },
  {
    q: 'Will this work on iPhone / iPad?',
    a: 'Yes, on modern iOS Safari. iOS limits per-tab memory, so processing dozens of large images at once may be slow. Processing images in smaller batches helps.',
  },
  {
    q: 'What image formats are supported?',
    a: 'JPG, PNG, and WebP are all supported. HEIC (iPhone photo format) is not currently supported — convert HEIC to JPG first using your phone\'s built-in share/export option.',
  },
  {
    q: 'Does the order I drop the images matter?',
    a: 'Yes — images are added to the PDF in the order they appear in the grid. If you drop them in the wrong order, you can drag the thumbnails to rearrange them before creating the PDF.',
  },
  {
    q: 'Will my image quality be compressed or degraded?',
    a: 'JPEG images are re-encoded at 0.92 quality during the EXIF orientation step (to correct sideways photos from phones). PNG and WebP are also converted to JPEG at the same quality. The visual difference at 0.92 quality is negligible.',
  },
  {
    q: 'Will sideways phone photos look right in the PDF?',
    a: 'Yes. Photos taken with a phone in portrait mode are often stored rotated with an EXIF flag. This tool reads that flag via the browser\'s createImageBitmap API and applies the correct rotation before embedding, so photos always appear upright in the PDF.',
  },
];

export default function JpgToPdfPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'JPG to PDF',
    slug: SLUG,
    description: 'Convert JPG, PNG, or WebP images to a single PDF in your browser — drag to reorder, choose page size, free with no sign-up or watermarks.',
    category: 'UtilitiesApplication',
    featureList: 'Drag-to-reorder, EXIF orientation fix, Multiple page sizes, No upload, Instant download, PNG and WebP support, No sign-up',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>JPG to PDF — Free, In Browser, No Upload | Toolisk</title>
        <meta
          name="description"
          content="Convert JPG, PNG, or WebP images to a single PDF in your browser — drag to reorder, choose page size, free with no sign-up or watermarks."
        />
        <meta
          name="keywords"
          content="jpg to pdf, png to pdf, image to pdf, jpg to pdf free, jpg to pdf no upload, photos to pdf, scan to pdf, multiple images to pdf, jpg to pdf online"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="JPG to PDF | Toolisk" />
        <meta
          property="og:description"
          content="Convert JPG, PNG, or WebP images to a PDF in your browser. Drag to reorder, pick page size — 100% private, no upload."
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
        icon="🖼️"
        title="JPG to PDF"
        tagline="Convert JPG, PNG, or WebP images to a PDF — drag to reorder, choose page size. Runs in your browser. No upload, no sign-up."
        gradient="from-rose-600 via-red-600 to-orange-500"
        parent="pdf"
      >
        <JpgToPdf />
      </ToolShell>

      <ToolSEOContent
        description="Convert one or more JPG, PNG, or WebP images into a single PDF file — all inside your browser. No upload, no account, no watermark. Drag thumbnails to reorder, pick a page size, set a margin, and download instantly."
        features={[
          '🔒 100% client-side — images never leave your browser',
          '🖼️ Drag-to-reorder thumbnails before creating the PDF',
          '📐 Page size options: Fit to image, Letter, A4, Legal',
          '📱 EXIF orientation fix — sideways phone photos appear upright',
          '🌐 Supports JPG, PNG, and WebP formats',
          '🆓 Free forever, no sign-up, no watermark',
        ]}
        steps={[
          {
            title: 'Drop your images',
            desc: 'Drag and drop JPG, PNG, or WebP files onto the upload area, or click to browse. Add as many as you need.',
          },
          {
            title: 'Reorder thumbnails',
            desc: 'Drag the image tiles to arrange them in the order you want pages to appear in the PDF.',
          },
          {
            title: 'Set page size',
            desc: 'Choose Fit to image (default), Letter, A4, or Legal. Set orientation and margin for fixed-size pages.',
          },
          {
            title: 'Create PDF',
            desc: 'Click "Create PDF". The conversion runs in your browser. Download the finished file instantly.',
          },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Converting images to PDF — when and why</h2>
            <p className="text-slate-600 leading-relaxed">
              The most common reason people convert images to PDF is documentation: a receipt photographed with a phone needs to go into an expense report, a stack of scanned invoices needs to be sent to an accountant as a single file, or a set of whiteboard photos from a meeting needs to be archived in a shareable format. PDF is the universal container format for documents, and a JPG-to-PDF converter is the bridge between the camera roll and the document world.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a worked example: six JPEG photos of restaurant receipts, each around 3 MB, totaling 18 MB. Drop them all at once, drag to put them in chronological order, choose A4 with a small margin, click Create PDF. The resulting file is around 18 MB and takes about 3 seconds on a modern laptop. The page count matches the image count — one image per page — and every image is pixel-sharp at the chosen page size.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why in-browser conversion matters for IDs and receipts</h3>
            <p className="text-slate-600 leading-relaxed">
              Images of receipts, invoices, passports, driving licences, and medical documents are among the most sensitive files on a phone. When you use a server-side conversion tool, that image travels over the network to a third-party server. Even if the service says it deletes files immediately, there is no way to verify that — and the image has left your device.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Toolisk&apos;s JPG to PDF tool converts entirely in the JavaScript runtime of your browser tab. The image bytes are passed directly to the PDF engine (pdf-lib), which runs in the same sandbox. Nothing is sent anywhere. When you close the tab, the data is gone. This is not just a privacy promise — it is how the technology works.
            </p>
            <ul className="list-none space-y-2 text-slate-600 text-sm mt-4">
              <li className="flex gap-3 items-start">
                <span className="text-rose-500 mt-0.5">✗</span>
                <span><strong>Server-side converters:</strong> image uploads over the network → server processes → output downloaded → image may be cached, logged, or retained.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span><strong>Toolisk JPG to PDF:</strong> image stays in your browser&apos;s memory → converted in JavaScript → saved to your device → nothing ever leaves your machine.</span>
              </li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'PDF to JPG', href: '/pdf/pdf-to-jpg', icon: '🖼️' },
          { name: 'PDF to PNG', href: '/pdf/pdf-to-png', icon: '🖼️' },
          { name: 'Merge PDF', href: '/pdf/merge-pdf', icon: '📎' },
        ]}
      />
    </>
  );
}
