import { useState, useCallback } from 'react';
import { calculateEMI, generateAmortizationSchedule } from '../components/EMICalculator/EMICalculator.utils';
import { Prepayment } from '../components/EMICalculator/EMICalculator.types';

export const useEMI = () => {
  const [emi, setEMI] = useState<number>(0);
  const [schedule, setSchedule] = useState<any[]>([]);

  const calculate = useCallback((
    loanAmount: number,
    annualRate: number,
    tenureYears: number,
    prepayment: Prepayment
  ) => {
    const tenureMonths = tenureYears * 12;
    const calculatedEMI = calculateEMI(loanAmount, annualRate, tenureMonths);
    setEMI(calculatedEMI);

    const amortizationSchedule = generateAmortizationSchedule(
      loanAmount,
      annualRate,
      tenureMonths,
      prepayment
    );
    setSchedule(amortizationSchedule);
  }, []);

  return { emi, schedule, calculate };
};
