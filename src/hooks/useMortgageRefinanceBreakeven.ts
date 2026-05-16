import { useState, useCallback, useEffect, useMemo } from 'react';
import type { MortgageRefinanceInputs, MortgageRefinanceResult } from '../components/MortgageRefinanceBreakeven/MortgageRefinanceBreakeven.types';
import { calculateRefinance } from '../components/MortgageRefinanceBreakeven/MortgageRefinanceBreakeven.utils';

const DEFAULT_INPUTS: MortgageRefinanceInputs = {
  currentBalance: 280000,
  currentRate: 6.75,
  yearsRemaining: 27,
  newRate: 5.5,
  newTermYears: 30,
  closingCosts: 5500,
  closingCostHandling: 'upfront',
  stayYears: 10,
  cashOut: 0,
};

const STORAGE_KEY = 'mortgage-refinance-breakeven-state';

export function useMortgageRefinanceBreakeven() {
  const [inputs, setInputsRaw] = useState<MortgageRefinanceInputs>(DEFAULT_INPUTS);

  const result: MortgageRefinanceResult = useMemo(() => calculateRefinance(inputs), [inputs]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setInputsRaw((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore
    }
  }, []);

  const updateInputs = useCallback((partial: Partial<MortgageRefinanceInputs>) => {
    setInputsRaw((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { inputs, result, updateInputs };
}
