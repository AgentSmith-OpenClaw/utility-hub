import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'fat-fire-calculator',
  calculatorId: 'fire',

  seo: {
    title: 'Fat FIRE Calculator — Retire Early With Lifestyle Intact | Toolisk',
    metaDescription:
      'Free Fat FIRE calculator. See the corpus needed to retire early without compromising on lifestyle — travel, dining, healthcare, family — typically 30–40× annual expenses.',
    keywords:
      'fat fire calculator, fat fi calculator, luxury fire calculator, high net worth retirement, fat fire number, premium fire calculator, fire without compromise',
    ogTitle: 'Fat FIRE Calculator — Retire Early With Lifestyle Intact',
    ogDescription:
      'See the corpus needed to retire early without compromising on lifestyle, travel, or healthcare.',
  },

  hero: {
    icon: '🍷',
    h1: 'Fat FIRE Calculator',
    tagline:
      'Fat FIRE is early retirement without trimming the lifestyle. The corpus is bigger, the discipline is harder, the freedom at the end is complete.',
    gradient: 'from-amber-700 via-yellow-700 to-orange-700',
    breadcrumbLabel: 'Fat FIRE Calculator',
  },

  content: {
    aboutDescription:
      'A Fat FIRE calculator for early retirement that keeps a comfortable upper-middle-class to affluent lifestyle intact — typically 30–40× current annual expenses to leave room for healthcare inflation, travel, family support, and a margin of safety. Built for high earners who want to escape work without austerity.',
    features: [
      '🍷 Fat FIRE number from your full annual expenses',
      '📊 30–40× expenses (vs 25× for regular FIRE)',
      '🛡️ Healthcare & inflation buffer modeling',
      '📅 Year you reach Fat FIRE at current rate',
      '📈 Fat vs Lean vs Regular FIRE side-by-side',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Set your full annual expenses', desc: 'Total annual spending you want to maintain in retirement — including the travel, dining, hobbies, and family obligations you would not give up.' },
      { title: 'Choose multiplier', desc: 'Fat FIRE typically uses 30–40× expenses (vs 25× for regular FIRE) to fund a longer retirement, healthcare inflation, and lifestyle buffer.' },
      { title: 'Add current investments + SIP', desc: 'Total invested across all accounts plus monthly contribution. This drives the projection date.' },
      { title: 'Choose expected return', desc: 'Be conservative for Fat FIRE math — 7–9% post-inflation. The longer your retirement window, the more sensitive the number is to return assumptions.' },
      { title: 'Read your Fat FIRE date', desc: 'See the year you reach the corpus that funds full lifestyle continuity for life.' },
    ],
    faqs: [
      {
        q: 'How much is "Fat FIRE" exactly?',
        a: 'Fat FIRE is a relative term — typically 1.5–2× the regular FIRE number for the same person. In the US, a common Fat FIRE benchmark is $2.5M–$5M+. In India, ₹5–10 crore is the typical Fat FIRE range for an urban family that wants international travel, premium healthcare, top-tier education for kids, and a comfortable home. The "fat" is not luxury — it is the room to absorb shocks without changing lifestyle.',
      },
      {
        q: 'Why aim for Fat FIRE instead of regular FIRE?',
        a: 'Three reasons. (1) Healthcare — out-of-pocket medical costs can balloon late in life and 25× expenses leaves no margin. (2) Sequence-of-returns risk — a 40-year retirement is twice as exposed to bad early years as a 25-year retirement. (3) Lifestyle drift — most people understate their future expenses by 20–30%, and Fat FIRE absorbs that gap without forcing back-to-work scenarios. Fat FIRE is essentially regular FIRE with an honest safety margin.',
      },
      {
        q: 'Is Fat FIRE just for high earners?',
        a: 'Mostly yes. Reaching ₹5+ crore (or $2.5M+) in 15–20 years generally requires a household income in the top 5–10% and a 50%+ savings rate. For median earners, Lean or Coast FIRE is more accessible; Fat FIRE often requires either much longer working years (25–30+) or a step-function income increase (founder exit, senior tech IC, partner-track service firms). Honest framing avoids disappointment.',
      },
      {
        q: 'What withdrawal rate is safe for Fat FIRE?',
        a: '3–3.5% is the common Fat FIRE choice, lower than the classic 4% rule. The reasoning: Fat FIRE typically funds 35–50 years of retirement (not 30), and historical safe-withdrawal studies show 4% can occasionally fail over very long windows. A 3.5% rate effectively requires ~28× expenses instead of 25× — and most Fat FIRE practitioners build to 30–35× as a stronger buffer.',
      },
      {
        q: 'Should I aim for Fat FIRE or just Coast FIRE plus working longer?',
        a: 'Personality and career fit decide. If your work is genuinely satisfying and your industry has a long runway, Coast FIRE + working into your 50s often gets you to Fat FIRE-level wealth anyway, with the bonus of professional fulfillment along the way. If your work is grinding you down and the early-exit dream is what motivates the savings, aim for Fat FIRE directly. The math is the same — only the lived experience differs.',
      },
    ],
    longform: [
      { type: 'h2', text: 'Why "fat" is often the most honest FIRE' },
      {
        type: 'p',
        text: 'Regular FIRE math (25× expenses, 4% withdrawal) was derived from US stock-and-bond returns over a 30-year retirement horizon. Most FIRE planners are retiring at 40–45, which means 40–50 years of withdrawals — substantially riskier than the original studies modeled. Fat FIRE recognizes this by building a structural buffer. It is not greed; it is correct math for the longer retirement.',
      },
      { type: 'h3', text: 'The four risks Fat FIRE addresses' },
      {
        type: 'ul',
        items: [
          'Sequence-of-returns risk: bad early-retirement market years devastate a 25× portfolio; a 35× portfolio absorbs them.',
          'Healthcare inflation: medical costs have risen faster than general inflation for decades and accelerate after age 60.',
          'Lifestyle creep: actual retirement spending tends to be 10–20% higher than pre-retirement budgets predicted.',
          'Family obligations: aging parents, adult children, unexpected support — rarely modeled in Lean FIRE.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'If you are a high earner with 5+ years of high savings already in place, the marginal effort to reach Fat FIRE from Regular FIRE is smaller than it looks. Two extra years of work at peak earnings often closes the gap.',
      },
      { type: 'h2', text: 'A Fat FIRE plan that actually works' },
      {
        type: 'ol',
        items: [
          'Calculate full FIRE (25×) and Fat FIRE (30–35×) numbers. Target the latter.',
          'Maintain a 55–65% savings rate during high-earning years (often ages 30–45 for tech / finance / medicine).',
          'Hold 75–85% equity in the accumulation phase. Glide down to 50–60% in the 5 years before the FIRE date.',
          'Build a separate 2-year cash cushion before retiring to absorb early-year sequence risk.',
          'Plan for ongoing low-stakes work (consulting, advising, board seats) — not for the money, for the cognitive engagement.',
        ],
      },
    ],
  },

  schema: {
    softwareName: 'Fat FIRE Calculator',
    softwareFeatures:
      'Fat FIRE number, 30–40× expenses, Conservative withdrawal rate, Healthcare buffer, FIRE comparison, PDF & Excel export',
  },

  relatedTools: [
    { name: 'FIRE Calculator', href: '/finance/fire-calculator', icon: '🔥' },
    { name: 'Coast FIRE Calculator', href: '/finance/coast-fire-calculator', icon: '🏖️' },
    { name: 'Lean FIRE Calculator', href: '/finance/lean-fire-calculator', icon: '🥗' },
  ],
};

export default variant;
