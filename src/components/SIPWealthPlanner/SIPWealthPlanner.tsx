import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useSIPPlanner } from '../../hooks/useSIPPlanner';
import { formatCurrency, formatYAxisValue } from './SIPWealthPlanner.utils';
import { SIPInputs } from './SIPWealthPlanner.types';
import { generatePDFReport, fmtCurrency as pdfFmtCurrency, fmtPercent, type PDFReportConfig } from '../../utils/pdf';
import { exportSIPToExcel } from '../../utils/excel';

// Unified chart colors (based on home page hero: indigo→blue→cyan gradient)
const CHART_COLORS = {
  primary: '#6366f1',    // indigo-500 - PRIMARY
  secondary: '#3b82f6',  // blue-500 - SECONDARY  
  accent: '#06b6d4',     // cyan-500 - ACCENT
  teal: '#14b8a6',       // teal-500 - growth/success
  amber: '#f59e0b',      // amber-500 - warning/info
  rose: '#f43f5e',       // rose-500 - danger
  grid: '#f1f5f9',       // slate-100
  axis: '#94a3b8',       // slate-400
  // Semantic aliases for SIP
  invested: '#3b82f6',   // blue
  gained: '#14b8a6',     // teal
  realValue: '#f59e0b',  // amber
  flat: '#6366f1',       // indigo
  delay: '#f43f5e',      // rose
  interest: '#06b6d4',   // cyan
};

type SliderFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
};

const SliderField: React.FC<SliderFieldProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
}) => {
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));
  const progress = ((value - min) / (max - min)) * 100;

  useEffect(() => {
    if (!focused) setInputValue(String(value));
  }, [value, focused]);

  const commitInputValue = () => {
    const parsed = Number(inputValue.replace(/,/g, '').trim());
    if (Number.isNaN(parsed)) {
      setInputValue(String(value));
      setFocused(false);
      return;
    }
    onChange(Math.min(Math.max(parsed, min), max));
    setFocused(false);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 px-2.5 py-1">
          {prefix && <span className="text-xs text-slate-400 mr-1">{prefix}</span>}
          <input
            type="text"
            value={inputValue}
            onFocus={(e) => {
              setFocused(true);
              e.currentTarget.select();
            }}
            onBlur={commitInputValue}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
            }}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-24 text-right text-sm font-semibold text-slate-900 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {suffix && <span className="text-xs text-slate-400 ml-1">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="calc-range w-full h-2 rounded-full cursor-pointer"
        style={{ background: `linear-gradient(to right, ${CHART_COLORS.invested} ${progress}%, #e2e8f0 ${progress}%)` }}
      />
    </div>
  );
};

