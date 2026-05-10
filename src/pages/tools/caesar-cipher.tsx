import Head from 'next/head';
import CaesarCipher from '../../components/Tools/CaesarCipher';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/caesar-cipher';

const FAQS = [
  { q: 'What is a Caesar cipher?', a: 'A Caesar cipher is a substitution cipher where each letter in the plaintext is shifted a fixed number of positions down the alphabet. Named after Julius Caesar, who reportedly used a shift of 3. It is one of the simplest encryption techniques.' },
  { q: 'What is ROT13?', a: 'ROT13 is a Caesar cipher with a shift of 13. Because the alphabet has 26 letters, applying ROT13 twice returns the original text — making encoding and decoding the same operation. It is used to hide spoilers and puzzle answers online.' },
  { q: 'How secure is the Caesar cipher?', a: 'Not secure at all for real use. With only 25 possible shifts, a brute-force attack can try all possibilities in seconds. For real encryption, use AES or another modern cipher. The Caesar cipher is used for education and fun only.' },
  { q: 'What is frequency analysis?', a: 'Frequency analysis exploits the fact that letters appear at predictable rates in natural language (E is most common in English). By comparing the frequency of letters in ciphertext to known language frequencies, you can often determine the shift without knowing it.' },
  { q: 'Does the cipher affect numbers and symbols?', a: 'No. The Caesar cipher only shifts letters (A–Z, a–z). Numbers, spaces, and punctuation are passed through unchanged.' },
];

export default function CaesarCipherPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Caesar Cipher & ROT13',
    slug: SLUG,
    description: 'Encrypt and decrypt text with Caesar cipher and ROT13. Adjustable shift 0–25, brute-force all shifts, and letter frequency analysis.',
    featureList: 'Caesar cipher, ROT13, Adjustable shift, Brute force all shifts, Letter frequency analysis',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Caesar Cipher & ROT13 — Online Encoder / Decoder | Toolisk</title>
        <meta name="description" content="Encrypt and decrypt text with Caesar cipher or ROT13. Adjust the shift from 0 to 25, brute-force all 26 shifts at once, and analyze letter frequency. Free browser tool." />
        <meta name="keywords" content="caesar cipher, rot13, caesar cipher encoder, rot13 decoder, caesar cipher decoder, shift cipher, substitution cipher, letter frequency analysis" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Caesar Cipher & ROT13 | Toolisk" />
        <meta property="og:description" content="Encode and decode text with Caesar cipher. Brute-force all 26 shifts at once." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🔒" title="Caesar Cipher & ROT13" tagline="Shift letters to encode or decode text — adjustable shift 0–25, ROT13 shortcut, and brute-force all 26 shifts.">
        <CaesarCipher />
      </ToolShell>

      <ToolSEOContent
        description="A Caesar cipher tool with ROT13 support. Encrypt or decrypt any text by shifting letters a chosen number of positions (0–25). Use the brute-force panel to view all 26 decryptions at once for cracking unknown shifts. Includes letter frequency analysis to aid cryptanalysis."
        features={[
          '🔢 Adjustable shift slider (0–25)',
          '🔄 ROT13 one-click shortcut',
          '🧩 Brute-force: view all 26 shifts at once',
          '📊 Letter frequency analysis',
          '⇄ Swap input and output',
          '📋 Copy any output with one click',
        ]}
        steps={[
          { title: 'Type or paste your text', desc: 'Enter the plaintext to encrypt or the ciphertext to decrypt.' },
          { title: 'Set the shift', desc: 'Drag the slider or type a number 0–25. Click ROT13 for shift 13.' },
          { title: 'Choose encrypt or decrypt', desc: 'Decrypting reverses the shift direction automatically.' },
          { title: 'Brute-force unknown ciphers', desc: 'Click Show under Brute Force to see all 26 possible decryptions and spot the readable one.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Caesar cipher history and uses today</h2>
            <p className="text-slate-600 leading-relaxed">
              Julius Caesar used a shift-of-3 cipher for military communications around 58 BC. While trivially broken by modern standards, the Caesar cipher is the foundation for understanding substitution ciphers, frequency analysis, and the basics of cryptography.
            </p>
            <p className="text-slate-600 leading-relaxed">
              ROT13 (shift 13) lives on in internet culture: Reddit and forums use it to hide spoilers, puzzle answers, and punchlines. Its self-inverse property — applying it twice gives back the original — makes it convenient for toggling visibility without needing a separate decode step.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Hash Generator', href: '/tools/hash-generator', icon: '🔏' },
          { name: 'Morse Code Converter', href: '/tools/morse-code', icon: '📡' },
          { name: 'Text to Binary / Hex', href: '/tools/text-binary', icon: '01' },
        ]}
      />
    </>
  );
}
