import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const loremIpsumHistoryAndUses: BlogArticle = {
  slug: 'lorem-ipsum-history-and-uses',
  category: 'Design',
  title: 'Lorem Ipsum: The 500-Year-Old Placeholder Text and How to Use It Right',
  description:
    'It comes from Cicero. It was scrambled by a printer in the 1500s. It\'s shaped how every modern designer mocks up content. Learn the history, the alternatives, and when to never use it.',
  publishedDate: '2026-05-08',
  readTime: '8 min read',
  keywords:
    'lorem ipsum, placeholder text, dummy text, design mockup, content first design, fake text generator',
  relatedTools: [
    { name: 'Lorem Ipsum Generator', href: '/tools/lorem-ipsum' },
    { name: 'Word Counter', href: '/tools/word-counter' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Every designer reaches for it. Every CMS template ships with it. "Lorem ipsum dolor sit amet"
        is so universal that it's become invisible — but it's also one of the most common ways
        designs deceive their stakeholders, fail accessibility, and produce surprises in production.
      </Lead>

      <H2>The 500-year-old origin</H2>
      <p>
        The text is a corrupted excerpt from Cicero's 45 BC philosophical work "De finibus bonorum et
        malorum" ("On the Ends of Good and Evil"). The original passage begins:
        <em>"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet…"</em> — "Nor again
        is there anyone who loves or pursues pain itself because it is pain."
      </p>
      <p>
        In the 1500s, an unknown printer scrambled the text to create type specimens. The earliest surviving
        printed example dates to 1505. By the 20th century, "Lorem ipsum" was the universal placeholder
        across the printing and design industries — long before it became a digital convention.
      </p>

      <H2>Why fake Latin specifically?</H2>
      <p>
        The choice was practical, not historical:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>The letter distribution roughly matches English — useful for evaluating typography.</li>
        <li>It's nonsense, so readers don't get distracted reading meaning into it.</li>
        <li>It's clearly "not real text," preventing confusion about whether the design is final.</li>
        <li>It looks formal enough to communicate professionalism without committing to specific copy.</li>
      </ul>

      <H2>When Lorem Ipsum is the right choice</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Typography evaluation.</strong> Comparing fonts, line heights, paragraph spacing without distraction.</li>
        <li><strong>Print layout.</strong> Magazine, brochure, or book design where text length is roughly known.</li>
        <li><strong>Quick mockups.</strong> Internal sketches where real content isn't ready.</li>
        <li><strong>Component documentation.</strong> Storybook, Figma libraries showing component variants.</li>
      </ul>

      <H2>When it's the wrong choice</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Stakeholder reviews of UX flows.</strong> Real users read content. If your design only works with sentence-level placeholder, it doesn't actually work.</li>
        <li><strong>Localization preparation.</strong> Lorem ipsum doesn't resemble German (much longer) or Chinese (more condensed). Designs that look "balanced" with lorem ipsum can break in real translations.</li>
        <li><strong>Accessibility testing.</strong> Screen readers read lorem ipsum. Real users testing the design hear nothing meaningful, which doesn't reveal real comprehension issues.</li>
        <li><strong>SEO previews.</strong> Lorem ipsum is famously the source of products shipping with placeholder text in production — page titles, meta descriptions, alt text. Scrub it before deploy.</li>
      </ul>

      <Callout title="The famous shipping disasters" accent="amber">
        Major brands, news sites, and government portals have all shipped with lorem ipsum in production —
        sometimes for weeks before someone notices. The risk is greatest in seldom-viewed pages: error
        states, account settings, footer links. Always grep your codebase and content for "lorem"
        before launch.
      </Callout>

      <H2>Alternatives worth knowing</H2>

      <H3>Real-world content first</H3>
      <p>
        The strongest alternative is "content-first design": write the actual headlines and body
        before designing. Many UX teams find that the discipline of writing real copy reveals which UI
        elements are actually needed and which are decorative.
      </p>

      <H3>Themed nonsense generators</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Hipster Ipsum:</strong> "Mlkshk fanny pack disrupt occupy lo-fi…" — for trendy startups.</li>
        <li><strong>Bacon Ipsum:</strong> "Bacon ipsum dolor amet capicola short loin…" — for food/lifestyle sites.</li>
        <li><strong>Cat Ipsum:</strong> "Cat ipsum dolor sit amet, headbutt anything that moves…" — for pet content.</li>
        <li><strong>Zombie Ipsum, Pirate Ipsum, etc.</strong> Many themed variants exist, mostly for fun.</li>
      </ul>
      <p>
        These can backfire — themed nonsense can be more memorable than your design, distracting reviewers
        from the layout work.
      </p>

      <H3>Realistic dummy data services</H3>
      <p>
        For data-heavy designs (tables, dashboards), use realistic fake data:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Faker.js:</strong> programmatically generates names, emails, addresses, lorem ipsum.</li>
        <li><strong>Mockaroo:</strong> generates realistic CSV/JSON test data with custom schema.</li>
        <li><strong>Random User Generator API:</strong> fake user profiles with photos.</li>
      </ul>

      <H3>Real text from public domain</H3>
      <p>
        Project Gutenberg has thousands of public-domain books. Pulling real prose (Tolstoy, Austen, etc.)
        creates more convincing mockups for content-heavy designs and reveals layout issues that lorem ipsum
        masks.
      </p>

      <H2>The line-length and word-count problem</H2>
      <p>
        Lorem ipsum has a specific average word length (~6 characters) that's slightly longer than
        English (~5). Designs balanced for lorem ipsum will look slightly "tighter" in production.
      </p>
      <p>
        Headline mockups are particularly affected. A 5-word real headline ("Build apps faster with
        Bun") looks very different from 5 words of lorem ipsum ("Lorem ipsum dolor sit amet").
        Always test headlines with realistic content.
      </p>

      <H2>Localization considerations</H2>
      <p>
        If your design will be translated, lorem ipsum is misleading:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>German is typically 30% longer than English. Buttons that fit in English break in German.</li>
        <li>Chinese, Japanese, Korean characters are wider but shorter. Line counts change.</li>
        <li>Right-to-left languages (Arabic, Hebrew) require entirely different layout patterns.</li>
      </ul>
      <p>
        Use a tool that generates language-specific dummy text (Faker.js supports many locales) when designing
        for international audiences.
      </p>

      <H2>Generation patterns</H2>
      <p>
        When generating lorem ipsum, the standard formats:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>By words:</strong> "100 words of lorem ipsum." Useful for filling specific bounded areas.</li>
        <li><strong>By sentences:</strong> 3 sentences. Good for short paragraphs.</li>
        <li><strong>By paragraphs:</strong> 5 paragraphs. Good for body content.</li>
        <li><strong>By bytes:</strong> rare, but useful for testing storage limits.</li>
      </ul>
      <p>
        Most generators start with the canonical "Lorem ipsum dolor sit amet" opening; some randomize
        for variety in long mockups.
      </p>

      <KeyTakeaways
        items={[
          'Lorem ipsum descends from Cicero\'s philosophy text and was scrambled by 1500s printers as type specimens.',
          'Best for typography and quick mockups; bad for stakeholder UX reviews and localization-aware designs.',
          'Real-world content first reveals UI issues that placeholder text masks. Use lorem ipsum sparingly.',
          'German runs 30% longer, CJK characters break differently — never trust an internationalized design balanced with lorem ipsum.',
          'Grep for \'lorem\' before any production deploy. Many large sites have shipped placeholders by accident.',
        ]}
      />

      <p>
        Generate clean lorem ipsum at any length using our{' '}
        <Link href="/tools/lorem-ipsum" className="text-emerald-600 font-semibold hover:underline">Lorem Ipsum Generator</Link>.
      </p>
    </div>
  ),
};
