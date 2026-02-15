import { test } from '@playwright/test';

test('take screenshots for visual comparison', async ({ page }) => {
  // Set viewport to a standard desktop size
  await page.setViewportSize({ width: 1280, height: 800 });

  // Screenshot Compound Interest Calculator
  await page.goto('/finance/compound-interest-calculator');
  await page.waitForTimeout(1000); // Wait for animations
  await page.screenshot({ path: 'screenshots/compound-interest.png', fullPage: true });

  // Screenshot EMI Calculator for comparison
  await page.goto('/finance/emi-calculator');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/emi-calculator.png', fullPage: true });

  // Screenshot SIP Wealth Planner for comparison
  await page.goto('/finance/sip-calculator');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/sip-calculator.png', fullPage: true });
});
