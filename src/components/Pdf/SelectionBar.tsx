import React, { useRef, useEffect } from 'react';

interface SelectionBarProps {
  selected: number;
  total: number;
  onSelectAll: () => void;
  onSelectNone: () => void;
  onInvert?: () => void;
}

export default function SelectionBar({
  selected,
  total,
  onSelectAll,
  onSelectNone,
  onInvert,
}: SelectionBarProps) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  const allSelected = total > 0 && selected === total;
  const noneSelected = selected === 0;
  const partialSelected = !allSelected && !noneSelected;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = partialSelected;
    }
  }, [partialSelected]);

  const handleCheckbox = () => {
    if (allSelected) {
      onSelectNone();
    } else {
      onSelectAll();
    }
  };

  if (noneSelected) {
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            ref={checkboxRef}
            type="checkbox"
            checked={false}
            onChange={handleCheckbox}
            className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
            aria-label="Select all pages"
          />
          <span className="text-sm font-medium text-slate-500">Select all pages</span>
        </label>
        <p className="text-xs text-slate-400 pl-6">
          Click page thumbnails below to select them, or use the checkbox above to select all at once.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={allSelected}
          onChange={handleCheckbox}
          className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
          aria-label={allSelected ? 'Deselect all pages' : 'Select all pages'}
        />
        <span className="text-sm font-medium text-slate-700">
          {allSelected ? `All ${total} pages selected` : `${selected} of ${total} pages selected`}
        </span>
      </label>

      {onInvert && (
        <button
          type="button"
          onClick={onInvert}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          Invert
        </button>
      )}

      {!allSelected && (
        <button
          type="button"
          onClick={onSelectNone}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors ml-auto"
        >
          Clear
        </button>
      )}
    </div>
  );
}
