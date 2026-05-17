# Codebase Instructions for Claude Code

## Adding a Calculator

Use the `/new-calculator` skill — it contains the full workflow, file layout, mandatory requirements, and checklist. The skill is at `.claude/skills/new-calculator/SKILL.md`.

## Adding a Health Tool

Use the `/new-health` skill — it encodes the violet theme, `parent="health"`, component conventions, and checklist. The skill is at `.claude/skills/new-health/SKILL.md`.

## General Approach

- **SEO first:** Long-tail keywords, unique content, intent-matching, Core Web Vitals.
- **No premature abstraction:** Write for the current task, not hypothetical futures.
- **Recharts only** for charts.
- **Slate, not gray** for Tailwind colors.
- **One focused commit** per change.

## Rules

- **Build gate:** After any multi-file change, run `tsc --noEmit && npm run build` and fix all errors before declaring done. Don't batch fixes — re-run after each one.
- **SSR guard:** Dynamic imports of components using browser APIs must use `ssr: false`. Hydration mismatches are always this.
- **No bulk bash:** Ask before running `sed` or any script that touches many files. Use the Edit tool for targeted fixes. If a sed sweep is needed, show the command first.

## Home Page Wiring Rule

`src/data/masterItems.ts` is the single source of truth. Every item in `ALL_ITEMS` must appear on the home page (`src/pages/index.tsx`).

When you add a **new `ItemType`** (e.g. a new section like `pdf`), you MUST update `src/pages/index.tsx` in all of these places:

1. **Import** the new count from `masterItems` (e.g. `PDF_COUNT`).
2. **`filters` array** — add `{ key: 'newtype', label: '...', count: NEW_COUNT }`.
3. **Filter chip active color** — add a branch in the active-filter ternary (e.g. rose for pdf).
4. **Card hover shadow/border** — add a branch in the `className` ternary on `<Link>`.
5. **Type badge** — add a color branch and a label branch (e.g. `'text-rose-600 bg-rose-50 border-rose-200/60'` / `'PDF'`).
6. **Card title hover** — add a `group-hover:text-*` branch.
7. **Tag chips** — add a color branch.
8. **Page `<meta>` title, description, keywords** — mention the new section.
9. **SEO content section** — add a paragraph about the new section with a "Browse all N →" link.

Failing to do any of these means items exist in the data but are invisible or mis-labeled on the home page.

---

**Last Updated:** 2026-05-17

## Sections and Their Colors

| Section | Type slug | Filter / badge / tag color | Hero gradient |
|---|---|---|---|
| Finance | `calculator` | indigo | indigo→cyan |
| Dev Tools | `tool` | teal | teal→green |
| PDF Tools | `pdf` | rose | rose→orange-red |
| Everyday Tools | `utility` | amber | amber→orange→yellow |
| Health | `health` | violet | violet→purple→fuchsia |
