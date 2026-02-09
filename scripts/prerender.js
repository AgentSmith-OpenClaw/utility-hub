#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');
const handler = require('serve-handler');

const PORT = 9000;
const BUILD_DIR = path.join(__dirname, '..', 'build');
const INDEX_PATH = path.join(BUILD_DIR, 'index.html');

async function startServer() {
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: BUILD_DIR,
      cleanUrls: true,
    });
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`✓ Test server running at http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function prerender() {
  console.log('🚀 Starting pre-rendering process...\n');

  const server = await startServer();
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('📄 Loading page...');
    await page.goto(`http://localhost:${PORT}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Wait for React to fully render
    await page.waitForSelector('#root', { state: 'attached' });
    await page.waitForTimeout(2000); // Extra time for charts/state

    console.log('📸 Capturing pre-rendered HTML...');
    const html = await page.content();

    // Minify HTML
    const minified = html
      .replace(/\n\s+/g, '\n') // Remove excess whitespace
      .replace(/<!--(?!>)[\S\s]*?-->/g, ''); // Remove comments

    // Backup original
    const backupPath = INDEX_PATH + '.original';
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(INDEX_PATH, backupPath);
    }

    // Write pre-rendered HTML
    fs.writeFileSync(INDEX_PATH, minified, 'utf-8');

    const originalSize = fs.statSync(backupPath).size;
    const newSize = fs.statSync(INDEX_PATH).size;

    console.log(`\n✅ Pre-rendering complete!`);
    console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`   Pre-rendered: ${(newSize / 1024).toFixed(2)} KB`);
    console.log(`   Change: ${newSize > originalSize ? '+' : ''}${((newSize - originalSize) / 1024).toFixed(2)} KB\n`);
  } catch (error) {
    console.error('❌ Pre-rendering failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
    server.close();
  }
}

prerender();
