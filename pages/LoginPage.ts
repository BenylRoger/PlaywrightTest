import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly emailHelperText: Locator;
  readonly alertError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.locator("#email");
    this.password = page.locator("#password");
    this.loginButton = page.locator("#loginBtn");
    this.emailHelperText = page.locator("text=Invalid email");
    this.alertError = page.locator("text=Invalid credentials");
  }

  async goto() {
    await this.page.goto("/");
    await expect(this.page).toHaveURL(/\/?$/);
  }

  /**
   * Fill email and trigger blur to enforce trimming/validation in the UI.
   */
  async fillEmail(value: string) {
    await this.email.fill("");
    await this.email.type(value);
    // blur to trigger onBlur trimming and validation
    await this.email.evaluate((el: HTMLInputElement) => el.blur());
  }

  /**
   * Fill password and trigger blur for trimming.
   */
  async fillPassword(value: string) {
    await this.password.fill("");
    await this.password.type(value);
    await this.password.evaluate((el: HTMLInputElement) => el.blur());
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async isLoginEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  async emailShowsInvalid(): Promise<boolean> {
    return await this.emailHelperText.isVisible().catch(() => false);
  }

  async genericErrorVisible(): Promise<boolean> {
    return await this.alertError.isVisible().catch(() => false);
  }

  async expectOnDashboard() {
    // The app uses history.pushState to update URL to /dashboard — assert URL and content
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(this.page.locator("text=Dashboard")).toBeVisible();
    await expect(this.page.locator("text=Welcome back")).toBeVisible();
  }
}
