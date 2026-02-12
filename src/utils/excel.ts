import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Payment } from '../components/EMICalculator/EMICalculator.types';
import { YearlyProjection, FIRETypeComparison, PostFIREProjection } from '../components/FIRECalculator/FIRECalculator.types';

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
