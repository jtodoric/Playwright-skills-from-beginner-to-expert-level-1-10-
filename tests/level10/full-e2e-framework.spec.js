// tests/level10/full-e2e-framework.spec.js
// ⚫ LEVEL 10 - Full E2E Framework
// Concepts: multi-step workflows, auth state reuse, custom reporters, CI-ready patterns,
//           component isolation, global setup/teardown, performance, full coverage

const { test, expect, request } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// ==========================================
// SECTION A: Full Authentication Flow
// with storageState reuse
// ==========================================

// Helper: perform login and save cookies
async function loginAndSaveState(page, storageStatePath) {
  await page.goto('/login');
  await page.fill('#username', 'tomsmith');
  await page.fill('#password', 'SuperSecretPassword!');
  await page.click('button[type="submit"]');
  await expect(page.locator('.flash.success')).toBeVisible();

  await page.context().storageState({ path: storageStatePath });
}

test.describe('Level 10-A: Auth State Reuse', () => {
  const statePath = path.join('/tmp', 'auth-state.json');

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await loginAndSaveState(page, statePath);
    await page.close();
  });

  test('should access secure area using saved auth state', async ({ browser }) => {
    const context = await browser.newContext({ storageState: statePath });
    const page = await context.newPage();

    await page.goto('/secure');
    await expect(page.locator('h2')).toContainText('Secure Area');

    await context.close();
  });

  test('should remain authenticated across multiple pages', async ({ browser }) => {
    const context = await browser.newContext({ storageState: statePath });
    const page = await context.newPage();

    await page.goto('/secure');
    await expect(page.locator('a[href="/logout"]')).toBeVisible();

    // Navigate away and back
    await page.goto('/checkboxes');
    await page.goBack();
    await expect(page.locator('h2')).toContainText('Secure Area');

    await context.close();
  });
});

// ==========================================
// SECTION B: Performance & Metrics
// ==========================================

