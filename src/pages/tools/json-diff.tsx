import Head from 'next/head';
import JsonDiff from '../../components/Tools/JsonDiff';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/json-diff';

const FAQS = [
  { q: 'How is this different from a plain text diff?', a: 'A text diff is line-by-line — if you reorder two keys in an object, it shows everything as changed even though the data is identical. A semantic JSON diff understands structure: it compares keys regardless of their order, so only genuine changes (added keys, removed keys, changed values) appear in the results.' },
  { q: 'Can it diff arrays?', a: 'Yes. Arrays are compared position by position. If element 0 changed, the diff shows index [0] as changed. If elements were added to the end, those appear as additions. For very large arrays where order changed completely, a semantic array diff would need a longest-common-subsequence algorithm — this tool uses positional comparison, which covers the vast majority of real-world cases.' },
  { q: 'Does it handle nested objects?', a: 'Yes — the diff recurses through arbitrarily deep nested objects and arrays, reporting changes with their full dot-path (e.g. $.user.address.city).' },
  { q: 'Is my JSON data uploaded anywhere?', a: 'No. Both inputs are processed entirely in your browser using JavaScript. Nothing is sent to a server.' },
  { q: 'What does the flat path notation mean?', a: 'Each diff entry shows a JSONPath-style path (e.g. $.user.email or $.items[2].price) so you know exactly where in the document the change occurred. This makes it easy to scan large diffs at a glance.' },
];

export default function JsonDiffPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'JSON Diff',
    slug: SLUG,
    description: 'Compare two JSON documents semantically — see added, removed, and changed keys by path, independent of property order.',
    featureList: 'Semantic diff, Nested object comparison, Array comparison, Flat path notation, Key-order independent',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>JSON Diff — Semantic JSON Comparison Tool | Toolisk</title>
        <meta name="description" content="Compare two JSON objects semantically. See added, removed, and changed keys with full dot-path notation — order-independent. 100% client-side." />
        <meta name="keywords" content="json diff, compare json, json comparison, semantic json diff, json diff tool, json diff online, json object diff" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="JSON Diff | Toolisk" />
        <meta property="og:description" content="Compare two JSON documents semantically — additions, deletions, and changes by key path." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🔍" title="JSON Diff" tagline="Compare two JSON documents semantically — see exactly what changed, added, or was removed, path by path.">
        <JsonDiff />
      </ToolShell>

      <ToolSEOContent
        description="A semantic JSON diff tool that compares two JSON objects by structure, not by line. Keys are compared regardless of order, and every change is reported with its full dot-path (e.g. $.user.email) so you know exactly where in the document each difference lives."
        features={[
          "🧠 Semantic diff — key order doesn't matter",
          '🔎 Full dot-path for every changed key',
          '🌳 Recursively compares nested objects and arrays',
          '🏷️ Color-coded: added (green), removed (red), changed (amber)',
          '📋 Copy the full diff as plain text',
          '🛡️ 100% browser-based — no data uploaded',
        ]}
        steps={[
          { title: 'Paste original JSON', desc: 'Drop the baseline JSON document into the left panel, or click "Load sample" to use the built-in user-record example.' },
          { title: 'Paste modified JSON', desc: 'Paste the updated version into the right panel.' },
          { title: 'Read the diff', desc: 'Each changed field appears with its path (e.g. $.user.email), old value, and new value.' },
          { title: 'Copy or share', desc: 'Use the Copy button to export the diff as plain-text lines for a PR comment or incident report.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Semantic diff vs text diff</h2>
            <p className="text-slate-600 leading-relaxed">
              Paste two JSON responses that differ only in key ordering into a text diff tool and you&apos;ll see dozens
              of &ldquo;changed&rdquo; lines even though the data is identical. That&apos;s because text diff works line by line —
              it has no understanding of JSON structure.
            </p>
            <p className="text-slate-600 leading-relaxed">
              A semantic diff parses both documents and walks the object graph recursively. Two objects are equal if
              they have the same keys with the same values, regardless of the order those keys appear in the source.
              This is almost always what you actually want when comparing API responses or configuration snapshots.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Real-world use cases</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>API response testing:</strong> Confirm a refactored endpoint returns the same payload as the old one.</li>
              <li><strong>Config management:</strong> Compare a staging config snapshot against production to catch drift.</li>
              <li><strong>Incident investigation:</strong> Check what changed in a feature flag payload between two deploys.</li>
              <li><strong>Database migrations:</strong> Diff a before/after record to verify only the intended columns changed.</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Limitations to know</h3>
            <p className="text-slate-600 leading-relaxed">
              Arrays are compared by position, not by identity. If you shuffle the items in an array,
              the diff will report many changes even if all the same elements are present. If your use case requires
              set-based array comparison (e.g. &ldquo;same items, different order = no diff&rdquo;), you&apos;ll need to sort the
              arrays before pasting them here, or use a library like{' '}
              <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">deep-equal</code> with custom comparators.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'JSONPath Tester', href: '/tools/jsonpath-tester', icon: '🧭' },
          { name: 'JSON Viewer & Formatter', href: '/tools/json-viewer', icon: '🧩' },
          { name: 'Text Diff Checker', href: '/tools/text-diff', icon: '📄' },
        ]}
      />
    </>
  );
}
