import { test, expect } from '@playwright/test';

test('capture mortgage calculator', async ({ page }) => {
  await page.goto('http://localhost:3000/finance/mortgage-calculator');
  // Wait for content to load
  await page.waitForSelector('h1');
  await page.screenshot({ path: 'screenshots/mortgage-calculator.png', fullPage: true });
});

test('capture amortization calculator', async ({ page }) => {
  await page.goto('http://localhost:3000/finance/amortization-calculator');
  // Wait for content to load
  await page.waitForSelector('h1');
  await page.screenshot({ path: 'screenshots/amortization-calculator.png', fullPage: true });
});
