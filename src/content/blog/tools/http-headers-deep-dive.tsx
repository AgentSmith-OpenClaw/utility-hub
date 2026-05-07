import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const httpHeadersDeepDive: BlogArticle = {
  slug: 'http-headers-deep-dive',
  category: 'Web',
  title: 'HTTP Headers Deep Dive: The Ones You Actually Need to Know',
  description:
    'Hundreds of HTTP headers exist. About 30 matter day-to-day. Learn the request and response headers that drive caching, security, content negotiation, and the security headers that defend against common attacks.',
  publishedDate: '2026-05-08',
  readTime: '13 min read',
  keywords:
    'http headers, content type, cache control, security headers, csp, hsts, content negotiation, http reference',
  relatedTools: [
    { name: 'JSON Viewer', href: '/tools/json-viewer' },
    { name: 'URL Encoder', href: '/tools/url-encoder' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        HTTP headers are how clients and servers exchange metadata about a request beyond the URL and body. The
        IANA registry lists hundreds. In practice, about thirty matter day-to-day — and getting them right
        affects security, performance, and SEO.
      </Lead>

      <H2>Request headers worth knowing</H2>

      <H3>Host</H3>
      <p>
        Indicates the domain the request is for. Required since HTTP/1.1. Enables virtual hosting (multiple
        domains on the same IP). The single header that turned the modern web possible.
      </p>

      <H3>Accept</H3>
      <p>
        What media types the client wants in response. <code>Accept: application/json</code> tells the server
        to return JSON. Used in content negotiation.
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>Accept: text/html,application/xhtml+xml;q=0.9,*/*;q=0.8</code></pre>
      <p>
        The <code>q=0.9</code> values are quality preferences. Higher = preferred.
      </p>

      <H3>Authorization</H3>
      <p>
        Credentials for accessing the resource. Common schemes:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><code>Authorization: Basic dXNlcjpwYXNz</code> — base64-encoded user:password (insecure over HTTP).</li>
        <li><code>Authorization: Bearer eyJhbGc...</code> — JWT or other token.</li>
      </ul>

      <H3>User-Agent</H3>
      <p>
        Identifies the client. Often abused by servers to vary content (deprecated practice — feature
        detection on the client is better). Mostly used for logging and analytics now.
      </p>

      <H3>Cookie</H3>
      <p>
        Sends previously stored cookies back to the server. Format:
        <code> Cookie: name1=value1; name2=value2</code>.
      </p>

      <H3>Origin</H3>
      <p>
        The origin (scheme + host + port) that initiated the request. Used for CORS decisions.
      </p>

      <H3>Referer</H3>
      <p>
        URL of the page that linked to the current request. Useful for analytics; privacy-sensitive — modern
        browsers send only the origin by default for cross-origin requests.
      </p>

      <H3>If-None-Match / If-Modified-Since</H3>
      <p>
        Conditional requests for caching. "Send me this resource only if it's changed since [ETag] /
        [date]." Server responds 304 Not Modified if cache is still valid.
      </p>

      <H2>Response headers worth knowing</H2>

      <H3>Content-Type</H3>
      <p>
        What media type the response body is. Critical for browsers to render correctly:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><code>text/html; charset=utf-8</code> — HTML pages.</li>
        <li><code>application/json</code> — JSON APIs.</li>
        <li><code>image/png</code>, <code>image/svg+xml</code> — images.</li>
        <li><code>application/pdf</code> — PDFs.</li>
        <li><code>text/css</code>, <code>application/javascript</code> — CSS/JS.</li>
      </ul>
      <p>
        Always include <code>charset=utf-8</code> for text types. Otherwise some browsers default to ISO-8859-1
        and break non-ASCII content.
      </p>

      <H3>Content-Length</H3>
      <p>
        Size of the body in bytes. Required for HTTP/1.1 unless using chunked transfer encoding. Wrong values
        cause truncated responses.
      </p>

      <H3>Cache-Control</H3>
      <p>
        Caching directives:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><code>Cache-Control: no-store</code> — don't cache anywhere. For sensitive responses.</li>
        <li><code>Cache-Control: no-cache</code> — cache, but always revalidate before using.</li>
        <li><code>Cache-Control: public, max-age=3600</code> — cacheable, valid for an hour.</li>
        <li><code>Cache-Control: private, max-age=600</code> — only browsers cache (not CDNs); valid for 10 minutes.</li>
        <li><code>Cache-Control: immutable</code> — never changes; browsers can skip revalidation entirely. Critical for hashed assets.</li>
      </ul>

      <H3>ETag</H3>
      <p>
        Identifier for a specific version of a resource. Server returns; client sends back as
        <code>If-None-Match</code> for conditional requests. Most efficient cache validation mechanism.
      </p>

      <H3>Set-Cookie</H3>
      <p>
        Tells the browser to store a cookie. See our <code>HTTP Cookies</code> guide for full details on
        attributes (HttpOnly, Secure, SameSite, etc.).
      </p>

      <H3>Location</H3>
      <p>
        Used with 3xx redirects to tell the client where to go next. Should be absolute URLs in modern HTTP
        (relative URLs are spec-allowed but cause issues with proxies).
      </p>

      <H2>The security headers</H2>

      <H3>Strict-Transport-Security (HSTS)</H3>
      <p>
        Forces browsers to use HTTPS for this domain for the specified time:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>Strict-Transport-Security: max-age=31536000; includeSubDomains; preload</code></pre>
      <p>
        Once received, the browser refuses to load HTTP versions of your site for the duration. The
        <code>preload</code> directive opts you into the browser's built-in HSTS list (apply at
        hstspreload.org).
      </p>

      <H3>Content-Security-Policy (CSP)</H3>
      <p>
        Whitelist of where resources can come from:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; style-src 'self' 'unsafe-inline'`}</code></pre>
      <p>
        The single most powerful XSS defense. Implementing CSP correctly is non-trivial — start with
        <code>Content-Security-Policy-Report-Only</code> in production for a few weeks to find violations
        before enforcing.
      </p>

      <H3>X-Content-Type-Options</H3>
      <p>
        <code>X-Content-Type-Options: nosniff</code> prevents browsers from guessing the content type. Without
        this, a user-uploaded file labeled as <code>image/png</code> but containing HTML could be rendered as
        HTML — XSS.
      </p>

      <H3>X-Frame-Options / Content-Security-Policy frame-ancestors</H3>
      <p>
        Prevents your page from being framed by other origins (clickjacking defense):
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><code>X-Frame-Options: DENY</code> — never framed.</li>
        <li><code>X-Frame-Options: SAMEORIGIN</code> — only framed by your own origin.</li>
        <li>Modern equivalent: <code>Content-Security-Policy: frame-ancestors 'self'</code></li>
      </ul>

      <H3>Referrer-Policy</H3>
      <p>
        Controls how much of the URL is sent in the <code>Referer</code> header on outgoing links. Recommended:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>Referrer-Policy: strict-origin-when-cross-origin</code></pre>
      <p>
        Sends full URL same-origin, just origin cross-origin, nothing on HTTPS → HTTP downgrade.
      </p>

      <H3>Permissions-Policy</H3>
      <p>
        Restricts which browser features your page (and embedded iframes) can use:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>Permissions-Policy: camera=(), microphone=(), geolocation=(self)</code></pre>

      <Callout title="Defense in depth" accent="indigo">
        Setting all the security headers correctly is a small effort with significant payoff. Tools like
        Mozilla Observatory and securityheaders.com grade your site on these. A green grade isn't
        bulletproof — but a red grade indicates you're leaving easy wins on the table.
      </Callout>

      <H2>Content negotiation headers</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Accept-Language:</strong> client's preferred languages. <code>en-US,en;q=0.5</code></li>
        <li><strong>Accept-Encoding:</strong> compression formats supported. <code>gzip, deflate, br</code></li>
        <li><strong>Vary:</strong> response header listing which request headers were used to compute this response. Critical for correct caching.</li>
      </ul>

      <H2>The Vary header trap</H2>
      <p>
        If your response varies by Origin, Cookie, Accept-Language, or any other header, you must include it in
        the Vary response header. Without it, caches will serve the wrong response to other clients.
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>Vary: Accept-Encoding, Origin, Accept-Language</code></pre>
      <p>
        Common bug: forgetting <code>Vary: Origin</code> when echoing CORS Origin in responses. CDN serves a
        cached response with the wrong allowed origin to the wrong client.
      </p>

      <H2>Custom headers</H2>
      <p>
        Convention is to prefix custom headers with <code>X-</code> historically (X-Request-ID, X-API-Key).
        Modern best practice is to skip the X- prefix (it's not standardized) and use clear vendor-specific
        names: <code>Stripe-Signature</code>, <code>GitHub-Event</code>.
      </p>

      <H2>Common header mistakes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Missing Content-Type charset.</strong> Causes encoding issues with non-ASCII content.</li>
        <li><strong>Wrong Cache-Control for HTML pages.</strong> Caching HTML for hours means users see stale content. Use no-cache + ETag for HTML.</li>
        <li><strong>Forgetting Vary.</strong> Cache poisoning between client populations.</li>
        <li><strong>Setting both Cache-Control and Expires.</strong> Cache-Control wins; Expires is legacy.</li>
        <li><strong>Trusting Referer for security.</strong> Easily spoofed; can be missing entirely.</li>
        <li><strong>Putting auth tokens in URL parameters.</strong> Logged everywhere. Use Authorization header.</li>
        <li><strong>No security headers in production.</strong> Free defense-in-depth wins missed.</li>
      </ul>

      <KeyTakeaways
        items={[
          'About 30 HTTP headers matter day-to-day. Master Content-Type, Cache-Control, ETag, Authorization, and the security headers.',
          'Security headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) are easy wins. Use a tool to audit yours.',
          'Cache-Control: immutable is critical for hashed assets — browsers skip revalidation entirely.',
          'Vary: Origin is mandatory when echoing the CORS Origin header. Without it, CDNs cache-poison.',
          'Always include charset=utf-8 in Content-Type for text resources. Non-ASCII content depends on it.',
        ]}
      />
    </div>
  ),
};
