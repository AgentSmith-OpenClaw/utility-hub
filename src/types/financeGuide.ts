export interface FinanceGuideFaq {
  question: string;
  answer: string;
}

export interface FinanceGuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface FinanceGuideLink {
  href: string;
  label: string;
}

export interface FinanceGuide {
  slug: string;
  title: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  toolPath: string;
  toolCtaLabel: string;
  intro: string[];
  sections: FinanceGuideSection[];
  faq: FinanceGuideFaq[];
  relatedLinks: FinanceGuideLink[];
}
