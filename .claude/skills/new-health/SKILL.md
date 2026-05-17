# Skill: Adding a Health Tool

Use this skill whenever you add a new health tool to the `/health/*` section.

---

## Section Identity

| Property | Value |
|---|---|
| URL prefix | `/health/<slug>` |
| `parent` prop | `"health"` |
| `theme` prop | `"violet"` |
| Hero gradient | `from-violet-600 via-purple-600 to-fuchsia-500` |
| Badge / tag color | violet (`text-violet-700 bg-violet-50 border-violet-200/60`) |
| Accent color | `violet-600` |
| Section landing | `src/pages/health/index.tsx` |
| Component folder | `src/components/Health/` |
| Page folder | `src/pages/health/` |

---

## File Layout

For a new tool with slug `<slug>` and display name `Tool Name`:

```
src/components/Health/<ToolName>.tsx   ← the interactive component
src/pages/health/<slug>.tsx            ← the page wrapper
```

No new directories needed — both already exist.

---

## Component Conventions (`src/components/Health/<ToolName>.tsx`)

1. `'use client';` at the top (React hooks).
2. All accent colors use `violet-*` (600 for interactive, 50/200 for backgrounds/borders).
3. Input focus rings: `focus:ring-violet-300 focus:border-violet-400`.
4. Active/selected buttons: `bg-violet-600 text-white border-violet-600`.
5. Result highlight boxes: `bg-violet-50 border border-violet-200`.
6. Health tools **must** include a medical/disclaimer note at the bottom — "This tool is for informational purposes only. Consult a qualified healthcare provider for personalized advice."
7. SSR: if the component uses browser APIs (`navigator`, `window`, `localStorage`), the page must import it with `dynamic(..., { ssr: false })`.

---

## Page Wrapper (`src/pages/health/<slug>.tsx`)

```tsx
import Head from 'next/head';
import dynamic from 'next/dynamic';          // only if SSR guard needed
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const MyComponent = dynamic(() => import('../../components/Health/MyComponent'), { ssr: false });

const SLUG = '/health/<slug>';

const FAQS = [/* 4–6 relevant FAQs */];

export default function MyToolPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Tool Name',
    slug: SLUG,
    description: '...',
    category: 'UtilitiesApplication',
    featureList: '...',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>...</title>
        <meta name="description" content="..." />
        <meta name="keywords" content="..." />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🩺" title="Tool Name" tagline="..." parent="health" theme="violet">
        <MyComponent />
      </ToolShell>

      <ToolSEOContent description="..." features={[...]} steps={[...]} faqs={FAQS} relatedTools={[...]} />
    </>
  );
}
```

---

## Data Registration

In `src/data/masterItems.ts`, add an entry to the `HEALTH` array:

```ts
{
  name: 'Tool Name',
  description: 'One-sentence description for the home page card.',
  path: '/health/<slug>',
  icon: '🩺',
  tags: ['Health', 'Category', 'Keyword'],
  type: 'health',
  isNew: true,
},
```

`HEALTH` is already exported and included in `ALL_ITEMS`, so the home page card appears automatically.

---

## Breadcrumb Registration

In `src/utils/siteConfig.ts`, add to `STATIC_BREADCRUMB_LABELS`:

```ts
'<slug>': 'Tool Name',
```

(`'health': 'Health Tools'` is already registered.)

---

## Home Page Wiring

Because `'health'` is already a registered `ItemType`, **no changes to `src/pages/index.tsx`** are needed when adding a new health tool — the card renders automatically with violet colors.

Only update `index.tsx` if you are adding a **brand new `ItemType`** (which health already is).

---

## Checklist

- [ ] `src/components/Health/<ToolName>.tsx` created — violet accents, disclaimer note
- [ ] `src/pages/health/<slug>.tsx` created — `parent="health" theme="violet"`, `ssr: false` if needed
- [ ] Entry added to `HEALTH` array in `src/data/masterItems.ts`
- [ ] Slug added to `STATIC_BREADCRUMB_LABELS` in `src/utils/siteConfig.ts`
- [ ] `npx tsc --noEmit && npm run build` passes clean
- [ ] Tool appears on home page with violet badge, and at `/health/` landing page
