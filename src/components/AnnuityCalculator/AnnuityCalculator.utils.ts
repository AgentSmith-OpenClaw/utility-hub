import type { AnnuityInputs, AnnuityResult, ImmediateResult, DeferredResult, FixedPeriodResult } from './AnnuityCalculator.types';

export function fmtUSD(v: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
}

function freqPerYear(f: string): number {
  return f === 'monthly' ? 12 : f === 'quarterly' ? 4 : 1;
}

// Simple periodic rate convention (nominal/simple): annualPct / 100 / periodsPerYear
function r(annualPct: number, freq: number): number {
  return annualPct / 100 / freq;
}

function calcImmediate(inp: AnnuityInputs['immediate']): ImmediateResult {
  const freq = freqPerYear(inp.frequency);
  const rate = r(inp.annualRate, freq);
  const n = inp.years * freq;
  const PV = inp.principal;
  const g = inp.cola / 100 / freq;

  let periodicPayment: number;
  if (inp.cola > 0 && Math.abs(rate - g) > 1e-10) {
    periodicPayment = PV * (rate - g) / (1 - Math.pow((1 + g) / (1 + rate), n));
  } else if (inp.cola > 0 && Math.abs(rate - g) <= 1e-10) {
    periodicPayment = rate === 0 ? PV / n : PV * rate / n;
  } else {
    periodicPayment = rate === 0 ? PV / n : PV * rate / (1 - Math.pow(1 + rate, -n));
  }

  const balanceData: ImmediateResult['balanceData'] = [];
  let bal = PV;
  for (let i = 1; i <= n; i++) {
    const pmt = inp.cola > 0 ? periodicPayment * Math.pow(1 + g, i - 1) : periodicPayment;
    const interest = bal * rate;
    bal = bal + interest - pmt;
    if (i % freq === 0 || i === n) balanceData.push({ period: i, balance: Math.max(0, Math.round(bal)) });
  }

  const totalPayout = inp.cola > 0
    ? periodicPayment * n + periodicPayment * (Math.pow(1 + g, n) - 1) / g * (freq > 1 ? 0 : 0) // simplified: sum of growing annuity
    : periodicPayment * n;
  const firstPayment = periodicPayment;
  const lastPayment = inp.cola > 0 ? periodicPayment * Math.pow(1 + inp.cola / 100, inp.years) : periodicPayment;

  return {
    periodicPayment, totalPayout: periodicPayment * n,
    totalInterest: periodicPayment * n - PV,
    firstPayment, lastPayment: inp.cola > 0 ? lastPayment : undefined, balanceData,
  };
}

function calcDeferred(inp: AnnuityInputs['deferred']): DeferredResult {
  const freq = freqPerYear(inp.contribFrequency);
  const rate = r(inp.expectedReturn, freq);
  const n = inp.yearsAccumulation * freq;
  const PV = inp.startingBalance;
  const PMT = inp.periodicContribution;

  const fvLump = PV * Math.pow(1 + rate, n);
  const fvPmt = rate === 0 ? PMT * n : PMT * (Math.pow(1 + rate, n) - 1) / rate;
  const projectedBalance = fvLump + fvPmt;
  const totalContributions = PV + PMT * n;
  const totalGrowth = projectedBalance - totalContributions;

  const growthData: DeferredResult['growthData'] = [];
  let cumContrib = PV;
  let runBal = PV;
  for (let y = 1; y <= inp.yearsAccumulation; y++) {
    for (let p = 0; p < freq; p++) {
      runBal = (runBal + PMT) * (1 + rate);
      cumContrib += PMT;
    }
    growthData.push({ year: y, contributions: Math.round(cumContrib), growth: Math.round(runBal - cumContrib), total: Math.round(runBal) });
  }

  let monthlyIncome: number | undefined;
  if (inp.showIncome) {
    const r2 = inp.expectedReturn / 100 / 12;
    const n2 = inp.incomeYears * 12;
    monthlyIncome = r2 === 0 ? projectedBalance / n2 : projectedBalance * r2 / (1 - Math.pow(1 + r2, -n2));
  }

  return { projectedBalance, totalContributions, totalGrowth, monthlyIncome, growthData };
}

function calcFixedPeriod(inp: AnnuityInputs['fixedPeriod']): FixedPeriodResult {
  const freq = freqPerYear(inp.frequency);
  const rate = r(inp.annualRate, freq);
  const n = inp.years * freq;
  const due = inp.timing === 'due' ? (1 + rate) : 1;
  const PV = inp.presentValue;
  const FV = inp.futureValue;
  const PMT = inp.payment;

  let solved: number;
  let solvedLabel: string;

  if (inp.solveFor === 'payment') {
    const rn = Math.pow(1 + rate, n);
    solved = rate === 0 ? (FV - PV) / n : (PV * rate * rn + FV * rate) / ((rn - 1) * due);
    solvedLabel = 'Periodic Payment';
  } else if (inp.solveFor === 'futureValue') {
    const rn = Math.pow(1 + rate, n);
    solved = rate === 0 ? PV + PMT * n : PV * rn + PMT * ((rn - 1) / rate) * due;
    solvedLabel = 'Future Value';
  } else {
    const rn = Math.pow(1 + rate, n);
    solved = rate === 0 ? FV - PMT * n : (FV - PMT * ((rn - 1) / rate) * due) / rn;
    solvedLabel = 'Present Value';
  }

  return { solved: Math.max(0, solved), solvedLabel };
}

export function calculateAnnuity(inputs: AnnuityInputs): AnnuityResult {
  if (inputs.mode === 'immediate') return { immediate: calcImmediate(inputs.immediate) };
  if (inputs.mode === 'deferred') return { deferred: calcDeferred(inputs.deferred) };
  return { fixedPeriod: calcFixedPeriod(inputs.fixedPeriod) };
}
