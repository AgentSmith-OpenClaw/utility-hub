export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'INR';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US', flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE', flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB', flag: '🇬🇧' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU', flag: '🇦🇺' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA', flag: '🇨🇦' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN', flag: '🇮🇳' },
};

export const CURRENCY_LIST: Currency[] = Object.values(CURRENCIES);

export function formatCurrency(value: number, code: CurrencyCode = 'USD', maxFractionDigits = 0): string {
  if (!isFinite(value)) return '—';
  const currency = CURRENCIES[code];
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: code,
      maximumFractionDigits: maxFractionDigits,
      minimumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency.symbol}${value.toLocaleString(undefined, { maximumFractionDigits: maxFractionDigits })}`;
  }
}

export function formatCurrencyCompact(value: number, code: CurrencyCode = 'USD'): string {
  if (!isFinite(value)) return '—';
  const currency = CURRENCIES[code];
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1e9) return `${sign}${currency.symbol}${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}${currency.symbol}${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}${currency.symbol}${(abs / 1e3).toFixed(1)}K`;
  return `${sign}${currency.symbol}${abs.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

const STORAGE_KEY = 'toolisk_currency';

const LOCALE_CURRENCY_MAP: Record<string, CurrencyCode> = {
  'en-IN': 'INR', 'hi': 'INR', 'hi-IN': 'INR', 'bn': 'INR', 'ta': 'INR',
  'te': 'INR', 'mr': 'INR', 'gu': 'INR', 'kn': 'INR', 'ml': 'INR',
  'pa': 'INR', 'or': 'INR', 'as': 'INR',
  'en-US': 'USD', 'en-CA': 'CAD', 'en-AU': 'AUD', 'en-GB': 'GBP',
  'de': 'EUR', 'fr': 'EUR', 'es': 'EUR', 'it': 'EUR', 'pt': 'EUR', 'nl': 'EUR',
};

function detectCurrencyFromLocale(): CurrencyCode {
  if (typeof navigator === 'undefined') return 'USD';
  const lang = navigator.language;
  if (lang in LOCALE_CURRENCY_MAP) return LOCALE_CURRENCY_MAP[lang];
  const base = lang.split('-')[0];
  if (base in LOCALE_CURRENCY_MAP) return LOCALE_CURRENCY_MAP[base];
  return 'USD';
}

export function getStoredCurrency(): CurrencyCode {
  if (typeof window === 'undefined') return 'USD';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && stored in CURRENCIES) return stored as CurrencyCode;
  return detectCurrencyFromLocale();
}

export function setStoredCurrency(code: CurrencyCode): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, code);
}
