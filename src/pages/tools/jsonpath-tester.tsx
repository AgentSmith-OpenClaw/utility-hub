import Head from 'next/head';
import JsonPathTester from '../../components/Tools/JsonPathTester';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/jsonpath-tester';

const FAQS = [
  { q: 'What is JSONPath?', a: 'JSONPath is a query language for JSON, similar to XPath for XML. It lets you navigate and extract values from a JSON document using a path expression like $.store.books[*].title. It was introduced by Stefan Goessner in 2007 and is widely used in testing frameworks, API tools, and data pipelines.' },
  { q: 'What JSONPath syntax does this tool support?', a: 'This tool supports the most common expressions: $ (root), .key (child), ..key (recursive descent), [*] (all elements), [n] (index), [start:end] (slice), and [?(@.field op value)] for filter expressions. Nested filters and script expressions are not supported.' },
  { q: 'How do I filter an array by value?', a: 'Use the filter syntax [?(@.key == value)]. For example, $.books[?(@.price < 20)] returns all books with a price below 20. Supported operators are ==, !=, <, <=, >, >=.' },
  { q: 'What is the difference between . and .. in JSONPath?', a: 'A single dot (.) is a child operator — it selects the immediate named child. Double dot (..) is the recursive descent operator — it searches the entire nested structure for a matching key, no matter how deep. $..author finds all "author" keys at any level.' },
  { q: 'Is my JSON sent to a server?', a: 'No. All processing happens in your browser using JavaScript. No data is uploaded or logged.' },
];

export default function JsonPathTesterPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'JSONPath Tester',
    slug: SLUG,
    description: 'Run JSONPath expressions against any JSON document and see matching nodes highlighted in real time. 100% browser-based.',
    featureList: 'Live JSONPath evaluation, Filter expressions, Recursive descent, Array slices, Cheatsheet, Sample presets',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>JSONPath Tester — Live Query Evaluator | Toolisk</title>
        <meta name="description" content="Run JSONPath expressions against any JSON and see results instantly. Supports filters, recursive descent, slices, and array indexing. 100% client-side." />
        <meta name="keywords" content="jsonpath tester, jsonpath evaluator, jsonpath online, json query, jsonpath filter, json path expression, test jsonpath" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="JSONPath Tester | Toolisk" />
        <meta property="og:description" content="Test JSONPath expressions live against any JSON document." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🧭" title="JSONPath Tester" tagline="Query any JSON document with JSONPath expressions — results update live in your browser.">
        <JsonPathTester />
      </ToolShell>

      <ToolSEOContent
        description="A browser-based JSONPath evaluator that runs expressions against any JSON document and shows matching nodes in real time. Supports child access, recursive descent, array slices, index access, and filter expressions — the full everyday subset of JSONPath."
        features={[
          '🎯 Live results as you type the expression',
          '🔍 Recursive descent with the .. operator',
          '🔢 Array slicing [start:end] and index access',
          '🧮 Filter expressions [?(@.price < 20)]',
          '📚 Built-in cheatsheet and 8 preset expressions',
          '🛡️ 100% client-side — no data sent to a server',
        ]}
        steps={[
          { title: 'Paste your JSON', desc: 'Drop any JSON document into the left input, or click "Load sample" to use the built-in bookshop example.' },
          { title: 'Enter a JSONPath expression', desc: 'Type a path like $.store.books[*].title or click one of the preset examples to load it instantly.' },
          { title: 'See matching nodes', desc: 'Each matched value appears in a numbered result list on the right — copy individual results or the full array.' },
          { title: 'Refine with filters', desc: 'Use [?(@.key == value)] to filter arrays by field value. Try [?(@.inStock == true)] on the sample data.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">JSONPath in practice</h2>
            <p className="text-slate-600 leading-relaxed">
              JSONPath was designed to let you pinpoint values inside a JSON document without writing parsing code.
              It&apos;s particularly useful when working with large API responses, configuration files, or testing assertions.
              Tools like Postman, AWS CloudFormation, Kubernetes selectors, and Elasticsearch all use JSONPath or a very
              similar dialect.
            </p>
            <p className="text-slate-600 leading-relaxed">
              A concrete example: suppose an API returns a list of orders and you want to find the IDs of all unfulfilled
              orders over $50. The expression{' '}
              <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">$.orders[?(@.status == &quot;pending&quot;)].id</code>{' '}
              does that in one step — no loops, no temporary variables.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">The recursive descent operator</h3>
            <p className="text-slate-600 leading-relaxed">
              The <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">..</code> operator is the most powerful part of JSONPath. Instead of
              navigating a known structure, it searches the entire document tree for matching keys. This is invaluable when
              you&apos;re handed an undocumented payload and just want to find all <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">id</code> or{' '}
              <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">error</code> fields regardless of where they&apos;re nested.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">JSONPath vs JMESPath</h3>
            <p className="text-slate-600 leading-relaxed">
              JMESPath is an alternative query language used by AWS CLI and jq-like tools. It has a more consistent grammar
              and better-specified behaviour for edge cases. JSONPath is older and more widely adopted in non-AWS ecosystems.
              For most everyday queries — array traversal, field selection, basic filters — either language covers the same
              ground. If you need complex projections or multi-select lists, JMESPath has a cleaner syntax.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'JSON Viewer & Formatter', href: '/tools/json-viewer', icon: '🧩' },
          { name: 'JSON Diff', href: '/tools/json-diff', icon: '🔍' },
          { name: 'YAML / JSON Converter', href: '/tools/yaml-json-converter', icon: '🔀' },
        ]}
      />
    </>
  );
}
