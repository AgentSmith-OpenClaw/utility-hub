import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const JwtGenerator = dynamic(() => import('../../components/Tools/JwtGenerator'), { ssr: false });

const SLUG = '/tools/jwt-generator';

const FAQS = [
  { q: 'Is it safe to use a real secret here?', a: 'No — never paste a real production secret into any website, including this one. Use this tool with test secrets only. All signing happens locally in your browser via the WebCrypto API and nothing is transmitted, but it is good practice to keep production secrets out of browser tools entirely.' },
  { q: 'What algorithms are supported?', a: 'This tool supports HMAC-based algorithms: HS256, HS384, and HS512. These use a shared secret for signing. Asymmetric algorithms (RS256, ES256) require a key pair and are not yet supported.' },
  { q: 'What is the difference between iat, exp, and nbf?', a: 'iat (issued at) is a Unix timestamp for when the token was created. exp (expires at) is when the token should be rejected — the most critical claim for security. nbf (not before) is a timestamp before which the token should not be accepted.' },
  { q: 'How do I verify the signature?', a: 'Verification always happens server-side. Your backend receives the JWT, recomputes the HMAC with the known secret, and compares it to the signature in the token. If they match and the claims are valid (exp not past, aud correct, etc.), the token is accepted.' },
  { q: 'Can I decode the token I just generated?', a: 'Yes — there is a link to the JWT Decoder tool directly below the generated token. You can also paste it into the decoder at /tools/jwt-decoder to inspect the header, payload, and expiration status.' },
];

export default function JwtGeneratorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'JWT Generator',
    slug: SLUG,
    description: 'Generate signed JSON Web Tokens locally using HS256, HS384, or HS512 via the WebCrypto API. No server. No data uploaded.',
    featureList: 'HS256 HS384 HS512 signing, WebCrypto API, Payload editor, Time claim helpers, One-click decode link',
    category: 'SecurityApplication',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>JWT Generator — Sign Tokens Locally (HS256/384/512) | Toolisk</title>
        <meta name="description" content="Generate signed JWTs locally with HS256, HS384, or HS512. Edit payload, add standard claims, and copy the signed token — WebCrypto, no server." />
        <meta name="keywords" content="jwt generator, generate jwt, jwt creator, hs256 jwt, sign jwt online, json web token generator, jwt signing tool" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="JWT Generator | Toolisk" />
        <meta property="og:description" content="Sign JSON Web Tokens locally with HS256/384/512. No data leaves your browser." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🔑" title="JWT Generator" tagline="Sign JSON Web Tokens locally with HS256, HS384, or HS512 — WebCrypto API, no data leaves your browser.">
        <JwtGenerator />
      </ToolShell>

      <ToolSEOContent
        description="A browser-based JWT generator that signs tokens using HMAC algorithms (HS256, HS384, HS512) via the WebCrypto API. Edit the payload JSON, add standard time claims with one click, and copy the signed token to test your authentication flows without a backend."
        features={[
          '🔐 Signs with HS256, HS384, HS512 via WebCrypto',
          '🛡️ 100% local — no data sent to any server',
          '⏱️ One-click iat, exp, nbf claim insertion',
          '📋 Copy signed token to clipboard',
          '🔗 Deep-link to JWT Decoder for instant inspection',
          '⚠️ Clear security warning about test-only secrets',
        ]}
        steps={[
          { title: 'Choose an algorithm', desc: 'Select HS256 (most common), HS384, or HS512. All three use a shared secret and produce a compact token.' },
          { title: 'Enter a secret', desc: 'Type any string as your signing secret. Use a random test value — never a real production secret.' },
          { title: 'Edit the payload', desc: 'Modify the JSON payload. Use the quick-insert buttons to add iat (now), exp (+1 hour), or nbf claims.' },
          { title: 'Generate and copy', desc: 'Click "Generate JWT" to sign the token and copy it. Click the decoder link to inspect it immediately.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">How JWT signing works</h2>
            <p className="text-slate-600 leading-relaxed">
              A JWT is three Base64URL-encoded segments joined by dots: header, payload, and signature. The header declares
              the algorithm; the payload carries the claims. The signature is computed by running{' '}
              <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">HMAC-SHA256(base64url(header) + &quot;.&quot; + base64url(payload), secret)</code>
              {' '}and Base64URL-encoding the result. This makes it impossible to tamper with the header or payload without
              knowing the secret — the receiver recomputes the HMAC and rejects any mismatch.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">HS256 vs HS384 vs HS512</h3>
            <p className="text-slate-600 leading-relaxed">
              All three algorithms use HMAC with different SHA hash lengths. HS256 produces a 256-bit signature and is the
              most widely supported default. HS384 and HS512 produce longer signatures and are marginally harder to brute-force,
              but the practical security difference is negligible if you&apos;re using a sufficiently random secret (32+ bytes).
              The JWT spec recommends HS256 as the baseline — upgrade only if your security policy requires it.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">When to use asymmetric signing (RS256/ES256)</h3>
            <p className="text-slate-600 leading-relaxed">
              HMAC requires all parties to share the same secret — any service that verifies the token can also forge one.
              If you have multiple microservices or external verifiers, asymmetric signing (RS256, ES256) is safer: the issuer
              signs with a private key, verifiers use only the public key. This tool covers HMAC for simplicity; for
              asymmetric JWTs, use a server-side library like <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">jsonwebtoken</code> (Node) or{' '}
              <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">PyJWT</code> (Python).
            </p>
          </section>
        }
        relatedTools={[
          { name: 'JWT Decoder', href: '/tools/jwt-decoder', icon: '🔑' },
          { name: 'Hash Generator', href: '/tools/hash-generator', icon: '🔏' },
          { name: 'Base64 Encoder / Decoder', href: '/tools/base64', icon: '🔐' },
        ]}
      />
    </>
  );
}
