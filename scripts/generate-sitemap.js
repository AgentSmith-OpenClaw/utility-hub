const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://toolisk.com';

// Define all routes with their metadata
const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  
  // Financial Calculators
  { path: '/finance/emi-calculator', priority: '0.9', changefreq: 'weekly' },
  { path: '/finance/fire-calculator', priority: '0.9', changefreq: 'weekly' },
  { path: '/finance/sip-calculator', priority: '0.9', changefreq: 'weekly' },
  { path: '/finance/compound-interest-calculator', priority: '0.9', changefreq: 'weekly' },
  { path: '/finance/income-tax-calculator', priority: '0.9', changefreq: 'weekly' },
  { path: '/finance/buy-vs-rent-calculator', priority: '0.9', changefreq: 'weekly' },
  { path: '/finance/learn', priority: '0.85', changefreq: 'weekly' },
  
  // Learn Articles
  { path: '/finance/learn/understanding-compound-interest', priority: '0.8', changefreq: 'monthly' },
  { path: '/finance/learn/understanding-emi-calculations', priority: '0.8', changefreq: 'monthly' },
  { path: '/finance/learn/prepayment-strategies-guide', priority: '0.8', changefreq: 'monthly' },
  { path: '/finance/learn/fire-movement-explained', priority: '0.8', changefreq: 'monthly' },
  { path: '/finance/learn/coast-fire-strategy', priority: '0.8', changefreq: 'monthly' },
  { path: '/finance/learn/step-up-sip-vs-flat-sip', priority: '0.8', changefreq: 'monthly' },
  { path: '/finance/learn/inflation-proof-investing-guide', priority: '0.8', changefreq: 'monthly' },
  
  // Legal Pages
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { path: '/terms-of-service', priority: '0.5', changefreq: 'yearly' },
  { path: '/disclaimer', priority: '0.5', changefreq: 'yearly' },
];

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

function generateSitemap() {
  const lastmod = getCurrentDate();
  
  const urls = routes.map(route => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return sitemap;
}

function main() {
  try {
    const sitemap = generateSitemap();
    
    // Write to public directory (for static hosting)
    const publicPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(publicPath, sitemap, 'utf-8');
    console.log('✅ Sitemap generated successfully at public/sitemap.xml');
    
    // Also write to build directory if it exists (for production builds)
    const buildPath = path.join(__dirname, '..', 'build', 'sitemap.xml');
    if (fs.existsSync(path.join(__dirname, '..', 'build'))) {
      fs.writeFileSync(buildPath, sitemap, 'utf-8');
      console.log('✅ Sitemap also copied to build/sitemap.xml');
    }
    
    console.log(`📊 Generated ${routes.length} URLs`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

main();
