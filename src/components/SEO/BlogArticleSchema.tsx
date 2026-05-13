import Head from 'next/head';

interface BlogArticleSchemaProps {
  title: string;
  description: string;
  slug: string;
  category: string;
  publishedDate: string;
  readTime: string;
  keywords: string;
  baseUrl?: string;
  section?: 'finance' | 'tools';
}

export const BlogArticleSchema = ({
  title,
  description,
  slug,
  category,
  publishedDate,
  readTime,
  keywords,
  baseUrl = 'https://toolisk.com',
  section = 'finance',
}: BlogArticleSchemaProps) => {
  const url = `${baseUrl}/${section}/learn/${slug}`;

  const readingTimeMinutes = parseInt(readTime);
  const estimatedTime = `PT${readingTimeMinutes}M`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    articleBody: description,
    url,
    wordCount: Math.round((readingTimeMinutes * 200) / 1),
    timeRequired: estimatedTime,
    keywords,
    articleSection: category,
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: {
      '@type': 'Organization',
      name: 'Toolisk',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.svg`,
        width: 200,
        height: 200,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Toolisk',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.svg`,
        width: 200,
        height: 200,
      },
    },
    isAccessibleForFree: true,
  };

  return (
    <Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </Head>
  );
};

export default BlogArticleSchema;
