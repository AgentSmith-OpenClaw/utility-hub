import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

interface Tool {
  name: string;
  description: string;
  path: string;
  icon: string;
  tags: string[];
  isNew?: boolean;
  comingSoon?: boolean;
}

const tools: Tool[] = [
  {
    name: 'EMI Calculator',
    description:
      'Advanced EMI calculator for home loan, car loan & personal loan. Compare Reduce EMI vs Reduce Tenure strategies, view 8 interactive charts, prepayment impact analysis, and export to Excel.',
    path: '/emi-calculator',
    icon: '🏦',
    tags: ['Finance', 'Loan', 'Home Loan', 'Prepayment'],
    isNew: false,
  },
  {
    name: 'JSON Formatter',
    description:
      'Beautify, minify, and validate JSON data instantly. Tree view, syntax highlighting, and error detection.',
    path: '#',
    icon: '📋',
    tags: ['Developer', 'Data', 'Formatting'],
    comingSoon: true,
  },
  {
    name: 'Image Compressor',
    description:
      'Compress images without losing quality. Supports PNG, JPEG, WebP. Batch processing with drag-and-drop.',
    path: '#',
    icon: '🖼️',
    tags: ['Media', 'Optimization', 'Images'],
    comingSoon: true,
  },
  {
    name: 'Unit Converter',
    description:
      'Convert between hundreds of units — length, weight, temperature, currency, data storage, and more.',
    path: '#',
    icon: '📐',
    tags: ['Math', 'Conversion', 'Utility'],
    comingSoon: true,
  },
  {
    name: 'Color Picker & Palette',
    description:
      'Pick colors, generate palettes, convert between HEX/RGB/HSL, and check contrast accessibility.',
    path: '#',
    icon: '🎨',
    tags: ['Design', 'CSS', 'Accessibility'],
    comingSoon: true,
  },
  {
    name: 'Regex Tester',
    description:
      'Build, test, and debug regular expressions in real time with match highlighting and cheat sheet.',
    path: '#',
    icon: '🔍',
    tags: ['Developer', 'Testing', 'Text'],
    comingSoon: true,
  },
];

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Toolist — High-Performance Daily Tools</title>
        <meta
          name="description"
          content="Toolist is a fast, private toolkit for daily tasks. Start with the EMI Calculator for home, car, and personal loans, then explore more utilities as they launch."
        />
        <meta
          name="keywords"
          content="toolist, online tools, emi calculator, loan calculator, home loan emi, car loan emi, personal loan emi, prepayment calculator, loan amortization, finance tools"
        />
        <link rel="canonical" href="https://toolist.app/" />
        <meta property="og:title" content="Toolist — High-Performance Daily Tools" />
        <meta
          property="og:description"
          content="Fast, private daily tools in one place. Try the advanced EMI Calculator with charts, prepayment analysis, and export."
        />
        <meta property="og:url" content="https://toolist.app/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Toolist — High-Performance Daily Tools" />
        <meta
          name="twitter:description"
          content="Fast, private daily tools in one place. Start with the EMI Calculator and explore more soon."
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero */}
        <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Community-driven, sustainably developed
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Toolist
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            A set of <span className="text-white font-semibold">high-performance</span> daily-use
            tools with features you actually need — fast, private, and consolidated in one place.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#tools"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            >
              Explore Tools ↓
            </a>
          </div>
        </div>
        </header>

      {/* Developer Note */}
      <section className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-lg">
              💡
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Developer's Note</h2>
              <p className="text-gray-600 leading-relaxed">
                There are many tools I use daily on the internet, but nothing was consolidated and
                most tools missed many features I needed. This project aims to solve those problems
                — creating a more complete set of daily tools. If these tools help me, hopefully
                they help you as well.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Tools</h2>
          <p className="mt-2 text-gray-500">
            Pick a tool to get started. More tools are on the way.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const CardContent = (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{tool.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {tool.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {tool.isNew && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                      {tool.comingSoon && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {tool.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            );

            if (tool.comingSoon) {
              return (
                <div
                  key={tool.name}
                  className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col opacity-75 cursor-default"
                >
                  {CardContent}
                </div>
              );
            }

            return (
              <Link
                key={tool.name}
                to={tool.path}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-200 p-6 flex flex-col transition-all duration-200 hover:-translate-y-1"
              >
                <div className="absolute top-4 right-4 text-gray-300 group-hover:text-indigo-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                {CardContent}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/60">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Toolist — Free, open-source daily tools.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/AgentSmith-OpenClaw/utility-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};

export default Home;
