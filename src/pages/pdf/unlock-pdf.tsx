import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const UnlockPdf = dynamic(() => import('../../components/Pdf/UnlockPdf'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading PDF engine…</div>,
});

const SLUG = '/pdf/unlock-pdf';

const FAQS = [
  {
    q: 'Is this safe? Does it upload my PDF?',
    a: 'No upload whatsoever. The entire operation runs in your browser using the open-source pdf-lib library. Your PDF never leaves your device, is never sent to a server, and is never logged. The password you enter stays in your browser tab and is never transmitted anywhere.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'PDFs up to 100 MB are accepted. Files over 30 MB may be slower on mobile. For very large password-protected PDFs, unlocking may take a few seconds depending on your device.',
  },
  {
    q: 'Does it work offline?',
    a: 'After the page has loaded once, yes — the PDF engine is cached in your browser and unlocking runs locally even without an internet connection.',
  },
  {
    q: 'Will this work on iPhone / iPad?',
    a: 'Yes, on modern iOS Safari. iOS limits per-tab memory, so very large PDFs (>50 MB) may fail. Desktop browsers handle bigger files comfortably.',
  },
  {
    q: 'What kind of passwords does it support?',
    a: 'It supports owner passwords and user/open passwords set in the PDF encryption dictionary. If the PDF uses certificate-based or DRM-based encryption, pdf-lib cannot decrypt it and will show an error.',
  },
  {
    q: 'Will the unlocked PDF lose any quality or data?',
    a: 'No. pdf-lib copies all page content, metadata, annotations, and form fields byte-for-byte. The only change is that the encryption wrapper is removed. The visual output is identical to the original.',
  },
  {
    q: 'What if I enter the wrong password?',
    a: 'The tool will show an error and let you try again. There is no lockout or rate limit — you can retry as many times as needed.',
  },
  {
    q: 'Can I unlock PDFs protected with certificate encryption?',
    a: 'No. Certificate-based and DRM-protected PDFs use different encryption mechanisms that pdf-lib does not support. Only password-based encryption (owner and user passwords) is supported.',
  },
];

export default function UnlockPdfPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Unlock PDF',
    slug: SLUG,
    description: 'Remove password protection from any PDF instantly — enter the password, download an unlocked copy. 100% private, runs in your browser, no upload.',
    category: 'UtilitiesApplication',
    featureList: 'Client-side decryption, Password-based unlock, Instant download, No upload, Free, No sign-up, No watermark',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Unlock PDF — Free, No Upload, Private | Toolisk</title>
        <meta
          name="description"
          content="Remove password protection from any PDF — enter the password and download an unlocked copy instantly. 100% private: runs in your browser, no upload."
        />
        <meta
          name="keywords"
          content="unlock pdf, remove pdf password, decrypt pdf, pdf password remover, unlock pdf no upload, unlock pdf online private, unlock pdf free, remove pdf protection"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Unlock PDF | Toolisk" />
        <meta
          property="og:description"
          content="Remove password protection from any PDF — enter the password, download an unlocked copy. 100% private, no upload."
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
        icon="🔓"
        title="Unlock PDF"
        tagline="Remove password protection from a PDF — enter the password, download an unlocked copy. Runs entirely in your browser."
        gradient="from-rose-600 via-red-600 to-orange-500"
        parent="pdf"
      >
        <UnlockPdf />
      </ToolShell>

      <ToolSEOContent
        description="Remove the password from any PDF by entering the correct owner or user password. The tool decrypts the file using pdf-lib — an open-source PDF engine — entirely inside your browser. No file is uploaded, no password is transmitted, and the unlocked PDF is assembled locally in your browser tab. Download the unprotected copy instantly. Free, no sign-up, no watermark."
        features={[
          '🔒 100% client-side — your PDF and password never leave your browser',
          '🔑 Enter the password, unlock, and download instantly',
          '📄 Original quality preserved — all content, annotations, and form fields intact',
          '🪶 Lightweight — uses pdf-lib, no file upload, no server processing',
          '🔄 Works with owner and user (open) passwords',
          '🆓 Free, no sign-up, no watermark',
        ]}
        steps={[
          {
            title: 'Drop your PDF',
            desc: 'Any size up to 100 MB.',
          },
          {
            title: 'Enter the password',
            desc: 'The tool auto-detects if the PDF is encrypted.',
          },
          {
            title: 'Unlock & download',
            desc: 'One click, password protection is removed.',
          },
          {
            title: '(Optional) Rename',
            desc: 'Default name is {original}-unlocked.pdf.',
          },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">When you need to unlock a password-protected PDF</h2>
            <p className="text-slate-600 leading-relaxed">
              Password-protected PDFs are common when dealing with sensitive documents: banks password-protect statements, employers lock offer letters, government agencies encrypt tax transcripts, and freelancers receive protected contracts from clients. While the password serves a genuine security purpose at rest, it becomes a friction point every time you need to open, print, or share the file — especially on mobile devices where PDF readers handle password prompts inconsistently.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a concrete example: a 12-page bank statement at 450 KB, protected with a user password. After entering the password and clicking Unlock, the tool produces an identical 12-page PDF at approximately 440 KB (slightly smaller because the encryption overhead is removed). The operation takes well under a second in a modern browser. All transaction data, formatting, and page layout are preserved exactly.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no upload matters for password-protected PDFs</h3>
            <p className="text-slate-600 leading-relaxed">
              Password-protected PDFs are inherently sensitive — that is why they were protected in the first place. Bank statements, tax returns, medical records, employment contracts, and identity documents all fall into this category. When you use a server-side unlock tool, two sensitive pieces of information leave your device: the file itself <em>and</em> the password that decrypts it. This means the provider can not only read your document but also gain the password that protects any other copy of that file you may have shared elsewhere.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Toolisk&apos;s Unlock PDF tool eliminates this trust problem entirely. pdf-lib runs inside your browser tab — the PDF bytes and the password you enter are read into JavaScript memory and processed locally. The decrypted PDF is assembled in-memory and streamed directly to the download prompt. Nothing is transmitted. No server has access to your file or your password. When you close the tab, everything is gone. This is not a policy choice — it is enforced by the architecture.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Unlock vs other PDF tools</h3>
            <table className="w-full text-sm text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 font-semibold text-slate-900">Tool</th>
                  <th className="text-left py-2 font-semibold text-slate-900">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium text-slate-800">Unlock PDF</td>
                  <td className="py-2">Remove password protection so you can open, share, or edit the file freely.</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium text-slate-800">Merge PDF</td>
                  <td className="py-2">Combine multiple PDFs into one. Use after unlocking to merge protected PDFs together.</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium text-slate-800">Split PDF</td>
                  <td className="py-2">Extract or split pages from a PDF into separate files.</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium text-slate-800">Compress PDF</td>
                  <td className="py-2">Reduce file size for email or web upload. Unlock first if the PDF is password-protected.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium text-slate-800">Delete Pages from PDF</td>
                  <td className="py-2">Remove specific pages before sharing. Unlock first to edit protected files.</td>
                </tr>
              </tbody>
            </table>
          </section>
        }
        relatedTools={[
          { name: 'Merge PDF', href: '/pdf/merge-pdf', icon: '📎' },
          { name: 'Compress PDF', href: '/pdf/compress-pdf', icon: '🗜️' },
          { name: 'Protect PDF', href: '/pdf/protect-pdf', icon: '🔐' },
        ]}
      />
    </>
  );
}
