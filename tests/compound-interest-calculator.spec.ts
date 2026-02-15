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
    // Initial balance
    const initialBalanceText = await page.locator('text=Final Balance').locator('..').locator('span').last().textContent();
    
    // Fill in new principal
    const principalInput = page.locator('label:has-text("Initial Principal")').locator('..').locator('input[type="text"]');
    await principalInput.clear();
    await principalInput.fill('20000');
    await principalInput.press('Enter');
    
    await page.waitForTimeout(1000); // Wait for animation/calc
    
    const newBalanceText = await page.locator('text=Final Balance').locator('..').locator('span').last().textContent();
    expect(newBalanceText).not.toBe(initialBalanceText);
  });

  test('should switch chart tabs', async ({ page }) => {
    await expect(page.locator('button:has-text("Growth")')).toBeVisible();
    
    await page.click('button:has-text("Annual")');
    // Check if the annual interest bar chart elements are visible
    await expect(page.locator('.recharts-bar').first()).toBeVisible();
    
    await page.click('button:has-text("Ratio")');
    await expect(page.locator('.recharts-pie')).toBeVisible();
  });

  test('should reset to defaults', async ({ page }) => {
    const principalInput = page.locator('label:has-text("Initial Principal")').locator('..').locator('input[type="text"]');
    await principalInput.clear();
    await principalInput.fill('500000');
    
    await page.click('text=Reset Defaults');
    
    await expect(principalInput).toHaveValue('1,00,000');
  });

  test('should navigate to blog post', async ({ page }) => {
    await page.click('text=Understanding Compound Interest');
    await expect(page).toHaveURL(/\/finance\/learn\/understanding-compound-interest/);
    await expect(page.locator('h1')).toContainText('Magic of Compound Interest');
  });
});
