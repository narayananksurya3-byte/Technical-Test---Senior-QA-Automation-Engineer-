const { defineConfig, devices } = require('@playwright/test');
const { validateEnv } = require('./config/env');

require('dotenv').config();
validateEnv();

module.exports = defineConfig({

    testDir: './tests',

    timeout: 60 * 1000,

    expect: {
        timeout: 10 * 1000
    },

    fullyParallel: true,

    forbidOnly: !!process.env.CI,

    retries: process.env.CI ? 2 : 1,

    workers: process.env.CI ? 4 : undefined,

    reporter: [
        ['list'],
        [
            'html',
            {
                outputFolder: 'playwright-report',
                open: 'never'
            }
        ]
    ],

    use: {

        baseURL: process.env.BASE_URL,

        headless: true,

        screenshot: 'only-on-failure',

        video: 'retain-on-failure',

        trace: 'retain-on-failure',

        actionTimeout: 15 * 1000,

        navigationTimeout: 30 * 1000,

        ignoreHTTPSErrors: true
    },

    projects: [

        {
            name: 'chromium',

            use: {
                ...devices['Desktop Chrome']
            }
        }

    ]

});