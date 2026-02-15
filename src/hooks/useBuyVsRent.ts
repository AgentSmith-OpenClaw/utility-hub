import { useState, useMemo, useCallback, useEffect } from 'react';
import { BuyVsRentInputs, BuyVsRentResult, DEFAULT_BUY_VS_RENT_INPUTS } from '../components/BuyVsRent/BuyVsRent.types';
import { calculateBuyVsRent } from '../components/BuyVsRent/BuyVsRent.utils';

const STORAGE_KEY = 'buy-vs-rent-inputs';

export const useBuyVsRent = () => {
  const [inputs, setInputs] = useState<BuyVsRentInputs>(DEFAULT_BUY_VS_RENT_INPUTS);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setInputs(parsed);
      }
    } catch (error) {
      // Silent fail - use defaults
      console.error('Error loading from localStorage:', error);
    }
  }, []);

  // Calculate result (memoized)
  const result: BuyVsRentResult = useMemo(() => {
    return calculateBuyVsRent(inputs);
  }, [inputs]);

  // Update inputs and persist to localStorage
  const updateInputs = useCallback((updates: Partial<BuyVsRentInputs>) => {
    setInputs((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      return next;
    });
  }, []);

  // Reset to defaults
  const reset = useCallback(() => {
    setInputs(DEFAULT_BUY_VS_RENT_INPUTS);
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
