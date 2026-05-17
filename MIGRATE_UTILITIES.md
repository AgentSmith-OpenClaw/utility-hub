# Migration: Split "Everyday Tools" out of `/tools` into `/utilities`

**One-time job.** This file describes the migration. The going-forward skill is at `.claude/skills/new-utility/SKILL.md`. Read both before starting.

## Why

Today, `/tools/*` mixes developer utilities (regex tester, JWT decoder, JSON formatter) with everyday utilities (percentage calculator, age calculator, unit converter). The filter chip and section page both say "Dev Tools," which mislabels the everyday ones and dilutes the SEO keyword cluster.

Splitting creates a third top-level section, **"Everyday Tools"** at `/utilities`, with its own landing page, keyword cluster, and visual identity. `/tools` becomes exclusively developer/designer/writer tooling.

## Section identity

| Attribute | Value |
|---|---|
| Type slug (code) | `'utility'` |
| Filter chip label (home page) | `Utilities` |
| Section page label / breadcrumb | `Everyday Tools` |
| Route prefix | `/utilities` |
| Index page | `/utilities` |
| Color theme | **amber** (`amber-600` primary, `amber-50` backgrounds, `amber-200/60` borders) |
| Hero gradient | `from-amber-500 via-orange-500 to-yellow-400` |

The hero gradient distinguishes this section from `/finance` (indigo→cyan), `/tools` (teal→green), and `/pdf` (rose→orange-red).

---

## Scope — what moves

### Must move (clearly not "developer" tools)
1. **Percentage Calculator** — `/tools/percentage-calculator` → `/utilities/percentage-calculator`
2. **Age & Date Calculator** — `/tools/age-calculator` → `/utilities/age-calculator`
3. **Unit Converter** — `/tools/unit-converter` → `/utilities/unit-converter`

### Strong candidates (move unless there's a reason not to)
4. **Pomodoro Timer** — `/tools/pomodoro-timer` → `/utilities/pomodoro-timer` — productivity, not developer-specific
5. **QR Code Generator** — `/tools/qr-code-generator` → `/utilities/qr-code-generator` — everyone uses QR codes, not just devs

### Stays in `/tools` (developer/designer-leaning, even if generally useful)
- Aspect Ratio Calculator — designer/video tool
- Color Palette / Color Contrast / Color Converter — designer tools
- Morse Code Converter — niche/fun, but classified with encoders
- Caesar Cipher — paired with security tools
- Everything else under `/tools/`

If unsure about any item, list it in your plan and ask before moving.

---

## Order of operations

Do the foundation work first, then move pages one at a time, then wire the home page. Verify the build at each phase.

### Phase 1 — Foundation (no user-visible changes yet)

1. **Extend `ItemType` in `src/data/masterItems.ts`:**
   ```ts
   export type ItemType = 'calculator' | 'tool' | 'pdf' | 'utility';
   ```

2. **Add empty `UTILITIES` array + exports:**
   ```ts
   const UTILITIES: MasterItem[] = [];
   export { CALCULATORS, TOOLS, PDFS, UTILITIES };
   export const ALL_ITEMS: MasterItem[] = [...CALCULATORS, ...TOOLS, ...PDFS, ...UTILITIES];
   export const UTILITY_COUNT = UTILITIES.length;
   ```

3. **Add `theme` prop to `ToolShell` (`src/components/Tools/ToolShell.tsx`):**
   - Accept `theme?: 'emerald' | 'amber' | 'rose'` (default `'emerald'`).
   - Map to hero gradient + breadcrumb accent classes. The existing `/tools/*` pages keep working unchanged because they don't pass `theme` (defaults to `'emerald'`).
   - Recommended mapping:
     - `emerald` → `from-teal-600 via-emerald-600 to-green-500` (current default)
     - `amber` → `from-amber-500 via-orange-500 to-yellow-400`
     - `rose` → `from-rose-600 via-red-600 to-orange-500` (in case PDF pages adopt it later)

