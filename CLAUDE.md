# Codebase Instructions for Claude Code

## Adding a Calculator

Use the `/new-calculator` skill — it contains the full workflow, file layout, mandatory requirements, and checklist. The skill is at `.claude/skills/new-calculator/SKILL.md`.

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

---

**Last Updated:** 2026-05-13
