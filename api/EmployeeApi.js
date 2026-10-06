const { env } = require('../config/env');
const { ROUTES } = require('../config/constants');

class EmployeeApi {
    constructor(request) {
        this.request = request;
        this.baseURL = env.apiUrl;
    }

    async createEmployee(data) {
        const response = await this.request.post(
            `${this.baseURL}${ROUTES.employeeCollection}`,
            { data }
        );

        if (!response.ok()) {
            throw new Error(`Create employee failed: ${response.status()} ${await response.text()}`);
        }

        return response.json();
    }

    async getEmployee(id) {
        const response = await this.request.get(
            `${this.baseURL}${ROUTES.employee(id)}`
        );

        if (response.status() === 404) {
            return null;
        }

        if (response.status() === 422) {
            const body = await response.json();
            if (body?.error?.data?.invalidParamKeys?.includes('empNumber')) {
                return null;
            }
            throw new Error(`Get employee ${id} failed: ${response.status()} ${JSON.stringify(body)}`);
        }

        if (!response.ok()) {
            throw new Error(`Get employee ${id} failed: ${response.status()} ${await response.text()}`);
        }

        return response.json();
    }

    async updateEmployee(id, data) {
        const response = await this.request.put(
            `${this.baseURL}${ROUTES.employee(id)}`,
            { data }
        );

        if (!response.ok()) {
            throw new Error(`Update employee ${id} failed: ${response.status()} ${await response.text()}`);
        }

        return response.json();
    }

    async deleteEmployee(employeeNumber) {
        const response = await this.request.delete(
            `${this.baseURL}${ROUTES.employeeCollection}`,
            {
                data: {
                    ids: [Number(employeeNumber)],
                },
            }
        );

        if (![200, 204].includes(response.status())) {
            throw new Error(`Delete employee ${employeeNumber} failed: ${response.status()} ${await response.text()}`);
        }

        return response;
    }
}

module.exports = {
    EmployeeApi,
};