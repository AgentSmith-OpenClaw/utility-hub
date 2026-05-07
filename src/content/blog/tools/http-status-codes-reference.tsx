import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const httpStatusCodesReference: BlogArticle = {
  slug: 'http-status-codes-reference',
  category: 'API',
  title: 'HTTP Status Codes: A Practical Reference for Each Class and the Ones You\'re Probably Misusing',
  description:
    'Five classes, dozens of codes, and a small set of frequent misuses (404 vs 410, 401 vs 403, 500 vs 503). Learn which code to actually return when, with an emphasis on real-world API design choices.',
  publishedDate: '2026-05-08',
  readTime: '12 min read',
  keywords:
    'http status codes, rest api, http response, 401 vs 403, 404 vs 410, http status reference, api design',
  relatedTools: [
    { name: 'JSON Viewer', href: '/tools/json-viewer' },
    { name: 'URL Encoder', href: '/tools/url-encoder' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        HTTP status codes are how servers tell clients what happened. Most developers know 200, 404, and 500
        well enough to fake it — but that's where the bugs live. Returning a 200 with <code>{'{ error: ...}'}</code>
        in the body is the classic anti-pattern; using 401 when you mean 403 confuses every monitoring tool;
        404 vs 410 has SEO implications that quietly cost real traffic.
      </Lead>

      <H2>The five classes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>1xx — Informational.</strong> Provisional response, request processing continues.</li>
        <li><strong>2xx — Success.</strong> Request was received, understood, and accepted.</li>
        <li><strong>3xx — Redirection.</strong> Further action needed to complete the request.</li>
        <li><strong>4xx — Client error.</strong> Request can't be fulfilled because of something the client did.</li>
        <li><strong>5xx — Server error.</strong> Server failed to fulfill an apparently valid request.</li>
      </ul>

      <H2>The 2xx codes you should know</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>200 OK.</strong> Generic success. Returns content. Default for GET.</li>
        <li><strong>201 Created.</strong> Successful POST that created a resource. Should include <code>Location</code> header pointing to the new resource.</li>
        <li><strong>202 Accepted.</strong> Request accepted but not yet processed. Used for async operations. Often paired with a polling URL.</li>
        <li><strong>204 No Content.</strong> Success, but no response body. Common for DELETE and idempotent updates with no returnable data.</li>
      </ul>

      <H2>The 3xx codes and SEO implications</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>301 Moved Permanently.</strong> Permanent redirect. Search engines transfer link equity. Use for restructured URLs.</li>
        <li><strong>302 Found.</strong> Temporary redirect. Original URL retains link equity. Use for short-term changes (login redirect, A/B tests).</li>
        <li><strong>303 See Other.</strong> Redirect after POST. The redirected GET fetches a confirmation page. Used to prevent "Are you sure you want to resubmit?" on browser refresh.</li>
        <li><strong>304 Not Modified.</strong> Cache validation success. Server tells client "your cached copy is still good." No body returned.</li>
        <li><strong>307 Temporary Redirect.</strong> Like 302, but enforces same HTTP method. POST stays POST.</li>
        <li><strong>308 Permanent Redirect.</strong> Like 301, but enforces same HTTP method.</li>
      </ul>

      <Callout title="The 301 vs 302 mistake" accent="amber">
        Use 302 when you want to test a new URL temporarily. Use 301 only when the change is permanent. Search
        engines treat them differently — 301 transfers SEO equity to the new URL, 302 keeps it on the original.
        Many sites have lost rankings by using 302 for permanent moves.
      </Callout>

      <H2>The 4xx codes you actually need</H2>

      <H3>400 Bad Request</H3>
      <p>
        Generic "your request has problems." Use for malformed JSON, missing required fields,
        invalid types. Always include a body explaining what specifically failed.
      </p>

      <H3>401 Unauthorized vs 403 Forbidden</H3>
      <p>
        These get confused constantly:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>401:</strong> "You're not authenticated. Provide credentials."</li>
        <li><strong>403:</strong> "You're authenticated but not authorized for this resource."</li>
      </ul>
      <p>
        Rule: 401 means the client should retry with credentials. 403 means "don't bother — even with
        credentials, you can't access this."
      </p>

      <H3>404 Not Found vs 410 Gone</H3>
      <p>
        Both indicate the resource doesn't exist. The difference matters for SEO:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>404:</strong> "Not found right now. Maybe later." Search engines will continue indexing attempts.</li>
        <li><strong>410:</strong> "Gone permanently. Stop trying." Search engines deindex faster.</li>
      </ul>
      <p>
        Use 410 when you've permanently retired a URL. Search engines clean it from their index 5–10x
        faster, freeing crawl budget for active pages.
      </p>

      <H3>422 Unprocessable Entity</H3>
      <p>
        The request was understood (good JSON, well-formed) but the data is semantically wrong (validation
        errors, business-rule violations). Increasingly preferred over 400 for validation errors because it
        signals the request <em>could have been valid</em>.
      </p>

      <H3>429 Too Many Requests</H3>
      <p>
        Rate limiting. Should include <code>Retry-After</code> header (in seconds or as a date). Better than
        silently dropping requests.
      </p>

      <H2>The 5xx codes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>500 Internal Server Error.</strong> The default catch-all when something went wrong on the server. Useful starting point but should be replaced with more specific codes when possible.</li>
        <li><strong>502 Bad Gateway.</strong> Server (acting as gateway/proxy) got an invalid response from an upstream server. Common with load balancers and reverse proxies.</li>
        <li><strong>503 Service Unavailable.</strong> Server is temporarily down (overload or maintenance). Should include <code>Retry-After</code> if known.</li>
        <li><strong>504 Gateway Timeout.</strong> Server (acting as gateway) didn't get a response in time from upstream. Different from 502 — upstream may still be processing.</li>
      </ul>

      <H2>The 200-with-error-body anti-pattern</H2>
      <p>
        Some APIs return:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`HTTP/1.1 200 OK
{ "error": "Item not found", "code": "NOT_FOUND" }`}</code></pre>

      <p>
        This is wrong. It breaks every monitoring tool, retry logic, and HTTP client default behavior. The
        correct response:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`HTTP/1.1 404 Not Found
{ "error": "Item not found", "code": "NOT_FOUND" }`}</code></pre>

      <p>
        The status code is for machines and infrastructure. The body is for developers. Keep them aligned.
      </p>

      <H2>Specific situations and the right code</H2>

      <H3>API key validation</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Missing API key → 401</li>
        <li>Invalid API key → 401</li>
        <li>Expired API key → 401</li>
        <li>Valid key, but no access to this resource → 403</li>
        <li>Valid key, but exceeded rate limit → 429</li>
      </ul>

      <H3>Resource lifecycle</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>POST creates a new resource → 201 with <code>Location</code> header</li>
        <li>GET succeeds → 200</li>
        <li>PUT/PATCH succeeds with response body → 200</li>
        <li>PUT/PATCH succeeds with no body → 204</li>
        <li>DELETE succeeds → 204 (no body) or 200 (if returning deleted resource)</li>
        <li>POST creates an async job → 202 with polling URL</li>
      </ul>

      <H3>Search and filtering</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>GET with filters returns empty list → 200 with empty array (not 404).</li>
        <li>Resource at /users/123 doesn't exist → 404.</li>
        <li>Filter syntax is invalid → 400.</li>
      </ul>

      <H2>Common mistakes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>200 with error body.</strong> Discussed above. The classic API anti-pattern.</li>
        <li><strong>404 for "no results" from search.</strong> Empty list at the resource level isn't "not found" — it's "found, and it's empty."</li>
        <li><strong>500 for everything.</strong> Generic 500s hide the actual issue. Use specific codes when known.</li>
        <li><strong>302 for permanent moves.</strong> Loses SEO equity. Use 301.</li>
        <li><strong>401 instead of 403 for permission issues.</strong> Causes infinite re-auth loops.</li>
        <li><strong>Returning 200 from a webhook handler when processing failed.</strong> The remote service won't retry.</li>
        <li><strong>Mixing 5xx for client errors.</strong> Bad request data isn't a server error.</li>
      </ul>

      <H2>The lesser-known but useful codes</H2>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>206 Partial Content.</strong> Response to a Range request. Streaming video and resumable downloads.</li>
        <li><strong>409 Conflict.</strong> Request conflicts with current state. Useful for optimistic locking (etag mismatch) and unique constraint violations.</li>
        <li><strong>412 Precondition Failed.</strong> When <code>If-Match</code> or <code>If-Unmodified-Since</code> conditions aren't met. Used for ETag-based concurrency control.</li>
        <li><strong>418 I'm a teapot.</strong> Yes, this is real. Defined by RFC 2324 as an April Fools joke. Some APIs use it for "automated traffic detected" without revealing the rule.</li>
        <li><strong>451 Unavailable For Legal Reasons.</strong> Geo-blocked content, court-ordered takedowns. Named after Fahrenheit 451.</li>
      </ul>

      <KeyTakeaways
        items={[
          'Status codes are for machines (monitoring, retry logic, caching). Body is for humans. Keep them aligned.',
          '200 with error body is the classic anti-pattern. Use the right 4xx/5xx code with the error details in the body.',
          '301 for permanent redirects, 302 for temporary. Misusing 302 can quietly destroy SEO rankings.',
          '404 vs 410: 410 deindexes faster. Use 410 for permanently retired URLs to free SEO crawl budget.',
          '401 = not authenticated; 403 = authenticated but not authorized. The retry logic is fundamentally different.',
        ]}
      />
    </div>
  ),
};
