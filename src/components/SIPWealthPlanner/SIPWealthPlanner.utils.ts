import { Currency, DelayCostEntry, SIPInputs, SIPResult, SIPYearProjection, StepUpMode } from './SIPWealthPlanner.types';

const MAX_BINARY_SEARCH_SIP = 50_000_000;

function applyStepUp(currentSip: number, mode: StepUpMode, stepUpValue: number): number {
  if (stepUpValue <= 0) return currentSip;
  if (mode === 'percent') return currentSip * (1 + stepUpValue / 100);
  return currentSip + stepUpValue;
}

function buildProjection(
  monthlyInvestment: number,
  tenureYears: number,
  annualReturn: number,
  lumpsumAmount: number,
  stepUpMode: StepUpMode,
  stepUpValue: number,
  inflationRate: number,
  inflationEnabled: boolean
): { yearlyBreakdown: SIPYearProjection[]; estimatedCorpus: number; totalInvested: number; finalMonthlyInvestment: number } {
  const months = Math.max(1, Math.round(tenureYears * 12));
  const monthlyRate = annualReturn / 100 / 12;
  let corpus = Math.max(0, lumpsumAmount);
  let totalInvested = Math.max(0, lumpsumAmount);
  let runningInterest = 0;
  let currentMonthlySip = Math.max(0, monthlyInvestment);
  let yearlyInvestment = 0;
  let yearlyInterest = 0;
  const yearlyBreakdown: SIPYearProjection[] = [];

  for (let month = 1; month <= months; month++) {
    if (month > 1 && (month - 1) % 12 === 0) {
      currentMonthlySip = applyStepUp(currentMonthlySip, stepUpMode, stepUpValue);
    }

    corpus += currentMonthlySip;
    yearlyInvestment += currentMonthlySip;
    totalInvested += currentMonthlySip;

    const monthInterest = corpus * monthlyRate;
    corpus += monthInterest;
    runningInterest += monthInterest;
    yearlyInterest += monthInterest;

    if (month % 12 === 0 || month === months) {
      const year = Math.ceil(month / 12);
      const inflationDivisor = inflationEnabled ? Math.pow(1 + inflationRate / 100, year) : 1;
      yearlyBreakdown.push({
        year,
        yearlyInvestment: Math.round(yearlyInvestment),
        totalInvested: Math.round(totalInvested),
        interestEarned: Math.round(runningInterest),
        yearlyInterestEarned: Math.round(yearlyInterest),
        totalCorpus: Math.round(corpus),
        realCorpus: Math.round(corpus / inflationDivisor),
        monthlySip: Math.round(currentMonthlySip),
      });
      yearlyInvestment = 0;
      yearlyInterest = 0;
    }
  }

  return {
    yearlyBreakdown,
    estimatedCorpus: Math.round(corpus),
    totalInvested: Math.round(totalInvested),
    finalMonthlyInvestment: Math.round(currentMonthlySip),
  };
}

/**
 * Compute XIRR (annual effective return) via Newton-Raphson on monthly cashflows.
 * CF[0] = -lumpsum, CF[1..N] = -SIP_i, CF[N] += finalCorpus
 */
function computeXIRR(
  monthlyInvestment: number,
  tenureYears: number,
  lumpsumAmount: number,
  stepUpMode: StepUpMode,
  stepUpValue: number,
  finalCorpus: number,
): number {
  const months = Math.max(1, Math.round(tenureYears * 12));
  const cf: number[] = new Array(months + 1).fill(0);
  cf[0] = -(lumpsumAmount || 0);

  let sip = monthlyInvestment;
  for (let m = 1; m <= months; m++) {
    if (m > 1 && (m - 1) % 12 === 0) {
      sip = applyStepUp(sip, stepUpMode, stepUpValue);
    }
    cf[m] = -sip;
  }
  cf[months] += finalCorpus;

  if (finalCorpus <= 0) return 0;

  let r = 0.008; // Initial guess ~10% annually
  for (let iter = 0; iter < 300; iter++) {
    let npv = 0;
    let dnpv = 0;
    for (let i = 0; i <= months; i++) {
      if (cf[i] === 0) continue;
      const factor = Math.pow(1 + r, i);
      npv += cf[i] / factor;
      if (i > 0) {
        dnpv -= (i * cf[i]) / (factor * (1 + r));
      }
    }
    if (Math.abs(dnpv) < 1e-15) break;
    const step = npv / dnpv;
    const newR = r - step;
    if (newR <= -0.5) r = r / 2;
    else if (newR >= 2) r = (r + 2) / 2;
    else r = newR;
    if (Math.abs(step) < 1e-10) break;
  }

  const annual = (Math.pow(1 + Math.max(r, -0.99), 12) - 1) * 100;
  return Math.round(annual * 100) / 100;
}

