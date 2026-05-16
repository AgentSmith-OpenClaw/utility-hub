import Head from 'next/head';
import ColorContrastChecker from '../../components/Tools/ColorContrastChecker';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/color-contrast-checker';

const FAQS = [
  { q: 'What is the WCAG contrast ratio?', a: 'The contrast ratio is calculated using the relative luminance of the foreground and background colors, per the WCAG 2.x formula: (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter luminance and L2 the darker. The ratio ranges from 1:1 (no contrast, same color) to 21:1 (black on white).' },
  { q: 'What is the difference between AA and AAA?', a: 'AA is the minimum accessibility standard required by most regulations (WCAG 2.1 Level AA). It requires 4.5:1 for normal text and 3:1 for large text (18pt+ or 14pt+ bold). AAA is the enhanced level requiring 7:1 for normal text — it is aspirational and not always practical for all content.' },
  { q: 'What counts as "large text"?', a: 'WCAG defines large text as 18pt (24px) or larger, or 14pt (approximately 18.67px) or larger when bold. Large text has a more relaxed minimum ratio (3:1 for AA) because it is easier to read at lower contrast.' },
  { q: 'What about non-text UI elements?', a: 'Buttons, icons, focus rings, and form borders need at least 3:1 against their adjacent background (WCAG 1.4.11 Non-Text Contrast). This applies to the visual presentation of the component, not text within it.' },
  { q: 'My brand colors fail AA — what should I do?', a: 'Use the "Suggest a fix" feature — it nudges the foreground color toward a passing value while keeping it as close to the original as possible. Alternatively, consider using the brand color as an accent (buttons, highlights) against a neutral base, and use a dark/light text color that passes.' },
];

export default function ColorContrastCheckerPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Color Contrast Checker',
    slug: SLUG,
    description: 'Check WCAG 2.2 contrast ratios between foreground and background colors. See AA/AAA pass or fail for normal, large, and UI text.',
    featureList: 'WCAG 2.2 AA AAA, Contrast ratio, Normal text, Large text, UI elements, Live preview, Suggest fix, Preset pairs',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Color Contrast Checker — WCAG AA & AAA | Toolisk</title>
        <meta name="description" content="Check WCAG 2.2 contrast ratios for foreground/background color pairs. Live preview with pass/fail badges for AA, AAA, normal, large, and UI text." />
        <meta name="keywords" content="color contrast checker, wcag contrast, accessibility color checker, aa aaa contrast, wcag 2.2, contrast ratio tool, color accessibility" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Color Contrast Checker | Toolisk" />
        <meta property="og:description" content="Check WCAG 2.2 AA and AAA contrast for any color pair — with live preview." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="♿" title="Color Contrast Checker" tagline="Check WCAG 2.2 AA and AAA contrast between any foreground and background — live preview, pass/fail badges, and a suggested fix.">
        <ColorContrastChecker />
      </ToolShell>

      <ToolSEOContent
        description="A WCAG 2.2 contrast checker that calculates the relative-luminance ratio between a foreground and background color. Shows pass/fail badges for AA and AAA at normal text (4.5:1 / 7:1), large text (3:1 / 4.5:1), and non-text UI elements (3:1). Includes a live text preview and a one-click suggestion to fix failing pairs."
        features={[
          '♿ WCAG 2.2 AA & AAA pass/fail badges',
          '👁️ Live text and button preview in your actual colors',
          '🎨 HEX input and color picker for both foreground and background',
          '💡 Suggest-a-fix: auto-nudges failing foreground to AA',
          '📐 Separate checks for normal, large text, and UI elements',
          '📋 6 preset color pairs including common failure examples',
        ]}
        steps={[
          { title: 'Pick foreground and background', desc: 'Use the color picker or type a hex value for each. The contrast ratio updates instantly.' },
          { title: 'Read the badges', desc: 'Green ✓ means pass, red ✗ means fail — for AA, AAA, normal text, large text, and UI elements.' },
          { title: 'Preview in context', desc: 'The preview section shows your actual colors as a paragraph, heading, and button so you can judge readability visually.' },
          { title: 'Fix failing pairs', desc: 'If a pair fails AA, the "Suggested fix" card proposes a nearby foreground color that passes — click Apply to use it.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why contrast matters</h2>
            <p className="text-slate-600 leading-relaxed">
              About 8% of men and 0.5% of women have some form of color vision deficiency, and a much larger share of
              users read content in poor lighting conditions, on aging screens, or with reduced-contrast displays. Low
              contrast text is the most common accessibility failure on the web, and it&apos;s entirely preventable.
            </p>
            <p className="text-slate-600 leading-relaxed">
              In the EU, the European Accessibility Act (EAA) requires WCAG 2.1 Level AA compliance for most digital
              products sold to consumers. In the US, Section 508 mandates similar standards for federal agencies.
              Getting contrast right is not just good design — it is increasingly a legal requirement.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">The luminance formula</h3>
            <p className="text-slate-600 leading-relaxed">
              WCAG uses relative luminance, which accounts for the non-linear way human eyes perceive brightness.
              Each RGB component is first linearised (removing the sRGB gamma curve), then combined with the
              perceptual weights 0.2126R + 0.7152G + 0.0722B. Green contributes most to perceived brightness; blue
              least. The final ratio is{' '}
              <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">(L_light + 0.05) / (L_dark + 0.05)</code>.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Going beyond contrast</h3>
            <p className="text-slate-600 leading-relaxed">
              Contrast ratio is a useful proxy but not the whole picture. Color should never be the <em>only</em> way
              information is conveyed (WCAG 1.4.1). Links should be underlined, not just colored. Error states should
              use an icon or text label, not just red. Contrast checks are the first step — combine them with keyboard
              navigation testing, screen reader testing, and tools like axe DevTools for a complete audit.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Color Converter', href: '/tools/color-converter', icon: '🎨' },
          { name: 'Color Palette Generator', href: '/tools/color-palette', icon: '🖌️' },
          { name: 'CSS Box Shadow Generator', href: '/tools/box-shadow-generator', icon: '🌗' },
        ]}
      />
    </>
  );
}
