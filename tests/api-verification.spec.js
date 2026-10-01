const {
    test,
    expect
} = require('../fixtures/testFixtures');

const {
    EmployeeApi
} = require('../api/EmployeeApi');


test(
    'Employee should be available through API @api @regression',
    async ({
        employeePage,
        createdEmployee
    }) => {

        const api =
            new EmployeeApi(
                employeePage.page
            );

        await employeePage.searchEmployee(
            createdEmployee
        );

        await expect(
            employeePage.page.getByText(
                createdEmployee.lastName,
                {
                    exact: true
                }
            )
        ).toBeVisible();

        const employeeFromApi =
            await api.findEmployeeByLastName(
                createdEmployee.lastName
            );

        expect(employeeFromApi).not.toBeNull();
        expect(employeeFromApi.lastName).toBe(
            createdEmployee.lastName
        );

        console.log(
            `Employee ${createdEmployee.lastName} verified via API.`
        );

    }
);