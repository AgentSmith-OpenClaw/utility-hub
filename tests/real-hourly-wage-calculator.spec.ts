import { test, expect } from '@playwright/test';

test.describe('Real Hourly Wage Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/finance/real-hourly-wage-calculator');
  });

  test('should load the calculator page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Real Hourly Wage Calculator');
    await expect(page.locator('text=Income Details')).toBeVisible();
  });

  test('should display summary metric cards', async ({ page }) => {
    await expect(page.locator('text=Nominal Wage')).toBeVisible();
    await expect(page.locator('text=Real Wage')).toBeVisible();
    await expect(page.locator('text=Wage Erosion')).toBeVisible();
    await expect(page.locator('text=Remote Equivalent')).toBeVisible();
  });

  test('should update results when salary changes', async ({ page }) => {
    const realWageBefore = await page.locator('text=Real Wage').locator('..').locator('p').nth(1).textContent();

    const salaryInput = page.locator('label:has-text("Gross Annual Salary")').locator('..').locator('input[type="text"]');
    await salaryInput.clear();
    await salaryInput.fill('120000');
    await salaryInput.press('Enter');

    await page.waitForTimeout(1000);

    const realWageAfter = await page.locator('text=Real Wage').locator('..').locator('p').nth(1).textContent();
    expect(realWageAfter).not.toBe(realWageBefore);
  });

  test('should toggle remote mode', async ({ page }) => {
    const remoteToggle = page.locator('role=switch');
    await expect(remoteToggle).toBeVisible();

    await remoteToggle.click();
    await page.waitForTimeout(500);

    // Verify remote mode is active
    await expect(remoteToggle).toHaveAttribute('aria-checked', 'true');
  });

  test('should switch chart tabs', async ({ page }) => {
    await expect(page.locator('button:has-text("Salary Erosion")')).toBeVisible();

    await page.click('button:has-text("168-Hr Week")');
    await expect(page.locator('.recharts-pie')).toBeVisible();

    await page.click('button:has-text("Cost Breakdown")');
    await expect(page.locator('.recharts-bar').first()).toBeVisible();

    await page.click('button:has-text("Time Breakdown")');
    await expect(page.locator('.recharts-bar').first()).toBeVisible();
  });

  test('should have export and share buttons', async ({ page }) => {
    await expect(page.locator('button:has-text("PDF")')).toBeVisible();
    await expect(page.locator('button:has-text("Excel")')).toBeVisible();
    await expect(page.locator('button:has-text("Copy URL")')).toBeVisible();
    await expect(page.locator('button:has-text("WhatsApp")')).toBeVisible();
    await expect(page.locator('button:has-text("Twitter")')).toBeVisible();
  });

  test('should reset to defaults', async ({ page }) => {
    const salaryInput = page.locator('label:has-text("Gross Annual Salary")').locator('..').locator('input[type="text"]');
    await salaryInput.clear();
    await salaryInput.fill('200000');
    await salaryInput.press('Enter');

    await page.click('text=Reset Defaults');
    await page.waitForTimeout(500);

    await expect(salaryInput).toHaveValue('75,000');
  });

  test('should display detailed breakdown section', async ({ page }) => {
    await expect(page.locator('text=Detailed Breakdown')).toBeVisible();
    await expect(page.locator('text=Total Annual Hours')).toBeVisible();
    await expect(page.locator('text=Unpaid Hours')).toBeVisible();
    await expect(page.locator('text=Annual Work Costs')).toBeVisible();
    await expect(page.locator('text=Adjusted Take-Home')).toBeVisible();
  });

  test('should have proper SEO metadata', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Real Hourly Wage Calculator');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toContain('real hourly wage');

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('real-hourly-wage-calculator');
  });

  test('should display SEO content section', async ({ page }) => {
    await expect(page.locator('text=Understanding Your Real Hourly Wage')).toBeVisible();
    await expect(page.locator('text=How the Real Hourly Wage Calculator Works')).toBeVisible();
  });

  test('should have currency selector', async ({ page }) => {
    await expect(page.locator('button:has-text("$")')).toBeVisible();
    await expect(page.locator('button:has-text("₹")')).toBeVisible();
    await expect(page.locator('button:has-text("£")')).toBeVisible();
  });
});
