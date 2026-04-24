// tests/level9/data-driven-parallel.spec.js
// 🔴 LEVEL 9 - Data-Driven Tests & Advanced Patterns
// Concepts: parametrize, test.each, CSV/JSON data, parallel workers, retry, tags

const { test, expect } = require('@playwright/test');

// ---- Test Data ----
const loginTestCases = [
  {
    id: 'valid-user',
    username: 'tomsmith',
    password: 'SuperSecretPassword!',
    expectedResult: 'success',
    expectedMessage: 'You logged into a secure area!',
  },
  {
    id: 'invalid-username',
    username: 'wronguser',
    password: 'SuperSecretPassword!',
    expectedResult: 'error',
    expectedMessage: 'Your username is invalid!',
  },
  {
    id: 'invalid-password',
    username: 'tomsmith',
    password: 'wrongpassword',
    expectedResult: 'error',
    expectedMessage: 'Your password is invalid!',
  },
  {
    id: 'empty-credentials',
    username: '',
    password: '',
    expectedResult: 'error',
    expectedMessage: 'Your username is invalid!',
  },
];

const statusCodes = [200, 301, 404, 500];

const dropdownOptions = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
];

// ---- Data-Driven Tests ----

test.describe('Level 9 - Data-Driven Tests', () => {

  // Parametrized login tests
  for (const tc of loginTestCases) {
    test(`Login: ${tc.id} - should show ${tc.expectedResult}`, async ({ page }) => {
      await page.goto('/login');
      await page.fill('#username', tc.username);
      await page.fill('#password', tc.password);
      await page.click('button[type="submit"]');

      if (tc.expectedResult === 'success') {
        await expect(page.locator('.flash.success')).toContainText(tc.expectedMessage);
      } else {
        await expect(page.locator('.flash.error')).toContainText(tc.expectedMessage);
      }
    });
  }

  // Parametrized status code tests
  for (const code of statusCodes) {
    test(`Status code page: should display ${code}`, async ({ page }) => {
      await page.goto(`/status_codes/${code}`);
      await expect(page.locator('p')).toContainText(code.toString());
    });
  }

  // Parametrized dropdown tests
  for (const option of dropdownOptions) {
    test(`Dropdown: selecting "${option.label}" should set value "${option.value}"`, async ({ page }) => {
      await page.goto('/dropdown');
      await page.selectOption('#dropdown', { value: option.value });
      await expect(page.locator('#dropdown')).toHaveValue(option.value);
    });
  }

});

// ---- Advanced: Test Tagging and Conditional Skip ----

test.describe('Level 9 - Test Tags & Conditional Logic', () => {

  test('smoke: homepage loads @smoke', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/The Internet/);
  });

  test('regression: login flow end-to-end @regression', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');
    await expect(page.locator('.flash.success')).toBeVisible();
    await page.click('a[href="/logout"]');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should skip on specific condition', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Skipping on Safari for this scenario');
    await page.goto('/javascript_alerts');
    await expect(page.locator('h3')).toContainText('JavaScript Alerts');
  });

  test('should fail gracefully with soft assertions', async ({ page }) => {
    await page.goto('/checkboxes');

    const checkbox1 = page.locator('input[type="checkbox"]').nth(0);
    const checkbox2 = page.locator('input[type="checkbox"]').nth(1);

    // Soft assertions: test continues even if one fails
    await expect.soft(checkbox2).toBeChecked();
    await expect.soft(checkbox1).not.toBeChecked();

    // This always passes - we verify all soft assertions at end
    expect(test.info().errors).toHaveLength(0);
  });

});

// ---- Advanced: Retry & Flaky Test Handling ----

test.describe('Level 9 - Retry & Resilience', () => {

  test('should retry on failure (configured in playwright.config.js)', async ({ page }) => {
    // This test demonstrates retry behavior
    // In playwright.config.js, retries: 2 on CI
    await page.goto('/dynamic_loading/1');
    await page.click('button');
    await expect(page.locator('#finish h4')).toHaveText('Hello World!', { timeout: 10000 });
  });

  test('should handle flaky content with polling', async ({ page }) => {
    await page.goto('/dynamic_controls');

    // Click to enable input
    await page.click('#input-example button');

    // Poll until the message appears
    await expect(page.locator('#input-example #message')).toHaveText("It's enabled!", { timeout: 10000 });
    await expect(page.locator('#input-example input')).toBeEnabled();
  });

});
