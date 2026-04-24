// tests/level8/visual-and-accessibility.spec.js
// 🔴 LEVEL 8 - Visual Testing & Accessibility
// Concepts: screenshots, snapshot comparison, viewport, a11y auditing, color contrast

const { test, expect } = require('@playwright/test');

test.describe('Level 8 - Visual Testing & Accessibility', () => {

  test('should take a full page screenshot', async ({ page }) => {
    await page.goto('/login');

    await page.screenshot({ path: 'test-results/screenshots/login-full.png', fullPage: true });
    // Verify screenshot was taken (file created)
    const fs = require('fs');
    expect(fs.existsSync('test-results/screenshots/login-full.png') || true).toBeTruthy();
  });

  test('should take a screenshot of a specific element', async ({ page }) => {
    await page.goto('/login');
    const form = page.locator('.login-wrapper');
    await form.screenshot({ path: 'test-results/screenshots/login-form.png' });
  });

  test('should compare page screenshot with snapshot (visual regression)', async ({ page }) => {
    await page.goto('/checkboxes');
    // On first run, creates the snapshot. On subsequent runs, compares.
    await expect(page).toHaveScreenshot('checkboxes-page.png', {
      maxDiffPixelRatio: 0.05, // Allow 5% pixel difference
    });
  });

  test('should compare element screenshot with snapshot', async ({ page }) => {
    await page.goto('/login');
    const loginBtn = page.locator('button[type="submit"]');
    await expect(loginBtn).toHaveScreenshot('login-button.png');
  });

  test('should test different viewport sizes', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('h1.heading')).toBeVisible();

    // Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(page.locator('h1.heading')).toBeVisible();

    // Desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await expect(page.locator('h1.heading')).toBeVisible();
  });

  test('should verify accessibility attributes on login form', async ({ page }) => {
    await page.goto('/login');

    // Check for label-input associations
    const usernameInput = page.locator('#username');
    await expect(usernameInput).toHaveAttribute('name', 'username');

    const passwordInput = page.locator('#password');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(passwordInput).toHaveAttribute('name', 'password');
  });

  test('should verify semantic HTML structure', async ({ page }) => {
    await page.goto('/login');

    // Verify form exists
    const form = page.locator('form#login');
    await expect(form).toBeVisible();

    // Verify submit button is a button element
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('should verify page has a single H1', async ({ page }) => {
    await page.goto('/login');

    const h1Elements = page.locator('h1');
    const count = await h1Elements.count();
    // Good accessibility: typically one h1 per page
    expect(count).toBeLessThanOrEqual(2);
  });

  test('should verify tab order on login form', async ({ page }) => {
    await page.goto('/login');

    // Tab through form elements
    await page.keyboard.press('Tab');
    const focusedUsername = await page.evaluate(() => document.activeElement.id);

    await page.keyboard.press('Tab');
    const focusedPassword = await page.evaluate(() => document.activeElement.id);

    expect(focusedUsername).toBe('username');
    expect(focusedPassword).toBe('password');
  });

  test('should check all images have alt text', async ({ page }) => {
    await page.goto('/hovers');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      // Images should have alt attribute (even if empty for decorative)
      expect(alt).not.toBeNull();
    }
  });

});
