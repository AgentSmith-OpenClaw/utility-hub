import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, ToolCTA, Comparison, KeyTakeaways, Callout } from '../components';

export const extraMortgagePaymentsVsInvesting: BlogArticle = {
  slug: 'extra-mortgage-payments-vs-investing',
  category: 'Real Estate',
  title: 'Extra Mortgage Payments vs Investing: Which Wins?',
  description: 'Compare the guaranteed return from extra mortgage payments against investing the same cash, including liquidity, risk, and taxes.',
  publishedDate: '2026-05-14',
  readTime: '8 min read',
  keywords: 'extra mortgage payments vs investing, pay extra on mortgage or invest, mortgage prepayment vs investing, extra payment calculator',
  relatedTools: [
    { name: 'Extra Mortgage Payment Calculator', href: '/finance/extra-mortgage-payment-calculator' },
    { name: 'Mortgage Payoff Calculator', href: '/finance/mortgage-payoff-calculator' },
    { name: 'Investment Calculator', href: '/finance/investment-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Extra mortgage payments give a guaranteed return equal to your mortgage rate. Investing may produce a higher
        return, but with volatility and less certainty. The best choice depends on rate, taxes, timeline, and liquidity.
      </Lead>

      <ToolCTA
        href="/finance/extra-mortgage-payment-calculator"
        label="Calculate Extra Payment Savings"
        hint="See how monthly extra principal payments change your mortgage payoff date."
        accent="blue"
      />

      <Comparison
        leftTitle="Pay extra on mortgage"
        left={<p>Guaranteed interest savings, lower debt risk, less liquidity after payment.</p>}
        rightTitle="Invest the surplus"
        right={<p>Higher expected return over long periods, more volatility, better liquidity if kept outside retirement accounts.</p>}
      />

      <H2>The decision rule</H2>
      <p>
        If your mortgage rate is high, prepayment becomes attractive. If your rate is low and fixed, investing often
        has a better expected return over long horizons. But expected return is not guaranteed return, so do not ignore
        the psychological value of lower debt.
      </p>

      <H3>Use a split strategy</H3>
      <p>
        Many households do best by splitting surplus cash: some toward principal, some toward investments. That keeps
        progress visible while preserving upside and liquidity.
      </p>

      <Callout title="Liquidity matters" accent="amber">
        A brokerage balance can be sold in an emergency. Extra mortgage payments usually cannot be recovered unless
        you refinance, sell, or use a home equity line.
      </Callout>

      <p>
        Compare the mortgage path with the <Link href="/finance/mortgage-payoff-calculator" className="text-indigo-600 font-semibold hover:underline">Mortgage Payoff Calculator</Link>, then
        model the investment path with the <Link href="/finance/investment-calculator" className="text-indigo-600 font-semibold hover:underline">Investment Calculator</Link>.
      </p>

      <KeyTakeaways
        items={[
          'Mortgage prepayment is a guaranteed return equal to the loan rate.',
          'Investing has higher expected return but more uncertainty.',
          'Low-rate fixed mortgages make investing more attractive.',
          'A split strategy often balances risk, liquidity, and peace of mind.',
        ]}
      />
    </div>
  ),
};
