import React, { useCallback, useState, useMemo } from 'react';
import { ToolCard, CopyButton } from '../Tools/ToolShell';
import ExportShareBar from '../Tools/ExportShareBar';

type Region = 'US' | 'EU' | 'UK' | 'AU' | 'CA';

interface RegionConfig {
  code: Region;
  flag: string;
  label: string;
  taxName: string;
  symbol: string;
  presets: { name: string; rate: number }[];
}

const REGIONS: RegionConfig[] = [
  {
    code: 'US', flag: '🇺🇸', label: 'United States', taxName: 'Sales Tax', symbol: '$',
    presets: [
      { name: 'No tax (DE, MT, NH, OR)', rate: 0 },
      { name: 'California (avg)', rate: 8.85 },
      { name: 'New York City', rate: 8.875 },
      { name: 'Texas (Houston)', rate: 8.25 },
      { name: 'Florida (avg)', rate: 7.0 },
      { name: 'Illinois (Chicago)', rate: 10.25 },
      { name: 'Washington (Seattle)', rate: 10.25 },
    ],
  },
  {
    code: 'EU', flag: '🇪🇺', label: 'European Union', taxName: 'VAT', symbol: '€',
    presets: [
      { name: 'Germany (standard)', rate: 19 },
      { name: 'Germany (reduced)', rate: 7 },
      { name: 'France (standard)', rate: 20 },
      { name: 'France (reduced)', rate: 5.5 },
      { name: 'Spain (standard)', rate: 21 },
      { name: 'Italy (standard)', rate: 22 },
      { name: 'Netherlands', rate: 21 },
      { name: 'Hungary (highest in EU)', rate: 27 },
    ],
  },
  {
    code: 'UK', flag: '🇬🇧', label: 'United Kingdom', taxName: 'VAT', symbol: '£',
    presets: [
      { name: 'Standard', rate: 20 },
      { name: 'Reduced (energy, child seats)', rate: 5 },
      { name: 'Zero-rated (food, books)', rate: 0 },
    ],
  },
  {
    code: 'AU', flag: '🇦🇺', label: 'Australia', taxName: 'GST', symbol: 'A$',
    presets: [
      { name: 'Standard GST', rate: 10 },
      { name: 'GST-free (basic food, health)', rate: 0 },
    ],
  },
  {
    code: 'CA', flag: '🇨🇦', label: 'Canada', taxName: 'GST/HST', symbol: 'C$',
    presets: [
      { name: 'Federal GST only (AB, NT, NU, YT)', rate: 5 },
      { name: 'HST Ontario', rate: 13 },
      { name: 'HST Atlantic (NS, NB, PE, NL)', rate: 15 },
      { name: 'GST + QST Quebec (combined)', rate: 14.975 },
      { name: 'GST + PST British Columbia', rate: 12 },
      { name: 'GST + PST Saskatchewan', rate: 11 },
      { name: 'GST + PST Manitoba', rate: 12 },
    ],
  },
];

