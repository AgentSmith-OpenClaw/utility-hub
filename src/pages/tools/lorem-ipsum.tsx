import Head from 'next/head';
import LoremIpsum from '../../components/Tools/LoremIpsum';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const FAQS = [
  { q: 'What is Lorem Ipsum?', a: 'Lorem Ipsum is dummy text derived from a Latin work by Cicero (45 BC), used by designers since the 1500s. It looks like real prose without distracting the viewer with meaningful content, making it ideal for evaluating typography, layout, and visual hierarchy.' },
  { q: "Why does it always start with 'Lorem ipsum dolor sit amet'?", a: 'That phrase is the traditional opening — instantly recognizable as placeholder text, signaling "this is a mockup" to anyone reviewing the design.' },
  { q: 'Should I use Lorem Ipsum or real content?', a: "Lorem Ipsum is great for early-stage layout and typography decisions. As designs mature, switching to realistic content reveals issues that filler text hides — long names overflowing, empty states looking awkward, copy that just doesn't fit." },
  { q: "What's the tech variant for?", a: 'When designing developer dashboards, API documentation, or software UIs, Latin placeholder text can feel out of place. The tech variant uses programming and infrastructure vocabulary so screenshots feel realistic.' },
];

export default function LoremIpsumPage() {
  const breadcrumbSchema = generateBreadcrumbs('/tools/lorem-ipsum');
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Lorem Ipsum Generator',
    slug: '/tools/lorem-ipsum',
    description: 'Generate placeholder text for designs and mockups. Latin or tech-themed variants in paragraphs, sentences, or words.',
    featureList: 'Lorem Ipsum, Tech-themed variant, Paragraphs/sentences/words units',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Lorem Ipsum Generator — Placeholder Text for Designs | Toolisk</title>
        <meta
          name="description"
          content="Generate Lorem Ipsum placeholder text for designs and mockups. Choose paragraphs, sentences, or words, with classic Latin or modern tech-themed alternatives."
        />
        <meta
          name="keywords"
          content="lorem ipsum generator, placeholder text, dummy text, mockup text, design filler"
        />
        <link rel="canonical" href={`${SITE_URL}/tools/lorem-ipsum`} />
        <meta property="og:title" content="Lorem Ipsum Generator | Toolisk" />
        <meta property="og:description" content="Generate placeholder text for designs and mockups." />
        <meta property="og:url" content={`${SITE_URL}/tools/lorem-ipsum`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="📝"
        title="Lorem Ipsum Generator"
        tagline="Generate placeholder text for designs and mockups — classic Latin or tech-themed alternatives."
      >
        <LoremIpsum />
      </ToolShell>

      <ToolSEOContent
        description="Generate Lorem Ipsum placeholder text on demand. Pick the unit (paragraphs, sentences, or words), choose how many you need, and copy the result. Includes a tech-themed alternative for software interfaces and dashboards."
        features={[
          '📄 Paragraphs, sentences, or word counts',
          '🎚️ Slider to pick exact count',
          '🔁 Regenerate as many times as you like',
          '💻 Tech-themed variant for developer mockups',
          '📋 One-click copy',
          '🆓 Free, no sign-ups',
        ]}
        steps={[
          { title: 'Pick your source', desc: 'Classic Lorem Ipsum (Latin) or a tech-themed variant for developer-focused designs.' },
          { title: 'Choose unit and count', desc: 'Paragraphs (1–10), sentences (1–30), or words (1–200).' },
          { title: 'Regenerate', desc: 'Hit Regenerate to get a different output of the same length.' },
          { title: 'Copy and paste', desc: 'One click puts the entire text on your clipboard.' },
        ]}
        faqs={[
          {
            q: 'What is Lorem Ipsum?',
            a: 'Lorem Ipsum is dummy text derived from a Latin work by Cicero (45 BC), used by designers since the 1500s. It looks like real prose without distracting the viewer with meaningful content, making it ideal for evaluating typography, layout, and visual hierarchy.',
          },
          {
            q: "Why does it always start with 'Lorem ipsum dolor sit amet'?",
            a: 'That phrase is the traditional opening — instantly recognizable as placeholder text, signaling "this is a mockup" to anyone reviewing the design.',
          },
          {
            q: 'Should I use Lorem Ipsum or real content?',
            a: 'Lorem Ipsum is great for early-stage layout and typography decisions. As designs mature, switching to realistic content reveals issues that filler text hides — long names overflowing, empty states looking awkward, copy that just doesn\'t fit.',
          },
          {
            q: "What's the tech variant for?",
            a: 'When designing developer dashboards, API documentation, or software UIs, Latin placeholder text can feel out of place. The tech variant uses programming and infrastructure vocabulary so screenshots feel realistic.',
          },
        ]}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">When placeholder text helps and when it hurts</h2>
            <p className="text-slate-600 leading-relaxed">
              Lorem Ipsum is a tool for stages of design where the layout, typography, and information hierarchy matter
              more than the actual content. It lets you focus on whether a paragraph block <em>feels</em> right at this
              size, on this background, in this column width — without getting distracted by the meaning.
            </p>
            <p className="text-slate-600 leading-relaxed">
              But there&apos;s a trap: designs that look perfect with placeholder text often break when real content
              arrives. Real names are longer, real numbers are wider, real prose has uneven line lengths. Always
              pressure-test with realistic content before considering a design done.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Word Counter', href: '/tools/word-counter', icon: '✍️' },
          { name: 'Case Converter', href: '/tools/case-converter', icon: '🔤' },
          { name: 'UUID Generator', href: '/tools/uuid-generator', icon: '🆔' },
        ]}
      />
    </>
  );
}
