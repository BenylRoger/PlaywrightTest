# QA Automation Assessment - Playwright + TypeScript

## Goal
Build a production-quality **Playwright test suite** for a web login screen using the **Page Object Model (POM)**.  
The suite should be **readable**, **maintainable**, and **CI-friendly**.

## What We Provide

A testable **login page - http://127.0.0.1:5173/**, with:

- **Email field** (with email format validation)
- **Password field**
- **"Log in" button**

### Test Users
- valid : `valid_user@example.com` / `validPass123`
- invalid : any email / any password

## Requirements

### 1. Architecture
- Implement **Page Object Model (POM)**; no raw selectors in tests.  
- Provide **reusable fixtures**.


### 2. Coverage
- **Positive case:** Successful login redirects to the expected post-login page; session is established.  
- **Negative cases:** Invalid credentials show a generic error (no user/pass enumeration); login remains blocked.  
- **Email validation:** Email field validates format (must contain @ symbol and valid domain structure) in real-time; shows "Invalid email" error message when invalid email is entered; login button is disabled for invalid email formats.  
- **Button disabled state:** "Log in" button is disabled when email or password is empty, or when email format is invalid; enabled only when both have valid values (valid email format + password).  
- **Whitespace trimming:** Leading and trailing spaces in email and password inputs are trimmed immediately when the field loses focus (on blur); trimmed values are used for validation and credential comparison; whitespace-only inputs are treated as empty and cannot bypass validation.  
- **Data-driven approach:** Drive tests with arrays/CSV/JSON for multiple credential rows (valid + invalid permutations).

### 3. Tooling & Artifacts
- Enable **Playwright HTML report** and **trace viewer** (at least on retry or on failure).  
- Capture **screenshots** and **videos** on failure.  
- Add npm scripts:
  - `test`
  - `test:headed`
  - `test:report`
  - `test:trace`

---

## Setup
```bash
pnpm install
pnpm exec playwright install
```

## Run the Sample UI
Before running the automated tests you can launch the local React UI in a separate terminal:
```bash
pnpm dev
```
This starts Vite at http://127.0.0.1:5173 so you can manually verify the login flow. Leave it running while you explore.

## Run Tests
```bash
pnpm test
```
Playwright will spin up the same dev server automatically when the tests execute.

## Visual Debugging
- Run tests in interactive UI:
  ```bash
  pnpm run test:ui
  ```

- Open HTML report after execution:
  ```bash
  pnpm exec playwright show-report
  ```

- View trace file:
  ```bash
  pnpm exec playwright show-trace trace.zip
  ```

