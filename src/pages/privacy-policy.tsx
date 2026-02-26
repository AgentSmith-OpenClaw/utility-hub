import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — Toolisk</title>
        <meta
          name="description"
          content="Toolisk Privacy Policy — Learn how we handle your data with our zero-persistence approach. GDPR, CCPA, and LGPD compliant."
        />
        <link rel="canonical" href="https://toolisk.com/privacy-policy" />
        <meta property="og:title" content="Privacy Policy — Toolisk" />
        <meta property="og:description" content="Toolisk Privacy Policy — Learn how we handle your data with our zero-persistence approach. GDPR, CCPA, and LGPD compliant." />
        <meta property="og:url" content="https://toolisk.com/privacy-policy" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 text-2xl mb-4">
              🔒
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Privacy Policy</h1>
            <p className="mt-2 text-slate-500 text-sm">Effective Date: February 12, 2026 · Last Updated: February 12, 2026</p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-10 prose prose-gray prose-headings:text-slate-900 prose-a:text-blue-600 max-w-none">

            <h2 className="text-2xl font-bold mt-0">1. Introduction</h2>
            <p>
              Welcome to <strong>Toolisk</strong> (<a href="https://toolisk.com">toolisk.com</a>). Your privacy is fundamentally important to us.
              This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your data
              when you use our website and online tools.
            </p>
            <p>
              By using Toolisk, you agree to the collection and use of information in accordance with this policy. If you do not agree
              with any part of this policy, please discontinue use of our services.
            </p>

            <h2 className="text-2xl font-bold">2. Information We Collect</h2>
            <p>
              Toolisk is designed with a <strong>privacy-first architecture</strong>. We collect minimal data and never
              require user accounts or personal information to use our tools.
            </p>

            <h3 className="text-xl font-semibold">2.1 Information You Provide</h3>
            <p>
              If you contact us via email, we may collect your email address and message content solely for
              the purpose of responding to your inquiry.
            </p>

            <h3 className="text-xl font-semibold">2.2 Automatically Collected Information</h3>
            <p>When you visit Toolisk, we may automatically collect:</p>
            <ul>
              <li><strong>Usage data:</strong> Pages visited, time spent, referring URL, and general interaction patterns (via Google Analytics).</li>
              <li><strong>Device information:</strong> Browser type, operating system, screen resolution, and language preference.</li>
              <li><strong>IP address:</strong> Anonymized and used only for analytics aggregation and security purposes.</li>
            </ul>
            <p>We do <strong>not</strong> collect names, physical addresses, phone numbers, or payment information.</p>

            <h2 className="text-2xl font-bold">3. Zero-Persistence Data Policy</h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 my-4">
              <p className="text-green-800 font-medium mb-2">🛡️ Our Zero-Persistence Commitment</p>
              <p className="text-green-700 text-sm mb-0">
                All tool computations on Toolisk happen <strong>entirely client-side</strong> in your browser.
                Your data — whether it&apos;s financial figures, JSON files, images, or any other input — is
                <strong> never transmitted to our servers</strong>. We do not store, inspect, log, sell, or share
                any data you enter into our tools. When you close your browser tab, your data is gone.
              </p>
            </div>
            <p>
              For tools that offer local storage features (such as calculation history), data is stored exclusively
              in your browser&apos;s <code>localStorage</code> and never leaves your device. You can clear this data
              at any time through your browser settings.
            </p>

            <h2 className="text-2xl font-bold">4. Cookies &amp; Tracking Technologies</h2>

            <h3 className="text-xl font-semibold">4.1 Essential &amp; Analytics Cookies</h3>
            <p>We use the following cookies and tracking technologies:</p>
            <ul>
              <li><strong>Google Analytics (GA4):</strong> We use Google Analytics to understand how visitors interact with our site. Google Analytics uses cookies to collect anonymized usage data. You can opt out using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.</li>
              <li><strong>localStorage:</strong> Used by specific tools (e.g., EMI Calculator history) to persist user preferences locally. This is not a tracking mechanism.</li>
            </ul>

            <h3 className="text-xl font-semibold">4.2 Google AdSense &amp; Third-Party Advertising</h3>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-4">
              <p className="text-amber-800 font-medium mb-2">📢 Third-Party Advertising Disclosure</p>
              <div className="text-amber-700 text-sm">
                <p>
                  Toolisk uses <strong>Google AdSense</strong> to display advertisements. Google AdSense and its partners may use
                  cookies, including the <strong>DoubleClick DART cookie</strong>, to serve ads based on your prior visits to
                  Toolisk and other websites on the internet.
                </p>
                <ul className="mt-2">
                  <li>Google&apos;s use of the DART cookie enables it and its partners to serve ads based on your browsing patterns.</li>
                  <li>Third-party ad vendors and ad networks may use cookies, web beacons, and similar technologies to collect information for ad personalization and measurement.</li>
                  <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-800 underline">Google Ads Settings</a>.</li>
                  <li>You can also opt out of third-party vendor cookies by visiting the <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-amber-800 underline">Network Advertising Initiative opt-out page</a>.</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold">5. How We Use Your Information</h2>
            <p>The limited data we collect is used exclusively to:</p>
            <ul>
              <li>Understand site usage patterns and improve our tools.</li>
              <li>Maintain site security and prevent abuse.</li>
              <li>Display relevant advertisements through Google AdSense.</li>
              <li>Respond to support inquiries sent via email.</li>
            </ul>
            <p>
              We do <strong>not</strong> sell, rent, lease, or share your personal information with any third parties
              for marketing purposes.
            </p>

            <h2 className="text-2xl font-bold">6. Third-Party Services</h2>
            <p>Toolisk integrates with the following third-party services:</p>
            <ul>
              <li><strong>Google Analytics:</strong> For anonymized usage analytics. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
              <li><strong>Google AdSense:</strong> For advertisement serving. <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google Advertising Policies</a></li>
              <li><strong>GitHub Pages / Cloudflare:</strong> For hosting and content delivery.</li>
            </ul>
            <p>
              These third-party services have their own privacy policies governing data they collect. We encourage you to review them.
            </p>

            <h2 className="text-2xl font-bold">7. Your Privacy Rights</h2>

            <h3 className="text-xl font-semibold">7.1 For EU Residents (GDPR)</h3>
            <p>If you are located in the European Economic Area (EEA), you have the following rights under the General Data Protection Regulation (GDPR):</p>
            <ul>
              <li><strong>Right of Access:</strong> Request a copy of any personal data we hold about you.</li>
              <li><strong>Right to Rectification:</strong> Request correction of any inaccurate data.</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data (&ldquo;right to be forgotten&rdquo;).</li>
              <li><strong>Right to Restrict Processing:</strong> Request that we limit how we use your data.</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format.</li>
              <li><strong>Right to Object:</strong> Object to data processing based on legitimate interests or direct marketing.</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:admin@toolisk.com">admin@toolisk.com</a>.</p>

            <h3 className="text-xl font-semibold">7.2 For California Residents (CCPA)</h3>
            <p>Under the California Consumer Privacy Act (CCPA), California residents have the right to:</p>
            <ul>
              <li>Know what personal information is being collected about them.</li>
              <li>Know whether their personal information is sold or disclosed, and to whom.</li>
              <li>Say no to the sale of personal information. <strong>We do not sell personal information.</strong></li>
              <li>Request deletion of their personal information.</li>
              <li>Not be discriminated against for exercising their CCPA rights.</li>
            </ul>

            <h3 className="text-xl font-semibold">7.3 For Brazilian Residents (LGPD)</h3>
            <p>Under the Lei Geral de Proteção de Dados (LGPD), Brazilian residents have the right to:</p>
            <ul>
              <li>Confirmation of the existence of data processing.</li>
              <li>Access to their personal data.</li>
              <li>Correction of incomplete, inaccurate, or outdated data.</li>
              <li>Anonymization, blocking, or deletion of unnecessary or excessive data.</li>
              <li>Portability of data to another service provider.</li>
              <li>Revocation of consent at any time.</li>
            </ul>

            <h2 className="text-2xl font-bold">8. Children&apos;s Privacy</h2>
            <p>
              Toolisk is not directed to children under 13 years of age. We do not knowingly collect personal
              information from children. If you believe a child has provided us with personal data, please
              contact us at <a href="mailto:admin@toolisk.com">admin@toolisk.com</a> and we will promptly delete it.
            </p>

            <h2 className="text-2xl font-bold">9. Data Security</h2>
            <p>
              We take reasonable measures to protect the limited data we collect. Our zero-persistence architecture
              means there is inherently minimal data at risk. All connections to Toolisk are secured via HTTPS/TLS encryption.
            </p>

            <h2 className="text-2xl font-bold">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Changes will be posted on this page with a revised
              &ldquo;Last Updated&rdquo; date. Your continued use of Toolisk after changes constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-2xl font-bold">11. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
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
