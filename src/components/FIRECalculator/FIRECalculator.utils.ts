import {
  FIREInputs,
  FIREResult,
  FIRETypeInfo,
  FIRETypeComparison,
  PostFIREProjection,
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
    tagline: 'Minimalist & frugal',
    description: 'Retire on essential expenses only — minimalist lifestyle, low-cost living',
    expenseMultiplier: 0.6,
    color: 'teal',
    gradient: 'from-teal-500 to-emerald-600',
    bgLight: 'bg-teal-50',
    borderColor: 'border-teal-200',
  },
  {
    type: 'regular',
    label: 'Regular FIRE',
    icon: '🔥',
    tagline: 'Current lifestyle',
    description: 'Maintain your current standard of living without employment',
    expenseMultiplier: 1.0,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    type: 'fat',
    label: 'Fat FIRE',
    icon: '👑',
    tagline: 'Comfortable & lavish',
    description: 'Live abundantly — extra budget for luxury, travel, and comfort',
    expenseMultiplier: 1.5,
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-600',
    bgLight: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
  {
    type: 'coast',
    label: 'Coast FIRE',
    icon: '🏖️',
    tagline: 'Save now, coast later',
    description: 'Front-load savings so compound growth reaches your FIRE number by 65',
    expenseMultiplier: 1.0,
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-600',
    bgLight: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
  },
  {
    type: 'barista',
    label: 'Barista FIRE',
    icon: '☕',
    tagline: 'Part-time + portfolio',
    description: 'Supplement investments with part-time income to cover the gap',
    expenseMultiplier: 1.0,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-200',
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

/**
 * Total monthly expenses is fixed + lifestyle.
 */
export function getTotalMonthlyExpenses(inputs: FIREInputs): number {
  return inputs.monthlyFixedExpenses + inputs.monthlyLifestyleExpenses;
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

// ── Reverse Mode: required monthly contribution ──────────────────

function calculateRequiredContribution(
  fireTarget: number,
  currentSavings: number,
  annualReturn: number,
  years: number
): number {
  if (years <= 0) return 0;
  const monthlyReturn = annualReturn / 100 / 12;
  const months = years * 12;
  if (monthlyReturn <= 0) {
    const needed = fireTarget - currentSavings;
    return Math.max(0, needed / months);
  }
  const futureSavings = currentSavings * Math.pow(1 + monthlyReturn, months);
  const needed = fireTarget - futureSavings;
  if (needed <= 0) return 0;
  return (needed * monthlyReturn) / (Math.pow(1 + monthlyReturn, months) - 1);
}

// ── Core Calculation ──────────────────────────────────────────────

export function calculateFIRE(inputs: FIREInputs): FIREResult {
  const {
    currentAge,
    lifeExpectancy,
    monthlyIncome,
    monthlyFixedExpenses,
    monthlyLifestyleExpenses,
    currentSavings,
    monthlyContribution,
    expectedReturn,
    inflationRate,
    withdrawalRate,
    fireType,
    monthlyPartTimeIncome,
    calculationMode,
    targetYearsToFIRE,
  } = inputs;

  const totalMonthlyExpenses = monthlyFixedExpenses + monthlyLifestyleExpenses;
  const annualIncome = monthlyIncome * 12;
  const annualExpenses = totalMonthlyExpenses * 12;
  const partTimeIncome = monthlyPartTimeIncome * 12;

  const fireTypeInfo = getFireTypeInfo(fireType);
  const baseExpenses = annualExpenses * fireTypeInfo.expenseMultiplier;

  const portfolioExpenses =
    fireType === 'barista'
      ? Math.max(0, baseExpenses - partTimeIncome)
      : baseExpenses;

  // FIRE number in today's dollars
  const fireNumber = calculateFIRENumber(portfolioExpenses, withdrawalRate);

  // Misc = Income - Expenses - Contributions
  const monthlyMisc = monthlyIncome - totalMonthlyExpenses - monthlyContribution;

  // Effective monthly contribution (standard or reverse)
  let effectiveMonthlyContribution = monthlyContribution;
  let requiredMonthlyContribution = 0;

  if (calculationMode === 'reverse') {
    const inflatedFireNumber = adjustForInflation(fireNumber, inflationRate, targetYearsToFIRE);
    requiredMonthlyContribution = Math.max(
      0,
      Math.round(calculateRequiredContribution(
        inflatedFireNumber,
        currentSavings,
        expectedReturn,
        targetYearsToFIRE
      ))
    );
    effectiveMonthlyContribution = requiredMonthlyContribution;
  }

  const annualContribution = effectiveMonthlyContribution * 12;
  const annualSavings = annualIncome - annualExpenses;
  const savingsRate =
    annualIncome > 0 ? (annualSavings / annualIncome) * 100 : 0;

  // Coast FIRE: amount needed now to grow to inflation-adjusted FIRE number by age 65
  const coastTargetAge = 65;
  const yearsToCoast = Math.max(coastTargetAge - currentAge, 1);
  const inflatedFireAtCoastAge = adjustForInflation(fireNumber, inflationRate, yearsToCoast);
  const coastFIRENumber =
    inflatedFireAtCoastAge / Math.pow(1 + expectedReturn / 100, yearsToCoast);

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

      // Coast FIRE milestone = reaching coast number (stop saving)
      // Others = reaching inflation-adjusted full FIRE target
      if (fireType === 'coast') {
        if (balance >= coastFIRENumber && yearsToFIRE === -1) {
          yearsToFIRE = year;
        }
        // Actual retirement (withdrawals begin) at full FIRE number
        if (balance >= currentFireNumber && !isFIREd) {
          isFIREd = true;
        }
      } else {
        if (balance >= currentFireNumber && yearsToFIRE === -1) {
          yearsToFIRE = year;
          isFIREd = true;
        }
      }
    } else {
      withdrawal = startBalance * (withdrawalRate / 100);
      growth = startBalance * (expectedReturn / 100);
      balance = startBalance + growth - withdrawal;
      totalGrowth += growth;
      if (balance < 0) balance = 0;
    }

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
  const currentYear = new Date().getFullYear();
  const fireYear = currentYear + yearsToFIRE;
  const monthsToFIRE = yearsToFIRE * 12; // simplified

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
  const safeMonthlyWithdrawal = safeWithdrawalAmount / 12;

  // Today's withdrawal (if you retired today)
  const todayWithdrawalAnnual = currentSavings * (withdrawalRate / 100);
  const todayWithdrawalMonthly = todayWithdrawalAnnual / 12;

  // For coast FIRE, the displayed "fireNumber" is the coast target, not the full FIRE number
  const displayedFireNumber = fireType === 'coast' ? coastFIRENumber : fireNumber;

  const fireNumberInflationAdjusted = adjustForInflation(
    displayedFireNumber,
    inflationRate,
    yearsToFIRE
  );

  const lifeExpProjection = projections.find((p) => p.age === lifeExpectancy);
  const portfolioAtLifeExpectancy = lifeExpProjection?.endBalance || 0;

  // Monthly savings needed to reach FIRE
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

  // All FIRE type comparison
  const allFireTypes = compareFIRETypes(inputs);

  // Post-FIRE life projections
  const postFIREProjections = generatePostFIREProjections(
    portfolioAtRetirement,
    withdrawalRate,
    expectedReturn,
    inflationRate,
    fireAge,
    lifeExpectancy
  );

  return {
    fireNumber: Math.round(displayedFireNumber),
    fireNumberInflationAdjusted: Math.round(fireNumberInflationAdjusted),
    yearsToFIRE,
    monthsToFIRE,
    fireAge,
    fireYear,
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
    safeMonthlyWithdrawal: Math.round(safeMonthlyWithdrawal),
    todayWithdrawalAnnual: Math.round(todayWithdrawalAnnual),
    todayWithdrawalMonthly: Math.round(todayWithdrawalMonthly),
    yearsMoneyLasts,
    portfolioAtLifeExpectancy: Math.round(portfolioAtLifeExpectancy),
    totalContributions: Math.round(totalContributed),
    totalGrowth: Math.round(totalGrowth),
    monthlyExpenses: totalMonthlyExpenses,
    monthlyMisc,
    monthlyFixed: monthlyFixedExpenses,
    monthlyLifestyle: monthlyLifestyleExpenses,
    requiredMonthlyContribution,
    allFireTypes,
    postFIREProjections,
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
): FIRETypeComparison[] {
  const totalMonthlyExpenses = inputs.monthlyFixedExpenses + inputs.monthlyLifestyleExpenses;
  const annualExpenses = totalMonthlyExpenses * 12;
  const partTimeIncome = inputs.monthlyPartTimeIncome * 12;
  const currentYear = new Date().getFullYear();

  return FIRE_TYPES.map((ft) => {
    const baseExpenses = annualExpenses * ft.expenseMultiplier;
    const basePortfolioExpenses =
      ft.type === 'barista'
        ? Math.max(0, baseExpenses - partTimeIncome)
        : baseExpenses;

    // FIRE number in today's dollars
    const fireNumberToday = calculateFIRENumber(basePortfolioExpenses, inputs.withdrawalRate);

    // Coast FIRE: amount needed now so compound growth reaches inflation-adjusted FIRE by 65
    const coastTargetAge = 65;
    const yearsToCoast = Math.max(coastTargetAge - inputs.currentAge, 1);
    const inflatedFireAtCoastAge = adjustForInflation(fireNumberToday, inputs.inflationRate, yearsToCoast);
    const coastFIRENumber = inflatedFireAtCoastAge / Math.pow(1 + inputs.expectedReturn / 100, yearsToCoast);

    // Year-by-year projection — matches calculateFIRE logic exactly
    let balance = inputs.currentSavings;
    const annualContribution = inputs.monthlyContribution * 12;
    const r = inputs.expectedReturn / 100;
    let years = 0;
    let coastReached = false;
    const isCoast = ft.type === 'coast';

    for (let year = 0; year <= 80; year++) {
      const startBalance = balance;

      // Inflation-adjusted FIRE target for this year (same as main calc)
      const inflatedBase = adjustForInflation(baseExpenses, inputs.inflationRate, year);
      const inflatedPortfolioExpenses =
        ft.type === 'barista'
          ? Math.max(0, inflatedBase - adjustForInflation(partTimeIncome, inputs.inflationRate, year))
          : adjustForInflation(basePortfolioExpenses, inputs.inflationRate, year);
      const currentFireTarget = calculateFIRENumber(inflatedPortfolioExpenses, inputs.withdrawalRate);

      // Coast FIRE: stop contributions once coast number is reached
      let contributions = annualContribution;
      if (isCoast) {
        if (coastReached || startBalance >= coastFIRENumber) {
          coastReached = true;
          contributions = 0;
        }
      }

      const growth = startBalance * r;
      balance = startBalance + contributions + growth;

      // Coast FIRE milestone = reaching coast number (stop saving)
      // All others = reaching inflation-adjusted full FIRE target
      if (isCoast) {
        if (balance >= coastFIRENumber) {
          years = year;
          break;
        }
      } else {
        if (balance >= currentFireTarget) {
          years = year;
          break;
        }
      }

      if (year === 80) years = 80;
    }

    // For coast, show the coast FIRE number; for others, show today's FIRE number
    const displayFireNumber = isCoast ? Math.round(coastFIRENumber) : Math.round(fireNumberToday);
    const fireNumberInflationAdjusted = adjustForInflation(displayFireNumber, inputs.inflationRate, years);
    // Withdrawal based on actual portfolio at retirement (not static target)
    const annualWithdrawal = balance * (inputs.withdrawalRate / 100);
    const reqContrib = calculateRequiredContribution(
      fireNumberInflationAdjusted,
      inputs.currentSavings,
      inputs.expectedReturn,
      years
    );

    return {
      type: ft.type,
      label: ft.label,
      icon: ft.icon,
      tagline: ft.tagline,
      description: ft.description,
      fireNumber: displayFireNumber,
      fireNumberInflationAdjusted: Math.round(fireNumberInflationAdjusted),
      yearsToFIRE: years,
      fireAge: inputs.currentAge + years,
      fireYear: currentYear + years,
      monthlyWithdrawal: Math.round(annualWithdrawal / 12),
      annualWithdrawal: Math.round(annualWithdrawal),
      requiredMonthlyContribution: Math.round(Math.max(0, reqContrib)),
      portfolioAtRetirement: Math.round(balance),
    };
  });
}

// ── Post-FIRE Life Projections ────────────────────────────────────

export function generatePostFIREProjections(
  portfolioAtRetirement: number,
  withdrawalRate: number,
  expectedReturn: number,
  inflationRate: number,
  fireAge: number,
  lifeExpectancy: number
): PostFIREProjection[] {
  const projections: PostFIREProjection[] = [];
  let balance = portfolioAtRetirement;
  const totalYears = Math.max(lifeExpectancy - fireAge + 10, 30);
  let annualWithdrawal = portfolioAtRetirement * (withdrawalRate / 100);

  for (let y = 0; y <= totalYears; y++) {
    const age = fireAge + y;
    const startBalance = balance;
    const withdrawal = y === 0 ? 0 : annualWithdrawal;
    const growth = startBalance * (expectedReturn / 100);
    balance = startBalance + growth - withdrawal;
    if (balance < 0) balance = 0;

    projections.push({
      year: y,
      age,
      startBalance: Math.round(startBalance),
      withdrawal: Math.round(withdrawal),
      growth: Math.round(growth),
      endBalance: Math.round(Math.max(balance, 0)),
    });

    // Increase withdrawal by inflation each year
    annualWithdrawal = annualWithdrawal * (1 + inflationRate / 100);
    if (balance <= 0) break;
  }
  return projections;
}
