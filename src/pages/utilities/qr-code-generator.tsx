import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const QrCodeGenerator = dynamic(() => import('../../components/Utilities/QrCodeGenerator'), { ssr: false });

const SLUG = '/utilities/qr-code-generator';

const FAQS = [
  { q: 'What file formats can I download?', a: 'PNG (raster) and SVG (vector). PNG is the easiest to share and embed anywhere. SVG scales perfectly to any size without pixelation, making it ideal for printing on packaging, signage, or merchandise.' },
  { q: 'What error correction level should I choose?', a: 'L (7%) is fine for clean digital displays. M (15%) is the recommended default — it lets you recover from minor smudges. Q (25%) is good for printed materials that might get dirty. H (30%) is for QR codes with a logo overlay, since the logo covers part of the code and needs maximum redundancy to still scan.' },
  { q: 'Can I embed a logo in the QR code?', a: 'This tool does not apply a logo overlay, but you can do it yourself by editing the downloaded SVG in Inkscape or Figma. Use H error correction so the code stays scannable when 30% of the modules are obscured.' },
  { q: 'How do I create a Wi-Fi QR code?', a: 'Select the "Wi-Fi" preset and enter your SSID (network name), password, and security type (WPA2 for most home routers). The generated QR follows the WIFI: URI format — Android and iOS both scan it natively to join the network without typing the password.' },
  { q: 'Is the QR content stored anywhere?', a: 'No. The QR code is generated entirely in your browser using the qrcode library. No text, URL, or contact data is sent to any server.' },
];

export default function QrCodeGeneratorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'QR Code Generator',
    slug: SLUG,
    description: 'Generate QR codes for URLs, text, Wi-Fi, email, SMS, and vCard contacts. Download as PNG or SVG. 100% client-side.',
    featureList: 'URL QR, Wi-Fi QR, vCard QR, Email SMS QR, PNG download, SVG download, Custom colors, Error correction',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>QR Code Generator — Free PNG & SVG Download | Toolisk</title>
        <meta name="description" content="Create QR codes for URLs, text, Wi-Fi, vCard, email, and SMS. Download as PNG or SVG. Custom colors and error correction. 100% browser-based." />
        <meta name="keywords" content="qr code generator, free qr code, qr code maker, wifi qr code, vcard qr code, qr code png, qr code svg, generate qr code online" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="QR Code Generator | Toolisk" />
        <meta property="og:description" content="Generate QR codes for URLs, Wi-Fi, vCard, and more. Download PNG or SVG free." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="📱" title="QR Code Generator" tagline="Turn any URL, text, Wi-Fi credential, or contact into a downloadable QR code — PNG and SVG, fully in your browser." parent="utilities" theme="amber">
        <QrCodeGenerator />
      </ToolShell>

      <ToolSEOContent
        description="A free QR code generator that works entirely in your browser. Create QR codes for URLs, plain text, Wi-Fi networks, email addresses, SMS messages, and vCard contacts. Download as PNG or SVG, customize foreground and background colors, and choose your error correction level."
        features={[
          '🔗 6 content presets: URL, text, Wi-Fi, email, SMS, vCard',
          '🖼️ Download as PNG or SVG',
          '🎨 Custom foreground and background colors',
          '🛡️ L / M / Q / H error correction levels',
          '📐 Size control from 64px to 1024px',
          '🔒 100% client-side — content never leaves your browser',
        ]}
        steps={[
          { title: 'Pick a content type', desc: 'Select URL, text, Wi-Fi, vCard, email, or SMS. The form adapts to collect the right fields for each type.' },
          { title: 'Fill in the details', desc: 'Enter your URL, paste text, type Wi-Fi credentials, or fill in contact fields. The QR code updates live.' },
          { title: 'Adjust options', desc: 'Set error correction level (M is a good default), size, and colors. Use H for QR codes that will have a logo overlay.' },
          { title: 'Download', desc: 'Click "Download PNG" for photos and screens, or "Download SVG" for print-ready vector output.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">How QR codes work</h2>
            <p className="text-slate-600 leading-relaxed">
              A QR (Quick Response) code encodes data as a 2D matrix of black and white modules. The scanner reads the
              pattern using a camera and decodes it using Reed-Solomon error correction — the same technique used in CDs
              and barcodes. This lets a QR code be partially obscured (up to 30% with H correction) and still scan correctly.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The three large squares in the corners are finder patterns — they allow scanners to locate and orient the
              code at any angle. The small square in the bottom-right is the alignment pattern, used for larger codes.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Wi-Fi QR codes</h3>
            <p className="text-slate-600 leading-relaxed">
              The WIFI: URI format used by this tool is natively supported by Android (5.0+) and iOS (11+). Guests can
              scan the code with their camera app and join the network without you ever reading out a password. For
              hospitality use, print the QR code, laminate it, and place it on tables — much nicer than a sign with a
              20-character WPA2 password.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'URL Encoder / Decoder', href: '/tools/url-encoder', icon: '🔗' },
          { name: 'Percentage Calculator', href: '/utilities/percentage-calculator', icon: '%' },
          { name: 'Unit Converter', href: '/utilities/unit-converter', icon: '⚖️' },
        ]}
      />
    </>
  );
}
