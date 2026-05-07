import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const corsErrorsExplained: BlogArticle = {
  slug: 'cors-errors-explained',
  category: 'Web',
  title: 'CORS Errors: Why They Happen and How to Actually Fix Them',
  description:
    'CORS is the browser security mechanism every web developer eventually fights. Learn the actual model (it\'s not what you think), the headers, the preflight dance, and the right way to configure it.',
  publishedDate: '2026-05-08',
  readTime: '11 min read',
  keywords:
    'cors, cross origin, same origin policy, preflight request, access control allow origin, cors errors',
  relatedTools: [
    { name: 'JSON Viewer', href: '/tools/json-viewer' },
    { name: 'URL Encoder', href: '/tools/url-encoder' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Every web developer fights CORS at some point. The mistake people make is treating it as an obstacle
        to bypass, when really it's a security mechanism with specific rules. Once you understand the
        actual model — not the "just allow everything" folklore — CORS errors stop being mysterious.
      </Lead>

      <H2>The Same-Origin Policy</H2>
      <p>
        Browsers enforce the Same-Origin Policy: by default, JavaScript at <code>https://app.example.com</code>
        cannot read responses from <code>https://api.example.com</code> via fetch/XHR. The policy protects
        against malicious sites stealing data from sites you're logged in to.
      </p>
      <p>
        "Origin" means the combination of scheme (http/https), host (app.example.com), and port
        (default or explicit). Any difference makes them different origins. <code>https://example.com</code> and
        <code>https://www.example.com</code> are different origins. <code>http://localhost:3000</code> and
        <code>http://localhost:3001</code> are different origins.
      </p>

      <Callout title="The misconception" accent="amber">
        The browser <em>still sends the request</em> — that's not what CORS prevents. The server sees and
        processes it. CORS prevents the <em>browser's JavaScript</em> from reading the response, unless
        the server has explicitly opted in. This matters for understanding why CORS errors happen on the
        client even when the server logs show the request succeeded.
      </Callout>

      <H2>How CORS opts in</H2>
      <p>
        For the browser to allow JavaScript to read a cross-origin response, the server must include specific
        headers in its response.
      </p>

      <H3>Simple requests</H3>
      <p>
        A "simple" request is GET, HEAD, or POST with a content type from a small whitelist
        (<code>application/x-www-form-urlencoded</code>, <code>multipart/form-data</code>, or
        <code>text/plain</code>) and no custom headers.
      </p>
      <p>
        The browser sends the request with an <code>Origin</code> header. The server response must include:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>Access-Control-Allow-Origin: https://app.example.com</code></pre>

      <p>
        Or a wildcard:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>Access-Control-Allow-Origin: *</code></pre>

      <p>
        Without one of these, the browser blocks the JavaScript from reading the response. The actual data
        was already sent and received — but the browser quarantines it.
      </p>

      <H3>Preflight (OPTIONS) requests</H3>
      <p>
        For non-simple requests (POST with JSON body, custom headers, methods like PUT/DELETE), the browser
        first sends an <code>OPTIONS</code> preflight to ask the server what's allowed:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`OPTIONS /api/users HTTP/1.1
Origin: https://app.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization`}</code></pre>

      <p>
        The server must respond with the matching allow headers:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: POST, GET, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400`}</code></pre>

      <p>
        Only after a successful preflight does the browser send the actual request. This is why custom
        headers and JSON content types frequently trigger CORS errors that GET requests don't.
      </p>

      <H2>The error messages</H2>

      <H3>"No 'Access-Control-Allow-Origin' header is present"</H3>
      <p>
        Server didn't set the header at all. Either CORS isn't configured server-side, or your
        request didn't reach the part of the server that adds it (e.g., 500 error before middleware ran).
      </p>

      <H3>"The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'"</H3>
      <p>
        You're sending cookies or auth headers (<code>credentials: 'include'</code> in fetch),
        but the server returned <code>Allow-Origin: *</code>. Cookies require the server to specify an
        explicit origin, plus <code>Access-Control-Allow-Credentials: true</code>.
      </p>

      <H3>"Method PUT is not allowed by Access-Control-Allow-Methods"</H3>
      <p>
        Preflight succeeded but said only certain methods are allowed. Server needs to add PUT to the allow
        list.
      </p>

      <H3>"Request header field X-Custom-Header is not allowed"</H3>
      <p>
        Same idea for headers. Server needs to add the header name to <code>Access-Control-Allow-Headers</code>.
      </p>

      <H2>Common configurations and pitfalls</H2>

      <H3>1. Allow-Origin must match exactly</H3>
      <p>
        <code>https://example.com</code> and <code>https://example.com/</code> are different. <code>http</code>
        vs <code>https</code> are different. Match the <code>Origin</code> header exactly (or use a server-side
        whitelist that compares case-sensitively).
      </p>

      <H3>2. Wildcard doesn't work with credentials</H3>
      <p>
        If your API uses cookies for auth, you can't use <code>Access-Control-Allow-Origin: *</code>. You
        must echo back the specific origin from the request:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`# Server-side pseudocode
allowed = ['https://app.example.com', 'https://app2.example.com']
if request.headers['Origin'] in allowed:
    response.headers['Access-Control-Allow-Origin'] = request.headers['Origin']
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Vary'] = 'Origin'`}</code></pre>

      <p>
        The <code>Vary: Origin</code> header is critical — without it, intermediate caches will serve the
        wrong response to other origins.
      </p>

      <H3>3. Preflight responses must succeed (2xx)</H3>
      <p>
        If your server returns 401 or 403 for OPTIONS without the CORS headers, the browser blocks the actual
        request. Configure auth middleware to skip OPTIONS or handle preflight before auth checks.
      </p>

      <H3>4. Set Access-Control-Max-Age</H3>
      <p>
        Without a max-age, browsers preflight every request. Set <code>Access-Control-Max-Age: 86400</code>
        (24 hours) to cache the preflight result, dramatically reducing OPTIONS traffic.
      </p>

      <Callout title="Don't blanket-allow everything" accent="rose">
        <code>Access-Control-Allow-Origin: *</code> with <code>Allow-Headers: *</code> and
        <code>Allow-Methods: *</code> bypasses CORS but exposes your API to every site on the internet. If
        your API has any auth-protected endpoints, this is a serious security regression. Whitelist origins
        explicitly.
      </Callout>

      <H2>What CORS doesn't protect</H2>
      <p>
        Common misconceptions:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>It doesn't protect server-to-server requests.</strong> Curl, Python, Node.js, and other backend code ignore CORS entirely. CORS is a browser-only mechanism.</li>
        <li><strong>It doesn't prevent CSRF.</strong> CSRF involves forms and image tags, which aren't blocked by CORS. Use CSRF tokens or SameSite cookies.</li>
        <li><strong>It doesn't hide the response from the network.</strong> The data was sent. A network capture sees it. Browser quarantines only the JavaScript-readable response.</li>
        <li><strong>It doesn't protect <code>img</code>, <code>script</code>, or <code>video</code> elements.</strong> These can load cross-origin without CORS by default — though they have their own restrictions on script access.</li>
      </ul>

      <H2>The dev workarounds (and why most are bad)</H2>

      <H3>Browser extensions that disable CORS</H3>
      <p>
        Disable CORS in your browser to make local development work. Fine for testing — but mask real
        production issues. Don't ship code that worked "only with extension on."
      </p>

      <H3>Setting up a development proxy</H3>
      <p>
        Webpack, Vite, Next.js, etc. can proxy API requests through the dev server, bypassing CORS in
        development. Most realistic and recommended:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
};`}</code></pre>

      <H3>Disabling CORS server-side "temporarily"</H3>
      <p>
        You'll forget. It'll ship to prod. Don't do this — fix the actual configuration once
        and for all.
      </p>

      <H2>Production-ready CORS setup</H2>
      <p>
        For most applications:
      </p>
      <ol className="list-decimal pl-6 space-y-2 my-4">
        <li>Maintain a server-side allowlist of trusted origins.</li>
        <li>Echo back the <code>Origin</code> header value if it's on the allowlist; otherwise reject.</li>
        <li>Set <code>Access-Control-Allow-Credentials: true</code> if using cookies.</li>
        <li>Set <code>Vary: Origin</code> to prevent cache poisoning.</li>
        <li>List only the methods and headers your API actually uses.</li>
        <li>Set <code>Access-Control-Max-Age: 86400</code>.</li>
        <li>Make OPTIONS responses fast (no auth, no DB lookups).</li>
      </ol>

      <KeyTakeaways
        items={[
          'CORS is a browser security mechanism, not a server one. The request still reaches the server; CORS just prevents JavaScript from reading the response.',
          'Allow-Origin must exactly match the Origin header (or be wildcard *). Wildcards don\'t work with credentials.',
          'Custom headers and JSON POSTs trigger preflight (OPTIONS) requests. Preflight responses must include matching allow headers.',
          'Set Vary: Origin when echoing back specific origins, or caches will serve wrong responses.',
          'Production CORS = whitelist of origins, explicit method/header lists, Max-Age caching, OPTIONS fast path.',
        ]}
      />
    </div>
  ),
};
