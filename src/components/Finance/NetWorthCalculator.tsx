import React, { useCallback, useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ToolCard } from '../Tools/ToolShell';
import ExportShareBar from '../Tools/ExportShareBar';
import CurrencySelector, { useCurrency } from '../CurrencySelector';
import { formatCurrency, formatCurrencyCompact } from '../../utils/currency';

interface LineItem { id: string; name: string; amount: number; }

const DEFAULT_ASSETS: LineItem[] = [
  { id: 'cash', name: 'Cash & checking', amount: 8000 },
  { id: 'savings', name: 'Savings / HYSA', amount: 25000 },
  { id: 'invest', name: 'Brokerage / investments', amount: 75000 },
  { id: 'retirement', name: 'Retirement accounts (401k/IRA)', amount: 120000 },
  { id: 'home', name: 'Primary residence', amount: 425000 },
  { id: 'auto', name: 'Vehicles', amount: 22000 },
  { id: 'other', name: 'Other (jewelry, crypto, etc.)', amount: 5000 },
];

const DEFAULT_LIABILITIES: LineItem[] = [
  { id: 'mortgage', name: 'Mortgage', amount: 285000 },
  { id: 'auto_loan', name: 'Auto loan', amount: 14000 },
  { id: 'student', name: 'Student loans', amount: 18000 },
  { id: 'credit_card', name: 'Credit cards', amount: 2500 },
  { id: 'other_debt', name: 'Other debt', amount: 0 },
];

// US net worth percentiles by age (2024 SCF data, USD)
const US_BENCHMARKS_USD: { ageRange: string; median: number; top10: number }[] = [
  { ageRange: 'Under 35', median: 39000, top10: 350000 },
  { ageRange: '35–44', median: 135600, top10: 1100000 },
  { ageRange: '45–54', median: 247200, top10: 2350000 },
  { ageRange: '55–64', median: 364500, top10: 4500000 },
  { ageRange: '65–74', median: 410000, top10: 5200000 },
  { ageRange: '75+', median: 334700, top10: 4400000 },
];

let nextId = 1000;

