// tests/level1/basic-navigation.spec.js
// 🟢 LEVEL 1 - Basic Navigation & Assertions
// Concepts: page.goto, expect, locators, basic assertions

const { test, expect } = require('@playwright/test');

test.describe('Level 1 - Basic Navigation & Assertions', () => {

  test('should load the homepage and verify title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/The Internet/);
  });

  test('should navigate to a page and verify heading', async ({ page }) => {
    await page.goto('/checkboxes');
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Checkboxes');
  });

  test('should verify page URL after navigation', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should check element is visible', async ({ page }) => {
    await page.goto('/login');
    const usernameInput = page.locator('#username');
    await expect(usernameInput).toBeVisible();
  });

  test('should verify text content on page', async ({ page }) => {
    await page.goto('/');
    const bodyText = page.locator('body');
    await expect(bodyText).toContainText('Welcome to the-internet');
  });

  test('should verify a link exists on page', async ({ page }) => {
    await page.goto('/');
    const loginLink = page.locator('a[href="/login"]');
    await expect(loginLink).toBeVisible();
  });

  test('should click a link and verify navigation', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/checkboxes"]');
    await expect(page).toHaveURL(/.*checkboxes/);
  });

});
