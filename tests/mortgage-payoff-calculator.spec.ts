import { test, expect } from '@playwright/test';

test.describe('Mortgage Payoff vs Investment Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/finance/mortgage-payoff-calculator');
    await page.waitForLoadState('networkidle');
  });

  test('should load the calculator page', async ({ page }) => {
    await expect(page).toHaveTitle(/Mortgage Payoff vs Investment Calculator/);
    await expect(page.locator('h1')).toContainText('Mortgage Payoff vs. Investment');
    await expect(page.locator('h2:has-text("Current Loan Details")')).toBeVisible();
    await expect(page.locator('h2:has-text("Extra Capital")')).toBeVisible();
    await expect(page.locator('h2:has-text("Investment Parameters")')).toBeVisible();
  });

  test('should display default results', async ({ page }) => {
    await expect(page.locator('text=The Winner')).toBeVisible();
    await expect(page.getByText('Breakeven ROI', { exact: true })).toBeVisible();
    await expect(page.getByText('Interest Saved', { exact: true })).toBeVisible();
    await expect(page.getByText('Months Saved', { exact: true })).toBeVisible();
    await expect(page.locator('h3:has-text("Scenario A: Prepay")')).toBeVisible();
    await expect(page.locator('h3:has-text("Scenario B: Invest")')).toBeVisible();
  });

  test('should update results when inputs change', async ({ page }) => {
    const balanceInput = page.locator('input[type="number"]').first();
    await balanceInput.fill('500000');
    await page.waitForTimeout(500);
    await expect(page.locator('p.text-xs.text-slate-500').first()).toContainText('$500,000');
  });

  test('should change inputs using sliders', async ({ page }) => {
    const rateInput = page.locator('input[type="number"]').nth(1);
    const rateSlider = page.locator('input[type="range"]').first();
    await rateSlider.fill('8');
    await page.waitForTimeout(300);
    const newValue = await rateInput.inputValue();
    expect(newValue).toBe('8');
  });

  test('should reset calculator to defaults', async ({ page }) => {
    const balanceInput = page.locator('input[type="number"]').first();
    await balanceInput.fill('750000');
    await page.waitForTimeout(500);
    await page.locator('button:has-text("Reset")').click();
    await page.waitForTimeout(300);
    expect(await balanceInput.inputValue()).toBe('300000');
  });

  test('should display charts', async ({ page }) => {
    await expect(page.locator('button:has-text("Net Worth Comparison")')).toBeVisible();
    await expect(page.locator('button:has-text("Interest vs Profit")')).toBeVisible();
    await page.locator('button:has-text("Interest vs Profit")').click();
    await page.waitForTimeout(300);
  });

  test('should show advanced settings', async ({ page }) => {
    await page.locator('button:has-text("Show Advanced")').click();
    await page.waitForTimeout(300);
    await expect(page.locator('text=Mortgage Interest Tax Deduction')).toBeVisible();
  });

  test('should show insight cards', async ({ page }) => {
    await page.locator('text=The Math vs. The Feeling').scrollIntoViewIfNeeded();
    await expect(page.locator('text=The Math vs. The Feeling')).toBeVisible();
    await expect(page.locator('text=Consider Opportunity Cost')).toBeVisible();
    await expect(page.locator('text=Risk Matters')).toBeVisible();
  });

  test('should have FAQ section with expandable items', async ({ page }) => {
    await page.locator('text=Frequently Asked Questions').scrollIntoViewIfNeeded();
    await expect(page.locator('h2:has-text("Frequently Asked Questions")')).toBeVisible();
    const firstFAQ = page.locator('button:has-text("How accurate is this calculator?")');
    await expect(firstFAQ).toBeVisible();
    await firstFAQ.click();
    await expect(page.locator('text=This calculator provides estimates')).toBeVisible();
    await firstFAQ.click();
    await page.waitForTimeout(300);
  });

  test('should display different winners based on inputs', async ({ page }) => {
    // Default: investing should win (10% return vs 6.5% rate)
    await expect(page.locator('text=Invest in the Market')).toBeVisible();

    // Set market return very low — prepay should win
    const returnInput = page.locator('input[type="number"]').nth(4);
    await returnInput.fill('2');
    await page.waitForTimeout(500);
    await expect(page.locator('text=Prepay Your Mortgage')).toBeVisible();
  });

  test('should persist values in localStorage', async ({ page }) => {
    const balanceInput = page.locator('input[type="number"]').first();
    await balanceInput.fill('450000');
    await page.waitForTimeout(500);
    await page.reload();
    await page.waitForLoadState('networkidle');
    const persistedValue = await page.locator('input[type="number"]').first().inputValue();
    expect(persistedValue).toBe('450000');
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /mortgage/i);
    const metaKeywords = page.locator('meta[name="keywords"]');
    await expect(metaKeywords).toHaveAttribute('content', /mortgage payoff calculator/i);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /mortgage-payoff-calculator/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2:has-text("Current Loan Details")')).toBeVisible();
    await expect(page.locator('text=The Winner')).toBeVisible();
  });

  test('should have tooltips on inputs', async ({ page }) => {
    const tooltips = page.locator('text=ℹ️');
    const count = await tooltips.count();
    expect(count).toBeGreaterThanOrEqual(4);
    const firstTooltip = tooltips.first();
    await expect(firstTooltip).toHaveAttribute('title', /.+/);
  });

  test('should show SEO content section', async ({ page }) => {
    await page.locator('text=Understanding the Mortgage Payoff vs. Investment Decision').scrollIntoViewIfNeeded();
    await expect(page.locator('h2:has-text("Understanding the Mortgage Payoff vs. Investment Decision")')).toBeVisible();
    await expect(page.locator('h3:has-text("How the Two Paths Work")')).toBeVisible();
    await expect(page.locator('h3:has-text("Making the Right Choice for You")')).toBeVisible();
    const paragraphs = page.locator('p');
    const paragraphCount = await paragraphs.count();
    expect(paragraphCount).toBeGreaterThan(10);
  });

  test('should have export buttons', async ({ page }) => {
    await expect(page.locator('button:has-text("Export PDF")')).toBeVisible();
    await expect(page.locator('button:has-text("Export Excel")')).toBeVisible();
    await expect(page.locator('button:has-text("Copy URL")')).toBeVisible();
    await expect(page.locator('button:has-text("WhatsApp")')).toBeVisible();
    await expect(page.locator('button:has-text("Twitter")')).toBeVisible();
  });
});