4. **Add `'utilities': 'Everyday Tools'` to `STATIC_BREADCRUMB_LABELS` in `src/utils/siteConfig.ts`.**

5. **Build gate.** `npx tsc --noEmit && npm run build` must pass before continuing.

### Phase 2 — Create the index page

6. **Create `src/pages/utilities/index.tsx`** by mirroring `src/pages/tools/index.tsx`:
   - Read from `UTILITIES` in `masterItems.ts` (not a duplicated array).
   - Title: `Everyday Tools — Percentage, Age, Unit Converter & More | Toolisk`
   - Meta description: lead with "Free everyday utilities…"
   - Apply amber theme to hero gradient, filter chips, and card hover/border colors.
   - Include 300-500 words of unique SEO body content describing the section.
   - Page count will be 0 until items are moved — that's fine, content section can still describe what's coming.

### Phase 3 — Move each item (repeat per item)

For each item in scope, do these steps in order:

7. **Move the component file.** `src/components/Tools/[PascalName].tsx` → `src/components/Utilities/[PascalName].tsx`. Update any imports inside the file if they used relative paths to siblings.

8. **Update the page file.**
   - Create `src/pages/utilities/[slug].tsx` based on the existing `src/pages/tools/[slug].tsx`.
   - Change `SLUG` constant to `/utilities/[slug]`.
   - Change component import to `../../components/Utilities/[PascalName]`.
   - Add `theme="amber"` to `<ToolShell>`.
   - Update any in-page `relatedTools` href values that pointed to siblings being moved alongside this one.

9. **Recolor the component for amber accent.** Search-and-replace inside the moved component:
   - `emerald-` → `amber-` (focus rings, primary buttons, result highlights)
   - `teal-` → `amber-` (if present)
   - Keep `slate-*` neutrals, `rose-*` errors, `sky-*` info as-is. Do not change.

10. **Move masterItems entry.** Cut the entry from `TOOLS`, paste into `UTILITIES`, and:
    - Change `type: 'tool'` → `type: 'utility'`
    - Change `path: '/tools/[slug]'` → `path: '/utilities/[slug]'`

11. **Add a redirect stub at the old path.** Static export means we can't use server redirects. Replace the moved page file at `src/pages/tools/[slug].tsx` (do NOT delete it) with a meta-refresh stub:

    ```tsx
    import Head from 'next/head';
    import Link from 'next/link';
    import { SITE_URL } from '../../utils/siteConfig';

    const NEW_PATH = '/utilities/[slug]';

    export default function RedirectStub() {
      return (
        <>
          <Head>
            <title>Moved — see new location</title>
            <meta httpEquiv="refresh" content={`0; url=${NEW_PATH}`} />
            <meta name="robots" content="noindex" />
            <link rel="canonical" href={`${SITE_URL}${NEW_PATH}`} />
          </Head>
          <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="text-center max-w-md">
              <p className="text-slate-600 mb-4">This tool has moved.</p>
              <Link href={NEW_PATH} className="text-amber-600 font-medium hover:underline">
                Go to the new page →
              </Link>
            </div>
          </div>
        </>
      );
    }
    ```

    This preserves the URL while telling search engines to drop the old one and pointing visitors to the new page.

12. **Delete the old breadcrumb entry only if the slug differs.** Slugs are unchanged (e.g. `percentage-calculator` stays `percentage-calculator`), so `STATIC_BREADCRUMB_LABELS` needs no edit per item — the same key serves both routes.

13. **Update `src/pages/tools/index.tsx`** to remove the moved item from the `tools` array, and bump the tool count down in the page `<title>`, meta description, and OG tags.

14. **Update sibling `relatedTools` arrays.** Any `/tools/*` page that lists the moved item as a related tool needs its href updated to `/utilities/[slug]`. Similarly, the moved page's own `relatedTools` may now point to items that are also being moved — update those hrefs to `/utilities/...`.

15. **Build gate.** `npx tsc --noEmit && npm run build` must pass before moving the next item.

### Phase 4 — Wire into home page

