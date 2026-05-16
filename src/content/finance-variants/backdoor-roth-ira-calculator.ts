import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'backdoor-roth-ira-calculator',
  calculatorId: 'roth-conversion',
  seo: {
    title: 'Backdoor Roth IRA Calculator: High Income Strategy | Toolisk',
    metaDescription: 'Calculate the backdoor Roth IRA tax cost for high earners above the direct contribution limit. Model the pro-rata rule and see the net benefit. Free.',
    keywords: 'backdoor roth ira calculator, backdoor roth, backdoor roth ira tax, pro rata rule calculator, backdoor roth high income',
    ogTitle: 'Backdoor Roth IRA Calculator',
    ogDescription: 'Model the backdoor Roth IRA strategy and calculate the tax cost for high earners.',
  },
  hero: {
    icon: '🚪',
    h1: 'Backdoor Roth IRA Calculator',
    tagline: 'Earn too much for a direct Roth IRA contribution? The backdoor Roth is the legal workaround. This calculator shows the tax cost and long-term benefit.',
    gradient: 'from-slate-700 via-slate-600 to-indigo-600',
    breadcrumbLabel: 'Backdoor Roth IRA',
  },
  content: {
    aboutDescription: 'High earners above the Roth IRA income limit ($161,000 single / $240,000 MFJ in 2026) can use the backdoor Roth: contribute to a non-deductible Traditional IRA, then immediately convert to Roth. The conversion calculator models this annual strategy.',
    features: [
      '🚪 Backdoor Roth conversion modeling',
      '📋 Pro-rata rule awareness',
      '💰 Annual tax cost (typically near zero for clean backdoor)',
      '📊 Long-term Roth accumulation',
      '⚠️ IRA aggregation rule warning',
    ],
    steps: [
      { title: 'Enter non-deductible IRA contribution', desc: 'Typically the annual IRA limit ($7,000 in 2026, plus $1,000 catch-up at 50+).' },
      { title: 'Check for existing pre-tax IRA balances', desc: "Pre-tax IRA balances trigger the pro-rata rule and create taxable income." },
      { title: 'Enter tax details', desc: 'Filing status and marginal rate.' },
      { title: 'See tax cost and benefit', desc: 'How much tax the conversion creates and the long-term Roth advantage.' },
    ],
    faqs: [
      { q: 'What is the pro-rata rule for backdoor Roth IRAs?', a: "If you have other Traditional IRA balances (pre-tax or rollover), the IRS taxes backdoor Roth conversions proportionally — you can't just convert the non-deductible portion. Example: $6,000 non-deductible contribution, $54,000 existing pre-tax IRA. Your IRAs are 10% basis (non-deductible). A $6,000 conversion creates $5,400 of taxable income, not zero. The solution is to roll all pre-tax IRA balances into a 401(k) before doing backdoor Roth." },
      { q: 'Can I do a backdoor Roth every year?', a: "Yes — the backdoor Roth is an annual strategy. Contribute $7,000 to a non-deductible Traditional IRA, then convert the full amount to Roth before the balance has time to grow (to minimize taxable gain on conversion). If you do this clean, with no pre-tax IRA balances, the tax cost is approximately zero every year." },
    ],
    longform: [
      { type: 'h2', text: "Backdoor Roth IRA: The Mechanics" },
      { type: 'p', text: "Step 1: Contribute to a Traditional IRA (non-deductible, since you exceed the deductibility income limits). Step 2: Convert the IRA to Roth immediately — before any gains accumulate. Step 3: Report on IRS Form 8606 to track the basis. Done correctly with no existing pre-tax IRA balances, the taxable income from the conversion is $0 (you already paid tax on the contribution). The result is $7,000/year flowing into Roth regardless of income level." },
    ],
  },
};

export default variant;
