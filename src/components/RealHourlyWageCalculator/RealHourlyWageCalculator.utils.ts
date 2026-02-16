import {
  RealHourlyWageInputs,
  RealHourlyWageResult,
  WaterfallPoint,
  HoursSegment,
} from './RealHourlyWageCalculator.types';

export { CHART_COLORS } from '../../utils/chartColors';

export const calculateRealHourlyWage = (
  rawInputs: RealHourlyWageInputs
): RealHourlyWageResult => {
  // Apply remote toggle: zero out commute and food costs
  const inputs = { ...rawInputs };
  if (inputs.is_remote) {
    inputs.commute_daily_minutes = 0;
    inputs.commute_cost_monthly = 0;
    inputs.food_coffee_monthly = 0;
  }

  // Edge case: zero denominator
  if (inputs.hours_per_week <= 0) {
    return {
      summary_metrics: {
        nominal_wage: 0,
        real_wage: 0,
        erosion_percentage: 0,
        remote_equivalent: 0,
      },
      detailed_breakdown: {
        total_annual_hours_invested: 0,
        total_unpaid_hours: 0,
        total_annual_work_costs: 0,
        adjusted_take_home_pay: 0,
      },
      chart_data: { waterfall_series: [], hours_distribution: [] },
      error: 'Hours per week must be greater than 0',
    };
  }

  // Step 1: Time Aggregation
  const working_weeks = 52 - inputs.vacation_weeks;
  const daily_shadow_minutes =
    inputs.commute_daily_minutes +
    inputs.prep_daily_minutes +
    inputs.decompression_daily_minutes;
  const weekly_shadow_hours = (daily_shadow_minutes / 60) * 5; // 5 work days
  const contract_hours = working_weeks * inputs.hours_per_week;
  const total_annual_hours =
    working_weeks *
    (inputs.hours_per_week +
      weekly_shadow_hours +
      inputs.unpaid_overtime_weekly);

  // Step 2: Financial Netting
  const net_annual_income =
    inputs.gross_annual_salary * (1 - inputs.tax_rate / 100);
  const annual_commute_cost = inputs.commute_cost_monthly * 12;
  const annual_food_cost = inputs.food_coffee_monthly * 12;
  const annual_misc_cost = inputs.misc_monthly_costs * 12;
  const total_work_costs =
    annual_commute_cost +
    annual_food_cost +
    inputs.professional_upkeep_annual +
    annual_misc_cost;
  const adjusted_net_income = net_annual_income - total_work_costs;

  // Step 3: Core Metrics
  const nominal_hourly_wage =
    net_annual_income / (52 * inputs.hours_per_week);
  const real_hourly_wage =
    total_annual_hours > 0 ? adjusted_net_income / total_annual_hours : 0;

  const erosion_percent =
    nominal_hourly_wage > 0
      ? ((nominal_hourly_wage - real_hourly_wage) / nominal_hourly_wage) * 100
      : 0;

  const remote_equivalent = real_hourly_wage * (52 * inputs.hours_per_week);

  // Total unpaid hours
  const total_unpaid_hours = total_annual_hours - contract_hours;

  // Chart data: Waterfall (salary erosion)
  const tax_deduction = inputs.gross_annual_salary * (inputs.tax_rate / 100);
  const time_opportunity_cost =
    nominal_hourly_wage > 0
      ? (total_annual_hours - contract_hours) * nominal_hourly_wage
      : 0;

  const waterfall_series: WaterfallPoint[] = [
    {
      name: 'Gross Salary',
      value: inputs.gross_annual_salary,
      cumulative: inputs.gross_annual_salary,
      fill: '#4F46E5',
    },
    {
      name: 'Taxes',
      value: -tax_deduction,
      cumulative: inputs.gross_annual_salary - tax_deduction,
      fill: '#F43F5E',
    },
    {
      name: 'Work Costs',
      value: -total_work_costs,
      cumulative:
        inputs.gross_annual_salary - tax_deduction - total_work_costs,
      fill: '#F97316',
    },
    {
      name: 'Time Cost',
      value: -time_opportunity_cost,
      cumulative:
        inputs.gross_annual_salary -
        tax_deduction -
        total_work_costs -
        time_opportunity_cost,
      fill: '#8B5CF6',
    },
    {
      name: 'Real Income',
      value: adjusted_net_income,
      cumulative: adjusted_net_income,
      fill: '#10B981',
    },
  ];

  // Chart data: 168-hour week donut
  const sleep_hours = 8 * 7; // 56
  const total_shadow_and_overtime =
    weekly_shadow_hours + inputs.unpaid_overtime_weekly;
  const freedom_hours =
    168 - inputs.hours_per_week - total_shadow_and_overtime - sleep_hours;

  const hours_distribution: HoursSegment[] = [
    { name: 'Paid Work', value: Math.max(0, inputs.hours_per_week) },
    {
      name: 'Shadow Work',
      value: Math.max(0, total_shadow_and_overtime),
    },
    { name: 'Sleep', value: sleep_hours },
    { name: 'Freedom', value: Math.max(0, freedom_hours) },
  ];

  return {
    summary_metrics: {
      nominal_wage: nominal_hourly_wage,
      real_wage: real_hourly_wage,
      erosion_percentage: erosion_percent,
      remote_equivalent: remote_equivalent,
    },
    detailed_breakdown: {
      total_annual_hours_invested: total_annual_hours,
      total_unpaid_hours: total_unpaid_hours,
      total_annual_work_costs: total_work_costs,
      adjusted_take_home_pay: adjusted_net_income,
    },
    chart_data: {
      waterfall_series,
      hours_distribution,
    },
    error: null,
  };
};

export const formatCurrency = (
  value: number,
  symbol: string = '$',
  compact: boolean = false
): string => {
  const absValue = Math.abs(value);
  const formatted = compact
    ? absValue >= 1_000_000
      ? (absValue / 1_000_000).toFixed(1) + 'M'
      : absValue >= 1_000
        ? (absValue / 1_000).toFixed(1) + 'K'
        : absValue.toFixed(0)
    : absValue.toLocaleString('en-US', { maximumFractionDigits: 0 });
  return `${value < 0 ? '-' : ''}${symbol}${formatted}`;
};

export const formatHours = (value: number): string => {
  return value.toLocaleString('en-US', { maximumFractionDigits: 1 });
};
