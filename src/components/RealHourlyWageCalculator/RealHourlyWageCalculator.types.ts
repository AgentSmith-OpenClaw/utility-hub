export interface RealHourlyWageInputs {
  // Financial
  gross_annual_salary: number;
  tax_rate: number;
  currency_symbol: string;
  // Time
  hours_per_week: number;
  vacation_weeks: number;
  commute_daily_minutes: number;
  prep_daily_minutes: number;
  decompression_daily_minutes: number;
  unpaid_overtime_weekly: number;
  // Costs
  commute_cost_monthly: number;
  food_coffee_monthly: number;
  professional_upkeep_annual: number;
  misc_monthly_costs: number;
  // Remote toggle
  is_remote: boolean;
}

export interface SummaryMetrics {
  nominal_wage: number;
  real_wage: number;
  erosion_percentage: number;
  remote_equivalent: number;
}

export interface DetailedBreakdown {
  total_annual_hours_invested: number;
  total_unpaid_hours: number;
  total_annual_work_costs: number;
  adjusted_take_home_pay: number;
}

export interface WaterfallPoint {
  name: string;
  value: number;
  cumulative: number;
  fill: string;
}

export interface HoursSegment {
  name: string;
  value: number;
}

export interface ChartData {
  waterfall_series: WaterfallPoint[];
  hours_distribution: HoursSegment[];
}

export interface RealHourlyWageResult {
  summary_metrics: SummaryMetrics;
  detailed_breakdown: DetailedBreakdown;
  chart_data: ChartData;
  error: string | null;
}

export const CURRENCY_OPTIONS = ['$', '₹', '£', '€', '¥'] as const;

export const DEFAULT_INPUTS: RealHourlyWageInputs = {
  gross_annual_salary: 75000,
  tax_rate: 25,
  currency_symbol: '$',
  hours_per_week: 40,
  vacation_weeks: 2,
  commute_daily_minutes: 60,
  prep_daily_minutes: 30,
  decompression_daily_minutes: 30,
  unpaid_overtime_weekly: 5,
  commute_cost_monthly: 300,
  food_coffee_monthly: 200,
  professional_upkeep_annual: 1200,
  misc_monthly_costs: 150,
  is_remote: false,
};
