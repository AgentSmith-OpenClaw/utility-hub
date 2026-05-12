import React, { useCallback, useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts';
import { ToolCard, CopyButton } from '../Tools/ToolShell';
import ExportShareBar from '../Tools/ExportShareBar';
import CurrencySelector, { useCurrency } from '../CurrencySelector';
import { CurrencyCode } from '../../utils/currency';

const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  USD: '$', EUR: '€', GBP: '£', AUD: 'A$', CAD: 'C$', INR: '₹',
};

type DtiPreset = 'conservative' | 'standard' | 'aggressive';

const DTI_PRESETS: Record<DtiPreset, { front: number; back: number; label: string }> = {
  conservative: { front: 28, back: 36, label: 'Conservative (28/36)' },
  standard:     { front: 31, back: 43, label: 'Standard (31/43)' },
  aggressive:   { front: 36, back: 50, label: 'FHA / Stretch (36/50)' },
};

function calcMaxHome(
  annualIncome: number,
  monthlyDebts: number,
  rate: number,
  termYears: number,
  downPct: number,
  propTaxRate: number,
  annualInsurance: number,
  monthlyHoa: number,
  frontDti: number,
  backDti: number,
) {
  const monthly = annualIncome / 12;
  const maxPiti = monthly * (frontDti / 100);
  const maxBack = monthly * (backDti / 100) - monthlyDebts;
  const maxPitiEffective = Math.min(maxPiti, maxBack);

  const monthlyTax = 0;   // placeholder — we solve iteratively below
  const monthlyIns = annualInsurance / 12;
  const maxPI = Math.max(0, maxPitiEffective - monthlyIns - monthlyHoa - monthlyTax);

  const r = rate / 100 / 12;
  const n = termYears * 12;
  // Loan from max PI payment: P = maxPI * [(1+r)^n - 1] / [r(1+r)^n]
  const loanAmount = r === 0 ? maxPI * n : (maxPI * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
  const homePrice = loanAmount / (1 - downPct / 100);

  // Recalculate with actual property tax
  const monthlyPropTax = (homePrice * propTaxRate) / 100 / 12;
  const maxPI2 = Math.max(0, maxPitiEffective - monthlyIns - monthlyHoa - monthlyPropTax);
  const loan2 = r === 0 ? maxPI2 * n : (maxPI2 * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
  const homePrice2 = loan2 / (1 - downPct / 100);

  const downPayment = homePrice2 * (downPct / 100);
  const finalLoan = homePrice2 - downPayment;

  const monthlyPI = r === 0 ? finalLoan / n : (finalLoan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const monthlyPT = (homePrice2 * propTaxRate) / 100 / 12;
  const monthlyHoaIns = annualInsurance / 12 + monthlyHoa;
  const totalPiti = monthlyPI + monthlyPT + monthlyHoaIns;

  const frontDtiActual = monthly > 0 ? (totalPiti / monthly) * 100 : 0;
  const backDtiActual = monthly > 0 ? ((totalPiti + monthlyDebts) / monthly) * 100 : 0;

  return {
    homePrice: homePrice2,
    downPayment,
    loanAmount: finalLoan,
    monthlyPI,
    monthlyPropTax: monthlyPT,
    monthlyInsurance: annualInsurance / 12,
    monthlyHoa,
    totalPiti,
    frontDtiActual,
    backDtiActual,
  };
}

export default function HouseAffordabilityCalculator() {
  const [currency, setCurrency] = useCurrency();
  const [annualIncome, setAnnualIncome] = useState('80000');
  const [downMode, setDownMode] = useState<'pct' | 'flat'>('pct');
  const [downPct, setDownPct] = useState('20');
  const [downFlat, setDownFlat] = useState('40000');
  const [monthlyDebts, setMonthlyDebts] = useState('400');
  const [rate, setRate] = useState('7');
  const [termYears, setTermYears] = useState<15 | 20 | 30>(30);
  const [propTaxRate, setPropTaxRate] = useState('1.2');
  const [annualInsurance, setAnnualInsurance] = useState('1500');
  const [monthlyHoa, setMonthlyHoa] = useState('0');
  const [dtiPreset, setDtiPreset] = useState<DtiPreset>('standard');

  const symbol = CURRENCY_SYMBOL[currency];
  const fmt = useCallback(
    (n: number) =>
      `${symbol}${Math.round(n).toLocaleString()}`,
    [symbol],
  );
  const fmtPct = (n: number) => `${n.toFixed(1)}%`;

  const result = useMemo(() => {
    const income = Math.max(0, parseFloat(annualIncome) || 0);
    const debts = Math.max(0, parseFloat(monthlyDebts) || 0);
    const r = Math.max(0, parseFloat(rate) || 0);
    const tax = Math.max(0, parseFloat(propTaxRate) || 0);
    const ins = Math.max(0, parseFloat(annualInsurance) || 0);
    const hoa = Math.max(0, parseFloat(monthlyHoa) || 0);

    const homePrice0 = income * 4; // rough seed for down flat calc
    const effectiveDownPct =
      downMode === 'pct'
        ? Math.min(100, Math.max(0, parseFloat(downPct) || 0))
        : Math.min(99, (Math.max(0, parseFloat(downFlat) || 0) / Math.max(1, homePrice0)) * 100);

    const { front, back } = DTI_PRESETS[dtiPreset];

    const main = calcMaxHome(income, debts, r, termYears, effectiveDownPct, tax, ins, hoa, front, back);

    const conservative = calcMaxHome(income, debts, r, termYears, effectiveDownPct, tax, ins, hoa, 28, 36);
    const aggressive = calcMaxHome(income, debts, r, termYears, effectiveDownPct, tax, ins, hoa, 36, 50);

    return { main, conservative, aggressive, effectiveDownPct };
  }, [annualIncome, monthlyDebts, rate, termYears, downMode, downPct, downFlat, propTaxRate, annualInsurance, monthlyHoa, dtiPreset]);

  const dtiColor = (actual: number, limit: number) =>
    actual <= limit ? 'text-emerald-700' : actual <= limit + 5 ? 'text-amber-600' : 'text-rose-700';

  const pitiData = [
    { name: 'Principal & Interest', value: Math.round(result.main.monthlyPI), fill: '#2563eb' },
    { name: 'Property Tax', value: Math.round(result.main.monthlyPropTax), fill: '#7c3aed' },
    { name: 'Insurance', value: Math.round(result.main.monthlyInsurance), fill: '#0891b2' },
    { name: 'HOA', value: Math.round(result.main.monthlyHoa), fill: '#6b7280' },
  ].filter((d) => d.value > 0);

  const scenarioData = [
    { name: 'Conservative\n28/36', price: Math.round(result.conservative.homePrice) },
    { name: 'Standard\n31/43', price: Math.round(result.main.homePrice) },
    { name: 'FHA Stretch\n36/50', price: Math.round(result.aggressive.homePrice) },
  ];

  const buildPdfConfig = useCallback(
    () => ({
      title: 'House Affordability Report',
      subtitle: `Max home price: ${fmt(result.main.homePrice)} | Monthly PITI: ${fmt(result.main.totalPiti)}`,
      filename: 'House_Affordability.pdf',
      sections: [
        {
          type: 'inputs' as const,
          title: 'Inputs',
          inputs: [
            { label: 'Annual income', value: fmt(parseFloat(annualIncome) || 0) },
            { label: 'Down payment', value: downMode === 'pct' ? `${downPct}%` : fmt(parseFloat(downFlat) || 0) },
            { label: 'Monthly debts', value: fmt(parseFloat(monthlyDebts) || 0) },
            { label: 'Interest rate', value: `${rate}%` },
            { label: 'Loan term', value: `${termYears} years` },
            { label: 'DTI preset', value: DTI_PRESETS[dtiPreset].label },
          ],
        },
        {
          type: 'metrics' as const,
          title: 'Result',
          metrics: [
            { label: 'Max home price', value: fmt(result.main.homePrice) },
            { label: 'Down payment', value: fmt(result.main.downPayment) },
            { label: 'Loan amount', value: fmt(result.main.loanAmount) },
            { label: 'Monthly PITI', value: fmt(result.main.totalPiti) },
            { label: 'Front-end DTI', value: fmtPct(result.main.frontDtiActual) },
            { label: 'Back-end DTI', value: fmtPct(result.main.backDtiActual) },
          ],
        },
      ],
    }),
    [result, fmt, annualIncome, downMode, downPct, downFlat, monthlyDebts, rate, termYears, dtiPreset],
  );

  const buildExcelSheets = useCallback(
    () => [
      {
        name: 'Affordability',
        rows: [
          { Field: 'Annual income', Value: parseFloat(annualIncome) || 0 },
          { Field: 'Down payment %', Value: `${result.effectiveDownPct.toFixed(1)}%` },
          { Field: 'Monthly debts', Value: parseFloat(monthlyDebts) || 0 },
          { Field: 'Interest rate', Value: `${rate}%` },
          { Field: 'Loan term', Value: `${termYears} years` },
          { Field: 'DTI preset', Value: DTI_PRESETS[dtiPreset].label },
          { Field: 'Max home price', Value: Math.round(result.main.homePrice) },
          { Field: 'Down payment', Value: Math.round(result.main.downPayment) },
          { Field: 'Loan amount', Value: Math.round(result.main.loanAmount) },
          { Field: 'Monthly PI', Value: Math.round(result.main.monthlyPI) },
          { Field: 'Monthly property tax', Value: Math.round(result.main.monthlyPropTax) },
          { Field: 'Monthly insurance', Value: Math.round(result.main.monthlyInsurance) },
          { Field: 'Monthly HOA', Value: Math.round(result.main.monthlyHoa) },
          { Field: 'Total monthly PITI', Value: Math.round(result.main.totalPiti) },
          { Field: 'Front-end DTI', Value: `${result.main.frontDtiActual.toFixed(1)}%` },
          { Field: 'Back-end DTI', Value: `${result.main.backDtiActual.toFixed(1)}%` },
        ],
      },
      {
        name: 'Scenarios',
        rows: [
          { Scenario: 'Conservative (28/36)', 'Max Home Price': Math.round(result.conservative.homePrice), 'Monthly PITI': Math.round(result.conservative.totalPiti) },
          { Scenario: 'Standard (31/43)', 'Max Home Price': Math.round(result.main.homePrice), 'Monthly PITI': Math.round(result.main.totalPiti) },
          { Scenario: 'FHA Stretch (36/50)', 'Max Home Price': Math.round(result.aggressive.homePrice), 'Monthly PITI': Math.round(result.aggressive.totalPiti) },
        ],
      },
    ],
    [result, annualIncome, monthlyDebts, rate, termYears, dtiPreset],
  );

  return (
    <div className="space-y-5">
      <ExportShareBar
        filenameBase="House_Affordability"
        buildPdfConfig={buildPdfConfig}
        buildExcelSheets={buildExcelSheets}
        shareMessage={`House affordability: I can afford up to ${fmt(result.main.homePrice)} with ${fmt(result.main.totalPiti)}/month PITI.`}
      />

      <div className="flex justify-end">
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <ToolCard title="Income & Debts">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Annual gross income</label>
            <input
              type="number" min={0} value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Monthly debt payments (car, student loan, etc.)</label>
            <input
              type="number" min={0} value={monthlyDebts}
              onChange={(e) => setMonthlyDebts(e.target.value)}
              className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono"
            />
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Down Payment">
        <div className="flex gap-2 mb-3">
          {(['pct', 'flat'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setDownMode(m)}
              className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors ${
                downMode === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
              }`}
            >
              {m === 'pct' ? 'Percentage' : 'Flat amount'}
            </button>
          ))}
        </div>
        {downMode === 'pct' ? (
          <>
            <input
              type="number" min={0} max={100} step={0.5} value={downPct}
              onChange={(e) => setDownPct(e.target.value)}
              className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {[3.5, 5, 10, 15, 20, 25].map((p) => (
                <button
                  key={p}
                  onClick={() => setDownPct(String(p))}
                  className={`px-3 py-1 text-xs rounded-md border font-medium transition-colors ${
                    downPct === String(p) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </>
        ) : (
          <input
            type="number" min={0} step={1000} value={downFlat}
            onChange={(e) => setDownFlat(e.target.value)}
            className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono"
          />
        )}
      </ToolCard>

      <ToolCard title="Loan Details">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Interest rate (%)</label>
            <input
              type="number" min={0} max={30} step={0.125} value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Loan term</label>
            <div className="flex gap-2 mt-1">
              {([15, 20, 30] as const).map((y) => (
                <button
                  key={y}
                  onClick={() => setTermYears(y)}
                  className={`flex-1 py-2 text-sm rounded-lg border font-medium transition-colors ${
                    termYears === y ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                  }`}
                >
                  {y}yr
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">DTI guideline</label>
            <div className="space-y-1 mt-1">
              {(Object.entries(DTI_PRESETS) as [DtiPreset, { label: string }][]).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setDtiPreset(key)}
                  className={`w-full text-left px-2 py-1 text-xs rounded-md border font-medium transition-colors ${
                    dtiPreset === key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Taxes, Insurance & HOA (optional)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Property tax rate (%/yr)</label>
            <input
              type="number" min={0} max={5} step={0.1} value={propTaxRate}
              onChange={(e) => setPropTaxRate(e.target.value)}
              className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono"
            />
            <p className="text-xs text-slate-400 mt-1">US avg ≈ 1.1%; TX/NJ ≈ 2%+</p>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Homeowners insurance (/yr)</label>
            <input
              type="number" min={0} step={100} value={annualInsurance}
              onChange={(e) => setAnnualInsurance(e.target.value)}
              className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">HOA (/month)</label>
            <input
              type="number" min={0} step={50} value={monthlyHoa}
              onChange={(e) => setMonthlyHoa(e.target.value)}
              className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono"
            />
          </div>
        </div>
      </ToolCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ToolCard title="Max Home Price" action={<CopyButton value={Math.round(result.main.homePrice).toString()} />}>
          <p className="text-2xl font-bold text-blue-700">{fmt(result.main.homePrice)}</p>
          <p className="text-xs text-slate-500 mt-0.5">{DTI_PRESETS[dtiPreset].label}</p>
        </ToolCard>
        <ToolCard title="Monthly PITI" action={<CopyButton value={Math.round(result.main.totalPiti).toString()} />}>
          <p className="text-2xl font-bold text-violet-700">{fmt(result.main.totalPiti)}</p>
          <p className="text-xs text-slate-500 mt-0.5">all-in monthly</p>
        </ToolCard>
        <ToolCard title="Front-end DTI" action={<CopyButton value={result.main.frontDtiActual.toFixed(1)} />}>
          <p className={`text-2xl font-bold ${dtiColor(result.main.frontDtiActual, DTI_PRESETS[dtiPreset].front)}`}>
            {fmtPct(result.main.frontDtiActual)}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">limit {DTI_PRESETS[dtiPreset].front}%</p>
        </ToolCard>
        <ToolCard title="Back-end DTI" action={<CopyButton value={result.main.backDtiActual.toFixed(1)} />}>
          <p className={`text-2xl font-bold ${dtiColor(result.main.backDtiActual, DTI_PRESETS[dtiPreset].back)}`}>
            {fmtPct(result.main.backDtiActual)}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">limit {DTI_PRESETS[dtiPreset].back}%</p>
        </ToolCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ToolCard title="Monthly Payment Breakdown (PITI)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pitiData} layout="vertical" margin={{ left: 16, right: 16 }}>
              <XAxis type="number" tickFormatter={(v) => `${symbol}${v.toLocaleString()}`} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number | undefined) => [`${symbol}${(v ?? 0).toLocaleString()}`, '']} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {pitiData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ToolCard>

        <ToolCard title="Affordability by DTI Scenario">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scenarioData} margin={{ left: 8, right: 8 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${symbol}${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number | undefined) => [`${symbol}${(v ?? 0).toLocaleString()}`, 'Max home price']} />
              <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                <Cell fill="#2563eb" />
                <Cell fill="#7c3aed" />
                <Cell fill="#dc2626" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 text-center text-xs mt-2 text-slate-500 gap-1">
            <div><span className="font-semibold text-blue-700">{fmt(result.conservative.homePrice)}</span><br />Conservative</div>
            <div><span className="font-semibold text-violet-700">{fmt(result.main.homePrice)}</span><br />Standard</div>
            <div><span className="font-semibold text-rose-700">{fmt(result.aggressive.homePrice)}</span><br />FHA Stretch</div>
          </div>
        </ToolCard>
      </div>

      <ToolCard title="Payment Breakdown Detail">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs">
                <th className="text-left py-2 text-slate-500 font-medium">Component</th>
                <th className="text-right py-2 px-2 text-slate-500 font-medium">Monthly</th>
                <th className="text-right py-2 px-2 text-slate-500 font-medium">Annual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr>
                <td className="py-1.5">Principal & Interest</td>
                <td className="py-1.5 px-2 text-right">{fmt(result.main.monthlyPI)}</td>
                <td className="py-1.5 px-2 text-right">{fmt(result.main.monthlyPI * 12)}</td>
              </tr>
              <tr>
                <td className="py-1.5">Property Tax</td>
                <td className="py-1.5 px-2 text-right">{fmt(result.main.monthlyPropTax)}</td>
                <td className="py-1.5 px-2 text-right">{fmt(result.main.monthlyPropTax * 12)}</td>
              </tr>
              <tr>
                <td className="py-1.5">Insurance</td>
                <td className="py-1.5 px-2 text-right">{fmt(result.main.monthlyInsurance)}</td>
                <td className="py-1.5 px-2 text-right">{fmt(result.main.monthlyInsurance * 12)}</td>
              </tr>
              {result.main.monthlyHoa > 0 && (
                <tr>
                  <td className="py-1.5">HOA</td>
                  <td className="py-1.5 px-2 text-right">{fmt(result.main.monthlyHoa)}</td>
                  <td className="py-1.5 px-2 text-right">{fmt(result.main.monthlyHoa * 12)}</td>
                </tr>
              )}
              <tr className="font-semibold text-slate-900">
                <td className="py-1.5">Total PITI</td>
                <td className="py-1.5 px-2 text-right text-blue-700">{fmt(result.main.totalPiti)}</td>
                <td className="py-1.5 px-2 text-right text-blue-700">{fmt(result.main.totalPiti * 12)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ToolCard>
    </div>
  );
}
