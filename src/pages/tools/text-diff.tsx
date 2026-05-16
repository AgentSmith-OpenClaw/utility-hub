import Head from 'next/head';
import TextDiff from '../../components/Tools/TextDiff';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/text-diff';

export default function TextDiffPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Text Diff Checker',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Compare two pieces of text and see line-by-line differences. Ignore case and whitespace options. Side-by-side and unified views.',
    url: `${SITE_URL}${SLUG}`,
    featureList: 'Line-level diff, LCS algorithm, Ignore case/whitespace, Add/remove/unchanged stats, Unified diff output',
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'How does this differ from git diff?', acceptedAnswer: { '@type': 'Answer', text: 'Same algorithm (longest common subsequence) — different surface. This tool is for one-off comparisons of text you don\'t have in a repo: pasted JSON, log lines, configs, contract paragraphs. For tracked code, git diff is faster.' } },
      { '@type': 'Question', name: 'Why doesn\'t the tool show character-level diffs?', acceptedAnswer: { '@type': 'Answer', text: 'Line-level diff is the most useful for most cases. For character-level changes inside a long line, split the line first or use a dedicated word-diff tool.' } },
      { '@type': 'Question', name: 'Is my pasted text sent anywhere?', acceptedAnswer: { '@type': 'Answer', text: 'No. The diff runs entirely in your browser. You can compare proprietary documents, internal configs, or sensitive logs without exposure.' } },
    ],
  };

  return (
    <>
      <Head>
        <title>Text Diff Checker — Compare Two Texts Line by Line | Toolisk</title>
        <meta name="description" content="Free online text diff tool. Compare two pieces of text or code, side by side. Highlights added, removed, and unchanged lines. Ignore case or whitespace options." />
        <meta name="keywords" content="text diff, diff checker, compare text, text comparison, text difference, online diff tool, file compare" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Text Diff Checker | Toolisk" />
        <meta property="og:description" content="Compare two texts line by line — added, removed, unchanged." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🔍" title="Text Diff Checker" tagline="Compare two pieces of text line by line. See exactly what was added, removed, or unchanged.">
        <TextDiff />
      </ToolShell>

      <ToolSEOContent
        description="A privacy-first text diff tool that uses the same longest-common-subsequence algorithm as git. Paste two versions of any text — code, JSON, config, contract — and see line-level adds, removes, and unchanged context. Ignore case or whitespace toggles handle minor formatting noise."
        features={[
          '🟢 Added lines highlighted',
          '🔴 Removed lines highlighted',
          '⚪ Unchanged lines preserved as context',
          '🔠 Ignore case option',
          '⬜ Ignore whitespace option',
          '🔢 Add/remove/unchanged stats',
        ]}
        steps={[
          { title: 'Paste your two versions', desc: 'Original on the left, modified on the right.' },
          { title: 'Choose ignore options', desc: 'Ignore case if you want to skip casing-only changes. Ignore whitespace for trim/format-only diffs.' },
          { title: 'Read the diff', desc: 'Green = added, red = removed, neutral = unchanged. Line numbers on each side.' },
          { title: 'Copy unified diff', desc: 'Standard +/− format suitable for pasting into PRs, tickets, or chat.' },
        ]}
        faqs={faqSchema.mainEntity.map((f) => ({ q: f.name, a: f.acceptedAnswer.text }))}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Common ways to use a text diff</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Compare two API responses to find what changed.</li>
              <li>Spot the single broken setting between a working and broken config file.</li>
              <li>Review a contract revision sent back from legal.</li>
              <li>Validate that copy-pasting between editors didn&apos;t mangle line endings or quotes.</li>
              <li>Spot drift between a generated artifact and its checked-in counterpart.</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'JSON Diff', href: '/tools/json-diff', icon: '🔍' },
          { name: 'JSON Viewer', href: '/tools/json-viewer', icon: '🧩' },
          { name: 'Word Counter', href: '/tools/word-counter', icon: '✍️' },
          { name: 'Markdown Preview', href: '/tools/markdown-preview', icon: '📑' },
        ]}
      />
    </>
  );
}
