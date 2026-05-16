import { useState, useCallback, useEffect, useMemo } from 'react';
import type { ReverseMortgageInputs, ReverseMortgageResult } from '../components/ReverseMortgage/ReverseMortgageCalculator.types';
import { calculateReverseMortgage } from '../components/ReverseMortgage/ReverseMortgageCalculator.utils';

const DEFAULTS: ReverseMortgageInputs = {
  homeValue: 525000, existingMortgageBalance: 60000, otherClosingCosts: 2500,
  borrowerAge: 70, coBorrowerAge: null, expectedRate: 6.0,
  payoutChoice: 'tenure', termYears: 10, homeAppreciation: 3.5,
};
const KEY = 'reverse-mortgage-state';

export function useReverseMortgage() {
  const [inputs, setRaw] = useState<ReverseMortgageInputs>(DEFAULTS);
  const result: ReverseMortgageResult = useMemo(() => calculateReverseMortgage(inputs), [inputs]);
  useEffect(() => { try { const s = localStorage.getItem(KEY); if (s) setRaw((p) => ({ ...p, ...JSON.parse(s) })); } catch { /* ignore */ } }, []);
  const update = useCallback((partial: Partial<ReverseMortgageInputs>) => {
    setRaw((prev) => { const next = { ...prev, ...partial }; try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ } return next; });
  }, []);
  return { inputs, result, update };
}
