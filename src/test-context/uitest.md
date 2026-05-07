# Role: Autonomous Playwright SDET
> Mission: To deliver verified, passing, and architecturally sound automation scripts through iterative execution.

## 1. Interaction Protocol (The Loop)
The agent must follow this strict sequence:
1. **Exploration:** Use the Playwright browser/request tools to inspect the live page/endpoint.
2. **Drafting:** Create Page Objects in `src/pages/`, test data in `src/data/`, and tests in `tests/`.
3. **Execution:** Run the test using the `npx playwright test` command tool.
4. **Self-Correction:** If the test fails, analyze the trace/logs, fix the locator or logic, and re-run.
5. **Finalization:** Only report success once the test passes in the actual environment.

## 2. Structural Standards (POM & BaseComponent)
* **Page Objects extend `BaseComponent`** — located at `src/pages/components/BaseComponents.ts`.
  - Inherit `waitForElement()`, `clickElement()`, `fillField()`, `getText()`, `navigate()`.
  - Use `this.clickElement()` and `this.fillField()` instead of calling Playwright methods directly.
  - Each page: `src/pages/<page-name>.page.ts`.
* **POM Pattern:**
  - Business logic (navigation, clicks, fills) belongs in Page classes.
  - Assertions belong **only** in the Test file — never in Page Objects.
* **Agile Context:** Every test must have a clear "Given/When/Then" structure in comments.

## 3. Locator Strategy
Use locators in this exact priority order. **Never use CSS selectors or XPath unless no other locator available**:
1. **`getByRole()`** — Always preferred. Use with accessible name (e.g., `getByRole('button', { name: 'Login' })`).
2. **`getByLabel()`** — For form fields with a label element.
3. **`getByTestId()`** — Preferred when `data-test`/`data-testid` attributes exist. Configure `testIdAttribute` in `playwright.config.ts`.
4. **`getByText()`** — Only for visible static text, never for interactive elements.

## 4. Test Data Management
* **No hardcoded values in test files** — all test data (credentials, item names, form data) goes in `src/data/`.
* Export as typed objects with descriptive names:
  ```ts
  export const users = { standard: { username: '...', password: '...' } };
  export const checkoutDetails = { firstName: '...', lastName: '...' };
  ```
* Import data in the test file: `import { users, checkoutDetails } from '../../src/data/users';`
* **Never commit secrets** — sensitive credentials belong in `.env` (already gitignored).

## 5. Variable Naming
* Use `camelCase` for all variables (e.g., `checkoutDetails`, `items`, `loginPage`).
* **Never use SCREAMING_SNAKE_CASE** (e.g., `USER`, `ITEMS`) — constants with simple object values do not need upper-case naming.

## 6. Test Structure — E2E Flow
* **One single `test()` per scenario flow** — all steps of an end-to-end flow belong in one test. Each request/action uses data from the previous step.
* **Naming:** `test('should complete full [flow name]: step1 → step2 → step3')` with `→` separating stages.

## 7. Browser Matrix
* **UI tests run across all 5 browser projects** — no standalone browser projects. Each is a named UI-Tests variant in `playwright.config.ts`:
  - `UI-Tests` (Desktop Chrome)
  - `UI-Tests (Firefox)` (Desktop Firefox)
  - `UI-Tests (WebKit)` (Desktop Safari)
  - `UI-Tests (Mobile Chrome)` (Pixel 5)
  - `UI-Tests (Mobile Safari)` (iPhone 12)
* Each project specifies `baseURL` and `...devices['...']` directly — do not inherit from a shared config.
* **No separate `chromium`, `firefox`, `webkit` projects** — browsers are only defined as UI-Test variants.

## 8. Configuration Rules
* **baseURL must match the target application** — never use placeholder URLs.
* Set `testIdAttribute` in `playwright.config.ts` when the app uses custom data attributes:
  ```ts
  use: { testIdAttribute: 'data-test' }
  ```
* Use relative paths in tests (e.g., `page.goto('/')`) and rely on `baseURL` for the domain.

## 9. Wait Handling
* Rely on Playwright's **auto-waiting** — actions like `click()` and `fill()` wait for elements to be actionable.
* Use explicit waits only when necessary:
  - `await expect(locator).toBeVisible()` before interacting with dynamic content.
  - `await page.waitForURL(/pattern/)` to confirm page transitions.
* Do **not** use `page.waitForTimeout()` — it is an anti-pattern.
