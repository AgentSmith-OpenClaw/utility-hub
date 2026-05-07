import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const jwtTokensExplained: BlogArticle = {
  slug: 'jwt-tokens-explained',
  category: 'Security',
  title: 'JWT Tokens Explained: Structure, Security, and the Common Mistakes',
  description:
    'JWT is a clean, stateless way to transport claims — and a security minefield if you treat it like an opaque session token. Learn the format, the algorithms, and the patterns that prevent the most common JWT bugs.',
  publishedDate: '2026-05-08',
  readTime: '12 min read',
  keywords:
    'jwt, json web token, jwt security, jwt vs session, oauth, authentication, hs256 vs rs256',
  relatedTools: [
    { name: 'Base64 Encoder/Decoder', href: '/tools/base64' },
    { name: 'Hash Generator', href: '/tools/hash-generator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        JWT is everywhere in modern auth — OAuth, OpenID Connect, custom APIs, mobile apps. The format is
        simple. The security model is subtle. Most JWT bugs come from misunderstanding the same handful of
        concepts: signature vs encryption, algorithm confusion, and storage location.
      </Lead>

      <H2>The format</H2>
      <p>
        A JWT is three Base64url-encoded segments separated by dots:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIn0.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</code></pre>

      <p>
        The three parts:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Header:</strong> JSON declaring the algorithm and token type. Example: <code>{`{"alg":"HS256","typ":"JWT"}`}</code></li>
        <li><strong>Payload:</strong> JSON containing claims (user ID, expiration, custom data). Not encrypted — readable by anyone.</li>
        <li><strong>Signature:</strong> HMAC or RSA signature over the header and payload, using a secret or private key.</li>
      </ul>

      <Callout title="JWT is signed, not encrypted" accent="amber">
        The payload is Base64-encoded, not encrypted. Anyone who has the token can decode and read it. The
        signature only proves it hasn&apos;t been tampered with — it doesn&apos;t hide the contents. Never
        put secrets in a JWT payload.
      </Callout>

      <H2>Standard claims</H2>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><code>iss</code> — issuer (who created the token)</li>
        <li><code>sub</code> — subject (typically user ID)</li>
        <li><code>aud</code> — audience (intended recipient service)</li>
        <li><code>exp</code> — expiration time (Unix timestamp)</li>
        <li><code>nbf</code> — not before (token isn&apos;t valid until this time)</li>
        <li><code>iat</code> — issued at (when the token was created)</li>
        <li><code>jti</code> — JWT ID (unique identifier; used for revocation)</li>
      </ul>
      <p>
        Custom claims can be added freely. Convention is to namespace them
        (e.g., <code>https://your.app/role</code>) to avoid collisions with future standards.
      </p>

      <H2>Algorithms: HS256 vs RS256</H2>

      <H3>HS256 (HMAC-SHA-256)</H3>
      <p>
        Symmetric — same secret signs and verifies. Simple, fast. The verifier must know the same secret as the
        signer, so this works only when both are trusted (single service, internal microservices with shared
        config).
      </p>

      <H3>RS256 (RSA-SHA-256)</H3>
      <p>
        Asymmetric — private key signs, public key verifies. The signer can be a single auth service that
        publishes its public key; verifiers can validate without having any signing capability. Used by every
        major OAuth/OIDC provider.
      </p>
      <p>
        Other algorithms: ES256 (elliptic curve), PS256 (RSA-PSS). Performance and key sizes differ; security
        is comparable for properly chosen parameters.
      </p>

      <H2>The classic security pitfalls</H2>

      <H3>1. Algorithm confusion (alg=none)</H3>
      <p>
        The early JWT spec allowed <code>alg: none</code> — meaning the signature is empty and ignored. Some
        libraries would <em>accept</em> tokens with this header. An attacker could:
      </p>
      <ol className="list-decimal pl-6 space-y-1 my-3">
        <li>Take a valid token.</li>
        <li>Change the header to <code>{`{"alg":"none"}`}</code>.</li>
        <li>Modify the payload (e.g., change user ID to admin&apos;s).</li>
        <li>Send it. Library accepts. Game over.</li>
      </ol>
      <p>
        Modern libraries reject <code>alg: none</code> by default, but explicitly verify your library&apos;s
        config.
      </p>

      <H3>2. Algorithm switching attack</H3>
      <p>
        If your verifier loads a public key for RS256 verification, an attacker can:
      </p>
      <ol className="list-decimal pl-6 space-y-1 my-3">
        <li>Take a valid token signed with RS256.</li>
        <li>Change <code>alg</code> to <code>HS256</code> in the header.</li>
        <li>Sign the modified token using the public RSA key as if it were an HMAC secret.</li>
        <li>Library trusts the algorithm field, uses the public key as HMAC secret, validates → accepts.</li>
      </ol>
      <p>
        Mitigation: explicitly specify the expected algorithm at verification time. Don&apos;t trust the
        token&apos;s <code>alg</code> field alone.
      </p>

      <H3>3. Weak HS256 secrets</H3>
      <p>
        HS256 secrets must be at least 256 bits (32 bytes). Many implementations use short, guessable strings.
        Brute-forcing a 6-character secret takes seconds with modern GPUs. Generate cryptographically random
        secrets of sufficient length.
      </p>

      <H3>4. Long-lived tokens</H3>
      <p>
        JWTs are typically not revocable until they expire. A leaked token with a 30-day expiration is valid
        for 30 days regardless of what you do server-side. Best practice: short-lived access tokens (15
        minutes) plus a longer-lived, server-revocable refresh token.
      </p>

      <H3>5. Storing JWTs in localStorage</H3>
      <p>
        XSS-stolen tokens become full account compromises. <code>localStorage</code> is JavaScript-readable, so
        any XSS gets the token. Better:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>HttpOnly, Secure, SameSite=Lax cookies (best for browser apps).</li>
        <li>Memory-only with refresh-token rotation in cookies.</li>
        <li>Native secure storage for mobile apps (iOS Keychain, Android Keystore).</li>
      </ul>

      <H2>JWT vs session cookies</H2>
      <p>
        The longstanding architectural debate:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>JWT advantages:</strong> stateless, no server-side session store, easy to verify in distributed services, mobile-friendly.</li>
        <li><strong>JWT disadvantages:</strong> harder to revoke before expiration, larger size than session IDs, every JWT request must verify a signature.</li>
        <li><strong>Session cookie advantages:</strong> instantly revocable, smaller, easier to implement correctly.</li>
        <li><strong>Session cookie disadvantages:</strong> requires server-side storage, harder for cross-domain APIs.</li>
      </ul>
      <p>
        Rule of thumb: for browser apps to your own backend, session cookies are simpler. For mobile, OAuth,
        federated identity, or stateless microservices, JWT is the natural choice.
      </p>

      <H2>The refresh token pattern</H2>
      <p>
        The standard secure pattern:
      </p>
      <ol className="list-decimal pl-6 space-y-2 my-4">
        <li>User logs in, gets a short-lived access token (15 min) + long-lived refresh token (30 days).</li>
        <li>Access token used for API calls; expires quickly.</li>
        <li>When access token expires, client uses refresh token to get a new access token.</li>
        <li>Refresh token stored securely (HttpOnly cookie or native secure storage).</li>
        <li>Refresh tokens are server-tracked, allowing revocation.</li>
        <li>Optional: rotate refresh tokens on each use to detect theft (if the old refresh token is used after a new one was issued, signal compromise).</li>
      </ol>

      <H2>Common mistakes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Putting sensitive data in the payload.</strong> Anyone can decode it. Treat payload as public.</li>
        <li><strong>Trusting the alg header.</strong> Explicitly specify expected algorithms in the verifier.</li>
        <li><strong>Long expiration times.</strong> 24 hours+ is too long for an access token. Use short-lived access + refresh pattern.</li>
        <li><strong>Storing in localStorage.</strong> Vulnerable to XSS. Use HttpOnly cookies or memory.</li>
        <li><strong>Skipping the audience check.</strong> A token issued for service A should not be accepted by service B. Always verify <code>aud</code>.</li>
        <li><strong>Ignoring exp during verification.</strong> Using a JWT library that doesn&apos;t check expiration by default.</li>
        <li><strong>No JWT ID for revocation.</strong> Long-lived tokens that can&apos;t be invalidated server-side.</li>
      </ul>

      <H2>Production checklist</H2>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>✓ Specify expected algorithm explicitly during verification</li>
        <li>✓ Verify <code>iss</code>, <code>aud</code>, <code>exp</code></li>
        <li>✓ Use 256+ bit secrets for HS256, 2048+ bit RSA for RS256</li>
        <li>✓ Short-lived access tokens (15 min) with refresh tokens</li>
        <li>✓ HttpOnly, Secure, SameSite cookies for browser storage</li>
        <li>✓ Refresh token rotation with theft detection</li>
        <li>✓ Server-side blocklist or short TTL for revocation</li>
        <li>✓ Don&apos;t put PII or secrets in payload</li>
      </ul>

      <KeyTakeaways
        items={[
          'JWT payload is encoded, not encrypted. Anyone with the token can read it. Never put secrets there.',
          'Always specify expected algorithm at verification. Algorithm confusion attacks are real.',
          'HS256 (symmetric) for trusted same-service auth; RS256 (asymmetric) for distributed and federated systems.',
          'Use short-lived access tokens (15 min) with refresh token rotation, not long-lived JWTs.',
          'Store JWTs in HttpOnly cookies or native secure storage. localStorage is XSS-vulnerable.',
        ]}
      />
    </div>
  ),
};
