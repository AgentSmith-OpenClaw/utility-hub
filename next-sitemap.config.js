/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://toolisk.com',
  outDir: './build',
  generateRobotsTxt: false, // robots.txt is maintained manually in public/

  // Per-URL priority + changefreq tiers:
  //   Tier 1 (1.0 / 0.9) — homepage & calculator pages
  //   Tier 2 (0.7 / 0.6) — /finance/learn index & articles
  //   Tier 3 (0.3)        — about, contact, legal
  //
  // /finance/learn/[slug] pages are pre-rendered at build time via getStaticPaths
  // and auto-discovered from the static export output — no additionalPaths needed.
  transform: async (_config, loc) => {
    const lastmod = new Date().toISOString();
    if (loc === '/') return { loc, priority: 1.0, changefreq: 'daily', lastmod };
    if (loc.startsWith('/finance/') && !loc.includes('/learn'))
      return { loc, priority: 0.9, changefreq: 'weekly', lastmod };
    if (loc === '/finance/learn')
      return { loc, priority: 0.7, changefreq: 'weekly', lastmod };
    if (loc.startsWith('/finance/learn/'))
      return { loc, priority: 0.6, changefreq: 'monthly', lastmod };
    // Tier 3: about, contact, privacy-policy, terms-of-service, disclaimer
    return { loc, priority: 0.3, changefreq: 'yearly', lastmod };
  },
};
