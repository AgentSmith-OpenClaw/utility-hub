import { Payment, Prepayment, LoanSummary, PrepaymentImpact } from './EMICalculator.types';

export const calculateEMI = (principal: number, annualRate: number, tenureMonths: number): number => {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRate === 0) return principal / tenureMonths;
  const monthlyRate = annualRate / 12 / 100;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return emi;
};

// Helper: how many months to repay `balance` at `emi` and `annualRate`
const calculateRemainingMonths = (balance: number, emi: number, annualRate: number): number => {
  if (balance <= 0) return 0;
  if (annualRate === 0) return Math.ceil(balance / emi);
  const monthlyRate = annualRate / 12 / 100;
  if (emi <= balance * monthlyRate) {
    // EMI doesn't even cover interest – should never happen with proper EMI formula
    return Infinity;
  }
  const months = Math.log(emi / (emi - balance * monthlyRate)) / Math.log(1 + monthlyRate);
  return Math.ceil(months);
};

// Simple schedule (no prepayments) for baseline comparison
const generateSimpleSchedule = (
  principal: number,
  annualRate: number,
  tenureMonths: number
): Payment[] => {
  let balance = principal;
  const monthlyRate = annualRate / 12 / 100;
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const schedule: Payment[] = [];

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
    if (balance <= 0.01) break;
  }
  return schedule;
};

/**
 * Core schedule generator that also tracks per-prepayment impact.
 *
 * Key behaviours:
 * - reduce-tenure: EMI stays the same, remaining months shrink.
 * - reduce-emi: Remaining months stay the same (nominally), EMI is
 *   recalculated lower. However, if aggressive recurring prepayments
 *   make the balance hit zero before the tenure ends, the loan DOES
 *   end early.
 *
 * Interest-saved numbers are *estimates* per prepayment.  They are later
 * normalised inside `calculateLoanSummary` so that the running total
 * matches the exact (baseline − actual) interest saved.
 */
export const generateAmortizationScheduleWithImpacts = (
  principal: number,
  annualRate: number,
  tenureMonths: number,
  prepayments: Prepayment[]
): { schedule: Payment[]; impacts: PrepaymentImpact[] } => {
  let balance = principal;
  const monthlyRate = annualRate / 12 / 100;
  const schedule: Payment[] = [];
  const originalEMI = calculateEMI(principal, annualRate, tenureMonths);
  let currentEMI = originalEMI;
  const impacts: PrepaymentImpact[] = [];

  // effectiveTenureEnd = the month number at which the loan is expected to end
  let effectiveTenureEnd = tenureMonths;

  const sortedPrepayments = [...prepayments].sort((a, b) => a.month - b.month);

  for (let month = 1; balance > 0.01; month++) {
    const interest = balance * monthlyRate;

    // Principal from the regular EMI
    let principalPaid = Math.min(Math.max(currentEMI - interest, 0), balance);
    balance -= principalPaid;

    // Check for a prepayment this month
    const prep = sortedPrepayments.find((p) => p.month === month);
    let prepaymentAmount = 0;

    if (prep && balance > 0.01) {
      prepaymentAmount = Math.min(prep.amount, balance);

      const oldEMI = currentEMI;
      const oldRemainingMonths = Math.max(effectiveTenureEnd - month, 0); // months left AFTER this month

      balance -= prepaymentAmount;

      let newRemainingMonths = oldRemainingMonths;
      let interestSavedEstimate = 0;

      if (balance <= 0.01) {
        // --- Loan fully paid off by this prepayment ---
        newRemainingMonths = 0;
        // All future EMI payments are avoided.
        // Interest that was remaining ≈ oldEMI * oldRemainingMonths − balanceBeforePrepay
        const balanceBeforePrepay = prepaymentAmount; // since balance is now ~0
        interestSavedEstimate = Math.max(
          oldEMI * oldRemainingMonths - balanceBeforePrepay,
          0
        );
        effectiveTenureEnd = month;
        currentEMI = 0;
      } else if (prep.strategy === 'reduce-emi') {
        // --- Keep tenure, lower EMI ---
        if (oldRemainingMonths > 0) {
          currentEMI = calculateEMI(balance, annualRate, oldRemainingMonths);
        }
        // Remaining months unchanged (nominally)
        newRemainingMonths = oldRemainingMonths;
        // Interest saved ≈ (E_old − E_new) × N − P
        interestSavedEstimate = Math.max(
          (oldEMI - currentEMI) * oldRemainingMonths - prepaymentAmount,
          0
        );
      } else {
        // --- reduce-tenure (default): keep EMI, shorten months ---
        newRemainingMonths =
          balance > 0.01
            ? calculateRemainingMonths(balance, currentEMI, annualRate)
            : 0;
        effectiveTenureEnd = month + newRemainingMonths;
        // Interest saved ≈ EMI × monthsSaved − P
        const monthsSaved = Math.max(oldRemainingMonths - newRemainingMonths, 0);
        interestSavedEstimate = Math.max(
          currentEMI * monthsSaved - prepaymentAmount,
          0
        );
      }

      impacts.push({
        prepaymentId: prep.id,
        prepaymentAmount,
        prepaymentMonth: month,
        strategy: prep.strategy,
        description: prep.description,
        oldEMI,
        newEMI: currentEMI,
        oldRemainingMonths,
        newRemainingMonths,
        interestSaved: interestSavedEstimate,
        cumulativeInterestSaved: 0, // filled in later by calculateLoanSummary
      });
    } else if (prep && balance <= 0.01) {
      // Balance was already 0 before this prepayment, skip it
    }

    schedule.push({
      month,
      principal: principalPaid,
      interest,
      totalPayment: principalPaid + interest + prepaymentAmount,
      remainingBalance: Math.max(balance, 0),
      prepaymentAmount: prepaymentAmount > 0 ? prepaymentAmount : undefined,
      emi: currentEMI,
    });

    if (balance <= 0.01) break;
    // Safety cap: don't loop forever
    if (month > tenureMonths * 3) break;
  }

  return { schedule, impacts };
};

