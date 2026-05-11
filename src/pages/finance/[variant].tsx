import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';

import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import {
  generateBreadcrumbs,
  generateFaqSchema,
  generateSoftwareAppSchema,
  SITE_URL,
} from '../../utils/siteConfig';

import { CALCULATORS } from '../../content/finance-variants/_calculators';
import {
  ALL_VARIANT_SLUGS,
  VARIANT_BY_SLUG,
  getCanonicalPathForCalculator,
  getPeerVariants,
} from '../../content/finance-variants/_registry';
import type {
  FinanceVariant,
  LongformBlock,
} from '../../content/finance-variants/_types';

// ---- longform renderer (data → JSX) ----
function renderLongform(blocks: LongformBlock[]) {
  return (
    <section className="space-y-4">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h2':
            return (
              <h2 key={i} className="text-2xl font-bold text-slate-900 mt-4">
                {b.text}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={i} className="text-xl font-bold text-slate-900 mt-2">
                {b.text}
              </h3>
            );
          case 'p':
            return (
              <p key={i} className="text-slate-600 leading-relaxed">
                {b.text}
              </p>
            );
          case 'ul':
            return (
              <ul key={i} className="list-disc pl-6 space-y-1.5 text-slate-600">
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="list-decimal pl-6 space-y-1.5 text-slate-600">
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ol>
            );
          case 'callout': {
            const toneClass =
              b.tone === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : b.tone === 'tip'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-blue-50 border-blue-200 text-blue-900';
            return (
              <div
                key={i}
                className={`border rounded-2xl p-5 text-sm leading-relaxed ${toneClass}`}
              >
                {b.text}
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </section>
  );
}

interface PageProps {
  slug: string;
}

export default function FinanceVariantPage({ slug }: PageProps) {
  const variant: FinanceVariant | undefined = VARIANT_BY_SLUG[slug];
  if (!variant) return null; // unreachable: getStaticPaths enforces valid slugs

  const Calculator = CALCULATORS[variant.calculatorId];
  const path = `/finance/${variant.slug}`;
  const url = `${SITE_URL}${path}`;

  // ---- JSON-LD ----
  const breadcrumbSchema = generateBreadcrumbs(path);
  const softwareSchema = generateSoftwareAppSchema({
    name: variant.schema?.softwareName ?? variant.hero.h1,
    slug: path,
    description: variant.seo.metaDescription,
    category: 'FinanceApplication',
    featureList: variant.schema?.softwareFeatures,
  });
  const faqSchema = generateFaqSchema(variant.content.faqs);

  // ---- cross-linking ----
  const peers = (variant.showPeers ?? true) ? getPeerVariants(variant.slug) : [];
  const canonicalCalculatorPath = getCanonicalPathForCalculator(variant.calculatorId);

  // Build a related-tools list: explicit + main calculator + a couple of peers
  const peerLinks = peers.slice(0, 3).map((p) => ({
    name: p.hero.breadcrumbLabel,
    href: `/finance/${p.slug}`,
    icon: p.hero.icon,
  }));
  const explicit = variant.relatedTools ?? [];
  // Dedupe by href
  const seenHrefs = new Set<string>();
  const combinedRelated = [...explicit, ...peerLinks].filter((r) => {
    if (seenHrefs.has(r.href)) return false;
    seenHrefs.add(r.href);
    return true;
  });

  const ogTitle = variant.seo.ogTitle ?? variant.seo.title;
  const ogDescription = variant.seo.ogDescription ?? variant.seo.metaDescription;

  return (
    <>
      <Head>
        <title>{variant.seo.title}</title>
        <meta name="description" content={variant.seo.metaDescription} />
        <meta name="keywords" content={variant.seo.keywords} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]),
          }}
        />
      </Head>

      <ToolShell
        parent="finance"
        icon={variant.hero.icon}
        title={variant.hero.h1}
        tagline={variant.hero.tagline}
        gradient={variant.hero.gradient}
      >
        <Calculator hideHeader />
      </ToolShell>

      <ToolSEOContent
        description={variant.content.aboutDescription}
        features={variant.content.features}
        steps={variant.content.steps}
        faqs={variant.content.faqs}
        body={variant.content.longform ? renderLongform(variant.content.longform) : undefined}
        relatedTools={combinedRelated}
      />

      {/* Peer-variants hub strip (additional internal linking beyond the related-tools card) */}
      {peers.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                More views of the same calculator
              </h2>
              <Link
                href={canonicalCalculatorPath}
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Open main calculator →
              </Link>
            </div>
            <p className="text-sm text-slate-600 mb-5">
              Same underlying engine, written for different use cases. Pick the angle that
              matches your situation.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {peers.map((p) => (
                <Link
                  key={p.slug}
                  href={`/finance/${p.slug}`}
                  className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-sm transition-all"
                >
                  <span className="text-xl">{p.hero.icon}</span>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">
                      {p.hero.breadcrumbLabel}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                      {p.hero.tagline}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ALL_VARIANT_SLUGS.map((slug) => ({ params: { variant: slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const slug = params?.variant as string;
  return { props: { slug } };
};
