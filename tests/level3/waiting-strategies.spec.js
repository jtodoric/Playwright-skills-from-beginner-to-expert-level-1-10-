// tests/level3/waiting-strategies.spec.js
// 🟡 LEVEL 3 - Waiting Strategies & Dynamic Content
// Concepts: waitForSelector, waitForResponse, dynamic loading, auto-wait

const { test, expect } = require('@playwright/test');

test.describe('Level 3 - Waiting Strategies & Dynamic Content', () => {

  test('should wait for dynamically loaded element', async ({ page }) => {
    await page.goto('/dynamic_loading/1');

    await page.click('button');

    
    await expect(page.locator('#finish h4')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#finish h4')).toHaveText('Hello World!');
  });

  test('should handle element rendered after load', async ({ page }) => {
    await page.goto('/dynamic_loading/2');

    await page.click('button');

    const finishText = page.locator('#finish h4');
    await expect(finishText).toBeVisible({ timeout: 10000 });
    await expect(finishText).toHaveText('Hello World!');
  });

  test('should wait for loading indicator to disappear', async ({ page }) => {
    await page.goto('/dynamic_loading/1');

    await page.click('button');

    // Wait for loading bar to disappear
    await expect(page.locator('#loading')).not.toBeVisible({ timeout: 10000 });

    // Now content should be shown
    await expect(page.locator('#finish')).toBeVisible();
  });

  test('should handle disappearing elements', async ({ page }) => {
    await page.goto('/disappearing_elements');

    // Gallery link may or may not be present - handle both
    const galleryLink = page.locator('a', { hasText: 'Gallery' });
    const isVisible = await galleryLink.isVisible();

    if (isVisible) {
      console.log('Gallery link is present on this load');
    } else {
      console.log('Gallery link is absent on this load');
    }

    
    const navItems = page.locator('.example li');
    const count = await navItems.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('should wait for network response', async ({ page }) => {
    // Listen for any request
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('the-internet') && resp.status() === 200),
      page.goto('/login'),
    ]);

    expect(response.status()).toBe(200);
  });

  test('should wait for page load state', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    await expect(page.locator('h1.heading')).toBeVisible();
  });

  test('should poll for element with retry', async ({ page }) => {
    await page.goto('/dynamic_controls');

    await page.click('#checkbox-example button');

    
    await expect(page.locator('#checkbox-example #message')).toHaveText("It's gone!", { timeout: 10000 });
  });

});