export default function NetWorthCalculator() {
  const [currency, setCurrency] = useCurrency();
  const [assets, setAssets] = useState<LineItem[]>(DEFAULT_ASSETS);
  const [liabilities, setLiabilities] = useState<LineItem[]>(DEFAULT_LIABILITIES);
  const [age, setAge] = useState(35);

  const totalAssets = useMemo(() => assets.reduce((s, a) => s + (Number(a.amount) || 0), 0), [assets]);
  const totalLiabilities = useMemo(() => liabilities.reduce((s, l) => s + (Number(l.amount) || 0), 0), [liabilities]);
  const netWorth = totalAssets - totalLiabilities;

  const benchmark = useMemo(() => {
    if (age < 35) return US_BENCHMARKS_USD[0];
    if (age < 45) return US_BENCHMARKS_USD[1];
    if (age < 55) return US_BENCHMARKS_USD[2];
    if (age < 65) return US_BENCHMARKS_USD[3];
    if (age < 75) return US_BENCHMARKS_USD[4];
    return US_BENCHMARKS_USD[5];
  }, [age]);

  const updateItem = (list: LineItem[], setList: (i: LineItem[]) => void, id: string, key: keyof LineItem, value: string) => {
    setList(list.map(item => item.id === id ? { ...item, [key]: key === 'amount' ? +value : value } : item));
  };

  const addItem = (list: LineItem[], setList: (i: LineItem[]) => void) => {
    setList([...list, { id: `new_${nextId++}`, name: '', amount: 0 }]);
  };

  const removeItem = (list: LineItem[], setList: (i: LineItem[]) => void, id: string) => {
    setList(list.filter(item => item.id !== id));
  };

  const PIE_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'];

  const assetPie = assets.filter(a => a.amount > 0).map(a => ({ name: a.name, value: a.amount }));

  const buildPdfConfig = useCallback(() => ({
    title: 'Net Worth Statement',
    subtitle: `Age ${age} · Net worth ${formatCurrency(netWorth, currency)}`,
    filename: 'Net_Worth.pdf',
    sections: [
      {
        type: 'metrics' as const,
        title: 'Summary',
        metrics: [
          { label: 'Net worth', value: formatCurrency(netWorth, currency) },
          { label: 'Total assets', value: formatCurrency(totalAssets, currency) },
          { label: 'Total liabilities', value: formatCurrency(totalLiabilities, currency) },
          { label: 'Age', value: String(age) },
        ],
      },
      {
        type: 'table' as const,
        title: 'Assets',
        table: {
          title: '',
          columns: [
            { header: 'Item', key: 'name', align: 'left' as const },
            { header: 'Amount', key: 'amount', align: 'right' as const },
          ],
          rows: assets.map((a) => ({ name: a.name || '(unnamed)', amount: formatCurrency(a.amount, currency) })),
        },
      },
      {
        type: 'table' as const,
        title: 'Liabilities',
        table: {
          title: '',
          columns: [
            { header: 'Item', key: 'name', align: 'left' as const },
            { header: 'Amount', key: 'amount', align: 'right' as const },
          ],
          rows: liabilities.map((l) => ({ name: l.name || '(unnamed)', amount: formatCurrency(l.amount, currency) })),
        },
      },
      {
        type: 'message' as const,
        message: {
          heading: `US benchmark (age ${benchmark.ageRange})`,
          text: `Median: ${formatCurrencyCompact(benchmark.median, 'USD')} · Top 10%: ${formatCurrencyCompact(benchmark.top10, 'USD')}. Source: 2024 US Federal Reserve Survey of Consumer Finances.`,
        },
      },
    ],
  }), [age, netWorth, totalAssets, totalLiabilities, assets, liabilities, benchmark, currency]);

  const buildExcelSheets = useCallback(() => ([
    {
      name: 'Summary',
      rows: [
        { Field: 'Age', Value: age },
        { Field: 'Total assets', Value: totalAssets },
        { Field: 'Total liabilities', Value: totalLiabilities },
        { Field: 'Net worth', Value: netWorth },
        { Field: 'Currency', Value: currency },
        { Field: 'US benchmark age range', Value: benchmark.ageRange },
        { Field: 'US median net worth (USD)', Value: benchmark.median },
        { Field: 'US top 10% net worth (USD)', Value: benchmark.top10 },
      ],
    },
    {
      name: 'Assets',
      rows: assets.map((a) => ({ Item: a.name || '(unnamed)', Amount: a.amount })),
    },
    {
      name: 'Liabilities',
      rows: liabilities.map((l) => ({ Item: l.name || '(unnamed)', Amount: l.amount })),
    },
  ]), [age, totalAssets, totalLiabilities, netWorth, assets, liabilities, benchmark, currency]);

  const renderList = (title: string, list: LineItem[], setList: (i: LineItem[]) => void, accent: string) => (
    <ToolCard title={title}>
      <div className="space-y-2">
        {list.map((item) => (
          <div key={item.id} className="flex gap-2">
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(list, setList, item.id, 'name', e.target.value)}
              className="flex-1 px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder="Item name"
            />
            <input
              type="number"
              value={item.amount}
              onChange={(e) => updateItem(list, setList, item.id, 'amount', e.target.value)}
              className="w-32 px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono text-right"
              placeholder="0"
            />
            <button onClick={() => removeItem(list, setList, item.id)} className="px-2 text-slate-400 hover:text-red-500" title="Remove">×</button>
          </div>
        ))}
        <button onClick={() => addItem(list, setList)} className={`px-3 py-1.5 text-xs rounded-lg border border-dashed text-slate-500 hover:${accent} transition-colors w-full`}>
          + Add row
        </button>
        <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold text-sm">
          <span>Subtotal</span>
          <span className="font-mono">{formatCurrency(list.reduce((s, l) => s + (Number(l.amount) || 0), 0), currency)}</span>
        </div>
      </div>
    </ToolCard>
  );

  return (
    <div className="space-y-5">
      <ExportShareBar
        filenameBase="Net_Worth"
        buildPdfConfig={buildPdfConfig}
        buildExcelSheets={buildExcelSheets}
        shareMessage={`My net worth at age ${age}: ${formatCurrencyCompact(netWorth, currency)} (${formatCurrencyCompact(totalAssets, currency)} assets − ${formatCurrencyCompact(totalLiabilities, currency)} debt).`}
      />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-500">Your age:</label>
          <input type="number" min={18} max={100} value={age} onChange={(e) => setAge(+e.target.value)} className="w-20 px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ToolCard title="Net worth">
          <p className={`text-3xl font-bold ${netWorth >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            {formatCurrencyCompact(netWorth, currency)}
          </p>
          <p className="text-xs text-slate-500 mt-1">{formatCurrency(netWorth, currency)}</p>
        </ToolCard>
        <ToolCard title="Total assets">
          <p className="text-2xl font-bold text-emerald-700">{formatCurrencyCompact(totalAssets, currency)}</p>
          <p className="text-xs text-slate-500 mt-1">{formatCurrency(totalAssets, currency)}</p>
        </ToolCard>
        <ToolCard title="Total liabilities">
          <p className="text-2xl font-bold text-red-700">{formatCurrencyCompact(totalLiabilities, currency)}</p>
          <p className="text-xs text-slate-500 mt-1">{formatCurrency(totalLiabilities, currency)}</p>
        </ToolCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {renderList('Assets', assets, setAssets, 'border-emerald-400')}
        {renderList('Liabilities', liabilities, setLiabilities, 'border-red-400')}
      </div>

      {assetPie.length > 0 && (
        <ToolCard title="Asset Allocation">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assetPie} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="value">
                  {assetPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0, currency)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ToolCard>
      )}

      <ToolCard title={`How you compare — US benchmarks (age ${benchmark.ageRange})`}>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
            <div className="text-xs text-slate-500">Median</div>
            <div className="text-lg font-bold text-slate-700">{formatCurrencyCompact(benchmark.median, 'USD')}</div>
          </div>
          <div className={`rounded-lg p-3 border text-center ${netWorth >= benchmark.median && netWorth < benchmark.top10 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
            <div className="text-xs text-slate-500">You</div>
            <div className={`text-lg font-bold ${netWorth >= benchmark.median && netWorth < benchmark.top10 ? 'text-emerald-700' : 'text-slate-700'}`}>
              {formatCurrencyCompact(netWorth, currency)}
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
            <div className="text-xs text-slate-500">Top 10%</div>
            <div className="text-lg font-bold text-slate-700">{formatCurrencyCompact(benchmark.top10, 'USD')}</div>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Source: 2024 US Federal Reserve Survey of Consumer Finances. Comparison shown in USD regardless of selected currency.
        </p>
      </ToolCard>
    </div>
  );
}
