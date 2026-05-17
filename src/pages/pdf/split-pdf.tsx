import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SplitPdf = dynamic(() => import('../../components/Pdf/SplitPdf'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/split-pdf';

const FAQS = [
  { q: 'Is this safe? Does it upload my PDF?', a: 'No upload. The entire tool runs in your browser using JavaScript. Your file never leaves your device, never touches our server, and is never logged.' },
  { q: 'What is the maximum file size?', a: 'You can process PDFs up to ~100 MB. Files over 30 MB will be slower, especially on mobile.' },
  { q: 'Does it work offline?', a: 'After the page has loaded once, yes — the PDF engine is cached and the tool runs locally.' },
  { q: 'Will this work on iPhone / iPad?', a: 'Yes, on modern iOS Safari. iOS limits per-tab memory, so very large PDFs (>50 MB) may fail.' },
  { q: "What's the difference between Split and Extract Pages?", a: 'Split produces multiple output files — one per range, chunk, or page. Extract (keep pages) produces a single output file containing only the selected pages. Use Split when you need separate files, Extract when you want a trimmed version of the same document.' },
  { q: 'Can I split into uneven chunks?', a: 'Yes. The "By ranges" mode accepts any combination of ranges and single pages, so chunks can be of any size. For example: "1-2, 3-10, 11" gives you three files of 2 pages, 8 pages, and 1 page.' },
  { q: 'Are overlapping ranges allowed?', a: 'Yes — a page can appear in multiple output files. For example, "1-5, 3-7" will produce two files that both contain pages 3–5. This is useful when you need to distribute shared context across recipients.' },
  { q: 'What if my PDF has 500 pages?', a: 'The tool can handle it, but splitting every page into 500 individual files takes time and creates a large zip archive. For very long documents, Fixed Size chunking (e.g. 50 pages per chunk) is much faster and produces a manageable number of output files.' },
];

export default function SplitPdfPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Split PDF',
    slug: SLUG,
    description: 'Split a PDF by page ranges, every page, or fixed chunks — entirely in your browser. No upload, no sign-up, no watermarks. Free and private.',
    category: 'UtilitiesApplication',
    featureList: 'By ranges, Every page, Fixed size chunks, Zip download, No upload, No sign-up, Client-side only',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Split PDF — Free, In Browser, No Upload | Toolisk</title>
        <meta name="description" content="Split a PDF by page ranges or extract every page — entirely in your browser. No upload, no sign-up, no watermarks. Free and private." />
        <meta name="keywords" content="split pdf, split pdf free, split pdf online, split pdf no upload, extract pdf pages, separate pdf, split pdf by pages, pdf splitter in browser" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Split PDF | Toolisk" />
        <meta property="og:description" content="Split a PDF by page ranges or extract every page — entirely in your browser. No upload, no sign-up." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell
        icon="✂️"
        title="Split PDF"
        tagline="Split a PDF by page ranges, every page, or fixed chunks — all in your browser. No upload, no sign-up."
        gradient="from-rose-600 via-red-600 to-orange-500"
        parent="pdf"
      >
        <SplitPdf />
      </ToolShell>

      <ToolSEOContent
        description="Split any PDF into multiple files — by custom page ranges, one file per page, or fixed-size chunks. Everything runs in your browser using pdf-lib. No upload, no sign-up, no watermarks."
        features={[
          '🔒 100% client-side — your PDFs never leave your browser',
          '✂️ Three split modes: by ranges, every page, or fixed chunk size',
          '🔢 Smart range parser — supports "1-3, 5, 8-12" syntax',
          '📦 Download all output files as a single .zip archive',
          '⚡ Instant processing — no queue, no server wait',
          '📱 Works on desktop and mobile browsers',
        ]}
        steps={[
          { title: 'Drop your PDF', desc: 'Click the upload area or drag and drop a single PDF file.' },
          { title: 'Choose a split mode', desc: 'Pick "By ranges" to define exact pages, "Every page" to extract each page individually, or "Fixed size" to chunk the PDF into equal groups.' },
          { title: 'Split', desc: 'Click "Split into N files". The split runs entirely in your browser — no upload.' },
          { title: 'Download', desc: 'Download each output file individually, or click "Download all as .zip" to grab everything at once.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">When you actually need to split a PDF</h2>
            <p className="text-slate-600 leading-relaxed">
              Two situations come up constantly. First: you received a signed contract as a single PDF and need to extract just the signed page to attach to an email thread — the rest of the document stays confidential. Second: your scanner produced a 50-page bundle of mixed invoices and you need to separate each one for individual expense submissions. In both cases, the job is the same: take one PDF and produce several smaller, focused files.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a worked example: a 24-page bank statement PDF at 1.4 MB. Splitting it with "Every page" produces 24 output files averaging around 60 KB each. Splitting "1-6, 7-12, 13-18, 19-24" with the "By ranges" mode produces 4 quarterly-summary PDFs of 6 pages each.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no upload matters</h3>
            <p className="text-slate-600 leading-relaxed">
              PDFs are among the most sensitive documents on your device — contracts, tax returns, medical records, payslips. Most online "split PDF" tools upload your file to a third-party server, process it there, then trust that the company deletes it afterward. Toolisk does not upload. The split runs entirely inside the JavaScript runtime of your browser tab. When you close the tab, the output files are gone from our reach forever — because they were never in our reach.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Toolisk vs server-side PDF splitters</h3>
            <ul className="list-none space-y-2 text-slate-600 text-sm mt-4">
              <li className="flex gap-3 items-start"><span className="text-rose-500 mt-0.5">✗</span><span><strong>Server-side splitters:</strong> cap free splits to 2–5 per day, add watermarks on free plans, upload your file to a server, and may retain it for analytics.</span></li>
              <li className="flex gap-3 items-start"><span className="text-emerald-500 mt-0.5">✓</span><span><strong>Toolisk Split PDF:</strong> no split limits, no watermarks, no upload, no caps — the only limit is your browser's available memory.</span></li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Merge PDF', href: '/pdf/merge-pdf', icon: '📎' },
          { name: 'Delete Pages from PDF', href: '/pdf/delete-pdf-pages', icon: '🗑️' },
          { name: 'Reorder PDF Pages', href: '/pdf/reorder-pdf-pages', icon: '🔀' },
        ]}
      />
    </>
  );
}