16. **`src/pages/index.tsx`** — follow the existing "Home Page Wiring Rule" in `CLAUDE.md`:
    - Import `UTILITY_COUNT` from `masterItems`.
    - Add to `filters`: `{ key: 'utility', label: 'Utilities', count: UTILITY_COUNT }`.
    - Add an `amber` branch to the filter chip active-color ternary.
    - Add an `amber` branch to the card hover shadow/border ternary.
    - Add an `amber` branch to the type badge color ternary and the badge label ternary (`item.type === 'utility' ? 'Utility' : ...`).
    - Add an `amber` branch to the card title `group-hover:text-*` ternary.
    - Add an `amber` branch to the tag chips color ternary.
    - Update page `<title>`, meta description, keywords, OG, and Twitter tags to mention everyday utilities.
    - Add a new SEO section in the article body describing Everyday Tools with a "Browse all N utilities →" link to `/utilities`.

17. **`CLAUDE.md`** — no changes needed; the existing "Home Page Wiring Rule" already covers this case generically.

18. **Final build gate.** `npx tsc --noEmit && npm run build` must pass. Visit `/`, `/tools`, `/utilities`, and each moved page in `npm run dev` to verify:
    - Home page filter chip "Utilities" works and shows amber styling.
    - `/utilities` lists the moved items.
    - `/tools` no longer lists them, and the count is decremented.
    - Each moved page loads, has amber theme, and breadcrumb reads `Home › Everyday Tools › [Name]`.
    - Old `/tools/[slug]` paths redirect (meta-refresh) to `/utilities/[slug]`.

---

## Acceptance criteria

- [ ] `ItemType` includes `'utility'`
- [ ] `UTILITIES` array populated; `UTILITY_COUNT` exported
- [ ] `ToolShell` accepts `theme?: 'emerald' | 'amber' | 'rose'`; existing pages unaffected
- [ ] `/utilities` index page exists, reads from `UTILITIES`, amber theme
- [ ] Each moved item:
  - [ ] Lives at `src/components/Utilities/[PascalName].tsx` and `src/pages/utilities/[slug].tsx`
  - [ ] Uses `theme="amber"` on `ToolShell`
  - [ ] Component accent colors are amber (no leftover emerald/teal in moved components)
  - [ ] Breadcrumb reads `Home › Everyday Tools › [Name]`
  - [ ] `masterItems.ts` entry has `type: 'utility'` and `path: '/utilities/[slug]'`
  - [ ] Old `/tools/[slug]` is a redirect stub with `<meta name="robots" content="noindex">` and `<link rel="canonical">` to the new URL
  - [ ] All sibling `relatedTools` entries pointing to this item now use the new path
- [ ] `src/pages/tools/index.tsx` no longer lists moved items; tool count decremented in title/meta
- [ ] Home page has a "Utilities" filter chip with amber styling; type badge / card colors / tags handle `'utility'`
- [ ] Home page `<meta>` mentions everyday utilities; SEO article body has a Utilities section
- [ ] `npx tsc --noEmit && npm run build` passes cleanly
- [ ] Manual smoke test passes in `npm run dev`

---

## Notes / gotchas

- **Static export means no server redirects.** The meta-refresh stub is the workaround. Don't try to add Next.js `redirects` config — they won't run with `output: 'export'`.
- **Don't rename slugs.** Keeping `percentage-calculator` (etc.) means existing inbound links and the canonical chain still resolve through the new URL.
- **Don't change the breadcrumb label key.** The same key (`'percentage-calculator'`) serves both the old redirect stub and the new utilities page.
- **Don't delete the old page files.** Replace them with the redirect stub so search engines see the move rather than a 404.
- **One commit per moved item is preferable** — easier to bisect if a recoloring breaks something. The foundation (Phase 1–2) and the home-page wiring (Phase 4) can each be their own commit.
- After completing this migration, this file (`MIGRATE_UTILITIES.md`) can be deleted. The skill at `.claude/skills/new-utility/SKILL.md` is the going-forward reference.
