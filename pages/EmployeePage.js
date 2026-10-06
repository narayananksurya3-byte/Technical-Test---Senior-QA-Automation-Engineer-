const { expect } = require('@playwright/test');
const { ROUTES } = require('../config/constants');

class EmployeePage {
    constructor(page) {
        this.page = page;
        this.pimLink = page.getByRole('link', { name: 'PIM' });
        this.addButton = page.getByRole('button', { name: 'Add' });
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.employeeSearchInput = page.locator('.oxd-table-filter input').first();
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.employeeForm = page.locator('form').filter({ has: this.lastNameInput });
        this.saveButton = this.employeeForm.getByRole('button', { name: 'Save' });
        this.successToast = page.getByText(/successfully/i);
    }

    async openPIM() {
        await this.pimLink.click();
        await expect(this.page.locator('.oxd-table-filter')).toBeVisible();
        await expect(this.addButton).toBeVisible();
    }

    async createEmployee(employee) {
        await this.openPIM();
        await this.addButton.click();
        await expect(this.page).toHaveURL(ROUTES.employeeAddPattern);
        await expect(this.firstNameInput).toBeVisible();

        await this.firstNameInput.fill(employee.firstName);
        await this.lastNameInput.fill(employee.lastName);
        await expect(this.firstNameInput).toHaveValue(employee.firstName);
        await expect(this.lastNameInput).toHaveValue(employee.lastName);
        await this.saveButton.click();

        await expect(this.page).toHaveURL(ROUTES.employeeDetailsPattern);
        await expect(this.firstNameInput).toHaveValue(employee.firstName);
        await expect(this.lastNameInput).toHaveValue(employee.lastName);
    }

    async searchEmployee(employee) {
        await this.openPIM();
        const searchTerm = `${employee.firstName} ${employee.lastName}`;
        await expect(this.employeeSearchInput).toBeVisible();
        await this.employeeSearchInput.fill(searchTerm);
        await this.searchButton.click();

        const row = this.page.getByRole('row').filter({ hasText: employee.lastName });
        await expect(row).toBeVisible();
        return row;
    }

    async openEmployee(employee) {
        const row = await this.searchEmployee(employee);
        await row.getByText(employee.lastName, { exact: true }).click();
        await expect(this.page).toHaveURL(ROUTES.employeeDetailsPattern);
        await expect(this.lastNameInput).toBeVisible();
    }

    async openEmployeeById(id, expectedLastName) {
        await this.page.goto(ROUTES.employeeDetails(id), { waitUntil: 'commit' });
        if (expectedLastName) {
            await expect(this.lastNameInput).toHaveValue(expectedLastName);
        } else {
            await expect(this.lastNameInput).toBeVisible();
        }
    }

    async updateLastName(employeeOrId, newLastName) {
        if (typeof employeeOrId === 'number' || typeof employeeOrId === 'string') {
            await this.openEmployeeById(employeeOrId);
        } else if (employeeOrId.id) {
            await this.openEmployeeById(employeeOrId.id, employeeOrId.lastName);
        } else {
            await this.openEmployee(employeeOrId);
        }

        await this.lastNameInput.fill(newLastName);
        await expect(this.lastNameInput).toHaveValue(newLastName);
        const responsePromise = this.page.waitForResponse((response) =>
            response.request().method() === 'PUT' &&
            ROUTES.employeePersonalDetailsUpdatePattern.test(response.url())
        );
        await this.saveButton.click();

        const response = await responsePromise;
        expect(response.ok()).toBeTruthy();
        await expect(this.successToast).toBeVisible();
        await expect(this.lastNameInput).toHaveValue(newLastName);

        await this.page.reload();
        await expect(this.lastNameInput).toHaveValue(newLastName);
    }

    async deleteEmployee(employee) {
        const row = await this.searchEmployee(employee);
        const acceptNativeConfirm = (dialog) => dialog.accept();
        this.page.once('dialog', acceptNativeConfirm);
        const deleteResponsePromise = this.page.waitForResponse((response) =>
            response.request().method() === 'DELETE' &&
            response.url().endsWith(ROUTES.employeeCollection)
        );
        await row.locator('button').last().click();

        const confirmButton = this.page.getByRole('button', { name: /yes, delete/i });
        if (await confirmButton.isVisible()) {
            this.page.removeListener('dialog', acceptNativeConfirm);
            await confirmButton.click();
        }
        const deleteResponse = await deleteResponsePromise;
        expect(deleteResponse.ok()).toBeTruthy();
        await expect(this.page.getByText('Successfully Deleted', { exact: false })).toBeVisible();
        this.page.removeListener('dialog', acceptNativeConfirm);
    }
}

module.exports = {
    EmployeePage,
};
