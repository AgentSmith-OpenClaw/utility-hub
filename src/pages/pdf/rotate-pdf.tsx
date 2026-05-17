import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const RotatePdf = dynamic(() => import('../../components/Pdf/RotatePdf'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/rotate-pdf';

const FAQS = [
  { q: 'Is this safe? Does it upload my PDF?', a: 'No upload. The entire tool runs in your browser using JavaScript. Your file never leaves your device, never touches our server, and is never logged.' },
  { q: 'What is the maximum file size?', a: 'You can process PDFs up to ~100 MB. Files over 30 MB will be slower, especially on mobile.' },
  { q: 'Does it work offline?', a: 'After the page has loaded once, yes — the PDF engine is cached and the tool runs locally.' },
  { q: 'Will this work on iPhone / iPad?', a: 'Yes, on modern iOS Safari. iOS limits per-tab memory, so very large PDFs (>50 MB) may fail.' },
  { q: 'Will rotating reduce my PDF quality?', a: 'No. Rotation only changes a metadata flag inside the PDF — the page content, fonts, images, and resolution are untouched. There is no re-render and no quality loss.' },
  { q: 'Why does my PDF look rotated before I do anything?', a: 'Some PDFs have a /Rotate entry baked in by the scanner or exporting software. This tool rotates relative to that existing value, so your chosen angle is added on top of whatever was already there.' },
  { q: 'Can I rotate only the even or odd pages?', a: 'Yes, via individual mode — switch to "Rotate individual pages", then click the rotate button on each page you want to change. You can click multiple pages manually.' },
  { q: 'Why is 270° the same as −90°?', a: 'They produce the same result. PDF rotation uses non-negative integers, so −90° is expressed as 270°. Both rotate the page a quarter-turn counter-clockwise.' },
];

export default function RotatePdfPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Rotate PDF',
    slug: SLUG,
    description: 'Rotate PDF pages 90, 180, or 270 degrees — all pages or one at a time. Runs in your browser. No upload, no sign-up, no quality loss.',
    category: 'UtilitiesApplication',
    featureList: 'Rotate all pages, Per-page rotation, Live thumbnail preview, No upload, No quality loss, No sign-up',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Rotate PDF — Online, In Browser, No Upload | Toolisk</title>
        <meta name="description" content="Rotate PDF pages 90, 180, or 270 degrees — all pages or one at a time. Runs in your browser. No upload, no sign-up, no quality loss." />
        <meta name="keywords" content="rotate pdf, rotate pdf pages, rotate pdf online, rotate pdf free, rotate pdf no upload, fix sideways pdf, pdf landscape to portrait, rotate single pdf page" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Rotate PDF | Toolisk" />
        <meta property="og:description" content="Rotate PDF pages 90, 180, or 270 degrees — all pages or one at a time. 100% private, no upload." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="🔄"
        title="Rotate PDF"
        tagline="Rotate PDF pages 90, 180, or 270 degrees — all at once or page by page, with live previews. No upload, no sign-up."
        gradient="from-rose-600 via-red-600 to-orange-500"
        parent="pdf"
      >
        <RotatePdf />
      </ToolShell>

      <ToolSEOContent
        description="Fix sideways or upside-down PDF pages in seconds. Rotate all pages at once or select individual pages in the thumbnail grid. Everything runs in your browser — no upload, no sign-up, no watermarks."
        features={[
          '🔒 100% client-side — your PDF never leaves your browser',
          '🔄 Rotate all pages or individual pages',
          '👁 Live thumbnail preview with CSS rotation',
          '⚡ No re-render — rotation is a metadata flag, zero quality loss',
          '🆓 Free forever, no sign-up, no watermark',
          '📱 Works on desktop and mobile browsers',
        ]}
        steps={[
          { title: 'Drop your PDF', desc: 'Drag and drop a PDF file into the upload area, or click to browse.' },
          { title: 'Choose a mode', desc: 'Pick "Rotate all pages" to apply a single angle across the whole document, or "Rotate individual pages" to control each page separately.' },
          { title: 'Pick the angles', desc: 'In bulk mode, select 90°, 180°, or 270°. In individual mode, click the rotate icon on each thumbnail — or use the bulk toolbar chips.' },
          { title: 'Apply & download', desc: 'Click "Apply rotation & download". The rotated PDF saves straight to your device.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">When PDF rotation actually matters</h2>
            <p className="text-slate-600 leading-relaxed">
              Scanner apps, mobile cameras, and some PDF printers frequently embed pages in the wrong orientation. A contract scanned on a desktop scanner may come out fine, but the same contract photographed on a phone and converted to PDF often lands sideways or upside-down — depending on how the device was held. The result is a PDF you have to tilt your head to read, and one that prints incorrectly unless you fix it first.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a worked example: a 12-page contract where odd-numbered pages were scanned upside-down. In individual mode, open the thumbnail grid, click the rotate button on pages 1, 3, 5, 7, 9, and 11 twice each (two clicks = 180°), then click "Apply rotation & download". The corrected PDF is ready in under two seconds — same file size, same image quality, no recompression.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no quality loss?</h3>
            <p className="text-slate-600 leading-relaxed">
              PDF rotation is not the same as image rotation. When you rotate a JPEG in an image editor, the pixels are recalculated and resampled — that is where quality degrades. PDF pages are made of vector instructions, fonts, and embedded images that are stored independently. Rotating a PDF page only changes a single integer in the page dictionary (the /Rotate key). The underlying content objects are not touched, not moved, and not re-encoded. What you get out is byte-for-byte identical to what went in, except for that one integer.
            </p>
            <p className="text-slate-600 leading-relaxed">
              This is also why the output file size is nearly identical to the input: nothing is recompressed or re-rendered. The only bytes that change are those few bytes of metadata.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no upload matters</h3>
            <p className="text-slate-600 leading-relaxed">
              PDFs routinely contain sensitive information — signed agreements, tax documents, medical records, financial statements. Most online rotation tools upload your file to a third-party server, process it there, and serve the result back. Even if they promise deletion, you have no way to verify it. Toolisk Rotate PDF keeps your file inside the JavaScript runtime of your browser tab the entire time. There is no network request, no server, and nothing to trust — the PDF is yours from start to finish.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Merge PDF', href: '/pdf/merge-pdf', icon: '📎' },
          { name: 'Reorder PDF Pages', href: '/pdf/reorder-pdf-pages', icon: '🔀' },
          { name: 'Delete Pages from PDF', href: '/pdf/delete-pdf-pages', icon: '🗑️' },
        ]}
      />
    </>
  );
}
