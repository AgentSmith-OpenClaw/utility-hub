export default function PdfTrustBadge() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 mb-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:divide-x sm:divide-slate-100">

        <div className="flex items-center gap-3 sm:flex-1 sm:pr-5">
          <div
            className="flex-shrink-0 w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-lg"
            aria-hidden="true"
          >
            🔒
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800 leading-snug">Files stay on your device - 100% security</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Nothing is uploaded — ever. We never see your files</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:flex-1 sm:px-5">
          <div
            className="flex-shrink-0 w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-lg"
            aria-hidden="true"
          >
            ⚡
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800 leading-snug">Lightning Fast — all on local all quick</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Starts the moment you drop the file.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:flex-1 sm:pl-5">
          <div
            className="flex-shrink-0 w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-lg"
            aria-hidden="true"
          >
            🆓
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800 leading-snug">No sign-up, no watermarks</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Open, use, download. That's it.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
