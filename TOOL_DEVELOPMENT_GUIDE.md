# Tool Development Guide — Utility Hub

This document provides comprehensive guidelines for developing new calculator tools for Utility Hub. All new tools must follow these standards to ensure consistency, quality, and AdSense eligibility.

**Last Updated:** February 2026  
**Reference Tools:** EMI Calculator, FIRE Calculator, SIP Wealth Planner, CompoundInterest Calculator

---

## ⚠️ CRITICAL: MANDATORY REQUIREMENTS FOR ALL TOOLS

**These are NON-NEGOTIABLE REQUIREMENTS. Any tool missing these is considered incomplete:**

### 1. 📊 Export & Share Bar (MANDATORY AT TOP OF PAGE)
- ✅ **PDF Export** button → Full report with charts using `utils/pdf.ts`
- ✅ **Excel Export** button → Data tables using `utils/excel.ts`
- ✅ **Copy Plan URL** button → Shareable link with query params
- ✅ **WhatsApp Share** button → Pre-filled message with results
- ✅ **Twitter/X Share** button → Tweet composer with results
- ⚠️ **MUST be placed at the top**, right after the header, before calculator inputs
- ⚠️ **Follow exact color scheme**: PDF/Copy=indigo, Excel/WhatsApp=teal, Twitter=sky

### 2. 📈 Multiple Charts (MINIMUM 3-4 VISUALIZATIONS)
- ✅ **Primary Chart**: Main data visualization (Area/Line chart showing growth/balance over time)
- ✅ **Breakdown Chart**: Component breakdown (Stacked Area or Pie chart)
- ✅ **Comparison Chart**: Bar chart comparing scenarios or periods
- ✅ **Additional Chart**: Year-over-year growth, cumulative totals, or other insights
- ⚠️ Use **Recharts ONLY** (Chart.js is removed from project)
- ⚠️ Use **unified CHART_COLORS constant** in every tool
- ⚠️ All charts must have **custom tooltips** with proper formatting

### 3. 📌 Sticky Calculator (IF SIDE-BY-SIDE LAYOUT)
- ✅ If calculator is on the **left** in a side-by-side design, it MUST be `sticky`
- ✅ Use: `className="lg:sticky lg:top-6 lg:self-start"`
- ✅ Prevents calculator from scrolling away when viewing charts/results
- ⚠️ Only apply on desktop (`lg:` breakpoint), not on mobile

### 4. 📝 SEO Content (MINIMUM 800 WORDS)
- ✅ **Educational Section**: Explain what the tool calculates (200-300 words)
- ✅ **How It Works**: Step-by-step explanation of methodology (200-300 words)
- ✅ **Use Cases**: Real-world scenarios and examples (200-300 words)
- ✅ **FAQs or Tips**: Common questions and best practices (200+ words)
- ⚠️ Content must be **below the calculator**, in prose format
- ⚠️ Use `<article className="prose prose-slate max-w-none">` for readability
- ⚠️ Content CANNOT be just bullet points; needs full paragraphs

