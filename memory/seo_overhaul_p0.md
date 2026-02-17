# P0: Toolisk Page Content Overhaul (SEO Offensive)

## Objective
Convert every tool page from a "thin" utility into a high-authority, long-form SEO asset. Target: 1500+ words per tool page, 100% human-grade, following Google Search Essentials (formerly Webmaster Guidelines).

## The Overhaul Protocol (Agent Smith & Gemini 3 Pro)
For each tool in `utility-hub/src/pages/finance/`:

1. **SERP & Keyword Audit (Tavily + Gemini 3 Pro):**
   - Identify top-performing competitors for the specific tool (e.g., "best mortgage calculator").
   - Extract primary, secondary, and "LSI" (Latent Semantic Indexing) keywords.
   - Identify "People Also Ask" (PAA) questions to build high-value FAQ sections.

2. **Structural Design:**
   - **Above the Fold:** The tool (Clean, no distractions).
   - **Section 1: The "Why":** Immediate value prop and how to use.
   - **Section 2: Deep Context:** Detailed explanation of the math, variables, and real-world implications.
   - **Section 3: Strategic Advice:** "How to save money using this tool," "Common mistakes to avoid."
   - **Section 4: Single FAQ Section:** Consolidate all FAQs into one semantically marked-up block (JSON-LD) to avoid indexing errors.

3. **Writing & Humanizing:**
   - Draft 1500+ words of genuinely useful content.
   - Pass through **Humanize Skill** to ensure natural flow and varied sentence structure.
   - **Constraint:** No "In conclusion," no "In today's fast-paced world." Just authority and value.

4. **Technical SEO Polish:**
   - Audit Meta Tags (Title, Description).
   - Verify Semantic HTML (H1-H4 hierarchy).
   - Ensure zero duplicate FAQ schema.

## Execution Order
1. **Mortgage Calculator** (High Value/Global) [DONE]
2. **Income Tax Calculator** (High Traffic/Current) [DONE]
3. **EMI / Amortization Calculator** (Consolidated SEO) [DONE]
4. **SIP / FIRE Calculators** (Investment Intent) [DONE]

## Engineering Safeguard
- Each page overhaul will be staged in a single long-lived branch: `feat/p0-seo-overhaul`.
- Full `npm run build` check before any commit.
- ONE final Merge Request once ALL tools are overhauled.
