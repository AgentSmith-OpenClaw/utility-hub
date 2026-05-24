import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const ExtractPdfPages = dynamic(() => import('../../components/Pdf/ExtractPdfPages'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/extract-pdf-pages';
const FAQS = [
  { q: 'Is this safe? Does it upload my PDF?', a: 'No upload whatsoever. The entire operation runs in your browser using pdf-lib. Your PDF never leaves your device, is never sent to a server, and is never logged.' },
  { q: 'What is the maximum file size?', a: 'PDFs up to 100 MB are accepted. Files over 30 MB may be slower on mobile.' },
  { q: 'Does it work offline?', a: 'After the page has loaded once, yes — the PDF engine is cached and extraction runs locally.' },
  { q: 'Will this work on iPhone / iPad?', a: 'Yes, on modern iOS Safari. iOS limits per-tab memory, so very large PDFs (>50 MB) may encounter constraints.' },
  { q: 'How is this different from Delete Pages?', a: 'Extract Pages keeps only the pages you select. Delete Pages removes the pages you select. Same outcome, opposite ergonomics — choose whichever has fewer clicks.' },
  { q: 'Will the extracted pages lose quality?', a: 'No. pdf-lib copies the selected pages byte-for-byte. Quality is identical to the input.' },
];

export default function ExtractPdfPagesPage() {
  const bc = generateBreadcrumbs(SLUG);
  const ss = generateSoftwareAppSchema({ name: 'Extract Pages from PDF', slug: SLUG, description: 'Select and extract specific pages from a PDF with a visual page picker. 100% private, no upload. Runs in your browser.', category: 'UtilitiesApplication', featureList: 'Visual page picker, Multi-select, Range input, Instant download, No upload, Free' });
  const fs = generateFaqSchema(FAQS);
  return (<>
    <Head>
      <title>Extract Pages from PDF — In Browser, No Upload | Toolisk</title>
      <meta name="description" content="Select and extract specific pages from any PDF — visual page picker, multi-select, range support. 100% private: runs in your browser, no upload." />
      <meta name="keywords" content="extract pdf pages, extract pages from pdf, pdf page extractor, extract pages pdf no upload, keep selected pdf pages, extract pdf pages online free" />
      <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
      <meta property="og:title" content="Extract Pages from PDF | Toolisk" />
      <meta property="og:description" content="Select and extract specific pages from any PDF. 100% private, no upload." />
      <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
      <meta property="og:type" content="website" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([bc, ss, fs]) }} />
    </Head>
    <ToolShell icon="📋" title="Extract Pages from PDF" tagline="Select and extract specific pages from a PDF — visual page picker, runs entirely in your browser." gradient="from-rose-600 via-red-600 to-orange-500" parent="pdf"><ExtractPdfPages /></ToolShell>
    <ToolSEOContent description="Select specific pages from any PDF using a visual thumbnail picker. Click pages to mark them for extraction, or type a page range (e.g. 1-5, 8, 10-12). The selected pages are copied byte-for-byte into a new PDF — no re-rendering, original quality preserved. This is the inverse of Delete Pages: you pick what to keep instead of what to throw away. No upload, no account, no watermark." features={['📋 Visual page picker — select pages to keep', '🔢 Multi-select or use a page range', '🪶 Original quality preserved byte-for-byte', '🔒 100% client-side — your PDF never leaves your browser', '⚡ Instant download', '🆓 Free, no sign-up, no watermark']} steps={[{ title: 'Drop your PDF', desc: 'Any size up to 100 MB.' }, { title: 'Click pages to keep', desc: 'Or use the range input.' }, { title: 'Extract & download', desc: 'One click, original quality preserved.' }, { title: '(Optional) Rename', desc: 'Default name is {original}-extracted.pdf.' }]} faqs={FAQS} body={<section className="space-y-4"><h2 className="text-2xl font-bold text-slate-900">Extract vs Delete Pages</h2><p className="text-slate-600 leading-relaxed">Extract Pages and Delete Pages are two sides of the same coin. Extract keeps the pages you select; Delete removes them. The right choice depends on which requires fewer clicks: if you want 3 pages from a 40-page document, Extract wins. If you want to remove 3 pages from a 40-page document, Delete wins. Both produce a single output file preserving original quality, using the same pdf-lib engine entirely in your browser.</p><h3 className="text-xl font-bold text-slate-900 mt-8">Why no upload matters</h3><p className="text-slate-600 leading-relaxed">PDFs frequently contain sensitive information — contracts, medical records, financial statements. When you use a server-side tool, your file travels to a third party. Toolisk's Extract Pages tool uses pdf-lib entirely inside your browser tab. Nothing is transmitted anywhere.</p></section>} relatedTools={[{ name: 'Delete Pages from PDF', href: '/pdf/delete-pdf-pages', icon: '🗑️' }, { name: 'Reorder PDF Pages', href: '/pdf/reorder-pdf-pages', icon: '🔀' }, { name: 'Split PDF', href: '/pdf/split-pdf', icon: '✂️' }]} />
  </>);
}
