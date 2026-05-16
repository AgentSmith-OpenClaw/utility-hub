import { useState, useCallback, useEffect, useMemo } from 'react';
import type { RothConversionInputs, RothConversionResult } from '../components/RothConversion/RothConversionCalculator.types';
import { calculateRothConversion } from '../components/RothConversion/RothConversionCalculator.utils';

const DEFAULTS: RothConversionInputs = {
  conversionAmount: 100000, taxSource: 'outside', filingStatus: 'single',
  otherIncome: 95000, stateRate: 5, currentAge: 50,
  yearsUntilWithdrawal: 15, expectedReturn: 7, retirementTaxRate: 22,
};
const KEY = 'roth-conversion-state';

export function useRothConversion() {
  const [inputs, setRaw] = useState<RothConversionInputs>(DEFAULTS);
  const result: RothConversionResult = useMemo(() => calculateRothConversion(inputs), [inputs]);
  useEffect(() => { try { const s = localStorage.getItem(KEY); if (s) setRaw((p) => ({ ...p, ...JSON.parse(s) })); } catch { /* ignore */ } }, []);
  const update = useCallback((partial: Partial<RothConversionInputs>) => {
    setRaw((prev) => { const next = { ...prev, ...partial }; try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ } return next; });
  }, []);
  return { inputs, result, update };
}
