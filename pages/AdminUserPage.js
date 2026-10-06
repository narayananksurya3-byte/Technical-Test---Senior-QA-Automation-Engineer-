const { expect } = require('@playwright/test');
const { ROUTES } = require('../config/constants');

class AdminUserPage {
    constructor(page) {
        this.page = page;
        this.addButton = page.getByRole('button', { name: 'Add' });
        this.selects = page.locator('.oxd-select-text');
        this.employeeInput = page.getByPlaceholder('Type for hints...');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.searchButton = page.getByRole('button', { name: 'Search' });
    }

    async createEssUser(employee, user) {
        await this.page.goto(ROUTES.adminUsers, { waitUntil: 'commit' });
        await this.addButton.click();

        await this.selects.nth(0).click();
        await this.page.getByRole('option', { name: user.role, exact: true }).click();

        await this.employeeInput.fill(`${employee.firstName} ${employee.lastName}`);
        const employeeOption = this.page.getByRole('option').filter({ hasText: employee.lastName });
        await expect(employeeOption).toBeVisible();
        await employeeOption.click();

        await this.selects.nth(1).click();
        await this.page.getByRole('option', { name: 'Enabled', exact: true }).click();

        await this.page.locator('.oxd-input-group').filter({ hasText: /^Username$/ }).locator('input').fill(user.username);
        await this.page.locator('.oxd-input-group').filter({ hasText: /^Password$/ }).locator('input').fill(user.password);
        await this.page.locator('.oxd-input-group').filter({ hasText: /^Confirm Password$/ }).locator('input').fill(user.password);
        await this.saveButton.click();

        await expect(this.page).toHaveURL(/\/admin\/viewSystemUsers/);
        await expect(this.page.getByText(user.username, { exact: true })).toBeVisible();
    }

    async deleteUser(username) {
        await this.page.goto(ROUTES.adminUsers, { waitUntil: 'commit' });
        const usernameFilter = this.page.locator('.oxd-table-filter input').first();
        await usernameFilter.fill(username);
        await this.searchButton.click();

        const row = this.page.getByRole('row').filter({ hasText: username });
        await expect(row).toBeVisible();
        const acceptNativeConfirm = (dialog) => dialog.accept();
        this.page.once('dialog', acceptNativeConfirm);
        await row.locator('button').first().click();

        const confirmButton = this.page.getByRole('button', { name: /yes, delete/i });
        if (await confirmButton.isVisible()) {
            this.page.removeListener('dialog', acceptNativeConfirm);
            await confirmButton.click();
        }
        await expect(this.page.getByText('Successfully Deleted', { exact: false })).toBeVisible();
        this.page.removeListener('dialog', acceptNativeConfirm);
    }
}

module.exports = {
    AdminUserPage,
};
