import Head from 'next/head';
import HttpStatusCodes from '../../components/Tools/HttpStatusCodes';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/http-status-codes';

const FAQS = [
  { q: 'What do 1xx HTTP status codes mean?', a: '1xx codes are informational — they indicate that the request was received and the server is continuing to process it. They are rarely seen by end users. The most common is 101 Switching Protocols, used when upgrading a connection to WebSocket.' },
  { q: 'What is the difference between 401 and 403?', a: '401 Unauthorized means authentication is required — the client needs to provide credentials. 403 Forbidden means the client is authenticated but does not have permission to access the resource. A logged-in user who tries to access an admin page gets 403, not 401.' },
  { q: 'When should I use 301 vs 302 redirect?', a: 'Use 301 (Moved Permanently) when a URL has permanently changed — search engines will update their index and pass link equity. Use 302 (Found) for temporary redirects, like A/B testing or maintenance pages, where you want search engines to keep the original URL indexed.' },
  { q: 'What is the difference between 404 and 410?', a: '404 Not Found means the resource doesn\'t exist right now, but it might exist later. 410 Gone tells clients and search engines that the resource is permanently gone and should be deindexed. Use 410 when you intentionally remove a page.' },
  { q: 'What causes a 429 error?', a: '429 Too Many Requests means the client has exceeded a rate limit. The server may include a Retry-After header telling the client when to try again. Common in REST APIs that limit requests per minute or hour.' },
];

export default function HttpStatusCodesPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'HTTP Status Code Reference',
    slug: SLUG,
    description: 'Searchable reference for all HTTP status codes — 1xx through 5xx — with plain-English descriptions and usage guidance.',
    featureList: '1xx-5xx codes, Search by code or name, Click for details, 38 status codes covered',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>HTTP Status Codes Reference — Complete Guide | Toolisk</title>
        <meta name="description" content="Searchable HTTP status code reference. Look up any 1xx–5xx code by number or name. Plain-English descriptions, usage guidance, and common pitfalls for all major HTTP codes." />
        <meta name="keywords" content="http status codes, 404 not found, 401 vs 403, 301 redirect, 500 internal server error, http error codes, rest api status codes, http response codes" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="HTTP Status Code Reference | Toolisk" />
        <meta property="og:description" content="Look up any HTTP status code by number or name. Plain-English descriptions for all 1xx–5xx codes." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🌐" title="HTTP Status Codes" tagline="Searchable reference for every HTTP status code — 1xx through 5xx — with plain-English descriptions.">
        <HttpStatusCodes />
      </ToolShell>

      <ToolSEOContent
        description="A complete, searchable HTTP status code reference covering all major codes from 100 Continue to 508 Loop Detected. Each entry includes a plain-English description, when to use it, and common pitfalls. Search by code number, name, or keyword."
        features={[
          '🔍 Search by code number, name, or keyword',
          '📚 38 status codes across 1xx–5xx',
          '💬 Plain-English descriptions for each code',
          '🖱️ Click any code for expanded details',
          '🎨 Color-coded by category',
          '📱 Mobile-friendly layout',
        ]}
        steps={[
          { title: 'Search for a code', desc: 'Type a code number (404), name (forbidden), or keyword (redirect) in the search box.' },
          { title: 'Browse by category', desc: 'Codes are grouped by 1xx, 2xx, 3xx, 4xx, and 5xx for easy browsing.' },
          { title: 'Click for details', desc: 'Click any status code card to expand its full description and usage notes.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">HTTP status code categories</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>1xx Informational:</strong> request received, processing continues</li>
              <li><strong>2xx Success:</strong> request successfully received, understood, and accepted</li>
              <li><strong>3xx Redirection:</strong> further action needed to complete the request</li>
              <li><strong>4xx Client Errors:</strong> request contains bad syntax or cannot be fulfilled</li>
              <li><strong>5xx Server Errors:</strong> server failed to fulfill a valid request</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'JWT Decoder', href: '/tools/jwt-decoder', icon: '🔑' },
          { name: 'URL Encoder / Decoder', href: '/tools/url-encoder', icon: '🔗' },
          { name: 'JSON Viewer & Formatter', href: '/tools/json-viewer', icon: '🧩' },
        ]}
      />
    </>
  );
}
