import Head from 'next/head';
import CaseConverter from '../../components/Tools/CaseConverter';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const FAQS = [
  { q: 'Where is each case typically used?', a: 'camelCase: JavaScript variables and functions. PascalCase: React components and TypeScript types. snake_case: Python and database columns. CONSTANT_CASE: environment variables and constants. kebab-case: URLs and CSS classes.' },
  { q: 'Can it handle mixed input like "myVariableName"?', a: 'Yes. The tool splits camelCase and PascalCase input by detecting case transitions (lowercase→uppercase). It also splits on spaces, hyphens, underscores, and dots.' },
  { q: 'What is Train-Case?', a: 'Train-Case is HTTP-Header-Style — capitalized words joined by hyphens. Used in HTTP headers (Content-Type, X-Forwarded-For) and occasional UI conventions.' },
  { q: "Why does the tool sometimes lowercase letters that were uppercase in my input?", a: 'Each conversion enforces its own case rules. snake_case is always lowercase. CONSTANT_CASE is always uppercase. To preserve original casing exactly, use one of the formats that matches it (Title Case, lowercase, UPPERCASE, etc.).' },
];

export default function CaseConverterPage() {
  const breadcrumbSchema = generateBreadcrumbs('/tools/case-converter');
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Case Converter',
    slug: '/tools/case-converter',
    description: 'Convert text between camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE, and other common formats.',
    featureList: '12 case formats, Smart word splitting, Per-row copy, Real-time conversion',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Case Converter — camelCase, snake_case, kebab-case & More | Toolisk</title>
        <meta
          name="description"
          content="Convert text between camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE, Title Case, and more. Free, browser-based case converter for developers and writers."
        />
        <meta
          name="keywords"
          content="case converter, camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE, title case, text case"
        />
        <link rel="canonical" href={`${SITE_URL}/tools/case-converter`} />
        <meta property="og:title" content="Case Converter | Toolisk" />
        <meta property="og:description" content="Convert text between every common case format." />
        <meta property="og:url" content={`${SITE_URL}/tools/case-converter`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="🔤"
        title="Case Converter"
        tagline="Convert text between camelCase, snake_case, kebab-case, PascalCase, and every other common format."
      >
        <CaseConverter />
      </ToolShell>

      <ToolSEOContent
        description="A free case converter that handles every common text format programmers and writers use. Paste any text in any case — the tool intelligently splits it into words and shows all 12 conversions side by side, ready to copy."
        features={[
          '🔁 12 different case conversions in one view',
          '🤖 Smart word splitting (handles camelCase, kebab-case, snake_case input)',
          '📋 Per-row copy buttons',
          '⚡ Real-time conversion as you type',
          '🛡️ Runs entirely in your browser',
          '🆓 Free, no sign-ups',
        ]}
        steps={[
          { title: 'Paste any text', desc: 'Works with text in any existing case — the tool detects word boundaries automatically.' },
          { title: 'See all conversions', desc: 'Twelve different case formats appear immediately, each with its own copy button.' },
          { title: 'Copy what you need', desc: 'Click the Copy button on any row to put that conversion on your clipboard.' },
        ]}
        faqs={[
          {
            q: 'Where is each case typically used?',
            a: 'camelCase: JavaScript variables and functions. PascalCase: React components and TypeScript types. snake_case: Python and database columns. CONSTANT_CASE: environment variables and constants. kebab-case: URLs and CSS classes.',
          },
          {
            q: 'Can it handle mixed input like "myVariableName"?',
            a: 'Yes. The tool splits camelCase and PascalCase input by detecting case transitions (lowercase→uppercase). It also splits on spaces, hyphens, underscores, and dots.',
          },
          {
            q: 'What is Train-Case?',
            a: 'Train-Case is HTTP-Header-Style — capitalized words joined by hyphens. Used in HTTP headers (Content-Type, X-Forwarded-For) and occasional UI conventions.',
          },
          {
            q: "Why does the tool sometimes lowercase letters that were uppercase in my input?",
            a: 'Each conversion enforces its own case rules. snake_case is always lowercase. CONSTANT_CASE is always uppercase. To preserve original casing exactly, use one of the formats that matches it (Title Case, lowercase, UPPERCASE, etc.).',
          },
        ]}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why naming conventions matter</h2>
            <p className="text-slate-600 leading-relaxed">
              Every programming community has its preferred conventions. Mixing them in one codebase creates friction
              that slows everyone down. JavaScript uses camelCase for variables and PascalCase for classes. Python uses
              snake_case for variables. Constants are usually CONSTANT_CASE everywhere. URLs and CSS class names are
              usually kebab-case.
            </p>
            <p className="text-slate-600 leading-relaxed">
              When you migrate data, generate code, or build slugs from titles, converting between cases is something
              you do constantly. Doing it by hand for one identifier is fine. Doing it for a list of fifty is the
              kind of repetitive work that the case converter exists to eliminate.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Word Counter', href: '/tools/word-counter', icon: '✍️' },
          { name: 'Lorem Ipsum Generator', href: '/tools/lorem-ipsum', icon: '📝' },
          { name: 'JSON Viewer & Formatter', href: '/tools/json-viewer', icon: '🧩' },
        ]}
      />
    </>
  );
}
