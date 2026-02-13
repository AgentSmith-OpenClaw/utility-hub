import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Payment } from '../components/EMICalculator/EMICalculator.types';
import { YearlyProjection, FIRETypeComparison, PostFIREProjection } from '../components/FIRECalculator/FIRECalculator.types';
import { SIPInputs, SIPResult } from '../components/SIPWealthPlanner/SIPWealthPlanner.types';

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
