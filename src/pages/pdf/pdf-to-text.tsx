import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const PdfToText = dynamic(() => import('../../components/Pdf/PdfToText'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/pdf-to-text';

const FAQS = [
  {
    q: 'Is this safe? Does it upload my PDF?',
    a: 'No upload whatsoever. The entire extraction runs in your browser using JavaScript and the open-source pdf.js library. Your PDF never leaves your device, is never sent to a server, and is never logged. This makes it safe for sensitive files like contracts, medical reports, or financial statements.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'PDFs up to 100 MB are accepted. Files over 30 MB may be slower on mobile. For very large PDFs, consider splitting the file first using the Split PDF tool, then extracting text from each part.',
  },
  {
    q: 'Does it work offline?',
    a: 'After the page has loaded once, yes — the PDF engine is cached in your browser and extraction runs locally even without an internet connection.',
  },
  {
    q: 'Will this work on iPhone / iPad?',
    a: 'Yes, on modern iOS Safari. iOS limits per-tab memory, so very large PDFs may be slow. For best results on mobile, use the page range option to extract just the pages you need.',
  },
  {
    q: 'Why is the extracted text empty?',
    a: "Your PDF is probably a scan (a photo of a page, not a real text PDF). Real PDFs have a hidden text layer that we can read; scans don't. Extracting text from scans needs OCR, which we don't yet offer client-side.",
  },
  {
    q: 'Why does the text look jumbled on two-column papers?',
    a: 'pdf.js reads text in PDF object order, which on multi-column layouts often interleaves the columns. Single-column layouts (most office docs, books, contracts) extract cleanly.',
  },
  {
    q: "What's the difference between .txt and .md output?",
    a: "The content is identical. The .md extension just means apps that recognize Markdown (Obsidian, VS Code, GitHub) will treat the file like a Markdown document. Pick whatever your downstream tool prefers.",
  },
  {
    q: 'Can I extract tables as proper rows and columns?',
    a: "Not reliably — PDF doesn't store tables as structured data, just as text positioned at coordinates. The output will contain all the table cells in roughly reading order, but you'll need to reformat manually.",
  },
];

export default function PdfToTextPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'PDF to Text',
    slug: SLUG,
    description: 'Extract all text from a PDF in your browser — copy to clipboard, download as .txt or .md. No upload, no sign-up, works offline.',
    category: 'UtilitiesApplication',
    featureList: 'Client-side extraction, Page range support, Preserve or join paragraphs, Per-page headers, Copy to clipboard, .txt download, .md download, No upload, Free',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>PDF to Text — Copy Text from PDF | Toolisk</title>
        <meta
          name="description"
          content="Extract all text from a PDF in your browser — copy to clipboard, download as .txt or .md. No upload, no sign-up, works offline."
        />
        <meta
          name="keywords"
          content="pdf to text, copy text from pdf, pdf to txt, extract text from pdf, pdf to text free, pdf to text no upload, pdf text extractor, pdf to markdown"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="PDF to Text | Toolisk" />
        <meta
          property="og:description"
          content="Extract all text from a PDF in your browser. Copy to clipboard or download as .txt / .md. 100% private, no upload."
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
        icon="📝"
        title="PDF to Text"
        tagline="Extract all text from a PDF — copy or download as .txt. Runs in your browser, no upload."
        gradient="from-rose-600 via-red-600 to-orange-500"
        parent="pdf"
      >
        <PdfToText />
      </ToolShell>

      <ToolSEOContent
        description="Extract every word from any PDF directly in your browser — no upload, no account, no watermark. Pick a page range, choose whether to preserve line breaks or join paragraphs, optionally add page-number headers, then copy to clipboard or download as a .txt or .md file."
        features={[
          '🔒 100% client-side — your PDF never leaves your browser',
          '📋 One-click copy or download as .txt / .md',
          '🎚️ Page range support — extract just what you need',
          '📐 Preserve line breaks or join into paragraphs',
          '🔢 Optional per-page section headers',
          '📊 Live word and character count',
        ]}
        steps={[
          {
            title: 'Drop your PDF',
            desc: 'Drag and drop a PDF onto the upload area, or click to browse. Any size up to 100 MB.',
          },
          {
            title: 'Pick a range (optional)',
            desc: 'Choose All pages (default) or enter a custom page range like 1-5, 8, 10-12.',
          },
          {
            title: 'Choose layout',
            desc: 'Preserve line breaks keeps every newline as-is. Joined paragraphs collapses single newlines into spaces while keeping paragraph breaks.',
          },
          {
            title: 'Copy or download',
            desc: 'Click Copy to send the text to your clipboard, or download as a .txt or .md file.',
          },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">When you need the text out of a PDF</h2>
            <p className="text-slate-600 leading-relaxed">
              PDFs are designed for consistent visual presentation, not for extracting and reusing content. Yet the need to get text out of a PDF comes up constantly — copying a contract clause into an email, feeding a research paper into a summarizer, importing a report into a spreadsheet, or archiving a document as plain text. Every server-side converter asks you to upload your file to do this, which is a privacy trade-off that is rarely worth making.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Toolisk&apos;s PDF to Text tool uses pdf.js — Mozilla&apos;s open-source PDF rendering engine — entirely inside your browser tab. The PDF bytes are read into memory, the text layer is parsed locally, and the result is displayed immediately. Nothing is transmitted anywhere. For a typical 10-page business document, extraction completes in under a second.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">How pdf.js reads text</h3>
            <p className="text-slate-600 leading-relaxed">
              Real PDFs (as opposed to scans) embed a hidden text layer alongside the visual rendering. This text layer contains the string content, font, size, and XY coordinates of every character on every page. pdf.js walks through this layer in PDF object order, reconstructing runs of text. The tool groups characters by their Y coordinate — items on the same line stay together, and a line break is inserted when the Y position changes significantly.
            </p>
            <p className="text-slate-600 leading-relaxed">
              This approach works well for single-column documents: contracts, books, reports, slide decks exported as PDF. It works less well for multi-column academic papers, because the PDF object order often interleaves the two columns rather than reading left-to-right, top-to-bottom as a human would. If you are processing academic papers, extracting one column at a time via the page range option — and then manually reordering — is the practical workaround until true column-aware extraction is available.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Scanned PDFs and OCR</h3>
            <p className="text-slate-600 leading-relaxed">
              A scanned PDF is just a sequence of images — there is no text layer. Scanners and photocopiers produce image-only PDFs; some older document workflows do too. If you drop a scanned PDF into this tool, you will see the amber warning: the tool has detected that fewer than 10 non-whitespace characters were found across all pages, which almost always means the file is image-only.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Extracting text from scanned pages requires Optical Character Recognition (OCR) — a much heavier operation that involves running a neural network over image data. Browser-based OCR (using Tesseract.js or similar) is technically possible but is slow and memory-intensive. We plan to add a dedicated scanned-PDF OCR tool in the future. For now, if you need OCR, Adobe Acrobat, Google Drive (upload and open as Docs), or a dedicated OCR service are the practical options.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no upload matters for text documents</h3>
            <p className="text-slate-600 leading-relaxed">
              Text-heavy PDFs are often the most sensitive documents you handle: signed contracts, non-disclosure agreements, legal filings, medical records, financial statements. Uploading these to a third-party server — even one with good privacy policies — means the content has left your control. Toolisk&apos;s client-side approach means the text never touches a server. This is not a privacy promise — it is a technical property of how the tool works.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'PDF to JPG', href: '/pdf/pdf-to-jpg', icon: '🖼️' },
          { name: 'PDF to PNG', href: '/pdf/pdf-to-png', icon: '🖼️' },
          { name: 'Split PDF', href: '/pdf/split-pdf', icon: '✂️' },
          { name: 'Merge PDF', href: '/pdf/merge-pdf', icon: '📎' },
        ]}
      />
    </>
  );
}
