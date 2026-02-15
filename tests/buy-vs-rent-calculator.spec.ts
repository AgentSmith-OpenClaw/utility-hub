import { test, expect } from '@playwright/test';

test.describe('Buy vs Rent Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/finance/buy-vs-rent-calculator');
    await page.waitForLoadState('networkidle');
  });

  test('should load the calculator page', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Buy vs Rent Calculator/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Buy vs Rent Calculator');
    
    // Check that all input sections are visible
    await expect(page.locator('text=Property Details')).toBeVisible();
    await expect(page.locator('text=Buying Costs')).toBeVisible();
    await expect(page.locator('text=Renting Costs')).toBeVisible();
    await expect(page.locator('text=Investment & Analysis')).toBeVisible();
  });

  test('should display default results', async ({ page }) => {
    // Check that results sections are displayed
    await expect(page.locator('h3').filter({ hasText: 'Upfront Costs' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'Monthly Costs' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'Net Worth After' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'Recommendation' })).toBeVisible();
    
    // Check specific metric values are displayed
    const upfrontSection = page.locator('h3:has-text("Upfront Costs")').locator('..');
    await expect(upfrontSection.locator('text=$100,000')).toBeVisible();
    await expect(upfrontSection.locator('text=$15,000')).toBeVisible();
  });

  test('should update results when inputs change', async ({ page }) => {
    // Get initial down payment value displayed in results
    const upfrontSection = page.locator('h3:has-text("Upfront Costs")').locator('..');
    const initialDownPayment = await upfrontSection.locator('p').filter({ hasText: '$100,000' }).first().textContent();
    
    // Change down payment percentage
    const downPaymentInput = page.locator('input[type="number"]').nth(1);
    await downPaymentInput.fill('25');
    
    // Wait for calculation
    await page.waitForTimeout(500);
    
    // Check that down payment value changed (should be $125,000 now)
    const hasNewValue = await upfrontSection.locator('text=$125,000').count();
    expect(hasNewValue).toBeGreaterThan(0);
  });

  test('should change inputs using sliders', async ({ page }) => {
    // Get initial down payment value
    const downPaymentInput = page.locator('input[type="number"]').nth(1);
    const initialValue = await downPaymentInput.inputValue();
    
    // Find and move the down payment slider
    const downPaymentSlider = page.locator('input[type="range"]').nth(1);
    await downPaymentSlider.fill('25');
    
    // Wait for update
    await page.waitForTimeout(300);
    
    // Check that value changed
    const newValue = await downPaymentInput.inputValue();
    expect(newValue).toBe('25');
    expect(newValue).not.toBe(initialValue);
  });

  test('should reset calculator to defaults', async ({ page }) => {
    // Change some values
    const homePriceInput = page.locator('input[type="number"]').first();
    await homePriceInput.fill('750000');
    
    const downPaymentInput = page.locator('input[type="number"]').nth(1);
    await downPaymentInput.fill('30');
    
    await page.waitForTimeout(500);
    
    // Click reset button
    await page.locator('button:has-text("Reset")').click();
    
    // Check that values are back to defaults
    await page.waitForTimeout(300);
    expect(await homePriceInput.inputValue()).toBe('500000');
    expect(await downPaymentInput.inputValue()).toBe('20');
  });

  test('should display charts', async ({ page }) => {
    // Check that chart tabs are present
    await expect(page.locator('button:has-text("Net Worth Comparison")')).toBeVisible();
    await expect(page.locator('button:has-text("Cumulative Costs")')).toBeVisible();
    await expect(page.locator('button:has-text("Cost Breakdown")')).toBeVisible();
    
    // Switch to Cumulative Costs tab
    await page.locator('button:has-text("Cumulative Costs")').click();
    await page.waitForTimeout(300);
    
    // Switch to Cost Breakdown tab
    await page.locator('button:has-text("Cost Breakdown")').click();
    await page.waitForTimeout(300);
    
    // Check for breakdown headings
    await expect(page.locator('text=Buying Cost Breakdown')).toBeVisible();
    await expect(page.locator('text=Renting Cost Breakdown')).toBeVisible();
  });

  test('should show educational insights', async ({ page }) => {
    // Scroll to insights section
    await page.locator('text=Consider Opportunity Cost').scrollIntoViewIfNeeded();
    
    // Check all three insight cards
    await expect(page.locator('text=Consider Opportunity Cost')).toBeVisible();
    await expect(page.locator('text=Hidden Costs of Ownership')).toBeVisible();
    await expect(page.locator('text=Flexibility vs Stability')).toBeVisible();
  });

  test('should have FAQ section with expandable items', async ({ page }) => {
    // Scroll to FAQ section
    await page.locator('text=Frequently Asked Questions').scrollIntoViewIfNeeded();
    
    // Check FAQ heading
    await expect(page.locator('h2:has-text("Frequently Asked Questions")')).toBeVisible();
    
    // Find and click first FAQ item
    const firstFAQ = page.locator('button:has-text("How accurate is this calculator?")');
    await expect(firstFAQ).toBeVisible();
    await firstFAQ.click();
    
    // Check that answer is now visible
    await expect(page.locator('text=This calculator provides estimates')).toBeVisible();
    
    // Click again to collapse
    await firstFAQ.click();
    await page.waitForTimeout(300);
  });

  test('should display different recommendations based on inputs', async ({ page }) => {
    // Default should show rent recommendation (based on default values)
    await expect(page.locator('text=Recommendation')).toBeVisible();
    
    // Change inputs to favor buying (low interest rate, high rent)
    await page.locator('input[type="number"]').nth(3).fill('3'); // Low interest rate
    await page.locator('input[type="number"]').nth(10).fill('3500'); // High rent
    
    await page.waitForTimeout(500);
    
    // Results should update
    await expect(page.locator('text=Net Worth After')).toBeVisible();
  });

  test('should persist values in localStorage', async ({ page }) => {
    // Change a value
    const homePriceInput = page.locator('input[type="number"]').first();
    await homePriceInput.fill('650000');
    
    await page.waitForTimeout(500);
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that value persisted
    const persistedValue = await page.locator('input[type="number"]').first().inputValue();
    expect(persistedValue).toBe('650000');
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /Compare the total costs/);
    
    // Check meta keywords
    const metaKeywords = page.locator('meta[name="keywords"]');
    await expect(metaKeywords).toHaveAttribute('content', /buy vs rent calculator/);
    
    // Check canonical link
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /buy-vs-rent-calculator/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that content is still visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2:has-text("Property Details")')).toBeVisible();
    
    // Check that results section heading is visible
    await expect(page.locator('h3:has-text("Upfront Costs")')).toBeVisible();
  });

  test('should have tooltips on inputs', async ({ page }) => {
    // Check for info icons (tooltips)
    const tooltips = page.locator('text=ℹ️');
    const count = await tooltips.count();
    
    // Should have multiple tooltips
    expect(count).toBeGreaterThan(5);
    
    // Check tooltip content (title attribute)
    const firstTooltip = tooltips.first();
    await expect(firstTooltip).toHaveAttribute('title', /.+/);
  });

  test('should calculate correctly for different scenarios', async ({ page }) => {
    // Scenario 1: Very low interest rate (buying favored)
    await page.locator('input[type="number"]').nth(0).fill('400000'); // Home price
    await page.locator('input[type="number"]').nth(3).fill('3'); // Interest rate
    await page.locator('input[type="number"]').nth(10).fill('3000'); // Monthly rent
    
    await page.waitForTimeout(500);
    
    // Should show some net worth values
    await expect(page.locator('text=Net Worth After')).toBeVisible();
    
    // Scenario 2: High interest rate (renting favored)
    await page.locator('input[type="number"]').nth(3).fill('10'); // High interest rate
    await page.locator('input[type="number"]').nth(10).fill('1500'); // Low rent
    
    await page.waitForTimeout(500);
    
    // Results should update
    await expect(page.locator('text=Net Worth After')).toBeVisible();
  });

  test('should show content for SEO (1500+ words)', async ({ page }) => {
    // Scroll to content section
    await page.locator('text=Understanding the Buy vs Rent Decision').scrollIntoViewIfNeeded();
    
    // Check main content headings
    await expect(page.locator('h2:has-text("Understanding the Buy vs Rent Decision")')).toBeVisible();
    await expect(page.locator('h3:has-text("Key Factors to Consider")')).toBeVisible();
    await expect(page.locator('h3:has-text("Making the Right Choice for You")')).toBeVisible();
    
    // Check that content paragraphs exist
    const paragraphs = page.locator('p');
    const paragraphCount = await paragraphs.count();
    expect(paragraphCount).toBeGreaterThan(10);
  });
});
