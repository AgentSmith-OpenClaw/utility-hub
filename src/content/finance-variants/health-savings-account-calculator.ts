import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'health-savings-account-calculator',
  calculatorId: 'hsa',
  seo: {
    title: 'Health Savings Account (HSA) Calculator | Toolisk',
    metaDescription: 'Calculate HSA growth, triple-tax savings, and the HSA advantage over a taxable account. 2026 IRS contribution limits included. Free.',
    keywords: 'health savings account calculator, hsa calculator, hsa growth calculator, hsa tax savings, hsa benefit calculator',
    ogTitle: 'Health Savings Account Calculator',
    ogDescription: 'Project your HSA balance and quantify all three HSA tax advantages over time.',
  },
  hero: {
    icon: '🏥',
    h1: 'Health Savings Account (HSA) Calculator',
    tagline: 'The HSA is the most tax-efficient account available to working Americans. See how much you can accumulate and what the triple-tax advantage is actually worth.',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    breadcrumbLabel: 'HSA Calculator',
  },
  content: {
    aboutDescription: 'An HSA gives you a tax deduction going in, tax-free growth, and tax-free qualified withdrawals. No other account — not a 401(k), not a Roth — gives all three. This calculator quantifies the advantage.',
    features: [
      '🏥 2026 HSA contribution limits ($4,400 self / $8,750 family)',
      '💰 Year-1 tax savings (federal + state + FICA)',
      '📈 Long-term balance projection',
      '📊 HSA vs taxable account comparison',
      '⚡ FICA savings on payroll contributions',
    ],
    steps: [
      { title: 'Select your coverage type', desc: 'Self-only ($4,400 limit) or family ($8,750 limit) for 2026.' },
      { title: 'Enter contributions', desc: 'Your annual contribution and any employer contribution.' },
      { title: 'Set tax rates', desc: 'Federal rate, state rate, and whether you contribute via payroll (FICA savings).' },
      { title: 'See the advantage', desc: 'Year-1 tax savings, balance projection, and HSA vs taxable comparison.' },
    ],
    faqs: [
      { q: 'What is the 2026 HSA contribution limit?', a: "The IRS set the 2026 HSA limit at $4,400 for self-only coverage and $8,750 for family coverage. If you are 55 or older, you can contribute an additional $1,000 catch-up contribution. These limits include both your contributions and any employer contributions — they count toward the same combined cap." },
      { q: 'What happens to my HSA if I lose HDHP eligibility?', a: "You can no longer contribute to the HSA, but your existing balance stays — you can still invest it, let it grow tax-free, and use it for qualified medical expenses tax-free at any time. The HSA is permanently yours; it doesn't disappear if you switch to a different health plan." },
    ],
    longform: [
      { type: 'h2', text: 'The HSA as a Retirement Account' },
      { type: 'p', text: 'Many financial advisors now recommend treating the HSA as a stealth retirement account: contribute the maximum, pay current medical bills out of pocket (and save the receipts — there is no time limit on reimbursements), and let the HSA compound tax-free for decades. After age 65, you can withdraw for any reason and pay ordinary income tax — just like a Traditional IRA. For medical expenses, withdrawals remain completely tax-free at any age.' },
    ],
  },
};

export default variant;
