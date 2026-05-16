# 9 New Tools to Add Under `/tools/*`

**For the agent picking this up:** use the `/new-tool` skill (at `.claude/skills/new-tool/SKILL.md`) for every tool below. The skill encodes the layout, design system, breadcrumb registration, and SEO conventions used by the existing 37 tools — follow it exactly, don't invent variations.

**Process per tool**

1. Read `.claude/skills/new-tool/SKILL.md` once before starting.
2. Build one tool end-to-end: component → page → `siteConfig` breadcrumb label → `/tools` index entry + count bump → reciprocal `relatedTools` on ≥ 2 sibling pages.
3. Run `npx tsc --noEmit && npm run build`. Fix errors. Re-run until clean.
4. Commit as a single focused commit. Then move to the next tool.
5. After all 9 are merged, the `/tools` index count should read **46** (currently 37) and be updated in title, meta description, and OG tags.

**Don't:**
- Don't bundle multiple tools into a single PR/commit.
- Don't add server routes — every tool is 100% client-side.
- Don't reach for new dependencies unless absolutely necessary; check `package.json` first. If you need a tiny utility, prefer hand-rolling it (existing tools mostly do).
- Don't change the hero gradient (`from-teal-600 via-emerald-600 to-green-500`) — site-wide consistency is intentional.

---

## 1. JSONPath Tester

- **Slug:** `jsonpath-tester`
- **Icon:** `🧭`
- **Tags:** `Developer`, `JSON`, `Query`
- **Tagline:** Run JSONPath expressions against any JSON and see matching nodes highlighted in real time.
- **What it does:** Paste JSON on the left, a JSONPath expression on top (e.g. `$.store.book[?(@.price < 10)].title`), and show every matched node — both as a list and highlighted in the formatted JSON. Include 6–8 preset expressions (`$..author`, `$.store.book[*].title`, etc.) and a cheatsheet card listing operators (`$`, `.`, `..`, `[*]`, `[?(...)]`, `[start:end]`). Add a "syntax: JSONPath | JMESPath" toggle if low-effort; otherwise stick to JSONPath only.
- **Why it ranks:** "jsonpath tester / online jsonpath evaluator" has steady developer search volume and the leading sites are ad-heavy and slow.
- **Cluster siblings (for `relatedTools` + reciprocal links):** JSON Viewer, YAML/JSON Converter, Regex Tester.
- **Implementation note:** Use a tiny JSONPath evaluator. There's `jsonpath-plus` on npm (small, well-typed). If you'd rather not add a dep, a 200-line hand-roll covers 95% of paths — but check `package.json` first.

---

## 2. JSON Diff

- **Slug:** `json-diff`
- **Icon:** `🔍`
- **Tags:** `Developer`, `JSON`, `Diff`
- **Tagline:** Compare two JSON documents semantically — see added, removed, and changed keys regardless of property order.
- **What it does:** Two side-by-side JSON inputs. Output is a structured diff tree showing `+ added`, `- removed`, `~ changed` keys with both old and new values, plus a "flat path" view (`user.address.city: "NYC" → "LA"`). Crucially, this must be *semantic* (key-order independent) — the existing `text-diff` tool only handles line-level text. Include sample JSON pair button.
- **Why it ranks:** "json diff / compare json online" is high-volume; users explicitly want semantic, not line-text diff.
- **Cluster siblings:** JSON Viewer, Text Diff, YAML/JSON Converter.
- **Implementation note:** Hand-roll the recursive diff in `JsonDiff.utils.ts`-style helper. No external dep needed.

---

## 3. JWT Generator

