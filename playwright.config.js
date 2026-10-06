const { defineConfig, devices } = require('@playwright/test');
const { getConfig } = require('./config/environments');
const { TIMEOUTS } = require('./config/constants');

const config = getConfig();

module.exports = defineConfig({
    testDir: './tests',
    fullyParallel: true,
    timeout: TIMEOUTS.test,
    expect: {
        timeout: TIMEOUTS.expect,
    },
    use: {
        baseURL: config.baseURL,
        actionTimeout: TIMEOUTS.action,
        navigationTimeout: TIMEOUTS.navigation,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
    },
    reporter: [
        ['line'],
        ['blob', { outputDir: 'blob-report' }],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ],
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 4 : undefined,
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
    ],
});