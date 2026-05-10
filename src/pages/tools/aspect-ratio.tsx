import Head from 'next/head';
import AspectRatio from '../../components/Tools/AspectRatio';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/aspect-ratio';

const FAQS = [
  { q: 'What is an aspect ratio?', a: 'An aspect ratio is the proportional relationship between width and height, expressed as W:H. A 1920×1080 image has a 16:9 ratio — because both numbers divide evenly by 120. Aspect ratios define the "shape" of a frame regardless of its pixel dimensions.' },
  { q: 'What is the difference between contain and cover?', a: 'Contain scales an image to fit entirely inside a box, adding letterboxing (empty space) if needed — nothing is cropped. Cover scales an image to fill the box completely, cropping the sides or top/bottom if the aspect ratios don\'t match.' },
  { q: 'What aspect ratio should I use for YouTube?', a: 'YouTube recommends 16:9 (widescreen) for standard videos. If your video is in a different ratio, YouTube will add letterboxing or pillarboxing to fill the 16:9 player frame.' },
  { q: 'What is the aspect ratio of a standard photo?', a: 'Most digital cameras and smartphones shoot at 4:3 or 3:2. DSLRs typically use 3:2 (matching 35mm film). Smartphones with portrait mode commonly use 4:5 or 9:16. Print photo sizes like 4×6 are 3:2.' },
  { q: 'How do I find the aspect ratio of an image?', a: 'Divide the width and height by their greatest common divisor. For 1920×1080, GCD(1920,1080)=120, giving 16:9. The tool does this automatically in the Image Fit Calculator section.' },
];

export default function AspectRatioPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Aspect Ratio Calculator',
    slug: SLUG,
    description: 'Calculate missing dimensions from any aspect ratio, detect image aspect ratios, and compute contain/cover fit dimensions.',
    category: 'DeveloperApplication',
    featureList: 'Calculate missing dimension, Image fit calculator, Contain and cover modes, Common presets',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Aspect Ratio Calculator — Resize, Fit & Detect Ratios | Toolisk</title>
        <meta name="description" content="Calculate missing width or height from any aspect ratio. Detect image aspect ratios. Compute contain and cover fit dimensions for any target box. Free, instant, browser-based." />
        <meta name="keywords" content="aspect ratio calculator, image aspect ratio, 16:9 calculator, contain vs cover, resize calculator, video dimensions, aspect ratio converter" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Aspect Ratio Calculator | Toolisk" />
        <meta property="og:description" content="Calculate missing dimensions, detect aspect ratios, and compute contain/cover fits." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="📐" title="Aspect Ratio Calculator" tagline="Calculate missing dimensions, detect image ratios, and find contain or cover fit dimensions for any box.">
        <AspectRatio />
      </ToolShell>

      <ToolSEOContent
        description="A three-in-one aspect ratio tool: calculate the missing dimension from a known width or height, detect the aspect ratio of any image, and compute how an image fits inside a target box using contain (letterbox) or cover (crop) scaling. Includes presets for common ratios: 16:9, 4:3, 1:1, 9:16, 21:9, and more."
        features={[
          '📐 Common presets: 16:9, 4:3, 1:1, 9:16, 21:9, 3:2, 4:5',
          '🔢 Custom ratio input (including decimals like 2.39:1)',
          '📏 Calculate missing width or height instantly',
          '🖼️ Image fit calculator (contain and cover modes)',
          '🔍 Auto-detect aspect ratio from image dimensions',
          '📋 Copy resulting dimensions',
        ]}
        steps={[
          { title: 'Pick a preset or enter a custom ratio', desc: 'Choose 16:9, 4:3, 1:1, etc., or type any custom W:H ratio.' },
          { title: 'Calculate a missing dimension', desc: 'Enter width to get height, or height to get width.' },
          { title: 'Use the fit calculator', desc: 'Enter source image dimensions and target box size to get fitted output dimensions.' },
          { title: 'Choose contain or cover', desc: 'Contain letterboxes; cover fills the box by cropping.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Common aspect ratios explained</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>16:9</strong> — standard widescreen for TV, YouTube, presentations, and most monitors</li>
              <li><strong>4:3</strong> — older TV, iPad screens, and many document-style layouts</li>
              <li><strong>1:1</strong> — Instagram square posts, profile photos, icons</li>
              <li><strong>9:16</strong> — vertical video for Instagram Stories, TikTok, and YouTube Shorts</li>
              <li><strong>21:9</strong> — ultrawide cinema and gaming monitors</li>
              <li><strong>2.39:1</strong> — anamorphic cinema, the "cinematic" movie look</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'CSS Unit Converter', href: '/tools/css-unit-converter', icon: '📐' },
          { name: 'Color Palette Generator', href: '/tools/color-palette', icon: '🎨' },
          { name: 'Image to Base64', href: '/tools/image-base64', icon: '🖼️' },
        ]}
      />
    </>
  );
}
