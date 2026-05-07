import type { BlogArticle } from '../types';
import { Lead, H2, H3, Comparison, Callout, KeyTakeaways } from '../components';

export const markdownVsHtml: BlogArticle = {
  slug: 'markdown-vs-html',
  category: 'Web',
  title: 'Markdown vs HTML: When to Choose Each (and How to Mix Them Safely)',
  description:
    'Markdown is fast and writeable. HTML is precise and powerful. Learn the tradeoffs, the security implications of mixing them, and the surprising places Markdown wins for content workflows.',
  publishedDate: '2026-05-08',
  readTime: '10 min read',
  keywords:
    'markdown, html, commonmark, gfm, content workflow, mdx, markdown to html, markdown sanitization',
  relatedTools: [
    { name: 'JSON Viewer', href: '/tools/json-viewer' },
    { name: 'Word Counter', href: '/tools/word-counter' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Markdown is everywhere — README files, blog posts, chat messages, documentation sites. But it has
        limits, security pitfalls, and a half-dozen incompatible flavors. Knowing when to use Markdown vs HTML
        directly — and when to safely combine them — saves a lot of debugging.
      </Lead>

      <H2>The two formats compared</H2>

      <Comparison
        leftTitle="Markdown"
        rightTitle="HTML"
        left={
          <ul className="list-disc pl-5 space-y-2">
            <li>Plain text with light syntax</li>
            <li>Easy to write and read</li>
            <li>Limited control over formatting</li>
            <li>Multiple incompatible flavors</li>
            <li>Renders to HTML at display time</li>
            <li>Great for content writers</li>
          </ul>
        }
        right={
          <ul className="list-disc pl-5 space-y-2">
            <li>Tag-based markup</li>
            <li>Verbose for simple content</li>
            <li>Total control over structure and styling</li>
            <li>Single specification (HTML5 + WHATWG)</li>
            <li>Renders directly</li>
            <li>Great for application UI</li>
          </ul>
        }
      />

      <H2>The Markdown flavors problem</H2>
      <p>
        "Markdown" isn't one thing. There are several incompatible dialects:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Original Markdown (Gruber, 2004):</strong> the canonical syntax, but with under-specified edge cases.</li>
        <li><strong>CommonMark:</strong> a strict, well-specified standard. Used by Reddit, Stack Overflow, Discourse.</li>
        <li><strong>GitHub Flavored Markdown (GFM):</strong> CommonMark + tables, strikethrough, task lists, autolinking. Most popular flavor.</li>
        <li><strong>MultiMarkdown:</strong> adds footnotes, tables, citations, math.</li>
        <li><strong>MDX:</strong> Markdown + JSX components. React/Next.js documentation.</li>
        <li><strong>Pandoc Markdown:</strong> the most extensive, used in academic publishing.</li>
      </ul>
      <p>
        A document written for GitHub may render incorrectly in a CommonMark-only parser. Always specify which
        flavor your tooling expects.
      </p>

      <H2>When Markdown wins</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Documentation.</strong> READMEs, API docs, knowledge bases. Plain text under version control, diffable, reviewable.</li>
        <li><strong>Long-form content.</strong> Blog posts, newsletters, articles. Writers focus on words, not tags.</li>
        <li><strong>Chat and forums.</strong> Discord, Slack, Reddit, Stack Overflow. Quick formatting without escaping HTML.</li>
        <li><strong>Static site generators.</strong> Jekyll, Hugo, Gatsby, Next.js with MDX. Content-as-files workflows.</li>
        <li><strong>User-generated content with limited markup needs.</strong> Comments, posts. Easier to write than HTML.</li>
      </ul>

      <H2>When HTML wins</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Application UI.</strong> Component-based interfaces with state, events, styles.</li>
        <li><strong>Interactive forms and inputs.</strong> Markdown can't express form structure.</li>
        <li><strong>Email templates.</strong> Email clients render HTML; Markdown isn't supported.</li>
        <li><strong>Highly styled marketing pages.</strong> Custom layouts, animations, responsive design.</li>
        <li><strong>Accessibility-critical components.</strong> Markdown abstracts away ARIA attributes; complex widgets need direct HTML.</li>
      </ul>

      <H2>Mixing them safely</H2>
      <p>
        Most Markdown parsers allow inline HTML. This is powerful and dangerous:
      </p>

      <H3>The XSS risk</H3>
      <p>
        If your Markdown comes from untrusted users (comments, public-facing forms), allowing HTML means
        allowing <code>&lt;script&gt;</code> tags, <code>onclick</code> attributes, and other XSS vectors.
        Default behavior of most parsers is permissive — you must explicitly sanitize.
      </p>
      <p>
        Common sanitization libraries:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>DOMPurify (JavaScript):</strong> the gold standard. Hardened against XSS.</li>
        <li><strong>Bleach (Python):</strong> well-tested whitelist-based sanitizer.</li>
        <li><strong>Sanitize-html (JavaScript):</strong> simpler than DOMPurify, allowlist-based.</li>
      </ul>

      <Callout title="Always sanitize before rendering" accent="rose">
        Even if your Markdown parser claims it sanitizes, run output through a dedicated sanitizer when content
        comes from untrusted sources. Markdown parsers are content tools; sanitizers are security tools.
      </Callout>

      <H3>The MDX approach</H3>
      <p>
        MDX (Markdown + JSX) lets you embed React components in Markdown:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`# My Article

Some Markdown text here.

<MyChart data={chartData} />

More Markdown after the component.`}</code></pre>

      <p>
        Powerful for documentation sites where you need interactive examples. But MDX can't come from
        untrusted users — executing arbitrary JSX is by definition unsafe.
      </p>

      <H2>Performance considerations</H2>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Parsing cost:</strong> Markdown-to-HTML is fast (microseconds for typical articles), but not free. Cache rendered output for static content.</li>
        <li><strong>Bundle size:</strong> Markdown parsers vary widely — <code>marked</code> is ~30KB, <code>remark</code> is ~150KB+. Choose based on features needed.</li>
        <li><strong>Rendering cost:</strong> Server-side rendering Markdown is more efficient than client-side for SEO and time-to-first-paint.</li>
      </ul>

      <H2>Headings, IDs, and TOC generation</H2>
      <p>
        Standard Markdown doesn't generate heading IDs. Most extended flavors do. Slugs are generated by
        lowercasing the heading and replacing non-alphanumerics with hyphens:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>"Hello World" → <code>#hello-world</code></li>
        <li>"Q&amp;A: What's next?" → <code>#qa-whats-next</code> (most parsers strip apostrophes and ampersands)</li>
      </ul>
      <p>
        For docs sites, having stable heading IDs is critical for permalinks. Test what your parser generates
        and avoid changing heading text once published.
      </p>

      <H2>Markdown for content management</H2>
      <p>
        The case for Markdown-driven content (Jekyll, Hugo, Gatsby, etc.):
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Version control native.</strong> Your content lives in Git. Diffs are readable. Branches and PRs work for content too.</li>
        <li><strong>No vendor lock-in.</strong> Plain-text content moves to any future system.</li>
        <li><strong>Editor flexibility.</strong> VS Code, Obsidian, iA Writer, plain Notepad — all work.</li>
        <li><strong>Build-time optimization.</strong> Static HTML output is fast and CDN-friendly.</li>
      </ul>
      <p>
        The case for HTML-driven CMS (WordPress, Webflow, custom):
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Non-technical authors prefer WYSIWYG editors.</li>
        <li>Real-time collaboration is harder with file-based Markdown.</li>
        <li>Image and asset management is more integrated.</li>
      </ul>

      <H2>Tables: the Markdown weak spot</H2>
      <p>
        GFM tables are limited:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>No row spanning, no column spanning.</li>
        <li>No nested formatting in cells beyond inline elements.</li>
        <li>Awkward to read in source for tables wider than ~5 columns.</li>
        <li>No real way to set widths or alignment beyond left/center/right.</li>
      </ul>
      <p>
        For complex tables, drop into HTML directly within Markdown — most parsers will pass it through. For
        data-heavy tables, consider rendering from a data file (CSV, JSON) at build time.
      </p>

      <H2>Common mistakes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Trusting Markdown parsers for security.</strong> They're content tools, not sanitizers.</li>
        <li><strong>Tabs vs spaces in code blocks.</strong> Inconsistent indentation breaks the parsing.</li>
        <li><strong>Heading levels skipping.</strong> Going H1 → H3 confuses screen readers and SEO.</li>
        <li><strong>HTML inside lists not rendering Markdown inside.</strong> Most parsers stop interpreting Markdown once they see HTML — the "loose" vs "tight" list rule.</li>
        <li><strong>URLs with parentheses.</strong> <code>[link](https://example.com/path(123))</code> breaks. Encode parentheses or use angle brackets.</li>
      </ul>

      <KeyTakeaways
        items={[
          'Markdown for content writing; HTML for application UI. Each plays to different strengths.',
          'There are at least 6 incompatible Markdown flavors. CommonMark + GFM cover most modern usage.',
          'Always sanitize Markdown output before rendering when content comes from untrusted users — XSS is real.',
          'MDX (Markdown + JSX) is great for docs but unsafe for user content because it executes code.',
          'Tables, alignment, and complex layouts are Markdown\'s weak spots; drop into HTML when needed.',
        ]}
      />
    </div>
  ),
};
