import type { BlogArticle } from '../types';
import { Lead, H2, H3, Comparison, Callout, KeyTakeaways } from '../components';

export const restVsGraphqlVsGrpc: BlogArticle = {
  slug: 'rest-vs-graphql-vs-grpc',
  category: 'API',
  title: 'REST vs GraphQL vs gRPC: How to Pick the Right API Style',
  description:
    'Three popular API styles, each with strong opinions about how clients and servers communicate. Learn the architectural fit for each, the real performance numbers, and when hybrids beat purity.',
  publishedDate: '2026-05-08',
  readTime: '13 min read',
  keywords:
    'rest vs graphql, grpc, api design, http api, api architecture, graphql performance, protocol buffers',
  relatedTools: [
    { name: 'JSON Viewer', href: '/tools/json-viewer' },
    { name: 'URL Encoder', href: '/tools/url-encoder' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Three different philosophies. REST organizes around resources. GraphQL organizes around queries. gRPC
        organizes around procedures. Each makes different trade-offs for client simplicity, performance,
        evolution, and tooling. The right choice depends less on style preference than on who your clients
        are and what they need.
      </Lead>

      <H2>The three architectures</H2>

      <H3>REST (Representational State Transfer)</H3>
      <p>
        Resources at URLs, manipulated via HTTP verbs (GET, POST, PUT, DELETE). Stateless, cache-friendly,
        usually JSON over HTTP. The default for public APIs in 2026.
      </p>

      <H3>GraphQL</H3>
      <p>
        A single endpoint that accepts queries describing what data the client needs. The server returns
        exactly that data — no over- or under-fetching. Originally from Facebook, now widely adopted for
        client-driven applications.
      </p>

      <H3>gRPC</H3>
      <p>
        RPC-style API using HTTP/2 and Protocol Buffers (protobuf). Strongly typed, code-generated,
        binary-serialized. Optimized for low latency and high throughput, especially in microservice-to-microservice
        communication.
      </p>

      <H2>Side-by-side comparison</H2>

      <div className="my-6 overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b border-gray-200 px-4 py-2 text-left"></th>
              <th className="border-b border-gray-200 px-4 py-2 text-left">REST</th>
              <th className="border-b border-gray-200 px-4 py-2 text-left">GraphQL</th>
              <th className="border-b border-gray-200 px-4 py-2 text-left">gRPC</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border-b px-4 py-2 font-semibold">Format</td><td className="border-b px-4 py-2">JSON over HTTP</td><td className="border-b px-4 py-2">JSON over HTTP</td><td className="border-b px-4 py-2">Protobuf over HTTP/2</td></tr>
            <tr><td className="border-b px-4 py-2 font-semibold">Schema</td><td className="border-b px-4 py-2">OpenAPI (optional)</td><td className="border-b px-4 py-2">SDL (mandatory)</td><td className="border-b px-4 py-2">.proto (mandatory)</td></tr>
            <tr><td className="border-b px-4 py-2 font-semibold">Caching</td><td className="border-b px-4 py-2">HTTP-native, easy</td><td className="border-b px-4 py-2">Application-level only</td><td className="border-b px-4 py-2">Application-level only</td></tr>
            <tr><td className="border-b px-4 py-2 font-semibold">Browser support</td><td className="border-b px-4 py-2">Native</td><td className="border-b px-4 py-2">Native</td><td className="border-b px-4 py-2">Requires gRPC-Web proxy</td></tr>
            <tr><td className="border-b px-4 py-2 font-semibold">Streaming</td><td className="border-b px-4 py-2">SSE / WebSocket</td><td className="border-b px-4 py-2">Subscriptions (WebSocket)</td><td className="border-b px-4 py-2">Native bidirectional</td></tr>
            <tr><td className="border-b px-4 py-2 font-semibold">Performance</td><td className="border-b px-4 py-2">Good</td><td className="border-b px-4 py-2">Good (with caching)</td><td className="border-b px-4 py-2">Excellent</td></tr>
            <tr><td className="px-4 py-2 font-semibold">Best for</td><td className="px-4 py-2">Public APIs, CRUD</td><td className="px-4 py-2">Frontend apps with many resources</td><td className="px-4 py-2">Microservices, mobile</td></tr>
          </tbody>
        </table>
      </div>

      <H2>When REST wins</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Public APIs.</strong> Lowest tooling barrier. <code>curl</code> works without a client library. Documentation patterns are well-understood (OpenAPI/Swagger).</li>
        <li><strong>Simple CRUD applications.</strong> Resources at URLs map naturally to entities. Standard HTTP verbs handle most operations.</li>
        <li><strong>HTTP caching is critical.</strong> CDN-friendly, browser cache-friendly. <code>ETag</code>, <code>Cache-Control</code> work out of the box.</li>
        <li><strong>Polyglot client landscape.</strong> Every language has HTTP and JSON. No code generation required to consume.</li>
      </ul>

      <H3>REST's real weaknesses</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>N+1 query problem.</strong> Loading a list with details requires multiple round trips.</li>
        <li><strong>Over-fetching.</strong> Clients receive fields they didn't ask for, wasting bandwidth.</li>
        <li><strong>Versioning friction.</strong> URL versioning (<code>/v1/</code>, <code>/v2/</code>) creates parallel endpoints to maintain.</li>
      </ul>

      <H2>When GraphQL wins</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Frontends with diverse data needs.</strong> Mobile vs desktop vs partner apps — each can request exactly what it needs.</li>
        <li><strong>Aggregating multiple backend services.</strong> One GraphQL gateway in front of many microservices.</li>
        <li><strong>Rapid frontend iteration.</strong> Adding a new field doesn't require a new endpoint.</li>
        <li><strong>Strongly typed schema for full-stack TypeScript.</strong> Codegen produces type-safe clients.</li>
      </ul>

      <H3>GraphQL's real weaknesses</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Complex queries can DoS the server.</strong> A deeply nested query can fetch enormous amounts of data. Need query depth/complexity limits.</li>
        <li><strong>Caching is harder.</strong> No HTTP-level caching since everything is POST to one endpoint. Application-level caching needed (Apollo Client, urql).</li>
        <li><strong>N+1 inside the resolver.</strong> Naive implementations fetch related data per item. DataLoader pattern is mandatory.</li>
        <li><strong>Operational tooling immature compared to REST.</strong> Logging, monitoring, rate limiting all need GraphQL-aware tooling.</li>
      </ul>

      <Callout title="GraphQL isn't a free lunch" accent="amber">
        The promise of "client gets exactly what it asks for" sometimes hides massive backend complexity.
        Schema design, resolver performance, and authorization at the field level are non-trivial. Many
        organizations adopt GraphQL and discover the operational burden was higher than the REST it replaced.
      </Callout>

      <H2>When gRPC wins</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Internal microservice communication.</strong> Strongly typed, fast, code-generated — perfect for service-to-service.</li>
        <li><strong>Mobile apps with bandwidth constraints.</strong> Protobuf is ~3–10x smaller than equivalent JSON.</li>
        <li><strong>Real-time bidirectional streaming.</strong> HTTP/2 multiplexing and native streaming.</li>
        <li><strong>Polyglot stacks where types matter.</strong> Generate consistent client/server code for Go, Java, Python, JS, etc.</li>
      </ul>

      <H3>gRPC's real weaknesses</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Browser support is awkward.</strong> Direct gRPC doesn't work from browsers; need gRPC-Web proxy.</li>
        <li><strong>Tooling barrier.</strong> Requires installing protoc, configuring code generation. Higher entry cost than REST.</li>
        <li><strong>Debugging.</strong> Binary protocol — can't curl or eyeball requests.</li>
        <li><strong>Public API friction.</strong> Third-party developers prefer REST. gRPC for public APIs is rare.</li>
      </ul>

      <H2>The hybrid approach</H2>
      <p>
        Most large systems use multiple styles. A common pattern:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>REST or GraphQL at the edge</strong> (browser/mobile/public).</li>
        <li><strong>gRPC internally between services.</strong></li>
        <li><strong>Async messaging</strong> (Kafka, SNS, Pub/Sub) for events between services.</li>
      </ul>

      <p>
        This trades architectural purity for pragmatic fit-for-purpose. The boundary is the API gateway,
        which translates between styles.
      </p>

      <H2>Performance reality check</H2>
      <p>
        Benchmark numbers from various studies:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>REST/JSON:</strong> baseline.</li>
        <li><strong>GraphQL:</strong> roughly 1–3x slower than equivalent REST due to query parsing and resolver overhead. Caching can reverse this for cacheable queries.</li>
        <li><strong>gRPC:</strong> 5–10x faster than REST for high-throughput service-to-service. Less dramatic for low-volume calls.</li>
      </ul>
      <p>
        For most user-facing APIs (under 1,000 RPS per service), the performance difference is irrelevant
        compared to network latency and database queries. Choose based on developer experience and architectural
        fit, not raw performance — until you can prove otherwise with profiling.
      </p>

      <H2>The decision framework</H2>
      <ol className="list-decimal pl-6 space-y-3 my-4">
        <li><strong>Public API for third-party developers?</strong> REST. Universal tooling.</li>
        <li><strong>Internal microservice communication?</strong> gRPC if performance matters, REST if it doesn't.</li>
        <li><strong>Frontend with many entities and views?</strong> GraphQL.</li>
        <li><strong>Mobile app with bandwidth constraints?</strong> gRPC or GraphQL.</li>
        <li><strong>Real-time streaming?</strong> gRPC bidirectional streams or WebSockets.</li>
        <li><strong>Simple CRUD app, single team?</strong> REST. Don't over-engineer.</li>
      </ol>

      <H2>Common mistakes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>"GraphQL solves all our problems."</strong> Adopting GraphQL without addressing N+1, complexity limits, and authorization patterns leads to slower systems with worse caching.</li>
        <li><strong>"REST is old, we should use GraphQL/gRPC."</strong> Style choice should follow requirements, not novelty.</li>
        <li><strong>Mixing styles randomly.</strong> Within a single boundary, pick one. Hybrid systems work when boundaries are clear.</li>
        <li><strong>Ignoring code generation for protobuf/GraphQL.</strong> The type-safety win is the main reason to choose them. Skipping codegen reduces them to slower JSON.</li>
        <li><strong>Versioning REST badly.</strong> Either version everything (URL prefix, accept header) or commit to never breaking compatibility. Mid-states cause client confusion.</li>
      </ul>

      <KeyTakeaways
        items={[
          'REST: universal tooling, HTTP-native caching, best for public APIs and simple CRUD.',
          'GraphQL: client-driven queries, single endpoint aggregating multiple backends, best for frontends with diverse data needs.',
          'gRPC: binary protocol, strongly typed, fast, best for microservices and bandwidth-constrained mobile.',
          'Performance differences are real (gRPC 5–10x faster than REST for high-throughput) but often dominated by database and network latency.',
          'Most large systems use hybrids: REST/GraphQL at the edge, gRPC internally, async messaging for events.',
        ]}
      />
    </div>
  ),
};
