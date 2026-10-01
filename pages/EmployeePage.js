const { expect } = require('@playwright/test');

class EmployeePage {

    constructor(page) {
        this.page = page;

        // Navigation
        this.pimLink = page.getByRole('link', { name: 'PIM' });

        // PIM
        this.addButton = page.getByRole('button', { name: 'Add' });

        // Employee form
        this.firstName = page.getByPlaceholder('First Name');
        this.lastName = page.getByPlaceholder('Last Name');

        // Search
        this.searchButton = page.getByRole('button', { name: 'Search' });

        // Save button for the personal-details form only
        this.saveButton = page
            .locator('form')
            .filter({ has: page.getByPlaceholder('Last Name') })
            .getByRole('button', { name: 'Save' })
            .first();
    }

    // =====================================================
    // OPEN PIM
    // =====================================================

    async openPIM() {
        await this.pimLink.click();

        await expect(
            this.page.locator('.oxd-table-filter')
        ).toBeVisible({
            timeout: 15000
        });

        await expect(this.addButton).toBeVisible({
            timeout: 15000
        });
    }

    // =====================================================
    // CREATE EMPLOYEE
    // =====================================================

    async createEmployee(employee) {

        await this.openPIM();

        await this.addButton.click();

        await expect(this.page).toHaveURL(
            /\/pim\/addEmployee/,
            {
                timeout: 15000
            }
        );

        await expect(this.firstName).toBeVisible({
            timeout: 15000
        });

        await this.firstName.fill(employee.firstName);
        await this.lastName.fill(employee.lastName);

        await expect(this.firstName).toHaveValue(
            employee.firstName
        );

        await expect(this.lastName).toHaveValue(
            employee.lastName
        );

        const saveButton = this.page
            .locator('form')
            .filter({ has: this.lastName })
            .getByRole('button', { name: 'Save' })
            .first();

        await expect(saveButton).toBeVisible({
            timeout: 15000
        });

        await saveButton.click();

        await expect(this.page).toHaveURL(
            /\/pim\/viewPersonalDetails\/empNumber\/\d+/,
            {
                timeout: 30000
            }
        );

        await expect(this.firstName).toHaveValue(
            employee.firstName,
            {
                timeout: 15000
            }
        );

        await expect(this.lastName).toHaveValue(
            employee.lastName,
            {
                timeout: 15000
            }
        );
    }

    // =====================================================
    // SEARCH EMPLOYEE
    // =====================================================

    async searchEmployee(employee) {

        await this.openPIM();

        const searchInputs = this.page.locator(
            '.oxd-table-filter input'
        );

        await expect(searchInputs.first()).toBeVisible({
            timeout: 15000
        });

        const employeeSearch = searchInputs.first();

        await employeeSearch.fill(
            `${employee.firstName} ${employee.lastName}`
        );

        await this.searchButton.click();

        await expect(
            this.page.getByText(
                employee.lastName,
                {
                    exact: true
                }
            )
        ).toBeVisible({
            timeout: 20000
        });
    }

    // =====================================================
    // OPEN EMPLOYEE
    // =====================================================

    async openEmployee(employee) {

        await this.searchEmployee(employee);

        const row = this.page
            .getByRole('row')
            .filter({
                hasText: employee.lastName
            })
            .first();

        await expect(row).toBeVisible({
            timeout: 15000
        });

        /*
         * Click the employee record.
         * OrangeHRM displays the employee name inside
         * the employee list row.
         */
        await row
            .getByText(employee.lastName, {
                exact: true
            })
            .click();

        await expect(this.page).toHaveURL(
            /\/pim\/viewPersonalDetails\/empNumber\/\d+/,
            {
                timeout: 20000
            }
        );

        await expect(this.lastName).toBeVisible({
            timeout: 15000
        });
    }

    // =====================================================
    // UPDATE EMPLOYEE
    // =====================================================

    async updateLastName(employee, newLastName) {

        // Open employee record
        await this.openEmployee(employee);

        // Wait for Last Name field
        await expect(this.lastName).toBeVisible({
            timeout: 15000
        });

        // Update last name
        await this.lastName.fill(newLastName);

        // Verify before save
        await expect(this.lastName).toHaveValue(
            newLastName
        );

        /*
         * Wait for OrangeHRM PUT API request.
         *
         * IMPORTANT:
         * Start waiting BEFORE clicking Save so that
         * Playwright does not miss the request.
         */
        const updateResponsePromise =
            this.page.waitForResponse(
                response =>
                    response.request().method() === 'PUT' &&
                    /\/api\/v2\/pim\/employees\/\d+/.test(
                        response.url()
                    )
            );

        // Save
        await this.saveButton.click();

        // Wait for API response
        const updateResponse =
            await updateResponsePromise;

        // Verify HTTP response
        expect(updateResponse.status()).toBe(200);

        // Verify success message
        await expect(
            this.page.getByText(
                /successfully updated/i
            )
        ).toBeVisible({
            timeout: 15000
        });

        // Verify API response status
expect(updateResponse.status()).toBe(200);

// Verify successful update notification
await expect(
    this.page.getByText(/successfully updated/i)
).toBeVisible({
    timeout: 15000
});

// Verify updated value in the UI
await expect(this.lastName).toHaveValue(
    newLastName,
    {
        timeout: 15000
    }
);
        await this.page.reload();

        // Final UI verification after reload
        await expect(this.lastName).toHaveValue(newLastName, {
            timeout: 20000
        });
    }

    // =====================================================
    // DELETE EMPLOYEE
    // =====================================================

    async deleteEmployee(employee) {

        await this.searchEmployee(employee);

        const row = this.page
            .getByRole('row')
            .filter({
                hasText: employee.lastName
            })
            .first();

        await expect(row).toBeVisible({
            timeout: 15000
        });

        const checkbox =
            row.getByRole('checkbox');

        await expect(checkbox).toBeVisible();

        await checkbox.check({
            force: true
        });

        const deleteButton =
            this.page.getByRole(
                'button',
                {
                    name: /delete/i
                }
            );

        await expect(deleteButton).toBeVisible();

        await deleteButton.click();

        const confirmButton =
            this.page.getByRole(
                'button',
                {
                    name: /yes, delete/i
                }
            );

        await expect(confirmButton).toBeVisible({
            timeout: 10000
        });

        await confirmButton.click();

        await expect(
            this.page.getByText(
                'Successfully Deleted',
                {
                    exact: false
                }
            )
        ).toBeVisible({
            timeout: 20000
        });
    }
}

module.exports = {
    EmployeePage
};