// Backward-compat wrapper
export const generateAmortizationSchedule = (
  principal: number,
  annualRate: number,
  tenureMonths: number,
  prepayments: Prepayment[]
): Payment[] => {
  const { schedule } = generateAmortizationScheduleWithImpacts(
    principal,
    annualRate,
    tenureMonths,
    prepayments
  );
  return schedule;
};

/**
 * Build loan summary.
 *
 * The individual `interestSaved` estimates on each impact are *normalised*
 * so that their sum exactly equals the true (baseline − actual) interest
 * difference.  This keeps the per-row numbers proportionally correct while
 * the cumulative column ends at the exact total.
 */
export const calculateLoanSummary = (
  principal: number,
  annualRate: number,
  tenureMonths: number,
  schedule: Payment[],
  impacts: PrepaymentImpact[]
): LoanSummary => {
  const totalInterest = schedule.reduce((s, p) => s + p.interest, 0);
  const totalAmount = schedule.reduce((s, p) => s + p.totalPayment, 0);
  const actualTenure = schedule.length;

  const baselineSchedule = generateSimpleSchedule(principal, annualRate, tenureMonths);
  const baselineInterest = baselineSchedule.reduce((s, p) => s + p.interest, 0);
  const interestSaved = Math.max(baselineInterest - totalInterest, 0);

  // --- Normalise per-prepayment interest-saved so they sum to `interestSaved` ---
  if (impacts.length > 0) {
    const rawSum = impacts.reduce((s, imp) => s + imp.interestSaved, 0);
    const factor = rawSum > 0 ? interestSaved / rawSum : 0;

    let cumulative = 0;
    for (const imp of impacts) {
      imp.interestSaved = Math.round(imp.interestSaved * factor);
      cumulative += imp.interestSaved;
      imp.cumulativeInterestSaved = cumulative;
    }
  }

  return {
    totalInterest,
    totalAmount,
    actualTenure,
    interestSaved,
    prepaymentImpacts: impacts,
  };
};
