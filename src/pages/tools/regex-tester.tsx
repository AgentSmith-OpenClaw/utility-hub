import Head from 'next/head';
import RegexTester from '../../components/Tools/RegexTester';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const FAQS = [
  { q: 'What regex flavor does this support?', a: "JavaScript regex (ECMAScript). Most regex syntax is portable across languages, but a few features differ — for example, JavaScript named groups use (?<name>...), while some other languages use (?P<name>...)." },
  { q: 'Why isn\'t my pattern matching?', a: 'Common reasons: the pattern is case-sensitive but your text is mixed case (add the i flag), or the pattern matches across lines but you forgot the m flag, or you have unescaped special characters.' },
  { q: 'How do capture groups work?', a: 'Parentheses ( ) create a capture group. The matched text inside is captured separately and can be referenced in the replacement as $1, $2, etc.' },
  { q: 'Should I use regex to parse HTML?', a: 'No. HTML has nested structures and edge cases that regex cannot reliably handle. Use a real HTML parser like DOMParser in browsers, BeautifulSoup in Python, or jsdom in Node.' },
  { q: "What's the difference between greedy and lazy matching?", a: "By default, quantifiers like * and + are greedy — they match as much as possible. Adding ? after them (*? or +?) makes them lazy — they match as little as possible." },
];

export default function RegexTesterPage() {
  const breadcrumbSchema = generateBreadcrumbs('/tools/regex-tester');
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Regex Tester',
    slug: '/tools/regex-tester',
    description: 'Test JavaScript regular expressions live with match highlighting, capture groups, flags and replace mode.',
    featureList: 'Live match highlighting, Capture groups, All ECMAScript flags, Replace mode, Preset patterns, Cheatsheet',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Regex Tester — Live JavaScript Regex Testing | Toolisk</title>
        <meta
          name="description"
          content="Test regular expressions live with match highlighting, capture groups, and flag support. Includes ready-made presets and a quick reference cheatsheet."
        />
        <meta
          name="keywords"
          content="regex tester, javascript regex, regular expression tester, regex match highlighter, regex cheatsheet, regex replace"
        />
        <link rel="canonical" href={`${SITE_URL}/tools/regex-tester`} />
        <meta property="og:title" content="Regex Tester | Toolisk" />
        <meta property="og:description" content="Test regular expressions with live match highlighting and presets." />
        <meta property="og:url" content={`${SITE_URL}/tools/regex-tester`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="🧪"
        title="Regex Tester"
        tagline="Build and test regular expressions live with match highlighting, capture groups, and replace mode."
      >
        <RegexTester />
      </ToolShell>

      <ToolSEOContent
        description="A fast, browser-based JavaScript regex tester. Type a pattern and see live match highlighting on your test text. Toggle flags, run replace operations, and explore preset patterns for email, URL, phone number, and IP address validation."
        features={[
          '🎯 Live match highlighting as you type',
          '🚩 Toggle all common flags (g, i, m, s, u, y)',
          '🔄 Replace mode with capture group support ($1, $2, …)',
          '⚡ Preset patterns for email, URL, phone, IP, hex',
          '📚 Built-in regex cheatsheet',
          '🛡️ Runs locally — no patterns logged',
        ]}
        steps={[
          { title: 'Enter your pattern', desc: "Type a regex pattern. Use the flag input on the right to toggle global, case-insensitive, multiline, etc." },
          { title: 'Paste test text', desc: 'Drop in the text you want to match against. Matches are highlighted instantly.' },
          { title: 'Use a preset', desc: 'For common patterns like email or URL validation, click a preset to load a battle-tested regex.' },
          { title: 'Try replace', desc: 'Switch to Replace mode to see how the pattern would substitute matches in your text.' },
        ]}
        faqs={[
          {
            q: 'What regex flavor does this support?',
            a: "JavaScript regex (ECMAScript). Most regex syntax is portable across languages, but a few features differ — for example, JavaScript named groups use (?<name>...), while some other languages use (?P<name>...).",
          },
          {
            q: 'Why isn\'t my pattern matching?',
            a: 'Common reasons: the pattern is case-sensitive but your text is mixed case (add the i flag), or the pattern matches across lines but you forgot the m flag, or you have unescaped special characters (escape with \\).',
          },
          {
            q: 'How do capture groups work?',
            a: 'Parentheses ( ) create a capture group. The matched text inside is captured separately and can be referenced in the replacement as $1, $2, etc. For named groups, use (?<name>pattern) and reference as $<name> in JavaScript replace.',
          },
          {
            q: 'Should I use regex to parse HTML?',
            a: 'No. HTML has nested structures and edge cases that regex cannot reliably handle. Use a real HTML parser like DOMParser in browsers, BeautifulSoup in Python, or jsdom in Node.',
          },
          {
            q: "What's the difference between greedy and lazy matching?",
            a: "By default, quantifiers like * and + are greedy — they match as much as possible. Adding ? after them (*? or +?) makes them lazy — they match as little as possible. Lazy matching is essential for things like extracting content between two delimiters.",
          },
        ]}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">A practical mental model for regex</h2>
            <p className="text-slate-600 leading-relaxed">
              Think of a regex as a tiny program that walks through text looking for patterns. Each character in the
              pattern either matches itself literally (most letters and digits) or has a special meaning (the
              metacharacters). The engine tries to match starting from each position, backtracking when needed.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The hardest part of regex isn&apos;t the syntax — it&apos;s knowing when to stop. A pattern that matches
              80% of cases on Stack Overflow probably still misses 20%. Validating email addresses with regex is a
              famous example: the official RFC 5322 regex is over 6,000 characters long. For most use cases, a
              &ldquo;good enough&rdquo; pattern that matches typical formats is the right answer.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">When NOT to use regex</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li>Parsing HTML, XML, or JSON — use a real parser.</li>
              <li>Validating email addresses strictly to spec — accept the 80% solution and verify by sending an actual email.</li>
              <li>Date and number parsing where format varies — use a date library or numeric parser.</li>
              <li>Anything that needs to handle nested structures — regex cannot do recursion in JavaScript.</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Word Counter', href: '/tools/word-counter', icon: '✍️' },
          { name: 'JSON Viewer & Formatter', href: '/tools/json-viewer', icon: '🧩' },
          { name: 'Case Converter', href: '/tools/case-converter', icon: '🔤' },
        ]}
        relatedArticles={[
          { title: 'Regex Cheatsheet & Common Patterns', href: '/tools/learn/regex-cheatsheet' },
        ]}
      />
    </>
  );
}
