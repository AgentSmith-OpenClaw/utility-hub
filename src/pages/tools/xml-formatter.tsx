import Head from 'next/head';
import XmlFormatter from '../../components/Tools/XmlFormatter';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/xml-formatter';

const FAQS = [
  { q: 'What does XML formatting do?', a: 'XML formatting (pretty-printing) adds indentation and line breaks to make compressed or one-line XML readable. It does not change the data, only the whitespace — so the formatted output is semantically identical to the input.' },
  { q: 'How is XML different from HTML?', a: 'Both use tags, but XML is strict: all tags must be closed, attributes must be quoted, and the structure must be well-formed with a single root element. HTML is more forgiving. XML is used for data interchange; HTML is for web rendering.' },
  { q: 'What does XML validation check?', a: 'The validator checks that the XML is "well-formed" — meaning proper nesting, closed tags, quoted attributes, and a single root element. It does not validate against an XML Schema (XSD) or DTD, which would require a server-side tool.' },
  { q: 'What is XML minification used for?', a: 'Minifying XML removes all unnecessary whitespace to reduce file size. Useful for APIs and config files where bandwidth or storage matters and human readability is secondary.' },
  { q: 'Are XML namespaces supported?', a: 'The formatter handles standard XML including namespace declarations (xmlns attributes). It does not resolve or validate namespace URIs — it treats them as regular attributes.' },
];

export default function XmlFormatterPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'XML Formatter & Validator',
    slug: SLUG,
    description: 'Format, minify, and validate XML. Pretty-print with 2 or 4-space indentation, minify to one line, or check if XML is well-formed.',
    featureList: 'Format XML, Minify XML, Validate XML, 2 or 4-space indent, Browser-based',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>XML Formatter & Validator — Pretty Print & Minify XML | Toolisk</title>
        <meta name="description" content="Format, minify, and validate XML in your browser. Pretty-print with custom indentation, minify to a single line, or check if XML is well-formed. Free and instant." />
        <meta name="keywords" content="xml formatter, xml beautifier, xml minifier, xml validator, pretty print xml, xml parser online, format xml, xml online tool" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="XML Formatter & Validator | Toolisk" />
        <meta property="og:description" content="Format, minify, and validate XML in your browser. Pretty-print or minify to one line." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="📋" title="XML Formatter & Validator" tagline="Pretty-print, minify, or validate XML — with clear error messages and one-click copy.">
        <XmlFormatter />
      </ToolShell>

      <ToolSEOContent
        description="A browser-based XML formatter, minifier, and validator. Paste any XML to instantly pretty-print it with configurable indentation (2 or 4 spaces), compress it to a single line, or check if it is well-formed. Error messages identify problems like unclosed tags, unquoted attributes, and missing root elements."
        features={[
          '📐 Pretty-print with 2 or 4-space indent',
          '🗜️ Minify to a single line',
          '✅ Well-formedness validation',
          '🚨 Clear error messages with problem details',
          '📋 Copy formatted output with one click',
          '🔒 100% browser-based using DOMParser',
        ]}
        steps={[
          { title: 'Paste your XML', desc: 'Drop in raw, compressed, or formatted XML.' },
          { title: 'Choose a mode', desc: 'Format (pretty-print), Minify (compress), or Validate (check structure).' },
          { title: 'Fix any errors', desc: 'If the XML is invalid, an error message explains exactly what is wrong.' },
          { title: 'Copy the result', desc: 'Use the copy button to grab the formatted or minified output.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Common XML use cases</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Configuration files:</strong> Maven POM files, Ant build scripts, Spring XML config</li>
              <li><strong>Data interchange:</strong> SOAP web services, RSS/Atom feeds, office formats (DOCX, XLSX)</li>
              <li><strong>Android resources:</strong> Layout files, string resources, AndroidManifest.xml</li>
              <li><strong>SVG images:</strong> Scalable Vector Graphics are XML under the hood</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'JSON Viewer & Formatter', href: '/tools/json-viewer', icon: '🧩' },
          { name: 'YAML / JSON Converter', href: '/tools/yaml-json-converter', icon: '🔄' },
          { name: 'SQL Formatter', href: '/tools/sql-formatter', icon: '🗃️' },
        ]}
      />
    </>
  );
}
