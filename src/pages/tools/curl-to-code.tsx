import Head from 'next/head';
import CurlToCode from '../../components/Tools/CurlToCode';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/curl-to-code';

const FAQS = [
  { q: 'Which curl flags are supported?', a: 'Supported flags: -X / --request (method), -H / --header (headers), -d / --data / --data-raw / --data-binary (body), --data-urlencode (body), -u / --user (Basic auth), --compressed. Unsupported: file uploads (--form, -F), client certificates, --resolve, and most network-tuning flags. These cover the vast majority of real-world API calls.' },
  { q: 'Does it handle multiline curl commands?', a: 'Yes — backslash-newline line continuations are collapsed before parsing, so you can paste curl commands copied from the terminal or browser DevTools exactly as they appear.' },
  { q: 'How does Basic authentication work?', a: 'If -u user:password is present, the tool converts it to an Authorization: Basic <base64(user:password)> header in all output languages. In the Python and Node outputs, the base64 encoding is embedded directly so the generated code is self-contained.' },
  { q: 'Can I trust the generated code in production?', a: 'The generated code is a starting point. Always review it for error handling (no try/catch is added), timeout settings, and your language\'s idioms for streaming or large payloads. The tool focuses on faithfully converting the curl parameters — adding production robustness is your job.' },
  { q: 'Why does the axios output use await at the top level?', a: 'The generated code assumes an async context (e.g. inside an async function or a Node module with top-level await enabled). Wrap it in async function main() { ... } main(); if you need it to run in a CommonJS script.' },
];

export default function CurlToCodePage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'cURL to Code Converter',
    slug: SLUG,
    description: 'Convert any cURL command to fetch, axios, Python requests, or Node.js http code. Handles headers, body, Basic auth, and method flags.',
    featureList: 'fetch, axios, Python requests, Node http, Basic auth, Headers, Request body, Multi-line curl',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>cURL to Code — Convert curl to fetch, axios, Python | Toolisk</title>
        <meta name="description" content="Paste a cURL command and get equivalent fetch, axios, Python requests, or Node.js code instantly. Handles headers, body, Basic auth, and multiline curl." />
        <meta name="keywords" content="curl to code, curl to fetch, curl to python, curl to axios, curl converter, curl to javascript, curl to node, convert curl command" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="cURL to Code Converter | Toolisk" />
        <meta property="og:description" content="Convert cURL to fetch, axios, Python requests, or Node.js — instantly." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🔄" title="cURL to Code" tagline="Paste any cURL command — get equivalent fetch, axios, Python requests, or Node.js code instantly, in your browser.">
        <CurlToCode />
      </ToolShell>

      <ToolSEOContent
        description="A browser-based cURL command converter that turns curl into runnable code in four languages. Paste a command (including multi-line backslash continuations), see it parsed into URL, method, headers, and body, then switch between fetch, axios, Python requests, and Node.js http output tabs."
        features={[
          '🔄 Converts to fetch, axios, Python, and Node http',
          '🔑 Handles -H headers, -d body, -u Basic auth',
          '📋 Multi-line curl with backslash continuations',
          '🔍 Parsed summary shows URL, method, headers, body',
          '📁 One-click copy per language',
          '🛡️ 100% client-side — curl commands not logged',
        ]}
        steps={[
          { title: 'Paste the curl command', desc: 'Copy a curl command from terminal, Postman, or browser DevTools and paste it in. Multi-line OK.' },
          { title: 'Check the parsed summary', desc: 'The tool shows the detected method, URL, headers, and body — confirm parsing is correct before copying code.' },
          { title: 'Choose a language', desc: 'Click fetch, axios, Python, or Node to switch code output tabs.' },
          { title: 'Copy and use', desc: 'Click Copy to put the code on your clipboard and paste it into your project.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why convert cURL?</h2>
            <p className="text-slate-600 leading-relaxed">
              cURL is the universal language of HTTP — API documentation, browser DevTools, and most backend tools
              export examples as curl commands. But once you understand the request, you need it in your language
              of choice. Translating curl flags manually is tedious and error-prone, especially when there are a
              dozen headers and a JSON body.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Getting curl from browser DevTools</h3>
            <p className="text-slate-600 leading-relaxed">
              Open DevTools (F12), go to the Network tab, find the request you want to replicate, right-click
              it, and choose <em>Copy → Copy as cURL</em>. Chrome, Firefox, Edge, and Safari all support this.
              The exported command includes all cookies, headers, and the request body — paste it here and you
              get working code in seconds.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Limitations to know</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li>File uploads (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">--form</code>,{' '}
                <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">-F</code>) are not supported yet — the generated code skips form data.</li>
              <li>Client certificates (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">--cert</code>,{' '}
                <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">--key</code>) are not translated.</li>
              <li>No error handling or retry logic is added to the output — it&apos;s the minimal happy-path code.</li>
              <li>Cookie jars (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">-c</code>,{' '}
                <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">-b FILE</code>) are not yet handled; inline <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">--cookie</code> values are passed as a Cookie header.</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'URL Encoder / Decoder', href: '/tools/url-encoder', icon: '🔗' },
          { name: 'HTTP Status Codes', href: '/tools/http-status-codes', icon: '📡' },
          { name: 'JSON Viewer & Formatter', href: '/tools/json-viewer', icon: '🧩' },
        ]}
      />
    </>
  );
}
