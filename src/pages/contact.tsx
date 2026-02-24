import Head from 'next/head';
import { useState } from 'react';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('admin@toolisk.com').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <Head>
        <title>Contact Us — Toolisk</title>
        <meta
          name="description"
          content="Contact the Toolisk team — report bugs, suggest tools, or ask questions. We actively monitor feedback and continuously improve our tools."
        />
        <link rel="canonical" href="https://toolisk.com/contact" />
        <meta property="og:title" content="Contact Us — Toolisk" />
        <meta property="og:description" content="Contact the Toolisk team — report bugs, suggest tools, or ask questions. We actively monitor feedback and continuously improve our tools." />
        <meta property="og:url" content="https://toolisk.com/contact" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 text-2xl mb-4">
              ✉️
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Contact Us</h1>
            <p className="mt-2 text-slate-500">We&apos;d love to hear from you</p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-lg">
                  📧
                </div>
                <h2 className="text-xl font-bold text-slate-900">Get in Touch</h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">
                For general inquiries, partnerships, or any questions about Toolisk, reach out via email.
                We aim to respond within <strong>1–2 business days</strong>.
              </p>
              <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Email</p>
                  <a
                    href="mailto:admin@toolisk.com"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    admin@toolisk.com
                  </a>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-indigo-100 transition-colors"
                  aria-label="Copy email address"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Bug Reports & Suggestions Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-lg">
                  🐛
                </div>
                <h2 className="text-xl font-bold text-slate-900">Bug Reports &amp; Suggestions</h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Found a bug? Have a feature request or tool suggestion? We actively monitor all feedback
                and use it to prioritize our development roadmap.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Bug Reports</p>
                    <p className="text-xs text-slate-500">
                      Email us directly at{' '}
                      <a href="mailto:admin@toolisk.com" className="text-blue-600 hover:underline">
                        admin@toolisk.com
                      </a>{' '}
                      with &ldquo;Bug Report&rdquo; in the subject line and include steps to reproduce.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Tool Suggestions</p>
                    <p className="text-xs text-slate-500">
                      Email us at <a href="mailto:admin@toolisk.com" className="text-blue-600 hover:underline">admin@toolisk.com</a> with
                      &ldquo;Tool Suggestion&rdquo; in the subject line.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Accuracy Reports</p>
                    <p className="text-xs text-slate-500">
                      If you notice any calculation inaccuracies, please report them immediately. We treat accuracy
                      issues as critical.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actively Maintained Banner */}
          <div className="mt-6 bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-lg">
                🔧
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Actively Maintained</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Toolisk is under <strong>active, continuous development</strong>. We regularly ship updates including
                  bug fixes, performance improvements, new features, and entirely new tools.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🐛</span>
                      <h3 className="text-sm font-semibold text-slate-900">Bug Reviews</h3>
                    </div>
                    <p className="text-xs text-slate-600">
                      All reported bugs are actively reviewed and prioritized. Critical issues are addressed promptly.
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">✨</span>
                      <h3 className="text-sm font-semibold text-slate-900">Regular Updates</h3>
                    </div>
                    <p className="text-xs text-slate-600">
                      New features and improvements are shipped regularly based on usage patterns and feedback.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
