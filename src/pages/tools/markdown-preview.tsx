import Head from 'next/head';
import MarkdownPreview from '../../components/Tools/MarkdownPreview';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/markdown-preview';

export default function MarkdownPreviewPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Markdown Preview',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Live markdown editor and renderer. Type markdown on the left, see HTML preview on the right. Copy rendered HTML or raw markdown.',
    url: `${SITE_URL}${SLUG}`,
    featureList: 'Live markdown rendering, Headings/lists/code/blockquotes, Inline formatting, HTML output, Side-by-side editor',
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Which markdown flavor is supported?', acceptedAnswer: { '@type': 'Answer', text: 'A common subset of CommonMark: headings, paragraphs, bold, italic, inline & fenced code, links, images, blockquotes, ordered/unordered lists, horizontal rules. GFM extras like tables, task lists, and footnotes are not parsed.' } },
      { '@type': 'Question', name: 'Why does my README look different on GitHub?', acceptedAnswer: { '@type': 'Answer', text: 'GitHub adds GFM (GitHub-Flavored Markdown) extensions plus its own CSS. Use this preview as a fast first pass — render the final on GitHub or your hosting platform if you depend on tables, alerts, or task lists.' } },
      { '@type': 'Question', name: 'Is the rendering safe?', acceptedAnswer: { '@type': 'Answer', text: 'The renderer escapes raw HTML, so pasting hostile markdown won\'t execute scripts. Links open in a new tab with rel=noopener noreferrer.' } },
    ],
  };

  return (
    <>
      <Head>
        <title>Markdown Preview — Live Editor &amp; Renderer | Toolisk</title>
        <meta name="description" content="Free online markdown editor with live preview. Type markdown, see formatted HTML side-by-side. Copy rendered HTML output. Headings, lists, code blocks, links." />
        <meta name="keywords" content="markdown preview, markdown editor, markdown renderer, online markdown, md to html, live markdown" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Markdown Preview | Toolisk" />
        <meta property="og:description" content="Live markdown editor and renderer — side-by-side." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="📑" title="Markdown Preview" tagline="Type markdown on the left, see formatted HTML on the right — instantly. Copy either the markdown or the rendered HTML.">
        <MarkdownPreview />
      </ToolShell>

      <ToolSEOContent
        description="A side-by-side markdown editor and live renderer. Useful for drafting README files, blog posts, GitHub issues, and any documentation written in markdown. The preview escapes embedded HTML so you can safely paste arbitrary content."
        features={[
          '⚡ Live preview as you type',
          '📝 Headings, lists, blockquotes, HRs',
          '💻 Inline & fenced code blocks',
          '🔗 Links open in new tabs (safely)',
          '📋 Copy markdown or rendered HTML',
          '🛡️ Raw HTML auto-escaped',
        ]}
        steps={[
          { title: 'Paste or type markdown', desc: 'Use the sample as a starting point if you want to see what works.' },
          { title: 'Watch the preview update', desc: 'Headings, code blocks, and lists render live on the right.' },
          { title: 'Iterate', desc: 'Tweak formatting until the preview matches your intent.' },
          { title: 'Copy the output', desc: 'Either the markdown source for posting on GitHub/Reddit, or the rendered HTML for emails and CMSes that don\'t support markdown.' },
        ]}
        faqs={faqSchema.mainEntity.map((f) => ({ q: f.name, a: f.acceptedAnswer.text }))}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Quick markdown reference</h2>
            <pre className="bg-slate-900 text-slate-100 rounded-xl p-5 overflow-x-auto text-xs font-mono">
{`# H1   ## H2   ### H3
**bold**   *italic*   \`inline code\`
[link text](https://example.com)
> blockquote
- bullet
1. numbered
\`\`\`lang
fenced code block
\`\`\`
---  (horizontal rule)`}
            </pre>
          </section>
        }
        relatedTools={[
          { name: 'HTML Entities', href: '/tools/html-entities', icon: '🏷️' },
          { name: 'Word Counter', href: '/tools/word-counter', icon: '✍️' },
          { name: 'Lorem Ipsum', href: '/tools/lorem-ipsum', icon: '📝' },
        ]}
        relatedArticles={[{ title: 'Markdown vs HTML — When to Use Each', href: '/tools/learn/markdown-vs-html' }]}
      />
    </>
  );
}
