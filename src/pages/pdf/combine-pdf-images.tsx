import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const CombinePdfImages = dynamic(() => import('../../components/Pdf/CombinePdfImages'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/combine-pdf-images';
const FAQS = [
  { q: 'Is this safe? Does it upload my files?', a: 'No upload whatsoever. All combining runs in your browser using pdf-lib. Your files never leave your device.' },
  { q: 'What file types are supported?', a: 'PDF, JPG, JPEG, PNG, and WebP images. Each image becomes a full page at A4/Letter dimensions with the image scaled to fit.' },
  { q: 'What is the maximum file size?', a: 'Individual files up to 100 MB each. Total combined size may be limited by browser memory on mobile.' },
  { q: 'Does it work offline?', a: 'After the page has loaded once, yes — pdf-lib is cached and combining runs locally.' },
  { q: 'Can I reorder files?', a: 'Yes — use the up/down arrows to arrange files in any order before combining.' },
  { q: 'What happens to multi-page PDFs?', a: 'All pages from each PDF are included in order. Each image becomes one page.' },
];

export default function CombinePdfImagesPage() {
  const bc = generateBreadcrumbs(SLUG);
  const ss = generateSoftwareAppSchema({ name: 'Combine PDF with Images', slug: SLUG, description: 'Combine PDFs and images (JPG, PNG, WebP) into a single PDF — reorder, merge, download. 100% private, no upload.', category: 'UtilitiesApplication', featureList: 'PDF+image merge, Reorder files, Multi-page support, No upload, Free' });
  const fs = generateFaqSchema(FAQS);
  return (<>
    <Head>
      <title>Combine PDF & Images — Free, No Upload | Toolisk</title>
      <meta name="description" content="Combine PDFs with JPG, PNG, or WebP images into a single PDF — reorder files and merge in one click. 100% private: runs in your browser, no upload." />
      <meta name="keywords" content="combine pdf images, merge pdf with images, add image to pdf, pdf image combiner, combine pdf jpg, combine pdf and images no upload" />
      <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
      <meta property="og:title" content="Combine PDF & Images | Toolisk" />
      <meta property="og:description" content="Combine PDFs with images into a single PDF. 100% private, no upload." />
      <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
      <meta property="og:type" content="website" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([bc, ss, fs]) }} />
    </Head>
    <ToolShell icon="📎" title="Combine PDF & Images" tagline="Mix PDFs and images into a single PDF — reorder, merge, and download. Runs entirely in your browser." gradient="from-rose-600 via-red-600 to-orange-500" parent="pdf"><CombinePdfImages /></ToolShell>
    <ToolSEOContent description="Drop a mix of PDF files and images (JPG, PNG, WebP) to combine them into a single PDF. Each image becomes a full page scaled to fit. Multi-page PDFs contribute all their pages in sequence. Reorder files with the arrow buttons before clicking Combine. Uses pdf-lib entirely in your browser — no files are uploaded to any server. Free, no sign-up, no watermark." features={['📎 Mix PDFs + images into one PDF', '🖼️ JPG, PNG, WebP support', '↕️ Reorder files before combining', '📄 Multi-page PDF pages preserved', '🔒 100% client-side — files never leave your browser', '🆓 Free, no sign-up, no watermark']} steps={[{ title: 'Drop files', desc: 'PDFs and images together.' }, { title: 'Reorder if needed', desc: 'Move files up/down in the list.' }, { title: 'Combine & download', desc: 'One click. All pages merged in order.' }]} faqs={FAQS} body={<section className="space-y-4"><h2 className="text-2xl font-bold text-slate-900">Merge mixed media into one PDF</h2><p className="text-slate-600 leading-relaxed">Assemble a PDF from photos, scans, screenshots, and existing documents. Great for: creating a single PDF from a mix of phone photos and existing PDFs, combining scanned receipts with a PDF report, or appending a PNG signature to a contract PDF.</p></section>} relatedTools={[{ name: 'Merge PDF', href: '/pdf/merge-pdf', icon: '📎' }, { name: 'JPG to PDF', href: '/pdf/jpg-to-pdf', icon: '🖼️' }, { name: 'Compress PDF', href: '/pdf/compress-pdf', icon: '🗜️' }]} />
  </>);
}
