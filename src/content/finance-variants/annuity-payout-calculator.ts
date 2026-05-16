import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'annuity-payout-calculator',
  calculatorId: 'annuity',
  seo: {
    title: 'Annuity Payout Calculator: Monthly Income | Toolisk',
    metaDescription: 'Calculate how much monthly income your annuity will pay. Enter the lump sum, interest rate, and period — get exact monthly payout. Free.',
    keywords: 'annuity payout calculator, annuity monthly payment, annuity income calculator, how much will my annuity pay, annuity payment',
    ogTitle: 'Annuity Payout Calculator',
    ogDescription: "See exactly how much monthly income your annuity will generate from a given lump sum.",
  },
  hero: {
    icon: '📅',
    h1: 'Annuity Payout Calculator',
    tagline: 'Enter your annuity balance (or planned premium), rate, and payment period — see exactly how much monthly income you will receive.',
    gradient: 'from-amber-600 via-orange-600 to-red-600',
    breadcrumbLabel: 'Annuity Payout Calculator',
  },
  content: {
    aboutDescription: "The annuity payout question is simple: 'how much will I get each month?' This calculator answers it precisely using the standard TVM formula — no estimates, no rules of thumb.",
    features: [
      '📅 Exact monthly, quarterly, or annual payout',
      '💰 Total payout over full payment period',
      '📊 Principal vs interest breakdown',
      '📈 Cumulative payout chart',
      '⚡ COLA adjustment option for inflation protection',
    ],
    steps: [
      { title: 'Enter annuity balance or premium', desc: 'The amount being annuitized.' },
      { title: 'Set rate and period', desc: 'Contract interest rate and number of years.' },
      { title: 'Choose frequency', desc: 'Monthly is most common; quarterly or annually also available.' },
      { title: 'See income amount', desc: 'Exact payout per period and total over the full term.' },
    ],
    faqs: [
      { q: 'Is the annuity payout I calculate the actual amount the insurer will pay?', a: "This calculator uses the standard mathematical formula, which gives a close approximation. The actual payout from an insurance company depends on their current rate, the specific annuity product, your age, and other factors. Request a formal quote from multiple insurers to compare real offers." },
      { q: 'How does the interest rate affect my payout?', a: "The relationship is roughly linear for typical parameters: a 1% increase in the guaranteed rate increases the monthly payout by roughly 5-8% depending on the term. Longer terms amplify the rate effect. Rates vary by insurer and market conditions — shop around." },
    ],
    longform: [
      { type: 'h2', text: "Understanding Your Annuity Payout" },
      { type: 'p', text: "Each annuity payment contains two components: interest earned and return of principal. Early payments are mostly interest; later payments shift toward principal recovery. The payout formula (PMT = PV × r / (1 − (1 + r)^−n)) ensures that exactly the right amount is returned in each period to exhaust the principal by the final payment, while paying the contracted interest rate throughout." },
    ],
  },
};

export default variant;
