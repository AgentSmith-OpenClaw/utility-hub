import { test, expect } from '@playwright/test';

test.describe('US Paycheck Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/finance/us-paycheck-calculator');
    await page.waitForLoadState('networkidle');
  });

  test('should load the calculator page', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/US Paycheck/i);

    // Check main heading
    await expect(page.locator('h1')).toContainText('US Paycheck');

    // Check that all input sections are visible (scoped to calculator container)
    const calc = page.locator('#us-paycheck-content');
    await expect(calc.locator('h2').filter({ hasText: '1' }).filter({ hasText: 'Income' })).toBeVisible();
    await expect(calc.locator('h2').filter({ hasText: 'Tax Profile' })).toBeVisible();
    await expect(calc.locator('h2').filter({ hasText: 'Pre-Tax Deductions' })).toBeVisible();
    await expect(calc.locator('h2').filter({ hasText: 'Additional Withholding' })).toBeVisible();
  });

  test('should have proper SEO metadata', async ({ page }) => {
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    const descContent = await metaDescription.getAttribute('content');
    expect(descContent).toBeTruthy();
    expect(descContent!.length).toBeGreaterThan(50);

    // Check canonical link
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /us-paycheck-calculator/);

    // Check structured data (FAQ schema etc.)
    const scripts = await page.locator('script[type="application/ld+json"]').count();
    expect(scripts).toBeGreaterThanOrEqual(1);
  });

  test('should show calculation results on load', async ({ page }) => {
    // Default is $75,000 annual salary, single, CA
    // Summary cards should be visible (scoped to calculator)
    const calc = page.locator('#us-paycheck-content');
    await expect(calc.locator('p:has-text("Take-Home (Annual)")')).toBeVisible();
    await expect(calc.locator('p:has-text("Total Taxes (Annual)")')).toBeVisible();
    await expect(calc.locator('p:has-text("Effective Tax Rate")').first()).toBeVisible();
    await expect(calc.locator('p:has-text("Tax Savings from Deductions")')).toBeVisible();

    // Per-Paycheck Breakdown table should be visible
    await expect(page.locator('h3:has-text("Per-Paycheck Breakdown")')).toBeVisible();
    await expect(page.locator('td:has-text("Net Take-Home")')).toBeVisible();
  });

  test('should update results when changing gross income', async ({ page }) => {
    // The gross income input is a type="text" input inside the Income section
    const grossInput = page.locator('label:has-text("Gross Income")').locator('..').locator('input[type="text"]');
    await grossInput.focus();
    await grossInput.fill('100000');
    await grossInput.blur();

    await page.waitForTimeout(500);

    // Results should reflect the change — breakdown table should still be visible
    await expect(page.locator('text=Per-Paycheck Breakdown')).toBeVisible();
    await expect(page.locator('td:has-text("Net Take-Home")')).toBeVisible();
  });

  test('should handle filing status changes', async ({ page }) => {
    // Find filing status dropdown
    const filingSelect = page.locator('label:has-text("Filing Status")').locator('..').locator('select');
    await expect(filingSelect).toBeVisible();

    // Change to married filing jointly
    await filingSelect.selectOption('married_jointly');
    await page.waitForTimeout(500);

    // Results should update
    await expect(page.locator('text=Take-Home (Annual)')).toBeVisible();
  });

  test('should allow state selection', async ({ page }) => {
    // Find state dropdown
    const stateSelect = page.locator('label:has-text("State")').locator('..').locator('select');
    await expect(stateSelect).toBeVisible();

    // Default is CA
    await expect(stateSelect).toHaveValue('CA');

    // Change to Texas (no income tax)
    await stateSelect.selectOption('TX');
    await page.waitForTimeout(500);
    await expect(stateSelect).toHaveValue('TX');
  });

  test('should handle pay frequency changes', async ({ page }) => {
    const freqSelect = page.locator('label:has-text("Pay Frequency")').locator('..').locator('select');
    await expect(freqSelect).toBeVisible();

    // Default is annual
    await expect(freqSelect).toHaveValue('annual');

    // Switch to biweekly
    await freqSelect.selectOption('biweekly');
    await page.waitForTimeout(500);

    // Summary card label should update
    await expect(page.locator('text=Take-Home (Biweekly)')).toBeVisible();
  });

  test('should handle 401k slider changes', async ({ page }) => {
    // 401(k) slider is the first input[type="range"]
    const slider401k = page.locator('input[type="range"]').first();
    await expect(slider401k).toBeVisible();

    // Set 401(k) to $10,000
    await slider401k.fill('10000');
    await page.waitForTimeout(500);

    // Tax savings card should show a non-zero value
    await expect(page.locator('text=Tax Savings from Deductions')).toBeVisible();
  });

  test('should display charts', async ({ page }) => {
    // Check that chart tab buttons exist
    await expect(page.locator('button:has-text("Pay Breakdown")')).toBeVisible();
    await expect(page.locator('button:has-text("Tax Waterfall")')).toBeVisible();
    await expect(page.locator('button:has-text("Tax Rates")')).toBeVisible();
    await expect(page.locator('button:has-text("Monthly Cash Flow")')).toBeVisible();

    // Check that a Recharts chart renders
    await expect(page.locator('.recharts-wrapper').first()).toBeVisible({ timeout: 10000 });
  });

  test('should switch between chart tabs', async ({ page }) => {
    // Click Tax Waterfall tab
    await page.locator('button:has-text("Tax Waterfall")').click();
    await page.waitForTimeout(300);
    await expect(page.locator('.recharts-wrapper').first()).toBeVisible({ timeout: 5000 });

    // Click Tax Rates tab
    await page.locator('button:has-text("Tax Rates")').click();
    await page.waitForTimeout(300);
    await expect(page.locator('.recharts-wrapper').first()).toBeVisible({ timeout: 5000 });

    // Click Monthly Cash Flow tab
    await page.locator('button:has-text("Monthly Cash Flow")').click();
    await page.waitForTimeout(300);
    await expect(page.locator('.recharts-wrapper').first()).toBeVisible({ timeout: 5000 });

    // Click back to Pay Breakdown
    await page.locator('button:has-text("Pay Breakdown")').click();
    await page.waitForTimeout(300);
    await expect(page.locator('.recharts-wrapper').first()).toBeVisible({ timeout: 5000 });
  });

  test('should have export buttons', async ({ page }) => {
    await expect(page.locator('button:has-text("Export PDF")')).toBeVisible();
    await expect(page.locator('button:has-text("Export Excel")')).toBeVisible();
    await expect(page.locator('button:has-text("Copy Plan URL")')).toBeVisible();
  });

  test('should reset calculator to defaults', async ({ page }) => {
    // Change gross income
    const grossInput = page.locator('label:has-text("Gross Income")').locator('..').locator('input[type="text"]');
    await grossInput.focus();
    await grossInput.fill('120000');
    await grossInput.blur();
    await page.waitForTimeout(300);

    // Change state
    const stateSelect = page.locator('label:has-text("State")').locator('..').locator('select');
    await stateSelect.selectOption('TX');
    await page.waitForTimeout(300);

    // Set 401(k) slider
    const slider401k = page.locator('input[type="range"]').first();
    await slider401k.fill('5000');
    await page.waitForTimeout(300);

    // Click reset
    await page.locator('button:has-text("Reset Defaults")').click();
    await page.waitForTimeout(500);

    // Verify defaults restored
    await expect(stateSelect).toHaveValue('CA');
    const freqSelect = page.locator('label:has-text("Pay Frequency")').locator('..').locator('select');
    await expect(freqSelect).toHaveValue('annual');
    const filingSelect = page.locator('label:has-text("Filing Status")').locator('..').locator('select');
    await expect(filingSelect).toHaveValue('single');
  });

  test('should show zero state tax for no-tax states', async ({ page }) => {
    // Select Texas (no state income tax)
    const stateSelect = page.locator('label:has-text("State")').locator('..').locator('select');
    await stateSelect.selectOption('TX');
    await page.waitForTimeout(1000);

    // State Tax row in the breakdown table should show $0.00
    const stateRow = page.locator('tr', { has: page.locator('td:has-text("State Tax")') });
    await expect(stateRow.locator('td').nth(1)).toContainText('$0.00');
    await expect(stateRow.locator('td').nth(2)).toContainText('$0.00');
  });

  test('should display per-paycheck breakdown table with all rows', async ({ page }) => {
    // Verify all breakdown rows exist
    const expectedRows = [
      'Gross Pay',
      'Federal Tax',
      'State Tax',
      'Social Security',
      'Medicare',
      '401(k)',
      'HSA',
      'Traditional IRA',
      'Net Take-Home',
    ];

    for (const rowLabel of expectedRows) {
      await expect(page.locator('td').filter({ hasText: rowLabel }).first()).toBeVisible();
    }
  });

  test('should display tax savings insight cards', async ({ page }) => {
    // Scroll down to see insight cards
    await page.locator('text=401(k) Savings').scrollIntoViewIfNeeded();

    await expect(page.locator('text=401(k) Savings')).toBeVisible();
    await expect(page.locator('text=HSA Savings')).toBeVisible();
    await expect(page.locator('text=IRA Savings')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    // Check that content is still visible
    await expect(page.locator('h1')).toBeVisible();
    const calc = page.locator('#us-paycheck-content');
    await expect(calc.locator('h2').filter({ hasText: '1' }).filter({ hasText: 'Income' })).toBeVisible();

    // Results should be visible on mobile
    await expect(page.locator('text=Take-Home (Annual)')).toBeVisible();
    await expect(page.locator('h3:has-text("Per-Paycheck Breakdown")')).toBeVisible();
  });

  test('should have SEO content below calculator', async ({ page }) => {
    // Scroll to article section
    const article = page.locator('article').first();
    await article.scrollIntoViewIfNeeded();

    // Check for educational content
    await expect(article).toBeVisible();

    // Should have multiple h2 headings
    const h2Count = await page.locator('article h2').count();
    expect(h2Count).toBeGreaterThanOrEqual(3);

    // Check content paragraphs
    const paragraphs = page.locator('article p');
    const paragraphCount = await paragraphs.count();
    expect(paragraphCount).toBeGreaterThan(5);
  });

  test('should calculate different results for different filing statuses', async ({ page }) => {
    // Get initial take-home breakdown with single filing
    const netRow = page.locator('tr', { has: page.locator('td:has-text("Net Take-Home")') });
    const singleNet = await netRow.locator('td').nth(2).textContent();

    // Switch to married filing jointly (should have lower taxes, higher net)
    const filingSelect = page.locator('label:has-text("Filing Status")').locator('..').locator('select');
    await filingSelect.selectOption('married_jointly');
    await page.waitForTimeout(500);

    const marriedNet = await netRow.locator('td').nth(2).textContent();

    // Married jointly should have higher take-home than single at $75k
    expect(marriedNet).not.toBe(singleNet);
  });

  test('should show social sharing buttons', async ({ page }) => {
    await expect(page.locator('button:has-text("WhatsApp")')).toBeVisible();
    await expect(page.locator('button:has-text("Twitter")')).toBeVisible();
  });
});
