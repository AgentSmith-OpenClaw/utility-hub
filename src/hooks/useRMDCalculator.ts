import { useState, useCallback, useEffect, useMemo } from 'react';
import type { RMDInputs, RMDResult } from '../components/RMDCalculator/RMDCalculator.types';
import { calculateRMD } from '../components/RMDCalculator/RMDCalculator.utils';

const DEFAULTS: RMDInputs = {
  priorYearBalance: 425000,
  currentAge: 73,
  useJointLife: false,
  marginalTaxRate: 22,
  filingStatus: 'single',
  expectedReturn: 5.5,
  projectUntilAge: 100,
};

const KEY = 'rmd-calculator-state';

export function useRMDCalculator() {
  const [inputs, setRaw] = useState<RMDInputs>(DEFAULTS);
  const result: RMDResult = useMemo(() => calculateRMD(inputs), [inputs]);

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) setRaw((p) => ({ ...p, ...JSON.parse(s) })); } catch { /* ignore */ }
  }, []);

  const update = useCallback((partial: Partial<RMDInputs>) => {
    setRaw((prev) => {
      const next = { ...prev, ...partial };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return { inputs, result, update };
}
