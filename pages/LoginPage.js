// pages/LoginPage.js
// 📦 Page Object Model - Login Page

class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('button[type="submit"]');
    this.successMessage = page.locator('.flash.success');
    this.errorMessage = page.locator('.flash.error');
    this.logoutButton = page.locator('a[href="/logout"]');
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async getSuccessMessage() {
    return this.successMessage.textContent();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }

  async logout() {
    await this.logoutButton.click();
  }
}

module.exports = { LoginPage };
