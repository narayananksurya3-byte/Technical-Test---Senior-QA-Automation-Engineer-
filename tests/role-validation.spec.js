const { test, expect } = require('../fixtures/testFixtures');
const { LoginPage } = require('../pages/LoginPage');
const { ROUTES, TIMEOUTS } = require('../config/constants');

test.describe.configure({ timeout: TIMEOUTS.roleLifecycle });

test('Admin can access the PIM module @role @regression', async ({ loggedInPage }) => {
    const pimLink = loggedInPage.getByRole('link', { name: 'PIM' });
    await expect(pimLink).toBeVisible();
    await pimLink.click();
    await expect(loggedInPage).toHaveURL(/pim/);
    await expect(loggedInPage.locator('.oxd-table-filter')).toBeVisible();
});

test('ESS user is created with a restricted role and denied PIM access @role @regression', async ({
    browser,
    createdEssUser,
}) => {
    const { env } = require('../config/env');
    const context = await browser.newContext({
        baseURL: env.baseUrl,
        storageState: { cookies: [], origins: [] },
    });
    await context.clearCookies();
    const essPage = await context.newPage();

    try {
        const loginPage = new LoginPage(essPage);
        await loginPage.open();
        await loginPage.login(createdEssUser.username, createdEssUser.password);

        await expect(essPage.getByRole('link', { name: 'PIM' })).toHaveCount(0);
        await essPage.goto(ROUTES.employeeList, { waitUntil: 'commit' });
        await expect(essPage.getByRole('button', { name: 'Add' })).toHaveCount(0);
        await expect(essPage.locator('.oxd-table-filter')).toHaveCount(0);
    } finally {
        await context.close();
    }
});
