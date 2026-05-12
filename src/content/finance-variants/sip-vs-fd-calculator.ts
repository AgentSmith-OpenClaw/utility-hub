import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'sip-vs-fd-calculator',
  calculatorId: 'sip',

  seo: {
    title: 'SIP vs FD Calculator — Mutual Fund vs Fixed Deposit Returns | Toolisk',
    metaDescription:
      'Compare SIP and recurring FD on the same monthly amount and horizon. See post-tax returns, real (inflation-adjusted) wealth, and the gap that compounds over 10+ years.',
    keywords:
      'sip vs fd calculator, sip vs fixed deposit, sip vs rd calculator, mutual fund vs fd returns, sip or fd which is better, sip vs fd comparison india',
    ogTitle: 'SIP vs FD Calculator — Mutual Fund vs Fixed Deposit Returns',
    ogDescription:
      'Compare SIP and recurring FD on the same monthly amount. See post-tax, real wealth gap.',
  },

  hero: {
    icon: '⚔️',
    h1: 'SIP vs FD Calculator',
    tagline:
      'A ₹10,000 monthly SIP and a ₹10,000 monthly RD look identical on day one. Twenty years later, the gap can be ₹1 crore. See the real comparison — post-tax and inflation-adjusted.',
    gradient: 'from-amber-600 via-orange-600 to-rose-600',
    breadcrumbLabel: 'SIP vs FD',
  },

  content: {
    aboutDescription:
      'A side-by-side comparison of equity SIP and recurring fixed deposits for the same monthly amount. Models post-tax returns (LTCG for equity, slab-rate for FD interest), inflation adjustment, and the real-wealth gap that opens up over 10–25 year horizons. Built for investors deciding between safety and growth.',
    features: [
      '⚔️ SIP vs RD side-by-side',
      '💰 Pre-tax and post-tax corpus comparison',
      '🛒 Inflation-adjusted real wealth',
      '📊 Year-by-year corpus growth',
      '📅 Sensitivity to return assumptions',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Enter monthly amount', desc: 'Use the same monthly contribution for both — that is what makes the comparison apples-to-apples.' },
      { title: 'Set SIP expected return', desc: 'Equity SIP long-run: 10–13%. Hybrid: 8–10%. Use 11% as a balanced default.' },
      { title: 'Set FD / RD rate', desc: 'Current 5-year FD rate: 6.5–7.5%. RD rates are similar. Use the rate net of TDS for the cleanest comparison.' },
      { title: 'Add your tax slab', desc: 'FD interest is taxed at your full slab rate. Equity SIP gains pay 10% LTCG above ₹1 lakh after 1 year — much lighter tax.' },
      { title: 'Read the gap', desc: 'See pre-tax, post-tax, and inflation-adjusted final values for both. The post-tax gap is what your wealth actually grows into.' },
    ],
    faqs: [
      {
        q: 'Is SIP really better than FD over the long term?',
        a: 'Over 10+ year horizons, yes — and the gap is structural, not coincidental. Indian equity has compounded at ~12% over rolling 15-year windows; FDs have averaged ~7%. After tax (10% LTCG vs full slab on FD interest) and after inflation, the real gap is roughly 6 percentage points / year. Compounded over 20 years, ₹10k/month in SIP reaches roughly ₹1 crore; the same in FD reaches ~₹50 lakh. The "safer" option costs half your retirement.',
      },
      {
        q: 'But isn\'t FD safer than SIP?',
        a: 'Short-term, absolutely — FDs cannot lose nominal value. Long-term, FDs almost guarantee inflation loss. Indian CPI averages 5–6%, post-tax FD returns 4.5–5%. That means a ₹1 lakh FD today loses real purchasing power every single year on autopilot. SIP volatility is real, but volatility over 1–3 years is not the same as risk over 15–20 years. The longer your horizon, the safer SIP becomes relative to FD on real wealth terms.',
      },
      {
        q: 'When should I still pick FD over SIP?',
        a: 'Three clear cases. (1) Money you need within 2–3 years — equity volatility is too high for short windows. (2) Emergency fund — you need predictable nominal value regardless of markets. (3) Capital that supports current expenses (retiree income) — FD ladders are fine here even if total return is lower. For any horizon of 7+ years and money you can leave alone, SIP almost always wins.',
      },
      {
        q: 'How is tax different on SIP gains vs FD interest?',
        a: 'FD interest is added to your total income and taxed at your slab rate every year — meaning a 30%-slab taxpayer keeps only 70% of FD interest. SIP gains are taxed only when redeemed: 10% LTCG on equity gains above ₹1 lakh / year after 1 year of holding. Held for 10+ years, a ₹50 lakh equity SIP gain pays roughly 9.5% effective tax. The same ₹50 lakh of FD interest taxed at 30% pays 30%. That tax gap alone is worth several percentage points of effective return.',
      },
      {
        q: 'Should I split between SIP and FD?',
        a: 'Yes, but based on goals, not feelings. A typical young professional plan: 80–90% SIP for long-term goals (retirement, kid\'s college 15+ years away), 10–20% FD / debt for emergency fund and 3–5 year goals (down payment, planned car, wedding). The split moves toward FD/debt as you near retirement — not because FDs become "better" but because withdrawal-stage portfolios need stable income.',
      },
    ],
    longform: [
      { type: 'h2', text: 'The hidden cost of "safe"' },
      {
        type: 'p',
        text: 'Indians have ₹50+ lakh crore parked in FDs. Most of it earns less than inflation after tax. The reason is psychological: an FD shows a positive number every quarter; an equity SIP shows red weeks and red months. People are loss-averse over short windows even when they understand the long-term math. The cost of that aversion, compounded over a 30-year working life, is often the difference between retiring at 55 and 65.',
      },
      { type: 'h3', text: 'A 25-year comparison, post-tax' },
      {
        type: 'ul',
        items: [
          '₹10,000/month in RD at 7% (post-tax ~5% for a 30% slab taxpayer): ₹56 lakh corpus.',
          '₹10,000/month in equity SIP at 12% (post-tax ~11% after LTCG): ₹1.85 crore corpus.',
          'Same contribution, ~3.3× more wealth. The gap is taxes + market premium, compounded.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'If FD volatility comfort is what stops you from starting an SIP, start with a hybrid fund. 65% equity / 35% debt cuts drawdowns by ~40% and still beats FD on 10-year returns.',
      },
      { type: 'h2', text: 'A balanced playbook' },
      {
        type: 'ol',
        items: [
          'Hold 6 months of expenses in an FD or liquid fund as the emergency buffer — never in SIP.',
          'For goals 1–3 years out, use FDs / RDs / arbitrage funds. The horizon is too short for equity risk.',
          'For goals 4–7 years out, use hybrid funds or balanced advantage funds — middle ground.',
          'For goals 8+ years out, use equity SIP — the historical risk premium needs time to work.',
          'Review the split every year and rebalance when allocations drift more than 10%.',
        ],
      },
    ],
  },

  schema: {
    softwareName: 'SIP vs FD Calculator',
    softwareFeatures:
      'SIP vs FD/RD comparison, Post-tax return modeling, Inflation-adjusted wealth, Year-by-year schedule, PDF & Excel export',
  },

  relatedTools: [
    { name: 'SIP Calculator', href: '/finance/sip-calculator', icon: '💼' },
    { name: 'Compound Interest', href: '/finance/compound-interest-calculator', icon: '📊' },
    { name: 'Inflation Calculator', href: '/finance/inflation-calculator', icon: '📉' },
  ],
};

export default variant;
