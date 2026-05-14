#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function main() {
  const root = path.resolve(__dirname, '..');
  const publicDir = path.join(root, 'public');
  const buildDir = path.join(root, 'build');

  const keyFilename = 'cc06c642a9c64c8bb4478623bb1484c9.txt';
  const keyPath = path.join(publicDir, keyFilename);
  if (!fs.existsSync(keyPath)) {
    console.error('Key file not found at', keyPath);
    process.exit(1);
  }

  const key = fs.readFileSync(keyPath, 'utf8').trim();
  if (!key) {
    console.error('IndexNow key is empty');
    process.exit(1);
  }

  // Collect sitemap files and URLs
  const urlsSet = new Set();

  const addUrlsFromContent = content => {
    const matches = Array.from(content.matchAll(/<loc>(.*?)<\/loc>/g)).map(m => m[1]);
    for (const u of matches) urlsSet.add(u);
  };

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.error('sitemap.xml not found in public/. Run `npm run build` to generate it.');
    process.exit(1);
  }

  const sitemap = fs.readFileSync(sitemapPath, 'utf8');

  // If sitemap is an index, gather all referenced sitemap files
  const isIndex = /<sitemapindex[\s>]/i.test(sitemap);
  if (isIndex) {
    const sitemapLocs = Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g)).map(m => m[1]);
    for (const loc of sitemapLocs) {
      // try to find local file by basename in public or build directories
      try {
        const urlObj = new URL(loc);
        const basename = path.basename(urlObj.pathname);
        const candidates = [
          path.join(publicDir, basename),
          path.join(buildDir, basename),
        ];
        let found = false;
        for (const cand of candidates) {
          if (fs.existsSync(cand)) {
            const content = fs.readFileSync(cand, 'utf8');
            addUrlsFromContent(content);
            found = true;
            break;
          }
        }
        if (!found) {
          // as a fallback, try to read from build directory any sitemap files matching pattern
          const files = fs.existsSync(buildDir) ? fs.readdirSync(buildDir) : [];
          for (const f of files) {
            if (/^sitemap.*\.xml$/i.test(f)) {
              const p = path.join(buildDir, f);
              const content = fs.readFileSync(p, 'utf8');
              addUrlsFromContent(content);
            }
          }
        }
      } catch (e) {
        // if loc is not a full URL, try basename directly
        const basename = path.basename(loc);
        const candidates = [
          path.join(publicDir, basename),
          path.join(buildDir, basename),
        ];
        for (const cand of candidates) {
          if (fs.existsSync(cand)) {
            const content = fs.readFileSync(cand, 'utf8');
            addUrlsFromContent(content);
          }
        }
      }
    }
  } else {
    addUrlsFromContent(sitemap);
  }

  // Also include any sitemap files present in build/ (e.g., sitemap-0.xml)
  if (fs.existsSync(buildDir)) {
    const buildFiles = fs.readdirSync(buildDir);
    for (const f of buildFiles) {
      if (/^sitemap.*\.xml$/i.test(f)) {
        const p = path.join(buildDir, f);
        try {
          const content = fs.readFileSync(p, 'utf8');
          addUrlsFromContent(content);
        } catch (e) {
          // ignore
        }
      }
    }
  }

  const urls = Array.from(urlsSet);
  if (!urls.length) {
    console.error('No URLs found in sitemap files');
    process.exit(1);
  }

  const host = 'toolisk.com';
  const keyLocation = `https://${host}/${keyFilename}`;

  const payload = {
    host,
    key,
    keyLocation,
    urlList: urls,
  };

  console.log('Submitting', urls.length, 'URLs to IndexNow for', host);

  const endpoint = 'https://api.indexnow.org/indexnow';

  const doFetch = async (...args) => {
    if (typeof globalThis.fetch === 'function') return globalThis.fetch(...args);
    const nf = await import('node-fetch');
    return nf.default(...args);
  };

  let res;
  try {
    res = await doFetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('Request failed:', err.message || err);
    process.exit(1);
  }

  const text = await res.text();
  console.log('IndexNow response status:', res.status);
  console.log(text);
  if (!res.ok) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
