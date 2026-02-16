import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Payment } from '../components/EMICalculator/EMICalculator.types';
import { YearlyProjection, FIRETypeComparison, PostFIREProjection } from '../components/FIRECalculator/FIRECalculator.types';
import { SIPInputs, SIPResult } from '../components/SIPWealthPlanner/SIPWealthPlanner.types';
import { CompoundInterestInputs, CompoundInterestResult } from '../components/CompoundInterestCalculator/CompoundInterestCalculator.types';
import { IncomeTaxInputs, IncomeTaxResult } from '../components/IncomeTaxCalculator/IncomeTaxCalculator.types';

export const exportToExcel = (schedule: Payment[], filename: string = 'emi_schedule.xlsx') => {
  const ws = XLSX.utils.json_to_sheet(schedule);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Amortization Schedule");
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(data, filename);
};

export const exportFIREToExcel = (
  projections: YearlyProjection[],
  fireComparisons: FIRETypeComparison[],
  postFIREProjections: PostFIREProjection[],
  filename: string = 'fire_analysis.xlsx'
) => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Portfolio Projections
  const projectionsFormatted = projections.map(p => ({
    Year: p.year,
    Age: p.age,
    'Start Balance': Math.round(p.startBalance),
    'Contributions': Math.round(p.contributions),
    'Growth': Math.round(p.growth),
    'End Balance': Math.round(p.endBalance),
    'Total Contributed': Math.round(p.totalContributed),
    'Total Growth': Math.round(p.totalGrowth),
    'FIRE Target': Math.round(p.fireNumber),
    'Reached FIRE': p.isFIREd ? 'Yes' : 'No',
  }));
  const ws1 = XLSX.utils.json_to_sheet(projectionsFormatted);
  XLSX.utils.book_append_sheet(wb, ws1, "Portfolio Projection");

  // Sheet 2: FIRE Type Comparison
  const comparisonFormatted = fireComparisons.map(fc => ({
    'FIRE Type': fc.label,
    'Target Amount': Math.round(fc.fireNumber),
    'Inflation-Adjusted': Math.round(fc.fireNumberInflationAdjusted),
    'Years to FIRE': fc.yearsToFIRE,
    'FIRE Age': fc.fireAge,
    'FIRE Year': fc.fireYear,
    'Monthly Withdrawal': Math.round(fc.monthlyWithdrawal),
    'Annual Withdrawal': Math.round(fc.annualWithdrawal),
    'Portfolio at Retirement': Math.round(fc.portfolioAtRetirement),
  }));
  const ws2 = XLSX.utils.json_to_sheet(comparisonFormatted);
  XLSX.utils.book_append_sheet(wb, ws2, "FIRE Type Comparison");

  // Sheet 3: Life After FIRE
  if (postFIREProjections.length > 0) {
    const postFIREFormatted = postFIREProjections.map(p => ({
      Year: p.year,
      Age: p.age,
      'Start Balance': Math.round(p.startBalance),
      'Withdrawal': Math.round(p.withdrawal),
      'Growth': Math.round(p.growth),
      'End Balance': Math.round(p.endBalance),
    }));
    const ws3 = XLSX.utils.json_to_sheet(postFIREFormatted);
    XLSX.utils.book_append_sheet(wb, ws3, "Life After FIRE");
  }

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(data, filename);
};

