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
import { exportToPDF } from '../../utils/pdf';
import { exportSIPToExcel } from '../../utils/excel';

const CHART_COLORS = {
  invested: '#3b82f6',
  gained: '#14b8a6',
  realValue: '#f59e0b',
  flat: '#6366f1',
  grid: '#f1f5f9',
  axis: '#94a3b8',
  delay: '#ef4444',
  interest: '#8b5cf6',
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
      await exportToPDF('sip-planner-content', 'SIP_Wealth_Plan.pdf', {
        title: 'SIP & Wealth Plan',
        quality: 0.92,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(null);
    }
  }, []);

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
                <p className="text-lg font-bold text-emerald-600">{formatCurrency(result.wealthGained, inputs.currency)}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                <p className="text-xs text-slate-500">Purchasing Power</p>
                <p className="text-lg font-bold text-amber-600">{formatCurrency(result.purchasingPower, inputs.currency)}</p>
              </div>
            </div>

            {/* Export + Share bar */}
            <div className="flex flex-wrap gap-2">
              <button onClick={handleExportPDF} disabled={exporting !== null} className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold px-3 py-2 rounded-lg transition disabled:opacity-50">
                {exporting === 'pdf' ? '⏳ Generating…' : '📄 Export PDF'}
              </button>
              <button onClick={handleExportExcel} disabled={exporting !== null} className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 text-xs font-semibold px-3 py-2 rounded-lg transition disabled:opacity-50">
                {exporting === 'excel' ? '⏳ Generating…' : '📊 Export Excel'}
              </button>
              <button onClick={handleCopyURL} className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition">
                {copied ? '✅ Copied!' : '🔗 Copy Plan URL'}
              </button>
              <button onClick={handleShareWhatsApp} className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-2 rounded-lg transition">
                💬 WhatsApp
              </button>
              <button onClick={handleShareTwitter} className="flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-semibold px-3 py-2 rounded-lg transition">
                🐦 Twitter
              </button>
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
                        <span className="text-xs font-bold text-emerald-600">{formatCurrency(result.wealthGained, inputs.currency, true)}</span>
                      </div>
                      <div className="h-8 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 flex items-center justify-end pr-2"
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
                      <span className="text-sm font-bold text-emerald-600">
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

              <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-4 h-[360px]">
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
                    <p className="text-xs text-slate-500">Absolute Returns</p>
                    <p className="text-xl font-semibold text-emerald-600">{result.absoluteReturn}%</p>
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
                    <p className="text-lg font-semibold text-emerald-600">
                      {formatCurrency(lastYear?.yearlyInterestEarned ?? 0, inputs.currency, true)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-4 h-[320px]">
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
              <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-4 h-[320px]">
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
                  Flat SIP corpus: <span className="font-semibold text-slate-900">{formatCurrency(result.flatCorpus, inputs.currency)}</span> · Step-up advantage: <span className="font-semibold text-emerald-600">{formatCurrency(result.estimatedCorpus - result.flatCorpus, inputs.currency)}</span>
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
                          <td className="p-2 text-right text-purple-600">{formatCurrency(row.yearlyInterestEarned, inputs.currency)}</td>
                          <td className="p-2 text-right text-emerald-600">{formatCurrency(row.interestEarned, inputs.currency)}</td>
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

        {/* SEO Content */}
        <section className="mt-8 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">What is a Systematic Investment Plan (SIP)?</h2>
            <div className="prose prose-sm prose-slate max-w-none text-slate-600 space-y-3">
              <p>
                A <strong>Systematic Investment Plan (SIP)</strong> is a disciplined approach to investing in mutual funds where you commit a fixed amount at regular intervals — typically monthly. Instead of timing the market with a lump sum, SIP spreads your investment over time, automatically buying more units when prices are low and fewer units when prices are high. This phenomenon is called <strong>Rupee Cost Averaging</strong> (or Dollar Cost Averaging for USD investors).
              </p>
              <p>
                SIPs are popular among both beginner and experienced investors because they require minimal effort after setup, enforce financial discipline, and remove the psychological burden of deciding when to invest. Most mutual fund houses in India allow SIPs starting from as low as ₹500 per month, making them accessible to virtually everyone.
              </p>
              <p>
                The power of SIP lies in <strong>compounding</strong> — the process where returns earned on your investment generate their own returns over time. The earlier you start, the more time compounding has to work in your favour. Even modest monthly investments, if started early enough, can grow into substantial wealth over 15-30 years.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">How Step-Up SIP Works &amp; Why It Matters</h2>
            <div className="prose prose-sm prose-slate max-w-none text-slate-600 space-y-3">
              <p>
                A <strong>Step-Up SIP</strong> (also called a top-up SIP) automatically increases your monthly investment by a fixed amount or percentage every year. For example, if you start with ₹5,000/month and set a 10% annual step-up, your SIP becomes ₹5,500 in year 2, ₹6,050 in year 3, and so on.
              </p>
              <p>
                Why does this matter so much? Consider two investors who both earn 12% annual returns over 20 years. Investor A invests a flat ₹5,000/month and ends up with roughly ₹50 lakhs. Investor B starts the same but adds a 10% annual step-up, ending up with ₹99+ lakhs — <strong>nearly double</strong> — because each annual increase gets its own compounding runway.
              </p>
              <p>
                Most working professionals receive annual salary hikes of 8-15%. Allocating a portion of each hike to your SIP step-up is a painless way to dramatically accelerate wealth creation without impacting your current lifestyle.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Understanding Inflation-Adjusted Returns</h2>
            <div className="prose prose-sm prose-slate max-w-none text-slate-600 space-y-3">
              <p>
                When planning investments over 10-30 years, <strong>inflation</strong> is the silent wealth eroder that many investors overlook. In India, average inflation runs at 5-7% per year. This means ₹1 crore 20 years from now will only buy what approximately ₹30-37 lakhs buys today.
              </p>
              <p>
                This planner shows both the <strong>nominal corpus</strong> (the headline number) and the <strong>real corpus</strong> (adjusted for inflation, i.e., the purchasing power in today&apos;s money). Always evaluate your investment goals using the real value to ensure you are actually meeting your financial needs, not just hitting a nominal number.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">The Hidden Cost of Delay</h2>
            <div className="prose prose-sm prose-slate max-w-none text-slate-600 space-y-3">
              <p>
                One of the most powerful visualizations in this planner is the <strong>Cost of Delay</strong> chart. It shows the dramatic impact of postponing your SIP start date. Consider a ₹10,000/month SIP at 12% return over 25 years. If you delay starting by just 5 years (investing for 20 years instead of 25), you lose approximately ₹90 lakhs — even though you only missed investing ₹6 lakhs worth of SIP amounts. The remaining ₹84 lakhs is lost compounding.
              </p>
              <p>
                This is why financial advisors consistently emphasize: <strong>the best time to start investing was yesterday, the second best time is today</strong>. Even small amounts, started early, significantly outperform larger amounts started later.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Understanding XIRR vs CAGR</h2>
            <div className="prose prose-sm prose-slate max-w-none text-slate-600 space-y-3">
              <p>
                This planner calculates the <strong>XIRR (Extended Internal Rate of Return)</strong>, which is the true annualized return on your SIP considering the exact timing of every monthly investment. Many calculators incorrectly show a simple CAGR formula that treats your total invested amount as a single lump sum invested at day one. This drastically underestimates your actual return for SIP investments.
              </p>
              <p>
                Our XIRR uses the <strong>Newton-Raphson numerical method</strong> to solve for the monthly internal rate of return, then annualizes it. This is the same approach used by professional portfolio analytics tools and mutual fund factsheets.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm" itemScope itemType="https://schema.org/FAQPage">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: 'What is a good expected rate of return for SIP?', a: 'Historically, diversified Indian equity mutual funds have delivered 12-15% annualized returns over 10+ year periods. For conservative planning, use 10-12%. For debt funds, 6-8%. Always check the specific fund category\'s historical performance.' },
                { q: 'How much should I increase my SIP every year?', a: 'A 10% annual step-up is a practical benchmark for most salaried individuals. It roughly matches the average salary hike in India. Even a modest 5% step-up makes a significant difference over 15-20 years.' },
                { q: 'Can I change my SIP amount mid-way?', a: 'Yes, most mutual fund houses allow you to modify your SIP amount, pause it, or stop it at any time without penalty.' },
                { q: 'Is the inflation rate of 6% accurate?', a: 'India\'s CPI inflation has averaged 5-7% over the past two decades. 6% is a reasonable middle estimate for long-term planning.' },
                { q: 'What does the Purchasing Power number mean?', a: 'Purchasing power shows what your future corpus is worth in today\'s money after accounting for inflation. If inflation is 6% and your corpus is ₹1 crore after 20 years, it will buy only about ₹31 lakhs worth of goods in today\'s prices.' },
                { q: 'How accurate is the XIRR calculation?', a: 'Our XIRR uses the Newton-Raphson numerical method with 300 iterations, achieving precision to 0.01%. This is the industry-standard approach.' },
              ].map(({ q, a }, i) => (
                <div key={i} className="border-b border-slate-100 pb-3 last:border-0" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h3 className="text-sm font-bold text-slate-800 mb-1" itemProp="name">{q}</h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm text-slate-600 leading-relaxed" itemProp="text">{a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </article>
    </div>
  );
};

export default SIPWealthPlanner;