const SIPWealthPlanner: React.FC = () => {
  const router = useRouter();
  const { inputs, result, updateInputs, reset } = useSIPPlanner();
  const [showYearlyTable, setShowYearlyTable] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Only load from URL once on mount
  useEffect(() => {
    if (!router.isReady || !hydrated) return;

    const parseNumber = (value: unknown): number | null => {
      if (typeof value !== 'string') return null;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const query = router.query;
    
    // Only load if URL has parameters
    if (Object.keys(query).length === 0) return;
    
    const nextInputs: Partial<SIPInputs> = {};

    const amt = parseNumber(query.amt);
    const yr = parseNumber(query.yr);
    const ret = parseNumber(query.ret);
    const lump = parseNumber(query.lump);
    const step = parseNumber(query.step);
    const inf = parseNumber(query.inf);
    const goal = parseNumber(query.goal);

    if (amt !== null) nextInputs.monthlyInvestment = Math.max(0, amt);
    if (yr !== null) nextInputs.tenureYears = Math.min(50, Math.max(1, yr));
    if (ret !== null) nextInputs.annualReturn = Math.min(30, Math.max(1, ret));
    if (lump !== null) nextInputs.lumpsumAmount = Math.max(0, lump);
    if (typeof query.stepMode === 'string') nextInputs.stepUpMode = query.stepMode === 'fixed' ? 'fixed' : 'percent';
    if (step !== null) nextInputs.stepUpValue = Math.max(0, step);
    if (typeof query.infOn === 'string') nextInputs.inflationEnabled = query.infOn === '1';
    if (inf !== null) nextInputs.inflationRate = Math.min(12, Math.max(0, inf));
    if (typeof query.mode === 'string') nextInputs.mode = query.mode === 'goal' ? 'goal' : 'wealth';
    if (goal !== null) nextInputs.targetCorpus = Math.max(0, goal);
    if (typeof query.cur === 'string') nextInputs.currency = query.cur === 'USD' ? 'USD' : 'INR';
    if (typeof query.cmp === 'string') nextInputs.compareWithFlat = query.cmp === '1';

    if (Object.keys(nextInputs).length > 0) updateInputs(nextInputs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, hydrated]);

  // Sync inputs to URL (debounced)
  useEffect(() => {
    if (!hydrated || !router.isReady) return;

    const timer = setTimeout(() => {
      const query = {
        amt: String(Math.round(inputs.monthlyInvestment)),
        yr: String(Math.round(inputs.tenureYears)),
        ret: String(inputs.annualReturn),
        lump: String(Math.round(inputs.lumpsumAmount)),
        stepMode: inputs.stepUpMode,
        step: String(inputs.stepUpValue),
        infOn: inputs.inflationEnabled ? '1' : '0',
        inf: String(inputs.inflationRate),
        mode: inputs.mode,
        goal: String(Math.round(inputs.targetCorpus)),
        cur: inputs.currency,
        cmp: inputs.compareWithFlat ? '1' : '0',
      };

      router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
    }, 300);

    return () => clearTimeout(timer);
  }, [inputs, hydrated, router]);

  const chartData = useMemo(
    () => result.yearlyBreakdown.map((row, index) => ({
      year: row.year,
      invested: row.totalInvested,
      gained: Math.max(0, row.totalCorpus - row.totalInvested),
      corpus: row.totalCorpus,
      realCorpus: row.realCorpus,
      flatCorpus: result.flatYearlyBreakdown[index]?.totalCorpus,
    })),
    [result.yearlyBreakdown, result.flatYearlyBreakdown]
  );

  const interestPerYearData = useMemo(
    () => result.yearlyBreakdown.map((row) => ({
      year: row.year,
      interest: row.yearlyInterestEarned,
      investment: row.yearlyInvestment,
    })),
    [result.yearlyBreakdown]
  );

  const contributionVsGrowthData = useMemo(
    () => result.yearlyBreakdown.map((row) => ({
      year: row.year,
      invested: row.totalInvested,
      interest: row.interestEarned,
    })),
    [result.yearlyBreakdown]
  );

  const yearlySipPathData = useMemo(() => {
    let sip = inputs.mode === 'goal' ? result.requiredMonthlyInvestment : inputs.monthlyInvestment;
    return Array.from({ length: Math.ceil(inputs.tenureYears) }, (_, index) => {
      const year = index + 1;
      if (year > 1) {
        if (inputs.stepUpMode === 'percent') sip = sip * (1 + inputs.stepUpValue / 100);
        else sip += inputs.stepUpValue;
      }
      return { year, sip: Math.round(sip) };
    });
  }, [inputs.mode, inputs.monthlyInvestment, inputs.stepUpMode, inputs.stepUpValue, inputs.tenureYears, result.requiredMonthlyInvestment]);

  const yoyGrowthData = useMemo(() => {
    return result.yearlyBreakdown.map((row, idx) => {
      const prevCorpus = idx === 0 ? 0 : result.yearlyBreakdown[idx - 1].totalCorpus;
      const growth = prevCorpus > 0 ? ((row.totalCorpus - prevCorpus) / prevCorpus) * 100 : 0;
      return { year: row.year, growth: Math.round(growth * 10) / 10 };
    });
  }, [result.yearlyBreakdown]);

  const realVsNominalData = useMemo(
    () => result.yearlyBreakdown.map((row) => ({
      year: row.year,
      nominal: row.totalCorpus,
      real: row.realCorpus,
    })),
    [result.yearlyBreakdown]
  );

  const delayCostChartData = useMemo(
    () => result.delayCostData.map((d) => ({
      name: d.delayYears === 0 ? 'No Delay' : `${d.delayYears}yr Delay`,
      corpus: d.corpus,
      loss: d.loss,
    })),
    [result.delayCostData]
  );

  const realReturnAfterInflation = useMemo(() => {
    if (!inputs.inflationEnabled) return inputs.annualReturn;
    return (((1 + inputs.annualReturn / 100) / (1 + inputs.inflationRate / 100)) - 1) * 100;
  }, [inputs.inflationEnabled, inputs.annualReturn, inputs.inflationRate]);

  const milestonesData = useMemo(() => {
    const target = inputs.mode === 'goal' ? inputs.targetCorpus : result.estimatedCorpus;
    const milestones = [0.25, 0.5, 0.75, 1.0];
    return milestones.map((pct) => {
      const milestoneValue = target * pct;
      const yearReached = result.yearlyBreakdown.find(y => y.totalCorpus >= milestoneValue)?.year || inputs.tenureYears;
      return {
        milestone: `${(pct * 100).toFixed(0)}%`,
        value: milestoneValue,
        year: yearReached,
        label: formatCurrency(milestoneValue, inputs.currency, true),
      };
    });
  }, [result, inputs]);

  const estimatedCorpusLabel = formatCurrency(result.estimatedCorpus, inputs.currency);
  const lastYear = result.yearlyBreakdown[result.yearlyBreakdown.length - 1];

  const handleExportPDF = useCallback(async () => {
    setExporting('pdf');
    try {
      const cur = inputs.currency;
      const fmt = (v: number) => pdfFmtCurrency(v, cur);
      const config: PDFReportConfig = {
        title: 'SIP Wealth Planner Report',
        subtitle: `${inputs.mode === 'goal' ? 'Goal-Based' : 'Wealth Projection'} — ${inputs.tenureYears} Year Plan`,
        filename: 'SIP_Wealth_Plan.pdf',
        sections: [
          {
            type: 'inputs',
            title: 'Investment Parameters',
            inputs: [
              { label: 'Monthly Investment', value: fmt(inputs.monthlyInvestment) },
              { label: 'Investment Tenure', value: `${inputs.tenureYears} years` },
              { label: 'Expected Annual Return', value: fmtPercent(inputs.annualReturn) },
              { label: 'Initial Lumpsum', value: fmt(inputs.lumpsumAmount) },
              { label: 'Step-up Mode', value: inputs.stepUpMode === 'percent' ? `${inputs.stepUpValue}% yearly` : `${fmt(inputs.stepUpValue)} yearly` },
              { label: 'Inflation', value: inputs.inflationEnabled ? fmtPercent(inputs.inflationRate) : 'Disabled' },
              ...(inputs.mode === 'goal' ? [{ label: 'Target Corpus', value: fmt(inputs.targetCorpus) }] : []),
            ],
          },
          {
            type: 'metrics',
            title: 'Results Summary',
            metrics: [
              { label: 'Estimated Corpus', value: fmt(result.estimatedCorpus) },
              { label: 'Total Invested', value: fmt(result.totalInvested) },
              { label: 'Wealth Gained', value: fmt(result.wealthGained) },
              { label: 'Purchasing Power', value: fmt(result.purchasingPower), subtitle: 'Inflation adjusted' },
              ...(inputs.mode === 'goal' ? [{ label: 'Required Monthly SIP', value: fmt(result.requiredMonthlyInvestment) }] : []),
              { label: 'XIRR', value: fmtPercent(result.xirr) },
              { label: 'Absolute Return', value: fmtPercent(result.absoluteReturn) },
              { label: 'Final Monthly SIP', value: fmt(result.finalMonthlyInvestment) },
            ],
          },
          {
            type: 'charts',
            title: 'Visual Analysis',
            charts: [
              { title: 'Growth Path', elementId: 'sip-chart-growth' },
              { title: 'Cumulative Invested vs Interest', elementId: 'sip-chart-cumulative' },
              { title: 'Interest Earned Per Year', elementId: 'sip-chart-interest' },
            ],
          },
          {
            type: 'table',
            title: 'Year-wise Projection',
            table: {
              title: 'Investment Schedule',
              columns: [
                { header: 'Year', key: 'year', align: 'left' },
                { header: 'Monthly SIP', key: 'sip', align: 'right' },
                { header: 'Yr Investment', key: 'yrInv', align: 'right' },
                { header: 'Total Invested', key: 'totalInv', align: 'right' },
                { header: 'Total Corpus', key: 'corpus', align: 'right' },
                { header: 'Real Value', key: 'real', align: 'right' },
              ],
              rows: result.yearlyBreakdown.map(row => ({
                year: String(row.year),
                sip: fmt(row.monthlySip),
                yrInv: fmt(row.yearlyInvestment),
                totalInv: fmt(row.totalInvested),
                corpus: fmt(row.totalCorpus),
                real: fmt(row.realCorpus),
              })),
              maxRows: 30,
            },
          },
          ...(result.delayCostData.length > 0 ? [{
            type: 'table' as const,
            title: 'Cost of Delay Analysis',
            table: {
              title: 'What happens if you delay',
              columns: [
                { header: 'Delay (Years)', key: 'delay', align: 'left' as const },
                { header: 'Final Corpus', key: 'corpus', align: 'right' as const },
                { header: 'Opportunity Loss', key: 'loss', align: 'right' as const },
              ],
              rows: result.delayCostData.map(d => ({
                delay: `${d.delayYears} years`,
                corpus: fmt(d.corpus),
                loss: fmt(d.loss),
              })),
            },
          }] : []),
        ],
      };
      await generatePDFReport(config);
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(null);
    }
  }, [inputs, result]);

  const handleExportExcel = useCallback(() => {
    setExporting('excel');
    try {
      exportSIPToExcel(inputs, result, 'SIP_Wealth_Plan.xlsx');
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(null);
    }
  }, [inputs, result]);

  const handleCopyURL = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = window.location.href;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const handleShareWhatsApp = useCallback(() => {
    const text = `Check out my SIP plan: ${formatCurrency(result.totalInvested, inputs.currency)} invested over ${inputs.tenureYears} years = ${formatCurrency(result.estimatedCorpus, inputs.currency)} corpus!\n\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }, [result, inputs]);

  const handleShareTwitter = useCallback(() => {
    const text = `My SIP plan: ${formatCurrency(result.totalInvested, inputs.currency)} invested → ${formatCurrency(result.estimatedCorpus, inputs.currency)} corpus in ${inputs.tenureYears} years! Plan yours:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  }, [result, inputs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-4 px-4" id="sip-planner-content">
      <article className="max-w-7xl mx-auto" itemScope itemType="https://schema.org/WebApplication">
        <header className="text-center mb-6" id="calculator">
          <h1 className="text-3xl font-bold text-slate-900 mb-1" itemProp="name">
            Advanced SIP & Wealth Planner
          </h1>
          <p className="text-sm text-slate-500 max-w-3xl mx-auto" itemProp="description">
            Plan SIP growth with annual step-up and inflation reality checks. Switch between wealth projection and goal-based planning, compare flat vs step-up SIP, and share your plan URL instantly.
          </p>
          <meta itemProp="applicationCategory" content="FinanceApplication" />
          <meta itemProp="operatingSystem" content="Any" />
        </header>

        {/* Export + Share bar */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <button onClick={handleExportPDF} disabled={exporting !== null} className="flex items-center gap-2 bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 text-slate-600 hover:text-indigo-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50">
            {exporting === 'pdf' ? '⏳ Generating…' : '📄 Export PDF'}
          </button>
          <button onClick={handleExportExcel} disabled={exporting !== null} className="flex items-center gap-2 bg-white hover:bg-teal-50 border border-slate-100 hover:border-teal-200 text-slate-600 hover:text-teal-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50">
            {exporting === 'excel' ? '⏳ Generating…' : '📊 Export Excel'}
          </button>
          <button onClick={handleCopyURL} className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 text-slate-600 hover:text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm">
            {copied ? '✅ Copied!' : '🔗 Copy Plan URL'}
          </button>
          <button onClick={handleShareWhatsApp} className="flex items-center gap-2 bg-white hover:bg-teal-50 border border-slate-100 hover:border-teal-200 text-slate-600 hover:text-teal-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm">
            💬 WhatsApp
          </button>
          <button onClick={handleShareTwitter} className="flex items-center gap-2 bg-white hover:bg-sky-50 border border-slate-100 hover:border-sky-200 text-slate-600 hover:text-sky-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm">
            🐦 Twitter
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">
          <section className="bg-white rounded-2xl border border-slate-100 shadow-md p-5">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Control Center</h2>

            <div className="mb-4">
              <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50 w-full">
                <button
                  onClick={() => updateInputs({ mode: 'wealth' })}
                  className={`w-1/2 rounded-lg px-3 py-2 text-sm font-semibold transition ${inputs.mode === 'wealth' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  What will I get?
                </button>
                <button
                  onClick={() => updateInputs({ mode: 'goal' })}
                  className={`w-1/2 rounded-lg px-3 py-2 text-sm font-semibold transition ${inputs.mode === 'goal' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Goal based
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50 w-full">
                <button
                  onClick={() => updateInputs({ currency: 'INR' })}
                  className={`w-1/2 rounded-lg px-3 py-2 text-sm font-semibold transition ${inputs.currency === 'INR' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  ₹ INR (L/Cr)
                </button>
                <button
                  onClick={() => updateInputs({ currency: 'USD' })}
                  className={`w-1/2 rounded-lg px-3 py-2 text-sm font-semibold transition ${inputs.currency === 'USD' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  $ USD
                </button>
              </div>
            </div>

            <SliderField
              label="Monthly Investment"
              value={inputs.monthlyInvestment}
              onChange={(value) => updateInputs({ monthlyInvestment: value })}
              min={500}
              max={2_000_000}
              step={500}
              prefix={inputs.currency === 'INR' ? '₹' : '$'}
            />

            <SliderField
              label="Investment Tenure"
              value={inputs.tenureYears}
              onChange={(value) => updateInputs({ tenureYears: value })}
              min={1}
              max={50}
              step={1}
              suffix="years"
            />

            <SliderField
              label="Expected Annual Return"
              value={inputs.annualReturn}
              onChange={(value) => updateInputs({ annualReturn: value })}
              min={1}
              max={30}
              step={0.1}
              suffix="%"
            />

            <SliderField
              label="Initial Lumpsum"
              value={inputs.lumpsumAmount}
              onChange={(value) => updateInputs({ lumpsumAmount: value })}
              min={0}
              max={20_000_000}
              step={1000}
              prefix={inputs.currency === 'INR' ? '₹' : '$'}
            />

            <div className="mb-4">
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Step-up Mode</label>
              <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50 w-full">
                <button
                  onClick={() => updateInputs({ stepUpMode: 'percent' })}
                  className={`w-1/2 rounded-lg px-3 py-2 text-sm font-semibold transition ${inputs.stepUpMode === 'percent' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  % Every Year
                </button>
                <button
                  onClick={() => updateInputs({ stepUpMode: 'fixed' })}
                  className={`w-1/2 rounded-lg px-3 py-2 text-sm font-semibold transition ${inputs.stepUpMode === 'fixed' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Fixed Amount
                </button>
              </div>
            </div>

            <SliderField
              label={inputs.stepUpMode === 'percent' ? 'Annual Step-up (%)' : 'Annual Step-up (Fixed)'}
              value={inputs.stepUpValue}
              onChange={(value) => updateInputs({ stepUpValue: value })}
              min={0}
              max={inputs.stepUpMode === 'percent' ? 50 : 200_000}
              step={inputs.stepUpMode === 'percent' ? 0.5 : 500}
              suffix={inputs.stepUpMode === 'percent' ? '%' : ''}
              prefix={inputs.stepUpMode === 'fixed' ? (inputs.currency === 'INR' ? '₹' : '$') : undefined}
            />

            <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div>
                <p className="text-sm font-semibold text-slate-700">Inflation Reality Check</p>
                <p className="text-xs text-slate-500">Show purchasing power in today&apos;s money</p>
              </div>
              <button
                onClick={() => updateInputs({ inflationEnabled: !inputs.inflationEnabled })}
                className={`w-12 h-6 rounded-full relative transition ${inputs.inflationEnabled ? 'bg-blue-500' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${inputs.inflationEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {inputs.inflationEnabled && (
              <SliderField
                label="Inflation Rate"
                value={inputs.inflationRate}
                onChange={(value) => updateInputs({ inflationRate: value })}
                min={0}
                max={12}
                step={0.1}
                suffix="%"
              />
            )}

            {inputs.mode === 'goal' && (
              <SliderField
                label="Target Corpus"
                value={inputs.targetCorpus}
                onChange={(value) => updateInputs({ targetCorpus: value })}
                min={100_000}
                max={500_000_000}
                step={50_000}
                prefix={inputs.currency === 'INR' ? '₹' : '$'}
              />
            )}

            <div className="mb-5 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div>
                <p className="text-sm font-semibold text-slate-700">What If Comparison</p>
                <p className="text-xs text-slate-500">Flat SIP vs step-up SIP</p>
              </div>
              <button
                onClick={() => updateInputs({ compareWithFlat: !inputs.compareWithFlat })}
                className={`w-12 h-6 rounded-full relative transition ${inputs.compareWithFlat ? 'bg-indigo-500' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${inputs.compareWithFlat ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <button
              onClick={reset}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2.5 rounded-xl transition"
            >
              Reset Planner
            </button>
          </section>

          <section className="lg:sticky lg:top-20 space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                <p className="text-xs text-slate-500">Estimated Corpus</p>
                <p className="text-lg font-bold text-slate-900">{estimatedCorpusLabel}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                <p className="text-xs text-slate-500">Total Invested</p>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(result.totalInvested, inputs.currency)}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                <p className="text-xs text-slate-500">Wealth Gained</p>
                <p className="text-lg font-bold text-teal-600">{formatCurrency(result.wealthGained, inputs.currency)}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                <p className="text-xs text-slate-500">Purchasing Power (Today&apos;s Value)</p>
                <p className="text-lg font-bold text-amber-600">{formatCurrency(result.purchasingPower, inputs.currency)}</p>
              </div>
            </div>



            {inputs.mode === 'goal' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-slate-700">Goal Planning</p>
                <p className="text-2xl font-bold text-indigo-700 mt-1">
                  Required SIP: {formatCurrency(result.requiredMonthlyInvestment, inputs.currency)} / month
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Target: {formatCurrency(inputs.targetCorpus, inputs.currency)} · Ending SIP after step-ups: {formatCurrency(result.finalMonthlyInvestment, inputs.currency)}
                </p>
              </motion.div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-4" style={{ minHeight: 360 }}>
                <h3 className="text-sm font-bold text-slate-700 mb-3">Invested vs Wealth Gained</h3>
                <div className="space-y-4">
                  {/* Visual Bars */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-700">Total Invested</span>
                        <span className="text-xs font-bold text-blue-600">{formatCurrency(result.totalInvested, inputs.currency, true)}</span>
                      </div>
                      <div className="h-8 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 flex items-center justify-end pr-2"
                          style={{ width: `${(result.totalInvested / result.estimatedCorpus) * 100}%` }}
                        >
                          <span className="text-xs font-semibold text-white">
                            {((result.totalInvested / result.estimatedCorpus) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-700">Wealth Gained</span>
                        <span className="text-xs font-bold text-teal-600">{formatCurrency(result.wealthGained, inputs.currency, true)}</span>
                      </div>
                      <div className="h-8 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500 flex items-center justify-end pr-2"
                          style={{ width: `${(result.wealthGained / result.estimatedCorpus) * 100}%` }}
                        >
                          <span className="text-xs font-semibold text-white">
                            {((result.wealthGained / result.estimatedCorpus) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Summary Stats */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-600">Return Multiple</span>
                      <span className="text-sm font-bold text-slate-900">{(result.estimatedCorpus / result.totalInvested).toFixed(2)}x</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-600">Total Growth</span>
                      <span className="text-sm font-bold text-teal-600">
                        {((result.wealthGained / result.totalInvested) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-600">XIRR</span>
                      <span className="text-sm font-bold text-blue-600">{result.xirr}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-600">Final Corpus</span>
                      <span className="text-sm font-bold text-slate-900">{formatCurrency(result.estimatedCorpus, inputs.currency, true)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div id="sip-chart-growth" className="bg-white rounded-2xl border border-slate-100 shadow-md p-4 h-[360px]">
                <h3 className="text-sm font-bold text-slate-700 mb-2">Growth Path</h3>
                {hydrated ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <YAxis tickFormatter={(value) => formatYAxisValue(value, inputs.currency)} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <Tooltip
                        formatter={(value: number | undefined, name: string | undefined) => [formatCurrency(value ?? 0, inputs.currency), name ?? 'Value']}
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Area type="monotone" dataKey="invested" stackId="a" stroke={CHART_COLORS.invested} fill={CHART_COLORS.invested} fillOpacity={0.6} name="Total Invested" />
                      <Area type="monotone" dataKey="gained" stackId="a" stroke={CHART_COLORS.gained} fill={CHART_COLORS.gained} fillOpacity={0.7} name="Wealth Gained" />
                      <Line type="monotone" dataKey="realCorpus" stroke={CHART_COLORS.realValue} strokeWidth={2.5} dot={false} name="Real Value (Inflation Adjusted)" />
                      {inputs.compareWithFlat && (
                        <Line type="monotone" dataKey="flatCorpus" stroke={CHART_COLORS.flat} strokeWidth={2} dot={false} strokeDasharray="6 4" name="Flat SIP Corpus" />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full rounded-xl bg-slate-50 border border-slate-100" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-4">
                <h3 className="text-sm font-bold text-slate-700 mb-3">📊 Effective Returns</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500">XIRR (Effective Annual)</p>
                    <p className="text-2xl font-bold text-blue-600">{result.xirr}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Input Annual Return</p>
                    <p className="text-xl font-semibold text-slate-700">{inputs.annualReturn}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Real Return (After Inflation)</p>
                    <p className="text-xl font-semibold text-amber-600">{realReturnAfterInflation.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Absolute Returns</p>
                    <p className="text-xl font-semibold text-teal-600">{result.absoluteReturn}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-4">
                <h3 className="text-sm font-bold text-slate-700 mb-3">🎯 Milestone Progress</h3>
                <div className="space-y-2">
                  {milestonesData.map((m) => (
                    <div key={m.milestone} className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-700">{m.milestone}</span>
                        <span className="text-slate-500 ml-2">{m.label}</span>
                      </div>
                      <span className="text-blue-600 font-semibold">Year {m.year}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-4">
                <h3 className="text-sm font-bold text-slate-700 mb-3">📈 Final Year Snapshot</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500">Monthly SIP in Last Year</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {formatCurrency(lastYear?.monthlySip ?? 0, inputs.currency, true)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Last Year Investment</p>
                    <p className="text-lg font-semibold text-slate-700">
                      {formatCurrency(lastYear?.yearlyInvestment ?? 0, inputs.currency, true)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Interest Earned Last Year</p>
                    <p className="text-lg font-semibold text-teal-600">
                      {formatCurrency(lastYear?.yearlyInterestEarned ?? 0, inputs.currency, true)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div id="sip-chart-cumulative" className="bg-white rounded-2xl border border-slate-100 shadow-md p-4 h-[320px]">
                <h3 className="text-sm font-bold text-slate-700 mb-2">Cumulative Invested vs Interest</h3>
                {hydrated ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contributionVsGrowthData}>
                      <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <YAxis tickFormatter={(value) => formatYAxisValue(value, inputs.currency)} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <Tooltip formatter={(value: number | undefined, name: string | undefined) => [formatCurrency(value ?? 0, inputs.currency), name ?? 'Value']} />
                      <Legend />
                      <Bar dataKey="invested" fill={CHART_COLORS.invested} name="Total Invested" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="interest" fill={CHART_COLORS.gained} name="Interest Earned" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full rounded-xl bg-slate-50 border border-slate-100" />
                )}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-4 h-[320px]">
                <h3 className="text-sm font-bold text-slate-700 mb-2">Monthly SIP Step-up Path</h3>
                {hydrated ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={yearlySipPathData}>
                      <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <YAxis tickFormatter={(value) => formatYAxisValue(value, inputs.currency)} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <Tooltip formatter={(value: number | undefined) => formatCurrency(value ?? 0, inputs.currency)} labelFormatter={(label) => `Year ${label}`} />
                      <Area type="monotone" dataKey="sip" stroke={CHART_COLORS.flat} fill={CHART_COLORS.flat} fillOpacity={0.45} name="Monthly SIP" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full rounded-xl bg-slate-50 border border-slate-100" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div id="sip-chart-interest" className="bg-white rounded-2xl border border-slate-100 shadow-md p-4 h-[320px]">
                <h3 className="text-sm font-bold text-slate-700 mb-2">Interest Earned Per Year</h3>
                {hydrated ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={interestPerYearData}>
                      <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <YAxis tickFormatter={(value) => formatYAxisValue(value, inputs.currency)} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <Tooltip formatter={(value: number | undefined, name: string | undefined) => [formatCurrency(value ?? 0, inputs.currency), name ?? 'Value']} labelFormatter={(label) => `Year ${label}`} />
                      <Legend />
                      <Bar dataKey="interest" fill={CHART_COLORS.interest} name="Interest This Year" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="investment" fill={CHART_COLORS.invested} name="Investment This Year" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full rounded-xl bg-slate-50 border border-slate-100" />
                )}
              </div>

              {inputs.inflationEnabled && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-4 h-[320px]">
                  <h3 className="text-sm font-bold text-slate-700 mb-2">Nominal vs Real (Inflation-Adjusted) Corpus</h3>
                  {hydrated ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={realVsNominalData}>
                        <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                        <XAxis dataKey="year" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                        <YAxis tickFormatter={(value) => formatYAxisValue(value, inputs.currency)} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                        <Tooltip formatter={(value: number | undefined, name: string | undefined) => [formatCurrency(value ?? 0, inputs.currency), name ?? 'Value']} labelFormatter={(label) => `Year ${label}`} />
                        <Legend />
                        <Line type="monotone" dataKey="nominal" stroke={CHART_COLORS.invested} strokeWidth={2.5} dot={false} name="Nominal Corpus" />
                        <Line type="monotone" dataKey="real" stroke={CHART_COLORS.realValue} strokeWidth={2.5} dot={false} name="Real Corpus" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full rounded-xl bg-slate-50 border border-slate-100" />
                  )}
                </div>
              )}
            </div>

            {/* Delay Cost Chart */}
            {delayCostChartData.length > 1 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-4 h-[340px]">
                <h3 className="text-sm font-bold text-slate-700 mb-1">Cost of Delay</h3>
                <p className="text-xs text-slate-500 mb-2">What happens if you delay starting your SIP</p>
                {hydrated ? (
                  <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={delayCostChartData}>
                      <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: CHART_COLORS.axis }} />
                      <YAxis tickFormatter={(value) => formatYAxisValue(value, inputs.currency)} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <Tooltip formatter={(value: number | undefined, name: string | undefined) => [formatCurrency(value ?? 0, inputs.currency), name ?? 'Value']} />
                      <Legend />
                      <Bar dataKey="corpus" fill={CHART_COLORS.gained} name="Final Corpus" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="loss" fill={CHART_COLORS.delay} name="Opportunity Loss" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full rounded-xl bg-slate-50 border border-slate-100" />
                )}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-4 h-[320px]">
              <h3 className="text-sm font-bold text-slate-700 mb-2">Year-on-Year Growth Rate</h3>
              {hydrated ? (
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={yoyGrowthData}>
                    <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                    <YAxis tick={{ fontSize: 11, fill: CHART_COLORS.axis }} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: number | undefined) => `${value}%`} labelFormatter={(label) => `Year ${label}`} />
                    <Bar dataKey="growth" fill={CHART_COLORS.gained} name="YoY Growth %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full rounded-xl bg-slate-50 border border-slate-100" />
              )}
            </div>

            {inputs.compareWithFlat && (
              <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-2">Step-up vs Flat SIP</h3>
                <p className="text-sm text-slate-600">
                  Flat SIP corpus: <span className="font-semibold text-slate-900">{formatCurrency(result.flatCorpus, inputs.currency)}</span> · Step-up advantage: <span className="font-semibold text-teal-600">{formatCurrency(result.estimatedCorpus - result.flatCorpus, inputs.currency)}</span>
                </p>
              </div>
            )}

            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
              <button
                onClick={() => setShowYearlyTable((prev) => !prev)}
                className="w-full flex items-center justify-between text-sm font-semibold text-slate-700"
              >
                Year-wise Breakdown
                <span>{showYearlyTable ? 'Hide' : 'Show'}</span>
              </button>

              {showYearlyTable && (
                <div className="mt-3 max-h-72 overflow-auto scrollbar-thin border border-slate-100 rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-slate-50">
                      <tr>
                        <th className="text-left p-2 font-semibold text-slate-600">Year</th>
                        <th className="text-right p-2 font-semibold text-slate-600">Monthly SIP</th>
                        <th className="text-right p-2 font-semibold text-slate-600">Yr Investment</th>
                        <th className="text-right p-2 font-semibold text-slate-600">Total Invested</th>
                        <th className="text-right p-2 font-semibold text-slate-600">Yr Interest</th>
                        <th className="text-right p-2 font-semibold text-slate-600">Total Interest</th>
                        <th className="text-right p-2 font-semibold text-slate-600">Corpus</th>
                        <th className="text-right p-2 font-semibold text-slate-600">Real Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearlyBreakdown.map((row) => (
                        <tr key={row.year} className="border-t border-slate-100">
                          <td className="p-2 text-slate-700">{row.year}</td>
                          <td className="p-2 text-right text-slate-700">{formatCurrency(row.monthlySip, inputs.currency)}</td>
                          <td className="p-2 text-right text-slate-700">{formatCurrency(row.yearlyInvestment, inputs.currency)}</td>
                          <td className="p-2 text-right text-slate-700">{formatCurrency(row.totalInvested, inputs.currency)}</td>
                          <td className="p-2 text-right text-cyan-600">{formatCurrency(row.yearlyInterestEarned, inputs.currency)}</td>
                          <td className="p-2 text-right text-teal-600">{formatCurrency(row.interestEarned, inputs.currency)}</td>
                          <td className="p-2 text-right font-semibold text-slate-900">{formatCurrency(row.totalCorpus, inputs.currency)}</td>
                          <td className="p-2 text-right text-amber-600">{formatCurrency(row.realCorpus, inputs.currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-2">What this plan means</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                You invest <span className="font-semibold text-slate-900">{formatCurrency(result.totalInvested, inputs.currency)}</span> over {Math.round(inputs.tenureYears)} years and project a corpus near <span className="font-semibold text-slate-900">{formatCurrency(result.estimatedCorpus, inputs.currency)}</span>. After inflation, the same amount is worth about <span className="font-semibold text-amber-700">{formatCurrency(result.purchasingPower, inputs.currency)}</span> in today&apos;s terms.
                {result.delayCostData.length > 1 && (
                  <> Delaying by just 1 year would cost you <span className="font-semibold text-red-600">{formatCurrency(result.delayCostData[1]?.loss ?? 0, inputs.currency)}</span> in missed growth.</>
                )}
              </p>
            </div>
          </section>
        </div>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">Step-up compounds hard</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              A yearly SIP increase can create an outsized effect because each additional contribution gets its own compounding runway.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="text-2xl mb-2">🧾</div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">Reality is real value</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Purchasing power often grows slower than nominal corpus. Keep inflation enabled to evaluate whether your goal still works in today&apos;s terms.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="text-2xl mb-2">🔁</div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">Every year counts</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              The cost-of-delay chart shows how even a 1-year postponement can cost lakhs in missed compounding. Start as early as possible.
            </p>
          </div>
        </section>

        <section className="mt-6 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-3">How to use this planner</h3>
          <ol className="space-y-2 text-sm text-slate-600 list-decimal pl-5">
            <li>Set monthly SIP, tenure, return, and optional lumpsum.</li>
            <li>Choose step-up mode (percent or fixed increase) to match salary growth.</li>
            <li>Keep inflation enabled to evaluate purchasing power, not just nominal corpus.</li>
            <li>Switch to goal mode to get the monthly SIP needed for your target corpus.</li>
            <li>Use flat-vs-step-up comparison and yearly breakdown before finalizing your plan.</li>
            <li>Export your plan as PDF or Excel, or share the URL with an advisor or family.</li>
          </ol>
        </section>

        <section className="mt-6 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-3">Learn More</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link href="/finance/learn/step-up-sip-vs-flat-sip" className="rounded-xl border border-slate-200 p-4 hover:border-blue-300 transition">
              <p className="text-sm font-semibold text-slate-800">Step-up SIP vs Flat SIP</p>
              <p className="text-xs text-slate-500 mt-1">See when annual SIP increases make the biggest difference.</p>
            </Link>
            <Link href="/finance/learn/inflation-proof-investing-guide" className="rounded-xl border border-slate-200 p-4 hover:border-blue-300 transition">
              <p className="text-sm font-semibold text-slate-800">Inflation-Proof Investing Guide</p>
              <p className="text-xs text-slate-500 mt-1">Understand nominal vs real returns while planning long-term goals.</p>
            </Link>
          </div>
        </section>

        {/* --- Educational Content & SEO Section --- */}
        <section className="mt-16 space-y-16">
          {/* Introduction to SIP */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60" />
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">The Power of Systematic Investing (SIP)</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">
                A <span className="text-teal-600 font-bold">Systematic Investment Plan (SIP)</span> is more than just a monthly investment; it's a disciplined approach to wealth creation that leverages the power of compounding and <span className="italic uppercase text-xs font-bold tracking-widest text-slate-400">Rupee Cost Averaging</span>.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                By investing a fixed amount regularly, you buy more units when prices are low and fewer units when prices are high. Over time, this lowers your average cost per unit and significantly boosts returns compared to trying to "time the market." SIPs are accessible, starting from as low as ₹500, making them the ultimate wealth-building tool for everyone.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="text-xl">📈</span> Compounding Effect
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">Earnings on your earnings. The longer you stay invested, the more your wealth grows exponentially over time.</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="text-xl">🛡️</span> Discipline vs Timing
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">Automating your savings removes emotional bias and ensures you invest consistently through all market cycles.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step-up SIP Strategy */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">The "Step-up" Advantage</h2>
              <p className="text-slate-500 font-medium">Why a simple 10% annual increase in your SIP can double your final wealth accumulation.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-teal-900 rounded-[40px] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -ml-32 -mt-32" />
              <div className="space-y-6 relative z-10">
                <h3 className="text-2xl font-bold">What is a Step-up SIP?</h3>
                <p className="text-teal-100 leading-relaxed">
                  Most people's income increases over time. A Step-up (or Top-up) SIP allows you to automatically increase your investment amount by a fixed percentage or amount every year.
                </p>
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20 backdrop-blur-md">
                  <p className="text-sm font-bold text-teal-300 mb-4 uppercase tracking-wider">The Math of Growth</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-white/10 pb-2">
                      <span className="text-xs text-teal-200">Regular SIP (₹10k/mo, 20y)</span>
                      <span className="font-bold">₹1.0 Cr*</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-white/10 pb-2">
                      <span className="text-xs text-teal-200">10% Step-up SIP (20y)</span>
                      <span className="font-bold text-teal-400">₹2.1 Cr*</span>
                    </div>
                    <p className="text-[10px] text-teal-400 mt-2 font-medium leading-relaxed italic">
                      *Assumed 12% annual return. Results show how a small 10% annual increase leads to over 100% higher wealth.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-xl font-bold">Why call it the "Salary Hike" hack?</h4>
                <ul className="space-y-4">
                  {[
                    "Matches your annual income growth (increments).",
                    "Significantly counters the impact of inflation.",
                    "Builds massive wealth without feeling the pinch today.",
                    "Reaches your retirement goals 5-7 years earlier."
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-teal-50 font-medium leading-relaxed">
                      <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">✓</div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Inflation & Real Returns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Inflation: The Silent Wealth Destroyer</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                In India, average inflation runs at 5-7% per year. This means <span className="text-red-600 font-bold">₹1 Crore</span> in 20 years will only buy what <span className="text-slate-900 font-bold">₹31 Lakhs</span> buys today.
              </p>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <p className="text-sm text-slate-500 leading-relaxed">
                  Our planner calculates your <strong>Real Corpus</strong> (inflation-adjusted value). Always plan your goals using "Purchasing Power" rather than just the total amount to ensure your future needs are truly met.
                </p>
              </div>
              <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl">
                <h4 className="font-bold mb-4 text-teal-400">SIP Formula (Future Value)</h4>
                <div className="font-mono text-xs overflow-x-auto space-y-4">
                  <code className="text-white font-bold block">FV = P × [((1 + i)^n - 1) / i] × (1 + i)</code>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                    <div>P: Monthly Amount</div>
                    <div>i: Monthly Rate (r/12/100)</div>
                    <div>n: Total Months</div>
                    <div>FV: Final Value</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost of Delay */}
            <div className="bg-white rounded-[40px] p-8 sm:p-10 border border-slate-100 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity" />
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">The High Price of Delay</h3>
              <p className="text-slate-500 leading-relaxed mb-8">
                Wait just 5 years to start your SIP? For a ₹10,000 SIP at 12%, that 5-year delay could cost you nearly <span className="text-orange-600 font-bold">₹90 Lakhs</span> in lost compounding returns.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-2xl border border-teal-100">
                  <span className="text-2xl">⏳</span>
                  <div>
                    <h5 className="font-bold text-teal-900 text-sm">Start Today (Age 25)</h5>
                    <p className="text-xs text-teal-700">Maximized compounding runway.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100 opacity-80">
                  <span className="text-2xl">🚨</span>
                  <div>
                    <h5 className="font-bold text-orange-900 text-sm">Start Later (Age 30)</h5>
                    <p className="text-xs text-orange-700">Lost the most valuable growth years.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6 pb-12" itemScope itemType="https://schema.org/FAQPage">
            <h2 className="text-3xl font-black text-slate-900 text-center mb-10 tracking-tight">SIP & Mutual Fund FAQs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  q: "What is a good expected rate of return for SIP?",
                  a: "Historically, diversified Indian equity mutual funds have delivered 12-15% annualized returns over 10+ year periods. For conservative planning, use 10-12%."
                },
                {
                  q: "What is XIRR vs CAGR?",
                  a: "XIRR stands for Extended Internal Rate of Return. It is the true annualized return for periodic investments where cash flows happen at different times. CAGR is only for point-to-point lump sums."
                },
                {
                  q: "Can I pause or stop my SIP any time?",
                  a: "Yes, SIPs are flexible. You can pause, stop, or modify your investment amount without any penalty. All your previous investments continue to grow."
                },
                {
                  q: "Is it better to invest in SIP or Lumpsum?",
                  a: "SIP is generally safer for most investors as it averages out the cost of buying (Rupee Cost Averaging) and prevents the risk of 'timing the market' poorly."
                }
              ].map((faq, i) => (
                <div key={i} className="group" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h4 className="font-bold text-slate-800 mb-3 text-lg leading-snug group-hover:text-teal-600 transition-colors flex gap-2" itemProp="name">
                    <span className="text-teal-200">Q.</span> {faq.q}
                  </h4>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm text-slate-500 leading-relaxed font-medium pl-6 border-l-2 border-slate-100 group-hover:border-teal-100 transition-colors" itemProp="text">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-10">
            <h2 className="text-3xl font-black text-slate-900 mb-5 tracking-tight">How to Build a Sustainable SIP Strategy</h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
              <p>
                SIP success is less about finding the perfect fund and more about consistency through market cycles.
                Most investors overestimate short-term returns and underestimate the effect of disciplined investing over 10–20 years.
                A reliable SIP framework should include contribution discipline, periodic step-up, diversification, and goal-based timelines.
              </p>
              <p>
                Start with target-based planning instead of return-chasing. Define each goal with amount, timeline, and required monthly contribution.
                Then allocate funds by horizon: equity-heavy for long goals, hybrid or debt-oriented for medium goals,
                and low-volatility options for short goals. Matching volatility to timeline reduces panic decisions in downturns.
              </p>
              <p>
                Step-up SIP is one of the strongest wealth multipliers for salaried investors.
                Even a 5–10% annual increase can create a large gap in final corpus versus flat SIP, especially beyond year 12.
                If salary increments are variable, link your step-up to a fixed rule such as one month of incremented salary distributed across your SIPs.
              </p>
              <p>
                Rebalancing is equally important. When one asset class outperforms heavily, portfolio risk drifts up.
                Annual rebalancing back to target allocation helps lock gains and maintain a risk profile that matches your objective.
                Combine this with an emergency fund so you never need to stop SIPs due to temporary cash flow stress.
              </p>
              <p>
                Finally, judge progress on rolling 5-year windows rather than month-to-month NAV changes.
                Long-term investing rewards process, not prediction. If your plan is aligned with goals, inflation, and contribution capacity,
                staying invested usually matters more than trying to time entries and exits.
              </p>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
};

export default SIPWealthPlanner;
