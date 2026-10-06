# OrangeHRM Playwright Automation

This project is a Playwright-based automation suite for OrangeHRM that validates the employee lifecycle, role access, and basic API-driven checks. It combines UI automation, reusable page objects, environment-based configuration, and CI execution.

## Objectives covered

- End-to-end employee lifecycle automation
- Authentication and login validation
- Employee creation, update, and deletion flows
- Role-based validation
- API-level verification around employee updates
- CI pipeline integration with test artifacts
- HTML reporting, screenshots, and videos on failure
- k6 performance checks for login and employee creation
- Tag-based test organization
- Environment-based configuration

## Project structure

- `tests/` - Playwright specs organized by functional area
- `pages/` - Page Object Model classes
- `fixtures/` - Shared Playwright fixtures for authenticated users and generated employees
- `config/` - Environment and config helpers
- `utils/` - Utility functions such as test data generation
- `api/` - API helper code
- `k6/` - Performance scripts
- `.github/workflows/` - GitHub Actions CI pipeline
- `playwright-report/` - HTML Playwright report output
- `test-results/` - Test artifacts including screenshots, traces, and videos

## Setup

1. Install Node.js 20.19+
2. Install dependencies:

```bash
npm install
```

3. Create a local environment file from `.env.example` if needed:

```bash
cp .env.example .env
```

4. Add your OrangeHRM credentials in `.env`:

```env
BASE_URL=https://opensource-demo.orangehrmlive.com
APP_USERNAME=Admin
APP_PASSWORD=admin123
TEST_ENV=demo
```

5. Install browsers:

```bash
npx playwright install --with-deps chromium
```

## Running tests

Run the full suite:

```bash
npx playwright test
```

Run a specific spec:

```bash
npx playwright test tests/employee-create.spec.js
```

Run with HTML report:

```bash
npx playwright test --reporter=list,html
```

Run only tagged tests:

```bash
npx playwright test --grep "@smoke"
```

Run API tests or repeat smoke tests to detect flakes:

```bash
npm run test:api
npm run test:flaky
```

Lint the JavaScript project:

```bash
npm run lint
```

`TEST_ENV` supports `qa`, `demo`, and `stage`. `qa` and `demo` use `BASE_URL`,
`APP_USERNAME`, and `APP_PASSWORD`. `stage` uses `STAGE_BASE_URL` and the
optional `STAGE_APP_USERNAME` / `STAGE_APP_PASSWORD` overrides (falling back
to the common credentials when omitted). The `API_URL` override is optional.
The staging variables are also available in `.env.example`.

The role-validation test creates an employee and an ESS user, checks that the
restricted user cannot access PIM, then deletes the user and employee through
the suite teardown. Admin authentication is initialized once per worker and
reused through Playwright `storageState`; tests still receive isolated browser
contexts.

## CI/CD pipeline

GitHub Actions is configured in `.github/workflows/playwright.yml`.

The pipeline performs the following:

- installs dependencies
- installs Playwright browsers
- runs test execution
- produces Playwright blob reports per shard and merges them into one HTML report
- repeats smoke tests three times without retries to expose intermittent failures
- uploads screenshots, traces, and videos as artifacts
- uses environment secrets for credentials

## Design decisions

### Page Object Model
The page layer keeps UI actions and validation logic out of the test cases. This improves readability and reduces duplication across the suite.

### Fixtures for setup and teardown
The test fixture layer creates a logged-in session and generates employee data, providing reusable setup across tests.

### Environment-based configuration
Environment variables are used for credentials and runtime settings instead of hardcoded values. This keeps the framework portable across local and CI execution.

### Smart waiting and retry logic
The suite uses Playwright's built-in waiting and assertions rather than explicit sleep calls. CI execution also includes retry behavior for flaky network or UI timing issues.

### Reporting and observability
The Playwright config captures:

- HTML reports
- screenshots on failure
- videos on failure
- traces on failure

This makes debugging faster and more reliable.

## Test stability and flaky test strategy

### Flaky test detection
Flaky tests are identified by:

- repeated failures across reruns
- intermittent timing issues
- selector instability
- inconsistent UI state after actions

### Flaky test mitigation
Recommended mitigations include:

- use role- and text-based locators over brittle selectors
- assert on stable UI state before interacting
- prefer explicit waits and toHaveURL / toBeVisible assertions
- maintain idempotent test data
- isolate setup and cleanup in fixtures
- rerun failed test groups in CI and review patterns

More details: see `docs/flaky-test-strategy.md`.

## Performance testing with k6

The `k6/` folder contains performance tests that authenticate with the OrangeHRM
CSRF token, validate successful responses, and clean up created employees.

Run a k6 script:

```bash
k6 run k6/login.js
k6 run k6/employee-create.js
```

Thresholds are defined in the scripts to validate acceptable performance for key actions.

## Reporting and observability checklist

- HTML reports: enabled
- Screenshots on failure: enabled
- Videos on failure: enabled
- Traces on failure: enabled
- Tagging strategy: supported via `@smoke`, `@regression`, `@role`
- Environment-based execution: supported via `.env`

## Deliverable summary

This project satisfies the requested automation goals in the following areas:

- end-to-end employee lifecycle
- POM-based structure
- environment configuration
- CI pipeline integration
- performance testing
- reporting and artifacts
- test tagging and execution controls

## Notes

The framework is structured to scale and can be extended with additional modules, data providers, API validation helpers, and broader role-based coverage.
