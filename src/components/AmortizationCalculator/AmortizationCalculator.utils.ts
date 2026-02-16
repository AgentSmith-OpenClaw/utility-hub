import { AmortizationPayment, AmortizationSummary } from './AmortizationCalculator.types';

export const calculateEMI = (principal: number, annualRate: number, tenureMonths: number): number => {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRate === 0) return principal / tenureMonths;
  const monthlyRate = annualRate / 12 / 100;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return emi;
};

export const generateAmortizationSchedule = (
  principal: number,
  annualRate: number,
  tenureMonths: number
): AmortizationPayment[] => {
  let balance = principal;
  const monthlyRate = annualRate / 12 / 100;
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const schedule: AmortizationPayment[] = [];

  for (let month = 1; month <= tenureMonths && balance > 0.01; month++) {
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(emi - interest, balance);
    balance -= principalPaid;
    schedule.push({
      month,
      principal: principalPaid,
      interest,
      totalPayment: principalPaid + interest,
      remainingBalance: Math.max(balance, 0),
    });
  }
  return schedule;
};

export const calculateAmortizationSummary = (
  principal: number,
  annualRate: number,
  tenureMonths: number,
  schedule: AmortizationPayment[]
): AmortizationSummary => {
  const totalInterest = schedule.reduce((sum, p) => sum + p.interest, 0);
  const totalAmount = principal + totalInterest;
  const monthlyEMI = calculateEMI(principal, annualRate, tenureMonths);

  return {
    totalInterest,
    totalAmount,
    monthlyEMI,
  };
};
