import Head from 'next/head';
import MorseCode from '../../components/Tools/MorseCode';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/morse-code';

const FAQS = [
  { q: 'What is Morse code?', a: 'Morse code is a method of encoding text as a sequence of dots (short signals) and dashes (long signals). Developed by Samuel Morse in the 1830s, it was the foundation of early telegraphy and is still used in aviation, amateur radio, and emergency signaling.' },
  { q: 'How are words separated in Morse code?', a: 'Letters within a word are separated by a single space. Words are separated by three spaces or a forward slash (/).' },
  { q: 'What is SOS in Morse code?', a: 'SOS is ... --- ... (three dots, three dashes, three dots). It was chosen as the international distress signal specifically because it\'s easy to transmit and recognize — not because it stands for a phrase.' },
  { q: 'Can I hear the Morse code?', a: 'Yes. Click the Play button to hear your text encoded as audio beeps using your browser\'s Web Audio API — dots are short beeps, dashes are longer ones, at 600 Hz.' },
  { q: 'What characters are supported?', a: 'All letters A–Z, digits 0–9, and common punctuation: period, comma, question mark, apostrophe, exclamation mark, slash, parentheses, ampersand, colon, semicolon, equals, plus, minus, underscore, quote, dollar sign, and at sign.' },
];

export default function MorseCodePage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Morse Code Converter',
    slug: SLUG,
    description: 'Convert text to Morse code and back. Includes audio playback, a reference chart, and support for all letters, digits, and punctuation.',
    featureList: 'Text to Morse, Morse to Text, Audio playback, Reference chart, All letters and digits',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Morse Code Converter — Text to Morse & Back with Audio | Toolisk</title>
        <meta name="description" content="Convert text to Morse code or decode Morse back to text. Includes audio playback at 600 Hz, a full reference chart, and support for all letters, digits, and punctuation." />
        <meta name="keywords" content="morse code converter, text to morse code, morse code translator, decode morse code, morse code audio, SOS morse code, morse code chart" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Morse Code Converter | Toolisk" />
        <meta property="og:description" content="Convert text to Morse code and back, with audio playback and a full reference chart." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="📡" title="Morse Code Converter" tagline="Translate text to Morse code or decode Morse back to text — with audio playback and a full reference chart.">
        <MorseCode />
      </ToolShell>

      <ToolSEOContent
        description="A bidirectional Morse code translator with audio playback. Encode any text into Morse dots and dashes, or paste Morse code to decode it back. Press Play to hear the encoded audio using Web Audio API. Includes a complete reference chart for all letters, digits, and punctuation."
        features={[
          '📡 Text → Morse and Morse → Text',
          '🔊 Audio playback using Web Audio API',
          '📖 Full reference chart A–Z and 0–9',
          '✏️ Punctuation support',
          '📋 Copy encoded or decoded output',
          '⚡ Instant conversion as you type',
        ]}
        steps={[
          { title: 'Choose a direction', desc: 'Text → Morse to encode, Morse → Text to decode.' },
          { title: 'Type or paste input', desc: 'Your text or Morse code — conversion happens instantly.' },
          { title: 'Play the audio', desc: 'Click Play to hear the Morse code as beeps in your browser.' },
          { title: 'Copy the result', desc: 'Use the copy button to grab the encoded or decoded output.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Morse code timing rules</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li>A dot (.) = 1 unit of time</li>
              <li>A dash (–) = 3 units</li>
              <li>Gap between dots/dashes in same letter = 1 unit</li>
              <li>Gap between letters = 3 units</li>
              <li>Gap between words = 7 units</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Caesar Cipher', href: '/tools/caesar-cipher', icon: '🔒' },
          { name: 'Text to Binary / Hex', href: '/tools/text-binary', icon: '01' },
          { name: 'Hash Generator', href: '/tools/hash-generator', icon: '🔏' },
        ]}
      />
    </>
  );
}
