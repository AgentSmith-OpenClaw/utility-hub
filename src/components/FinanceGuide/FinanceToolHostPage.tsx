import Head from 'next/head';
import { ReactNode } from 'react';

interface FinanceToolHostPageProps {
  title: string;
  description: string;
  canonicalPath: string;
  children: ReactNode;
}

export default function FinanceToolHostPage({
  title,
  description,
  canonicalPath,
  children,
}: FinanceToolHostPageProps) {
  const canonical = `https://toolisk.com${canonicalPath}`;

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description,
    url: canonical,
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="noindex,follow" />
        <link rel="canonical" href={canonical} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      </Head>
      {children}
    </>
  );
}
