# Tool Development Guide — Utility Hub

This document provides comprehensive guidelines for developing new calculator tools for Utility Hub. All new tools must follow these standards to ensure consistency, quality, and AdSense eligibility.

**Last Updated:** February 2026  
**Reference Tools:** EMI Calculator, FIRE Calculator

---

## Table of Contents

1. [Architecture & Technology Stack](#architecture--technology-stack)
2. [Design System & Visual Consistency](#design-system--visual-consistency)
3. [File Structure & Code Organization](#file-structure--code-organization)
4. [Component Patterns & Best Practices](#component-patterns--best-practices)
5. [Charting & Data Visualization](#charting--data-visualization)
6. [Styling Approach](#styling-approach)
7. [Content Requirements for AdSense & SEO](#content-requirements-for-adsense--seo)
8. [Tool Implementation Checklist](#tool-implementation-checklist)
9. [Common Patterns & Examples](#common-patterns--examples)

---

## Architecture & Technology Stack

### Core Technologies

- **Framework:** Next.js 14.2+ (Static Site Generation with SSG)
- **Language:** TypeScript (required for type safety)
- **Styling:** Tailwind CSS + CSS Modules (globals only, no scoped CSS per-component)
- **State Management:** React hooks (useState, useCallback, useMemo)
- **Animations:** Framer Motion (for engaging micro-interactions)
- **Charting:** Recharts (primary) or Chart.js (for comparison charts only—**NOT** both in same tool)
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

## Design System & Visual Consistency

### Color Palette

#### Primary Brand Colors
| Color | Hex | Usage | Tailwind Class |
|-------|-----|-------|---|
| Indigo (Primary) | `#4f46e5` | Brand, primary buttons, active states | `from-indigo-600 to-blue-600` |
| Blue (Secondary) | `#2563eb` | Links, secondary actions | `text-blue-600` |
| Gray | `#1f2937` → `#f3f4f6` | Text hierarchy, backgrounds | `gray-900` to `gray-50` |

#### Tool-Specific Accent Colors (One Per Tool)
| Tool | Accent | Gradient | Usage |
|------|--------|----------|-------|
| EMI | Blue | `from-blue-500 to-indigo-600` | Cards, sliders, badges |
| FIRE | Orange | `from-orange-500 to-red-600` | Cards, sliders, badges |
| **Next Tool** | *Define one* | `from-[color]-500 to-[shade]-600` | Sections, progress indicators |

**Rule:** One accent color per tool—consistent throughout. Use that color for:
- Section header badges (numbered circles)
- Slider tracks and thumbs
- Card gradients and accents
- Active buttons/tabs
- Chart series
- Progress indicators

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
/* Card Shadows */
shadow-sm:  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);  /* subtle, desktop backgrounds */
shadow-lg:  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);  /* main input/output cards */
shadow-xl:  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);  /* hero, emphasis */

/* Borders */
border-gray-100:    for light dividers
border-gray-200:    for card outlines
border-[tool-color]-200:  for tool-specific emphasis
0 or 0.5px:         use Tailwind defaults (border, border-2)

/* Rounded Corners */
rounded-lg:   8px   (input fields, modals)
rounded-xl:   12px  (cards, major sections)
rounded-2xl:  16px  (hero section, featured cards)
rounded-full: 9999px (badges, progress circles)
```

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

### Chart Library Strategy

**Primary:** Recharts  
**Secondary:** Chart.js (if using complex stacked/mixed charts requiring special rendering)  
**Don't:** Mix both in the same tool (creates bundle bloat)

### Recommended Charts by Use Case

| Use Case | Library | Component | Example |
|---|---|---|---|
| Wealth/balance over time | Recharts | `<AreaChart>` | FIRE portfolio growth |
| Stacked contributions | Recharts | `<AreaChart>` with `stackId` | FIRE contributions vs growth |
| Loan schedule breakdown | Chart.js | `Chart.register()` + `<Line>` | EMI principal vs interest |
| Comparison bars | Recharts | `<BarChart>` | FIRE types side-by-side |
| Pie/donut breakdown | Chart.js | `<Doughnut>` | EMI principal:interest ratio |
| Historical cycles | N/A | Or use Recharts with historical data | Future: backtesting features |

### Chart Best Practices

#### 1. Custom Tooltip

```tsx
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 px-4 py-3">
      <p className="text-sm font-bold text-gray-900 mb-1.5">Label: {label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color || entry.stroke }}
          />
          <span className="text-gray-500">{entry.name}:</span>
          <span className="font-semibold">{formatCurrency(entry.value)}</span>
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

### Why Content Quality Matters

Google AdSense requires:
1. **Original, high-quality content** — calculators must educate, not just compute
2. **Adequate content** — thin pages get penalized
3. **User engagement signals** — time on page matters
4. **Mobile-friendly, fast** — we handle this technically; you handle content

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
✓ One accent color throughout (card headers, sliders, badges)  
✓ Charts via Recharts OR Chart.js (not both)  
✓ Tailwind CSS only (no scoped styles)  
✓ localStorage for state persistence  
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
