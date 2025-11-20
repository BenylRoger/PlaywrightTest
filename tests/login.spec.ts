import { test, expect } from "../fixtures/authFixtures";
import creds from "./data/credentials.json";

// simple email regex to mirror app behavior for local assertions
const simpleEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

test.describe("Login - POM / data-driven", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("Button disabled when email or password empty", async ({
    loginPage,
  }) => {
    // both empty
    await loginPage.fillEmail("");
    await loginPage.fillPassword("");
    expect(await loginPage.isLoginEnabled()).toBe(false);

    // email empty, password set
    await loginPage.fillEmail("");
    await loginPage.fillPassword("somepass");
    expect(await loginPage.isLoginEnabled()).toBe(false);

    // email set (valid) password empty
    await loginPage.fillEmail("valid_user@example.com");
    await loginPage.fillPassword("");
    expect(await loginPage.isLoginEnabled()).toBe(false);
  });

  test("Email validation shows helper text and disables login for bad formats", async ({
    loginPage,
  }) => {
    const badEmails = [
      "abc",
      "abc@",
      "abc@domain",
      "abc@domain.",
      //"abc@domain.c",
    ];
    for (const e of badEmails) {
      await loginPage.fillEmail(e);
      // when touched and not empty -> helper text should appear
      expect(await loginPage.emailShowsInvalid()).toBe(true);
      expect(await loginPage.isLoginEnabled()).toBe(false);
    }

    // good email
    await loginPage.fillEmail("user@example.com");
    expect(await loginPage.emailShowsInvalid()).toBe(false);
  });

  test("Trimming on blur: leading/trailing spaces are trimmed and treated as empty if only spaces", async ({
    loginPage,
  }) => {
    // email spaces only -> becomes empty
    await loginPage.fillEmail("   ");
    await loginPage.fillPassword("somepass");
    expect(await loginPage.isLoginEnabled()).toBe(false);

    // password spaces only -> becomes empty
    await loginPage.fillEmail("valid_user@example.com");
    await loginPage.fillPassword("   ");
    expect(await loginPage.isLoginEnabled()).toBe(false);

    // trimmed values should work for valid creds
    await loginPage.fillEmail("  valid_user@example.com  ");
    await loginPage.fillPassword("  validPass123  ");
    expect(await loginPage.isLoginEnabled()).toBe(true);

    await loginPage.clickLogin();
    // assert dashboard reached
    await loginPage.expectOnDashboard();
  });

  // Data-driven credential tests
  for (const row of creds as Array<any>) {
    test(`${row.label} -> should ${row.valid ? "succeed" : "fail"}`, async ({
      loginPage,
    }) => {
      await loginPage.fillEmail(row.email);
      await loginPage.fillPassword(row.password);

      // Determine expected button state based on visible validation
      const emailLooksValid = simpleEmailRegex.test(
        (row.email as string).trim()
      );
      const hasNonEmptyPassword = !!(row.password as string).trim();

      // The app disables login when email invalid or any field empty
      const shouldBeEnabled = emailLooksValid && hasNonEmptyPassword;
      expect(await loginPage.isLoginEnabled()).toBe(shouldBeEnabled);

      if (!shouldBeEnabled) {
        // If disabled, clicking would have no effect but we avoid clicking
        return;
      }

      await loginPage.clickLogin();

      if (row.valid) {
        // success path
        await loginPage.expectOnDashboard();
      } else {
        // failure path
        expect(await loginPage.genericErrorVisible()).toBe(true);
        // ensure still on login page
        await expect(loginPage.page).toHaveURL(/\/?$/);
      }
    });
  }
});
