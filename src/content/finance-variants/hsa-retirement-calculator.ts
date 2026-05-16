import type { FinanceVariant } from './_types';

const variant: FinanceVariant = {
  slug: 'hsa-retirement-calculator',
  calculatorId: 'hsa',
  seo: {
    title: 'HSA Retirement Calculator: Invest for the Future | Toolisk',
    metaDescription: 'Project your HSA balance at retirement and see how it compares to other retirement accounts. Model the HSA as a tax-free retirement fund. Free.',
    keywords: 'hsa retirement calculator, hsa retirement savings, hsa investment growth, hsa as retirement account, hsa at retirement',
    ogTitle: 'HSA Retirement Calculator',
    ogDescription: 'Model your HSA as a retirement savings vehicle and project its long-term tax-free growth.',
  },
  hero: {
    icon: '🌅',
    h1: 'HSA Retirement Calculator',
    tagline: "Your HSA isn't just for medical bills — it's the best retirement account most people overlook. See what yours could be worth in 20-30 years.",
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    breadcrumbLabel: 'HSA Retirement Calculator',
  },
  content: {
    aboutDescription: 'After age 65, HSA funds can be used for any purpose — just like a Traditional IRA. But for medical expenses (which are substantial in retirement), withdrawals remain completely tax-free. This makes the HSA uniquely valuable as a retirement vehicle.',
    features: [
      '🌅 Long-term HSA balance projection',
      '📊 HSA vs taxable account comparison at retirement',
      '💊 Medical expense coverage analysis',
      '💰 Tax savings accumulated over investment horizon',
      '📈 Investment return compounding visualization',
    ],
    steps: [
      { title: 'Set your age and horizon', desc: 'Current age and years until you plan to use the funds.' },
      { title: 'Enter contribution amounts', desc: 'Annual contributions and current balance.' },
      { title: 'Set growth assumptions', desc: 'Expected annual investment return.' },
      { title: 'See retirement outcome', desc: 'Projected HSA balance vs. taxable account and total lifetime tax advantage.' },
    ],
    faqs: [
      { q: 'Can I use my HSA to pay Medicare premiums in retirement?', a: "Yes — after age 65, you can use HSA funds tax-free to pay Medicare Part B, Part C (Medicare Advantage), and Part D premiums, as well as long-term care insurance premiums (subject to IRS limits). Medigap premiums are not eligible. This is one of the most valuable HSA uses in retirement." },
      { q: 'Is it better to spend my HSA now or let it grow for retirement?', a: "If you can pay current medical bills from other funds, letting your HSA grow tax-free for decades is almost always better. Save your receipts — there is no statute of limitations for reimbursing past eligible expenses from an HSA. You can reimburse yourself decades later for expenses paid out of pocket today." },
    ],
    longform: [
      { type: 'h2', text: 'The HSA Triple Advantage in Retirement' },
      { type: 'p', text: 'Healthcare is typically a retiree\'s largest expense category, often exceeding $300,000 over retirement for a couple. An HSA that covers even a portion of these expenses tax-free is extraordinarily valuable. Unlike an FSA, HSA funds never expire — they roll over indefinitely and can be invested in stocks, bonds, and mutual funds while you wait to need them.' },
    ],
  },
};

export default variant;
