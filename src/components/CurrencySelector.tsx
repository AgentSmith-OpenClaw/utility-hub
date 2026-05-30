import React, { useEffect, useState } from 'react';
import { CurrencyCode, CURRENCIES, CURRENCY_LIST, getStoredCurrency, setStoredCurrency } from '../utils/currency';

interface Props {
  value?: CurrencyCode;
  onChange: (code: CurrencyCode) => void;
  className?: string;
  compact?: boolean;
}

export function useCurrency(): [CurrencyCode, (code: CurrencyCode) => void] {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window === 'undefined') return 'USD';
    const stored = window.localStorage.getItem('toolisk_currency');
    if (stored && stored in CURRENCIES) return stored as CurrencyCode;
    return getStoredCurrency();
  });

  useEffect(() => {
    setCurrencyState(getStoredCurrency());
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setStoredCurrency(code);
    setCurrencyState(code);
  };

  return [currency, setCurrency];
}

export default function CurrencySelector({ value, onChange, className = '', compact = false }: Props) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const current = value ?? 'USD';
  const currentCurrency = CURRENCY_LIST.find(c => c.code === current);

  if (!hydrated) {
    const detected = typeof navigator !== 'undefined' ? getStoredCurrency() : 'USD';
    const detectedCurrency = CURRENCIES[detected];
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg ${className}`}>
        <span>{detectedCurrency?.flag ?? '🇺🇸'}</span>
        <span className="font-medium">{detected}</span>
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value as CurrencyCode)}
        className="appearance-none pl-7 pr-8 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 cursor-pointer"
        aria-label="Currency"
      >
        {CURRENCY_LIST.map((c) => (
          <option key={c.code} value={c.code}>
            {compact ? c.code : `${c.code} — ${c.name}`}
          </option>
        ))}
      </select>
      <span className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-sm">{currentCurrency?.flag}</span>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▾</span>
    </div>
  );
}
