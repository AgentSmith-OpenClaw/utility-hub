import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const ReorderPdfPages = dynamic(() => import('../../components/Pdf/ReorderPdfPages'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/reorder-pdf-pages';

const FAQS = [
  {
    q: 'Is this safe? Does it upload my PDF?',
    a: 'No upload whatsoever. The entire operation runs in your browser using JavaScript and the open-source pdf-lib library. Your PDF never leaves your device, is never sent to a server, and is never logged. This makes it safe for sensitive files like contracts, medical reports, or financial statements.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'PDFs up to 100 MB are accepted. Files over 30 MB may be slower on mobile. For very large PDFs, consider splitting the file first using the Split PDF tool, then reordering each part.',
  },
  {
    q: 'Does it work offline?',
    a: 'After the page has loaded once, yes — the PDF engine is cached in your browser and reordering runs locally even without an internet connection.',
  },
  {
    q: 'Will this work on iPhone / iPad?',
    a: 'Yes, on modern iOS Safari. iOS limits per-tab memory, so processing PDFs with hundreds of pages may be slow or cause the tab to reload. For large files, try splitting first.',
  },
  {
    q: 'Will reordering re-render the pages?',
    a: 'No. We copy pages byte-for-byte using pdf-lib; the visible content of each page is untouched. Only the order changes.',
  },
  {
    q: 'Can I duplicate a page while reordering?',
    a: 'Not in this tool — reorder is a one-to-one rearrangement. If you need to duplicate a page, extract it with Split PDF and merge it in where you want.',
  },
  {
    q: 'Does drag-and-drop work on a phone or tablet?',
    a: 'Yes — the page grid responds to touch events on iOS Safari and Chrome for Android. Long-press a thumbnail to start dragging.',
  },
  {
    q: 'Can I save my reordered file with a different name?',
    a: 'Yes — the filename field defaults to {original}-reordered.pdf but you can change it before downloading.',
  },
];

export default function ReorderPdfPagesPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Reorder PDF Pages',
    slug: SLUG,
    description: 'Drag PDF pages into any order with a visual grid. Quality preserved exactly. Runs entirely in your browser — no upload.',
    category: 'UtilitiesApplication',
    featureList: 'Client-side processing, Visual drag-and-drop grid, Quick actions, Live position labels, Instant download, No upload, Free',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Reorder PDF Pages — In Browser, No Upload | Toolisk</title>
        <meta
          name="description"
          content="Drag PDF pages into any order — visual reorder grid, instant download, runs in your browser. No upload, no sign-up, no watermarks."
        />
        <meta
          name="keywords"
          content="reorder pdf pages, rearrange pdf pages, sort pdf pages, reorder pdf no upload, change pdf page order, move pdf pages, pdf page reorder online, drag pdf pages"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Reorder PDF Pages | Toolisk" />
        <meta
          property="og:description"
          content="Drag PDF pages into any order — visual reorder grid, instant download. 100% private, no upload."
        />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]),
          }}
        />
      </Head>

      <ToolShell
        icon="🔀"
        title="Reorder PDF Pages"
        tagline="Drag PDF pages into any order — runs in your browser, original quality preserved."
        gradient="from-rose-600 via-red-600 to-orange-500"
        parent="pdf"
      >
        <ReorderPdfPages />
      </ToolShell>

      <ToolSEOContent
        description="Rearrange the pages of any PDF using a visual drag-and-drop thumbnail grid — all inside your browser. Drag a page tile to its new position and the order updates live. Use quick-action chips to reverse all pages, move the first to last, move the last to first, or reset to the original order. The output PDF is assembled byte-for-byte using pdf-lib — no re-rendering, original quality preserved. No upload, no account, no watermark."
        features={[
          '🔒 100% client-side — your PDF never leaves your browser',
          '🖱️ Smooth drag-and-drop with live position labels',
          '⚡ Quick actions: reverse all, move first/last, reset',
          '🪶 No re-render — original quality preserved',
          '📱 Touch-friendly on tablets',
          '🆓 Free, no sign-up, no watermark',
        ]}
        steps={[
          {
            title: 'Drop your PDF',
            desc: 'Any size up to 100 MB.',
          },
          {
            title: 'Drag thumbnails',
            desc: 'Drop anywhere in the grid to insert the page.',
          },
          {
            title: '(Optional) Use quick actions',
            desc: 'Reverse all, move first/last, reset.',
          },
          {
            title: 'Save & download',
            desc: 'One click, identical page quality.',
          },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">When you need to rearrange a PDF</h2>
            <p className="text-slate-600 leading-relaxed">
              There are many everyday situations where the page order of a PDF needs fixing or adjusting. A duplex scanner can produce odd/even page interleaving — where all the odd pages come first, then all the even pages in reverse, rather than sequential order. A presentation deck assembled from multiple sections may need chapters re-sequenced. A legal document might need exhibits reordered before filing. In all of these cases, you need a tool that is precise, visual, and private — and that is exactly what this tool provides.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a worked example: a 24-page bundle where pages 7–12 belong before pages 1–6. Drag the thumbnails for pages 7, 8, 9, 10, 11, and 12 into positions 1 through 6, or use quick actions to move blocks. Save the reordered PDF — you get a 24-page output with the new order. Identical visual quality, because pdf-lib copies the original page objects directly without decoding or re-encoding any content.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no upload matters</h3>
            <p className="text-slate-600 leading-relaxed">
              PDFs frequently contain sensitive information — signed contracts, tax documents, ID scans, medical records. When you use a server-side tool, that file travels to a third-party server. Even if the provider claims to delete files immediately, there is no way to verify that claim, and the data has left your device.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Toolisk&apos;s Reorder Pages tool uses pdf-lib — an open-source JavaScript PDF library — entirely inside your browser tab. The PDF bytes are read into memory, the pages are copied in the new order, and the output document is assembled in RAM. Nothing is transmitted anywhere. When you close the tab, everything is gone. This is not a privacy promise — it is how the technology works.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Reorder Pages vs Delete Pages vs Merge PDF</h3>
            <p className="text-slate-600 leading-relaxed">
              These three tools solve related but distinct problems. <strong>Reorder Pages</strong> rearranges the pages within a single PDF — the output has the same number of pages as the input, just in a different sequence. <strong>Delete Pages</strong> removes unwanted pages — useful when you want to trim a document down to a relevant subset. <strong>Merge PDF</strong> combines multiple PDF files into one — the right choice when your document lives across several separate files that you want to unite.
            </p>
            <p className="text-slate-600 leading-relaxed">
              If your goal is to reorder and simultaneously remove pages, use Reorder Pages first, then Delete Pages on the result — or handle it in two passes. The combination covers the full range of page-level editing without needing a desktop PDF editor.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Delete Pages from PDF', href: '/pdf/delete-pdf-pages', icon: '🗑️' },
          { name: 'Merge PDF', href: '/pdf/merge-pdf', icon: '📎' },
          { name: 'Split PDF', href: '/pdf/split-pdf', icon: '✂️' },
        ]}
      />
    </>
  );
}
