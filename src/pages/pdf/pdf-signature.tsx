import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const PdfSignature = dynamic(() => import('../../components/Pdf/PdfSignature'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/pdf-signature';
const FAQS = [
  { q: 'Is this safe? Does it upload my PDF?', a: 'No upload whatsoever. The signature is drawn locally and placed using pdf-lib entirely in your browser. Your PDF and signature never leave your device.' },
  { q: 'What is the maximum file size?', a: 'PDFs up to 100 MB are accepted. The signature placement is lightweight — only adds a small PNG image to the page.' },
  { q: 'Does it work offline?', a: 'After the page has loaded once, yes. Drawing and placement run locally.' },
  { q: 'Will this work on iPhone / iPad?', a: 'Yes — the touch canvas works on mobile devices for finger or stylus drawing.' },
  { q: 'Can I place the signature on a specific page?', a: 'Yes — choose any page from the dropdown. The signature is placed only on that page.' },
  { q: 'Can I adjust size and position?', a: 'Yes — set X/Y coordinates in points and a scale factor (0.1–5×).' },
  { q: 'Is this a legally binding e-signature?', a: 'This tool places a visual signature image on the page — it is not a cryptographic digital signature. For legal e-signatures, use DocuSign or similar services. This is for visual placement of a signature graphic.' },
];

export default function PdfSignaturePage() {
  const bc = generateBreadcrumbs(SLUG);
  const ss = generateSoftwareAppSchema({ name: 'PDF Signature', slug: SLUG, description: 'Draw and place a signature on any PDF page — touch/mouse canvas, position and scale controls. 100% private, no upload.', category: 'UtilitiesApplication', featureList: 'Canvas drawing, Touch support, Page selector, Position controls, No upload, Free' });
  const fs = generateFaqSchema(FAQS);
  return (<>
    <Head>
      <title>PDF Signature — Draw & Place, No Upload | Toolisk</title>
      <meta name="description" content="Draw a signature on a canvas and place it on any page of a PDF — mouse or touch, position and scale controls. 100% private: runs in your browser, no upload." />
      <meta name="keywords" content="pdf signature, sign pdf, draw signature on pdf, pdf signature tool, sign pdf no upload, add signature to pdf online free" />
      <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
      <meta property="og:title" content="PDF Signature | Toolisk" />
      <meta property="og:description" content="Draw and place a signature on any PDF page. 100% private, no upload." />
      <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
      <meta property="og:type" content="website" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([bc, ss, fs]) }} />
    </Head>
    <ToolShell icon="✍️" title="PDF Signature" tagline="Draw your signature and place it on any PDF page — mouse or touch, position and scale controls. Runs in your browser." gradient="from-rose-600 via-red-600 to-orange-500" parent="pdf"><PdfSignature /></ToolShell>
    <ToolSEOContent description="Draw a signature using your mouse, trackpad, or touch screen and place it directly onto any page of a PDF. The canvas supports smooth drawing with pressure-free strokes. Once saved, your signature is embedded as a PNG image and placed at your chosen position and scale on the selected page using pdf-lib. The original page content is preserved — the signature is drawn on top. Ideal for visually signing forms, letters, and documents. Note: this places a visual signature graphic, not a cryptographic digital signature. No upload, no sign-up, no watermark." features={['✍️ Draw signature with mouse, trackpad, or touch', '📄 Place on any page of your PDF', '📏 Adjustable X/Y position and scale', '🖼️ Embedded as PNG on the page', '🔒 100% client-side — files never leave your browser', '🆓 Free, no sign-up, no watermark']} steps={[{ title: 'Drop your PDF', desc: 'Any size up to 100 MB.' }, { title: 'Draw your signature', desc: 'Use mouse, trackpad, or touch.' }, { title: 'Set position & page', desc: 'Choose page, X/Y, and scale.' }, { title: 'Place & download', desc: 'Signature embedded on the page.' }]} faqs={FAQS} body={<section className="space-y-4"><h2 className="text-2xl font-bold text-slate-900">Visual signing for PDF documents</h2><p className="text-slate-600 leading-relaxed">Place a visual signature on any PDF page — useful for quickly signing forms, letters, or adding a signature graphic where a formal e-signature is not required. This is not a cryptographic digital signature and does not carry legal e-signature weight. For legally binding signatures, use dedicated e-signature platforms.</p></section>} relatedTools={[{ name: 'Protect PDF', href: '/pdf/protect-pdf', icon: '🔐' }, { name: 'Flatten PDF Form', href: '/pdf/flatten-pdf-form', icon: '📝' }, { name: 'Merge PDF', href: '/pdf/merge-pdf', icon: '📎' }]} />
  </>);
}
