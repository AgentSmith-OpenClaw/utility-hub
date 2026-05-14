const { execSync } = require('child_process');
const path = require('path');

// Maps a sitemap loc (e.g. '/finance/sip-calculator') to the source file most
// likely to determine its freshness. Falls back to the page file, then the hub.
function locToSourceFile(loc) {
  const base = path.resolve(__dirname);
  const slug = loc.replace(/\/$/, '') || '/';

  // Homepage
  if (slug === '/') return 'src/pages/index.tsx';

  // Learn articles: slug is the article filename
  const learnMatch = slug.match(/^\/(finance|tools)\/learn\/(.+)$/);
  if (learnMatch) {
    const [, section, article] = learnMatch;
    return `src/content/blog/${section}/${article}.tsx`;
  }

  // Learn hubs
  if (slug === '/finance/learn') return 'src/pages/finance/learn/index.tsx';
  if (slug === '/tools/learn') return 'src/pages/tools/learn/index.tsx';

  // Section hubs
  if (slug === '/finance') return 'src/pages/finance/index.tsx';
  if (slug === '/tools') return 'src/pages/tools/index.tsx';

  // Tool/calculator pages
  const pageMatch = slug.match(/^\/(finance|tools)\/(.+)$/);
  if (pageMatch) {
    const [, section, page] = pageMatch;
    return `src/pages/${section}/${page}.tsx`;
  }

  // Top-level pages (about, contact, etc.)
  return `src/pages${slug}.tsx`;
}

function gitLastMod(loc) {
  const file = locToSourceFile(loc);
  try {
    const iso = execSync(`git log -1 --format=%cI -- "${file}"`, {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'ignore'],
    }).toString().trim();
    // git returns empty string if file has no commits (new/untracked)
    return iso || new Date().toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://toolisk.com',
  outDir: './build',
  generateRobotsTxt: false, // robots.txt is maintained manually in public/

  // Per-URL priority + changefreq tiers:
  //   Tier 1 (1.0 / 0.9) — homepage, calculator pages, tool pages
  //   Tier 2 (0.7 / 0.6) — /finance/learn and /tools/learn indexes & articles
  //   Tier 3 (0.3)        — about, contact, legal
  transform: async (_config, loc) => {
    const lastmod = gitLastMod(loc);
    if (loc === '/') return { loc, priority: 1.0, changefreq: 'daily', lastmod };
    if (loc === '/finance') return { loc, priority: 0.9, changefreq: 'weekly', lastmod };
    if (loc === '/tools') return { loc, priority: 0.9, changefreq: 'weekly', lastmod };
    if (loc.startsWith('/finance/') && !loc.includes('/learn'))
      return { loc, priority: 0.9, changefreq: 'weekly', lastmod };
    if (loc.startsWith('/tools/') && !loc.includes('/learn'))
      return { loc, priority: 0.9, changefreq: 'weekly', lastmod };
    if (loc === '/finance/learn' || loc === '/tools/learn')
      return { loc, priority: 0.7, changefreq: 'weekly', lastmod };
    if (loc.startsWith('/finance/learn/') || loc.startsWith('/tools/learn/'))
      return { loc, priority: 0.6, changefreq: 'monthly', lastmod };
    // Tier 3: about, contact, privacy-policy, terms-of-service, disclaimer
    return { loc, priority: 0.3, changefreq: 'yearly', lastmod };
  },
};
