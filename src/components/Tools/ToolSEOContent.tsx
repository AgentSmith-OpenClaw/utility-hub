import React from 'react';
import Link from 'next/link';

export interface FaqItem {
  q: string;
  a: string;
}

export interface HowToStep {
  title: string;
  desc: string;
}

interface ToolSEOContentProps {
  description: string;
  features: string[];
  steps: HowToStep[];
  faqs: FaqItem[];
  /** Markdown-flavored body content as plain JSX */
  body?: React.ReactNode;
  relatedTools?: Array<{ name: string; href: string; icon: string }>;
  relatedArticles?: Array<{ title: string; href: string }>;
}

export default function ToolSEOContent({
  description,
  features,
  steps,
  faqs,
  body,
  relatedTools,
  relatedArticles,
}: ToolSEOContentProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      {/* About */}
      <section className="bg-emerald-50 rounded-2xl p-8 sm:p-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">About this tool</h2>
        <p className="text-slate-600 mb-6 leading-relaxed">{description}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f} className="flex gap-3 items-start">
              <span className="mt-0.5">{f.split(' ')[0]}</span>
              <span className="text-slate-700 text-sm">{f.substring(f.indexOf(' ') + 1)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How to use */}
      <section className="bg-slate-50 rounded-2xl p-8 sm:p-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">How to use it</h2>
        <p className="text-slate-500 mb-6">Quick steps to get the most out of this utility.</p>
        <ol className="space-y-5">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-slate-900">{s.title}</p>
                <p className="text-sm text-slate-600 mt-0.5">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Educational body */}
      {body}

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="group bg-white border border-slate-200 rounded-xl px-5 py-4 hover:border-emerald-200 transition-colors"
            >
              <summary className="cursor-pointer text-base font-semibold text-slate-900 flex items-center justify-between">
                {f.q}
                <span className="ml-4 text-emerald-600 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related */}
      {(relatedTools || relatedArticles) && (
        <section className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-3xl p-8 sm:p-10 text-white">
          <h2 className="text-2xl font-bold mb-2">Keep exploring</h2>
          <p className="text-emerald-100 mb-6 text-sm">More utilities and reading from Toolisk.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedTools && relatedTools.length > 0 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-200 mb-3">Related tools</div>
                <div className="space-y-2">
                  {relatedTools.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                    >
                      <span className="text-xl">{t.icon}</span>
                      <span className="font-semibold text-sm">{t.name}</span>
                      <span className="ml-auto opacity-60">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {relatedArticles && relatedArticles.length > 0 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-200 mb-3">Related reading</div>
                <div className="space-y-2">
                  {relatedArticles.map((a) => (
                    <Link
                      key={a.href}
                      href={a.href}
                      className="block px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                    >
                      <span className="font-semibold text-sm">{a.title}</span>
                      <span className="ml-2 opacity-60">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