export default function SalesTaxVatGstCalculator() {
  const [region, setRegion] = useState<Region>('US');
  const [direction, setDirection] = useState<'add' | 'remove'>('add');
  const [amount, setAmount] = useState<string>('100');
  const [rate, setRate] = useState<number>(8.85);

  const cfg = REGIONS.find(r => r.code === region)!;

  const result = useMemo(() => {
    const a = parseFloat(amount) || 0;
    if (direction === 'add') {
      const tax = a * rate / 100;
      return { net: a, tax, gross: a + tax };
    } else {
      // Amount includes tax — back it out
      const net = a / (1 + rate / 100);
      const tax = a - net;
      return { net, tax, gross: a };
    }
  }, [amount, rate, direction]);

  const fmt = (n: number) => `${cfg.symbol}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const buildPdfConfig = useCallback(() => ({
    title: `${cfg.taxName} Calculator Report`,
    subtitle: `${cfg.label} · ${rate}% · ${direction === 'add' ? 'Adding' : 'Removing'} ${cfg.taxName}`,
    filename: 'Sales_Tax_VAT_GST.pdf',
    sections: [
      {
        type: 'inputs' as const,
        title: 'Inputs',
        inputs: [
          { label: 'Region', value: `${cfg.flag} ${cfg.label}` },
          { label: 'Tax type', value: cfg.taxName },
          { label: 'Rate', value: `${rate}%` },
          { label: 'Direction', value: direction === 'add' ? 'Add to net' : 'Remove from gross' },
          { label: direction === 'add' ? 'Net entered' : 'Gross entered', value: fmt(direction === 'add' ? result.net : result.gross) },
        ],
      },
      {
        type: 'metrics' as const,
        title: 'Result',
        metrics: [
          { label: 'Net (pre-tax)', value: fmt(result.net) },
          { label: `${cfg.taxName} amount`, value: fmt(result.tax) },
          { label: 'Gross (with tax)', value: fmt(result.gross) },
          { label: 'Rate', value: `${rate}%` },
        ],
      },
    ],
  }), [cfg, rate, direction, result, fmt]);

  const buildExcelSheets = useCallback(() => ([
    {
      name: 'Result',
      rows: [
        { Field: 'Region', Value: cfg.label },
        { Field: 'Tax Type', Value: cfg.taxName },
        { Field: 'Rate %', Value: rate },
        { Field: 'Direction', Value: direction === 'add' ? 'Add to net' : 'Remove from gross' },
        { Field: 'Net (pre-tax)', Value: result.net.toFixed(2) },
        { Field: `${cfg.taxName} amount`, Value: result.tax.toFixed(2) },
        { Field: 'Gross (with tax)', Value: result.gross.toFixed(2) },
      ],
    },
    {
      name: 'Presets',
      rows: cfg.presets.map((p) => ({ Preset: p.name, 'Rate %': p.rate })),
    },
  ]), [cfg, rate, direction, result]);

  return (
    <div className="space-y-5">
      <ExportShareBar
        filenameBase="Sales_Tax_VAT_GST"
        buildPdfConfig={buildPdfConfig}
        buildExcelSheets={buildExcelSheets}
        shareMessage={`${cfg.taxName} in ${cfg.label} @ ${rate}%: ${fmt(result.net)} + ${fmt(result.tax)} = ${fmt(result.gross)}.`}
      />
      <ToolCard title="Region">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {REGIONS.map(r => (
            <button
              key={r.code}
              onClick={() => { setRegion(r.code); setRate(r.presets[0].rate); }}
              className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                region === r.code ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
              }`}
            >
              <div className="text-2xl">{r.flag}</div>
              <div className="text-xs mt-0.5">{r.label}</div>
              <div className={`text-[10px] mt-0.5 ${region === r.code ? 'text-white/80' : 'text-slate-400'}`}>{r.taxName}</div>
            </button>
          ))}
        </div>
      </ToolCard>

      <ToolCard title={`${cfg.taxName} Rate Presets`}>
        <div className="flex flex-wrap gap-2">
          {cfg.presets.map(p => (
            <button
              key={p.name}
              onClick={() => setRate(p.rate)}
              className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                rate === p.rate ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
              }`}
            >
              {p.name} ({p.rate}%)
            </button>
          ))}
        </div>
      </ToolCard>

      <ToolCard title="Calculate">
        <div className="flex gap-2 mb-3">
          {(['add', 'remove'] as const).map(d => (
            <button key={d} onClick={() => setDirection(d)} className={`px-4 py-1.5 text-sm rounded-lg border font-medium transition-colors ${direction === d ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'}`}>
              {d === 'add' ? `Add ${cfg.taxName}` : `Remove ${cfg.taxName} (back out)`}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{direction === 'add' ? 'Net amount (before tax)' : 'Gross amount (incl. tax)'}</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{cfg.taxName} rate (%)</label>
            <input type="number" step="0.01" value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono" />
          </div>
        </div>
      </ToolCard>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ToolCard title="Net (before tax)" action={<CopyButton value={result.net.toFixed(2)} />}>
          <p className="text-2xl font-bold text-slate-800">{fmt(result.net)}</p>
        </ToolCard>
        <ToolCard title={`${cfg.taxName} amount`} action={<CopyButton value={result.tax.toFixed(2)} />}>
          <p className="text-2xl font-bold text-blue-700">{fmt(result.tax)}</p>
        </ToolCard>
        <ToolCard title="Gross (with tax)" action={<CopyButton value={result.gross.toFixed(2)} />}>
          <p className="text-2xl font-bold text-emerald-700">{fmt(result.gross)}</p>
        </ToolCard>
      </div>

      <ToolCard title={`About ${cfg.taxName} in ${cfg.label}`}>
        {region === 'US' && (
          <p className="text-sm text-slate-600">US sales tax is set at the state and local level. Five states have no state-level sales tax: Delaware, Montana, New Hampshire, Oregon, and Alaska (though some Alaskan cities do charge local sales tax). Total rates can range from 0% to over 10% when combining state, county, and city.</p>
        )}
        {region === 'EU' && (
          <p className="text-sm text-slate-600">VAT (Value Added Tax) is charged at every stage of the supply chain. Standard rates in EU member states range from 17% (Luxembourg) to 27% (Hungary). Reduced rates apply to essentials like food, books, and medicine. Businesses can typically reclaim VAT on purchases.</p>
        )}
        {region === 'UK' && (
          <p className="text-sm text-slate-600">UK VAT replaced the EU system after Brexit but mirrors it closely. The standard rate is 20%, reduced rate is 5% (e.g., domestic energy), and zero rate applies to most food, books, children&apos;s clothing, and public transport. Registration is required for businesses with turnover over £90,000.</p>
        )}
        {region === 'AU' && (
          <p className="text-sm text-slate-600">Australian GST (Goods and Services Tax) is a flat 10% on most goods and services. GST-free items include basic food, most health services, education, and exports. Businesses with turnover over A$75,000 must register for GST.</p>
        )}
        {region === 'CA' && (
          <p className="text-sm text-slate-600">Canada has a federal 5% GST plus provincial taxes that vary by province. HST provinces (ON, NS, NB, PE, NL) combine these into a single tax. Quebec uses GST + QST (separate). BC, SK, MB use GST + PST. Alberta and the territories charge only the federal 5% GST.</p>
        )}
      </ToolCard>
    </div>
  );
}
