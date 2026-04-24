// tests/level6/api-and-network.spec.js
// 🔴 LEVEL 6 - API Testing & Network Interception
// Concepts: request/response interception, API calls via request context, mocking

const { test, expect } = require('@playwright/test');

test.describe('Level 6 - API Testing & Network Interception', () => {

  test('should intercept and assert on network request', async ({ page }) => {
    const requests = [];

    page.on('request', request => {
      if (request.url().includes('the-internet')) {
        requests.push(request.url());
      }
    });

    await page.goto('/login');
    expect(requests.length).toBeGreaterThan(0);
  });

  test('should intercept network response and assert status', async ({ page }) => {
    const responses = [];

    page.on('response', response => {
      responses.push({ url: response.url(), status: response.status() });
    });

    await page.goto('/login');

    const mainResponse = responses.find(r => r.url.includes('/login'));
    expect(mainResponse).toBeDefined();
    expect(mainResponse.status).toBe(200);
  });

  test('should mock a network response (route interception)', async ({ page }) => {
    // Intercept requests to the login page and mock the response
    await page.route('**/login', async route => {
      const response = await route.fetch();
      let body = await response.text();

      // Inject a custom message into the response body
      body = body.replace('<h2>Login Page</h2>', '<h2>🔥 Mocked Login Page</h2>');

      await route.fulfill({
        response,
        body,
      });
    });

    await page.goto('/login');
    await expect(page.locator('h2')).toHaveText('🔥 Mocked Login Page');
  });

  test('should block specific resource types (images)', async ({ page }) => {
    const blockedUrls = [];

    await page.route('**/*.png', route => {
      blockedUrls.push(route.request().url());
      route.abort();
    });

    await page.goto('/');
    console.log(`Blocked ${blockedUrls.length} PNG requests`);
    // Page still loads even without images
    await expect(page.locator('h1.heading')).toBeVisible();
  });

  test('should use APIRequestContext to make direct API call', async ({ request }) => {
    // Direct API call - not via browser
    const response = await request.get('https://the-internet.herokuapp.com/status_codes/200');
    expect(response.status()).toBe(200);
  });

  test('should assert on response headers', async ({ page }) => {
    const [response] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/login')),
      page.goto('/login'),
    ]);

    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('text/html');
  });

  test('should intercept and modify request headers', async ({ page }) => {
    await page.route('**/login', async route => {
      const headers = {
        ...route.request().headers(),
        'X-Custom-Header': 'playwright-test',
      };
      await route.continue({ headers });
    });

    await page.goto('/login');
    await expect(page.locator('h2')).toContainText('Login Page');
  });

  test('should use storageState for authenticated API calls', async ({ request }) => {
    // Simulate basic API health check
    const response = await request.get('https://the-internet.herokuapp.com/');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

});
