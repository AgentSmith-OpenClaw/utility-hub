import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'coast-fire-calculator',
  calculatorId: 'fire',

  seo: {
    title: 'Coast FIRE Calculator — When Can You Stop Investing? | Toolisk',
    metaDescription:
      'Free Coast FIRE calculator. Find the exact age and corpus at which you can stop saving and let compounding alone fund your retirement. See your Coast FIRE number in seconds.',
    keywords:
      'coast fire calculator, coast fi calculator, coastfire number, when can i stop investing, partial fire calculator, semi retirement calculator, financial coast number',
    ogTitle: 'Coast FIRE Calculator — When Can You Stop Investing?',
    ogDescription:
      'Find the age and corpus where compounding alone funds your retirement — no more saving needed.',
  },

  hero: {
    icon: '🏖️',
    h1: 'Coast FIRE Calculator',
    tagline:
      'Coast FIRE is the moment your invested corpus is big enough to grow into your full retirement number — even if you never save another rupee. See when you hit it.',
    gradient: 'from-sky-500 via-cyan-500 to-teal-500',
    breadcrumbLabel: 'Coast FIRE Calculator',
  },

  content: {
    aboutDescription:
      'A Coast FIRE calculator built around the specific question: when can I stop investing and just "coast" to retirement? Enter your retirement age, target corpus, expected return, and current investments — and see the exact Coast FIRE number and age. Once you hit it, your existing portfolio is mathematically guaranteed to grow into your retirement target on autopilot.',
    features: [
      '🏖️ Coast FIRE number for your retirement target',
      '📅 Year you hit Coast FIRE at your current SIP',
      '📈 Sensitivity to expected return assumptions',
      '🎯 Compare to Lean / Regular / Fat FIRE numbers',
      '📊 Corpus growth post-Coast (zero contribution)',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Set retirement age & target corpus', desc: 'Pick the age you want to retire and the corpus you need at that point. Most planners use 25–30× annual expenses.' },
      { title: 'Choose expected return', desc: 'Coast FIRE math is sensitive to return. Use 8–10% for a balanced portfolio (lower than pure equity to leave a safety margin).' },
      { title: 'Enter current investments', desc: 'Sum of equity / hybrid mutual funds, 401k / EPF / NPS / IRA — anything that compounds over decades.' },
      { title: 'Add current monthly SIP', desc: 'Optional — to project when you hit Coast FIRE at your current saving rate.' },
      { title: 'Read your Coast FIRE date', desc: 'See the exact year and age at which your portfolio is big enough to coast to retirement.' },
    ],
    faqs: [
      {
        q: 'What is Coast FIRE in simple terms?',
        a: 'Coast FIRE is the corpus at which your invested money, left untouched and compounding, will grow into your full retirement number by retirement age — without you adding anything more. After hitting Coast FIRE, you can still work to cover current expenses, but you no longer need to save for retirement. Many people describe it as "retirement is already paid for; I am just working to pay for now."',
      },
      {
        q: 'How is Coast FIRE different from regular FIRE?',
        a: 'Regular FIRE means you have enough to stop working entirely. Coast FIRE means you have enough that retirement savings can stop, but you still need to earn enough to cover current living expenses. The Coast FIRE number is much smaller — often 25–40% of the full FIRE number — and reaches it 10–15 years earlier. It is FIRE\'s most accessible flavor for middle-income earners.',
      },
      {
        q: 'How do I calculate my Coast FIRE number?',
        a: 'Take your target retirement corpus, divide by (1 + expected return) ^ years until retirement. Example: ₹5 crore target, 25 years to retirement, 9% return → Coast FIRE number = 5 crore / (1.09 ^ 25) ≈ ₹58 lakh. Once you have ₹58 lakh invested today, compounding at 9% turns it into ₹5 crore in 25 years on its own. The calculator handles this math instantly for any inputs.',
      },
      {
        q: 'Is Coast FIRE actually safe to rely on?',
        a: 'Mathematically yes — but only if the return assumption holds. A 9% return over 25 years has historically been very reliable for diversified portfolios, but a single decade of below-average returns (like 2000–2010) can push the timeline by 3–5 years. Most Coast FIRE practitioners build a buffer by aiming for 1.2–1.5× the calculated number, or by continuing modest contributions for a few years past the technical Coast date.',
      },
      {
        q: 'Should I keep working after hitting Coast FIRE?',
        a: 'Almost always yes, but differently. The whole point of Coast is freedom to choose — lower-stress work, sabbatical, career pivot, part-time, a sector you love that pays less. You no longer need to optimize income, so you can optimize meaning. The risk is the opposite: people who hit Coast and immediately stop working entirely often discover they wanted "less work" not "no work" — and re-entering the workforce after a long gap is much harder than scaling down gradually.',
      },
    ],
    longform: [
      { type: 'h2', text: 'Why Coast FIRE is the most useful FIRE number' },
      {
        type: 'p',
        text: 'Full FIRE asks an enormous question: when do you have enough to never work again? Coast FIRE asks a smaller, more tractable one: when can you stop having to save aggressively? For most middle-income earners, the Coast number is reachable in 12–20 years of consistent investing — much earlier than full FIRE. And the moment you hit it, your relationship with work changes permanently. You stop optimizing income and start optimizing fit.',
      },
      { type: 'h3', text: 'A worked example' },
      {
        type: 'p',
        text: 'Suppose you want ₹5 crore at age 60 and you are 30 today. At 9% real return over 30 years, ₹5 crore / 1.09^30 = ₹38 lakh. That is your Coast FIRE number today. If you invest ₹50,000/month in a diversified equity SIP, you reach ₹38 lakh in roughly 5 years. Hit that, and your retirement is mathematically solved — you only need to earn enough to cover current expenses for the next 25 years.',
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'Coast FIRE rewards starting young more than any other financial concept. A 25-year-old needs roughly half the corpus a 35-year-old needs to Coast to the same retirement target — because compounding gets 10 extra years.',
      },
      { type: 'h2', text: 'The three numbers to track' },
      {
        type: 'ol',
        items: [
          'Coast FIRE number — corpus at which retirement is solved on autopilot. Reach this first.',
          'Lean FIRE number — corpus to cover minimum expenses if you stop working entirely. Usually 15–20× expenses.',
          'Full FIRE number — corpus to maintain current lifestyle indefinitely. Usually 25–30× expenses.',
        ],
      },
    ],
  },

  schema: {
    softwareName: 'Coast FIRE Calculator',
    softwareFeatures:
      'Coast FIRE number, Age at Coast, Compounding to retirement, FIRE comparison, Year-by-year corpus growth, PDF & Excel export',
  },

  relatedTools: [
    { name: 'FIRE Calculator', href: '/finance/fire-calculator', icon: '🔥' },
    { name: 'Lean FIRE Calculator', href: '/finance/lean-fire-calculator', icon: '🥗' },
    { name: 'Fat FIRE Calculator', href: '/finance/fat-fire-calculator', icon: '🍷' },
  ],
};

export default variant;
