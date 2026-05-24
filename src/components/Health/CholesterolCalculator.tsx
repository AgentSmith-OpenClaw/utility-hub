'use client';
import React, { useState, useMemo } from 'react';

interface RatioResult {
  value: number;
  status: 'good' | 'borderline' | 'high';
  statusColor: string;
  bgColor: string;
  borderColor: string;
  labelBg: string;
  labelText: string;
  description: string;
  target: string;
}

interface CholesterolResult {
  tcHdlRatio: RatioResult;
  ldlHdlRatio: RatioResult;
  tgHdlRatio: RatioResult;
  nonHdlCholesterol: number;
  overallRisk: 'low' | 'moderate' | 'high';
  overallRiskColor: string;
  overallRiskBg: string;
  overallRiskBorder: string;
  overallRiskLabelBg: string;
}

function classifyRatio(
  value: number,
  goodThreshold: number,
  idealThreshold: number,
  highThreshold: number,
  name: string,
  description: string,
  targetGood: string,
  targetIdeal: string
): RatioResult {
  let status: 'good' | 'borderline' | 'high';
  let statusColor: string;
  let bgColor: string;
  let borderColor: string;
  let labelBg: string;
  let labelText: string;
  let target: string;

  if (value < goodThreshold) {
    status = 'good';
    statusColor = 'text-emerald-700';
    bgColor = 'bg-emerald-50';
    borderColor = 'border-emerald-200';
    labelBg = 'bg-emerald-100 text-emerald-700';
    labelText = 'Good';
    target = `Target: <${goodThreshold} (ideally <${idealThreshold})`;
  } else if (value < highThreshold) {
    status = 'borderline';
    statusColor = 'text-amber-700';
    bgColor = 'bg-amber-50';
    borderColor = 'border-amber-200';
    labelBg = 'bg-amber-100 text-amber-700';
    labelText = 'Borderline';
    target = `Target: <${goodThreshold} (ideally <${idealThreshold})`;
  } else {
    status = 'high';
    statusColor = 'text-red-700';
    bgColor = 'bg-red-50';
    borderColor = 'border-red-200';
    labelBg = 'bg-red-100 text-red-700';
    labelText = 'High';
    target = `Target: <${goodThreshold} (ideally <${idealThreshold})`;
  }

  return { value, status, statusColor, bgColor, borderColor, labelBg, labelText, description, target };
}

function calculateCholesterol(
  totalChol: number,
  hdl: number,
  ldl: number,
  trig: number
): CholesterolResult {
  const tcHdlRatio = classifyRatio(
    totalChol / hdl,
    5,
    3.5,
    6,
    'Total Cholesterol / HDL Ratio',
    'This ratio is one of the strongest predictors of heart disease. Lower is better. It reflects how much cholesterol is circulating relative to your protective HDL.',
    '< 5',
    '< 3.5'
  );

  const ldlHdlRatio = classifyRatio(
    ldl / hdl,
    3.5,
    2.5,
    5,
    'LDL / HDL Ratio',
    'LDL is "bad" cholesterol that builds up in artery walls. HDL is "good" cholesterol that clears it away. This ratio shows the balance between arterial clogging and cleaning.',
    '< 3.5',
    '< 2.5'
  );

  const tgHdlRatio = classifyRatio(
    trig / hdl,
    4,
    2,
    6,
    'Triglycerides / HDL Ratio',
    'High triglycerides combined with low HDL signals insulin resistance and metabolic syndrome. This ratio is emerging as a powerful marker of cardiovascular risk.',
    '< 4',
    '< 2'
  );

  const nonHdlCholesterol = totalChol - hdl;

  const riskCounts = [tcHdlRatio.status, ldlHdlRatio.status, tgHdlRatio.status];
  const highCount = riskCounts.filter((s) => s === 'high').length;
  const borderlineCount = riskCounts.filter((s) => s === 'borderline').length;

  let overallRisk: 'low' | 'moderate' | 'high';
  let overallRiskColor: string;
  let overallRiskBg: string;
  let overallRiskBorder: string;
  let overallRiskLabelBg: string;

  if (highCount >= 2) {
    overallRisk = 'high';
    overallRiskColor = 'text-red-700';
    overallRiskBg = 'bg-red-50';
    overallRiskBorder = 'border-red-300';
    overallRiskLabelBg = 'bg-red-100 text-red-700';
  } else if (highCount === 1 || borderlineCount >= 2) {
    overallRisk = 'moderate';
    overallRiskColor = 'text-amber-700';
    overallRiskBg = 'bg-amber-50';
    overallRiskBorder = 'border-amber-300';
    overallRiskLabelBg = 'bg-amber-100 text-amber-700';
  } else {
    overallRisk = 'low';
    overallRiskColor = 'text-emerald-700';
    overallRiskBg = 'bg-emerald-50';
    overallRiskBorder = 'border-emerald-300';
    overallRiskLabelBg = 'bg-emerald-100 text-emerald-700';
  }

  return {
    tcHdlRatio,
    ldlHdlRatio,
    tgHdlRatio,
    nonHdlCholesterol,
    overallRisk,
    overallRiskColor,
    overallRiskBg,
    overallRiskBorder,
    overallRiskLabelBg,
  };
}

