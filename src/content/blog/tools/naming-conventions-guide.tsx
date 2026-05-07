import Link from 'next/link';
import type { BlogArticle } from '../types';

export const namingConventionsGuide: BlogArticle = {
  slug: 'naming-conventions-guide',
  category: 'Developer',
    title: 'Naming Conventions: camelCase, snake_case, kebab-case Explained',
    description:
      'A practical guide to the casing conventions used across programming languages, frameworks, and platforms.',
    publishedDate: '2026-05-07',
    readTime: '6 min read',
    keywords: 'naming conventions, camelCase, snake_case, kebab-case, PascalCase, code style',
    relatedTools: [
      { name: 'Case Converter', href: '/tools/case-converter' },
      { name: 'Word Counter', href: '/tools/word-counter' },
    ],
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          Programming has surprisingly many ways to write a multi-word name. Most communities have settled on
          conventions, and following them isn&apos;t pedantry — it&apos;s a courtesy that lets the next developer
          read your code without friction.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The casing zoo</h2>
        <ul className="list-none space-y-3 my-4">
          <li><strong>camelCase</strong> — first word lowercase, subsequent words capitalized. <em>userProfile</em></li>
          <li><strong>PascalCase</strong> — every word capitalized. <em>UserProfile</em></li>
          <li><strong>snake_case</strong> — lowercase, words joined by underscores. <em>user_profile</em></li>
          <li><strong>SCREAMING_SNAKE_CASE</strong> — uppercase snake_case. <em>USER_PROFILE</em></li>
          <li><strong>kebab-case</strong> — lowercase, words joined by hyphens. <em>user-profile</em></li>
          <li><strong>Train-Case</strong> — capitalized words joined by hyphens. <em>User-Profile</em></li>
          <li><strong>dot.case</strong> — lowercase, words joined by dots. <em>user.profile</em></li>
        </ul>

        <div className="my-8 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Convert any name:</strong> Paste in one case, get every variation instantly.
          </p>
          <Link
            href="/tools/case-converter"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Open Case Converter →
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Conventions by language</h2>
        <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200">
          <table className="w-full text-sm">
            <thead><tr><th className="text-left py-2">Language</th><th className="text-left py-2">Variables</th><th className="text-left py-2">Functions</th><th className="text-left py-2">Classes/Types</th><th className="text-left py-2">Constants</th></tr></thead>
            <tbody>
              <tr><td className="py-2 font-semibold">JavaScript / TypeScript</td><td>camelCase</td><td>camelCase</td><td>PascalCase</td><td>SCREAMING_SNAKE</td></tr>
              <tr><td className="py-2 font-semibold">Python</td><td>snake_case</td><td>snake_case</td><td>PascalCase</td><td>SCREAMING_SNAKE</td></tr>
              <tr><td className="py-2 font-semibold">Java</td><td>camelCase</td><td>camelCase</td><td>PascalCase</td><td>SCREAMING_SNAKE</td></tr>
              <tr><td className="py-2 font-semibold">Go</td><td>camelCase / PascalCase*</td><td>camelCase / PascalCase*</td><td>PascalCase</td><td>PascalCase</td></tr>
              <tr><td className="py-2 font-semibold">Rust</td><td>snake_case</td><td>snake_case</td><td>PascalCase</td><td>SCREAMING_SNAKE</td></tr>
              <tr><td className="py-2 font-semibold">C#</td><td>camelCase</td><td>PascalCase</td><td>PascalCase</td><td>PascalCase</td></tr>
              <tr><td className="py-2 font-semibold">SQL</td><td>snake_case</td><td>—</td><td>—</td><td>—</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-3">* In Go, capitalization controls visibility: PascalCase is exported, camelCase is private to the package.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Conventions by context</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>URLs:</strong> kebab-case (<code>/user-profile</code>) — readable, no encoding needed.</li>
          <li><strong>CSS class names:</strong> kebab-case (<code>.user-profile</code>) — matches CSS naming tradition.</li>
          <li><strong>HTML attributes:</strong> kebab-case (<code>data-user-id</code>) — required by spec for custom data attributes.</li>
          <li><strong>HTTP headers:</strong> Train-Case (<code>Content-Type</code>) — case-insensitive but conventionally Train-Case.</li>
          <li><strong>Environment variables:</strong> SCREAMING_SNAKE (<code>DATABASE_URL</code>) — universal Unix convention.</li>
          <li><strong>JSON keys:</strong> usually camelCase (matches JavaScript) or snake_case (matches Python).</li>
          <li><strong>File names:</strong> kebab-case (<code>user-profile.tsx</code>) is most common in JS/TS; snake_case in Python/Ruby; PascalCase for class files in Java/C#.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">JSON: the cross-cultural minefield</h2>
        <p>
          JSON traveled between every language ecosystem, so naming conventions vary. Common practices:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>JavaScript/Node APIs:</strong> camelCase (<code>{`{"firstName": "Ada"}`}</code>)</li>
          <li><strong>Python/Ruby APIs:</strong> snake_case (<code>{`{"first_name": "Ada"}`}</code>)</li>
          <li><strong>Public APIs serving multiple languages:</strong> often snake_case for clarity</li>
        </ul>
        <p>
          When consuming third-party APIs, accept their convention; don&apos;t force your local style. Use mapping
          libraries (Jackson, Gson, attrs) to translate between JSON keys and your in-language field names.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Practical tips</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>Follow the convention of the existing codebase</strong> over personal preference.</li>
          <li><strong>Use auto-formatters</strong> (Prettier, Black, gofmt) — they don&apos;t change names but enforce a clean baseline.</li>
          <li><strong>Use linters</strong> like ESLint and pylint to catch convention violations.</li>
          <li><strong>Don&apos;t rename across the codebase</strong> just because you prefer a different convention. Pick your battles.</li>
        </ul>
      </div>
    ),
};
