import {
  FIREInputs,
  FIREResult,
  FIRETypeInfo,
  YearlyProjection,
  FIREMilestone,
  FIREType,
  Currency,
} from './FIRECalculator.types';

// ── FIRE Type Definitions ─────────────────────────────────────────

export const FIRE_TYPES: FIRETypeInfo[] = [
  {
    type: 'lean',
    label: 'Lean FIRE',
    icon: '🌿',
    description: 'Minimalist lifestyle, essential expenses only',
    expenseMultiplier: 0.6,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    type: 'regular',
    label: 'Regular FIRE',
    icon: '🔥',
    description: 'Maintain your current standard of living',
    expenseMultiplier: 1.0,
    color: 'orange',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    type: 'fat',
    label: 'Fat FIRE',
    icon: '👑',
    description: 'Comfortable lifestyle with extra spending',
    expenseMultiplier: 1.5,
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-600',
  },
  {
    type: 'coast',
    label: 'Coast FIRE',
    icon: '🏖️',
    description: 'Save now, let compounding do the rest',
    expenseMultiplier: 1.0,
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    type: 'barista',
    label: 'Barista FIRE',
    icon: '☕',
    description: 'Part-time work covers some expenses',
    expenseMultiplier: 1.0,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
  },
];

// ── Helpers ────────────────────────────────────────────────────────

export function getFireTypeInfo(type: FIREType): FIRETypeInfo {
  return FIRE_TYPES.find((t) => t.type === type) || FIRE_TYPES[1];
}

export function calculateFIRENumber(
  annualExpenses: number,
  withdrawalRate: number
): number {
  if (withdrawalRate <= 0) return Infinity;
  return annualExpenses / (withdrawalRate / 100);
}

export function adjustForInflation(
  amount: number,
  inflationRate: number,
  years: number
): number {
  return amount * Math.pow(1 + inflationRate / 100, years);
}

export function formatCurrency(
  value: number,
  currency: Currency = 'USD',
  short: boolean = false
): string {
  const symbol = currency === 'INR' ? '₹' : '$';
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  
  if (!isFinite(value)) return `${symbol}∞`;
  if (short) {
    if (currency === 'INR') {
      if (Math.abs(value) >= 10_000_000)
        return `${symbol}${(value / 10_000_000).toFixed(1)}Cr`;
      if (Math.abs(value) >= 100_000)
        return `${symbol}${(value / 100_000).toFixed(1)}L`;
      if (Math.abs(value) >= 1_000)
        return `${symbol}${(value / 1_000).toFixed(0)}K`;
    } else {
      if (Math.abs(value) >= 1_000_000)
        return `${symbol}${(value / 1_000_000).toFixed(1)}M`;
      if (Math.abs(value) >= 1_000)
        return `${symbol}${(value / 1_000).toFixed(0)}K`;
    }
    return `${symbol}${value.toFixed(0)}`;
  }
  return `${symbol}${value.toLocaleString(locale, { maximumFractionDigits: 0 })}`;
}

// ── Core Calculation ──────────────────────────────────────────────

