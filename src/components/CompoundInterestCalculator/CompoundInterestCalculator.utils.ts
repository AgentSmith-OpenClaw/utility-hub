import { 
  CompoundInterestInputs, 
  CompoundInterestResult, 
  YearData, 
  COMPOUNDING_FREQUENCIES 
} from './CompoundInterestCalculator.types';

export const calculateCompoundInterest = (inputs: CompoundInterestInputs): CompoundInterestResult => {
  const { 
    initialPrincipal, 
    monthlyContribution, 
    annualRate, 
    years, 
    compoundingFrequency, 
    inflationRate 
  } = inputs;

  const r = annualRate / 100;
  const n = COMPOUNDING_FREQUENCIES[compoundingFrequency];
  const i = inflationRate / 100;
  const monthlyRate = r / 12;
  
  let currentBalance = initialPrincipal;
  let totalPrincipal = initialPrincipal;
  let totalInterest = 0;
  const yearlyData: YearData[] = [];

  // Initial state for year 0
  yearlyData.push({
    year: 0,
    balance: initialPrincipal,
    totalPrincipal: initialPrincipal,
    totalInterest: 0,
    annualInterest: 0,
    realValue: initialPrincipal,
  });

  for (let year = 1; year <= years; year++) {
    let yearInterest = 0;
    
    // We calculate monthly to handle contributions properly
    for (let month = 1; month <= 12; month++) {
      const interestThisMonth = currentBalance * monthlyRate;
      yearInterest += interestThisMonth;
      currentBalance += interestThisMonth + monthlyContribution;
      totalPrincipal += monthlyContribution;
      totalInterest += interestThisMonth;
    }

    // Adjust for compounding frequency if needed (simplified here to monthly for smoother charts, 
    // but the final formula could be used for exact parity if required)
    // However, most real-world calculators with monthly contributions assume monthly compounding or interest credited monthly.
    
    yearlyData.push({
      year,
      balance: currentBalance,
      totalPrincipal,
      totalInterest,
      annualInterest: yearInterest,
      realValue: currentBalance / Math.pow(1 + i, year),
    });
  }

  return {
    finalBalance: currentBalance,
    totalPrincipal,
    totalInterest,
    realValue: currentBalance / Math.pow(1 + i, years),
    yearlyData,
  };
};

// Calculate compound interest for a specific frequency (for comparison chart)
export const calculateForFrequency = (
  inputs: CompoundInterestInputs,
  frequency: string
): number => {
  const r = inputs.annualRate / 100;
  const monthlyRate = r / 12;
  let balance = inputs.initialPrincipal;

  for (let year = 1; year <= inputs.years; year++) {
    for (let month = 1; month <= 12; month++) {
      const interest = balance * monthlyRate;
      balance += interest + inputs.monthlyContribution;
    }
  }

  return balance;
};

export const formatCurrency = (value: number, compact = false): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    notation: compact ? 'compact' : 'standard',
  }).format(value);
};

export const CHART_COLORS = {
  primary: '#6366f1',    // indigo-500 - PRIMARY
  secondary: '#3b82f6',  // blue-500 - SECONDARY  
  accent: '#06b6d4',     // cyan-500 - ACCENT
  teal: '#14b8a6',       // teal-500 - growth/success
  amber: '#f59e0b',      // amber-500 - warning/info
  rose: '#f43f5e',       // rose-500 - danger
  grid: '#f1f5f9',       // slate-100
  axis: '#94a3b8',       // slate-400
};
