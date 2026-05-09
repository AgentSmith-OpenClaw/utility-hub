import Head from 'next/head';
import WordCounter from '../../components/Tools/WordCounter';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

export default function WordCounterPage() {
  const breadcrumbSchema = generateBreadcrumbs('/tools/word-counter');
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Word Counter',
    slug: '/tools/word-counter',
    description: 'Count words, characters, sentences, paragraphs, and reading time. SEO length thresholds for titles, meta, OG, tweets.',
    featureList: 'Word/char/sentence count, Reading time, Speaking time, SEO length thresholds',
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How is reading time calculated?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Reading time is computed at an average pace of 225 words per minute, which is the standard for adult silent reading. Speaking time uses 130 words per minute, the typical conversational pace.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why does the character count differ with and without spaces?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Some platforms count whitespace toward your limit (Twitter), while others ignore it (some essay-grading tools). Both numbers are shown so you can match whichever rule applies to your use case.",
        },
      },
      {
        '@type': 'Question',
        name: 'What are the SEO length thresholds for?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Search engines and social platforms truncate metadata that exceeds certain lengths. SEO titles around 60 characters, meta descriptions around 160, Open Graph descriptions around 200, and tweets at 280 are well-known limits to optimize against.',
        },
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Word Counter — Count Words, Characters & Reading Time | Toolisk</title>
        <meta
          name="description"
          content="Free online word counter. Count words, characters, sentences, paragraphs, and reading time. Includes SEO length thresholds for titles, meta descriptions, and tweets."
        />
        <meta
          name="keywords"
          content="word counter, character counter, reading time, SEO title length, meta description length, sentence counter"
        />
        <link rel="canonical" href={`${SITE_URL}/tools/word-counter`} />
        <meta property="og:title" content="Word Counter — Toolisk" />
        <meta property="og:description" content="Count words, characters, sentences, paragraphs, and reading time." />
        <meta property="og:url" content={`${SITE_URL}/tools/word-counter`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="✍️"
        title="Word Counter"
        tagline="Count words, characters, sentences, paragraphs, and reading time as you type."
      >
        <WordCounter />
      </ToolShell>

      <ToolSEOContent
        description="A real-time word counter for writers, students, and SEO professionals. Track word count, character count (with and without spaces), sentence count, paragraph count, lines, unique words, longest word, and reading and speaking time as you write or paste."
        features={[
          '📊 Real-time stats — no submit button',
          '🎯 SEO thresholds for titles, meta descriptions, and tweets',
          '📖 Reading time at 225 words per minute',
          '🎤 Speaking time at 130 words per minute',
          '🔡 Unique word count and longest word',
          '🛡️ 100% private — text never leaves your browser',
        ]}
        steps={[
          { title: 'Paste or type your text', desc: 'Drop in your essay, article, tweet, or meta description.' },
          { title: 'Watch the counts update live', desc: 'Word, character, sentence, and paragraph counts appear instantly.' },
          { title: 'Match the right limit', desc: 'Use the SEO threshold bars to stay under common platform limits.' },
          { title: 'Estimate read or speak time', desc: 'Use the timing estimates to plan blog posts, presentations, or scripts.' },
        ]}
        faqs={[
          {
            q: 'How is reading time calculated?',
            a: 'At 225 words per minute, the standard for adult silent reading. Speaking time uses 130 words per minute, a typical conversational pace.',
          },
          {
            q: 'Why does the character count differ with and without spaces?',
            a: 'Some platforms count whitespace toward your limit (Twitter), while others ignore it (some essay-grading tools). Both numbers are shown so you can match whichever rule applies.',
          },
          {
            q: 'What are the SEO length thresholds for?',
            a: 'Search engines and social platforms truncate metadata that exceeds certain lengths. SEO titles around 60 characters, meta descriptions around 160, Open Graph descriptions around 200, and tweets at 280 are well-known limits to optimize against.',
          },
          {
            q: 'How are sentences detected?',
            a: 'A sentence is detected by punctuation (period, question mark, exclamation point) followed by a space and an uppercase letter. This works well for most prose but can miss edge cases like quoted dialogue or unusual abbreviations.',
          },
          {
            q: 'Is my text uploaded anywhere?',
            a: "No. The word counter runs entirely in your browser. Your text never leaves your device — feel free to paste drafts, manuscripts, or sensitive copy.",
          },
        ]}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why word and character counts matter</h2>
            <p className="text-slate-600 leading-relaxed">
              Every channel has limits. Twitter caps tweets at 280 characters. Google truncates meta descriptions around
              160. Academic papers come with strict word counts. Press releases require tight summaries. Knowing the
              numbers in advance saves you from awkward last-minute trimming or a chopped-off preview in search results.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Reading time as a planning tool</h3>
            <p className="text-slate-600 leading-relaxed">
              When you publish, readers want to know how long an article will take. A &ldquo;5 min read&rdquo; label
              sets the right expectation, and helps people prioritize. The 225 wpm figure is widely accepted for
              English silent reading. Speaking time at 130 wpm is useful for podcasts, videos, and presentations —
              if your script clocks in at 12 minutes, your final recording will likely run a bit longer due to pauses.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Case Converter', href: '/tools/case-converter', icon: '🔤' },
          { name: 'Lorem Ipsum Generator', href: '/tools/lorem-ipsum', icon: '📝' },
          { name: 'Regex Tester', href: '/tools/regex-tester', icon: '🧪' },
        ]}
      />
    </>
  );
}
