import Head from 'next/head';
import ColorPalette from '../../components/Tools/ColorPalette';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/color-palette';

const FAQS = [
  { q: 'What is a color palette?', a: 'A color palette is a curated set of colors designed to work harmoniously together. In design and branding, a palette typically includes a primary color, accent colors, neutrals, and tints/shades that create visual consistency across a product.' },
  { q: 'What are tints and shades?', a: 'Tints are created by mixing a color with white, making it lighter. Shades are created by mixing with black, making it darker. A color scale (100–900) provides a full range from very light tints to very dark shades.' },
  { q: 'What is a complementary color?', a: 'A complementary color sits directly opposite on the color wheel (180° away in hue). Complementary pairs create high contrast and visual energy — for example, blue and orange, or red and green.' },
  { q: 'What are analogous colors?', a: 'Analogous colors are adjacent on the color wheel (typically ±30°). They create harmonious, low-contrast combinations often seen in nature — like yellow, yellow-green, and green.' },
  { q: 'What are triadic colors?', a: 'Triadic colors are three colors equally spaced around the color wheel (120° apart). They provide strong visual contrast while remaining balanced — for example, red, blue, and yellow.' },
];

export default function ColorPalettePage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Color Palette Generator',
    slug: SLUG,
    description: 'Generate tints, shades, complementary, analogous, and triadic color palettes from any base color.',
    category: 'DeveloperApplication',
    featureList: 'Tints, Shades, Complementary, Analogous, Triadic, Color scale 100–900',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Color Palette Generator — Tints, Shades & Color Harmonies | Toolisk</title>
        <meta name="description" content="Generate color palettes from any hex color. Get tints, shades, complementary, analogous, and triadic harmonies plus a full 100–900 color scale. Free browser tool." />
        <meta name="keywords" content="color palette generator, tints and shades, complementary colors, analogous colors, triadic colors, color scheme generator, hex color palette, color scale" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Color Palette Generator | Toolisk" />
        <meta property="og:description" content="Generate tints, shades, and color harmonies from any base color. Free browser tool." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🎨" title="Color Palette Generator" tagline="Pick a base color and generate tints, shades, complementary pairs, analogous sets, and a full color scale.">
        <ColorPalette />
      </ToolShell>

      <ToolSEOContent
        description="Generate professional color palettes from any HEX color. Choose from five palette types: tints (lighter variations), shades (darker variations), complementary (opposite hue), analogous (adjacent hues), or triadic (three equally-spaced hues). Also generates a full 100–900 color scale like those used in Tailwind CSS and Material Design."
        features={[
          '🎨 Pick any hex color or use the color picker',
          '🌗 Tints and shades — 5 variations each',
          '🔄 Complementary, analogous, and triadic harmonies',
          '📊 Full 100–900 color scale for design systems',
          '📋 Copy any hex value with one click',
          '⚡ Instant preview as you change the base color',
        ]}
        steps={[
          { title: 'Choose a base color', desc: 'Use the color picker or type a hex value like #3b82f6.' },
          { title: 'Select a palette type', desc: 'Try tints for lighter variations, shades for darker ones, or a harmony type.' },
          { title: 'Copy any swatch', desc: 'Click the copy button under any color to get its hex code.' },
          { title: 'Use the color scale', desc: 'The 100–900 scale at the bottom gives you a full range for a design system.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Choosing the right color harmony</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Tints/shades:</strong> Use for building a monochromatic scale — one color at multiple lightness levels for UI hierarchy.</li>
              <li><strong>Complementary:</strong> Use for high-contrast CTAs or accent colors that pop against a primary color.</li>
              <li><strong>Analogous:</strong> Use for calm, cohesive interfaces — backgrounds, illustrations, or data visualizations.</li>
              <li><strong>Triadic:</strong> Use for vibrant, balanced designs where three distinct brand colors need to coexist.</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Color Converter', href: '/tools/color-converter', icon: '🎨' },
          { name: 'CSS Unit Converter', href: '/tools/css-unit-converter', icon: '📐' },
          { name: 'Image to Base64', href: '/tools/image-base64', icon: '🖼️' },
        ]}
      />
    </>
  );
}
