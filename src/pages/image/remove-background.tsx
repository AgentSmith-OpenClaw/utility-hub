import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const RemoveBackground = dynamic(() => import('../../components/Image/RemoveBackground'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-slate-500 text-sm">Loading…</div>,
});

const SLUG = '/image/remove-background';

const FAQS = [
  { q: 'Is my photo uploaded to a server?', a: 'No. The entire AI background removal runs in your browser. Your image never leaves your device, never touches our servers, and is never logged or stored anywhere. The ~20 MB AI model loads once and runs locally.' },
  { q: 'What image formats are supported?', a: 'JPG, PNG, WebP, AVIF, GIF, BMP, and HEIC (iPhone photos). The output is always a transparent PNG, so you get a clean cutout with no background.' },
  { q: 'What is the maximum file size?', a: 'You can process images up to 50 MB. Files over 25 MB will show a warning since processing may be slower on mobile devices. For best results, use images under 20 MB.' },
  { q: 'Will this work on mobile?', a: 'Yes, on modern mobile browsers (Chrome, Safari, Firefox). The AI model is ~20 MB and downloads once, then runs locally. Large images may be slower on phones due to memory constraints. iOS Safari handles the WASM model well.' },
  { q: 'Where does the AI model run? On your server?', a: 'The AI model downloads to your browser and runs entirely on your device using WebAssembly. It never talks to any server. After the first download (cached by your browser), subsequent uses are instant. There is no server-side processing — all AI inference happens in your browser tab.' },
  { q: 'How big is the AI model? Will it use my data?', a: 'The model bundle is about 20 MB and downloads once, then your browser caches it. No image data is ever sent anywhere. The model is a quantized IS-Net neural network compiled to WebAssembly — it runs fully offline after the first load.' },
  { q: 'What image formats can the result be?', a: 'The output is always a transparent PNG — the only common web format that supports an alpha (transparency) channel. If you need a JPG result, the background would be filled with white, which defeats the purpose of removal. You can convert the PNG to other formats afterward using our Convert to JPG or WebP tools.' },
  { q: 'How good is the quality? Compared to remove.bg?', a: 'The quality is comparable to remove.bg for most photos — especially portraits, products, and objects with clear edges. Because it runs locally with the IS-Net model, there is no server-side quality degradation from recompression. The key advantage is privacy: remove.bg uploads your photo to their servers; this tool never does.' },
];

