import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us — Toolisk</title>
        <meta
          name="description"
          content="Learn about Toolisk — a developer-driven project building high-performance, free online tools with a commitment to Speed, Privacy, and Accuracy."
        />
        <link rel="canonical" href="https://toolisk.com/about" />
      </Head>

      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 text-2xl mb-4">
              💡
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">About Toolisk</h1>
            <p className="mt-2 text-slate-500">The story behind the tools</p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-10 max-w-none">

            {/* Mission */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Toolisk exists to build <strong>beautiful new tools</strong> for the modern web. Too many sites offer old, clunky, or incomplete utilities—often buried in ads or split across dozens of places. We&apos;re creating a <strong>single, consolidated hub</strong> of high-performance tools that work the way you actually want them to.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Toolisk is <strong>ad-supported</strong> (not bloated with ads), and every tool is designed to be <strong>fast</strong>, <strong>feature-complete</strong>, and <strong>privacy-respecting</strong>. No sign-ups, no data harvesting, and no paywalls for core features—just useful tools that work.
              </p>
            </section>

            {/* Who's Behind It */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Who&apos;s Behind Toolisk</h2>
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                <p className="text-slate-700 leading-relaxed mb-4">
                  Toolisk is crafted and maintained by a single developer who relies on these tools every day. This isn&apos;t a faceless corporation—it&apos;s a hands-on project born from real-world needs and a desire to make better, more beautiful tools for everyone.
                </p>
                <p className="text-slate-700 leading-relaxed mb-4">
                  After years of bouncing between different sites for EMI calculations, JSON formatting, unit conversions, and more—and always finding something missing or awkward—I decided to build the tools I wished existed. Tools that are deeper, more accurate, and simply easier to use.
                </p>
                <p className="text-slate-700 leading-relaxed mb-4">
                  If these tools help me work better every day, I hope they help you too.
                </p>
                <p className="text-slate-700 leading-relaxed mb-0">
                  In the future, Toolisk aims to become even more community-driven—building on your feedback and requests to shape what comes next.
                </p>
              </div>
            </section>

            {/* Methodology */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Methodology</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We don&apos;t cut corners. Every tool on Toolisk is built on <strong>industry-standard mathematical formulas</strong> and
                <strong> well-tested, secure libraries</strong>. Our financial calculators use the same amortization formulas
                used by banks and financial institutions. Our developer tools leverage established parsing and formatting standards.
              </p>
              <p className="text-slate-600 leading-relaxed">
                All computations happen <strong>client-side in your browser</strong> — your data never touches our servers.
                This isn&apos;t just a privacy feature; it&apos;s a performance one. There&apos;s no network latency,
                no server queue, no waiting. Calculations are instant.
              </p>
            </section>

            {/* Principles */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Principles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-sm">
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Speed</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Client-side processing means instant results. No server round-trips, no loading spinners.
                    Tools load fast and compute faster.
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-sm">
                  <div className="text-3xl mb-3">🔒</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Privacy</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Zero-persistence architecture. Your data stays in your browser and is never transmitted
                    to any server. No accounts, no tracking of inputs.
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-sm">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Accuracy</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Built on industry-standard formulas and rigorously tested. Our financial tools match
                    the precision of bank-grade calculators.
                  </p>
                </div>
              </div>
            </section>

            {/* What's Next */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What&apos;s Next</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Toolisk is actively growing. New tools are continuously being added and existing ones
                are being improved based on real-world usage. On the roadmap:
              </p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">→</span>
                  <span>FIRE Number Calculator for retirement planning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">→</span>
                  <span>SIP Calculator with step-up and goal planning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">→</span>
                  <span>Compound Interest Calculator with visualization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">→</span>
                  <span>Amortization Calculator with detailed schedules</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">→</span>
                  <span>Regex Tester with real-time match highlighting</span>
                </li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-4">
                Have a tool suggestion? <Link href="/contact" className="text-blue-600 font-medium hover:underline">Let us know</Link> — feedback helps prioritize what gets built next.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
