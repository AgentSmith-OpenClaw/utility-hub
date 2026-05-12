import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'barista-fire-calculator',
  calculatorId: 'fire',

  seo: {
    title: 'Barista FIRE Calculator — Part-Time Work + Investments | Toolisk',
    metaDescription:
      'Free Barista FIRE calculator. Find the corpus where part-time work plus your portfolio covers expenses — escape the 9-to-5 without needing full FIRE numbers.',
    keywords:
      'barista fire calculator, barista fi, semi retirement calculator, part time fire, partial retirement calculator, side hustle fire, barista fire number',
    ogTitle: 'Barista FIRE Calculator — Part-Time Work + Investments',
    ogDescription:
      'Find the corpus where part-time work plus your portfolio covers expenses.',
  },

  hero: {
    icon: '☕',
    h1: 'Barista FIRE Calculator',
    tagline:
      'Part-time work covers today, portfolio covers tomorrow. Barista FIRE is the corpus where you can step off the corporate ladder without ever fully retiring.',
    gradient: 'from-orange-700 via-amber-700 to-yellow-600',
    breadcrumbLabel: 'Barista FIRE Calculator',
  },

  content: {
    aboutDescription:
      'A Barista FIRE calculator for the hybrid path: a portfolio big enough that a low-stress, part-time income covers the gap — letting you exit demanding full-time work years before traditional FIRE. Plug in your expenses, your expected part-time income, and your portfolio — and see the corpus required to make the switch sustainable for decades.',
    features: [
      '☕ Barista FIRE number from expenses + part-time income',
      '📊 Compare to Lean / Regular / Fat FIRE',
      '🛡️ Healthcare cost modeling (if not employer-covered)',
      '📅 Year you can switch to part-time work',
      '📈 Corpus longevity at reduced withdrawals',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Set your annual expenses', desc: 'Full living costs you would maintain post-switch — usually similar to today, just without commute / work expenses.' },
      { title: 'Add part-time income', desc: 'A realistic estimate of what part-time, low-stress work will earn — typically 30–60% of current full-time income. Be honest about market rates.' },
      { title: 'Pick the gap as withdrawal', desc: 'The difference between expenses and part-time income is what your portfolio needs to cover annually. Apply your safe withdrawal rate to find the corpus needed.' },
      { title: 'Add healthcare', desc: 'In the US especially, factor in marketplace insurance costs. In India, factor in a comprehensive family floater premium.' },
      { title: 'Read the Barista date', desc: 'See when your portfolio reaches the size that makes the switch durable for 30+ years.' },
    ],
    faqs: [
      {
        q: 'What is Barista FIRE exactly?',
        a: 'Barista FIRE is a hybrid: enough investments that a part-time or low-stress job covers current expenses while the portfolio covers everything in retirement. The name comes from the US tradition of "easy" jobs like barista or library work — generally low-stakes employment that pays modestly but offers health benefits and flexibility. The corpus needed is smaller than full FIRE because you keep earning some income.',
      },
      {
        q: 'How is Barista FIRE different from Coast FIRE?',
        a: 'Coast FIRE: enough corpus that future compounding handles retirement, but you still work full-time to cover today. Barista FIRE: enough corpus that part-time work + small withdrawals cover today, and the portfolio grows to handle full retirement later. Coast comes first chronologically; Barista usually comes 3–8 years after Coast. Both are stepping stones to full FIRE.',
      },
      {
        q: 'How do I calculate my Barista FIRE number?',
        a: 'Step 1: Estimate annual expenses (E). Step 2: Estimate realistic annual part-time income (I). Step 3: The gap is E – I, which the portfolio must cover. Step 4: Apply your safe withdrawal rate — Barista FIRE corpus = (E – I) ÷ 0.04. Example: ₹12 lakh expenses, ₹6 lakh part-time income → corpus needed = ₹6 lakh ÷ 0.04 = ₹1.5 crore. The calculator does this instantly with your numbers.',
      },
      {
        q: 'What kind of work fits Barista FIRE?',
        a: 'Anything that combines: (a) flexibility / part-time hours, (b) low cognitive load, (c) some benefits if possible. In tech: consulting 2 days a week, technical writing, fractional CTO roles. In other fields: teaching adjunct, library / museum work, coffee shop, freelance editing, tutoring. The point is you choose the work for fit, not paycheck — because the paycheck only has to fill a small gap.',
      },
      {
        q: 'Is Barista FIRE riskier than full FIRE?',
        a: 'Different risks, similar overall. Full FIRE is exposed to sequence-of-returns risk over a long withdrawal period. Barista FIRE is exposed to income-loss risk if you cannot find or hold part-time work as you age (job market in your 60s is uncertain). The mitigation: build skills now in fields where part-time work is durable (teaching, consulting, healthcare adjuncts) and keep a 2-year expense buffer in case income gaps appear.',
      },
    ],
    longform: [
      { type: 'h2', text: 'Why Barista FIRE is having a moment' },
      {
        type: 'p',
        text: 'For many people who fantasize about FIRE, the actual goal is "stop doing this specific demanding job" — not "stop working entirely." Barista FIRE recognizes that lower-stress work for moderate pay is genuinely attractive, and that a portfolio of ₹1.5–2 crore (or $500k–800k) is dramatically easier to reach than the ₹5+ crore needed for full FIRE. It is the most accessible exit ramp from corporate intensity.',
      },
      { type: 'h3', text: 'A worked example' },
      {
        type: 'p',
        text: 'Suppose you spend ₹12 lakh/year and would happily do part-time consulting that pays ₹6 lakh/year for 3 days a week. Gap = ₹6 lakh. At 4% safe withdrawal, you need ₹1.5 crore to fund the gap perpetually. Full FIRE on the same ₹12 lakh expense would require ₹3 crore. Barista FIRE gets you out of full-time work at roughly half the corpus — typically 6–10 years earlier in a career arc.',
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'The most under-rated benefit of Barista FIRE is psychological: a small income, even ₹50k/month, makes huge market drawdowns much less scary because you are not 100% withdrawal-dependent.',
      },
      { type: 'h2', text: 'Stress-testing Barista FIRE before you commit' },
      {
        type: 'ol',
        items: [
          'Take a 2-week trial: work only the hours your part-time plan assumes. Can you maintain expenses?',
          'Research the actual market rate for your intended part-time work — talk to 3 people doing it now.',
          'Run a "what if the part-time work disappears at age 60?" scenario. Does the corpus alone last?',
          'Confirm healthcare cost: in the US, marketplace plans; in India, comprehensive family floater + buffer for parents.',
          'Maintain a 12-month expense buffer in liquid funds as a bridge for income gaps.',
        ],
      },
    ],
  },

  schema: {
    softwareName: 'Barista FIRE Calculator',
    softwareFeatures:
      'Barista FIRE number, Part-time income modeling, Gap-funded withdrawals, Healthcare cost, FIRE comparison, PDF & Excel export',
  },

  relatedTools: [
    { name: 'FIRE Calculator', href: '/finance/fire-calculator', icon: '🔥' },
    { name: 'Coast FIRE Calculator', href: '/finance/coast-fire-calculator', icon: '🏖️' },
    { name: 'Lean FIRE Calculator', href: '/finance/lean-fire-calculator', icon: '🥗' },
  ],
};

export default variant;
