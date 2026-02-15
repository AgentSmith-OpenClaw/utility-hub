import { test, expect } from '@playwright/test';

test.describe('Compound Interest Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/finance/compound-interest-calculator');
  });

  test('should load the calculator page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Compound Interest Calculator');
    await expect(page.locator('text=Investment Details')).toBeVisible();
  });

  test('should update results when inputs change', async ({ page }) => {
    // Initial balance (default is $10k principal + $500 monthly for 10 years @ 8%)
    // Let's change principal and check if final balance updates
    const initialBalanceText = await page.locator('text=Final Balance').locator('..').locator('span').last().textContent();
    
    // Fill in new principal
    const principalInput = page.locator('input[type="number"]').first();
    await principalInput.clear();
    await principalInput.fill('20000');
    
    await page.waitForTimeout(1000); // Wait for animation/calc
    
    const newBalanceText = await page.locator('text=Final Balance').locator('..').locator('span').last().textContent();
    expect(newBalanceText).not.toBe(initialBalanceText);
  });

  test('should switch chart tabs', async ({ page }) => {
    await expect(page.locator('button:has-text("Growth")')).toBeVisible();
    
    await page.click('button:has-text("Annual")');
    // Check if the annual interest bar chart elements are visible (recharts usually uses svg)
    await expect(page.locator('.recharts-bar')).toBeVisible();
    
    await page.click('button:has-text("Ratio")');
    await expect(page.locator('.recharts-pie')).toBeVisible();
  });

  test('should reset to defaults', async ({ page }) => {
    const principalInput = page.locator('input[type="number"]').first();
    await principalInput.clear();
    await principalInput.fill('50000');
    
    await page.click('text=Reset to Defaults');
    
    await expect(principalInput).toHaveValue('10000');
  });

  test('should navigate to blog post', async ({ page }) => {
    await page.click('text=Understanding Compound Interest');
    await expect(page).toHaveURL(/\/finance\/learn\/understanding-compound-interest/);
    await expect(page.locator('h1')).toContainText('Magic of Compound Interest');
  });
});
