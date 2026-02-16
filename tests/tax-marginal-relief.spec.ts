import { test, expect } from '@playwright/test';

test.describe('Income Tax Calculator - Logic Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navigating to the page where the component is rendered
    await page.goto('/finance/income-tax-calculator');
  });

  test('New Regime 12.75L salaried should have zero tax (Marginal Relief)', async ({ page }) => {
    // Set Annual Salary to 12,75,000
    const salaryInput = page.locator('input[name="annualSalary"]');
    await salaryInput.fill('1275000');
    
    // Ensure "Salaried" is selected (should be default)
    // Based on the component logic, tax should be 0.
    
    const newRegimeTax = page.locator('h3:has-text("New Regime")').locator('xpath=ancestor::div[1]').locator('text=Total Tax Payable').locator('..').locator('span').first();
    await expect(newRegimeTax).toHaveText('₹0');
  });

  test('New Regime 12.80L salaried should have tax based on relief', async ({ page }) => {
    // 12.80L - 75k std = 12.05L taxable.
    // Tax without relief: 4L@0 + 4L@5% (20k) + 4L@10% (40k) + 5k@15% (750) = 60,750.
    // Marginal relief: tax cannot exceed excess over 12L.
    // Excess = 12.05L - 12L = 5,000.
    // So tax should be 5,000 + 4% cess = 5,200.
    
    const salaryInput = page.locator('input[name="annualSalary"]');
    await salaryInput.fill('1280000');
    
    const newRegimeTax = page.locator('h3:has-text("New Regime")').locator('xpath=ancestor::div[1]').locator('text=Total Tax Payable').locator('..').locator('span').first();
    await expect(newRegimeTax).toHaveText('₹5,200');
  });
});
