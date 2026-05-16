import type { HELOCInputs, HELOCResult } from './HELOCCalculator.types';

export function fmtUSD(v: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
}

function pmt(P: number, r: number, n: number): number {
  if (r === 0) return P / n;
  return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function calculateHELOC(inputs: HELOCInputs): HELOCResult {
  const { homeValue, existingMortgage, maxCLTV, drawRate, repayRate, drawYears, repayYears, amountDrawn, drawTiming } = inputs;

  const maxLoan = homeValue * (maxCLTV / 100);
  const maxHELOC = Math.max(0, maxLoan - existingMortgage);
  const drawn = Math.min(amountDrawn, maxHELOC);
  const availableCredit = Math.max(0, maxHELOC - drawn);

  const r_draw = drawRate / 100 / 12;
  const drawMonths = drawYears * 12;

  let totalInterestDraw = 0;
  const paymentData: HELOCResult['paymentData'] = [];

  if (drawTiming === 'lump') {
    const drawPaymentMonthly = drawn * r_draw;
    totalInterestDraw = drawPaymentMonthly * drawMonths;
    for (let m = 1; m <= drawMonths; m++) {
      paymentData.push({ month: m, payment: Math.round(drawPaymentMonthly), phase: 'draw' });
    }
  } else {
    for (let m = 1; m <= drawMonths; m++) {
      const balance_m = drawn * m / drawMonths;
      const payment_m = balance_m * r_draw;
      totalInterestDraw += payment_m;
      paymentData.push({ month: m, payment: Math.round(payment_m), phase: 'draw' });
    }
  }

  const balanceAtRepayStart = drawn;
  const r_repay = repayRate / 100 / 12;
  const n_repay = repayYears * 12;
  const repayPaymentMonthly = pmt(balanceAtRepayStart, r_repay, n_repay);
  const totalInterestRepay = repayPaymentMonthly * n_repay - balanceAtRepayStart;
  const totalInterestPaid = totalInterestDraw + totalInterestRepay;
  const totalCostOfHELOC = drawn + totalInterestPaid;

  // Payment data for repay phase
  for (let m = 1; m <= Math.min(n_repay, 240); m++) {
    paymentData.push({ month: drawMonths + m, payment: Math.round(repayPaymentMonthly), phase: 'repay' });
  }

  // Repayment amortization schedule
  const repayAmortization: HELOCResult['repayAmortization'] = [];
  let bal = balanceAtRepayStart;
  for (let m = 1; m <= n_repay; m++) {
    const interest = bal * r_repay;
    const principal = repayPaymentMonthly - interest;
    bal = Math.max(0, bal - principal);
    if (m % 12 === 0 || m === 1 || m === n_repay) {
      repayAmortization.push({ month: m, principal: Math.round(principal), interest: Math.round(interest), balance: Math.round(bal) });
    }
  }

  const equityData = [
    { label: 'Existing Mortgage', value: Math.round(existingMortgage) },
    { label: 'HELOC Drawn', value: Math.round(drawn) },
    { label: 'Remaining Equity', value: Math.round(Math.max(0, homeValue - existingMortgage - drawn)) },
    { label: 'Available Credit', value: Math.round(availableCredit) },
  ];

  return {
    maxHELOC,
    availableCredit,
    drawPaymentMonthly: drawn * r_draw,
    repayPaymentMonthly,
    totalInterestDraw,
    totalInterestRepay,
    totalInterestPaid,
    totalCostOfHELOC,
    balanceAtRepayStart,
    paymentData,
    repayAmortization,
    equityData,
  };
}
