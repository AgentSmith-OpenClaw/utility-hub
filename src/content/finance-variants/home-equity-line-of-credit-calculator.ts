import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'home-equity-line-of-credit-calculator',
  calculatorId: 'heloc',
  seo: {
    title: 'Home Equity Line of Credit Calculator | Toolisk',
    metaDescription: 'Calculate your HELOC credit limit, draw-phase interest-only payments, and repayment-phase P&I. See the full cost before you borrow. Free.',
    keywords: 'home equity line of credit calculator, heloc calculator, heloc limit, home equity calculator, heloc payment calculator',
    ogTitle: 'Home Equity Line of Credit Calculator',
    ogDescription: 'Calculate your HELOC credit limit and project payments through both the draw and repayment phases.',
  },
  hero: {
    icon: '🏠',
    h1: 'Home Equity Line of Credit Calculator',
    tagline: 'See how much equity you can tap, what your draw-phase payments will be, and — critically — how much your payment jumps at repayment.',
    gradient: 'from-teal-600 via-cyan-600 to-blue-600',
    breadcrumbLabel: 'HELOC Calculator',
  },
  content: {
    aboutDescription: 'A HELOC gives you flexible access to your home equity, but its two-phase structure (interest-only draw, then full P&I repayment) means payments can jump significantly. This calculator shows the full picture.',
    features: [
      '🏡 CLTV-based credit limit calculation',
      '💧 Interest-only draw-phase payment',
      '📈 Full P&I repayment-phase payment',
      '⚡ Payment shock (the jump between phases)',
      '💰 Total interest cost over the life of the HELOC',
    ],
    steps: [
      { title: 'Enter your home details', desc: 'Home value, existing mortgage balance, and lender CLTV cap.' },
      { title: 'Set HELOC terms', desc: 'Interest rate, draw period length, and repayment period length.' },
      { title: 'Specify your draw plan', desc: 'How much you intend to borrow and when.' },
      { title: 'See the full payment timeline', desc: 'Draw-phase payments, repayment-phase payments, and total interest cost.' },
    ],
    faqs: [
      { q: 'What is CLTV and why does it matter?', a: 'Combined Loan-to-Value (CLTV) is the ratio of all loans on your home to its appraised value. Lenders cap CLTV at 80-90% for HELOCs. If your home is worth $500k and your mortgage is $250k, an 85% CLTV cap means your maximum HELOC is $175k.' },
      { q: 'What happens to my HELOC if my home value drops?', a: 'Lenders can reduce or freeze your HELOC if your home value drops significantly, your credit score declines, or the lender experiences financial stress. This is a key risk of HELOCs vs. home equity loans.' },
    ],
    longform: [
      { type: 'h2', text: 'HELOC Credit Limit: How Lenders Calculate What You Can Borrow' },
      { type: 'p', text: 'Your maximum HELOC amount is determined by your Combined Loan-to-Value ratio. Most lenders cap at 80-85% CLTV. Subtract your existing mortgage from that maximum combined loan amount, and you have your credit limit. This calculator enforces the cap — you cannot model borrowing more than the lender will allow.' },
      { type: 'h2', text: 'The Two-Phase Payment Structure' },
      { type: 'p', text: "During the draw period (typically 10 years), you pay interest only on what you've borrowed. Payments are low and flexible — if you pay down principal, you free up credit again. When the draw period ends, your HELOC closes to new draws and converts to a full amortizing loan. The 'payment shock' — the jump from interest-only to P&I — is often 25-50% higher than what you were paying. Knowing this number in advance lets you plan ahead." },
    ],
  },
};

export default variant;
