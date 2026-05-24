import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const FlattenPdfForm = dynamic(() => import('../../components/Pdf/FlattenPdfForm'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/flatten-pdf-form';
const FAQS = [
  { q: 'Is this safe? Does it upload my PDF?', a: 'No upload whatsoever. The form flattening runs entirely in your browser using pdf-lib. Your PDF and its data never leave your device.' },
  { q: 'What is the maximum file size?', a: 'PDFs up to 100 MB are accepted. Flattening is lightweight — it only modifies the form field annotations, not the page content.' },
  { q: 'Does it work offline?', a: 'After the page has loaded once, yes — pdf-lib is cached and flattening runs locally.' },
  { q: 'Will this work on iPhone / iPad?', a: 'Yes, on modern iOS Safari. Flattening is one of the lightest PDF operations.' },
  { q: 'What does flattening actually do?', a: 'Flattening converts filled form fields into static text and graphics on the page. After flattening, fields can no longer be edited — the filled values become part of the PDF content like any other text.' },
  { q: 'Will I lose my filled form data?', a: 'No — the filled values become permanent static content on the page, visible exactly as they were. However, fields can no longer be edited after flattening.' },
  { q: 'Why would I flatten a PDF form?', a: 'Flattening locks in the filled data so recipients can\'t modify it, makes the form look consistent in all PDF readers, and reduces file size slightly by removing the interactive field annotations.' },
];

export default function FlattenPdfFormPage() {
  const bc = generateBreadcrumbs(SLUG);
  const ss = generateSoftwareAppSchema({ name: 'Flatten PDF Form', slug: SLUG, description: 'Flatten PDF form fields into static content — lock filled values, remove editability. 100% private, no upload, runs in your browser.', category: 'UtilitiesApplication', featureList: 'Form flattening, Lock filled values, Static output, No upload, Free' });
  const fs = generateFaqSchema(FAQS);
  return (<>
    <Head>
      <title>Flatten PDF Form — Free, No Upload | Toolisk</title>
      <meta name="description" content="Flatten PDF form fields into static content — lock filled values and remove editability. 100% private: runs in your browser, no upload." />
      <meta name="keywords" content="flatten pdf form, lock pdf form, make pdf form permanent, flatten pdf fields, pdf form flattener no upload, flatten pdf form online free" />
      <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
      <meta property="og:title" content="Flatten PDF Form | Toolisk" />
      <meta property="og:description" content="Flatten PDF form fields into static content. 100% private, no upload." />
      <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
      <meta property="og:type" content="website" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([bc, ss, fs]) }} />
    </Head>
    <ToolShell icon="📝" title="Flatten PDF Form" tagline="Flatten fillable form fields into static content — lock filled values and remove editability. Runs in your browser." gradient="from-rose-600 via-red-600 to-orange-500" parent="pdf"><FlattenPdfForm /></ToolShell>
    <ToolSEOContent description="Convert a fillable PDF form into a flat, static PDF where filled values become permanent page content. This is useful when submitting finalized forms (like tax documents, applications, or signed agreements) — it locks in the data so recipients can't modify fields and ensures consistent appearance across all PDF readers. Uses pdf-lib's built-in flatten() method entirely in your browser. No upload, no sign-up, no watermark." features={['📝 Locks filled form values as permanent page content', '🔏 Removes editability — recipients cannot modify', '📄 Consistent rendering in any PDF reader', '🔒 100% client-side — your file never leaves your browser', '⚡ Instant — lightweight operation', '🆓 Free, no sign-up, no watermark']} steps={[{ title: 'Drop your PDF form', desc: 'With or without filled fields.' }, { title: 'Automatic flattening', desc: 'All fields are converted to static content.' }, { title: 'Download the flat PDF', desc: 'Fields are now permanent page content.' }]} faqs={FAQS} body={<section className="space-y-4"><h2 className="text-2xl font-bold text-slate-900">When to flatten a PDF form</h2><p className="text-slate-600 leading-relaxed">Flattening is the final step before submitting a filled PDF form. After filling a tax return, job application, insurance claim, or legal agreement, flattening locks the data so nobody can change it later. It also ensures the filled values display correctly in all PDF readers — some mobile readers render interactive fields inconsistently.</p><h3 className="text-xl font-bold text-slate-900 mt-8">Why no upload matters</h3><p className="text-slate-600 leading-relaxed">PDF forms often contain PII — Social Security numbers on tax forms, addresses on applications, financial figures on loan documents. Sending these to a server-side tool exposes your data. Toolisk flattens forms using pdf-lib entirely inside your browser. No file is ever uploaded.</p></section>} relatedTools={[{ name: 'PDF Metadata Editor', href: '/pdf/pdf-metadata-editor', icon: '🏷️' }, { name: 'Merge PDF', href: '/pdf/merge-pdf', icon: '📎' }, { name: 'Unlock PDF', href: '/pdf/unlock-pdf', icon: '🔓' }]} />
  </>);
}
