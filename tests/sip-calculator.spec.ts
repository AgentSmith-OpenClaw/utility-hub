import { test, expect } from '@playwright/test';

test.describe('SIP Calculator', () => {
  test('renders charts and allows editing numeric input', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    page.on('pageerror', (error) => {
      consoleErrors.push(String(error));
    });

    await page.goto('/finance/sip-calculator');

    await expect(page.locator('h1')).toContainText('Advanced SIP & Wealth Planner');
    await expect(page.locator('text=Growth Path')).toBeVisible();

    await expect(page.locator('.recharts-wrapper').first()).toBeVisible({ timeout: 8000 });

    const monthlyInput = page.locator('input[type="text"]').first();
    await monthlyInput.click();
    await monthlyInput.fill('1200');
    await monthlyInput.blur();

    await expect(monthlyInput).toHaveValue('1200');

    expect(consoleErrors).toEqual([]);
  });
});
