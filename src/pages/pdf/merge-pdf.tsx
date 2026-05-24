import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const MergePdf = dynamic(() => import('../../components/Pdf/MergePdf'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/merge-pdf';

const FAQS = [
  { q: 'Is this safe? Does it upload my PDF?', a: 'No upload. The entire tool runs in your browser using JavaScript. Your file never leaves your device, never touches our server, and is never logged.' },
  { q: 'What is the maximum file size?', a: 'You can process PDFs up to ~100 MB each. Files over 30 MB will be slower, especially on mobile.' },
  { q: 'Does it work offline?', a: 'After the page has loaded once, yes — the PDF engine is cached and the tool runs locally.' },
  { q: 'Will this work on iPhone / iPad?', a: 'Yes, on modern iOS Safari. iOS limits per-tab memory, so very large PDFs (>50 MB) may fail.' },
  { q: 'Is there a limit to how many PDFs I can merge?', a: 'No hard limit, but performance depends on your device. Most modern browsers handle 20+ PDFs comfortably. For very large merges, expect 10–30 seconds of processing.' },
  { q: 'Will the merged PDF be larger than the originals?', a: "The merged file's size is approximately the sum of the inputs. We don't recompress anything — original quality is preserved exactly." },
  { q: 'Can I merge a password-protected PDF?', a: 'Not directly. Unlock the PDF first, then merge the unlocked version.' },
  { q: 'Does the order in the file list determine the page order?', a: 'Yes. Files merge top-to-bottom. Drag rows to change the order before clicking Merge.' },
];

export default function MergePdfPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Merge PDF',
    slug: SLUG,
    description: 'Merge PDFs in your browser — drag, drop, reorder, and combine into one file. 100% private: files never leave your device.',
    category: 'UtilitiesApplication',
    featureList: 'Drag-to-reorder, No upload, Instant download, Multi-file support, No sign-up',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Merge PDF — Free, Private, No Upload | Toolisk</title>
        <meta name="description" content="Merge PDFs in your browser — drag, drop, reorder, and combine into one file. 100% private: nothing is uploaded to a server. Free, no sign-up." />
        <meta name="keywords" content="merge pdf, combine pdf, merge pdf free, merge pdf no upload, merge pdf online private, pdf merger, join pdf, combine multiple pdfs, merge pdf in browser" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Merge PDF | Toolisk" />
        <meta property="og:description" content="Merge PDFs in your browser — drag, drop, reorder, and combine. 100% private, no upload." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="📎"
        title="Merge PDF"
        tagline="Combine multiple PDFs into one file — drag to reorder, download instantly. No upload, no sign-up."
        gradient="from-rose-600 via-red-600 to-orange-500"
        parent="pdf"
      >
        <MergePdf />
      </ToolShell>

      <ToolSEOContent
        description="Merge multiple PDF files into one. Drag files to reorder before combining. Everything runs in your browser — no upload, no sign-up, no watermarks."
        features={[
          '🔒 100% client-side — your PDFs never leave your browser',
          '🔀 Drag-to-reorder files before merging',
          '📑 No page limit, no file count limit',
          '⚡ Instant download — no queue, no waiting',
          '🆓 Free forever, no sign-up, no watermark',
          '📱 Works on desktop and mobile browsers',
        ]}
        steps={[
          { title: 'Add your PDFs', desc: 'Drop multiple PDF files into the upload area, or click to browse.' },
          { title: 'Reorder', desc: 'Drag the rows up or down to set the final page order.' },
          { title: 'Merge', desc: "Click \"Merge PDFs\". Everything happens in your browser, in seconds." },
          { title: 'Download', desc: 'Save the combined file. The original files stay untouched on your device.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">When you actually need to merge PDFs</h2>
            <p className="text-slate-600 leading-relaxed">
              Combining PDFs is one of those tasks that comes up constantly: a scanned signed contract page that needs to join the rest of the unsigned PDF, bank statements from multiple months being collated for an accountant, design exports being assembled into a portfolio, or individual scanned receipts being bundled into a single expense file. In every case, the job is the same — put these files together, in this order, as one download.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a worked example: four bank statement PDFs, one per month, totaling 1.4 MB combined. After merging, the output is 1.4 MB and 24 pages — the original quality of every page is preserved because pdf-lib copies pages byte-for-byte; there is no re-render and no re-compression.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no upload matters</h3>
            <p className="text-slate-600 leading-relaxed">
              PDF documents are among the most sensitive files on your device — signed contracts, tax returns, payslips, medical records. Most online "merge PDF" tools upload your file to a third-party server, hold it for a few minutes, and trust that the company deletes it afterward. Toolisk does not upload. The PDF is opened, merged, and saved entirely inside the JavaScript runtime of your browser tab. When you close the tab, the merged file is gone from our reach forever — because it was never in our reach.
            </p>
            <ul className="list-none space-y-2 text-slate-600 text-sm mt-4">
              <li className="flex gap-3 items-start"><span className="text-rose-500 mt-0.5">✗</span><span><strong>Server-side merge tools:</strong> upload your PDF over the network → server holds the file → output downloaded → file may be cached, indexed, or retained.</span></li>
              <li className="flex gap-3 items-start"><span className="text-emerald-500 mt-0.5">✓</span><span><strong>Toolisk Merge PDF:</strong> file stays in your browser&apos;s memory → merged in JavaScript → saved to your device → nothing ever leaves your machine.</span></li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Split PDF', href: '/pdf/split-pdf', icon: '✂️' },
          { name: 'Reorder PDF Pages', href: '/pdf/reorder-pdf-pages', icon: '🔀' },
          { name: 'Unlock PDF', href: '/pdf/unlock-pdf', icon: '🔓' },
        ]}
      />
    </>
  );
}
