import { useState, useCallback, useEffect, useMemo } from 'react';
import type { AnnuityInputs, AnnuityResult } from '../components/AnnuityCalculator/AnnuityCalculator.types';
import { calculateAnnuity } from '../components/AnnuityCalculator/AnnuityCalculator.utils';

const DEFAULTS: AnnuityInputs = {
  mode: 'immediate',
  immediate: { principal: 250000, annualRate: 4.5, years: 20, frequency: 'monthly', cola: 0 },
  deferred: { startingBalance: 25000, periodicContribution: 500, contribFrequency: 'monthly', yearsAccumulation: 25, expectedReturn: 5.5, showIncome: false, incomeYears: 25 },
  fixedPeriod: { solveFor: 'payment', presentValue: 100000, payment: 0, futureValue: 0, annualRate: 5, years: 20, frequency: 'monthly', timing: 'ordinary' },
};

const KEY = 'annuity-calculator-state';

export function useAnnuityCalculator() {
  const [inputs, setRaw] = useState<AnnuityInputs>(DEFAULTS);
  const result: AnnuityResult = useMemo(() => calculateAnnuity(inputs), [inputs]);
  useEffect(() => { try { const s = localStorage.getItem(KEY); if (s) setRaw((p) => ({ ...p, ...JSON.parse(s) })); } catch { /* ignore */ } }, []);
  const update = useCallback((partial: Partial<AnnuityInputs>) => {
    setRaw((prev) => { const next = { ...prev, ...partial }; try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ } return next; });
  }, []);
  const updateImmediate = useCallback((partial: Partial<AnnuityInputs['immediate']>) => {
    setRaw((prev) => { const next = { ...prev, immediate: { ...prev.immediate, ...partial } }; try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ } return next; });
  }, []);
  const updateDeferred = useCallback((partial: Partial<AnnuityInputs['deferred']>) => {
    setRaw((prev) => { const next = { ...prev, deferred: { ...prev.deferred, ...partial } }; try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ } return next; });
  }, []);
  const updateFixed = useCallback((partial: Partial<AnnuityInputs['fixedPeriod']>) => {
    setRaw((prev) => { const next = { ...prev, fixedPeriod: { ...prev.fixedPeriod, ...partial } }; try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ } return next; });
  }, []);
  return { inputs, result, update, updateImmediate, updateDeferred, updateFixed };
}