export function calculateFIRE(inputs: FIREInputs): FIREResult {
  const {
    currentAge,
    lifeExpectancy,
    monthlyIncome,
    monthlyExpenses,
    currentSavings,
    monthlyContribution,
    expectedReturn,
    inflationRate,
    withdrawalRate,
    fireType,
    monthlyPartTimeIncome,
  } = inputs;

  // Convert monthly to annual for calculations
  const annualIncome = monthlyIncome * 12;
  const annualExpenses = monthlyExpenses * 12;
  const partTimeIncome = monthlyPartTimeIncome * 12;

  const fireTypeInfo = getFireTypeInfo(fireType);
  const baseExpenses = annualExpenses * fireTypeInfo.expenseMultiplier;

  // For barista FIRE, portfolio only needs to cover the gap
  const portfolioExpenses =
    fireType === 'barista'
      ? Math.max(0, baseExpenses - partTimeIncome)
      : baseExpenses;

  // FIRE number in today's dollars
  const fireNumber = calculateFIRENumber(portfolioExpenses, withdrawalRate);

  const annualContribution = monthlyContribution * 12;
  const annualSavings = annualIncome - annualExpenses;
  const savingsRate =
    annualIncome > 0 ? (annualSavings / annualIncome) * 100 : 0;

  // Coast FIRE: amount needed now to grow to FIRE number by age 65
  const coastTargetAge = 65;
  const yearsToCoast = Math.max(coastTargetAge - currentAge, 1);
  const coastFIRENumber =
    fireNumber / Math.pow(1 + expectedReturn / 100, yearsToCoast);

  // Year-by-year projections
  const maxYears = Math.max(lifeExpectancy - currentAge + 10, 70);
  const projections: YearlyProjection[] = [];
  let balance = currentSavings;
  let totalContributed = currentSavings;
  let totalGrowth = 0;
  let yearsToFIRE = -1;
  let isFIREd = false;
  let coastFIREAge: number | null = null;

  for (let year = 0; year <= maxYears; year++) {
    const age = currentAge + year;
    const startBalance = balance;

    // Inflate expenses each year
    const inflatedBase = adjustForInflation(baseExpenses, inflationRate, year);
    const inflatedPortfolioExpenses =
      fireType === 'barista'
        ? Math.max(
            0,
            inflatedBase -
              adjustForInflation(partTimeIncome, inflationRate, year)
          )
        : inflatedBase;
    const currentFireNumber = calculateFIRENumber(
      inflatedPortfolioExpenses,
      withdrawalRate
    );

    let contributions = 0;
    let withdrawal = 0;
    let growth = 0;

    if (!isFIREd) {
      // ── Accumulation Phase ──
      if (fireType === 'coast') {
        if (balance >= coastFIRENumber && coastFIREAge === null) {
          coastFIREAge = age;
        }
        contributions =
          coastFIREAge !== null && age >= coastFIREAge
            ? 0
            : annualContribution;
      } else {
        contributions = annualContribution;
      }

      growth = startBalance * (expectedReturn / 100);
      balance = startBalance + contributions + growth;
      totalContributed += contributions;
      totalGrowth += growth;

      if (balance >= currentFireNumber && yearsToFIRE === -1) {
        yearsToFIRE = year;
        isFIREd = true;
      }
    } else {
      // ── Withdrawal Phase ──
      withdrawal = startBalance * (withdrawalRate / 100);
      growth = startBalance * (expectedReturn / 100);
      balance = startBalance + growth - withdrawal;
      totalGrowth += growth;
      if (balance < 0) balance = 0;
    }

    // Track coast FIRE age for non-coast types
    if (coastFIREAge === null && startBalance >= coastFIRENumber) {
      coastFIREAge = age;
    }

    projections.push({
      year,
      age,
      startBalance: Math.round(startBalance),
      contributions: Math.round(contributions),
      growth: Math.round(growth),
      endBalance: Math.round(Math.max(balance, 0)),
      totalContributed: Math.round(totalContributed),
      totalGrowth: Math.round(totalGrowth),
      inflationAdjustedExpenses: Math.round(inflatedBase),
      fireNumber: Math.round(currentFireNumber),
      isFIREd,
      withdrawal: Math.round(withdrawal),
    });

    if (age > lifeExpectancy + 5) break;
  }

  if (yearsToFIRE === -1) yearsToFIRE = maxYears;
  const fireAge = currentAge + yearsToFIRE;

  // How long does the money last after FIRE?
  let drawdownBalance = projections[yearsToFIRE]?.endBalance || 0;
  let yearsMoneyLasts = 0;
  for (let y = 0; y < 100; y++) {
    if (drawdownBalance <= 0) break;
    const wd = drawdownBalance * (withdrawalRate / 100);
    const gr = drawdownBalance * (expectedReturn / 100);
    drawdownBalance = drawdownBalance + gr - wd;
    yearsMoneyLasts = y + 1;
    if (drawdownBalance <= 0) break;
  }
  if (yearsMoneyLasts >= 100) yearsMoneyLasts = 100;

  const portfolioAtRetirement = projections[yearsToFIRE]?.endBalance || 0;
  const inflationAdjustedExpensesAtFIRE = adjustForInflation(
    portfolioExpenses,
    inflationRate,
    yearsToFIRE
  );
  const safeWithdrawalAmount =
    portfolioAtRetirement * (withdrawalRate / 100);

  const lifeExpProjection = projections.find((p) => p.age === lifeExpectancy);
  const portfolioAtLifeExpectancy = lifeExpProjection?.endBalance || 0;

  // Monthly savings needed to reach FIRE (future value of annuity)
  const monthlyReturn = expectedReturn / 100 / 12;
  const months = yearsToFIRE * 12;
  let monthlySavingsNeeded = 0;
  if (monthlyReturn > 0 && months > 0) {
    const targetFIRE = projections[yearsToFIRE]?.fireNumber || fireNumber;
    const futureSavings =
      currentSavings * Math.pow(1 + monthlyReturn, months);
    const needed = targetFIRE - futureSavings;
    if (needed > 0) {
      monthlySavingsNeeded =
        (needed * monthlyReturn) /
        (Math.pow(1 + monthlyReturn, months) - 1);
    }
  }

  const milestones = generateMilestones(projections, fireNumber);

  return {
    fireNumber: Math.round(fireNumber),
    yearsToFIRE,
    fireAge,
    monthlySavingsNeeded: Math.round(Math.max(0, monthlySavingsNeeded)),
    annualSavings,
    savingsRate: Math.round(savingsRate * 10) / 10,
    projections,
    milestones,
    coastFIRENumber: Math.round(coastFIRENumber),
    coastFIREAge,
    portfolioAtRetirement: Math.round(portfolioAtRetirement),
    inflationAdjustedExpensesAtFIRE: Math.round(
      inflationAdjustedExpensesAtFIRE
    ),
    safeWithdrawalAmount: Math.round(safeWithdrawalAmount),
    yearsMoneyLasts,
    portfolioAtLifeExpectancy: Math.round(portfolioAtLifeExpectancy),
    totalContributions: Math.round(totalContributed),
    totalGrowth: Math.round(totalGrowth),
  };
}

