import React from 'react';
import Link from 'next/link';

interface ToolShellProps {
  icon: string;
  title: string;
  tagline: string;
  /** Tailwind gradient classes, e.g. 'from-teal-600 via-emerald-600 to-green-500' */
  gradient?: string;
  /** Top-level section: 'tools' (default) or 'finance' */
  parent?: 'tools' | 'finance';
  /** Optional extra header content (e.g. currency selector) */
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

export default function ToolShell({
  icon,
  title,
  tagline,
  gradient = 'from-teal-600 via-emerald-600 to-green-500',
  parent = 'tools',
  headerActions,
  children,
}: ToolShellProps) {
  const parentLabel = parent === 'finance' ? 'Finance' : 'Tools';
  const parentHref = parent === 'finance' ? '/finance' : '/tools';
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/40">
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient}`} />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 pt-8 pb-10 sm:pt-12 sm:pb-12">
          <nav className="text-xs text-white/80 mb-3 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link href={parentHref} className="hover:text-white transition-colors">{parentLabel}</Link>
            <span>›</span>
            <span className="text-white font-medium">{title}</span>
          </nav>
          <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <span className="text-4xl sm:text-5xl drop-shadow-lg">{icon}</span>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  {title}
                </h1>
                <p className="text-white/90 text-sm sm:text-base mt-1 max-w-2xl">{tagline}</p>
              </div>
            </div>
            {headerActions && <div className="shrink-0">{headerActions}</div>}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}

/**
 * Reusable copy button with success state.
 */
export function CopyButton({
  value,
  label = 'Copy',
  className = '',
  disabled = false,
}: {
  value: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!value || disabled) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
        copied
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
      aria-label={copied ? 'Copied!' : label}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

/**
 * Reusable card panel.
 */
export function ToolCard({
  title,
  action,
  children,
  className = '',
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-slate-100 bg-slate-50/40">
          {title && <h2 className="text-sm font-bold text-slate-800">{title}</h2>}
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
