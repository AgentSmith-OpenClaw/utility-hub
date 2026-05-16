import { useState, useCallback, useEffect, useMemo } from 'react';
import type { CollegeSavings529Inputs, CollegeSavings529Result } from '../components/CollegeSavings529/CollegeSavings529Calculator.types';
import { calculateCollegeSavings529 } from '../components/CollegeSavings529/CollegeSavings529Calculator.utils';

const DEFAULTS: CollegeSavings529Inputs = {
  childAge: 5, yearsOfCollege: 4, currentBalance: 8000, monthlyContribution: 300,
  expectedReturn: 6, stateDeductionRate: 0, stateDeductibleCap: 0,
  currentAnnualCost: 30000, costInflationRate: 5,
};
const KEY = 'college-savings-529-state';

export function useCollegeSavings529() {
  const [inputs, setRaw] = useState<CollegeSavings529Inputs>(DEFAULTS);
  const result: CollegeSavings529Result = useMemo(() => calculateCollegeSavings529(inputs), [inputs]);
  useEffect(() => { try { const s = localStorage.getItem(KEY); if (s) setRaw((p) => ({ ...p, ...JSON.parse(s) })); } catch { /* ignore */ } }, []);
  const update = useCallback((partial: Partial<CollegeSavings529Inputs>) => {
    setRaw((prev) => { const next = { ...prev, ...partial }; try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ } return next; });
  }, []);
  return { inputs, result, update };
}
