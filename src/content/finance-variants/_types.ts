// Variant authoring types for the finance SEO multi-URL system.
// A "variant" is a long-form SEO page that reuses an existing calculator
// component under a different keyword/URL with bespoke surrounding copy.
//
// Variants are pure data (no JSX) — see _registry.ts for the list, and
// src/pages/finance/[variant].tsx for the renderer that turns them into pages.

export type CalculatorId =
  | 'emi'
  | 'mortgage'
  | 'amortization'
  | 'sip'
  | 'compound-interest'
  | 'fire'
  | 'buy-vs-rent'
  | 'income-tax'
  | 'us-paycheck'
  | 'credit-card-payoff'
  | '401k'
  | 'roth-vs-traditional-ira'
  | 'auto-loan'
  | 'student-loan'
  | 'investment'
  | 'rental-roi'
  | 'net-worth'
  | 'inflation'
  | 'sales-tax-vat-gst'
  | 'tip'
  | 'house-affordability'
  | 'social-security';

export type LongformBlock =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; tone: 'tip' | 'warning' | 'info'; text: string };

export interface FaqEntry {
  q: string;
  a: string;
}

export interface HowToStepEntry {
  title: string;
  desc: string;
}

export interface RelatedLink {
  name: string;
  href: string;
  icon: string;
}

export interface FinanceVariant {
  /** URL path under /finance/, e.g. 'emi-prepayment-calculator' (no leading slash). */
  slug: string;

  /** Which underlying calculator component to render. */
  calculatorId: CalculatorId;

  // ------- SEO meta -------
  seo: {
    /** <title> — keep under 60 chars where possible. */
    title: string;
    /** <meta name="description"> — 140–160 chars sweet spot. */
    metaDescription: string;
    /** comma-separated meta keywords */
    keywords: string;
    ogTitle?: string;
    ogDescription?: string;
  };

  // ------- Hero / ToolShell -------
  hero: {
    icon: string;
    /** H1 shown in ToolShell header. */
    h1: string;
    /** Sub-headline under H1. */
    tagline: string;
    /** Tailwind gradient classes for hero band. */
    gradient?: string;
    /** Short label used in breadcrumb (e.g., 'EMI Prepayment Calculator'). */
    breadcrumbLabel: string;
  };

  // ------- ToolSEOContent body -------
  content: {
    /** Lead paragraph in the "About this tool" card. */
    aboutDescription: string;
    /** Feature bullets — each must start with an emoji + space. */
    features: string[];
    /** Numbered "How to use" steps. */
    steps: HowToStepEntry[];
    /** FAQ entries (also emitted as FAQPage JSON-LD). */
    faqs: FaqEntry[];
    /** Optional longform body rendered between How-to and FAQ. Data-only. */
    longform?: LongformBlock[];
  };

  // ------- Schema.org overrides -------
  schema?: {
    /** SoftwareApplication.name — defaults to hero.h1. */
    softwareName?: string;
    /** SoftwareApplication.featureList. */
    softwareFeatures?: string;
  };

  // ------- Cross-linking -------
  /**
   * Explicit related links (shown alongside auto-generated peer variants).
   * Optional — peers from the same calculatorId are added automatically.
   */
  relatedTools?: RelatedLink[];

  /** Disable auto peer-variant section if you want full manual control. */
  showPeers?: boolean;
}
