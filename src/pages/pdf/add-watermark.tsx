import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const AddWatermark = dynamic(() => import('../../components/Pdf/AddWatermark'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/add-watermark';
const FAQS = [
  { q: 'Is this safe? Does it upload my PDF?', a: 'No upload whatsoever. The watermark is drawn using pdf-lib entirely in your browser. Your PDF never leaves your device.' },
  { q: 'What is the maximum file size?', a: 'PDFs up to 100 MB are accepted. Files over 30 MB may be slower on mobile due to per-page text rendering.' },
  { q: 'Does it work offline?', a: 'After the page has loaded once, yes — pdf-lib is cached and watermarking runs locally.' },
  { q: 'Will this work on iPhone / iPad?', a: 'Yes, on modern iOS Safari.' },
  { q: 'What text can I use as a watermark?', a: 'Any text — common choices include CONFIDENTIAL, DRAFT, SAMPLE, DO NOT COPY, or your company name. Font is Helvetica Bold for visibility.' },
  { q: 'Can I customize the appearance?', a: 'Yes — choose font size (12–200), color (light gray, red, or blue), and the text itself. The watermark is drawn at a -45° angle across the center of each page.' },
  { q: 'Is the watermark permanent?', a: 'The text is drawn into the PDF content stream of each page — it becomes part of the page like any other drawn text. It cannot be removed without editing the content stream.' },
];

export default function AddWatermarkPage() {
  const bc = generateBreadcrumbs(SLUG);
  const ss = generateSoftwareAppSchema({ name: 'Add Watermark to PDF', slug: SLUG, description: 'Add a text watermark (CONFIDENTIAL, DRAFT, etc.) to all pages of a PDF. 100% private, no upload, runs in your browser.', category: 'UtilitiesApplication', featureList: 'Text watermark, Diagonal placement, Color options, Font sizing, No upload, Free' });
  const fs = generateFaqSchema(FAQS);
  return (<>
    <Head>
      <title>Add Watermark to PDF — Free, No Upload | Toolisk</title>
      <meta name="description" content="Add a text watermark to all pages of a PDF — CONFIDENTIAL, DRAFT, SAMPLE, or custom text. 100% private: runs in your browser, no upload." />
      <meta name="keywords" content="add watermark to pdf, pdf watermark, watermark pdf, confidential watermark pdf, draft watermark pdf, add watermark pdf no upload, watermark pdf online free" />
      <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
      <meta property="og:title" content="Add Watermark to PDF | Toolisk" />
      <meta property="og:description" content="Add a text watermark to any PDF — choose text, size, and color. 100% private, no upload." />
      <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
      <meta property="og:type" content="website" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([bc, ss, fs]) }} />
    </Head>
    <ToolShell icon="💧" title="Add Watermark" tagline="Add a text watermark to all pages — CONFIDENTIAL, DRAFT, or custom text. Runs entirely in your browser." gradient="from-rose-600 via-red-600 to-orange-500" parent="pdf"><AddWatermark /></ToolShell>
    <ToolSEOContent description="Add a diagonal text watermark to every page of any PDF. Common uses: marking documents as CONFIDENTIAL before sharing, adding DRAFT or SAMPLE labels to work-in-progress files, or branding documents with your company name. The watermark is drawn at -45° across the center of each page using Helvetica Bold. Choose from light gray, red, or blue colors and adjust font size from 12 to 200 points. Uses pdf-lib's text drawing API entirely in your browser. No upload, no sign-up, no watermark restrictions." features={['💧 Diagonal text watermark on all pages', '✏️ Custom text — CONFIDENTIAL, DRAFT, or yours', '🎨 Light gray, red, or blue color options', '📏 Adjustable font size (12–200 pt)', '🔒 100% client-side — your PDF never leaves your browser', '🆓 Free, no sign-up, no watermark']} steps={[{ title: 'Drop your PDF', desc: 'Any size up to 100 MB.' }, { title: 'Set watermark text', desc: 'e.g. CONFIDENTIAL, DRAFT, SAMPLE.' }, { title: 'Choose size & color', desc: 'Visible but not obstructive.' }, { title: 'Add & download', desc: 'One click, watermarked on all pages.' }]} faqs={FAQS} body={<section className="space-y-4"><h2 className="text-2xl font-bold text-slate-900">Mark documents with visible labels</h2><p className="text-slate-600 leading-relaxed">Watermarks serve two purposes: they communicate document status (DRAFT, CONFIDENTIAL, FOR REVIEW) and they deter unauthorized redistribution by making the document visibly marked. This tool adds a diagonal text watermark across every page of your PDF, drawn directly into the content stream so it appears in any PDF reader.</p><h3 className="text-xl font-bold text-slate-900 mt-8">Why no upload matters</h3><p className="text-slate-600 leading-relaxed">If you are watermarking a confidential document, the last thing you want is to upload it to a server. Toolisk draws the watermark locally in your browser — the file never leaves your device. Your content stays private.</p></section>} relatedTools={[{ name: 'Add Page Numbers', href: '/pdf/add-page-numbers', icon: '🔢' }, { name: 'Protect PDF', href: '/pdf/protect-pdf', icon: '🔐' }, { name: 'Compress PDF', href: '/pdf/compress-pdf', icon: '🗜️' }]} />
  </>);
}
