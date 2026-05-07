import Link from 'next/link';
import type { ReactNode } from 'react';

type Accent = 'indigo' | 'emerald' | 'blue' | 'amber' | 'rose' | 'violet';

const accentMap: Record<Accent, { border: string; bg: string; btn: string; btnHover: string }> = {
  indigo: { border: 'border-indigo-600', bg: 'bg-indigo-50', btn: 'bg-indigo-600', btnHover: 'hover:bg-indigo-700' },
  emerald: { border: 'border-emerald-600', bg: 'bg-emerald-50', btn: 'bg-emerald-600', btnHover: 'hover:bg-emerald-700' },
  blue: { border: 'border-blue-600', bg: 'bg-blue-50', btn: 'bg-blue-600', btnHover: 'hover:bg-blue-700' },
  amber: { border: 'border-amber-500', bg: 'bg-amber-50', btn: 'bg-amber-600', btnHover: 'hover:bg-amber-700' },
  rose: { border: 'border-rose-500', bg: 'bg-rose-50', btn: 'bg-rose-600', btnHover: 'hover:bg-rose-700' },
  violet: { border: 'border-violet-500', bg: 'bg-violet-50', btn: 'bg-violet-600', btnHover: 'hover:bg-violet-700' },
};

export function Lead({ children }: { children: ReactNode }) {
  return <p className="text-xl text-gray-600 leading-relaxed mb-8">{children}</p>;
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{children}</h2>;
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">{children}</h3>;
}

export function ToolCTA({
  href,
  label,
  hint,
  accent = 'indigo',
}: {
  href: string;
  label: string;
  hint: string;
  accent?: Accent;
}) {
  const c = accentMap[accent];
  return (
    <div className={`my-8 ${c.bg} border-l-4 ${c.border} rounded-lg p-6`}>
      <p className="text-sm text-gray-700 mb-3">{hint}</p>
      <Link
        href={href}
        className={`inline-flex items-center gap-2 ${c.btn} text-white px-5 py-2.5 rounded-lg font-semibold ${c.btnHover} transition-colors`}
      >
        {label} →
      </Link>
    </div>
  );
}

export function Callout({
  title,
  children,
  accent = 'blue',
}: {
  title?: string;
  children: ReactNode;
  accent?: Accent;
}) {
  const tint = {
    indigo: 'from-indigo-50 to-blue-50 border-indigo-100',
    emerald: 'from-emerald-50 to-teal-50 border-emerald-100',
    blue: 'from-blue-50 to-indigo-50 border-blue-100',
    amber: 'from-amber-50 to-yellow-50 border-amber-100',
    rose: 'from-rose-50 to-pink-50 border-rose-100',
    violet: 'from-violet-50 to-purple-50 border-violet-100',
  }[accent];
  return (
    <div className={`my-8 bg-gradient-to-br ${tint} rounded-xl p-6 border`}>
      {title && <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>}
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );
}

export function FormulaBox({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200 text-center">
      {children}
    </div>
  );
}

export function CodeSnippet({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-900 text-gray-100 rounded-xl p-5 my-6 font-mono text-sm overflow-x-auto">
      {children}
    </div>
  );
}

export function Comparison({
  left,
  right,
  leftTitle,
  rightTitle,
}: {
  leftTitle: string;
  left: ReactNode;
  rightTitle: string;
  right: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-2">{leftTitle}</h4>
        <div className="text-sm text-gray-700">{left}</div>
      </div>
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-2">{rightTitle}</h4>
        <div className="text-sm text-gray-700">{right}</div>
      </div>
    </div>
  );
}

export function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <div className="my-8 bg-slate-50 rounded-xl p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-3">Key Takeaways</h3>
      <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
