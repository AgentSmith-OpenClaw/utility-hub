import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const PdfPageCounter = dynamic(() => import('../../components/Pdf/PdfPageCounter'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/pdf-page-counter';

const FAQS = [
  {
    q: 'Is this safe? Does it upload my PDF?',
    a: 'No upload whatsoever. The page count and metadata are read entirely in your browser using pdf-lib. Your PDF never leaves your device and is never sent to a server.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'PDFs up to 100 MB are accepted. For very large PDFs, the page count and metadata read is near-instant since only the document structure is parsed — not the full content.',
  },
  {
    q: 'Does it work offline?',
    a: 'After the page has loaded once, yes — the PDF engine is cached and the tool runs locally even without an internet connection.',
  },
  {
    q: 'Will this work on iPhone / iPad?',
    a: 'Yes, on modern iOS Safari. Since this tool only reads the PDF structure (not rendering pages), it works efficiently on mobile devices.',
  },
  {
    q: 'What information does it show?',
    a: 'It shows the page count, file size, average size per page, page dimensions (with standard paper size name if recognized), encryption status, and full metadata including title, author, subject, keywords, creator, and producer.',
  },
  {
    q: 'Can it read encrypted PDFs?',
    a: 'No. If the PDF is password-protected, it will show an error asking you to unlock the PDF first using the Unlock PDF tool.',
  },
  {
    q: 'Does it work with scanned PDFs?',
    a: 'Yes. Scanned PDFs are just image-based PDFs with a page count. The tool reads the document structure, not the image content, so it works identically.',
  },
];

export default function PdfPageCounterPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'PDF Page Counter',
    slug: SLUG,
    description: 'Instantly count pages in any PDF — see page count, file size, dimensions, paper size, encryption status, and full metadata. No upload.',
    category: 'UtilitiesApplication',
    featureList: 'Page count, File size, Page dimensions, Metadata viewer, Paper size detection, No upload, Free',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>PDF Page Counter — Free, No Upload, Instant | Toolisk</title>
        <meta
          name="description"
          content="Count pages in any PDF instantly — see page count, file size, dimensions, paper size, encryption status, and full metadata. No upload, runs in your browser."
        />
        <meta
          name="keywords"
          content="pdf page counter, count pdf pages, pdf page count, how many pages in pdf, pdf page counter no upload, pdf page counter online free, count pages pdf online, pdf info"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="PDF Page Counter | Toolisk" />
        <meta
          property="og:description"
          content="Count pages in any PDF instantly — page count, file size, dimensions, and metadata. No upload, 100% private."
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
        icon="🔢"
        title="PDF Page Counter"
        tagline="Instantly count pages in any PDF — see page count, size, dimensions, and full metadata. Runs in your browser."
        gradient="from-rose-600 via-red-600 to-orange-500"
        parent="pdf"
      >
        <PdfPageCounter />
      </ToolShell>

      <ToolSEOContent
        description="Drop a PDF to instantly see its page count, file size, average size per page, page dimensions, and full metadata. The tool reads the PDF document structure using pdf-lib entirely in your browser — no file is uploaded, and no content is scanned. Detects standard paper sizes (Letter, A4, Legal, A5, A3, Tabloid) automatically. Shows encryption status, title, author, subject, keywords, creator, and producer metadata. Free, no sign-up, no upload."
        features={[
          '📊 Instant page count — no rendering needed',
          '📏 Page dimensions with standard paper size detection',
          '📋 Full metadata viewer — title, author, keywords',
          '🔒 100% client-side — your PDF never leaves your browser',
          '⚡ Lightning fast — only reads document structure',
          '🆓 Free, no sign-up, no watermark',
        ]}
        steps={[
          {
            title: 'Drop your PDF',
            desc: 'Any size up to 100 MB — near instant.',
          },
          {
            title: 'Results appear instantly',
            desc: 'Page count, size, dimensions, and metadata.',
          },
          {
            title: 'Review paper size',
            desc: 'Automatic Letter, A4, Legal detection.',
          },
          {
            title: 'Drop another PDF',
            desc: 'Click "Check another PDF" to repeat.',
          },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Quickly count PDF pages without opening the file</h2>
            <p className="text-slate-600 leading-relaxed">
              Counting pages in a PDF should not require opening a heavy PDF reader, waiting for all pages to render, and then looking at the page number. It should also not require uploading your file to a server and hoping it comes back with the right answer. This tool reads only the PDF document structure — the part that contains the page count, dimensions, and metadata — skipping the actual page content entirely. The result is near-instant, even for 500-page documents.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a concrete example: a 350-page e-book at 15 MB. Dropping it reveals 350 pages, Letter size (8.5" × 11.0"), approximately 43 KB per page, with metadata showing the title and author. The read takes under 200 milliseconds because only the document structure is parsed — the 350 pages of content are never rendered or decoded.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no upload matters for PDF inspection</h3>
            <p className="text-slate-600 leading-relaxed">
              PDFs often contain confidential information. Even reading page counts online through server-side tools means sending the entire file to a third party. Toolisk&apos;s counter reads only the PDF structure in your browser using pdf-lib — the file bytes never leave your device.
            </p>
            <p className="text-slate-600 leading-relaxed">
              This is particularly important for business documents, legal contracts, and medical reports where the file itself is sensitive information. The tool shows you exactly what it reads and does nothing else.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">What this tool shows vs competitors</h3>
            <table className="w-full text-sm text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 font-semibold text-slate-900">Feature</th>
                  <th className="text-left py-2 font-semibold text-slate-900">Toolisk</th>
                  <th className="text-left py-2 font-semibold text-slate-900">Server-based tools</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2">Page count</td>
                  <td className="py-2 text-emerald-600">Yes</td>
                  <td className="py-2">Yes</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2">Page dimensions & paper size</td>
                  <td className="py-2 text-emerald-600">Yes</td>
                  <td className="py-2">Sometimes</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2">Full metadata</td>
                  <td className="py-2 text-emerald-600">Yes</td>
                  <td className="py-2">Rarely</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2">File upload required</td>
                  <td className="py-2 text-emerald-600">No</td>
                  <td className="py-2 text-rose-600">Yes</td>
                </tr>
                <tr>
                  <td className="py-2">Privacy-preserving</td>
                  <td className="py-2 text-emerald-600">Yes</td>
                  <td className="py-2 text-rose-600">No</td>
                </tr>
              </tbody>
            </table>
          </section>
        }
        relatedTools={[
          { name: 'PDF Metadata Editor', href: '/pdf/pdf-metadata-editor', icon: '🏷️' },
          { name: 'Compress PDF', href: '/pdf/compress-pdf', icon: '🗜️' },
          { name: 'PDF to Text', href: '/pdf/pdf-to-text', icon: '📝' },
        ]}
      />
    </>
  );
}
