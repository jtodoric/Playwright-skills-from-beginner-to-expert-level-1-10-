// tests/level7/advanced-interactions.spec.js
// 🔴 LEVEL 7 - Advanced Interactions
// Concepts: drag-and-drop, hover, file upload, keyboard, iframes, shadow DOM

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test.describe('Level 7 - Advanced Interactions', () => {

  test('should perform hover action and reveal element', async ({ page }) => {
    await page.goto('/hovers');

    const images = page.locator('.figure img');

    await images.nth(0).hover();
    const caption = page.locator('.figure').nth(0).locator('.figcaption');
    await expect(caption).toBeVisible();
    await expect(caption).toContainText('name: user1');
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    await page.goto('/key_presses');

    const input = page.locator('#target');
    await input.focus();
    await page.keyboard.press('Tab');

    await expect(page.locator('#result')).toContainText('You entered: TAB');
  });

  test('should type with keyboard events', async ({ page }) => {
    await page.goto('/key_presses');

    const input = page.locator('#target');
    await input.press('A');

    await expect(page.locator('#result')).toContainText('You entered: A');
  });

  test('should handle drag and drop', async ({ page }) => {
    await page.goto('/drag_and_drop');

    const columnA = page.locator('#column-a');
    const columnB = page.locator('#column-b');

    await expect(columnA.locator('header')).toHaveText('A');
    await expect(columnB.locator('header')).toHaveText('B');

    // Use drag and drop
    await columnA.dragTo(columnB);

    // After drag, columns should be swapped
    await expect(columnA.locator('header')).toHaveText('B');
    await expect(columnB.locator('header')).toHaveText('A');
  });

  test('should upload a file', async ({ page }) => {
    await page.goto('/upload');

    // Create a temp file to upload
    const tmpFilePath = path.join('/tmp', 'test-upload.txt');
    fs.writeFileSync(tmpFilePath, 'Hello from Playwright file upload test!');

    const fileInput = page.locator('#file-upload');
    await fileInput.setInputFiles(tmpFilePath);
    await page.click('#file-submit');

    await expect(page.locator('#uploaded-files')).toContainText('test-upload.txt');

    // Cleanup
    fs.unlinkSync(tmpFilePath);
  });

  test('should interact with iframes', async ({ page }) => {
    await page.goto('/iframe');

    // Get the iframe
    const frame = page.frameLocator('#mce_0_ifr');

    // Interact with element inside iframe
    const body = frame.locator('body#tinymce');
    await body.click();
    await page.keyboard.selectAll();
    await page.keyboard.type('Hello from inside the iframe!');

    await expect(body).toContainText('Hello from inside the iframe!');
  });

  test('should handle multiple windows / tabs', async ({ page, context }) => {
    await page.goto('/windows');

    // Wait for new page/tab
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click('a[href="/windows/new"]'),
    ]);

    await newPage.waitForLoadState();
    await expect(newPage.locator('h3')).toHaveText('New Window');
    await newPage.close();
  });

  test('should handle alert dialog', async ({ page }) => {
    await page.goto('/javascript_alerts');

    // Handle JS alert
    page.once('dialog', dialog => {
      expect(dialog.message()).toBe('I am a JS Alert');
      dialog.accept();
    });

    await page.click('button[onclick="jsAlert()"]');
    await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
  });

  test('should handle confirm dialog - accept', async ({ page }) => {
    await page.goto('/javascript_alerts');

    page.once('dialog', dialog => {
      expect(dialog.message()).toBe('I am a JS Confirm');
      dialog.accept();
    });

    await page.click('button[onclick="jsConfirm()"]');
    await expect(page.locator('#result')).toHaveText('You clicked: Ok');
  });

  test('should handle confirm dialog - dismiss', async ({ page }) => {
    await page.goto('/javascript_alerts');

    page.once('dialog', dialog => {
      dialog.dismiss();
    });

    await page.click('button[onclick="jsConfirm()"]');
    await expect(page.locator('#result')).toHaveText('You clicked: Cancel');
  });

  test('should handle prompt dialog with input', async ({ page }) => {
    await page.goto('/javascript_alerts');

    page.once('dialog', dialog => {
      dialog.accept('Hello Playwright!');
    });

    await page.click('button[onclick="jsPrompt()"]');
    await expect(page.locator('#result')).toHaveText('You entered: Hello Playwright!');
  });

});
