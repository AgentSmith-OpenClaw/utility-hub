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
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
        <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 pt-9 pb-12 sm:pt-12 sm:pb-14">
          <nav className="text-xs text-white/80 mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden>›</span>
            <Link href={parentHref} className="hover:text-white transition-colors">{parentLabel}</Link>
            <span aria-hidden>›</span>
            <span className="text-white font-medium">{title}</span>
          </nav>
          <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
            <div className="flex items-start sm:items-center gap-3 sm:gap-5">
              <span className="text-4xl sm:text-5xl drop-shadow-lg">{icon}</span>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  {title}
                </h1>
                <p className="text-white/90 text-sm sm:text-base mt-1.5 max-w-2xl leading-relaxed">{tagline}</p>
              </div>
            </div>
            {headerActions && <div className="shrink-0">{headerActions}</div>}
          </div>
        </div>
      </section>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <main>{children}</main>
      </div>
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
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm'
      } ${disabled ? 'opacity-40 cursor-not-allowed hover:shadow-none' : ''} ${className}`}
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
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] overflow-hidden ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3.5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-white">
          {title && (
            <h2 className="text-sm sm:text-[15px] font-bold text-slate-800 tracking-tight">
              {title}
            </h2>
          )}
          {action && <div className="flex items-center gap-2 flex-wrap justify-end">{action}</div>}
        </div>
      )}
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

/**
 * Ad rail slot placeholder. Reserves real estate for future AdSense integration.
 * Visual is intentionally quiet so it doesn't dominate the page while empty.
 */
export function AdRailSlot({
  format,
  className = '',
}: {
  format: 'skyscraper' | 'banner' | 'rectangle';
  className?: string;
}) {
  const sizeClass =
    format === 'skyscraper'
      ? 'w-[300px] h-[600px]'
      : format === 'rectangle'
      ? 'w-[300px] h-[250px]'
      : 'w-full max-w-[728px] h-[90px]';

  return (
    <div
      aria-hidden="true"
      className={`${sizeClass} ${className}`}
    />
  );
}
