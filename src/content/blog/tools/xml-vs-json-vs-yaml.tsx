import type { BlogArticle } from '../types';
import { Lead, H2, H3, Comparison, Callout, KeyTakeaways } from '../components';

export const xmlVsJsonVsYaml: BlogArticle = {
  slug: 'xml-vs-json-vs-yaml',
  category: 'Data',
  title: 'XML vs JSON vs YAML: Which Data Format for Which Job',
  description:
    'Three data formats with overlapping use cases, very different strengths. Learn when to use each, the security gotchas, and the surprising places XML still wins.',
  publishedDate: '2026-05-08',
  readTime: '11 min read',
  keywords:
    'xml vs json, yaml vs json, data format, configuration format, xml security, yaml gotchas',
  relatedTools: [
    { name: 'JSON Viewer', href: '/tools/json-viewer' },
    { name: 'URL Encoder', href: '/tools/url-encoder' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Three data formats. Three communities that prefer their pick. The honest answer is that each fits
        different jobs — JSON for APIs, YAML for configs, XML for document-shaped data with strong schema
        needs. Mixing them up creates fragility, security risks, and developer pain.
      </Lead>

      <H2>The three formats at a glance</H2>

      <H3>JSON</H3>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`{
  "name": "Jane Doe",
  "age": 32,
  "skills": ["python", "rust"],
  "active": true
}`}</code></pre>

      <H3>YAML</H3>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`name: Jane Doe
age: 32
skills:
  - python
  - rust
active: true`}</code></pre>

      <H3>XML</H3>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`<person>
  <name>Jane Doe</name>
  <age>32</age>
  <skills>
    <skill>python</skill>
    <skill>rust</skill>
  </skills>
  <active>true</active>
</person>`}</code></pre>

      <H2>JSON: the API standard</H2>
      <p>
        JSON dominates web APIs because:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Native to JavaScript — no parsing library needed in browsers.</li>
        <li>Compact compared to XML, more verbose than binary formats but human-readable.</li>
        <li>Maps cleanly to most languages' basic data types.</li>
        <li>No comments, attributes, or namespaces — keeps it simple.</li>
      </ul>

      <H3>JSON's real weaknesses</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>No comments.</strong> Annoying for configuration files. Workarounds (JSON5, JSONC) exist but aren't universal.</li>
        <li><strong>Trailing commas not allowed.</strong> Diff-unfriendly when adding/removing items at the end of arrays.</li>
        <li><strong>No date type.</strong> Use ISO 8601 strings; some libraries auto-parse, most don't.</li>
        <li><strong>Number precision.</strong> JavaScript loses precision past 2^53. Big integers (account IDs, timestamps in microseconds) become approximate.</li>
        <li><strong>No schema in the data itself.</strong> JSON Schema exists but is external.</li>
      </ul>

      <H2>YAML: the configuration format</H2>
      <p>
        YAML is the choice for human-edited configuration:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Comments supported.</li>
        <li>Significantly less syntactic noise than JSON or XML.</li>
        <li>Reasonable for hand-editing complex nested structures.</li>
        <li>Multi-line strings have several syntaxes.</li>
        <li>Anchors and aliases enable reuse within a document.</li>
      </ul>

      <Callout title="The YAML gotchas list" accent="amber">
        YAML's flexibility is also its weakness. Famous traps include:
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>The Norway problem:</strong> <code>country: NO</code> parses as boolean false. Quote it.</li>
          <li><strong>Indentation matters and is fragile.</strong> Tabs vs spaces breaks parsing.</li>
          <li><strong>Implicit type conversion.</strong> "1.0" becomes float 1.0, "01" might become number 1 or string "01" depending on parser.</li>
          <li><strong>YAML 1.1 vs 1.2 differences.</strong> "y", "yes", "on" are booleans in 1.1 but strings in 1.2. Most parsers default to 1.1.</li>
        </ul>
      </Callout>

      <H3>YAML's real weaknesses</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Implicit typing surprises.</strong> Especially with country codes, version strings, and short numbers.</li>
        <li><strong>Indentation errors are subtle.</strong> A misaligned dash can produce structurally different data without an error.</li>
        <li><strong>Anchors and aliases can DoS parsers.</strong> The "billion laughs" attack is a thing.</li>
        <li><strong>Standards drift.</strong> YAML 1.1 vs 1.2 vs library-specific extensions all in the wild.</li>
        <li><strong>Slow to parse compared to JSON.</strong> 5–10x slower in most benchmarks.</li>
      </ul>

      <H2>XML: still alive in specific niches</H2>
      <p>
        XML lost the API war but won where it actually fits:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Document-shaped data.</strong> Office Open XML (.docx), SVG, RSS/Atom feeds, EPUB.</li>
        <li><strong>Strict schema validation.</strong> XML Schema (XSD) is more powerful than JSON Schema.</li>
        <li><strong>Industry standards.</strong> SOAP, SAML, HL7, financial messaging (FIX, SWIFT) all use XML.</li>
        <li><strong>Mixed content.</strong> Text with embedded markup (HTML-like) is XML's strength. JSON can't represent this naturally.</li>
        <li><strong>XSLT transformations.</strong> Powerful, declarative XML-to-XML or XML-to-HTML conversion.</li>
      </ul>

      <H3>XML's real weaknesses</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Verbosity.</strong> Tags duplicate as opening and closing.</li>
        <li><strong>Attributes vs elements debate.</strong> Same data can be expressed multiple ways.</li>
        <li><strong>Namespaces.</strong> Powerful but complex. Adding namespaces breaks naive parsers.</li>
        <li><strong>Security: XXE attacks.</strong> External entity expansion can read arbitrary files or DoS the server.</li>
        <li><strong>Heavyweight tooling.</strong> XPath, XSLT, XSD all add complexity beyond what JSON apps need.</li>
      </ul>

      <H2>Security comparisons</H2>

      <H3>JSON</H3>
      <p>
        Generally safe. Don't use <code>eval()</code> to parse it (always use <code>JSON.parse</code>). The
        old "JSONP" pattern is dangerous and obsolete.
      </p>

      <H3>YAML</H3>
      <p>
        <code>yaml.load</code> in PyYAML can execute arbitrary Python via <code>!!python/object</code> tags.
        Always use <code>yaml.safe_load</code> for untrusted input. Other languages have similar risks.
      </p>

      <H3>XML</H3>
      <p>
        XXE (XML External Entity) attacks: malicious XML can read local files (<code>/etc/passwd</code>) or
        cause DoS via billion-laughs expansion. Disable entity expansion in your parser unless you specifically
        need it.
      </p>

      <H2>The decision framework</H2>

      <Comparison
        leftTitle="Use JSON for"
        rightTitle="Use YAML for"
        left={
          <ul className="list-disc pl-5 space-y-2">
            <li>HTTP APIs</li>
            <li>JavaScript-heavy applications</li>
            <li>Simple data interchange</li>
            <li>Browser-side data</li>
            <li>Speed-critical parsing</li>
          </ul>
        }
        right={
          <ul className="list-disc pl-5 space-y-2">
            <li>Application configuration files</li>
            <li>CI/CD pipelines (GitHub Actions, GitLab)</li>
            <li>Kubernetes manifests, Docker Compose</li>
            <li>Hand-edited multi-environment configs</li>
            <li>Data with comments needed</li>
          </ul>
        }
      />

      <p>
        Use XML for: document-shaped data (where text and markup intermix), industries with mature XML
        standards, or when you need strict schema validation with XSD's power.
      </p>

      <H2>Conversions and tooling</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>JSON ↔ YAML:</strong> <code>jq</code>, <code>yq</code>, online converters. Conversion is mostly lossless (YAML can express everything JSON can).</li>
        <li><strong>JSON ↔ XML:</strong> not lossless. XML attributes vs elements creates ambiguity. Use <code>xq</code> (jq-like for XML).</li>
        <li><strong>YAML ↔ XML:</strong> rare but possible via JSON intermediate.</li>
      </ul>

      <H2>Newer alternatives worth knowing</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>TOML:</strong> simpler than YAML, supports comments, less ambiguity. Used by Cargo (Rust), pyproject.toml.</li>
        <li><strong>HCL (Hashicorp Config Language):</strong> Terraform configs. Mix of declarative and expressions.</li>
        <li><strong>JSON5 / JSONC:</strong> JSON with comments and trailing commas. Limited adoption but useful for configs.</li>
        <li><strong>Protocol Buffers / Avro / MessagePack:</strong> binary formats for high-throughput, schema-driven systems.</li>
      </ul>

      <H2>Common mistakes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Using YAML for APIs.</strong> Slow to parse, ambiguous typing, harder client tooling.</li>
        <li><strong>Using JSON for hand-editable config.</strong> No comments, no trailing commas, brittle for humans.</li>
        <li><strong>Using XML for new APIs.</strong> Verbose, heavyweight, and most clients prefer JSON.</li>
        <li><strong>Trusting YAML's implicit typing.</strong> Quote anything that could ambiguously be a number, boolean, or null.</li>
        <li><strong>Allowing XML external entities by default.</strong> Disable XXE unless explicitly needed.</li>
      </ul>

      <KeyTakeaways
        items={[
          'JSON for APIs (fast, native, simple). YAML for configs (comments, less syntax). XML for documents (mixed content, schema validation).',
          'YAML\'s implicit typing creates traps: NO becomes false, "01" might become 1. Quote ambiguous values.',
          'Security matters: PyYAML\'s yaml.load is unsafe (use safe_load); XML XXE attacks are real (disable entities).',
          'JSON has no comments, no trailing commas, no big-int precision. Workarounds (JSON5, JSONC) help for configs.',
          'XML still wins for document-shaped data, mixed content, and industries with XML-based standards.',
        ]}
      />
    </div>
  ),
};
