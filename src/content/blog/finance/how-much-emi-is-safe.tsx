import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, ToolCTA, KeyTakeaways, Callout } from '../components';

export const howMuchEmiIsSafe: BlogArticle = {
  slug: 'how-much-emi-is-safe',
  category: 'Loans',
  title: 'How Much EMI Is Safe for Your Salary?',
  description: 'Learn practical EMI-to-income limits, why bank eligibility can be too aggressive, and how to stress-test loans before borrowing.',
  publishedDate: '2026-05-14',
  readTime: '7 min read',
  keywords: 'how much emi is safe, emi to income ratio, safe emi percentage, loan affordability, emi calculator salary',
  relatedTools: [
    { name: 'EMI Calculator', href: '/finance/emi-calculator' },
    { name: 'Home Loan EMI Calculator', href: '/finance/home-loan-emi-calculator' },
    { name: 'House Affordability Calculator', href: '/finance/house-affordability-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        A safe EMI is not the maximum a bank approves. It is the payment you can handle while still saving, investing,
        and absorbing emergencies without using credit cards.
      </Lead>

      <ToolCTA
        href="/finance/emi-calculator"
        label="Calculate EMI Before Borrowing"
        hint="Model payment, interest, tenure, and prepayment options before committing to a loan."
        accent="blue"
      />

      <H2>Useful EMI limits</H2>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Comfortable:</strong> total EMIs under 30-35% of net monthly income.</li>
        <li><strong>Manageable:</strong> 35-40% if income is stable and emergency savings are strong.</li>
        <li><strong>Stretched:</strong> 40-50%, especially if household income depends on one earner.</li>
        <li><strong>Danger zone:</strong> above 50%, unless the situation is temporary and well funded.</li>
      </ul>

      <H2>Why eligibility is not affordability</H2>
      <p>
        Lenders approve based on their risk controls. They do not know your family obligations, job stability, medical
        risks, relocation plans, or how much you want to invest. Your affordability threshold should be stricter.
      </p>

      <H3>Stress-test before signing</H3>
      <p>
        Run the loan at rate + 1%, add insurance and fees, and test a lower-income month. For housing decisions, use
        the <Link href="/finance/house-affordability-calculator" className="text-indigo-600 font-semibold hover:underline">House Affordability Calculator</Link> rather than EMI alone.
      </p>

      <Callout title="The emergency-fund rule" accent="amber">
        If a new EMI prevents you from maintaining three to six months of expenses in liquid savings, the loan is too tight.
      </Callout>

      <KeyTakeaways
        items={[
          'Use net income, not gross salary, to judge EMI safety.',
          'Total EMIs under 35-40% of net income is a practical ceiling for many households.',
          'Bank eligibility is often more aggressive than personal affordability.',
          'Stress-test interest rates, job changes, and emergency expenses before borrowing.',
        ]}
      />
    </div>
  ),
};
