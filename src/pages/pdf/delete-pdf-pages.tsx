import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const DeletePdfPages = dynamic(() => import('../../components/Pdf/DeletePdfPages'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/delete-pdf-pages';

const FAQS = [
  {
    q: 'Is this safe? Does it upload my PDF?',
    a: 'No upload whatsoever. The entire operation runs in your browser using JavaScript and the open-source pdf-lib library. Your PDF never leaves your device, is never sent to a server, and is never logged. This makes it safe for sensitive files like contracts, medical reports, or financial statements.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'PDFs up to 100 MB are accepted. Files over 30 MB may be slower on mobile. For very large PDFs, consider splitting the file first using the Split PDF tool, then trimming each part.',
  },
  {
    q: 'Does it work offline?',
    a: 'After the page has loaded once, yes — the PDF engine is cached in your browser and deletion runs locally even without an internet connection.',
  },
  {
    q: 'Will this work on iPhone / iPad?',
    a: 'Yes, on modern iOS Safari. iOS limits per-tab memory, so processing PDFs with hundreds of pages may be slow or cause the tab to reload. For large files, try splitting first.',
  },
  {
    q: 'Will deleting pages change the look of the remaining ones?',
    a: 'No. We don\'t re-render anything — pdf-lib copies the kept pages byte-for-byte into a new document. Quality is identical to the input.',
  },
  {
    q: 'Can I undo after downloading?',
    a: 'Not in the tool — once the new PDF is saved, the previous state isn\'t kept. Your original file is untouched, though, so you can always restart from it.',
  },
  {
    q: 'What\'s the difference between Delete Pages and Extract Pages?',
    a: 'They\'re inverses. Delete removes the pages you pick. Extract keeps the pages you pick. Same outcome, opposite ergonomics — choose whichever has fewer clicks.',
  },
  {
    q: 'Can I delete the first n pages quickly?',
    a: 'Use the range input: 1-5 selects pages 1 through 5 for deletion, then click the action button.',
  },
];

export default function DeletePdfPagesPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Delete Pages from PDF',
    slug: SLUG,
    description: 'Remove unwanted pages from a PDF with a visual page picker — multi-select, range support, instant download. No upload, no sign-up. Runs in your browser.',
    category: 'UtilitiesApplication',
    featureList: 'Client-side processing, Visual page picker, Multi-select, Range input, Instant download, No upload, Free',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Delete Pages from PDF — In Browser, No Upload | Toolisk</title>
        <meta
          name="description"
          content="Remove unwanted pages from a PDF with a visual picker — multi-select, range support, instant download. No upload, no sign-up. Runs in your browser."
        />
        <meta
          name="keywords"
          content="delete pdf pages, remove pdf pages, delete pages from pdf, remove pages pdf free, delete pages pdf no upload, pdf page remover, trim pdf, delete pdf pages online"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Delete Pages from PDF | Toolisk" />
        <meta
          property="og:description"
          content="Remove unwanted pages from a PDF with a visual page picker — multi-select, range support, instant download. 100% private, no upload."
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
        icon="🗑️"
        title="Delete Pages from PDF"
        tagline="Remove unwanted pages from a PDF — visual page picker, runs entirely in your browser."
        gradient="from-rose-600 via-red-600 to-orange-500"
        parent="pdf"
      >
        <DeletePdfPages />
      </ToolShell>

      <ToolSEOContent
        description="Remove one or more pages from any PDF using a visual thumbnail picker — all inside your browser. Click pages to mark them for deletion, or type a page range (e.g. 1-5, 8, 10-12). The remaining pages are copied byte-for-byte into a new document — no re-rendering, original quality preserved. No upload, no account, no watermark."
        features={[
          '🔒 100% client-side — your PDF never leaves your browser',
          '👀 Visual page picker with live thumbnails',
          '🔢 Multi-select or use a page range (e.g. 5, 8-12)',
          '🪶 No re-render — original quality preserved',
          '⚡ Instant download — works for hundreds of pages',
          '🆓 Free, no sign-up, no watermark',
        ]}
        steps={[
          {
            title: 'Drop your PDF',
            desc: 'Any size up to 100 MB.',
          },
          {
            title: 'Click pages to mark for deletion',
            desc: 'Or use the range input.',
          },
          {
            title: 'Remove & download',
            desc: 'One click, original quality preserved.',
          },
          {
            title: '(Optional) Rename',
            desc: 'Default name is {original}-trimmed.pdf.',
          },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">When you need to trim a PDF</h2>
            <p className="text-slate-600 leading-relaxed">
              There are many everyday situations where you need to remove specific pages from a PDF: stripping the cover and back pages from a scanned document, cutting unsigned signature pages from a contract before sharing, removing confidential appendices before sending a report, or pruning blank filler pages inserted by a scanner. In all of these cases, you need a tool that is precise, fast, and private — and that is exactly what this tool provides.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a worked example: a 50-page scanned bundle at 6.2 MB. Removing pages 1–3 (cover and table of contents) and pages 48–50 (back matter and index) produces a 44-page output at approximately 5.5 MB. The operation takes under a second in a modern browser. No quality is lost — pdf-lib copies the original page objects directly, without decoding or re-encoding any content.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no upload matters</h3>
            <p className="text-slate-600 leading-relaxed">
              PDFs frequently contain sensitive information — signed contracts, tax documents, ID scans, medical records. When you use a server-side tool, that file travels to a third-party server. Even if the provider claims to delete files immediately, there is no way to verify that claim, and the data has left your device.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Toolisk&apos;s Delete Pages tool uses pdf-lib — an open-source JavaScript PDF library — entirely inside your browser tab. The PDF bytes are read into memory, the unwanted pages are excluded, and a new PDF is assembled from the kept pages. Nothing is transmitted anywhere. When you close the tab, everything is gone. This is not a privacy promise — it is how the technology works.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Delete Pages vs Extract Pages vs Split PDF</h3>
            <p className="text-slate-600 leading-relaxed">
              These three tools solve related problems with different ergonomics. <strong>Delete Pages</strong> is best when you want to keep most of the document and remove a few unwanted pages — you select what to throw away. <strong>Extract Pages</strong> is the inverse: you select what to keep, which is better when you want a small subset of a large document. <strong>Split PDF</strong> is for dividing a document into multiple separate files — for example, splitting a 100-page report into 10-page chunks for distribution.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The right choice depends on which has fewer clicks. If you are removing 3 pages from a 40-page document, Delete Pages wins. If you are keeping 3 pages from a 40-page document, Extract Pages wins. Both produce a single output file of original quality.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Reorder PDF Pages', href: '/pdf/reorder-pdf-pages', icon: '🔀' },
          { name: 'Extract Pages from PDF', href: '/pdf/extract-pdf-pages', icon: '📋' },
          { name: 'Merge PDF', href: '/pdf/merge-pdf', icon: '📎' },
        ]}
      />
    </>
  );
}
