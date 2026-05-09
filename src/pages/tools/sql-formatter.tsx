import Head from 'next/head';
import SqlFormatter from '../../components/Tools/SqlFormatter';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/sql-formatter';

export default function SqlFormatterPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SQL Formatter',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Format messy SQL queries into clean, readable form. Uppercase keywords, indented clauses, both formatted and minified output.',
    url: `${SITE_URL}${SLUG}`,
    featureList: 'SQL beautify, SQL minify, Keyword uppercase/lowercase, Configurable indent, JOIN/WHERE clause splitting',
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Which SQL dialects does this support?', acceptedAnswer: { '@type': 'Answer', text: 'It handles standard ANSI SQL keywords plus common PostgreSQL, MySQL, and SQL Server syntax. Stored procedures, vendor-specific functions, and CTE-heavy queries usually format cleanly but may need manual tweaks for edge cases.' } },
      { '@type': 'Question', name: 'Should keywords be uppercase?', acceptedAnswer: { '@type': 'Answer', text: 'It\'s a style choice. Uppercase keywords (SELECT, WHERE, JOIN) are the traditional convention and easier to scan in mixed-case codebases. Lowercase is increasingly common in modern style guides — pick one and apply it consistently.' } },
      { '@type': 'Question', name: 'Why do I need a formatter — won\'t my IDE do it?', acceptedAnswer: { '@type': 'Answer', text: 'Most IDEs do, but you frequently get SQL from logs, ORM-generated output, ticket comments, or screenshots. A web formatter is the fastest way to make a one-line query readable enough to debug.' } },
      { '@type': 'Question', name: 'Is the SQL sent anywhere?', acceptedAnswer: { '@type': 'Answer', text: 'No. Everything runs in your browser. You can paste production-shaped queries (after sanitizing real data) without privacy concerns.' } },
    ],
  };

  return (
    <>
      <Head>
        <title>SQL Formatter — Free Online SQL Beautifier | Toolisk</title>
        <meta name="description" content="Free SQL formatter and beautifier. Paste any messy SQL query and get clean, indented output with uppercase keywords. Plus minify mode. Runs in your browser." />
        <meta name="keywords" content="sql formatter, sql beautifier, format sql online, sql pretty print, sql minifier, sql indent, postgres mysql formatter" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="SQL Formatter | Toolisk" />
        <meta property="og:description" content="Format and minify SQL queries — fully client-side." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🗃️" title="SQL Formatter" tagline="Paste a messy SQL query and get clean, indented output. Plus a minify mode for embedding in code.">
        <SqlFormatter />
      </ToolShell>

      <ToolSEOContent
        description="A fast SQL formatter that handles SELECT, INSERT, UPDATE, DELETE, JOINs, subqueries, and CTEs. Splits keywords onto their own lines and indents inner expressions for instant readability. Switch keyword case and indent depth on the fly."
        features={[
          '✨ Pretty-print SELECT, INSERT, UPDATE, DELETE',
          '🪜 Smart indentation per clause',
          '🔠 Toggle UPPERCASE keywords',
          '📏 2 / 4 / 8 space indent presets',
          '⚡ Single-line minify for embedding',
          '🔒 Runs in browser — no data leaves',
        ]}
        steps={[
          { title: 'Paste your SQL', desc: 'Drop a query of any size — multi-line or single-line both work.' },
          { title: 'Pick indent and case', desc: 'Choose 2 / 4 / 8 spaces. Toggle uppercase keywords if your style guide demands it.' },
          { title: 'Copy formatted output', desc: 'Use it in pull requests, ticket comments, or your code editor.' },
          { title: 'Or grab the minified version', desc: 'For embedding in app code, ORM raw queries, or compact log lines.' },
        ]}
        faqs={faqSchema.mainEntity.map((f) => ({ q: f.name, a: f.acceptedAnswer.text }))}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why formatted SQL matters</h2>
            <p className="text-slate-600 leading-relaxed">
              SQL is one of the few languages where the same logic can be written as a 200-character one-liner or a 30-line
              vertical layout — both syntactically correct, but only one of them is actually reviewable in a pull request.
              When clauses live on their own line, you can scan filter logic, join conditions, and projected columns
              independently rather than parsing one wall of text.
            </p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">Conventions worth standardizing</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Top-level keywords on their own line:</strong> SELECT, FROM, WHERE, GROUP BY, ORDER BY, LIMIT.</li>
              <li><strong>One column per line</strong> in projections of more than 2–3 columns.</li>
              <li><strong>JOINs aligned</strong> with FROM, ON conditions indented under them.</li>
              <li><strong>Boolean operators leading</strong> in multi-line WHERE clauses (AND/OR at the start, not the end).</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'JSON Viewer & Formatter', href: '/tools/json-viewer', icon: '🧩' },
          { name: 'Regex Tester', href: '/tools/regex-tester', icon: '🧪' },
          { name: 'YAML / JSON Converter', href: '/tools/yaml-json-converter', icon: '🔄' },
        ]}
      />
    </>
  );
}
