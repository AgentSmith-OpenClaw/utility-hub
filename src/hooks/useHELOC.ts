import { useState, useCallback, useEffect, useMemo } from 'react';
import type { HELOCInputs, HELOCResult } from '../components/HELOC/HELOCCalculator.types';
import { calculateHELOC } from '../components/HELOC/HELOCCalculator.utils';

const DEFAULTS: HELOCInputs = {
  homeValue: 525000,
  existingMortgage: 220000,
  maxCLTV: 85,
  drawRate: 8.5,
  repayRate: 8.5,
  drawYears: 10,
  repayYears: 20,
  amountDrawn: 50000,
  drawTiming: 'lump',
};

const KEY = 'heloc-calculator-state';

export function useHELOC() {
  const [inputs, setRaw] = useState<HELOCInputs>(DEFAULTS);
  const result: HELOCResult = useMemo(() => calculateHELOC(inputs), [inputs]);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setRaw((p) => ({ ...p, ...JSON.parse(s) }));
    } catch { /* ignore */ }
  }, []);

  const update = useCallback((partial: Partial<HELOCInputs>) => {
    setRaw((prev) => {
      const next = { ...prev, ...partial };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return { inputs, result, update };
}
