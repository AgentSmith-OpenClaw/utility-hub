import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, ToolCTA, KeyTakeaways, Callout } from '../components';

export const grossPayVsNetPay: BlogArticle = {
  slug: 'gross-pay-vs-net-pay',
  category: 'Tax',
  title: 'Gross Pay vs Net Pay: Why Your Take-Home Pay Is Lower',
  description: 'Understand the difference between gross pay and net pay, including federal tax, state tax, FICA, benefits, and retirement deductions.',
  publishedDate: '2026-05-14',
  readTime: '7 min read',
  keywords: 'gross pay vs net pay, gross to net salary, after tax income, take home pay, paycheck deductions',
  relatedTools: [
    { name: 'Gross to Net Salary Calculator', href: '/finance/gross-to-net-salary-calculator' },
    { name: 'After-Tax Income Calculator', href: '/finance/after-tax-income-calculator' },
    { name: 'US Paycheck Calculator', href: '/finance/us-paycheck-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Gross pay is what you earn before deductions. Net pay is what actually lands in your bank account. The gap
        can be large, especially after taxes, insurance, retirement contributions, and benefit deductions.
      </Lead>

      <ToolCTA
        href="/finance/gross-to-net-salary-calculator"
        label="Convert Gross Salary to Net Pay"
        hint="Estimate take-home pay from salary, filing status, state, FICA, and deductions."
        accent="emerald"
      />

      <H2>What comes out of gross pay?</H2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Federal income tax withholding</li>
        <li>State and sometimes local income tax</li>
        <li>Social Security and Medicare taxes</li>
        <li>Health, dental, and vision insurance</li>
        <li>401(k), HSA, FSA, and other payroll deductions</li>
      </ul>

      <H2>Why two people with the same salary take home different amounts</H2>
      <p>
        Filing status, state, benefit elections, retirement contributions, pre-tax deductions, and paycheck frequency
        all change net pay. A $100,000 salary in one state can feel very different from the same salary elsewhere.
      </p>

      <H3>Use net pay for budgeting</H3>
      <p>
        Rent, EMIs, savings goals, and monthly expenses should be based on net pay, not gross salary. If you are
        comparing offers, run both through the <Link href="/finance/after-tax-income-calculator" className="text-indigo-600 font-semibold hover:underline">After-Tax Income Calculator</Link>.
      </p>

      <Callout title="Pre-tax deductions are not bad" accent="blue">
        A lower paycheck may reflect useful savings: retirement contributions, HSA funding, or insurance. Track the
        deduction purpose before assuming take-home pay is simply “lost.”
      </Callout>

      <KeyTakeaways
        items={[
          'Gross pay is before tax and deductions; net pay is take-home pay.',
          'Budget from net pay, not offer-letter salary.',
          'State taxes and benefits can change take-home pay materially.',
          'Pre-tax deductions can reduce taxes while building savings or coverage.',
        ]}
      />
    </div>
  ),
};
