import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  MortgagePayoffInputs,
  MortgagePayoffResult,
  DEFAULT_MORTGAGE_PAYOFF_INPUTS,
} from '../components/MortgagePayoffCalculator/MortgagePayoffCalculator.types';
import { calculateMortgagePayoff } from '../components/MortgagePayoffCalculator/MortgagePayoffCalculator.utils';

const STORAGE_KEY = 'mortgage-payoff-inputs';

export const useMortgagePayoff = () => {
  const [inputs, setInputs] = useState<MortgagePayoffInputs>(
    DEFAULT_MORTGAGE_PAYOFF_INPUTS
  );

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setInputs(parsed);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);

  // Calculate result (memoized)
  const result: MortgagePayoffResult = useMemo(() => {
    return calculateMortgagePayoff(inputs);
  }, [inputs]);

  // Update inputs and persist to localStorage
  const updateInputs = useCallback(
    (updates: Partial<MortgagePayoffInputs>) => {
      setInputs((prev) => {
        const next = { ...prev, ...updates };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
        return next;
      });
    },
    []
  );

  // Reset to defaults
  const reset = useCallback(() => {
    setInputs(DEFAULT_MORTGAGE_PAYOFF_INPUTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }, []);

  return {
    inputs,
    result,
    updateInputs,
    reset,
  };
};
