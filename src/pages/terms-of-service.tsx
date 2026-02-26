import Head from 'next/head';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service — Toolisk</title>
        <meta
          name="description"
          content="Toolisk Terms of Service — Understand the conditions governing your use of our free online tools, intellectual property, and fair use policies."
        />
        <link rel="canonical" href="https://toolisk.com/terms-of-service" />
        <meta property="og:title" content="Terms of Service — Toolisk" />
        <meta property="og:description" content="Toolisk Terms of Service — Understand the conditions governing your use of our free online tools, intellectual property, and fair use policies." />
        <meta property="og:url" content="https://toolisk.com/terms-of-service" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 text-2xl mb-4">
              📜
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Terms of Service</h1>
            <p className="mt-2 text-slate-500 text-sm">Effective Date: February 12, 2026 · Last Updated: February 12, 2026</p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-10 prose prose-gray prose-headings:text-slate-900 prose-a:text-blue-600 max-w-none">

            <h2 className="text-2xl font-bold mt-0">1. Acceptance of Terms</h2>
            <p>
              By accessing and using <strong>Toolisk</strong> (<a href="https://toolisk.com">toolisk.com</a>), you acknowledge
              that you have read, understood, and agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do
              not agree to these Terms, you must not use our website or services.
            </p>
            <p>
              These Terms apply to all visitors, users, and anyone else who accesses or uses Toolisk.
            </p>

            <h2 className="text-2xl font-bold">2. Description of Service</h2>
            <p>
              Toolisk provides a collection of free, browser-based online tools including (but not limited to) financial
              calculators, developer utilities, converters, and formatters. All tools are provided free of charge and
              process data entirely within your browser (client-side).
            </p>
            <p>
              We reserve the right to modify, suspend, or discontinue any tool or feature at any time, with or without
              notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance
              of the service.
            </p>

            <h2 className="text-2xl font-bold">3. User Responsibilities</h2>
            <p>When using Toolisk, you agree to:</p>
            <ul>
              <li>Use the tools only for lawful purposes and in compliance with all applicable laws and regulations.</li>
              <li>Not input any sensitive, confidential, or personally identifiable information (such as API keys, passwords, or private keys) into tools unless you fully understand and accept the risks.</li>
              <li>Not attempt to interfere with, disrupt, or compromise the integrity or security of the website.</li>
              <li>Not use our tools to generate misleading, fraudulent, or harmful content.</li>
              <li>Verify all outputs from our tools before relying on them for professional, financial, or critical decisions.</li>
            </ul>

            <h2 className="text-2xl font-bold">4. Fair Use &amp; Anti-Scraping Policy</h2>
            <div className="bg-blue-50 border border-indigo-200 rounded-xl p-4 my-4">
              <p className="text-indigo-800 font-medium mb-2">🤖 Automated Access Prohibited</p>
              <div className="text-indigo-700 text-sm">
                <p>
                  You may <strong>not</strong> use automated scripts, bots, crawlers, scrapers, or any other automated
                  means to access, scrape, or interact with Toolisk without our express written permission.
                </p>
                <p className="mb-0">This includes but is not limited to:</p>
                <ul className="mt-2 mb-0">
                  <li>Systematic downloading or caching of content for redistribution.</li>
                  <li>Using automated tools to submit requests at a rate that degrades site performance for others.</li>
                  <li>Mirroring or replicating the functionality of Toolisk on another website without authorization.</li>
                  <li>Using any data mining, robots, or similar data gathering or extraction methods.</li>
                </ul>
              </div>
            </div>
            <p>
              We reserve the right to rate-limit, block, or ban any IP address or user agent engaged in abusive behavior
              or automated access that impacts site performance or availability.
            </p>

            <h2 className="text-2xl font-bold">5. Intellectual Property</h2>
            <h3 className="text-xl font-semibold">5.1 Our Property</h3>
            <p>
              The Toolisk name, logo, visual design, UI components, tool logic, algorithms, and underlying source code
              are the intellectual property of Toolisk and its developer(s). You may not copy, modify, distribute,
              sell, or lease any part of the website&apos;s design or source code without written permission.
            </p>

            <h3 className="text-xl font-semibold">5.2 Your Output</h3>
            <p>
              Any output generated by our tools (calculation results, formatted data, converted files, etc.) belongs
              entirely to you. You are free to use, share, modify, or distribute the output of our tools for any
              purpose, personal or commercial.
            </p>
            <p>
              We claim no ownership or rights over any data you input into or output generated by our tools.
            </p>

            <h2 className="text-2xl font-bold">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, Toolisk and its developer(s) shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenue,
              data, or goodwill, whether arising from:
            </p>
            <ul>
              <li>Your use of or inability to use our tools.</li>
              <li>Any errors, inaccuracies, or omissions in tool outputs.</li>
              <li>Unauthorized access to or alteration of your data or transmissions.</li>
              <li>Any third-party content or conduct on the website.</li>
              <li>Any other matter relating to the service.</li>
            </ul>
            <p>
              Our tools are provided <strong>&ldquo;as is&rdquo;</strong> without any warranties. See our full{' '}
              <Link href="/disclaimer">Disclaimer</Link> for details.
            </p>

            <h2 className="text-2xl font-bold">7. Privacy</h2>
            <p>
              Your use of Toolisk is also governed by our <Link href="/privacy-policy">Privacy Policy</Link>, which
              describes how we collect, use, and protect your information. By using Toolisk, you consent to the
              practices described in our Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold">8. Third-Party Links &amp; Services</h2>
            <p>
              Toolisk may contain links to third-party websites or services that are not owned or controlled by us.
              We assume no responsibility for the content, privacy policies, or practices of any third-party sites.
              You access third-party sites at your own risk.
            </p>

            <h2 className="text-2xl font-bold">9. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Toolisk and its developer(s) from and against any
              claims, liabilities, damages, losses, and expenses arising from your use of the website, violation
              of these Terms, or infringement of any third-party rights.
            </p>

            <h2 className="text-2xl font-bold">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Material changes will be reflected by updating
              the &ldquo;Last Updated&rdquo; date at the top of this page. Your continued use of Toolisk after changes
              are posted constitutes acceptance of the revised Terms.
            </p>

            <h2 className="text-2xl font-bold">11. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited
              or eliminated to the minimum extent necessary so that the remaining provisions remain in full force and effect.
            </p>

            <h2 className="text-2xl font-bold">12. Contact</h2>
            <p>
              For any questions regarding these Terms, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:admin@toolisk.com">admin@toolisk.com</a></li>
              <li><strong>Website:</strong> <Link href="/contact">toolisk.com/contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
