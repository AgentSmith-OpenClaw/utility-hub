import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const PdfMetadataEditor = dynamic(() => import('../../components/Pdf/PdfMetadataEditor'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/pdf-metadata-editor';

const FAQS = [
  {
    q: 'Is this safe? Does it upload my PDF?',
    a: 'No upload whatsoever. Metadata is read and written entirely in your browser using pdf-lib. Your PDF never leaves your device and is never sent to a server.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'PDFs up to 100 MB are accepted. Metadata editing is very lightweight since it only modifies the document information dictionary — the page content is never decoded or re-encoded.',
  },
  {
    q: 'Does it work offline?',
    a: 'After the page has loaded once, yes — the PDF engine is cached and the tool runs locally even without an internet connection.',
  },
  {
    q: 'Will this work on iPhone / iPad?',
    a: 'Yes, on modern iOS Safari. Metadata editing is lightweight and works well on mobile devices.',
  },
  {
    q: 'What metadata fields can I edit?',
    a: 'You can edit the title, author, subject, keywords, creator, and producer fields. These are standard PDF metadata fields visible in file properties and search engines that index PDFs.',
  },
  {
    q: 'Will editing metadata change the PDF content?',
    a: 'No. Metadata lives in the PDF information dictionary, separate from the page content. All pages, images, fonts, and formatting are preserved exactly as they were.',
  },
  {
    q: 'Can I edit metadata on encrypted PDFs?',
    a: 'No. If the PDF is password-protected, you\'ll need to unlock it first using the Unlock PDF tool, then edit the metadata on the unlocked copy.',
  },
  {
    q: 'Why would I need to edit PDF metadata?',
    a: 'Common reasons include: fixing incorrect or missing titles before publishing, adding author credit, setting keywords for SEO if the PDF is hosted online, or removing auto-generated creator/producer strings from the original software.',
  },
];

export default function PdfMetadataEditorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'PDF Metadata Editor',
    slug: SLUG,
    description: 'Edit PDF metadata — title, author, subject, keywords, creator, and producer. Preserves all content and formatting. No upload, runs in your browser.',
    category: 'UtilitiesApplication',
    featureList: 'Metadata editing, Title & author, Keywords, Creator & producer, Content preserved, No upload, Free',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>PDF Metadata Editor — Free, No Upload | Toolisk</title>
        <meta
          name="description"
          content="Edit PDF metadata — change title, author, subject, keywords, creator, and producer fields. All page content and formatting preserved. No upload, runs in your browser."
        />
        <meta
          name="keywords"
          content="edit pdf metadata, change pdf title, pdf metadata editor, modify pdf properties, pdf author editor, pdf metadata no upload, edit pdf info online free"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="PDF Metadata Editor | Toolisk" />
        <meta
          property="og:description"
          content="Edit PDF metadata — title, author, keywords, and more. All content preserved. 100% private, no upload."
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
        icon="🏷️"
        title="PDF Metadata Editor"
        tagline="Edit PDF metadata — change title, author, keywords, and more. All content preserved. Runs entirely in your browser."
        gradient="from-rose-600 via-red-600 to-orange-500"
        parent="pdf"
      >
        <PdfMetadataEditor />
      </ToolShell>

      <ToolSEOContent
        description="View and edit the metadata fields of any PDF: title, author, subject, keywords, creator, and producer. These fields are visible in file properties, PDF readers, and search engines that index PDF documents. The tool reads the current metadata using pdf-lib, lets you modify any field, then saves a new PDF with the updated metadata. All page content, images, fonts, and formatting are preserved byte-for-byte — only the information dictionary is modified. Free, no sign-up, no upload."
        features={[
          '📝 Edit title, author, subject, and keywords',
          '🔧 Modify creator and producer fields',
          '📄 All page content and formatting preserved',
          '🔒 100% client-side — your PDF never leaves your browser',
          '⚡ Instant — only modifies the metadata dictionary',
          '🆓 Free, no sign-up, no watermark',
        ]}
        steps={[
          {
            title: 'Drop your PDF',
            desc: 'Metadata is read immediately.',
          },
          {
            title: 'Edit any field',
            desc: 'Title, author, subject, keywords, and more.',
          },
          {
            title: 'Save & download',
            desc: 'Content preserved, only metadata changed.',
          },
          {
            title: '(Optional) Rename',
            desc: 'Default name is {original}-meta.pdf.',
          },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Clean up PDF metadata before sharing</h2>
            <p className="text-slate-600 leading-relaxed">
              Every PDF carries metadata — title, author, subject, keywords, and information about the software that created it. When you share a PDF, this metadata travels with it. A PDF exported from Microsoft Word will say "Microsoft Word" in the producer field. A scanned document from a copier may have the copier model as the creator. For professional documents, cleaning up this metadata is an important step before sharing.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a worked example: a client proposal exported from Word at 1.2 MB with 8 pages. The metadata shows Title: "Document1", Author: "John Smith", Creator: "Microsoft Word", Producer: "Microsoft: Print To PDF". Using this tool, you can change the title to "2026 Q2 Marketing Proposal", the author to your company name, and the keywords to relevant search terms. The output is 1.2 MB with identical page content — only the metadata dictionary changed.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no upload matters for metadata editing</h3>
            <p className="text-slate-600 leading-relaxed">
              PDF metadata often contains personally identifiable information — author names, company names, and software details that reveal internal workflows. Uploading a PDF to a server-side metadata editor exposes this information, along with the document content, to a third party. Toolisk&apos;s editor operates entirely in your browser, reading and writing only the metadata dictionary without ever sending the file anywhere.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Common metadata editing scenarios</h3>
            <table className="w-full text-sm text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 font-semibold text-slate-900">Scenario</th>
                  <th className="text-left py-2 font-semibold text-slate-900">What to change</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium text-slate-800">Publishing online</td>
                  <td className="py-2">Set title and keywords for search engines that index PDFs.</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium text-slate-800">Client delivery</td>
                  <td className="py-2">Set author to your company name, remove auto-generated creator.</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium text-slate-800">Academic submission</td>
                  <td className="py-2">Set title to the paper name, author to your name, add relevant keywords.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium text-slate-800">Internal archiving</td>
                  <td className="py-2">Add consistent subject and keywords for document management systems.</td>
                </tr>
              </tbody>
            </table>
          </section>
        }
        relatedTools={[
          { name: 'PDF Page Counter', href: '/pdf/pdf-page-counter', icon: '🔢' },
          { name: 'Compress PDF', href: '/pdf/compress-pdf', icon: '🗜️' },
          { name: 'Rotate PDF', href: '/pdf/rotate-pdf', icon: '🔄' },
        ]}
      />
    </>
  );
}
