import { useCallback, useEffect, useMemo, useState } from 'react';
import { calculateSIP } from '../components/SIPWealthPlanner/SIPWealthPlanner.utils';
import { SIPInputs } from '../components/SIPWealthPlanner/SIPWealthPlanner.types';

const STORAGE_KEY = 'sip-wealth-planner-state';

const DEFAULT_INPUTS: SIPInputs = {
  monthlyInvestment: 5000,
  tenureYears: 20,
  annualReturn: 12,
  lumpsumAmount: 0,
  stepUpMode: 'percent',
  stepUpValue: 10,
  inflationEnabled: true,
  inflationRate: 6,
  mode: 'wealth',
  targetCorpus: 10_000_000,
  currency: 'INR',
  compareWithFlat: true,
};

export const useSIPPlanner = () => {
  const [inputs, setInputsRaw] = useState<SIPInputs>(DEFAULT_INPUTS);

  const result = useMemo(() => calculateSIP(inputs), [inputs]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setInputsRaw((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      return;
    }
  }, []);

  const updateInputs = useCallback((partial: Partial<SIPInputs>) => {
    setInputsRaw((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        return next;
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setInputsRaw(DEFAULT_INPUTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      return;
    }
  }, []);

  return { inputs, result, updateInputs, reset };
};
