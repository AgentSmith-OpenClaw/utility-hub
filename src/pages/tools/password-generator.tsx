import Head from 'next/head';
import PasswordGenerator from '../../components/Tools/PasswordGenerator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/password-generator';

export default function PasswordGeneratorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Password Generator',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Generate strong, cryptographically secure passwords or memorable passphrases. Customize length and character classes.',
    url: `${SITE_URL}${SLUG}`,
    featureList: 'Random password generation, Passphrase mode, Strength meter, Character class options, Cryptographically secure (Web Crypto API)',
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Is the password generator secure?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. It uses crypto.getRandomValues, the browser\'s cryptographically secure random number generator. No password is ever transmitted, logged, or stored.' } },
      { '@type': 'Question', name: 'How long should my password be?', acceptedAnswer: { '@type': 'Answer', text: 'For most accounts, 16+ characters with mixed case, digits, and symbols gives you 95+ bits of entropy — far more than offline cracking can break in a human lifetime. For high-value accounts (email, banking, password manager master), use 20+.' } },
      { '@type': 'Question', name: 'Random password vs passphrase — which is better?', acceptedAnswer: { '@type': 'Answer', text: 'Random characters give the highest entropy per character but are unmemorable. Passphrases (4–6 random words) are easier to type and remember, with comparable strength when you use enough words. Use passphrases for things you must memorize (master password, OS login); use random strings for everything stored in your password manager.' } },
      { '@type': 'Question', name: 'What does "entropy" mean?', acceptedAnswer: { '@type': 'Answer', text: 'Entropy measures how unpredictable the password is. 70 bits resists most online attacks; 90+ bits resists offline cracking even with specialized hardware; 128+ bits is overkill but cheap to use.' } },
    ],
  };

  return (
    <>
      <Head>
        <title>Password Generator — Strong & Memorable Passwords | Toolisk</title>
        <meta name="description" content="Free password generator. Create strong random passwords or memorable passphrases. Customize length, symbols, digits. Cryptographically secure, 100% client-side." />
        <meta name="keywords" content="password generator, strong password generator, secure password, passphrase generator, random password, password strength" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Password Generator | Toolisk" />
        <meta property="og:description" content="Generate strong passwords and memorable passphrases — 100% client-side, no logging." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🔒" title="Password Generator" tagline="Strong random passwords or memorable passphrases — generated locally with Web Crypto, never logged.">
        <PasswordGenerator />
      </ToolShell>

      <ToolSEOContent
        description="A privacy-respecting password generator that creates either character-random passwords or human-memorable passphrases. Built with the Web Crypto API, so randomness is cryptographically strong. Live entropy meter shows the resistance to brute force attacks."
        features={[
          '🎲 Random character mode (length 8–64)',
          '🗝️ Passphrase mode (3–10 words)',
          '🛡️ Cryptographically secure (Web Crypto)',
          '📈 Live entropy + strength meter',
          '🚫 Optional ambiguous-character filter',
          '🔒 Nothing leaves your browser',
        ]}
        steps={[
          { title: 'Pick a mode', desc: 'Random characters (most secure per character) or passphrase (easier to memorize).' },
          { title: 'Adjust length', desc: '20+ characters or 5+ words is a sane default. The strength meter updates as you change settings.' },
          { title: 'Toggle character classes', desc: 'Lowercase, uppercase, digits, symbols. Each class adds entropy.' },
          { title: 'Regenerate until you like it', desc: 'Click regenerate to roll a new password without leaving the page.' },
          { title: 'Save it in a password manager', desc: 'Copy the password into 1Password, Bitwarden, KeePass, or any vault. Don\'t save it as a sticky note.' },
        ]}
        faqs={faqSchema.mainEntity.map((f) => ({ q: f.name, a: f.acceptedAnswer.text }))}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">What makes a password strong</h2>
            <p className="text-slate-600 leading-relaxed">
              Password strength is purely a function of <strong>entropy</strong> (unpredictability). The two ingredients are
              <em>length</em> and the <em>size of the character pool</em> you sample from. A 12-character password with
              full character classes has roughly 78 bits of entropy. Add four more characters and you cross 100 bits — the
              practical limit of what determined offline attackers can crack.
            </p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">When to use passphrases</h3>
            <p className="text-slate-600 leading-relaxed">
              The one password you must remember (your password manager master) should be a passphrase — five or six random
              words from a large word list. You&apos;ll type it daily, so memorability matters; randomness from EFF-style word
              lists still gives 60+ bits of entropy.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Hash Generator', href: '/tools/hash-generator', icon: '🔏' },
          { name: 'UUID Generator', href: '/tools/uuid-generator', icon: '🆔' },
          { name: 'JWT Decoder', href: '/tools/jwt-decoder', icon: '🔑' },
        ]}
      />
    </>
  );
}
