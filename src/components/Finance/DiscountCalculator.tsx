import React, { useCallback, useMemo, useState } from 'react';
import { ToolCard, CopyButton } from '../Tools/ToolShell';
import ExportShareBar from '../Tools/ExportShareBar';
import CurrencySelector, { useCurrency } from '../CurrencySelector';
import { CurrencyCode } from '../../utils/currency';

const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
  CAD: 'C$',
  INR: '₹',
};

type Mode = 'percent' | 'flat';

export default function DiscountCalculator() {
  const [currency, setCurrency] = useCurrency();
  const [mode, setMode] = useState<Mode>('percent');
  const [originalPrice, setOriginalPrice] = useState<string>('1000');
  const [discountPct, setDiscountPct] = useState<string>('20');
  const [discountFlat, setDiscountFlat] = useState<string>('200');
  const [taxPct, setTaxPct] = useState<string>('0');

  const result = useMemo(() => {
    const P = Math.max(0, parseFloat(originalPrice) || 0);
    let discountAmount = 0;
    let pct = 0;
    if (mode === 'percent') {
      pct = parseFloat(discountPct) || 0;
      discountAmount = (P * pct) / 100;
    } else {
      discountAmount = Math.max(0, parseFloat(discountFlat) || 0);
      pct = P > 0 ? (discountAmount / P) * 100 : 0;
    }
    discountAmount = Math.min(discountAmount, P);
    const priceAfterDiscount = P - discountAmount;
    const tax = (parseFloat(taxPct) || 0) / 100;
    const taxAmount = priceAfterDiscount * tax;
    const finalPrice = priceAfterDiscount + taxAmount;
    return {
      original: P,
      discountPct: pct,
      discountAmount,
      priceAfterDiscount,
      taxAmount,
      finalPrice,
      savedTotal: P - finalPrice + taxAmount, // money off the original price (excluding tax)
    };
  }, [originalPrice, discountPct, discountFlat, mode, taxPct]);

  const symbol = CURRENCY_SYMBOL[currency];
  const fmt = useCallback(
    (n: number) =>
      `${symbol}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    [symbol],
  );

  const buildPdfConfig = useCallback(
    () => ({
      title: 'Discount Calculator Report',
      subtitle: `${fmt(result.original)} − ${result.discountPct.toFixed(2)}% = ${fmt(result.priceAfterDiscount)}`,
      filename: 'Discount_Calculator.pdf',
      sections: [
        {
          type: 'inputs' as const,
          title: 'Inputs',
          inputs: [
            { label: 'Original price', value: fmt(result.original) },
            {
              label: 'Discount',
              value: mode === 'percent' ? `${discountPct}%` : `${fmt(parseFloat(discountFlat) || 0)} flat`,
            },
            { label: 'Tax %', value: `${taxPct}%` },
          ],
        },
        {
          type: 'metrics' as const,
          title: 'Result',
          metrics: [
            { label: 'Discount amount', value: fmt(result.discountAmount) },
            { label: 'Price after discount', value: fmt(result.priceAfterDiscount) },
            { label: 'Tax', value: fmt(result.taxAmount) },
            { label: 'Final price', value: fmt(result.finalPrice) },
          ],
        },
      ],
    }),
    [result, fmt, mode, discountPct, discountFlat, taxPct],
  );

  const buildExcelSheets = useCallback(
    () => [
      {
        name: 'Discount',
        rows: [
          { Field: 'Original price', Value: result.original.toFixed(2) },
          { Field: 'Discount %', Value: `${result.discountPct.toFixed(2)}%` },
          { Field: 'Discount amount', Value: result.discountAmount.toFixed(2) },
          { Field: 'Price after discount', Value: result.priceAfterDiscount.toFixed(2) },
          { Field: 'Tax %', Value: `${taxPct}%` },
          { Field: 'Tax amount', Value: result.taxAmount.toFixed(2) },
          { Field: 'Final price', Value: result.finalPrice.toFixed(2) },
        ],
      },
      {
        name: 'Discount scenarios',
        rows: [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80].map((p) => ({
          'Discount %': `${p}%`,
          'You pay': +(result.original * (1 - p / 100)).toFixed(2),
          'You save': +(result.original * (p / 100)).toFixed(2),
        })),
      },
    ],
    [result, taxPct],
  );

  return (
    <div className="space-y-5">
      <ExportShareBar
        filenameBase="Discount_Calculator"
        buildPdfConfig={buildPdfConfig}
        buildExcelSheets={buildExcelSheets}
        shareMessage={`${fmt(result.original)} − ${result.discountPct.toFixed(0)}% off = ${fmt(result.finalPrice)} (you save ${fmt(result.discountAmount)}).`}
      />

      <div className="flex justify-end">
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <ToolCard title="Item & Discount">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Original price</label>
            <input
              type="number"
              step="0.01"
              min={0}
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono"
            />
          </div>
          <div>
            <div className="flex gap-2 mb-2">
              {(['percent', 'flat'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors ${
                    mode === m
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  {m === 'percent' ? 'Discount %' : 'Flat amount'}
                </button>
              ))}
            </div>
            {mode === 'percent' ? (
              <>
                <input
                  type="number"
                  step="0.5"
                  min={0}
                  max={100}
                  value={discountPct}
                  onChange={(e) => setDiscountPct(e.target.value)}
                  className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {[10, 15, 20, 25, 30, 40, 50, 70].map((p) => (
                    <button
                      key={p}
                      onClick={() => setDiscountPct(String(p))}
                      className={`px-3 py-1 text-xs rounded-md border font-medium transition-colors ${
                        discountPct === String(p)
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
                      }`}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <input
                type="number"
                step="0.01"
                min={0}
                value={discountFlat}
                onChange={(e) => setDiscountFlat(e.target.value)}
                className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono"
              />
            )}
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Tax (optional)">
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-500">Tax %</label>
          <input
            type="number"
            step="0.1"
            min={0}
            max={50}
            value={taxPct}
            onChange={(e) => setTaxPct(e.target.value)}
            className="w-28 px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono"
          />
          <div className="flex flex-wrap gap-2">
            {['0', '5', '8.875', '12', '18'].map((t) => (
              <button
                key={t}
                onClick={() => setTaxPct(t)}
                className={`px-3 py-1 text-xs rounded-md border font-medium transition-colors ${
                  taxPct === t
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
                }`}
              >
                {t === '0' ? 'No tax' : `${t}%`}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Common: US sales tax 4–10%, NYC 8.875%, UK VAT 20%, India GST 5/12/18/28%.
        </p>
      </ToolCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ToolCard title="You Pay" action={<CopyButton value={result.finalPrice.toFixed(2)} />}>
          <p className="text-2xl font-bold text-emerald-700">{fmt(result.finalPrice)}</p>
          <p className="text-xs text-slate-500 mt-0.5">final price</p>
        </ToolCard>
        <ToolCard title="You Save" action={<CopyButton value={result.discountAmount.toFixed(2)} />}>
          <p className="text-2xl font-bold text-rose-700">{fmt(result.discountAmount)}</p>
          <p className="text-xs text-slate-500 mt-0.5">{result.discountPct.toFixed(2)}% off</p>
        </ToolCard>
        <ToolCard title="After Discount" action={<CopyButton value={result.priceAfterDiscount.toFixed(2)} />}>
          <p className="text-xl font-bold text-slate-800">{fmt(result.priceAfterDiscount)}</p>
          <p className="text-xs text-slate-500 mt-0.5">pre-tax</p>
        </ToolCard>
        <ToolCard title="Tax" action={<CopyButton value={result.taxAmount.toFixed(2)} />}>
          <p className="text-xl font-bold text-blue-700">{fmt(result.taxAmount)}</p>
          <p className="text-xs text-slate-500 mt-0.5">{taxPct}%</p>
        </ToolCard>
      </div>

      <ToolCard title="Quick Reference — Common Discount Percentages">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs">
                <th className="text-left py-2 text-slate-500 font-medium">Discount</th>
                <th className="text-right py-2 px-2 text-slate-500 font-medium">You save</th>
                <th className="text-right py-2 px-2 text-slate-500 font-medium">You pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {[10, 15, 20, 25, 30, 40, 50, 60, 70, 80].map((p) => (
                <tr key={p}>
                  <td className="py-1.5">{p}%</td>
                  <td className="py-1.5 px-2 text-right text-rose-700">{fmt((result.original * p) / 100)}</td>
                  <td className="py-1.5 px-2 text-right text-emerald-700 font-semibold">
                    {fmt(result.original * (1 - p / 100))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ToolCard>
    </div>
  );
}