function getRiskBadgeClass(status: 'good' | 'borderline' | 'high') {
  if (status === 'good') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (status === 'borderline') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-red-100 text-red-700 border-red-200';
}

export default function CholesterolCalculator() {
  const [totalChol, setTotalChol] = useState('');
  const [hdl, setHdl] = useState('');
  const [ldl, setLdl] = useState('');
  const [trig, setTrig] = useState('');
  const [unit, setUnit] = useState<'mgdL' | 'mmolL'>('mgdL');

  const result = useMemo<CholesterolResult | null>(() => {
    const tc = parseFloat(totalChol);
    const h = parseFloat(hdl);
    const l = parseFloat(ldl);
    const t = parseFloat(trig);

    if (isNaN(tc) || isNaN(h) || isNaN(l) || isNaN(t)) return null;
    if (h <= 0 || l <= 0 || tc <= 0 || t <= 0) return null;

    return calculateCholesterol(tc, h, l, t);
  }, [totalChol, hdl, ldl, trig]);

  const displayResult = useMemo(() => {
    if (!result) return null;
    return {
      ...result,
      nonHdlDisplay: result.nonHdlCholesterol.toFixed(0),
    };
  }, [result]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-700">Lipid Panel Values</p>
          <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setUnit('mgdL')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                unit === 'mgdL'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              mg/dL
            </button>
            <button
              onClick={() => setUnit('mmolL')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                unit === 'mmolL'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              mmol/L
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Total Cholesterol
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={totalChol}
                onChange={(e) => setTotalChol(e.target.value)}
                placeholder="e.g. 200"
                min={1}
                className="w-28 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-sm text-slate-500">{unit === 'mgdL' ? 'mg/dL' : 'mmol/L'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {unit === 'mgdL' ? 'Desirable: <200 mg/dL' : 'Desirable: <5.2 mmol/L'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              HDL Cholesterol
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={hdl}
                onChange={(e) => setHdl(e.target.value)}
                placeholder="e.g. 60"
                min={1}
                className="w-28 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-sm text-slate-500">{unit === 'mgdL' ? 'mg/dL' : 'mmol/L'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {unit === 'mgdL' ? 'Good: >40 (men), >50 (women)' : 'Good: >1.0 (men), >1.3 (women)'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              LDL Cholesterol
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={ldl}
                onChange={(e) => setLdl(e.target.value)}
                placeholder="e.g. 100"
                min={1}
                className="w-28 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-sm text-slate-500">{unit === 'mgdL' ? 'mg/dL' : 'mmol/L'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {unit === 'mgdL' ? 'Optimal: <100 mg/dL' : 'Optimal: <2.6 mmol/L'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Triglycerides
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={trig}
                onChange={(e) => setTrig(e.target.value)}
                placeholder="e.g. 150"
                min={1}
                className="w-28 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-sm text-slate-500">{unit === 'mgdL' ? 'mg/dL' : 'mmol/L'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {unit === 'mgdL' ? 'Normal: <150 mg/dL' : 'Normal: <1.7 mmol/L'}
            </p>
          </div>
        </div>
      </div>

      {displayResult && (
        <>
          <div className={`rounded-xl border-2 ${displayResult.overallRiskBg} ${displayResult.overallRiskBorder} p-6`}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Overall Cardiovascular Risk</p>
                <p className={`text-3xl font-extrabold tracking-tight ${displayResult.overallRiskColor}`}>
                  {displayResult.overallRisk === 'low' ? 'Low' : displayResult.overallRisk === 'moderate' ? 'Moderate' : 'High'}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-bold ${displayResult.overallRiskLabelBg}`}>
                {displayResult.overallRisk === 'low' ? 'Low Risk' : displayResult.overallRisk === 'moderate' ? 'Moderate Risk' : 'High Risk'}
              </div>
            </div>

            <div className="bg-white/70 rounded-lg border border-slate-200 px-4 py-3 mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Non-HDL Cholesterol</p>
              <p className="text-2xl font-bold text-slate-800">
                {displayResult.nonHdlDisplay}
                <span className="text-sm font-normal text-slate-500 ml-1">{unit === 'mgdL' ? 'mg/dL' : 'mmol/L'}</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Total Cholesterol − HDL</p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {displayResult.overallRisk === 'low'
                ? 'Your cholesterol ratios are in a favorable range. Continue maintaining a heart-healthy lifestyle with a balanced diet and regular exercise.'
                : displayResult.overallRisk === 'moderate'
                ? 'Some of your cholesterol ratios are borderline. Consider dietary improvements, increased physical activity, and discuss with your healthcare provider whether further testing is needed.'
                : 'Your cholesterol profile indicates elevated cardiovascular risk. Please consult with your healthcare provider about treatment options, which may include lifestyle changes and/or medication.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[displayResult.tcHdlRatio, displayResult.ldlHdlRatio, displayResult.tgHdlRatio].map((ratio) => (
              <div
                key={ratio.description}
                className={`rounded-xl border ${ratio.bgColor} ${ratio.borderColor} p-5`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Ratio</p>
                    <p className={`text-3xl font-extrabold tracking-tight ${ratio.statusColor}`}>
                      {ratio.value.toFixed(2)}
                    </p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getRiskBadgeClass(ratio.status)}`}>
                    {ratio.labelText}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mb-2">
                  <svg className="w-4 h-4 text-violet-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-xs text-slate-600 leading-relaxed">{ratio.description}</p>
                </div>

                <p className="text-xs text-slate-500 mt-1">
                  <span className="font-medium text-violet-600">Target:</span> {ratio.target}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-violet-700 mb-3">Understanding Cholesterol Ratios</h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-violet-600 shrink-0">TC/HDL:</span>
                <span>Divide your total cholesterol by HDL. Aim below 5, ideally below 3.5. Below 3.5 is associated with significantly lower heart disease risk.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-violet-600 shrink-0">LDL/HDL:</span>
                <span>Divide LDL ("bad") cholesterol by HDL ("good") cholesterol. Below 3.5 is desirable, below 2.5 is optimal. This ratio directly reflects the arterial clogging vs clearing balance.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-violet-600 shrink-0">TG/HDL:</span>
                <span>Divide triglycerides by HDL. Below 2 is ideal, below 4 is acceptable. Elevated ratios signal insulin resistance and increased cardiovascular risk.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-violet-600 shrink-0">Non-HDL:</span>
                <span>Total cholesterol minus HDL gives all the "bad" cholesterol combined (LDL, VLDL, IDL). This is considered a better predictor of cardiovascular risk than LDL alone by ATP III guidelines.</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-700 mb-2">ATP III Risk Classification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {[
                { label: 'Desirable', color: 'bg-emerald-50 border-emerald-200 text-emerald-700', items: ['TC <200', 'HDL >40/50', 'LDL <100', 'TG <150'] },
                { label: 'Borderline', color: 'bg-amber-50 border-amber-200 text-amber-700', items: ['TC 200–239', 'LDL 130–159', 'TG 150–199'] },
                { label: 'High', color: 'bg-red-50 border-red-200 text-red-700', items: ['TC ≥240', 'LDL ≥160', 'TG ≥200'] },
              ].map(({ label, color, items }) => (
                <div key={label} className={`rounded-lg border p-3 ${color}`}>
                  <p className="font-semibold mb-1.5">{label}</p>
                  {items.map((item) => (
                    <p key={item} className="opacity-80">{item}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool uses ATP III (Adult Treatment Panel III) guidelines for cholesterol classification. It is for informational purposes only and is not a diagnosis. Consult a qualified healthcare provider for personalized medical advice and interpretation of your lipid panel.
      </p>
    </div>
  );
}