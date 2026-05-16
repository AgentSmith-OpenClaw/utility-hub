import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const PdfToJpg = dynamic(() => import('../../components/Pdf/PdfToJpg'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/pdf-to-jpg';

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
    q: 'What resolution should I pick?',
    a: '72 DPI is fine for on-screen viewing — thumbnails, previews, and web images. 150 DPI is print-ready and a good default for most uses. 300 DPI is publication-grade — use it for printing or archiving where maximum sharpness matters.',
  },
  {
    q: 'Why are my JPGs slightly different from the original?',
    a: 'JPEG is a lossy format by definition — it trades some image detail for much smaller file sizes. At 90% quality (the default), the difference is visually negligible for most content. If you need pixel-perfect reproduction, use a lossless format like PNG instead.',
  },
  {
    q: 'Can I extract embedded images from the PDF directly?',
    a: 'No — this tool renders each full page as one JPG image, which includes all text, graphics, and embedded images. It does not extract individual image assets from the PDF stream. For that you would need a specialised tool.',
  },
  {
    q: 'My PDF is 200 pages. Will my browser crash?',
    a: "Probably not, but it will be slow and the resulting zip file could be very large. At 150 DPI, 200 pages is roughly 50–80 MB. At 300 DPI it could exceed 200 MB. It's better to use the Split PDF tool first to break the document into smaller chunks, then convert each part.",
  },
];

export default function PdfToJpgPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'PDF to JPG',
    slug: SLUG,
    description: 'Convert PDF pages to JPG images — pick pages, choose resolution (72/150/300 DPI), download as zip. Runs in your browser. No upload, no sign-up.',
    category: 'UtilitiesApplication',
    featureList: 'Client-side rendering, Page selection, 72/150/300 DPI, Quality slider, Zip download, No upload, Free',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>PDF to JPG — In Browser, No Upload | Toolisk</title>
        <meta
          name="description"
          content="Convert PDF pages to JPG images — pick pages, choose resolution (72/150/300 DPI), download as zip. Runs in your browser. No upload, no sign-up."
        />
        <meta
          name="keywords"
          content="pdf to jpg, pdf to jpeg, convert pdf to jpg, pdf to image, pdf to jpg high quality, pdf to jpg no upload, pdf to jpg online, extract images from pdf"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="PDF to JPG | Toolisk" />
        <meta
          property="og:description"
          content="Convert PDF pages to JPG images in your browser. Pick pages, set resolution (72/150/300 DPI), adjust quality, download as zip. 100% private, no upload."
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
        title="PDF to JPG"
        tagline="Convert PDF pages to JPG images — pick pages, choose resolution, download as zip. Runs in your browser. No upload, no sign-up."
        gradient="from-rose-600 via-red-600 to-orange-500"
        parent="pdf"
      >
        <PdfToJpg />
      </ToolShell>

      <ToolSEOContent
        description="Convert one or more pages from any PDF into JPG images — all inside your browser. Pick exactly which pages you want, choose 72, 150, or 300 DPI resolution, adjust JPEG quality, and download individual files or a zip archive. No upload, no account, no watermark."
        features={[
          '🔒 100% client-side — PDF never leaves your browser',
          '📄 Page picker — select all, none, or any subset of pages',
          '🎯 Three resolutions: 72 DPI (screen), 150 DPI (print), 300 DPI (publication)',
          '🎨 Quality slider — balance file size vs sharpness',
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
            title: 'Choose resolution and quality',
            desc: 'Select 72 DPI for screen-only use, 150 DPI for general print, or 300 DPI for maximum sharpness. Drag the quality slider to balance file size.',
          },
          {
            title: 'Convert and download',
            desc: 'Click "Convert N pages to JPG". Each page is rendered in your browser. Download files individually or grab them all as a .zip.',
          },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">When you need a PDF page as an image</h2>
            <p className="text-slate-600 leading-relaxed">
              There are many reasons you might need a PDF page rendered as a JPG: inserting a document page as a slide thumbnail, extracting a chart for a presentation, generating a preview image for a document-sharing platform, creating video frames from a slide deck, or simply sending a single page to someone who cannot open PDF files. In all of these cases, what you need is a faithful pixel representation of the page — and that is exactly what this tool produces.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a worked example: a 10-page report exported at 150 DPI with 90% JPEG quality produces images approximately 1190 × 1684 pixels per A4 page, with each JPG weighing around 200–300 KB. Total output: roughly 2–3 MB zipped. At 300 DPI the images double in pixel dimensions and quadruple in file size — excellent for archiving, unnecessary for web thumbnails.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">JPG vs PNG: when lossy is fine</h3>
            <p className="text-slate-600 leading-relaxed">
              JPEG is a lossy format, meaning it permanently discards some image data to achieve compression. At 85–95% quality this loss is invisible to the human eye for photographic and mixed content. For pages containing fine text or technical diagrams, a small amount of JPEG artifact may appear at high zoom — usually not an issue for thumbnails, slides, or web display. If you need a lossless output where every pixel is preserved exactly, use a PDF-to-PNG tool instead.
            </p>
            <p className="text-slate-600 leading-relaxed">
              This tool defaults to 90% quality — a good balance between visual fidelity and file size. Drop it to 70% for compact web thumbnails, raise it to 95% for print-quality exports.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no upload matters</h3>
            <p className="text-slate-600 leading-relaxed">
              PDFs frequently contain sensitive information — signed contracts, tax documents, ID scans, medical records. When you use a server-side converter, that file travels to a third-party server. Even if the provider claims to delete files immediately, there is no way to verify that claim, and the data has left your device.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Toolisk&apos;s PDF to JPG tool uses pdf.js — Mozilla&apos;s open-source PDF rendering engine — entirely inside your browser tab. The PDF bytes are read into memory, rendered to an HTML canvas, and exported as JPEG blobs. Nothing is transmitted anywhere. When you close the tab, everything is gone. This is not a privacy promise — it is how the technology works.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'PDF to PNG', href: '/pdf/pdf-to-png', icon: '🖼️' },
          { name: 'JPG to PDF', href: '/pdf/jpg-to-pdf', icon: '📄' },
          { name: 'PDF to Text', href: '/pdf/pdf-to-text', icon: '📝' },
        ]}
      />
    </>
  );
}
