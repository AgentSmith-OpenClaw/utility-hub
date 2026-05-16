import { useState, useCallback, useEffect, useMemo } from 'react';
import type { HSAInputs, HSAResult } from '../components/HSACalculator/HSACalculator.types';
import { calculateHSA } from '../components/HSACalculator/HSACalculator.utils';

const DEFAULTS: HSAInputs = {
  coverageType: 'selfOnly', currentAge: 35, yearsUntilUse: 30,
  currentBalance: 2500, annualContribution: 4400, contributionMethod: 'payroll',
  employerContribution: 500, expectedReturn: 7, fedRate: 22, stateRate: 5,
  annualMedicalWithdrawals: 0,
};

const KEY = 'hsa-calculator-state';

export function useHSACalculator() {
  const [inputs, setRaw] = useState<HSAInputs>(DEFAULTS);
  const result: HSAResult = useMemo(() => calculateHSA(inputs), [inputs]);
  useEffect(() => { try { const s = localStorage.getItem(KEY); if (s) setRaw((p) => ({ ...p, ...JSON.parse(s) })); } catch { /* ignore */ } }, []);
  const update = useCallback((partial: Partial<HSAInputs>) => {
    setRaw((prev) => { const next = { ...prev, ...partial }; try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ } return next; });
  }, []);
  return { inputs, result, update };
}
