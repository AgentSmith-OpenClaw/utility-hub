/**
 * Centralized Chart & Brand Color Configuration
 * ================================================
 * ALL chart colors across every tool must come from here.
 * The primary color matches the logo gradient start (#4F46E5 Indigo 600).
 *
 * IMPORTANT: Main visualizations should use PRIMARY → SECONDARY → ACCENT
 * in that order for consistency across the site.
 *
 * To change any color site-wide, edit ONLY this file.
 */

export const CHART_COLORS = {
  /** Primary brand color — logo gradient start (Indigo 600) */
  primary: '#4F46E5',
  /** Secondary — logo gradient end (Blue 600) */
  secondary: '#2563EB',
  /** Tertiary accent (Cyan 500) */
  accent: '#06B6D4',
  /** Fourth color option (Emerald 500) */
  teal: '#10B981',
  /** Fifth color option (Rose 500) */
  rose: '#F43F5E',
  /** Sixth color option (Purple 500) */
  purple: '#8B5CF6',
  /** Chart grid lines (Slate 100) */
  grid: '#F1F5F9',
  /** Chart axis labels (Slate 400) */
  axis: '#94A3B8',
} as const;

/**
 * Ordered array for pie / donut / bar charts that need indexed colors.
 * Order: primary → secondary → accent → teal → rose → purple
 */
export const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.teal,
  CHART_COLORS.rose,
  CHART_COLORS.purple,
] as const;

export type ChartColorKey = keyof typeof CHART_COLORS;
