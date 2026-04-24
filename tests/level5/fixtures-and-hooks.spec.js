// tests/level5/fixtures-and-hooks.spec.js
// 🟠 LEVEL 5 - Fixtures & Test Hooks
// Concepts: beforeEach, afterEach, beforeAll, afterAll, custom fixtures

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');

// ---- Custom Fixtures ----
const authenticatedTest = test.extend({
  // Fixture: provides an already-logged-in page
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');
    await expect(loginPage.successMessage).toBeVisible();

    // Provide the logged-in page to the test
    await use(page);

    // Teardown: logout after test
    const logoutBtn = page.locator('a[href="/logout"]');
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
    }
  },
});

// ---- Tests using hooks ----

test.describe('Level 5 - Fixtures & Test Hooks', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
    console.log('  [beforeEach] Navigated to login page');
  });

  test.afterEach(async ({ page }) => {
    console.log('  [afterEach] Test completed, current URL:', page.url());
  });

  test('should use beforeEach setup', async ({ page }) => {
    await expect(page).toHaveURL(/.*login/);
    await loginPage.login('tomsmith', 'SuperSecretPassword!');
    await expect(loginPage.successMessage).toBeVisible();
  });

  test('should verify login page always loads fresh (beforeEach)', async ({ page }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

});

// ---- Tests using custom authenticated fixture ----

authenticatedTest.describe('Level 5 - Custom Fixture: Authenticated User', () => {

  authenticatedTest('should access secure area with authenticated fixture', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL(/.*secure/);
    await expect(authenticatedPage.locator('h2')).toContainText('Secure Area');
  });

  authenticatedTest('should see logout button when authenticated', async ({ authenticatedPage }) => {
    const logoutBtn = authenticatedPage.locator('a[href="/logout"]');
    await expect(logoutBtn).toBeVisible();
  });

});

// ---- beforeAll / afterAll example ----

test.describe('Level 5 - beforeAll & afterAll', () => {
  let sharedData = {};

  test.beforeAll(async () => {
    // Runs once before all tests in this describe
    sharedData.startTime = Date.now();
    sharedData.testUser = { username: 'tomsmith', password: 'SuperSecretPassword!' };
    console.log('  [beforeAll] Suite setup complete');
  });

  test.afterAll(async () => {
    const duration = Date.now() - sharedData.startTime;
    console.log(`  [afterAll] Suite finished in ${duration}ms`);
  });

  test('should use shared data from beforeAll', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(sharedData.testUser.username, sharedData.testUser.password);
    await expect(loginPage.successMessage).toBeVisible();
  });

});
