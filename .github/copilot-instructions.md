# Utility Hub Agent Instructions

## Calculator component rules (STRICT)
- Calculator component files (`/src/components/*/`) must contain ONLY:
  - Calculator logic (state, hooks, computations)
  - Calculator UI (inputs, sliders, result cards, charts, tables)
  - Export/share functionality
- NEVER add any of the following inside a component file:
  - Educational guides or "How it works" explanations
  - FAQs or FAQ sections
  - "What is X?" explanatory content
  - "How to use this calculator" text
  - SEO content sections or `<article>` blocks for long-form content
- All written content (guides, FAQs, explanations) must live exclusively in the enclosing page file at `/src/pages/finance/*-calculator.tsx`.
- This rule exists to avoid duplicate content — the page wraps the component and adds content below it. Adding content inside the component creates duplication.

## Finance calculator page structure
- All finance calculator pages live at `/finance/*-calculator` routes.
- Each page should import the calculator component at the top, then include 800+ words of inline content directly in the same file.
- DO NOT create abstraction layers like "FinanceGuidePage" or separate content files.
- DO NOT create split routes like `/finance/tools/*` - all content and calculator stay on the same page.

## Page structure pattern (simple, inline):
```tsx
import Head from 'next/head';
import Link from 'next/link';
import CalculatorComponent from '../../components/CalculatorComponent/CalculatorComponent';

export default function CalculatorPage() {
  const faqSchema = { /* FAQ structured data */ };
  const softwareSchema = { /* Calculator tool structured data */ };
  
  return (
    <>
      <Head>
        {/* SEO metadata, canonical, schemas */}
      </Head>
      
      <CalculatorComponent />
      
      <article className="max-w-5xl mx-auto px-4 py-12 bg-white">
        {/* 800+ words of practical, unique content directly here */}
      </article>
    </>
  );
}
```

## SEO content requirements
- Every finance page must contain at least 800 words of genuinely helpful, non-filler content.
- Content must be practical, direct, and conversational in tone.
- Avoid duplicate sections across pages. Each page should have unique angle, examples, and FAQs.
- Avoid thin pages and avoid repeated SEO blocks that create near-duplicate content.
- Include unique title, meta description, headings, FAQ content, and structured data per page.
- Keep internal linking relevant and useful (not excessive keyword stuffing).

## Reusability approach
- If you need to create another content page for the same calculator in the future, simply:
  1. Create a new route like `/finance/advanced-<tool>-calculator`
  2. Import the same calculator component
  3. Write different inline content below it
- This keeps pages simple, maintainable, and SEO-friendly without over-engineering.
