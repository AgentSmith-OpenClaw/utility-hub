/**
 * Inflation Calculator Utilities
 * Logic for calculating purchasing power over time based on CPI data.
 */

export interface InflationResult {
  futureValue: number;
  totalInflation: number;
  cumulativeRate: number;
}

/**
 * Historical US CPI Data (Average Annual)
 * Source: BLS (Simplified for common use)
 * Format: [Year, Avg CPI]
 */
export const US_CPI_DATA: Record<number, number> = {
  1913: 9.9,
  1920: 20.0,
  1930: 16.7,
  1940: 14.0,
  1950: 24.1,
  1960: 29.6,
  1970: 38.8,
  1980: 82.4,
  1990: 130.7,
  2000: 172.2,
  2001: 177.1,
  2002: 179.9,
  2003: 184.0,
  2004: 188.9,
  2005: 195.3,
  2006: 201.6,
  2007: 207.3,
  2008: 215.3,
  2009: 214.5,
  2010: 218.056,
  2011: 224.939,
  2012: 229.594,
  2013: 232.957,
  2014: 236.736,
  2015: 237.017,
  2016: 240.007,
  2017: 245.120,
  2018: 251.107,
  2019: 255.657,
  2020: 258.811,
  2021: 270.970,
  2022: 292.655,
  2023: 304.702,
  2024: 313.2, // Estimated
  2025: 320.1, // Estimated
  2026: 322.6  // Estimated based on Jan 2026 data
};

/**
 * Calculates the value of money across two different years based on CPI.
 * 
 * Formula: Value2 = Value1 * (CPI2 / CPI1)
 */
export const calculatePurchasingPower = (
  amount: number,
  startYear: number,
  endYear: number,
  cpiData: Record<number, number> = US_CPI_DATA
): InflationResult => {
  const cpiStart = cpiData[startYear];
  const cpiEnd = cpiData[endYear];

  if (!cpiStart || !cpiEnd) {
    throw new Error("CPI data not available for selected years.");
  }

  const futureValue = amount * (cpiEnd / cpiStart);
  const totalInflation = futureValue - amount;
  const cumulativeRate = ((cpiEnd - cpiStart) / cpiStart) * 100;

  return {
    futureValue,
    totalInflation,
    cumulativeRate,
  };
};

/**
 * Predicts future value based on a constant estimated inflation rate.
 */
export const predictFutureInflation = (
  amount: number,
  years: number,
  annualRate: number
): number => {
  return amount * Math.pow(1 + annualRate / 100, years);
};
