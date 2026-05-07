import Link from 'next/link';
import type { BlogArticle } from '../types';

export const jsonEssentials: BlogArticle = {
  slug: 'json-essentials',
  category: 'Developer',
    title: 'JSON Essentials for Developers: Beyond Pretty-Printing',
    description:
      'Schemas, validation, common pitfalls, and the parser quirks every developer should know about JSON.',
    publishedDate: '2026-05-07',
    readTime: '9 min read',
    keywords: 'json, json schema, json validation, json parser, json pitfalls',
    relatedTools: [
      { name: 'JSON Viewer & Formatter', href: '/tools/json-viewer' },
      { name: 'Regex Tester', href: '/tools/regex-tester' },
    ],
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          JSON looks deceptively simple. Six data types, two structural constructs, no comments. But the moment you
          go beyond hello-world, you bump into edge cases that have been confusing developers for two decades.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">A 30-second refresher</h2>
        <p>
          JSON (JavaScript Object Notation) is a text format for structured data. It supports six types:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>String:</strong> double-quoted, with escapes for control characters and unicode</li>
          <li><strong>Number:</strong> integer or float, no leading zeros, no <code>NaN</code> or <code>Infinity</code></li>
          <li><strong>Boolean:</strong> <code>true</code> or <code>false</code></li>
          <li><strong>Null:</strong> <code>null</code></li>
          <li><strong>Array:</strong> ordered list, comma-separated</li>
          <li><strong>Object:</strong> string-keyed map, comma-separated</li>
        </ul>
        <p>
          That&apos;s it. No dates, no binary, no UUIDs as a native type — those are all encoded as strings or numbers
          by convention.
        </p>

        <div className="my-8 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Test JSON instantly:</strong> Paste any payload and see structure, errors, and stats:
          </p>
          <Link
            href="/tools/json-viewer"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Open JSON Viewer →
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Common pitfalls</h2>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">1. No trailing commas</h3>
        <p>
          JavaScript allows trailing commas in objects and arrays. JSON does not.
          <code>{`{"a": 1, "b": 2,}`}</code> is invalid JSON — most parsers will error on the trailing comma.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">2. Keys must be double-quoted strings</h3>
        <p>
          <code>{`{name: "Ada"}`}</code> is JavaScript, not JSON. Valid JSON requires{' '}
          <code>{`{"name": "Ada"}`}</code>. Single quotes are also forbidden — only double quotes.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">3. No comments</h3>
        <p>
          Standard JSON has no comments. If you need them, you&apos;re not using JSON — you&apos;re using JSON5,
          JSONC, or YAML. Many config files use these JSON-with-comments variants, but a strict <code>JSON.parse</code>{' '}
          will reject them.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">4. Numbers have surprises</h3>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>No <code>NaN</code>, <code>Infinity</code>, or <code>-Infinity</code> — these are not valid JSON.</li>
          <li>JavaScript parses all numbers as 64-bit floats, so integers larger than 2^53 lose precision.</li>
          <li>If you need bigger integers (big database IDs), encode them as strings.</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">5. Dates are strings</h3>
        <p>
          JSON has no native date type. Convention is to use ISO 8601 strings (<code>2026-05-07T08:30:00Z</code>).
          When parsing, you&apos;ll need to convert strings back to <code>Date</code> objects manually.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Schemas: validating shape</h2>
        <p>
          For any non-trivial JSON exchange, you should validate the structure. The de-facto standard is{' '}
          <strong>JSON Schema</strong> — a vocabulary for declaring expected shapes:
        </p>

        <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200">
          <pre className="text-sm font-mono overflow-x-auto">{`{
  "type": "object",
  "required": ["name", "age"],
  "properties": {
    "name": { "type": "string", "minLength": 1 },
    "age": { "type": "integer", "minimum": 0 },
    "email": { "type": "string", "format": "email" }
  }
}`}</pre>
        </div>

        <p>
          Libraries like Ajv (Node.js), jsonschema (Python), and json-schema (Java) validate any JSON value against a
          schema and produce detailed error reports. For TypeScript, libraries like Zod and io-ts give you both
          runtime validation and static types from a single declaration.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Streaming and large payloads</h2>
        <p>
          <code>JSON.parse</code> reads the entire string into memory. For very large payloads, this is a problem.
          Streaming parsers like <code>jsonstream</code> (Node.js) or <code>ijson</code> (Python) emit events as
          they walk the input, letting you process gigabyte-sized files without exhausting memory.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">JSON alternatives worth knowing</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>JSON5:</strong> JSON with comments, trailing commas, unquoted keys. Used in config files (Babel, ESLint).</li>
          <li><strong>YAML:</strong> human-friendly format with comments, multi-line strings, anchors. Used in DevOps (Kubernetes, GitHub Actions).</li>
          <li><strong>TOML:</strong> minimal config-file format used by Rust&apos;s Cargo and Python&apos;s pyproject.toml.</li>
          <li><strong>MessagePack / CBOR:</strong> binary formats with the same data model as JSON, but smaller and faster.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Pretty-print etiquette</h2>
        <p>
          Two-space indent is the de facto standard for JSON files in version control. Four spaces is acceptable but
          uses more disk and bandwidth. Minified JSON (no whitespace) is appropriate for HTTP responses where size
          matters.
        </p>
        <p>
          Object key order matters for some use cases (deterministic diffs, content addressing). Most parsers preserve
          insertion order, but the JSON spec doesn&apos;t require it. If you need stable order, sort keys explicitly
          before serializing.
        </p>
      </div>
    ),
};
