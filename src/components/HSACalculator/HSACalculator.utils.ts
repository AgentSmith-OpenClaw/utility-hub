import type { HSAInputs, HSAResult, HSAYearData } from './HSACalculator.types';

// Update these annually when IRS publishes new figures.
export const HSA_LIMITS_2026 = {
  selfOnly: 4400,
  family: 8750,
  catchUp: 1000, // age 55+
} as const;

export const FICA_RATE = 0.0765;

export function fmtUSD(v: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
}

export function calculateHSA(inputs: HSAInputs): HSAResult {
  const { coverageType, currentAge, yearsUntilUse, currentBalance, annualContribution, contributionMethod, employerContribution, expectedReturn, fedRate, stateRate, annualMedicalWithdrawals } = inputs;

  const ircLimit = coverageType === 'family' ? HSA_LIMITS_2026.family : HSA_LIMITS_2026.selfOnly;
  const catchUp = currentAge >= 55 ? HSA_LIMITS_2026.catchUp : 0;
  const totalAllowed = ircLimit + catchUp;
  const employeeMax = Math.max(0, totalAllowed - employerContribution);
  const effectiveAnnualContribution = Math.min(annualContribution, employeeMax);
  const overContribution = annualContribution > employeeMax;

  const fedSavings = effectiveAnnualContribution * (fedRate / 100);
  const stateSavings = effectiveAnnualContribution * (stateRate / 100);
  const ficaSavings = contributionMethod === 'payroll' ? effectiveAnnualContribution * FICA_RATE : 0;
  const totalYear1Tax = fedSavings + stateSavings + ficaSavings;
  const effectiveCost = effectiveAnnualContribution - totalYear1Tax;

  const totalAnnualContrib = effectiveAnnualContribution + employerContribution;
  const r = expectedReturn / 100;
  const effectiveTaxRate = (fedRate + stateRate) / 100;
  const taxableReturn = r * (1 - effectiveTaxRate);
  const taxableContrib = totalAnnualContrib * (1 - effectiveTaxRate);

  const projection: HSAYearData[] = [];
  let hsaBal = currentBalance;
  let taxBal = currentBalance * (1 - effectiveTaxRate);
  let totalTaxSaved = 0;

  for (let y = 1; y <= yearsUntilUse; y++) {
    const contrib = totalAnnualContrib;
    hsaBal += contrib;
    hsaBal -= annualMedicalWithdrawals;
    const hsaGrowth = Math.max(0, hsaBal) * r;
    hsaBal = Math.max(0, hsaBal) * (1 + r);
    taxBal += taxableContrib;
    taxBal *= (1 + taxableReturn);
    totalTaxSaved += totalYear1Tax;
    projection.push({ year: y, hsaBalance: Math.round(hsaBal), taxableBalance: Math.round(taxBal), contribution: Math.round(contrib), growth: Math.round(hsaGrowth) });
  }

  return {
    employeeMax, effectiveAnnualContribution, fedSavings, stateSavings, ficaSavings,
    totalYear1Tax, effectiveCost, hsaFinal: hsaBal, taxableFinal: taxBal,
    hsaAdvantage: hsaBal - taxBal, totalTaxSaved, projection, overContribution,
  };
}