// ── Milestones ────────────────────────────────────────────────────

function generateMilestones(
  projections: YearlyProjection[],
  fireNumber: number
): FIREMilestone[] {
  const milestones: FIREMilestone[] = [];
  const targets = [
    { label: 'Emergency Fund', amount: 30_000, icon: '🛡️' },
    { label: 'First $100K', amount: 100_000, icon: '💫' },
    { label: '25% to FIRE', amount: fireNumber * 0.25, icon: '🌱' },
    { label: 'Halfway There', amount: fireNumber * 0.5, icon: '⚡' },
    { label: '75% to FIRE', amount: fireNumber * 0.75, icon: '🚀' },
    { label: 'FIRE Achieved!', amount: fireNumber, icon: '🔥' },
  ];

  for (const target of targets) {
    if (target.amount <= 0) continue;
    const p = projections.find((p) => p.endBalance >= target.amount);
    if (p) {
      milestones.push({
        label: target.label,
        targetAmount: Math.round(target.amount),
        yearsToReach: p.year,
        ageAtMilestone: p.age,
        icon: target.icon,
      });
    }
  }
  return milestones;
}

// ── FIRE Type Comparison ──────────────────────────────────────────

export function compareFIRETypes(
  inputs: FIREInputs
): {
  type: FIREType;
  label: string;
  icon: string;
  fireNumber: number;
  yearsToFIRE: number;
  fireAge: number;
}[] {
  // Convert monthly to annual for calculations
  const annualExpenses = inputs.monthlyExpenses * 12;
  const partTimeIncome = inputs.monthlyPartTimeIncome * 12;

  return FIRE_TYPES.map((ft) => {
    const adj = annualExpenses * ft.expenseMultiplier;
    const eff =
      ft.type === 'barista'
        ? Math.max(0, adj - partTimeIncome)
        : adj;

    let fireTarget: number;
    if (ft.type === 'coast') {
      const fullFIRE = calculateFIRENumber(adj, inputs.withdrawalRate);
      const coastYears = Math.max(65 - inputs.currentAge, 1);
      fireTarget =
        fullFIRE / Math.pow(1 + inputs.expectedReturn / 100, coastYears);
    } else {
      fireTarget = calculateFIRENumber(eff, inputs.withdrawalRate);
    }

    let balance = inputs.currentSavings;
    const annual = inputs.monthlyContribution * 12;
    const r = inputs.expectedReturn / 100;
    let years = 0;
    while (balance < fireTarget && years < 80) {
      balance = balance * (1 + r) + annual;
      years++;
    }

    return {
      type: ft.type,
      label: ft.label,
      icon: ft.icon,
      fireNumber: Math.round(fireTarget),
      yearsToFIRE: years,
      fireAge: inputs.currentAge + years,
    };
  });
}
