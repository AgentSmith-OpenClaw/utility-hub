import Head from 'next/head';
import Link from 'next/link';

export default function Disclaimer() {
  return (
    <>
      <Head>
        <title>Disclaimer — Toolisk</title>
        <meta
          name="description"
          content="Toolisk Disclaimer — Financial and technical disclaimers for all tools and calculators. Tools are provided as-is for informational purposes only."
        />
        <link rel="canonical" href="https://toolisk.com/disclaimer" />
        <meta property="og:title" content="Disclaimer — Toolisk" />
        <meta property="og:description" content="Toolisk Disclaimer — Financial and technical disclaimers for all tools and calculators. Tools are provided as-is for informational purposes only." />
        <meta property="og:url" content="https://toolisk.com/disclaimer" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 text-2xl mb-4">
              ⚠️
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Disclaimer</h1>
            <p className="mt-2 text-slate-500 text-sm">Last Updated: February 12, 2026</p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-10 prose prose-gray prose-headings:text-slate-900 prose-a:text-blue-600 max-w-none">

            <h2 className="text-2xl font-bold mt-0">1. General Disclaimer</h2>
            <p>
              The information and tools provided on <strong>Toolisk</strong> (<a href="https://toolisk.com">toolisk.com</a>) are
              for <strong>general informational and educational purposes only</strong>. While we strive for accuracy and reliability,
              Toolisk makes no warranties or guarantees — express or implied — about the completeness, accuracy, reliability,
              suitability, or availability of the tools, information, or related graphics contained on this website.
            </p>
            <p>
              Any reliance you place on the output of our tools is <strong>strictly at your own risk</strong>.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold">2. Financial Tools Disclaimer</h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 my-4">
              <p className="text-red-800 font-medium mb-2">⚠️ Important: Not Financial Advice</p>
              <p className="text-red-700 text-sm mb-0">
                The financial calculators on Toolisk (including the EMI Calculator, mortgage calculator, and any future
                financial tools) provide <strong>estimates and projections only</strong>. They are <strong>not</strong> a
                substitute for professional financial advice.
              </p>
            </div>
            <p>Specifically:</p>
            <ul>
              <li>
                <strong>Results are estimates:</strong> Calculated values are based on the inputs you provide and standard
                mathematical formulas. Actual loan payments, interest rates, and financial outcomes may vary based on
                lender-specific terms, fees, taxes, insurance, and other factors not accounted for by our calculators.
              </li>
              <li>
                <strong>Not professional advice:</strong> Toolisk does not provide financial, investment, tax, or
                legal advice. Always consult with a qualified financial advisor, mortgage broker, or relevant professional
                before making financial decisions.
              </li>
              <li>
                <strong>No lender affiliation:</strong> Toolisk is not a bank, lender, or financial institution. We do not
                offer loans, mortgages, or any financial products. Our tools are purely informational.
              </li>
              <li>
                <strong>Interest rate accuracy:</strong> Interest rates used in calculations are user-provided. We do not
                guarantee that any rate reflects current market conditions or any specific lender&apos;s offering.
              </li>
            </ul>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold">3. Technical &amp; Developer Tools Disclaimer</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-4">
              <p className="text-amber-800 font-medium mb-2">🔧 Technical Tools: User Responsibility</p>
              <p className="text-amber-700 text-sm mb-0">
                When using developer and technical tools (such as JSON formatters, converters, or any data-processing
                utilities), <strong>you are solely responsible for the data you input</strong>.
              </p>
            </div>
            <p>Specifically:</p>
            <ul>
              <li>
                <strong>Sensitive data warning:</strong> Do not paste API keys, passwords, access tokens, private keys,
                or any other sensitive credentials into any tool. While our tools process data client-side and don&apos;t
                transmit it, your browser extensions or clipboard history may retain it.
              </li>
              <li>
                <strong>Data validation:</strong> Always validate the output of any technical tool before using it in a
                production environment. Our tools process data as-is and cannot account for edge cases specific to
                your application.
              </li>
              <li>
                <strong>No guarantee of compatibility:</strong> Formatted, converted, or processed output may require
                additional adjustments for your specific use case, framework, or platform.
              </li>
            </ul>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold">4. &ldquo;As-Is&rdquo; Clause</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-4">
              <p className="text-slate-700 text-sm mb-0">
                All tools, content, and services on Toolisk are provided <strong>&ldquo;as is&rdquo;</strong> and
                <strong> &ldquo;as available&rdquo;</strong> without warranties of any kind, either express or implied,
                including but not limited to implied warranties of merchantability, fitness for a particular purpose,
                or non-infringement.
              </p>
            </div>
            <p>
              <strong>Toolisk, its developer(s), and contributors shall not be held liable</strong> for any direct, indirect,
              incidental, special, consequential, or punitive damages — including but not limited to financial loss, data
              loss, loss of profits, or business interruption — arising out of or in connection with the use or inability
              to use our tools and services, even if advised of the possibility of such damages.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold">5. External Links</h2>
            <p>
              Toolisk may contain links to external websites or resources. We have no control over the content, privacy
              policies, or practices of any third-party sites and accept no responsibility or liability for them. The inclusion
              of any link does not imply endorsement by Toolisk.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold">6. Changes to This Disclaimer</h2>
            <p>
              We reserve the right to update or modify this Disclaimer at any time without prior notice. Changes will be
              posted on this page with a revised date. Your continued use of Toolisk constitutes acceptance of any
              modifications.
            </p>

            <h2 className="text-2xl font-bold">7. Contact</h2>
            <p>
              If you have questions about this Disclaimer, please contact us at{' '}
              <a href="mailto:admin@toolisk.com">admin@toolisk.com</a> or visit our{' '}
              <Link href="/contact">Contact page</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
