import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'heloc-payment-calculator',
  calculatorId: 'heloc',
  seo: {
    title: 'HELOC Payment Calculator: Draw & Repayment | Toolisk',
    metaDescription: 'Calculate your monthly HELOC payment for both the interest-only draw period and the principal+interest repayment phase. Free.',
    keywords: 'heloc payment calculator, heloc monthly payment, heloc interest only payment, heloc repayment calculator, home equity payment',
    ogTitle: 'HELOC Payment Calculator',
    ogDescription: 'See your exact HELOC payment during draw (interest-only) and repayment (P&I) phases.',
  },
  hero: {
    icon: '💳',
    h1: 'HELOC Payment Calculator',
    tagline: 'Enter your draw amount and rate — instantly see your interest-only draw payment and the full P&I repayment that starts when the draw period ends.',
    gradient: 'from-blue-600 via-indigo-600 to-violet-600',
    breadcrumbLabel: 'HELOC Payment Calculator',
  },
  content: {
    aboutDescription: "The single most-searched HELOC question is 'what will my payment be?' This calculator answers it for both phases — and shows the jump you need to plan for.",
    features: [
      '💧 Draw-phase interest-only monthly payment',
      '📈 Repayment-phase P&I monthly payment',
      '⚡ Payment shock amount ($)',
      '📊 Month-by-month payment timeline chart',
      '💰 Total interest paid over the loan life',
    ],
    steps: [
      { title: 'Enter your draw amount', desc: "How much you plan to borrow from the HELOC." },
      { title: 'Set your interest rate', desc: 'Current HELOC rate — treat as fixed for projection (real rates are variable).' },
      { title: 'Set draw and repayment terms', desc: 'Typical: 10-year draw, 20-year repayment.' },
      { title: 'Read both payments', desc: 'See draw-phase payment, repayment payment, and the gap between them.' },
    ],
    faqs: [
      { q: 'Why does my payment jump so much at repayment?', a: "During the draw period, you're only paying interest — principal stays constant. At repayment, you're now paying down both principal and interest over 10-20 years. For a $50k HELOC at 8.5%, this jump is typically $70-100/month." },
      { q: 'Can I pay principal during the draw period?', a: 'Yes! Most HELOCs allow voluntary principal payments during the draw period, which both reduces interest and frees up credit. If you pay aggressively during draw, your repayment payment will be lower.' },
    ],
    longform: [
      { type: 'h2', text: "HELOC Payments Explained: Why Two Phases Matter" },
      { type: 'p', text: 'Most borrowers focus on the draw-phase payment because it is lower and what they pay immediately. But the repayment payment is what matters for long-term budgeting. Planning for the payment shock years in advance is the single most important HELOC financial discipline.' },
    ],
  },
};

export default variant;
