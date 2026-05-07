import Head from 'next/head';
import JsonViewer from '../../components/Tools/JsonViewer';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

export default function JsonViewerPage() {
  const breadcrumbSchema = generateBreadcrumbs('/tools/json-viewer');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is this JSON viewer safe for sensitive data?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The JSON viewer runs entirely in your browser using JSON.parse and JSON.stringify. Your input is never uploaded to a server, so it is safe to paste API responses, configuration files, or other sensitive payloads.',
        },
      },
      {
        '@type': 'Question',
        name: "What's the difference between Pretty, Minify, and Tree?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pretty formats your JSON with indentation for readability. Minify strips all whitespace to produce the smallest possible output. Tree shows a collapsible, syntax-highlighted view that is ideal for exploring deeply nested structures.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I find a syntax error?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "When the input is invalid, the tool shows the error message along with the line and column where the parser stopped. Common issues are trailing commas, unquoted keys, single quotes instead of double quotes, and missing closing brackets.",
        },
      },
    ],
  };

  return (
    <>
      <Head>
        <title>JSON Viewer & Formatter — Pretty Print, Minify, Validate | Toolisk</title>
        <meta
          name="description"
          content="Free online JSON viewer, formatter, and validator. Pretty print, minify, or explore JSON in a collapsible tree view. Runs entirely in your browser."
        />
        <meta
          name="keywords"
          content="JSON formatter, JSON viewer, JSON validator, pretty print JSON, minify JSON, JSON tree viewer"
        />
        <link rel="canonical" href={`${SITE_URL}/tools/json-viewer`} />
        <meta property="og:title" content="JSON Viewer & Formatter | Toolisk" />
        <meta property="og:description" content="Format, validate, minify, or explore JSON in a collapsible tree." />
        <meta property="og:url" content={`${SITE_URL}/tools/json-viewer`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="🧩"
        title="JSON Viewer & Formatter"
        tagline="Format, validate, minify, or explore JSON with a collapsible tree view — entirely in your browser."
      >
        <JsonViewer />
      </ToolShell>

      <ToolSEOContent
        description="A free, browser-based JSON viewer with pretty printing, minification, and a collapsible tree view. Catch syntax errors with line and column hints, see object depth and key counts at a glance, and copy clean output back to your clipboard with one click."
        features={[
          '🌳 Collapsible tree view with syntax highlighting',
          '✨ Pretty print with 2 or 4 space indent',
          '📦 Minify to remove all whitespace',
          '🚨 Inline error messages with line and column',
          '📊 Stats: byte size, key count, max depth',
          '🛡️ All processing is client-side and private',
        ]}
        steps={[
          {
            title: 'Paste your JSON',
            desc: 'Copy any JSON string — an API response, config file, or log line — and paste it into the input box.',
          },
          {
            title: 'Pick a view mode',
            desc: 'Pretty for human-readable formatted output, Minify to compress, or Tree to explore nested structures with collapsible nodes.',
          },
          {
            title: 'Watch for errors',
            desc: 'A red status badge appears if the input is invalid, with the line and column where the parser failed.',
          },
          {
            title: 'Copy the result',
            desc: 'Use the Copy button to put the cleaned-up JSON on your clipboard.',
          },
        ]}
        faqs={[
          {
            q: 'Is this JSON viewer safe for sensitive data?',
            a: 'Yes. The viewer uses your browser\'s built-in JSON.parse and JSON.stringify. Nothing is uploaded — you can paste API tokens, configuration secrets, or any other sensitive payload safely.',
          },
          {
            q: "What's the difference between Pretty, Minify, and Tree?",
            a: 'Pretty formats your JSON with indentation for readability. Minify strips all whitespace to produce the smallest possible output. Tree shows a collapsible, syntax-highlighted view that is ideal for exploring deeply nested structures.',
          },
          {
            q: 'How do I find a syntax error?',
            a: 'When the input is invalid, the tool shows the parser error along with the line and column where it stopped. The most common issues are trailing commas, unquoted keys, single quotes instead of double quotes, and missing closing brackets.',
          },
          {
            q: 'Can I edit JSON in the tree view?',
            a: 'The tree view is read-only — it is for exploration. To edit, modify the input box on the left and the tree updates in real time.',
          },
          {
            q: 'How big a JSON file can I paste?',
            a: 'There is no hard limit, but very large JSON (multi-megabyte) may slow your browser when rendering the tree view. For huge payloads, switch to Pretty or Minify mode for faster rendering.',
          },
        ]}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why a good JSON viewer matters</h2>
            <p className="text-slate-600 leading-relaxed">
              JSON is the lingua franca of modern APIs. When you&apos;re debugging a webhook, exploring a third-party
              response, or comparing two configs, a flat blob of text isn&apos;t enough. You need to <em>see the structure</em> —
              which keys are nested where, how many items are in an array, where the unexpected null came from.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The tree view above lets you collapse uninteresting branches and zoom in on the part of the payload you
              care about. Strings are green, numbers blue, booleans purple, and nulls gray — so types are obvious at a
              glance.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Common JSON pitfalls</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Trailing commas:</strong> JSON does not allow them, even though JavaScript does.</li>
              <li><strong>Single quotes:</strong> JSON requires double quotes around strings and keys.</li>
              <li><strong>Unquoted keys:</strong> <code className="text-xs bg-slate-100 px-1 rounded">{'{name: "Ada"}'}</code> is invalid; <code className="text-xs bg-slate-100 px-1 rounded">{'{"name": "Ada"}'}</code> is valid.</li>
              <li><strong>Comments:</strong> Standard JSON has no comments. If you need them, look at JSON5 or YAML.</li>
              <li><strong>NaN and Infinity:</strong> Not valid JSON values.</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'URL Encoder / Decoder', href: '/tools/url-encoder', icon: '🔗' },
          { name: 'Base64 Encoder / Decoder', href: '/tools/base64', icon: '🔐' },
          { name: 'Regex Tester', href: '/tools/regex-tester', icon: '🧪' },
        ]}
        relatedArticles={[
          { title: 'JSON Essentials for Developers', href: '/tools/learn/json-essentials' },
          { title: 'Regex Cheatsheet & Common Patterns', href: '/tools/learn/regex-cheatsheet' },
        ]}
      />
    </>
  );
}
