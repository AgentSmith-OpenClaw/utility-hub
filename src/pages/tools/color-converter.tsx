import Head from 'next/head';
import ColorConverter from '../../components/Tools/ColorConverter';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

export default function ColorConverterPage() {
  const breadcrumbSchema = generateBreadcrumbs('/tools/color-converter');

  return (
    <>
      <Head>
        <title>Color Converter — HEX, RGB, HSL, CMYK + Contrast Checker | Toolisk</title>
        <meta
          name="description"
          content="Convert colors between HEX, RGB, HSL, and CMYK formats. Live preview, WCAG contrast checker, and tint/shade variations for design palettes."
        />
        <meta
          name="keywords"
          content="color converter, hex to rgb, hex to hsl, hsl to rgb, cmyk converter, wcag contrast checker, color picker"
        />
        <link rel="canonical" href={`${SITE_URL}/tools/color-converter`} />
        <meta property="og:title" content="Color Converter | Toolisk" />
        <meta property="og:description" content="Convert HEX, RGB, HSL, and CMYK with WCAG contrast checking." />
        <meta property="og:url" content={`${SITE_URL}/tools/color-converter`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <ToolShell
        icon="🎨"
        title="Color Converter"
        tagline="Convert between HEX, RGB, HSL, and CMYK with WCAG contrast checking and tint variations."
      >
        <ColorConverter />
      </ToolShell>

      <ToolSEOContent
        description="A complete color toolkit. Type any color in HEX, RGB, or HSL and instantly see all four common formats. Includes a native color picker, WCAG AA/AAA contrast checking against white and black backgrounds, and a tints-and-shades palette."
        features={[
          '🎨 HEX, RGB, HSL, and CMYK formats',
          '👁️ Live color preview with transparency',
          '♿ WCAG AA / AAA contrast ratio checker',
          '🌈 Auto-generated tints and shades',
          '🎯 Native color picker support',
          '📋 One-click copy for any format',
        ]}
        steps={[
          { title: 'Pick or type a color', desc: 'Use the color picker, or type a HEX, RGB, or HSL value directly.' },
          { title: 'See all formats', desc: 'Every common color format updates in real time. Click Copy on any row.' },
          { title: 'Check contrast', desc: 'See whether the color passes WCAG AA and AAA accessibility ratings on white and black backgrounds.' },
          { title: 'Build a palette', desc: 'Use the auto-generated tints and shades to design lighter and darker variants.' },
        ]}
        faqs={[
          {
            q: 'What WCAG ratings should I aim for?',
            a: 'WCAG AA requires a contrast ratio of 4.5:1 for normal text and 3:1 for large text (18pt+ or 14pt bold). AAA requires 7:1 and 4.5:1 respectively. AA is the typical legal minimum for accessibility compliance.',
          },
          {
            q: 'When should I use HSL instead of HEX?',
            a: 'HSL (hue, saturation, lightness) is much easier for humans to reason about. Want a slightly lighter blue? Increase the lightness. Want a less saturated version? Drop the saturation. HEX requires guessing the new RGB values.',
          },
          {
            q: 'What is CMYK for?',
            a: 'CMYK is the color model used for print (cyan, magenta, yellow, key/black). Designers preparing materials for print need to know roughly how their on-screen RGB color will translate. Note: exact CMYK conversion depends on the printer profile, so this is an approximation.',
          },
          {
            q: 'Why does my HEX look different on print?',
            a: 'Screens emit light (additive RGB), printers absorb light (subtractive CMYK). Some bright RGB colors simply cannot be reproduced in print. For print work, design in CMYK from the start when possible.',
          },
        ]}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Color models in plain English</h2>
            <p className="text-slate-600 leading-relaxed">
              <strong>HEX</strong> is just RGB written as a six-digit hex number. <code className="text-xs bg-slate-100 px-1 rounded">#10b981</code> means
              red=0x10, green=0xb9, blue=0x81. Compact, but hard to manipulate by hand.
            </p>
            <p className="text-slate-600 leading-relaxed">
              <strong>RGB</strong> uses three values from 0–255 for red, green, blue. Same data as HEX, just decimal.
              Adding an alpha channel turns it into RGBA.
            </p>
            <p className="text-slate-600 leading-relaxed">
              <strong>HSL</strong> describes the same color using hue (0–360°), saturation (%), and lightness (%). It maps
              much more closely to how humans think about color: &ldquo;a vibrant, slightly darker blue&rdquo; is a
              specific HSL adjustment, while in HEX it requires conversion math.
            </p>
            <p className="text-slate-600 leading-relaxed">
              <strong>CMYK</strong> uses four ink percentages (cyan, magenta, yellow, key/black). It's the print world&apos;s
              native color space. Note that CMYK has a smaller gamut than RGB — neon colors that glow on screen often
              flatten when printed.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Lorem Ipsum Generator', href: '/tools/lorem-ipsum', icon: '📝' },
          { name: 'Case Converter', href: '/tools/case-converter', icon: '🔤' },
          { name: 'JSON Viewer & Formatter', href: '/tools/json-viewer', icon: '🧩' },
        ]}
      />
    </>
  );
}
