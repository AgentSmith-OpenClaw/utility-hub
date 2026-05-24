import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { IMAGES } from '../../data/masterItems';

export default function ImageHome() {
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    if (!search.trim()) return IMAGES;
    const q = search.toLowerCase();
    return IMAGES.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <>
      <Head>
        <title>{`Image Tools — ${IMAGES.length} Free Online Image Editor & Converter | Toolisk`}</title>
        <meta
          name="description"
          content={`${IMAGES.length} free image tools — compress, resize, convert, crop, rotate, and more. All 100% client-side, no upload, no sign-up. Your photos never leave your device.`}
        />
        <meta
          name="keywords"
          content="image tools, compress image, resize image, convert image, crop image, rotate image, image editor online, free image tools, no upload, private, browser-based"
        />
        <link rel="canonical" href="https://toolisk.com/image" />
        <meta property="og:title" content={`Image Tools — ${IMAGES.length} Free Online Image Editor & Converter | Toolisk`} />
        <meta
          property="og:description"
          content={`${IMAGES.length} free image tools — compress, resize, convert, crop, rotate. All client-side, no upload, no sign-up.`}
        />
        <meta property="og:url" content="https://toolisk.com/image" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`Image Tools — ${IMAGES.length} Free Online Image Editor & Converter | Toolisk`} />
        <meta name="twitter:description" content={`${IMAGES.length} free image tools — compress, resize, convert, crop, rotate. All client-side, no sign-up.`} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Toolisk Image Tools',
              description: 'Free image tools — compress, resize, convert, crop, rotate. All client-side, no upload.',
              numberOfItems: IMAGES.length,
              itemListElement: IMAGES.map((item, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: item.name,
                url: `https://toolisk.com${item.path}`,
                description: item.description,
              })),
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Are Toolisk image tools really free?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Every image tool is completely free with no sign-ups, no paywalls, and no usage limits. No watermark is ever added to your images.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is my data safe? Do you upload my images?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No upload. All image processing runs in your browser using JavaScript and Canvas. Your photos never leave your device, never touch our server, and are never logged.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What image formats are supported?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'JPG, PNG, WebP, AVIF, GIF, BMP, SVG, HEIC (iPhone), and ICO. The tool auto-detects the format when you drop a file.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What is the maximum file size?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'You can process images up to 50 MB. Files over 25 MB show a warning that processing may be slow on mobile.',
                  },
                },
              ],
            }),
          }}
        />
      </Head>
      <div className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500" />
          <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-14 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-4xl sm:text-5xl drop-shadow-lg">🖼️</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Image Tools
              </h1>
            </div>
            <p className="text-sky-100 text-base sm:text-lg max-w-xl mx-auto mb-8">
              Compress, resize, convert, crop, and edit images — 100% in your browser, no upload, no sign-up.
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search image tools… e.g. compress, resize, convert"
                  className="w-full pr-12 py-4 rounded-lg border-2 border-white/20 bg-white text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white shadow-xl shadow-sky-900/20 transition-all"
                  style={{ paddingLeft: '3.25rem' }}
                  aria-label="Search image tools"
                  autoComplete="off"
                />
                {search ? (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                    aria-label="Clear search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-slate-400 bg-slate-100 rounded-md border border-slate-200">
                      {IMAGES.length} tool{IMAGES.length !== 1 ? 's' : ''}
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
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-xl">🔒</div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-1">100% private — no upload</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Your images never leave your device. All processing happens locally in the browser — no server, no cloud, no tracking.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-xl">⚡</div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-1">Instant — no waiting</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Drop a file, adjust settings, download. No upload time, no queue, no email confirmation. Results appear in seconds.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-xl">🆓</div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-1">Free, no watermark</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Every tool is free with no usage limits, no sign-up, and no watermarks on your images. What you download is exactly what you processed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <section id="image" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {search.trim() && filteredItems.length > 0 && (
            <p className="text-sm text-slate-500 mb-6 text-center">
              {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
            </p>
          )}

          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-500 text-lg font-medium">No tools match &ldquo;{search}&rdquo;</p>
              <button onClick={() => setSearch('')} className="mt-4 text-sm font-medium text-sky-600 hover:text-sky-700 hover:underline transition-colors">Clear search</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
              {filteredItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="group relative bg-white rounded-lg border border-slate-200 p-5 flex flex-col min-h-[13.5rem] transition-all duration-200 hover:shadow-lg hover:shadow-sky-100/50 hover:border-sky-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl leading-none">{item.icon}</span>
                    <div className="flex items-center gap-2">
                      {item.isNew && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/60">
                          New
                        </span>
                      )}
                      <span className="text-slate-300 group-hover:text-sky-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-sky-600 transition-colors mb-1.5">
                    {item.name}
                  </h3>

                  <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium text-sky-600/80 bg-sky-50/80 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!search.trim() && IMAGES.length > 0 && (
            <div className="text-center mt-12">
              <p className="text-sm text-slate-400">
                All image tools run client-side — your photos never leave your browser.
              </p>
            </div>
          )}
        </section>

        {/* SEO Content */}
        <article className="max-w-4xl mx-auto px-4 pb-20">
          <div className="bg-white rounded-lg border border-slate-200/80 p-8 sm:p-10 space-y-10">

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Free Image Tools — Private, Browser-Based</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Most online image editors upload your photos to a server. Toolisk is different. Every image tool runs 100% in your browser — your photos, screenshots, and ID documents never leave your device. No account, no tracking, no watermarks.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Compress a photo for email, convert iPhone HEIC to JPG, resize images for social media, remove backgrounds, crop to Instagram dimensions, strip EXIF metadata before sharing — all without uploading anything anywhere.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Image Compressor</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">
                    <Link href="/image/compress-image" className="text-sky-600 hover:underline">Compress Image</Link> — Reduce File Size, Keep Quality
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Drop a JPG, PNG, or WebP, adjust the quality slider, and instantly see the before/after file size. Compress a 5 MB photo down to 800 KB with virtually no visible quality loss — all in your browser, no upload.
                  </p>
                </div>
              </div>
              <p className="mt-4">
                <Link href="/image" className="text-sm text-sky-600 font-medium hover:underline">
                  Browse all {IMAGES.length} image tool{IMAGES.length !== 1 ? 's' : ''} →
                </Link>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why no-upload matters for images</h2>
              <p className="text-slate-600 leading-relaxed">
                Photos contain more personal data than most people realize — GPS coordinates, camera model, timestamps, and sometimes faces of family members. Tools like tinypng and iloveimg upload your images to servers for processing. Toolisk image tools process everything locally in your browser. Your images are never transmitted, stored, or logged — they stay on your device from start to finish.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Are all Toolisk image tools really free?</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Yes. Every image tool is completely free with no sign-ups, no paywalls, and no usage limits. No watermark is ever added to your images.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Is my data safe? Do you upload my images?</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Absolutely. All image processing runs entirely in your browser using JavaScript and Canvas. Your photos never leave your device, never touch our server, and are never logged.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">What image formats are supported?</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    JPG, PNG, WebP, AVIF, GIF, BMP, SVG, HEIC (iPhone), and ICO. The tool auto-detects the format when you drop a file.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">What is the maximum file size?</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    You can process images up to 50 MB. Files over 25 MB show a warning that processing may be slow on mobile. Desktop browsers handle larger files comfortably.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </article>
      </div>
    </>
  );
}