function computeDelayCost(
  inputs: SIPInputs,
  effectiveMonthlyInvestment: number,
  baseCorpus: number,
): DelayCostEntry[] {
  const delays = [0, 1, 2, 3, 5, 10].filter(d => d < inputs.tenureYears);
  return delays.map(delay => {
    if (delay === 0) {
      return { delayYears: 0, corpus: baseCorpus, totalInvested: 0, loss: 0 };
    }
    const proj = buildProjection(
      effectiveMonthlyInvestment,
      Math.max(1, inputs.tenureYears - delay),
      inputs.annualReturn,
      inputs.lumpsumAmount,
      inputs.stepUpMode,
      inputs.stepUpValue,
      inputs.inflationRate,
      inputs.inflationEnabled,
    );
    return {
      delayYears: delay,
      corpus: proj.estimatedCorpus,
      totalInvested: proj.totalInvested,
      loss: baseCorpus - proj.estimatedCorpus,
    };
  });
}

function findRequiredMonthlyInvestment(inputs: SIPInputs): number {
  if (inputs.targetCorpus <= 0) return 0;
  let low = 0;
  let high = Math.max(inputs.monthlyInvestment, 1_000);

  while (high < MAX_BINARY_SEARCH_SIP) {
    const projection = buildProjection(high, inputs.tenureYears, inputs.annualReturn, inputs.lumpsumAmount, inputs.stepUpMode, inputs.stepUpValue, inputs.inflationRate, inputs.inflationEnabled);
    if (projection.estimatedCorpus >= inputs.targetCorpus) break;
    high *= 2;
  }

  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const projection = buildProjection(mid, inputs.tenureYears, inputs.annualReturn, inputs.lumpsumAmount, inputs.stepUpMode, inputs.stepUpValue, inputs.inflationRate, inputs.inflationEnabled);
    if (projection.estimatedCorpus >= inputs.targetCorpus) high = mid;
    else low = mid;
  }

  return Math.round(high);
}

export function calculateSIP(inputs: SIPInputs): SIPResult {
  const requiredMonthlyInvestment = inputs.mode === 'goal' ? findRequiredMonthlyInvestment(inputs) : 0;
  const effectiveMonthlyInvestment = inputs.mode === 'goal' ? requiredMonthlyInvestment : inputs.monthlyInvestment;

  const projection = buildProjection(
    effectiveMonthlyInvestment, inputs.tenureYears, inputs.annualReturn,
    inputs.lumpsumAmount, inputs.stepUpMode, inputs.stepUpValue,
    inputs.inflationRate, inputs.inflationEnabled
  );

  const flatProjection = buildProjection(
    effectiveMonthlyInvestment, inputs.tenureYears, inputs.annualReturn,
    inputs.lumpsumAmount, inputs.stepUpMode, 0,
    inputs.inflationRate, inputs.inflationEnabled
  );

  const purchasingPower = projection.yearlyBreakdown[projection.yearlyBreakdown.length - 1]?.realCorpus ?? projection.estimatedCorpus;
  const wealthGained = Math.max(0, projection.estimatedCorpus - projection.totalInvested);
  const flatWealthGained = Math.max(0, flatProjection.estimatedCorpus - flatProjection.totalInvested);

  const xirr = computeXIRR(
    effectiveMonthlyInvestment, inputs.tenureYears, inputs.lumpsumAmount,
    inputs.stepUpMode, inputs.stepUpValue, projection.estimatedCorpus
  );

  const absoluteReturn = projection.totalInvested > 0
    ? Math.round(((wealthGained / projection.totalInvested) * 100) * 100) / 100
    : 0;

  const delayCostData = computeDelayCost(inputs, effectiveMonthlyInvestment, projection.estimatedCorpus);

  return {
    estimatedCorpus: projection.estimatedCorpus,
    totalInvested: projection.totalInvested,
    wealthGained,
    purchasingPower,
    requiredMonthlyInvestment,
    finalMonthlyInvestment: projection.finalMonthlyInvestment,
    goalGap: Math.max(0, inputs.targetCorpus - projection.estimatedCorpus),
    yearlyBreakdown: projection.yearlyBreakdown,
    flatYearlyBreakdown: flatProjection.yearlyBreakdown,
    flatCorpus: flatProjection.estimatedCorpus,
    flatWealthGained,
    xirr,
    absoluteReturn,
    delayCostData,
  };
}

export function formatCurrency(value: number, currency: Currency = 'INR', short = false): string {
  const symbol = currency === 'INR' ? '\u20B9' : '$';
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';

  if (!isFinite(value)) return `${symbol}\u221E`;

  if (short) {
    if (currency === 'INR') {
      if (Math.abs(value) >= 10_000_000) return `${symbol}${(value / 10_000_000).toFixed(2)}Cr`;
      if (Math.abs(value) >= 100_000) return `${symbol}${(value / 100_000).toFixed(2)}L`;
      if (Math.abs(value) >= 1_000) return `${symbol}${(value / 1_000).toFixed(1)}K`;
    } else {
      if (Math.abs(value) >= 1_000_000_000) return `${symbol}${(value / 1_000_000_000).toFixed(2)}B`;
      if (Math.abs(value) >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(2)}M`;
      if (Math.abs(value) >= 1_000) return `${symbol}${(value / 1_000).toFixed(1)}K`;
    }
    return `${symbol}${Math.round(value)}`;
  }

  return `${symbol}${Math.round(value).toLocaleString(locale)}`;
}

export function formatYAxisValue(value: number, currency: Currency): string {
  return formatCurrency(value, currency, true);
}
