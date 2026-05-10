import Head from 'next/head';
import TextBinary from '../../components/Tools/TextBinary';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/text-binary';

const FAQS = [
  { q: 'How does text-to-binary conversion work?', a: 'Each character in the text is first converted to its UTF-8 byte value (one or more bytes), then each byte is written as an 8-bit binary number. For example, the letter "A" is byte 65, which is 01000001 in binary.' },
  { q: 'What is the difference between binary and hexadecimal output?', a: 'Both represent the same underlying bytes. Binary uses 0s and 1s (8 characters per byte), while hexadecimal uses digits 0–9 and A–F (2 characters per byte). Hex is more compact and commonly used in programming, debugging, and cryptography.' },
  { q: 'Does this support Unicode / emoji?', a: 'Yes. The tool uses the browser\'s TextEncoder (UTF-8) and TextDecoder APIs, which correctly handle multi-byte characters including accented letters, CJK characters, and emoji. Multi-byte characters produce multiple byte values.' },
  { q: 'What is the decimal (ASCII) format?', a: 'Each byte is shown as its decimal (base 10) value — the raw number between 0 and 255. This matches the ASCII table for standard characters and UTF-8 byte values for multi-byte characters.' },
  { q: 'What is octal encoding used for?', a: 'Octal encoding represents each byte as a base-8 number (0–377). It is used in some Unix escape sequences (\\101 for \'A\') and older file formats, but is less common today than hex.' },
];

export default function TextBinaryPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Text to Binary / Hex Converter',
    slug: SLUG,
    description: 'Convert text to binary, hexadecimal, decimal, or octal byte representation — and back. UTF-8 aware with per-character breakdown.',
    featureList: 'Binary, Hexadecimal, Decimal ASCII, Octal, UTF-8 support, Decode back to text',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Text to Binary / Hex Converter — UTF-8 Byte Encoder | Toolisk</title>
        <meta name="description" content="Convert text to binary, hexadecimal, decimal, or octal. Decode byte strings back to text. UTF-8 aware with per-character byte breakdown. Free and browser-based." />
        <meta name="keywords" content="text to binary, text to hex, binary to text, hex to text, ascii to binary, utf-8 encoder, byte converter, text encoding" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Text to Binary / Hex Converter | Toolisk" />
        <meta property="og:description" content="Convert text to binary, hex, decimal, or octal byte encoding and back. UTF-8 aware." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="01" title="Text to Binary / Hex" tagline="Encode text as binary, hex, decimal, or octal bytes — or decode byte strings back to text. UTF-8 aware.">
        <TextBinary />
      </ToolShell>

      <ToolSEOContent
        description="A UTF-8 aware text encoder and decoder. Convert any text string to its binary (base 2), hexadecimal (base 16), decimal (base 10), or octal (base 8) byte representation. Works with ASCII, Unicode, accented characters, and emoji. Also decodes byte strings back to readable text."
        features={[
          '🔢 Binary, hex, decimal, and octal output',
          '🌐 UTF-8 aware — handles Unicode and emoji',
          '🔍 Per-character byte breakdown',
          '↩️ Decode bytes back to text',
          '⚙️ Configurable separator (space, dash, comma, none)',
          '📋 Copy output with one click',
        ]}
        steps={[
          { title: 'Choose direction', desc: 'Text → Bytes to encode, Bytes → Text to decode.' },
          { title: 'Select output format', desc: 'Binary (8-bit), hexadecimal (2-char), decimal, or octal.' },
          { title: 'Type or paste input', desc: 'The conversion appears instantly.' },
          { title: 'Explore the breakdown', desc: 'Scroll to see each character\'s individual byte values.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why byte encoding matters</h2>
            <p className="text-slate-600 leading-relaxed">
              At the hardware level, computers store everything as bytes. Text encoding defines how characters map to bytes. ASCII covers 128 characters in a single byte each; UTF-8 extends this to all Unicode characters using 1–4 bytes per character. Understanding byte representation is essential for network protocols, file formats, cryptography, and low-level debugging.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Number Base Converter', href: '/tools/number-base-converter', icon: '🔢' },
          { name: 'Base64 Encoder / Decoder', href: '/tools/base64', icon: '🔐' },
          { name: 'Hash Generator', href: '/tools/hash-generator', icon: '🔏' },
        ]}
      />
    </>
  );
}
