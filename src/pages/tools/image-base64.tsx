import Head from 'next/head';
import ImageBase64 from '../../components/Tools/ImageBase64';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/image-base64';

const FAQS = [
  { q: 'What is an image data URL?', a: 'A data URL embeds the image\'s binary content directly in a string using Base64 encoding, prefixed with the MIME type (e.g., data:image/png;base64,...). Browsers can use this string as an img src without fetching from a server.' },
  { q: 'Why does Base64 increase file size?', a: 'Base64 represents every 3 bytes of binary data as 4 ASCII characters, adding roughly 33% overhead. A 100 KB image becomes about 133 KB as a Base64 string — so use data URLs only for small images to avoid performance penalties.' },
  { q: 'Which image formats are supported?', a: 'Any image format your browser supports: PNG, JPEG/JPG, GIF, WebP, SVG, BMP, ICO, and AVIF. The MIME type is auto-detected from the uploaded file.' },
  { q: 'Is my image uploaded to a server?', a: 'No. Encoding and decoding happen entirely in your browser using the FileReader API and atob/btoa. Your image never leaves your device.' },
  { q: 'When should I use Base64 images?', a: 'Use them for small UI icons (under 2 KB) in CSS or HTML to eliminate HTTP requests, for email HTML images that must be self-contained, and for local testing when you cannot host assets.' },
];

export default function ImageBase64Page() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Image to Base64 Converter',
    slug: SLUG,
    description: 'Convert images to Base64 data URLs and back. Drag-and-drop upload, MIME type detection, and inline preview.',
    featureList: 'Drag and drop, Data URL, Base64 only output, MIME detection, Decode back to image',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Image to Base64 Converter — Free Online Tool | Toolisk</title>
        <meta name="description" content="Convert any image to a Base64 data URL instantly. Drag-and-drop or browse. Get the full data URL or Base64-only string. Decode Base64 back to images. 100% browser-based." />
        <meta name="keywords" content="image to base64, base64 image converter, data url generator, base64 encode image, img src base64, png to base64, jpg to base64" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Image to Base64 Converter | Toolisk" />
        <meta property="og:description" content="Convert images to Base64 data URLs and back. Drag-and-drop, instant preview, browser-only." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🖼️" title="Image to Base64 Converter" tagline="Drop an image to get its Base64 data URL — or paste Base64 to decode it back to an image.">
        <ImageBase64 />
      </ToolShell>

      <ToolSEOContent
        description="Convert any image to a Base64-encoded data URL for use directly in HTML, CSS, or JavaScript without a server. Supports PNG, JPEG, GIF, WebP, SVG, and more. Also decodes Base64 strings back to viewable images."
        features={[
          '🖱️ Drag-and-drop or click to upload',
          '🔍 Automatic MIME type detection',
          '📋 Copy full data URL or Base64-only string',
          '↩️ Decode Base64 back to viewable image',
          '📊 Shows file size and Base64 overhead',
          '🔒 100% browser-based — no uploads',
        ]}
        steps={[
          { title: 'Upload an image', desc: 'Drag and drop any image onto the upload area, or click to browse.' },
          { title: 'Copy the data URL', desc: 'Grab the full data:image/... string for use as an img src or CSS background-image.' },
          { title: 'Or copy Base64 only', desc: 'Some tools only want the raw Base64 without the MIME prefix.' },
          { title: 'Decode back', desc: 'Switch to Base64 → Image mode to preview and download an encoded image.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Practical uses of image Base64</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>HTML email:</strong> embed images inline so they display even when a mail client blocks external URLs.</li>
              <li><strong>Single-file apps:</strong> bundle all assets into one HTML file with no external dependencies.</li>
              <li><strong>CSS sprites replaced:</strong> inline small icons as background-image without an extra HTTP request.</li>
              <li><strong>localStorage:</strong> persist small images across sessions by storing the Base64 string.</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Base64 Encoder / Decoder', href: '/tools/base64', icon: '🔐' },
          { name: 'URL Encoder / Decoder', href: '/tools/url-encoder', icon: '🔗' },
          { name: 'Color Converter', href: '/tools/color-converter', icon: '🎨' },
        ]}
      />
    </>
  );
}
