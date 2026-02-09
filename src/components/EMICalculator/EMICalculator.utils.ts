import { Payment, Prepayment } from './EMICalculator.types';

export const calculateEMI = (principal: number, annualRate: number, tenureMonths: number): number => {
  const monthlyRate = annualRate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return emi;
};

export const generateAmortizationSchedule = (
  principal: number,
  annualRate: number,
  tenureMonths: number,
  prepayment: Prepayment
): Payment[] => {
  let balance = principal;
  const monthlyRate = annualRate / 12 / 100;
  let schedule: Payment[] = [];
  let emi = calculateEMI(principal, annualRate, tenureMonths);

  for (let month = 1; month <= tenureMonths && balance > 0; month++) {
    let interest = balance * monthlyRate;
    let principalPaid = emi - interest;
    let totalPayment = emi;

    if (prepayment.amount > 0 && 
        month >= prepayment.startMonth && 
        (prepayment.frequency === 'monthly' || 
         (prepayment.frequency === 'quarterly' && month % 3 === 0) || 
         (prepayment.frequency === 'yearly' && month % 12 === 0))) {
      balance -= prepayment.amount;
      // Recalculate EMI if reducing tenure logic is applied
      // For simplicity, assuming reducing EMI logic here or keeping tenure same and balance reducing faster
    }

    balance -= principalPaid;
    if (balance < 0) {
      principalPaid += balance;
      balance = 0;
    }

    schedule.push({
      month,
      principal: principalPaid,
      interest,
      totalPayment,
      remainingBalance: balance
    });
  }

  return schedule;
};
