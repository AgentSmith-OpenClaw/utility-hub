# Codebase Instructions for Claude Code

## Tool Development

**When creating or modifying any calculator tool, read `TOOL_DEVELOPMENT_GUIDE.md` first.**

It contains mandatory requirements, acceptable patterns, and a pre-submission checklist. Update the guide if you discover new patterns or requirements not yet documented.

## Finance SEO Variants

The site uses a data-driven variant system at `src/content/finance-variants/` to create long-tail keyword landing pages. Each variant reuses an existing calculator engine with unique content. Variants auto-register in `_registry.ts`, auto-route via `[variant].tsx`, and auto-populate the sitemap.

**MANDATORY: every time a new finance calculator is created, also create 3–5 long-form variant URLs for it.** This multiplies SEO surface from one tool into 4–6 ranking pages targeting distinct long-tail keywords. Skip this step only if the user explicitly says not to.

Workflow when creating a new finance tool:
1. Add the tool component + page (canonical URL).
2. Register the new `calculatorId` in `_types.ts`, `_calculators.ts`, and the `CONCRETE_FINANCE_PAGES` set in `_registry.ts`.
3. Create 3–5 variant files in `src/content/finance-variants/`, each targeting a distinct long-tail keyword (use-case, demographic, comparison angle, or geo-modifier).
4. Wire all variants into `ALL_VARIANTS` in `_registry.ts`.
5. Run `tsc --noEmit && npm run build` — verify the new canonical + all variants build cleanly.

When adding variants: ensure unique content per variant (no cloning), verify slug does not collide with any concrete `/pages/finance/*.tsx` file, and confirm `calculatorId` validity.

## General Approach

- **SEO first:** Long-tail keywords, unique content, intent-matching, Core Web Vitals.
- **No premature abstraction:** Write for the current task, not hypothetical futures.
- **Recharts only** for charts.
- **Slate, not gray** for Tailwind colors.
- **One focused commit** per change.

---

**Last Updated:** 2026-05-13 — added mandatory variant-creation step for new finance tools.
