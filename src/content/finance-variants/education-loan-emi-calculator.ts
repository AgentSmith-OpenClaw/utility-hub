import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'education-loan-emi-calculator',
  calculatorId: 'emi',

  seo: {
    title: 'Education Loan EMI Calculator — Study Abroad & India | Toolisk',
    metaDescription:
      'Free education loan EMI calculator. Plan repayment for India and study-abroad loans, model the moratorium period, and see total interest before signing the sanction letter.',
    keywords:
      'education loan emi calculator, study abroad loan calculator, student loan emi india, education loan moratorium calculator, sbi education loan emi, abroad education loan',
    ogTitle: 'Education Loan EMI Calculator — Study Abroad & India',
    ogDescription:
      'Plan repayment for India and study-abroad loans including the moratorium period — before you sign.',
  },

  hero: {
    icon: '🎓',
    h1: 'Education Loan EMI Calculator',
    tagline:
      'Education loans look manageable until interest accrues silently through your moratorium. Run the full repayment picture before the first semester even starts.',
    gradient: 'from-sky-600 via-blue-600 to-indigo-600',
    breadcrumbLabel: 'Education Loan EMI Calculator',
  },

  content: {
    aboutDescription:
      'An education loan EMI calculator built for the way Indian education loans actually behave — long tenures (8–15 years), a course-plus-grace moratorium during which interest accrues, and a clear gap between domestic loans (9–12%) and study-abroad loans (10–14% + currency risk). Plan the full repayment, not just the monthly EMI.',
    features: [
      '🎓 Moratorium-aware repayment modeling',
      '✈️ Study-abroad vs domestic loan comparison',
      '📊 Interest accrued during the moratorium',
      '⚡ Servicing-during-study vs deferred-interest scenarios',
      '📅 Full repayment schedule post-moratorium',
      '💾 PDF / Excel export',
    ],
    steps: [
      { title: 'Enter loan amount', desc: 'Use the full sanctioned amount including tuition, living costs, and travel. Disbursement is in tranches, but EMI is calculated on the full principal.' },
      { title: 'Set the rate', desc: 'India: 9–12% at public sector banks, 11–15% at NBFCs. Abroad: 9.5–14% at Indian banks, higher at international lenders.' },
      { title: 'Add the moratorium period', desc: 'Course duration + 6 to 12 months grace. Interest accrues silently here — you can either service it monthly or let it capitalize.' },
      { title: 'Choose tenure', desc: '10 years is the most common repayment window. Longer tenures reduce EMI but balloon interest.' },
      { title: 'Compare scenarios', desc: 'Run "service interest during moratorium" vs "defer interest" — the lifetime cost gap is usually 15–25% of the principal.' },
    ],
    faqs: [
      {
        q: 'Should I pay interest during the moratorium period?',
        a: 'If you (or your parents) can manage even partial interest service during the course, do it. Simple math: on a ₹40L loan at 10.5% with a 5-year moratorium, deferred interest balloons the loan to roughly ₹66L by the time EMIs start. Servicing the interest monthly during the course keeps the principal flat — saving ₹25L+ over the life of the loan. Most banks even offer a 1% rate discount if you service interest during studies.',
      },
      {
        q: 'India education loan vs study abroad loan — what is different?',
        a: 'Loan amount cap (India: ₹10–20L typical, abroad: ₹40L–1.5Cr), rate (India: 9–12%, abroad: 10–14% in INR or LIBOR-linked in USD), and collateral requirement (abroad loans above ₹40L almost always require property collateral). Most importantly, abroad loans introduce currency risk — if INR depreciates, your INR-denominated EMI does not change, but your effective USD repayment power abroad shrinks.',
      },
      {
        q: 'Are there tax benefits on an education loan?',
        a: 'Yes — Section 80E lets you deduct the full interest paid on an education loan from your taxable income, with no upper cap, for up to 8 years from the start of repayment. The principal is not deductible. This effectively reduces the post-tax cost of the loan by 20–30% for most earners. Always claim 80E — it is one of the most under-used deductions.',
      },
      {
        q: 'Can I prepay an education loan early?',
        a: 'Yes, and there is almost never a prepayment penalty on education loans (RBI directive on floating-rate retail loans). The catch: prepaying too aggressively in year one or two of repayment forfeits the 80E deduction on that interest. A balanced approach — prepay 30–40% extra each year, but do not rush to close in the first 3 years — usually optimizes total cost.',
      },
      {
        q: 'What happens if I cannot find a job after my course?',
        a: 'Most lenders allow a "moratorium extension" of 6–12 months on request, especially if you can show active job search. After that, missed EMIs hit your CIBIL hard. The safer plan: have a 6–12 month EMI buffer parked in liquid funds before graduation. The moratorium calculator in our tool shows exactly what that buffer needs to be.',
      },
    ],
    longform: [
      { type: 'h2', text: 'The hidden cost of a "5-year moratorium"' },
      {
        type: 'p',
        text: 'When the bank tells you "no EMI for the first 5 years," they leave out a critical detail: the interest is still accruing. On a ₹40 lakh loan at 10.5% with a 4-year course and 1-year grace, you start your career not with ₹40L of debt but with roughly ₹60L — and your EMIs are calculated on that capitalized amount. This is the single biggest reason education loan defaults rise in years 2–3 of repayment, not year 1.',
      },
      { type: 'h3', text: 'Two repayment patterns that change your life' },
      {
        type: 'ul',
        items: [
          'Servicing the interest during the moratorium (even partially) keeps the principal flat and saves 15–25% of the total loan cost over its life.',
          'Front-loading prepayments in years 4–8 of repayment captures both compounding savings and 80E tax benefits in the higher-earning years.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'If parents are funding 50% of the course anyway, route their contribution toward servicing the loan interest instead of paying fees directly. Same money, dramatically lower total cost.',
      },
      { type: 'h2', text: 'A repayment playbook by year' },
      {
        type: 'ol',
        items: [
          'Years 1–4 (course): service the simple interest monthly to keep principal flat.',
          'Year 5 (grace): build a 6-month EMI emergency fund in a liquid fund.',
          'Years 6–10: pay normal EMIs + 1 extra EMI per year as prepayment. Claim 80E throughout.',
          'Year 11–12: aggressive prepayment as income grows — close the loan 2–3 years early.',
        ],
      },
    ],
  },

  schema: {
    softwareName: 'Education Loan EMI Calculator',
    softwareFeatures:
      'Education loan EMI, Moratorium modeling, Interest-during-study scenarios, Study abroad & India comparison, PDF & Excel export',
  },

  relatedTools: [
    { name: 'Student Loan Calculator', href: '/finance/student-loan-calculator', icon: '🎓' },
    { name: 'EMI Calculator', href: '/finance/emi-calculator', icon: '💳' },
    { name: 'Personal Loan EMI', href: '/finance/personal-loan-emi-calculator', icon: '👤' },
  ],
};

export default variant;
