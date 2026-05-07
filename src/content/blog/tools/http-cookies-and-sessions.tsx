import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const httpCookiesAndSessions: BlogArticle = {
  slug: 'http-cookies-and-sessions',
  category: 'Web',
  title: 'HTTP Cookies and Sessions: The Attributes That Decide Security',
  description:
    'A cookie is a tiny key-value pair with five security attributes that decide whether your auth is hardened or hilariously broken. Learn each attribute, the SameSite changes, and the modern session-cookie patterns.',
  publishedDate: '2026-05-08',
  readTime: '11 min read',
  keywords:
    'http cookies, session cookies, samesite, httponly, secure cookie, cookie security, csrf protection',
  relatedTools: [
    { name: 'JSON Viewer', href: '/tools/json-viewer' },
    { name: 'URL Encoder', href: '/tools/url-encoder' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Cookies have been around since 1994, and most web developers still get them wrong. The five security
        attributes (HttpOnly, Secure, SameSite, Domain, Path) determine whether your auth is rock-solid or
        comically vulnerable. Browser changes around SameSite shifted the defaults — what worked five years
        ago is broken now.
      </Lead>

      <H2>The cookie format</H2>
      <p>
        Server sets a cookie via <code>Set-Cookie</code> header:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`Set-Cookie: session_id=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600`}</code></pre>

      <p>
        Browser sends matching cookies on subsequent requests via <code>Cookie</code> header:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`Cookie: session_id=abc123; theme=dark`}</code></pre>

      <H2>The five attributes that matter for security</H2>

      <H3>1. HttpOnly</H3>
      <p>
        Prevents JavaScript from accessing the cookie via <code>document.cookie</code>. Critical for session
        cookies — XSS attacks can't steal HttpOnly cookies.
      </p>
      <p>
        Use HttpOnly for: session IDs, JWT tokens, anything authentication-related.
      </p>
      <p>
        Don't use HttpOnly for: cookies your JavaScript actually needs (theme preferences, UI state).
      </p>

      <H3>2. Secure</H3>
      <p>
        Cookie is only sent over HTTPS. Without this, a man-in-the-middle on an HTTP page could read the
        cookie.
      </p>
      <p>
        Modern best practice: <strong>always set Secure</strong>. Even cookies that don't seem sensitive
        can leak fingerprinting data if intercepted.
      </p>

      <H3>3. SameSite</H3>
      <p>
        Controls whether the cookie is sent on cross-site requests:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Strict:</strong> never sent on cross-site requests. Most secure but breaks login flows that involve external redirects (OAuth, magic links).</li>
        <li><strong>Lax (default in modern browsers):</strong> sent on top-level navigations (clicking a link to your site) but not on cross-origin sub-requests (image, iframe, fetch from another site).</li>
        <li><strong>None:</strong> sent on all requests. Required for cross-site cookies but must be paired with Secure.</li>
      </ul>

      <Callout title="The SameSite default change" accent="amber">
        Chrome 80+ (early 2020) and most browsers now default to <strong>SameSite=Lax</strong> if not
        specified. Apps that previously worked "by accident" relying on the old default (None) broke
        when the change rolled out. If you're embedding your auth flow in an iframe or making cross-site
        XHR with credentials, you must explicitly set SameSite=None; Secure.
      </Callout>

      <H3>4. Domain</H3>
      <p>
        Specifies which hosts can receive the cookie:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Not set:</strong> cookie sent only to the exact host that set it.</li>
        <li><strong><code>Domain=example.com</code>:</strong> cookie sent to example.com and all subdomains (api.example.com, www.example.com).</li>
        <li><strong>Cannot set <code>Domain=.com</code> or other public suffixes:</strong> browser rejects.</li>
      </ul>
      <p>
        For session cookies, prefer host-only (don't set Domain) unless you specifically need
        cross-subdomain auth.
      </p>

      <H3>5. Path</H3>
      <p>
        Limits the cookie to a path prefix. <code>Path=/admin</code> means cookie only sent for URLs starting
        with <code>/admin</code>. Useful for namespacing but not a security primitive — JavaScript on
        <code>/admin</code> can read cookies set for <code>/</code> regardless.
      </p>

      <H2>Lifetime attributes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Max-Age:</strong> seconds until the cookie expires. <code>Max-Age=3600</code> = 1 hour.</li>
        <li><strong>Expires:</strong> absolute timestamp. <code>Expires=Wed, 21 Oct 2026 07:28:00 GMT</code></li>
        <li><strong>Neither:</strong> session cookie. Deleted when browser closes.</li>
      </ul>
      <p>
        If both are set, Max-Age wins. Prefer Max-Age — Expires has been the source of many bugs around server
        clock skew.
      </p>

      <H2>The CSRF attack and how cookies enable it</H2>
      <p>
        Cookie-based auth has a weakness: cookies are sent automatically by the browser. An attacker can
        trick a user into making a state-changing request to your site:
      </p>

      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`<!-- on attacker.com -->
<form action="https://bank.com/transfer" method="POST">
  <input name="to" value="attacker_account">
  <input name="amount" value="10000">
</form>
<script>document.forms[0].submit();</script>`}</code></pre>

      <p>
        If the user is logged into bank.com, the browser sends their session cookie, and the request
        succeeds. This is CSRF (Cross-Site Request Forgery).
      </p>

      <H3>Modern CSRF defenses</H3>
      <ol className="list-decimal pl-6 space-y-3 my-4">
        <li><strong>SameSite=Lax (or Strict).</strong> Browser doesn't send the cookie on cross-site POSTs. Default in most modern browsers — but verify your auth cookie has it explicitly set.</li>
        <li><strong>CSRF tokens.</strong> Server includes a unique token in every form/page; submissions must include it. Token isn't in cookies, so attacker's site can't read it (Same-Origin Policy).</li>
        <li><strong>Custom headers.</strong> Require a custom header (e.g., <code>X-Requested-With</code>) for state-changing requests. Cross-site requests can't set arbitrary headers without preflight, which fails for forms.</li>
        <li><strong>Re-authentication for sensitive actions.</strong> Password change, payment, etc., require recent re-auth.</li>
      </ol>

      <H2>Cookies vs Authorization header</H2>
      <p>
        For browser apps, cookies are usually better than Authorization headers because:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>HttpOnly prevents XSS theft.</li>
        <li>Browser handles them automatically.</li>
        <li>Cleared when browser closes (session cookies).</li>
      </ul>
      <p>
        For mobile apps and APIs, Authorization headers (with bearer tokens) are usually better:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>No CSRF risk (only sent when explicitly added by client code).</li>
        <li>More portable across origins.</li>
        <li>Doesn't require cookie-handling code on the client.</li>
      </ul>

      <H2>The session cookie pattern</H2>
      <p>
        Most secure pattern for browser auth:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`Set-Cookie: session_id=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`}</code></pre>
      <p>
        Server stores the session ID in a database (Redis, PostgreSQL) mapping to user data. To revoke a
        session, delete the server-side record — instant invalidation without waiting for cookie expiration.
      </p>
      <p>
        For OAuth/SSO scenarios crossing domains, you may need:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`Set-Cookie: session_id=abc123; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=86400`}</code></pre>
      <p>
        But understand that SameSite=None opens you to CSRF unless you have additional protection (CSRF
        tokens, custom headers).
      </p>

      <H2>Cookie size limits</H2>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Each cookie: max 4KB (name + value + attributes).</li>
        <li>Per origin: typically 50 cookies max.</li>
        <li>Total per browser: limits vary, ~3000.</li>
      </ul>
      <p>
        Don't store user data in cookies. Use a session ID and store data server-side. The 4KB limit
        sneaks up on apps with multiple frameworks each setting their own cookies.
      </p>

      <H2>Common cookie mistakes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Session cookie without HttpOnly.</strong> XSS gets your auth.</li>
        <li><strong>No Secure flag in production.</strong> Cookie leaks on HTTP.</li>
        <li><strong>SameSite=None without Secure.</strong> Browser rejects the cookie entirely.</li>
        <li><strong>Storing sensitive data in client-readable cookies.</strong> Tokens, PII, secrets — never client-readable.</li>
        <li><strong>Forgetting to set Domain consistently across subdomains.</strong> Causes inconsistent auth on www vs non-www.</li>
        <li><strong>Setting both Max-Age and Expires.</strong> Max-Age wins; Expires is ignored. Just use one.</li>
        <li><strong>Cookie name collisions.</strong> Multiple frameworks setting <code>session</code> or <code>auth</code>. Namespace with prefixes.</li>
      </ul>

      <KeyTakeaways
        items={[
          'Five security attributes: HttpOnly, Secure, SameSite, Domain, Path. Always set all five for session cookies.',
          'SameSite=Lax is the modern default. Apps relying on old None-by-default behavior broke in 2020 when browsers tightened.',
          'CSRF defense modernizes: SameSite cookies + CSRF tokens + custom headers for any state-changing action.',
          'Cookies for browser apps; Authorization headers for mobile and APIs. Each fits different threat models.',
          '4KB cookie limit is real. Store session IDs in cookies; store data server-side. Don\'t pile state into cookies.',
        ]}
      />
    </div>
  ),
};
