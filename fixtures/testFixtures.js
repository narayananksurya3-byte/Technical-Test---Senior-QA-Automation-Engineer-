const base = require('@playwright/test');
const { env } = require('../config/env');
const { EmployeeApi } = require('../api/EmployeeApi');
const { EmployeePage } = require('../pages/EmployeePage');
const { AdminUserPage } = require('../pages/AdminUserPage');
const { LoginPage } = require('../pages/LoginPage');
const { employeeData, userData } = require('../utils/testData');
const { ROUTES } = require('../config/constants');

const test = base.test.extend({
    workerStorageState: [async ({ browser }, use) => {
        const context = await browser.newContext({
            baseURL: env.baseUrl,
            storageState: { cookies: [], origins: [] },
        });
        try {
            await context.clearCookies();
            const page = await context.newPage();
            const loginPage = new LoginPage(page);
            await loginPage.open();
            await loginPage.login(env.username, env.password);
            await use(await context.storageState());
        } finally {
            await context.close();
        }
    }, { scope: 'worker' }],

    storageState: async ({ workerStorageState }, use) => {
        await use(workerStorageState);
    },

    loggedInPage: async ({ page }, use) => {
        await page.goto(ROUTES.dashboard, { waitUntil: 'commit' });
        await base.expect(page).toHaveURL(/dashboard/);
        await base.expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
        await use(page);
    },

    employeePage: async ({ loggedInPage }, use) => {
        const employeePage = new EmployeePage(loggedInPage);
        await use(employeePage);
    },

    employeeApi: async ({ loggedInPage }, use) => {
        await use(new EmployeeApi(loggedInPage.request));
    },

    adminUserPage: async ({ loggedInPage }, use) => {
        await use(new AdminUserPage(loggedInPage));
    },

    createdEmployee: async ({ employeeApi }, use) => {
        const data = employeeData();
        const created = await employeeApi.createEmployee({
            firstName: data.firstName,
            lastName: data.lastName,
        });

        const employeeId = created?.data?.empNumber;

        if (!employeeId) {
            throw new Error(`Employee creation did not return an employee number. Response: ${JSON.stringify(created)}`);
        }

        const lifecycle = { id: employeeId, ...data, deletedByTest: false };
        await use(lifecycle);

        if (!lifecycle.deletedByTest) {
            await employeeApi.deleteEmployee(lifecycle.id);
        }
    },

    createdEssUser: async ({ adminUserPage, createdEmployee }, use) => {
        const user = userData('ESS');
        await adminUserPage.createEssUser(createdEmployee, user);
        await use(user);
        await adminUserPage.deleteUser(user.username);
    },
});

module.exports = {
    test,
    expect: base.expect,
};