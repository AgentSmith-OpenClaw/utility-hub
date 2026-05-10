import Head from 'next/head';
import JsonCsvConverter from '../../components/Tools/JsonCsvConverter';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/json-csv';

const FAQS = [
  { q: 'What kind of JSON can be converted to CSV?', a: 'The converter expects a JSON array of objects where each object has the same keys (columns). Nested objects are serialized as JSON strings in the CSV cell. A plain JSON object (not an array) is also supported and will produce a single-row CSV.' },
  { q: 'Can I change the delimiter?', a: 'Yes. Choose from comma (,), semicolon (;), tab (\\t), or pipe (|). Semicolons are common in European locales where commas are used as decimal separators. Tabs produce TSV (tab-separated values) files.' },
  { q: 'What happens if CSV values contain commas?', a: 'The converter wraps fields in double quotes automatically when they contain the delimiter, double quotes, or newlines. Double quotes within a value are escaped as two double quotes — following the CSV RFC 4180 standard.' },
  { q: 'Can I open the CSV in Excel?', a: 'Yes. Download the CSV file and open it in Excel, Google Sheets, or any spreadsheet app. For European locales, use the semicolon delimiter to avoid comma/decimal conflicts.' },
  { q: 'What does the CSV → JSON conversion produce?', a: 'CSV to JSON produces an array of objects where each header column becomes a key and each row becomes one object. All values are strings — type casting (numbers, booleans) is not applied since CSV has no type information.' },
];

export default function JsonCsvPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'JSON to CSV Converter',
    slug: SLUG,
    description: 'Convert JSON arrays to CSV and CSV back to JSON. Choose delimiter, download the result, and handle quoted fields correctly.',
    featureList: 'JSON to CSV, CSV to JSON, Comma/semicolon/tab/pipe delimiters, Download, RFC 4180 quoting',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>JSON to CSV Converter (and back) — Free Online Tool | Toolisk</title>
        <meta name="description" content="Convert JSON arrays to CSV or CSV back to JSON. Choose delimiter, handle quoted fields, and download the result. Free, browser-based, no upload." />
        <meta name="keywords" content="json to csv, csv to json, json csv converter, convert json to excel, csv json online, json array to csv, tsv converter" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="JSON to CSV Converter | Toolisk" />
        <meta property="og:description" content="Convert JSON arrays to CSV and back. Choose delimiter, download the result." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="📊" title="JSON ↔ CSV Converter" tagline="Convert JSON arrays to CSV — or CSV back to JSON. Choose delimiter, view row count, and download the result.">
        <JsonCsvConverter />
      </ToolShell>

      <ToolSEOContent
        description="A bidirectional JSON and CSV converter. Paste a JSON array of objects to get a properly formatted CSV with quoted fields, or paste CSV data to get a JSON array. Choose between comma, semicolon, tab, and pipe delimiters. Download the output as a file or copy it to clipboard."
        features={[
          '↔️ Convert in either direction',
          '⚙️ Comma, semicolon, tab, and pipe delimiters',
          '📜 RFC 4180-compliant quoting',
          '⬇️ Download result as .csv or .json',
          '📊 Row count shown in output title',
          '🔒 100% browser-based — no upload',
        ]}
        steps={[
          { title: 'Choose a direction', desc: 'JSON → CSV or CSV → JSON.' },
          { title: 'Pick a delimiter', desc: 'Comma for standard CSV, semicolon for European locales, tab for TSV.' },
          { title: 'Paste your data', desc: 'The conversion happens instantly as you type.' },
          { title: 'Download or copy', desc: 'Use the Download button for a file, or Copy to paste into another app.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">When to convert between JSON and CSV</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>API to spreadsheet:</strong> convert a REST API JSON response to CSV for Excel or Google Sheets analysis</li>
              <li><strong>Data import:</strong> convert a CSV export from a database or BI tool into JSON for use in a web app</li>
              <li><strong>Report generation:</strong> flatten a JSON array into rows for a business report</li>
              <li><strong>Seed data:</strong> prepare fixture data as CSV and convert to JSON for a test database</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'JSON Viewer & Formatter', href: '/tools/json-viewer', icon: '🧩' },
          { name: 'YAML / JSON Converter', href: '/tools/yaml-json-converter', icon: '🔄' },
          { name: 'XML Formatter', href: '/tools/xml-formatter', icon: '📋' },
        ]}
      />
    </>
  );
}
