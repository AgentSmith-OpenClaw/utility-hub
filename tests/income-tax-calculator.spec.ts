import { test, expect } from '@playwright/test';

test.describe('Income Tax Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/finance/income-tax-calculator');
  });

  test('should load the tax calculator page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Income Tax');
    await expect(page.locator('h2:has-text("Income")')).toBeVisible();
    await expect(page.locator('h2:has-text("Deductions")')).toBeVisible();
  });

  test('should calculate tax correctly for default values (15L income)', async ({ page }) => {
    // Default is 15L salaried.
    // New regime should be better or at least visible
    await expect(page.locator('text=Total Tax Payable').first()).toBeVisible();
    
    const taxValueText = await page.locator('text=Total Tax Payable').first().locator('..').locator('span').first().textContent();
    expect(taxValueText).toContain('₹');
  });

  test('should toggle between Salaried and Business', async ({ page }) => {
    const businessLabel = page.locator('span:has-text("Business")').first();
    const salariedLabel = page.locator('span:has-text("Salaried")').first();
    
    // Default is salaried (indigo color)
    await expect(salariedLabel).toHaveClass(/text-indigo-600/);
    
    // Toggle
    await page.click('button:has(div.transition-all)'); // The toggle button
    
    await expect(businessLabel).toHaveClass(/text-indigo-600/);
  });

  test('should switch chart tabs', async ({ page }) => {
    await page.click('button:has-text("Tax Breakdown")');
    await expect(page.locator('.recharts-pie')).toBeVisible();
    
    await page.click('button:has-text("Old vs New")');
    await expect(page.locator('.recharts-bar').first()).toBeVisible();
  });
});
