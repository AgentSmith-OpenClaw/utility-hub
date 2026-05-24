import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const CompressPdf = dynamic(() => import('../../components/Pdf/CompressPdf'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/compress-pdf';

const FAQS = [
  {
    q: 'How much smaller will my PDF get?',
    a: 'It depends on what\'s inside. Image-heavy scans typically shrink 60–80%. Text-heavy PDFs may only shrink 10–20% (or not at all). The live preview and estimated-size readout tell you what to expect before you commit.',
  },
  {
    q: 'Why did Compress make my PDF larger?',
    a: 'Most likely your PDF is already text-only and tightly compressed. Our pipeline re-renders each page as an image and re-embeds it — that\'s much bigger than the original text-only encoding. Skip the compress step for text-only PDFs; you don\'t need it.',
  },
  {
    q: 'Will the text still be selectable / searchable after compression?',
    a: 'No. We render each page as a JPG and re-embed it, which means the output is a "scan" of your PDF. If text-selection matters, don\'t compress.',
  },
  {
    q: 'Can I compress a password-protected PDF?',
    a: 'Not directly. Unlock first, then compress.',
  },
  {
    q: 'Is this safe? Does it upload my PDF?',
    a: 'No upload whatsoever. The entire operation runs in your browser using JavaScript and open-source libraries (pdf.js and pdf-lib). Your PDF never leaves your device, is never sent to a server, and is never logged. This makes it safe for sensitive files like tax returns, ID copies, or signed contracts.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'PDFs up to 100 MB are accepted. Files over 30 MB may be slower on mobile. For very large PDFs, consider splitting the file first using the Split PDF tool, then compressing each part.',
  },
  {
    q: 'What is the difference between Light, Medium, and Strong compression?',
    a: 'All three levels re-render each page as a JPEG. Light uses quality 0.85 and a max 2400 px long-side — best for archiving. Medium uses quality 0.70 and 1800 px — the best balance for sharing or emailing. Strong uses quality 0.55 and 1200 px — smallest file size, but visible quality loss on high-detail images.',
  },
  {
    q: 'Does it work offline?',
    a: 'After the page has loaded once, yes — the PDF engine is cached in your browser and compression runs locally even without an internet connection.',
  },
];

export default function CompressPdfPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Compress PDF',
    slug: SLUG,
    description: 'Shrink PDF file size with three quality levels and a live before/after preview. Runs entirely in your browser — no upload.',
    category: 'UtilitiesApplication',
    featureList: 'Client-side processing, Three compression levels, Live before/after preview, Estimated size readout, Progress bar, Instant download, No upload, Free',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Compress PDF — In Browser, No Upload | Toolisk</title>
        <meta
          name="description"
          content="Shrink PDF file size in your browser — three quality levels, live preview, instant download. No upload, no sign-up, free."
        />
        <meta
          name="keywords"
          content="compress pdf, reduce pdf size, shrink pdf, compress pdf free, compress pdf no upload, pdf compressor online, compress pdf in browser, reduce pdf file size"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Compress PDF | Toolisk" />
        <meta
          property="og:description"
          content="Shrink PDF file size with three quality levels and a live before/after preview. 100% private, no upload."
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
        icon="🗜️"
        title="Compress PDF"
        tagline="Shrink PDF file size by re-encoding embedded images — runs in your browser, no upload."
        gradient="from-rose-600 via-red-600 to-orange-500"
        parent="pdf"
      >
        <CompressPdf />
      </ToolShell>

      <ToolSEOContent
        description="Reduce PDF file size by re-rendering each page as a JPEG image and re-embedding it — all inside your browser. Choose from three compression levels: Light for archival quality, Medium for the best balance of quality and size, or Strong for the smallest possible file. A live before/after preview on page 1 and an estimated final size help you pick the right level before committing. The full run processes every page sequentially with a per-page progress bar. No upload, no account, no watermark."
        features={[
          '🔒 100% client-side — your PDF never leaves your browser',
          '🎚️ Three quality levels — Light / Medium / Strong',
          '👀 Live before/after preview of page 1',
          '📊 Estimated and actual size shown side by side',
          '⚡ Works on 50+ MB PDFs without timeouts',
          '🆓 No sign-up, no watermark, no daily quotas',
        ]}
        steps={[
          {
            title: 'Drop your PDF',
            desc: 'Any size up to 100 MB.',
          },
          {
            title: 'Pick a level',
            desc: 'Light (best detail) / Medium (best balance) / Strong (smallest).',
          },
          {
            title: 'Preview',
            desc: 'See the before/after on page 1; switch levels live.',
          },
          {
            title: 'Compress & download',
            desc: 'Instant download, original file untouched.',
          },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">What PDF compression really means</h2>
            <p className="text-slate-600 leading-relaxed">
              Most PDF file size comes from images — either photographs embedded in the document or the scanned page images in a scanned PDF. Text, fonts, and vector graphics are already tiny. When a tool "compresses" a PDF, it is almost always re-encoding those images at a lower quality or resolution. That is exactly what this tool does: it renders each page to a canvas at the target resolution, encodes it as a JPEG at the chosen quality, and assembles a new PDF from those images using pdf-lib.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a worked example: a 24.6 MB PDF of scanned 300 DPI receipts. At Medium compression (quality 0.70, max 1800 px), each page is re-rendered at roughly 150 DPI and encoded as a JPEG. Output: ~6.8 MB — a 72% reduction. The text is still legible for most practical purposes, and the file emails easily.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">When not to use this tool</h3>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong>Text-only PDFs</strong> — A PDF of a Word document or generated report is already highly compressed at the encoding level. Re-rendering it as JPEG images replaces efficient text/vector encoding with much larger raster data. The result is often a <em>larger</em> file, not smaller. The tool will warn you if it detects this pattern before you run the full compression.
              </p>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no upload matters</h3>
            <p className="text-slate-600 leading-relaxed">
              Tax returns, ID copies, and signed contracts are among the most sensitive files people compress. When you use a server-side PDF compressor — like ilovepdf or smallpdf — that file travels to a third-party server. Even if the provider claims to delete files immediately, the file has left your device. Toolisk&apos;s Compress PDF tool processes everything inside your browser tab using pdf.js and pdf-lib, two well-tested open-source JavaScript libraries. Nothing is transmitted. When you close the tab, everything is gone.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Toolisk vs ilovepdf / smallpdf</h3>
            <p className="text-slate-600 leading-relaxed">
              Server-based tools like ilovepdf and smallpdf have file-size caps on free plans, require email sign-up for high compression, and apply watermarks on free tiers. They also upload your file to a server. Toolisk has no file-size caps beyond your browser&apos;s memory, no watermarks, no sign-up, and no daily quotas — and your file never leaves your device.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Merge PDF', href: '/pdf/merge-pdf', icon: '📎' },
          { name: 'PDF Page Counter', href: '/pdf/pdf-page-counter', icon: '🔢' },
          { name: 'Unlock PDF', href: '/pdf/unlock-pdf', icon: '🔓' },
        ]}
      />
    </>
  );
}
