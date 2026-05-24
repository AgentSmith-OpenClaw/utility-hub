import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const CropPdf = dynamic(() => import('../../components/Pdf/CropPdf'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/crop-pdf';
const FAQS = [
  { q: 'Is this safe? Does it upload my PDF?', a: 'No upload whatsoever. Cropping runs entirely in your browser using pdf-lib. Your PDF never leaves your device.' },
  { q: 'What is the maximum file size?', a: 'PDFs up to 100 MB are accepted. Files over 30 MB may be slower on mobile.' },
  { q: 'Does it work offline?', a: 'After the page has loaded once, yes — pdf-lib is cached and cropping runs locally.' },
  { q: 'Will this work on iPhone / iPad?', a: 'Yes, on modern iOS Safari.' },
  { q: 'How is crop different from resize?', a: 'Crop adjusts the visible area of each page without changing content size — like trimming photo edges. Resize changes the page dimensions and optionally scales content.' },
  { q: 'Can I undo a crop?', a: 'Crop sets the CropBox — most PDF readers respect it, but the original content outside the crop region still exists in the file. For a permanent trim, use our Resize tool.' },
  { q: 'What units are the margins in?', a: 'Points (pt). 1 inch = 72 pt, 1 cm ≈ 28.35 pt.' },
];

export default function CropPdfPage() {
  const bc = generateBreadcrumbs(SLUG);
  const ss = generateSoftwareAppSchema({ name: 'Crop PDF', slug: SLUG, description: 'Crop PDF pages — set margins on all sides to trim white space or focus on content. 100% private, no upload, runs in your browser.', category: 'UtilitiesApplication', featureList: 'Set crop margins, All pages, Instant, No upload, Free' });
  const fs = generateFaqSchema(FAQS);
  return (<>
    <Head>
      <title>Crop PDF — Trim Margins, No Upload | Toolisk</title>
      <meta name="description" content="Crop PDF pages by setting margin values — trim white space or focus on content. 100% private: runs in your browser, no upload." />
      <meta name="keywords" content="crop pdf, trim pdf margins, crop pdf pages, pdf crop tool, crop pdf no upload, crop pdf online free" />
      <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
      <meta property="og:title" content="Crop PDF | Toolisk" />
      <meta property="og:description" content="Crop PDF pages by setting margins. 100% private, no upload." />
      <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
      <meta property="og:type" content="website" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([bc, ss, fs]) }} />
    </Head>
    <ToolShell icon="✂️" title="Crop PDF" tagline="Crop PDF pages by setting margin values — trim white space or focus on content. Runs entirely in your browser." gradient="from-rose-600 via-red-600 to-orange-500" parent="pdf"><CropPdf /></ToolShell>
    <ToolSEOContent description="Crop the visible area of PDF pages by setting margin values on all four sides. Enter top, bottom, left, and right margins in points (1 inch = 72 pt) — the crop box is adjusted on every page consistently. Useful for trimming excess white space, removing headers/footers, or focusing on specific content regions. Uses pdf-lib's setCropBox API entirely in your browser. No upload, no sign-up, no watermark." features={['✂️ Set top, bottom, left, and right crop margins', '📄 Applied to all pages consistently', '📏 Margins in points (72 pt = 1 inch)', '🔒 100% client-side — your PDF never leaves your browser', '⚡ Instant — modifies page boxes, not content', '🆓 Free, no sign-up, no watermark']} steps={[{ title: 'Drop your PDF', desc: 'Any size up to 100 MB.' }, { title: 'Set margin values', desc: 'Top, bottom, left, right in points.' }, { title: 'Crop & download', desc: 'One click, applied to all pages.' }]} faqs={FAQS} body={<section className="space-y-4"><h2 className="text-2xl font-bold text-slate-900">Trim PDF page margins</h2><p className="text-slate-600 leading-relaxed">Scanned documents often have large white borders, and exported reports may have unnecessary headers or footers occupying page space. Cropping sets a visible region on each page without modifying the underlying content — the cropped-out areas still exist in the file and can be restored by most PDF readers. For a permanent content removal, pair this with our Resize tool.</p><h3 className="text-xl font-bold text-slate-900 mt-8">Why no upload matters</h3><p className="text-slate-600 leading-relaxed">PDFs often contain sensitive content that should not leave your device — even for basic operations like margin trimming. Toolisk's Crop tool uses pdf-lib entirely in your browser. The file bytes never travel anywhere.</p></section>} relatedTools={[{ name: 'Resize PDF', href: '/pdf/resize-pdf', icon: '📐' }, { name: 'Rotate PDF', href: '/pdf/rotate-pdf', icon: '🔄' }, { name: 'Compress PDF', href: '/pdf/compress-pdf', icon: '🗜️' }]} />
  </>);
}
