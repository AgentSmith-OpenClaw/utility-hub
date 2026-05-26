import Head from 'next/head';
import GradientGenerator from '../../components/Tools/GradientGenerator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/gradient-generator';

const FAQS = [
  { q: 'What is the difference between linear, radial, and conic gradients?', a: 'A linear gradient transitions colors along a straight line at a specified angle. A radial gradient transitions from a center point outward in a circle or ellipse. A conic gradient transitions colors around a center point like a color wheel — useful for pie charts and color dials.' },
  { q: 'How do I set the angle for a linear gradient?', a: 'The angle determines the direction of the gradient line. 0° goes up, 90° goes right, 180° goes down, and 270° goes left. Use the slider or type a value — common angles are 135° (top-left to bottom-right) and 180° (top to bottom).' },
  { q: 'Can I copy the CSS with vendor prefixes?', a: 'Yes — switch to "Full" output mode to get the standard, -webkit-, and -moz- prefixed versions all together. The "CSS" mode gives just the standard property for modern browsers. The "Tailwind" mode shows the JSX style attribute format.' },
  { q: 'How many color stops can I add?', a: 'You can add up to 6 color stops. Two is the minimum, which creates a simple two-color blend. Adding stops at different positions lets you create multi-tone gradients, sharp transitions, or banded effects.' },
  { q: 'What is a conic gradient used for?', a: 'Conic gradients are used for pie charts, color wheels, hue dials, and gauge indicators. They rotate colors around a center point, which makes them ideal for any UI element that represents proportions or rotational data.' },
  { q: 'How do I use the gradient in Tailwind CSS?', a: 'Tailwind does not have built-in gradient utilities for arbitrary multi-stop gradients. Use the "Tailwind" output mode to get a JSX style attribute you can paste directly into your component. For simple two-color gradients, you can use Tailwind\'s bg-gradient-to-* utilities with from-* and to-* classes.' },
];

export default function GradientGeneratorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'CSS Gradient Generator',
    slug: SLUG,
    description: 'Build CSS linear, radial, and conic gradients visually with unlimited color stops. Copy production CSS, vendor-prefixed CSS, or Tailwind style.',
    category: 'UtilitiesApplication',
    featureList: 'Linear, radial, and conic gradients, Unlimited color stops, Angle and position control, 8 ready-made presets, Vendor prefix output, Tailwind JSX format',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>CSS Gradient Generator — Linear, Radial & Conic | Toolisk</title>
        <meta name="description" content="Free CSS gradient generator. Build linear, radial, and conic gradients visually with color stops, angle control, and presets. Copy CSS, vendor-prefixed, or Tailwind output." />
        <meta name="keywords" content="css gradient generator, linear gradient, radial gradient, conic gradient, gradient css, gradient maker, css gradient tool, background gradient generator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="CSS Gradient Generator | Toolisk" />
        <meta property="og:description" content="Build CSS gradients visually — linear, radial, and conic with live preview and instant copy." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🌈" title="CSS Gradient Generator" tagline="Build linear, radial, and conic gradients visually — drag color stops, tweak angles, and copy production CSS in one click.">
        <GradientGenerator />
      </ToolShell>

      <ToolSEOContent
        description="A visual CSS gradient builder that supports all three gradient types: linear (straight-line blends at any angle), radial (circular or elliptical blends from a center point), and conic (color wheel blends). Add up to 6 color stops, adjust positions with sliders, and pick from 8 curated presets. Output in standard CSS, vendor-prefixed CSS, or Tailwind JSX format."
        features={[
          '📐 Linear, radial, and conic gradient types',
          '🎨 Up to 6 color stops with position sliders',
          '🔄 8 curated presets (Sunset, Ocean, Forest, more)',
          '📋 Copy as CSS, vendor-prefixed, or Tailwind JSX',
          '🎯 Quick angle buttons for common directions',
          '👁️ Live preview with instant updates',
        ]}
        steps={[
          { title: 'Pick a gradient type', desc: 'Choose linear, radial, or conic from the type selector.' },
          { title: 'Set the direction', desc: 'Use the angle slider (linear/conic) or shape toggle (radial) to control the gradient direction.' },
          { title: 'Customize color stops', desc: 'Click the color pickers to change colors, drag the position sliders to adjust placement, and add stops with the + button.' },
          { title: 'Copy the CSS', desc: 'Switch between CSS, Full (with vendor prefixes), or Tailwind format, then click Copy.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">CSS gradient syntax</h2>
            <p className="text-slate-600 leading-relaxed">
              The three gradient functions in CSS are:{' '}
              <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">linear-gradient()</code>,{' '}
              <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">radial-gradient()</code>, and{' '}
              <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">conic-gradient()</code>.
              Each accepts a direction (angle or shape) followed by a comma-separated list of color stops with optional position percentages.
            </p>
            <p className="text-slate-600 leading-relaxed">
              For example, <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">linear-gradient(135deg, #6366f1 0%, #ec4899 100%)</code>{' '}
              creates a purple-to-pink blend from the top-left corner to the bottom-right. The position percentages tell the browser where each color should be fully saturated.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-6">When to use each gradient type</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Linear:</strong> The workhorse — use it for hero backgrounds, card overlays, buttons, and most UI elements. The 135° angle is the most common direction (top-left to bottom-right).</li>
              <li><strong>Radial:</strong> Use for spotlight effects, vignettes, glowing orbs, or any design where color radiates from a center point. Change between circle and ellipse depending on whether the element is square or rectangular.</li>
              <li><strong>Conic:</strong> Use for pie charts, color wheels, gauge indicators, and rotational visual effects. Not supported in older browsers (requires Safari 12.1+, Chrome 69+).</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mt-6">Color stop positioning tips</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Two stops = clean blend:</strong> Position at 0% and 100% for a smooth, even transition. This is the most common gradient.</li>
              <li><strong>Hard lines:</strong> Place two stops at the same position (e.g., 0% blue at 50% and 0% green at 50%) to create a sharp boundary with no transition.</li>
              <li><strong>Three stops = depth:</strong> Add a middle color (e.g., blue at 0%, purple at 50%, pink at 100%) for more visual richness without being garish.</li>
              <li><strong>Uneven spacing:</strong> Moving stops closer together compresses the transition; spacing them further apart stretches it.</li>
            </ul>

            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 text-sm text-teal-900">
              <strong>Browser support tip:</strong> Linear and radial gradients work in all modern browsers. Conic gradients require Chrome 69+, Firefox 83+, Safari 12.1+, and Edge 79+. If you need wider support, switch to the &ldquo;Full&rdquo; output mode which includes -webkit- prefixes.
            </div>
          </section>
        }
        relatedTools={[
          { name: 'Color Converter', href: '/tools/color-converter', icon: '🎨' },
          { name: 'CSS Box Shadow Generator', href: '/tools/box-shadow-generator', icon: '🌗' },
          { name: 'CSS Unit Converter', href: '/tools/css-unit-converter', icon: '📏' },
        ]}
      />
    </>
  );
}