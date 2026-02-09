import { useState, useCallback } from 'react';
import { generateAmortizationScheduleWithImpacts, calculateLoanSummary } from '../components/EMICalculator/EMICalculator.utils';
import { Prepayment, LoanSummary } from '../components/EMICalculator/EMICalculator.types';

export const useEMI = () => {
  const [emi, setEMI] = useState<number>(0);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [summary, setSummary] = useState<LoanSummary | null>(null);

  const calculate = useCallback((
    loanAmount: number,
    annualRate: number,
    tenureYears: number,
    prepayments: Prepayment[]
  ) => {
    const tenureMonths = tenureYears * 12;
    const { schedule: amortizationSchedule, impacts } = generateAmortizationScheduleWithImpacts(
      loanAmount,
      annualRate,
      tenureMonths,
      prepayments
    );
    
    // EMI is the first month's EMI (or current EMI after prepayments)
    const calculatedEMI = amortizationSchedule[0]?.emi || (amortizationSchedule[0]?.principal + amortizationSchedule[0]?.interest) || 0;
    setEMI(calculatedEMI);
    setSchedule(amortizationSchedule);

    const loanSummary = calculateLoanSummary(loanAmount, annualRate, tenureMonths, amortizationSchedule, impacts);
    setSummary(loanSummary);
  }, []);

  return { emi, schedule, summary, calculate };
};
