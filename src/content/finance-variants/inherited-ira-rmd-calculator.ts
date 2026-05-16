import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'inherited-ira-rmd-calculator',
  calculatorId: 'rmd',
  seo: {
    title: 'Inherited IRA RMD Calculator | Toolisk',
    metaDescription: 'Estimate Required Minimum Distributions from an Inherited IRA. Understand the 10-year rule and when annual distributions apply. Free.',
    keywords: 'inherited ira rmd calculator, inherited ira distribution, beneficiary ira rmd, 10 year rule inherited ira, rmd inherited ira',
    ogTitle: 'Inherited IRA RMD Calculator',
    ogDescription: 'Understand your distribution requirements from an inherited IRA and plan your withdrawals strategically.',
  },
  hero: {
    icon: '📜',
    h1: 'Inherited IRA RMD Calculator',
    tagline: 'Inherited an IRA? The rules changed significantly with SECURE 2.0. Understand your distribution obligations and plan for the tax impact.',
    gradient: 'from-slate-600 via-gray-600 to-zinc-600',
    breadcrumbLabel: 'Inherited IRA RMD',
  },
  content: {
    aboutDescription: 'Inherited IRA rules are among the most complex in tax law. The SECURE Act (2020) introduced the 10-year rule for most non-spouse beneficiaries. This calculator projects the standard Uniform Lifetime RMD calculation as a baseline — consult a tax advisor for inherited IRA specifics.',
    features: [
      '📜 Uniform Lifetime Table baseline calculation',
      '📅 10-year rule planning context',
      '💰 Annual distribution amounts',
      '🏛️ Federal tax impact estimate',
      '⚠️ Notes on inherited IRA special rules',
    ],
    steps: [
      { title: 'Enter inherited balance', desc: 'Current balance of the inherited account.' },
      { title: 'Select your situation', desc: 'Spouse beneficiary rules differ from non-spouse.' },
      { title: 'Set tax assumptions', desc: 'Your marginal rate — inherited IRA distributions are ordinary income.' },
      { title: 'Plan your withdrawals', desc: 'See distribution amounts and tax impact year by year.' },
    ],
    faqs: [
      { q: 'What is the 10-year rule for inherited IRAs?', a: 'Under SECURE Act (2020), most non-spouse beneficiaries who inherited an IRA after 2019 must empty the account within 10 years of the original owner\'s death. IRS guidance (2023) suggests annual RMDs may be required in years 1-9 for certain beneficiaries — this remains an evolving area. Consult a tax professional.' },
      { q: 'Do spouses have different inherited IRA rules?', a: 'Yes — surviving spouses can treat an inherited IRA as their own, roll it into their own IRA, or use spouse-specific distribution rules. This gives spouses much more flexibility than other beneficiaries, including the ability to delay RMDs until their own RMD start date.' },
    ],
    longform: [
      { type: 'h2', text: 'Inherited IRA Rules Have Changed Significantly' },
      { type: 'p', text: 'The SECURE Act of 2020 eliminated the "stretch IRA" strategy for most beneficiaries, replacing it with the 10-year rule. The IRS has issued multiple pieces of guidance since then, some of which waived penalties for missed distributions in 2021-2024. If you inherited an IRA, professional tax advice is not optional — the stakes are high and the rules are still being clarified.' },
    ],
  },
};

export default variant;
