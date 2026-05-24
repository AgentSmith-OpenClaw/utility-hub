import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const AddPageNumbers = dynamic(() => import('../../components/Pdf/AddPageNumbers'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/add-page-numbers';
const FAQS = [
  { q: 'Is this safe? Does it upload my PDF?', a: 'No upload whatsoever. Page numbers are drawn using pdf-lib entirely in your browser. Your PDF never leaves your device.' },
  { q: 'What is the maximum file size?', a: 'PDFs up to 100 MB are accepted. Files over 30 MB may be slower on mobile due to the per-page text rendering.' },
  { q: 'Does it work offline?', a: 'After the page has loaded once, yes — pdf-lib is cached and page numbering runs locally.' },
  { q: 'Will this work on iPhone / iPad?', a: 'Yes, on modern iOS Safari.' },
  { q: 'Can I start numbering from a specific number?', a: 'Yes — set the starting number. For example, start at 1 for a standalone document or 42 to continue from a previous section.' },
  { q: 'Where are the numbers placed?', a: 'Choose from bottom center, bottom left/right, or top center/left/right. Numbers are placed in the margin area.' },
  { q: 'Will existing page numbers be overwritten?', a: 'The new numbers are drawn over the existing page content. If there are existing numbers, they will still be visible underneath. Consider cropping or using a PDF editor to remove them first.' },
];

export default function AddPageNumbersPage() {
  const bc = generateBreadcrumbs(SLUG);
  const ss = generateSoftwareAppSchema({ name: 'Add Page Numbers to PDF', slug: SLUG, description: 'Add page numbers to any PDF — choose position, starting number, and font size. 100% private, no upload, runs in your browser.', category: 'UtilitiesApplication', featureList: 'Page numbering, Position picker, Start number, Font size, No upload, Free' });
  const fs = generateFaqSchema(FAQS);
  return (<>
    <Head>
      <title>Add Page Numbers to PDF — Free, No Upload | Toolisk</title>
      <meta name="description" content="Add page numbers to any PDF — choose position (bottom/top, left/center/right), starting number, and font size. 100% private: runs in your browser, no upload." />
      <meta name="keywords" content="add page numbers to pdf, pdf page numbering, number pdf pages, insert page numbers pdf, pdf page number no upload, add page numbers pdf online free" />
      <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
      <meta property="og:title" content="Add Page Numbers to PDF | Toolisk" />
      <meta property="og:description" content="Add page numbers to any PDF with customizable position and formatting. 100% private, no upload." />
      <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
      <meta property="og:type" content="website" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([bc, ss, fs]) }} />
    </Head>
    <ToolShell icon="🔢" title="Add Page Numbers" tagline="Add page numbers to any PDF — choose position, starting number, and font size. Runs entirely in your browser." gradient="from-rose-600 via-red-600 to-orange-500" parent="pdf"><AddPageNumbers /></ToolShell>
    <ToolSEOContent description="Add sequential page numbers to any PDF document. Choose where numbers appear (bottom center, bottom left/right, or top positions), set the starting number, and pick the font size. Numbers are drawn using pdf-lib's text drawing API on each page, embedded in the PDF content stream. Ideal for reports, proposals, e-books, and any multi-page document that needs visible page numbering. No upload, no sign-up, no watermark." features={['🔢 Sequential page numbering on all pages', '📍 6 position options — bottom/top, left/center/right', '🔢 Customizable starting number', '📏 Adjustable font size', '🔒 100% client-side — your PDF never leaves your browser', '🆓 Free, no sign-up, no watermark']} steps={[{ title: 'Drop your PDF', desc: 'Any size up to 100 MB.' }, { title: 'Set options', desc: 'Position, start number, font size.' }, { title: 'Add numbers & download', desc: 'One click, all pages numbered.' }]} faqs={FAQS} body={<section className="space-y-4"><h2 className="text-2xl font-bold text-slate-900">Number pages in any PDF</h2><p className="text-slate-600 leading-relaxed">Whether you are preparing a report, finalizing an e-book, or assembling a multi-section document, page numbers help readers navigate. This tool adds sequential numbers to every page using Helvetica font in your chosen position and size.</p><h3 className="text-xl font-bold text-slate-900 mt-8">Why no upload matters</h3><p className="text-slate-600 leading-relaxed">Your document content is private. Toolisk adds page numbers locally in your browser — the file never leaves your device. No server processes your document, no data is collected.</p></section>} relatedTools={[{ name: 'Add Watermark', href: '/pdf/add-watermark', icon: '💧' }, { name: 'Merge PDF', href: '/pdf/merge-pdf', icon: '📎' }, { name: 'Reorder PDF Pages', href: '/pdf/reorder-pdf-pages', icon: '🔀' }]} />
  </>);
}
