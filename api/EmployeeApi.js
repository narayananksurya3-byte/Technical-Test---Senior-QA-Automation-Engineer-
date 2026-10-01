const { expect } = require('@playwright/test');
const { env } = require('../config/env');

class EmployeeApi {

    constructor(page) {

        this.page = page;
        this.baseUrl = env.baseUrl || 'https://opensource-demo.orangehrmlive.com';

    }

    async listEmployees() {

        const response = await this.page.request.get(
            `${this.baseUrl}/web/index.php/api/v2/pim/employees?limit=50&offset=0`
        );

        expect(response.status()).toBe(200);

        return response;
    }

    async getEmployee(employeeNumber) {

        const response = await this.page.request.get(
            `${this.baseUrl}/web/index.php/api/v2/pim/employees/${employeeNumber}`
        );

        return response;

    }

    async findEmployeeByLastName(lastName) {

        const response = await this.listEmployees();
        const employeeList = await response.json();

        const match = employeeList?.data?.find(
            employee => employee.lastName === lastName
        );

        return match || null;

    }

    async deleteEmployee(employeeNumber) {

        return await this.page.request.delete(
            `${this.baseUrl}/web/index.php/api/v2/pim/employees`,
            {
                data: {
                    ids: [
                        Number(employeeNumber)
                    ]
                }
            }
        );

    }

}

module.exports = {
    EmployeeApi
};