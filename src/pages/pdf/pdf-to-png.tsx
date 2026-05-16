import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const PdfToPng = dynamic(() => import('../../components/Pdf/PdfToPng'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/pdf-to-png';

const FAQS = [
  {
    q: 'Is this safe? Does it upload my PDF?',
    a: 'No upload whatsoever. The entire conversion runs in your browser using JavaScript and the open-source pdf.js library. Your PDF never leaves your device, is never sent to a server, and is never logged. This makes it safe for sensitive files like contracts, medical reports, or financial statements.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'PDFs up to 100 MB are accepted. Files over 30 MB may be slower on mobile. For very large PDFs, consider splitting the file first using the Split PDF tool, then converting each part.',
  },
  {
    q: 'Does it work offline?',
    a: 'After the page has loaded once, yes — the PDF rendering engine is cached in your browser and conversion runs locally even without an internet connection.',
  },
  {
    q: 'Will this work on iPhone / iPad?',
    a: 'Yes, on modern iOS Safari. iOS limits per-tab memory, so converting many pages at 300 DPI may be slow or cause the tab to reload. Try 72 or 150 DPI, or convert fewer pages at once.',
  },
  {
    q: 'PNG vs JPG — which should I use?',
    a: 'PNG is lossless — every pixel is stored exactly as rendered, making it ideal for diagrams, logos, technical drawings, and any content with sharp text or crisp edges. JPG is lossy and produces much smaller files, which is better for photographic content or when file size matters more than pixel-perfect accuracy. If you need transparency, PNG is your only option.',
  },
  {
    q: 'Will the transparent background really be transparent?',
    a: 'Only where the source PDF had no painted background. Most office documents (Word, PowerPoint, Google Docs) paint their own white rectangle as the first drawing operation. When you render those pages with the transparent option, the white background is still there — it was baked into the PDF. Transparent output is most useful for PDFs created from design tools like Illustrator or Figma that intentionally leave the canvas unpainted.',
  },
  {
    q: 'Why is my PNG so much bigger than a JPG would be?',
    a: 'PNG uses lossless compression — every pixel is preserved exactly. A typical A4 page at 150 DPI produces a PNG roughly 2–4 times larger than an equivalent 90%-quality JPEG. At 300 DPI, a single page can be 3–8 MB. If file size is a concern and you do not need transparency or pixel-perfect fidelity, use the PDF to JPG tool instead.',
  },
  {
    q: 'Can I extract embedded images from the PDF directly?',
    a: 'No — this tool renders each full page as one PNG image, which includes all text, graphics, and embedded images composited together. It does not extract individual image assets from the PDF stream. For that you would need a specialised tool.',
  },
];

export default function PdfToPngPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'PDF to PNG',
    slug: SLUG,
    description: 'Convert PDF pages to lossless PNG images — keep transparency, pick pages, 72/150/300 DPI. Runs in your browser. No upload, no sign-up.',
    category: 'UtilitiesApplication',
    featureList: 'Client-side rendering, Page selection, 72/150/300 DPI, Transparent background, Lossless PNG, Zip download, No upload, Free',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>PDF to PNG — Lossless, In Browser, No Upload | Toolisk</title>
        <meta
          name="description"
          content="Convert PDF pages to lossless PNG images — keep transparency, pick pages, 72/150/300 DPI. Runs in your browser. No upload, no sign-up."
        />
        <meta
          name="keywords"
          content="pdf to png, convert pdf to png, pdf to png lossless, pdf to png transparent, pdf to png no upload, pdf to png online, pdf page to png, pdf to png high quality"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="PDF to PNG | Toolisk" />
        <meta
          property="og:description"
          content="Convert PDF pages to lossless PNG images in your browser. Pick pages, set resolution (72/150/300 DPI), optional transparent background, download as zip. 100% private, no upload."
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
        icon="🖼️"
        title="PDF to PNG"
        tagline="Convert PDF pages to lossless PNG images — pick pages, choose resolution, optional transparency, download as zip. Runs in your browser. No upload, no sign-up."
        gradient="from-rose-600 via-red-600 to-orange-500"
        parent="pdf"
      >
        <PdfToPng />
      </ToolShell>

      <ToolSEOContent
        description="Convert one or more pages from any PDF into lossless PNG images — all inside your browser. Pick exactly which pages you want, choose 72, 150, or 300 DPI resolution, toggle a transparent background, and download individual files or a zip archive. No upload, no account, no watermark."
        features={[
          '🔒 100% client-side — PDF never leaves your browser',
          '📄 Page picker — select all, none, or any subset of pages',
          '🎯 Three resolutions: 72 DPI (screen), 150 DPI (print), 300 DPI (publication)',
          '🔳 Transparent background toggle for design workflows',
          '📦 Zip download for multi-page exports',
          '🆓 Free forever, no sign-up, no watermark',
        ]}
        steps={[
          {
            title: 'Drop your PDF',
            desc: 'Drag and drop a PDF onto the upload area, or click to browse. The tool will load a thumbnail preview of every page.',
          },
          {
            title: 'Pick pages',
            desc: 'Click individual page thumbnails to select or deselect them. Use "Select all" or "Select none" for quick bulk actions.',
          },
          {
            title: 'Choose resolution and background',
            desc: 'Select 72 DPI for screen-only use, 150 DPI for general print, or 300 DPI for maximum sharpness. Toggle transparent background if your PDF has no painted background and you need PNG alpha.',
          },
          {
            title: 'Convert and download',
            desc: 'Click "Convert N pages to PNG". Each page is rendered in your browser. Download files individually or grab them all as a .zip.',
          },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">When you need a PDF page as a lossless PNG</h2>
            <p className="text-slate-600 leading-relaxed">
              PNG is the format of choice whenever pixel-perfect reproduction matters. Unlike JPEG, which permanently discards image data to shrink file size, PNG stores every pixel exactly as it was rendered. This makes it indispensable for technical diagrams, company logos, engineering drawings, UI mockups, and any PDF page that will be re-used in a design workflow where artefacts are unacceptable.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a worked example: a 5-page brochure exported at 300 DPI produces PNG images approximately 2480 × 3508 pixels per A4 page (the standard for print-quality rasterisation). Each PNG weighs roughly 1.5 MB, for a total of around 7.5 MB zipped. The same pages exported as 90%-quality JPEGs would be approximately 2.8 MB total — about one-third the size, but with subtle lossy artefacts around sharp text and gradients. Choose PNG when you cannot afford that trade-off.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Transparency: when it works and when it does not</h3>
            <p className="text-slate-600 leading-relaxed">
              The transparent background toggle instructs the renderer to skip painting a white fill before rendering the PDF page. For PDFs exported from design tools like Adobe Illustrator, Figma, or Sketch — which leave the canvas unpainted — this produces a true RGBA PNG with a transparent background, ready to composite over any colour in your design workflow.
            </p>
            <p className="text-slate-600 leading-relaxed">
              However, most office documents (Word, PowerPoint, Google Docs, LibreOffice) paint their own white rectangle as the very first drawing command. In that case, enabling transparent background will still result in a white page because the whiteness is baked into the PDF content stream itself, not the canvas background. If you toggle transparent and the result still looks white, that is why.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no upload matters</h3>
            <p className="text-slate-600 leading-relaxed">
              PDFs frequently contain sensitive information — signed contracts, tax documents, ID scans, medical records. When you use a server-side converter, that file travels to a third-party server. Even if the provider claims to delete files immediately, there is no way to verify that claim, and the data has left your device.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Toolisk&apos;s PDF to PNG tool uses pdf.js — Mozilla&apos;s open-source PDF rendering engine — entirely inside your browser tab. The PDF bytes are read into memory, rendered to an HTML canvas, and exported as PNG blobs. Nothing is transmitted anywhere. When you close the tab, everything is gone. This is not a privacy promise — it is how the technology works.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">PNG vs server-side tools</h3>
            <p className="text-slate-600 leading-relaxed">
              Commercial server-side converters like Adobe Acrobat, Zamzar, or ILovePDF produce identical visual output for standard PDFs. The difference is privacy, speed for small batches, and cost. Server tools have an edge for very large PDFs (&gt;200 pages) where browser memory becomes a bottleneck, and they may handle some exotic PDF features (proprietary fonts, specific encryption) more robustly. For the vast majority of office and design PDFs, this browser-based tool produces identical results at zero cost with zero data exposure.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'PDF to JPG', href: '/pdf/pdf-to-jpg', icon: '🖼️' },
          { name: 'JPG to PDF', href: '/pdf/jpg-to-pdf', icon: '📄' },
          { name: 'PDF to Text', href: '/pdf/pdf-to-text', icon: '📝' },
        ]}
      />
    </>
  );
}
