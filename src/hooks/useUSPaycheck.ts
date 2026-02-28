import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  USPaycheckInputs,
  DEFAULT_INPUTS,
  PaycheckBreakdown,
  PreTaxDeductions,
} from '../components/USPaycheckCalculator/USPaycheckCalculator.types';
import { calculatePaycheck } from '../components/USPaycheckCalculator/USPaycheckCalculator.utils';

const STORAGE_KEY = 'us_paycheck_inputs';

export const useUSPaycheck = () => {
  const [inputs, setInputsRaw] = useState<USPaycheckInputs>(DEFAULT_INPUTS);

  const result: PaycheckBreakdown = useMemo(
    () => calculatePaycheck(inputs),
    [inputs]
  );

  const updateInputs = useCallback((partial: Partial<USPaycheckInputs>) => {
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

  const updateDeductions = useCallback((partial: Partial<PreTaxDeductions>) => {
    setInputsRaw((prev) => {
      const next = {
        ...prev,
        preTaxDeductions: { ...prev.preTaxDeductions, ...partial },
      };
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

  // URL query-param sync (write)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    params.set('gi', inputs.grossIncome.toString());
    params.set('pf', inputs.payFrequency);
    params.set('fs', inputs.filingStatus);
    params.set('st', inputs.state);
    params.set('401k', inputs.preTaxDeductions.retirement401k.toString());
    params.set('hsa', inputs.preTaxDeductions.hsaContribution.toString());
    params.set('ira', inputs.preTaxDeductions.traditionalIRA.toString());

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [inputs]);

  // Load from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gi = params.get('gi');
    const pf = params.get('pf');
    const fs = params.get('fs');
    const st = params.get('st');
    const r401k = params.get('401k');
    const hsa = params.get('hsa');
    const ira = params.get('ira');

    if (gi || pf || fs || st || r401k || hsa || ira) {
      setInputsRaw((prev) => ({
        ...prev,
        grossIncome: gi ? Number(gi) : prev.grossIncome,
        payFrequency: (pf as any) || prev.payFrequency,
        filingStatus: (fs as any) || prev.filingStatus,
        state: st || prev.state,
        preTaxDeductions: {
          retirement401k: r401k ? Number(r401k) : prev.preTaxDeductions.retirement401k,
          hsaContribution: hsa ? Number(hsa) : prev.preTaxDeductions.hsaContribution,
          traditionalIRA: ira ? Number(ira) : prev.preTaxDeductions.traditionalIRA,
        },
      }));
    }
  }, []);

  return { inputs, result, updateInputs, updateDeductions, reset };
};
