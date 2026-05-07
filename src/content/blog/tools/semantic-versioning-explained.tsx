import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const semanticVersioningExplained: BlogArticle = {
  slug: 'semantic-versioning-explained',
  category: 'Developer',
  title: 'Semantic Versioning: The Rules, the Edge Cases, and Why People Get It Wrong',
  description:
    'SemVer looks simple — major.minor.patch. The hard part is judging what counts as a breaking change. Learn the rules, the dependency-resolution implications, and the practical patterns that make versioning useful.',
  publishedDate: '2026-05-08',
  readTime: '10 min read',
  keywords:
    'semantic versioning, semver, breaking change, npm versioning, version pinning, major minor patch',
  relatedTools: [
    { name: 'JSON Viewer', href: '/tools/json-viewer' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        SemVer is a simple-looking standard that quietly shapes the entire JavaScript ecosystem (and many
        others). Get it right and your dependents thank you with confidence. Get it wrong and you ship a
        major-version-bumping nightmare or a deceptively-stable patch update that breaks production.
      </Lead>

      <H2>The basic rules</H2>
      <p>
        Versions are <code>MAJOR.MINOR.PATCH</code>. When you release changes:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>MAJOR (X.0.0):</strong> incompatible API changes. Existing code using your library may break.</li>
        <li><strong>MINOR (0.X.0):</strong> new features added in a backwards-compatible way. Existing code continues to work.</li>
        <li><strong>PATCH (0.0.X):</strong> bug fixes that don't change the API. Strict refactors and internal improvements.</li>
      </ul>

      <H2>What counts as a breaking change?</H2>
      <p>
        This is where most disagreements happen. Indisputably breaking:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Removing a function, method, or class.</li>
        <li>Renaming a public API.</li>
        <li>Changing a function's parameter list (positional).</li>
        <li>Changing a return type or shape.</li>
        <li>Throwing a new exception type that callers may not handle.</li>
        <li>Removing a configuration option.</li>
      </ul>

      <p>
        Debatably breaking (different communities disagree):
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Stricter input validation.</strong> Rejecting inputs that previously succeeded silently. Some say breaking; others say bug fix.</li>
        <li><strong>Performance regression.</strong> Same API, slower behavior. SemVer doesn't address performance, but real users break.</li>
        <li><strong>Bumping the minimum supported runtime.</strong> Requiring Node 18+ when 16 was supported is technically breaking for some users.</li>
        <li><strong>Changes to undocumented behavior.</strong> If users relied on it, fixing it breaks them. Hyrum's Law: with sufficient users, every observable behavior is depended upon.</li>
      </ul>

      <Callout title="The Hyrum's Law tension" accent="amber">
        Users will depend on every observable behavior, including ones you didn't mean to expose. Strict
        SemVer compliance means treating any change to <em>any</em> observable behavior as breaking. Practical
        SemVer means accepting that you'll occasionally break someone with what you considered a fix —
        and being honest about it when it happens.
      </Callout>

      <H2>Versioning of pre-1.0 software</H2>
      <p>
        Versions <code>0.x.y</code> are special. The SemVer spec says anything goes. In practice:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>0.MINOR may signal breaking changes.</li>
        <li>0.MINOR.PATCH still implies bug fixes only.</li>
        <li>Reaching 1.0 commits to API stability.</li>
      </ul>
      <p>
        Many libraries stay in 0.x for years to avoid the "commitment to 1.0" — Node.js's npm
        package landscape has hundreds of thousands of packages stuck at 0.x. This is fine; it just means
        consumers should pin minor versions (<code>~0.5.0</code>, not <code>^0.5.0</code>) for safety.
      </p>

      <H2>Pre-release and build metadata</H2>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><code>1.0.0-alpha.1</code> — pre-release. Sorted before 1.0.0.</li>
        <li><code>1.0.0-beta.2</code>, <code>1.0.0-rc.1</code> — same idea.</li>
        <li><code>1.0.0+build.123</code> — build metadata, ignored for ordering.</li>
      </ul>
      <p>
        Pre-release versions are not installed by default by package managers — you must opt in
        (<code>npm install foo@beta</code>).
      </p>

      <H2>Range operators (npm-style)</H2>
      <p>
        npm and Yarn use range operators in <code>package.json</code>:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong><code>^1.2.3</code> (caret):</strong> compatible with 1.2.3 — accepts patches and minors but not majors. So 1.2.3 to &lt; 2.0.0.</li>
        <li><strong><code>~1.2.3</code> (tilde):</strong> reasonably close — accepts patches but not minors. So 1.2.3 to &lt; 1.3.0.</li>
        <li><strong><code>1.2.3</code> (exact):</strong> only this version.</li>
        <li><strong><code>1.x</code>, <code>1</code>:</strong> any 1.x.x.</li>
        <li><strong><code>*</code> or <code>latest</code>:</strong> any version. Don't.</li>
      </ul>
      <p>
        Default for npm install: caret (<code>^</code>). For most production code, this is the right balance.
        For lockfile-only deployments, exact pinning is the safest.
      </p>

      <H2>The lockfile</H2>
      <p>
        <code>package-lock.json</code> (npm), <code>yarn.lock</code>, <code>pnpm-lock.yaml</code> record the
        exact versions installed. They make builds reproducible regardless of what new versions get published
        between yesterday's install and today's.
      </p>
      <p>
        Always commit the lockfile. CI should use <code>npm ci</code> (or equivalent) which installs exactly
        what the lockfile specifies — no version resolution, no surprises.
      </p>

      <H2>Calendar versioning (CalVer): the alternative</H2>
      <p>
        Some projects use date-based versions instead: <code>2024.10.27</code>. Examples: Ubuntu (24.04),
        JetBrains IDEs, pip.
      </p>
      <p>
        Pros:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>No semantic judgment required.</li>
        <li>Users can immediately tell how old a version is.</li>
      </ul>
      <p>
        Cons:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>No signal about breaking changes.</li>
        <li>Doesn't work well with package-manager range operators.</li>
      </ul>
      <p>
        CalVer fits applications and platforms; SemVer fits libraries with a stable public API.
      </p>

      <H2>Practical versioning patterns</H2>

      <H3>For library authors</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Document your API as the contract. Anything not documented is "internal" and can change in patches.</li>
        <li>Deprecate before removing. Mark APIs deprecated in a minor release; remove in a major release.</li>
        <li>Provide a migration guide for major releases. List every breaking change with before/after examples.</li>
        <li>Use changelogs. <code>CHANGELOG.md</code> in Keep-A-Changelog format.</li>
      </ul>

      <H3>For library consumers</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Use caret (<code>^</code>) ranges and trust the maintainer's SemVer for established libraries.</li>
        <li>Pin exact versions for high-stakes dependencies (auth libraries, security-sensitive code).</li>
        <li>Use Renovate or Dependabot to automate updates with PR-level review.</li>
        <li>Run a compatibility test suite that catches breaking changes you missed.</li>
      </ul>

      <H2>The 0.0.x trap</H2>
      <p>
        Some projects publish dozens of versions at <code>0.0.x</code>. This is a SemVer red flag:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>0.0.x means everything is unstable.</li>
        <li>npm caret on 0.0.x is treated as exact (no auto-updates).</li>
        <li>Users have no signal about feature additions vs bug fixes.</li>
      </ul>
      <p>
        Move to 0.1.0 once you have a working API. Move to 1.0.0 once it's stable enough for production
        use.
      </p>

      <H2>Common SemVer mistakes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Patch releases that change behavior.</strong> "Just a bug fix" breaks downstream code.</li>
        <li><strong>Major bumps for non-breaking changes.</strong> Inflated major version numbers (Chrome 130, Firefox 120) are CalVer in disguise.</li>
        <li><strong>Skipping deprecation.</strong> Going from feature → removed in one release breaks every consumer.</li>
        <li><strong>Re-using version numbers.</strong> Republishing the same version with different content. Lockfiles trust version numbers — never reuse.</li>
        <li><strong>No changelog.</strong> Users can't evaluate updates. <code>npm outdated</code> + no changelog = users skip your updates.</li>
      </ul>

      <KeyTakeaways
        items={[
          'MAJOR.MINOR.PATCH = breaking.feature.fix. The judgment call is what counts as breaking.',
          'Hyrum\'s Law: every observable behavior eventually has dependents. Strict SemVer means treating any change as potentially breaking.',
          '0.x.y versions are explicitly unstable. Stay there until you commit to API stability; then move to 1.0.0.',
          'Caret (^) accepts patches and minors; tilde (~) accepts only patches. Pin exact for high-stakes dependencies.',
          'Always commit lockfiles. Always document changelogs. Always deprecate before removing.',
        ]}
      />
    </div>
  ),
};
