import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const wordCountReadingTime: BlogArticle = {
  slug: 'word-count-reading-time',
  category: 'Web',
  title: 'Word Count and Reading Time: Why Estimates Vary and What\'s Actually Accurate',
  description:
    'Different tools count words differently. Reading-time estimates range 50% across platforms. Learn what counts (and what doesn\'t), why Medium\'s estimate differs from yours, and how to make accurate reading-time predictions.',
  publishedDate: '2026-05-08',
  readTime: '8 min read',
  keywords:
    'word count, reading time, words per minute, content metrics, character count, page count',
  relatedTools: [
    { name: 'Word Counter', href: '/tools/word-counter' },
    { name: 'Lorem Ipsum Generator', href: '/tools/lorem-ipsum' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Microsoft Word, Google Docs, your CMS, and your custom React component will all give you different word
        counts for the same text. Reading-time estimates vary even more wildly. The differences come from
        decisions about what counts as a word — and most tools don't document those decisions.
      </Lead>

      <H2>What counts as a word?</H2>
      <p>
        Word counting sounds trivial. It isn't. Different decisions:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Hyphenated words:</strong> Is "state-of-the-art" one word or four? Most counters say one. Some scientific tools say four.</li>
        <li><strong>Contractions:</strong> Is "don't" one word or two? Universal: one.</li>
        <li><strong>URLs:</strong> Is "https://example.com" a word? Some counters skip URLs entirely; others count the full URL as one word.</li>
        <li><strong>Numbers and dates:</strong> Is "2024" a word? "2024-10-27"? Most include numbers as words; some exclude.</li>
        <li><strong>Code blocks:</strong> Should code be word-counted? Markdown processors disagree.</li>
        <li><strong>Acronyms:</strong> "U.S.A." — one word or three? Usually one.</li>
      </ul>
      <p>
        Word counts can vary by 5–10% across tools for the same text, especially in technical content.
      </p>

      <H2>The standard algorithm</H2>
      <p>
        The most common approach (used by Word, Google Docs, most JavaScript libraries):
      </p>
      <ol className="list-decimal pl-6 space-y-2 my-4">
        <li>Strip HTML tags (if HTML).</li>
        <li>Replace whitespace runs with single spaces.</li>
        <li>Split on whitespace.</li>
        <li>Count non-empty resulting tokens.</li>
      </ol>
      <p>
        This treats "state-of-the-art" as one word (hyphens stay attached) and "USA" as one
        word. URLs typically count as one word because they have no internal whitespace.
      </p>

      <H2>Reading time math</H2>
      <p>
        The standard formula:
      </p>
      <p className="font-mono bg-gray-50 p-3 rounded text-center">
        reading_time_minutes = word_count / WPM
      </p>
      <p>
        The contentious value is WPM (words per minute). Different platforms use different defaults:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Medium:</strong> 265 WPM (relatively fast).</li>
        <li><strong>Substack:</strong> 200 WPM.</li>
        <li><strong>Default for blog posts (Wikipedia):</strong> 250 WPM.</li>
        <li><strong>Academic reading rate:</strong> 200–250 WPM.</li>
        <li><strong>Technical reading (with comprehension):</strong> 100–200 WPM.</li>
      </ul>
      <p>
        A 2,000-word article reads as 7.5 minutes at Medium's rate, 10 minutes at Substack's.
        Same article, 33% difference in reported reading time.
      </p>

      <Callout title="Why reading-time estimates lie" accent="amber">
        Real reading speed varies enormously: 100–600 WPM depending on familiarity with the topic. Reading-time
        estimates are best understood as "commitment signals" rather than accurate predictions. They
        help users decide whether to start; they rarely match actual time spent.
      </Callout>

      <H2>Adjustments for content type</H2>
      <p>
        Naive word/WPM math ignores content density:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Code blocks:</strong> typically read at half the WPM of prose. Add ~30 seconds per code block to estimates.</li>
        <li><strong>Math equations:</strong> very slow — 60 seconds per equation isn't unreasonable.</li>
        <li><strong>Tables and figures:</strong> add 10–30 seconds per item.</li>
        <li><strong>Images:</strong> users typically spend 5–10 seconds; add per image.</li>
        <li><strong>Video embeds:</strong> reading time should not include video duration; consider showing both separately.</li>
      </ul>
      <p>
        A more realistic formula:
      </p>
      <p className="font-mono bg-gray-50 p-3 rounded text-sm">
        reading_time = (prose_words / 250) + (code_blocks × 0.5) + (images × 0.15)
      </p>

      <H2>Character count vs word count</H2>
      <p>
        Some platforms (Twitter/X, SMS, app store descriptions) limit by character, not word. Decisions
        there:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>With or without spaces:</strong> Twitter counts spaces; some legal limits don't.</li>
        <li><strong>Unicode counting:</strong> "😀" is 1 character visually, but is 4 bytes UTF-8 or 2 UTF-16 code units. Twitter counts emojis as 2 characters.</li>
        <li><strong>Combining characters:</strong> "é" can be 1 codepoint or 2 (e + combining accent). NFC normalization can make a difference.</li>
      </ul>

      <H2>Implementing reliable word count in code</H2>
      <p>
        For JavaScript:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`function countWords(text) {
  return text
    .replace(/<[^>]*>/g, ' ')   // strip HTML
    .replace(/\\s+/g, ' ')        // normalize whitespace
    .trim()
    .split(' ')
    .filter(Boolean)
    .length;
}`}</code></pre>

      <p>
        For text with mixed scripts (CJK + Latin), word boundaries are different. Chinese has no spaces between
        words; you need a segmentation library (e.g., <code>jieba</code> for Chinese, <code>kuromoji</code> for
        Japanese) for accurate word counts. For approximate word counts in CJK, divide character count by 1.5
        as a rough heuristic.
      </p>

      <H2>SEO implications</H2>
      <p>
        Search engines don't directly use reading time, but content length is a ranking signal in some
        contexts:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Pages targeting informational queries with under 300 words often rank poorly — they don't look comprehensive.</li>
        <li>1500–2500 words is the sweet spot for "how-to" and educational content based on Backlinko's analysis.</li>
        <li>Reading time displayed in metadata helps users commit and reduces bounce rate (a real ranking signal).</li>
      </ul>

      <H2>Specifically for typography mockups</H2>
      <p>
        When mocking up layouts before content exists, average word lengths and counts to aim for:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Average English word: 4.7 characters + 1 space = 5.7 typed characters.</li>
        <li>Average sentence: 15–20 words.</li>
        <li>Average paragraph: 3–5 sentences (50–80 words).</li>
        <li>Standard column width: 60–75 characters per line for optimal readability.</li>
        <li>Average page (8.5×11, single-spaced, 12pt): ~500 words.</li>
      </ul>

      <KeyTakeaways
        items={[
          'Word counts vary 5–10% across tools because of decisions about hyphens, URLs, numbers, and acronyms.',
          'Reading-time estimates use 200–265 WPM. Same article can show as 33% different reading time on different platforms.',
          'Real reading time varies 100–600 WPM by topic familiarity. Estimates are commitment signals, not predictions.',
          'Adjust reading time for code blocks (~0.5 min each), images (~10 sec each), tables, and equations.',
          'Character counts have unicode complications: emojis count as 2 in Twitter; combining characters depend on normalization.',
        ]}
      />

      <p>
        Get accurate word, character, and reading-time stats on any text using our{' '}
        <Link href="/tools/word-counter" className="text-emerald-600 font-semibold hover:underline">Word Counter</Link>.
      </p>
    </div>
  ),
};
