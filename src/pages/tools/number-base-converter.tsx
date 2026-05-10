import Head from 'next/head';
import NumberBaseConverter from '../../components/Tools/NumberBaseConverter';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/number-base-converter';

const FAQS = [
  { q: 'What is base conversion?', a: 'Base conversion is the process of representing the same number in different numeral systems. Decimal (base 10) uses digits 0–9, binary (base 2) uses 0–1, octal (base 8) uses 0–7, and hexadecimal (base 16) uses 0–9 plus A–F.' },
  { q: 'Why do developers use hexadecimal?', a: 'Hex is compact: one hex digit represents exactly 4 binary bits (a nibble), so two hex digits represent a full byte. This makes hex ideal for memory addresses, color codes (#FF5733), and byte-level debugging.' },
  { q: 'Why does binary matter in programming?', a: 'Computers operate on binary at the hardware level. Understanding binary is essential for bitwise operations (AND, OR, XOR, shifts), low-level protocols, and working with flags and masks.' },
  { q: 'What is the octal number system used for?', a: 'Octal (base 8) is primarily used in Unix/Linux file permission notation (chmod 755) because each digit maps to exactly 3 binary bits, representing read/write/execute for owner, group, and others.' },
  { q: 'Can this tool convert negative numbers?', a: 'This tool converts non-negative integers. Negative number representation (two\'s complement) depends on the bit width of the target system and is not covered here.' },
];

export default function NumberBaseConverterPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Number Base Converter',
    slug: SLUG,
    description: 'Convert numbers between binary, octal, decimal, hexadecimal, and any base from 2 to 36.',
    featureList: 'Binary, Octal, Decimal, Hexadecimal, Custom base 2–36, Live conversion',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Number Base Converter — Binary, Octal, Hex, Decimal | Toolisk</title>
        <meta name="description" content="Convert numbers between binary, octal, decimal, and hexadecimal instantly. Supports any base from 2 to 36. Free, browser-only, no signup." />
        <meta name="keywords" content="number base converter, binary to decimal, decimal to hex, hexadecimal converter, octal converter, binary converter, base conversion" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Number Base Converter | Toolisk" />
        <meta property="og:description" content="Convert between binary, octal, decimal, and hex instantly. Supports any base 2–36." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🔢" title="Number Base Converter" tagline="Convert between binary, octal, decimal, hex, and any base 2–36 — live as you type.">
        <NumberBaseConverter />
      </ToolShell>

      <ToolSEOContent
        description="A real-time number base converter for developers, students, and engineers. Convert any integer between binary (base 2), octal (base 8), decimal (base 10), hexadecimal (base 16), and any custom base up to 36. All conversions happen instantly in your browser."
        features={[
          '🔢 Binary, octal, decimal, hex in one view',
          '🎛️ Custom base from 2 to 36',
          '⚡ Live conversion as you type',
          '📋 Copy any result with one click',
          '🔒 100% browser-based, no data sent',
          '🆓 Free and unlimited',
        ]}
        steps={[
          { title: 'Select input base', desc: 'Choose binary, octal, decimal, or hex as your source format.' },
          { title: 'Type your number', desc: 'The tool converts it to all other bases instantly.' },
          { title: 'Read all results', desc: 'Binary, octal, decimal, and hex are shown side by side.' },
          { title: 'Use custom base', desc: 'Expand the Custom Base section for base-32, base-36, or any other.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">When to use each base</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Binary (base 2):</strong> bitwise operations, hardware registers, network masks</li>
              <li><strong>Octal (base 8):</strong> Unix file permissions (chmod 755)</li>
              <li><strong>Decimal (base 10):</strong> human-facing numbers, most math</li>
              <li><strong>Hexadecimal (base 16):</strong> memory addresses, color codes, byte-level protocols, crypto hashes</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Text to Binary / Hex', href: '/tools/text-binary', icon: '01' },
          { name: 'Hash Generator', href: '/tools/hash-generator', icon: '🔏' },
          { name: 'Chmod Calculator', href: '/tools/chmod-calculator', icon: '🔐' },
        ]}
      />
    </>
  );
}