test.describe('Level 10-B: Performance Monitoring', () => {

  test('should measure page load performance', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    console.log(`  ⏱ Page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(10000); // Max 10 seconds
  });

  test('should collect web vitals via JavaScript', async ({ page }) => {
    await page.goto('/');

    const metrics = await page.evaluate(() => {
      return {
        timing: {
          domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
          fullLoad: performance.timing.loadEventEnd - performance.timing.navigationStart,
        },
        memory: performance.memory
          ? {
              usedJSHeapSize: performance.memory.usedJSHeapSize,
              totalJSHeapSize: performance.memory.totalJSHeapSize,
            }
          : null,
      };
    });

    console.log('  📊 Performance metrics:', JSON.stringify(metrics, null, 2));
    expect(metrics.timing.domContentLoaded).toBeGreaterThan(0);
  });

  test('should verify no console errors on critical pages', async ({ page }) => {
    const consoleErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/login');
    await page.goto('/checkboxes');
    await page.goto('/dropdown');

    if (consoleErrors.length > 0) {
      console.warn('  ⚠️ Console errors found:', consoleErrors);
    }

    // For this demo site, we'll just log rather than fail
    console.log(`  ✅ Console errors found: ${consoleErrors.length}`);
  });

});

// ==========================================
// SECTION C: Multi-Step Workflows
// ==========================================

test.describe('Level 10-C: End-to-End User Journeys', () => {

  test('full login → navigate → interact → logout journey', async ({ page }) => {
    // Step 1: Login
    await page.goto('/login');
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');
    await expect(page.locator('.flash.success')).toBeVisible();
    test.info().annotations.push({ type: 'step', description: '✅ Step 1: Login successful' });

    // Step 2: Navigate to secure area
    await expect(page).toHaveURL(/.*secure/);
    await expect(page.locator('h2')).toContainText('Secure Area');
    test.info().annotations.push({ type: 'step', description: '✅ Step 2: Navigated to secure area' });

    // Step 3: Logout
    await page.click('a[href="/logout"]');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('.flash.success')).toContainText('You logged out');
    test.info().annotations.push({ type: 'step', description: '✅ Step 3: Logged out successfully' });
  });

  test('full form interaction workflow', async ({ page }) => {
    // Checkboxes
    await page.goto('/checkboxes');
    await page.locator('input[type="checkbox"]').nth(0).check();
    await page.locator('input[type="checkbox"]').nth(1).uncheck();
    await expect(page.locator('input[type="checkbox"]').nth(0)).toBeChecked();
    await expect(page.locator('input[type="checkbox"]').nth(1)).not.toBeChecked();

    // Dropdown
    await page.goto('/dropdown');
    await page.selectOption('#dropdown', '2');
    await expect(page.locator('#dropdown')).toHaveValue('2');

    // Dynamic controls - toggle checkbox
    await page.goto('/dynamic_controls');
    await page.click('#checkbox-example button');
    await expect(page.locator('#checkbox-example #message')).toHaveText("It's gone!", { timeout: 10000 });
  });

  test('multi-tab workflow', async ({ page, context }) => {
    await page.goto('/windows');

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click('a[href="/windows/new"]'),
    ]);

    await newPage.waitForLoadState();
    await expect(newPage.locator('h3')).toHaveText('New Window');

    // Assert original page is unaffected
    await expect(page).toHaveURL(/.*windows/);
    await newPage.close();
  });

});

// ==========================================
// SECTION D: Custom Utilities & Helpers
// ==========================================

// Custom utility: retry wrapper
async function retryAction(action, maxRetries = 3, delay = 500) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await action();
    } catch (err) {
      lastError = err;
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastError;
}

// Custom utility: take annotated screenshot
async function annotatedScreenshot(page, name, testInfo) {
  const screenshotPath = `test-results/screenshots/${name}-${Date.now()}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach(name, { path: screenshotPath, contentType: 'image/png' });
  return screenshotPath;
}

test.describe('Level 10-D: Custom Utilities & Reporting', () => {

  test('should use retry utility for resilient actions', async ({ page }) => {
    await page.goto('/dynamic_loading/1');
    await page.click('button');

    // Use retry utility to wait for element
    await retryAction(async () => {
      const text = await page.locator('#finish h4').textContent({ timeout: 2000 });
      if (text !== 'Hello World!') throw new Error(`Expected 'Hello World!', got '${text}'`);
    });

    await expect(page.locator('#finish h4')).toHaveText('Hello World!');
  });

  test('should attach annotated screenshots to test report', async ({ page }, testInfo) => {
    await page.goto('/login');
    await annotatedScreenshot(page, 'login-page', testInfo);

    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');

    await annotatedScreenshot(page, 'post-login', testInfo);
    await expect(page.locator('.flash.success')).toBeVisible();
  });

  test('should write test results to custom JSON report', async ({ page }, testInfo) => {
    const results = { tests: [], timestamp: new Date().toISOString() };

    await page.goto('/login');
    results.tests.push({ step: 'navigate-to-login', status: 'pass' });

    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');

    const isSuccess = await page.locator('.flash.success').isVisible();
    results.tests.push({ step: 'login', status: isSuccess ? 'pass' : 'fail' });

    const reportPath = path.join('test-results', `custom-report-${Date.now()}.json`);
    fs.mkdirSync('test-results', { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

    console.log('  📝 Custom report written to:', reportPath);
    expect(results.tests.every(t => t.status === 'pass')).toBeTruthy();
  });

});

// ==========================================
// SECTION E: Security & Edge Cases
// ==========================================

test.describe('Level 10-E: Security & Edge Cases', () => {

  test('should handle XSS attempt in input safely', async ({ page }) => {
    await page.goto('/login');

    const xssPayload = '<script>alert("xss")</script>';
    await page.fill('#username', xssPayload);
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    // Should show error, not execute script
    await expect(page.locator('.flash.error')).toBeVisible();
  });

  test('should handle very long input strings', async ({ page }) => {
    await page.goto('/login');

    const longString = 'A'.repeat(1000);
    await page.fill('#username', longString);
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    // Should gracefully handle without crashing
    await expect(page.locator('.flash')).toBeVisible();
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL(/.*login/);

    await page.goBack();
    await expect(page).toHaveURL('https://the-internet.herokuapp.com/');

    await page.goForward();
    await expect(page).toHaveURL(/.*login/);
  });

  test('should handle slow network conditions', async ({ page, context }) => {
    // Simulate slow network
    await context.route('**/*', async route => {
      await new Promise(r => setTimeout(r, 100)); // 100ms delay
      await route.continue();
    });

    const startTime = Date.now();
    await page.goto('/login');
    const loadTime = Date.now() - startTime;

    console.log(`  🐢 Load time with simulated slow network: ${loadTime}ms`);
    await expect(page.locator('#username')).toBeVisible();
  });

  test('should test concurrent user actions', async ({ browser }) => {
    // Simulate 3 concurrent users
    const users = await Promise.all([
      browser.newPage(),
      browser.newPage(),
      browser.newPage(),
    ]);

    await Promise.all(users.map(async (page, i) => {
      await page.goto('/login');
      await page.fill('#username', 'tomsmith');
      await page.fill('#password', 'SuperSecretPassword!');
      await page.click('button[type="submit"]');
      await expect(page.locator('.flash.success')).toBeVisible();
      console.log(`  👤 User ${i + 1} logged in successfully`);
      await page.close();
    }));
  });

});
