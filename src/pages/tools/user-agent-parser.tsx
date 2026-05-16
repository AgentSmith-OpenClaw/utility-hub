import Head from 'next/head';
import UserAgentParser from '../../components/Tools/UserAgentParser';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/user-agent-parser';

const FAQS = [
  { q: 'What is a User-Agent string?', a: 'A User-Agent (UA) string is an HTTP header sent by every browser, app, or bot with each request. It identifies the software making the request — browser name, version, operating system, and device type. Servers use it to serve device-appropriate content; analytics tools use it to segment traffic.' },
  { q: 'Why do all browsers say "Mozilla/5.0"?', a: 'Historical compatibility. Netscape was the dominant browser in the 1990s, and web servers served rich content only to "Mozilla" agents. Other browsers pretended to be Mozilla to get full content. The pattern stuck — every desktop browser today starts with Mozilla/5.0 as a compatibility token, even though it is meaningless now.' },
  { q: 'How reliable is UA detection?', a: 'UA strings are self-reported and can be spoofed trivially. For security purposes, never trust a UA string to make authorization decisions. For analytics and feature detection, UA parsing gives a reasonable approximation — but browser feature detection via navigator or CSS @supports is always more reliable than sniffing the UA.' },
  { q: 'How does Googlebot identify itself?', a: 'Googlebot uses a UA like: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html). You can verify a bot is really Googlebot by doing a reverse DNS lookup on the request IP — genuine Googlebot IPs resolve to googlebot.com domains.' },
  { q: 'What is "Windows NT 10.0" — is that Windows 10 or 11?', a: 'Both. Windows 11 still reports "Windows NT 10.0" in the UA string for backward compatibility. Microsoft has not updated the NT version number, so the UA alone cannot distinguish Windows 10 from 11. You need the platform API (navigator.userAgentData on Chromium) for a reliable answer.' },
];

export default function UserAgentParserPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'User Agent Parser',
    slug: SLUG,
    description: 'Decode any User-Agent string into browser, engine, OS, device type, and version — with one-click detection of your own browser UA.',
    featureList: 'Browser detection, OS detection, Device type, Bot detection, 8 preset UAs, Detect own browser',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>User Agent Parser — Decode Any UA String | Toolisk</title>
        <meta name="description" content="Decode any User-Agent string into browser name, version, engine, OS, device type, and bot detection. Detects your own browser UA in one click." />
        <meta name="keywords" content="user agent parser, parse user agent, ua parser, browser detection, user agent string decoder, what is my user agent, ua string tool" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="User Agent Parser | Toolisk" />
        <meta property="og:description" content="Decode any User-Agent string — browser, engine, OS, device, and bot flag." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🕵️" title="User Agent Parser" tagline="Decode any User-Agent string into browser, engine, OS, device type, and bot flag — or detect your own browser in one click.">
        <UserAgentParser />
      </ToolShell>

      <ToolSEOContent
        description="A browser-based User-Agent parser that decodes any UA string into its components: browser name and version, rendering engine, operating system, device type (desktop/mobile/tablet/bot), and CPU architecture. Click 'Use my browser's UA' to inspect the current browser, or paste any UA string from server logs or analytics tools."
        features={[
          '🌐 Browser name, version, and rendering engine',
          '💻 OS name and version (macOS, Windows, Android, iOS)',
          '📱 Device type: desktop, mobile, tablet, or bot',
          '🤖 Bot / crawler detection with warning badge',
          '⚡ Detects your own browser UA in one click',
          '📋 8 preset UAs including Chrome, Safari, Firefox, Googlebot',
        ]}
        steps={[
          { title: 'Paste or detect', desc: 'Paste a UA string from server logs, or click "Use my browser\'s UA" to inspect the current browser automatically.' },
          { title: 'Use a preset', desc: 'Click any preset to load a known UA — Chrome on Mac, Safari on iOS, Googlebot, curl, Samsung Internet, etc.' },
          { title: 'Read the results', desc: 'Browser, engine, OS, device type, and CPU architecture are shown in two cards. Bot UAs get an amber warning badge.' },
          { title: 'Copy the raw string', desc: 'The raw UA string is shown below the results with a copy button — useful for pasting into bug reports or analytics queries.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Reading a UA string</h2>
            <p className="text-slate-600 leading-relaxed">
              UA strings look like gibberish but follow a recognisable pattern. Take Chrome on macOS:
            </p>
            <code className="block text-xs bg-slate-100 rounded-lg px-3 py-2 font-mono text-slate-700 whitespace-pre-wrap break-all">
              Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36
            </code>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 mt-3">
              <li><strong>Mozilla/5.0</strong> — legacy compatibility token (meaningless today)</li>
              <li><strong>(Macintosh; Intel Mac OS X 10_15_7)</strong> — OS and CPU</li>
              <li><strong>AppleWebKit/537.36</strong> — rendering engine (Blink for Chrome, despite the name)</li>
              <li><strong>(KHTML, like Gecko)</strong> — another legacy token for Gecko compatibility</li>
              <li><strong>Chrome/124.0.0.0</strong> — the actual browser and version</li>
              <li><strong>Safari/537.36</strong> — a WebKit compatibility token (not actually Safari)</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mt-8">UA detection vs feature detection</h3>
            <p className="text-slate-600 leading-relaxed">
              For most frontend development, prefer feature detection over UA sniffing. Instead of checking
              &ldquo;is this Chrome?&rdquo; and assuming it supports a feature, use{' '}
              <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">if (&apos;IntersectionObserver&apos; in window)</code> or CSS{' '}
              <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">@supports</code>. UA sniffing is useful for
              analytics, server-side optimisations (like serving different image formats), and blocking specific bots.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'HTTP Status Codes', href: '/tools/http-status-codes', icon: '📡' },
          { name: 'JWT Decoder', href: '/tools/jwt-decoder', icon: '🔑' },
          { name: 'URL Encoder / Decoder', href: '/tools/url-encoder', icon: '🔗' },
        ]}
      />
    </>
  );
}
