import React, { useCallback, useState } from 'react';
import {
  generatePDFReport,
  type PDFReportConfig,
} from '../../utils/pdf';
import {
  exportToolToExcel,
  type GenericExcelSheet,
} from '../../utils/excel';

/**
 * Mandatory export + share bar for every calculator tool.
 *
 * Provides the 5 buttons required by TOOL_DEVELOPMENT_GUIDE.md:
 *   PDF · Excel · Copy URL · WhatsApp · Twitter/X
 *
 * Color rules (per guide):
 *   PDF      → indigo
 *   Excel    → teal
 *   Copy URL → slate
 *   WhatsApp → teal
 *   Twitter  → sky
 *
 * Drop this directly under the page header (and above the calculator
 * inputs) on any tool — including those built on ToolShell.
 */
export interface ExportShareBarProps {
  /** Used to derive `<base>.pdf` and `<base>.xlsx`. e.g. 'Tip_Calculator'. */
  filenameBase: string;
  /** Builds the PDF report config from current tool state. */
  buildPdfConfig: () => PDFReportConfig;
  /** Builds Excel sheets from current tool state. */
  buildExcelSheets: () => GenericExcelSheet[];
  /** Short summary that goes into WhatsApp / Twitter messages. */
  shareMessage: string;
  /** Optional twitter-flavored variant (defaults to shareMessage). */
  twitterMessage?: string;
  /** Optional extra className for the wrapper bar. */
  className?: string;
}

export default function ExportShareBar({
  filenameBase,
  buildPdfConfig,
  buildExcelSheets,
  shareMessage,
  twitterMessage,
  className = '',
}: ExportShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);

  const handleExportPDF = useCallback(async () => {
    setExporting('pdf');
    try {
      const config = buildPdfConfig();
      await generatePDFReport({
        ...config,
        filename: config.filename || `${filenameBase}.pdf`,
      });
    } catch (e) {
      console.error('PDF export failed:', e);
      if (typeof window !== 'undefined') {
        window.alert('PDF export failed. Please try again.');
      }
    } finally {
      setExporting(null);
    }
  }, [buildPdfConfig, filenameBase]);

  const handleExportExcel = useCallback(() => {
    setExporting('excel');
    try {
      const sheets = buildExcelSheets();
      exportToolToExcel(sheets, `${filenameBase}.xlsx`);
    } catch (e) {
      console.error('Excel export failed:', e);
      if (typeof window !== 'undefined') {
        window.alert('Excel export failed. Please try again.');
      }
    } finally {
      setExporting(null);
    }
  }, [buildExcelSheets, filenameBase]);

  const handleCopyURL = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleShareWhatsApp = useCallback(() => {
    if (typeof window === 'undefined') return;
    const text = `${shareMessage}\n\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }, [shareMessage]);

  const handleShareTwitter = useCallback(() => {
    if (typeof window === 'undefined') return;
    const text = twitterMessage ?? shareMessage;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`,
      '_blank',
    );
  }, [shareMessage, twitterMessage]);

  return (
    <div
      className={`flex flex-wrap gap-2 justify-center ${className}`}
      role="toolbar"
      aria-label="Export and share"
    >
      <button
        type="button"
        onClick={handleExportPDF}
        disabled={exporting !== null}
        className="flex items-center gap-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50"
      >
        {exporting === 'pdf' ? '⏳ Generating…' : '📄 Export PDF'}
      </button>

      <button
        type="button"
        onClick={handleExportExcel}
        disabled={exporting !== null}
        className="flex items-center gap-2 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-slate-600 hover:text-teal-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50"
      >
        {exporting === 'excel' ? '⏳ Generating…' : '📊 Export Excel'}
      </button>

      <button
        type="button"
        onClick={handleCopyURL}
        className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
      >
        {copied ? '✅ Copied!' : '🔗 Copy URL'}
      </button>

      <button
        type="button"
        onClick={handleShareWhatsApp}
        className="flex items-center gap-2 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-slate-600 hover:text-teal-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
      >
        💬 WhatsApp
      </button>

      <button
        type="button"
        onClick={handleShareTwitter}
        className="flex items-center gap-2 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-200 text-slate-600 hover:text-sky-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
      >
        🐦 Twitter
      </button>
    </div>
  );
}
