// tests/level4/page-object-model.spec.js
// 🟠 LEVEL 4 - Page Object Model (POM)
// Concepts: POM pattern, separation of concerns, reusable page classes

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');



class CheckboxPage {
  constructor(page) {
    this.page = page;
    this.heading = page.locator('h3');
    this.checkboxes = page.locator('input[type="checkbox"]');
  }

  async navigate() {
    await this.page.goto('/checkboxes');
  }

  async getCheckbox(index) {
    return this.checkboxes.nth(index);
  }

  async checkAll() {
    const count = await this.checkboxes.count();
    for (let i = 0; i < count; i++) {
      await this.checkboxes.nth(i).check();
    }
  }
}

class DropdownPage {
  constructor(page) {
    this.page = page;
    this.dropdown = page.locator('#dropdown');
  }

  async navigate() {
    await this.page.goto('/dropdown');
  }

  async selectByValue(value) {
    await this.dropdown.selectOption({ value });
  }

  async selectByLabel(label) {
    await this.dropdown.selectOption({ label });
  }

  async getSelectedValue() {
    return this.dropdown.inputValue();
  }
}

// ---- Tests using POM ----

test.describe('Level 4 - Page Object Model', () => {

  test('should login successfully using LoginPage POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');

    await expect(loginPage.successMessage).toContainText('You logged into a secure area!');
  });

  test('should fail login using LoginPage POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('baduser', 'badpass');

    await expect(loginPage.errorMessage).toContainText('Your username is invalid!');
  });

  test('should login and logout using LoginPage POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');

    await expect(loginPage.successMessage).toBeVisible();
    await loginPage.logout();

    await expect(page).toHaveURL(/.*login/);
  });

  test('should check all checkboxes using CheckboxPage POM', async ({ page }) => {
    const checkboxPage = new CheckboxPage(page);
    await checkboxPage.navigate();
    await checkboxPage.checkAll();

    const count = await checkboxPage.checkboxes.count();
    for (let i = 0; i < count; i++) {
      await expect(checkboxPage.checkboxes.nth(i)).toBeChecked();
    }
  });

  test('should select dropdown options using DropdownPage POM', async ({ page }) => {
    const dropdownPage = new DropdownPage(page);
    await dropdownPage.navigate();

    await dropdownPage.selectByValue('1');
    expect(await dropdownPage.getSelectedValue()).toBe('1');

    await dropdownPage.selectByLabel('Option 2');
    expect(await dropdownPage.getSelectedValue()).toBe('2');
  });

});
