# Flaky Test Strategy

## Goal
Reduce intermittent failures and keep the automation suite reliable in local execution and CI.

## Detection
A test is considered flaky when it:

- passes locally and fails in CI
- fails only on rerun
- depends on timing or animation state
- is sensitive to stale data or environmental race conditions

## Mitigation practices

1. Prefer resilient selectors
   - use role-based locators (`getByRole`) and accessible names where possible
   - avoid brittle CSS selectors unless essential

2. Use explicit waits
   - wait for URL transitions, field visibility, and expected DOM state
   - avoid hardcoded sleeps

3. Isolate test data
   - generate unique values for each run
   - avoid shared data between tests

4. Keep setup and teardown reliable
   - use fixtures for login and employee creation
   - clean up created records in teardown paths

5. Validate real state
   - confirm the UI or API reflects the intended action before proceeding

6. Keep tests small and focused
   - split full lifecycle tests into clear functional checks
   - reduce shared state between specs

7. Review CI failure patterns
   - rerun failing tests multiple times
   - analyze screenshots, traces, and videos to identify timing issues

8. Tag and classify failure types
   - `@smoke` for critical checks
   - `@regression` for broader coverage
   - `@role` for permission-based validation

## Practical rule
Whenever a test fails intermittently, the first step is to inspect the trace and identify whether the issue is caused by:

- stale selectors
- missing wait conditions
- network timing
- shared state or incomplete cleanup

## Outcome
A flaky test strategy should reduce false negatives, improve CI confidence, and make the framework easier to scale as the suite grows.