export default function RemoveBackgroundPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Background Remover',
    slug: SLUG,
    description: 'Remove image backgrounds instantly with AI — runs in your browser, 100% private, no upload. Get transparent PNGs in seconds.',
    category: 'UtilitiesApplication',
    featureList: 'AI background removal, Browser-based WebAssembly, IS-Net neural network, Transparent PNG output, No upload, No sign-up, Privacy-first, Offline capable',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Remove Background from Image — Free AI, No Upload, Private | Toolisk</title>
        <meta name="description" content="Remove image backgrounds instantly with AI — runs in your browser, 100% private, no upload. Get transparent PNGs. Free, no sign-up." />
        <meta name="keywords" content="remove background, background remover, remove background no upload, ai background remover online private, free background removal, remove bg, transparent png, cutout image, no upload background remover" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Background Remover | Toolisk" />
        <meta property="og:description" content="Remove image backgrounds with AI — 100% in your browser, no upload, private. Free and instant." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="🪄"
        title="Background Remover"
        tagline="Remove image backgrounds instantly with AI — runs in your browser, 100% private, no upload. Get transparent PNGs."
        gradient="from-sky-600 via-blue-600 to-cyan-500"
        parent="image"
      >
        <RemoveBackground />
      </ToolShell>

      <ToolSEOContent
        description="Erase image backgrounds with one click — no upload, no server, no privacy risk. Upload any photo, the AI model downloads once and runs locally in your browser via WebAssembly, producing a clean transparent PNG. Your photo never leaves your device for AI processing, unlike remove.bg and most competitors that send your image to a server."
        features={[
          '🔒 100% client-side — your photo never leaves your device for AI processing',
          '🧠 IS-Net neural network compiled to WebAssembly — runs entirely in your browser',
          '🪄 One-click background removal with AI — no manual masking or editing',
          '🖼️ Output is a transparent PNG — perfect for product photos, portraits, and composites',
          '📥 Model caches after first download (~20 MB) — instant reuse',
          '🆓 Free forever, no sign-up, no watermark, no upload',
        ]}
        steps={[
          { title: 'Upload your image', desc: 'Drag and drop any JPG, PNG, WebP, or HEIC photo — up to 50 MB. Works with portraits, products, and objects.' },
          { title: 'AI model loads', desc: 'The ~20 MB AI model downloads once to your browser (cached for next time). No data leaves your device.' },
          { title: 'Remove background', desc: 'Click "Remove Background" — the IS-Net neural network runs locally via WebAssembly and processes your image in seconds.' },
          { title: 'Download transparent PNG', desc: 'See the original and background-removed result side by side. Download the transparent PNG — ready for composites, websites, or social media.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">How AI background removal works — without the privacy compromise</h2>
            <p className="text-slate-600 leading-relaxed">
              For years, removing a background from a photo meant either spending 20 minutes with Photoshop&apos;s pen tool or uploading your image to a third-party service like remove.bg. Those services process millions of photos daily on their own servers — every portrait, every product shot, every private moment uploaded to someone else&apos;s infrastructure. This tool takes a fundamentally different approach: the AI model downloads once to your browser (~20 MB) and runs locally using WebAssembly. The neural network — an IS-Net segmentation model trained to distinguish foreground from background — executes entirely on your device. Your photo never leaves the tab.
            </p>
            <p className="text-slate-600 leading-relaxed">
              As a concrete example: a 4.7 MB JPEG portrait from a smartphone (4032 × 3024 pixels) typically processes in 3–7 seconds on a modern laptop and outputs a 1–3 MB transparent PNG with a clean cutout. The same image on a phone takes 8–15 seconds depending on the device — still faster than uploading and waiting for a server round-trip. The first use downloads the ~20 MB model bundle (one-time, cached by your browser). Subsequent uses are instant because the model is already on your device.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Why no-upload matters for background removal</h3>
            <p className="text-slate-600 leading-relaxed">
              Photos you process through background removal are often sensitive — product prototypes under NDA, ID documents being prepared for applications, private portraits, medical reference images, or unreleased creative work. Upload-based background removers (remove.bg, Adobe Express, Canva, and many others) require sending your full-resolution image to a remote server for GPU inference. You have no audit trail, no deletion guarantee, no way to verify the image was purged from cache layers, and no control over whether it was logged for model training or quality evaluation. This tool processes everything locally. The model runs in your browser. The only network request is the initial model download from the IMG.LY CDN — after that, the tool works entirely offline. Zero bytes of your image are transmitted to any server.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">The IS-Net model: what is it and why it matters</h3>
            <p className="text-slate-600 leading-relaxed">
              The IMG.LY background removal library uses IS-Net (Image Segmentation Network), a deep learning model designed specifically for salient object detection — figuring out which parts of an image are the &quot;subject&quot; versus the background. The model shipped in this tool is quantized (isnet_quint8), striking a balance between accuracy and download size. Quantization reduces the model weights from 32-bit floats to 8-bit integers, cutting the download to ~20 MB while maintaining &gt;95% of the original accuracy. The model runs on WebAssembly, meaning it compiles to a near-native binary format that executes in the browser&apos;s sandbox at speeds approaching native code. No GPU required — it runs efficiently on CPU via SIMD instructions available in modern browsers.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Use cases: from e-commerce to creative workflows</h3>
            <p className="text-slate-600 leading-relaxed">
              The most common use cases for background removal are e-commerce product photography (cutting out items for white-background listing images), portrait editing for social media or professional headshots, and graphic design where subjects need to be composited onto new backgrounds. Other uses include creating stickers or emoji from photos, preparing ID-style portraits, isolating signatures, and cleaning up document scans. Because the output is always a transparent PNG, you can drop the result directly into any design tool, presentation, or web project without additional editing.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">Feature</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">This tool</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-700 border-b border-slate-200">remove.bg / upload tools</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Privacy</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">100% client-side — AI runs on your device</td>
                    <td className="px-4 py-2.5 text-slate-500">Image uploaded to remote server</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Speed (first use)</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">3–7 sec process + model download</td>
                    <td className="px-4 py-2.5 text-slate-500">Upload + server queue + process + download</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Speed (repeat use)</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Instant — model is cached</td>
                    <td className="px-4 py-2.5 text-slate-500">Same upload delay every time</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">Data retention risk</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">None — images never leave your device</td>
                    <td className="px-4 py-2.5 text-slate-500">Server logs, CDN caches, model training</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-slate-700">Cost & limits</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Free, unlimited, no sign-up</td>
                    <td className="px-4 py-2.5 text-slate-500">Free tier limits, watermark, or subscription</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        }
        relatedTools={[
          { name: 'Image Compressor', href: '/image/compress-image', icon: '🗜️' },
          { name: 'Image Resizer', href: '/image/resize-image', icon: '📐' },
          { name: 'Convert to PNG', href: '/image/convert-to-png', icon: '🖼️' },
        ]}
      />
    </>
  );
}
