import Head from 'next/head';
import ChmodCalculator from '../../components/Tools/ChmodCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/chmod-calculator';

const FAQS = [
  { q: 'What does chmod mean?', a: 'chmod stands for "change mode" — it is the Unix/Linux command used to set file permission bits. It controls which users can read, write, or execute a file or directory.' },
  { q: 'What do the three octal digits mean in chmod?', a: 'The three digits represent permissions for Owner, Group, and Others (everyone else). Each digit is the sum of read (4), write (2), and execute (1). For example, chmod 755 gives the owner rwx (7 = 4+2+1), group r-x (5 = 4+0+1), and others r-x.' },
  { q: 'What is chmod 644 used for?', a: 'chmod 644 (rw-r--r--) is the typical permission for regular files: the owner can read and write it, while group and others can only read it. It is the standard for web server files like HTML, CSS, and PHP.' },
  { q: 'What is chmod 755 used for?', a: 'chmod 755 (rwxr-xr-x) is standard for directories and executable files. The owner has full access; group and others can read and execute but not write. It is the default for most web server directories.' },
  { q: 'What does execute permission mean on a directory?', a: 'Execute permission on a directory means the ability to "enter" it — to cd into it or access files inside. Without execute, a user cannot navigate into the directory even if they have read permission.' },
];

export default function ChmodCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Chmod Calculator',
    slug: SLUG,
    description: 'Calculate Unix file permissions. Toggle read/write/execute checkboxes or enter an octal code to generate the chmod command.',
    featureList: 'Checkbox UI, Octal input, Symbolic notation, chmod command output, Common presets',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Chmod Calculator — Unix File Permission Generator | Toolisk</title>
        <meta name="description" content="Calculate Unix file permissions with checkboxes or octal input. Generate chmod commands in octal and symbolic notation. Includes common presets like 755, 644, 600. Free browser tool." />
        <meta name="keywords" content="chmod calculator, unix file permissions, chmod 755, chmod 644, octal permissions, linux permissions, file permission calculator, chmod command generator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Chmod Calculator | Toolisk" />
        <meta property="og:description" content="Calculate Unix file permissions and generate chmod commands. Checkboxes or octal input." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🔐" title="Chmod Calculator" tagline="Generate Unix file permissions interactively — toggle checkboxes or enter an octal code to build the right chmod command.">
        <ChmodCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A Unix file permissions calculator for Linux, macOS, and other POSIX systems. Toggle read, write, and execute checkboxes for Owner, Group, and Others — or type an octal code directly. Generates both octal (chmod 755) and symbolic (chmod u=rwx,g=rx,o=rx) command formats."
        features={[
          '☑️ Interactive checkboxes for Owner, Group, Others',
          '🔢 Octal input mode for direct code entry',
          '📜 Both octal and symbolic chmod commands',
          '🏷️ Common presets: 755, 644, 600, 777, 700',
          '📋 One-click copy of the chmod command',
          '💡 Plain-English permission summary',
        ]}
        steps={[
          { title: 'Pick a preset or enter checkboxes', desc: 'Start with a common preset like 755 or toggle individual read/write/execute bits.' },
          { title: 'Or use octal input', desc: 'Switch to Octal Input mode and type a 3-digit octal code directly.' },
          { title: 'Copy the chmod command', desc: 'Copy the octal (chmod 755 filename) or symbolic command for your terminal.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Common chmod values for web servers</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>755</strong> — directories and CGI scripts (owner can write; group and others can read and execute)</li>
              <li><strong>644</strong> — regular files like HTML, PHP, and images (owner can write; everyone can read)</li>
              <li><strong>600</strong> — sensitive files like SSH private keys and .env files (owner only)</li>
              <li><strong>700</strong> — private directories (owner full access; no one else can even enter)</li>
              <li><strong>777</strong> — avoid unless absolutely necessary — everyone has full access</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'CIDR / Subnet Calculator', href: '/tools/cidr-subnet-calculator', icon: '🌐' },
          { name: 'Number Base Converter', href: '/tools/number-base-converter', icon: '🔢' },
          { name: 'Hash Generator', href: '/tools/hash-generator', icon: '🔏' },
        ]}
      />
    </>
  );
}
