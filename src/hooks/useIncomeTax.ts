import { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  IncomeTaxInputs, 
  DEFAULT_INPUTS, 
  IncomeTaxResult 
} from '../components/IncomeTaxCalculator/IncomeTaxCalculator.types';
import { calculateIncomeTax } from '../components/IncomeTaxCalculator/IncomeTaxCalculator.utils';

const STORAGE_KEY = 'income_tax_inputs_2526';

export const useIncomeTax = () => {
  const [inputs, setInputsRaw] = useState<IncomeTaxInputs>(DEFAULT_INPUTS);

  const result: IncomeTaxResult = useMemo(
    () => calculateIncomeTax(inputs),
    [inputs]
  );

  const updateInputs = useCallback((partial: Partial<IncomeTaxInputs>) => {
    setInputsRaw((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save tax inputs', e);
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setInputsRaw(DEFAULT_INPUTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear tax inputs', e);
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setInputsRaw((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return { inputs, result, updateInputs, reset };
};
