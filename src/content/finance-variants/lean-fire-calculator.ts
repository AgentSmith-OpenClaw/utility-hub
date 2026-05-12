import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'lean-fire-calculator',
  calculatorId: 'fire',

  seo: {
    title: 'Lean FIRE Calculator — Retire on a Minimalist Budget | Toolisk',
    metaDescription:
      'Free Lean FIRE calculator. See the corpus needed to retire on a minimalist budget — typically 25× lean annual expenses — and when you reach it at your current savings rate.',
    keywords:
      'lean fire calculator, lean fi calculator, minimalist retirement calculator, low cost fire, frugal fire calculator, lean fire number, early retirement minimal',
    ogTitle: 'Lean FIRE Calculator — Retire on a Minimalist Budget',
    ogDescription:
      'See the corpus needed to retire on a minimalist budget — and when you reach it.',
  },

  hero: {
    icon: '🥗',
    h1: 'Lean FIRE Calculator',
    tagline:
      'Lean FIRE is FIRE without the luxury — a minimalist budget that lets you escape work years earlier. Find your Lean FIRE number and the year you cross it.',
    gradient: 'from-lime-600 via-green-600 to-emerald-600',
    breadcrumbLabel: 'Lean FIRE Calculator',
  },

  content: {
    aboutDescription:
      'A Lean FIRE calculator for the frugal-minimalist path to early retirement. Lean FIRE typically means living on a stripped-down budget — often ₹3–5 lakh / year in India or $25–35k / year in the US — backed by a corpus of roughly 25× that lean annual expense. The lower your expenses, the much sooner you reach the number.',
    features: [
      '🥗 Lean FIRE number from your minimum annual expenses',
      '📅 Year you reach Lean FIRE at current savings rate',
      '📊 Lean vs Regular vs Fat FIRE comparison',
      '🛡️ Safe withdrawal rate (3–4%) sensitivity',
      '📈 Corpus growth chart',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Set your lean annual expenses', desc: 'The minimum budget you would genuinely live on — rent or owned home, basic food, transport, healthcare, modest discretionary. Be honest, not aspirational.' },
      { title: 'Pick your safe withdrawal rate', desc: '4% is the classic Trinity Study number; 3.5% is more conservative for very long retirements (40+ years).' },
      { title: 'Add current investments + monthly SIP', desc: 'Existing portfolio plus what you save monthly. This drives the date projection.' },
      { title: 'Choose expected return', desc: '8–10% post-inflation for a balanced portfolio. Lean FIRE math is conservative by design — do not stretch this number.' },
      { title: 'Read your Lean FIRE date', desc: 'See the exact year you cross the Lean FIRE corpus and could choose to stop working.' },
    ],
    faqs: [
      {
        q: 'What counts as "Lean" FIRE?',
        a: 'Lean FIRE means living on a budget significantly below the average for your country — typically 30–50% lower. In the US that often means $25–40k / year per person. In India, ₹3–5 lakh / year for a single person living simply, or ₹5–8 lakh / year for a couple. The "lean" part is voluntary minimalism — small home, low transport cost, home cooking, modest discretionary. The corpus needed is roughly 25× this lean annual expense.',
      },
      {
        q: 'How is Lean FIRE different from regular FIRE?',
        a: 'Regular FIRE assumes you maintain current middle-class spending in retirement — typically 25–30× current annual expenses. Lean FIRE assumes you deliberately step down spending — to maybe 50–70% of current — and use the smaller corpus that requires. Lean reaches the goal 5–10 years earlier but trades a strict budget for that freedom. Most people use Lean FIRE as a "minimum viable retirement" number, then build past it toward regular FIRE.',
      },
      {
        q: 'Is Lean FIRE realistic for a family?',
        a: 'Harder, but possible. The biggest variables are housing (own outright) and children\'s education (often pushes lean over edge unless you commit to government schools / state colleges). Most "Lean FIRE families" share a few common moves: paid-off home in a tier-2 city, one car, public schooling, very limited discretionary travel. It works — but it requires alignment with your spouse on the lifestyle, not just the math.',
      },
      {
        q: 'What is the risk of Lean FIRE vs other types?',
        a: 'Buffer. A Lean FIRE budget has very little room for surprise — a medical issue, a roof repair, a kid\'s wedding can punch through it. Most Lean FIRE practitioners build a separate "buffer corpus" of 1–3 years\' expenses on top of the 25× number, or keep a part-time income stream to absorb shocks. Pure Lean FIRE with no margin works for some; for most, a "Lean + 20% buffer" is safer.',
      },
      {
        q: 'Should I aim for Lean FIRE or Coast FIRE first?',
        a: 'Coast FIRE is usually reachable first because it relies on compounding (not a withdrawal corpus). Many people hit Coast FIRE at age 32–38, then keep working casually until they reach Lean FIRE at 40–45 and have full freedom. The sequencing is: Coast first (retirement is solved), Lean second (you could stop working), Full FIRE third (you can stop comfortably). The calculator can show you all three numbers — Coast, Lean, Full — side by side.',
      },
    ],
    longform: [
      { type: 'h2', text: 'The math of Lean FIRE' },
      {
        type: 'p',
        text: 'Lean FIRE\'s power is leverage on the spending side. Every ₹1 lakh you cut from annual expenses reduces your required corpus by ₹25 lakh (at 4% withdrawal). For most middle-class earners, trimming ₹2–3 lakh of annual lifestyle inflation is a much faster path to FIRE than earning an extra ₹5 lakh / year. The trade is real lifestyle compression — but reached, it ends paid employment for the rest of your life.',
      },
      { type: 'h3', text: 'A typical Lean FIRE budget (India, single person)' },
      {
        type: 'ul',
        items: [
          'Housing: ₹0/month (owned home, no rent or EMI) — the single biggest unlock.',
          'Food & utilities: ₹15–20k/month',
          'Transport: ₹5k/month (public transport + occasional ride)',
          'Healthcare insurance: ₹15–25k/year',
          'Discretionary: ₹10–15k/month (modest travel, gear, gifts)',
          'Total: ~₹40–50k/month = ₹5–6 lakh/year. Corpus needed: ₹1.25–1.5 crore.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Lean FIRE collapses if you do not own your home outright. Renting indefinitely on a Lean budget exposes you to rent inflation, which compounds against your fixed-corpus withdrawals. Solve housing before declaring Lean FIRE.',
      },
      { type: 'h2', text: 'How to actually reach Lean FIRE in 15 years' },
      {
        type: 'ol',
        items: [
          'Calculate your lean annual expenses honestly (use this calculator).',
          'Save 50–60% of take-home income — aggressive but achievable for high earners without kids.',
          'Park 90% in low-cost equity index / ETF funds.',
          'Buy a modest home outright (or with a fully prepayable loan) by year 5–7.',
          'Re-run the Lean FIRE number every year as your portfolio and expenses evolve.',
        ],
      },
    ],
  },

  schema: {
    softwareName: 'Lean FIRE Calculator',
    softwareFeatures:
      'Lean FIRE number, Minimum corpus, Safe withdrawal rate sensitivity, FIRE-type comparison, Year-by-year growth, PDF & Excel export',
  },

  relatedTools: [
    { name: 'FIRE Calculator', href: '/finance/fire-calculator', icon: '🔥' },
    { name: 'Coast FIRE Calculator', href: '/finance/coast-fire-calculator', icon: '🏖️' },
    { name: 'Fat FIRE Calculator', href: '/finance/fat-fire-calculator', icon: '🍷' },
  ],
};

export default variant;
