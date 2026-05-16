import { useState, useCallback, useEffect, useMemo } from 'react';
import type { CapitalGainsTaxInputs, CapitalGainsTaxResult } from '../components/CapitalGainsTax/CapitalGainsTaxCalculator.types';
import { calculateCapitalGainsTax } from '../components/CapitalGainsTax/CapitalGainsTaxCalculator.utils';

const today = new Date();
const twoYearsAgo = new Date(today);
twoYearsAgo.setFullYear(today.getFullYear() - 2);

const DEFAULTS: CapitalGainsTaxInputs = {
  assetType: 'stocks', purchasePrice: 10000, salePrice: 25000, sellingFees: 50,
  improvements: 0,
  purchaseDate: twoYearsAgo.toISOString().slice(0, 10),
  saleDate: today.toISOString().slice(0, 10),
  section121Eligible: false, filingStatus: 'single',
  otherOrdinaryIncome: 95000, otherInvestmentIncome: 0, stateRate: 5,
};
const KEY = 'capital-gains-tax-state';

export function useCapitalGainsTax() {
  const [inputs, setRaw] = useState<CapitalGainsTaxInputs>(DEFAULTS);
  const result: CapitalGainsTaxResult = useMemo(() => calculateCapitalGainsTax(inputs), [inputs]);
  useEffect(() => { try { const s = localStorage.getItem(KEY); if (s) setRaw((p) => ({ ...p, ...JSON.parse(s) })); } catch { /* ignore */ } }, []);
  const update = useCallback((partial: Partial<CapitalGainsTaxInputs>) => {
    setRaw((prev) => { const next = { ...prev, ...partial }; try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ } return next; });
  }, []);
  return { inputs, result, update };
}
