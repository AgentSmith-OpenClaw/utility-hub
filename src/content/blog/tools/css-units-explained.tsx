import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, CodeSnippet, KeyTakeaways } from '../components';

export const cssUnitsExplained: BlogArticle = {
  slug: 'css-units-explained',
  category: 'Web',
  title: 'CSS Units Explained: px, em, rem, vw, vh, and the Rest',
  description:
    "Eight CSS units, four mental models, and one decision tree for picking the right one. With the actual rules browsers apply when they compute final pixel values.",
  publishedDate: '2026-05-10',
  readTime: '11 min read',
  keywords:
    'css units, px vs rem, em vs rem, vw vh units, css length values, responsive css, css unit converter',
  relatedTools: [
    { name: 'CSS Unit Converter', href: '/tools/css-unit-converter' },
    { name: 'Color Converter', href: '/tools/color-converter' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        CSS gives you eight common length units, and they all reduce to pixels at render time. The interesting part
        is <em>how</em> they reduce — that&apos;s where designs scale gracefully or break in ways that take 30 minutes
        to debug.
      </Lead>

      <H2>The four families of units</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Absolute:</strong> px, pt, pc. Fixed regardless of context.</li>
        <li><strong>Font-relative:</strong> em, rem, ex, ch. Scale with font size.</li>
        <li><strong>Viewport-relative:</strong> vw, vh, vmin, vmax. Scale with the viewport.</li>
        <li><strong>Container-relative:</strong> %, cqw, cqh, cqi, cqb. Scale with the parent or container.</li>
      </ul>

      <H2>px — the absolute "pixel"</H2>
      <p>
        CSS pixels are not physical pixels. They&apos;re a logical unit defined as 1/96th of an inch at a "reference
        viewing distance." On a typical monitor, 1 CSS px ≈ 1 device pixel. On a Retina or 4K display, 1 CSS px ≈ 2 or
        more device pixels — the browser doubles up so 16px text doesn&apos;t look microscopic.
      </p>
      <p>
        When to use: borders, shadow offsets, hairline rules, anything you want pinned to a real visual size regardless
        of the user&apos;s zoom or font preference.
      </p>

      <H2>em — relative to the parent&apos;s font size</H2>
      <p>
        <code>1em</code> equals the computed font size of the element itself (or its parent for non-font-size properties).
        This is a footgun for compounding: a child element with <code>font-size: 1.2em</code> inside a parent with
        <code> font-size: 1.2em</code> ends up at 1.44× the grandparent&apos;s size.
      </p>
      <CodeSnippet>
{`.outer { font-size: 18px; }   /* 18px */
.middle { font-size: 1.2em; } /* 21.6px (18 × 1.2) */
.inner { font-size: 1.2em; }  /* 25.92px (21.6 × 1.2) */`}
      </CodeSnippet>
      <p>
        When to use: component-internal scaling. If you want padding to grow with the button&apos;s text size, use em
        for the padding. The button gets larger and smaller in proportion to its own type.
      </p>

      <H2>rem — relative to the root</H2>
      <p>
        <code>1rem</code> equals the computed font size of <code>&lt;html&gt;</code>. Default is 16px in every modern
        browser. Unlike em, rem doesn&apos;t compound — every <code>1rem</code> on the page is the same value.
      </p>
      <p>
        When to use: most font sizes, spacing, and layout dimensions. The root font-size respects user accessibility
        zoom settings, so rem-based designs scale gracefully when users bump up their browser font preference.
      </p>

      <Callout title="The 62.5% trick" accent="indigo">
        Setting <code>html {'{ font-size: 62.5%; }'}</code> makes 1rem = 10px, so 1.6rem = 16px and so on. Cute math
        trick, but it breaks accessibility — users who set their browser default to 20px now get 12.5px. Use 16px
        defaults; live with the math.
      </Callout>

      <H2>% — relative to the parent property</H2>
      <p>
        Percent is interpreted in terms of the parent element&apos;s value of the <em>same property</em>. So 50% width
        is half the parent&apos;s width; 50% font-size is half the parent&apos;s font-size; 50% padding-top is half the
        parent&apos;s width (yes, top padding uses parent width — surprise gotcha).
      </p>
      <p>
        When to use: child widths within a flex/grid container, image aspect ratios, anything tied to a parent box.
      </p>

      <H2>vw, vh, vmin, vmax — the viewport units</H2>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>1vw</strong> = 1% of the viewport width.</li>
        <li><strong>1vh</strong> = 1% of the viewport height.</li>
        <li><strong>vmin</strong> = the smaller of vw and vh.</li>
        <li><strong>vmax</strong> = the larger of vw and vh.</li>
      </ul>
      <p>
        When to use: hero sections that should always fill the screen, fluid typography (<code>font-size: clamp(16px,
        1vw + 12px, 24px)</code>), full-bleed elements that need to ignore parent containers.
      </p>
      <H3>The mobile vh problem</H3>
      <p>
        On mobile browsers, 100vh historically included the area covered by the address bar — so a 100vh hero would
        have a chunk hidden under Safari&apos;s collapsing toolbar. The newer units <code>svh</code> (small viewport
        height), <code>lvh</code> (large), and <code>dvh</code> (dynamic) solve this. Use <code>100dvh</code> when you
        want the hero to always be exactly the visible viewport regardless of toolbar state.
      </p>

      <H2>ch and ex — the type-aware units</H2>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>1ch</strong> = the width of the "0" character in the current font.</li>
        <li><strong>1ex</strong> = the x-height of the current font.</li>
      </ul>
      <p>
        When to use: <code>max-width: 70ch</code> on body text gives roughly the optimal reading line length (60–80
        characters per line) regardless of font. Excellent for long-form content.
      </p>

      <H2>Container query units (cqw, cqh, cqi, cqb)</H2>
      <p>
        Newer in 2023+. Like vw/vh but relative to the nearest container declared with <code>container-type: inline-size</code>.
        Lets you size things based on the component&apos;s actual width rather than the viewport — a long-overdue piece
        of CSS finally landed.
      </p>

      <H2>The decision tree</H2>
      <ol className="list-decimal pl-6 space-y-3 my-4">
        <li>Hairline borders, shadows, sub-pixel UI: <strong>px</strong>.</li>
        <li>Most font sizes and spacing: <strong>rem</strong>.</li>
        <li>Component-internal proportional scaling: <strong>em</strong>.</li>
        <li>Hero / full-bleed: <strong>vw / vh</strong> (or dvh on mobile).</li>
        <li>Reading-friendly text width: <strong>ch</strong>.</li>
        <li>Component-aware sizing: <strong>cqw / cqi</strong>.</li>
        <li>Children inside flex/grid containers: <strong>%</strong>.</li>
      </ol>

      <Callout title="Convert anything" accent="emerald">
        For quick conversions between units, use the Toolisk CSS Unit Converter. It supports custom root and viewport
        contexts so you can match your project&apos;s actual setup.
      </Callout>

      <KeyTakeaways
        items={[
          'px is absolute (browser-managed); pt/pc are print-era leftovers.',
          'em compounds (relative to parent); rem does not (relative to root).',
          'rem-based sizing respects user accessibility zoom — px-only designs do not.',
          "Use dvh, not vh, for mobile heros to handle Safari's collapsing toolbar.",
          'Container query units (cqw, cqi) finally let components size relative to themselves.',
        ]}
      />
    </div>
  ),
};
