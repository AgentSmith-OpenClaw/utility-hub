import Head from 'next/head';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import IncomeTaxCalculator from '../../components/IncomeTaxCalculator/IncomeTaxCalculator';

export default function IncomeTaxPage() {
  return (
    <>
      <Head>
        <title>India 2026 Tax Calculator — Old vs New Regime Comparison | Toolisk</title>
        <meta 
          name="description" 
          content="India 2026 Tax Calculator for FY 2025-26 (AY 2026-27). Compare Old vs New Regimes with surcharge, slab-wise breakdown, monthly projections, and tax curve analysis. Updated with Union Budget 2025 changes." 
        />
        <meta 
          name="keywords" 
          content="india 2026 tax calculator, income tax calculator fy 2025-26, new tax regime vs old regime, tax calculator india, income tax budget 2025, 87A rebate, surcharge calculator, salaried tax calculator" 
        />
        <link rel="canonical" href="https://toolisk.com/finance/income-tax-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="India 2026 Tax Calculator — Old vs New Regime Comparison" />
        <meta property="og:description" content="Compare Old vs New Tax Regimes for FY 2025-26 with surcharge, slab-wise breakdown, and tax curve. Free, fast and accurate." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://toolisk.com/finance/income-tax-calculator" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <IncomeTaxCalculator />
        
        <div className="mt-12 max-w-4xl mx-auto prose prose-lg prose-blue">
          <h1 className="text-3xl font-bold mb-6">India Income Tax Calculator FY 2025-26 (AY 2026-27): Old vs New Regime</h1>
          
          <p className="mb-4">
            Navigating India's income tax system can be daunting, especially with the introduction of the New Tax Regime and frequent updates in the Union Budget. Whether you're a salaried employee, a freelancer, or a business owner, understanding your tax liability is crucial for effective financial planning.
          </p>
          
          <p className="mb-8">
            This Income Tax Calculator for FY 2025-26 (Assessment Year 2026-27) is designed to simplify the process. It automatically compares your tax liability under both the Old and New Tax Regimes, helping you choose the option that saves you the most money.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Why Use This Income Tax Calculator?</h2>
          <p className="mb-4">Calculating taxes manually is prone to errors and can be time-consuming. Our tool offers:</p>
          <ul className="list-disc pl-6 mb-8 space-y-2">
            <li><strong>Instant Comparison:</strong> See a side-by-side breakdown of your tax liability under both regimes.</li>
            <li><strong>Accurate Deductions:</strong> Factor in Section 80C, 80D, HRA, and other exemptions to see their impact.</li>
            <li><strong>Surcharge & Cess:</strong> Automatically calculate health and education cess and applicable surcharges for high-income earners.</li>
            <li><strong>Rebate Calculation:</strong> Includes the Section 87A rebate for eligible taxpayers.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">Understanding the Two Tax Regimes</h2>
          <p className="mb-4">The choice between the Old and New Tax Regimes is the most significant decision for taxpayers in FY 2025-26.</p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">The New Tax Regime (Default)</h3>
              <p className="mb-2">Introduced to simplify the tax structure, the New Regime offers lower tax rates but removes most exemptions and deductions.</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li><strong>Pros:</strong> Lower tax rates, simpler filing process, increased basic exemption limit (₹3 Lakhs).</li>
                <li><strong>Cons:</strong> No deductions for HRA, LTA, 80C, 80D, etc.</li>
                <li><strong>Ideal For:</strong> Individuals with fewer investments or preferring liquidity.</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">The Old Tax Regime</h3>
              <p className="mb-2">The traditional system allows you to claim various deductions and exemptions to lower your taxable income.</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li><strong>Pros:</strong> Extensive deductions (80C, 80D, HRA, home loan interest).</li>
                <li><strong>Cons:</strong> Higher tax rates if deductions aren't maximized, complex documentation.</li>
                <li><strong>Ideal For:</strong> High HRA, home loans, substantial tax-saving investments.</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Key Components of Your Tax Calculation</h2>
          <div className="space-y-4 mb-8">
            <div>
              <h3 className="font-bold text-lg">1. Gross Total Income</h3>
              <p>This includes income from all sources: salary, house property, capital gains, business/profession, and other sources (interest, dividends).</p>
            </div>
            <div>
              <h3 className="font-bold text-lg">2. Exemptions vs. Deductions</h3>
              <ul className="list-disc pl-6">
                <li><strong>Exemptions:</strong> Income components not included in total income (e.g., HRA, LTA). Subtracted from Gross Salary.</li>
                <li><strong>Deductions:</strong> Amounts subtracted from Gross Total Income to arrive at Taxable Income (e.g., 80C, 80D).</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg">3. Tax Slabs</h3>
              <p>Tax rates differ based on your income bracket. The New Regime has more slabs with lower rates, while the Old Regime has fewer slabs with higher rates.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg">4. Surcharge and Cess</h3>
              <ul className="list-disc pl-6">
                <li><strong>Health & Education Cess:</strong> A flat 4% is added to the total tax payable.</li>
                <li><strong>Surcharge:</strong> An additional tax on tax payable for income &gt; ₹50 Lakhs. Highest surcharge rate under New Regime is capped at 25%.</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Strategic Advice: How to Lower Your Tax Liability</h2>
          <ul className="list-disc pl-6 mb-8 space-y-4">
            <li>
              <strong>Maximize Section 80C (Old Regime Only):</strong> You can claim a deduction of up to ₹1.5 Lakhs for investments in PPF, EPF, ELSS, LIC premiums, and principal repayment of home loans.
            </li>
            <li>
              <strong>Utilize Section 80D (Old Regime Only):</strong> Premiums paid for health insurance for yourself and your parents are deductible. Up to ₹25,000 for self/family and an additional ₹25,000 (or ₹50,000 for senior citizens) for parents.
            </li>
            <li>
              <strong>Claim HRA Exemption (Old Regime Only):</strong> If you live in a rented house and receive HRA, you can claim a significant exemption. Ensure you have valid rent receipts.
            </li>
            <li>
              <strong>Standard Deduction:</strong> A standard deduction of ₹50,000 (or higher as per budget updates) is available for salaried individuals under *both* regimes.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">Common Mistakes to Avoid</h2>
          <ul className="list-disc pl-6 mb-12 space-y-2">
            <li><strong>Not Comparing Regimes:</strong> Don't assume the Old Regime is better just because you have investments. Use the calculator to verify.</li>
            <li><strong>Ignoring Interest Income:</strong> Interest from savings accounts and fixed deposits is taxable. Include it in "Income from Other Sources".</li>
            <li><strong>Forgetting to verify 26AS:</strong> Ensure the tax deducted by your employer (TDS) matches the figures in your Form 26AS.</li>
          </ul>

          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions (FAQ)</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Which tax regime is better for a salary of ₹10 Lakhs?</h3>
                <p className="text-gray-700">It depends on your deductions. If your total deductions (80C, HRA, 80D, etc.) exceed ₹2.5 Lakhs, the Old Regime might be beneficial. If you have no deductions, the New Regime will likely save you tax. Use the calculator to see the exact difference.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Is the Standard Deduction applicable in the New Tax Regime?</h3>
                <p className="text-gray-700">Yes, as per the latest budget updates for FY 2025-26, the Standard Deduction for salaried employees is applicable under the New Tax Regime as well.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">What is the Section 87A rebate limit?</h3>
                <p className="text-gray-700">Under the New Tax Regime, a rebate of up to ₹25,000 is available if taxable income does not exceed ₹7 Lakhs. Under the Old Regime, the rebate is up to ₹12,500 for income up to ₹5 Lakhs.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Can I switch between Old and New Regimes?</h3>
                <p className="text-gray-700">Salaried individuals can choose the regime every year based on what is beneficial. However, individuals with business or professional income can only switch back to the Old Regime once in their lifetime after opting for the New Regime.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">How is HRA exemption calculated?</h3>
                <p className="text-gray-700">HRA exemption is the lowest of: 1) Actual HRA received, 2) 50% of salary (metro) or 40% (non-metro), or 3) Rent paid minus 10% of salary.</p>
              </div>
            </div>
            
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Which tax regime is better for a salary of ₹10 Lakhs?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "It depends on your deductions. If your total deductions (80C, HRA, 80D, etc.) exceed ₹2.5 Lakhs, the Old Regime might be beneficial. If you have no deductions, the New Regime will likely save you tax. Use the calculator to see the exact difference."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is the Standard Deduction applicable in the New Tax Regime?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, as per the latest budget updates for FY 2025-26, the Standard Deduction for salaried employees is applicable under the New Tax Regime as well."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is the Section 87A rebate limit?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Under the New Tax Regime, a rebate of up to ₹25,000 is available if taxable income does not exceed ₹7 Lakhs. Under the Old Regime, the rebate is up to ₹12,500 for income up to ₹5 Lakhs."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I switch between Old and New Regimes?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Salaried individuals can choose the regime every year based on what is beneficial. However, individuals with business or professional income can only switch back to the Old Regime once in their lifetime after opting for the New Regime."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How is HRA exemption calculated?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "HRA exemption is the lowest of: 1) Actual HRA received, 2) 50% of salary (metro) or 40% (non-metro), or 3) Rent paid minus 10% of salary."
                  }
                }
              ]
            })}} />
          </section>
        </div>
      </main>
    </>
  );
}
