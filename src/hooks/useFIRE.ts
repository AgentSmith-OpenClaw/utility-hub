import { useState, useCallback, useEffect, useMemo } from 'react';
import { FIREInputs, FIREResult } from '../components/FIRECalculator/FIRECalculator.types';
import { calculateFIRE } from '../components/FIRECalculator/FIRECalculator.utils';

const DEFAULT_INPUTS: FIREInputs = {
  currentAge: 28,
  lifeExpectancy: 85,
  monthlyIncome: 6667,

  // Split expenses
  monthlyFixedExpenses: 2000,      // rent, utilities, insurance, groceries
  monthlyLifestyleExpenses: 1333,  // dining, movies, vacations, hobbies

  currentSavings: 50000,
  monthlyContribution: 2000,
  expectedReturn: 7,
  inflationRate: 3,
  withdrawalRate: 4,
  stockAllocation: 80,
  fireType: 'regular',
  monthlyPartTimeIncome: 1667,
  currency: 'USD',

  // Reverse mode
  calculationMode: 'standard',
  targetYearsToFIRE: 15,
};

const STORAGE_KEY = 'fire-calculator-state';

export const useFIRE = () => {
  const [inputs, setInputsRaw] = useState<FIREInputs>(DEFAULT_INPUTS);

  // Derived result — always in sync with inputs, single render per change
  const result: FIREResult = useMemo(() => calculateFIRE(inputs), [inputs]);

  // Load saved state from localStorage after hydration
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setInputsRaw((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const updateInputs = useCallback((partial: Partial<FIREInputs>) => {
    setInputsRaw((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore write errors
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setInputsRaw(DEFAULT_INPUTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore errors
    }
  }, []);

  return { inputs, result, updateInputs, reset };
};
