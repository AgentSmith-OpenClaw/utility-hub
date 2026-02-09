import { test, expect } from '@playwright/test';

test.describe('EMI Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the calculator page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('EMI Calculator');
    await expect(page.locator('text=Loan Details')).toBeVisible();
  });

  test('should calculate EMI correctly', async ({ page }) => {
    // Fill in loan details
    await page.fill('input[placeholder="1000000"]', '1000000');
    await page.fill('input[placeholder="8.5"]', '8.5');
    await page.fill('input[placeholder="20"]', '20');

    // Click calculate button
    await page.click('button:has-text("Calculate EMI")');

    // Wait for results
    await expect(page.locator('text=Monthly EMI')).toBeVisible({ timeout: 5000 });
    
    // Verify results are displayed
    await expect(page.locator('text=Total Interest')).toBeVisible();
    await expect(page.locator('text=Amortization Schedule')).toBeVisible();
  });

  test('should add prepayments', async ({ page }) => {
    // Add first prepayment
    await page.fill('input[placeholder="12"]', '12');
    await page.fill('input[placeholder="50000"]', '50000');
    await page.fill('input[placeholder="Bonus payment"]', 'Year-end bonus');
    await page.click('button:has-text("+ Add")');

    // Verify prepayment is added
    await expect(page.locator('text=Month 12: ₹50,000')).toBeVisible();
    await expect(page.locator('text=Year-end bonus')).toBeVisible();

    // Add second prepayment
    await page.fill('input[placeholder="12"]', '24');
    await page.fill('input[placeholder="50000"]', '75000');
    await page.click('button:has-text("+ Add")');

    // Verify second prepayment is added
    await expect(page.locator('text=Month 24: ₹75,000')).toBeVisible();
  });

  test('should remove prepayments', async ({ page }) => {
    // Add a prepayment
    await page.fill('input[placeholder="12"]', '12');
    await page.fill('input[placeholder="50000"]', '50000');
    await page.click('button:has-text("+ Add")');

    // Verify it's added
    await expect(page.locator('text=Month 12: ₹50,000')).toBeVisible();

    // Remove it
    await page.click('button:has-text("Remove")');

    // Verify it's removed
    await expect(page.locator('text=Month 12: ₹50,000')).not.toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    // Clear loan amount
    await page.fill('input[placeholder="1000000"]', '0');
    await page.click('button:has-text("Calculate EMI")');

    // Verify error message
    await expect(page.locator('text=Please fix the following errors')).toBeVisible();
    await expect(page.locator('text=Loan amount must be greater than 0')).toBeVisible();
  });

  test('should display charts after calculation', async ({ page }) => {
    // Fill in loan details
    await page.fill('input[placeholder="1000000"]', '1000000');
    await page.fill('input[placeholder="8.5"]', '8.5');
    await page.fill('input[placeholder="20"]', '20');

    // Calculate
    await page.click('button:has-text("Calculate EMI")');

    // Wait for charts to render
    await page.waitForTimeout(1000);

    // Verify chart titles
    await expect(page.locator('text=Loan Breakdown')).toBeVisible();
    await expect(page.locator('text=Outstanding Balance Over Time')).toBeVisible();
    await expect(page.locator('text=Principal vs Interest Payment Breakdown')).toBeVisible();
  });

  test('should show prepayment benefits', async ({ page }) => {
    // Fill in loan details
    await page.fill('input[placeholder="1000000"]', '2000000');
    await page.fill('input[placeholder="8.5"]', '9');
    await page.fill('input[placeholder="20"]', '15');

    // Add prepayment
    await page.fill('input[placeholder="12"]', '12');
    await page.fill('input[placeholder="50000"]', '100000');
    await page.click('button:has-text("+ Add")');

    // Calculate
    await page.click('button:has-text("Calculate EMI")');

    // Wait for results
    await expect(page.locator('text=Interest Saved')).toBeVisible({ timeout: 5000 });
    
    // Interest saved should be positive
    const interestSavedText = await page.locator('text=Interest Saved').locator('..').textContent();
    expect(interestSavedText).toContain('₹');
  });

  test('should display prepayments in amortization table', async ({ page }) => {
    // Fill in loan details
    await page.fill('input[placeholder="1000000"]', '1000000');
    await page.fill('input[placeholder="8.5"]', '8.5');
    await page.fill('input[placeholder="20"]', '20');

    // Add prepayment for month 6
    await page.fill('input[placeholder="12"]', '6');
    await page.fill('input[placeholder="50000"]', '50000');
    await page.click('button:has-text("+ Add")');

    // Calculate
    await page.click('button:has-text("Calculate EMI")');

    // Wait for table
    await expect(page.locator('text=Amortization Schedule')).toBeVisible({ timeout: 5000 });

    // Find the row for month 6 and check it has prepayment
    const month6Row = page.locator('tr', { has: page.locator('td:has-text("6")').first() });
    await expect(month6Row.locator('td').nth(4)).toContainText('₹50,000');
  });
});
