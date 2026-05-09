import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, CodeSnippet, KeyTakeaways } from '../components';

export const jwtSecurityBestPractices: BlogArticle = {
  slug: 'jwt-security-best-practices',
  category: 'Security',
  title: 'JWT Security Best Practices: The Bugs That Keep Showing Up',
  description:
    "JWTs are fine until they aren't. Most JWT vulnerabilities come from the same five mistakes — algorithm confusion, missing verification, leaky storage, sloppy expiration, and silent revocation. Here's how to avoid them.",
  publishedDate: '2026-05-10',
  readTime: '12 min read',
  keywords:
    'jwt security, json web token security, jwt vulnerabilities, jwt best practices, alg none attack, jwt revocation, jwt storage',
  relatedTools: [
    { name: 'JWT Decoder', href: '/tools/jwt-decoder' },
    { name: 'Hash Generator', href: '/tools/hash-generator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        JWTs are deceptively easy to use and even easier to misuse. Most production JWT bugs aren&apos;t bleeding-edge
        cryptography failures — they&apos;re predictable mistakes any team can avoid by being deliberate about a handful
        of design choices.
      </Lead>

      <H2>1. Pin the algorithm, never trust the header</H2>
      <p>
        The classic <strong>"alg: none"</strong> attack: an attacker forges a token with the header <code>{'{ "alg": "none" }'}</code>
        and an empty signature. If your verification library trusts the header to decide which algorithm to use, it
        accepts the forgery.
      </p>
      <CodeSnippet>
{`// ❌ Wrong: lets the token decide its own verification
jwt.verify(token, secret); // depending on lib, may auto-detect alg

// ✅ Right: pin the algorithm explicitly
jwt.verify(token, secret, { algorithms: ['HS256'] });`}
      </CodeSnippet>
      <p>
        The related "algorithm confusion" attack: a server expects RS256 (asymmetric, verified with the public key) but
        the library accepts HS256 (symmetric, verified with whatever you pass as the secret). An attacker submits an
        HS256 token signed with the public key — the server uses the public key as if it were the HMAC secret, and
        verification "succeeds."
      </p>

      <H2>2. Verify <em>every</em> claim that matters</H2>
      <p>
        Decoding tells you what the token claims. Verification proves the issuer signed it. Most libraries verify the
        signature for you but stop there. You still need to actively check:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><code>iss</code> (issuer) — match against your expected list.</li>
        <li><code>aud</code> (audience) — token meant for your service, not someone else&apos;s.</li>
        <li><code>exp</code> (expiration) — in the future, with sane clock skew (60s typical).</li>
        <li><code>nbf</code> (not-before) — if present, currently after this time.</li>
        <li><code>iat</code> (issued-at) — sanity check; reject far-future tokens.</li>
      </ul>
      <p>
        Many libraries default to checking exp/nbf but not iss/aud — explicitly add them. The damage from skipping aud
        is real: a token issued by your auth server for service A can be replayed against service B if both share the
        same key and don&apos;t check audience.
      </p>

      <H2>3. Storage on the client side</H2>
      <p>
        The eternal debate: localStorage vs cookies. The actual security comparison:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li>
          <strong>localStorage:</strong> any XSS in your app reads it. No CSRF risk. Survives across tabs and reloads.
        </li>
        <li>
          <strong>HTTP-only cookie:</strong> JS cannot read it (XSS-resistant). Sent automatically with every request
          (CSRF risk unless mitigated). Requires <code>SameSite=Strict</code> or <code>Lax</code>, plus <code>Secure</code> in production.
        </li>
        <li>
          <strong>Memory only (variable in app state):</strong> safest from XSS exfiltration but lost on reload.
          Common pattern for short-lived access tokens.
        </li>
      </ul>
      <Callout title="The current best-practice combo" accent="indigo">
        Short-lived access token (5–15 min) in memory, long-lived refresh token in HTTP-only Secure SameSite=Strict
        cookie. The refresh endpoint exchanges a fresh access token. Compromised XSS can&apos;t exfiltrate the refresh
        token; lost access tokens self-expire fast.
      </Callout>

      <H2>4. Expiration discipline</H2>
      <p>
        Long-lived JWTs are a liability. Once issued, a JWT is valid until expiration regardless of what happens to the
        user, subscription, or session. If the token lives 24 hours, a stolen token is good for 24 hours of API access.
      </p>
      <p>
        Modern guidance:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Access tokens: 5–15 minutes. Short enough that theft is limited; long enough to avoid constant refresh.</li>
        <li>Refresh tokens: hours to days, depending on app risk. Rotated on each use (single-use refresh tokens).</li>
        <li>Re-auth required after some maximum (24 hours typical for banking, 30 days for low-risk consumer apps).</li>
      </ul>

      <H2>5. Revocation requires a list</H2>
      <p>
        JWTs are designed to be self-contained — the server doesn&apos;t need to look anything up to verify them. That&apos;s
        a feature for performance and a problem for revocation. If a user logs out or you compromise a token, you
        cannot un-issue what&apos;s already issued.
      </p>
      <p>
        Three approaches:
      </p>
      <ol className="list-decimal pl-6 space-y-3 my-4">
        <li>
          <strong>Short expiration + refresh rotation:</strong> the de facto standard. Compromise window is one access
          token lifetime.
        </li>
        <li>
          <strong>Token denylist:</strong> maintain a fast lookup (Redis) of revoked token IDs (jti claim). Check on
          every verification. Reasonable scale to a few million entries.
        </li>
        <li>
          <strong>Per-user version number:</strong> include a version in the JWT. Bump it on logout / password change
          to invalidate every existing token for that user. Requires looking up the version on each request — back to
          a session-style design.
        </li>
      </ol>

      <H2>6. Secrets management</H2>
      <p>
        For HMAC tokens (HS256/HS384/HS512), the secret must be:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>At least as long as the hash output (32+ bytes for HS256).</li>
        <li>Cryptographically random (no human-typed phrases).</li>
        <li>Stored in environment variables / secret manager, never committed.</li>
        <li>Rotated periodically with a key ID (kid) in the header for graceful transitions.</li>
      </ul>
      <p>
        For RS256/ES256, the private key signs and the public key verifies. Distribute the public key via a JWKS
        endpoint so verifiers can fetch it dynamically. Rotate by serving multiple keys during a transition window.
      </p>

      <H2>7. Don&apos;t put sensitive data in the payload</H2>
      <p>
        JWT payloads are Base64URL-encoded, not encrypted. Anyone with the token can read the contents. Never include:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Passwords or password hashes.</li>
        <li>Social security numbers, payment data, health records.</li>
        <li>Full user profile data — claims should be minimal IDs, not records.</li>
      </ul>
      <p>
        If you genuinely need to encrypt JWT contents, use JWE (JSON Web Encryption) instead of JWS. Complexity goes
        up significantly; usually better to design around the need.
      </p>

      <Callout title="When NOT to use JWTs" accent="amber">
        For first-party web apps with a single backend, traditional session cookies are simpler, more secure by default,
        and easier to revoke. JWTs shine for: stateless microservices, third-party API access, mobile + web sharing the
        same backend, or any scenario where the verifier and issuer are different services. Don&apos;t reach for JWT
        because it&apos;s trendy.
      </Callout>

      <KeyTakeaways
        items={[
          "Always pin the algorithm in verify() — don't let the token's header decide.",
          'Verify iss, aud, exp, nbf — not just the signature.',
          'Best storage: short-lived access token in memory, refresh token in HTTP-only Secure SameSite cookie.',
          'Short access token TTL (5–15 min) is the simplest revocation strategy.',
          'JWT payload is encoded, not encrypted — never put PII or secrets in the claims.',
        ]}
      />
    </div>
  ),
};