- **Slug:** `jwt-generator`
- **Icon:** `🔑`
- **Tags:** `Security`, `JWT`, `Auth`
- **Tagline:** Generate signed JSON Web Tokens locally — HS256, HS384, HS512 — using the WebCrypto API, no servers.
- **What it does:** Inputs: header JSON (default `{ "alg": "HS256", "typ": "JWT" }`), payload JSON (with `iat`, `exp`, `sub` helpers — buttons that insert valid values), and a secret. Output: the signed JWT plus a "Decode this token" deep-link to `/tools/jwt-decoder`. Stick to HMAC algorithms — RS256/ES256 need key-pair generation UI and is out of scope for v1. Add a clear warning that secrets are processed locally but should never be a real production secret pasted into any web page.
- **Why it ranks:** "jwt generator / create jwt online" pairs naturally with the existing JWT decoder; cross-linking compounds the cluster's authority.
- **Cluster siblings:** JWT Decoder, Hash Generator, Base64 Encoder/Decoder. **Add reciprocal link from JWT Decoder page** — high-leverage.
- **Implementation note:** WebCrypto: `crypto.subtle.importKey('raw', ...)` + `crypto.subtle.sign('HMAC', ...)`. Base64URL-encode header, payload, signature. No external lib needed.

---

## 4. CIDR / Subnet Calculator

- **Slug:** `cidr-subnet-calculator`
- **Icon:** `🌐`
- **Tags:** `Developer`, `Networking`, `IP`
- **Tagline:** Calculate network range, broadcast, usable hosts, and subnet mask from any IPv4 CIDR block.
- **What it does:** Input: a CIDR (e.g. `192.168.1.0/24`) or an IP + mask. Output cards: network address, broadcast address, first/last usable host, total hosts, usable hosts, wildcard mask, dotted-decimal subnet mask, binary subnet mask. Add a "split into /N subnets" helper that lists the first 16 child subnets given a target prefix. Stick to IPv4 for v1; IPv6 doubles the UI work.
- **Why it ranks:** Sysadmins and devs Google this constantly; existing tools are aged and ad-spammy.
- **Cluster siblings:** Number Base Converter, Hash Generator, Chmod Calculator.
- **Implementation note:** Pure bitmath in JS — `parseInt(octet, 10)` per octet, `>>>` for unsigned shifts. ~150 lines.

---

## 5. QR Code Generator

- **Slug:** `qr-code-generator`
- **Icon:** `📱`
- **Tags:** `Web`, `QR`, `Utility`
- **Tagline:** Turn any URL, text, Wi-Fi credential, or vCard into a downloadable QR code — PNG and SVG, fully client-side.
- **What it does:** Input: text/URL plus a "preset" picker (Plain text, URL, Wi-Fi, vCard, Email, SMS) that swaps the input form for the right fields and assembles the encoded string for you. Controls: error-correction level (L/M/Q/H), size (px), foreground + background color pickers (default black/white), optional rounded modules. Output: live QR preview, "Download PNG", "Download SVG", "Copy as data URL".
- **Why it ranks:** Massive search volume; users want it download-ready without account walls.
- **Cluster siblings:** URL Encoder, Image to Base64, Color Converter.
- **Implementation note:** Use `qrcode` (well-trodden, MIT, tiny) for the matrix; render to `<canvas>` for PNG and build SVG string for SVG export. Or render `qrcode.toDataURL()` and `qrcode.toString({ type: 'svg' })` directly.

---

## 6. CSS Box Shadow Generator

- **Slug:** `box-shadow-generator`
- **Icon:** `🌗`
- **Tags:** `Design`, `CSS`, `Generator`
- **Tagline:** Build CSS box-shadows visually — drag sliders, stack multiple layers, and copy production-ready CSS.
- **What it does:** Live preview card on the right (a sample button + sample card to show shadow on different surfaces). Left panel: sliders for offset-x, offset-y, blur, spread, color (with opacity), `inset` toggle. Support **multiple stacked shadows** (a list with add/remove/reorder) — this is the differentiator vs. the dozen "single-shadow" generators that rank today. Output the CSS as `box-shadow: ...;` with copy button. Include 6 curated presets (Material-style elevations, neumorphism, hard offset, glow).
- **Why it ranks:** "box shadow generator / css shadow" is evergreen, and most existing tools only handle one shadow layer.
- **Cluster siblings:** Color Converter, Color Palette, CSS Unit Converter.
- **Implementation note:** No dependencies — `useState` array of shadow layers, serialize to CSS string.

---

## 7. Color Contrast Checker (WCAG)

