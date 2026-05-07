import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const cachingStrategiesAndHeaders: BlogArticle = {
  slug: 'caching-strategies-and-headers',
  category: 'Web',
  title: 'HTTP Caching: The Headers, the Strategies, and Why Your Site Is Slower Than It Needs to Be',
  description:
    'Caching is the single biggest performance lever most sites miss. Learn the layers (browser, CDN, reverse proxy), the headers that drive each, and the patterns that make your site feel instant.',
  publishedDate: '2026-05-08',
  readTime: '12 min read',
  keywords:
    'http caching, cache control, etag, cdn, reverse proxy, performance, stale while revalidate, immutable',
  relatedTools: [
    { name: 'JSON Viewer', href: '/tools/json-viewer' },
    { name: 'URL Encoder', href: '/tools/url-encoder' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Caching is the cheapest way to make a site faster. Done right, it can take your time-to-meaningful-paint
        from 1.5 seconds to 50 milliseconds for return visitors and reduce your origin server load by 90%+.
        Done wrong, it serves stale content for hours or fails to cache at all.
      </Lead>

      <H2>The cache layers</H2>
      <p>
        A request typically passes through several caches:
      </p>
      <ol className="list-decimal pl-6 space-y-2 my-4">
        <li><strong>Browser cache:</strong> the user's local cache. Fastest but private to the user.</li>
        <li><strong>Service Worker cache:</strong> programmable browser-side cache. Powers offline-first apps.</li>
        <li><strong>CDN edge cache:</strong> Cloudflare, Fastly, CloudFront. Shared across many users.</li>
        <li><strong>Reverse proxy cache:</strong> Varnish, nginx, Cloudflare workers. In front of your origin.</li>
        <li><strong>Application cache:</strong> Redis, Memcached. In front of your database.</li>
        <li><strong>Database cache:</strong> query plan cache, buffer pool.</li>
      </ol>
      <p>
        Most discussion of "HTTP caching" targets layers 1–4. Each has slightly different rules.
      </p>

      <H2>The Cache-Control header in detail</H2>
      <p>
        The single most important caching header. Common combinations:
      </p>

      <H3><code>Cache-Control: no-store</code></H3>
      <p>
        Don't cache anywhere. Ever. For sensitive responses (account pages, banking).
      </p>

      <H3><code>Cache-Control: no-cache</code></H3>
      <p>
        Cache, but always revalidate before using. The cache must contact origin (or another cache) to confirm
        the response is still valid. Despite the name, this <em>does</em> cache.
      </p>

      <H3><code>Cache-Control: public, max-age=31536000, immutable</code></H3>
      <p>
        The gold-standard for static assets. Cacheable by anyone, valid for a year, never check for updates.
        Use only with hashed filenames (<code>app.a1b2c3.js</code>) so changing the content changes the URL.
      </p>

      <H3><code>Cache-Control: private, max-age=600</code></H3>
      <p>
        Cacheable only by browsers (not CDNs/proxies). Useful for personalized but cacheable content like
        logged-in dashboards.
      </p>

      <H3><code>Cache-Control: stale-while-revalidate=86400</code></H3>
      <p>
        Serve stale content immediately while revalidating in the background. Gives instant response with
        eventual consistency. Powers content that's "fresh enough".
      </p>

      <H2>ETag vs Last-Modified</H2>
      <p>
        Both enable cache validation:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Last-Modified + If-Modified-Since:</strong> based on timestamps. Coarse (1-second resolution). Easy to compute from filesystem.</li>
        <li><strong>ETag + If-None-Match:</strong> opaque identifier (often a hash of content). More precise. Better for content that changes within the same second.</li>
      </ul>
      <p>
        Modern best practice: use ETag, generated from a content hash. <code>ETag: "a1b2c3"</code> tells
        the cache to send <code>If-None-Match: "a1b2c3"</code> on revalidation. Server returns 304 (no body)
        if unchanged or 200 (full body) if changed.
      </p>

      <H2>The classic three-tier asset strategy</H2>

      <H3>Tier 1: Hashed static assets — cache forever</H3>
      <p>
        JavaScript bundles, CSS files, images that have a content hash in the filename:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`# Response for /js/app.a1b2c3.js
Cache-Control: public, max-age=31536000, immutable
ETag: "a1b2c3d4"`}</code></pre>
      <p>
        Browsers and CDNs cache for a year. When you ship new JavaScript, the hash changes, the URL changes,
        the browser fetches fresh content.
      </p>

      <H3>Tier 2: Non-hashed but stable assets — cache with revalidation</H3>
      <p>
        Logo SVG, font files, well-known image paths:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>Cache-Control: public, max-age=86400, stale-while-revalidate=604800</code></pre>
      <p>
        Cache for a day, allow stale-revalidate for a week. Browser returns instantly from cache; updates
        happen in the background.
      </p>

      <H3>Tier 3: HTML pages — short cache or revalidate</H3>
      <p>
        HTML is your site's entry point and must be fresh:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>Cache-Control: public, max-age=0, must-revalidate
ETag: "page-version-hash"</code></pre>
      <p>
        Browser/CDN re-checks every navigation but most of the time gets a 304 (no body returned, ~50 byte
        response). Significant savings vs full HTML transfer.
      </p>

      <H2>CDN-specific patterns</H2>

      <H3>Two-tier caching: edge vs browser</H3>
      <p>
        CDNs let you cache aggressively at the edge (10 min) and lightly in browsers (1 min):
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`Cache-Control: public, max-age=60
CDN-Cache-Control: public, max-age=600
# Or Cloudflare:
Cache-Control: public, max-age=60, s-maxage=600`}</code></pre>
      <p>
        The browser refreshes its cache from CDN every minute (cheap); the CDN refreshes from origin every 10
        minutes (also cheap). Origin sees minimal load.
      </p>

      <H3>Purging and tags</H3>
      <p>
        Modern CDNs (Cloudflare, Fastly) support cache tags. Tag responses by article ID, then purge that tag
        when the article changes:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>Cache-Tag: article-123, articles, latest</code></pre>
      <p>
        Now editing article 123 purges its specific cache entries plus any pages tagged "latest."
      </p>

      <H2>API caching</H2>
      <p>
        APIs are often considered uncacheable, but most reads benefit from caching:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>GET requests:</strong> safe to cache by definition. Use <code>Cache-Control: private, max-age=60</code> for user-specific responses.</li>
        <li><strong>Conditional requests:</strong> use ETag and If-None-Match. Returns 304 (no body) when nothing's changed.</li>
        <li><strong>POST, PUT, DELETE:</strong> not cacheable. But caches must <em>invalidate</em> related GETs after mutations.</li>
      </ul>

      <Callout title="The cache-invalidation problem" accent="amber">
        "There are only two hard things in computer science: cache invalidation, naming things, and off-by-one
        errors." The hardest part of caching isn't setting it up — it's purging the right entries
        when content changes. Cache tags, surrogate keys, and content-addressed URLs are tools to make
        invalidation tractable.
      </Callout>

      <H2>Service Workers: the programmable cache</H2>
      <p>
        Service Workers run JavaScript that intercepts every network request:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`// Service Worker
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});`}</code></pre>
      <p>
        Patterns:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Cache-first:</strong> use cache; fall back to network. Best for assets.</li>
        <li><strong>Network-first:</strong> try network; fall back to cache if offline. Best for HTML.</li>
        <li><strong>Stale-while-revalidate:</strong> serve cache immediately, update cache in background.</li>
      </ul>
      <p>
        Workbox (Google's service-worker library) implements these patterns ergonomically.
      </p>

      <H2>Common caching mistakes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Caching HTML pages too long.</strong> Users see stale content for hours.</li>
        <li><strong>Not caching JavaScript bundles.</strong> Every page load re-downloads megabytes.</li>
        <li><strong>Forgetting Vary headers.</strong> Cache poisoning between user populations.</li>
        <li><strong>Cache-Control: no-cache as "don't cache."</strong> It does cache; you wanted no-store.</li>
        <li><strong>Setting only Expires, not Cache-Control.</strong> Expires is legacy; Cache-Control wins where both are present.</li>
        <li><strong>No cache for images.</strong> Large bandwidth hit. Always Cache-Control for images.</li>
        <li><strong>Caching authenticated responses publicly.</strong> Personalized content cached at CDN, served to wrong users.</li>
        <li><strong>Forgetting to invalidate after deploys.</strong> Old assets serve, app breaks.</li>
      </ul>

      <H2>Measuring cache effectiveness</H2>
      <p>
        Key metrics:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Cache hit rate:</strong> % of requests served from cache. Target 80%+ for static assets.</li>
        <li><strong>Origin offload:</strong> % of bandwidth or requests not reaching your origin. Target 90%+.</li>
        <li><strong>Time to first byte (TTFB):</strong> drops dramatically with proper caching.</li>
      </ul>
      <p>
        Browser DevTools "Network" tab shows cache status per resource. Cloudflare and Fastly dashboards
        show hit rates by status code and resource type.
      </p>

      <KeyTakeaways
        items={[
          'Three-tier asset strategy: hashed assets cache forever, stable assets cache with revalidation, HTML revalidates every navigation.',
          'Cache-Control: immutable is critical for hashed JS/CSS — browsers skip revalidation entirely.',
          'no-cache means "cache but revalidate." Use no-store when you want to prevent caching.',
          'ETags are more precise than Last-Modified. Generate ETags from content hashes for best results.',
          'Cache-tag-based purging makes invalidation tractable. Avoid time-based-only caching where possible.',
        ]}
      />
    </div>
  ),
};
