// tests/level2/form-interactions.spec.js
// 🟡 LEVEL 2 - Form Interactions
// Concepts: fill, click, checkboxes, dropdowns, type

const { test, expect } = require('@playwright/test');

test.describe('Level 2 - Form Interactions', () => {

  test('should fill and submit login form with valid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');

    await expect(page.locator('.flash.success')).toContainText('You logged into a secure area!');
  });

  test('should show error for invalid login credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('#username', 'wronguser');
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('.flash.error')).toContainText('Your username is invalid!');
  });

  test('should check and uncheck checkboxes', async ({ page }) => {
    await page.goto('/checkboxes');

    const checkbox1 = page.locator('input[type="checkbox"]').nth(0);
    const checkbox2 = page.locator('input[type="checkbox"]').nth(1);

    // checkbox2 starts checked - uncheck 
    await expect(checkbox2).toBeChecked();
    await checkbox2.uncheck();
    await expect(checkbox2).not.toBeChecked();

    // checkbox1 starts unchecked - check 
    await expect(checkbox1).not.toBeChecked();
    await checkbox1.check();
    await expect(checkbox1).toBeChecked();
  });

  test('should select option from dropdown', async ({ page }) => {
    await page.goto('/dropdown');

    const dropdown = page.locator('#dropdown');
    await dropdown.selectOption({ value: '1' });
    await expect(dropdown).toHaveValue('1');

    await dropdown.selectOption({ label: 'Option 2' });
    await expect(dropdown).toHaveValue('2');
  });

  test('should type into a textarea', async ({ page }) => {
    await page.goto('/forgot_password');

    const emailInput = page.locator('#email');
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('should clear a field and retype', async ({ page }) => {
    await page.goto('/login');

    const username = page.locator('#username');
    await username.fill('firstvalue');
    await username.clear();
    await username.fill('newvalue');
    await expect(username).toHaveValue('newvalue');
  });

});
