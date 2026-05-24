import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const NupPdf = dynamic(() => import('../../components/Pdf/NupPdf'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/n-up-pdf';
const FAQS = [
  { q: 'Is this safe? Does it upload my PDF?', a: 'No upload whatsoever. Processing runs entirely in your browser using pdf-lib. Your PDF never leaves your device.' },
  { q: 'What is the maximum file size?', a: 'PDFs up to 100 MB are accepted. Processing many pages into N-up format may be slower on mobile.' },
  { q: 'Does it work offline?', a: 'After the page has loaded once, yes — pdf-lib is cached and N-up processing runs locally.' },
  { q: 'Will this work on iPhone / iPad?', a: 'Yes, on modern iOS Safari. Processing large PDFs may be slower.' },
  { q: 'What do 2-up and 4-up mean?', a: '2-up places 2 pages side-by-side on each output sheet, halving the page count. 4-up places 4 pages in a 2×2 grid, quartering the page count. Both are common for printing handouts or slide decks.' },
  { q: 'Is page content scaled?', a: 'Yes — each page is scaled proportionally to fit within its cell while maintaining aspect ratio.' },
];

export default function NupPdfPage() {
  const bc = generateBreadcrumbs(SLUG);
  const ss = generateSoftwareAppSchema({ name: 'N-up PDF', slug: SLUG, description: 'Combine multiple PDF pages per sheet — 2-up or 4-up grid layout for printing handouts. 100% private, no upload.', category: 'UtilitiesApplication', featureList: '2-up layout, 4-up grid, Proportional scaling, No upload, Free' });
  const fs = generateFaqSchema(FAQS);
  return (<>
    <Head>
      <title>N-up PDF — Multiple Pages Per Sheet, No Upload | Toolisk</title>
      <meta name="description" content="Combine multiple PDF pages per sheet — 2-up or 4-up grid layout for printing handouts and slide decks. 100% private: runs in your browser, no upload." />
      <meta name="keywords" content="n-up pdf, multiple pages per sheet, 2-up pdf, 4-up pdf, pdf handout, pdf booklet, n-up pdf no upload, multiple pages per sheet pdf online free" />
      <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
      <meta property="og:title" content="N-up PDF | Toolisk" />
      <meta property="og:description" content="Combine multiple PDF pages per sheet — 2-up or 4-up layout. 100% private, no upload." />
      <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
      <meta property="og:type" content="website" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([bc, ss, fs]) }} />
    </Head>
    <ToolShell icon="📐" title="N-up PDF" tagline="Combine multiple pages per sheet — 2-up or 4-up layout for printing handouts and slide decks. Runs in your browser." gradient="from-rose-600 via-red-600 to-orange-500" parent="pdf"><NupPdf /></ToolShell>
    <ToolSEOContent description="Arrange multiple PDF pages onto a single sheet in a grid layout. Choose 2-up (2 pages side by side, ideal for printing 2 slides per handout page) or 4-up (4 pages in a 2×2 grid, ideal for compact slide decks or note-taking sheets). Each page is scaled proportionally to fit within its cell. The output uses the same page size as the input — usually Letter or A4 — with pages arranged in reading order. Uses pdf-lib's embedPage and drawPage API entirely in your browser. No upload, no sign-up, no watermark." features={['📐 2-up — 2 pages side by side per sheet', '📊 4-up — 4 pages in a 2×2 grid per sheet', '↔️ Proportional scaling — no content distortion', '🖨️ Ideal for printing handouts and slide decks', '🔒 100% client-side — your PDF never leaves your browser', '🆓 Free, no sign-up, no watermark']} steps={[{ title: 'Drop your PDF', desc: 'Any size up to 100 MB.' }, { title: 'Choose layout', desc: '2-up or 4-up grid.' }, { title: 'Combine & download', desc: 'Pages scaled and arranged on sheets.' }]} faqs={FAQS} body={<section className="space-y-4"><h2 className="text-2xl font-bold text-slate-900">Print efficiently with N-up layouts</h2><p className="text-slate-600 leading-relaxed">N-up printing puts multiple pages on each printed sheet, saving paper and creating compact handouts. 2-up is ideal for printing presentation slides (2 per page) with space for notes. 4-up creates a dense grid useful for reference sheets. This tool pre-arranges pages so any PDF reader prints them correctly.</p></section>} relatedTools={[{ name: 'Resize PDF', href: '/pdf/resize-pdf', icon: '📐' }, { name: 'Merge PDF', href: '/pdf/merge-pdf', icon: '📎' }, { name: 'Crop PDF', href: '/pdf/crop-pdf', icon: '✂️' }]} />
  </>);
}
