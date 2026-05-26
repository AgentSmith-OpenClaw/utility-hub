import Head from 'next/head';
import BoxShadowGenerator from '../../components/Tools/BoxShadowGenerator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/box-shadow-generator';

const FAQS = [
  { q: 'Can I layer multiple shadows?', a: 'Yes — this is one of the main differentiators of this tool. Use the "Add layer" button to stack shadows. CSS box-shadow accepts a comma-separated list, so multiple shadows render in order from front to back. This lets you create sophisticated effects like neumorphism or multi-colour glows.' },
  { q: 'What does the spread value do?', a: 'Spread expands or contracts the shadow size uniformly before blurring. A positive spread makes the shadow larger than the element; a negative spread makes it smaller. Combining a negative spread with a large blur radius creates a soft, contained shadow.' },
  { q: 'What is an inset shadow?', a: 'An inset shadow renders inside the element instead of behind it, creating the appearance of a pressed-in or sunken surface. This is the "inner press" effect used for toggle switches, pressed buttons, and neumorphic components.' },
  { q: 'Why does the color use 8-digit hex?', a: 'Standard hex colors are 6 digits (e.g. #000000). An 8-digit hex adds an alpha channel (e.g. #00000033 for 20% opacity black). CSS box-shadow also accepts rgba(), but 8-digit hex is more compact and universally supported in modern browsers.' },
  { q: 'How do I copy the CSS for just one shadow layer?', a: 'Click the layer in the layer list on the left to select it, then read its CSS string shown in the list item. The output panel at the bottom shows the full multi-layer property. For a single layer, you can temporarily remove the others, copy, then re-add them.' },
];

export default function BoxShadowGeneratorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'CSS Box Shadow Generator',
    slug: SLUG,
    description: 'Build CSS box-shadows visually with sliders. Stack multiple layers for Material elevations, neumorphism, or custom glows. Copy CSS instantly.',
    featureList: 'Multi-layer shadows, Live preview, Presets, Inset toggle, Custom colors, Opacity control, CSS output',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>CSS Box Shadow Generator — Multi-layer Visual Tool | Toolisk</title>
        <meta name="description" content="Build CSS box-shadows visually with sliders. Stack multiple layers, use presets for Material elevations or neumorphism, and copy production CSS." />
        <meta name="keywords" content="css box shadow generator, box shadow tool, css shadow builder, neumorphism shadow, multi-layer box shadow, shadow css generator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="CSS Box Shadow Generator | Toolisk" />
        <meta property="og:description" content="Build multi-layer CSS box-shadows visually with sliders and live preview." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🌗" title="CSS Box Shadow Generator" tagline="Build multi-layer box-shadows visually with sliders — live preview on a card and button, copy production CSS instantly.">
        <BoxShadowGenerator />
      </ToolShell>

      <ToolSEOContent
        description="A visual CSS box-shadow builder with live preview. Stack multiple shadow layers to create Material elevations, neumorphic effects, coloured glows, or hard offsets. Adjust offset, blur, spread, colour, opacity, and inset for each layer independently, then copy the generated CSS."
        features={[
          '🔢 Unlimited stacked shadow layers',
          '👁️ Live preview on a card and a button simultaneously',
          '🎨 Color picker with opacity (8-digit hex output)',
          '📐 Sliders for offset, blur, spread, and inset',
          '✨ 6 ready-made presets including neumorphism and Material',
          '📋 One-click CSS copy',
        ]}
        steps={[
          { title: 'Start with a preset', desc: 'Click "Soft card", "Material 2", "Glow blue", or any preset to load a pre-tuned shadow immediately.' },
          { title: 'Adjust the sliders', desc: 'Tweak offset X/Y, blur radius, spread radius, color, and opacity. Changes appear in the live preview instantly.' },
          { title: 'Add more layers', desc: 'Click "Add layer" to stack a second or third shadow. Click each layer in the list to edit its settings independently.' },
          { title: 'Copy the CSS', desc: 'The output panel shows the complete box-shadow CSS. Click Copy to paste it into your stylesheet.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">The CSS box-shadow syntax</h2>
            <p className="text-slate-600 leading-relaxed">
              The full syntax is:{' '}
              <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">box-shadow: [inset] offset-x offset-y blur spread color</code>.
              Each value is optional except the two offsets and the color. Multiple shadows are comma-separated and rendered
              front-to-back — the first shadow in the list is on top.
            </p>
            <p className="text-slate-600 leading-relaxed">
              A common mistake is making the blur radius too large or the color fully opaque. Real-world shadows
              are translucent — use a dark colour at 10–25% opacity rather than solid black. The{' '}
              <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">Soft card</code> preset demonstrates this:
              a barely-visible translucent shadow that still gives clear depth.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Material Design elevation system</h3>
            <p className="text-slate-600 leading-relaxed">
              Google&apos;s Material Design uses three shadow layers per elevation level: a key shadow (directional),
              an ambient shadow (soft fill), and sometimes a penumbra. The &ldquo;Material 2&rdquo; preset approximates elevation-4
              with two stacked shadows. As you increase the offset and blur, the card appears to float higher above the
              page. A card at rest typically uses elevation-1 (tiny shadow); a dialog uses elevation-24 (large, diffuse shadow).
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Neumorphism explained</h3>
            <p className="text-slate-600 leading-relaxed">
              Neumorphism (soft UI) simulates a surface that appears to extrude from the background. It requires
              two shadows of opposite directions: one light (from top-left), one dark (from bottom-right), and a
              background that matches the element&apos;s fill. The &ldquo;Neumorphic&rdquo; preset uses the same background for
              both to achieve this look — tweak the background color of your page to make it work end-to-end.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Color Converter', href: '/tools/color-converter', icon: '🎨' },
          { name: 'Color Palette Generator', href: '/tools/color-palette', icon: '🖌️' },
          { name: 'CSS Unit Converter', href: '/tools/css-unit-converter', icon: '📏' },
          { name: 'CSS Gradient Generator', href: '/tools/gradient-generator', icon: '🌈' },
        ]}
      />
    </>
  );
}
