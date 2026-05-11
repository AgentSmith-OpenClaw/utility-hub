import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'sip-step-up-calculator',
  calculatorId: 'sip',

  seo: {
    title: 'Step-Up SIP Calculator — Annual Top-Up Wealth Growth | Toolisk',
    metaDescription:
      'Free step-up SIP calculator. Increase your monthly SIP by 5–15% every year and see how much faster your wealth compounds compared to a flat SIP.',
    keywords:
      'step up sip calculator, top up sip calculator, sip increase calculator, annual sip increase, sip wealth calculator, mutual fund sip step up',
  },

  hero: {
    icon: '📈',
    h1: 'Step-Up SIP Calculator',
    tagline:
      'A 10% yearly SIP step-up can almost double your final corpus versus a flat SIP. See exactly how much faster your wealth compounds.',
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    breadcrumbLabel: 'Step-Up SIP Calculator',
  },

  content: {
    aboutDescription:
      'A step-up SIP calculator that models real-world investing: your salary grows, so your SIP should too. Pick a starting SIP, an annual step-up rate (typically 5–15%), and see your corpus stack up against a flat SIP over 10, 20, or 30 years.',
    features: [
      '📈 Annual step-up of 5–15% (configurable)',
      '⚖️ Flat SIP vs step-up SIP side-by-side',
      '🎯 Target corpus reverse-engineering',
      '📅 Year-by-year investment + value table',
      '📊 Charts showing the compounding gap',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Set your starting SIP', desc: 'The monthly amount you can comfortably commit today.' },
      { title: 'Pick a step-up rate', desc: '10% is the common default — roughly matches typical salary growth in mid-career.' },
      { title: 'Choose horizon and expected return', desc: 'Equity SIPs: 10–12% long-run expected. Hybrid: 8–10%. Debt: 6–8%.' },
      { title: 'Compare with flat', desc: 'Toggle the comparison to see the final corpus gap between a step-up SIP and a flat one.' },
      { title: 'Export your plan', desc: 'Download a year-by-year schedule to share with your spouse or advisor.' },
    ],
    faqs: [
      {
        q: 'Does a step-up SIP really make that much difference?',
        a: 'Yes — and the longer your horizon, the bigger the gap. A ₹10,000 SIP for 20 years at 12% returns roughly ₹1 crore. The same SIP with a 10% annual step-up returns ~₹2 crores. The reason: each year\'s extra contribution compounds for the remaining horizon, and that compounding stack is huge.',
      },
      {
        q: 'What is a realistic step-up rate?',
        a: 'A safe baseline is your expected annual salary increment — typically 7–10% in stable jobs, 10–15% during high-growth career years. The point is to never let lifestyle inflation eat 100% of your raise. If your salary went up 12%, raise your SIP by at least half of that.',
      },
      {
        q: 'When should I start a step-up SIP vs a flat one?',
        a: 'Always pick step-up when starting fresh — most platforms now offer it as a default toggle. If you have a flat SIP running today, raise the amount manually each year on a fixed date (anniversary, January, after appraisal). The discipline matters more than the mechanism.',
      },
      {
        q: 'Can I have multiple SIPs with different step-up rates?',
        a: 'Yes, and it can be smart. Run a high step-up on your retirement SIP (since horizon is longest), a moderate one on a 10-year goal, and a flat SIP on a 3-year goal where the compounding window is too short to matter much. Model each goal separately in the calculator.',
      },
      {
        q: 'What if my income drops? Can I pause the step-up?',
        a: 'Absolutely. The step-up is a target, not a contract. Most fund houses let you pause or modify the SIP anytime. The calculator is for planning — real life adapts. Even hitting 70% of your plan beats not having one.',
      },
    ],
    longform: [
      { type: 'h2', text: 'Why "set and forget" is the wrong default' },
      {
        type: 'p',
        text: 'A flat SIP made sense in an era of stagnant salaries. With most professional roles seeing 7–12% annual increments, a flat SIP slowly shrinks as a % of income — meaning your savings rate decays even as your income rises. A step-up SIP defends against this lifestyle drift automatically: each raise routes a fraction into investing before it touches your spending budget.',
      },
      { type: 'h3', text: 'The "raise + half" rule' },
      {
        type: 'p',
        text: 'Whenever your monthly take-home goes up by X%, raise your SIP by at least X/2 %. Live on the rest. Over a 25-year career, this single discipline often separates retirement-ready savers from "lifestyle inflators" who never quite get there.',
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'Set a calendar reminder for the first working day after your appraisal cycle. That is the day to log into your SIP platform and step up — before the higher salary is already spent.',
      },
    ],
  },

  schema: {
    softwareName: 'Step-Up SIP Calculator',
    softwareFeatures:
      'Annual step-up modeling, Flat vs step-up comparison, Target corpus reverse-engineering, Year-by-year schedule, Excel export',
  },

  relatedTools: [
    { name: 'SIP Calculator', href: '/finance/sip-calculator', icon: '💼' },
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator', icon: '📊' },
    { name: 'FIRE Calculator', href: '/finance/fire-calculator', icon: '🔥' },
  ],
};

export default variant;
