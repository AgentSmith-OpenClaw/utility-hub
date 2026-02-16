import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  RealHourlyWageInputs,
  RealHourlyWageResult,
  DEFAULT_INPUTS,
} from '../components/RealHourlyWageCalculator/RealHourlyWageCalculator.types';
import { calculateRealHourlyWage } from '../components/RealHourlyWageCalculator/RealHourlyWageCalculator.utils';

const STORAGE_KEY = 'real_hourly_wage_inputs';

export const useRealHourlyWage = () => {
  const [inputs, setInputsRaw] = useState<RealHourlyWageInputs>(DEFAULT_INPUTS);

  const result: RealHourlyWageResult = useMemo(
    () => calculateRealHourlyWage(inputs),
    [inputs]
  );

  const updateInputs = useCallback(
    (partial: Partial<RealHourlyWageInputs>) => {
      setInputsRaw((prev) => {
        const next = { ...prev, ...partial };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (e) {
          console.error('Failed to save to localStorage', e);
        }
        return next;
      });
    },
    []
  );

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

  // URL query-param sync
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    params.set('sal', inputs.gross_annual_salary.toString());
    params.set('tax', inputs.tax_rate.toString());
    params.set('cur', inputs.currency_symbol);
    params.set('hpw', inputs.hours_per_week.toString());
    params.set('vw', inputs.vacation_weeks.toString());
    params.set('cdm', inputs.commute_daily_minutes.toString());
    params.set('pdm', inputs.prep_daily_minutes.toString());
    params.set('ddm', inputs.decompression_daily_minutes.toString());
    params.set('uow', inputs.unpaid_overtime_weekly.toString());
    params.set('ccm', inputs.commute_cost_monthly.toString());
    params.set('fcm', inputs.food_coffee_monthly.toString());
    params.set('pua', inputs.professional_upkeep_annual.toString());
    params.set('mmc', inputs.misc_monthly_costs.toString());
    params.set('rem', inputs.is_remote ? '1' : '0');

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [inputs]);

  // Load from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sal = params.get('sal');
    const tax = params.get('tax');

    if (sal || tax) {
      setInputsRaw((prev) => ({
        ...prev,
        gross_annual_salary: sal ? Number(sal) : prev.gross_annual_salary,
        tax_rate: tax ? Number(tax) : prev.tax_rate,
        currency_symbol: params.get('cur') || prev.currency_symbol,
        hours_per_week: params.get('hpw') ? Number(params.get('hpw')) : prev.hours_per_week,
        vacation_weeks: params.get('vw') ? Number(params.get('vw')) : prev.vacation_weeks,
        commute_daily_minutes: params.get('cdm') ? Number(params.get('cdm')) : prev.commute_daily_minutes,
        prep_daily_minutes: params.get('pdm') ? Number(params.get('pdm')) : prev.prep_daily_minutes,
        decompression_daily_minutes: params.get('ddm') ? Number(params.get('ddm')) : prev.decompression_daily_minutes,
        unpaid_overtime_weekly: params.get('uow') ? Number(params.get('uow')) : prev.unpaid_overtime_weekly,
        commute_cost_monthly: params.get('ccm') ? Number(params.get('ccm')) : prev.commute_cost_monthly,
        food_coffee_monthly: params.get('fcm') ? Number(params.get('fcm')) : prev.food_coffee_monthly,
        professional_upkeep_annual: params.get('pua') ? Number(params.get('pua')) : prev.professional_upkeep_annual,
        misc_monthly_costs: params.get('mmc') ? Number(params.get('mmc')) : prev.misc_monthly_costs,
        is_remote: params.get('rem') === '1',
      }));
    }
  }, []);

  return { inputs, result, updateInputs, reset };
};