export const exportSIPToExcel = (
  inputs: SIPInputs,
  result: SIPResult,
  filename: string = 'sip_wealth_plan.xlsx'
) => {
  const wb = XLSX.utils.book_new();
  const currencySymbol = inputs.currency === 'INR' ? '₹' : '$';

  // Sheet 1: Year-wise Projection
  const projectionData = result.yearlyBreakdown.map((row) => ({
    'Year': row.year,
    'Monthly SIP': row.monthlySip,
    'Yearly Investment': row.yearlyInvestment,
    'Total Invested': row.totalInvested,
    'Interest This Year': row.yearlyInterestEarned,
    'Total Interest': row.interestEarned,
    'Total Corpus': row.totalCorpus,
    'Real Value (Inflation Adj.)': row.realCorpus,
  }));
  const ws1 = XLSX.utils.json_to_sheet(projectionData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Year-wise Projection');

  // Sheet 2: Input Parameters
  const inputData = [
    { Parameter: 'Monthly Investment', Value: `${currencySymbol}${inputs.monthlyInvestment.toLocaleString()}` },
    { Parameter: 'Investment Tenure', Value: `${inputs.tenureYears} years` },
    { Parameter: 'Expected Annual Return', Value: `${inputs.annualReturn}%` },
    { Parameter: 'Initial Lumpsum', Value: `${currencySymbol}${inputs.lumpsumAmount.toLocaleString()}` },
    { Parameter: 'Step-up Mode', Value: inputs.stepUpMode === 'percent' ? 'Percentage' : 'Fixed Amount' },
    { Parameter: 'Step-up Value', Value: inputs.stepUpMode === 'percent' ? `${inputs.stepUpValue}%` : `${currencySymbol}${inputs.stepUpValue.toLocaleString()}` },
    { Parameter: 'Inflation Enabled', Value: inputs.inflationEnabled ? 'Yes' : 'No' },
    { Parameter: 'Inflation Rate', Value: `${inputs.inflationRate}%` },
    { Parameter: 'Planning Mode', Value: inputs.mode === 'goal' ? 'Goal Based' : 'Wealth Projection' },
    { Parameter: 'Currency', Value: inputs.currency },
  ];
  if (inputs.mode === 'goal') {
    inputData.push({ Parameter: 'Target Corpus', Value: `${currencySymbol}${inputs.targetCorpus.toLocaleString()}` });
  }
  const ws2 = XLSX.utils.json_to_sheet(inputData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Input Parameters');

  // Sheet 3: Summary Statistics
  const summaryData = [
    { Metric: 'Estimated Corpus', Value: result.estimatedCorpus },
    { Metric: 'Total Invested', Value: result.totalInvested },
    { Metric: 'Wealth Gained', Value: result.wealthGained },
    { Metric: 'Purchasing Power (Real Value)', Value: result.purchasingPower },
    { Metric: 'XIRR (Effective Annual Return)', Value: `${result.xirr}%` },
    { Metric: 'Absolute Return', Value: `${result.absoluteReturn}%` },
    { Metric: 'Return Multiple', Value: `${(result.estimatedCorpus / result.totalInvested).toFixed(2)}x` },
    { Metric: 'Final Monthly SIP', Value: result.finalMonthlyInvestment },
  ];
  if (inputs.mode === 'goal') {
    summaryData.push({ Metric: 'Required Monthly SIP', Value: result.requiredMonthlyInvestment as any });
  }
  if (inputs.compareWithFlat) {
    summaryData.push(
      { Metric: 'Flat SIP Corpus', Value: result.flatCorpus as any },
      { Metric: 'Step-up Advantage', Value: (result.estimatedCorpus - result.flatCorpus) as any },
    );
  }
  const ws3s = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws3s, 'Summary Statistics');

  // Sheet 4: Delay Cost Analysis
  if (result.delayCostData.length > 0) {
    const delayCostFormatted = result.delayCostData.map((d) => ({
      'Delay (Years)': d.delayYears,
      'Effective Tenure': `${inputs.tenureYears - d.delayYears} years`,
      'Final Corpus': d.corpus,
      'Opportunity Loss': d.loss,
    }));
    const ws4 = XLSX.utils.json_to_sheet(delayCostFormatted);
    XLSX.utils.book_append_sheet(wb, ws4, 'Delay Cost Analysis');
  }

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(data, filename);
};

export const exportCompoundInterestToExcel = (
  inputs: CompoundInterestInputs,
  result: CompoundInterestResult,
  filename: string = 'compound_interest_projection.xlsx'
) => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Year-wise Projection
  const projectionData = result.yearlyData.map((row) => ({
    'Year': row.year,
    'Balance': Math.round(row.balance),
    'Total Principal': Math.round(row.totalPrincipal),
    'Total Interest': Math.round(row.totalInterest),
    'Interest Earned This Year': Math.round(row.annualInterest),
    'Real Value (Inflation Adj.)': Math.round(row.realValue),
  }));
  const ws1 = XLSX.utils.json_to_sheet(projectionData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Projection');

  // Sheet 2: Inputs
  const inputData = [
    { Parameter: 'Initial Principal', Value: inputs.initialPrincipal },
    { Parameter: 'Monthly Contribution', Value: inputs.monthlyContribution },
    { Parameter: 'Annual Interest Rate', Value: `${inputs.annualRate}%` },
    { Parameter: 'Tenure (Years)', Value: inputs.years },
    { Parameter: 'Compounding Frequency', Value: inputs.compoundingFrequency },
    { Parameter: 'Inflation Rate', Value: `${inputs.inflationRate}%` },
  ];
  const ws2 = XLSX.utils.json_to_sheet(inputData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Inputs');

  // Sheet 3: Summary
  const summaryData = [
    { Metric: 'Final Balance', Value: Math.round(result.finalBalance) },
    { Metric: 'Total Principal Invested', Value: Math.round(result.totalPrincipal) },
    { Metric: 'Total Interest Earned', Value: Math.round(result.totalInterest) },
    { Metric: 'Inflation Adjusted Value', Value: Math.round(result.realValue) },
  ];
  const ws3 = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws3, 'Summary');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(data, filename);
};

export const exportIncomeTaxToExcel = (
  inputs: IncomeTaxInputs,
  result: IncomeTaxResult,
  filename: string = 'india_2026_tax_report.xlsx'
) => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Regime Comparison
  const comparisonData = [
    { Metric: 'Gross Income', 'Old Regime': Math.round(result.oldRegime.grossIncome), 'New Regime': Math.round(result.newRegime.grossIncome) },
    { Metric: 'Total Deductions', 'Old Regime': Math.round(result.oldRegime.totalDeductions), 'New Regime': Math.round(result.newRegime.totalDeductions) },
    { Metric: 'Taxable Income', 'Old Regime': Math.round(result.oldRegime.taxableIncome), 'New Regime': Math.round(result.newRegime.taxableIncome) },
    { Metric: 'Tax Before Cess', 'Old Regime': Math.round(result.oldRegime.taxBeforeCess), 'New Regime': Math.round(result.newRegime.taxBeforeCess) },
    { Metric: '87A Rebate', 'Old Regime': Math.round(result.oldRegime.rebate87A), 'New Regime': Math.round(result.newRegime.rebate87A) },
    { Metric: 'Surcharge', 'Old Regime': Math.round(result.oldRegime.surcharge), 'New Regime': Math.round(result.newRegime.surcharge) },
    { Metric: '4% Cess', 'Old Regime': Math.round(result.oldRegime.cess), 'New Regime': Math.round(result.newRegime.cess) },
    { Metric: 'Total Tax', 'Old Regime': Math.round(result.oldRegime.totalTax), 'New Regime': Math.round(result.newRegime.totalTax) },
    { Metric: 'Take Home', 'Old Regime': Math.round(result.oldRegime.takeHomeIncome), 'New Regime': Math.round(result.newRegime.takeHomeIncome) },
    { Metric: 'Effective Rate', 'Old Regime': `${result.oldRegime.effectiveRate.toFixed(1)}%`, 'New Regime': `${result.newRegime.effectiveRate.toFixed(1)}%` },
    { Metric: 'Monthly Tax', 'Old Regime': result.oldRegime.monthlyTax, 'New Regime': result.newRegime.monthlyTax },
    { Metric: 'Monthly Take Home', 'Old Regime': result.oldRegime.monthlyTakeHome, 'New Regime': result.newRegime.monthlyTakeHome },
  ];
  const ws1 = XLSX.utils.json_to_sheet(comparisonData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Regime Comparison');

  // Sheet 2: Slab-wise Breakdown (Recommended)
  const recommended = result.recommendedRegime === 'new' ? result.newRegime : result.oldRegime;
  const slabData = recommended.slabBreakdown.map(s => ({
    'Slab': s.range,
    'Rate': `${s.rate}%`,
    'Taxable Amount': Math.round(s.taxableAmount),
    'Tax': Math.round(s.tax),
  }));
  const ws2t = XLSX.utils.json_to_sheet(slabData);
  XLSX.utils.book_append_sheet(wb, ws2t, 'Slab Breakdown');

  // Sheet 3: Income Inputs
  const inputData = [
    { Parameter: 'Annual Salary', Value: inputs.annualSalary },
    { Parameter: 'Interest Income', Value: inputs.interestIncome },
    { Parameter: 'Rental Income', Value: inputs.rentalIncome },
    { Parameter: 'Other Income', Value: inputs.otherIncome },
    { Parameter: 'Salaried', Value: inputs.isSalaried ? 'Yes' : 'No' },
    { Parameter: 'Section 80C', Value: inputs.section80C },
    { Parameter: 'Section 80D', Value: inputs.section80D },
    { Parameter: 'NPS (80CCD 1B)', Value: inputs.nps80CCD1B },
    { Parameter: 'HRA Exemption', Value: inputs.hraExemption },
    { Parameter: 'Home Loan Interest', Value: inputs.homeLoanInterest24b },
    { Parameter: 'Other Deductions', Value: inputs.otherDeductions },
    { Parameter: 'Recommended Regime', Value: result.recommendedRegime === 'new' ? 'New Regime' : 'Old Regime' },
    { Parameter: 'Tax Savings', Value: Math.round(result.savings) },
  ];
  const ws3t = XLSX.utils.json_to_sheet(inputData);
  XLSX.utils.book_append_sheet(wb, ws3t, 'Inputs & Summary');

  const excelBuffer2 = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data2 = new Blob([excelBuffer2], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(data2, filename);
};

// Mortgage Calculator Excel Export
export interface MortgageExportData {
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  propertyTax: number;
  homeInsurance: number;
  hoa: number;
  pmi: number;
  monthlyPayment: number;
  monthlyPrincipalInterest: number;
  totalPayment: number;
  totalInterest: number;
  schedule: Array<{
    month: number;
    principal: number;
    interest: number;
    totalPayment: number;
    remainingBalance: number;
    cumulativePrincipal: number;
    cumulativeInterest: number;
  }>;
}

export const exportMortgageToExcel = (
  data: MortgageExportData,
  filename: string = 'mortgage_analysis.xlsx'
) => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary
  const summaryData = [
    { Parameter: 'Home Price', Value: `$${data.homePrice.toLocaleString()}` },
    { Parameter: 'Down Payment', Value: `$${data.downPayment.toLocaleString()}` },
    { Parameter: 'Loan Amount', Value: `$${data.loanAmount.toLocaleString()}` },
    { Parameter: 'Interest Rate', Value: `${data.interestRate}%` },
    { Parameter: 'Loan Term', Value: `${data.loanTerm} years` },
    { Parameter: '', Value: '' },
    { Parameter: 'Monthly P&I', Value: `$${data.monthlyPrincipalInterest.toLocaleString()}` },
    { Parameter: 'Property Tax', Value: `$${data.propertyTax.toLocaleString()}` },
    { Parameter: 'Home Insurance', Value: `$${data.homeInsurance.toLocaleString()}` },
    { Parameter: 'HOA Fees', Value: `$${data.hoa.toLocaleString()}` },
    { Parameter: 'PMI', Value: `$${data.pmi.toLocaleString()}` },
    { Parameter: '', Value: '' },
    { Parameter: 'Total Monthly Payment', Value: `$${data.monthlyPayment.toLocaleString()}` },
    { Parameter: 'Total Interest (Life of Loan)', Value: `$${data.totalInterest.toLocaleString()}` },
    { Parameter: 'Total Amount Paid', Value: `$${data.totalPayment.toLocaleString()}` },
  ];
  const ws1 = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

  // Sheet 2: Amortization Schedule
  const scheduleData = data.schedule.map(row => ({
    'Month': row.month,
    'Principal': Math.round(row.principal),
    'Interest': Math.round(row.interest),
    'Total Payment': Math.round(row.totalPayment),
    'Remaining Balance': Math.round(row.remainingBalance),
    'Cumulative Principal': Math.round(row.cumulativePrincipal),
    'Cumulative Interest': Math.round(row.cumulativeInterest),
  }));
  const ws2 = XLSX.utils.json_to_sheet(scheduleData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Amortization Schedule');

  // Sheet 3: Yearly Summary
  const yearlySummary: any[] = [];
  const totalMonths = data.schedule.length;
  const years = Math.ceil(totalMonths / 12);
  
  for (let year = 1; year <= years; year++) {
    const startMonth = (year - 1) * 12;
    const endMonth = Math.min(year * 12, totalMonths);
    const yearData = data.schedule.slice(startMonth, endMonth);
    
    const principalPaid = yearData.reduce((sum, row) => sum + row.principal, 0);
    const interestPaid = yearData.reduce((sum, row) => sum + row.interest, 0);
    const endingBalance = yearData[yearData.length - 1]?.remainingBalance || 0;
    
    yearlySummary.push({
      'Year': year,
      'Principal Paid': Math.round(principalPaid),
      'Interest Paid': Math.round(interestPaid),
      'Total Paid': Math.round(principalPaid + interestPaid),
      'Ending Balance': Math.round(endingBalance),
    });
  }
  const ws3 = XLSX.utils.json_to_sheet(yearlySummary);
  XLSX.utils.book_append_sheet(wb, ws3, 'Yearly Summary');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(blob, filename);
};

// Amortization Calculator Excel Export
export interface AmortizationExportData {
  loanAmount: number;
  annualRate: number;
  tenureYears: number;
  monthlyEMI: number;
  totalInterest: number;
  totalAmount: number;
  schedule: Array<{
    month: number;
    principal: number;
    interest: number;
    totalPayment: number;
    remainingBalance: number;
  }>;
}

export const exportAmortizationToExcel = (
  data: AmortizationExportData,
  filename: string = 'amortization_schedule.xlsx'
) => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary
  const summaryData = [
    { Parameter: 'Loan Amount', Value: `₹${data.loanAmount.toLocaleString('en-IN')}` },
    { Parameter: 'Interest Rate', Value: `${data.annualRate}%` },
    { Parameter: 'Loan Tenure', Value: `${data.tenureYears} years` },
    { Parameter: '', Value: '' },
    { Parameter: 'Monthly EMI', Value: `₹${data.monthlyEMI.toLocaleString('en-IN')}` },
    { Parameter: 'Total Interest', Value: `₹${data.totalInterest.toLocaleString('en-IN')}` },
    { Parameter: 'Total Amount Payable', Value: `₹${data.totalAmount.toLocaleString('en-IN')}` },
    { Parameter: 'Interest/Principal Ratio', Value: `${((data.totalInterest / data.loanAmount) * 100).toFixed(1)}%` },
  ];
  const ws1 = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

  // Sheet 2: Complete Schedule
  const scheduleData = data.schedule.map(row => ({
    'Month': row.month,
    'Principal': Math.round(row.principal),
    'Interest': Math.round(row.interest),
    'EMI': Math.round(row.totalPayment),
    'Remaining Balance': Math.round(row.remainingBalance),
  }));
  const ws2 = XLSX.utils.json_to_sheet(scheduleData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Amortization Schedule');

  // Sheet 3: Yearly Breakdown
  const yearlyBreakdown: any[] = [];
  const totalMonths = data.schedule.length;
  const years = Math.ceil(totalMonths / 12);
  
  for (let year = 1; year <= years; year++) {
    const startMonth = (year - 1) * 12;
    const endMonth = Math.min(year * 12, totalMonths);
    const yearData = data.schedule.slice(startMonth, endMonth);
    
    const principalPaid = yearData.reduce((sum, row) => sum + row.principal, 0);
    const interestPaid = yearData.reduce((sum, row) => sum + row.interest, 0);
    const totalPaid = yearData.reduce((sum, row) => sum + row.totalPayment, 0);
    const endingBalance = yearData[yearData.length - 1]?.remainingBalance || 0;
    const cumulativePrincipal = data.loanAmount - endingBalance;
    
    yearlyBreakdown.push({
      'Year': year,
      'Principal Paid': Math.round(principalPaid),
      'Interest Paid': Math.round(interestPaid),
      'Total EMI Paid': Math.round(totalPaid),
      'Cumulative Principal': Math.round(cumulativePrincipal),
      'Remaining Balance': Math.round(endingBalance),
    });
  }
  const ws3 = XLSX.utils.json_to_sheet(yearlyBreakdown);
  XLSX.utils.book_append_sheet(wb, ws3, 'Yearly Breakdown');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(blob, filename);
};