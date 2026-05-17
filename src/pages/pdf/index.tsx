import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { PDFS as pdfTools } from '../../data/masterItems';
import { generateBreadcrumbs } from '../../utils/siteConfig';

const SITE_URL = 'https://toolisk.com';

export default function PdfHome() {
  const [search, setSearch] = useState('');

  const filteredTools = useMemo(() => {
    if (!search.trim()) return pdfTools;
    const q = search.toLowerCase();
    return pdfTools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [search]);

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Toolisk PDF Tools',
    description: 'Free in-browser PDF tools — merge, split, compress, rotate, convert. No upload.',
    numberOfItems: pdfTools.length,
    itemListElement: pdfTools.map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: tool.name,
      url: `${SITE_URL}${tool.path}`,
      description: tool.description,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Are my PDF files uploaded to a server?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Every Toolisk PDF tool runs entirely in your browser using JavaScript. Your files are never transmitted to any server. They stay on your device at all times.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the maximum PDF file size?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Files up to 100 MB are accepted. Files larger than 30 MB may process slowly on mobile devices. For very large PDFs, use the Split PDF tool first to work with smaller sections.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do these PDF tools work offline?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Once the page has loaded, most PDF tools work without an internet connection because all processing is done client-side in your browser.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do these tools work on iPhone and iPad?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. All Toolisk PDF tools work on iOS Safari and Chrome on iPhone and iPad. Processing speed depends on device performance and file size.',
        },
      },
    ],
  };

  const breadcrumbSchema = generateBreadcrumbs('/pdf');

  return (
    <>
      <Head>
        <title>Free PDF Tools — Merge, Split, Compress | Toolisk</title>
        <meta
          name="description"
          content="Free PDF tools that run in your browser — merge, split, compress, rotate, convert to JPG. No upload, no sign-up, no watermarks. Private and fast."
        />
        <meta
          name="keywords"
          content="pdf tools, merge pdf, split pdf, compress pdf, rotate pdf, pdf to jpg, jpg to pdf, free pdf editor, pdf no upload, online pdf private"
        />
        <link rel="canonical" href={`${SITE_URL}/pdf`} />
        <meta property="og:title" content="Free PDF Tools — Merge, Split, Compress | Toolisk" />
        <meta
          property="og:description"
          content="Free PDF tools that run in your browser — merge, split, compress, rotate, convert to JPG. No upload, no sign-up, no watermarks."
        />
        <meta property="og:url" content={`${SITE_URL}/pdf`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Free PDF Tools — Merge, Split, Compress | Toolisk" />
        <meta
          name="twitter:description"
          content="Free in-browser PDF tools — merge, split, compress, rotate, convert. No upload, no sign-up."
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <div className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-red-600 to-orange-500" />
          <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-14 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-4xl sm:text-5xl drop-shadow-lg" aria-hidden="true">📄</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Toolisk PDF Tools
              </h1>
            </div>
            <p className="text-rose-50 text-base sm:text-lg max-w-xl mx-auto mb-8">
              Merge, split, rotate, compress, and convert PDFs — entirely in your browser. No upload, no sign-up.
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <svg
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search PDF tools… e.g. merge, split, compress"
                  className="w-full pr-12 py-4 rounded-lg border-2 border-white/20 bg-white text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white shadow-xl shadow-rose-900/20 transition-all"
                  style={{ paddingLeft: '3.25rem' }}
                  aria-label="Search PDF tools"
                  autoComplete="off"
                />
                {search ? (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Clear search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-slate-400 bg-slate-100 rounded-md border border-slate-200">
                      {pdfTools.length} tools
                    </kbd>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Feature strip */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-xl" aria-hidden="true">🔒</div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-1">Files never leave your device</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Every PDF operation runs directly in your browser. Contracts, payslips, medical records — nothing is uploaded. No server ever sees your file.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-xl" aria-hidden="true">⚡</div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-1">Fast — no upload wait</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Because your file never leaves the browser, there is no upload time and no server queue. Processing starts the moment you drop the file.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-xl" aria-hidden="true">🚫</div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-1">No watermarks, no sign-up</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Unlike most online PDF tools, Toolisk adds no watermarks and requires no account. Open, use, and download — that is the whole flow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <section id="tools" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {search.trim() && filteredTools.length > 0 && (
            <p className="text-sm text-slate-500 mb-6 text-center">
              {filteredTools.length} result{filteredTools.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
            </p>
          )}

          {filteredTools.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
              <p className="text-slate-500 text-lg font-medium">No PDF tools match &ldquo;{search}&rdquo;</p>
              <button
                type="button"
                onClick={() => setSearch('')}
                className="mt-4 text-sm font-medium text-rose-600 hover:text-rose-700 hover:underline transition-colors min-h-[44px] px-4"
              >
                Clear search
              </button>
            </div>
          ) : pdfTools.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4" aria-hidden="true">🚧</div>
              <p className="text-slate-500 text-lg font-medium">PDF tools are coming soon.</p>
              <p className="text-slate-400 text-sm mt-2">Check back shortly — individual tools are being added.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.path}
                  className="group relative bg-white rounded-lg border border-slate-200 p-5 flex flex-col min-h-[13.5rem] transition-all duration-200 hover:shadow-lg hover:shadow-rose-100/50 hover:border-rose-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl leading-none" aria-hidden="true">{tool.icon}</span>
                    <div className="flex items-center gap-2">
                      {tool.isNew && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60">
                          New
                        </span>
                      )}
                      <span className="text-slate-300 group-hover:text-rose-400 transition-colors" aria-hidden="true">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-rose-600 transition-colors mb-1.5">
                    {tool.name}
                  </h3>

                  <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">
                    {tool.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium text-rose-600/80 bg-rose-50/80 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!search.trim() && (
            <div className="text-center mt-12">
              <p className="text-sm text-slate-400">
                All tools run client-side — your PDFs never leave your browser.
              </p>
            </div>
          )}
        </section>

        {/* SEO Content Section */}
        <article className="max-w-4xl mx-auto px-4 pb-20">
          <div className="bg-white rounded-lg border border-slate-200/80 p-8 sm:p-10 space-y-10">

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why use Toolisk PDF tools?</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Services like Smallpdf, iLovePDF, and Adobe Acrobat Online all share the same model: you upload your file to their servers, they process it, and you download the result. That model has a real privacy cost — your document travels over the internet, sits on a third-party server, and is subject to retention and data-processing policies you may not have read. Toolisk PDF tools work differently. <strong>Every operation runs directly in your browser</strong> using WebAssembly and JavaScript. The file never leaves your device.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Beyond privacy, the browser-first approach is also faster for most files. There is no upload queue, no server cold-start, and no wait for a result download. You drop a file, the tool runs instantly, and you save the output directly. No watermarks, no per-page limits, and no account required.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Privacy: why in-browser matters</h2>
              <p className="text-slate-600 leading-relaxed">
                PDFs commonly contain information you would not want stored on a stranger&apos;s server — employment contracts, salary slips, medical records, tax returns, bank statements, and signed legal agreements. When you upload a document to a server-side PDF tool, you are trusting that service with all of that data. Most services delete files after a period, but &ldquo;deleted from disk&rdquo; does not mean it was never logged, indexed, or seen by automated systems. Toolisk PDF tools sidestep this entirely: your browser processes the file locally using <code className="text-sm bg-slate-100 px-1 rounded">pdf-lib</code> and <code className="text-sm bg-slate-100 px-1 rounded">pdfjs-dist</code>, two well-maintained open-source libraries. Nothing is transmitted. Nothing is retained.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="group border border-slate-200 rounded-lg overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer font-medium text-slate-800 hover:bg-slate-50 transition-colors list-none min-h-[44px]">
                    <span>Are my PDF files uploaded to a server?</span>
                    <svg className="w-4 h-4 text-rose-500 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-slate-600 leading-relaxed">
                    No. Every tool runs entirely in your browser. Your files are never transmitted to any server. They stay on your device throughout the entire operation.
                  </div>
                </details>

                <details className="group border border-slate-200 rounded-lg overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer font-medium text-slate-800 hover:bg-slate-50 transition-colors list-none min-h-[44px]">
                    <span>What is the maximum file size I can process?</span>
                    <svg className="w-4 h-4 text-rose-500 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-slate-600 leading-relaxed">
                    Files up to 100 MB are supported. Files larger than 30 MB may be slow on mobile devices since all processing runs on your device&apos;s CPU. For very large PDFs, try splitting them into smaller sections first.
                  </div>
                </details>

                <details className="group border border-slate-200 rounded-lg overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer font-medium text-slate-800 hover:bg-slate-50 transition-colors list-none min-h-[44px]">
                    <span>Do these tools add watermarks to my PDFs?</span>
                    <svg className="w-4 h-4 text-rose-500 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-slate-600 leading-relaxed">
                    No. Toolisk adds zero watermarks, branding, or modifications to your output. The processed PDF you download is identical in content to what you put in — only the operation you requested (merge, split, rotate, etc.) is applied.
                  </div>
                </details>

                <details className="group border border-slate-200 rounded-lg overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer font-medium text-slate-800 hover:bg-slate-50 transition-colors list-none min-h-[44px]">
                    <span>Do these tools work offline?</span>
                    <svg className="w-4 h-4 text-rose-500 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-slate-600 leading-relaxed">
                    Once the page has loaded, all PDF tools work without an internet connection. All processing is client-side. You do need an internet connection to load the page initially.
                  </div>
                </details>

                <details className="group border border-slate-200 rounded-lg overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer font-medium text-slate-800 hover:bg-slate-50 transition-colors list-none min-h-[44px]">
                    <span>Do these tools work on iPhone and iPad (iOS)?</span>
                    <svg className="w-4 h-4 text-rose-500 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-slate-600 leading-relaxed">
                    Yes. All tools work on Safari and Chrome for iOS. Performance depends on file size and device speed. Very large PDFs (over 30 MB) may be slower on older iPhones.
                  </div>
                </details>
              </div>
            </section>

          </div>
        </article>
      </div>
    </>
  );
}
