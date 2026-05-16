import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'interest-only-heloc-calculator',
  calculatorId: 'heloc',
  seo: {
    title: 'Interest-Only HELOC Calculator | Draw Period Payments | Toolisk',
    metaDescription: 'Calculate your interest-only HELOC payment during the draw period. See how payment changes as you draw more, and plan for the repayment phase.',
    keywords: 'interest only heloc calculator, heloc interest only payment, heloc draw period calculator, heloc interest only period',
    ogTitle: 'Interest-Only HELOC Calculator',
    ogDescription: 'Model your HELOC draw-phase interest-only payments and the repayment jump that follows.',
  },
  hero: {
    icon: '📉',
    h1: 'Interest-Only HELOC Calculator',
    tagline: 'During your draw period, you only pay interest — but that number changes as your balance grows. See what you owe at every stage of the draw.',
    gradient: 'from-cyan-600 via-teal-600 to-emerald-600',
    breadcrumbLabel: 'Interest-Only HELOC',
  },
  content: {
    aboutDescription: "The draw phase is the most flexible part of a HELOC — but it's also the phase that can lull borrowers into a false sense of affordability. Low interest-only payments during draw can give way to a significant P&I payment at repayment start.",
    features: [
      '💧 Draw-phase interest-only payment calculator',
      '📈 Payment growth as balance increases',
      '⚡ Preview repayment payment before you commit',
      '📊 Full payment timeline from draw start to repayment end',
      '⚠️ Payment shock warning when repayment > 20% higher than draw',
    ],
    steps: [
      { title: 'Enter your credit limit and draw plan', desc: 'How much credit you have and what you plan to draw.' },
      { title: 'Set your HELOC rate', desc: "Current rate — remember it's variable in real life." },
      { title: 'Set draw period length', desc: 'Usually 10 years, but some HELOCs are 5 or 15 years.' },
      { title: 'See interest-only payments', desc: 'Draw-phase payments plus a preview of what repayment will cost.' },
    ],
    faqs: [
      { q: 'What happens if I only pay interest during the draw period?', a: 'The principal stays exactly where it is — none of it gets paid down. Your entire borrowed amount converts to an amortizing loan at repayment start, which is why the payment jumps.' },
      { q: 'Can I make principal payments during the interest-only period?', a: 'Yes — most HELOCs allow voluntary principal paydown. Any principal you pay reduces what amortizes in the repayment phase, lowering that payment.' },
    ],
    longform: [
      { type: 'h2', text: 'Understanding Interest-Only HELOC Payments' },
      { type: 'p', text: "Interest-only payments sound great — they're lower — but they can mask the true cost of borrowing. At 8.5% on $50,000, you pay $354/month during draw but still owe $50,000 when repayment starts. Then you amortize that $50,000 over 20 years at P&I, which is $434/month — an 80/month jump on top of the transition. The interest-only phase is a temporary grace period, not a permanent payment structure." },
    ],
  },
};

export default variant;
