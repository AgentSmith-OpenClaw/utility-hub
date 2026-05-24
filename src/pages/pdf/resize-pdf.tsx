import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const ResizePdf = dynamic(() => import('../../components/Pdf/ResizePdf'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/resize-pdf';
const FAQS = [
  { q: 'Is this safe? Does it upload my PDF?', a: 'No upload whatsoever. Resizing runs entirely in your browser using pdf-lib. Your PDF never leaves your device.' },
  { q: 'What is the maximum file size?', a: 'PDFs up to 100 MB are accepted. Files over 30 MB may be slower on mobile.' },
  { q: 'Does it work offline?', a: 'After the page has loaded once, yes — pdf-lib is cached and resizing runs locally.' },
  { q: 'Will this work on iPhone / iPad?', a: 'Yes, on modern iOS Safari.' },
  { q: 'What page sizes are supported?', a: 'A4, Letter, Legal, A5, A3, Tabloid, and custom dimensions in points (1 inch = 72 pt).' },
  { q: 'What fit modes are available?', a: 'Scale to fit maintains aspect ratio; Stretch to fill distorts to fill the new size; Keep original size centers content without scaling.' },
  { q: 'Will resizing affect print output?', a: 'Yes — the new page size is the actual media box. Printers will use the new dimensions. Choose "Scale to fit" to prevent content from being cut off.' },
];

export default function ResizePdfPage() {
  const bc = generateBreadcrumbs(SLUG);
  const ss = generateSoftwareAppSchema({ name: 'Resize PDF', slug: SLUG, description: 'Change PDF page size — A4, Letter, Legal, custom, with scale/stretch/fit options. 100% private, no upload, runs in your browser.', category: 'UtilitiesApplication', featureList: 'A4/Letter/Legal presets, Custom dimensions, Scale/fit/stretch, No upload, Free' });
  const fs = generateFaqSchema(FAQS);
  return (<>
    <Head>
      <title>Resize PDF — Change Page Size, No Upload | Toolisk</title>
      <meta name="description" content="Change PDF page size to A4, Letter, Legal, or custom dimensions — with scale/resize/fit options. 100% private: runs in your browser, no upload." />
      <meta name="keywords" content="resize pdf, change pdf page size, pdf a4 to letter, pdf letter to a4, resize pdf pages no upload, pdf page size changer online free" />
      <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
      <meta property="og:title" content="Resize PDF | Toolisk" />
      <meta property="og:description" content="Change PDF page size to A4, Letter, Legal, or custom. 100% private, no upload." />
      <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
      <meta property="og:type" content="website" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([bc, ss, fs]) }} />
    </Head>
    <ToolShell icon="📐" title="Resize PDF" tagline="Change PDF page size — A4, Letter, Legal, custom dimensions with fit options. Runs entirely in your browser." gradient="from-rose-600 via-red-600 to-orange-500" parent="pdf"><ResizePdf /></ToolShell>
    <ToolSEOContent description="Change the page dimensions of any PDF to A4, Letter, Legal, A5, A3, Tabloid, or custom sizes in points. Choose how content fits: Scale to fit maintains aspect ratio, Stretch fills the new dimensions, or Keep original size centers the content without scaling. All pages are resized consistently using pdf-lib's page manipulation API. Content is preserved — the tool adjusts page boxes and optionally scales content streams. No upload, no sign-up, no watermark." features={['📐 A4, Letter, Legal, A5, A3, Tabloid presets', '📏 Custom dimensions in points', '↔️ Scale to fit, stretch, or keep original size', '🔒 100% client-side — your PDF never leaves your browser', '📄 All pages resized consistently', '🆓 Free, no sign-up, no watermark']} steps={[{ title: 'Drop your PDF', desc: 'Any size up to 100 MB.' }, { title: 'Choose target size', desc: 'A4, Letter, Legal, or custom in pt.' }, { title: 'Select fit mode', desc: 'Scale, stretch, or center.' }, { title: 'Resize & download', desc: 'One click, all pages updated.' }]} faqs={FAQS} body={<section className="space-y-4"><h2 className="text-2xl font-bold text-slate-900">Standardize PDF page sizes</h2><p className="text-slate-600 leading-relaxed">A common workflow: you receive a PDF in A4 from a European colleague but need Letter for US printing. Or you have a mix of page sizes in a scanned document and need to standardize. This tool resizes all pages to a consistent target using pdf-lib in your browser, with intelligent fit options to avoid cut-off content.</p></section>} relatedTools={[{ name: 'Crop PDF', href: '/pdf/crop-pdf', icon: '✂️' }, { name: 'Compress PDF', href: '/pdf/compress-pdf', icon: '🗜️' }, { name: 'Rotate PDF', href: '/pdf/rotate-pdf', icon: '🔄' }]} />
  </>);
}
