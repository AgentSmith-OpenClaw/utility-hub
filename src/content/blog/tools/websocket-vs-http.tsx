import type { BlogArticle } from '../types';
import { Lead, H2, H3, Comparison, Callout, KeyTakeaways } from '../components';

export const websocketVsHttp: BlogArticle = {
  slug: 'websocket-vs-http',
  category: 'Web',
  title: 'WebSocket vs HTTP: When You Actually Need a Persistent Connection',
  description:
    'WebSocket gets reached for whenever real-time appears in requirements. Often, Server-Sent Events or polling is the right choice. Learn the tradeoffs, the protocol details, and the operational gotchas.',
  publishedDate: '2026-05-08',
  readTime: '11 min read',
  keywords:
    'websocket, http, server sent events, real time, polling, websocket vs sse, full duplex',
  relatedTools: [
    { name: 'JSON Viewer', href: '/tools/json-viewer' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Real-time features get WebSocket for the same reason webhooks get cron — it's the obvious tool, but
        it's often the wrong tool. Server-Sent Events handle most "server pushes update"
        scenarios with less complexity. Long polling can beat both for low-frequency updates. Knowing when
        WebSocket is actually justified saves a lot of operational pain.
      </Lead>

      <H2>The four real-time patterns</H2>

      <H3>1. Polling</H3>
      <p>
        Client makes a regular HTTP request every N seconds asking "anything new?". Server responds with
        either new data or empty.
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Simple. Works with any HTTP infrastructure.</li>
        <li>Wasteful — most requests get no new data.</li>
        <li>Latency = polling interval / 2 on average.</li>
      </ul>

      <H3>2. Long polling</H3>
      <p>
        Client opens a request; server holds it open until new data is available, then responds. Client
        immediately reopens.
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Lower latency than polling.</li>
        <li>Works through proxies and firewalls.</li>
        <li>One TCP connection per client at any time.</li>
        <li>HTTP timeout interactions can be annoying.</li>
      </ul>

      <H3>3. Server-Sent Events (SSE)</H3>
      <p>
        Server-to-client streaming over a single HTTP connection. Server sends events; client receives them
        via the EventSource API.
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Simpler than WebSocket.</li>
        <li>One-way (server-to-client only).</li>
        <li>Works through HTTP infrastructure.</li>
        <li>Auto-reconnects on disconnect.</li>
        <li>Native browser support.</li>
      </ul>

      <H3>4. WebSocket</H3>
      <p>
        Full-duplex persistent connection over a single TCP connection. Either side can send messages anytime.
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>True bidirectional.</li>
        <li>Lowest latency.</li>
        <li>Operational complexity is highest.</li>
        <li>Doesn't reuse HTTP semantics (caching, status codes, etc.).</li>
      </ul>

      <H2>The decision matrix</H2>

      <Comparison
        leftTitle="Use Polling for"
        rightTitle="Use SSE for"
        left={
          <ul className="list-disc pl-5 space-y-2">
            <li>Updates needed every minute or less frequently</li>
            <li>Simplest possible architecture</li>
            <li>Mobile apps with battery concerns</li>
            <li>Updates that arrive bursty rather than steadily</li>
          </ul>
        }
        right={
          <ul className="list-disc pl-5 space-y-2">
            <li>Server-to-client streams (notifications, live feeds)</li>
            <li>Stock tickers, sports scores, log streams</li>
            <li>Real-time updates with no client → server traffic</li>
            <li>Existing HTTP-based infrastructure</li>
          </ul>
        }
      />

      <Comparison
        leftTitle="Use WebSocket for"
        rightTitle="Use Long Polling for"
        left={
          <ul className="list-disc pl-5 space-y-2">
            <li>Bidirectional real-time (chat, gaming, collaborative editing)</li>
            <li>Sub-second latency required both ways</li>
            <li>High-frequency client interactions</li>
            <li>Multiplayer interactions</li>
          </ul>
        }
        right={
          <ul className="list-disc pl-5 space-y-2">
            <li>Restrictive corporate proxies</li>
            <li>Legacy infrastructure that breaks SSE/WS</li>
            <li>Updates expected within 30+ seconds</li>
            <li>Quick to implement without specialized tooling</li>
          </ul>
        }
      />

      <H2>WebSocket protocol details</H2>
      <p>
        A WebSocket connection starts with an HTTP "upgrade" handshake:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`# Client request
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

# Server response
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=`}</code></pre>

      <p>
        After 101, the connection becomes a WebSocket. From then on, messages are framed as either text (JSON
        is common) or binary.
      </p>

      <H2>Operational complexity</H2>

      <H3>Load balancing</H3>
      <p>
        WebSockets are sticky to a single server. Round-robin load balancers don't work — once connected,
        you must stay on the same backend for the duration. Configure your LB for sticky sessions or use a
        layer 4 (TCP) load balancer.
      </p>

      <H3>Scaling out</H3>
      <p>
        Sending a message to all connected clients requires fan-out. With one server, easy. With many servers
        each holding subsets of connections, you need a pub/sub infrastructure (Redis, Kafka, NATS) to
        broadcast across the fleet.
      </p>

      <H3>Connection limits</H3>
      <p>
        Each WebSocket holds an open file descriptor and TCP connection. Default OS limits often cap at 1024
        per process. High-concurrency servers need tuned <code>ulimit</code>, kernel parameters, and careful
        memory management. Tools like Erlang/Elixir, Go, and Rust handle this gracefully; Node.js and Python
        struggle past ~10k connections per process.
      </p>

      <H3>Authentication</H3>
      <p>
        WebSocket doesn't have a standard auth mechanism. Common patterns:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Cookie auth (works because the upgrade is HTTP).</li>
        <li>Token in URL query parameter (visible in logs — not great).</li>
        <li>Token via first message after connect.</li>
        <li>Subprotocol header carrying token.</li>
      </ul>

      <Callout title="Idle timeouts" accent="amber">
        Many proxies, load balancers, and corporate firewalls close idle TCP connections after 60 seconds. Send
        heartbeat pings every 30 seconds to keep the connection alive. Without heartbeats, "working"
        WebSocket apps mysteriously disconnect every minute.
      </Callout>

      <H2>SSE: the underused alternative</H2>
      <p>
        For unidirectional server-to-client real-time, SSE is dramatically simpler:
      </p>

      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`# Client
const events = new EventSource('/stream');
events.onmessage = (e) => console.log(e.data);

# Server (Express)
app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  setInterval(() => {
    res.write(\`data: \${JSON.stringify(getUpdate())}\n\n\`);
  }, 1000);
});`}</code></pre>

      <p>
        SSE benefits:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Native browser auto-reconnect with last-event-id.</li>
        <li>Goes through HTTP infrastructure.</li>
        <li>HTTP/2 multiplexing means many SSE connections share one TCP connection — connection limits less of an issue.</li>
        <li>Same auth as regular HTTP.</li>
      </ul>
      <p>
        SSE limitations:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>One-way only. Client-to-server still needs separate HTTP requests.</li>
        <li>Browser limits ~6 concurrent connections per origin (HTTP/1.1) — HTTP/2 fixes this.</li>
        <li>Less polished tooling than WebSocket.</li>
      </ul>

      <H2>HTTP/2 and HTTP/3 considerations</H2>
      <p>
        HTTP/2 multiplexing makes long polling and SSE much more efficient than under HTTP/1.1. Many
        WebSocket use cases (one-way streams) are simpler over HTTP/2 SSE.
      </p>
      <p>
        HTTP/3 (QUIC) has built-in unreliable streams, making certain real-time patterns (live audio, game
        state) easier without WebSocket.
      </p>

      <H2>Common mistakes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>WebSocket for "real-time" that's actually periodic.</strong> Stock prices update every second? SSE handles it. Polling at 5-second intervals handles it.</li>
        <li><strong>Forgetting heartbeats.</strong> Connections die silently after idle timeouts.</li>
        <li><strong>No reconnection logic.</strong> Networks drop. Always plan for reconnect with backoff and resume.</li>
        <li><strong>Using WebSocket without sticky sessions behind a load balancer.</strong> Random disconnects.</li>
        <li><strong>Sending huge messages.</strong> WebSocket frames have no built-in compression. Use the permessage-deflate extension or compress payloads.</li>
        <li><strong>Auth tokens in URL parameters.</strong> Logged everywhere. Use auth via subprotocol or first message.</li>
      </ul>

      <KeyTakeaways
        items={[
          'WebSocket is bidirectional, low-latency, full-duplex — best for chat, gaming, collaborative editing.',
          'Server-Sent Events (SSE) covers most server-to-client real-time scenarios with HTTP simplicity.',
          'Long polling and regular polling are valid for low-frequency updates; don\'t reach for WebSocket reflexively.',
          'WebSocket operational complexity: sticky load balancing, fan-out, connection limits, idle timeouts. Plan for these.',
          'HTTP/2 and HTTP/3 narrow the gap — polling and SSE are increasingly viable replacements for WebSocket.',
        ]}
      />
    </div>
  ),
};
