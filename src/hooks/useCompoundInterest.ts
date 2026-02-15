import { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  CompoundInterestInputs, 
  DEFAULT_INPUTS, 
  CompoundInterestResult 
} from '../components/CompoundInterestCalculator/CompoundInterestCalculator.types';
import { calculateCompoundInterest } from '../components/CompoundInterestCalculator/CompoundInterestCalculator.utils';

const STORAGE_KEY = 'compound_interest_inputs';

export const useCompoundInterest = () => {
  const [inputs, setInputsRaw] = useState<CompoundInterestInputs>(DEFAULT_INPUTS);

  const result: CompoundInterestResult = useMemo(
    () => calculateCompoundInterest(inputs),
    [inputs]
  );

  const updateInputs = useCallback((partial: Partial<CompoundInterestInputs>) => {
    setInputsRaw((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setInputsRaw(DEFAULT_INPUTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setInputsRaw((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error('Failed to parse localStorage', e);
    }
  }, []);

  // URL query-param sync
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    params.set('ip', inputs.initialPrincipal.toString());
    params.set('mc', inputs.monthlyContribution.toString());
    params.set('ar', inputs.annualRate.toString());
    params.set('yr', inputs.years.toString());
    params.set('cf', inputs.compoundingFrequency);
    params.set('ir', inputs.inflationRate.toString());
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [inputs]);

  // Load from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ip = params.get('ip');
    const mc = params.get('mc');
    const ar = params.get('ar');
    const yr = params.get('yr');
    const cf = params.get('cf');
    const ir = params.get('ir');

    if (ip || mc || ar || yr || cf || ir) {
      setInputsRaw((prev) => ({
        initialPrincipal: ip ? Number(ip) : prev.initialPrincipal,
        monthlyContribution: mc ? Number(mc) : prev.monthlyContribution,
        annualRate: ar ? Number(ar) : prev.annualRate,
        years: yr ? Number(yr) : prev.years,
        compoundingFrequency: (cf as any) || prev.compoundingFrequency,
        inflationRate: ir ? Number(ir) : prev.inflationRate,
      }));
    }
  }, []);

  return { inputs, result, updateInputs, reset };
};
