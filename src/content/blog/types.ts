import type { ReactNode } from 'react';

export type BlogCategory =
  | 'Investing'
  | 'Loans'
  | 'Retirement'
  | 'Mutual Funds'
  | 'Real Estate'
  | 'Tax'
  | 'Banking'
  | 'Credit'
  | 'Budgeting'
  | 'Insurance'
  | 'Web'
  | 'Developer'
  | 'Security'
  | 'Design'
  | 'API'
  | 'Data';

export interface RelatedTool {
  name: string;
  href: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  publishedDate: string;
  readTime: string;
  keywords: string;
  category: BlogCategory;
  relatedTools: RelatedTool[];
  content: ReactNode;
}

export type BlogArticleMeta = Omit<BlogArticle, 'content'>;

export function toMetaList(articles: BlogArticle[]): BlogArticleMeta[] {
  return articles
    .map(({ content: _content, ...meta }) => meta)
    .sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1));
}

export function toRecord(articles: BlogArticle[]): Record<string, BlogArticle> {
  return articles.reduce<Record<string, BlogArticle>>((acc, article) => {
    acc[article.slug] = article;
    return acc;
  }, {});
}
