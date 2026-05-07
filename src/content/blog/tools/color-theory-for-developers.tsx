import Link from 'next/link';
import type { BlogArticle } from '../types';

export const colorTheoryForDevelopers: BlogArticle = {
  slug: 'color-theory-for-developers',
  category: 'Design',
    title: 'Color Theory for Developers: HEX, RGB, HSL, and WCAG Contrast',
    description:
      'Everything a developer needs to know about color models — and why HSL changes how you think about palettes.',
    publishedDate: '2026-05-07',
    readTime: '9 min read',
    keywords: 'color theory, hex, rgb, hsl, wcag contrast, color palette, accessibility',
    relatedTools: [
      { name: 'Color Converter', href: '/tools/color-converter' },
      { name: 'Lorem Ipsum Generator', href: '/tools/lorem-ipsum' },
    ],
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          Most developers know HEX. They might know RGB. Few really use HSL — and that&apos;s a missed opportunity.
          HSL is the color model that maps how humans actually think about color, and once you switch to it, building
          palettes and theming UI becomes dramatically easier.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The four color models, in plain English</h2>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">HEX (#10b981)</h3>
        <p>
          Six hex digits representing red, green, and blue intensities (0–255 each). Compact, but completely opaque to
          humans. Want a slightly lighter version of <code>#10b981</code>? You&apos;d have to do math in your head.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">RGB (16, 185, 129)</h3>
        <p>
          Same data as HEX, just in decimal. Three values, 0–255 each, for red, green, and blue light intensity. Add
          alpha for transparency: <code>rgba(16, 185, 129, 0.5)</code>.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">HSL (160, 84%, 39%)</h3>
        <p>
          Three values: <strong>hue</strong> (0–360°, the &ldquo;color&rdquo; itself), <strong>saturation</strong>{' '}
          (0–100%, how vibrant), <strong>lightness</strong> (0–100%, how light or dark). Want a lighter version?
          Increase the lightness. Want it more muted? Drop the saturation. The model maps to how humans naturally
          describe colors.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">CMYK (Cyan, Magenta, Yellow, Key/Black)</h3>
        <p>
          The print world&apos;s native color space. Used by printers — RGB doesn&apos;t translate directly because
          screens emit light (additive) while printers absorb light (subtractive). Bright neon colors that look great
          on screen often flatten significantly in print.
        </p>

        <div className="my-8 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Try the converter:</strong> Type a color in any format and see all of them at once.
          </p>
          <Link
            href="/tools/color-converter"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Open Color Converter →
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why HSL changes how you build palettes</h2>
        <p>
          A common need: starting from a brand color, generate a full set of tints and shades. In HEX or RGB, this
          requires real conversion math. In HSL, you just adjust the lightness:
        </p>
        <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200">
          <p className="font-mono text-sm">
            Brand:    hsl(160, 84%, 39%)<br />
            Lighter: hsl(160, 84%, 50%)<br />
            Darker:   hsl(160, 84%, 28%)<br />
            Faded:    hsl(160, 30%, 39%)
          </p>
        </div>
        <p>
          This is exactly what design systems like Tailwind&apos;s color palette do under the hood. Each color has 11
          shades (50, 100, …, 950), and the differences are mostly lightness adjustments at the same hue.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">WCAG contrast: the accessibility standard</h2>
        <p>
          Web Content Accessibility Guidelines (WCAG) define minimum contrast ratios between text and background:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>AA</strong> (legal minimum in many jurisdictions): 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt bold).</li>
          <li><strong>AAA</strong> (best practice): 7:1 for normal text, 4.5:1 for large text.</li>
        </ul>
        <p>
          These ratios are calculated using the relative luminance of the two colors — a perceptual measure of
          brightness that accounts for the human eye&apos;s sensitivity to green vs blue.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Common color mistakes</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>
            <strong>Light gray on white:</strong> looks elegant in design mockups, fails WCAG. <code>#aaa</code>{' '}
            on <code>#fff</code> has a contrast ratio of 2.85:1.
          </li>
          <li>
            <strong>Pure black on pure white:</strong> 21:1 contrast feels harsh; many designers prefer a slight
            softening (<code>#1a1a1a</code> on <code>#fafafa</code> is still well over 7:1).
          </li>
          <li>
            <strong>Color-only signals:</strong> green = good, red = bad — a problem for the ~5% of users with red-green
            colorblindness. Always pair color with an icon, label, or pattern.
          </li>
          <li>
            <strong>Mid-tone backgrounds:</strong> a brand background that&apos;s neither very light nor very dark forces
            text into a contrast trap. Stick to backgrounds at the lightness extremes.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Practical tips</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>Pick brand colors in HSL.</strong> Your designer can describe them naturally; you can extend them mathematically.</li>
          <li><strong>Always test contrast at design time,</strong> not after launch when retrofitting accessibility is expensive.</li>
          <li><strong>Use CSS custom properties</strong> for theme colors. Switching to dark mode becomes a matter of swapping a handful of variables.</li>
          <li><strong>Don&apos;t forget hover and focus states</strong> — they often have weaker contrast than the resting state.</li>
        </ul>
      </div>
    ),
};
