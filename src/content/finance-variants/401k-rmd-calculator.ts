import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: '401k-rmd-calculator',
  calculatorId: 'rmd',
  seo: {
    title: '401(k) RMD Calculator: Required Minimum Distribution | Toolisk',
    metaDescription: 'Calculate your 401(k) Required Minimum Distribution using IRS tables. Project future withdrawals from your 401k, 403b, or similar plan. Free.',
    keywords: '401k rmd calculator, 401k required minimum distribution, 401k rmd age, rmd 401k, 403b rmd calculator',
    ogTitle: '401(k) RMD Calculator',
    ogDescription: 'Compute 401(k) Required Minimum Distributions and project future RMDs through retirement.',
  },
  hero: {
    icon: '💼',
    h1: '401(k) Required Minimum Distribution Calculator',
    tagline: 'Use the same IRS Uniform Lifetime Table used for IRAs to calculate your 401(k), 403(b), or 457(b) RMD for this year and every year ahead.',
    gradient: 'from-blue-600 via-indigo-600 to-violet-600',
    breadcrumbLabel: '401(k) RMD Calculator',
  },
  content: {
    aboutDescription: '401(k), 403(b), and 457(b) plans are all subject to the same RMD rules as Traditional IRAs — same table, same age trigger, same penalty. The main difference: if you\'re still working at 73, you may be able to delay 401(k) RMDs for your current employer\'s plan.',
    features: [
      '💼 Works for 401(k), 403(b), 457(b), and similar pre-tax plans',
      '📋 IRS Uniform Lifetime Table (post-SECURE 2.0)',
      '💰 RMD amount and estimated federal tax',
      '📈 Future-year projection to age 100',
      '📊 Balance trajectory with investment return assumption',
    ],
    steps: [
      { title: 'Enter plan balance', desc: 'Balance as of December 31 of last year.' },
      { title: 'Enter your age', desc: 'Your age at year-end for this tax year.' },
      { title: 'Set return assumption', desc: 'Expected portfolio return after withdrawals.' },
      { title: 'Project your RMDs', desc: 'See annual distribution requirements through your target age.' },
    ],
    faqs: [
      { q: 'Can I delay 401(k) RMDs if I\'m still working?', a: 'Yes — if you are still employed at age 73 and don\'t own more than 5% of the company, you can delay RMDs from your current employer\'s 401(k) until you retire. This exception does not apply to old 401(k)s or IRAs.' },
      { q: 'Can I roll my 401(k) into a Roth to avoid RMDs?', a: "Yes — rolling a 401(k) into a Roth IRA triggers a taxable conversion but eliminates future RMDs from that amount. Whether this is beneficial depends on today's vs. future tax rates. Use the Roth Conversion Calculator to model it." },
    ],
    longform: [
      { type: 'h2', text: '401(k) RMD Rules vs IRA RMD Rules' },
      { type: 'p', text: 'The RMD calculation is identical for 401(k)s and Traditional IRAs — same Uniform Lifetime Table, same formula. The key practical difference: you cannot aggregate 401(k) RMDs the way you can IRA RMDs. Each 401(k) plan must have its RMD satisfied from that plan specifically. You cannot take the combined RMD from one 401(k) while leaving another untouched.' },
    ],
  },
};

export default variant;
