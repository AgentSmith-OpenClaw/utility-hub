import Head from 'next/head';
import YamlJsonConverter from '../../components/Tools/YamlJsonConverter';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/yaml-json-converter';

export default function YamlJsonConverterPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'YAML / JSON Converter',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Convert between YAML and JSON in either direction. Live preview, sample data, browser-only — no upload.',
    url: `${SITE_URL}${SLUG}`,
    featureList: 'JSON to YAML, YAML to JSON, Live conversion, Sample data, Error reporting',
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'When is YAML better than JSON?', acceptedAnswer: { '@type': 'Answer', text: 'YAML wins for human-edited config: it supports comments, has less syntactic noise (no quotes/braces), and tolerates trailing commas. JSON wins for machine-to-machine: it\'s strictly defined, faster to parse, and supported by every language out of the box.' } },
      { '@type': 'Question', name: 'Why does my YAML break with tabs?', acceptedAnswer: { '@type': 'Answer', text: 'YAML doesn\'t allow tabs for indentation — only spaces. Most editors auto-convert tabs to spaces; if not, set "Indent with spaces" in your editor settings to avoid this footgun.' } },
      { '@type': 'Question', name: 'Are YAML anchors and aliases supported?', acceptedAnswer: { '@type': 'Answer', text: 'No — this converter handles the common subset (maps, lists, scalars, comments, nesting). Anchors (&), aliases (*), tags (!), and complex flow-style are not parsed. For advanced features, use the official yaml.org tools or js-yaml in code.' } },
    ],
  };

  return (
    <>
      <Head>
        <title>YAML to JSON Converter (and back) — Online | Toolisk</title>
        <meta name="description" content="Free YAML / JSON converter. Convert YAML to JSON or JSON to YAML in your browser. Live preview, sample data, no upload. Supports nested objects, arrays, scalars." />
        <meta name="keywords" content="yaml to json, json to yaml, yaml json converter, yaml parser, json parser, online yaml" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="YAML / JSON Converter | Toolisk" />
        <meta property="og:description" content="Convert YAML to JSON and back, live in your browser." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🔄" title="YAML / JSON Converter" tagline="Convert YAML to JSON and back. Live as you type, with sample data and clear error messages.">
        <YamlJsonConverter />
      </ToolShell>

      <ToolSEOContent
        description="A bidirectional YAML and JSON converter. Useful when you have a Kubernetes manifest in YAML but need JSON for an API call, or vice versa. Handles maps, arrays, scalars, comments, and nested structures."
        features={[
          '↔️ Convert in either direction',
          '⚡ Live preview as you type',
          '🚨 Helpful error messages',
          '📦 Sample data for both formats',
          '📋 Copy result instantly',
          '🔒 Pure browser conversion',
        ]}
        steps={[
          { title: 'Pick a direction', desc: 'JSON → YAML or YAML → JSON.' },
          { title: 'Paste your input', desc: 'Both formats are validated as you type.' },
          { title: 'Read the output', desc: 'Side-by-side display makes it easy to spot how the structure maps over.' },
          { title: 'Copy and use', desc: 'Drop into your config, API request, or CI pipeline.' },
        ]}
        faqs={faqSchema.mainEntity.map((f) => ({ q: f.name, a: f.acceptedAnswer.text }))}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">When to choose YAML vs JSON</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Human-edited config</strong> (Kubernetes, GitHub Actions, Docker Compose): YAML.</li>
              <li><strong>HTTP request bodies, browser data</strong>: JSON.</li>
              <li><strong>Inter-service contracts</strong>: JSON (universal parsers, no whitespace ambiguity).</li>
              <li><strong>Documentation that doubles as config</strong>: YAML (comments are first-class).</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'JSON Viewer', href: '/tools/json-viewer', icon: '🧩' },
          { name: 'SQL Formatter', href: '/tools/sql-formatter', icon: '🗃️' },
          { name: 'Markdown Preview', href: '/tools/markdown-preview', icon: '📑' },
        ]}
        relatedArticles={[{ title: 'XML vs JSON vs YAML', href: '/tools/learn/xml-vs-json-vs-yaml' }]}
      />
    </>
  );
}
