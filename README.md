# Restful Booker API & Sauce Demo UI Automation

Parallel test automation framework using Playwright. Tests UI (Sauce Demo) and API (Restful Booker) with Allure reporting and GitHub Actions CI/CD integration.

## Prerequisites

Node.js 16+ from https://nodejs.org/

npm (included with Node.js)

Git

## Installation

1. Clone the repository
```bash
git clone git@github.com:axl611/restful-booker-sauce-demo-UI-API-automation.git
cd restful-booker-sauce-demo-UI-API-automation
```

2. Install dependencies
```bash
npm ci
```

3. Install Playwright browsers
```bash
npx playwright install --with-deps
```


## Running Tests

**Local Development (with browser report)**

```bash
npm run test:ui          # UI tests only
npm run test:api         # API tests only
npm run report           # Both suites + Allure report
```

**CI/GitHub Actions (headless)**

```bash
npm run ci:test:ui       # UI tests + report
npm run ci:test:api      # API tests + report
```

**Test Coverage**

UI tests run on: Chrome, Firefox, WebKit (Safari), Pixel 5 (mobile), iPhone 12 (mobile)

API tests run against: https://restful-booker.herokuapp.com


## How It Works

**Test Organization**

Tests are split into two folders:
- `tests/ui/` - Runs against https://www.saucedemo.com
- `tests/api/` - Runs against https://restful-booker.herokuapp.com

File naming: `test-name.ui.spec.ts` or `test-name.api.spec.ts`

**Parallel Execution**

UI and API tests run simultaneously in CI. If UI takes 20 minutes and API takes 5 minutes, total pipeline time is 20 minutes (not 25). This reduces developer feedback time significantly.

**Element Selection (Playwright Best Practices)**

Tests use getBy methods for resilient, maintainable selectors:
- `getByRole()` - buttons, links, form fields
- `getByLabel()` - labeled inputs
- `getByPlaceholder()` - placeholder text
- `getByText()` - visible text
- `getByTestId()` - data-test attributes

Avoids CSS/XPath selectors and aligns with ISTQB maintainability standards.

**Allure Reports**

Every test run generates reports with:
- Test duration & timeline
- Pass/fail counts with screenshots/videos
- Grouped results by feature
- Historical trends

Local: `npm run allure:open` to view report in browser

CI: Reports uploaded as artifacts to GitHub Actions

**GitHub Actions Workflow**

File: `.github/workflows/test.yml`

- Runs on push and pull requests
- Separate parallel jobs for UI (30 min timeout) and API (15 min timeout)
- Artifacts uploaded for 30 days
- Handles browser installation and dependency management


**Manual QA Bug Report (Simulated Jira Ticket)**
Title
○ Description: User can't remove an item from cart after adding it

○ Steps to Reproduce:
- Precondition: Logged in with user: 'problem_user'
1. Navigate to /inventory.html
2. Click "Add to Cart" button located in "Sauce Labs Backpack" item
3. Click "Remove" button under the same item

○ Expected Results:
User should be able to remove any item added from the inventory page

○ Actual Results:
When user adds any item then attempts to remove it from cart, the button doesn't action and there's a *Failed to load resource: the server responded with a status of 401 (Unauthorized)* in the console log

○ Severity:
High
