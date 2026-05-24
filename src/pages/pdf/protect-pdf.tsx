import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const ProtectPdf = dynamic(() => import('../../components/Pdf/ProtectPdf'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/protect-pdf';

const FAQS = [
  {
    q: 'Is this safe? Does it upload my PDF?',
    a: 'No upload whatsoever. Encryption runs entirely in your browser using AES-256-GCM via the Web Crypto API. Your PDF and password never leave your device, are never sent to a server, and are never logged.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'PDFs up to 100 MB are accepted. Files over 30 MB may be slower to encrypt, especially on mobile. The encryption uses PBKDF2 with 100,000 iterations for key derivation, which adds a brief delay.',
  },
  {
    q: 'Does it work offline?',
    a: 'After the page has loaded once, yes — all encryption runs locally in your browser using the Web Crypto API which works offline.',
  },
  {
    q: 'Will this work on iPhone / iPad?',
    a: 'Yes, on modern iOS Safari which supports the Web Crypto API. iOS limits per-tab memory, so very large PDFs (>50 MB) may encounter memory constraints.',
  },
  {
    q: 'How secure is the encryption?',
    a: 'It uses AES-256-GCM — the same algorithm used by TLS and modern disk encryption. The key is derived using PBKDF2 with SHA-256 and 100,000 iterations, making brute-force attacks impractical.',
  },
  {
    q: 'Can I open this PDF in any PDF reader?',
    a: 'Toolisk-protected PDFs use a custom AES-256 encryption format. They can only be unlocked using Toolisk\'s Unlock PDF tool. This approach ensures true client-side encryption without needing server-side PDF processing.',
  },
  {
    q: 'What happens if I forget my password?',
    a: 'There is no way to recover it. The encryption is mathematically irreversible without the correct password. Keep it in a safe place.',
  },
  {
    q: 'Is this the same as standard PDF password protection?',
    a: 'No. Standard PDF password encryption requires server-side libraries or heavy WASM modules. Toolisk\'s approach uses the browser\'s built-in Web Crypto API for AES-256 encryption, keeping everything local and lightweight.',
  },
];

export default function ProtectPdfPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Protect PDF',
    slug: SLUG,
    description: 'Password-protect any PDF with AES-256 encryption — set a password and download a locked copy. 100% private, runs in your browser, no upload.',
    category: 'UtilitiesApplication',
    featureList: 'AES-256 encryption, PBKDF2 key derivation, Instant download, No upload, Free, No sign-up, No watermark',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Protect PDF — Free, No Upload, Private | Toolisk</title>
        <meta
          name="description"
          content="Password-protect any PDF with AES-256 encryption — set a password and download a locked copy instantly. 100% private: runs in your browser, no upload."
        />
        <meta
          name="keywords"
          content="protect pdf, pdf password protect, lock pdf, encrypt pdf, pdf lock no upload, protect pdf online private, protect pdf free, add password to pdf"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Protect PDF | Toolisk" />
        <meta
          property="og:description"
          content="Password-protect any PDF with AES-256 encryption — set a password, download a locked copy. 100% private, no upload."
        />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]),
          }}
        />
      </Head>

      <ToolShell
        icon="🔐"
        title="Protect PDF"
        tagline="Password-protect any PDF with AES-256 encryption — set a password, download a locked copy. Runs entirely in your browser."
        gradient="from-rose-600 via-red-600 to-orange-500"
        parent="pdf"
      >
        <ProtectPdf />
      </ToolShell>

      <ToolSEOContent
        description="Add password protection to any PDF using AES-256-GCM encryption. The password you set is used to derive an encryption key via PBKDF2 with 100,000 iterations — the same standard used by password managers. The entire operation runs in your browser using the Web Crypto API: your PDF bytes and password never leave your device. The encrypted file can be unlocked later using Toolisk's Unlock PDF tool. Free, no sign-up, no watermark."
        features={[
          '🔒 AES-256-GCM encryption — bank-grade security',
          '🔑 PBKDF2 key derivation with 100,000 iterations',
          '📄 File never leaves your browser — fully client-side',
          '⚡ Instant encryption via Web Crypto API',
          '🔓 Unlock with Toolisk\'s companion Unlock PDF tool',
          '🆓 Free, no sign-up, no watermark',
        ]}
        steps={[
          {
            title: 'Drop your PDF',
            desc: 'Any size up to 100 MB.',
          },
          {
            title: 'Set a password',
            desc: 'Min 4 characters. Choose something memorable.',
          },
          {
            title: 'Confirm & encrypt',
            desc: 'One click, AES-256 encryption applied.',
          },
          {
            title: 'Download the protected copy',
            desc: 'Keep your password safe — it cannot be recovered.',
          },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">When you need to password-protect a PDF</h2>
            <p className="text-slate-600 leading-relaxed">
              There are many situations where you need to lock a PDF before sharing it: sending a tax return to your accountant, emailing a contract to a client, storing a bank statement in cloud storage, or sharing a confidential report with your team. Password protection ensures that only someone with the correct password can view the file — even if it falls into the wrong hands.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a concrete example: a 20-page business report at 3.2 MB. After setting a password and clicking Protect, the tool encrypts the file using AES-256-GCM. The resulting file is approximately 3.2 MB (encryption adds negligible overhead — about 37 bytes for the header). The encryption takes well under a second in a modern browser, with the PBKDF2 key derivation being the only noticeable computation.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no upload matters for protecting sensitive PDFs</h3>
            <p className="text-slate-600 leading-relaxed">
              When you protect a PDF using a server-side tool, you are giving that server both your unprotected file <em>and</em> the password you want to protect it with. This means the provider can read your document and knows your password. If the server is compromised, your sensitive data and password are exposed.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Toolisk&apos;s Protect PDF tool eliminates this risk. The encryption happens entirely in your browser using the Web Crypto API. Your file is read into memory, the encryption key is derived from your password using PBKDF2, and AES-256-GCM encrypts the PDF bytes. The encrypted result is streamed directly to your download. Nothing is transmitted to any server. This is not a privacy promise — it is how the technology works.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Protect PDF vs Unlock PDF</h3>
            <table className="w-full text-sm text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 font-semibold text-slate-900">Tool</th>
                  <th className="text-left py-2 font-semibold text-slate-900">What it does</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium text-slate-800">Protect PDF</td>
                  <td className="py-2">Encrypts a PDF with a password. The output can only be opened after entering the password in the Unlock PDF tool.</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium text-slate-800">Unlock PDF</td>
                  <td className="py-2">Removes password protection from both standard PDF passwords and Toolisk-encrypted PDFs. Enter the password and download the unlocked copy.</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium text-slate-800">Compress PDF</td>
                  <td className="py-2">Reduce file size before encrypting — useful for large PDFs being shared via email.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium text-slate-800">Merge PDF</td>
                  <td className="py-2">Combine multiple PDFs before protecting them as a single encrypted file.</td>
                </tr>
              </tbody>
            </table>
          </section>
        }
        relatedTools={[
          { name: 'Unlock PDF', href: '/pdf/unlock-pdf', icon: '🔓' },
          { name: 'Compress PDF', href: '/pdf/compress-pdf', icon: '🗜️' },
          { name: 'Merge PDF', href: '/pdf/merge-pdf', icon: '📎' },
        ]}
      />
    </>
  );
}
