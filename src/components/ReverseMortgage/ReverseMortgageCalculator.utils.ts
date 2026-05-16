import type { ReverseMortgageInputs, ReverseMortgageResult } from './ReverseMortgageCalculator.types';

export function fmtUSD(v: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
}

export const HECM_LENDING_LIMIT_2026 = 1_209_750;
export const HECM_MIN_AGE = 62;
export const IMIP_RATE = 0.02;
export const ORIGINATION_CAP = 6_000;
export const ORIGINATION_FLOOR = 2_500;

// Single-rate PLF lookup at expected rate ≈ 6.0%, by age of youngest borrower.
// These are illustrative-but-realistic values for an MVP. REPLACE with HUD-published
// PLF table values before launch. Update PLF_RATE_NOTE in the SEO copy if you change them.
export const PLF_AT_6_PERCENT: Record<number, number> = {
  62: 0.410, 63: 0.418, 64: 0.426, 65: 0.434, 66: 0.442, 67: 0.450, 68: 0.458,
  69: 0.466, 70: 0.474, 71: 0.482, 72: 0.490, 73: 0.498, 74: 0.506, 75: 0.514,
  76: 0.522, 77: 0.530, 78: 0.538, 79: 0.546, 80: 0.554, 81: 0.562, 82: 0.570,
  83: 0.578, 84: 0.586, 85: 0.594, 86: 0.602, 87: 0.610, 88: 0.618, 89: 0.626,
  90: 0.634, 91: 0.642, 92: 0.650, 93: 0.658, 94: 0.666, 95: 0.674, 96: 0.682,
  97: 0.690, 98: 0.698, 99: 0.706,
};

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

export function calculateReverseMortgage(inputs: ReverseMortgageInputs): ReverseMortgageResult {
  const {
    homeValue, existingMortgageBalance, otherClosingCosts,
    borrowerAge, coBorrowerAge, expectedRate, payoutChoice, termYears, homeAppreciation,
  } = inputs;

  const youngestAge = coBorrowerAge != null ? Math.min(borrowerAge, coBorrowerAge) : borrowerAge;

  if (youngestAge < HECM_MIN_AGE) {
    return {
      isEligible: false, youngestAge, maxClaim: 0, plf: 0, initialPrincipalLimit: 0,
      imip: 0, origination: 0, totalFees: 0, availableAfterFees: 0,
      lumpSum: 0, lineOfCredit: 0, termMonthlyPayment: 0, tenureMonthlyPayment: 0,
      equityProjection: [],
    };
  }

  const maxClaim = Math.min(homeValue, HECM_LENDING_LIMIT_2026);
  const plf = PLF_AT_6_PERCENT[clamp(youngestAge, 62, 99)];
  const initialPrincipalLimit = maxClaim * plf;

  const imip = maxClaim * IMIP_RATE;
  const rawOrigination = 0.02 * Math.min(homeValue, 200_000) + 0.01 * Math.max(0, Math.min(homeValue, 400_000) - 200_000);
  const origination = clamp(rawOrigination, ORIGINATION_FLOOR, ORIGINATION_CAP);
  const totalFees = imip + origination + otherClosingCosts;
  const availableAfterFees = Math.max(0, initialPrincipalLimit - totalFees - existingMortgageBalance);

  const lumpSum = availableAfterFees;
  const lineOfCredit = availableAfterFees;

  // Accrual rate includes 0.5% ongoing MIP
  const annualAccrualRate = expectedRate / 100 + 0.005;
  const monthlyRate = annualAccrualRate / 12;

  function calcPMT(principal: number, n: number): number {
    if (monthlyRate === 0) return principal / n;
    return principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -n));
  }

  const nTerm = termYears * 12;
  const termMonthlyPayment = calcPMT(availableAfterFees, nTerm);

  const nTenure = Math.max(1, (100 - youngestAge)) * 12;
  const tenureMonthlyPayment = calcPMT(availableAfterFees, nTenure);

  // 25-year equity projection (lump-sum draw scenario)
  const initialDraw = availableAfterFees;
  const equityProjection = [];
  for (let y = 0; y <= 25; y++) {
    const loanBalance = Math.round(initialDraw * Math.pow(1 + monthlyRate, 12 * y));
    const hv = Math.round(homeValue * Math.pow(1 + homeAppreciation / 100, y));
    const equity = Math.max(0, hv - loanBalance);
    equityProjection.push({ year: y, loanBalance, homeValue: hv, equity });
  }

  return {
    isEligible: true, youngestAge, maxClaim, plf, initialPrincipalLimit,
    imip, origination, totalFees, availableAfterFees,
    lumpSum, lineOfCredit, termMonthlyPayment, tenureMonthlyPayment, equityProjection,
  };
}