### 5. 🎨 Design Consistency
- ✅ **Card Style**: `rounded-2xl shadow-md border border-slate-100` (ALL cards)
- ✅ **Page Background**: `bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20`
- ✅ **Color Palette**: Use `slate-*` (NOT `gray-*`) for all text, borders
- ✅ **Chart Colors**: Use the official `CHART_COLORS` constant (Primary=#007AFF, Secondary=#4CC9F0, Tertiary=#7209B7, Success=#2ECC71, Warning=#E74C3C)
- ✅ **Typography**: `slate-900` for headings, `slate-700` for labels, `slate-600` for body text

### 6. 📱 Responsive Design
- ✅ Mobile-first: Test on **375px** (iPhone SE), **390px** (iPhone 12), **768px** (iPad)
- ✅ Touch targets: Minimum **44px** for all buttons and interactive elements
- ✅ Grid layouts: `grid-cols-1 lg:grid-cols-3` pattern for desktop
- ✅ Export bar: Different layout for mobile vs desktop

---

## 🚨 BEFORE SUBMITTING A NEW TOOL - CHECKLIST

Copy this checklist and verify EVERY item before considering a tool complete:

```
[ ] Export/Share bar at top with ALL 5 buttons (PDF, Excel, Copy, WhatsApp, Twitter)
[ ] Minimum 3-4 different chart visualizations (not just one pie chart!)
[ ] Calculator is sticky on scroll (if side-by-side layout with calculator on left)
[ ] SEO content section with 800+ words in prose format
[ ] All cards use: rounded-2xl shadow-md border border-slate-100
[ ] Page uses: bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20
[ ] Only slate-* colors used (no gray-*)
[ ] CHART_COLORS constant defined and used
[ ] Custom chart tooltips implemented
[ ] Mobile responsive (tested at 375px, 768px, 1024px)
[ ] PDF export works (container has id attribute)
[ ] Excel export works (tool-specific export function created)
[ ] Copy URL works and includes query params
[ ] Social share messages are customized with tool results
[ ] No console errors
[ ] LocalStorage persistence works
[ ] Input validation prevents invalid states
[ ] Proper TypeScript types (no 'any')
[ ] Page metadata complete (title, description, keywords, Open Graph)
[ ] Added to homepage tools array
[ ] Added to footer navigation
[ ] Sitemap.xml updated
```

---

## Table of Contents

1. [Architecture & Technology Stack](#architecture--technology-stack)
2. [Site Structure & Routing Strategy](#site-structure--routing-strategy)
3. [Blog Content Integration](#blog-content-integration)
4. [Design System & Visual Consistency](#design-system--visual-consistency)
5. [File Structure & Code Organization](#file-structure--code-organization)
6. [Component Patterns & Best Practices](#component-patterns--best-practices)
7. [Charting & Data Visualization](#charting--data-visualization)
8. [Sharing & Export Features](#sharing--export-features-required-for-all-tools)
9. [Styling Approach](#styling-approach)
10. [Content Requirements for AdSense & SEO](#content-requirements-for-adsense--seo)
11. [Tool Implementation Checklist](#tool-implementation-checklist)
12. [Common Patterns & Examples](#common-patterns--examples)

---

## Architecture & Technology Stack

### Core Technologies

- **Framework:** Next.js 14.2+ (Static Site Generation with SSG)
- **Language:** TypeScript (required for type safety)
- **Styling:** Tailwind CSS + CSS Modules (globals only, no scoped CSS per-component)
- **State Management:** React hooks (useState, useCallback, useMemo)
- **Animations:** Framer Motion (for engaging micro-interactions)
- **Charting:** Recharts (only — Chart.js has been removed from the project)
- **Data Persistence:** localStorage (for SSG stateless design)

### Why SSG, Not SSR?

- **SSG Benefits:**
  - Pre-rendered HTML (built at build time, not request time)
  - Superior SEO performance
  - Faster page loads
  - Better AdSense compatibility (cleaner, predictable HTML)
  - Reduced server costs
  - Works perfectly for calculator tools (no per-request data needed)

- **Implementation:** All pages must be exported as static routes or use ISR (Incremental Static Regeneration) for rare dynamic cases.

### Build Output Target

- Each tool page size: **150–250 KB** (gzipped)
- Total First Load JS shared: **~91 KB** (across all pages)

---

## Site Structure & Routing Strategy

### Category-Based URL Architecture

**Goal:** Build domain authority through organized content silos that demonstrate topical expertise to search engines.

**Why Categories Matter for SEO:**
- Google ranks sites higher when they show clear topical authority
- Category-based URLs signal content organization and expertise
- Related content in the same path shares ranking signals
- Easier to build internal linking networks

### URL Structure

```
/finance/
  ├── emi-calculator          # Loan/EMI tool
  ├── fire-calculator         # FIRE/retirement tool
  └── learn/
      ├── [blog-slug]         # Educational content
      ├── understanding-emi-calculations
      ├── prepayment-strategies-guide
      ├── fire-movement-explained
      └── coast-fire-strategy
      
/developer/                    # Future category
  ├── json-compare             # Future tool
  ├── regex-tester             # Future tool
  └── learn/
      └── [blog-slug]          # Developer tutorials

/health/                       # Future category
  └── ...
```

### Current Implementation

**Finance Category Routes:**
```
✅ /finance/emi-calculator       → EMI Calculator tool
✅ /finance/fire-calculator      → FIRE Calculator tool
✅ /finance/learn/[slug]         → Blog post template
```

**Legacy Redirects:**
```
/emi-calculator  → 301 redirect → /finance/emi-calculator
/fire-calculator → 301 redirect → /finance/fire-calculator
```

### Adding New Tools

When creating a new tool, follow this pattern:

1. **Determine Category:**
   - Finance: loans, investments, retirement, budgeting
   - Developer: code tools, APIs, testing, utilities
   - Health: fitness, nutrition, medical calculators
   - Business: pricing, ROI, forecasting

2. **Create Tool Route:**
   ```
   /src/pages/[category]/[tool-name].tsx
   ```

3. **Create Redirect from Legacy URL (if applicable):**
   ```tsx
   // /src/pages/[old-tool-name].tsx
   import { useEffect } from 'react';
   import { useRouter } from 'next/router';
   import Head from 'next/head';

   export default function ToolRedirect() {
     const router = useRouter();
     useEffect(() => {
       router.replace('/[category]/[tool-name]');
     }, [router]);

     return (
       <>
         <Head>
           <meta httpEquiv="refresh" content="0; url=/[category]/[tool-name]" />
           <link rel="canonical" href="https://toolisk.com/[category]/[tool-name]" />
         </Head>
         {/* Loading spinner */}
       </>
     );
   }
   ```

4. **Update Sitemap:**
   ```xml
   <!-- /public/sitemap.xml -->
   <url>
     <loc>https://toolisk.com/[category]/[tool-name]</loc>
     <lastmod>YYYY-MM-DD</lastmod>
     <changefreq>weekly</changefreq>
     <priority>0.9</priority>
   </url>
   ```

5. **Update Homepage & Footer:**
   - Add to tools array in `/src/pages/index.tsx`
   - Add to footer links in `/src/components/Layout/Footer.tsx`

### SEO Benefits of This Structure

1. **Topical Authority:**
   - `/finance/` category signals expertise in financial tools
   - Multiple related tools + educational content = strong topical cluster

2. **Internal Linking:**
   - Blog posts link to calculators
   - Calculators link to related blog posts
   - Creates strong internal link graph

3. **Breadcrumb Potential:**
   ```
   Home > Finance > EMI Calculator
   Home > Finance > Learn > Understanding EMI Calculations
   ```

4. **Sitemap Organization:**
   - Clear hierarchy for search engines
   - Priority scoring by category depth

---

## Blog Content Integration

### Purpose of Blog Content

**SEO Strategy:**
- Google favors sites that educate, not just tools that compute
- Educational content increases time on site (engagement signal)
- Blog posts target informational keywords (top-of-funnel traffic)
- Cross-linking between blog and tools builds topical authority

**User Benefits:**
- Learn concepts before using calculator
- Understand results better after calculation
- Discover new tools through related content

### Blog Post Requirements

#### URL Pattern
```
/[category]/learn/[blog-slug]
```

Examples:
```
/finance/learn/understanding-emi-calculations
/finance/learn/prepayment-strategies-guide
/finance/learn/fire-movement-explained
/finance/learn/coast-fire-vs-traditional-retirement
```

#### File Structure

```
/src/pages/[category]/learn/
  └── [slug].tsx           # Dynamic blog template

Blog content can be:
1. Hardcoded in component (current approach)
2. Loaded from markdown files (future)
3. Fetched from CMS (future)
```

#### Minimum Blog Post Requirements

**Word Count:** 800–1500 words  
**Headings:** H1 (title) + 4-6 H2 sections  
**Links:** 2-3 internal links to related calculators  
**Images:** 1-2 relevant images (optional but recommended)  
**Meta:** title (55-60 chars), description (150-160 chars)

#### Blog Post Template

```tsx
// /src/pages/[category]/learn/[slug].tsx

import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Article content could be imported from separate file or CMS
const articles: Record<string, BlogArticle> = {
  'understanding-emi-calculations': {
    title: 'Understanding EMI Calculations: A Complete Guide',
    description: 'Learn how EMI is calculated...',
    content: `...`, // Full article HTML/JSX
    relatedTools: [
      { name: 'EMI Calculator', href: '/finance/emi-calculator' }
    ],
    publishedDate: '2026-02-13',
    readTime: '8 min read',
  },
};

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const article = slug ? articles[slug as string] : null;

  if (!article) {
    return <div>Article not found or coming soon...</div>;
  }

  return (
    <>
      <Head>
        <title>{article.title} | Toolisk Finance</title>
        <meta name="description" content={article.description} />
        <link rel="canonical" href={`https://toolisk.com/finance/learn/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={article.publishedDate} />
      </Head>

      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/">Home</Link> → <Link href="/finance">Finance</Link> → Learn
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <time>{new Date(article.publishedDate).toLocaleDateString()}</time>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {article.content}
        </div>

        {/* Related Tools CTA */}
        <aside className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Try Our Calculators
          </h3>
          <div className="space-y-2">
            {article.relatedTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-center justify-between bg-white rounded-lg px-4 py-3 hover:shadow-md transition-shadow"
              >
                <span className="font-semibold text-gray-900">{tool.name}</span>
                <span className="text-blue-600">Calculate →</span>
              </Link>
            ))}
          </div>
        </aside>
      </article>
    </>
  );
}
```

### Linking Strategy

#### From Tool to Blog

Add a "Learn More" section at the bottom of calculator pages:

```tsx
// In calculator component, after results section

<section className="mb-8">
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
      <span className="text-xl">📚</span>
      Learn More
    </h3>
    <p className="text-sm text-gray-600 mb-4">
      Understand the concepts behind the calculations with our guides:
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Link
        href="/finance/learn/understanding-emi-calculations"
        className="flex items-center justify-between bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg px-4 py-3 hover:shadow-md transition-all group"
      >
        <span className="text-sm font-semibold text-gray-900">
          Understanding EMI Calculations
        </span>
        <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
          →
        </span>
      </Link>
      {/* More links */}
    </div>
  </div>
</section>
```

#### From Blog to Tool

Include 2-3 call-to-actions within article content:

```tsx
// Inline CTA within article
<div className="my-8 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-5">
  <p className="text-sm text-gray-700 mb-2">
    <strong>Want to calculate your EMI?</strong> Try our free calculator:
  </p>
  <Link
    href="/finance/emi-calculator"
    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
  >
    Calculate EMI Now →
  </Link>
</div>
```

### Blog Post Topics by Tool

**EMI Calculator:**
1. "Understanding EMI Calculations: Formula, Factors & Examples"
2. "Prepayment Strategies: Reduce EMI vs Reduce Tenure Explained"
3. "How to Choose the Right Home Loan Tenure"
4. "Impact of Interest Rates on Your Monthly EMI"

**FIRE Calculator:**
1. "The FIRE Movement Explained: Complete Beginner's Guide"
2. "Coast FIRE vs Traditional Retirement: Which is Right for You?"
3. "How to Calculate Your FIRE Number (Step-by-Step)"
4. "The 4% Rule: Is It Still Valid in 2026?"

### Content Guidelines for Blogs

1. **Write for Beginners:**
   - Define jargon on first use
   - Use examples with real numbers
   - Break complex topics into steps

2. **Be Actionable:**
   - "How to..." formats work best
   - Include checklists or bullet points
   - End each section with a takeaway

3. **Link Contextually:**
   - Don't force links
   - Link when mentioning the calculator naturally
   - Use descriptive anchor text ("try our FIRE calculator" not "click here")

4. **SEO Best Practices:**
   - Target one primary keyword per post
   - Use keyword in: title, first paragraph, one H2, meta description
   - Add internal links to other blog posts (create content cluster)
   - Include FAQ section if possible

5. **Keep Fresh:**
   - Update dates annually
   - Revise statistics/examples as needed
   - Add new sections based on user questions

---

## Design System & Visual Consistency

### Color Palette

#### 🎨 Official Brand Color Palette (MANDATORY)

| Role | Hex | Name | Usage |
|------|-----|------|-------|
| **Primary** | `#007AFF` | Vibrant Blue | Brand color, primary charts, buttons, active states, section badges |
| **Secondary** | `#4CC9F0` | Sky Blue | Secondary chart series, hover states, links |
| **Tertiary** | `#7209B7` | Soft Purple | Third chart series, accent elements, gradients |
| **Neutral** | `#F8F9FA` | Light Grey | Card backgrounds, input backgrounds |
| **Success** | `#2ECC71` | Emerald Green | Growth indicators, positive values, gains |
| **Warning** | `#E74C3C` | Soft Red | Cost indicators, negative values, interest/expenses |
| **Additional** | `#5E60CE` | Muted Indigo | 6th chart series, additional data categories |
| **Slate** | `#0f172a` → `#f8fafc` | Slate scale | Text hierarchy, borders, grid/axis |

**IMPORTANT:** 
- Use `slate-*` throughout, NOT `gray-*`. All text, borders, and backgrounds must use the slate palette.
- Charts MUST follow the color order: Primary → Secondary → Tertiary → Success → Warning → Additional.
- Never use old colors like `#6366f1` (indigo), `#f59e0b` (amber), or `#f43f5e` (rose) in charts.

#### Unified Chart Color Constant (COPY INTO EVERY TOOL)
```typescript
const CHART_COLORS = {
  primary: '#007AFF',    // Vibrant Blue - PRIMARY brand color
  secondary: '#4CC9F0',  // Sky Blue - SECONDARY
  accent: '#7209B7',     // Soft Purple - ACCENT/TERTIARY
  teal: '#2ECC71',       // Emerald Green - growth/success
  rose: '#E74C3C',       // Soft Red - cost/warning
  purple: '#5E60CE',     // Muted Indigo - additional
  grid: '#f1f5f9',       // slate-100
  axis: '#94a3b8',       // slate-400
};
```

**Key Mapping:**
| CHART_COLORS Key | Palette Role | When to Use |
|---|---|---|
| `primary` | Primary (#007AFF) | Main data series, balance, total value |
| `secondary` | Secondary (#4CC9F0) | Second series, comparisons |
| `accent` | Tertiary (#7209B7) | Third series, accent highlights |
| `teal` | Success (#2ECC71) | Growth, gains, positive metrics |
| `rose` | Warning (#E74C3C) | Costs, interest, negative metrics |
| `purple` | Additional (#5E60CE) | Extra series when 6+ needed |

#### Tool-Specific Semantic Aliases
Tools may define semantic aliases that map to the official palette:
```typescript
// Example: SIP Wealth Planner
invested: '#007AFF',   // → primary (what you put in)
gained: '#2ECC71',     // → success (what you earned)
realValue: '#4CC9F0',  // → secondary (inflation-adjusted)
```

#### UI Accent Colors
All tools share the same accent color scheme for interactive elements:
- **Section badges:** `bg-blue-600 text-white` (primary) or `bg-teal-500 text-white` (secondary section)
- **Focus rings:** `ring-2 ring-blue-50 border-blue-400`
- **Active toggles:** `bg-blue-600`
- **Slider tracks:** Fill with `#007AFF`
- **Gradient buttons:** `bg-gradient-to-r from-blue-600 to-indigo-600`
- **Reset buttons:** Ghost style with uppercase tracking

### Typography

```css
/* Body */
Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif
Font Smoothing: -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;

/* Hierarchy */
H1: text-3xl sm:text-4xl font-extrabold text-gray-900
H2: text-xl font-bold text-gray-800 flex items-center
H3: text-lg font-bold text-gray-900
Label: text-sm font-semibold text-gray-700
Body: text-sm text-gray-600
Small: text-xs text-gray-500
```

### Spacing & Grid

- **Base Unit:** 4px (Tailwind default)
- **Sections:** `py-3 px-4` on mobile, `py-6 px-6` on desktop
- **Cards:** `p-5` to `p-6` for input cards, `p-4` for stats
- **Gap between sections:** `mb-6` or `gap-6`
- **Container:** `max-w-6xl mx-auto` for full-width, `max-w-7xl` for large tools

### Shadows & Borders

```css
/* Unified Card Style (REQUIRED for all cards) */
rounded-2xl shadow-md border border-slate-100

/* Card Shadows */
shadow-sm:  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);  /* subtle, desktop backgrounds */
shadow-md:  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);  /* ALL cards (primary) */
shadow-lg:  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);  /* modals, dropdowns */
shadow-xl:  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);  /* hero, emphasis */

/* Borders */
border-slate-100:    for all card outlines (unified)
border-slate-200:    for dividers and table borders
border-[tool-color]-200:  for tool-specific emphasis

/* Rounded Corners */
rounded-lg:   8px   (input fields, buttons, sharing bar items)
rounded-xl:   12px  (tooltips, modals)
rounded-2xl:  16px  (ALL cards — this is the standard)
rounded-full: 9999px (badges, progress circles)
```

### Page Background

All tool pages use this unified background:
```
bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20
```
Never use `from-slate-50 via-blue-50 to-indigo-50` (too saturated).

### Responsive Breakpoints

| Breakpoint | Width | Use Case |
|---|---|---|
| Mobile | < 640px | `sm:` prefix for tablet-up styling |
| Tablet | 640px–1024px | `md:` → 2-column layouts |
| Desktop | 1024px+ | `lg:` → 3-column layouts, sidebars |
| Large Desktop | 1400px+ | `2xl:` for content expansion |

**Pattern:**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Full width on mobile, 1/3 on desktop */}
</div>
```

---

## Layout Patterns & Sticky Calculator

### Two Primary Layout Patterns

#### Pattern 1: Side-by-Side (Calculator Left, Charts Right)

**When to use:** Tools with complex inputs and multiple visualizations

**CRITICAL:** Calculator section MUST be sticky when scrolling

```tsx
<div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">
  {/* Left: Calculator (STICKY) */}
  <section className="lg:sticky lg:top-6 lg:self-start bg-white rounded-2xl border border-slate-100 shadow-md p-5">
    <h2 className="text-lg font-bold text-slate-800 mb-4">Calculator Inputs</h2>
    {/* Input fields */}
  </section>

  {/* Right: Charts and Results */}
  <section className="space-y-6">
    {/* Multiple charts, tables, insights */}
  </section>
</div>
```

**Key Classes for Sticky:**
- `lg:sticky` - Makes it stick on desktop only
- `lg:top-6` - 24px from top when stuck (allows header space)
- `lg:self-start` - Aligns to start of grid row
- `items-start` on parent grid - Required for sticky to work

**Why Sticky is MANDATORY:**
- Users naturally scroll down to see charts and results
- Without sticky, they can't adjust inputs without scrolling back up
- Massively improves UX and engagement
- Standard pattern in modern financial calculators

#### Pattern 2: Stacked (Calculator Top, Charts Below)

**When to use:** Simple tools with fewer inputs or single primary chart

```tsx
<div className="max-w-4xl mx-auto space-y-6">
  {/* Top: Calculator */}
  <section className="bg-white rounded-2xl border border-slate-100 shadow-md p-6">
    <h2 className="text-lg font-bold text-slate-800 mb-4">Calculator Inputs</h2>
    {/* Input fields */}
  </section>

  {/* Below: Results and Charts */}
  <section className="space-y-6">
    {/* Charts, tables, insights */}
  </section>
</div>
```

**When to use each:**
- **Side-by-Side**: SIP planner, FIRE calculator, Mortgage calculator (many inputs + many charts)
- **Stacked**: Simple interest calculator, age calculator (few inputs or simple output)

### Mobile Behavior

**IMPORTANT:** Sticky behavior should ONLY apply on desktop (`lg:` breakpoint)

On mobile:
- Calculator always appears at top
- Results/charts scroll naturally below
- No sticky behavior (would block too much screen)

---

## File Structure & Code Organization

### Directory Layout

```
/src
  /components
    /[ToolName]/
      [ToolName].tsx              // Main component (850–1500 lines)
      [ToolName].types.ts         // Type definitions (25–50 lines)
      [ToolName].utils.ts         // Business logic & calculations (200–400 lines)
    /Layout/
      Header.tsx                  // Shared
      Footer.tsx                  // Shared
    /AdSlot/
      AdSlot.tsx                  // Shared ad component

  /hooks
    use[ToolName].ts              // State management hook (40–70 lines)

  /pages
    [tool-name].tsx               // Next.js page with Head/metadata (50–70 lines)
    _app.tsx                      // Shared app wrapper
    _document.tsx                 // Shared HTML structure
    index.tsx                     // Homepage (links to all tools)

  /styles
    globals.css                   // Tailwind directives + shared styles (200–300 lines)

  /utils
    validation.ts                 // Shared: form validation helpers
    excel.ts                      // Shared: export utilities
    [tool-specific].ts            // Tool-specific utils (if > 50 lines)
```

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| React Components | PascalCase | `EMICalculator`, `FIRECalculator` |
| Component Files | PascalCase (directory) | `/EMICalculator/EMICalculator.tsx` |
| Type Files | PascalCase.types | `EMICalculator.types.ts` |
| Utils Files | kebab-case or camelCase | `emi-calculator.utils.ts` or `utils.ts` |
| Hooks | use[ToolName] | `useEMI`, `useFIRE` |
| Pages | kebab-case | `/pages/emi-calculator.tsx` |
| CSS Classes | kebab-case (via Tailwind) | `fire-range`, `emi-input` |
| Vars/Constants | UPPER_SNAKE_CASE (exports) | `FIRE_TYPES`, `EMI_DEFAULTS` |

---

## Component Patterns & Best Practices

### 1. Main Tool Component Structure

```tsx
/**
 * /src/components/[ToolName]/[ToolName].tsx
 * ~850–1500 lines
 * Pattern: Inputs → Calculations → Results → Charts → Insights
 */

const [ToolName]: React.FC = () => {
  const { inputs, result, updateInputs, reset } = use[ToolName]();
  const [mounted, setMounted] = useState(false);
  const [activeChart, setActiveChart] = useState<ChartKey>('default');

  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-3 px-4">
      <article className="max-w-7xl mx-auto" itemScope itemType="https://schema.org/WebApplication">
        {/* 1. Header with description */}
        {/* 2. Input sections (grouped logically, numbered) */}
        {/* 3. Summary sidebar (4 key metrics with animations) */}
        {/* 4. Chart tabs with 3+ visualizations */}
        {/* 5. Results tables (if large datasets) */}
        {/* 6. Educational insights (3 cards with tips) */}
      </article>
    </div>
  );
};

export default [ToolName];
```

**Why This Structure?**
- Users scan top-to-bottom: hero → inputs → quick wins → deep dives
- Sidebar for key metrics (mobile: becomes bottom)
- Charts second (visual learners)
- Tables third (data nerds)
- Tips last (engagement boost)

### 2. Hook Pattern (State & Calculation)

```tsx
// /src/hooks/use[ToolName].ts

const use[ToolName] = () => {
  const [inputs, setInputsRaw] = useState<[Tool]Inputs>(DEFAULT_INPUTS);

  // ✓ Always use useMemo for derived calculations
  const result: [Tool]Result = useMemo(
    () => calculate[Tool](inputs),
    [inputs] // Only recalc if inputs change
  );

  // ✓ Update with localStorage persistence
  const updateInputs = useCallback((partial: Partial<[Tool]Inputs>) => {
    setInputsRaw((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // ✓ Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setInputsRaw((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  return { inputs, result, updateInputs, reset };
};
```

**Key Rules:**
- ✓ All calculations in `useMemo` (no recalc on every render)
- ✓ All localStorage ops wrapped in try/catch (silent fail, don't break UI)
- ✓ Reset function clears storage
- ✓ Return object shape is stable (same keys always)

### 3. Input Component (Slider)

```tsx
// Reusable slider pattern used in EMI & FIRE

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  tooltip?: string;
}

const SliderInput: React.FC<SliderInputProps> = ({ ... }) => {
  const pct = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold text-gray-700">
          {label}
          {tooltip && <HelpTooltip text={tooltip} />}
        </label>
        <NumberInput {...inputProps} />
      </div>
      <input
        type="range"
        className="[ToolName]-range"  // Custom CSS styling
        style={{
          background: `linear-gradient(to right, #[accent] ${pct}%, #e5e7eb ${pct}%)`
        }}
      />
    </div>
  );
};
```

**Template:** Copy this into new tools. Only change gradient color to match tool accent.

### 4. Animated Number Display

```tsx
// Reusable pattern for animating value changes

const AnimatedNumber: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}> = ({ value, prefix = '', suffix = '', decimals = 0, className }) => {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const duration = 600;
    const startTime = performance.now();

    const tick = (now: number) => {
      const t = (now - startTime) / duration;
      const eased = t < 1 ? 1 - Math.pow(1 - t, 3) : 1;
      setDisplay(value * eased + display * (1 - eased));
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value]);

  return <span className={className}>
    {prefix}{display.toLocaleString('en-US', { maximumFractionDigits: decimals })}{suffix}
  </span>;
};
```

**Use this in:**
- Key metric cards (FIRE number, EMI amount, etc.)
- Progress numbers
- Any number that updates based on slider input

### 5. Card with Section Number

```tsx
// Consistent pattern across all tools

<motion.div
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.05 * sectionIndex }}
  className="bg-white rounded-xl shadow-lg p-6"
>
  <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
    <span className="bg-[ACCENT]-100 text-[ACCENT]-600 rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm font-bold">
      {number}
    </span>
    Section Title
  </h2>
  {/* Content */}
</motion.div>
```

---

## Charting & Data Visualization

### ⚠️ CRITICAL: Multiple Charts Required

**MINIMUM REQUIREMENT: 3-4 Different Visualizations**

A single chart is NOT sufficient. Financial calculators are visual tools - users need multiple perspectives on their data.

**Why Multiple Charts Matter:**
- Different users understand data differently (some prefer trends, others breakdowns)
- Increases engagement and time on page (better SEO signals)
- Demonstrates tool sophistication and value
- Industry standard for professional financial tools

### Chart Strategy by Tool Type

#### Loan/Mortgage Tools (Minimum 4 charts):
1. **Balance Over Time** - Area chart showing loan paydown
2. **Payment Breakdown** - Pie/Donut chart (Principal vs Interest vs Taxes)
3. **Principal vs Interest** - Stacked bar chart by year
4. **Amortization Schedule** - Table with monthly breakdown
5. **Payoff Scenarios** - Bar chart comparing different rates/extra payments

#### Investment/Wealth Tools (Minimum 4 charts):
1. **Growth Projection** - Area chart with invested vs gained
2. **Year-over-Year Growth** - Bar chart showing annual returns
3. **Contribution vs Growth** - Stacked area showing sources of wealth
4. **Real vs Nominal** - Line chart with inflation adjustment
5. **Milestone Timeline** - Visual showing when goals are reached

#### Comparison Tools (Minimum 3 charts):
1. **Side-by-Side Comparison** - Bar chart
2. **Cumulative Difference** - Area chart over time
3. **Breakeven Analysis** - Line chart showing crossover point

### Chart Library Strategy

**Only Library:** Recharts  
**Removed:** Chart.js (react-chartjs-2) — fully removed from the project. Never add it back.  

### Recommended Charts by Use Case

| Use Case | Component | Example |
|---|---|---|
| Wealth/balance over time | `<AreaChart>` with gradient fill | FIRE portfolio growth, EMI balance |
| Stacked contributions | `<AreaChart>` with `stackId` | FIRE contributions vs growth |
| Loan schedule breakdown | `<AreaChart>` or `<BarChart>` | EMI principal vs interest |
| Comparison bars | `<BarChart>` | FIRE types side-by-side |
| Pie/donut breakdown | `<PieChart>` with `<Pie>` | EMI principal:interest ratio |
| Mixed (bar + line) | `<ComposedChart>` | Complex overlays |
| Historical cycles | `<AreaChart>` | Future: backtesting features |

### Chart Best Practices

#### 1. Custom Tooltip

```tsx
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-100 px-4 py-3">
      <p className="text-sm font-bold text-slate-900 mb-1.5">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color || entry.stroke || entry.fill }}
          />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-semibold text-slate-800">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};
```

Copy this template. Only update field names per tool.

#### 2. Axis Formatter

```tsx
const formatYAxis = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
};

// Usage:
<YAxis tickFormatter={formatYAxis} stroke="#94a3b8" fontSize={12} />
```

#### 3. Chart Animations

```tsx
{mounted && (
  <AnimatePresence mode="wait">
    {activeChart === 'projection' && (
      <motion.div
        key="projection"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        {/* Chart component */}
      </motion.div>
    )}
  </AnimatePresence>
)}
```

**Rules:**
- ✓ Wrap in `{mounted && <AnimatePresence>}` (SSG hydration safety)
- ✓ Use `mode="wait"` for smooth tab transitions
- ✓ Keep motion subtle: `opacity` + `y: ±8px` max
- ✓ Duration 200–300ms (fast feedback)

#### 4. Sample Data for Performance

```tsx
// Don't render 500 data points; sample down
const chartData = useMemo(() => {
  const step = Math.max(1, Math.floor(fullData.length / 50)); // Target 50 points
  return fullData.filter((_, i) => i % step === 0 || i === fullData.length - 1);
}, [fullData]);
```

This keeps charts responsive even with 1000+ projection years.

---

## Sharing & Export Features (Required for All Tools)

### ⚠️ CRITICAL: Export Bar MUST Be At TOP of Page

**MANDATORY PLACEMENT:** Immediately after the page header, **BEFORE** calculator inputs.

Every tool **MUST** include the following sharing and export capabilities as **MINIMUM REQUIRED FEATURES**. These are non-negotiable requirements for all tools. Follow the existing calculators (EMI, FIRE, SIP, Compound Interest, Income Tax) as reference implementations.

### ⚠️ CRITICAL: Minimum Required Features

**All new tools must implement ALL of the following:**

1. ✅ **Export to PDF** — Full report export
2. ✅ **Export to Excel** — Data table export with multiple sheets
3. ✅ **Copy URL** — Share via URL with query parameters
4. ✅ **WhatsApp Share** — Pre-filled message with results + URL
5. ✅ **Twitter/X Share** — Tweet composer with results + URL

**If any of these features are missing, the tool is considered incomplete and must be updated before deployment.**

### Page Layout with Export Bar

```tsx
return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-4 px-4">
    <article className="max-w-7xl mx-auto">
      
      {/* 1. HEADER - Always first */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">
          [Tool Name] Calculator
        </h1>
        <p className="text-sm text-slate-500 max-w-3xl mx-auto">
          [Tool description]
        </p>
      </header>

      {/* 2. EXPORT BAR - MANDATORY, ALWAYS SECOND */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {/* Export and share buttons */}
      </div>

      {/* 3. CALCULATOR & CHARTS - After export bar */}
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
        {/* Calculator inputs */}
        {/* Charts and results */}
      </div>

      {/* 4. EDUCATIONAL CONTENT - At bottom */}
      <section className="mt-12">
        {/* 800+ words content */}
      </section>
    </article>
  </div>
);
```

### Implementation Reference

| Feature | Library/API | Description |
|---------|------------|-------------|
| Export PDF | `exportToPDF` from `../../utils/pdf` | Full-page screenshot PDF via html2canvas + jsPDF |
| Export Excel | `exportToExcel` / `exportSIPToExcel` / `exportFIREToExcel` / `exportCompoundInterestToExcel` / `exportIncomeTaxToExcel` from `../../utils/excel` | XLSX with data sheets (create tool-specific export function if needed) |
| Copy URL | `navigator.clipboard` (with textarea fallback) | Copies current URL with query params |
| WhatsApp | `wa.me/?text=` | Opens WhatsApp with pre-filled message + URL |
| Twitter/X | `twitter.com/intent/tweet` | Opens tweet composer with text + URL |
| URL Query Params | `URLSearchParams` + `window.history.replaceState` | Syncs key inputs to URL for shareable links (optional but recommended) |

### State Variables

```typescript
const [copied, setCopied] = useState(false);
const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);
```

### URL Query-Param Sync Pattern

```typescript
// Load from URL on mount
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const val1 = params.get('param1');
  const val2 = params.get('param2');
  if (val1 && val2) {
    // Set state from URL params
  }
}, []);

// Write to URL on input change
useEffect(() => {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams();
  params.set('param1', inputValue1);
  params.set('param2', inputValue2);
  window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}, [inputValue1, inputValue2]);
```

### Sharing Bar UI — Unified Theme Colors

**PLACEMENT OPTIONS:**

#### Option 1: Centered Row (Most Common - Use for Most Tools)
Best for tools with side-by-side layout. Export bar spans full width above content.

```tsx
{/* Export + Share bar — CENTERED ABOVE CONTENT */}
<div className="flex flex-wrap gap-2 justify-center mb-6">
  <button 
    onClick={handleExportPDF} 
    disabled={exporting !== null}
    className="flex items-center gap-2 bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 text-slate-600 hover:text-indigo-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50"
  >
    {exporting === 'pdf' ? '⏳ Generating…' : '📄 Export PDF'}
  </button>
  
  <button 
    onClick={handleExportExcel} 
    disabled={exporting !== null}
    className="flex items-center gap-2 bg-white hover:bg-teal-50 border border-slate-100 hover:border-teal-200 text-slate-600 hover:text-teal-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50"
  >
    {exporting === 'excel' ? '⏳ Generating…' : '📊 Export Excel'}
  </button>
  
  <button 
    onClick={handleCopyURL}
    className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 text-slate-600 hover:text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
  >
    {copied ? '✅ Copied!' : '🔗 Copy Plan URL'}
  </button>
  
  <button 
    onClick={handleShareWhatsApp}
    className="flex items-center gap-2 bg-white hover:bg-teal-50 border border-slate-100 hover:border-teal-200 text-slate-600 hover:text-teal-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
  >
    💬 WhatsApp
  </button>
  
  <button 
    onClick={handleShareTwitter}
    className="flex items-center gap-2 bg-white hover:bg-sky-50 border border-slate-100 hover:border-sky-200 text-slate-600 hover:text-sky-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
  >
    🐦 Twitter
  </button>
</div>
```

#### Option 2: Sidebar in Calculator Card (Alternative for Side-by-Side)
If calculator is on left and you want export options integrated into that card.

```tsx
<section className="lg:sticky lg:top-6 lg:self-start bg-white rounded-2xl border border-slate-100 shadow-md p-5">
  <h2 className="text-lg font-bold text-slate-800 mb-4">Calculator</h2>
  
  {/* Input fields here */}
  
  <hr className="my-6 border-slate-100" />
  
  {/* Export section at bottom of calculator card */}
  <div className="space-y-2">
    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
      Export & Share
    </h3>
    
    <div className="grid grid-cols-2 gap-2">
      <button onClick={handleExportPDF} disabled={exporting !== null}
        className="flex items-center justify-center gap-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-700 text-xs font-bold py-2.5 rounded-xl transition-all">
        📄 {exporting === 'pdf' ? '...' : 'PDF'}
      </button>
      <button onClick={handleExportExcel} disabled={exporting !== null}
        className="flex items-center justify-center gap-1.5 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-600 hover:text-teal-700 text-xs font-bold py-2.5 rounded-xl transition-all">
        📊 {exporting === 'excel' ? '...' : 'Excel'}
      </button>
    </div>
    
    <button onClick={handleCopyURL}
      className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-all">
      🔗 {copied ? '✅ Copied!' : 'Copy URL'}
    </button>
    
    <div className="grid grid-cols-2 gap-2">
      <button onClick={handleShareWhatsApp}
        className="flex items-center justify-center gap-1.5 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-600 hover:text-teal-700 text-xs font-bold py-2.5 rounded-xl transition-all">
        💬
      </button>
      <button onClick={handleShareTwitter}
        className="flex items-center justify-center gap-1.5 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-600 hover:text-sky-700 text-xs font-bold py-2.5 rounded-xl transition-all">
        🐦
      </button>
    </div>
  </div>
</section>
```

**Use Option 1 (Centered Row) for:**
- All new tools by default
- Tools with complex layouts
- Maximum visibility

**Use Option 2 (Sidebar Integration) for:**
- Side-by-side layouts where calculator is prominent
- When you want to save vertical space
- Advanced tools like SIP Wealth Planner

### Sharing Bar UI — Unified Theme Colors (Detailed)

**Use these exact button colors for consistency across all tools:**

```tsx
{/* Export + Share bar — Desktop Layout Example */}
<div className="hidden lg:block space-y-3">
  {/* PDF + Excel Row */}
  <div className="grid grid-cols-2 gap-2">
    <button onClick={handleExportPDF} disabled={exporting !== null}
      className="flex items-center justify-center gap-2 bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 text-slate-600 hover:text-indigo-600 text-[11px] font-bold py-3 rounded-2xl transition-all shadow-sm">
      📄 {exporting === 'pdf' ? '...' : 'PDF'}
    </button>
    <button onClick={handleExportExcel} disabled={exporting !== null}
      className="flex items-center justify-center gap-2 bg-white hover:bg-teal-50 border border-slate-100 hover:border-teal-100 text-slate-600 hover:text-teal-600 text-[11px] font-bold py-3 rounded-2xl transition-all shadow-sm">
      📊 {exporting === 'excel' ? '...' : 'Excel'}
    </button>
  </div>
  
  {/* Copy URL Row */}
  <button onClick={handleCopyURL}
    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 text-slate-600 hover:text-indigo-600 text-[11px] font-bold py-3 rounded-2xl transition-all shadow-sm">
    🔗 {copied ? '✅ COPIED!' : 'COPY PLAN URL'}
  </button>
  
  {/* Social Share Row */}
  <div className="grid grid-cols-2 gap-2">
    <button onClick={handleShareWhatsApp}
      className="flex items-center justify-center gap-2 bg-white hover:bg-teal-50 border border-slate-100 hover:border-teal-100 text-slate-600 hover:text-teal-600 text-[11px] font-bold py-3 rounded-2xl transition-all shadow-sm">
      💬 WHATSAPP
    </button>
    <button onClick={handleShareTwitter}
      className="flex items-center justify-center gap-2 bg-white hover:bg-sky-50 border border-slate-100 hover:border-sky-100 text-slate-600 hover:text-sky-600 text-[11px] font-bold py-3 rounded-2xl transition-all shadow-sm">
      🐦 TWITTER
    </button>
  </div>
</div>

{/* Mobile Layout Example */}
<div className="flex flex-wrap gap-2 lg:hidden">
  <button onClick={handleExportPDF} disabled={exporting !== null}
    className="flex items-center gap-1.5 bg-white border border-slate-100 text-slate-600 text-[10px] font-bold px-3 py-2.5 rounded-xl shadow-sm">
    {exporting === 'pdf' ? '⏳' : '📄 PDF'}
  </button>
  <button onClick={handleExportExcel} disabled={exporting !== null}
    className="flex items-center gap-1.5 bg-white border border-slate-100 text-slate-600 text-[10px] font-bold px-3 py-2.5 rounded-xl shadow-sm">
    {exporting === 'excel' ? '⏳' : '📊 EXCEL'}
  </button>
  <button onClick={handleCopyURL}
    className="flex items-center gap-1.5 bg-white border border-slate-100 text-slate-600 text-[10px] font-bold px-3 py-2.5 rounded-xl shadow-sm">
    {copied ? '✅' : '🔗 COPY'}
  </button>
  <button onClick={handleShareWhatsApp}
    className="flex items-center gap-1.5 bg-white border border-slate-100 text-slate-600 text-[10px] font-bold px-3 py-2.5 rounded-xl shadow-sm">
    💬 SHARE
  </button>
  <button onClick={handleShareTwitter}
    className="flex items-center gap-1.5 bg-white border border-slate-100 text-slate-600 text-[10px] font-bold px-3 py-2.5 rounded-xl shadow-sm">
    🐦 TWEET
  </button>
</div>
```

**Button Color Rules:**
- **PDF Export**: `indigo` (indigo-50/100/600) — matches primary brand color
- **Excel Export**: `teal` (teal-50/100/600) — success/growth color
- **Copy URL**: `indigo` (indigo-50/100/600) — primary action
- **WhatsApp**: `teal` (teal-50/100/600) — matches WhatsApp brand
- **Twitter/X**: `sky` (sky-50/100/600) — matches Twitter brand

### Handler Templates

```typescript
const handleExportPDF = useCallback(async () => {
  setExporting('pdf');
  try {
    await exportToPDF('[tool-content-id]', '[Tool]_Report.pdf', {
      title: '[Tool] Report', quality: 0.92,
    });
  } catch (e) { console.error(e); }
  finally { setExporting(null); }
}, []);

const handleExportExcel = useCallback(async () => {
  setExporting('excel');
  try {
    // Use tool-specific export function from utils/excel.ts
    // exportToExcel, exportSIPToExcel, exportFIREToExcel, exportCompoundInterestToExcel, exportIncomeTaxToExcel
    await exportYourToolToExcel(data, '[Tool]_Data.xlsx');
  } catch (e) { console.error(e); }
  finally { setExporting(null); }
}, [data]);

const handleCopyURL = useCallback(async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = window.location.href;
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
}, []);

const handleShareWhatsApp = useCallback(() => {
  const text = `[Custom message with result summary]\n\n${window.location.href}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}, [/* dependencies */]);

const handleShareTwitter = useCallback(() => {
  const text = `[Custom message with result summary]. Calculate yours:`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
}, [/* dependencies */]);
```

**Important:**
- The main container div **must** have an `id` attribute (e.g., `id="emi-calculator-content"`) for PDF export to work
- URL param keys should be short abbreviations (e.g., `la` for loanAmount, `ar` for annualRate)
- Sharing messages should include key result numbers for social proof

---

## Styling Approach

### Tailwind CSS Only

**Rule:** Use Tailwind utility classes everywhere. No scoped CSS, no CSS Modules per-component.

**Why:**
- Consistency across tools
- Shared design tokens
- Smaller final bundle
- Easy to refactor colors/spacing globally

### Shared styles in `/src/styles/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 1. Base element fixes */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, ...;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 2. Custom input styles (sliders, number inputs) */
input[type="range"].[tool-name]-range {
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  /* Track and thumb styling */
}

/* 3. Scrollbar styling (if needed) */
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}

/* 4. Utility classes for repeated patterns */
@layer components {
  .card {
    @apply bg-white rounded-xl shadow-lg p-6;
  }
  
  .input-group {
    @apply grid grid-cols-1 md:grid-cols-2 gap-x-8;
  }
}
```

### Theme Colors in `tailwind.config.js`

If a tool needs custom colors beyond Tailwind defaults:

```js
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tool-accent': '#f97316', // For FIRE
      },
    },
  },
  plugins: [],
};
```

Then use `text-tool-accent`, `bg-tool-accent`, etc.

### No Inline Styles

❌ **Don't:**
```tsx
<div style={{ color: 'red', padding: '20px' }}>Text</div>
```

✓ **Do:**
```tsx
<div className="text-red-600 p-5">Text</div>
```

**Exception:** Only for truly dynamic values:
```tsx
<div
  className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"
  style={{ width: `${percentage}%` }}  // Only the dynamic part
>
  Content
</div>
```

---

## Content Requirements for AdSense & SEO

### ⚠️ CRITICAL: 800+ Words Educational Content MANDATORY

**This is NON-NEGOTIABLE for AdSense approval and SEO ranking.**

### Why Content Quality Matters

Google AdSense requires:
1. **Original, high-quality content** — calculators must educate, not just compute
2. **Adequate content** — thin pages (< 500 words) get penalized or rejected
3. **User engagement signals** — time on page matters (1-3 min average ideal)
4. **Mobile-friendly, fast** — we handle this technically; you handle content

### Content Structure (Target: 800-1200 Words)

Every tool page must include **all** of these content sections:

#### 1. What Is [Tool Name]? (200-300 words)
- **Placement:** Below the calculator and charts
- **Purpose:** Define the concept, explain use cases
- **Format:** 2-3 paragraphs with subheadings
- **Example topics:**
  - What is a mortgage/amortization schedule/SIP?
  - Why is this calculation important?
  - Who should use this tool?

```tsx
<section className="mt-12">
  <article className="prose prose-slate max-w-none">
    <h2 className="text-2xl font-bold text-slate-900 mb-4">
      What is a [Tool Name]?
    </h2>
    <p className="text-slate-600 leading-relaxed mb-4">
      [First paragraph explaining the concept...]
    </p>
    <p className="text-slate-600 leading-relaxed mb-4">
      [Second paragraph with more detail...]
    </p>
    <p className="text-slate-600 leading-relaxed">
      [Third paragraph connecting to the tool...]
    </p>
  </article>
</section>
```

#### 2. How It Works / Methodology (200-300 words)
- **Placement:** After the "What Is" section
- **Purpose:** Explain the calculation methodology
- **Format:** Step-by-step or component breakdown
- **Include:** Formulas (LaTeX or plain text), key variables, assumptions

```tsx
<section className="mt-8">
  <article className="prose prose-slate max-w-none">
    <h2 className="text-2xl font-bold text-slate-900 mb-4">
      How the [Calculation] Works
    </h2>
    <p className="text-slate-600 leading-relaxed mb-4">
      The calculation uses the following formula: [Formula explanation]
    </p>
    <div className="bg-slate-50 rounded-xl p-6 my-6 not-prose">
      <h4 className="font-bold text-slate-900 mb-3">Key Components:</h4>
      <ul className="space-y-2 text-sm text-slate-700">
        <li><strong>Component 1:</strong> Description...</li>
        <li><strong>Component 2:</strong> Description...</li>
        <li><strong>Component 3:</strong> Description...</li>
      </ul>
    </div>
    <p className="text-slate-600 leading-relaxed">
      Our calculator handles all these computations automatically...
    </p>
  </article>
</section>
```

#### 3. Use Cases / When to Use (200-300 words)
- **Placement:** After methodology
- **Purpose:** Real-world scenarios and examples
- **Format:** 2-4 specific use cases with context

```tsx
<section className="mt-8">
  <article className="prose prose-slate max-w-none">
    <h2 className="text-2xl font-bold text-slate-900 mb-4">
      When to Use This Calculator
    </h2>
    
    <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">
      1. [Use Case Title]
    </h3>
    <p className="text-slate-600 leading-relaxed">
      [Detailed explanation with example...]
    </p>

    <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">
      2. [Use Case Title]
    </h3>
    <p className="text-slate-600 leading-relaxed">
      [Detailed explanation with example...]
    </p>
    
    {/* More use cases */}
  </article>
</section>
```

#### 4. Tips / FAQs / Best Practices (200-300 words)
- **Placement:** End of content section
- **Purpose:** Answer common questions, provide actionable advice
- **Format:** Q&A style or tip cards

```tsx
<section className="mt-8">
  <h2 className="text-2xl font-bold text-slate-900 mb-6">
    Frequently Asked Questions
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h4 className="font-bold text-slate-900 mb-2">
        Question 1?
      </h4>
      <p className="text-sm text-slate-600 leading-relaxed">
        Detailed answer explaining the concept...
      </p>
    </div>
    {/* More FAQ cards */}
  </div>
</section>
```

### Content Quality Guidelines

**✓ DO:**
- Write in clear, conversational tone
- Use specific numbers and examples
- Break up text with subheadings every 150-200 words
- Include actionable takeaways
- Link to related calculators naturally within content
- Use proper grammar and spelling (run through spell check)

**✗ DON'T:**
- Copy content from other sites (must be 100% original)
- Use only bullet points (needs full paragraphs)
- Write vague, generic content ("this calculator is useful")
- Front-load with excessive keywords (write naturally)
- Use AI-generated content without heavy editing and humanization

### Minimum Content Guidelines

For each tool:

#### 1. Page Metadata & Schema

```tsx
// /src/pages/[tool-name].tsx

<Head>
  <title>
    [Tool Name] Calculator — [Short Description] | Toolisk
  </title>
  <meta
    name="description"
    content="Free [Tool Name] calculator... [40–160 characters]. Calculate X, compare Y, visualize Z."
  />
  <meta
    name="keywords"
    content="[tool keywords], [pain points], [use cases], calculator, free"
  />
  <link rel="canonical" href="https://toolisk.com/[tool-slug]" />
  <meta property="og:title" content="[Title]" />
  <meta property="og:description" content="[Description]" />
</Head>
```

**SEO Copy Checklist:**
- ✓ Title: 50–60 characters, includes main keyword + "Calculator"
- ✓ Description: 150–160 characters, calls out unique value
- ✓ Keywords: 5–8 terms, mix broad + specific
- ✓ Canonical tag: Always present, helps avoid duplicate content

#### 2. Header Section (50–100 words)

```tsx
<header className="text-center mb-6" id="calculator">
  <h1 className="text-3xl font-bold text-gray-900 mb-1">
    [Tool Name] Calculator
  </h1>
  <p className="text-sm text-gray-600">
    Calculate X with precision. Compare Y strategies. Visualize Z over time.
    Free, no sign-up required.
  </p>
</header>
```

**Rules:**
- Explain what the tool does in 1–2 sentences
- Mention key features (free, compare, visualize, etc.)
- Avoid marketing fluff; be specific

#### 3. Input Section Descriptions

Each input card should have tooltips explaining what each slider does:

```tsx
<SliderInput
  label="Annual Income"
  tooltip="Total annual pre-tax income (paychecks + bonuses)"
  // ...
/>
```

**Tooltip guidelines:**
- 1 clear sentence
- Define the field (what it is)
- Give an example in parentheses
- No jargon without explanation

#### 4. Results Card Explanations

After calculations, add a text card explaining what the results mean:

```tsx
<motion.div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
  <h3 className="font-bold text-gray-900 mb-2">📊 What This Means</h3>
  <p className="text-sm text-gray-600">
    Your FIRE number of $850,000 means you need that amount invested to safely
    withdraw 4% annually ($34,000) without running out of money. This assumes
    7% average returns and 3% inflation.
  </p>
</motion.div>
```

#### 5. Educational Insights Section (100–150 words min)

3 cards with actionable tips:

```tsx
<section className="mb-8">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="text-2xl mb-2">📉</div>
      <h4 className="font-bold text-gray-900 text-sm mb-1.5">Key Insight 1</h4>
      <p className="text-xs text-gray-500 leading-relaxed">
        [1 clear, actionable insight based on the calculation. Reference real research or studies.]
      </p>
    </div>
    {/* More cards */}
  </div>
</section>
```

**Content requirements per insight card:**
- Headline: 3–5 words
- Body: 2–3 sentences, actionable
- Reference real data if possible (studies, statistics, etc.)
- Connect back to the calculator

#### 6. FAQ or "How to Use" Section (Optional but Recommended)

```tsx
<section className="bg-white rounded-xl shadow-lg p-6 mb-8">
  <h3 className="text-lg font-bold text-gray-900 mb-4">How to Use the Calculator</h3>
  <ol className="space-y-3 text-sm text-gray-600">
    <li className="flex gap-3">
      <span className="font-bold text-indigo-600 flex-shrink-0">1.</span>
      <span>Enter your current financial situation...</span>
    </li>
    {/* More steps */}
  </ol>
</section>
```

Aim for **150–300 words** explaining each step.

### AdSense-Specific Requirements

1. **Ad Placement Policy**
   - ✓ Ads go around (above/below/sidebar) the calculator, NOT overlaid
   - ✓ Use `<AdSlot format="horizontal" />` above results
   - ✓ Use `<AdSlot format="vertical" />` in desktop sidebar if space
   - ✓ No ads between inputs and "Calculate" button (bad UX = high bounce)
   - ✓ Minimum 600 words of non-ad content before any ads

2. **Content Density**
   - ✓ Minimum 1500 total words (header + inputs + results + tips + faq)
   - ✓ At least 25% of page is content (not just whitespace)
   - ✓ Unique value beyond "free calculator" (educational insights matter)

3. **HTML Structure**
   - ✓ Semantic HTML: `<article>`, `<header>`, `<section>`, `<h1>–<h6>`
   - ✓ Proper heading hierarchy (no skipping levels)
   - ✓ Schema.org structured data: `itemScope itemType="https://schema.org/WebApplication"`

4. **Speed & Mobile**
   - ✓ Pagespeed Insights: 90+ on mobile
   - ✓ Responsive design tested on small phones
   - ✓ Touch targets: 44px minimum for inputs/buttons

5. **Brand Safety**
   - ✓ No profanity, adult content, hateful content
   - ✓ Accurate calculations (invalid math kills credibility + ranking)
   - ✓ Original content (no copy-paste from other calculators)
   - ✓ Proper spelling/grammar (typos hurt SEO)

---

## Tool Implementation Checklist

Use this checklist when building a new tool. Check off each item before considering the tool "done."

### Phase 1: Foundation

- [ ] Types file created (`[Tool].types.ts`) with all interfaces
- [ ] Utils file created (`[Tool].utils.ts`) with core logic + tests
- [ ] Hook created (`use[Tool].ts`) with localStorage persistence
- [ ] Main component scaffold (`[Tool].tsx`) with all 6 sections
- [ ] Page created (`[tool-slug].tsx`) with metadata

### Phase 2: Inputs

- [ ] All input sliders work with dual input (slider + number field)
- [ ] All inputs update calculations in real-time (no submit button needed)
- [ ] localStorage saves/loads state correctly
- [ ] Reset button clears everything
- [ ] Mobile layout collapses to single column
- [ ] Tooltips explain every input

### Phase 3: Calculations

- [ ] Core calculation function is pure (no side effects)
- [ ] Edge cases handled (divide by zero, negative values, etc.)
- [ ] Result object contains all needed fields
- [ ] useMemo prevents unnecessary recalculations
- [ ] Numbers formatted with appropriate decimals/commas

### Phase 4: Results Display

- [ ] 4+ key metric cards with animated numbers
- [ ] Animated progress ring/indicator (if applicable)
- [ ] Microinteractions smooth and fast (<300ms)
- [ ] Sidebar adapts to mobile (becomes bottom section)
- [ ] Accessibility: all numbers have labels

### Phase 5: Visualization

- [ ] Chart tabs switch smoothly with framer-motion
- [ ] Tooltip shows clean formatted data
- [ ] Legend or labeled axes (not everyone reads legends)
- [ ] Mobile: charts aren't cramped (check actual device)
- [ ] Chart updates smoothly when inputs change

### Phase 6: Content & SEO

- [ ] Page title 50–60 chars, includes keyword
- [ ] Meta description 150–160 chars
- [ ] Header explains calculator in 1–2 sentences
- [ ] Input tooltips all filled out
- [ ] "What This Means" card after results
- [ ] 3 educational insight cards with real data
- [ ] Total word count ≥1500 words
- [ ] Heading hierarchy correct (no skipped levels)
- [ ] Schema.org markup present on component

### Phase 7: Design & Polish

- [ ] Tool-specific accent color defined throughout
- [ ] Section headers have numbered badges
- [ ] All spacing follows base-4 grid (4, 8, 12, 16, 20, 24px)
- [ ] Shadows consistent (sm, lg, xl only)
- [ ] Rounded corners consistent (lg, xl, 2xl, full only)
- [ ] Font sizes from standard scale
- [ ] Links use indigo-600 with hover state
- [ ] Buttons have scale hover effect (whileHover={{ scale: 1.02 }})

### Phase 8: Mobile & Performance

- [ ] Responsive on: iPhone SE (375px), iPhone 12 (390px), iPad (768px)
- [ ] Touch targets 44px+ (inputs, buttons)
- [ ] No horizontal scroll on mobile
- [ ] Images optimized (use Next.js Image component if any)
- [ ] Build size < 250KB (check `npm run build` output)
- [ ] Pagespeed: 90+ on mobile, 95+ on desktop
- [ ] Time to interactive < 3 seconds

### Phase 9: Testing

- [ ] Test on 3 devices: phone, tablet, desktop
- [ ] Test in Chrome, Firefox, Safari
- [ ] Sliders: input field, drag track, keyboard arrows all work
- [ ] LocalStorage clears when reset() called
- [ ] Refresh page, state persists
- [ ] Edge cases don't break (0 input, negative, huge numbers)
- [ ] No console errors

### Phase 10: Documentation

- [ ] README in tool folder (copy this guide, note any deviations)
- [ ] Code comments for non-obvious logic
- [ ] Type annotations complete (no implicit `any`)
- [ ] Exported functions have JSDoc if complex

### Phase 11: Homepage Update

- [ ] Add tool to tools[] array in `/src/pages/index.tsx`
- [ ] Set `isNew: true` for first 2 weeks
- [ ] Add link to footer in `/src/components/Layout/Footer.tsx`
- [ ] Update meta tags on homepage if needed

### Phase 12: Deploy & Monitor

- [ ] Deploy to production
- [ ] Google Search Console: Submit sitemap.xml
- [ ] Check rendering in Google Search Console (mobile)
- [ ] Set up Google Analytics tracking
- [ ] Monitor AdSense: impressions, CTR, revenue
- [ ] Gather user feedback (comments, social, analytics)

---

## Common Patterns & Examples

### Pattern 1: Animated Number in Summary Card

```tsx
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.2 }}
  className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-5 text-white"
