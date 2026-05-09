import Head from 'next/head';
import JwtDecoder from '../../components/Tools/JwtDecoder';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/jwt-decoder';

export default function JwtDecoderPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'JWT Decoder',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Decode JSON Web Tokens (JWTs) instantly in your browser. View header, payload, signature, and check expiration.',
    url: `${SITE_URL}${SLUG}`,
    featureList: 'Header decoding, Payload decoding, Expiration check, Time claim formatting, Base64URL parsing',
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Is it safe to paste a JWT here?', acceptedAnswer: { '@type': 'Answer', text: 'The decoder runs entirely in your browser — your token is never sent to any server. That said, never share a valid production token with anyone, and treat the JWT as a credential.' } },
      { '@type': 'Question', name: 'Why can\'t this verify the signature?', acceptedAnswer: { '@type': 'Answer', text: 'Verification requires the issuer\'s secret (HMAC) or public key (RSA/EC) — that data is not in the token itself. Verification is always a server-side step using the JWKS endpoint or shared secret.' } },
      { '@type': 'Question', name: 'What\'s in the header vs the payload?', acceptedAnswer: { '@type': 'Answer', text: 'The header declares the algorithm (alg) and token type (typ). The payload contains claims — standard ones like iss, sub, exp, iat plus any custom data the issuer added.' } },
      { '@type': 'Question', name: 'My JWT shows as expired but the app still accepts it. Why?', acceptedAnswer: { '@type': 'Answer', text: 'Apps often allow a small clock-skew window (typically 30s to 5min). Confirmed expiry happens when both client and server agree the exp time has passed beyond that tolerance.' } },
    ],
  };

  return (
    <>
      <Head>
        <title>JWT Decoder — Free Online JSON Web Token Parser | Toolisk</title>
        <meta name="description" content="Free JWT decoder. Paste a JSON Web Token and instantly view its header, payload, claims, and expiration status. 100% client-side — no data sent to a server." />
        <meta name="keywords" content="jwt decoder, jwt parser, json web token decoder, jwt debugger, decode jwt online, jwt expiration check" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="JWT Decoder | Toolisk" />
        <meta property="og:description" content="Decode JSON Web Tokens locally in your browser." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🔑" title="JWT Decoder" tagline="Paste a JSON Web Token to inspect its header, payload, and expiration — 100% client-side, no data leaves your browser.">
        <JwtDecoder />
      </ToolShell>

      <ToolSEOContent
        description="A free, browser-based JWT decoder for developers. Paste any JSON Web Token (JWT) and see the decoded header, payload claims, and signature segment. Detects expired tokens and formats time-based claims (iat, exp, nbf) as readable dates."
        features={[
          '🔍 Decode header & payload instantly',
          '⏱️ Auto-format iat / exp / nbf claims',
          '⚠️ Visible expiration warning',
          '🔒 Runs entirely in your browser',
          '📋 One-click copy for each segment',
          '📝 Sample token included for quick demo',
        ]}
        steps={[
          { title: 'Paste your JWT', desc: 'Drop the token into the input — it should be three Base64URL segments joined by dots.' },
          { title: 'Inspect the header', desc: 'Confirms the signing algorithm (alg) and token type (typ). HS256, RS256, ES256 are typical.' },
          { title: 'Read the payload', desc: 'Standard claims (iss, sub, aud, exp, iat) plus any custom data the issuer added.' },
          { title: 'Check expiration', desc: 'A green/red badge tells you if exp is in the future or past, with a relative time hint.' },
          { title: 'Verify on the server', desc: 'Signature verification needs the issuer\'s key — copy the segments and validate in your backend.' },
        ]}
        faqs={faqSchema.mainEntity.map((f) => ({ q: f.name, a: f.acceptedAnswer.text }))}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">When to use a JWT decoder</h2>
            <p className="text-slate-600 leading-relaxed">
              Decoding is the fastest way to debug authentication issues. If a request is being rejected as unauthorized,
              decoding the token tells you whether the user ID, scopes, audience, or expiration are what you expect — without
              waiting for backend logs.
            </p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">Decoded ≠ verified</h3>
            <p className="text-slate-600 leading-relaxed">
              Anyone can decode a JWT — that&apos;s by design. Decoding only confirms what the token <em>claims</em>; it doesn&apos;t prove
              the issuer actually signed it. Always verify the signature server-side before trusting any claim.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Base64 Encoder / Decoder', href: '/tools/base64', icon: '🔐' },
          { name: 'Hash Generator', href: '/tools/hash-generator', icon: '🔏' },
          { name: 'Timestamp Converter', href: '/tools/timestamp-converter', icon: '⏱️' },
        ]}
        relatedArticles={[{ title: 'JWT Tokens Explained — How They Work', href: '/tools/learn/jwt-tokens-explained' }]}
      />
    </>
  );
}