- **Slug:** `color-contrast-checker`
- **Icon:** `♿`
- **Tags:** `Design`, `Accessibility`, `WCAG`
- **Tagline:** Check WCAG 2.2 contrast ratios between any foreground and background — see AA / AAA passes for normal, large, and UI text.
- **What it does:** Two color inputs (foreground/background) with HEX, RGB, and color-picker entry. Output: large contrast ratio number (`4.52 : 1`), pass/fail badges for WCAG AA / AAA at normal text (4.5 / 7), large text (3 / 4.5), and non-text UI (3). Live preview swatches: sample paragraph, sample heading, sample button — rendered in the actual color pair. Add a "Suggest a passing variant" button that nudges the foreground color (HSL lightness step) until it hits AA — this is the differentiator vs. read-only checkers.
- **Why it ranks:** Designers and devs need this for WCAG compliance; long-tail keywords like "wcag contrast checker", "AAA contrast", "accessibility color".
- **Cluster siblings:** Color Converter, Color Palette, CSS Unit Converter.
- **Implementation note:** WCAG relative-luminance formula is well-documented — straight math. No deps.

---

## 8. cURL to Code Converter

- **Slug:** `curl-to-code`
- **Icon:** `🔄`
- **Tags:** `Developer`, `HTTP`, `cURL`
- **Tagline:** Paste a cURL command and get the equivalent fetch, axios, Python requests, or Node.js https code instantly.
- **What it does:** Single input: a `curl ...` command (multi-line OK, support `\`-line continuations). Output tabs: **fetch (browser)**, **axios**, **Python requests**, **Node `https`**, **Go net/http**. Parse cURL flags: `-X / --request`, `-H / --header`, `-d / --data`, `--data-raw`, `--data-urlencode`, `-u / --user`, `--cookie`, `--compressed`. Show parsed URL/method/headers/body breakdown card above the code outputs as a sanity check.
- **Why it ranks:** Hugely popular dev utility; the leading site (curlconverter.com) is excellent but lonely — there's room.
- **Cluster siblings:** URL Encoder, JSON Viewer, HTTP Status Codes.
- **Implementation note:** Shell-style tokenizer for the curl line is the only hard bit — handle single quotes, double quotes, escapes. Don't try to be 100% cURL-compatible; cover the common 80% (`-X`, `-H`, `-d`, `-u`) and document what's not supported in the FAQ.

---

## 9. User Agent Parser

- **Slug:** `user-agent-parser`
- **Icon:** `🕵️`
- **Tags:** `Developer`, `HTTP`, `Browser`
- **Tagline:** Decode any User-Agent string into browser, engine, OS, device type, and version — paste a UA or detect your own.
- **What it does:** Input: a User-Agent string (with a "Use my browser's UA" button). Output cards: browser name + version, rendering engine + version, OS + version, device type (desktop/mobile/tablet/bot), CPU architecture if detectable, and a "is this likely a bot?" badge. Include 8 preset UAs (Chrome desktop, Safari iOS, Googlebot, curl, etc.) for one-click testing.
- **Why it ranks:** Web devs and analytics folks search for this; existing tools are mostly aged.
- **Cluster siblings:** HTTP Status Codes, URL Encoder, JWT Decoder.
- **Implementation note:** `ua-parser-js` is the standard, MIT, and tiny. Or hand-roll regex matchers if you want zero deps — it's about 60 lines for the common cases.

---

## Cross-cutting reminders

- **Breadcrumb labels:** every new slug must go into `STATIC_BREADCRUMB_LABELS` in `src/utils/siteConfig.ts`. The `ToolShell` breadcrumb (`Home › Tools › [Tool Name]`) reads from there.
- **`/tools` index:** add an entry to the `tools` array in `src/pages/tools/index.tsx` with `isNew: true`, and bump the count from 36 → 45 → 46 (or whatever the final number is) in title, meta description, and OG tags.
- **Reciprocal `relatedTools`:** for each new tool, edit ≥ 2 existing in-cluster pages to include the new one in their `relatedTools`. This is the single biggest lever against pages getting stuck in "Discovered – currently not indexed". Listed siblings above are the right targets.
- **Build gate per tool:** `npx tsc --noEmit && npm run build` — must be clean before the commit.
- **Commit style:** match recent commits in this repo. Single focused commit per tool.

That's the brief. Pick them up in order or in parallel — they're independent.