>
  <p className="text-orange-100 mb-1 text-xs font-semibold uppercase">
    🔥 FIRE Number
  </p>
  <AnimatedNumber
    value={result.fireNumber}
    prefix="$"
    className="text-3xl font-extrabold block"
  />
  <p className="text-orange-200 text-xs mt-1">
    Based on {inputs.withdrawalRate}% withdrawal rate
  </p>
</motion.div>
```

**Reuse this for:**
- Monthly payment amount
- Total interest paid
- Years to financial goal
- Safe withdrawal amount

### Pattern 2: Tab-Switched Charts

```tsx
const chartTabs: { key: ChartTab; label: string; icon: string }[] = [
  { key: 'projection', label: 'Portfolio Growth', icon: '📈' },
  { key: 'breakdown', label: 'Growth Breakdown', icon: '📊' },
  { key: 'comparison', label: 'Strategies', icon: '🔥' },
];

return (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    {/* Tab buttons */}
    <div className="flex gap-1 p-4 border-b border-gray-100">
      {chartTabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveChart(tab.key)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            activeChart === tab.key
              ? 'bg-gradient-to-r from-[accent]-500 to-[accent]-600 text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>

    {/* Chart content with transitions */}
    <div className="p-6">
      {mounted && (
        <AnimatePresence mode="wait">
          {activeChart === 'projection' && (
            <motion.div key="projection" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Chart */}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  </div>
);
```

### Pattern 3: Educational Insights (Required for AdSense)

```tsx
<section className="mb-8">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="text-2xl mb-2">📐</div>
      <h4 className="font-bold text-gray-900 text-sm mb-1.5">
        The 4% Rule
      </h4>
      <p className="text-xs text-gray-500 leading-relaxed">
        Historical analysis of market returns shows that withdrawing 4% annually
        from a diversified 60/40 portfolio has historically sustained
        retirements lasting 30+ years in 95% of cases.
      </p>
    </div>
    {/* More insight cards */}
  </div>
</section>
```

**Why 3 cards?**
- Breaks up visual monotony
- Improves engagement metrics
- Helps AdSense detect quality content
- Each card is SEO-friendly chunk

### Pattern 4: Milestone Timeline (for Goal-Based Tools)

```tsx
{result.milestones.length > 0 && (
  <section className="mb-8">
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
        <span className="text-xl">🏁</span>
        Your Milestones
      </h3>
      <div className="flex items-start gap-0 overflow-x-auto pb-3">
        {result.milestones.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex-shrink-0 flex items-start w-28"
          >
            <div className="flex flex-col items-center w-full text-center">
              <div className="w-11 h-11 rounded-full bg-[accent]-100 flex items-center justify-center text-xl">
                {m.icon}
              </div>
              <span className="text-xs font-bold text-gray-900 mt-2">
                {m.label}
              </span>
              <span className="text-xs text-[accent]-600 mt-0.5">
                {formatCurrency(m.amount, true)}
              </span>
            </div>
            {i < result.milestones.length - 1 && (
              <div className="flex-shrink-0 w-4 flex items-center mt-5">
                <div className="w-3 h-0.5 bg-[accent]-300" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)}
```

---

## Deployment & Production Checklist

- [ ] No console errors (check DevTools)
- [ ] No 404 on imported assets
- [ ] AdSense tags properly installed in `_document.tsx`
- [ ] Sitemap generated and submitted
- [ ] robots.txt allows indexing
- [ ] 301 redirects set up if replacing old URLs
- [ ] Performance monitored (Core Web Vitals)
- [ ] User analytics tracked (Google Analytics 4)

---

## Questions & Escalation

If something is unclear or a tool has special requirements:

1. **Performance Issue?** Check bundle size, chart data size, number of calculations
2. **Design doesn't fit template?** Document deviation in README, get approval
3. **Unique calculation?** Add to types → utils → hook → component (same architecture)
4. **Ad placement unclear?** Default: above results, below inputs. Sidebar on desktop only.

---

## Summary

**Every tool must:**

✓ Use Next.js SSG (pre-rendered HTML)  
✓ Separate: types.ts, utils.ts, hook.ts, component.tsx, page.tsx  
✓ Unified blue-indigo palette with `slate-*` text (NOT `gray-*`)  
✓ Unified card style: `rounded-2xl shadow-md border border-slate-100`  
✓ Page background: `bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20`  
✓ Charts via Recharts ONLY (Chart.js removed from project)  
✓ Use the unified `CHART_COLORS` constant in every tool  
✓ Tailwind CSS only (no scoped styles)  
✓ localStorage for state persistence  
✓ URL query-param sync for shareable links  
✓ Full sharing bar: PDF, Excel, Copy URL, WhatsApp, Twitter  
✓ 1500+ words content (inputs, results, insights)  
✓ Educational tooltips on all inputs  
✓ Animated numbers & smooth transitions  
✓ Mobile-responsive design  
✓ 90+ PageSpeed score  
✓ Proper SEO metadata  

**Before you call it done, run through the 12-phase checklist.** 🎯

---

*Last reviewed: February 2026*  
*Examples: EMI Calculator, FIRE Calculator*  
*Questions? See Common Patterns section.*
